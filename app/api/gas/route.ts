// app/api/gas/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const GAS_URL = process.env.GAS_API_URL;
  
  if (!GAS_URL) {
    return NextResponse.json({ status: 'error', message: 'GAS_API_URL is not defined' }, { status: 500 });
  }

  try {
    const res = await fetch(GAS_URL, { next: { revalidate: 0 } }); // 常に最新を取得
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to fetch from GAS' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const GAS_URL = process.env.GAS_API_URL;

  if (!GAS_URL) {
    return NextResponse.json({ status: 'error', message: 'GAS_API_URL is not defined' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const res = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Failed to post to GAS' }, { status: 500 });
  }
}
