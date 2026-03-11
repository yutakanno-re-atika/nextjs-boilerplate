// app/api/lead-gen/route.ts
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, target, teacherClients } = body;
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // ============================================================================
    // 🧠 ANALYZE モード: スプレッドシートにある確定データを元にAIが分析・DM作成
    // ============================================================================
    if (mode === 'analyze') {
        const teacherContext = teacherClients && teacherClients.length > 0 
            ? `\n【参考】当社の優良顧客: ` + teacherClients.map((c:any) => c.name).join(', ') 
            : '';

        // 1. ボスが用意した100%確実なデータをコンテキスト（RAG）としてAIに渡す
        const analysis = await generateObject({
            // @ts-ignore
            model: google('gemini-2.5-pro', { useSearchGrounding: true }), 
            temperature: 0,
            schema: z.object({
              contact: z.string().describe("電話番号（Google検索で確認できたもの。不明なら「不明」）"),
              volume: z.string().describe("事業規模や事業概要から推測される月間見込み排出量"),
              priority: z.enum(['S', 'A', 'B']).describe("営業優先度"),
              reason: z.string().describe("営業をかけるべき理由"),
              proposal: z.string().describe("ナゲットプラントを活かした提案シナリオ"),
              salesPitch: z.string().describe("この企業に送る、超カスタマイズされた営業メッセージ（300字程度）")
            }),
            prompt: `あなたは優秀な営業リサーチャーです。以下の【確定した企業データ】を元にGoogle検索で「電話番号」を裏付け調査し、営業戦略を立ててください。
            \n企業名: ${target.company}\n所在地: ${target.address}\n事業概要: ${target.businessSummary}\n${teacherContext}`
        });

        // 2. 分析結果をスプレッドシート（GAS）に上書き保存
        const updates = {
            12: analysis.object.contact === '不明' ? '' : analysis.object.contact, // L列: contact
            14: analysis.object.volume, // N列: volume
            15: analysis.object.priority, // O列: priority
            16: '未確認', // P列: status を「未分析」から「未確認」へ進める
            17: analysis.object.reason, // Q列: reason
            18: analysis.object.proposal, // R列: proposal
            19: `【🤖 AI作成 DM・FAX送信用原稿】\n${analysis.object.salesPitch}` // S列: memo
        };

        await fetch(gasUrl, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: target.id, updates }) 
        });

        return NextResponse.json({ success: true, message: "AI分析とDM生成が完了しました。" });
    }

    return NextResponse.json({ success: false, message: "不正なリクエストです。" });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
