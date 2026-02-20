// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { MarketData } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Radar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Check: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
};

export const AdminDashboard = ({ data, setView }: { data: any; setView: any }) => {
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'COMPETITOR'>('POS');
  
  // ★ フロント受付用ステート（企業名、連絡先を追加）
  const [posCompany, setPosCompany] = useState<string>('');
  const [posPhone, setPosPhone] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  
  // GASの全相場データ
  const market = data?.market || {};
  const copperPrice = market.copper?.price || data?.config?.market_price || 0;
  const brassPrice = market.brass?.price || 0;
  const zincPrice = market.zinc?.price || 0;
  const leadPrice = market.lead?.price || 0;
  const tinPrice = market.tin?.price || 0;
  const usdjpy = market.usdjpy || 0;
  
  // 予測出来高計算
  const reservations = data?.reservations || [];
  const reservedList = reservations.filter((r: any) => r.status === 'RESERVED');
  const processingList = reservations.filter((r: any) => r.status === 'PROCESSING' || r.status === 'ARRIVED');
  let forecastVolume = 0;
  reservedList.forEach((res: any) => {
     try { JSON.parse(res.items).forEach((i: any) => forecastVolume += (Number(i.weight) || 0)); } catch(e) {}
  });

  const actualVolume = 18450; 
  const targetMonthly = Number(data?.config?.target_monthly) || 30000;
  const progressActual = Math.min(100, (actualVolume / targetMonthly) * 100);
  const progressForecast = Math.min(100, ((actualVolume + forecastVolume) / targetMonthly) * 100);

  // POS計算ロジック
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) return;
    const wire = data?.wires?.find((p: any) => p.id === posProduct);
    const casting = data?.castings?.find((p: any) => p.id === posProduct);
    const product = wire || casting;
    if (!product) return;
    
    const weight = parseFloat(posWeight);
    const rankBonus = posRank === 'A' ? 1.02 : posRank === 'C' ? 0.95 : 1.0;
    
    let rawPrice = 0;
    if (casting) {
        rawPrice = (copperPrice * (product.ratio / 100)) + (casting.price_offset || 0);
    } else {
        rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15;
    }
    setPosResult(Math.floor(Math.max(0, Math.floor(rawPrice * rankBonus)) * weight));
  };

  // カンバンカード描画
  const renderCard = (res: any, isProcessing: boolean = false) => {
      let items: any[] = [];
      try { items = JSON.parse(res.items); } catch(e){}
      const mainItem = items[0] ? items[0].product : '不明な品目';
      const totalWeight = items.reduce((sum, i) => sum + (Number(i.weight)||0), 0);
      const isMember = res.memberId && res.memberId !== 'GUEST';
      
      let timeStr = "未定";
      try {
          if (res.visitDate) {
              const rawStr = String(res.visitDate);
              const d = new Date(res.visitDate);
              if (!isNaN(d.getTime())) {
                  timeStr = `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
              } else {
                  timeStr = rawStr.replace('T', ' ').substring(0, 16);
              }
          }
      } catch(e){}

      return (
        <div key={res.id} className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition hover:shadow-md ${isProcessing ? 'border-l-4 border-l-[#D32F2F]' : (isMember ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-gray-400')}`}>
            <div className="flex justify-between items-center mb-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isMember ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                    {isMember ? '会員' : '非会員'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold">{timeStr} 予定</span>
            </div>
            <p className="font-bold text-gray-900 text-sm truncate">{res.memberName}</p>
            <p className="text-xs text-gray-600 truncate">{mainItem} / 約 <span className="font-bold text-gray-900">{totalWeight}</span> kg</p>
            {isProcessing ? (
                <button onClick={()=>{
                    // カンバンからPOSへデータを渡す処理のモック
                    setPosCompany(res.memberName);
                    setAdminTab('POS');
                }} className="mt-2 w-full bg-red-50 text-[#D32F2F] py-1.5 rounded text-xs font-bold hover:bg-[#D32F2F] hover:text-white transition">レジへ進む</button>
            ) : (
                <button className="mt-2 w-full bg-gray-50 text-gray-600 py-1.5 rounded text-xs font-bold hover:bg-gray-200 transition">到着（計量へ）</button>
            )}
        </div>
      );
  };

  const wireOptions = data?.wires?.filter((w: any) => w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')) || [];

  return (
    <div className="h-screen w-full bg-[#F5F5F7] text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* 🔴 サイドバー */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
        <div className="p-5 cursor-pointer border-b border-gray-50" onClick={()=>setView('LP')}>
            <h1 className="text-xl font-serif font-bold text-gray-900">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <button onClick={()=>setAdminTab('HOME')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='HOME' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Home /> ホーム</button>
            <button onClick={()=>setAdminTab('OPERATIONS')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='OPERATIONS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Kanban /> 現場カンバン</button>
            <button onClick={()=>setAdminTab('POS')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Calc /> 受付・買取レジ</button>
            <button onClick={()=>setAdminTab('COMPETITOR')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='COMPETITOR' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Radar /> 他社価格AI</button>
        </nav>
        
        {/* 全相場ティッカーボード */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-gray-500 font-bold">本日の自動取得相場</p>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-[9px] text-gray-400 block font-bold">銅建値</span>
                    <span className="font-bold text-gray-900 text-sm">¥{copperPrice.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-[9px] text-gray-400 block font-bold">真鍮 (Brass)</span>
                    <span className="font-bold text-gray-900 text-sm">¥{brassPrice.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-[9px] text-gray-400 block font-bold">亜鉛 (Zinc)</span>
                    <span className="font-bold text-gray-900 text-sm">¥{zincPrice.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-[9px] text-gray-400 block font-bold">鉛 (Lead)</span>
                    <span className="font-bold text-gray-900 text-sm">¥{leadPrice.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-[9px] text-gray-400 block font-bold">錫 (Tin)</span>
                    <span className="font-bold text-gray-900 text-sm">¥{tinPrice.toLocaleString()}</span>
                </div>
                <div className="bg-white p-2 rounded border border-gray-200">
                    <span className="text-[9px] text-gray-400 block font-bold">USD/JPY</span>
                    <span className="font-bold text-gray-900 text-sm">¥{usdjpy}</span>
                </div>
            </div>
        </div>
      </aside>

      {/* 🔴 メインエリア */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
         
         {/* 1. HOME (省略) */}
         {adminTab === 'HOME' && (
             <div className="max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col h-full">
                 <header className="mb-6 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900">お疲れ様です。本日の業務を選択してください。</h2>
                 </header>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 flex-shrink-0">
                     <button onClick={()=>setAdminTab('POS')} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-[#D32F2F] transition text-left flex items-center gap-4 group">
                         <div className="w-10 h-10 bg-red-50 text-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Calc /></div>
                         <div>
                             <h3 className="font-bold text-gray-900">受付・買取レジ</h3>
                             <p className="text-[10px] text-gray-500">お客様の受付と明細発行</p>
                         </div>
                     </button>
                     <button onClick={()=>setAdminTab('OPERATIONS')} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-orange-500 transition text-left flex items-center gap-4 group">
                         <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Kanban /></div>
                         <div>
                             <h3 className="font-bold text-gray-900">現場カンバン</h3>
                             <p className="text-[10px] text-gray-500">来場予定と作業進行の管理</p>
                         </div>
                     </button>
                     <button onClick={()=>setAdminTab('COMPETITOR')} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-500 transition text-left flex items-center gap-4 group">
                         <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Radar /></div>
                         <div>
                             <h3 className="font-bold text-gray-900">他社価格を見る</h3>
                             <p className="text-[10px] text-gray-500">競合サイトのAI自動監視</p>
                         </div>
                     </button>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">月間 買付目標と実績</h3>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-sm text-gray-500 font-bold">現在の出来高</span>
                        <span className="text-2xl font-black text-gray-900">{actualVolume.toLocaleString()} <span className="text-xs font-bold text-gray-400">/ {targetMonthly.toLocaleString()} kg</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex mb-2">
                        <div className="bg-[#D32F2F] h-full transition-all" style={{width: `${progressActual}%`}}></div>
                        <div className="bg-orange-300 h-full transition-all opacity-80" style={{width: `${progressForecast - progressActual}%`}}></div>
                    </div>
                 </div>
             </div>
         )}

         {/* 2. OPERATIONS (省略) */}
         {adminTab === 'OPERATIONS' && (
             <div className="flex flex-col h-full animate-in fade-in duration-300">
                 <header className="mb-4 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">現場カンバン</h2>
                    <button onClick={()=>setAdminTab('POS')} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#D32F2F] transition shadow-sm">＋ 飛込受付</button>
                 </header>
                 <div className="flex-1 flex gap-4 overflow-x-auto min-h-0">
                     <div className="flex-none w-[280px] flex flex-col bg-gray-100/50 rounded-xl border border-gray-200 overflow-hidden">
                         <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
                             <span className="font-bold text-sm text-gray-700">① 来場待ち</span>
                             <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold">{reservedList.length}</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                             {reservedList.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">予定なし</p> : reservedList.map(res => renderCard(res, false))}
                         </div>
                     </div>
                     <div className="flex-none w-[280px] flex flex-col bg-red-50/30 rounded-xl border border-red-100 overflow-hidden">
                         <div className="p-3 border-b-2 border-b-[#D32F2F] flex justify-between items-center bg-white">
                             <span className="font-bold text-sm text-[#D32F2F]">② 検収・計量中</span>
                             <span className="bg-[#D32F2F] text-white text-[10px] px-2 py-1 rounded-full font-bold">{processingList.length}</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                              {processingList.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">計量中なし</p> : processingList.map(res => renderCard(res, true))}
                         </div>
                     </div>
                     <div className="flex-none w-[280px] flex flex-col bg-gray-100/50 rounded-xl border border-gray-200 overflow-hidden">
                         <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
                             <span className="font-bold text-sm text-gray-700">③ ナゲット加工待ち</span>
                             <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold">0</span>
                         </div>
                         <div className="flex-1 p-3 flex items-center justify-center">
                             <p className="text-xs text-gray-400 border-2 border-dashed border-gray-300 p-4 rounded-lg text-center w-full mx-2">準備中</p>
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {/* 3. POS (★フロント受付用に大幅改良) */}
         {adminTab === 'POS' && (
            <div className="h-full flex flex-col animate-in fade-in duration-300">
              
              <header className="mb-4 flex-shrink-0 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">受付・買取レジ</h2>
                    <p className="text-xs text-gray-500 mt-1">飛込のお客様の情報入力と、計量・明細発行を行います。</p>
                </div>
                <button className="text-sm font-bold text-[#D32F2F] bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">
                    入力をクリア
                </button>
              </header>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                 {/* 左側：入力フォーム */}
                 <div className="space-y-4 overflow-y-auto pr-2 pb-4">
                    
                    {/* ① お客様情報 (必須) */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-[#D32F2F]"></div>
                       <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">STEP 1</span> お客様情報
                       </h3>
                       <div className="space-y-3">
                           <div>
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">企業名 / お名前</label>
                               <input 
                                 className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-base focus:border-[#D32F2F] outline-none transition" 
                                 placeholder="例: 月寒建設 株式会社" 
                                 value={posCompany} 
                                 onChange={(e)=>setPosCompany(e.target.value)} 
                               />
                           </div>
                           <div>
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">ご連絡先 (任意)</label>
                               <input 
                                 type="tel"
                                 className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-base focus:border-[#D32F2F] outline-none transition" 
                                 placeholder="例: 090-XXXX-XXXX" 
                                 value={posPhone} 
                                 onChange={(e)=>setPosPhone(e.target.value)} 
                               />
                           </div>
                       </div>
                    </div>

                    {/* ② 銘柄と重量 */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-gray-900"></div>
                       <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">STEP 2</span> 銘柄と計量
                       </h3>
                       
                       <label className="text-[10px] text-gray-500 font-bold block mb-1">持ち込まれた品物 (銘柄)</label>
                       <select 
                         className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-base mb-4 focus:border-[#D32F2F] outline-none font-bold cursor-pointer" 
                         value={posProduct} 
                         onChange={(e)=>setPosProduct(e.target.value)}
                       >
                          <option value="">-- 品物を選んでください --</option>
                          <optgroup label="電線">{wireOptions.map((p:any) => (<option key={p.id} value={p.id}>{p.name}</option>))}</optgroup>
                          <optgroup label="非鉄金属">{data?.castings?.map((p:any) => (<option key={p.id} value={p.id}>{p.name}</option>))}</optgroup>
                       </select>
                       
                       <div className="flex gap-3">
                          <div className="flex-1 relative">
                             <label className="text-[10px] text-gray-500 font-bold block mb-1">重さ (kg)</label>
                             <input 
                               type="number" 
                               className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-xl font-black focus:border-[#D32F2F] outline-none" 
                               placeholder="0" 
                               value={posWeight} 
                               onChange={(e)=>setPosWeight(e.target.value)} 
                             />
                             <span className="absolute right-4 bottom-3 text-gray-400 font-bold text-sm">kg</span>
                          </div>
                          <div className="w-28">
                             <label className="text-[10px] text-gray-500 font-bold block mb-1">状態ランク</label>
                             <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 font-bold focus:border-[#D32F2F] outline-none h-[48px]" value={posRank} onChange={(e:any)=>setPosRank(e.target.value)}>
                                <option value="B">普通(B)</option><option value="A">良品(A)</option><option value="C">劣化(C)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    
                    <button onClick={handlePosCalculate} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-[#D32F2F] transition shadow-md active:scale-95 flex items-center justify-center gap-2">
                        <Icons.Calc /> 金額を計算する
                    </button>
                 </div>

                 {/* 右側：受付票 兼 レシートエリア */}
                 <div className="h-full pb-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg h-full flex flex-col relative overflow-hidden">
                       {/* レシート上部のギザギザ装飾 */}
                       <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cG9seWdvbiBwb2ludHM9IjAsMCA0LDggOCwwIiBmaWxsPSIjRjVGNUY3Ii8+Cjwvc3ZnPg==')] repeat-x"></div>
                       
                       <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4 mt-2">
                          <h4 className="font-bold text-xl text-gray-900 tracking-widest">受付票 兼 買取明細</h4>
                          <p className="text-[10px] text-gray-400 mt-1">株式会社 月寒製作所 苫小牧工場</p>
                       </div>
                       
                       <div className="flex-1 space-y-5">
                          <div>
                              <p className="text-[10px] text-gray-400 font-bold mb-0.5">お客様 (企業名)</p>
                              <p className="text-lg font-bold text-gray-900">{posCompany || '未入力'}</p>
                              {posPhone && <p className="text-xs text-gray-500 font-mono mt-1">TEL: {posPhone}</p>}
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold mb-2">品物 / 重さ</p>
                              <div className="flex justify-between items-end">
                                  <div className="flex-1">
                                      <span className="font-bold text-gray-900 text-base block">{data?.wires?.find((x:any)=>x.id===posProduct)?.name || data?.castings?.find((x:any)=>x.id===posProduct)?.name || '未選択'}</span>
                                      <span className="text-[10px] text-gray-400 font-mono mt-1 block">RANK: {posRank}</span>
                                  </div>
                                  <span className="text-gray-900 font-black text-xl ml-2">{posWeight ? `${posWeight} kg` : '-'}</span>
                              </div>
                          </div>
                       </div>

                       <div className="border-t-2 border-gray-900 pt-4 mt-4">
                          <p className="text-[10px] text-gray-500 font-bold mb-1">合計お支払額 (税込)</p>
                          <div className="flex justify-between items-end mb-6 bg-red-50 p-4 rounded-lg">
                              <span className="font-bold text-[#D32F2F] text-xl">¥</span>
                              <span className="text-5xl font-black text-[#D32F2F] tracking-tighter">
                                  {posResult !== null ? posResult.toLocaleString() : '0'}
                              </span>
                          </div>
                          {posResult !== null && (
                              <button className="w-full bg-[#D32F2F] text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-md active:scale-95 flex justify-center items-center gap-2">
                                  <Icons.Check /> 受付を完了し、情報を現場へ送る
                              </button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
         
         {adminTab === 'COMPETITOR' && (
             <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"><Icons.Radar /></div>
                 <h3 className="text-lg font-bold text-gray-900 mb-1">他社価格チェック (開発中)</h3>
                 <p className="text-xs text-gray-500">競合サイトを自動巡回するAIの準備をしています。</p>
             </div>
         )}

      </main>
    </div>
  );
};
