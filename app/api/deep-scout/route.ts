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
              例: "CV", "VVF", "VVR", "VV", "IV", "LAN", "通信線", "多芯", "雑線" など。
              【重要】細線が多数束ねられている場合は「雑線」や「LAN」、平べったい場合は「VVF」。
              ヒント: ${hint || 'なし'}
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
        identifiedWire: z.string().describe("推測される線種名（例: 6600V CV 22sq 3C、LANケーブル束、多芯制御線 など）"),
        confidence: z.number().describe("推測の確信度（0〜100%）"),
        theoreticalYield: z.number().nullable().describe("カタログ等に基づく理論上の銅分率（%）。不明な場合はnull"),
        estimatedYield: z.number().describe("現場画像とマスター画像の比較、または面積比からの比重計算に基づく実質歩留まり予測（%）"),
        analysis: z.string().describe("推論プロセス（形状、色、または【束ね切り時の面積・比重計算の式と過程】を必ず詳細に記述すること）"),
        advice: z.string().describe("営業マンへの即決アドバイス"),
        alternative: z.string().describe("もし見立てが間違っていた場合のプランB")
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `あなたは汚れや劣化を見透かし、数学的アプローチも使いこなす「神の目（God's Eye）」を持つ超一流の非鉄金属鑑定士です。

【当社の確定マスターデータ（テキスト）】
${masterContext || 'データなし'}

【参考カタログデータ（理論値コンテキスト）】
${specsContext || 'データなし'}

【現場からのヒント】
${hint || '特になし'}

【絶対ルール1：通常線の識別】
1. 形状の確認：ケーブル全体、または「断面の輪郭」が【平べったい（きしめん状）】場合は、絶対にCVではなく「VVF（ネズミ線）」である。CV線は必ず「真円（丸）」になる。
2. 外被の確認：少しでも見えている外被が「灰色（グレー）」であれば「VVF, VVR, VV」の可能性が高い。

【絶対ルール2：細線・雑線の「束ね切り（バンドルカット）」物理計算モード】★新規追加
画像が、LANケーブルや多芯ケーブルなどを「多数束ねてスパッと切断した断面（蜂の巣状）」である場合、手で剥いて歩留まりを測ることは不可能なため、以下の数学的アプローチで歩留まりを逆算せよ。
1. 断面全体のうち、「銅が光っている面積（ピクセル比率）」と「被覆・空隙（プラスチックや空気）が占める面積比率」を視覚的に推測せよ。
2. 銅の比重（8.96）と、一般的な被覆材の比重（約1.4）を用いて、面積比から重量比（歩留まり）を計算せよ。
   [計算式] 銅の重量 = 銅の面積比率 × 8.96 ／ 被覆の重量 = 被覆の面積比率 × 1.4
   [実質歩留まり] 銅の重量 ÷ (銅の重量 + 被覆の重量) × 100
3. 導き出した面積比率と計算過程を ` + "`analysis`" + ` に明記せよ。

【思考プロトコル】
1. 画像が単一の太線か、細線の束（バンドル）かを見極めろ。
2. 束ね切り画像であれば「絶対ルール2」の物理計算を実行し、単一の太線であれば「絶対ルール1」の形状・色比較を実行せよ。
3. 算出した歩留まりを元に、現場の営業マンが絶対に赤字を出さないための「限界交渉アドバイス」を提示せよ。`
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