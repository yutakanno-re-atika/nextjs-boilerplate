// app/api/enrich-client/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { companyName, address } = await req.json();

    const { object } = await generateObject({
      model: google('gemini-2.5-pro'), // 複雑な推論と知識検索のためにProモデルを使用
      schema: z.object({
        industry: z.string().describe("詳細な業種（例：総合解体業、高圧電気設備工事、管工事など）"),
        memo: z.string().describe("スクラップ買取業者目線での、この企業の事業特性、想定される排出物、規模感のプロファイル（100字〜150字程度）"),
      }),
      prompt: `
        あなたは非鉄金属リサイクル企業の凄腕リサーチャーです。
        以下の企業について、あなたの持つ知識や推論能力を総動員して深掘りし、プロファイルを作成してください。

        【調査対象】
        企業名: ${companyName}
        所在地: ${address || '不明'}

        【出力要件】
        この企業がどのような事業をメインに行っているか、そして「どんなスクラップ（例：太物CV線、VVF、真鍮、鉄骨、トランスなど）を、どの程度の頻度や規模で排出しそうか」を推測し、営業マン向けの『攻略プロファイルメモ』として出力してください。
      `
    });

    return Response.json({ success: true, data: object });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
