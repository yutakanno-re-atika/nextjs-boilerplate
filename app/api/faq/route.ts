import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60; // 分析には時間がかかるのでタイムアウトを延長

export async function POST(req: Request) {
  try {
    // ★ ここに新しくデプロイしたGASのURLを貼り付ける
    const gasUrl = "【ここに新しいGASのウェブアプリURLを貼り付けてください】"; 

    // 1. GASから直近のチャットログを吸い出す
    const fetchRes = await fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'FETCH_CHAT_LOGS' })
    });
    const { logs } = await fetchRes.json();

    if (!logs || logs.length === 0) {
        return Response.json({ success: false, message: "チャットログがまだありません" });
    }

    const logText = logs.map((l: any) => `客: ${l.user}\nAI: ${l.ai}`).join('\n\n');

    // 2. Geminiにログを分析させ、FAQを生成させる（JSON出力を強制）
    const result = await generateText({
      model: google('gemini-2.5-flash'), 
      system: `
      あなたはリサイクル工場の優秀なデータアナリストです。
      以下のカスタマーサポートのチャットログを分析し、お客様がよく疑問に思う・重視しているポイントを抽出し、実践的でリアルな「よくある質問(FAQ)」を最大5件作成してください。
      回答（Answer）は、月寒製作所の強み（ナゲットプラントがあり高価買取）を交えた説得力のある内容にしてください。
      
      【厳守事項】
      出力は絶対に以下のJSON配列形式のみを出力してください。マークダウン（\`\`\`json など）や余計なテキストは一切含めないでください。
      [
        { "q": "質問内容...", "a": "回答内容..." }
      ]
      `,
      prompt: `【チャットログ】\n${logText}`
    });

    // 3. JSON文字列をパース
    const jsonString = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const faqs = JSON.parse(jsonString);

    // 4. 生成したFAQをGASに保存する
    await fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'SAVE_AUTO_FAQ', faqs: faqs })
    });

    return Response.json({ success: true, faqs });
  } catch (error: any) {
    console.error("FAQ Generation Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
