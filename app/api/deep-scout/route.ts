// app/api/deep-scout/route.ts
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // 限界まで思考時間を取る

export async function POST(req: Request) {
  try {
    const { images, hint, specsContext } = await req.json();

    if (!images || images.length === 0) {
      return NextResponse.json({ success: false, message: "画像が提供されていません。" });
    }

    // Google AI SDK の仕様に合わせて画像パーツを生成
    const imageParts = images.map((base64Image: string) => ({
      type: "image" as const,
      image: base64Image,
    }));

    const { object } = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1, // 推論の精度を極限まで高める
      schema: z.object({
        identifiedWire: z.string().describe("推測される線種名（例: 6600V CV 22sq 3C）"),
        confidence: z.number().describe("推測の確信度（0〜100%）"),
        theoreticalYield: z.number().nullable().describe("カタログ等に基づく理論上の銅分率（%）。不明な場合はnull"),
        estimatedYield: z.number().describe("汚れ、劣化、付着物を加味した上で、実際にナゲット機で回収できると見込まれる実質歩留まり（%）"),
        analysis: z.string().describe("汚れや劣化を透過し、被覆の厚さ、導体の撚り方、材質などを物理的にどう読み取ったかの深い推論プロセス"),
        advice: z.string().describe("営業マンへの即決アドバイス（例: 「カタログ値より被覆が厚く劣化も激しいため、歩留まりは◯%で計算し、◯◯円/kg以下で買い叩くべきです」等）"),
        alternative: z.string().describe("もし見立てが間違っていた場合のプランB（例: ただのCVではなくエコケーブルCE/Fだった場合など）")
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `あなたは汚れや劣化を見透かす「神の目（God's Eye）」を持つ、非鉄金属リサイクルの超一流鑑定士です。
現場の泥だらけの電線画像から、内部の構造（絶縁体の材質、シースの厚み、導体の構成）を物理的に逆算し、最も利益を生む査定を導き出してください。

【参考カタログデータ（理論値コンテキスト）】
${specsContext || 'データなし'}

【現場からのヒント】
${hint || '特になし'}

【思考プロトコル】
1. 表面の汚れや泥、変色に騙されず、断面の比率や印字の痕跡から線種を特定せよ。
2. カタログの理論値と、長年の現場経験（劣化によるロス等）をすり合わせ、実際にプラントで回収できる「実質歩留まり」を算出せよ。
3. 現場の営業マンがその場で他社を出し抜き、かつ絶対に赤字を出さないための「限界交渉アドバイス」を提示せよ。`
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