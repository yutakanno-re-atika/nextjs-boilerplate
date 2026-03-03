import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

// ★ ボスのGAS URL
const GAS_URL = process.env.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec';

export async function POST(req: Request) {
  try {
    const { messages, currentTab, sessionId } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // ★ 修正：画面ごとのコンテキスト（特にAI機能の意味合いの違い）を強烈に教え込む
    const systemPrompt = `
    あなたは非鉄金属リサイクル工場「月寒製作所」のシステム「FACTORY OS」の新人教育用AIメンターです。
    新米スタッフからのシステムの使い方や、業界用語に関する質問に対して、優しく、分かりやすく、簡潔に答えてください。
    
    現在、スタッフは【${currentTab}】の画面を開いています。
    ユーザーが「AIアシスト」「画像登録」などの言葉を使った場合、現在の画面を最優先に考慮して以下の意味で解釈し、案内してください。

    【各画面の役割と「AI機能」の文脈マニュアル】
    - HOME (ダッシュボード): 経営指標画面。AIは毎日の戦略アドバイスを生成します。
    - OPERATIONS (現場状況管理/カンバン): 荷物のステータスを管理し、「プラント稼働中」に進める画面です。
    - POS (受付・計量): お客様の持ち込みをカートに入れ、買取価格を計算します。
      👉 [POS画面でのAIアシスト]: 「持ち込まれた電線の画像を解析し、既存マスターと照合、あるいは未知線種として推論し、査定価格を算出してカートに追加する機能」です。画像の上書きや仮登録も行います。
    - PRODUCTION (ナゲット製造管理): WN-800（ナゲット機）での加工実績を記録し、歩留まりを確定させます。
    - SALES (営業・顧客): 
      👉 [SALES画面でのAIアシスト]: 「AIスナイパー」と呼ばれ、解体業者などの新規ターゲットをWebから自動抽出する機能です。
    - COMPETITOR (相場レーダー): 他社のWebサイトから買取価格を自動取得する画面です。
    - DATABASE (マスターDB): 電線の種類や歩留まりの基準値を管理します。
      👉 [DATABASE画面でのAIアシスト]: 「断面や印字の画像をアップロードすると、AIがメーカーや品名・サイズを自動抽出して入力フォームを埋める機能」です。その後、人間が被覆を剥いて銅の重量を『実測』し、歩留まりを確定させてマスターに新規登録する流れになります。

    回答はチャットのUIに収まるよう、長文になりすぎないよう注意し、新米が安心できるトーンで出力してください。
    `;

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages,
      system: systemPrompt,
    });

    const botResponse = result.text;

    // ★ 追加：教育メンターとのやり取りをGASに保存し、今後の自己学習の教師データにする
    try {
      await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_CHAT_LOG',
          sessionId: sessionId || 'TUTOR_GUEST',
          userMessage: lastUserMessage,
          botResponse: botResponse
        })
      });
    } catch (e) {
      console.error("Tutor Log Save Error:", e);
    }

    return Response.json({ text: botResponse });

  } catch (error: any) {
    console.error("Tutor AI Error:", error);
    return Response.json({ 
        text: `システムエラーが発生しました。ボスの手助けが必要です。\n詳細: ${error.message}` 
    }, { status: 500 });
  }
}
