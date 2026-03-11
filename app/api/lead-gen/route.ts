// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; 

// ============================================================================
// 🏛️ 経済産業省 gBizINFO API ヘルパー関数
// ============================================================================

// 1. 法人番号(ID)で直接叩く（最強・最速・100%正確）
async function fetchGBizInfoById(corporateNumber: string) {
  const token = "X6icE1bjfNf7BUB5iZSBuOPnuOlysZb4";
  try {
     const res = await fetch(`https://info.gbiz.go.jp/hojin/v1/hojin/${corporateNumber}`, { 
         headers: { 'Accept': 'application/json', 'X-hojinInfo-api-token': token } 
     });
     if (res.ok) {
        const data = await res.json();
        if (data['hojin-infos'] && data['hojin-infos'].length > 0) return data['hojin-infos'][0];
     }
  } catch(e) {}
  return null;
}

// 2. 企業名で検索する（IDがない場合のフォールバック）
async function fetchGBizInfoByName(companyName: string) {
  const token = "X6icE1bjfNf7BUB5iZSBuOPnuOlysZb4";
  const cleanName = companyName.replace(/(株式会社|有限会社|合同会社|一般社団法人|財団法人)/g, '').trim();
  try {
    const res = await fetch(`https://info.gbiz.go.jp/hojin/v1/hojin?name=${encodeURIComponent(cleanName)}`, { 
        headers: { 'Accept': 'application/json', 'X-hojinInfo-api-token': token } 
    });
    if (res.ok) {
        const data = await res.json();
        if (data['hojin-infos'] && data['hojin-infos'].length > 0) return data['hojin-infos'][0];
    }
  } catch(e) {}
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body.mode || 'auto'; 
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    const teacherClients = body.teacherClients || [];
    const teacherContext = teacherClients.length > 0 ? `\n【参考】当社の優良顧客: ` + teacherClients.map((c:any) => c.name).join(', ') : '';

    // ============================================================================
    // 🧠 共通のAI分析・GAS登録処理（RAGの後半部分）
    // ============================================================================
    const analyzeAndSaveTargets = async (gBizDatas: any[], searchArea: string, searchIndustry: string) => {
        const analysisPromises = gBizDatas.map(async (gBizData: any) => {
            try {
                const analysis = await generateObject({
                  // @ts-ignore
                  model: google('gemini-2.5-pro', { useSearchGrounding: true }), temperature: 0,
                  schema: z.object({
                    contact: z.string().describe("電話番号（推測せずGoogle検索で確認できたもののみ。不明なら「不明」）"),
                    volume: z.string().describe("事業規模から推測される月間見込み排出量"),
                    priority: z.enum(['S', 'A', 'B']),
                    reason: z.string().describe("営業をかけるべき理由"),
                    proposal: z.string().describe("ナゲットプラントを活かした提案シナリオ"),
                    salesPitch: z.string().describe("この企業に送る、超カスタマイズされた営業メッセージ（300字程度）")
                  }),
                  prompt: `以下の【国の確定データベース情報】を元にGoogle検索で「電話番号」を裏付け調査し、営業戦略を立ててください。\n法人番号: ${gBizData.corporate_number}\n企業名: ${gBizData.name}\n所在地: ${gBizData.location}\n事業概要: ${gBizData.business_summary || '情報なし'}\n${teacherContext}`
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
            await new Promise(resolve => setTimeout(resolve, 500)); // スプレッドシートの書き込み負荷軽減
        }
        return processedTargets;
    };

    // ============================================================================
    // 🎯 モード: CATCH (法人番号 直接ぶっこ抜き RAG)
    // ============================================================================
    if (mode === 'catch') {
      const { inputText, area, industry } = body;
      
      let gBizDatas = [];
      
      // 💡 超高速・確実なアプローチ：テキストから「13桁の数字」を正規表現で直接ぶっこ抜く
      const corporateNumbers = inputText.match(/\b[1-9]\d{12}\b/g) || [];
      const uniqueNumbers = [...new Set(corporateNumbers)].slice(0, 10); // Vercelのタイムアウト対策で最大10件
      
      if (uniqueNumbers.length > 0) {
          // 法人番号が見つかった場合、AIを使わずに経産省APIを直叩きして確定データを取得
          console.log("法人番号を検出:", uniqueNumbers);
          const promises = uniqueNumbers.map(num => fetchGBizInfoById(num));
          const results = await Promise.all(promises);
          gBizDatas = results.filter(data => data !== null);
      } else {
          // 法人番号がないテキストの場合は、従来のAIによる企業名抽出にフォールバック
          const extraction = await generateObject({
            // @ts-ignore
            model: google('gemini-2.5-pro'), temperature: 0,
            schema: z.object({ companies: z.array(z.string()).max(10) }),
            prompt: `以下のテキストから企業名（株式会社〇〇など）だけを最大10件抽出してください。\n${inputText}`
          });
          const extractedNames = extraction.object.companies || [];
          const promises = extractedNames.map(name => fetchGBizInfoByName(name));
          const results = await Promise.all(promises);
          gBizDatas = results.filter(data => data !== null);
      }

      if (gBizDatas.length === 0) return Response.json({ success: false, message: "抽出した企業は国のデータベース上で実在確認できませんでした。" });

      // 確定データをAIに渡して分析＆DB登録
      const processedTargets = await analyzeAndSaveTargets(gBizDatas, area || '北海道', industry || '不明');
      return Response.json({ success: true, count: processedTargets.length, targets: processedTargets });
    }

    // ============================================================================
    // 🔄 モード: SYNC (既存リスト一括同期) 
    // ============================================================================
    if (mode === 'sync') {
      const { targets } = body; 
      let syncCount = 0;

      for (const t of targets) {
        const gBizData = await fetchGBizInfoByName(t.company);
        if (gBizData) {
          const updates = {
            1: gBizData.corporate_number || '', 3: gBizData.location || '', 4: gBizData.representative_name || '',
            5: gBizData.capital_stock ? `${gBizData.capital_stock.toLocaleString()}円` : '', 6: gBizData.employee_number ? `${gBizData.employee_number}名` : '',
            7: gBizData.date_of_establishment || gBizData.founding_year || '', 8: gBizData.business_summary || '', 12: gBizData.company_url || ''
          };
          await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: t.id, updates }) });
          syncCount++;
          await new Promise(resolve => setTimeout(resolve, 300)); 
        }
      }
      return Response.json({ success: true, message: `${syncCount}件の企業データをgBizINFOの公式データで上書き・補完しました！` });
    }

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
