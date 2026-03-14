// app/api/ai-training/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

function loadCatalogData() {
    let allCatalogs: any[] = [];
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.json') && f !== 'hokkaido_electric.json');
        for (const file of files) {
            allCatalogs = allCatalogs.concat(JSON.parse(fs.readFileSync(path.join(publicDir, file), 'utf8')));
        }
    } catch (e) {}
    return allCatalogs;
}

export async function POST(req: Request) {
  try {
    const { wireId, wireName, imageUrl, actualRatio } = await req.json();
    if (!imageUrl) throw new Error("画像がありません");

    const match = imageUrl.match(/id=([^&]+)/) || imageUrl.match(/file\/d\/([^\/]+)/);
    if (!match) throw new Error("無効な画像URLです");
    const fileId = match[1];
    
    const imgRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
    if (!imgRes.ok) throw new Error("画像の取得に失敗しました");
    const arrayBuffer = await imgRes.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');

    // ★ RAGコンテキスト生成
    const catalogs = loadCatalogData();
    const validCatalogs = catalogs.filter(c => c.theoreticalRatio && c.theoreticalRatio !== '-');
    const keywords = wireName.split(/[\s　]+/);
    let filteredCatalogs = validCatalogs.filter(c => keywords.some(k => (c.name + c.maker).includes(k)));
    if (filteredCatalogs.length === 0) filteredCatalogs = validCatalogs.slice(0, 100);

    const catalogContext = filteredCatalogs.slice(0, 50).map(c => 
        `[${c.maker}] ${c.name} (サイズ:${c.size}) -> 理論歩留:${c.theoreticalRatio}%`
    ).join('\n');

    const analysis = await generateObject({
      model: google('gemini-2.5-pro'),
      temperature: 0.1, 
      schema: z.object({
        predictedRatio: z.number().describe("推測した銅分率。小数点第1位まで。"),
        reason: z.string().describe("推論の論理的な根拠。カタログの理論値の引用、または面積比と比重(銅8.96:PVC1.35)の計算過程を記載すること。")
      }),
      prompt: `あなたは凄腕のスクラップ査定士です。提供されたケーブルの断面（または外観）画像から、純粋な銅分率（歩留まり%）を推測してください。
このケーブルのマスター登録名称は「${wireName}」です。

【参考カタログデータ（理論値）】
${catalogContext}

【ルール】
カタログデータに合致するものがあればその理論値をベースにし、画像から劣化や介在物のノイズ分を減算してください。
該当がない場合は、画像内の銅と被覆の「面積比」を割り出し、比重（銅8.96、被覆1.35等）を掛け合わせて重量比率を算出して答えを出してください。`
    });

    const predicted = analysis.object.predictedRatio;
    const errorMargin = Number(Math.abs(predicted - actualRatio).toFixed(2));

    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";
    await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'SAVE_AI_TRAINING',
            wireId, wireName, predictedRatio: predicted, actualRatio, errorMargin, reason: analysis.object.reason
        })
    });

    return NextResponse.json({ success: true, result: { ...analysis.object, actualRatio, errorMargin } });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
