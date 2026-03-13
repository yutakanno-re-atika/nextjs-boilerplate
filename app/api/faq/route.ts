import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 

    const logRes = await fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'FETCH_CHAT_LOGS' })
    });
    const { logs } = await logRes.json();

    if (!logs || logs.length === 0) {
        return Response.json({ success: false, message: "チャットログがまだありません" });
    }

    const logText = logs.map((l: any) => `客: ${l.user}\nAI: ${l.ai}`).join('\n\n');

    const masterRes = await fetch(gasUrl);
    const masterData = await masterRes.json();
    
    let productsContext = "取扱銘柄の情報が取得できませんでした。";
    if (masterData.status === 'success') {
        const castings = masterData.castings.map((c: any) => `- ${c.name}: ${c.description || '歩留まり '+c.ratio+'% 相当'}`).join('\n');
        const wires = masterData.wires.map((w: any) => `- ${w.name}: 銅率 ${w.ratio}% 想定`).join('\n');
        productsContext = `【非鉄金属マスタ】\n${castings}\n\n【電線マスタ】\n${wires}`;
    }

    const result = await generateText({
      model: google('gemini-2.5-pro'), 
      temperature: 0.4,
      system: `
      あなたは株式会社月寒製作所（苫小牧工場）の優秀なデータアナリスト兼・非鉄リサイクル業界の専門家（査定人）です。
      以下のカスタマーサポートのチャットログを分析し、お客様がよく疑問に思うポイントを抽出し、実践的でリアルな「よくある質問(FAQ)」を最大5件作成してください。
      
      【厳守する基本情報（ファクト）】
      ・所在地: 北海道苫小牧市一本松町9-6
      ・営業時間: 8:00〜17:00
      ・持込ルール: 古物営業法の規定により、初回取引時は「運転免許証などの身分証明書」が必ず必要。

      【自社の取扱銘柄データ（絶対のファクト）】
      以下のマスタデータに存在する品目や歩留まり（銅率）の数値を根拠として回答してください。
      ${productsContext}

      【非鉄リサイクル業界の標準ナレッジ（競合他社の共通認識）】
      回答を作成する際は、以下の業界標準知識をベースにして専門的に回答してください。
      ・ピカ線（特1号銅線）: 劣化、メッキ、エナメル、テープ、端子等の付着が一切ない純銅線。少しでも付着物や劣化（焼けなど）があれば、1号線や下銅としてダウングレード（減額）される。
      ・被覆線（VVF, CV等）: 中の銅の割合（歩留まり/銅率）で価格が決まる。VA線やVVFは約40%、単線や太いCV線は約60〜80%以上が目安。
      ・真鍮・砲金: 鉄やプラスチックの部品（ビス、取っ手等）が付いたままだと「込真鍮」「込砲金（ダスト付き）」となり、歩留まりが下がるため減額対象（ダスト引き）となる。
      ・雑線: プラグやコンセントがついたままの家電線や、細すぎる線などは銅の回収率が低いため「雑線」として扱われる。

      【回答（Answer）の作成ルール・ガードレール】
      1. 専門的かつ客観的に: ログの疑問に対し、上記の【取扱銘柄データ】と【業界ナレッジ】を根拠として、プロフェッショナルで納得感のある回答を作成してください。
      2. 嘘をつかない: 上記の基本情報やマスタにない事項（具体的な定休日など）を勝手に創作しないでください。
      3. 過剰なセールストーク禁止: 情報を正確に伝えることを優先し、「～ですので高価買取です！」といった過剰な自己アピールや装飾を排除し、誠実なビジネストーンで答えてください。
      
      【出力フォーマット】
      出力は絶対に以下のJSON配列形式のみを出力してください。マークダウン（\`\`\`json など）や余計なテキストは一切含めないでください。
      [
        { "q": "質問内容...", "a": "回答内容..." }
      ]
      `,
      prompt: `【チャットログ】\n${logText}`
    });

    const jsonString = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const faqs = JSON.parse(jsonString);

    await fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify({ action: 'SAVE_AUTO_FAQ', faqs: faqs })
    });

    return Response.json({ success: true, faqs });
  } catch (error: any) {
    console.error("FAQ Generation Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}