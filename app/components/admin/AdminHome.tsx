// @ts-nocheck
import React, { useMemo, useState } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trophy: () => <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copper: () => <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  ChevronRight: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  ArrowDown: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const productions = data?.productions || [];

  // ==========================================
  // 1. 今月と先月のデータを比較計算 (前月比用)
  // ==========================================
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    // 現実の「今月」と「先月」の文字列 (YYYY-MM形式)
    const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`;

    let thisWeight = 0, thisAmount = 0;
    let lastWeight = 0, lastAmount = 0;

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

      if (mStr === thisMonthStr) {
        thisWeight += totalW;
        thisAmount += (Number(res.totalEstimate) || 0);
      } else if (mStr === lastMonthStr) {
        lastWeight += totalW;
        lastAmount += (Number(res.totalEstimate) || 0);
      }
    });

    return {
      monthNum: now.getMonth() + 1,
      thisWeight, thisAmount,
      diffWeight: thisWeight - lastWeight,
      diffAmount: thisAmount - lastAmount
    };
  }, [localReservations]);

  // ==========================================
  // 2. 月別の買取実績データ（チャート用）
  // ==========================================
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

  // ==========================================
  // 3. 顧客別「歩留まり」ランキング
  // ==========================================
  const clientYieldRanking = useMemo(() => {
      const clientStats: Record<string, { totalInput: number, yieldDiffSum: number, count: number }> = {};
      productions.forEach((p: any) => {
          if (!p.memberName || p.inputWeight <= 0) return;
          const name = p.memberName;
          if (!clientStats[name]) clientStats[name] = { totalInput: 0, yieldDiffSum: 0, count: 0 };
          
          const actual = Number(p.actualRatio) || 0;
          const master = data?.wires?.find((w:any) => w.name === p.materialName);
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

      return Object.entries(clientStats)
          .map(([name, stats]) => ({ name, totalInput: stats.totalInput, avgDiff: stats.count > 0 ? (stats.yieldDiffSum / stats.count) : 0 }))
          .filter(c => c.count !== 0)
          .sort((a, b) => b.avgDiff - a.avgDiff)
          .slice(0, 5);
  }, [productions, data?.wires]);

  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
  const copperAssetValue = totalProducedCopper * currentCopperPrice;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full space-y-6">
      
      {/* 🔴 ヘッダー領域 */}
      <header className="flex justify-between items-end pb-2">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">経営ダッシュボード</h2>
          <p className="text-sm text-gray-500 mt-2">実績データとナゲット加工による顧客評価（トレーサビリティ）を可視化します。</p>
        </div>
      </header>

      {/* 🔴 トップKPIカード群 (3等分グリッドに最適化) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 重量KPI */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition duration-500"><Icons.Scale /></div>
              <p className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Icons.Scale /> 今月 ({currentMonthStats.monthNum}月) の買取重量</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-gray-900">{currentMonthStats.thisWeight.toLocaleString()}</span>
                      <span className="text-base text-gray-500 font-bold">kg</span>
                  </div>
                  {/* ★ 前月比バッジ */}
                  <div className="mt-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${currentMonthStats.diffWeight >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {currentMonthStats.diffWeight >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                          前月比 {currentMonthStats.diffWeight >= 0 ? '+' : ''}{currentMonthStats.diffWeight.toLocaleString()} kg
                      </span>
                  </div>
              </div>
          </div>
          
          {/* 金額KPI */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition duration-500"><Icons.TrendingUp /></div>
              <p className="text-sm font-bold text-gray-500 mb-2 flex items-center gap-2"><Icons.TrendingUp /> 今月 ({currentMonthStats.monthNum}月) の買取金額</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-gray-900">¥{currentMonthStats.thisAmount.toLocaleString()}</span>
                  </div>
                  {/* ★ 前月比バッジ */}
                  <div className="mt-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${currentMonthStats.diffAmount >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                          {currentMonthStats.diffAmount >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                          前月比 {currentMonthStats.diffAmount >= 0 ? '+' : ''}{currentMonthStats.diffAmount.toLocaleString()} 円
                      </span>
                  </div>
              </div>
          </div>

          {/* 資産価値KPI */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between relative overflow-hidden group text-white">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition duration-500"><Icons.Copper /></div>
              <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-gray-300 flex items-center gap-2"><Icons.Copper /> ピカ銅 資産価値</p>
              </div>
              <div>
                  <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-5xl font-black text-orange-400 tracking-tighter">¥{copperAssetValue.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-300 font-bold">総在庫: {totalProducedCopper.toLocaleString()} kg</span>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded-md text-gray-300 border border-gray-600">建値: ¥{currentCopperPrice}/kg</span>
                  </div>
              </div>
          </div>
      </div>

      {/* 🔴 メインコンテンツ領域 (チャート ＆ ランキング) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[450px]">
          
          {/* チャート */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                  <div>
                      <h3 className="text-lg font-bold text-gray-900">月別買取重量トレンド</h3>
                      <span className="text-sm text-gray-500 mt-1 block">アーカイブ済みの完了データを集計しています</span>
                  </div>
                  <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-sm outline-none cursor-pointer hover:bg-gray-100 transition">
                      <option value={new Date().getFullYear()}>{new Date().getFullYear()}年度</option>
                      <option value={2025}>2025年度</option>
                  </select>
              </div>
              
              <div className="flex-1 flex items-end gap-3 sm:gap-6 mt-4 relative">
                  {/* 背景グリッド */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                      <div className="border-t border-gray-900 w-full h-0"></div>
                      <div className="border-t border-gray-900 w-full h-0"></div>
                      <div className="border-t border-gray-900 w-full h-0"></div>
                      <div className="border-t border-gray-900 w-full h-0"></div>
                  </div>
                  
                  {/* 棒グラフ */}
                  {monthlyData.map((data) => (
                      <div key={data.month} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                          <div className="absolute -top-14 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none shadow-lg">
                              <span className="font-bold">{data.weight.toLocaleString()} kg</span><br/>
                              <span className="text-gray-300">¥{data.amount.toLocaleString()}</span>
                          </div>
                          <div 
                              className={`w-full max-w-[48px] rounded-t-sm transition-all duration-500 ${data.month === currentMonthStats.monthNum && chartYear === new Date().getFullYear() ? 'bg-[#D32F2F]' : 'bg-red-100 group-hover:bg-red-200'}`}
                              style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: data.weight > 0 ? '4px' : '0' }}
                          ></div>
                          <span className="text-xs font-bold text-gray-500 mt-3">{data.month}月</span>
                      </div>
                  ))}
              </div>
          </div>

          {/* ランキング */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col overflow-hidden">
              <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Icons.Trophy /> 優良顧客ランキング
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                      ナゲット加工時の歩留まりが、当社のマスター設定より上振れした平均値で評価しています。
                  </p>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 space-y-3">
                          <Icons.Trophy />
                          <p className="text-sm font-bold text-center leading-relaxed">加工実績データがありません。<br/>ナゲット製造から実績を記録してください。</p>
                      </div>
                  ) : (
                      clientYieldRanking.map((client, idx) => (
                          <div 
                              key={idx} 
                              onClick={() => onNavigate('CLIENT_DETAIL', client.name)}
                              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-red-50 hover:border-red-200 hover:shadow-md transition cursor-pointer group"
                          >
                              <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : idx === 1 ? 'bg-gray-200 text-gray-700 border border-gray-300' : idx === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                      {idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-base font-bold text-gray-900 group-hover:text-[#D32F2F] transition truncate max-w-[120px]">{client.name}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">総加工: {client.totalInput.toLocaleString()}kg</p>
                                  </div>
                              </div>
                              <div className="text-right flex items-center gap-1">
                                  <div>
                                      <p className={`text-base font-black ${client.avgDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                      </p>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition transform translate-x-[-5px] group-hover:translate-x-0">
                                      <Icons.ChevronRight />
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>
          
      </div>
    </div>
  );
};
