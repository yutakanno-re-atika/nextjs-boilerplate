import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

// スクレイピング対象の定義
const TARGETS: Record<string, { name: string, url: string }> = {
  "sapporo": { name: "札幌銅リサイクル", url: "https://sapporo-recycle.com/" },
  "rec": { name: "REC環境サービス", url: "http://colors.main.jp/" },
  "ohata": { name: "大畑商事", url: "https://www.ohata.org/kakaku.html" }
};

// 当社の20品目スキーマ定義（AIに絶対にこの型で返させる）
const priceSchema = z.object({
  "光線（ピカ線、特号）": z.number().nullable().describe("ピカ線、特一号など"),
  "1号線": z.number().nullable().describe("1号銅、黒ずみ"),
  "2号線": z.number().nullable().describe("2号銅"),
  "上銅": z.number().nullable().describe("上銅、上故銅"),
  "並銅": z.number().nullable().describe("並銅、なみどう"),
  "下銅": z.number().nullable().describe("下銅、下故銅"),
  "山行銅": z.number().nullable().describe("山行銅、山銅、銅ダスト"),
  "ビスマス砲金": z.number().nullable().describe("ビスマス砲金"),
  "砲金": z.number().nullable().describe("砲金、青銅（バルブ、メーター、ダスト除く）"),
  "メッキ砲金": z.number().nullable().describe("メッキ砲金、メッキ青銅"),
  "バルブ砲金": z.number().nullable().describe("バルブ砲金"),
  "込砲金": z.number().nullable().describe("込砲金、砲金ダスト"),
  "込中": z.number().nullable().describe("込真鍮、真鍮、黄銅"),
  "山行中": z.number().nullable().describe("山行中、山真鍮、ミックスメタル"),
  "被覆線80%": z.number().nullable().describe("80%線、1本線、8割"),
  "被覆線70%": z.number().nullable().describe("70%線、7割"),
  "被覆線60%": z.number().nullable().describe("60%線、65%線、6割、CV線"),
  "被覆線50%": z.number().nullable().describe("50%線、5割"),
  "被覆線40%": z.number().nullable().describe("40%線、4割、VA線、VVF、Fケーブル"),
  "雑線": z.number().nullable().describe("雑線、家電線、通信線（80~40%以外のもの）")
});

// 強靭なHTML取得（WAF回避プロキシ付き）
async function fetchSiteText(url: string) {
  const options = {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
  };
  try {
    const res = await fetch(url, options);
    if (res.ok) {
      const html = await res.text();
      return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000);
    }
  } catch (e) { console.error("Direct fetch failed", e); }
  
  // フォールバック（プロキシ経由）
  try {
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
    const res = await fetch(proxyUrl, options);
    if (res.ok) {
      const html = await res.text();
      return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000);
    }
  } catch (e) { console.error("Proxy fetch failed", e); }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const targetKey = body.targetKey;
    const target = TARGETS[targetKey];
    
    if (!target) {
      return Response.json({ status: 'error', message: 'Invalid target' }, { status: 400 });
    }

    const text = await fetchSiteText(target.url);
    if (!text) {
      return Response.json({ status: 'error', message: 'HTMLの取得に失敗しました' }, { status: 500 });
    }

    const nowStr = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // AIによる意味的マッピング抽出
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: priceSchema,
      prompt: `
      あなたは非鉄金属・スクラップ業界のプロの査定員です。
      以下のテキストは、競合他社のWebサイトから取得した本日の価格表の生データです。
      このデータから、当社の規定する20品目に最も適した価格（1kgあたりの円、数値のみ）を抽出してください。
      
      【業界の翻訳ルール（厳守）】
      - 「1本線」「8割」は『被覆線80%』
      - 「CV線」は『被覆線60%』
      - 「VA線」「VVF」「Fケーブル」は『被覆線40%』
      - 「家電線」は『雑線』
      - 「真鍮」「込真鍮」は『込中』
      - 「ミックスメタル」は『山行中』
      - 「ピカ銅」「特一号」は『光線（ピカ線、特号）』
      - 「上故銅」は『上銅』
      
      該当する項目がない場合、または判断がつかない場合は null を設定してください。
      出力はカンマを含まない純粋な数値（例: 1450）のみ。
      
      【対象テキスト】
      ${text}
      `
    });

    return Response.json({
      status: 'success',
      data: {
        name: target.name,
        lastUpdated: nowStr,
        prices: object
      }
    });

  } catch (error: any) {
    console.error("Scraping AI Error:", error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
