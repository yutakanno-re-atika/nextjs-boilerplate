import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    // 通信大成功が確認された2.0-flash
    model: google('models/gemini-2.0-flash'), 
    messages,
    system: `
      あなたは株式会社月寒製作所（苫小牧工場）のAIコンシェルジュです。
      
      1. 役割: 廃電線・非鉄金属の買取査定、持ち込み案内の専門家。
      2. 所在地: 北海道苫小牧市一本松町9-6 / 営業時間: 8:00〜17:00
      3. ガードレール: 盗難品や不審な持ち込み（電柱から切ってきた電線など）の示唆があった場合、即座に「古物営業法に基づき、身分証明の提示と警察への通報義務がある」旨を厳格に警告する。
      4. 特別ルール: 現在、最新価格を取得するシステムがメンテナンス中のため、具体的な買取価格を聞かれた場合は「現在価格システムがメンテナンス中のため、お手数ですがお電話にてお問い合わせください」と丁寧に案内してください。
    `,
  });

  return Response.json({ text: result.text });
}
