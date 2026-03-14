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
    // メーカー名が印字で見えればそれもキーワードに含めるよう指示
    // =========================================================================
    const { text: searchKeyword } = await generateText({
      model: google('gemini-3-flash-preview'),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `この画像に写っている電線の種類、および可能であれば「メーカー名（フジクラ、矢崎など）」をマスター検索用のキーワードとして1〜3単語で答えてください。
              例: "CV 矢崎", "VVF", "VVR フジクラ", "LAN", "雑線" など。
              【重要】平べったい場合は「VVF」。細線の束は「雑線」。
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
    // RAG Step 2: マスター画像フェッチ（メーカー名も考慮して検索）
    // =========================================================================
    let referenceImageParts: any[] = [];
    let referenceText = "";

    if (rawWires && Array.isArray(rawWires)) {
      const keywords = searchKeyword.replace(/["\n]/g, '').trim().split(/\s+/);
      
      const candidates = rawWires.filter(w => {
         if (!w.image1 && !w.image3) return false;
         if (keywords.length === 0) return true;
         // キーワード（線種やメーカー）のいずれかが含まれていればピックアップ
         return keywords.some(k => w.name.includes(k) || w.name.toLowerCase().includes(k.toLowerCase()) || (w.maker && w.maker.includes(k)));
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
           
           referenceText += `\n[比較用マスター画像 ${idx + 1}] 品名: ${c.name}, メーカー: ${c.maker || '不明'}, 導体: ${c.conductor}, 実測歩留: ${c.ratio}%`;
           
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
        identifiedWire: z.string().describe("推測される線種名（例: 昭和期の古いCV、フジクラ製 VVF など、年代やメーカーがわかれば付記）"),
        confidence: z.number().describe("推測の確信度（0〜100%）。古い線で印字がなく振れ幅が大きいと予想される場合は下げること"),
        theoreticalYield: z.number().nullable().describe("カタログに基づく理論値。古い線の場合は参考にならない可能性があるためnullでも可"),
        estimatedYield: z.number().describe("現場画像とマスター画像の比較、年代の古さによるブレ幅、面積比などを加味した実質歩留まり予測（%）"),
        analysis: z.string().describe("推論プロセス（印字からのメーカー特定、劣化具合からの年代推測、古い線特有のリスク評価を必ず記述すること）"),
        advice: z.string().describe("営業マンへの即決アドバイス（古い線の場合はダスト引きを強めにするなどの交渉術）"),
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

【絶対ルール1：通常線の識別（形状と色）】
1. 形状の確認：ケーブル全体、または「断面の輪郭」が【平べったい】場合は絶対にCVではなく「VVF（ネズミ線）」。CVは必ず「真円」。
2. 外被の確認：少しでも見えている外被が「灰色」なら「VVF, VVR, VV」の可能性が高い。

【絶対ルール2：メーカーと年代（新旧）の厳格な比較】★新規追加
1. 古い電線は芯の太さの印字がないことが多く、被覆の経年劣化や当時の製造規格の違いにより、銅分率（歩留まり）の振れ幅が激しい。
2. 表面の印字やロゴの特徴から「メーカー」が特定できる場合は、マスターデータの中から「同じメーカー」の数値を最優先で参考にせよ。
3. 表面の変色、硬化、泥汚れ、印字の掠れ具合から「年代」を推測せよ。「古い線」と判断した場合は、新しい線のカタログ理論値よりも歩留まりが下振れするリスクを考慮し、意図的に歩留まりの予測値を厳しめ（低め）に補正せよ。

【絶対ルール3：細線・雑線の「束ね切り」物理計算】
画像が、多数束ねて切断した断面（蜂の巣状）である場合、手で剥けないため以下の計算を行え。
[計算式] 銅の面積比率 × 8.96 ／ 被覆の面積比率 × 1.4。そこから重量歩留まりを算出。

【思考プロトコル】
1. 現場画像の印字や劣化具合から「メーカー」と「年代（古さ）」を推測せよ。
2. 添付された【比較用マスター画像】から、年代やメーカーが近いものを優先して視覚的に比較せよ。
3. 古い線特有の「歩留まりの振れ幅リスク」を減算し、絶対に赤字を出さない実質歩留まりを算出せよ。
4. 算出した歩留まりを元に、「限界交渉アドバイス（例：古い線で歩留まりがブレやすいため、◯◯円で安く買い叩け）」を提示せよ。`
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