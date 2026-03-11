// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; 

// ============================================================================
// 🏛️ 経済産業省 gBizINFO API ヘルパー関数
// ============================================================================
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
      const shortArea = areaHint ? areaHint.substring(0, 2) : ''; 
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

    // ============================================================================
    // 🔄 モード: SYNC (既存リストの法人番号・公式データ 一括エンリッチメント)
    // ============================================================================
    if (mode === 'sync') {
      const { targets } = body; // 画面から送られてきた企業リスト [{id, company, area}, ...]
      let syncCount = 0;

      for (const t of targets) {
        const gBizData = await fetchGBizInfo(t.company, t.area || '北海道');
        if (gBizData) {
          // GASの UPDATE_DB_RECORD を使って、各列(Index)を一気に上書きする
          // 新しいシート構成の列インデックス: B(1)=CorpNum, D(3)=address, E(4)=rep, F(5)=cap, G(6)=emp, H(7)=found, I(8)=bizSummary, M(12)=website
          const updates = {
            1: gBizData.corporate_number || '',
            3: gBizData.location || '',
            4: gBizData.representative_name || '',
            5: gBizData.capital_stock ? `${gBizData.capital_stock.toLocaleString()}円` : '',
            6: gBizData.employee_number ? `${gBizData.employee_number}名` : '',
            7: gBizData.date_of_establishment || gBizData.founding_year || '',
            8: gBizData.business_summary || '',
            12: gBizData.company_url || ''
          };

          await fetch(gasUrl, { 
            method: 'POST', headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: t.id, updates }) 
          });
          syncCount++;
          await new Promise(resolve => setTimeout(resolve, 300)); // API負荷対策
        }
      }
      return Response.json({ success: true, message: `${syncCount}件の企業データをgBizINFOの公式データで上書き・補完しました！` });
    }

    // ============================================================================
    // 🎯 モード: CATCH (名簿ガサッとコピペ → 経産省API直結スクリーニング)
    // ============================================================================
    if (mode === 'catch') {
      const { inputText, area, industry, teacherClients } = body;
      const teacherContext = teacherClients && teacherClients.length > 0 ? `\n【参考】当社の優良顧客: ` + teacherClients.map((c:any) => c.name).join(', ') : '';
      
      const extraction = await generateObject({
        // @ts-ignore
        model: google('gemini-2.5-pro'), temperature: 0,
        schema: z.object({ companies: z.array(z.string()).max(5) }),
        prompt: `以下のテキストから電気工事・解体工事などに関連しそうな「企業名」だけを最大5件抽出してください。\n${inputText}`
      });

      const extractedNames = extraction.object.companies;
      if (!extractedNames || extractedNames.length === 0) return Response.json({ success: false, message: "企業名が見つかりませんでした。" });

      const gBizPromises = extractedNames.map(name => fetchGBizInfo(name, area || '北海道'));
      const gBizResults = await Promise.all(gBizPromises);
      const validGBizDatas = gBizResults.filter(data => data !== null);

      if (validGBizDatas.length === 0) return Response.json({ success: false, message: "抽出した企業は国のデータベース上で実在確認できませんでした。" });

      const analysisPromises = validGBizDatas.map(async (gBizData: any) => {
          try {
              const analysis = await generateObject({
                // @ts-ignore
                model: google('gemini-2.5-pro', { useSearchGrounding: true }), temperature: 0,
                schema: z.object({
                  contact: z.string(), industry: z.string(), volume: z.string(), priority: z.enum(['S', 'A', 'B']),
                  reason: z.string(), proposal: z.string(), salesPitch: z.string()
                }),
                prompt: `以下の【国の確定データベース情報】を元にGoogle検索で「電話番号」を裏付け調査し、営業戦略を立ててください。\n法人番号: ${gBizData.corporate_number}\n企業名: ${gBizData.name}\n事業概要: ${gBizData.business_summary || '情報なし'}\n${teacherContext}`
              });

              return {
                 corporateNumber: gBizData.corporate_number, company: gBizData.name, address: gBizData.location,
                 representative: gBizData.representative_name || '', capital: gBizData.capital_stock ? `${gBizData.capital_stock.toLocaleString()}円` : '',
                 employees: gBizData.employee_number ? `${gBizData.employee_number}名` : '', founded: gBizData.date_of_establishment || gBizData.founding_year || '',
                 businessSummary: gBizData.business_summary || '', area: area || '北海道', website: gBizData.company_url || '',
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
              // ★ 新しいシート構成に合わせたデータ構造
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

      return Response.json({ success: true, count: processedTargets.length, targets: processedTargets });
    }

    // ※AUTOモードは文字数制限のため今回は一旦割愛し、CATCHとSYNCに特化させています。

  } catch (error: any) {
    console.error("Lead Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
