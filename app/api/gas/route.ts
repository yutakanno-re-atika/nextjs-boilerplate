import { NextResponse } from 'next/server';

// ★ここにGASのウェブアプリURLを貼り付けてください（シングルクォート '' で囲む）
const HARDCODED_GAS_URL = 'https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec'; 

export async function GET() {
  const GAS_URL = process.env.GAS_API_URL || HARDCODED_GAS_URL;
  
  if (!GAS_URL || GAS_URL.includes('XXXXXXXXXXXXXXXXXXXXX')) {
    return NextResponse.json({ status: 'error', message: 'URL not set' }, { status: 500 });
  }

  try {
    const res = await fetch(GAS_URL, { next: { revalidate: 0 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
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
