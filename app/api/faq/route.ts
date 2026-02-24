import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // 1. GASから最新の相場データを取得
    let marketContext = "現在、価格システムと通信中です。";
    const gasUrl = "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 
    
    if (gasUrl) {
        try {
            const gasRes = await fetch(gasUrl);
            const contentType = gasRes.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                 console.error("GAS Auth Error: 権限エラー");
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

    // 2. Geminiで回答を生成
    const result = await generateText({
      model: google('gemini-2.5-flash'), // ※最新モデル
      messages,
      system: `
      あなたは株式会社月寒製作所（苫小牧工場）の優秀なAIコンシェルジュ（トップ営業マン兼・査定人）です。
      
      【基本情報】
      1. 役割: 廃電線・非鉄金属の買取査定、持ち込み案内の専門家。
      2. 所在地: 北海道苫小牧市一本松町9-6 / 営業時間: 8:00〜17:00
      
      【自社の強みのアピール条件（重要）】
      「被覆電線（VVFやCVなど）」の話題、または「なぜ高く買えるのか？」と聞かれた【場合のみ】、「自社にナゲットプラントがあり、中間業者を挟まないため高価買取が可能」とアピールしてください。
      真鍮、砲金、鉄など、電線以外の話題の時はナゲットプラントの話は絶対にしないでください。

      【査定・検収に関するビジネスルール（厳守事項）】
      お客様から「違う種類の金属が混ざっている」「プラスチックや鉄（ビスなど）が付いている」といった【未選別・ダスト付き】の相談を受けた場合は、必ず以下のように案内してください。
      「そのままお持ち込みいただいても買取可能ですが、未選別品や異物付きとして『込（こみ）単価』での買取、またはダスト引き（減額）の対象となります。事前にお客様ご自身で分別・解体していただくと、より高く買取できますよ！」

      【最新相場情報（カンペ）】
      ${marketContext}
      ※お客様に価格を聞かれた場合は、この建値をベースに案内してください。

      【その他ガードレール】
      盗難品や不審な持ち込みの示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を警告し、相談を打ち切ってください。
      
      【回答スタイル】
      チャットUIに適した短く簡潔な回答（最大150〜200文字程度）にし、Markdown記法は使わないでください。親しみやすく頼りになるトーンを維持し、最後に「工場への持ち込み予約」を促してください。
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
