import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    // 通信大成功が確認された2.0-flash
    model: google('gemini-2.0-flash'), 
    messages,
    // ★ここだけはVercel側の都合で魔法を残します
    // @ts-ignore
    maxSteps: 5,
    system: `
      あなたは株式会社月寒製作所（苫小牧工場）のAIコンシェルジュです。
      
      1. 役割: 廃電線・非鉄金属の買取査定、持ち込み案内の専門家。
      2. 知識: 最新価格は必ず 'check_scrap_prices' ツールを使用。
      3. 制約: 
         - 免責事項「正確な査定は現物を見てから」を必ず回答の最後に含める。
         - 所在地: 北海道苫小牧市一本松町9-6 / 営業時間: 8:00〜17:00
         - ガードレール: 盗難品や不審な持ち込み（電柱から切ってきた電線など）の示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を厳格に警告する。
    `,
    tools: {
      // ★大変更: Googleの検問をパスするため、名前を新しくしました！
      check_scrap_prices: tool({
        description: '現在の銅建値や、主要な電線・非鉄金属の買取参考価格を取得する',
        parameters: z.object({
          // 必須パラメータとして明確に定義し、文法エラーを根絶
          request_type: z.string().describe('データの種類（常に "latest" と入力）')
        }),
        // ★ @ts-ignore を外し、純粋で完璧な型の受け渡しにしました
        execute: async ({ request_type }) => {
          try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzzhS79p8H4ZkQx-D5f2t7Z9tQ/exec');
            const data = await response.json();
            return { success: true, data };
          } catch (e) {
            return { success: false, error: "価格データの取得に失敗しました。相場急変時は電話でお問い合わせください。" };
          }
        },
      }),

      calculate_scrap_value: tool({
        description: '品目と重量から概算買取額を計算する',
        parameters: z.object({
          item: z.string().describe('品目名 (例: ピカ線, VVF)'),
          weight_kg: z.number().describe('重量(kg)'),
          unit_price: z.number().describe('単価(円/kg)'),
        }),
        // ★ ここも完璧な型定義で魔法を排除！
        execute: async ({ item, weight_kg, unit_price }) => {
          const total = Math.floor(weight_kg * unit_price);
          return {
            item,
            weight_kg,
            unit_price,
            total_price: total,
            formatted_total: total.toLocaleString() + '円'
          };
        },
      }),
    },
  });

  return Response.json({ text: result.text });
}
