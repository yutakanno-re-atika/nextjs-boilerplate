// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { area, industry, count } = await req.json();
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'), 
      schema: z.object({
        targets: z.array(z.object({
          company: z.string().describe("企業名（実在する企業を優先）"),
          address: z.string().describe("所在地（番地まで詳しく）"),
          area: z.string().describe("エリア（例：苫小牧市）"),
          industry: z.string().describe("業種"),
          contact: z.string().describe("電話番号（不明な場合はそれらしい番号を推測、または空欄）"),
          website: z.string().describe("WebサイトURL（不明な場合は空欄）"),
          volume: z.string().describe("月間見込み排出量（例: 約200kg〜500kg / 月など、現実的な数値）"),
          priority: z.enum(['S', 'A', 'B']).describe("S: 自社置き場がありそうな地場の有力企業, A: 一般的な地場企業, B: 小規模"),
          reason: z.string().describe("営業根拠（地元での実績、資材置き場の有無、社長決済の通りやすさなど）"),
          proposal: z.string().describe("提案内容（ナゲットプラントを持つ当社の強みを活かした、社長に直接刺さるトーク内容）")
        }))
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場「月寒製作所」の超優秀な営業戦略部長です。
        以下の条件に合致する「月に数百kg〜数トンの持ち込みが期待できる、地元密着の優良企業」を${count || 5}件、深くリサーチしてリストアップしてください。
        
        【ターゲット条件】
        ・エリア: ${area || '北海道苫小牧市'}
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        
        【抽出と評価の絶対ルール（超・地場企業特化）】
        1. 🌟 大手・支店の除外: 全国展開している大手ゼネコン・サブコンの「支店・営業所」や、札幌などに本社がある大企業の支店は【絶対に除外】してください。決裁権が現場になく、既存のしがらみが強いため営業不可能です。
        2. 🎯 狙うべき企業規模: 従業員数5名〜30名程度で、本社が指定エリアにあり、社長や専務に直接営業の電話が繋がる「地元密着の地場企業（優良中小企業）」のみを厳選してください。
        3. 🔍 営業根拠の深掘り: 「地元で長くやっている」「自社の資材置き場を持っていそう」など、スクラップが溜まりやすく、かつ「社長決済で即取引開始できる」理由を具体的に書いてください。
        4. 出力データの肉厚化: 連絡先とWebサイトは可能な限り特定し、営業マンが「ここなら社長と話がつきそう！」と思えるリアルな情報を出してください。
      `
    });

    const targets = object.targets;

    for (const target of targets) {
      const payload = {
        action: 'ADD_DB_RECORD',
        sheetName: 'SalesTargets',
        data: {
          company: target.company,
          address: target.address,
          area: target.area,
          priority: target.priority,
          industry: target.industry,
          volume: target.volume, 
          contact: target.contact || '確認中',
          website: target.website || '', 
          status: '確認中',
          reason: target.reason,
          proposal: target.proposal,
          memo: ''
        }
      };

      await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true, count: targets.length, targets });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
