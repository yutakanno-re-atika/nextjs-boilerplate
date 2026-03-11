// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // 最大60秒の思考時間を許可

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode || 'auto'; 
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherClients = body.teacherClients || [];
    const teacherContext = teacherClients.length > 0 
        ? `\n【参考】当社の優良顧客に類似する企業を探してください:\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    // ============================================================================
    // 🎯 モード: CATCH (名簿ガサッとコピペからの抽出・リサーチ)
    // ============================================================================
    if (mode === 'catch') {
      const { inputText, area, industry } = body;
      
      const catchResult = await generateObject({
        // @ts-ignore
        model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
        temperature: 0.1, // 探索の余地を少し残しつつ、正確性を重視
        schema: z.object({
          targets: z.array(z.object({
            company: z.string().describe("企業名（株式会社などの法人格も含む）"),
            address: z.string().describe("所在地（都道府県から番地まで正確に）"),
            area: z.string().describe("市町村レベルのエリア名"),
            contact: z.string().describe("電話番号（不明な場合は「不明」）"),
            website: z.string().optional().catch("").describe("WebサイトURL（無い場合は空欄）"),
            industry: z.string().describe("業種"),
            volume: z.string().describe("事業規模から推測される月間見込み排出量"),
            priority: z.enum(['S', 'A', 'B']).describe("S: 自社置き場ありそう, A: 一般的, B: 小規模"),
            reason: z.string().describe("なぜこの企業を選んだか。営業をかけるべき理由"),
            proposal: z.string().describe("当社の強み（ナゲットプラント）を活かした提案内容")
          })).max(5).describe("入力テキストの中から、有望な企業を最大5件まで抽出すること") // ★ 最大5件に制限してタイムアウトを防ぐ
        }),
        prompt: `
          あなたは非鉄金属リサイクル工場の超優秀なデータアナリスト兼、敏腕営業マンです。
          ユーザーから提供された【乱雑な入力テキスト（役場の名簿やWebのコピペなど）】を読み解き、
          当社にとって有望な営業ターゲット（電気工事、解体工事など）を【最大5件まで】ピックアップしてください。
          ${teacherContext}
          
          【ターゲット条件】
          ・エリアの目安: ${area || '北海道'}
          ・業種の目安: ${industry || '解体工事業、電気工事業、設備工事業'}
          
          【🚨 絶対ルール】
          1. 候補をピックアップしたら、必ず【Google検索】を用いてその企業の実在確認を行い、正確な「住所」と「電話番号」を取得して出力してください。
          2. もし公式サイトを持っていなければ、websiteは無理に作らず必ず空欄（""）にすること。
          3. ゴミのような無関係なテキストや、対象外の企業（大手ゼネコン、飲食店など）は無視してください。
          
          【入力テキスト（名簿・リスト等）】
          ${inputText}
        `
      });

      const targets = catchResult.object.targets;
      if (!targets || targets.length === 0) {
          return Response.json({ success: false, message: "有望なターゲットが見つかりませんでした。" });
      }
      
      // GASへ順番に登録
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
              memo: `🤖 AI名簿スクリーニング抽出\n（ユーザーが提供したリストから有望企業を自動選定）`
            }
          };
          await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          await new Promise(resolve => setTimeout(resolve, 500));
      }

      return Response.json({ success: true, count: targets.length, targets });
    }

    // ============================================================================
    // 🎯 モード: AUTO (旧：AI自律探索トリプルエージェント Beta)
    // ============================================================================
    const { area, industry } = body;

    // STEP 1: 探索AI (Scout)
    const step1 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0.3,
      schema: z.object({
        companyName: z.string().describe("発見した実在する企業名（株式会社などの法人格も含む）"),
        searchLog: z.string().describe("検索プロセス")
      }),
      prompt: `あなたは探索特化型リサーチャーです。Google検索を使い、以下の条件に合致する「現在確実に実在する企業」を【1件だけ】見つけてください。\n${teacherContext}\n【条件】エリア: ${area || '北海道'}, 業種: ${industry || '解体工事業、電気工事業、設備工事業'}`
    });

    const targetCompanyName = step1.object.companyName;

    // STEP 2: 分析AI (Analyzer)
    const step2 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0,
      schema: z.object({
        address: z.string().describe("所在地（都道府県から番地まで）"),
        contact: z.string().describe("電話番号（不明な場合は「不明」）"),
        website: z.string().optional().catch("").describe("WebサイトURL（無い場合は空欄）"),
        volume: z.string().describe("事業規模から推測される月間見込み排出量"),
        priority: z.enum(['S', 'A', 'B']).describe("S: 自社置き場あり, A: 一般的, B: 小規模"),
        reason: z.string().describe("営業をかけるべき理由"),
        proposal: z.string().describe("当社の強みを活かした提案内容")
      }),
      prompt: `あなたはデータ抽出特化型アナリストです。【Google検索】を用いて「${targetCompanyName} (エリア: ${area || '北海道'})」という企業を徹底的に調査し、詳細情報を抽出してください。公式サイトがない場合はwebsiteは必ず空欄（""）にすること。`
    });

    const details = step2.object;

    // STEP 3: 真偽ジャッジAI (Judge)
    const step3 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0,
      schema: z.object({
        isPassed: z.boolean().describe("審査に合格したか"),
        judgeReason: z.string().describe("審査の理由")
      }),
      prompt: `あなたは監査官です。以下の企業データが「本当に実在するか」「大企業の支店ではないか」をGoogle検索を用いて最終確認してください。\n企業名: ${targetCompanyName} / 住所: ${details.address} / 電話: ${details.contact} / URL: ${details.website || 'なし'} / エリア: ${area || '北海道'}`
    });

    const judge = step3.object;

    if (!judge.isPassed) {
      return Response.json({ success: false, message: `【AI監査によりリジェクト】\n企業名: ${targetCompanyName}\n理由: ${judge.judgeReason}` });
    }

    const payload = {
      action: 'ADD_DB_RECORD',
      sheetName: 'SalesTargets',
      data: {
        company: targetCompanyName,
        address: details.address,
        area: area || '北海道',
        priority: details.priority,
        industry: industry || '不明',
        volume: details.volume, 
        contact: details.contact === '不明' ? '' : details.contact,
        website: details.website === '不明' ? '' : details.website,
        status: '未確認',
        reason: details.reason,
        proposal: details.proposal,
        memo: `🤖 AI自動探索(Beta)通過\n⚖️ 監査評価: ${judge.judgeReason}`
      }
    };

    await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    return Response.json({ success: true, count: 1, targets: [{ company: targetCompanyName, ...details }] });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}