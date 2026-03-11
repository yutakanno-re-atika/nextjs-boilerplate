// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// ★ 3つのAIを連続で動かすため、Vercelのタイムアウトを長めに設定（※Vercel Proなら最大300秒まで可能）
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const { area, industry, teacherClients } = await req.json();
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherContext = teacherClients && teacherClients.length > 0 
        ? `\n【参考】当社の優良顧客に類似する企業を探してください:\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    // ============================================================================
    // 🕵️‍♂️ STEP 1: 【探索AI (Scout)】 条件に合う「企業名」を探す
    // ============================================================================
    const step1 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0.3, // 少しだけ幅を持たせて探させる
      schema: z.object({
        companyName: z.string().describe("発見した実在する企業名（株式会社などの法人格も含む）"),
        searchLog: z.string().describe("検索のプロセス")
      }),
      prompt: `
        あなたは探索特化型のリサーチャーです。Google検索を使い、以下の条件に合致する「現在確実に実在する企業」を【1件だけ】見つけてください。
        ${teacherContext}
        【検索条件】
        ・エリア: ${area || '北海道内の苫小牧から東、または北のエリア'}
        ・業種: ${industry || '解体工事業、電気工事業、設備工事業'}
        ※全国展開のゼネコン支店などは避け、地元密着の企業を狙ってください。
      `
    });

    const targetCompanyName = step1.object.companyName;

    // ============================================================================
    // 🔬 STEP 2: 【分析AI (Analyzer)】 企業名を深掘りし、データを抽出する
    // ============================================================================
    const step2 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0, // 事実のみを出力させるためゼロ
      schema: z.object({
        address: z.string().describe("所在地（都道府県から番地まで）"),
        contact: z.string().describe("電話番号（不明な場合は「不明」）"),
        website: z.string().optional().catch("").describe("WebサイトURL（無い場合は空欄）"),
        volume: z.string().describe("事業規模から推測される月間見込み排出量"),
        priority: z.enum(['S', 'A', 'B']).describe("S: 自社置き場あり, A: 一般的, B: 小規模"),
        reason: z.string().describe("営業をかけるべき理由"),
        proposal: z.string().describe("当社の強みを活かした提案内容")
      }),
      prompt: `
        あなたはデータ抽出特化型のアナリストです。
        【Google検索】を用いて「${targetCompanyName} (エリア: ${area || '北海道'})」という企業を徹底的に調査し、詳細情報を抽出してください。
        公式サイトがない場合は、websiteは必ず空欄（""）にすること。無理にURLを作らないでください。
      `
    });

    const details = step2.object;

    // ============================================================================
    // ⚖️ STEP 3: 【真偽ジャッジAI (Judge)】 抽出されたデータが本物か、条件を満たすか検閲する
    // ============================================================================
    const step3 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0, // 冷徹な判断をさせるためゼロ
      schema: z.object({
        isPassed: z.boolean().describe("審査に合格したか（合格ならtrue, 嘘や条件違反があればfalse）"),
        judgeReason: z.string().describe("審査の理由（なぜ合格/不合格にしたのか）")
      }),
      prompt: `
        あなたは冷徹な品質管理監査官です。
        以下の企業データが「本当に実在するか」「ハルシネーション（AIの嘘）が含まれていないか」「大企業の支店ではないか」をGoogle検索を用いて最終確認してください。

        【監査対象データ】
        企業名: ${targetCompanyName}
        住所: ${details.address}
        電話番号: ${details.contact}
        URL: ${details.website || 'なし'}
        対象指定エリア: ${area || '北海道'}

        【審査基準】
        1. 住所が実在し、対象指定エリア内にあるか？（エリア外なら不合格: false）
        2. 電話番号の市外局番は住所と一致しているか？「0000」などの適当な番号ではないか？（おかしい場合は不合格: false）
        3. 誰もが知る大企業（例：鹿島建設、関電工など）の「〇〇支店」「〇〇営業所」ではないか？（支店なら不合格: false）
        4. URLが「example.com」や他の企業のものではないか？
        
        少しでも疑わしい点があれば容赦なく isPassed を false にしてください。
      `
    });

    const judge = step3.object;

    // ============================================================================
    // 🏁 最終判定
    // ============================================================================
    
    // 審査に落ちた場合は、DBに登録せずにエラーメッセージを返す
    if (!judge.isPassed) {
      return Response.json({ 
        success: false, 
        message: `【AI監査によりリジェクト】\n企業名: ${targetCompanyName}\n理由: ${judge.judgeReason}\n（不正確なデータのため登録をスキップしました）` 
      });
    }

    // 審査を通過した場合のみ、GAS（データベース）へ格納
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
        memo: `🤖 AIトリプルチェック通過\n⚖️ 監査官の評価: ${judge.judgeReason}`
      }
    };

    await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

    return Response.json({ 
      success: true, 
      count: 1, 
      targets: [{ company: targetCompanyName, ...details }] 
    });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}