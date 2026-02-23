// @ts-nocheck
import React, { useMemo, useState } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trophy: () => <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copper: () => <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  ChevronRight: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  ArrowDown: () => <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Banknotes: () => <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Tag: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());
  
  // ★ 粗利率（会社として何％抜くか）のシミュレーション用ステート（初期値15%）
  const [targetMargin, setTargetMargin] = useState<number>(15);

  const currentCopperPrice = data?.market?.copper?.price || 0;
  const currentZincPrice = data?.market?.zinc?.price || 0;
  const currentBrassPrice = data?.market?.brass?.price || 0;
  
  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  // 1. 今月と先月のデータを比較計算
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

    return {
      monthNum: now.getMonth() + 1,
      thisWeight, thisAmount,
      diffWeight: thisWeight - lastWeight,
      diffAmount: thisAmount - lastAmount
    };
  }, [localReservations]);

  // 2. 月別チャートデータ
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

  // 3. 顧客別歩留まりランキング
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
      return Object.entries(clientStats)
          .map(([name, stats]) => ({ name, totalInput: stats.totalInput, avgDiff: stats.count > 0 ? (stats.yieldDiffSum / stats.count) : 0 }))
          .filter(c => c.count !== 0)
          .sort((a, b) => b.avgDiff - a.avgDiff).slice(0, 5);
  }, [productions, wiresMaster]);

  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
  const copperAssetValue = totalProducedCopper * currentCopperPrice;

  // ★ 4. 建値連動：本日の適正買取単価の自動計算
  const currentPricesList = useMemo(() => {
      if (currentCopperPrice === 0) return [];
      const userMarginRatio = (100 - targetMargin) / 100; // 例: 15%抜くなら 0.85
      
      return wiresMaster.map((w: any) => {
          const ratio = Number(w.ratio) || 0;
          const theoreticalValue = currentCopperPrice * (ratio / 100); // 銅の含有価値
          const purchasePrice = Math.floor(theoreticalValue * userMarginRatio); // 利益を抜いた買取単価
          const profit = Math.floor(theoreticalValue - purchasePrice); // 1kgあたりの粗利
          
          return {
              name: w.name,
              ratio: ratio,
              theoreticalValue,
              purchasePrice,
              profit
          };
      }).sort((a, b) => b.ratio - a.ratio); // 銅率が高い順
  }, [currentCopperPrice, wiresMaster, targetMargin]);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full space-y-8 pb-8">
      
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pb-2 border-b border-gray-200">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">経営ダッシュボード</h2>
          <p className="text-base text-gray-500 mt-2">相場情報に基づく買取単価の算出と、実績データ（トレーサビリティ）を可視化します。</p>
        </div>
      </header>

      {/* 🔴 トップKPI：建値と資産を最優先に配置 (4等分グリッドに変更) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. 本日の主要建値ボード */}
          <div className="bg-gradient-to-br from-[#D32F2F] to-red-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute -right-4 -top-4 opacity-10"><Icons.Banknotes /></div>
              <p className="text-base font-bold text-red-100 mb-2 flex items-center gap-2"><Icons.Banknotes /> 本日の主要建値</p>
              <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-end border-b border-red-500/50 pb-2">
                      <span className="text-sm font-bold text-red-200">銅 (JX)</span>
                      <span className="text-3xl font-black">{currentCopperPrice.toLocaleString()}<span className="text-sm font-normal ml-1">円</span></span>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                      <span className="text-sm font-bold text-red-200">亜鉛 (三井)</span>
                      <span className="text-xl font-bold">{currentZincPrice.toLocaleString()}<span className="text-xs font-normal ml-1">円</span></span>
                  </div>
              </div>
          </div>

          {/* 2. 資産価値KPI */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between relative overflow-hidden group text-white">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition duration-500"><Icons.Copper /></div>
              <p className="text-base font-bold text-gray-300 mb-2 flex items-center gap-2"><Icons.Copper /> ピカ銅 製品資産</p>
              <div>
                  <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-4xl font-black text-orange-400 tracking-tighter">¥{copperAssetValue.toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-300 font-bold bg-gray-800 px-2 py-1 rounded">在庫: {totalProducedCopper.toLocaleString()} kg</span>
                  </div>
              </div>
          </div>

          {/* 3. 重量KPI */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition duration-500"><Icons.Scale /></div>
              <p className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Icons.Scale /> 今月 ({currentMonthStats.monthNum}月) 買取重量</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-gray-900">{currentMonthStats.thisWeight.toLocaleString()}</span>
                      <span className="text-base text-gray-500 font-bold">kg</span>
                  </div>
                  <div className="mt-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${currentMonthStats.diffWeight >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                          {currentMonthStats.diffWeight >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                          前月比 {currentMonthStats.diffWeight >= 0 ? '+' : ''}{currentMonthStats.diffWeight.toLocaleString()} kg
                      </span>
                  </div>
              </div>
          </div>
          
          {/* 4. 金額KPI */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition duration-500"><Icons.TrendingUp /></div>
              <p className="text-sm font-bold text-gray-600 mb-2 flex items-center gap-2"><Icons.TrendingUp /> 今月 ({currentMonthStats.monthNum}月) 買掛金額</p>
              <div>
                  <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl font-black text-gray-900">¥{currentMonthStats.thisAmount.toLocaleString()}</span>
                  </div>
                  <div className="mt-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${currentMonthStats.diffAmount >= 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                          {currentMonthStats.diffAmount >= 0 ? <Icons.ArrowUp /> : <Icons.ArrowDown />}
                          前月比 {currentMonthStats.diffAmount >= 0 ? '+' : ''}{currentMonthStats.diffAmount.toLocaleString()} 円
                      </span>
                  </div>
              </div>
          </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          
          {/* 左側カラム：チャート と 買取単価表 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* 月別チャート */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <div>
                          <h3 className="text-xl font-bold text-gray-900">月別買取重量トレンド</h3>
                          <span className="text-sm text-gray-500 mt-1 block">アーカイブ済みの完了データを集計しています (単位: kg)</span>
                      </div>
                      <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-white border border-gray-300 text-gray-900 px-5 py-2.5 rounded-xl text-base font-bold shadow-sm outline-none cursor-pointer hover:bg-gray-50 transition">
                          <option value={new Date().getFullYear()}>{new Date().getFullYear()}年度</option>
                          <option value={2025}>2025年度</option>
                      </select>
                  </div>
                  
                  <div className="flex-1 flex items-end gap-3 sm:gap-6 mt-4 relative h-[250px]">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                          <div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div><div className="border-t border-gray-900 w-full h-0"></div>
                      </div>
                      {monthlyData.map((data) => (
                          <div key={data.month} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                              <div className="absolute -top-16 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none shadow-xl border border-gray-700 text-center">
                                  <span className="font-bold text-base">{data.weight.toLocaleString()} kg</span><br/>
                                  <span className="text-gray-400 font-bold">¥{data.amount.toLocaleString()}</span>
                              </div>
                              <div 
                                  className={`w-full max-w-[56px] rounded-t-md transition-all duration-500 ${data.month === currentMonthStats.monthNum && chartYear === new Date().getFullYear() ? 'bg-[#D32F2F]' : 'bg-red-100 group-hover:bg-red-200'}`}
                                  style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: data.weight > 0 ? '6px' : '0' }}
                              ></div>
                              <span className="text-sm font-bold text-gray-500 mt-4">{data.month}月</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* ★ 新設：建値連動・本日の買取基準単価表 */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                              <Icons.Banknotes /> 本日の適正・買取単価表
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">銅建値({currentCopperPrice}円) × 歩留まり% から自動算出</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                          <label className="text-sm font-bold text-gray-700">目標粗利(抜く割合):</label>
                          <div className="flex items-center gap-2">
                              <input type="range" min="5" max="30" step="1" value={targetMargin} onChange={(e) => setTargetMargin(Number(e.target.value))} className="w-24 accent-[#D32F2F]" />
                              <span className="text-lg font-black text-[#D32F2F] w-10 text-right">{targetMargin}%</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                          <thead className="bg-white border-b border-gray-100">
                              <tr>
                                  <th className="p-4 text-sm font-bold text-gray-500">品目名</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 text-center">銅率 (歩留)</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 text-right">含有価値</th>
                                  <th className="p-4 text-sm font-bold text-[#D32F2F] text-right">適正買取単価</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 text-right">想定粗利/kg</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                              {currentPricesList.length === 0 ? (
                                  <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-bold">建値が取得できていません</td></tr>
                              ) : currentPricesList.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50 transition">
                                      <td className="p-4 font-bold text-gray-900 text-base">{item.name}</td>
                                      <td className="p-4 text-center">
                                          <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-sm font-bold border border-gray-200">{item.ratio}%</span>
                                      </td>
                                      <td className="p-4 text-right text-gray-500 text-sm font-mono">¥{item.theoreticalValue.toFixed(0)}</td>
                                      <td className="p-4 text-right">
                                          <span className="text-2xl font-black text-[#D32F2F]">¥{item.purchasePrice}</span>
                                      </td>
                                      <td className="p-4 text-right text-sm font-bold text-green-600">+¥{item.profit}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>

          </div>

          {/* 右側カラム：ランキング */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 flex flex-col overflow-hidden">
              <div className="mb-6 border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Icons.Trophy /> 優良顧客ランキング
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      ナゲット加工時の歩留まりが、マスター設定よりどれだけ上振れしたかの「平均値」で評価しています。
                  </p>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 space-y-3">
                          <Icons.Trophy />
                          <p className="text-base font-bold text-center leading-relaxed">加工実績データがありません。<br/>ナゲット製造から実績を記録してください。</p>
                      </div>
                  ) : (
                      clientYieldRanking.map((client, idx) => (
                          <div 
                              key={idx} 
                              onClick={() => onNavigate('CLIENT_DETAIL', client.name)}
                              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 hover:bg-white hover:border-[#D32F2F] hover:shadow-md transition cursor-pointer group"
                          >
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-black shadow-sm ${idx === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : idx === 1 ? 'bg-gray-200 text-gray-700 border border-gray-300' : idx === 2 ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                      {idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-base font-bold text-gray-900 group-hover:text-[#D32F2F] transition truncate max-w-[140px]">{client.name}</p>
                                      <p className="text-sm text-gray-500 mt-1 font-medium">総加工: <span className="font-bold">{client.totalInput.toLocaleString()}</span> kg</p>
                                  </div>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                  <div>
                                      <p className={`text-xl font-black ${client.avgDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                      </p>
                                  </div>
                                  <div className="text-gray-300 group-hover:text-[#D32F2F] transition transform translate-x-[-5px] group-hover:translate-x-0">
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
