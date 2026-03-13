// app/api/deep-scout/route.ts
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // 限界まで思考時間を取る

export async function POST(req: Request) {
  try {
    const { images, hint, specsContext, masterContext, rawWires } = await req.json();

    if (!images || images.length === 0) {
      return NextResponse.json({ success: false, message: "画像が提供されていません。" });
    }

    const targetImageParts = images.map((base64Image: string) => ({
      type: "image" as const,
      image: base64Image,
    }));

    // =========================================================================
    // RAG Step 1: 超高速な一次判定 (Flash) で比較すべきマスターを絞り込む
    // =========================================================================
    const { text: searchKeyword } = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `この画像に写っている電線の種類を、マスター検索用の「1〜2単語」で答えてください。
              例: "CV", "VVF", "VVR", "VV", "IV", "通信線", "キャブタイヤ" など。
              【重要ルール】外被が灰色（グレー）なら「VVR」か「VVF」か「VV」。黒色なら「CV」の可能性が高いです。
              ヒントがあれば考慮してください: ${hint || 'なし'}
              返答は単語のみとし、余計な文字は含めないでください。`
            },
            ...targetImageParts
          ]
        }
      ]
    });

    console.log("AI Primary Detection:", searchKeyword);

    // =========================================================================
    // RAG Step 2: 抽出したキーワードで実測マスターから類似画像をフェッチ
    // =========================================================================
    let referenceImageParts: any[] = [];
    let referenceText = "";

    if (rawWires && Array.isArray(rawWires)) {
      const cleanKeyword = searchKeyword.replace(/["\n]/g, '').trim();
      
      const candidates = rawWires.filter(w => {
         if (!w.image1 && !w.image3) return false;
         if (!cleanKeyword) return true;
         return w.name.includes(cleanKeyword) || w.name.toLowerCase().includes(cleanKeyword.toLowerCase());
      }).slice(0, 3);

      const finalCandidates = candidates.length > 0 ? candidates : rawWires.filter(w => w.image1 || w.image3).slice(0, 2);

      const fetchPromises = finalCandidates.map(async (c, idx) => {
        const imgUrl = c.image1 || c.image3;
        const match = imgUrl.match(/id=([^&]+)/) || imgUrl.match(/file\/d\/([^\/]+)/);
        if (!match) return null;
        const fileId = match[1];

        try {
           const imgRes = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
           if (!imgRes.ok) return null;
           const arrayBuffer = await imgRes.arrayBuffer();
           const base64Data = Buffer.from(arrayBuffer).toString('base64');
           
           referenceText += `\n[比較用マスター画像 ${idx + 1}] 品名: ${c.name}, 導体: ${c.conductor}, 実測歩留: ${c.ratio}%`;
           
           return {
             type: "image" as const,
             image: base64Data,
           };
        } catch(e) {
           return null;
        }
      });

      const fetchedImages = await Promise.all(fetchPromises);
      referenceImageParts = fetchedImages.filter(img => img !== null);
    }

    // =========================================================================
    // RAG Step 3: God's Eye (Gemini Pro) による視覚比較と最終推論
    // =========================================================================
    const { object } = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1, 
      schema: z.object({
        identifiedWire: z.string().describe("推測される線種名（例: 6600V CV 22sq 3C または VV 8sq 3C）"),
        confidence: z.number().describe("推測の確信度（0〜100%）。断面のみで外被の色が不明な場合は下げること"),
        theoreticalYield: z.number().nullable().describe("カタログ等に基づく理論上の銅分率（%）。不明な場合はnull"),
        estimatedYield: z.number().describe("現場画像とマスター画像を比較し、汚れや劣化を加味した実質歩留まり（%）"),
        analysis: z.string().describe("推論プロセス（外被の色、形状、マスター画像との比較結果を必ず記述すること）"),
        advice: z.string().describe("営業マンへの即決アドバイス（限界単価やダスト引きの交渉など）"),
        alternative: z.string().describe("もし見立てが間違っていた場合のプランB（例: 断面のみでCVと見立てたが、外被が灰色ならネズミ線の可能性あり、等）")
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `あなたは汚れや劣化を見透かす「神の目（God's Eye）」を持つ、非鉄金属リサイクルの超一流鑑定士です。
現場の泥だらけの電線画像と、自社の過去の【実測マスター画像】を見比べ、最も利益を生む査定を導き出してください。

【当社の確定マスターデータ（テキスト）】
${masterContext || 'データなし'}

【参考カタログデータ（理論値コンテキスト）】
${specsContext || 'データなし'}

【現場からのヒント】
${hint || '特になし'}

【線種特定の絶対ルール（CVとネズミ線の誤認防止）】
断面画像のみの場合、以下の外観的特徴を血眼になって探し出せ：
1. 外被（一番外側の被覆）の色：少しでも見えている外被が「灰色（グレー）」であれば、「ネズミ線（VVF, VVR, VV）」の可能性が極めて高い。「黒色」であれば「CV, CE」の可能性が高い。
2. ケーブルの形状：平形（きしめん状）であれば「VVF」。丸形であれば「VVR」「VV」または「CV」。
3. 断面ドアップの画像のみで外被の色が完全に不明な場合、安易に「CV」と決めつけず、確信度を意図的に下げよ。そしてプランB（alternative）に「外被が灰色ならVVR(ネズミ線)の可能性が高いので全体を確認せよ」と必ず警告せよ。

【思考プロトコル】
1. 現場画像の汚れに騙されず、上記の「絶対ルール」に則り線種を特定せよ。
2. 添付された【比較用マスター画像】と現場画像を「視覚的に」比較し、被覆の厚さや色が一致するか確認せよ。
3. 比較用マスターの実測歩留まりを基準とし、現場の劣化具合を減算して「実質歩留まり」を算出せよ。
4. 現場の営業マンが絶対に赤字を出さないための「限界交渉アドバイス」を提示せよ。`
            },
            { type: "text", text: "---ここから 現場の対象画像---" },
            ...targetImageParts,
            ...(referenceImageParts.length > 0 ? [{ type: "text", text: "---ここから 比較用マスター画像---" }, ...referenceImageParts] : [])
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