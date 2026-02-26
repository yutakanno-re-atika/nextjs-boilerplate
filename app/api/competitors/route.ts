import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const TARGETS: Record<string, { name: string, url: string }> = {
  "sapporo": { name: "札幌銅リサイクル", url: "https://sapporo-recycle.com/" },
  "rec": { name: "REC環境サービス", url: "http://colors.main.jp/" },
  "ohata": { name: "大畑商事", url: "https://www.ohata.org/kakaku.html" }
};

const priceSchema = z.object({
  "光線（ピカ線、特号）": z.number().nullable().describe("ピカ線、特一号、光特号など"),
  "1号線": z.number().nullable().describe("1号銅、1号銅線など"),
  "2号線": z.number().nullable().describe("2号銅、2号銅線など"),
  "上銅": z.number().nullable().describe("上銅、上故銅、付物のある銅"),
  "並銅": z.number().nullable().describe("並銅、なみどう"),
  "下銅": z.number().nullable().describe("下銅、下故銅"),
  "山行銅": z.number().nullable().describe("山行銅、山銅、銅ダスト"),
  "ビスマス砲金": z.number().nullable().describe("ビスマス砲金"),
  "砲金": z.number().nullable().describe("砲金、青銅（※バルブ、メーター等と書かれていない純粋な砲金）"),
  "メッキ砲金": z.number().nullable().describe("メッキ砲金、メッキ青銅"),
  "バルブ砲金": z.number().nullable().describe("バルブ砲金"),
  "込砲金": z.number().nullable().describe("込砲金、砲金ダスト"),
  "込中": z.number().nullable().describe("込真鍮、真鍮、黄銅、真鍮/黄銅"),
  "山行中": z.number().nullable().describe("山行中、山真鍮、ミックスメタル、真鍮ダスト"),
  "被覆線80%": z.number().nullable().describe("80%線、1本線、8割、雑電線(銅率80%)"),
  "被覆線70%": z.number().nullable().describe("70%線、7割"),
  "被覆線60%": z.number().nullable().describe("60%線、65%線、6割、CV線、雑電線(銅率65%)"),
  "被覆線50%": z.number().nullable().describe("50%線、5割"),
  "被覆線40%": z.number().nullable().describe("40%線、4割、VA線、VVF、Fケーブル"),
  "雑線": z.number().nullable().describe("雑線、家電線、通信線")
});

async function fetchSiteText(url: string) {
  const options = { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } };
  let html = "";
  try {
    const res = await fetch(url, options);
    if (res.ok) html = await res.text();
  } catch (e) {}
  
  if (!html) {
    try {
      const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
      const res = await fetch(proxyUrl, options);
      if (res.ok) html = await res.text();
    } catch (e) {}
  }
  
  if (!html) return null;

  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  text = text.replace(/<(br|p|div|tr|li|h[1-6])[^>]*>/gi, '\n');
  text = text.replace(/<[^>]+>/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n');

  return text.substring(0, 30000);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const target = TARGETS[body.targetKey];
    if (!target) return Response.json({ status: 'error', message: 'Invalid target' }, { status: 400 });

    const text = await fetchSiteText(target.url);
    if (!text) return Response.json({ status: 'error', message: 'HTML Fetch Failed' }, { status: 500 });

    const nowStr = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: priceSchema,
      prompt: `
      あなたは非鉄金属スクラップ業界のプロの査定員です。
      以下のテキストは競合他社のWebサイトから取得した本日の価格表です。
      当社の20品目に最も適した価格（1kgあたりの円、数値のみ）を抽出してください。
      
      【空欄を無くすための高度な翻訳ルール】
      AIであるあなたは、文字列の完全一致ではなく「業界の文脈」で判断してください。
      - 「1号銅」「１号銅」は『1号線』です。
      - 「2号銅」「２号銅」は『2号線』です。
      - 「上故銅」は『上銅』、「下故銅」は『下銅』です。
      - 「真鍮/黄銅」「真鍮」は『込中』です。
      - 「雑電線(銅率80%)」「1本線」は『被覆線80%』です。
      - 「雑電線(銅率65%)」「CV線」は『被覆線60%』です。
      - 「VA線(VVFケーブル・雑電線)」「Fケーブル」は『被覆線40%』です。
      - 「家電線」「弱電線」は『雑線』です。
      
      【注意】
      - 抽出する値は数値のみ（例: 1450）。カンマ(,)は外してください。
      - 該当がない場合のみ null としてください。なるべく意味を解釈して埋めてください。
      
      【対象テキスト】
      ${text}
      `
    });

    return Response.json({ status: 'success', data: { name: target.name, lastUpdated: nowStr, prices: object } });
  } catch (error: any) {
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
