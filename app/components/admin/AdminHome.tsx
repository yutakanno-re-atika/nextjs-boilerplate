// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>,
  Truck: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4-4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  Radar: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Factory: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Scale: () => <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  ArrowRight: () => <svg className="w-5 h-5 text-gray-300 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Message: () => <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Brain: () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-11h-2v2h2V9zm0 4h-2v6h2v-6z" /></svg>,
  ExternalLink: () => <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
};

// ★ バッジのスタイル変更：文字サイズ12px、色を赤・黒・ダークレッド（赤黒混色）に変更
const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
  const baseStyle = "inline-block px-1.5 py-0.5 text-[12px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
  switch (type) {
    case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
    // ★ 赤（#D32F2F）と黒（#111827）を混ぜたダークレッド
    case 'CO_OP': return <span className={`${baseStyle} bg-[#7A1C1C]`} title="AI＋人間 協調データ">AI+HUMAN</span>;
    case 'AI_AUTO': return <span className={`${baseStyle} bg-[#D32F2F]`} title="AI予測・推論データ">AI</span>;
    default: return null;
  }
};

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 4;
  const width = 100;
  const height = 40;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = max === min ? height / 2 : height - padding - ((d - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const fillPoints = `${width},${height} 0,${height} ${points}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-aspect-ratio-none" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points.split(' ').pop()?.split(',')[0]} cy={points.split(' ').pop()?.split(',')[1]} r="2" fill={color} />
    </svg>
  );
};

const getDisplayName = (w: any) => {
  if (!w) return "不明な品目";
  let name = w.name;
  if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
  if (w.core && w.core !== '-') name += ` ${w.core}C`;
  return name;
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showAiData, setShowAiData] = useState(true);
  
  useEffect(() => { setIsMounted(true); }, []);

  const copperPrice = Number(data?.config?.market_price) || 1450;
  const brassPrice = Number(data?.config?.brass_price) || 980;
  const zincPrice = Number(data?.config?.zinc_price) || 450;
  const leadPrice = Number(data?.config?.lead_price) || 380;
  const tinPrice = Number(data?.config?.tin_price) || 8900;
  const usdjpy = Number(data?.config?.usdjpy) || 150.00;
  const lmeCopper = Number(data?.config?.lme_copper_usd) || 9000;
  const jpyCopperPrice = Math.floor((lmeCopper * usdjpy) / 1000);

  const history = data?.history || [];
  const currentPrice = history.length > 0 ? Number(history[history.length - 1].value) : copperPrice;
  
  const extractSparkData = (key: string, fallbackPrice: number) => {
    const vals = history.map((h: any) => Number(h[key] || (key === 'copper' ? h.value : fallbackPrice)));
    return vals.length >= 7 ? vals.slice(-7) : [...Array(7 - vals.length).fill(fallbackPrice), ...vals];
  };

  const copperSparkData = extractSparkData('copper', copperPrice);
  const brassSparkData = extractSparkData('brass', brassPrice);
  const zincSparkData = extractSparkData('zinc', zincPrice);
  const leadSparkData = extractSparkData('lead', leadPrice);
  const tinSparkData = extractSparkData('tin', tinPrice);

  const getDiff = (sparkData: number[]) => {
    if (sparkData.length >= 2) return sparkData[sparkData.length - 1] - sparkData[sparkData.length - 2];
    return 0;
  };
  const copperDiff = getDiff(copperSparkData);

  const marketItems = [
    { label: '銅建値 (JX)', price: copperPrice, unit: '円/kg', diff: copperDiff, sparkData: copperSparkData, provenance: 'AI_AUTO', url: 'https://www.jx-nmm.com/cuprice/' },
    { label: '真鍮建値 (日伸)', price: brassPrice, unit: '円/kg', diff: getDiff(brassSparkData), sparkData: brassSparkData, provenance: 'AI_AUTO', url: 'https://www.nippon-shindo.co.jp/' },
    { label: '亜鉛建値 (三井)', price: zincPrice, unit: '円/kg', diff: getDiff(zincSparkData), sparkData: zincSparkData, provenance: 'AI_AUTO', url: 'https://www.mitsui-kinzoku.com/' },
    { label: '鉛建値 (三菱)', price: leadPrice, unit: '円/kg', diff: getDiff(leadSparkData), sparkData: leadSparkData, provenance: 'AI_AUTO', url: 'https://www.mmc.co.jp/corporate/ja/' },
    { label: '錫建値 (三菱)', price: tinPrice, unit: '円/kg', diff: getDiff(tinSparkData), sparkData: tinSparkData, provenance: 'AI_AUTO', url: 'https://www.mmc.co.jp/corporate/ja/' },
  ];

  const activeReservations = localReservations.filter(r => r.status === 'RESERVED' || r.status === 'PROCESSING');
  const todayCount = activeReservations.length;
  const todayWeight = activeReservations.reduce((sum, r) => {
    let weight = 0;
    try {
      let items = r.items;
      if (typeof items === 'string') items = JSON.parse(items);
      if (Array.isArray(items)) { weight = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0); }
    } catch(e){}
    return sum + weight;
  }, 0);

  const { totalCopperStock, inventoryValue } = useMemo(() => {
    const productions = data?.productions || [];
    const producedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
    const unprocessedCopper = 0; 
    const total = producedCopper + unprocessedCopper;
    return { totalCopperStock: total, inventoryValue: total * currentPrice };
  }, [data?.productions, currentPrice]);

  const { mCopper, yieldStats, projectedCopper } = useMemo(() => {
    const productions = data?.productions || [];
    const targetMonthly = Number(data?.config?.target_monthly) || 30000;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = Math.max(1, today.getDate());
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const thisMonthProds = productions.filter((p: any) => {
      try { const d = new Date(p.createdAt); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; } catch(e) { return false; }
    });

    const curCop = thisMonthProds.reduce((sum, p) => sum + (Number(p.outputCopper) || 0), 0);
    
    const recent = productions.slice(-10);
    let diffSum = 0, count = 0;
    recent.forEach((p: any) => {
      const actual = Number(p.actualRatio) || 0;
      const master = data?.wires?.find((w: any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
      const expected = master ? Number(master.ratio) : 0;
      if (actual > 0 && expected > 0) { diffSum += (actual - expected); count++; }
    });
    const avgDiff = count > 0 ? (diffSum / count) : 0;

    const projected = Math.round((curCop / currentDay) * daysInMonth);

    return { 
      mCopper: curCop, 
      yieldStats: { diff: avgDiff, isPositive: avgDiff >= 0 }, 
      projectedCopper: projected
    };
  }, [data?.productions, data?.wires, data?.config?.target_monthly]);

  const { win, lose, draw } = useMemo(() => {
    const comps = data?.competitorPrices || [];
    let win = 0, lose = 0, draw = 0;
    
    try {
      const rulesStr = data?.config?.pricing_rules;
      if (!rulesStr) return { win, lose, draw };
      
      const rules = JSON.parse(rulesStr);
      const latestComps: Record<string, any> = {};
      comps.forEach((c: any) => {
        if (!latestComps[c.name] || new Date(c.date) > new Date(latestComps[c.name].date)) latestComps[c.name] = c;
      });
      const compList = Object.values(latestComps);

      Object.keys(rules).forEach(item => {
        const rule = rules[item];
        let basePrice = rule.base === 'brass' ? brassPrice : copperPrice;
        const myPrice = Math.floor(basePrice * (Number(rule.ratio) / 100)) + Number(rule.offset);

        const compPrices = compList.map(c => {
          try { 
            let p = c.prices;
            if (typeof p === 'string') p = JSON.parse(p);
            if (typeof p === 'string') p = JSON.parse(p);
            return p[item]; 
          } catch(e) { return null; }
        }).filter(p => typeof p === 'number' && p > 0);
        
        if (compPrices.length > 0) {
          const maxComp = Math.max(...compPrices);
          if (myPrice > maxComp) win++;
          else if (myPrice < maxComp) lose++;
          else draw++;
        }
      });
    } catch(e) {}
    return { win, lose, draw };
  }, [data?.competitorPrices, data?.config?.pricing_rules, copperPrice, brassPrice]);

  const handlePrintReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => { window.print(); setIsGeneratingReport(false); }, 500);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full text-gray-900 pb-24 font-sans bg-[#FAFAFA] min-h-screen relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      <div className="print:hidden max-w-[1400px] mx-auto w-full">
        <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-6 px-2">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3 font-serif tracking-tight">
              <span className="w-1.5 h-6 bg-[#D32F2F] rounded-full"></span>
              主要指標・運用情報一覧
            </h2>
            <p className="text-xs text-gray-500 mt-2 font-mono tracking-widest ml-4 uppercase font-bold">経営概況および重要指標</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-gray-300 shadow-sm">
              <button onClick={() => setShowAiData(true)} className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>AI予測あり</button>
              <button onClick={() => setShowAiData(false)} className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${!showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>実測データのみ</button>
            </div>
            <button onClick={handlePrintReport} disabled={isGeneratingReport} className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50">
              {isGeneratingReport ? <span className="animate-spin"><Icons.Refresh /></span> : <Icons.Print />}
              日次レポート作成
            </button>
          </div>
        </header>

        <div className="mb-10 px-2 w-full">
          <div className={`transition-opacity duration-300 ${showAiData ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
            <div className="flex xl:grid xl:grid-cols-5 gap-4 overflow-x-auto xl:overflow-visible no-scrollbar pb-4 xl:pb-0 snap-x w-full">
              {marketItems.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="snap-start relative bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#D32F2F] rounded-sm p-4 transition-all duration-300 w-[180px] shrink-0 xl:w-auto xl:shrink flex flex-col justify-between overflow-hidden group block">
                  <div className="absolute top-2 right-2 z-20"><ProvenanceBadge type={m.provenance as any} /></div>
                  
                  {m.sparkData && (
                    <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      <Sparkline data={m.sparkData} color="#9CA3AF" />
                    </div>
                  )}
                  
                  <p className="text-xs font-bold text-gray-500 mb-2 relative z-10 flex items-center gap-1">
                    {m.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Icons.ExternalLink /></span>
                  </p>
                  
                  <div className="flex items-baseline gap-1 relative z-10 whitespace-nowrap">
                    <span className="text-2xl 2xl:text-3xl font-black text-gray-900 tracking-tighter">{m.price.toLocaleString()}</span>
                    <span className="text-[10px] 2xl:text-xs text-gray-400 font-bold ml-1">{m.unit}</span>
                  </div>
                  
                  {m.diff !== undefined ? (
                    <div className="mt-2 text-xs font-bold flex items-center gap-1.5 relative z-10 whitespace-nowrap">
                      {m.diff > 0 ? <><Icons.TrendingUp /><span className="text-[#D32F2F]">+{m.diff}</span></> : m.diff < 0 ? <><Icons.TrendingDown /><span className="text-gray-900">{m.diff}</span></> : <><Icons.Minus /><span className="text-gray-400">±0</span></>}
                    </div>
                  ) : (
                    <div className="mt-2 h-4 relative z-10"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-2">
          
          <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-[#D32F2F] hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="CO_OP" /></div>
            <div className="absolute -right-4 -top-4 opacity-5 transform scale-150 group-hover:rotate-12 transition-transform duration-700 text-gray-900"><Icons.Scale /></div>
            <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10"><Icons.Scale /> 推定総在庫 評価額</p>
            <div className="flex items-baseline gap-2 mt-auto relative z-10">
              <span className="text-2xl font-light text-gray-400">¥</span>
              <span className={`text-5xl md:text-6xl font-black tracking-tighter transition-colors ${showAiData ? 'text-gray-900' : 'text-gray-300'}`}>{showAiData ? inventoryValue.toLocaleString() : '---'}</span>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-600 font-mono relative z-10 flex justify-between items-center">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full animate-pulse"></span>銅換算在庫 <span className="ml-2"><ProvenanceBadge type="HUMAN" /></span></span>
              <span className="font-bold text-gray-900 text-sm">{totalCopperStock.toLocaleString()} kg</span>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-[#D32F2F] hover:shadow-md transition-all relative">
            <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
            <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2"><Icons.Truck /> 本日の現場稼働</p>
            <div className="flex items-center gap-6 mt-auto">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">受付件数</p>
                <span className="text-4xl font-black text-gray-900 tracking-tighter">{todayCount}<span className="text-sm font-normal text-gray-500 ml-1">件</span></span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">持込予定量</p>
                <span className="text-4xl font-black text-[#D32F2F] tracking-tighter">{todayWeight.toLocaleString()}<span className="text-sm font-normal text-gray-500 ml-1">kg</span></span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer group hover:border-[#D32F2F] hover:shadow-md transition-all relative" onClick={() => onNavigate('PRODUCTION')}>
            <div className="absolute top-4 right-4 z-20 flex gap-1"><ProvenanceBadge type="HUMAN" /></div>
            <div className="flex justify-between items-start mb-6"><h3 className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 text-xs"><Icons.Factory /> 今月の生産実績</h3><Icons.ArrowRight /></div>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="flex items-center justify-between border-l-4 border-gray-900 pl-4 py-1">
                <div><p className="text-xs text-gray-500 font-bold mb-1">ピカ銅 生産量</p><div className="flex items-baseline gap-1"><span className="text-2xl font-black text-gray-900">{mCopper.toLocaleString()}</span><span className="text-xs text-gray-400 font-bold">kg</span></div></div>
                <div className="text-right"><p className="text-xs text-gray-500 font-bold mb-1">月末予測 <span className="ml-1"><ProvenanceBadge type="AI_AUTO" /></span></p><div className="flex items-baseline gap-1 justify-end"><span className={`text-xl font-black ${showAiData ? 'text-[#D32F2F]' : 'text-gray-300'}`}>{showAiData ? projectedCopper.toLocaleString() : '---'}</span><span className="text-xs text-gray-400 font-bold">kg</span></div></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-sm border border-gray-100 flex justify-between items-center group-hover:bg-red-50/30 transition-colors">
                <span className="text-xs text-gray-500 font-bold">マスター比 乖離 (直近10件)</span>
                <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-sm shadow-sm border border-gray-200">
                  <span className={`text-xl font-black tracking-tighter ${yieldStats.isPositive ? 'text-gray-900' : 'text-[#D32F2F]'}`}>{yieldStats.isPositive ? '+' : ''}{yieldStats.diff.toFixed(1)}</span><span className="text-xs text-gray-500 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 mb-10">
            
            <div className={`bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer transition-all relative group ${showAiData ? 'hover:border-[#D32F2F] hover:shadow-md' : 'opacity-20 grayscale pointer-events-none'}`} onClick={() => showAiData && onNavigate('COMPETITOR')}>
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="AI_AUTO" /></div>
                <div className="flex justify-between items-start mb-6"><h3 className="font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 text-xs"><Icons.Radar /> AI 競合価格勝敗</h3><Icons.ArrowRight /></div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-end justify-between mb-3"><span className="text-xs text-gray-500 font-bold mb-1">自社優勢 (Win)</span><span className="text-4xl font-black text-gray-900 tracking-tighter">{win}</span></div>
                    <div className="w-full bg-gray-100 h-3 rounded-sm overflow-hidden mb-4 border border-gray-200 shadow-inner"><div className="h-full bg-gray-900 transition-all duration-1000" style={{ width: `${(win / Math.max(1, win + lose + draw)) * 100}%` }}></div></div>
                    <div className="flex justify-between text-xs font-bold text-gray-500"><span>同値: {draw}</span><span>劣勢: {lose}</span></div>
                </div>
            </div>

            <div className={`bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:border-[#D32F2F] hover:shadow-md ${showAiData ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="AI_AUTO" /></div>
                <div className="absolute -right-4 -top-4 opacity-5 transform scale-150 text-gray-900 transition-transform duration-700 group-hover:rotate-12"><Icons.Message /></div>
                <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse"></span>AIコンシェルジュ稼働</p>
                <div className="flex items-baseline gap-2 mt-auto relative z-10">
                    <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">{data?.chatStats?.today || 0}</span>
                    <span className="text-sm font-bold text-gray-600">件の対応</span>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-600 font-mono relative z-10 flex justify-between items-center">
                    <span className="font-bold">累計対応数: {data?.chatStats?.total || 0} 件</span>
                    <button onClick={async (e) => {
                        const btn = e.currentTarget; const originalText = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="animate-spin mr-1">↻</span> トレーニング中...';
                        try {
                            const res = await fetch('/api/simulate', { method: 'POST' }); const simData = await res.json();
                            if(simData.success) { alert("仮想トレーニング完了！\n\n【ペルソナ】\n" + simData.persona + "\n\n【生成された会話】\n" + simData.chatHistory); window.location.reload(); } else { alert("エラー: " + simData.message); }
                        } catch(err) { alert("通信エラーが発生しました。"); }
                        btn.disabled = false; btn.innerHTML = originalText;
                    }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm text-[10px] font-bold shadow-sm transition flex items-center gap-1 disabled:opacity-50 group-hover:border-[#D32F2F] group-hover:text-[#D32F2F]">
                        <Icons.Brain /> 仮想トレーニング
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden group hover:border-[#D32F2F] hover:shadow-md transition-all h-full flex flex-col relative">
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="CO_OP" /></div>
                <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center cursor-pointer pr-24 shrink-0" onClick={() => onNavigate('DATABASE')}>
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">本日の買取価格表 <span className="text-[10px] font-normal">(主要品目)</span></h3><Icons.ArrowRight />
                </div>
                <div className="p-0 overflow-y-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest sticky top-0 z-10">
                            <tr><th className="p-3 pl-6">品名</th><th className="p-3 text-center">歩留</th><th className="p-3 pr-6 text-right">単価</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {data?.wires?.slice(0, 5).map((w: any) => (
                                <tr key={w.id} className="hover:bg-red-50/30 transition cursor-pointer" onClick={() => onNavigate('DATABASE')}>
                                    <td className="p-3 pl-6 font-bold text-gray-800">{getDisplayName(w)}</td>
                                    <td className="p-3 text-center text-gray-500 font-bold">{w.ratio}%</td>
                                    <td className="p-3 pr-6 text-right font-black text-lg text-[#D32F2F] tracking-tighter">{showAiData ? `¥${Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()}` : '---'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

        {/* ★ 下段 1カラムフル幅（リアルタイム稼働状況のカード型） */}
        <div className="px-2 mb-10 w-full">
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[300px] relative group hover:border-[#D32F2F] hover:shadow-md transition-all">
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
                <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center cursor-pointer transition pr-24 shrink-0" onClick={() => onNavigate('OPERATIONS')}>
                    <h3 className="font-bold text-xs text-gray-500 flex items-center gap-3 tracking-widest uppercase">
                        <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]"></span></span>
                        リアルタイム稼働状況 (現場カンバン)
                    </h3>
                    <Icons.ArrowRight />
                </div>
                
                <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
                    {activeReservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                            <Icons.Truck />
                            <p className="text-sm font-bold mt-3">本日の予定・処理待ちの荷物はありません</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeReservations.map((res: any) => {
                                let w = 0; let p = "品目不明";
                                try { 
                                    let items = res.items; 
                                    if (typeof items === 'string') items = JSON.parse(items); 
                                    if (Array.isArray(items) && items.length > 0) { 
                                        w = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0); 
                                        p = items[0].product || items[0].productName; 
                                        if(items.length > 1) p += " 他"; 
                                    } 
                                } catch(e){}
                                
                                return (
                                    <div key={res.id} className="bg-white border border-gray-200 p-4 rounded-sm shadow-sm hover:border-[#D32F2F] transition-colors cursor-pointer group" onClick={() => onNavigate('OPERATIONS')}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${res.status === 'PROCESSING' ? 'bg-gray-400' : 'bg-[#D32F2F] animate-pulse'}`}></div>
                                                <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">{formatTime(res.createdAt || res.visitDate)}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400">{res.id}</span>
                                        </div>
                                        <p className="font-black text-base text-gray-900 mb-2 truncate">{res.memberName}</p>
                                        <p className="text-xs text-gray-600 font-bold flex items-center justify-between border-t border-gray-100 pt-2">
                                            <span className="truncate mr-2">{p}</span>
                                            <span className="font-black text-[#D32F2F] text-lg shrink-0">{w} <span className="text-xs font-normal text-gray-400">kg</span></span>
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
