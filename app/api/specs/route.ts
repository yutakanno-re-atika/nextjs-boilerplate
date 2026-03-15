// app/api/specs/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const maxDuration = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const maker = searchParams.get('maker') || '';
  const name = searchParams.get('name') || '';
  const size = searchParams.get('size') || '';
  const core = searchParams.get('core') || '';

  if (!name && !maker) {
    return NextResponse.json({ success: false, message: '検索条件が不足しています' });
  }

  try {
    const specsDir = path.join(process.cwd(), 'public', 'specs');
    if (!fs.existsSync(specsDir)) {
      return NextResponse.json({ success: true, data: [] });
    }

    const files = fs.readdirSync(specsDir).filter(f => f.endsWith('.json'));
    let matchedSpecs: any[] = [];

    // 全てのカタログJSONを走査して条件に合うものを抽出
    for (const file of files) {
      const filePath = path.join(specsDir, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');
      const specs = JSON.parse(fileData);

      const matches = specs.filter((s: any) => {
        const matchMaker = maker ? (s.maker || '').includes(maker) : true;
        const matchName = name ? (s.name || '').includes(name) : true;
        // サイズや芯数が指定されていれば厳密にマッチング
        const matchSize = size ? String(s.size) === String(size) : true;
        const matchCore = core ? String(s.core) === String(core) : true;
        
        return matchMaker && matchName && matchSize && matchCore;
      });

      matchedSpecs = matchedSpecs.concat(matches);
    }

    return NextResponse.json({ success: true, data: matchedSpecs });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
