// app/api/deep-scout/route.ts
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // 限界まで思考時間を取る

export async function POST(req: Request) {
  try {
    // ★ rawWires (生のマスターデータ配列) を受け取るように追加
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
              例: "CV", "VVF", "IV", "通信線", "キャブタイヤ" など。
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
      
      // キーワードで絞り込み、画像があるものを最大3件抽出
      const candidates = rawWires.filter(w => {
         if (!w.image1 && !w.image3) return false;
         if (!cleanKeyword) return true;
         return w.name.includes(cleanKeyword) || w.name.toLowerCase().includes(cleanKeyword.toLowerCase());
      }).slice(0, 3); // ペイロード削減のため最大3件

      // 候補がなければ、画像があるものをランダムに1〜2件ピックアップ（比較用）
      const finalCandidates = candidates.length > 0 ? candidates : rawWires.filter(w => w.image1 || w.image3).slice(0, 2);

      // サーバーサイドでGoogle Driveからマスター画像を並列ダウンロードしてBase64化
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
        identifiedWire: z.string().describe("推測される線種名（例: 6600V CV 22sq 3C）"),
        confidence: z.number().describe("推測の確信度（0〜100%）"),
        theoreticalYield: z.number().nullable().describe("カタログ等に基づく理論上の銅分率（%）。不明な場合はnull"),
        estimatedYield: z.number().describe("現場画像とマスター画像を比較し、汚れや劣化を加味した実質歩留まり（%）"),
        analysis: z.string().describe("提供された【比較用マスター画像】と現場画像を視覚的にどう見比べたか、被覆の厚さや導体径の違いについての推論プロセス"),
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
現場の泥だらけの電線画像と、自社の過去の【実測マスター画像】を見比べ、最も利益を生む査定を導き出してください。

【当社の確定マスターデータ（テキスト）】
${masterContext || 'データなし'}

【参考カタログデータ（理論値コンテキスト）】
${specsContext || 'データなし'}

【現場からのヒント】
${hint || '特になし'}

【AIへの供給データ構成】
以下の順番で画像が添付されています。
1. 現場の対象画像（ユーザーが撮影したもの）
2. 比較用の自社マスター画像（${referenceText || '今回は比較画像なし'}）

【思考プロトコル】
1. 現場画像の汚れや泥に騙されず、断面の比率や印字を読み取れ。
2. 添付された【比較用マスター画像】と現場画像を「視覚的に」比較し、被覆の厚さやテカリ具合、導体の構成が一致するか確認せよ。
3. 一致度が高い場合は、比較用マスターの実測歩留まりを基準とし、現場の劣化具合（ダスト分）を減算して「実質歩留まり」を算出せよ。
4. 現場の営業マンがその場で他社を出し抜き、かつ絶対に赤字を出さないための「限界交渉アドバイス」を提示せよ。`
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