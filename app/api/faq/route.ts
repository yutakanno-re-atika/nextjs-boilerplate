import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60; // 分析には時間がかかるのでタイムアウトを延長

export async function POST(req: Request) {
  try {
    // ★ ここにボスのGASのウェブアプリURLを貼り付けてください
    const gasUrl = "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 

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
      あなたは株式会社月寒製作所（苫小牧工場）の優秀なデータアナリストです。
      以下のカスタマーサポートのチャットログを分析し、お客様がよく疑問に思うポイントを抽出し、実践的でリアルな「よくある質問(FAQ)」を最大5件作成してください。
      
      【厳守する基本情報（ファクト）】
      ・所在地: 北海道苫小牧市一本松町9-6
      ・営業時間: 8:00〜17:00
      ・強み: 自社ナゲットプラントによる中間マージンカットが高価買取の理由。
      ・持込ルール: 古物営業法の規定により、初回取引時は「運転免許証などの身分証明書」が必ず必要。

      【回答（Answer）の作成ルール・ガードレール】
      1. 客観的かつ簡潔に: 暑苦しいセールストークや「〜です！」「〜ね！」といった過剰な装飾を排除し、誠実で簡潔なビジネストーン（〜です、〜ます）で答えてください。
      2. 嘘をつかない: 上記の基本情報にない事項（具体的な定休日など）を勝手に創作しないでください。
      3. 押し売り禁止: お客様の質問が「価格の理由」に関するものでない限り、無理に「自社ナゲットプラント」の話を回答にねじ込まないでください。
      
      【出力フォーマット】
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
