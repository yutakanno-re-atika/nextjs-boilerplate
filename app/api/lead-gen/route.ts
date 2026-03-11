// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; 

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
        temperature: 0, // 法人番号を扱うため完全な「事実」のみに固定
        schema: z.object({
          targets: z.array(z.object({
            company: z.string().describe("企業名（株式会社などの法人格を正確に）"),
            corporateNumber: z.string().describe("【重要】国税庁登録の13桁の法人番号（法人の場合は必須。どうしても見つからない場合は「個人事業主等」とする）"),
            address: z.string().describe("所在地（都道府県から番地まで正確に）"),
            area: z.string().describe("市町村レベルのエリア名"),
            contact: z.string().describe("電話番号（不明な場合は「不明」）"),
            website: z.string().optional().catch("").describe("WebサイトURL（無い場合は空欄）"),
            industry: z.string().describe("業種"),
            volume: z.string().describe("事業規模から推測される月間見込み排出量"),
            priority: z.enum(['S', 'A', 'B']).describe("S: 自社置き場ありそう, A: 一般的, B: 小規模"),
            reason: z.string().describe("なぜこの企業を選んだか。営業をかけるべき理由"),
            // ★ 修正: proposal を復活させました
            proposal: z.string().describe("当社の強み（ナゲットプラント）を活かした提案シナリオ"),
            salesPitch: z.string().describe("この企業のお問い合わせフォームやFAXにそのまま送れる、カスタマイズされた営業メッセージ（挨拶、事業への言及、当社ナゲットプラントの強みを含む300字程度）")
          })).max(5).describe("入力テキストの中から、有望な企業を最大5件まで抽出すること")
        }),
        prompt: `
          あなたは非鉄金属リサイクル工場の超優秀なデータアナリスト兼、敏腕営業マンです。
          ユーザーから提供された【入力テキスト（役場の名簿やWebのコピペなど）】を読み解き、
          当社にとって有望な営業ターゲット（電気工事、解体工事など）を【最大5件まで】ピックアップしてください。
          ${teacherContext}
          
          【ターゲット条件】
          ・エリアの目安: ${area || '北海道'}
          ・業種の目安: ${industry || '解体工事業、電気工事業、設備工事業'}
          
          【🚨 実在証明の絶対ルール（ハルシネーション完全排除）】
          1. 候補をピックアップしたら、必ず【Google検索】を用いてその企業の「13桁の法人番号（国税庁データ）」を検索・確認してください。
          2. 法人番号が存在しない、あるいは実在が疑わしい企業はリストから除外してください。
          3. 電話番号と住所は、その法人番号に紐づく正確な情報を使用してください。
          4. もし公式サイトを持っていなければ、websiteは無理に作らず必ず空欄（""）にすること。
          
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
              // メモ欄に法人番号と、自動生成されたDM文面を保存
              memo: `【法人番号】${target.corporateNumber}\n\n【🤖 AI作成 DM・FAX送信用原稿】\n${target.salesPitch}`
            }
          };
          await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          await new Promise(resolve => setTimeout(resolve, 500));
      }

      return Response.json({ success: true, count: targets.length, targets });
    }

    // ============================================================================
    // 🎯 モード: AUTO (既存のAI自動探索)
    // ============================================================================
    const { area, industry } = body;
    const step1 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0.3,
      schema: z.object({ companyName: z.string(), searchLog: z.string() }),
      prompt: `あなたは探索特化型リサーチャーです。Google検索を使い、以下の条件に合致する「現在確実に実在する企業」を【1件だけ】見つけてください。\n${teacherContext}\n【条件】エリア: ${area || '北海道'}, 業種: ${industry || '解体工事業、電気工事業、設備工事業'}`
    });

    const targetCompanyName = step1.object.companyName;

    const step2 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0,
      schema: z.object({
        address: z.string(), contact: z.string(), website: z.string().optional().catch(""),
        volume: z.string(), priority: z.enum(['S', 'A', 'B']), reason: z.string(), proposal: z.string(), // ★ 修正
        corporateNumber: z.string().describe("国税庁登録の13桁の法人番号（法人の場合必須）"),
        salesPitch: z.string().describe("DM・FAX用のパーソナライズされた営業文章")
      }),
      prompt: `あなたはデータ抽出特化型アナリストです。【Google検索】を用いて「${targetCompanyName} (エリア: ${area || '北海道'})」という企業を徹底的に調査し、詳細情報を抽出してください。必ず13桁の法人番号を確認し、実在証明としてください。公式サイトがない場合はwebsiteは必ず空欄（""）にすること。`
    });

    const details = step2.object;

    const step3 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0,
      schema: z.object({ isPassed: z.boolean(), judgeReason: z.string() }),
      prompt: `あなたは監査官です。以下の企業データが「本当に実在するか（法人番号があるか）」をGoogle検索を用いて最終確認してください。\n企業名: ${targetCompanyName} / 住所: ${details.address} / 電話: ${details.contact} / 法人番号: ${details.corporateNumber}\n疑わしい点があれば容赦なく isPassed を false にしてください。`
    });

    const judge = step3.object;

    if (!judge.isPassed) return Response.json({ success: false, message: `【AI監査によりリジェクト】\n企業名: ${targetCompanyName}\n理由: ${judge.judgeReason}` });

    const payload = {
      action: 'ADD_DB_RECORD',
      sheetName: 'SalesTargets',
      data: {
        company: targetCompanyName, address: details.address, area: area || '北海道', priority: details.priority,
        industry: industry || '不明', volume: details.volume, contact: details.contact === '不明' ? '' : details.contact,
        website: details.website === '不明' ? '' : details.website, status: '未確認', reason: details.reason, proposal: details.proposal,
        memo: `【法人番号】${details.corporateNumber}\n\n【🤖 AI作成 DM・FAX送信用原稿】\n${details.salesPitch}\n\n(監査: ${judge.judgeReason})`
      }
    };

    await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return Response.json({ success: true, count: 1, targets: [{ company: targetCompanyName, ...details }] });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}