import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const prompt = `
あなたは株式会社月寒製作所（苫小牧工場）の優秀なAI経営参謀（FACTORY OS）です。
以下の本日の稼働データと市況を分析し、工場長に向けた「本日の戦略アドバイス」を生成してください。

【本日のデータ】
・日付: ${data.date}
・銅建値: ${data.copperPrice}円/kg (前日比 ${data.copperDiff >= 0 ? '+'+data.copperDiff : data.copperDiff}円)
・本日の持込予約: ${data.todayCount}件 (計 ${data.todayWeight}kg)
・当月の純銅生産量: ${data.mCopper}kg (月間目標 ${data.targetMonthly}kg に対し進捗 ${data.progress}%)
・月末の着地見込み: ${data.projected}kg
・直近の歩留まり傾向: マスター設定値に対して ${data.yieldDiff > 0 ? '+' : ''}${data.yieldDiff}%の乖離

【出力ルール】
以下の3つの見出し（Markdownの###は使わず、箇条書きで）で、プロフェッショナルかつ少し自信に満ちたトーンで出力してください。
1. 本日の市況とプライシング方針
2. 現場稼働と歩留まりの評価
3. 月間目標達成に向けた利益最大化の打ち手
`;

    const result = await generateText({
      // ★ 経営参謀を 3.1 Pro に昇格
      model: google('gemini-3.1-pro-preview'),
      system: "あなたは非鉄金属リサイクル工場のAI参謀です。データに基づき、利益を最大化するための冷徹かつ的確なアドバイスを行います。",
      prompt: prompt,
    });

    return Response.json({ success: true, advice: result.text });
  } catch (error: any) {
    console.error("Report AI Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
