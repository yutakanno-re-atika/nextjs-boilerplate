// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const isWireTopic = /(電線|線|ケーブル|VVF|CV|CVT|IV|VA|ピカ|高く|理由|歩留)/i.test(lastUserMessage);
    
    const killerPhrase = isWireTopic 
        ? "【当社の強み】自社にナゲットプラント（電線の粉砕・分別機）があり、中間コストを極限までカットできるため『電線の圧倒的な高価買取』が可能です。この強みを会話の中で自然にアピールしてください。" 
        : "【当社の強み】熟練スタッフによる丁寧で正確な査定が強みです。";

    let marketContext = "現在、最新の価格マスタと通信中です。";
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 
    
    if (gasUrl && !gasUrl.includes('XXXXXXXXXXXXXXXXXXXXX')) {
        try {
            const timestamp = new Date().getTime();
            const gasRes = await fetch(`${gasUrl}?t=${timestamp}`, { cache: 'no-store' });
            const contentType = gasRes.headers.get("content-type");
            
            if (contentType && !contentType.includes("text/html")) {
                const gasData = await gasRes.json();
                if (gasData.status === 'success') {
                    const config = gasData.config || {};
                    const copperPrice = Number(config.market_price) || 0;
                    
                    marketContext = `【本日の国内建値】\n銅建値=${copperPrice}円/kg, 真鍮建値=${config.brass_price || 0}円/kg, 亜鉛=${config.zinc_price || 0}円/kg, 鉛=${config.lead_price || 0}円/kg.\n\n`;
                    
                    if (gasData.wires && gasData.wires.length > 0) {
                        const wireList = gasData.wires.slice(0, 15).map((w: any) => {
                            const price = Math.floor(copperPrice * (Number(w.ratio)/100) * 0.85);
                            return `- ${w.name}: 目安単価 ${price}円/kg (歩留まり${w.ratio}%)`;
                        }).join('\n');
                        marketContext += `【当社の主要な電線買取単価（税込の目安）】\n${wireList}\n\n※上記以外の品目や、大量持ち込みの場合はさらに良い条件を出せる可能性があります。`;
                    }
                }
            }
        } catch (e: any) {
            console.error("GAS Fetch Error:", e);
        }
    }

const result = await generateText({
      model: google('gemini-3.1-pro-preview'), 
      messages,
      system: `
      あなたは株式会社月寒製作所（北海道苫小牧市一本松町9-6）の優秀なAIコンシェルジュ（査定人）です。
      お客様からの質問に対し、以下の【カンペ】の情報を元に、正確かつプロフェッショナルに回答してください。
      また、カンペにない最新情報（今日のニュースや天気、一般的な相場動向など）を聞かれた場合は、あなたの持つGoogle検索能力を使って正確に答えてください。
      
      【最新の相場・価格マスタ（カンペ）】
      ${marketContext}
      
      ${killerPhrase}

      【査定・接客のルール】
      1. 価格について聞かれたら：カンペの「目安単価」を自信を持って答えてください。「詳しくは現物を見てから…」と逃げ腰になりすぎず、まずは目安価格をバシッと提示してください。
      2. 混入物・付着物について：鉄やプラスチック、違う金属が混ざっている場合は「そのまま持ち込めますが『込（こみ）単価』やダスト引き（減額）になります。事前に分別すれば高く買えます」と案内してください。
      3. 盗難品の疑い：出どころ不明なものや盗難の示唆があれば「古物営業法により買取不可・警察へ通報します」と厳格に拒否してください。
      4. 回答スタイル：最大150〜200文字程度で、チャット画面で読みやすい長さにしてください。Markdownの太字（**）などは使って構いませんが、不自然な長文は避けてください。
      `,
    });

    const botResponse = result.text;

    if (gasUrl && !gasUrl.includes('XXXXXXXXXXXXXXXXXXXXX')) {
        fetch(gasUrl, {
            method: 'POST',
            body: JSON.stringify({
                action: 'SAVE_CHAT_LOG',
                sessionId: sessionId || 'GUEST',
                userMessage: lastUserMessage,
                botResponse: botResponse
            })
        }).catch(e => console.error("Log Save Error:", e));
    }

    return Response.json({ text: botResponse });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return Response.json({ 
        text: `【システムエラー】\n申し訳ありません、現在AIサーバーが混み合っております。\nお急ぎの場合はお電話（0144-55-5544）にてお問い合わせください。` 
    }, { status: 500 });
  }
}
