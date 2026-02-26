// @ts-nocheck
import React from 'react';
import { MarketData } from '../../types';

const Icons = {
  TrendingUp: () => <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Truck: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  User: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Money: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

// ★ 追加: 表示名を動的に生成する関数 (sqとcoreを結合)
const getDisplayName = (w: any) => {
    let name = w.name;
    if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
    if (w.core && w.core !== '-') name += ` ${w.core}C`;
    return name;
};

export const AdminDashboard = ({ data }: { data: MarketData | null }) => {
  const marketPrice = data?.market?.copper?.price || 1450;
  const history = data?.history || [];
  const currentPrice = history.length > 0 ? history[history.length - 1].value : marketPrice;
  const prevPrice = history.length > 1 ? history[history.length - 2].value : currentPrice;
  const diff = currentPrice - prevPrice;

  // LME銅相場等の情報
  const usdjpy = data?.market?.usdjpy || 150.00;
  const lmeCopper = data?.market?.lme_copper_usd || 9000;
  const jpyCopperPrice = Math.floor((lmeCopper * usdjpy) / 1000);

  const reservations = data?.reservations || [];
  const activeReservations = reservations.filter(r => r.status === 'RESERVED' || r.status === 'PROCESSING');
  const todayCount = activeReservations.length;
  const todayWeight = activeReservations.reduce((sum, r) => {
      let weight = 0;
      try {
          const items = typeof r.items === 'string' ? JSON.parse(r.items) : r.items;
          weight = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0);
      } catch(e){}
      return sum + weight;
  }, 0);

  // 予算関連
  const targetVolume = Number(data?.config?.target_monthly) || 30000; 
  const currentVolume = 12450; 
  const progress = Math.min(100, Math.floor((currentVolume / targetVolume) * 100));

  const formatTime = (dateStr: string) => {
      try {
          const d = new Date(dateStr);
          return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
      } catch(e) { return '-'; }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-7xl mx-auto w-full text-gray-800 pb-12">
      <header className="mb-6 flex-shrink-0 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                ダッシュボード
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">EXECUTIVE SUMMARY</p>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-gray-400 font-mono">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#D32F2F]"></div>
              <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest flex items-center gap-1"><Icons.Money /> 国内銅建値 (JX)</p>
              <div className="flex items-end gap-2 mt-auto">
                  <span className="text-3xl font-black font-mono text-gray-900">¥{currentPrice.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/kg</span>
              </div>
              <div className="mt-2 text-xs font-bold flex items-center gap-1">
                  {diff > 0 ? <><Icons.TrendingUp /><span className="text-red-500">+{diff}</span></> : diff < 0 ? <><Icons.TrendingDown /><span className="text-blue-500">{diff}</span></> : <><Icons.Minus /><span className="text-gray-400">±0</span></>}
              </div>
          </div>

          <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
              <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest flex items-center gap-1"><Icons.Money /> LME銅 3M</p>
              <div className="flex items-end gap-2 mt-auto">
                  <span className="text-3xl font-black font-mono text-gray-900">${lmeCopper.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/t</span>
              </div>
              <div className="mt-2 text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 inline-block rounded-sm self-start">
                  換算: 約¥{jpyCopperPrice.toLocaleString()}/kg
              </div>
          </div>

          <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
              <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest flex items-center gap-1"><Icons.User /> 本日の予約・持込</p>
              <div className="flex items-end gap-2 mt-auto">
                  <span className="text-3xl font-black font-mono text-gray-900">{todayCount}</span>
                  <span className="text-sm text-gray-500 mb-1">件</span>
              </div>
          </div>

          <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
              <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest flex items-center gap-1"><Icons.Truck /> 本日持込予定量</p>
              <div className="flex items-end gap-2 mt-auto">
                  <span className="text-3xl font-black font-mono text-[#D32F2F]">{todayWeight.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">kg</span>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-900">月間目標進捗 (加工処理量)</h3>
                      <span className="text-xs font-bold text-gray-500 font-mono">{progress}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-gradient-to-r from-gray-800 to-black transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                      <span>{currentVolume.toLocaleString()} kg</span>
                      <span>Target: {targetVolume.toLocaleString()} kg</span>
                  </div>
              </div>

              <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-gray-900">本日の買取価格 (主要品目)</h3>
                  </div>
                  <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-white border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 pl-4">品名</th>
                                  <th className="p-3 text-right">歩留まり</th>
                                  <th className="p-3 pr-4 text-right">買取単価</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-sm">
                              {data?.wires?.slice(0, 5).map((w: any) => (
                                  <tr key={w.id} className="hover:bg-gray-50 transition">
                                      {/* ★ 修正: sqと芯数を結合した名前で表示 */}
                                      <td className="p-3 pl-4 font-bold text-gray-800">{getDisplayName(w)}</td>
                                      <td className="p-3 text-right text-gray-500 font-mono">{w.ratio}%</td>
                                      <td className="p-3 pr-4 text-right font-black font-mono text-[#D32F2F]">¥{Math.floor(marketPrice * (w.ratio/100) * 0.85).toLocaleString()}</td>
                                  </tr>
                              ))}
                              {data?.castings?.slice(0, 3).map((c: any) => {
                                  let base = marketPrice;
                                  if(c.type === 'BRASS') base = data?.market?.brass?.price || 980;
                                  return (
                                      <tr key={c.id} className="hover:bg-gray-50 transition">
                                          <td className="p-3 pl-4 font-bold text-gray-800">{c.name}</td>
                                          <td className="p-3 text-right text-gray-500 font-mono">{c.ratio}%</td>
                                          <td className="p-3 pr-4 text-right font-black font-mono text-gray-900">¥{Math.floor(base * (c.ratio/100) * 0.90).toLocaleString()}</td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
              <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
                  <div className="p-4 border-b border-gray-200 bg-[#111] text-white flex justify-between items-center">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          本日の予約・搬入予定
                      </h3>
                      <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full font-mono">{activeReservations.length}</span>
                  </div>
                  <div className="p-0 overflow-y-auto flex-1">
                      {activeReservations.length === 0 ? (
                          <div className="p-8 text-center text-gray-400 text-sm font-bold">本日の予定はありません</div>
                      ) : (
                          <ul className="divide-y divide-gray-100">
                              {activeReservations.map((res: any) => {
                                  let w = 0;
                                  let p = "品目不明";
                                  try {
                                      const items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items;
                                      if(items.length > 0) {
                                          w = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0);
                                          p = items[0].product || items[0].productName;
                                          if(items.length > 1) p += " 他";
                                      }
                                  } catch(e){}
                                  return (
                                      <li key={res.id} className="p-4 hover:bg-gray-50 transition cursor-pointer">
                                          <div className="flex justify-between items-start mb-1">
                                              <span className="text-xs font-bold text-gray-900">{formatTime(res.visitDate)}</span>
                                              <span className="text-[10px] font-mono text-gray-400">{res.id}</span>
                                          </div>
                                          <p className="font-bold text-sm text-[#D32F2F] mb-1">{res.memberName}</p>
                                          <p className="text-xs text-gray-600">{p} / <span className="font-mono font-bold text-gray-900">{w}kg</span></p>
                                      </li>
                                  )
                              })}
                          </ul>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
