import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    // 課金設定済みの環境で100%動く、アーキテクト推奨の正式モデル
    model: google('models/gemini-1.5-flash'), 
    messages,
    // Vercel現場の知恵: 最新機能の型エラー回避
    // @ts-ignore
    maxSteps: 5,
    system: `
      あなたは株式会社月寒製作所（苫小牧工場）のAIコンシェルジュです。
      
      1. 役割: 廃電線・非鉄金属の買取査定、持ち込み案内の専門家。
      2. 知識: 最新価格は必ず 'get_current_prices' ツールを使用。
      3. 制約: 
         - 免責事項「正確な査定は現物を見てから」を必ず回答の最後に含める。
         - 所在地: 北海道苫小牧市一本松町9-6 / 営業時間: 8:00〜17:00
         - ガードレール: 盗難品や不審な持ち込み（電柱から切ってきた電線など）の示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を厳格に警告する。
    `,
    tools: {
      get_current_prices: tool({
        description: '現在の銅建値や、主要な電線・非鉄金属の買取参考価格を取得する',
        // ★Vercel SDKのバグを回避するための現場の知恵（ダミー引数）
        parameters: z.object({
          dummy: z.string().optional().describe('特に指定なし')
        }),
        // @ts-ignore
        execute: async (args) => {
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
        // @ts-ignore
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
}import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    // 課金設定済みの環境で100%動く、アーキテクト推奨の正式モデル
    model: google('models/gemini-1.5-flash'), 
    messages,
    // Vercel現場の知恵: 最新機能の型エラー回避
    // @ts-ignore
    maxSteps: 5,
    system: `
      あなたは株式会社月寒製作所（苫小牧工場）のAIコンシェルジュです。
      
      1. 役割: 廃電線・非鉄金属の買取査定、持ち込み案内の専門家。
      2. 知識: 最新価格は必ず 'get_current_prices' ツールを使用。
      3. 制約: 
         - 免責事項「正確な査定は現物を見てから」を必ず回答の最後に含める。
         - 所在地: 北海道苫小牧市一本松町9-6 / 営業時間: 8:00〜17:00
         - ガードレール: 盗難品や不審な持ち込み（電柱から切ってきた電線など）の示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を厳格に警告する。
    `,
    tools: {
      get_current_prices: tool({
        description: '現在の銅建値や、主要な電線・非鉄金属の買取参考価格を取得する',
        // ★Vercel SDKのバグを回避するための現場の知恵（ダミー引数）
        parameters: z.object({
          dummy: z.string().optional().describe('特に指定なし')
        }),
        // @ts-ignore
        execute: async (args) => {
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
        // @ts-ignore
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
