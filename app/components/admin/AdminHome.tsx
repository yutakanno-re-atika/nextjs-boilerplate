// @ts-nocheck
import React, { useMemo, useState } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Scale: () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Users: () => <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Trophy: () => <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Copper: () => <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const productions = data?.productions || [];

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, weight: 0, amount: 0 }));
    localReservations.filter(r => r.status === 'COMPLETED' || r.status === 'ARCHIVED').forEach(res => {
      const date = new Date(res.visitDate || res.createdAt);
      if (date.getFullYear() === chartYear) {
        const mIndex = date.getMonth();
        let totalW = 0;
        try {
          let items = res.items;
          if (typeof items === 'string') items = JSON.parse(items);
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
  const thisMonthData = monthlyData[new Date().getMonth()];

  const clientYieldRanking = useMemo(() => {
      const clientStats: Record<string, { totalInput: number, yieldDiffSum: number, count: number }> = {};

      productions.forEach((p: any) => {
          if (!p.memberName || p.inputWeight <= 0) return;
          const name = p.memberName;
          if (!clientStats[name]) clientStats[name] = { totalInput: 0, yieldDiffSum: 0, count: 0 };
          
          const actual = Number(p.actualRatio) || 0;
          const master = data?.wires?.find((w:any) => w.name === p.materialName);
          let expected = master ? Number(master.ratio) : 0;
          
          // ★ ダミーデータやマスター未登録の品目でも計算できるようにフォールバック
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
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">経営ダッシュボード</h2>
          <p className="text-sm text-gray-500 mt-1">過去の買取実績と、ナゲット加工による顧客評価（トレーサビリティ）を可視化します。</p>
        </div>
        <div className="flex gap-2">
            <select value={chartYear} onChange={(e) => setChartYear(Number(e.target.value))} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm outline-none">
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}年度</option>
                <option value={2025}>2025年度</option>
            </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition duration-500"><Icons.Scale /></div>
              <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5"><Icons.Scale /> 今月の総買取重量</p>
              <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-gray-900">{thisMonthData.weight.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-bold">kg</span>
              </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition duration-500"><Icons.TrendingUp /></div>
              <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5"><Icons.TrendingUp /> 今月の買取金額 (買掛)</p>
              <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-gray-900">¥{thisMonthData.amount.toLocaleString()}</span>
              </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-5 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between relative overflow-hidden group text-white md:col-span-2">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition duration-500"><Icons.Copper /></div>
              <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1.5"><Icons.Copper /> 現在のピカ銅（ペレット）資産価値</p>
                  <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded text-gray-300">建値: ¥{currentCopperPrice}/kg</span>
              </div>
              <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-4xl font-black text-orange-400 tracking-tighter">¥{copperAssetValue.toLocaleString()}</span>
                  <span className="text-sm text-gray-400 font-bold">({totalProducedCopper.toLocaleString()} kg)</span>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
          
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900">{chartYear}年 月別買取重量トレンド</h3>
                  <span className="text-xs text-gray-500">単位: kg</span>
              </div>
              
              <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-4 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                      <div className="border-t border-gray-900 w-full h-0"></div>
                      <div className="border-t border-gray-900 w-full h-0"></div>
                      <div className="border-t border-gray-900 w-full h-0"></div>
                      <div className="border-t border-gray-900 w-full h-0"></div>
                  </div>
                  {monthlyData.map((data) => (
                      <div key={data.month} className="flex-1 flex flex-col justify-end items-center group relative h-full">
                          <div className="absolute -top-12 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10 pointer-events-none">
                              {data.weight.toLocaleString()} kg<br/>(¥{data.amount.toLocaleString()})
                          </div>
                          <div 
                              className={`w-full max-w-[40px] rounded-t-sm transition-all duration-500 ${data.month === new Date().getMonth() + 1 ? 'bg-[#D32F2F]' : 'bg-red-100 group-hover:bg-red-200'}`}
                              style={{ height: `${data.weight > 0 ? (data.weight / maxWeight) * 100 : 0}%`, minHeight: data.weight > 0 ? '4px' : '0' }}
                          ></div>
                          <span className="text-[10px] font-bold text-gray-400 mt-2">{data.month}月</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col overflow-hidden">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <Icons.Trophy /> 優良顧客ランキング
              </h3>
              <p className="text-[10px] text-gray-500 mb-6">歩留まりの平均上振れ幅（顧客名クリックで詳細へ）</p>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {clientYieldRanking.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-2">
                          <Icons.Trophy />
                          <p className="text-xs font-bold text-center">加工実績データがありません。</p>
                      </div>
                  ) : (
                      clientYieldRanking.map((client, idx) => (
                          <div 
                              key={idx} 
                              onClick={() => onNavigate('CLIENT_DETAIL', client.name)}
                              className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50 hover:bg-red-50 hover:border-red-200 hover:shadow-md transition cursor-pointer group"
                          >
                              <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                      {idx + 1}
                                  </div>
                                  <div>
                                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#D32F2F] transition truncate w-[100px]">{client.name}</p>
                                      <p className="text-[9px] text-gray-500">総加工: {client.totalInput.toLocaleString()}kg</p>
                                  </div>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                  <div>
                                      <p className={`text-sm font-black ${client.avgDiff > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {client.avgDiff > 0 ? '+' : ''}{client.avgDiff.toFixed(1)}%
                                      </p>
                                      <p className="text-[9px] text-gray-400">平均上振れ幅</p>
                                  </div>
                                  <Icons.ChevronRight />
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
