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

  try {
    let allSpecs: any[] = [];
    
    // ★ 防弾化: ボスが配置した可能性のあるフォルダを全て自動探索する
    const candidateDirs = [
      path.join(process.cwd(), 'public', 'spec'),   // public/spec
      path.join(process.cwd(), 'public', 'specs'),  // public/specs
      path.join(process.cwd(), 'spec'),             // ルート/spec
      path.join(process.cwd(), 'specs')             // ルート/specs
    ];

    let targetDir = '';
    for (const dir of candidateDirs) {
      if (fs.existsSync(dir)) {
        targetDir = dir;
        break;
      }
    }

    // フォルダが見つかれば中身のJSONをすべて合体させる
    if (targetDir) {
      const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = path.join(targetDir, file);
        const fileData = fs.readFileSync(filePath, 'utf-8');
        try {
          const parsed = JSON.parse(fileData);
          if (Array.isArray(parsed)) {
            allSpecs = allSpecs.concat(parsed);
          } else if (parsed && typeof parsed === 'object') {
            allSpecs.push(parsed); // 配列でないJSON構造にも対応
          }
        } catch (e) {
          console.error(`JSON Parse Error in ${file}`);
        }
      }
    }

    // フォールバック（旧式のファイルが直下にあれば拾う）
    const singleFilePath = path.join(process.cwd(), 'public', 'wire_specs.json');
    if (allSpecs.length === 0 && fs.existsSync(singleFilePath)) {
      const fileData = fs.readFileSync(singleFilePath, 'utf-8');
      allSpecs = JSON.parse(fileData);
    }

    // 絞り込み条件があればフィルタリング、無ければ全件返す
    let matchedSpecs = allSpecs;
    if (maker || name || size || core) {
      matchedSpecs = allSpecs.filter((s: any) => {
        const matchMaker = maker ? (s.maker || '').includes(maker) : true;
        const matchName = name ? (s.name || '').includes(name) : true;
        // 5.5 と 5.50 のような表記揺れを吸収するため数値で比較
        const matchSize = size ? parseFloat(s.size) === parseFloat(size) : true;
        const matchCore = core ? String(s.core) === String(core) : true;
        
        return matchMaker && matchName && matchSize && matchCore;
      });
    }

    return NextResponse.json({ success: true, data: matchedSpecs });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
