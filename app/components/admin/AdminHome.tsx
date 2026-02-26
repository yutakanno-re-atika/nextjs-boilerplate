// @ts-nocheck
import React, { useMemo } from 'react';

const Icons = {
    TrendingUp: () => <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    TrendingDown: () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    Minus: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
    Truck: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    User: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Money: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Radar: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Factory: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    Scale: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
};

// 表示名を動的に生成する関数 (sqとcoreを結合)
const getDisplayName = (w: any) => {
    let name = w.name;
    if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
    if (w.core && w.core !== '-') name += ` ${w.core}C`;
    return name;
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
    // 1. 相場データの抽出
    const marketPrice = Number(data?.market?.copper?.price) || 1450;
    const history = data?.history || [];
    const currentPrice = history.length > 0 ? Number(history[history.length - 1].value) : marketPrice;
    const prevPrice = history.length > 1 ? Number(history[history.length - 2].value) : currentPrice;
    const diff = currentPrice - prevPrice;

    const usdjpy = Number(data?.market?.usdjpy) || 150.00;
    const lmeCopper = Number(data?.market?.lme_copper_usd) || 9000;
    const jpyCopperPrice = Math.floor((lmeCopper * usdjpy) / 1000);

    // 2. 本日の稼働状況
    const activeReservations = localReservations.filter(r => r.status === 'RESERVED' || r.status === 'PROCESSING');
    const todayCount = activeReservations.length;
    const todayWeight = activeReservations.reduce((sum, r) => {
        let weight = 0;
        try {
            const items = typeof r.items === 'string' ? JSON.parse(r.items) : r.items;
            weight = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0);
        } catch(e){}
        return sum + weight;
    }, 0);

    // 3. 在庫評価損を防ぐためのリアルタイム資産評価 (キャッシュフロー管理)
    const { totalCopperStock, inventoryValue } = useMemo(() => {
        const productions = data?.productions || [];
        // 加工済みピカ線の総量 (仮の計算ロジック)
        const producedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
        // 未加工スクラップの推定銅量
        const unprocessedCopper = 3500; // ※本来はreservationsのCOMPLETEDから未加工分を算出
        const total = producedCopper + unprocessedCopper;
        return {
            totalCopperStock: total,
            inventoryValue: total * currentPrice // リアルタイム相場での評価額
        };
    }, [data?.productions, currentPrice]);

    // 4. 歩留まり予実差（工場パフォーマンス）
    const yieldStats = useMemo(() => {
        const productions = data?.productions || [];
        if (productions.length === 0) return { diff: 0, isPositive: true };
        
        // 直近10件の平均を算出
        const recent = productions.slice(-10);
        let diffSum = 0;
        let count = 0;
        recent.forEach((p: any) => {
            const actual = Number(p.actualRatio) || 0;
            const master = data?.wires?.find((w: any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
            const expected = master ? Number(master.ratio) : 0;
            if (actual > 0 && expected > 0) {
                diffSum += (actual - expected);
                count++;
            }
        });
        const avgDiff = count > 0 ? (diffSum / count) : 0;
        return { diff: avgDiff, isPositive: avgDiff >= 0 };
    }, [data?.productions, data?.wires]);

    // 5. AIプライシング 勝敗サマリー
    const pricingStats = useMemo(() => {
        const comps = data?.competitorPrices || [];
        if (comps.length === 0) return { win: 0, lose: 0, draw: 0 };
        
        let win = 0, lose = 0, draw = 0;
        const rulesStr = data?.config?.pricing_rules;
        if (!rulesStr) return { win, lose, draw };
        
        try {
            const rules = JSON.parse(rulesStr);
            // 最新の競合データを抽出 (同一企業で最新日時のもの)
            const latestComps: Record<string, any> = {};
            comps.forEach((c: any) => {
                if (!latestComps[c.name] || new Date(c.date) > new Date(latestComps[c.name].date)) {
                    latestComps[c.name] = c;
                }
            });
            const compList = Object.values(latestComps);

            Object.keys(rules).forEach(item => {
                const rule = rules[item];
                let basePrice = currentPrice;
                if (rule.base === 'brass') basePrice = Number(data?.market?.brass?.price) || 980;
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
            });
        } catch(e) {}
        return { win, lose, draw };
    }, [data?.competitorPrices, data?.config?.pricing_rules, currentPrice, data?.market?.brass?.price]);

    const formatTime = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
        } catch(e) { return '-'; }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 w-full text-gray-800 pb-12">
            <header className="mb-6 flex-shrink-0 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                        <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                        エグゼクティブ・ダッシュボード
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">OVERVIEW & KPIs</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 font-mono">
                        {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
                    </p>
                </div>
            </header>

            {/* 行1: 最重要 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col relative overflow-hidden group">
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

                <div className="bg-[#111] text-white p-5 rounded-sm shadow-md flex flex-col relative overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform scale-150 -translate-y-4"><Icons.Scale /></div>
                    <p className="text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest flex items-center gap-1 relative z-10"><Icons.Scale /> 推定総在庫評価額</p>
                    <div className="flex items-end gap-1 mt-auto relative z-10">
                        <span className="text-lg font-light text-gray-400 mb-1">¥</span>
                        <span className="text-3xl font-black font-mono tracking-tighter text-white">{(inventoryValue).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-gray-400 font-mono relative z-10 flex justify-between">
                        <span>銅換算: {totalCopperStock.toLocaleString()} kg</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                    <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest flex items-center gap-1"><Icons.User /> 本日の予約・来客</p>
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

            {/* 行2: メインコンテンツ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 左側2カラム: AI・工場状況 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* AIプライシング勝敗 */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 flex flex-col cursor-pointer hover:border-gray-400 transition" onClick={() => onNavigate('COMPETITOR')}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Icons.Radar /> 競合価格勝敗</h3>
                                <Icons.ArrowRight />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500 font-bold">自社優勢 (Win)</span>
                                    <span className="text-2xl font-black text-blue-600 font-mono">{pricingStats.win}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                                    <div className="h-full bg-blue-500" style={{ width: `${(pricingStats.win / Math.max(1, pricingStats.win + pricingStats.lose + pricingStats.draw)) * 100}%` }}></div>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-gray-400">同値: {pricingStats.draw}</span>
                                    <span className="text-[#D32F2F]">劣勢: {pricingStats.lose}</span>
                                </div>
                            </div>
                        </div>

                        {/* 歩留まり予実差 */}
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 flex flex-col cursor-pointer hover:border-gray-400 transition" onClick={() => onNavigate('PRODUCTION')}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2"><Icons.Factory /> 直近歩留まり実績</h3>
                                <Icons.ArrowRight />
                            </div>
                            <div className="flex-1 flex flex-col justify-center items-center text-center">
                                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-2">マスター比 乖離幅 (直近10件)</p>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className={`text-5xl font-black font-mono tracking-tighter ${yieldStats.isPositive ? 'text-green-600' : 'text-[#D32F2F]'}`}>
                                        {yieldStats.isPositive ? '+' : ''}{yieldStats.diff.toFixed(1)}
                                    </span>
                                    <span className="text-lg text-gray-500 font-bold">%</span>
                                </div>
                                <p className={`text-xs mt-3 font-bold ${yieldStats.isPositive ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'} px-3 py-1 rounded-sm`}>
                                    {yieldStats.isPositive ? '利益上振れ傾向（良好）' : 'ダスト過多・機械要調整'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* クイック価格表 */}
                    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition" onClick={() => onNavigate('DATABASE')}>
                            <h3 className="font-bold text-sm text-gray-900">本日の買取価格表 (主要品目)</h3>
                            <Icons.ArrowRight />
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-3 pl-4">品名</th>
                                        <th className="p-3 text-right">設定歩留まり</th>
                                        <th className="p-3 pr-4 text-right">買取単価</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-sm">
                                    {data?.wires?.slice(0, 4).map((w: any) => (
                                        <tr key={w.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => onNavigate('DATABASE')}>
                                            <td className="p-3 pl-4 font-bold text-gray-800">{getDisplayName(w)}</td>
                                            <td className="p-3 text-right text-gray-500 font-mono">{w.ratio}%</td>
                                            <td className="p-3 pr-4 text-right font-black font-mono text-[#D32F2F]">¥{Math.floor(currentPrice * (w.ratio/100) * 0.85).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 右側カラム: タイムライン */}
                <div className="space-y-6">
                    <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
                        <div className="p-4 border-b border-gray-200 bg-[#111] text-white flex justify-between items-center cursor-pointer hover:bg-black transition" onClick={() => onNavigate('OPERATIONS')}>
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                受付・搬入タイムライン
                            </h3>
                            <Icons.ArrowRight />
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
                                            <li key={res.id} className="p-4 hover:bg-gray-50 transition cursor-pointer relative" onClick={() => onNavigate('OPERATIONS')}>
                                                {/* ステータスライン */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${res.status === 'PROCESSING' ? 'bg-yellow-400' : 'bg-blue-500'}`}></div>
                                                <div className="flex justify-between items-start mb-1 pl-2">
                                                    <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-sm font-mono">{formatTime(res.visitDate)}</span>
                                                    <span className="text-[10px] font-mono text-gray-400">{res.id}</span>
                                                </div>
                                                <p className="font-bold text-sm text-[#D32F2F] mb-1 pl-2">{res.memberName}</p>
                                                <p className="text-xs text-gray-600 pl-2">{p} / <span className="font-mono font-bold text-gray-900">{w}kg</span></p>
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
