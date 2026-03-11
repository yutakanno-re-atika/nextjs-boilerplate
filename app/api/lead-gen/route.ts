// app/api/lead-gen/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60; // タイムアウトを最大60秒に設定

export async function POST(req: Request) {
  try {
    const { area, keyword, apiToken } = await req.json();
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    if (!apiToken) {
      return NextResponse.json({ success: false, message: "APIトークンを入力してください。" });
    }
    if (!keyword) {
      return NextResponse.json({ success: false, message: "検索キーワード（法人名の一部など）を入力してください。" });
    }

    let allInfos: any[] = [];
    let page = 1;
    const maxPages = 20; // 全国から最大2,000件（100件×20ページ）まで一気に取得する

    // 1. APIのページネーションをループで回し、全国の該当企業をごっそり取得
    while (page <= maxPages) {
      const url = `https://info.gbiz.go.jp/hojin/v1/hojin?name=${encodeURIComponent(keyword)}&page=${page}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'X-hojinInfo-api-token': apiToken
        }
      });

      if (res.status === 401) {
          return NextResponse.json({ success: false, message: "APIトークンが無効です（401エラー）。トークンを確認してください。" });
      }
      if (!res.ok) {
          break; // その他のエラー時はループを抜ける
      }

      const data = await res.json();
      const infos = data['hojin-infos'];
      
      if (!infos || infos.length === 0) {
          break; // データが尽きたら終了
      }

      allInfos = allInfos.concat(infos);

      if (data.totalPage && page >= data.totalPage) {
          break; // 最終ページに達したら終了
      }
      
      page++;
      // 連続リクエストによるAPIサーバーへの負荷を抑える
      await new Promise(resolve => setTimeout(resolve, 100)); 
    }

    // 2. 全取得したデータの中から、目的の「エリア」で正確にフィルタリング
    let targetInfos = allInfos;
    if (area) {
      targetInfos = targetInfos.filter(info => info.location && info.location.includes(area));
    }

    if (targetInfos.length === 0) {
      return NextResponse.json({ 
          success: false, 
          message: `全国で ${allInfos.length} 件の「${keyword}」を取得しましたが、エリア「${area}」に一致する企業は含まれていませんでした。` 
      });
    }

    // 3. 抽出された確実なデータをデータベース（スプレッドシート）に保存
    let savedCount = 0;
    for (const info of targetInfos) {
      const payload = {
        action: 'ADD_DB_RECORD',
        sheetName: 'SalesTargets',
        data: {
          corporateNumber: info.corporate_number || '',
          company: info.name || '',
          address: info.location || '',
          representative: info.representative_name || '',
          capital: info.capital_stock ? `${info.capital_stock.toLocaleString()}円` : '',
          employees: info.employee_number ? `${info.employee_number}名` : '',
          founded: info.date_of_establishment || info.founding_year || '',
          businessSummary: info.business_summary || '',
          area: area || '',
          industry: keyword || '',
          contact: '', 
          website: info.company_url || '',
          volume: '',
          priority: '',
          status: 'API抽出データ', 
          reason: '',
          proposal: '',
          memo: 'gBizINFO APIからの全件抽出'
        }
      };
      
      await fetch(gasUrl, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(payload) 
      });
      
      savedCount++;
      // Vercelのタイムアウト（60秒）を防ぐため、1回の処理での最大保存件数を制限
      if (savedCount >= 30) break;
      await new Promise(resolve => setTimeout(resolve, 200)); 
    }

    return NextResponse.json({ 
      success: true, 
      count: savedCount, 
      message: `全国 ${allInfos.length} 件のデータからエリアを絞り込み、${savedCount} 件の企業をDBにぶっこ抜きました！` 
    });

  } catch (error: any) {
    console.error("GBiz API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
