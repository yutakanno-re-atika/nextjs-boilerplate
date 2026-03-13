// app/api/deep-scout/route.ts
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // 限界まで思考時間を取る

export async function POST(req: Request) {
  try {
    // ★ masterContext を受け取るように追加
    const { images, hint, specsContext, masterContext } = await req.json();

    if (!images || images.length === 0) {
      return NextResponse.json({ success: false, message: "画像が提供されていません。" });
    }

    const imageParts = images.map((base64Image: string) => ({
      type: "image" as const,
      image: base64Image,
    }));

    const { object } = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1, 
      schema: z.object({
        identifiedWire: z.string().describe("推測される線種名（例: 6600V CV 22sq 3C）"),
        confidence: z.number().describe("推測の確信度（0〜100%）"),
        theoreticalYield: z.number().nullable().describe("カタログ等に基づく理論上の銅分率（%）。不明な場合はnull"),
        estimatedYield: z.number().describe("汚れや劣化を加味した、あるいは【当社マスターの実測値】に基づく実質歩留まり（%）"),
        analysis: z.string().describe("マスターデータとの照合結果や、汚れを透過して物理的にどう読み取ったかの推論プロセス"),
        advice: z.string().describe("営業マンへの即決アドバイス（限界単価やダスト引きの交渉など）"),
        alternative: z.string().describe("もし見立てが間違っていた場合のプランB")
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `あなたは汚れや劣化を見透かす「神の目（God's Eye）」を持つ、非鉄金属リサイクルの超一流鑑定士です。
現場の泥だらけの電線画像から、内部の構造を物理的に逆算し、最も利益を生む査定を導き出してください。

【当社の確定マスターデータ（実測値・最優先事項）】
${masterContext || 'データなし'}

【参考カタログデータ（理論値コンテキスト）】
${specsContext || 'データなし'}

【現場からのヒント】
${hint || '特になし'}

【思考プロトコル】
1. 表面の汚れや泥、変色に騙されず、断面の比率や印字の痕跡から線種を特定せよ。
2. まずは【当社の確定マスターデータ】から完全に一致または極めて類似する線種がないか検索し、存在する場合はその「実測歩留まり」を絶対の基準として採用せよ。
3. マスターにない場合のみ、カタログの理論値と長年の現場経験をすり合わせ、「実質歩留まり」を算出せよ。
4. 現場の営業マンがその場で他社を出し抜き、かつ絶対に赤字を出さないための「限界交渉アドバイス」を提示せよ。`
            },
            ...imageParts
          ]
        }
      ]
    });

    return NextResponse.json({ success: true, result: object });

  } catch (error: any) {
    console.error("Deep Scout API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}