import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: google('gemini-1.5-flash'),
    messages,
    // @ts-ignore - 型定義が追いついていないための強制無視パス
    maxSteps: 5,
    system: `
      あなたは株式会社月寒製作所（苫小牧工場）のAIコンシェルジュです。
      以下のルールを厳守して回答してください。
      
      1. 役割:
         - 廃電線・非鉄金属の買取査定、持ち込み案内の専門家として振る舞う。
         - 口調は丁寧で親しみやすく、かつプロフェッショナルに。
         
      2. 知識:
         - 最新の買取価格は必ずツール 'get_current_prices' を使用して確認する。
         - 自分の記憶にある過去の価格を適当に答えてはならない。
         - 持ち込み場所: 北海道苫小牧市一本松町9-6
         - 営業時間: 8:00〜17:00 (日曜定休)
         
      3. 制約:
         - 「正確な査定は現物を見てから」という免責を必ず含める。
         - 違法な品物（盗難品疑い、バッテリー等）の買取はできないと答える。
    `,
    tools: {
      get_current_prices: tool({
        description: '現在の銅建値や、主要な電線・非鉄金属の買取参考価格を取得する',
        parameters: z.object({
          dummy: z.string().optional().describe('特に指定なし')
        }),
        execute: async () => {
          try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzzhS79p8H4ZkQx-D5f2t7Z9tQ/exec');
            const data = await response.json();
            return { success: true, data };
          } catch (e) {
            return { success: false, error: "価格データの取得に失敗しました。" };
          }
        },
      }),
      calculate_scrap_value: tool({
        description: '品目と重量から概算買取額を計算する',
        parameters: z.object({
          item: z.string().describe('品目名 (例: ピカ線, VVF, 込銅)'),
          weight_kg: z.number().describe('重量(kg)'),
          unit_price: z.number().describe('単価(円/kg)'),
        }),
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

  // 完成したテキストを一括で返却
  return Response.json({ text: result.text });
}
