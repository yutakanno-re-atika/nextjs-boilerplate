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
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0, // ★ 創造性を完全にゼロにし、事実のみを出力させる
      schema: z.object({
        targets: z.array(z.object({
          // ★ AIに「まず検索と確認のプロセス」を自白させる（Chain of Thought）
          search_reasoning: z.string().describe("【必須】Google検索で使用したキーワード、情報を取得した元サイト名、実在確認の思考プロセスを記述してください。"),
          company: z.string().min(2).describe("【必須】企業名（完全に実在が確認できる企業のみ）"),
          address: z.string().min(5).describe("【必須】所在地（架空の住所は不可）"),
          area: z.string().describe("【必須】エリア（例：帯広市、釧路市など）"),
          industry: z.string().describe("【必須】業種（例：電気工事業、解体工事業など）"),
          contact: z.string().describe("【必須】電話番号（実在の番号のみ。不明な場合は「不明」とする）"),
          // ★ url()の厳格な縛りを外し、空欄を許容する
          website: z.string().describe("WebサイトURL（公式サイトが存在する場合のみ。iタウンページ等のリンクは不可。無い場合は必ず空欄にすること）"),
          volume: z.string().describe("【必須】月間見込み排出量（推測値）"),
          priority: z.enum(['S', 'A', 'B']).describe("【必須】S: 自社置き場がありそうな地場の有力企業, A: 一般的な地場企業, B: 小規模"),
          reason: z.string().describe("【必須】営業根拠"),
          proposal: z.string().describe("【必須】提案内容")
        })).length(1).describe("必ず1件のみ出力すること")
      }),
      prompt: `
        あなたは非鉄金属リサイクル工場の超優秀な営業戦略部長です。
        【Google検索】を駆使して、以下の条件に完全に合致する、**現在確実に実在する企業**を【厳選して1件だけ】抽出してください。
        ${teacherContext}
        
        【ターゲット条件】
        ・エリア: ${area || '北海道内の苫小牧から東、または北のエリア'}
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        
        【🚨 ハルシネーション（架空情報の生成）を完全に防ぐための絶対ルール】
        1. 地方の中小企業（電気工事や解体など）は、**「自社のWebサイト（公式サイト）を持っていない」ことが非常に多い**です。その場合は、絶対にURLをでっち上げたり、iタウンページやハローワークのURLを入れたりせず、**「website」の項目は堂々と空欄（""）にしてください。**
        2. 電話番号や住所は、Googleマップや電話帳データベース（実在する情報）から取得したものだけを記載してください。
        3. まず「search_reasoning」の項目で、「〇〇市 電気工事で検索した結果、〇〇という企業が見つかった。公式サイトは無いが、Googleマップで実在を確認した」といったプロセスを必ず文章化してから、他の項目を埋めてください。
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
          contact: target.contact === '不明' ? '' : target.contact,
          website: target.website === '不明' ? '' : target.website,
          status: '未確認',
          reason: target.reason,
          proposal: target.proposal,
          // ★ メモ欄にAIの思考プロセスを記録して後から人間が確認できるようにする
          memo: `🤖 AI思考プロセス:\n${target.search_reasoning}`
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