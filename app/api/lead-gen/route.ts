// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // 2回AIを呼ぶため、処理時間を長めに確保

export async function POST(req: Request) {
  try {
    const { area, industry, count, teacherClients } = await req.json();
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherContext = teacherClients && teacherClients.length > 0 
        ? `\n【参考】当社の優良顧客に類似する企業を探してください:\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    // ============================================================================
    // STEP 1: 【探索係AI】 条件に合う「企業名」だけをGoogle検索で見つける
    // ============================================================================
    const step1 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0.1,
      schema: z.object({
        companyName: z.string().describe("発見した実在する企業名（株式会社などの法人格も含む）"),
        searchLog: z.string().describe("どうやって見つけたかの簡単な検索ログ")
      }),
      prompt: `
        あなたは企業のリストアップを行うリサーチャーです。Google検索を使って、以下の条件に完全に合致する、現在確実に実在する企業を【1件だけ】見つけて、その「企業名」を正確に出力してください。
        ${teacherContext}
        
        【検索条件】
        ・エリア: ${area || '北海道内の苫小牧から東、または北のエリア'}
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        
        【絶対ルール】
        1. 必ずGoogle検索を行い、ヒットした「地元密着の地場企業（従業員5〜30名規模）」を選んでください。
        2. 全国展開している大手ゼネコンの支店や、札幌本社の大企業の支店は絶対に除外してください。
        3. ここでは企業名だけが正確であれば良いです。
      `
    });

    const targetCompanyName = step1.object.companyName;

    // ============================================================================
    // STEP 2: 【調査係AI】 発見した企業名をピンポイントで調べ上げ、詳細を埋める
    // ============================================================================
    const step2 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0, // 情報の正確性を期すためゼロに
      schema: z.object({
        address: z.string().describe("【必須】所在地（都道府県から番地まで正確に）"),
        contact: z.string().describe("【必須】電話番号（公式サイトやタウンページ等で確認できる実在の番号。不明な場合は「不明」とする）"),
        website: z.string().optional().catch("").describe("WebサイトURL（公式サイトが存在する場合のみ。タウンページ等のリンクは不可。無い場合は必ず空欄にすること）"),
        volume: z.string().describe("【必須】事業規模から推測される月間見込み排出量"),
        priority: z.enum(['S', 'A', 'B']).describe("【必須】S: 自社置き場がありそう, A: 一般的, B: 小規模"),
        reason: z.string().describe("【必須】営業をかけるべき理由（地元での実績など）"),
        proposal: z.string().describe("【必須】当社の強み（ナゲットプラントによる高価買取）を活かした提案内容")
      }),
      prompt: `
        あなたは企業情報を正確にまとめるデータアナリスト兼、営業戦略部長です。
        以下の企業について【Google検索】を用いてピンポイントで調査し、詳細な情報を正確に抽出してください。
        
        【調査対象企業】
        企業名: ${targetCompanyName}
        想定エリア: ${area || '北海道'}
        
        【🚨 絶対ルール】
        1. 企業名「${targetCompanyName}」の公式情報、またはGoogleマップ、法人データベースの情報を元に、正確な「住所」と「電話番号」を出力してください。
        2. もしこの企業が公式Webサイトを持っていない場合は、websiteの項目はでっち上げずに必ず空欄（""）にしてください。
        3. この企業が排出する非鉄金属（廃電線など）を、当社（最新鋭のナゲットプラントを持つリサイクル工場）が買い取るための「営業理由」と「提案内容」を作成してください。
      `
    });

    const details = step2.object;

    // ============================================================================
    // STEP 3: GAS（データベース）へ格納
    // ============================================================================
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
        memo: `🤖 AI二段階抽出\n1. 探索: ${step1.object.searchLog}\n2. 調査完了`
      }
    };

    await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    return Response.json({ success: true, count: 1, targets: [{ company: targetCompanyName, ...details }] });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}