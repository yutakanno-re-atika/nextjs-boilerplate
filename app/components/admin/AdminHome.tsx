// @ts-nocheck
import React, { useMemo, useState } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trophy: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copper: () => <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  ArrowUp: () => <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  ArrowDown: () => <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Banknotes: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());
  const [targetMargin, setTargetMargin] = useState<number>(15);

  const currentCopperPrice = data?.market?.copper?.price || 0;
  const currentZincPrice = data?.market?.zinc?.price || 0;
  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    let thisWeight = 0, thisAmount = 0, lastWeight = 0, lastAmount = 0;

    localReservations.forEach(res => {
      if (res.status !== 'COMPLETED' && res.status !== 'ARCHIVED') return;
      const d = new Date(res.visitDate || res.createdAt);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      let totalW = 0;
      try {
        let items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items;
        if (typeof items === 'string') items = JSON.parse(items);
        if (Array.isArray(items)) { items.forEach((it: any) => { totalW += (Number(it.weight) || 0); }); }
      } catch(e) {}
      if (mStr === thisMonthStr) { thisWeight += totalW; thisAmount += (Number(res.totalEstimate) || 0); }
      else if (mStr === lastMonthStr) { lastWeight += totalW; lastAmount += (Number(res.totalEstimate) || 0); }
    });

    return { monthNum: now.getMonth() + 1, thisWeight, thisAmount, diffWeight: thisWeight - lastWeight, diffAmount: thisAmount - lastAmount };
  }, [localReservations]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, weight: 0, amount: 0 }));
    localReservations.filter(r => r.status === 'COMPLETED' || r.status === 'ARCHIVED').forEach(res => {
      const date = new Date(res.visitDate || res.createdAt);
      if (date.getFullYear() === chartYear) {
        const mIndex = date.getMonth();
        let totalW = 0;
        try {
          let items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items;
          if (typeof items === 'string') items = JSON.parse(items);
          if (Array.isArray(items)) { items.forEach((it: any) => { totalW += (Number(it.weight) || 0); }); }
        } catch(e) {}
        months[mIndex].weight += totalW;
        months[mIndex].amount += (Number(res.totalEstimate) || 0);
      }
    });
    return months;
  }, [localReservations, chartYear]);
  const maxWeight = Math.max(...monthlyData.map(d => d.weight), 100);

  const clientYieldRanking = useMemo(() => {
      const clientStats: Record<string, { totalInput: number, yieldDiffSum: number, count: number }> = {};
      productions.forEach((p: any) => {
          if (!p.memberName || p.inputWeight <= 0) return;
          const name = p.memberName;
          if (!clientStats[name]) clientStats[name] = { totalInput: 0, yieldDiffSum: 0, count: 0 };
          const actual = Number(p.actualRatio) || 0;
          const master = wiresMaster.find((w:any) => w.name === p.materialName);
          let expected = master ? Number(master.ratio) : 0;
          if (expected === 0 && p.materialName) {
              if (p.materialName.includes('80')) expected = 80;
              else if (p.materialName.includes('70')) expected = 70;
              else if (p.materialName.includes('60')) expected = 60;
              else if (p.materialName.includes('50')) expected = 50;
              else if (p.materialName.includes('40')) expected = 40;
              else if (p.materialName.includes('雑線')) expected = 35;
          }
          if (expected > 0 && actual > 0) {
              clientStats[name].yieldDiffSum += (actual - expected);
              clientStats[name].count += 1;
              clientStats[name].totalInput += Number(p.inputWeight);
          }
      });
      return Object.entries(clientStats).map(([name, stats]) => ({ name, totalInput: stats.totalInput, avgDiff: stats.count > 0 ? (stats.yieldDiffSum / stats.count) : 0 }))
          .filter(c => c.count !== 0).sort((a, b) => b.avgDiff - a.avgDiff).slice(0, 5);
  }, [productions, wiresMaster]);

  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
  const copperAssetValue = totalProducedCopper * currentCopperPrice;

  const currentPricesList = useMemo(() => {
      if (currentCopperPrice === 0) return [];
      const userMarginRatio = (100 - targetMargin) / 100; 
      return wiresMaster.map((w: any) => {
          const ratio = Number(w.ratio) || 0;
          const theoreticalValue = currentCopperPrice * (ratio / 100); 
          const purchasePrice = Math.floor(theoreticalValue * userMarginRatio); 
          const profit = Math.floor(theoreticalValue - purchasePrice); 
          return { name: w.name, maker: w.maker, sq: w.sq, core: w.core, ratio: ratio, theoreticalValue, purchasePrice, profit };
      }).sort((a, b) => b.ratio - a.ratio); 
  }, [currentCopperPrice, wiresMaster, targetMargin]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full space-y-8 pb-12">
      
      {/* 🔴 洗練されたヘッダー */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">相場連動プライシングと経営実績の統合ビュー</p>
        </div>
      </header>

      {/* 🔴 スマートなトップKPI (ホワイト＆ダークのコントラスト) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. 建値 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2"><Icons.Banknotes /> 本日の主要建値</p>
              <div className="flex flex-col gap-3 mt-2">
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                      <span className="text-xs font-bold text-gray-400">銅 (JX)</span>
                      <span className="text-3xl font-bold text-gray-900">{currentCopperPrice.toLocaleString()}<span className="text-sm text-gray-400 ml-1 font-medium">円</span></span>
                  </div>
                  <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-gray-400">亜鉛 (三井)</span>
                      <span className="text-xl font-bold text-gray-700">{currentZincPrice.toLocaleString()}<span className="text-xs text-gray-400 ml-1 font-medium">円</span></span>
                  </div>
              </div>
          </div>

          {/* 2. 資産 (ここだけダークにして視線を誘導) */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-md flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 scale-150"><Icons.Copper /></div>
              <p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2 z-10"><Icons.Copper /> ピカ銅 製品資産</p>
              <div className="z-10">
                  <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-bold text-white tracking-tight">¥{copperAssetValue.toLocaleString()}</span>
                  </div>
                  <div className="mt-4">
                      <span className="text-xs text-gray-400 font-medium bg-gray-800 px-2.5 py-1.5 rounded-lg border border-gray-700">総在庫: {totalProducedCopper.toLocaleString()} kg</span>
                  </div>
              </div>
          </div>

          {/* 3. 買取重量 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2"><Icons.Scale /> 今月 ({currentMonthStats.monthNum}月) 買取重量</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-gray-900">{currentMonthStats.thisWeight.toLocaleString()}</span>
                      <span className="text-sm text-gray-400 font-medium">kg</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                      <span className="text-gray-400">前月比</span>
                      <span className={`px-2 py-0.5 rounded-md ${currentMonthStats.diffWeight >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {currentMonthStats.diffWeight >= 0 ? '+' : ''}{currentMonthStats.diffWeight.toLocaleString()} kg
                      </span>
                  </div>
              </div>
          </div>
          
          {/* 4. 買掛金額 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2"><Icons.TrendingUp /> 今月 ({currentMonthStats.monthNum}月) 買掛金額</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-bold text-gray-900">¥{currentMonthStats.thisAmount.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                      <span className="text-gray-400">前月比</span>
                      <span className={`px-2 py-0.5 rounded-md ${currentMonthStats.diffAmount >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {currentMonthStats.diffAmount >= 0 ? '+' : ''}{currentMonthStats.diffAmount.toLocaleString()} 円
                      </span>
                  </div>
              </div>
          </div>
      </div>

      {/* 🔴 中段：実績チャート ＆ 評価ランキング */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* チャート */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col">
              <div className="flex justify-between items-center mb-10">
                  <div>
                      <h3 className="text-lg font-bold text-gray-900">月別買取重量トレンド</h3>
                      <p className="text-xs text-gray-400 mt-1 font-medium">単位: kg</p>
                  </div>
                  <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold outline-none cursor-pointer hover:bg-gray-100 transition">
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}年度</option>
                      <option value={2025}>2025年度</option>
                  </select>
              </div>
              
              <div className="flex-1 flex items-end gap-4 mt-2 relative min-h-[220px]">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                      <div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div>
                  </div>
                  {monthlyData.map((data) => (
                      <div key={data.month} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                          <div className="absolute -top-14 bg-gray-900 text-white text-xs py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none text-center shadow-md">
                              <span className="font-bold">{data.weight.toLocaleString()} kg</span><br/>
                              <span className="text-gray-400">¥{data.amount.toLocaleString()}</span>
                          </div>
                          <div 
                              className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 ${data.month === currentMonthStats.monthNum && chartYear === new Date().getFullYear() ? 'bg-gray-800' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                              style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: data.weight > 0 ? '4px' : '0' }}
                          ></div>
                          <span className="text-xs font-medium text-gray-400 mt-4">{data.month}月</span>
                      </div>
                  ))}
              </div>
          </div>

          {/* ランキング */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col">
              <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Icons.Trophy /> 優良顧客ランキング</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">マスター想定歩留まりに対する、実績の上振れ平均値</p>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-2">
                          <Icons.Trophy />
                          <p className="text-sm font-medium text-center">加工データがありません</p>
                      </div>
                  ) : (
                      clientYieldRanking.map((client, idx) => (
                          <div key={idx} onClick={() => onNavigate('CLIENT_DETAIL', client.name)} className="flex items-center justify-between p-3 border border-transparent rounded-xl hover:bg-gray-50 hover:border-gray-100 transition cursor-pointer group">
                              <div className="flex items-center gap-4">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-600' : idx === 2 ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-400'}`}>
                                      {idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-800 transition truncate max-w-[130px]">{client.name}</p>
                                      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">加工実績: {client.totalInput.toLocaleString()} kg</p>
                                  </div>
                              </div>
                              <div className="text-right flex items-center gap-1">
                                  <p className={`text-base font-bold ${client.avgDiff > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                      {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                  </p>
                                  <div className="opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0">
                                      <Icons.ChevronRight />
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>

      {/* 🔴 下段：フルワイドの適正単価表 (広々とした空間) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Icons.Banknotes /> 本日の適正・買取単価シミュレーター
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">銅建値({currentCopperPrice}円) × 歩留まり% で含有価値を算出し、目標マージンを差し引きます。</p>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-gray-100">
                  <label className="text-sm font-bold text-gray-600">自社目標マージン:</label>
                  <div className="flex items-center gap-3">
                      <input type="range" min="5" max="30" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-32 accent-gray-900 cursor-pointer" />
                      <span className="text-lg font-bold text-gray-900 w-10 text-right">{targetMargin}%</span>
                  </div>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead className="bg-white">
                      <tr>
                          <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider">品目名 / 詳細</th>
                          <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">銅率 (歩留)</th>
                          <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">含有価値</th>
                          <th className="py-5 px-8 text-xs font-bold text-gray-800 uppercase tracking-wider text-right">適正買取単価</th>
                          <th className="py-5 px-8 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">想定粗利/kg</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {currentPricesList.length === 0 ? (
                          <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-medium">建値が取得できていません</td></tr>
                      ) : currentPricesList.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition">
                              <td className="py-4 px-8">
                                  <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                  <div className="text-xs text-gray-400 mt-1.5 flex flex-wrap gap-2 font-medium">
                                      {item.maker && <span>{item.maker}</span>}
                                      {item.sq && <span className="text-gray-300">|</span>}
                                      {item.sq && <span>{item.sq}</span>}
                                      {item.core && <span className="text-gray-300">|</span>}
                                      {item.core && <span>{item.core}</span>}
                                  </div>
                              </td>
                              <td className="py-4 px-8 text-center">
                                  <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-md text-sm font-semibold border border-gray-100">{item.ratio}%</span>
                              </td>
                              <td className="py-4 px-8 text-right text-gray-500 text-sm font-mono">¥{item.theoreticalValue.toFixed(0)}</td>
                              <td className="py-4 px-8 text-right">
                                  <span className="text-xl font-bold text-gray-900">¥{item.purchasePrice}</span>
                              </td>
                              <td className="py-4 px-8 text-right text-sm font-semibold text-emerald-600">+¥{item.profit}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
