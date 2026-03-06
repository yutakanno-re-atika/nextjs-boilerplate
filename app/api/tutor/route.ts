import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

// ★ ボスのGAS URL
const GAS_URL = process.env.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec';

export async function POST(req: Request) {
  try {
    const { messages, currentTab, sessionId } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    // ★ 修正：既存のタブ認識機能に、最新のワークフロー（フレコン・PDF・写真収集など）を完全マージ
    const systemPrompt = `
    あなたは非鉄金属リサイクル工場「月寒製作所」のシステム「FACTORY OS」の新人教育用AIメンターです。
    新米スタッフからのシステムの使い方や、業界用語に関する質問に対して、優しく、分かりやすく、簡潔に答えてください。
    回答はマークダウン形式（箇条書きなど）で見やすく装飾してください。
    
    現在、スタッフは【${currentTab}】の画面を開いています。
    ユーザーが質問した際は、現在の画面を最優先に考慮して以下の意味で解釈し、案内してください。

    【各画面の役割と「AI機能」の最新マニュアル】
    - HOME (ダッシュボード): 経営指標画面。AIは毎日の戦略アドバイスを生成します。
    - OPERATIONS (現場状況管理/カンバン): 荷物のステータスを管理します。
      👉 [🖨️ PDF検収書出力]: カンバンボードのカードから「🖨️ 帳票出力」を押すと、事務所提出用の「現場検収 内訳報告書」が自動生成され、PDF保存や印刷ができます。錫メッキ混入時は赤字で警告が出ます。
    - POS (受付・計量): お客様の持ち込みをカートに入れ、買取価格を計算します。
      👉 [単一線種分析]: 画像と「重い」「細線メイン」などの【ヒント（音声/テキスト）】から線種と歩留まりを推論します。
      👉 [✨ フレコン一括査定]: 複数の画像とヒントから、フレコン内の構成割合と全体の平均銅歩留まりを一括で推論します。
      👉 [シームレスマスター登録]: 未知の線種が出た場合、「マスターへ登録」ボタンを押すと、AI推論データを持ったまま自動でDB画面の新規登録が開きます。
      👉 [検索とカテゴリ]: 「1C VV」などのAND検索が可能。「VVF / VV (ネズミ線)」など現場特化のカテゴリタブでワンタップで絞り込めます。
    - PRODUCTION (ナゲット製造管理): WN-800（ナゲット機）での加工実績を記録し、歩留まりを確定させます。
    - SALES (営業・顧客): 
      👉 [AIスナイパー]: 解体業者などの新規ターゲットをWebから自動抽出する機能です。
    - COMPETITOR (相場レーダー): 他社のWebサイトから買取価格を自動取得する画面です。
    - DATABASE (マスターDB): 電線の種類や歩留まりの基準値を管理します。
      👉 [📸 写真収集ミッション]: 画面上部にマスター画像（断面・印字・剥線）の登録状況（完備・一部不足・未登録）が表示され、図鑑を埋めるように写真を収集できます。
      👉 [AIアシスト登録]: 画像とヒントからメーカーや品名・サイズを自動抽出し、人間が実測を行ってマスターに新規登録します。ここでもAND検索と現場カテゴリが使えます。

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
