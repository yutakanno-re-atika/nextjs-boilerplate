// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { industry, teacherClients } = await req.json();
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherContext = teacherClients && teacherClients.length > 0 
        ? `\n【🧠 教師データ：当社の現在の優良顧客】\n以下の企業群と『極めて類似した事業内容・規模の企業』を抽出すること。\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    const { object } = await generateObject({
      model: google('gemini-2.5-pro'), 
      schema: z.object({
        targets: z.array(z.object({
          company: z.string().min(2).describe("【必須】企業名（完全に実在が確認できる企業のみ。株式会社などを正しく含める）"),
          address: z.string().min(5).describe("【必須】所在地（都道府県から番地まで。架空の住所は不可）"),
          area: z.string().describe("【必須】エリア（例：帯広市、釧路市、旭川市など）"),
          industry: z.string().describe("【必須】業種（例：電気工事業、解体工事業など）"),
          // 電話番号のフォーマットを厳密にチェック（架空番号を弾く）
          contact: z.string().regex(/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/).describe("【必須】電話番号（公式サイト等で確認できる実在の番号のみ。0000などの架空番号は絶対不可）"),
          // URLフォーマットの厳密チェック
          website: z.string().url().describe("【必須】WebサイトURL（実際にアクセス可能な実在のURLのみ。example.com等は不可）"),
          volume: z.string().describe("【必須】月間見込み排出量（推測値）"),
          priority: z.enum(['S', 'A', 'B']).describe("【必須】S: 自社置き場がありそうな地場の有力企業, A: 一般的な地場企業, B: 小規模"),
          reason: z.string().describe("【必須】営業根拠（地元での実績、資材置き場の有無、社長決済の通りやすさなど）"),
          proposal: z.string().describe("【必須】提案内容（ナゲットプラントを持つ当社の強みを活かしたトーク内容）")
        })).length(1).describe("必ず1件のみ出力すること") // ★ 1件のみに強制固定
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場の超優秀な営業戦略部長です。
        以下の条件に完全に合致する、**現在確実に実在し、コンタクト可能な企業**を【厳選して1件だけ】抽出してください。
        ${teacherContext}
        
        【ターゲット条件】
        ・エリア: 北海道内の「苫小牧から東、および北のエリア」（例：胆振東部、日高、十勝、釧路、根室、上川、オホーツクなど）に限定。
        　※札幌圏（石狩・空知・後志）や道南（函館など）は対象外としてください。
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        
        【🚨 AIのハルシネーション（架空情報の生成）を固く禁ずる絶対ルール】
        1. 確実な実在確認: 企業名、住所（番地まで）、電話番号（正しい市外局番）、WebサイトURLが、現時点で確実に実在するものだけを選んでください。
        2. 架空データの禁止: 「0144-00-0000」や「http://www.example.com」などのプレースホルダーや推測データを出力することは致命的なエラーです。
        3. 情報の完全性: 連絡先（電話番号）とWebサイトURLの両方が存在しない企業は絶対に除外してください。
        4. 大手・支店の除外: 全国展開の大手ゼネコンの「支店・営業所」や、札幌本社の大企業の支店は【絶対に除外】してください。
        5. 狙うべき企業規模: 従業員数5名〜30名程度で、社長や専務に直接アプローチ可能な「地元密着の地場企業」を1件だけ厳選してください。
        
        思考プロセスとして、まず該当する企業を脳内で検索し、その企業の公式サイトが存在するか、電話番号の市外局番がエリアと一致するかを厳密に検証してから、最終的な1件を出力してください。
      `
    });

    const targets = object.targets;

    // 取得したターゲットをGASに登録
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
          website: target.website, 
          status: '未確認',
          reason: target.reason,
          proposal: target.proposal,
          memo: '🤖 AIスナイパー抽出（高精度1件抽出モード）'
        }
      };

      await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      // 負荷対策のウェイト
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true, count: targets.length, targets });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
