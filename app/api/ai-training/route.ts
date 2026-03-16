// app/api/ai-training/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { wireId, wireName, imageUrl, actualRatio, theoreticalRatio } = await req.json();

    if (!imageUrl) throw new Error("画像がありません");

    // 1. Google DriveのURLから画像を直接ダウンロードしてBase64に変換
    const match = imageUrl.match(/id=([^&]+)/) || imageUrl.match(/file\/d\/([^\/]+)/);
    if (!match) throw new Error("無効な画像URLです");
    const fileId = match[1];
    
    // Driveからバイナリを取得
    const imgRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
    if (!imgRes.ok) throw new Error("画像の取得に失敗しました");
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // 2. カタログ理論値のコンテキスト構築
    const theoryContext = theoreticalRatio 
        ? `この電線のメーカーカタログ上の「理論歩留まり」は約 ${theoreticalRatio}% です。` 
        : `この電線の理論歩留まりデータは不明です。`;

    // 3. 💡 理論値からの「減点方式」で推論させる（熟練工の思考プロセス）
    const analysis = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1,
      schema: z.object({
        predictedRatio: z.number().describe("推測した実際の銅分率（実測歩留まり）の数値。0〜100の間。"),
        reason: z.string().describe("推論の論理的な根拠。理論値からの減算理由（被覆の厚み、癒着、経年劣化、ダストロスなど）を具体的に記述。")
      }),
      prompt: `あなたは凄腕のスクラップ査定士であり、AIの学習モデルです。
提供された電線の画像（断面、または皮を剥いた剥線状態）から、工場でナゲット加工した際の「リアルな実測歩留まり（%）」を予測してください。
対象の電線名：「${wireName}」

【重要ヒント：理論値とのギャップ】
${theoryContext}
カタログの理論値は「完璧に剥離し、ダストロスがゼロ」の場合の数値です。実際のナゲット加工では、被覆の癒着、経年劣化、微細な銅粉のロスなどにより、必ず理論値より数%下がります。

【視覚的アプローチの指示】
1. 剥線画像（皮を剥いて並べた状態）の場合：並んでいる銅線と被覆の「体積比（太さと長さ）」を視覚的に比較しなさい。同じ距離で撮影されているため、断面よりも遠近感の錯覚がなく、正確な比率が掴めます。
2. 断面画像の場合：銅と被覆の面積比から比重（銅8.89 / 被覆約1.4）を用いて計算しなさい。ただしカメラの遠近感（パース）による錯覚で被覆が厚く見える現象に注意すること。
3. 理論値（${theoreticalRatio || '不明'}%）が存在する場合、それをベースにして、画像から読み取れる「被覆の厚み」や「経年劣化の具合」を加味し、現実的なロス率（マイナス数%）を割り出し、最終的な予測値を決定しなさい。`
    });

    // 4. 実際の歩留まりとの誤差（絶対値）を計算して採点
    const predicted = analysis.object.predictedRatio;
    const errorMargin = Number(Math.abs(predicted - actualRatio).toFixed(2));

    // 5. GASに結果を送信して記録
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";
    await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'SAVE_AI_TRAINING',
            wireId,
            wireName,
            predictedRatio: predicted,
            actualRatio,
            errorMargin,
            reason: analysis.object.reason
        })
    });

    return NextResponse.json({ success: true, result: { ...analysis.object, actualRatio, errorMargin } });

  } catch (error: any) {
    console.error("AI Training Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}