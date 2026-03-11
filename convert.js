// convert.js
const fs = require('fs');
const readline = require('readline');

// ボスがアップロードしたCSVファイル名に合わせています
const inputFile = 'extracted_hokkaido_electric.csv'; 
const outputFile = 'public/hokkaido_electric.json'; // Next.jsが読み込める公開フォルダへ保存

// CSVの「カンマ区切り」を正確に分割する関数
function parseCSVLine(line) {
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
  return line.split(regex).map(item => item.replace(/^"|"$/g, '').trim());
}

const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  output: process.stdout,
  terminal: false
});

let isHeader = true;
const results = [];

rl.on('line', (line) => {
  if (isHeader) {
    isHeader = false;
  } else {
    const values = parseCSVLine(line);
    if (values.length > 6) {
      // システムで使う項目だけを抽出して極限まで軽くする
      results.push({
        id: values[0],              // 法人番号
        company: values[1],         // 企業名
        address: values[6],         // 住所
        representative: values[17] || '', 
        capital: values[18] || '',
        employees: values[19] || '',
        founded: values[26] || '',
        businessSummary: values[22] || '',
        website: values[23] || ''
      });
    }
  }
});

rl.on('close', () => {
  if (!fs.existsSync('public')) fs.mkdirSync('public'); // publicフォルダがなければ作成
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`✨ 変換完了！ ${results.length}件の軽量データベースを ${outputFile} に生成しました。`);
});