// extract.js
const fs = require('fs');
const readline = require('readline');

// ==========================================
// 🎯 抽出条件の設定
// ==========================================
// ※先ほど成功した「正しいパス」をそのまま使ってください
const inputFile = "Kihonjoho_UTF-8.csv"; 
const outputFile = 'extracted_hokkaido_electric.csv'; // 出力ファイル名もわかりやすく変更

const targetArea = '"北海道"'; // 確実性を上げるためダブルクォーテーション込みで指定

// 💡 抽出したい関連キーワードを配列で指定（どれか1つでも含まれていればOK）
const targetKeywords = [
  '電気',
  '電建',
  '電工',
  '電設',
  '電業',
  '通信',
  '設備' // 必要に応じて「配線」「システム」などを追加・削除してください
];
// ==========================================

console.log('🚀 北海道全域の電気・通信系企業の抽出を開始します...');
console.log(`🔍 検索キーワード: ${targetKeywords.join(', ')}`);

const rl = readline.createInterface({
  input: fs.createReadStream(inputFile),
  output: process.stdout,
  terminal: false
});

const writeStream = fs.createWriteStream(outputFile);

let count = 0;
let matchCount = 0;

rl.on('line', (line) => {
  // 1行目（ヘッダー）はそのまま書き出す
  if (count === 0) {
    writeStream.write(line + '\n');
  } else {
    // 条件1: 「北海道」が含まれているか
    const isAreaMatch = line.includes(targetArea);
    
    // 条件2: キーワード配列のうち、どれか1つでも含まれているか（OR検索）
    const isKeywordMatch = targetKeywords.some(keyword => line.includes(keyword));
    
    // 両方の条件を満たした場合のみ抽出
    if (isAreaMatch && isKeywordMatch) {
      writeStream.write(line + '\n');
      matchCount++;
    }
  }
  
  count++;
  if (count % 500000 === 0) {
    console.log(`⏳ ${count.toLocaleString()}行 読み込み完了... 現在の抽出件数: ${matchCount}件`);
  }
});

rl.on('close', () => {
  console.log('=========================================');
  console.log(`✨ 抽出完了！`);
  console.log(`📍 対象エリア: ${targetArea}`);
  console.log(`🔍 全 ${count.toLocaleString()}行 の中から、条件に合う ${matchCount}件 を抜き出しました。`);
  console.log(`📁 抽出結果は [ ${outputFile} ] に保存されています。`);
  console.log('=========================================');
});