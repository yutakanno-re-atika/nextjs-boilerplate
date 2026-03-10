// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { area, industry, count, teacherClients } = await req.json();
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherContext = teacherClients && teacherClients.length > 0 
        ? `\n【🧠 教師データ：当社の現在の優良顧客】\n以下の企業群と『極めて類似した事業内容・規模の企業』を抽出すること。\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    const { object } = await generateObject({
      // ★ 型チェックエラーを回避して、Google検索（Search Grounding）を強制的に有効化する
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      schema: z.object({
        targets: z.array(z.object({
          company: z.string().min(2).describe("【必須】企業名（完全に実在が確認できる企業のみ。株式会社などを正しく含める）"),
          address: z.string().min(5).describe("【必須】所在地（都道府県から番地まで。架空の住所は不可）"),
          area: z.string().describe("【必須】エリア（例：帯広市、釧路市、旭川市など）"),
          industry: z.string().describe("【必須】業種（例：電気工事業、解体工事業など）"),
          contact: z.string().regex(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/).describe("【必須】電話番号（公式サイト等で確認できる実在の番号のみ）"),
          website: z.string().optional().catch("").describe("WebサイトURL（確実に実在する場合のみ。見つからない、または確証がない場合は絶対に空欄にする）"),
          volume: z.string().describe("【必須】月間見込み排出量（推測値）"),
          priority: z.enum(['S', 'A', 'B']).describe("【必須】S: 自社置き場がありそうな地場の有力企業, A: 一般的な地場企業, B: 小規模"),
          reason: z.string().describe("【必須】営業根拠（地元での実績、資材置き場の有無、社長決済の通りやすさなど）"),
          proposal: z.string().describe("【必須】提案内容（ナゲットプラントを持つ当社の強みを活かしたトーク内容）")
        })).length(1).describe("必ず1件のみ出力すること")
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場の超優秀な営業戦略部長です。
        【Google検索】を駆使して、以下の条件に完全に合致する、**現在確実に実在し、コンタクト可能な企業**を【厳選して1件だけ】抽出してください。
        ${teacherContext}
        
        【ターゲット条件】
        ・エリア: ${area || '北海道内の苫小牧から東、または北のエリア'}
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        
        【🚨 AIのハルシネーション（架空情報の生成）を固く禁ずる絶対ルール】
        1. リアルタイム検索の強制: あなたの学習データ（過去の記憶）だけで回答しないでください。必ずGoogle検索を使用し、現在その企業がその住所に実在するか、電話番号が正しいかを確認してください。
        2. URLの取り扱い: URLが「http://www.example.com」などの適当なものになるくらいなら、いっそ空文字（""）にして出力してください。絶対に推測でURLを作らないこと。
        3. 大手・支店の除外: 全国展開の大手ゼネコンの「支店・営業所」や、札幌本社の大企業の支店は【絶対に除外】してください。
        4. 狙うべき企業規模: 従業員数5名〜30名程度で、社長や専務に直接アプローチ可能な「地元密着の地場企業」を1件だけ厳選してください。
        
        思考プロセス：
        「○○市 解体工事」等で検索 -> ヒットした企業の公式サイトを確認 -> 住所と電話番号が正しいか検証 -> 条件を満たせば出力、満たさなければ別の企業を検索。
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
          contact: target.contact,
          website: target.website || '',
          status: '未確認',
          reason: target.reason,
          proposal: target.proposal,
          memo: '🤖 AIスナイパー抽出（Google検索グラウンディング適用）'
        }
      };

      await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true, count: targets.length, targets });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}