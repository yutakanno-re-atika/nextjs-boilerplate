// app/api/ai-merge/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { targetName, records } = await req.json();

    // ★ 修正：ボスのデータベースの正しいキー（ratio, memo, image1）を取得するように変更！
    const recordsText = records.map((r: any, index: number) => {
      return `【データ${index + 1}】
歩留まり: ${r.ratio ? r.ratio + '%' : '不明'}
特徴/説明: ${r.memo || 'なし'}
画像データ: ${r.image1 ? 'あり' : 'なし'}`;
    }).join('\n\n');

    const analysis = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1, // 計算を正確にするため温度を下げる
      schema: z.object({
        recommendation: z.string().describe("統合の評価理由。歩留まりが近い場合は「誤差の範囲内であり統合を推奨します」等と前向きに記載し、再計測は絶対に促さないこと。"),
        mergedYieldRate: z.string().describe("統合後の最適な歩留まり。既存データの【平均値】を計算して数値のみ（例: 45.2）を出力すること。"),
        mergedDescription: z.string().describe("すべてのデータの良い部分を組み合わせた詳細説明。"),
        alert: z.string().describe("歩留まりが「5%以上」違うなど、重大な矛盾がある場合のみ警告文を出力。数%の誤差なら空文字（\"\"）にすること。")
      }),
      prompt: `あなたはプロのスクラップ査定士であり、マスターデータ管理者です。以下の同じ線種「${targetName}」として登録された複数のデータを分析し、統合データを作成してください。

【絶対遵守ルール】
1. 歩留まりの誤差が数%以内であれば、同種データの自然なブレとみなし、安全に「平均値」を算出して統合を推奨してください。「再計測が必要」等の過剰に保守的な警告は絶対に出さないでください。
2. 歩留まりが「5%以上」乖離している場合のみ、別の線種が混ざっている（誤登録）と判断し、alert に強い警告を出してください。
3. 入力データの歩留まり情報に基づいて必ず平均値を計算してください。

${recordsText}`
    });

    return NextResponse.json({ success: true, result: analysis.object });

  } catch (error: any) {
    console.error("AI Merge Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
