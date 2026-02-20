// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { MarketData } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Radar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  TrendingUp: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

interface AdminProps {
  data: MarketData | null;
  setView: (view: any) => void;
}

export const AdminDashboard = ({ data, setView }: AdminProps) => {
  // ★ OPERATIONS (統合パイプライン) タブを追加
  const [adminTab, setAdminTab] = useState<'DASHBOARD' | 'OPERATIONS' | 'POS' | 'COMPETITOR'>('DASHBOARD');
  
  // (POS用のステート省略せず保持)
  const [posUser, setPosUser] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  
  const marketPrice = data?.config?.market_price || 0;
  
  // --- モックデータ生成 ---
  const actualVolume = 18450; 
  const forecastVolume = 4200; // 予約から算出した今日の予測出来高
  const targetMonthly = Number((data?.config as any)?.target_monthly) || 30000;
  const progressActual = Math.min(100, (actualVolume / targetMonthly) * 100);
  const progressForecast = Math.min(100, ((actualVolume + forecastVolume) / targetMonthly) * 100);

  // POS計算ロジック
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) return;
    const product = data?.wires.find(p => p.id === posProduct) || data?.castings.find(p => p.id === posProduct);
    if (!product) return;
    const weight = parseFloat(posWeight);
    const rawPrice = (marketPrice * (product.ratio / 100) * 0.9) - 15;
    setPosResult(Math.floor(Math.max(0, Math.floor(rawPrice)) * weight));
  };

  const wireOptions = data?.wires?.filter(w => w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')) || [];

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col md:flex-row">
      {/* サイドバー */}
      <aside className="w-full md:w-80 bg-black p-8 border-r border-white/10 flex flex-col">
        <div className="mb-12 cursor-pointer" onClick={()=>setView('LP')}>
            <h1 className="text-2xl font-serif font-bold text-white">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">v2.0 Integration</p>
        </div>
        <nav className="space-y-4">
            <button onClick={()=>setAdminTab('DASHBOARD')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='DASHBOARD' ? 'bg-[#D32F2F] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}><Icons.Dashboard /> 統合収支パネル</button>
            <button onClick={()=>setAdminTab('OPERATIONS')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='OPERATIONS' ? 'bg-orange-600/40 border border-orange-500/50 text-orange-400 shadow-lg' : 'text-gray-500 hover:text-white'}`}><Icons.Kanban /> 工程パイプライン</button>
            <button onClick={()=>setAdminTab('POS')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Calc /> 買取POSレジ</button>
            <button onClick={()=>setAdminTab('COMPETITOR')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='COMPETITOR' ? 'bg-blue-900/40 border border-blue-500/50 text-blue-400' : 'text-gray-500 hover:text-white'}`}><Icons.Radar /> 競合分析AI</button>
        </nav>
      </aside>

      {/* メインエリア */}
      <main className="flex-1 p-8 overflow-y-auto">
         
         {/* 1. 統合収支パネル (DASHBOARD) */}
         {adminTab === 'DASHBOARD' && (
             <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-300 space-y-8">
                 <header className="mb-8">
                    <h2 className="text-4xl font-serif font-bold">Financial & Volume</h2>
                    <p className="text-gray-400 mt-2">月次目標に対する「現在実績」と「予約予測」の可視化</p>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 買付出来高メーター */}
                    <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 shadow-lg">
                        <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">月間買付・処理出来高 (Target: {targetMonthly.toLocaleString()}kg)</h3>
                        <div className="flex items-end gap-4 mb-4">
                            <div className="flex-1">
                                <p className="text-xs text-green-400 mb-1">■ 処理完了 (確定)</p>
                                <span className="text-4xl font-black">{actualVolume.toLocaleString()} <span className="text-sm font-normal text-gray-500">kg</span></span>
                            </div>
                            <div className="flex-1 border-l border-white/10 pl-4">
                                <p className="text-xs text-orange-400 mb-1">■ 本日予約 (予測)</p>
                                <span className="text-3xl font-bold text-gray-300">+{forecastVolume.toLocaleString()} <span className="text-sm font-normal text-gray-500">kg</span></span>
                            </div>
                        </div>
                        {/* 二重プログレスバー */}
                        <div className="w-full bg-black rounded-full h-3 mt-4 flex overflow-hidden">
                            <div className="bg-green-500 h-full transition-all" style={{width: `${progressActual}%`}}></div>
                            <div className="bg-orange-500 h-full transition-all opacity-80 striped-bg" style={{width: `${progressForecast - progressActual}%`}}></div>
                        </div>
                    </div>

                    {/* 暫定収支・相場 */}
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-black p-8 rounded-xl border border-[#D32F2F]/30 shadow-lg relative overflow-hidden">
                        <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">今月の想定粗利 (在庫評価額ベース)</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-black text-white">¥4,820,500</span>
                            <span className="text-sm text-green-500 ml-3">↑ 前月比 +12%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[10px] text-gray-500">LME銅建値</p>
                                <p className="font-mono text-lg text-gray-200">¥{marketPrice.toLocaleString()}/kg</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500">平均歩留まり (実績)</p>
                                <p className="font-mono text-lg text-[#D32F2F]">54.2%</p>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
         )}

         {/* 2. 工程パイプライン (OPERATIONS) */}
         {adminTab === 'OPERATIONS' && (
             <div className="h-full flex flex-col animate-in fade-in duration-300">
                 <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-serif font-bold text-orange-400 flex items-center gap-3">
                            <Icons.Kanban /> Operations Pipeline
                        </h2>
                        <p className="text-gray-400 mt-2">非会員/会員の予約〜計量〜ナゲット加工の一元管理 (Sample)</p>
                    </div>
                    <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-500 transition text-sm">
                        + 新規受付 (飛込・電話)
                    </button>
                 </header>

                 {/* Kanban ボード */}
                 <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                     
                     {/* Column 1: 予約・持込予定 */}
                     <div className="flex-none w-80 flex flex-col">
                         <div className="bg-black border border-white/10 rounded-t-xl p-4 flex justify-between items-center">
                             <span className="font-bold text-sm">1. 予約 / 来場待ち</span>
                             <span className="bg-white/10 text-xs px-2 py-1 rounded">2件 (550kg)</span>
                         </div>
                         <div className="bg-[#1a1a1a] border border-t-0 border-white/10 rounded-b-xl flex-1 p-4 space-y-4">
                             {/* Card: 会員予約 */}
                             <div className="bg-[#222] p-4 rounded-lg border-l-4 border-yellow-500 shadow-md cursor-grab active:cursor-grabbing hover:bg-[#333] transition">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold">会員予約</span>
                                     <span className="text-xs text-gray-500">14:00予定</span>
                                 </div>
                                 <p className="font-bold text-sm mb-1">北海解体 株式会社</p>
                                 <p className="text-xs text-gray-400">特1号銅線 ほか / 約500kg</p>
                             </div>
                             {/* Card: 非会員 (電話受付) */}
                             <div className="bg-[#222] p-4 rounded-lg border-l-4 border-gray-500 shadow-md cursor-grab active:cursor-grabbing hover:bg-[#333] transition">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="text-[10px] bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded font-bold">非会員 (電話)</span>
                                     <span className="text-xs text-gray-500">15:30予定</span>
                                 </div>
                                 <p className="font-bold text-sm mb-1">田中 様 (軽トラ)</p>
                                 <p className="text-xs text-gray-400">雑線ミックス / 約50kg</p>
                             </div>
                         </div>
                     </div>

                     {/* Column 2: 検収・計量中 (POS) */}
                     <div className="flex-none w-80 flex flex-col">
                         <div className="bg-black border border-white/10 border-b-[#D32F2F] border-b-2 rounded-t-xl p-4 flex justify-between items-center">
                             <span className="font-bold text-sm text-[#D32F2F]">2. 検収・計量中</span>
                             <span className="bg-[#D32F2F]/20 text-[#D32F2F] text-xs px-2 py-1 rounded">1件</span>
                         </div>
                         <div className="bg-[#1a1a1a] border border-t-0 border-white/10 rounded-b-xl flex-1 p-4 space-y-4">
                             <div className="bg-[#222] p-4 rounded-lg border border-[#D32F2F]/50 shadow-md">
                                 <div className="flex justify-between items-start mb-2">
                                     <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded font-bold">会員 (飛込)</span>
                                 </div>
                                 <p className="font-bold text-sm mb-1">道央設備 建設</p>
                                 <p className="text-xs text-gray-400 mb-3">CVケーブル計量中...</p>
                                 <button onClick={()=>setAdminTab('POS')} className="w-full bg-[#D32F2F]/20 text-[#D32F2F] py-1.5 rounded text-xs font-bold hover:bg-[#D32F2F] hover:text-white transition">POSレジを開く</button>
                             </div>
                         </div>
                     </div>

                     {/* Column 3: ナゲット加工待ち/処理中 */}
                     <div className="flex-none w-80 flex flex-col">
                         <div className="bg-black border border-white/10 rounded-t-xl p-4 flex justify-between items-center">
                             <span className="font-bold text-sm">3. 加工待ち (Batches)</span>
                             <span className="bg-white/10 text-xs px-2 py-1 rounded">1,200kg</span>
                         </div>
                         <div className="bg-[#1a1a1a] border border-t-0 border-white/10 rounded-b-xl flex-1 p-4 space-y-4">
                             <div className="bg-[#222] p-4 rounded-lg border-l-4 border-blue-500 opacity-80">
                                 <p className="font-mono text-xs text-blue-400 mb-1">Batch: B-1770901</p>
                                 <p className="font-bold text-sm mb-1">中線ミックス まとめて処理</p>
                                 <div className="w-full bg-black h-1.5 mt-2 rounded"><div className="bg-blue-500 w-1/3 h-full rounded"></div></div>
                                 <p className="text-[10px] text-gray-500 mt-1 text-right">剥離処理中...</p>
                             </div>
                         </div>
                     </div>

                 </div>
             </div>
         )}

         {/* (POSとCOMPETITORは既存のままなのでモックとして簡略表示。本番では元のコードと結合します) */}
         {adminTab === 'POS' && <div className="text-center py-20 text-gray-500">（※POS画面は省略）</div>}
         {adminTab === 'COMPETITOR' && <div className="text-center py-20 text-gray-500">（※競合分析画面は省略）</div>}

      </main>
    </div>
  );
};
