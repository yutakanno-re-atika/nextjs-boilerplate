// app/api/ai-merge/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { targetName, records } = await req.json();

    // 複数のレコード情報をテキスト化してAIにカンニングさせる
    const recordsText = records.map((r: any, index: number) => {
      return `【データ${index + 1}】\n歩留まり: ${r.yieldRate || '不明'}\n特徴/説明: ${r.description || 'なし'}\n画像URL: ${r.imageUrl || 'なし'}`;
    }).join('\n\n');

    const analysis = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.2,
      schema: z.object({
        recommendation: z.string().describe("なぜこの統合が良いのかのAIの評価・理由（100文字程度）"),
        mergedYieldRate: z.string().describe("統合後の最適な歩留まり（数値や範囲など）"),
        mergedDescription: z.string().describe("すべてのデータの良い部分を組み合わせた最強の詳細説明"),
        alert: z.string().describe("もしデータ間で重大な矛盾（歩留まりが大きく違う等）があれば警告文。なければ空文字。")
      }),
      prompt: `あなたはスクラップビジネスのマスターデータ管理者です。最終目的は「フレコン一括査定」の高精度化です。以下の同じ線種「${targetName}」として登録された複数の重複データを分析し、最も優れている情報同士を組み合わせた「最強の統合データ（ゴールデンレコード）」を作成してください。画像は全てアーカイブとして保持される前提で、テキスト情報（歩留まりや特徴）を最適化してください。\n\n${recordsText}`
    });

    return NextResponse.json({ success: true, result: analysis.object });

  } catch (error: any) {
    console.error("AI Merge Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}