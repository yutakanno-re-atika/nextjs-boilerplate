import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { pageName, promptData } = await req.json();

    const systemPrompt = `
      あなたは非鉄金属リサイクル工場「月寒製作所」の優秀なAI参謀です。
      数字やデータに基づく論理的な判断を好む「工場長」に提出する、印刷用レポートの『要約・インサイト（洞察）』を作成してください。

      【出力のルール】
      1. 結論ファーストで、簡潔かつ論理的に記載すること（箇条書きを推奨）。
      2. 異常値、歩留まりの変化、相場との乖離など「経営的に注目すべきデータ」を必ず拾い上げて強調すること。
      3. 余計な挨拶は不要。そのままA4用紙に印刷して見やすいボリューム（200〜300文字程度）に収めること。
    `;

    const userPrompt = `
      【対象レポート】: ${pageName}
      【本日のデータ状況】: 
      ${promptData}
      
      上記のデータをもとに、工場長がひと目で現状を把握できる鋭い要約を作成してください。
    `;

    const { text } = await generateText({
      // ★ 3.1 Flashに進化
      model: google('gemini-3.1-flash-preview'),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return Response.json({ success: true, summary: text });

  } catch (error: any) {
    console.error("Print Summary Gen Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
