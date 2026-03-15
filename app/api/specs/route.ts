// app/api/specs/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const maxDuration = 10;

export async function GET(req: Request) {
  try {
    let allSpecs: any[] = [];
    
    // ボスが配置した可能性のあるフォルダを全て自動探索
    const candidateDirs = [
      path.join(process.cwd(), 'public', 'spec'),
      path.join(process.cwd(), 'public', 'specs'),
      path.join(process.cwd(), 'spec'),
      path.join(process.cwd(), 'specs')
    ];

    let targetDir = '';
    for (const dir of candidateDirs) {
      if (fs.existsSync(dir)) {
        targetDir = dir;
        break;
      }
    }

    if (targetDir) {
      const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const filePath = path.join(targetDir, file);
        const fileData = fs.readFileSync(filePath, 'utf-8');
        try {
          const parsed = JSON.parse(fileData);
          const dataArray = Array.isArray(parsed) ? parsed : [parsed];
          
          // ★ Data Cleansing: 自明なメーカー名の欠損のみ補完（数値の偽装は絶対にしない）
          const cleansedData = dataArray.map(s => {
            let makerName = String(s.maker || '').trim();
            if (!makerName || makerName === '-' || makerName === '不明') {
                const fname = file.toLowerCase();
                if (fname.includes('fujikura')) makerName = 'フジクラ';
                else if (fname.includes('fuji')) makerName = '富士電線';
                else if (fname.includes('sumitomo')) makerName = '住電HST';
                else if (fname.includes('yazaki')) makerName = '矢崎';
                else makerName = '不明';
            }

            return {
              ...s,
              maker: makerName
            };
          });

          allSpecs = allSpecs.concat(cleansedData);
        } catch (e) {
          console.error(`JSON Parse Error in ${file}`);
        }
      }
    }

    // フォールバック
    const singleFilePath = path.join(process.cwd(), 'public', 'wire_specs.json');
    if (allSpecs.length === 0 && fs.existsSync(singleFilePath)) {
      const fileData = fs.readFileSync(singleFilePath, 'utf-8');
      allSpecs = JSON.parse(fileData);
    }

    return NextResponse.json({ success: true, data: allSpecs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
