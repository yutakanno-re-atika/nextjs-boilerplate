import { NextResponse } from 'next/server';

// ★ここにあなたのGASのURLを貼り付けてください（引用符 ' ' を忘れずに！）
const HARDCODED_GAS_URL = 'https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec'; 

export async function GET() {
  // 環境変数がなくても、直書きURLがあれば動きます
  const GAS_URL = process.env.GAS_API_URL || HARDCODED_GAS_URL;
  
  if (!GAS_URL) {
    return NextResponse.json({ status: 'error', message: 'URL is missing' }, { status: 500 });
  }

  try {
    // タイムアウト対策とキャッシュ無効化を追加
    const res = await fetch(GAS_URL, { 
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(10000) // 10秒でタイムアウト
    });
    
    if (!res.ok) {
        // GAS側がエラー（404や401）を返した場合
        const text = await res.text();
        console.error("GAS Error Response:", text);
        return NextResponse.json({ status: 'error', message: `GAS responded with ${res.status}: ${text}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Fetch failed:", error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const GAS_URL = process.env.GAS_API_URL || HARDCODED_GAS_URL;

  try {
    const body = await req.json();
    const res = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
