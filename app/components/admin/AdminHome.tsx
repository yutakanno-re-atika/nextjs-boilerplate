// @ts-nocheck
"use client";
import React, { useMemo, useState, useEffect } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trophy: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copper: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Banknotes: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calculator: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  LightningBolt: () => <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  ClipboardList: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  ArrowUp: () => <svg className="w-3.5 h-3.5 mr-0.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  ArrowDown: () => <svg className="w-3.5 h-3.5 mr-0.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
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

  // ★ 追加: ヤード在庫の計算（本日の状況用にも使用）
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

  // ★ 追加: 本日の受付状況と全体サマリーの計算
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
    <div className="flex flex-col animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full space-y-4 md:space-y-6 pb-12 font-sans text-gray-800">
      
      {/* 🔴 ヘッダー */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end pb-2 md:pb-3 border-b border-gray-200/60 flex-shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">相場連動プライシングと経営実績の統合ビュー</p>
        </div>
      </header>

      {/* 🔴 本日の状況 & 全体サマリー (新規追加) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 flex-shrink-0">
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer hover:border-blue-400 transition group" onClick={() => onNavigate('OPERATIONS')}>
              <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider group-hover:text-blue-600 transition">本日の受付</p>
                  <p className="text-lg md:text-xl font-black text-gray-900 mt-0.5">{todaySummary.todaysCount} <span className="text-xs font-medium text-gray-500">件</span> <span className="text-sm font-bold text-[#D32F2F] ml-1">{todaySummary.todaysWeight.toLocaleString()}kg</span></p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition"><Icons.ClipboardList /></div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer hover:border-orange-400 transition group" onClick={() => onNavigate('PRODUCTION')}>
              <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider group-hover:text-orange-600 transition">ヤード未加工在庫</p>
                  <p className="text-lg md:text-xl font-black text-gray-900 mt-0.5">{todaySummary.totalInventoryWeight.toLocaleString()} <span className="text-xs font-medium text-gray-500">kg</span></p>
              </div>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:scale-110 transition"><Icons.Box /></div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer hover:border-green-400 transition group" onClick={() => onNavigate('DATABASE')}>
              <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider group-hover:text-green-600 transition">登録顧客 (会員)</p>
                  <p className="text-lg md:text-xl font-black text-gray-900 mt-0.5">{todaySummary.totalClients} <span className="text-xs font-medium text-gray-500">社</span></p>
              </div>
              <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition"><Icons.Users /></div>
          </div>
          <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer hover:border-red-400 transition group" onClick={() => onNavigate('SALES')}>
              <div>
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider group-hover:text-red-600 transition">営業ターゲット</p>
                  <p className="text-lg md:text-xl font-black text-gray-900 mt-0.5">{todaySummary.activeTargets} <span className="text-xs font-medium text-gray-500">社</span></p>
              </div>
              <div className="p-2 bg-red-50 text-[#D32F2F] rounded-lg group-hover:scale-110 transition"><Icons.Target /></div>
          </div>
      </div>

      {/* 🔴 トップKPI (相場・月間業績) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 flex-shrink-0">
          <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                  <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">本日の主要建値</h6>
                  <div className="p-1.5 bg-red-50 text-[#D32F2F] rounded"><Icons.Banknotes /></div>
              </div>
              <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end border-b border-gray-100 pb-1.5">
                      <span className="text-xs font-semibold text-gray-500">銅 (JX)</span>
                      <span className="text-lg font-bold text-gray-900">{currentCopperPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5">円</span></span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-100 pb-1.5">
                      <span className="text-xs font-semibold text-gray-500">真鍮 (日本伸銅)</span>
                      <span className="text-sm font-semibold text-gray-700">{currentBrassPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5">円</span></span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-100 pb-1.5">
                      <span className="text-xs font-semibold text-gray-500">亜鉛 (三井)</span>
                      <span className="text-sm font-semibold text-gray-700">{currentZincPrice.toLocaleString()}<span className="text-[10px] text-gray-400 ml-0.5">円</span></span>
                  </div>
                  <div className="flex justify-between items-end">
                      <span className="text-xs font-semibold text-gray-500">鉛/錫</span>
                      <span className="text-xs font-semibold text-gray-500">{currentLeadPrice} / {currentTinPrice} <span className="text-[9px] text-gray-400">円</span></span>
                  </div>
              </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-5 rounded-lg shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 scale-150 text-orange-500"><Icons.Copper /></div>
              <div className="flex justify-between items-center mb-4 z-10">
                  <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ピカ銅 製品資産</h6>
                  <div className="p-1.5 bg-gray-800 text-orange-500 rounded"><Icons.Copper /></div>
              </div>
              <div className="z-10">
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl md:text-3xl font-bold tracking-tight">¥{copperAssetValue.toLocaleString()}</span>
                  </div>
                  <div className="mt-3">
                      <span className="text-[11px] font-medium bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-300">総在庫: {totalProducedCopper.toLocaleString()} kg</span>
                  </div>
              </div>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">今月 ({currentMonthStats.monthNum}月) 買取重量</h6>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">{currentMonthStats.thisWeight.toLocaleString()} <span className="text-xs font-medium text-gray-500">kg</span></h3>
                  </div>
                  <div className="p-1.5 bg-gray-50 text-gray-600 rounded"><Icons.Scale /></div>
              </div>
              <div className="flex items-center text-xs font-medium mt-auto">
                  <span className={`flex items-center ${currentMonthStats.diffWeight >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {currentMonthStats.diffWeight >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                      {currentMonthStats.diffWeight >= 0 ? '+' : ''}{currentMonthStats.diffWeight.toLocaleString()} kg
                  </span>
                  <span className="text-gray-400 ml-2">前月比</span>
              </div>
          </div>
          
          <div className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h6 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">今月 ({currentMonthStats.monthNum}月) 買掛金額</h6>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">¥{currentMonthStats.thisAmount.toLocaleString()}</h3>
                  </div>
                  <div className="p-1.5 bg-gray-50 text-gray-600 rounded"><Icons.TrendingUp /></div>
              </div>
              <div className="flex items-center text-xs font-medium mt-auto">
                  <span className={`flex items-center ${currentMonthStats.diffAmount >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {currentMonthStats.diffAmount >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                      {currentMonthStats.diffAmount >= 0 ? '+' : ''}{currentMonthStats.diffAmount.toLocaleString()} 円
                  </span>
                  <span className="text-gray-400 ml-2">前月比</span>
              </div>
          </div>
      </div>

      {/* 🔴 中段：チャート ＆ ランキング */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 flex-shrink-0">
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 flex flex-col min-h-[250px] md:min-h-[300px]">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h3 className="text-sm md:text-base font-bold text-gray-900">月別買取トレンド</h3>
                      <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">単位: kg (完了・アーカイブ済データ)</p>
                  </div>
                  <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-white border border-gray-200 text-gray-600 px-2 md:px-3 py-1.5 rounded-md text-xs font-semibold outline-none cursor-pointer focus:border-[#D32F2F] focus:ring-1 focus:ring-red-500">
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}年度</option>
                      <option value={2025}>2025年度</option>
                  </select>
              </div>
              <div className="flex-1 flex items-end gap-1.5 md:gap-4 mt-2 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                      <div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div>
                  </div>
                  {monthlyData.map((data: any) => (
                      <div key={data.month} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                          <div className="absolute -top-12 bg-gray-800 text-white text-[10px] md:text-[11px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none text-center shadow-md">
                              <span className="font-semibold">{data.weight.toLocaleString()} kg</span><br/>
                              <span className="text-gray-300">¥{data.amount.toLocaleString()}</span>
                          </div>
                          <div className="w-full h-full flex items-end bg-gray-50 rounded-t-sm">
                              <div 
                                  className={`w-full rounded-t-sm transition-all duration-500 ${data.month === currentMonthStats.monthNum && chartYear === new Date().getFullYear() ? 'bg-[#D32F2F]' : 'bg-red-200 group-hover:bg-red-300'}`}
                                  style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: data.weight > 0 ? '4px' : '0' }}
                              ></div>
                          </div>
                          <span className="text-[9px] md:text-[11px] font-semibold text-gray-400 mt-2">{data.month}月</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 flex flex-col min-h-[250px] md:min-h-[300px]">
              <div className="mb-4">
                  <h3 className="text-sm md:text-base font-bold text-gray-900">品質・歩留まりランキング</h3>
                  <p className="text-[10px] md:text-[11px] text-gray-400 mt-0.5">マスター想定に対する実質上振れ</p>
              </div>
              <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-1.5">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-300">
                          <p className="text-xs font-medium text-center">データなし</p>
                      </div>
                  ) : (
                      clientYieldRanking.map((client: any, idx: number) => (
                          <div key={idx} onClick={() => onNavigate('CLIENT_DETAIL', client.name)} className="flex items-center justify-between p-2 md:p-2.5 border border-transparent rounded-md hover:bg-gray-50 transition cursor-pointer">
                              <div className="flex items-center gap-2 md:gap-3">
                                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-[9px] md:text-[10px] font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-600' : idx === 2 ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                                      {idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-[11px] md:text-xs font-semibold text-gray-800 truncate max-w-[100px] md:max-w-[130px]">{client.name}</p>
                                      <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">総加工: {client.totalInput.toLocaleString()}kg</p>
                                  </div>
                              </div>
                              <div className="text-right flex items-center">
                                  <p className={`text-[11px] md:text-xs font-bold ${client.avgDiff > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                      {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                  </p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>

      {/* 🔴 下段ブロック1：シミュレーション・ツールボックス */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden flex-shrink-0">
          <div className="bg-white px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-gray-100 overflow-x-auto">
              <div className="inline-flex p-1 bg-gray-100 rounded-md whitespace-nowrap">
                  <button onClick={() => setBottomTab('PRICING')} className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded transition-all ${bottomTab === 'PRICING' ? 'bg-white text-[#D32F2F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Icons.Banknotes /> 適正単価計算
                  </button>
                  <button onClick={() => setBottomTab('ROI')} className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded transition-all ${bottomTab === 'ROI' ? 'bg-white text-[#D32F2F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Icons.Calculator /> 加工損益(ROI)
                  </button>
              </div>
          </div>
          
          <div className="p-0">
              {bottomTab === 'PRICING' && (
                  <div className="animate-in fade-in duration-300">
                      <div className="p-4 bg-gray-50/50 flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-100 gap-3 md:gap-4">
                          <p className="text-[11px] md:text-xs text-gray-500 font-medium">銅建値と歩留まりから含有価値を算出し、目標マージンを差し引きます。</p>
                          <div className="flex items-center justify-between md:justify-start gap-3 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm w-full md:w-auto">
                              <label className="text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-wider">目標マージン</label>
                              <div className="flex items-center gap-2">
                                  <input type="range" min="5" max="30" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-20 md:w-24 accent-[#D32F2F] cursor-pointer" />
                                  <span className="text-xs md:text-sm font-bold text-gray-800 w-6 md:w-8 text-right">{targetMargin}%</span>
                              </div>
                          </div>
                      </div>
                      <div className="max-h-[500px] overflow-x-auto overflow-y-auto">
                          <table className="w-full text-left border-collapse min-w-[500px]">
                              <thead className="bg-white sticky top-0 shadow-sm z-10 border-b border-gray-200">
                                  <tr>
                                      <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">品目 / 詳細</th>
                                      <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">歩留まり</th>
                                      <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">含有価値</th>
                                      <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-wider text-right">適正単価</th>
                                      <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">粗利/kg</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {currentPricesList.map((item: any, idx: number) => (
                                      <tr key={idx} className="hover:bg-gray-50 transition">
                                          <td className="py-2 md:py-3 px-4 md:px-6">
                                              <div className="font-semibold text-gray-800 text-[11px] md:text-xs">{item.name}</div>
                                              <div className="text-[9px] md:text-[10px] text-gray-400 mt-1 flex gap-1 font-medium">
                                                  {item.maker && <span>{item.maker}</span>}
                                                  {item.sq && <span>| {item.sq}</span>}
                                              </div>
                                          </td>
                                          <td className="py-2 md:py-3 px-4 md:px-6 text-center"><span className="text-[11px] md:text-xs font-semibold text-gray-600">{item.ratio}%</span></td>
                                          <td className="py-2 md:py-3 px-4 md:px-6 text-right text-gray-500 text-[11px] md:text-xs font-mono">¥{item.theoreticalValue.toFixed(0)}</td>
                                          <td className="py-2 md:py-3 px-4 md:px-6 text-right"><span className="text-xs md:text-sm font-bold text-[#D32F2F]">¥{item.purchasePrice}</span></td>
                                          <td className="py-2 md:py-3 px-4 md:px-6 text-right text-[11px] md:text-xs font-semibold text-emerald-600">+¥{item.profit}</td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {bottomTab === 'ROI' && (
                  <div className="p-4 md:p-6 animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 bg-gray-50/30">
                      <div className="space-y-4">
                          <div>
                              <label className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-1 block">対象の電線</label>
                              <select className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-[11px] md:text-xs font-semibold outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" value={roiWire} onChange={e => setRoiWire(e.target.value)}>
                                  {wiresMaster.map((w:any) => <option key={w.id} value={w.name}>{w.name} (銅率: {w.ratio}%)</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-1 block">加工重量 (kg)</label>
                              <input type="number" className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-[11px] md:text-xs font-semibold outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" value={roiWeight} onChange={e => setRoiWeight(Number(e.target.value))} />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-1 block">作業時間 (h)</label>
                                  <input type="number" step="0.5" className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-[11px] md:text-xs font-semibold outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" value={roiHours} onChange={e => setRoiHours(Number(e.target.value))} />
                              </div>
                              <div>
                                  <label className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-1 block">時給 (円)</label>
                                  <input type="number" className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-[11px] md:text-xs font-semibold outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" value={roiWage} onChange={e => setRoiWage(Number(e.target.value))} />
                              </div>
                          </div>
                          <div>
                              <label className="text-[10px] md:text-[11px] font-semibold text-gray-500 mb-1 block">その他経費 (円)</label>
                              <input type="number" className="w-full p-2.5 bg-white border border-gray-200 rounded-md text-[11px] md:text-xs font-semibold outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" value={roiPower} onChange={e => setRoiPower(Number(e.target.value))} />
                          </div>
                      </div>

                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 content-start">
                          <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                              <div>
                                  <h4 className="text-[11px] md:text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">そのまま売却</h4>
                                  <p className="text-[9px] md:text-[10px] text-gray-400">卸単価: ¥{wholesalePricePerKg} / kg</p>
                              </div>
                              <div className="mt-4 md:mt-5 border-t border-gray-100 pt-3">
                                  <p className="text-lg md:text-xl font-bold text-gray-800">¥{wholesaleTotal.toLocaleString()}</p>
                                  <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">売上 (＝粗利)</p>
                              </div>
                          </div>

                          <div className={`rounded-lg p-4 md:p-5 border shadow-sm flex flex-col justify-between ${isProcessingBetter ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                              <div>
                                  <h4 className={`text-[11px] md:text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-wider ${isProcessingBetter ? 'text-[#D32F2F]' : 'text-gray-600'}`}><Icons.LightningBolt /> 加工・ピカ線売却</h4>
                                  <p className="text-[9px] md:text-[10px] text-gray-400">銅回収: {theoreticalCopperWeight.toFixed(1)}kg / 経費: ¥{processingCost.toLocaleString()}</p>
                              </div>
                              <div className="mt-4 md:mt-5 border-t border-gray-100 pt-3">
                                  <p className={`text-lg md:text-xl font-bold ${isProcessingBetter ? 'text-[#D32F2F]' : 'text-gray-800'}`}>¥{netProfitProcessing.toLocaleString()}</p>
                                  <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5">純利益 (売上 - 経費)</p>
                              </div>
                          </div>

                          <div className="sm:col-span-2 mt-2 bg-gray-900 rounded-lg p-4 md:p-5 flex justify-between items-center text-white shadow-sm border border-gray-800">
                              <div>
                                  <p className="text-[9px] md:text-[10px] text-gray-400 font-medium uppercase tracking-wider">AI Recommendation</p>
                                  <p className="text-xs md:text-sm font-semibold mt-1 text-gray-100">{isProcessingBetter ? '自社で加工した方が利益が最大化されます' : '人件費負けします。そのまま売却してください'}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-[9px] md:text-[10px] text-gray-400 font-medium uppercase tracking-wider">Profit Diff</p>
                                  <p className={`text-base md:text-lg font-bold mt-1 ${isProcessingBetter ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {isProcessingBetter ? '+' : '-'}¥{diffAmount.toLocaleString()}
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* 🔴 下段ブロック2：現場アナリティクス */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col overflow-hidden flex-shrink-0">
          <div className="bg-white px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-gray-100 overflow-x-auto">
              <div className="inline-flex p-1 bg-gray-100 rounded-md whitespace-nowrap">
                  <button onClick={() => setAnalyticsTab('LOG')} className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded transition-all ${analyticsTab === 'LOG' ? 'bg-white text-[#D32F2F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Icons.ClipboardList /> 最近の加工実績
                  </button>
                  <button onClick={() => setAnalyticsTab('INVENTORY')} className={`flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-bold rounded transition-all ${analyticsTab === 'INVENTORY' ? 'bg-white text-[#D32F2F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Icons.Box /> 未加工在庫 <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded text-[10px] ml-1">{lotInventory.length}</span>
                  </button>
              </div>
          </div>

          <div className="max-h-[500px] overflow-x-auto overflow-y-auto p-0">
              {analyticsTab === 'LOG' && (
                  <table className="w-full text-left border-collapse min-w-[500px] animate-in fade-in duration-300">
                      <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">加工日 / 顧客</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">品目</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">投入量</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">銅回収量</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-wider text-right">実質歩留</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {productions.slice(-15).reverse().map((p: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                  <td className="py-2 md:py-3 px-4 md:px-6"><div className="text-[9px] md:text-[10px] text-gray-400 font-mono">{String(p.date).substring(5,16)}</div><div className="text-[11px] md:text-xs font-semibold text-gray-800">{p.memberName}</div></td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-xs font-semibold text-gray-600">{p.materialName}</td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-right text-[11px] md:text-xs font-medium text-gray-500">{p.inputWeight} kg</td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-right text-[11px] md:text-xs font-semibold text-gray-800">{p.outputCopper} kg</td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-right"><span className="text-xs md:text-sm font-bold text-[#D32F2F]">{p.actualRatio}%</span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}

              {analyticsTab === 'INVENTORY' && (
                  <table className="w-full text-left border-collapse min-w-[500px] animate-in fade-in duration-300">
                      <thead className="bg-white sticky top-0 z-10 border-b border-gray-200">
                          <tr>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">入荷日 / 顧客</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">品目</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">想定歩留</th>
                              <th className="py-2.5 md:py-3 px-4 md:px-6 text-[9px] md:text-[10px] font-bold text-gray-800 uppercase tracking-wider text-right">未加工残量</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {lotInventory.length === 0 ? (<tr><td colSpan={4} className="py-8 text-center text-xs text-gray-400 font-medium">現在、未加工の在庫はありません</td></tr>) : lotInventory.map((lot: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                  <td className="py-2 md:py-3 px-4 md:px-6"><div className="text-[9px] md:text-[10px] text-gray-400 font-mono">{lot.date}</div><div className="text-[11px] md:text-xs font-semibold text-gray-800">{lot.memberName}</div></td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-[11px] md:text-xs font-semibold text-gray-600">{lot.product}</td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-center"><span className="text-[11px] md:text-xs font-semibold text-gray-500">{lot.expectedRatio}%</span></td>
                                  <td className="py-2 md:py-3 px-4 md:px-6 text-right"><span className="text-xs md:text-sm font-bold text-gray-900">{lot.remainingWeight.toFixed(1)} <span className="text-[9px] md:text-[10px] text-gray-500 font-medium">kg</span></span></td>
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
