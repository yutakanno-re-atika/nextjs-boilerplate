// app/api/gas/route.ts
import { NextResponse } from 'next/server';

// ★ 追加: Next.jsのキャッシュを強制的に無効化し、常に最新をGASへ取りに行く
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const maxDuration = 60;

const HARDCODED_GAS_URL = 'https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec'; 

export async function GET(req: Request) {
  const GAS_URL = process.env.GAS_API_URL || HARDCODED_GAS_URL;
  
  if (!GAS_URL || GAS_URL.includes('XXXXXXXXXXXXXXXXXXXXX')) {
    return NextResponse.json({ status: 'error', message: 'URL not set' }, { status: 500 });
  }

  try {
    // キャッシュバスターを付けて強制フェッチ
    const timestamp = new Date().getTime();
    const fetchUrl = `${GAS_URL}?t=${timestamp}`;
    
    const res = await fetch(fetchUrl, { cache: 'no-store' });
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
