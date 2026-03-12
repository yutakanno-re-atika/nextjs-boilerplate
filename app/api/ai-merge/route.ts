// app/api/ai-merge/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { targetName, records } = await req.json();

    const recordsText = records.map((r: any, index: number) => {
      return `【データ${index + 1}】\n歩留まり: ${r.yieldRate || '不明'}\n特徴/説明: ${r.description || 'なし'}\n画像URL: ${r.imageUrl || 'なし'}`;
    }).join('\n\n');

    const analysis = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1, // AIの勝手な想像を防ぎ、計算を正確にするため温度を下げる
      schema: z.object({
        recommendation: z.string().describe("なぜこの統合が良いのかの理由。明らかに違う線種が混ざっている場合はその旨を指摘すること。"),
        mergedYieldRate: z.string().describe("統合後の最適な歩留まり。既存データの【平均値】または【最も妥当で高い数値】を採用し、根拠なく低い数値を提示しないこと。"),
        mergedDescription: z.string().describe("すべてのデータの良い部分を組み合わせた詳細説明"),
        alert: z.string().describe("重大な矛盾（全く違う線種が混ざっている、歩留まりの乖離が大きすぎる等）があれば強い警告文。なければ空文字。")
      }),
      prompt: `あなたはプロのスクラップ査定士であり、マスターデータ管理者です。以下の同じ線種名「${targetName}」として登録された複数のデータを分析してください。\n\n【絶対遵守ルール】\n1. 歩留まり率（銅分）は、入力データに存在する数値の「平均値」または「最も信頼できる数値」をベースにしてください。入力された数値より低い数値を勝手に捏造しないでください。\n2. もしデータ間の説明文や歩留まりが極端に違う場合、「現場が間違って別の線種を同じ名前で登録してしまった（誤登録）」可能性が高いです。その場合は alert に警告を出し、統合を推奨しない旨を recommendation に記載してください。\n\n${recordsText}`
    });

    return NextResponse.json({ success: true, result: analysis.object });

  } catch (error: any) {
    console.error("AI Merge Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}