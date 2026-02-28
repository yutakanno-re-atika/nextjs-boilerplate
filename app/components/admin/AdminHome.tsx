// @ts-nocheck
import React, { useMemo } from 'react';

const Icons = {
    TrendingUp: () => <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    TrendingDown: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    Minus: () => <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>,
    Truck: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    User: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Radar: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Factory: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    Scale: () => <svg className="w-6 h-6 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    ArrowRight: () => <svg className="w-5 h-5 text-gray-300 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
    Message: () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
};

// スパークライン（背景のミニチャート）
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
        // ★ 修正：値が全て同じ（平坦）な場合は中央に線を描画する
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
    
    // ★ 修正：すべての金属の履歴データを抽出するヘルパー関数
    // GAS側が銅しか返していない現状でも、エラーを出さずにフラットな配列を返す安全設計
    const extractSparkData = (key: string, fallbackPrice: number) => {
        const vals = history.map((h: any) => Number(h[key] || (key === 'copper' ? h.value : fallbackPrice)));
        return vals.length >= 7 ? vals.slice(-7) : [...Array(7 - vals.length).fill(fallbackPrice), ...vals];
    };

    const copperSparkData = extractSparkData('copper', copperPrice);
    const brassSparkData = extractSparkData('brass', brassPrice);
    const zincSparkData = extractSparkData('zinc', zincPrice);
    const leadSparkData = extractSparkData('lead', leadPrice);
    const tinSparkData = extractSparkData('tin', tinPrice);

    // 前日比の計算
    const getDiff = (sparkData: number[]) => {
        if (sparkData.length >= 2) return sparkData[sparkData.length - 1] - sparkData[sparkData.length - 2];
        return 0;
    };

    const marketItems = [
        { label: '銅建値 (JX)', price: copperPrice, unit: '円/kg', diff: getDiff(copperSparkData), isPrimary: true, sparkData: copperSparkData },
        { label: '真鍮建値 (日伸)', price: brassPrice, unit: '円/kg', diff: getDiff(brassSparkData), sparkData: brassSparkData },
        { label: '亜鉛建値 (三井)', price: zincPrice, unit: '円/kg', diff: getDiff(zincSparkData), sparkData: zincSparkData },
        { label: '鉛建値 (三菱)', price: leadPrice, unit: '円/kg', diff: getDiff(leadSparkData), sparkData: leadSparkData },
        { label: '錫建値 (三菱)', price: tinPrice, unit: '円/kg', diff: getDiff(tinSparkData), sparkData: tinSparkData },
        { label: 'LME銅 3M', price: lmeCopper, unit: 'USD/t', sub: `為替換算: 約¥${jpyCopperPrice}/kg` },
    ];

    const activeReservations = localReservations.filter(r => r.status === 'RESERVED' || r.status === 'PROCESSING');
    const todayCount = activeReservations.length;
    const todayWeight = activeReservations.reduce((sum, r) => {
        let weight = 0;
        try {
            let items = r.items;
            if (typeof items === 'string') items = JSON.parse(items);
            if (Array.isArray(items)) {
                weight = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0);
            }
        } catch(e){}
        return sum + weight;
    }, 0);

    // ★ 修正：クラッシュの原因となっていた currentPrice = copperPrice の代入を修正
    const { totalCopperStock, inventoryValue } = useMemo(() => {
        const productions = data?.productions || [];
        const producedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
        const unprocessedCopper = 3500; 
        const total = producedCopper + unprocessedCopper;
        return { totalCopperStock: total, inventoryValue: total * currentPrice };
    }, [data?.productions, currentPrice]);

    const { mCopper, prevCopper, monthlyAvgYield, yieldStats, targetMonthly } = useMemo(() => {
        const productions = data?.productions || [];
        const targetMonthly = Number(data?.config?.target_monthly) || 30000;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const prevMonthDate = new Date();
        prevMonthDate.setMonth(currentMonth - 1);
        const prevMonth = prevMonthDate.getMonth();
        const prevYear = prevMonthDate.getFullYear();

        const thisMonthProds = productions.filter((p: any) => {
            try { const d = new Date(p.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; } catch(e) { return false; }
        });
        const prevMonthProds = productions.filter((p: any) => {
            try { const d = new Date(p.date); return d.getMonth() === prevMonth && d.getFullYear() === prevYear; } catch(e) { return false; }
        });

        const curCop = thisMonthProds.reduce((sum, p) => sum + (Number(p.outputCopper) || 0), 0);
        const preCop = prevMonthProds.reduce((sum, p) => sum + (Number(p.outputCopper) || 0), 0);
        const mYield = thisMonthProds.length > 0 ? thisMonthProds.reduce((sum, p) => sum + (Number(p.actualRatio) || 0), 0) / thisMonthProds.length : 0;

        const recent = productions.slice(-10);
        let diffSum = 0, count = 0;
        recent.forEach((p: any) => {
            const actual = Number(p.actualRatio) || 0;
            const master = data?.wires?.find((w: any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
            const expected = master ? Number(master.ratio) : 0;
            if (actual > 0 && expected > 0) { diffSum += (actual - expected); count++; }
        });
        const avgDiff = count > 0 ? (diffSum / count) : 0;

        return { mCopper: curCop, prevCopper: preCop, monthlyAvgYield: mYield, yieldStats: { diff: avgDiff, isPositive: avgDiff >= 0 }, targetMonthly };
    }, [data?.productions, data?.wires, data?.config?.target_monthly]);

    const { win, lose, draw, myBenchPrice, compBars } = useMemo(() => {
        const comps = data?.competitorPrices || [];
        let win = 0, lose = 0, draw = 0;
        let myBenchPrice = 0;
        let compBars: any[] = [];
        
        try {
            const rulesStr = data?.config?.pricing_rules;
            if (!rulesStr) return { win, lose, draw, myBenchPrice, compBars };
            
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
                    try { return JSON.parse(c.prices)[item]; } catch(e) { return null; }
                }).filter(p => typeof p === 'number' && p > 0);
                
                if (compPrices.length > 0) {
                    const maxComp = Math.max(...compPrices);
                    if (myPrice > maxComp) win++;
                    else if (myPrice < maxComp) lose++;
                    else draw++;
                }

                if (item === "光線（ピカ線、特号）") {
                    myBenchPrice = myPrice;
                    compBars = compList.map(c => {
                        try { return { name: c.name, price: JSON.parse(c.prices)[item] || 0 }; } catch(e) { return { name: c.name, price: 0 }; }
                    }).filter(c => c.price > 0);
                }
            });
        } catch(e) {}
        return { win, lose, draw, myBenchPrice, compBars };
    }, [data?.competitorPrices, data?.config?.pricing_rules, copperPrice, brassPrice]);

    const formatTime = (dateStr: string) => {
        try { const d = new Date(dateStr); return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; } catch(e) { return '-'; }
    };

    return (
        <div className="flex flex-col animate-in fade-in duration-500 w-full text-gray-900 pb-24 font-sans bg-[#FAFAFA] min-h-screen">
            
            <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-6 px-2">
                <div>
                    <h2 className="text-2xl font-black flex items-center gap-3 font-serif tracking-tight">
                        <span className="w-1.5 h-6 bg-[#D32F2F] rounded-full"></span>
                        エグゼクティブ・ダッシュボード
                    </h2>
                    <p className="text-xs text-gray-500 mt-2 font-mono tracking-widest ml-4 uppercase font-bold">Executive Overview & KPIs</p>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-sm font-bold text-gray-400 font-mono tracking-wider">
                        {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}
                    </p>
                </div>
            </header>

            {/* ★ 横スクロールの完全レスポンシブティッカー（各金属の推移チャート付き） */}
            <div className="mb-10 px-2 w-full">
                <div className="flex xl:grid xl:grid-cols-6 gap-4 overflow-x-auto xl:overflow-visible no-scrollbar pb-4 xl:pb-0 snap-x w-full">
                    {marketItems.map((m, i) => (
                        <div key={i} className={`snap-start relative bg-white border ${m.isPrimary ? 'border-[#D32F2F] shadow-md ring-1 ring-red-50' : 'border-gray-200 shadow-sm hover:border-gray-300'} rounded-sm p-4 transition-all duration-300 w-[180px] shrink-0 xl:w-auto xl:shrink flex flex-col justify-between overflow-hidden group`}>
                            
                            {m.sparkData && (
                                <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                    <Sparkline data={m.sparkData} color={m.isPrimary ? '#D32F2F' : '#D1D5DB'} />
                                </div>
                            )}
                            
                            <p className="text-xs font-bold text-gray-500 mb-2 relative z-10 whitespace-nowrap">{m.label}</p>
                            <div className="flex items-baseline gap-1 relative z-10 whitespace-nowrap">
                                <span className="text-2xl 2xl:text-3xl font-black text-gray-900 tracking-tighter">{m.price.toLocaleString()}</span>
                                <span className="text-[10px] 2xl:text-xs text-gray-400 font-bold ml-1">{m.unit}</span>
                            </div>
                            
                            {m.diff !== undefined ? (
                                <div className="mt-2 text-xs font-bold flex items-center gap-1.5 relative z-10 whitespace-nowrap">
                                    {m.diff > 0 ? <><Icons.TrendingUp /><span className="text-[#D32F2F]">+{m.diff}</span></> : m.diff < 0 ? <><Icons.TrendingDown /><span className="text-blue-600">{m.diff}</span></> : <><Icons.Minus /><span className="text-gray-400">±0</span></>}
                                </div>
                            ) : m.sub ? (
                                <div className="mt-2 text-[10px] text-gray-400 font-mono font-bold relative z-10 whitespace-nowrap truncate">{m.sub}</div>
                            ) : (
                                <div className="mt-2 h-4 relative z-10"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-2">
                
                <div className="bg-[#111] text-white p-6 md:p-8 rounded-sm shadow-xl flex flex-col relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-10 transform scale-150 group-hover:rotate-12 transition-transform duration-700">
                        <Icons.Scale />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    
                    <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10">
                        推定総在庫 評価額
                    </p>
                    <div className="flex items-baseline gap-2 mt-auto relative z-10">
                        <span className="text-2xl font-light text-gray-500">¥</span>
                        <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">{inventoryValue.toLocaleString()}</span>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-800 text-xs text-gray-400 font-mono relative z-10 flex justify-between items-center">
                        <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>銅換算在庫</span>
                        <span className="font-bold text-white text-sm">{totalCopperStock.toLocaleString()} kg</span>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-gray-300 transition-colors">
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

                <div className="bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 rounded-sm border border-blue-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-10 transform scale-150 text-blue-500 transition-transform duration-700"><Icons.Message /></div>
                    <p className="text-xs font-bold text-blue-800 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        AIコンシェルジュ稼働
                    </p>
                    <div className="flex items-baseline gap-2 mt-auto relative z-10">
                        <span className="text-5xl md:text-6xl font-black text-blue-600 tracking-tighter">{data?.chatStats?.today || 0}</span>
                        <span className="text-sm font-bold text-blue-800">件の対応</span>
                    </div>
                    <div className="mt-5 pt-4 border-t border-blue-200/50 text-xs text-blue-600/70 font-mono relative z-10 flex justify-between items-center">
                        <span className="font-bold">累計対応数: {data?.chatStats?.total || 0} 件</span>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-2">
                
                <div className="xl:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="group bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer hover:border-[#D32F2F] hover:shadow-md transition-all" onClick={() => onNavigate('COMPETITOR')}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><Icons.Radar /> AI 競合価格勝敗</h3>
                                <Icons.ArrowRight />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-end justify-between mb-3">
                                    <span className="text-xs text-gray-500 font-bold mb-1">自社優勢 (Win)</span>
                                    <span className="text-4xl font-black text-gray-900 tracking-tighter">{win}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-3 rounded-sm overflow-hidden mb-4 border border-gray-200 shadow-inner">
                                    <div className="h-full bg-gradient-to-r from-red-600 to-[#D32F2F] transition-all duration-1000" style={{ width: `${(win / Math.max(1, win + lose + draw)) * 100}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>同値: {draw}</span>
                                    <span>劣勢: {lose}</span>
                                </div>
                            </div>
                        </div>

                        <div className="group bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer hover:border-[#D32F2F] hover:shadow-md transition-all" onClick={() => onNavigate('PRODUCTION')}>
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><Icons.Factory /> 今月の生産実績</h3>
                                <Icons.ArrowRight />
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-6">
                                <div className="flex items-center justify-between border-l-4 border-gray-900 pl-4 py-1">
                                    <div>
                                        <p className="text-xs text-gray-500 font-bold mb-1">ピカ銅 生産量</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-black text-gray-900">{mCopper.toLocaleString()}</span>
                                            <span className="text-xs text-gray-400 font-bold">kg</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-bold mb-1">平均 歩留まり</p>
                                        <div className="flex items-baseline gap-1 justify-end">
                                            <span className="text-2xl font-black text-[#D32F2F]">{monthlyAvgYield.toFixed(1)}</span>
                                            <span className="text-xs text-gray-400 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-bold">マスター比 乖離 (直近10件)</span>
                                    <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-sm shadow-sm border border-gray-100">
                                        <span className={`text-xl font-black tracking-tighter ${yieldStats.isPositive ? 'text-gray-900' : 'text-[#D32F2F]'}`}>
                                            {yieldStats.isPositive ? '+' : ''}{yieldStats.diff.toFixed(1)}
                                        </span>
                                        <span className="text-xs text-gray-500 font-bold">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden group hover:border-gray-300 transition-colors h-fit">
                        <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => onNavigate('DATABASE')}>
                            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">本日の買取価格表 <span className="text-xs text-gray-400 font-normal">(主要品目)</span></h3>
                            <Icons.ArrowRight />
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4 pl-6">品名</th>
                                        <th className="p-4 text-center">設定歩留まり</th>
                                        <th className="p-4 pr-6 text-right">買取単価</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {data?.wires?.slice(0, 5).map((w: any) => (
                                        <tr key={w.id} className="hover:bg-red-50/50 transition cursor-pointer" onClick={() => onNavigate('DATABASE')}>
                                            <td className="p-4 pl-6 font-bold text-gray-800">{getDisplayName(w)}</td>
                                            <td className="p-4 text-center text-gray-500 font-bold">{w.ratio}%</td>
                                            <td className="p-4 pr-6 text-right font-black text-xl text-[#D32F2F] tracking-tighter">¥{Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-5 border-b border-gray-200 bg-[#111] text-white flex justify-between items-center cursor-pointer group transition" onClick={() => onNavigate('OPERATIONS')}>
                            <h3 className="font-bold text-sm flex items-center gap-3 tracking-widest">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]"></span>
                                </span>
                                LIVE タイムライン
                            </h3>
                            <Icons.ArrowRight />
                        </div>
                        
                        <div className="p-6 overflow-y-auto flex-1 bg-white">
                            {activeReservations.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 text-sm font-bold flex flex-col items-center gap-3">
                                    <Icons.Truck />
                                    本日の予定はありません
                                </div>
                            ) : (
                                <ul className="space-y-0">
                                    {activeReservations.map((res: any) => {
                                        let w = 0;
                                        let p = "品目不明";
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
                                            <li key={res.id} className="relative pl-6 pb-8 last:pb-0 group cursor-pointer" onClick={() => onNavigate('OPERATIONS')}>
                                                <div className="absolute left-[7px] top-3 w-px h-full bg-gray-200 group-last:hidden"></div>
                                                <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ${res.status === 'PROCESSING' ? 'bg-yellow-400' : 'bg-blue-600'} shadow-sm ring-1 ring-gray-100 z-10`}></div>
                                                
                                                <div className="bg-white border border-gray-100 p-4 rounded-sm shadow-sm group-hover:border-[#D32F2F] transition-colors ml-4 -mt-2">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">{formatTime(res.visitDate)}</span>
                                                        <span className="text-[10px] font-mono text-gray-400">{res.id}</span>
                                                    </div>
                                                    <p className="font-black text-base text-gray-900 mb-1 truncate">{res.memberName}</p>
                                                    <p className="text-xs text-gray-600 font-bold flex items-center justify-between">
                                                        <span>{p}</span>
                                                        <span className="font-black text-[#D32F2F] text-lg">{w} <span className="text-xs font-normal text-gray-400">kg</span></span>
                                                    </p>
                                                </div>
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