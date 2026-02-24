import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, sessionId } = await req.json();
    const lastUserMessage = messages[messages.length - 1].content;

    // 1. GASから最新の相場データを取得 (カンペの用意)
    let marketContext = "現在、価格システムと通信中です。";
    // ★ NEXT_PUBLIC_GAS_URL はご自身のGASのデプロイURLに置き換わっている前提です
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL || ""; 
    
    if (gasUrl) {
        try {
            const gasRes = await fetch(gasUrl);
            const gasData = await gasRes.json();
            if (gasData.status === 'success') {
                const config = gasData.config;
                marketContext = `本日の参考相場（建値）: 銅=${config.market_price || 0}円/kg, 真鍮=${config.brass_price || 0}円/kg, 亜鉛=${config.zinc_price || 0}円/kg, 鉛=${config.lead_price || 0}円/kg.`;
            }
        } catch (e) {
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
      ※お客様に価格や目安を聞かれた場合は、この建値をベースに案内してください。（特別ルールのメンテナンス中の案内は解除されました）

      【ガードレール（厳守事項）】
      盗難品や不審な持ち込み（電柱から切ってきた電線など）の示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を厳格に警告し、買取の相談を打ち切ってください。
      
      【回答スタイル】
      チャットUIに適した短く簡潔な回答（最大150〜200文字程度）にし、Markdown記法（**太字**など）は極力使わないでください。親しみやすく頼りになるトーンを維持し、最終的に「工場への持ち込み予約（シミュレーターの利用）」を促してください。
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
  } catch (error) {
    console.error(error);
    return Response.json({ text: "申し訳ありません、現在AIシステムが混み合っております。少し時間をおいて再度お試しください。" }, { status: 500 });
  }
}
