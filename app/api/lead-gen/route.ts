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
        ? `\n【🧠 教師データ：当社の現在の優良顧客】\n以下の企業群と『極めて類似した事業内容・規模の企業』をGoogle検索を用いて抽出すること。\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    const { object } = await generateObject({
      // ★ 変更点1: 速度重視のFlashから、知能トップの「Pro」へ変更
      // ★ 変更点2: useSearchGroundingをtrueにし、Google検索（最新の実在確認）を強制
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      schema: z.object({
        targets: z.array(z.object({
          company: z.string().describe("【必須】企業名（Google検索で完全に実在が確認できた企業のみ）"),
          address: z.string().describe("所在地（番地まで。架空の住所は不可）"),
          area: z.string().describe("エリア（例：苫小牧市）"),
          industry: z.string().describe("業種"),
          contact: z.string().describe("【必須】電話番号（公式サイト等で確認できた実在の番号のみ）"),
          website: z.string().describe("【必須】WebサイトURL（実際にアクセス可能な実在のURLのみ）"),
          volume: z.string().describe("月間見込み排出量（推測値）"),
          priority: z.enum(['S', 'A', 'B']).describe("S: 自社置き場がありそうな地場の有力企業, A: 一般的な地場企業, B: 小規模"),
          reason: z.string().describe("営業根拠（Web検索で得た事実に基づく、地元での実績、資材置き場の有無、社長決済の通りやすさなど）"),
          proposal: z.string().describe("提案内容（ナゲットプラントを持つ当社の強みを活かしたトーク内容）")
        }))
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場の超優秀な営業戦略部長です。
        「Google検索」を必ず活用して、以下の条件に完全に合致する、**現在確実に実在し、コンタクト可能な企業**を${count || 5}件リストアップしてください。
        ${teacherContext}
        
        【ターゲット条件】
        ・エリア: ${area || '北海道苫小牧市'} （※絶対にこのエリア内に本社や主要拠点がある企業のみ）
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        
        【🚨 AIのハルシネーション（架空情報の生成）を固く禁ずる絶対ルール】
        1. 検索による実在確認の徹底: 企業名、住所、電話番号、WebサイトURLは、必ずWeb検索で実在を確認し、正確な情報を出力してください。存在しない架空の企業を作ったり、「http://www.example.com」や「0144-00-0000」などの推測データを出力した場合は致命的なエラーとみなします。
        2. 情報の完全性（除外ルール）: 連絡先（電話番号）とWebサイトURLが両方とも実在確認できた企業【のみ】を抽出してください。どちらか一方でも不明な企業は絶対に含めないでください。見つからない場合は、抽出件数が${count || 5}件未満になっても構いません。
        3. 大手・支店の除外: 全国展開している大手ゼネコン・サブコンの「支店・営業所」や、札幌などに本社がある大企業の支店は【絶対に除外】してください。
        4. 狙うべき企業規模: 従業員数5名〜30名程度で、社長や専務に直接営業の電話が繋がる「地元密着の地場企業」のみを厳選してください。
      `
    });

    const targets = object.targets;

    // 取得したターゲットをGASに順次登録
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

      await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true, count: targets.length, targets });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
