import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

const TARGETS: Record<string, { name: string, url: string }> = {
  "sapporo": { name: "札幌銅リサイクル", url: "https://sapporo-recycle.com/" },
  "rec": { name: "REC環境サービス", url: "http://colors.main.jp/" },
  "ohata": { name: "大畑商事", url: "https://www.ohata.org/kakaku.html" }
};

// ★ 改善ポイント1：スキーマの「describe（AIへの説明）」を極限まで具体化
const priceSchema = z.object({
  "光線（ピカ線、特号）": z.number().nullable().describe("ピカ線、特一号、光特号など"),
  "1号線": z.number().nullable().describe("1号銅、1号銅線など。ピカ線と併記されている場合は同じ値を設定すること"),
  "2号線": z.number().nullable().describe("2号銅、2号銅線など。下銅と併記の場合は同じ値を設定"),
  "上銅": z.number().nullable().describe("上銅、上故銅。見当たらない場合は「込銅」の価格を設定すること"),
  "並銅": z.number().nullable().describe("並銅、なみどう。見当たらない場合は「込銅」の価格を設定すること"),
  "下銅": z.number().nullable().describe("下銅、下故銅。見当たらない場合は「2号銅」の価格を設定すること"),
  "山行銅": z.number().nullable().describe("山行銅、山銅、銅ダスト"),
  "ビスマス砲金": z.number().nullable().describe("ビスマス砲金。不明な場合は null"),
  "砲金": z.number().nullable().describe("砲金、青銅（バルブやメーターを除く純粋なもの）"),
  "メッキ砲金": z.number().nullable().describe("メッキ砲金、メッキ青銅"),
  "バルブ砲金": z.number().nullable().describe("バルブ砲金。見当たらない場合は「込砲金」の価格を設定"),
  "込砲金": z.number().nullable().describe("込砲金、砲金ダスト"),
  "込中": z.number().nullable().describe("込真鍮、真鍮、黄銅、真鍮/黄銅"),
  "山行中": z.number().nullable().describe("山行中、山真鍮、ミックスメタル、真鍮ダスト"),
  "被覆線80%": z.number().nullable().describe("80%線、1本線、8割、雑電線(銅率80%)"),
  "被覆線70%": z.number().nullable().describe("70%線、7割、雑電線(銅率70%)。不明な場合は null"),
  "被覆線60%": z.number().nullable().describe("60%線、65%線、6割、CV線、雑電線(銅率65%)"),
  "被覆線50%": z.number().nullable().describe("50%線、5割。不明な場合は null"),
  "被覆線40%": z.number().nullable().describe("40%線、4割、VA線、VVF、Fケーブル"),
  "雑線": z.number().nullable().describe("雑線、家電線、通信線")
});

async function fetchSiteText(url: string) {
  const options = { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } };
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

    // ★ 改善ポイント2：AIに「同義語の補完ルール（意味的マッピング）」を強制的に推論させる
    const { object } = await generateObject({
      model: google('gemini-2.5-flash'),
      schema: priceSchema,
      prompt: `
      あなたは非鉄金属スクラップ業界のプロの査定員です。
      以下のテキストは競合他社のWebサイトから取得した本日の価格表です。
      当社の20品目に最も適した価格（1kgあたりの円、数値のみ）を抽出してください。
      
      【空欄を無くすための高度な補完ルール】
      AIであるあなたは、文字列の完全一致ではなく「業界の文脈」で判断して極力すべての品目を埋めてください。
      
      [銅・砲金・真鍮類]
      - 「ピカ線・1号銅」のように併記されている場合は、『光線』と『1号線』の両方に同じ数値を設定してください。
      - 「込銅」しか記載がない場合、『上銅』および『並銅』の両方に「込銅」の数値を設定してください。
      - 「バルブ砲金」が見当たらない場合は、『込砲金』の数値を設定してください。
      - 「真鍮/黄銅」「真鍮」は『込中』に設定してください。
      - 「ミックスメタル」は『山行中』に設定してください。

      [電線類]
      - 「1本線」「8割」は『被覆線80%』です。
      - 「CV線」は『被覆線60%』です。
      - 「VA線」「VVF」「Fケーブル」は『被覆線40%』です。
      - 「家電線」「弱電線」は『雑線』です。
      
      【注意】
      - 抽出する値は数値のみ（例: 1450）。カンマ(,)や「円」などの単位は外してください。
      - 電話番号や日付の年号（例: 2026）を価格と誤認しないこと。価格は通常10〜20000の範囲です。
      - 上記の補完ルールを使ってもどうしても該当がない場合のみ null としてください。
      
      【対象テキスト】
      ${text}
      `
    });

    return Response.json({ status: 'success', data: { name: target.name, lastUpdated: nowStr, prices: object } });
  } catch (error: any) {
    return Response.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
