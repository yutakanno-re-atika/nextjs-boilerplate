// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // タイムアウト制限

// 🏛️ 経済産業省 gBizINFO API ヘルパー関数
async function fetchGBizInfo(companyName: string, areaHint: string) {
  const token = "X6icE1bjfNf7BUB5iZSBuOPnuOlysZb4";
  const cleanName = companyName.replace(/(株式会社|有限会社|合同会社|一般社団法人|財団法人)/g, '').trim();
  const url = `https://info.gbiz.go.jp/hojin/v1/hojin?name=${encodeURIComponent(cleanName)}`;
  
  try {
    const res = await fetch(url, { headers: { 'Accept': 'application/json', 'X-hojinInfo-api-token': token } });
    if (!res.ok) return null;
    
    const data = await res.json();
    const infos = data['hojin-infos'];
    
    if (infos && infos.length > 0) {
      // エリアのヒント（例：「浦河」）が含まれるものを優先してマッチング
      const shortArea = areaHint ? areaHint.replace(/(都|道|府|県|市|郡|町|村)/g, '').substring(0, 2) : ''; 
      const matched = shortArea ? infos.find((i: any) => i.location && i.location.includes(shortArea)) : null;
      return matched || infos[0]; 
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode || 'auto'; 
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // 教師データコンテキスト
    const teacherClients = body.teacherClients || [];
    const teacherContext = teacherClients.length > 0 
        ? `\n【参考】当社の優良顧客: ` + teacherClients.map((c:any) => c.name).join(', ') : '';

    // 共通の分析・登録処理（CATCHでもAUTOでも使用）
    const analyzeAndSaveTargets = async (gBizDatas: any[], searchArea: string, searchIndustry: string) => {
        const analysisPromises = gBizDatas.map(async (gBizData: any) => {
            try {
                const analysis = await generateObject({
                  // @ts-ignore
                  model: google('gemini-2.5-pro', { useSearchGrounding: true }), temperature: 0,
                  schema: z.object({
                    contact: z.string().describe("電話番号（推測せず、Google検索で確認できたもののみ。不明なら「不明」）"),
                    volume: z.string().describe("事業規模から推測される月間見込み排出量"),
                    priority: z.enum(['S', 'A', 'B']),
                    reason: z.string().describe("営業をかけるべき理由"),
                    proposal: z.string().describe("ナゲットプラントを活かした提案シナリオ"),
                    salesPitch: z.string().describe("この企業に送る、超カスタマイズされた営業メッセージ（300字程度）")
                  }),
                  prompt: `以下の【国の確定データベース情報】を元にGoogle検索で「電話番号」を裏付け調査し、営業戦略を立ててください。\n法人番号: ${gBizData.corporate_number}\n企業名: ${gBizData.name}\n事業概要: ${gBizData.business_summary || '情報なし'}\n${teacherContext}`
                });

                return {
                   corporateNumber: gBizData.corporate_number, company: gBizData.name, address: gBizData.location,
                   representative: gBizData.representative_name || '', capital: gBizData.capital_stock ? `${gBizData.capital_stock.toLocaleString()}円` : '',
                   employees: gBizData.employee_number ? `${gBizData.employee_number}名` : '', founded: gBizData.date_of_establishment || gBizData.founding_year || '',
                   businessSummary: gBizData.business_summary || '', area: searchArea, website: gBizData.company_url || '', industry: searchIndustry,
                   ...analysis.object
                };
            } catch (e) { return null; }
        });

        const processedTargets = (await Promise.all(analysisPromises)).filter(t => t !== null);

        for (const target of processedTargets) {
            if (!target) continue;
            const payload = {
              action: 'ADD_DB_RECORD',
              sheetName: 'SalesTargets',
              data: {
                corporateNumber: target.corporateNumber, company: target.company, address: target.address,
                representative: target.representative, capital: target.capital, employees: target.employees,
                founded: target.founded, businessSummary: target.businessSummary, area: target.area,
                industry: target.industry, contact: target.contact, website: target.website, volume: target.volume,
                priority: target.priority, status: '未確認', reason: target.reason, proposal: target.proposal,
                memo: `【🤖 AI作成 DM・FAX送信用原稿】\n${target.salesPitch}`
              }
            };
            await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return processedTargets;
    };

    // ============================================================================
    // 🎯 モード: AUTO (エリア・業種から全自動一括取得 ＆ gBizINFO検証)
    // ============================================================================
    if (mode === 'auto') {
      const { area, industry } = body;

      // STEP 1: Google検索を使って、指定エリアの該当企業を大量にリストアップさせる
      const extraction = await generateObject({
        // @ts-ignore
        model: google('gemini-2.5-pro', { useSearchGrounding: true }), temperature: 0.1,
        schema: z.object({ companies: z.array(z.string()).max(10).describe("発見した企業名のリスト") }),
        prompt: `あなたは探索特化型リサーチャーです。Google検索を使い、「${area || '北海道'}」で「${industry || '電気工事'}」を営む実在の法人（株式会社や有限会社）を、可能な限り多く（最大10社）リストアップしてください。企業名のみの配列を返してください。`
      });

      const extractedNames = extraction.object.companies;
      if (!extractedNames || extractedNames.length === 0) return Response.json({ success: false, message: "該当エリアに企業が見つかりませんでした。" });

      // STEP 2: 見つけた企業名を経産省APIに通して「本物の法人」だけを残す
      const gBizPromises = extractedNames.map(name => fetchGBizInfo(name, area || '北海道'));
      const gBizResults = await Promise.all(gBizPromises);
      const validGBizDatas = gBizResults.filter(data => data !== null);

      if (validGBizDatas.length === 0) return Response.json({ success: false, message: `検索で ${extractedNames.length} 件抽出しましたが、国のデータベース(gBizINFO)で実在確認できた法人がありませんでした。` });

      // STEP 3: 分析＆DB登録
      const processedTargets = await analyzeAndSaveTargets(validGBizDatas, area || '北海道', industry || '不明');
      return Response.json({ success: true, count: processedTargets.length, targets: processedTargets });
    }

    // ============================================================================
    // 🎯 モード: CATCH (名簿ガサッとコピペからの抽出・リサーチ)
    // ============================================================================
    if (mode === 'catch') {
      const { inputText, area, industry } = body;
      const extraction = await generateObject({
        // @ts-ignore
        model: google('gemini-2.5-pro'), temperature: 0,
        schema: z.object({ companies: z.array(z.string()).max(10) }),
        prompt: `以下のテキストから電気工事・解体工事などに関連しそうな「企業名」だけを最大10件抽出してください。\n${inputText}`
      });

      const extractedNames = extraction.object.companies;
      if (!extractedNames || extractedNames.length === 0) return Response.json({ success: false, message: "企業名が見つかりませんでした。" });

      const gBizPromises = extractedNames.map(name => fetchGBizInfo(name, area || '北海道'));
      const gBizResults = await Promise.all(gBizPromises);
      const validGBizDatas = gBizResults.filter(data => data !== null);

      if (validGBizDatas.length === 0) return Response.json({ success: false, message: "抽出した企業は国のデータベース上で実在確認できませんでした。" });

      const processedTargets = await analyzeAndSaveTargets(validGBizDatas, area || '北海道', industry || '不明');
      return Response.json({ success: true, count: processedTargets.length, targets: processedTargets });
    }

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
