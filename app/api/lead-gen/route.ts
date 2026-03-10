// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { area, industry, count } = await req.json();
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // Geminiに有望な企業リストを「超詳細」に生成・抽出させる
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
          volume: z.string().describe("月間見込み排出量（例: 約500kg〜1t / 月）"),
          priority: z.enum(['S', 'A', 'B']).describe("S: 大規模排出, A: 中規模, B: 小規模"),
          reason: z.string().describe("営業根拠（規模感、最近の施工実績など、営業マンが『ここに行きたい！』と思える具体的な理由）"),
          proposal: z.string().describe("提案内容（ナゲットプラントを持つ当社の強みを活かした、相手に刺さる具体的なトーク内容）")
        }))
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場「月寒製作所」の超優秀な営業戦略部長です。
        以下の条件に合致する「月に数トン単位の持ち込みが期待できる中規模以上の優良企業」を${count || 5}件、深くリサーチしてリストアップしてください。
        
        【ターゲット条件】
        ・エリア: ${area || '北海道苫小牧市'}
        ・業種: ${industry || '解体工事業、電気工事業（中規模以上）'}
        
        【出力データの肉厚化（絶対ルール）】
        ただ名前を出すだけでなく、営業マンの「狩猟本能」を刺激するような肉厚なスペック情報を出してください。
        1. 連絡先とWebサイトは可能な限り特定（または推定）すること。
        2. 「月間見込み排出量」を具体的に推測すること（例: 「月間1.5t」など）。
        3. なぜ狙うべきか、どう攻めるかの「攻略法」を極めて具体的に書くこと。
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
          volume: target.volume, // ★ 追加
          contact: target.contact || '確認中',
          website: target.website || '', // ★ 追加
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
