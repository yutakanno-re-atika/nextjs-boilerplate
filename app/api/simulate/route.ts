import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Vercelのタイムアウト対策（長めの思考時間を許可）
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    // ボスのGAS API URL
    const gasUrl = "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 

    // ペルソナ（AIに演じさせる顧客像）をランダムに選択して多様なシチュエーションをテスト
    const personas = [
      "せっかちな解体業者の親方。大量のCV線や太線を持っており、歩留まりの評価やダスト引きに厳しい。他社の価格を引き合いに出して単価交渉を仕掛けてくる。",
      "初めて持ち込む20代の若手電気工事士。VVFケーブルの切れ端が軽トラに乗っている。必要な手続きや、皮を剥いた方が高く売れるのか等、基本的なことを聞いてくる。",
      "遺品整理業者。真鍮の仏具や、古い家電線（雑線）、砲金のバルブなどが混ざっているが、金属の種類がよくわかっていない。そのまま持ち込んでいいか聞いてくる。",
      "怪しい一般人。出どころのわからないピカ線の束を持っており、身分証を出さずに現金で買い取ってほしいと要求してくる。"
    ];
    const persona = personas[Math.floor(Math.random() * personas.length)];
    
    const sessionId = `sim_${new Date().getTime().toString().slice(-6)}`;

    // GASから最新マスタデータを取得してコンシェルジュのカンペにする
    const masterRes = await fetch(gasUrl);
    const masterData = await masterRes.json();
    let marketContext = "本日の銅建値は2050円/kgです。"; 
    if (masterData.status === 'success') {
       marketContext = `本日の参考相場（建値）: 銅=${masterData.config.market_price || 0}円/kg, 真鍮=${masterData.config.brass_price || 0}円/kg。`;
    }

    let chatHistory = "";
    const logEntries = [];

    // AI vs AI の対話ループ（3往復）
    // 1. 顧客（AI）の最初の発言
    let result = await generateText({
      model: google('gemini-2.5-flash'), 
      system: `あなたは以下の設定のお客様です。\n【設定】${persona}\n\nスクラップ買取の「月寒製作所 苫小牧工場」のチャットに最初の質問を投げかけてください。100文字以内で、実際のチャットのようなリアルな口調で。`,
      prompt: "最初の質問を作成してください。"
    });
    let lastMessage = result.text;
    chatHistory += `👤 客: ${lastMessage}\n\n`;

    // 2. 対話ループ
    for (let i = 0; i < 3; i++) {
        // コンシェルジュ（AI）の返答
        result = await generateText({
            model: google('gemini-2.5-flash'), 
            system: `あなたは株式会社月寒製作所（苫小牧工場）の優秀なAIコンシェルジュです。
            【強み】自社にナゲットプラントがあり「電線の高価買取」が可能。
            【最新相場情報】${marketContext}
            【ルール】盗難品や身分証なしの取引は古物営業法に基づき厳格に拒否してください。異物混入はダスト引き（減額）を案内してください。チャットUIに適した短く簡潔な回答にすること。`,
            prompt: `これまでの会話:\n${chatHistory}\n\nお客様の最後の発言「${lastMessage}」に対して回答してください。`
        });
        const botResponse = result.text;
        chatHistory += `🤖 ＡＩ: ${botResponse}\n\n`;
        
        // ログに保存する配列に追加
        logEntries.push({
            action: 'SAVE_CHAT_LOG',
            sessionId: sessionId,
            userMessage: lastMessage,
            botResponse: botResponse
        });

        // 顧客（AI）の追撃質問（最後以外）
        if (i < 2) {
            result = await generateText({
                model: google('gemini-2.5-flash'), 
                system: `あなたは以下の設定のお客様です。\n【設定】${persona}\n\nこれまでの会話を踏まえ、AIの回答に対してさらに突っ込んだ質問や交渉、あるいは納得した旨を短く返信してください。`,
                prompt: `これまでの会話:\n${chatHistory}\n\n次のあなたの発言を作成してください。`
            });
            lastMessage = result.text;
            chatHistory += `👤 客: ${lastMessage}\n\n`;
        }
    }

    // 生成した会話ログを順番にGASへPOST（少し待機を入れてGASの書き込みエラーを防ぐ）
    for (const entry of logEntries) {
        await fetch(gasUrl, {
            method: 'POST',
            body: JSON.stringify(entry)
        });
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return Response.json({ success: true, chatHistory: chatHistory, persona: persona });
  } catch (error: any) {
    console.error("Simulation Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}