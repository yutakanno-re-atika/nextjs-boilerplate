// app/api/enrich-client/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { companyName, address, industry, currentMemo } = await req.json();

    const { object } = await generateObject({
      // ★ 3.1 Proに進化
      model: google('gemini-3.1-pro-preview'), 
      schema: z.object({
        industry: z.string().describe("詳細な業種（例：非鉄金属リサイクル業、総合解体業、高圧電気設備工事など）"),
        memo: z.string().describe("[属性] [排出特性または機能] [当社シナジー] [AI指示] のフォーマットに則ったプロファイルメモ"),
      }),
      prompt: `
        あなたは株式会社月寒製作所（非鉄金属リサイクル工場）の凄腕データアナリスト兼・トップ営業マンです。
        以下の既存取引先について、企業名から推測される事業特性を深掘りし、当社にとってどのような立ち位置の顧客かをプロファイリングしてください。

        【調査対象】
        企業名: ${companyName}
        所在地: ${address || '不明'}
        現在の登録業種: ${industry || '不明'}
        現在のメモ: ${currentMemo || 'なし'}

        【⚠️ 絶対遵守ルール（ハルシネーション防止）】
        1. 業界の固定: この企業は当社の取引先であり、「非鉄金属スクラップ買取」「産廃処理」「解体工事」「電気・設備工事」のいずれかのエコシステムに属しています。企業名に「金属」とあっても、決して「本棚や日用品を作るメーカー」などの的外れな妄想をしないでください。
        2. 出力のフォーマット: メモは必ず以下の4つのタグを用いたフォーマットで出力してください。
        
        [属性] （例：札幌圏の同業スクラップ業者、道南エリアの中堅解体業者 など）
        [排出特性 または 機能] （例：太物CV線をコンスタントに排出、相場変動時の相互融通先 など）
        [当社シナジー] （例：当社のナゲットプラントのベース原料供給元として重要、など）
        [AI指示] （例：この業者に類似する企業をAIスナイパーで抽出せよ、など）
      `
    });

    return Response.json({ success: true, data: object });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
