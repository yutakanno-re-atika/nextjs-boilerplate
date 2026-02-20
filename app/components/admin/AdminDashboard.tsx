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

interface AdminProps {
  data: MarketData | null;
  setView: (view: any) => void;
}

export const AdminDashboard = ({ data, setView }: AdminProps) => {
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'COMPETITOR'>('HOME');
  
  // (POSステート)
  const [posUser, setPosUser] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastTxData, setLastTxData] = useState<any>(null);
  
  const marketPrice = data?.config?.market_price || 0;
  
  // 予約データのパース
  const reservations = data?.reservations || [];
  const reservedList = reservations.filter(r => r.status === 'RESERVED');
  const processingList = reservations.filter(r => r.status === 'PROCESSING' || r.status === 'ARRIVED');
  
  // 予測出来高計算
  let forecastVolume = 0;
  reservedList.forEach(res => {
     try {
         const items = JSON.parse(res.items);
         items.forEach(i => forecastVolume += (Number(i.weight) || 0));
     } catch(e) {}
  });

  const actualVolume = 18450; // モック実績
  const targetMonthly = Number(data?.config?.target_monthly) || 30000;
  const progressActual = Math.min(100, (actualVolume / targetMonthly) * 100);
  const progressForecast = Math.min(100, ((actualVolume + forecastVolume) / targetMonthly) * 100);

  // POS計算ロジック
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) { alert("品物と重量を入力してください"); return; }
    const wire = data?.wires.find(p => p.id === posProduct);
    const casting = data?.castings.find(p => p.id === posProduct);
    const product = wire || casting;
    if (!product) return;
    
    const weight = parseFloat(posWeight);
    const rankBonus = posRank === 'A' ? 1.02 : posRank === 'C' ? 0.95 : 1.0;
    
    let rawPrice = 0;
    if (casting) {
        rawPrice = (marketPrice * (product.ratio / 100)) + (casting.price_offset || 0);
    } else {
        rawPrice = (marketPrice * (product.ratio / 100) * 0.9) - 15;
    }
    const adjustedPrice = rawPrice * rankBonus;
    setPosResult(Math.floor(Math.max(0, Math.floor(adjustedPrice)) * weight));
  };

  // カンバンカードの描画ヘルパー
  const renderCard = (res: any, isProcessing: boolean = false) => {
      let items = [];
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
                  const month = d.getMonth() + 1;
                  const date = d.getDate();
                  const hours = d.getHours().toString().padStart(2, '0');
                  const minutes = d.getMinutes().toString().padStart(2, '0');
                  timeStr = `${month}/${date} ${hours}:${minutes}`;
              } else {
                  timeStr = rawStr.replace('T', ' ').substring(0, 16);
              }
          }
      } catch(e){}

      return (
        <div key={res.id} className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md ${isProcessing ? 'border-l-4 border-l-[#D32F2F]' : (isMember ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-gray-400')}`}>
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isMember ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                    {isMember ? '会員予約' : '非会員'}
                </span>
                <span className="text-xs text-gray-500 font-bold">{timeStr} 予定</span>
            </div>
            <p className="font-bold text-gray-900 text-base mb-1">{res.memberName}</p>
            <p className="text-sm text-gray-600">{mainItem} {items.length > 1 ? 'ほか' : ''} / 約 <span className="font-bold">{totalWeight}</span> kg</p>
            {res.memo && <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-md">📝 {res.memo}</p>}
            
            {isProcessing && (
                <button onClick={()=>setAdminTab('POS')} className="mt-4 w-full bg-red-50 text-[#D32F2F] py-2 rounded-lg text-sm font-bold hover:bg-[#D32F2F] hover:text-white transition">
                    この内容でレジへ進む
                </button>
            )}
            {!isProcessing && (
                <button className="mt-4 w-full bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition">
                    到着（計量へ進む）
                </button>
            )}
        </div>
      );
  };

  const wireOptions = data?.wires?.filter(w => w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')) || [];
  const otherWires = data?.wires?.filter(w => !w.name.includes('ミックス') && !w.name.toUpperCase().includes('MIX')) || [];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans flex flex-col md:flex-row">
      
      {/* 🔴 サイドバー (クリーンな白ベース) */}
      <aside className="w-full md:w-72 bg-white p-6 border-r border-gray-200 flex flex-col shadow-sm z-10">
        <div className="mb-10 cursor-pointer" onClick={()=>setView('LP')}>
            <h1 className="text-2xl font-serif font-bold text-gray-900">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">管理メニュー</p>
        </div>
        <nav className="space-y-2">
            <button onClick={()=>setAdminTab('HOME')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='HOME' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><Icons.Home /> ホーム</button>
            <button onClick={()=>setAdminTab('OPERATIONS')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='OPERATIONS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><Icons.Kanban /> 現場の状況 (カンバン)</button>
            <button onClick={()=>setAdminTab('POS')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><Icons.Calc /> 買取レジ (POS)</button>
            <button onClick={()=>setAdminTab('COMPETITOR')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='COMPETITOR' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}><Icons.Radar /> 他社価格チェック</button>
        </nav>
        
        <div className="mt-auto pt-8 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-500 font-bold mb-1">現在の基準相場 (LME)</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-lg font-black text-gray-900">${(data as any)?.market?.lme_copper_usd || 0}</span>
                </div>
            </div>
        </div>
      </aside>

      {/* 🔴 メインエリア */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
         
         {/* 1. HOME (わかりやすいポータル画面) */}
         {adminTab === 'HOME' && (
             <div className="max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
                 <header className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">お疲れ様です、工場長。</h2>
                    <p className="text-gray-500">本日の業務を選んでください。</p>
                 </header>

                 {/* クイックアクション (迷わせない巨大ボタン) */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     <button onClick={()=>setAdminTab('POS')} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#D32F2F] transition text-left group">
                         <div className="w-12 h-12 bg-red-50 text-[#D32F2F] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition"><Icons.Calc /></div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2">買取レジを開く</h3>
                         <p className="text-sm text-gray-500">お客様が来場されたらこちらから計量・明細発行を行います。</p>
                     </button>
                     <button onClick={()=>setAdminTab('OPERATIONS')} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#D32F2F] transition text-left group">
                         <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition"><Icons.Kanban /></div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2">本日の予約を見る</h3>
                         <p className="text-sm text-gray-500">これから来る予定のお客様や、現在作業中の荷物を確認します。</p>
                     </button>
                     <button onClick={()=>setAdminTab('COMPETITOR')} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#D32F2F] transition text-left group">
                         <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition"><Icons.Radar /></div>
                         <h3 className="text-xl font-bold text-gray-900 mb-2">他社の価格を見る</h3>
                         <p className="text-sm text-gray-500">近隣の競合他社の買取価格をAIが集計したレポートを確認します。</p>
                     </button>
                 </div>

                 {/* シンプルな実績パネル */}
                 <h3 className="text-lg font-bold text-gray-900 mb-4">今月の目標と実績</h3>
                 <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm text-gray-500 font-bold">現在の買付量</span>
                                <span className="text-3xl font-black text-gray-900">{actualVolume.toLocaleString()} <span className="text-sm font-bold text-gray-400">/ {targetMonthly.toLocaleString()} kg</span></span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex">
                                <div className="bg-[#D32F2F] h-full transition-all" style={{width: `${progressActual}%`}}></div>
                                <div className="bg-orange-300 h-full transition-all opacity-80" style={{width: `${progressForecast - progressActual}%`}}></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-3">※ オレンジ色は本日の予約（これから来る予定）の見込み量です</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 min-w-[250px] text-center">
                            <p className="text-xs text-gray-500 font-bold mb-1">現在の銅建値 (相場)</p>
                            <p className="text-4xl font-black text-gray-900">¥{marketPrice.toLocaleString()}</p>
                        </div>
                    </div>
                 </div>
             </div>
         )}

         {/* 2. OPERATIONS (現場カンバン - 明るく見やすい) */}
         {adminTab === 'OPERATIONS' && (
             <div className="h-full flex flex-col animate-in fade-in duration-300">
                 <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">現場の状況 (カンバン)</h2>
                        <p className="text-gray-500">予約から加工までの流れを管理します。</p>
                    </div>
                    <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-[#D32F2F] transition shadow-md">
                        ＋ 新しいお客様を受付する
                    </button>
                 </header>

                 <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                     
                     {/* 列1: 来場待ち */}
                     <div className="flex-none w-80 flex flex-col bg-gray-100 rounded-2xl border border-gray-200">
                         <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                             <span className="font-bold text-gray-700">① 来場待ち</span>
                             <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-bold">{reservedList.length} 件</span>
                         </div>
                         <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                             {reservedList.length === 0 ? (
                                 <p className="text-sm text-gray-400 text-center py-10">現在、予定はありません</p>
                             ) : (
                                 reservedList.map(res => renderCard(res, false))
                             )}
                         </div>
                     </div>

                     {/* 列2: 計量中 */}
                     <div className="flex-none w-80 flex flex-col bg-gray-100 rounded-2xl border border-gray-200">
                         <div className="p-4 border-b-2 border-b-[#D32F2F] flex justify-between items-center bg-red-50 rounded-t-2xl">
                             <span className="font-bold text-[#D32F2F]">② 検収・計量中</span>
                             <span className="bg-[#D32F2F] text-white text-xs px-3 py-1 rounded-full font-bold">{processingList.length} 件</span>
                         </div>
                         <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                              {processingList.length === 0 ? (
                                 <p className="text-sm text-gray-400 text-center py-10">計量中のお客様はいません</p>
                             ) : (
                                 processingList.map(res => renderCard(res, true))
                             )}
                         </div>
                     </div>

                     {/* 列3: 加工待ち */}
                     <div className="flex-none w-80 flex flex-col bg-gray-100 rounded-2xl border border-gray-200">
                         <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                             <span className="font-bold text-gray-700">③ ナゲット加工待ち</span>
                             <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-bold">準備中</span>
                         </div>
                         <div className="flex-1 p-4 flex items-center justify-center">
                             <p className="text-sm text-gray-400 border-2 border-dashed border-gray-300 p-8 rounded-xl w-full text-center">
                                ここに計量完了した荷物が<br/>まとまって表示されます
                             </p>
                         </div>
                     </div>

                 </div>
             </div>
         )}

         {/* 3. POS (極限までシンプルにしたiPadレジ風) */}
         {adminTab === 'POS' && (
            <div className="max-w-5xl mx-auto animate-in fade-in zoom-in duration-300">
              <header className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">かんたん買取レジ</h2>
                <p className="text-gray-500">順番に入力するだけで金額が計算されます。</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* 入力エリア */}
                 <div className="space-y-6">
                    
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                       <h3 className="text-sm font-bold text-[#D32F2F] mb-4">① お客様のお名前・ID</h3>
                       <input 
                         className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-900 text-lg focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 outline-none transition" 
                         placeholder="例: 山田太郎 / 090-XXXX" 
                         value={posUser} 
                         onChange={(e)=>setPosUser(e.target.value)} 
                       />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                       <h3 className="text-sm font-bold text-[#D32F2F] mb-4">② 持ち込まれた品物</h3>
                       <select 
                         className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-900 text-lg mb-4 focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 outline-none cursor-pointer font-bold" 
                         value={posProduct} 
                         onChange={(e)=>setPosProduct(e.target.value)}
                       >
                          <option value="">-- 品物を選んでください --</option>
                          <optgroup label="よく出る電線">
                            {wireOptions.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                          </optgroup>
                          <optgroup label="非鉄金属">
                            {data?.castings?.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.type})</option>))}
                          </optgroup>
                       </select>
                       
                       <div className="flex gap-4">
                          <div className="flex-1">
                             <label className="text-xs font-bold text-gray-500 block mb-2">重さ (kg)</label>
                             <div className="relative">
                               <input 
                                 type="number" 
                                 className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-900 text-2xl font-black focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 outline-none" 
                                 placeholder="0" 
                                 value={posWeight} 
                                 onChange={(e)=>setPosWeight(e.target.value)} 
                               />
                               <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                             </div>
                          </div>
                          <div className="w-1/3">
                             <label className="text-xs font-bold text-gray-500 block mb-2">状態ランク</label>
                             <select className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-900 font-bold focus:border-[#D32F2F] outline-none h-[64px]" value={posRank} onChange={(e:any)=>setPosRank(e.target.value)}>
                                <option value="B">普通 (B)</option>
                                <option value="A">良品 (A)</option>
                                <option value="C">劣化 (C)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    
                    <button onClick={handlePosCalculate} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#D32F2F] transition shadow-lg active:scale-95">
                        ③ 計算する
                    </button>
                 </div>

                 {/* レシートエリア */}
                 <div className="h-full">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl relative h-full flex flex-col">
                       <div className="text-center border-b-2 border-dashed border-gray-200 pb-6 mb-6">
                          <h4 className="font-bold text-2xl text-gray-900 mb-1">買取明細</h4>
                          <p className="text-sm text-gray-400">月寒製作所 苫小牧工場</p>
                       </div>
                       
                       <div className="flex-1 space-y-6">
                          <div>
                              <p className="text-xs text-gray-400 font-bold mb-1">お客様</p>
                              <p className="text-lg font-bold text-gray-900">{posUser || '未入力'}</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                              <p className="text-xs text-gray-400 font-bold mb-1">品物</p>
                              <div className="flex justify-between items-center">
                                  <span className="font-bold text-gray-900 text-lg">{data?.wires.find(x=>x.id===posProduct)?.name || data?.castings.find(x=>x.id===posProduct)?.name || '未選択'}</span>
                                  <span className="text-gray-600 font-bold">{posWeight ? `${posWeight} kg` : '-'}</span>
                              </div>
                          </div>
                       </div>

                       <div className="border-t-2 border-gray-900 pt-6 mt-6">
                          <p className="text-sm text-gray-500 font-bold mb-1">合計お支払額 (税込)</p>
                          <div className="flex justify-between items-end mb-8">
                              <span className="font-bold text-gray-400 text-xl">¥</span>
                              <span className="text-5xl font-black text-[#D32F2F] tracking-tighter">
                                  {posResult !== null ? posResult.toLocaleString() : '0'}
                              </span>
                          </div>
                          {posResult !== null && (
                              <button disabled={isSubmitting} className="w-full bg-[#D32F2F] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-md active:scale-95 flex justify-center items-center gap-2">
                                  <Icons.Check /> {isSubmitting ? '処理中...' : '明細を発行して買取を完了する'}
                              </button>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}
         
         {/* 4. COMPETITOR (モック) */}
         {adminTab === 'COMPETITOR' && (
             <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                 <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><Icons.Radar /></div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">他社価格チェック (開発中)</h3>
                 <p className="text-gray-500">競合サイトを自動巡回するAIの準備をしています。</p>
             </div>
         )}

      </main>
    </div>
  );
};
