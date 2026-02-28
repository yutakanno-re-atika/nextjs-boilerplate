import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Vercelのタイムアウト対策（長めの思考時間を許可）
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { area, industry, count } = await req.json();
    
    // ボスのGAS API URL
    const gasUrl = "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // Geminiに有望な企業リストを生成・抽出させる
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: z.object({
        targets: z.array(z.object({
          company: z.string().describe("企業名（実在する企業を優先的に抽出）"),
          address: z.string().describe("所在地（北海道内）"),
          area: z.string().describe("エリア（例：苫小牧市、札幌市、千歳市など）"),
          industry: z.string().describe("業種（解体業、電気設備工事、通信工事など）"),
          contact: z.string().describe("電話番号（不明な場合は空欄）"),
          priority: z.enum(['S', 'A', 'B']).describe("AIが判定する営業の優先度（CV線など高歩留まりの排出が見込める規模が大きい業者ほどS）"),
          reason: z.string().describe("営業をかけるべき理由（推測される排出物など）"),
          proposal: z.string().describe("営業時の提案内容（月寒製作所のナゲットプラントの強みを活かしたアプローチ）")
        }))
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場「月寒製作所（北海道苫小牧市）」の優秀なAI営業部長です。
        以下の条件に合致する、実在する可能性の高い企業（またはリアルな想定企業）を${count || 5}件リストアップしてください。
        
        【ターゲット条件】
        ・エリア: ${area || '北海道 道央・道南エリア（苫小牧、札幌、千歳など）'}
        ・業種: ${industry || '解体業、電気設備工事、通信工事'}
        
        【出力時の思考プロセス】
        - 解体業者は、古いビルや工場の解体から「太いCV線」や「鉄骨に付随する非鉄」が大量に出るため優先度が高いです。
        - 電気設備・通信工事業者は、「VVFケーブル」や「通信線」が定期的に排出されます。
        - 月寒製作所は「自社ナゲットプラント」を持っているため、被覆電線の買取に圧倒的な強みがあります。提案内容にはその強みを活かしたアプローチを含めてください。
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
          status: '未確認',
          reason: target.reason,
          proposal: target.proposal,
          memo: '🤖 AIによる自動抽出ターゲット'
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