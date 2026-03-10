// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { area, industry, count } = await req.json();
    
    // ボスのGAS API URL
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // Geminiに有望な企業リストを生成・抽出させる
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'), // 速度とコストのバランスからFlashを使用（プロンプトで質を担保）
      schema: z.object({
        targets: z.array(z.object({
          company: z.string().describe("企業名（実在する企業を優先的に抽出）"),
          address: z.string().describe("所在地"),
          area: z.string().describe("エリア"),
          industry: z.string().describe("業種"),
          contact: z.string().describe("電話番号（不明な場合は空欄）"),
          priority: z.enum(['S', 'A', 'B']).describe("S: 大規模排出が見込める優良企業, A: 中規模, B: 小規模"),
          reason: z.string().describe("営業根拠（規模感、最近の施工実績、なぜ今アプローチすべきかの具体的な理由）"),
          proposal: z.string().describe("提案内容（ナゲットプラントを持つ当社の強みを活かした、相手に刺さる具体的なトーク内容）")
        }))
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場「月寒製作所（北海道苫小牧市）」の超優秀な営業戦略部長です。
        以下の条件に合致し、かつ「月に数トン単位の持ち込みが期待できる中規模以上の優良企業」を${count || 5}件、深くリサーチしてリストアップしてください。
        
        【ターゲット条件】
        ・エリア: ${area || '北海道苫小牧市'}
        ・業種: ${industry || '解体工事業、電気工事業（中規模以上）'}
        
        【抽出と評価の絶対ルール（質重視）】
        1. 規模感の推測: 資本金、従業員数、Web上の施工実績などを推測し、小規模な一人親方ではなく、継続的かつ大量に廃電線・非鉄スクラップを排出する「中規模以上の企業」を優先的に抽出してください。
        2. 営業根拠の深掘り: 単に「電気工事をしているから」ではなく、「市内で公共工事や大型ビル改修を手掛けている可能性が高い」「大規模な工場プラントの解体実績がある」など、具体的に「なぜ今、この会社に営業をかけるべきなのか」を記述してください。
        3. 提案の具体性: 月寒製作所は自社でナゲットプラント（WN-800）を保有し、被覆電線を自社で高純度銅に加工できるため、他社より圧倒的な高価買取が可能です。この強みをどう刺すか、相手の業種に合わせた具体的な提案シナリオを書いてください。
      `
    });

    const targets = object.targets;

    // 取得したターゲットをGASに順次登録（負荷軽減のため少し待機を挟む）
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
          contact: target.contact || '確認中',
          status: '確認中', // 「潜在リード (未着手)」の裏側の値
          reason: target.reason,
          proposal: target.proposal,
          memo: '' // メモは空で初期化し、営業マンが書き込めるようにする
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
