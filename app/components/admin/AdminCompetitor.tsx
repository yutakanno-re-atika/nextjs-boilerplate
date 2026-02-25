// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

const Icons = {
  Alert: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Banknotes: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [lastFetchDate, setLastFetchDate] = useState<string>('未取得');

  // ★ 各種建値の取得（ダッシュボード用）
  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const currentBrassPrice = data?.market?.brass?.price || 980;
  const currentZincPrice = data?.market?.zinc?.price || 450;
  const currentLeadPrice = data?.market?.lead?.price || 380;
  const currentTinPrice = data?.market?.tin?.price || 8900;
  
  // 自社価格シミュレーション
  const myPrices = {
      "光線（ピカ線、特号）": Math.floor(currentCopperPrice * 0.96),
      "1号線": Math.floor(currentCopperPrice * 0.94),
      "2号線": Math.floor(currentCopperPrice * 0.91),
      "上銅": Math.floor(currentCopperPrice * 0.89),
      "並銅": Math.floor(currentCopperPrice * 0.87),
      "下銅": Math.floor(currentCopperPrice * 0.82),
      "山行銅": Math.floor(currentCopperPrice * 0.78),
      "ビスマス砲金": Math.floor(currentCopperPrice * 0.70),
      "砲金": Math.floor(currentCopperPrice * 0.68),
      "メッキ砲金": Math.floor(currentCopperPrice * 0.65),
      "バルブ砲金": Math.floor(currentCopperPrice * 0.63),
      "込砲金": Math.floor(currentCopperPrice * 0.60),
      "込中": Math.floor(currentCopperPrice * 0.58),
      "山行中": Math.floor(currentCopperPrice * 0.55),
      "被覆線80%": Math.floor(currentCopperPrice * 0.80) - 15,
      "被覆線70%": Math.floor(currentCopperPrice * 0.70) - 15,
      "被覆線60%": Math.floor(currentCopperPrice * 0.60) - 15,
      "被覆線50%": Math.floor(currentCopperPrice * 0.50) - 15,
      "被覆線40%": Math.floor(currentCopperPrice * 0.40) - 15,
      "雑線": Math.floor(currentCopperPrice * 0.35) - 15
  };

  const targetItems = [
      "光線（ピカ線、特号）", "1号線", "2号線", "上銅", "並銅", "下銅", "山行銅",
      "ビスマス砲金", "砲金", "メッキ砲金", "バルブ砲金", "込砲金",
      "込中", "山行中",
      "被覆線80%", "被覆線70%", "被覆線60%", "被覆線50%", "被覆線40%", "雑線"
  ];

  // ★ 初期ロード時に「過去の取得データ」をローカルから復元する
  useEffect(() => {
      const savedData = localStorage.getItem('factoryOS_competitors');
      const savedDate = localStorage.getItem('factoryOS_competitors_date');
      if (savedData) {
          try {
              setCompetitors(JSON.parse(savedData));
              if (savedDate) setLastFetchDate(savedDate);
          } catch(e) {}
      }
  }, []);

  const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'FETCH_COMPETITORS' }) });
          const result = await res.json();
          if (result.status === 'success' && result.data && result.data.length > 0) { 
              setCompetitors(result.data); 
              const now = new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
              setLastFetchDate(now);
              // ★ 取得成功したデータをブラウザに永久保存（次回アクセス時に即表示）
              localStorage.setItem('factoryOS_competitors', JSON.stringify(result.data));
              localStorage.setItem('factoryOS_competitors_date', now);
          } else { 
              alert('相手サイトのセキュリティによりデータが取得できませんでした。\n過去のデータを維持して表示します。'); 
          }
      } catch (error) { alert('通信エラー'); }
      setIsRefreshing(false);
  };

  // 平均価格の算出ロジック
  const getAveragePrice = (pricesObj: any) => {
      if (!pricesObj) return 0;
      const vals = Object.values(pricesObj).filter(v => typeof v === 'number' && v > 0);
      if (vals.length === 0) return 0;
      return Math.floor(vals.reduce((a: any, b: any) => a + b, 0) / vals.length);
  };
  
  const myAverage = getAveragePrice(myPrices);

  const handleDownloadCSV = () => {
      if (competitors.length === 0) return alert("データがありません");
      const headers = ['品目名', '月寒製作所 (自社)', ...competitors.map(c => c.name)];
      const rows = targetItems.map(item => {
          const myPrice = myPrices[item] || '';
          const compPrices = competitors.map(c => c.prices[item] !== null ? c.prices[item] : '');
          return [item, myPrice, ...compPrices];
      });
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
      const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `competitor_prices_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-800 pb-12">
      <header className="mb-6 flex justify-between items-end flex-shrink-0 pb-4 border-b border-gray-200">
        <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                プライシング・ダッシュボード
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">MARKET & COMPETITOR RADAR</p>
        </div>
        <div className="flex gap-3">
            <button onClick={handleDownloadCSV} className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-sm text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <Icons.Download /> CSV
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="bg-[#111] text-white px-5 py-2.5 rounded-sm text-sm font-bold hover:bg-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                <span className={isRefreshing ? "animate-spin" : ""}><Icons.Refresh /></span>
                {isRefreshing ? 'AI巡回中...' : '最新情報を取得'}
            </button>
        </div>
      </header>

      {/* ★ 新設: 簡易ダッシュボード (建値 ＆ 各社平均) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-shrink-0">
          
          {/* 左側: 本日の建値ボード */}
          <div className="bg-[#111] border border-black rounded-sm shadow-sm p-5 text-white">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Icons.Banknotes /> Official Market Price
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="border-r border-gray-800 pr-2">
                      <p className="text-xs text-gray-400 mb-1">銅建値 (JX)</p>
                      <p className="text-2xl font-black text-[#D32F2F] font-mono tracking-tighter">¥{currentCopperPrice.toLocaleString()}</p>
                  </div>
                  <div className="border-r border-gray-800 pr-2">
                      <p className="text-xs text-gray-400 mb-1">真鍮 (日本伸銅)</p>
                      <p className="text-xl font-black text-gray-100 font-mono tracking-tighter">¥{currentBrassPrice.toLocaleString()}</p>
                  </div>
                  <div className="border-r border-gray-800 pr-2">
                      <p className="text-xs text-gray-400 mb-1">亜鉛 (三井)</p>
                      <p className="text-xl font-black text-gray-100 font-mono tracking-tighter">¥{currentZincPrice.toLocaleString()}</p>
                  </div>
                  <div className="border-r border-gray-800 pr-2">
                      <p className="text-xs text-gray-400 mb-1">鉛</p>
                      <p className="text-lg font-black text-gray-300 font-mono tracking-tighter">¥{currentLeadPrice.toLocaleString()}</p>
                  </div>
                  <div>
                      <p className="text-xs text-gray-400 mb-1">錫</p>
                      <p className="text-lg font-black text-gray-300 font-mono tracking-tighter">¥{currentTinPrice.toLocaleString()}</p>
                  </div>
              </div>
          </div>

          {/* 右側: 競合スコアボード (平均価格比較) */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Icons.Chart /> Average Price Score
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 border border-gray-100 rounded-sm">
                      前回の取得: {lastFetchDate}
                  </span>
              </div>
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                  {/* 自社 */}
                  <div className="flex-1 min-w-[120px] bg-red-50/50 border border-red-100 p-3 rounded-sm">
                      <p className="text-xs font-bold text-gray-900 mb-1">月寒製作所 (自社)</p>
                      <p className="text-xl font-black text-[#D32F2F] font-mono tracking-tighter">¥{myAverage.toLocaleString()}<span className="text-[10px] text-gray-500 font-normal ml-1">/kg</span></p>
                  </div>
                  
                  {/* 競合 */}
                  {competitors.map((comp, idx) => {
                      const compAvg = getAveragePrice(comp.prices);
                      const diff = myAverage - compAvg;
                      return (
                          <div key={idx} className="flex-1 min-w-[120px] bg-gray-50 border border-gray-100 p-3 rounded-sm relative">
                              <p className="text-xs font-bold text-gray-700 mb-1 truncate" title={comp.name}>{comp.name}</p>
                              <div className="flex items-baseline gap-2">
                                  <p className="text-xl font-black text-gray-900 font-mono tracking-tighter">{compAvg > 0 ? `¥${compAvg.toLocaleString()}` : '---'}</p>
                              </div>
                              {compAvg > 0 && (
                                  <span className={`absolute top-3 right-3 text-[10px] font-bold font-mono ${diff > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                      {diff > 0 ? '優勢' : '劣勢'}
                                  </span>
                              )}
                          </div>
                      );
                  })}
                  {competitors.length === 0 && (
                      <p className="text-xs text-gray-400 italic mt-2">※データがありません</p>
                  )}
              </div>
          </div>
      </div>

      {/* ★ メイン価格テーブル */}
      <div className="flex-1 bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-20">
                      <tr className="bg-gray-100 border-b border-gray-200">
                          <th className="p-3 md:p-4 font-bold text-xs text-gray-500 uppercase tracking-wider w-[20%] border-r border-gray-200">対象品目</th>
                          <th className="p-3 md:p-4 font-bold text-xs tracking-wider bg-white text-gray-900 w-[20%] border-r border-gray-200 border-t-2 border-t-[#D32F2F] relative shadow-sm">
                              月寒製作所 (自社)
                              <div className="absolute top-1/2 right-full transform -translate-y-1/2 translate-x-1/2 text-white"><div className="w-2 h-2 bg-white border-l border-b border-gray-200 rotate-45"></div></div>
                          </th>
                          {competitors.length === 0 && <th className="p-4 font-normal text-xs text-gray-400">データ未取得</th>}
                          {competitors.map((comp, idx) => (
                              <th key={idx} className="p-3 md:p-4 font-bold text-xs tracking-wider text-gray-600 w-[20%] border-r border-gray-200 last:border-0 bg-gray-50">
                                  {comp.name}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {targetItems.map((item, idx) => {
                          const myPrice = myPrices[item];
                          const validCompetitorPrices = competitors.map(c => c.prices[item]).filter(p => typeof p === 'number' && p > 0);
                          const maxCompetitorPrice = validCompetitorPrices.length > 0 ? Math.max(...validCompetitorPrices) : 0;
                          const isLosing = maxCompetitorPrice > 0 && myPrice < maxCompetitorPrice;

                          return (
                              <tr key={idx} className="hover:bg-gray-50 transition group">
                                  <td className="p-3 md:p-4 font-bold text-gray-900 text-sm border-r border-gray-100">{item}</td>
                                  <td className={`p-3 md:p-4 border-r border-gray-200 ${isLosing ? 'bg-red-50/30' : 'bg-white'}`}>
                                      <div className="flex flex-col gap-1">
                                          <span className="text-xl font-black text-gray-900 font-mono">¥{myPrice.toLocaleString()}</span>
                                          {isLosing ? (
                                              <span className="text-[10px] md:text-xs font-bold text-red-600 flex items-center gap-1"><Icons.Alert /> 劣勢 (-¥{(maxCompetitorPrice - myPrice)})</span>
                                          ) : (
                                              <span className="text-[10px] md:text-xs font-bold text-green-600">地域最高値水準</span>
                                          )}
                                      </div>
                                  </td>
                                  {competitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
                                      if (!compPrice) return <td key={cIdx} className="p-3 md:p-4 text-xs text-gray-300 font-mono border-r border-gray-100 last:border-0">- 取れないか未掲載 -</td>;
                                      const diff = myPrice - compPrice;
                                      return (
                                          <td key={cIdx} className="p-3 md:p-4 border-r border-gray-100 last:border-0">
                                              <div className="flex flex-col gap-1">
                                                  <span className={`text-lg font-bold font-mono ${compPrice > myPrice ? 'text-red-600' : 'text-gray-600'}`}>
                                                      ¥{compPrice.toLocaleString()}
                                                  </span>
                                                  <span className={`text-[10px] md:text-xs font-bold font-mono ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                                                      {diff > 0 ? `自社 +${diff}円` : diff < 0 ? `自社 ${diff}円` : '同額'}
                                                  </span>
                                              </div>
                                          </td>
                                      )
                                  })}
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
              {competitors.length === 0 && (
                  <div className="p-20 text-center text-gray-500 flex flex-col items-center">
                      <div className="mb-4 p-4 bg-gray-100 rounded-full"><Icons.Refresh /></div>
                      <p className="text-base font-bold mb-2">まだ過去の取得データがありません。</p>
                      <p className="text-sm">右上の「最新情報を取得」ボタンを押して、データを取得・保存してください。</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
