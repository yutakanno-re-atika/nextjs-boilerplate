// app/api/deep-scout/route.ts
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

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
    // RAG Step 1: 超高速な一次判定 (Flash)
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
              例: "CV", "VVF", "VVR", "VV", "IV", "通信線" など。
              【重要】平べったい形状なら絶対に「VVF」、外被が灰色なら「VVF」「VVR」「VV」です。
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
    // RAG Step 2: マスター画像フェッチ
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
    // RAG Step 3: God's Eye (Gemini Pro) による最終推論
    // =========================================================================
    const { object } = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro'),
      temperature: 0.1, 
      schema: z.object({
        identifiedWire: z.string().describe("推測される線種名（例: 6600V CV 22sq 3C または VVF 2.0mm 3C）"),
        confidence: z.number().describe("推測の確信度（0〜100%）"),
        theoreticalYield: z.number().nullable().describe("カタログ等に基づく理論上の銅分率（%）。不明な場合はnull"),
        estimatedYield: z.number().describe("現場画像とマスター画像を比較し、汚れや劣化を加味した実質歩留まり（%）"),
        analysis: z.string().describe("推論プロセス（形状が平べったいか丸いか、外被の色などの特徴を必ず記述すること）"),
        advice: z.string().describe("営業マンへの即決アドバイス"),
        alternative: z.string().describe("もし見立てが間違っていた場合のプランB")
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

【線種特定の絶対ルール（超重要）】
1. 形状の確認（最優先）：ケーブル全体、または「断面の輪郭」が【平べったい（長方形・楕円・きしめん状）】場合は、絶対にCVではなく「VVF（ネズミ線）」であると断定せよ。CV線は必ず「真円（丸）」になる。
2. 外被の確認：少しでも見えている外被が「灰色（グレー）」であれば「VVF, VVR, VV」の可能性が高い。
3. 断面のみで判断に迷う場合は、形状（平べったいか丸いか）を最も強力な根拠とすること。

【思考プロトコル】
1. 現場画像の汚れに騙されず、上記の「絶対ルール」に則り、まず形状（平べったいか、丸いか）から線種を特定せよ。
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