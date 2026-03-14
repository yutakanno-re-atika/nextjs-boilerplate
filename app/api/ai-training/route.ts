// app/api/ai-training/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { wireId, wireName, imageUrl, actualRatio } = await req.json();

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

    // 2. 💡 マスターの「正解歩留まり」は隠したまま、AIに推論させる
    const analysis = await generateObject({
      // @ts-ignore
      model: google('gemini-3.1-pro-preview'), // ★ 3.1 Proに進化
      temperature: 0.1, // 精度を高めるため温度は低め
      schema: z.object({
        predictedRatio: z.number().describe("推測した銅分率（歩留まり）の数値。0〜100の間。"),
        reason: z.string().describe("推測の論理的な根拠。被覆の厚さ、導体の太さ、芯数などからどう計算したかを簡潔に。")
      }),
      prompt: `あなたは凄腕のスクラップ査定士です。提供されたケーブルの断面（または外観）画像から、純粋な銅分率（歩留まり%）を推測してください。
      このケーブルの名称は「${wireName}」です。
      
      【ルール】
      過去のデータや検索結果に頼らず、画像の「メジャーのスケール（太さ）」や「被覆と銅の面積比」から物理的に計算・推論してください。`
    });

    // 3. 実際の歩留まりとの誤差（絶対値）を計算して採点
    const predicted = analysis.object.predictedRatio;
    const errorMargin = Number(Math.abs(predicted - actualRatio).toFixed(2));

    // 4. GASに結果を送信して、隔離された「AITraining」シートに記録
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
