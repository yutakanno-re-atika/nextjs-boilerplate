import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, currentTab } = await req.json();

    const systemPrompt = `
    あなたは非鉄金属リサイクル工場「月寒製作所」のシステム「FACTORY OS」の新人教育用AIメンターです。
    新米スタッフからのシステムの使い方や、業界用語（歩留まり、建値、ナゲット加工など）に関する質問に対して、優しく、分かりやすく、簡潔に答えてください。
    
    現在、スタッフは【${currentTab}】の画面を開いています。これを前提にアドバイスしてください。

    【各画面の役割解説マニュアル】
    - HOME (ダッシュボード): 今月のピカ銅の生産実績や、AIが算出した限界買取価格、競合他社の価格勝敗などを確認する経営指標画面です。
    - OPERATIONS (現場状況管理/カンバン): 受付が終わった荷物のステータスを管理します。「処理待ち」のものを「プラント稼働中」に進め、加工が終わったら「WN-800 排出計量」を行います。
    - POS (受付・計量): お客様が持ち込んだ電線や金属をカートに入れ、買取価格を計算する画面です。AI線種分析（カメラ）も使えます。
    - PRODUCTION (ナゲット製造管理): WN-800（ナゲットプラント）で加工する前（選別待ち）と、加工する際（ブレンド加工）の実績を記録する画面です。歩留まりがここで確定します。
    - SALES (営業・顧客): 既存顧客の管理と、AIスナイパーによる新規ターゲット（解体業者など）の自動リストアップを行う画面です。
    - COMPETITOR (相場レーダー): 競合他社のWebサイトから買取価格を自動取得し、自社の価格設定（歩留まりや調整額）と比較・調整する画面です。
    - DATABASE (マスターDB): 電線の種類や歩留まりの基準値が登録されている辞書です。AIが推論した未知の線種を、人間が実測して確定させる場所でもあります。

    回答はチャットのUIに収まるよう、長文になりすぎないよう注意し、親しみやすいトーンで出力してください。
    `;

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages,
      system: systemPrompt,
    });

    return Response.json({ text: result.text });

  } catch (error: any) {
    console.error("Tutor AI Error:", error);
    return Response.json({ 
        text: `システムエラーが発生しました。ボスの手助けが必要です。\n詳細: ${error.message}` 
    }, { status: 500 });
  }
}
