import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const gasUrl = "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec"; 

    const masterRes = await fetch(gasUrl);
    const masterData = await masterRes.json();
    
    let marketContext = "本日の銅建値は2050円/kgです。"; 
    let clients = [];
    let salesTargets = [];
    let productions = [];

    if (masterData.status === 'success') {
       marketContext = `本日の参考相場（建値）: 銅=${masterData.config.market_price || 0}円/kg, 真鍮=${masterData.config.brass_price || 0}円/kg。`;
       clients = masterData.clients || [];
       salesTargets = masterData.salesTargets || [];
       productions = masterData.productions || [];
    }

    let persona = "";
    let personaName = "";
    const rand = Math.random();
    
    if (rand < 0.4 && clients.length > 0) {
        const targetClient = clients[Math.floor(Math.random() * clients.length)];
        personaName = targetClient.name;
        
        const clientProds = productions.filter((p:any) => p.memberName === targetClient.name);
        let yieldTendency = "";
        if (clientProds.length > 0) {
            const avgYield = clientProds.reduce((sum:number, p:any) => sum + (Number(p.actualRatio) || 0), 0) / clientProds.length;
            yieldTendency = `過去の加工データでは平均歩留まりが約${avgYield.toFixed(1)}%です。`;
        }

        persona = `あなたは月寒製作所の既存顧客である「${targetClient.name}」の担当者です。
現在の会員ランクは「${targetClient.rank}」。
【顧客メモ情報】${targetClient.memo || '特になし'}
【取引傾向】${yieldTendency}
この背景を踏まえ、本日の相場確認や、次回の持ち込みに関する単価交渉、またはマニアックな非鉄金属の買取可否について、スクラップ業者らしい口調で質問してください。`;

    } else if (rand < 0.8 && salesTargets.length > 0) {
        const targetSales = salesTargets[Math.floor(Math.random() * salesTargets.length)];
        personaName = targetSales.company;
        
        persona = `あなたは月寒製作所が現在営業をかけている「${targetSales.company}」の担当者（社長や工場長）です。
【業種】${targetSales.industry || '不明'}
【エリア】${targetSales.area || '不明'}
【現在のステータス】${targetSales.status || '新規'}
【月寒製作所からの営業提案メモ】${targetSales.proposal || targetSales.memo || '特になし'}

あなたは現在、他のスクラップ業者と取引していますが、月寒製作所（自社にナゲットプラントを持つ工場）に少し興味を持っています。
上記の背景を踏まえ、買取価格の比較、受け入れ条件、または自社の排出物（${targetSales.industry}由来のスクラップ）が高く売れるのかどうか、少し疑り深いトーンで質問してください。`;

    } else {
        const personas = [
          { name: "解体業者の親方", desc: "せっかちな解体業者の親方。大量のCV線や太線を持っており、歩留まりの評価やダスト引きに厳しい。他社の価格を引き合いに出して単価交渉を仕掛けてくる。" },
          { name: "若手電気工事士", desc: "初めて持ち込む20代の若手電気工事士。VVFケーブルの切れ端が軽トラに乗っている。必要な手続きや、皮を剥いた方が高く売れるのか等、基本的なことを聞いてくる。" },
          { name: "遺品整理業者", desc: "遺品整理業者。真鍮の仏具や、古い家電線（雑線）、砲金のバルブなどが混ざっているが、金属の種類がよくわかっていない。そのまま持ち込んでいいか聞いてくる。" },
          { name: "怪しい一般人", desc: "怪しい一般人。出どころのわからないピカ線の束を持っており、身分証を出さずに現金で買い取ってほしいと要求してくる。" }
        ];
        const selected = personas[Math.floor(Math.random() * personas.length)];
        personaName = selected.name;
        persona = selected.desc;
    }

    const sessionId = `sim_${new Date().getTime().toString().slice(-6)}`;
    let chatHistory = "";
    const logEntries = [];

    let result = await generateText({
      // ★ 3.1 Flashに進化
      model: google('gemini-3.1-flash-preview'), 
      system: `あなたは以下の設定のお客様です。\n【設定】${persona}\n\nスクラップ買取の「月寒製作所 苫小牧工場」のチャットに最初の質問を投げかけてください。100文字以内で、実際のチャットのようなリアルな口調で。`,
      prompt: "最初の質問を作成してください。"
    });
    let lastMessage = result.text;
    chatHistory += `👤 客 (${personaName}): ${lastMessage}\n\n`;

    for (let i = 0; i < 3; i++) {
        result = await generateText({
            // ★ 3.1 Flashに進化
            model: google('gemini-3.1-flash-preview'), 
            system: `あなたは株式会社月寒製作所（苫小牧工場）の優秀なAIコンシェルジュです。
            【強み】自社にナゲットプラントがあり「電線の高価買取」が可能。
            【最新相場情報】${marketContext}
            【ルール】盗難品や身分証なしの取引は古物営業法に基づき厳格に拒否してください。異物混入はダスト引き（減額）を案内してください。チャットUIに適した短く簡潔な回答にすること。`,
            prompt: `これまでの会話:\n${chatHistory}\n\nお客様の最後の発言「${lastMessage}」に対して回答してください。`
        });
        const botResponse = result.text;
        chatHistory += `🤖 ＡＩ: ${botResponse}\n\n`;
        
        logEntries.push({
            action: 'SAVE_CHAT_LOG',
            sessionId: sessionId,
            userMessage: lastMessage,
            botResponse: botResponse
        });

        if (i < 2) {
            result = await generateText({
                // ★ 3.1 Flashに進化
                model: google('gemini-3.1-flash-preview'), 
                system: `あなたは以下の設定のお客様です。\n【設定】${persona}\n\nこれまでの会話を踏まえ、AIの回答に対してさらに突っ込んだ質問や交渉、あるいは納得した旨を短く返信してください。`,
                prompt: `これまでの会話:\n${chatHistory}\n\n次のあなたの発言を作成してください。`
            });
            lastMessage = result.text;
            chatHistory += `👤 客 (${personaName}): ${lastMessage}\n\n`;
        }
    }

    for (const entry of logEntries) {
        await fetch(gasUrl, {
            method: 'POST',
            body: JSON.stringify(entry)
        });
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    const displayPersona = `【AIが憑依したターゲット】\n${personaName}\n\n【裏側で与えられたコンテキスト】\n${persona}`;

    return Response.json({ success: true, chatHistory: chatHistory, persona: displayPersona });
  } catch (error: any) {
    console.error("Simulation Error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
