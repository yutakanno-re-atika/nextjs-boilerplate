// app/api/competitors/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// スクレイピングとAI推論には時間がかかるため、タイムアウトを延長
export const maxDuration = 60;

// 自社の20品目マスターのスキーマ定義
const priceSchema = z.object({
  "光線（ピカ線、特号）": z.number().nullable().describe("ピカ線、特1号銅線、光特号など"),
  "1号線": z.number().nullable().describe("1号銅線、黒ずみなど"),
  "2号線": z.number().nullable().describe("2号銅線など"),
  "上銅": z.number().nullable().describe("上銅、上故銅、付物のある銅など"),
  "並銅": z.number().nullable().describe("並銅など"),
  "下銅": z.number().nullable().describe("下銅、下故銅など"),
  "山行銅": z.number().nullable().describe("山銅、山行銅、銅ダストなど"),
  "ビスマス砲金": z.number().nullable().describe("ビスマス砲金"),
  "砲金": z.number().nullable().describe("砲金、青銅（バルブやメーターを除く）"),
  "メッキ砲金": z.number().nullable().describe("メッキ砲金、メッキ青銅"),
  "バルブ砲金": z.number().nullable().describe("バルブ砲金"),
  "込砲金": z.number().nullable().describe("込砲金、砲金ダスト"),
  "込中": z.number().nullable().describe("込真鍮、真鍮、黄銅など"),
  "山行中": z.number().nullable().describe("山行中、山真鍮、ミックスメタルなど"),
  "被覆線80%": z.number().nullable().describe("80%線、1本線、8割銅線など"),
  "被覆線70%": z.number().nullable().describe("70%線、7割など"),
  "被覆線60%": z.number().nullable().describe("60%線、65%線、CV線など"),
  "被覆線50%": z.number().nullable().describe("50%線、5割など"),
  "被覆線40%": z.number().nullable().describe("40%線、VA線、VVF、Fケーブルなど"),
  "雑線": z.number().nullable().describe("雑線、家電線、通信線など")
});

const TARGETS = [
  { name: "札幌銅リサイクル", url: "https://sapporo-recycle.com/" },
  { name: "REC環境サービス", url: "https://colors.main.jp/" },
  { name: "大畑商事", url: "https://www.ohata.org/kakaku.html" }
];

async function fetchSiteText(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
      },
      next: { revalidate: 0 }
    });
    const html = await res.text();
    // HTMLタグを消し去り、純粋なテキストのみを抽出（先頭5000文字で価格表は網羅できる）
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 5000);
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return "";
  }
}

export async function POST() {
  try {
    const results = [];
    const nowStr = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // 3社のサイトを並列で取得・AI解析
    const promises = TARGETS.map(async (target) => {
      const text = await fetchSiteText(target.url);
      if (!text) return null;

      // Geminiによる意味的マッピング抽出
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
        
        該当する項目がない場合、または判断がつかない場合は null を設定してください。
        カンマは除外し、純粋な数値（例: 1450）として出力すること。
        
        【対象テキスト】
        ${text}
        `
      });

      return {
        name: target.name,
        lastUpdated: nowStr,
        prices: object
      };
    });

    const settledResults = await Promise.all(promises);
    const validResults = settledResults.filter(r => r !== null);

    return Response.json({ status: 'success', data: validResults });

  } catch (error: any) {
    console.error("Scraping AI Error:", error);
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
