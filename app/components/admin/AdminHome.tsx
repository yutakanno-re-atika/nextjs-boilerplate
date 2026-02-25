// @ts-nocheck
"use client";
import React, { useMemo, useState, useEffect } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Copper: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Banknotes: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  LightningBolt: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  ClipboardList: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Box: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  ArrowUp: () => <svg className="w-3 h-3 mr-0.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  ArrowDown: () => <svg className="w-3 h-3 mr-0.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Users: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Target: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());
  const [bottomTab, setBottomTab] = useState<'PRICING' | 'ROI'>('PRICING');
  const [analyticsTab, setAnalyticsTab] = useState<'LOG' | 'INVENTORY'>('LOG');
  
  const [targetMargin, setTargetMargin] = useState<number>(15);
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

  const lotInventory = useMemo(() => {
      let inventory: any[] = [];
      localReservations.filter((r: any) => r.status === 'COMPLETED').forEach((res: any) => {
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
                          inventory.push({ reservationId: res.id, memberName: res.memberName || '名称未設定', date: res.visitDate ? String(res.visitDate).substring(5, 16) : '不明', product: product, remainingWeight: remainingWeight, expectedRatio: productMaster ? productMaster.ratio : 0 });
                      }
                  }
              }
          });
      });
      return inventory.sort((a: any, b: any) => b.remainingWeight - a.remainingWeight);
  }, [localReservations, productions, wiresMaster]);

  const todaySummary = useMemo(() => {
      const todayStr = new Date().toLocaleDateString('ja-JP');
      const todaysReservations = localReservations.filter((r: any) => {
          if (!r.createdAt && !r.visitDate) return false;
          const d = new Date(r.createdAt || r.visitDate);
          return d.toLocaleDateString('ja-JP') === todayStr;
      });
      const todaysCount = todaysReservations.length;
      const todaysWeight = todaysReservations.reduce((sum, r) => {
          let w = 0;
          try {
              let items = typeof r.items === 'string' ? JSON.parse(r.items) : r.items;
              if (typeof items === 'string') items = JSON.parse(items);
              if (Array.isArray(items)) { items.forEach((it: any) => { w += (Number(it.weight) || 0); }); }
          } catch(e) {}
          return sum + w;
      }, 0);

      const totalClients = data?.clients?.length || 0;
      const activeTargets = data?.salesTargets?.filter((t: any) => t.status !== '既存取引先').length || 0;
      const totalInventoryWeight = lotInventory.reduce((sum, lot) => sum + lot.remainingWeight, 0);

      return { todaysCount, todaysWeight, totalClients, activeTargets, totalInventoryWeight };
  }, [localReservations, data, lotInventory]);

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;
    let thisWeight = 0, thisAmount = 0, lastWeight = 0, lastAmount = 0;
    localReservations.forEach((res: any) => {
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
    localReservations.filter((r: any) => r.status === 'COMPLETED' || r.status === 'ARCHIVED').forEach((res: any) => {
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
  const maxWeight = Math.max(...monthlyData.map((d: any) => d.weight), 100);

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
      return Object.entries(clientStats)
          .map(([name, stats]: any) => ({ name, totalInput: stats.totalInput, count: stats.count, avgDiff: stats.count > 0 ? (stats.yieldDiffSum / stats.count) : 0 }))
          .filter((c: any) => c.count !== 0).sort((a: any, b: any) => b.avgDiff - a.avgDiff).slice(0, 5);
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
      }).sort((a: any, b: any) => b.ratio - a.ratio); 
  }, [currentCopperPrice, wiresMaster, targetMargin]);

  const roiSelectedWire = wiresMaster.find((w:any) => w.name === roiWire) || wiresMaster?.[0] || {};
  const theoreticalCopperWeight = roiWeight * ((roiSelectedWire?.ratio || 0) / 100);
  const processingCost = (roiWage * roiHours) + roiPower;
  const wholesalePricePerKg = Math.floor(currentCopperPrice * ((roiSelectedWire?.ratio || 0) / 100) * 0.85);
  const wholesaleTotal = wholesalePricePerKg * roiWeight;
  const pikaSalesTotal = Math.floor(theoreticalCopperWeight * currentCopperPrice);
  const netProfitProcessing = pikaSalesTotal - processingCost;
  const isProcessingBetter = netProfitProcessing > wholesaleTotal;
  const diffAmount = Math.abs(netProfitProcessing - wholesaleTotal);

  return (
    <div className="flex flex-col animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full space-y-6 pb-12 font-sans text-gray-800">
      
      {/* 🔴 Header */}
      <header className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight font-serif">FACTORY OS</h2>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-widest">苫小牧工場 ダッシュボード</p>
        </div>
        <div className="text-right">
             <div className="text-xs text-gray-400 font-bold mb-1">本日の銅建値</div>
             <div className="text-2xl font-black text-[#D32F2F] tracking-tighter">¥{currentCopperPrice.toLocaleString()}</div>
        </div>
      </header>

      {/* 🔴 Quick Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-white p-4 hover:bg-gray-50 cursor-pointer transition group" onClick={() => onNavigate('OPERATIONS')}>
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">本日の受付</span>
                  <Icons.ClipboardList className="text-gray-300 group-hover:text-[#D32F2F] transition" />
              </div>
              <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{todaySummary.todaysCount}</span>
                  <span className="text-xs font-bold text-gray-400">件</span>
                  <span className="text-sm font-bold text-[#D32F2F] ml-2">{todaySummary.todaysWeight.toLocaleString()}kg</span>
              </div>
          </div>
          <div className="bg-white p-4 hover:bg-gray-50 cursor-pointer transition group" onClick={() => onNavigate('PRODUCTION')}>
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">ヤード在庫 (未加工)</span>
                  <Icons.Box className="text-gray-300 group-hover:text-[#D32F2F] transition" />
              </div>
              <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{todaySummary.totalInventoryWeight.toLocaleString()}</span>
                  <span className="text-xs font-bold text-gray-400">kg</span>
              </div>
          </div>
          <div className="bg-white p-4 hover:bg-gray-50 cursor-pointer transition group" onClick={() => onNavigate('DATABASE')}>
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">登録顧客</span>
                  <Icons.Users className="text-gray-300 group-hover:text-[#D32F2F] transition" />
              </div>
              <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{todaySummary.totalClients}</span>
                  <span className="text-xs font-bold text-gray-400">社</span>
              </div>
          </div>
          <div className="bg-white p-4 hover:bg-gray-50 cursor-pointer transition group" onClick={() => onNavigate('SALES')}>
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider">営業ターゲット</span>
                  <Icons.Target className="text-gray-300 group-hover:text-[#D32F2F] transition" />
              </div>
              <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{todaySummary.activeTargets}</span>
                  <span className="text-xs font-bold text-gray-400">社</span>
              </div>
          </div>
      </div>

      {/* 🔴 Main Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-[#111] text-white p-6 rounded-sm shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute right-[-10px] top-[-10px] text-gray-800 opacity-20 transform rotate-12 scale-150"><Icons.Copper /></div>
              <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Product Asset</div>
                  <h3 className="text-sm font-bold text-gray-200">ピカ銅 製品在庫資産</h3>
              </div>
              <div className="mt-8 relative z-10">
                  <div className="text-3xl font-black tracking-tighter font-mono">¥{copperAssetValue.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">総在庫: {totalProducedCopper.toLocaleString()} kg</div>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-[#D32F2F] w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </div>

          <div className="lg:col-span-3 bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 w-full border-r border-gray-100 pr-4">
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold text-gray-400 tracking-widest">月間買取量</h4>
                      <Icons.Scale className="text-gray-300" />
                  </div>
                  <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-gray-900 font-mono">{currentMonthStats.thisWeight.toLocaleString()}</span>
                      <span className="text-sm font-bold text-gray-400">kg</span>
                  </div>
                  <div className={`text-xs font-bold mt-2 flex items-center ${currentMonthStats.diffWeight >= 0 ? 'text-gray-900' : 'text-[#D32F2F]'}`}>
                       {currentMonthStats.diffWeight >= 0 ? '+' : ''}{currentMonthStats.diffWeight.toLocaleString()} kg <span className="text-gray-400 font-normal ml-1">前月比</span>
                  </div>
              </div>

              <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold text-gray-400 tracking-widest">月間買掛金</h4>
                      <Icons.Banknotes className="text-gray-300" />
                  </div>
                  <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-gray-900 font-mono">¥{currentMonthStats.thisAmount.toLocaleString()}</span>
                  </div>
                  <div className={`text-xs font-bold mt-2 flex items-center ${currentMonthStats.diffAmount >= 0 ? 'text-gray-900' : 'text-[#D32F2F]'}`}>
                       {currentMonthStats.diffAmount >= 0 ? '+' : ''}{currentMonthStats.diffAmount.toLocaleString()} 円 <span className="text-gray-400 font-normal ml-1">前月比</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 🔴 Charts & Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
              <div className="flex justify-between items-center mb-8">
                  <h3 className="text-sm font-bold text-gray-900">年間買取トレンド (kg)</h3>
                  <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-gray-50 border border-gray-200 text-xs font-bold px-3 py-1 rounded-sm outline-none">
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}年</option>
                      <option value={2025}>2025年</option>
                  </select>
              </div>
              <div className="h-48 flex items-end gap-2 md:gap-4 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[...Array(4)].map((_, i) => <div key={i} className="border-t border-gray-100 w-full h-0"></div>)}
                  </div>
                  {monthlyData.map((data: any) => {
                      const isCurrent = data.month === currentMonthStats.monthNum && chartYear === new Date().getFullYear();
                      return (
                          <div key={data.month} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                              <div className="absolute -top-10 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
                                  {data.weight.toLocaleString()} kg
                              </div>
                              <div 
                                  className={`w-full transition-all duration-500 ${isCurrent ? 'bg-[#D32F2F]' : 'bg-gray-200 group-hover:bg-gray-400'}`}
                                  style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: '2px' }}
                              ></div>
                              <span className={`text-[9px] font-mono mt-2 ${isCurrent ? 'text-[#D32F2F] font-bold' : 'text-gray-400'}`}>{data.month}月</span>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex flex-col">
              <h3 className="text-sm font-bold text-gray-900 mb-6">品質・歩留まり トップ5</h3>
              <div className="flex-1 space-y-2">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-300 text-xs">データがありません</div>
                  ) : (
                      clientYieldRanking.map((client: any, idx: number) => (
                          <div key={idx} onClick={() => onNavigate('CLIENT_DETAIL', client.name)} className="flex items-center justify-between p-3 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition cursor-pointer rounded-sm group">
                              <div className="flex items-center gap-3">
                                  <span className={`text-xs font-mono font-bold w-4 ${idx === 0 ? 'text-[#D32F2F]' : 'text-gray-400'}`}>0{idx + 1}</span>
                                  <div>
                                      <p className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{client.name}</p>
                                      <p className="text-[9px] text-gray-400 mt-0.5">総加工: {client.totalInput.toLocaleString()}kg</p>
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className={`text-xs font-mono font-black ${client.avgDiff > 0 ? 'text-gray-900' : 'text-[#D32F2F]'}`}>
                                      {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                  </span>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>

      {/* 🔴 Tools */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
              <button onClick={() => setBottomTab('PRICING')} className={`px-6 py-3 text-xs font-bold tracking-widest transition-colors ${bottomTab === 'PRICING' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>適正単価計算</button>
              <button onClick={() => setBottomTab('ROI')} className={`px-6 py-3 text-xs font-bold tracking-widest transition-colors ${bottomTab === 'ROI' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>加工損益 (ROI)</button>
          </div>
          
          <div className="p-0">
              {bottomTab === 'PRICING' && (
                  <div className="animate-in fade-in duration-300">
                      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                           <span className="text-xs font-bold text-gray-500">目標マージン設定</span>
                           <div className="flex items-center gap-3">
                               <input type="range" min="5" max="30" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-32 accent-[#D32F2F] cursor-pointer" />
                               <span className="text-sm font-mono font-bold text-[#D32F2F]">{targetMargin}%</span>
                           </div>
                      </div>
                      <div className="max-h-[400px] overflow-auto">
                          <table className="w-full text-left border-collapse">
                              <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                                  <tr>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-500">品目</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-center">歩留</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">含有価値</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-900 text-right">適正単価</th>
                                      <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">粗利/kg</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {currentPricesList.map((item: any, idx: number) => (
                                      <tr key={idx} className="hover:bg-gray-50 transition">
                                          <td className="py-2 px-6">
                                              <div className="text-xs font-bold text-gray-900">{item.name}</div>
                                          </td>
                                          <td className="py-2 px-6 text-center"><span className="text-xs font-mono text-gray-500">{item.ratio}%</span></td>
                                          <td className="py-2 px-6 text-right text-xs font-mono text-gray-400">¥{item.theoreticalValue.toFixed(0)}</td>
                                          <td className="py-2 px-6 text-right"><span className="text-sm font-mono font-bold text-[#D32F2F]">¥{item.purchasePrice}</span></td>
                                          <td className="py-2 px-6 text-right text-xs font-mono font-bold text-gray-900">+¥{item.profit}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {bottomTab === 'ROI' && (
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
                      <div className="space-y-4">
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 mb-1 block">対象電線</label>
                              <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-gray-400" value={roiWire} onChange={e => setRoiWire(e.target.value)}>
                                  {wiresMaster.map((w:any) => <option key={w.id} value={w.name}>{w.name} ({w.ratio}%)</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="text-[10px] font-bold text-gray-500 mb-1 block">加工重量 (kg)</label>
                              <input type="number" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-gray-400 font-mono" value={roiWeight} onChange={e => setRoiWeight(Number(e.target.value))} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">作業時間 (h)</label>
                                  <input type="number" step="0.5" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-gray-400 font-mono" value={roiHours} onChange={e => setRoiHours(Number(e.target.value))} />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">時給 (円)</label>
                                  <input type="number" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-sm text-xs font-bold outline-none focus:border-gray-400 font-mono" value={roiWage} onChange={e => setRoiWage(Number(e.target.value))} />
                              </div>
                          </div>
                      </div>

                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border border-gray-200 p-5 rounded-sm flex flex-col justify-between">
                              <div>
                                  <h4 className="text-xs font-bold text-gray-600 mb-1">そのまま売却</h4>
                                  <p className="text-[10px] text-gray-400 font-mono">単価: ¥{wholesalePricePerKg} / kg</p>
                              </div>
                              <div className="mt-4 border-t border-gray-100 pt-2">
                                  <p className="text-xl font-black text-gray-900 font-mono">¥{wholesaleTotal.toLocaleString()}</p>
                              </div>
                          </div>

                          <div className={`p-5 rounded-sm flex flex-col justify-between border ${isProcessingBetter ? 'bg-[#111] text-white border-black' : 'bg-gray-50 border-gray-200'}`}>
                              <div>
                                  <h4 className={`text-xs font-bold mb-1 ${isProcessingBetter ? 'text-gray-200' : 'text-gray-600'}`}>加工して売却</h4>
                                  <p className={`text-[10px] font-mono ${isProcessingBetter ? 'text-gray-400' : 'text-gray-400'}`}>回収: {theoreticalCopperWeight.toFixed(1)}kg / 経費: -¥{processingCost.toLocaleString()}</p>
                              </div>
                              <div className="mt-4 border-t border-gray-700 pt-2">
                                  <p className={`text-xl font-black font-mono ${isProcessingBetter ? 'text-[#D32F2F]' : 'text-gray-900'}`}>¥{netProfitProcessing.toLocaleString()}</p>
                              </div>
                          </div>

                          <div className="sm:col-span-2 mt-2 flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-sm">
                              <span className="text-xs font-bold text-gray-600">AI推奨アクション</span>
                              <div className="text-right">
                                  <span className={`text-lg font-black font-mono ${isProcessingBetter ? 'text-gray-900' : 'text-[#D32F2F]'}`}>
                                      {isProcessingBetter ? '+' : '-'} ¥{diffAmount.toLocaleString()}
                                  </span>
                                  <p className="text-[10px] text-gray-500 font-bold mt-1">{isProcessingBetter ? '自社加工を推奨します' : '現状のまま売却を推奨します'}</p>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>
      
      {/* 🔴 Analytics */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 bg-gray-50">
              <button onClick={() => setAnalyticsTab('LOG')} className={`px-6 py-3 text-xs font-bold tracking-widest transition-colors ${analyticsTab === 'LOG' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>最近の加工実績</button>
              <button onClick={() => setAnalyticsTab('INVENTORY')} className={`px-6 py-3 text-xs font-bold tracking-widest transition-colors ${analyticsTab === 'INVENTORY' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>未加工在庫</button>
          </div>
          <div className="max-h-[400px] overflow-auto p-0">
             {analyticsTab === 'LOG' && (
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500">日付 / 顧客</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500">品目</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">投入量</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">産出量</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-right">実質歩留</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {productions.slice(-15).reverse().map((p: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                  <td className="py-2 px-6">
                                      <div className="text-[10px] text-gray-400 font-mono">{String(p.date).substring(5,16)}</div>
                                      <div className="text-xs font-bold text-gray-900">{p.memberName}</div>
                                  </td>
                                  <td className="py-2 px-6 text-xs text-gray-600 font-medium">{p.materialName}</td>
                                  <td className="py-2 px-6 text-right text-xs font-mono text-gray-500">{p.inputWeight} kg</td>
                                  <td className="py-2 px-6 text-right text-xs font-mono text-gray-900">{p.outputCopper} kg</td>
                                  <td className="py-2 px-6 text-right"><span className="text-xs font-mono font-bold text-[#D32F2F]">{p.actualRatio}%</span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
             )}
             {analyticsTab === 'INVENTORY' && (
                  <table className="w-full text-left border-collapse">
                      <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500">入荷日 / 顧客</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500">品目</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-500 text-center">想定歩留</th>
                              <th className="py-3 px-6 text-[10px] font-bold text-gray-900 text-right">在庫量</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {lotInventory.length === 0 ? (<tr><td colSpan={4} className="py-8 text-center text-xs text-gray-400 font-medium">データがありません</td></tr>) : lotInventory.map((lot: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                  <td className="py-2 px-6">
                                      <div className="text-[10px] text-gray-400 font-mono">{lot.date}</div>
                                      <div className="text-xs font-bold text-gray-900">{lot.memberName}</div>
                                  </td>
                                  <td className="py-2 px-6 text-xs text-gray-600 font-medium">{lot.product}</td>
                                  <td className="py-2 px-6 text-center text-xs font-mono text-gray-400">{lot.expectedRatio}%</td>
                                  <td className="py-2 px-6 text-right"><span className="text-xs font-mono font-bold text-gray-900">{lot.remainingWeight.toFixed(1)} kg</span></td>
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
