// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trophy: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copper: () => <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Banknotes: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calculator: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  LightningBolt: () => <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  ClipboardList: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Box: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());
  const [bottomTab, setBottomTab] = useState<'PRICING' | 'ROI'>('PRICING');
  const [analyticsTab, setAnalyticsTab] = useState<'LOG' | 'INVENTORY'>('LOG');
  
  // PRICING State
  const [targetMargin, setTargetMargin] = useState<number>(15);
  
  // ROI State
  const [roiWire, setRoiWire] = useState('');
  const [roiWeight, setRoiWeight] = useState(500);
  const [roiWage, setRoiWage] = useState(2000);
  const [roiHours, setRoiHours] = useState(2);
  const [roiPower, setRoiPower] = useState(1500);

  const currentCopperPrice = data?.market?.copper?.price || 0;
  const currentBrassPrice = data?.market?.brass?.price || 0;
  const currentZincPrice = data?.market?.zinc?.price || 0;
  const currentLeadPrice = data?.market?.lead?.price || 0;
  const currentTinPrice = data?.market?.tin?.price || 0;
  
  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  useEffect(() => {
    if (wiresMaster.length > 0 && !roiWire) { setRoiWire(wiresMaster[0].name); }
  }, [wiresMaster, roiWire]);

  // 1. 今月のKPI
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

  // 2. 月別チャート
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

  // 3. 顧客ランキング
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
              if (p.materialName.includes('80')) expected = 80; else if (p.materialName.includes('40')) expected = 40; else if (p.materialName.includes('雑線')) expected = 35;
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

  // 4. 未加工在庫サマリー
  const lotInventory = useMemo(() => {
      let inventory: any[] = [];
      localReservations.filter(r => r.status === 'COMPLETED').forEach(res => {
          let items = [];
          try { 
              let temp = res.items; if (typeof temp === 'string') temp = JSON.parse(temp); if (typeof temp === 'string') temp = JSON.parse(temp);
              if (Array.isArray(temp)) items = temp;
          } catch(e) {}
          items.forEach((it: any) => {
              const product = it.product || it.productName;
              const initialWeight = Number(it.weight) || 0;
              if (initialWeight > 0 && product) {
                  const isWire = wiresMaster.some((w: any) => w.name === product) || product.includes('線') || product.includes('VVF') || product.includes('VA');
                  if (isWire) {
                      const processedWeight = productions.filter((p: any) => p.reservationId === res.id && p.materialName === product).reduce((sum: number, p: any) => sum + (Number(p.inputWeight) || 0), 0);
                      const remainingWeight = initialWeight - processedWeight;
                      if (remainingWeight > 0) {
                          const productMaster = wiresMaster.find((w: any) => w.name === product);
                          inventory.push({
                              reservationId: res.id, memberName: res.memberName || '名称未設定', date: res.visitDate ? String(res.visitDate).substring(5, 16) : '不明',
                              product: product, remainingWeight: remainingWeight, expectedRatio: productMaster ? productMaster.ratio : 0
                          });
                      }
                  }
              }
          });
      });
      return inventory.sort((a, b) => b.remainingWeight - a.remainingWeight);
  }, [localReservations, productions, wiresMaster]);

  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
  const copperAssetValue = totalProducedCopper * currentCopperPrice;

  // PRICING計算
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

  // ROI計算
  const roiSelectedWire = wiresMaster.find((w:any) => w.name === roiWire) || wiresMaster[0];
  const theoreticalCopperWeight = roiWeight * ((roiSelectedWire?.ratio || 0) / 100);
  const processingCost = (roiWage * roiHours) + roiPower;
  const wholesalePricePerKg = Math.floor(currentCopperPrice * ((roiSelectedWire?.ratio || 0) / 100) * 0.85); // 業者売り想定
  const wholesaleTotal = wholesalePricePerKg * roiWeight;
  const pikaSalesTotal = Math.floor(theoreticalCopperWeight * currentCopperPrice);
  const netProfitProcessing = pikaSalesTotal - processingCost;
  const isProcessingBetter = netProfitProcessing > wholesaleTotal;
  const diffAmount = Math.abs(netProfitProcessing - wholesaleTotal);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full space-y-6 pb-12">
      
      {/* 🔴 スマートなヘッダー */}
      <header className="flex justify-between items-end pb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">各種相場・現場実績・損益シミュレーションの統合ビュー</p>
        </div>
      </header>

      {/* 🔴 トップKPI (4カード) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. 5品目建値ボード */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1.5"><Icons.Banknotes /> 本日の主要建値 (5品目)</p>
              <div className="flex flex-col gap-2 overflow-y-auto">
                  <div className="flex justify-between items-baseline border-b border-gray-50 pb-1">
                      <span className="text-xs font-bold text-gray-400">銅 (JX)</span>
                      <span className="text-xl font-black text-gray-900">{currentCopperPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5 font-medium">円</span></span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-50 pb-1">
                      <span className="text-xs font-bold text-gray-400">真鍮 (日本伸銅)</span>
                      <span className="text-sm font-bold text-gray-700">{currentBrassPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5 font-medium">円</span></span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-50 pb-1">
                      <span className="text-xs font-bold text-gray-400">亜鉛 (三井金属)</span>
                      <span className="text-sm font-bold text-gray-700">{currentZincPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5 font-medium">円</span></span>
                  </div>
                  <div className="flex justify-between items-baseline border-b border-gray-50 pb-1">
                      <span className="text-xs font-bold text-gray-400">鉛 (三菱マテ)</span>
                      <span className="text-sm font-bold text-gray-700">{currentLeadPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5 font-medium">円</span></span>
                  </div>
                  <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-gray-400">錫 (三菱マテ)</span>
                      <span className="text-sm font-bold text-gray-700">{currentTinPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5 font-medium">円</span></span>
                  </div>
              </div>
          </div>

          {/* 2. ピカ銅資産 (ダークテーマ) */}
          <div className="bg-gray-900 p-5 rounded-2xl shadow-md flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-1/4 translate-y-1/4 scale-150"><Icons.Copper /></div>
              <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1.5 z-10"><Icons.Copper /> ピカ銅 製品資産</p>
              <div className="z-10">
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-white tracking-tight">¥{copperAssetValue.toLocaleString()}</span>
                  </div>
                  <div className="mt-4">
                      <span className="text-xs text-gray-300 font-medium bg-gray-800 px-2 py-1 rounded border border-gray-700">総在庫: {totalProducedCopper.toLocaleString()} kg</span>
                  </div>
              </div>
          </div>

          {/* 3. 買取重量 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Icons.Scale /> 今月 ({currentMonthStats.monthNum}月) 買取重量</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-gray-900">{currentMonthStats.thisWeight.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 font-medium">kg</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                      <span className="text-gray-400">前月比</span>
                      <span className={`px-2 py-0.5 rounded ${currentMonthStats.diffWeight >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {currentMonthStats.diffWeight >= 0 ? '+' : ''}{currentMonthStats.diffWeight.toLocaleString()} kg
                      </span>
                  </div>
              </div>
          </div>
          
          {/* 4. 買掛金額 */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5"><Icons.TrendingUp /> 今月 ({currentMonthStats.monthNum}月) 買掛金額</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-gray-900">¥{currentMonthStats.thisAmount.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                      <span className="text-gray-400">前月比</span>
                      <span className={`px-2 py-0.5 rounded ${currentMonthStats.diffAmount >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {currentMonthStats.diffAmount >= 0 ? '+' : ''}{currentMonthStats.diffAmount.toLocaleString()} 円
                      </span>
                  </div>
              </div>
          </div>
      </div>

      {/* 🔴 中段：実績チャート ＆ ランキング */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-sm font-bold text-gray-900">月別買取重量トレンド</h3>
                      <p className="text-[10px] text-gray-400 mt-1 font-medium">単位: kg (完了・アーカイブ済データ)</p>
                  </div>
                  <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer hover:bg-gray-100">
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}年度</option>
                      <option value={2025}>2025年度</option>
                  </select>
              </div>
              <div className="flex-1 flex items-end gap-3 mt-2 relative min-h-[160px]">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03]">
                      <div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div>
                  </div>
                  {monthlyData.map((data) => (
                      <div key={data.month} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                          <div className="absolute -top-12 bg-gray-900 text-white text-[10px] py-1.5 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none text-center shadow-md">
                              <span className="font-bold">{data.weight.toLocaleString()} kg</span><br/>
                              <span className="text-gray-400">¥{data.amount.toLocaleString()}</span>
                          </div>
                          <div 
                              className={`w-full max-w-[40px] rounded-t-sm transition-all duration-300 ${data.month === currentMonthStats.monthNum && chartYear === new Date().getFullYear() ? 'bg-gray-800' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                              style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: data.weight > 0 ? '4px' : '0' }}
                          ></div>
                          <span className="text-[10px] font-bold text-gray-400 mt-2">{data.month}月</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
              <div className="mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5"><Icons.Trophy /> 顧客・品質ランキング</h3>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">マスター想定に対する実質歩留まりの上振れ平均</p>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-1">
                          <Icons.Trophy /><p className="text-xs font-medium text-center">データなし</p>
                      </div>
                  ) : (
                      clientYieldRanking.map((client, idx) => (
                          <div key={idx} onClick={() => onNavigate('CLIENT_DETAIL', client.name)} className="flex items-center justify-between p-2.5 border border-transparent rounded-lg hover:bg-gray-50 hover:border-gray-100 transition cursor-pointer group">
                              <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-600' : idx === 2 ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-400'}`}>
                                      {idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]">{client.name}</p>
                                      <p className="text-[9px] text-gray-400 font-medium">実績: {client.totalInput.toLocaleString()}kg</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <p className={`text-sm font-black ${client.avgDiff > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                      {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                  </p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>

      {/* 🔴 下段ブロック1：シミュレーション・ツールボックス (タブ) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 pt-6 border-b border-gray-100 flex gap-6">
              <button onClick={() => setBottomTab('PRICING')} className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${bottomTab === 'PRICING' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Icons.Banknotes /> 適正単価計算</button>
              <button onClick={() => setBottomTab('ROI')} className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${bottomTab === 'ROI' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Icons.Calculator /> 加工損益(ROI)シミュレータ</button>
          </div>
          
          <div className="p-0">
              {bottomTab === 'PRICING' && (
                  <div className="animate-in fade-in duration-300">
                      <div className="p-4 bg-gray-50 flex justify-between items-center border-b border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">銅建値と歩留まりから含有価値を算出し、目標マージンを差し引きます。</p>
                          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                              <label className="text-xs font-bold text-gray-600">自社目標マージン:</label>
                              <input type="range" min="5" max="30" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-24 accent-gray-900 cursor-pointer" />
                              <span className="text-sm font-black text-gray-900 w-8 text-right">{targetMargin}%</span>
                          </div>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                          <table className="w-full text-left border-collapse">
                              <thead className="bg-white sticky top-0 shadow-sm z-10">
                                  <tr>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider">品目名 / 詳細</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">銅率</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">含有価値</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-900 uppercase tracking-wider text-right">適正買取単価</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">粗利/kg</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                  {currentPricesList.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                                          <td className="py-3 px-6">
                                              <div className="font-bold text-gray-800 text-xs">{item.name}</div>
                                              <div className="text-[9px] text-gray-400 mt-1 flex gap-1 font-medium">
                                                  {item.maker && <span>{item.maker}</span>}
                                                  {item.sq && <span>| {item.sq}</span>}
                                              </div>
                                          </td>
                                          <td className="py-3 px-6 text-center"><span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-100">{item.ratio}%</span></td>
                                          <td className="py-3 px-6 text-right text-gray-500 text-xs font-mono">¥{item.theoreticalValue.toFixed(0)}</td>
                                          <td className="py-3 px-6 text-right"><span className="text-sm font-black text-gray-900">¥{item.purchasePrice}</span></td>
                                          <td className="py-3 px-6 text-right text-xs font-bold text-emerald-600">+¥{item.profit}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {bottomTab === 'ROI' && (
                  <div className="p-6 animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8 bg-gray-50/30">
                      {/* 左：条件入力 */}
                      <div className="space-y-4">
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 mb-1 block">シミュレーション対象の電線</label>
                              <select className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none" value={roiWire} onChange={e => setRoiWire(e.target.value)}>
                                  {wiresMaster.map((w:any) => <option key={w.id} value={w.name}>{w.name} (銅率: {w.ratio}%)</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 mb-1 block">加工予定の重量 (kg)</label>
                              <input type="number" className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none" value={roiWeight} onChange={e => setRoiWeight(Number(e.target.value))} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">想定作業時間 (h)</label>
                                  <input type="number" step="0.5" className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none" value={roiHours} onChange={e => setRoiHours(Number(e.target.value))} />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">作業者時給 (円)</label>
                                  <input type="number" className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none" value={roiWage} onChange={e => setRoiWage(Number(e.target.value))} />
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 mb-1 block">その他経費・機械電気代 (円)</label>
                              <input type="number" className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-bold outline-none" value={roiPower} onChange={e => setRoiPower(Number(e.target.value))} />
                          </div>
                      </div>

                      {/* 右：比較結果 */}
                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                              <div>
                                  <h4 className="text-xs font-bold text-gray-600 mb-1">📦 そのまま(被覆線として)売却</h4>
                                  <p className="text-[10px] text-gray-400">想定業者卸単価: ¥{wholesalePricePerKg} / kg</p>
                              </div>
                              <div className="mt-4 border-t border-gray-100 pt-3">
                                  <p className="text-xl font-black text-gray-900">¥{wholesaleTotal.toLocaleString()}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">売上 (＝粗利)</p>
                              </div>
                          </div>

                          <div className={`rounded-xl p-5 border shadow-sm flex flex-col justify-between ${isProcessingBetter ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-gray-200'}`}>
                              <div>
                                  <h4 className={`text-xs font-bold mb-1 flex items-center gap-1 ${isProcessingBetter ? 'text-emerald-700' : 'text-gray-600'}`}><Icons.LightningBolt /> ナゲット加工・ピカ線で売却</h4>
                                  <p className="text-[10px] text-gray-400">銅回収: {theoreticalCopperWeight.toFixed(1)}kg / 経費: ¥{processingCost.toLocaleString()}</p>
                              </div>
                              <div className="mt-4 border-t border-gray-100 pt-3">
                                  <p className={`text-xl font-black ${isProcessingBetter ? 'text-emerald-700' : 'text-gray-900'}`}>¥{netProfitProcessing.toLocaleString()}</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">純利益 (売上 - 経費)</p>
                              </div>
                          </div>

                          <div className="sm:col-span-2 mt-1 bg-gray-900 rounded-xl p-4 flex justify-between items-center text-white shadow-md">
                              <div>
                                  <p className="text-[10px] text-gray-400 font-medium">AI推奨アクション</p>
                                  <p className="text-sm font-bold mt-0.5">{isProcessingBetter ? '自社で加工した方が利益が最大化されます' : '人件費負けします。そのまま売却してください'}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-medium">利益差額</p>
                                  <p className={`text-xl font-black ${isProcessingBetter ? 'text-emerald-400' : 'text-orange-400'}`}>
                                      {isProcessingBetter ? '+' : '-'}¥{diffAmount.toLocaleString()}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* 🔴 下段ブロック2：現場アナリティクス (タブ) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 pt-6 border-b border-gray-100 flex gap-6">
              <button onClick={() => setAnalyticsTab('LOG')} className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${analyticsTab === 'LOG' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Icons.ClipboardList /> 最近の加工実績ログ</button>
              <button onClick={() => setAnalyticsTab('INVENTORY')} className={`pb-3 text-sm font-bold border-b-2 transition flex items-center gap-1.5 ${analyticsTab === 'INVENTORY' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Icons.Box /> 未加工・ヤード在庫 <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">{lotInventory.length}</span></button>
          </div>

          <div className="max-h-[300px] overflow-y-auto p-0">
              {analyticsTab === 'LOG' && (
                  <table className="w-full text-left border-collapse animate-in fade-in duration-300">
                      <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
                          <tr><th className="py-3 px-6 text-[10px] font-bold text-gray-500">加工日 / 顧客</th><th className="py-3 px-6 text-[10px] font-bold text-gray-500">品目</th><th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">投入量</th><th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">銅回収量</th><th className="py-3 px-6 text-[10px] font-bold text-gray-900 text-right">実質歩留</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {productions.slice(-15).reverse().map((p: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                  <td className="py-3 px-6"><div className="text-[10px] text-gray-400 font-mono">{String(p.date).substring(5,16)}</div><div className="text-xs font-bold text-gray-800">{p.memberName}</div></td>
                                  <td className="py-3 px-6 text-xs font-bold text-gray-600">{p.materialName}</td>
                                  <td className="py-3 px-6 text-right text-xs font-medium text-gray-500">{p.inputWeight} kg</td>
                                  <td className="py-3 px-6 text-right text-xs font-bold text-gray-800">{p.outputCopper} kg</td>
                                  <td className="py-3 px-6 text-right"><span className="text-sm font-black text-[#D32F2F]">{p.actualRatio}%</span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}

              {analyticsTab === 'INVENTORY' && (
                  <table className="w-full text-left border-collapse animate-in fade-in duration-300">
                      <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
                          <tr><th className="py-3 px-6 text-[10px] font-bold text-gray-500">入荷日 / 顧客</th><th className="py-3 px-6 text-[10px] font-bold text-gray-500">品目</th><th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-center">想定歩留</th><th className="py-3 px-6 text-[10px] font-bold text-gray-900 text-right">未加工残量</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {lotInventory.length === 0 ? (<tr><td colSpan={4} className="py-8 text-center text-xs text-gray-400">現在、未加工の在庫はありません</td></tr>) : lotInventory.map((lot, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                  <td className="py-3 px-6"><div className="text-[10px] text-gray-400 font-mono">{lot.date}</div><div className="text-xs font-bold text-gray-800">{lot.memberName}</div></td>
                                  <td className="py-3 px-6 text-xs font-bold text-gray-600">{lot.product}</td>
                                  <td className="py-3 px-6 text-center"><span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">{lot.expectedRatio}%</span></td>
                                  <td className="py-3 px-6 text-right"><span className="text-sm font-black text-gray-900">{lot.remainingWeight.toFixed(1)} <span className="text-[10px] text-gray-500 font-medium">kg</span></span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}
          </div>
      </div>
    </div>
  );
};
