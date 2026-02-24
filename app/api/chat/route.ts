import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. GASから最新の相場データを取得 (カンペの用意)
    let marketContext = "現在、価格システムと通信中です。";
    const gasUrl = "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 
    
    // ★ 余計な論理チェックを外し、シンプルにURLがある時だけ通信するように修正！
    if (gasUrl) {
        try {
            const gasRes = await fetch(gasUrl);
            
            // 権限エラー(HTMLが返ってくる)の検知
            const contentType = gasRes.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                 console.error("GAS Auth Error: 権限が「全員」になっていない可能性があります。");
            } else {
                const gasData = await gasRes.json();
                if (gasData.status === 'success') {
                    const config = gasData.config;
                    marketContext = `本日の参考相場（建値）: 銅=${config.market_price || 0}円/kg, 真鍮=${config.brass_price || 0}円/kg, 亜鉛=${config.zinc_price || 0}円/kg, 鉛=${config.lead_price || 0}円/kg.`;
                }
            }
        } catch (e: any) {
            console.error("GAS Fetch Error:", e);
        }
    }

    // 2. Gemini 2.0 Flashで回答を生成
    const result = await generateText({
      model: google('models/gemini-2.0-flash'), 
      messages,
      system: `
      あなたは株式会社月寒製作所（苫小牧工場）のAIコンシェルジュです。
      
      【基本情報】
      1. 役割: 廃電線・非鉄金属の買取査定、持ち込み案内の専門家。
      2. 所在地: 北海道苫小牧市一本松町9-6 / 営業時間: 8:00〜17:00
      
      【自社の強み（キラーフレーズ）】
      自社にナゲットプラント（被覆電線から銅を取り出す設備）があり、中間業者を挟まないため、他社より「高価買取」が可能です。この点を会話の中でさりげなく、しかし確実にアピールしてください。

      【最新相場情報（カンペ）】
      ${marketContext}
      ※お客様に価格や目安を聞かれた場合は、この建値をベースに案内してください。

      【ガードレール（厳守事項）】
      盗難品や不審な持ち込み（電柱から切ってきた電線など）の示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を厳格に警告し、買取の相談を打ち切ってください。
      
      【回答スタイル】
      チャットUIに適した短く簡潔な回答（最大150〜200文字程度）にし、Markdown記法は極力使わないでください。親しみやすく頼りになるトーンを維持し、最終的に「工場への持ち込み予約（シミュレーターの利用）」を促してください。
      `,
    });

    const botResponse = result.text;

    // 3. 顧客インサイトの蓄積 (非同期でGASへ投げて記録させる)
    if (gasUrl) {
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
        text: `【システムエラー報告】\nボス、以下のエラーが発生しました。\n\n${error.message}\n\nこの文面をツキサム（私）にコピペして教えてください！` 
    }, { status: 500 });
  }
}
