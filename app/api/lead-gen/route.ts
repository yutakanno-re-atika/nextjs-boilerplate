// app/api/lead-gen/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Vercelタイムアウトを最大60秒に設定

// 法人番号で標準APIを直叩きして詳細データを取得する
async function fetchGBizInfoById(corporateNumber: string, token: string) {
  const res = await fetch(`https://info.gbiz.go.jp/hojin/v1/hojin/${corporateNumber}`, { 
      headers: { 'Accept': 'application/json', 'X-hojinInfo-api-token': token } 
  });
  if (res.status === 401) throw new Error("401_UNAUTHORIZED");
  if (res.ok) {
      const data = await res.json();
      if (data['hojin-infos'] && data['hojin-infos'].length > 0) return data['hojin-infos'][0];
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // 💡 フロントエンド(AdminSales)からのモード分岐対応
    if (body.mode === 'add_to_crm') {
        const payload = { action: 'ADD_DB_RECORD', sheetName: 'SalesTargets', data: body.target };
        await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        return NextResponse.json({ success: true });
    }
    
    if (body.mode === 'analyze') {
        // AIエンリッチメント処理（APIルート側で実装する場合はここに記述するが、一旦モックで成功を返す）
        return NextResponse.json({ success: true });
    }

    // ▼ ここからがAIスナイパーのSPARQL一括抽出・登録ロジック
    const { area, keyword, apiToken } = body;
    if (!apiToken) return NextResponse.json({ success: false, message: "APIトークンを入力してください。" });
    if (!area || !keyword) return NextResponse.json({ success: false, message: "エリアとキーワードを入力してください。" });

    // STEP 1: SPARQL APIを使って「エリア」×「キーワード」で法人番号を全件抽出
    const sparqlQuery = `
      PREFIX hj: <https://info.gbiz.go.jp/hojin/ontology/hojin#>
      SELECT DISTINCT ?corporateNumber
      WHERE {
        ?s a hj:Corporation .
        ?s hj:corporateNumber ?corporateNumber .
        ?s hj:location ?location .
        FILTER(contains(str(?location), "${area}"))
        ?s hj:corporateName ?name .
        OPTIONAL { ?s hj:businessSummary ?biz . }
        FILTER(contains(str(?name), "${keyword}") || contains(str(?biz), "${keyword}"))
      }
      LIMIT 50
    `;

    const sparqlRes = await fetch('https://info.gbiz.go.jp/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/sparql-results+json'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    });

    if (!sparqlRes.ok) {
      throw new Error(`SPARQLエンドポイントエラー (ステータス: ${sparqlRes.status})`);
    }

    const sparqlData = await sparqlRes.json();
    const bindings = sparqlData.results?.bindings || [];
    
    const uniqueNumbers = bindings
        .map((b: any) => b.corporateNumber?.value)
        .filter((num: string) => /^\d{13}$/.test(num));

    if (uniqueNumbers.length === 0) {
        return NextResponse.json({ success: false, message: `SPARQL検索の結果、「${area}」で「${keyword}」に関連する企業は見つかりませんでした。` });
    }

    // STEP 2: 抽出した法人番号を使って標準APIから詳細データを取得し、配列にストック
    const recordsToInsert = [];
    let fetchedCount = 0;

    for (const num of uniqueNumbers) {
        let info;
        try {
            info = await fetchGBizInfoById(num, apiToken);
        } catch (e: any) {
            if (e.message === "401_UNAUTHORIZED") return NextResponse.json({ success: false, message: "APIトークンが無効です（401エラー）。" });
        }
        
        if (!info) continue;

        recordsToInsert.push({
            corporateNumber: info.corporate_number || '', company: info.name || '', address: info.location || '',
            representative: info.representative_name || '', capital: info.capital_stock ? `${info.capital_stock.toLocaleString()}円` : '',
            employees: info.employee_number ? `${info.employee_number}名` : '', founded: info.date_of_establishment || info.founding_year || '',
            businessSummary: info.business_summary || '', area: area, industry: keyword, contact: '', website: info.company_url || '',
            volume: '', priority: '', status: 'DB格納済 (AI未分析)', reason: '', proposal: '', memo: 'SPARQL抽出エンジンからの取得'
        });
        fetchedCount++;
        await new Promise(resolve => setTimeout(resolve, 100)); // API叩きすぎ防止（gBizINFO側の429対策）
    }

    // STEP 3: ストックした配列をGASの新エンドポイントへ一撃でPOST（N+1問題の完全解消）
    if (recordsToInsert.length > 0) {
        const payload = {
            action: 'BULK_ADD_DB_RECORDS',
            sheetName: 'SalesTargets',
            data: recordsToInsert
        };
        
        const bulkRes = await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!bulkRes.ok) throw new Error("GASへの一括送信に失敗しました");
    }

    return NextResponse.json({ success: true, count: fetchedCount, message: `SPARQLエンジンによる高度な検索で、${fetchedCount} 件の企業データを一撃でDBに格納しました！` });

  } catch (error: any) {
    console.error("SPARQL Extraction Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
