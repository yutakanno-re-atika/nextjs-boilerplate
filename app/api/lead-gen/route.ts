// app/api/lead-gen/route.ts
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60; // タイムアウトを最大60秒に設定

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, target, area, keyword, apiToken } = body;
    const gasUrl = process.env.GAS_API_URL || "https://script.google.com/macros/s/AKfycbxuE0iPCEruoQLretA8R0cmSnRyZPYT9qd6YqDGVCCCY1h0wRVJX8P-MZF20I1whF7Z/exec";

    // ============================================================================
    // モード1: 潜在リードDBからCRM（アクティブ・パイプライン）への追加
    // ============================================================================
    if (mode === 'add_to_crm') {
      const payload = {
        action: 'ADD_DB_RECORD',
        sheetName: 'SalesTargets',
        data: {
          company: target.company || '',
          address: target.address || '',
          area: target.address ? target.address.substring(0, 10) : '北海道',
          priority: 'C',
          industry: target.businessSummary ? target.businessSummary.substring(0, 20) : '電気・通信・設備',
          volume: '未定',
          reason: 'ローカルDBからの手動追加',
          proposal: '',
          status: '未分析',
          contact: target.representative || '',
          website: target.website || '',
          memo: `資本金: ${target.capital || '-'} / 従業員: ${target.employees || '-'} / 設立: ${target.founded || '-'}`
        }
      };
      
      const gasRes = await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await gasRes.json();
      return NextResponse.json(result);
    }

    // ============================================================================
    // モード2: AIによるターゲットの事業内容分析と営業戦略の立案
    // ============================================================================
    if (mode === 'analyze') {
      const { object } = await generateObject({
        // @ts-ignore
        model: google('gemini-2.5-pro'), // ★ flash から pro に格上げ
        temperature: 0.2, // 分析系なので温度は低め
        schema: z.object({
          volume: z.string().describe("事業内容や規模から推測される銅線等の想定排出量（例: 月間500kg, 小規模, 不明 など）"),
          priority: z.string().describe("S, A, B, C のいずれか（当社のナゲット機のベース原料になりそうなら高く評価）"),
          proposal: z.string().describe("当社の強み（ナゲット処理による中間マージンカット）を活かした、具体的なアプローチの提案（80文字程度）"),
          reason: z.string().describe("その評価とした理由"),
          contact: z.string().describe("連絡先（テキスト内になければ「要Web検索」）")
        }),
        prompt: `
        あなたは非鉄金属リサイクル工場（自社にナゲットプラントあり）の凄腕営業部長です。
        以下のターゲット企業の事業情報を深く分析し、銅線や非鉄スクラップの排出ポテンシャルを見極め、営業戦略を立案してください。

        【ターゲット企業】
        企業名: ${target.company}
        住所: ${target.address}
        事業概要: ${target.businessSummary || target.memo || '詳細不明'}
        
        【思考プロセス】
        - 通信・弱電工事なら「LANケーブルや細線」、解体業なら「CV線や雑線」、配電盤製造なら「IV線や銅ブスバー」が出る可能性が高い。
        - 資本金や従業員数などの規模が大きければSやAランク。
        `
      });

      // GASの SalesTargets シートの列インデックスに合わせた更新用マップ
      const payload = {
        action: 'UPDATE_DB_RECORD',
        sheetName: 'SalesTargets',
        recordId: target.id,
        updates: {
          4: object.priority,
          6: object.volume,
          7: object.reason,
          8: object.proposal,
          10: '分析完了',
          11: object.contact === '要Web検索' ? (target.contact || '要検索') : object.contact
        }
      };
      
      const gasRes = await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await gasRes.json();
      return NextResponse.json(result);
    }

    if (!apiToken) return NextResponse.json({ success: false, message: "APIトークンを入力してください。" });
    return NextResponse.json({ success: false, message: "無効なリクエストです。" });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}