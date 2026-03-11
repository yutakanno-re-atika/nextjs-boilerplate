// app/api/lead-gen/route.ts
import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const { area, keyword } = await req.json();
    const token = "X6icE1bjfNf7BUB5iZSBuOPnuOlysZb4"; // ユーザーから提供された本物のAPIトークン
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    if (!keyword) {
      return NextResponse.json({ success: false, message: "検索キーワード（業種や企業名の一部など）を入力してください。" });
    }

    // 1. gBizINFO APIに直接リクエストを投げる
    // ※APIの仕様上、名前（キーワード）での検索を軸にし、取得後にエリアで確実にフィルタリングします
    const url = `https://info.gbiz.go.jp/hojin/v1/hojin?name=${encodeURIComponent(keyword)}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-hojinInfo-api-token': token
      }
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, message: `gBizINFO APIからの応答エラーです (ステータス: ${res.status})` });
    }

    const data = await res.json();
    let infos = data['hojin-infos'] || [];

    // 2. 指定されたエリア（所在地）で完全フィルタリング
    if (area && infos.length > 0) {
      // 例: "北海道浦河郡" などの入力に対して、文字列が含まれる法人のみを残す
      infos = infos.filter((info: any) => info.location && info.location.includes(area));
    }

    if (infos.length === 0) {
      return NextResponse.json({ success: false, message: "APIからデータを取得しましたが、指定エリアに合致する企業はありませんでした。" });
    }

    // 3. 取得した確実な公式データを、AIを介さずに直接DB（スプレッドシート）へ格納する
    let savedCount = 0;
    for (const info of infos) {
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
          status: '生データ (AI未分析)', 
          reason: '',
          proposal: '',
          memo: 'gBizINFO APIからの一括取得データ'
        }
      };
      
      await fetch(gasUrl, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      savedCount++;
      // APIやDBの書き込み上限・タイムアウト（60秒）を防ぐため、最大50件で安全に停止
      if (savedCount >= 50) break;
      
      // 連続書き込みの負荷軽減
      await new Promise(resolve => setTimeout(resolve, 200)); 
    }

    return NextResponse.json({ 
      success: true, 
      count: savedCount, 
      message: `gBizINFOから ${savedCount} 件の公式データをぶっこ抜き、データベースに格納しました。` 
    });

  } catch (error: any) {
    console.error("gBizINFO Fetch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
