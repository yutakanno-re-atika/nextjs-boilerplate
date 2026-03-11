// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // Vercelのタイムアウト制限

// ============================================================================
// 🏛️ 経済産業省 gBizINFO API ヘルパー関数 (ハルシネーション率0%の絶対的ファクト)
// ============================================================================
async function fetchGBizInfo(companyName: string, areaHint: string) {
  // ボスから提供された本物のAPIトークン
  const token = "X6icE1bjfNf7BUB5iZSBuOPnuOlysZb4";
  
  // 「株式会社」等がついていると検索ヒット率が落ちるため、クレンジングする
  const cleanName = companyName.replace(/(株式会社|有限会社|合同会社|一般社団法人|財団法人)/g, '').trim();
  
  const url = `https://info.gbiz.go.jp/hojin/v1/hojin?name=${encodeURIComponent(cleanName)}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': token
      }
    });
    
    if (!res.ok) {
        console.error("gBizINFO Error:", res.status);
        return null;
    }
    
    const data = await res.json();
    const infos = data['hojin-infos'];
    
    if (infos && infos.length > 0) {
      // 複数ヒットした場合、対象エリア（例: "北海道"）を含むものを優先して返す
      const shortArea = areaHint.substring(0, 2); 
      const matched = infos.find((i: any) => i.location && i.location.includes(shortArea));
      return matched || infos[0]; // なければ一番上の結果を返す
    }
    return null;
  } catch (e) {
    console.error("gBizINFO API 実行エラー:", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode || 'auto'; 
    
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherClients = body.teacherClients || [];
    const teacherContext = teacherClients.length > 0 
        ? `\n【参考】当社の優良顧客の事業内容:\n` + teacherClients.map((c:any) => `- ${c.name} (業種: ${c.industry})`).join('\n')
        : '';

    // ============================================================================
    // 🎯 モード: CATCH (名簿ガサッとコピペ → 経産省API直結スクリーニング)
    // ============================================================================
    if (mode === 'catch') {
      const { inputText, area, industry } = body;
      
      // STEP 1: AIに「テキストから企業名だけ」を抽出させる（余計なことは考えさせない）
      const extraction = await generateObject({
        // @ts-ignore
        model: google('gemini-2.5-pro'), 
        temperature: 0,
        schema: z.object({
          companies: z.array(z.string()).max(5).describe("抽出した企業名のリスト")
        }),
        prompt: `
          以下のテキスト（名簿などの乱雑なデータ）から、電気工事・解体工事・設備工事などに関連しそうな有望な「企業名」だけを最大5件抽出してください。
          企業名のみの配列を返してください。
          
          テキスト:
          ${inputText}
        `
      });

      const extractedNames = extraction.object.companies;
      if (!extractedNames || extractedNames.length === 0) {
          return Response.json({ success: false, message: "テキストから有望な企業名を見つけられませんでした。" });
      }

      // STEP 2: 抽出した企業名を【経産省のAPI】に投げて、実在確認＆正確なデータを引き抜く
      const gBizPromises = extractedNames.map(name => fetchGBizInfo(name, area || '北海道'));
      const gBizResults = await Promise.all(gBizPromises);
      
      // 経産省のDBに存在した（本物の）企業だけを残す
      const validGBizDatas = gBizResults.filter(data => data !== null);

      if (validGBizDatas.length === 0) {
          return Response.json({ success: false, message: "抽出した企業は国のデータベース上で実在確認できませんでした（個人事業主、または名称不一致）。" });
      }

      // STEP 3: 本物の確定データだけをAIに渡し、並列処理で「連絡先検索」と「営業DM生成」を実行させる
      const analysisPromises = validGBizDatas.map(async (gBizData: any) => {
          try {
              const analysis = await generateObject({
                // @ts-ignore
                model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
                temperature: 0,
                schema: z.object({
                  contact: z.string().describe("電話番号（推測せず、Google検索で確認できたもののみ。不明な場合は「不明」）"),
                  industry: z.string().describe("推測される詳細な業種"),
                  volume: z.string().describe("月間見込み排出量（推測）"),
                  priority: z.enum(['S', 'A', 'B']),
                  reason: z.string().describe("営業をかけるべき理由"),
                  proposal: z.string().describe("ナゲットプラントを活かした提案シナリオ"),
                  salesPitch: z.string().describe("この企業に送る、超カスタマイズされた営業メッセージ（300字程度）")
                }),
                prompt: `
                  あなたはデータアナリスト兼営業マンです。以下の【国の確定データベース情報】を元に、Google検索で「電話番号」を裏付け調査し、営業戦略を立ててください。
                  絶対に架空の情報をでっち上げないでください。
                  
                  【確定データ（ファクト）】
                  法人番号: ${gBizData.corporate_number}
                  企業名: ${gBizData.name}
                  所在地: ${gBizData.location}
                  代表者: ${gBizData.representative_name || '情報なし'}
                  事業概要: ${gBizData.business_summary || '情報なし'}
                  URL: ${gBizData.company_url || 'なし'}
                  ${teacherContext}
                `
              });

              return {
                 company: gBizData.name,
                 corporateNumber: gBizData.corporate_number,
                 address: gBizData.location,
                 area: area || '北海道',
                 website: gBizData.company_url || '',
                 ...analysis.object
              };
          } catch (e) {
              return null; // AIエラーが出た個体はスキップ
          }
      });

      const processedTargets = (await Promise.all(analysisPromises)).filter(t => t !== null);

      // STEP 4: GASへ順番に登録
      for (const target of processedTargets) {
          if (!target) continue;
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
              website: target.website,
              status: '未確認',
              reason: target.reason,
              proposal: target.proposal,
              memo: `【法人番号】${target.corporateNumber}\n\n【🤖 AI作成 DM・FAX送信用原稿】\n${target.salesPitch}`
            }
          };
          await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          await new Promise(resolve => setTimeout(resolve, 500));
      }

      return Response.json({ success: true, count: processedTargets.length, targets: processedTargets });
    }

    // ============================================================================
    // 🎯 モード: AUTO (既存のAI自動探索も、経産省APIを通すように改修)
    // ============================================================================
    const { area, industry } = body;
    
    // 1. AIに適当に1件探させる
    const step1 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0.3,
      schema: z.object({ companyName: z.string() }),
      prompt: `Google検索で以下の条件に合致する「実在する企業」を【1件だけ】見つけてください。\nエリア: ${area || '北海道'}, 業種: ${industry || '電気工事業'}`
    });

    const targetCompanyName = step1.object.companyName;

    // 2. 経産省APIで実在確認（存在しなければ即リジェクト）
    const gBizData = await fetchGBizInfo(targetCompanyName, area || '北海道');
    if (!gBizData) {
        return Response.json({ success: false, message: `【システム監査リジェクト】\n企業名: ${targetCompanyName}\n理由: 国のデータベース(gBizINFO)に登録がない、または名称が不一致のため、ハルシネーションと判定し処理を中断しました。` });
    }

    // 3. 確定データを使ってAIに分析・補完させる
    const step3 = await generateObject({
      // @ts-ignore
      model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
      temperature: 0,
      schema: z.object({
        contact: z.string(), industry: z.string(), volume: z.string(),
        priority: z.enum(['S', 'A', 'B']), reason: z.string(), proposal: z.string(), salesPitch: z.string()
      }),
      prompt: `以下の【国の確定データベース情報】を元にGoogle検索で「電話番号」を調べ、営業戦略を立ててください。\n法人番号: ${gBizData.corporate_number}\n企業名: ${gBizData.name}\n所在地: ${gBizData.location}\nURL: ${gBizData.company_url || 'なし'}`
    });

    const details = step3.object;

    // 4. GASへ登録
    const payload = {
      action: 'ADD_DB_RECORD',
      sheetName: 'SalesTargets',
      data: {
        company: gBizData.name, address: gBizData.location, area: area || '北海道', priority: details.priority,
        industry: details.industry, volume: details.volume, contact: details.contact === '不明' ? '' : details.contact,
        website: gBizData.company_url || '', status: '未確認', reason: details.reason, proposal: details.proposal,
        memo: `【法人番号】${gBizData.corporate_number}\n\n【🤖 AI作成 DM・FAX送信用原稿】\n${details.salesPitch}`
      }
    };

    await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return Response.json({ success: true, count: 1, targets: [{ company: gBizData.name, ...details }] });

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
