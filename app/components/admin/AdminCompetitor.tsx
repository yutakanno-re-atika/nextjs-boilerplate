// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Alert: () => <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Banknotes: () => <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Clock: () => <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [lastFetchDate, setLastFetchDate] = useState<string>('未取得');

  // 建値データ
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

  const keyItems = ["光線（ピカ線、特号）", "並銅", "砲金", "込中"];

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
// 修正前 (AdminCompetitor.tsx の 72行目付近)
// const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'FETCH_COMPETITORS' }) });

// 修正後
  const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
          // ★ GASではなく、Next.jsのAIエンドポイントを直接叩く
          const res = await fetch('/api/competitors', { method: 'POST' });
          const result = await res.json();
          if (result.status === 'success' && result.data && result.data.length > 0) { 
              setCompetitors(result.data); 
              const now = new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
              setLastFetchDate(now);
              localStorage.setItem('factoryOS_competitors', JSON.stringify(result.data));
              localStorage.setItem('factoryOS_competitors_date', now);
          } else { 
              alert('データの取得に失敗しました。\n過去のデータを維持して表示します。'); 
          }
      } catch (error) { alert('通信エラーが発生しました。'); }
      setIsRefreshing(false);
  };
        const result = await res.json();
          if (result.status === 'success' && result.data && result.data.length > 0) { 
              setCompetitors(result.data); 
              const now = new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
              setLastFetchDate(now);
              localStorage.setItem('factoryOS_competitors', JSON.stringify(result.data));
              localStorage.setItem('factoryOS_competitors_date', now);
          } else { 
              alert('相手サイトの構造変更等によりデータが取得できませんでした。\n過去のデータを維持して表示します。'); 
          }
      } catch (error) { alert('通信エラーが発生しました。'); }
      setIsRefreshing(false);
  };

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
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans">
      
      {/* 🔴 ヘッダー */}
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end flex-shrink-0 pb-4 border-b border-gray-200 gap-4">
        <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                競合価格レーダー
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">COMPETITOR RESEARCH DASHBOARD</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button onClick={handleDownloadCSV} className="flex-1 sm:flex-none justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-sm text-xs font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <Icons.Download /> CSV
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none justify-center bg-[#111] text-white px-5 py-2.5 rounded-sm text-xs font-bold hover:bg-[#D32F2F] transition flex items-center gap-2 disabled:opacity-50">
                <span className={isRefreshing ? "animate-spin" : ""}><Icons.Refresh /></span>
                {isRefreshing ? '取得中...' : '情報を取得'}
            </button>
        </div>
      </header>

      {/* 🔴 サマリーダッシュボード */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-6 flex flex-col flex-shrink-0">
          
          {/* 上段：建値と取得情報 */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center p-4 md:p-5 border-b border-gray-100 bg-gray-50 gap-4">
              <div className="flex flex-wrap gap-4 md:gap-8">
                  <div className="flex flex-col min-w-[100px]">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center"><Icons.Banknotes /> 銅建値 (JX)</span>
                      <span className="text-lg md:text-xl font-mono font-black text-[#D32F2F] mt-1">¥{currentCopperPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col border-l border-gray-200 pl-4 md:pl-8 min-w-[100px]">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">真鍮 (日本伸銅)</span>
                      <span className="text-base md:text-xl font-mono font-black text-gray-900 mt-1">¥{currentBrassPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col border-l border-gray-200 pl-4 md:pl-8 min-w-[100px]">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">亜鉛 (三井)</span>
                      <span className="text-base md:text-xl font-mono font-black text-gray-900 mt-1">¥{currentZincPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col border-l border-gray-200 pl-4 md:pl-8 min-w-[100px]">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">鉛 / 錫</span>
                      <span className="text-sm font-mono font-bold text-gray-600 mt-1.5 md:mt-2">¥{currentLeadPrice} / ¥{currentTinPrice.toLocaleString()}</span>
                  </div>
              </div>
              <div className="text-left md:text-right flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-1 border-t lg:border-t-0 border-gray-200 pt-4 lg:pt-0">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center"><Icons.Clock /> 最終取得</span>
                  <span className="text-xs md:text-sm font-mono font-bold text-gray-800 bg-white px-2 md:px-3 py-1 border border-gray-200 rounded-sm shadow-sm">{lastFetchDate}</span>
              </div>
          </div>

          {/* 下段：代表4品目 */}
          <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
                  <thead>
                      <tr className="border-b border-gray-200">
                          <th className="py-2.5 px-4 font-normal text-[10px] text-gray-400 bg-white w-[20%] tracking-widest">代表4品目</th>
                          <th className="py-2.5 px-4 font-bold text-[10px] text-white bg-[#111] border-r border-gray-800 w-[20%] tracking-widest">月寒製作所 (自社)</th>
                          {competitors.map(c => (
                              <th key={c.name} className="py-2.5 px-4 font-normal text-[10px] text-gray-600 bg-gray-50 border-r border-gray-100 last:border-0">{c.name}</th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {keyItems.map(item => {
                          const myPrice = myPrices[item] || 0;
                          return (
                              <tr key={item} className="hover:bg-gray-50 transition">
                                  <td className="py-3 px-4 font-bold text-xs border-r border-gray-100">{item.replace('（ピカ線、特号）', '')}</td>
                                  <td className="py-3 px-4 font-mono font-black text-sm md:text-lg bg-[#111] text-white border-r border-gray-800 shadow-inner">¥{myPrice.toLocaleString()}</td>
                                  {competitors.map(c => {
                                      const price = c.prices[item];
                                      const diff = price ? myPrice - price : 0;
                                      return (
                                          <td key={c.name} className="py-3 px-4 font-mono text-xs border-r border-gray-100 last:border-0 bg-white">
                                              {price ? (
                                                  <div className="flex items-center justify-between gap-2">
                                                      <span className={`text-sm font-mono font-bold ${diff < 0 ? 'text-[#D32F2F]' : 'text-gray-800'}`}>¥{price.toLocaleString()}</span>
                                                      {diff < 0 && <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 px-1.5 py-0.5 rounded-sm border border-red-100">劣勢 {(diff).toLocaleString()}円</span>}
                                                  </div>
                                              ) : <span className="text-gray-300">-</span>}
                                          </td>
                                      );
                                  })}
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
              {competitors.length === 0 && <div className="text-xs text-gray-400 text-center py-8 font-medium">データがありません。右上のボタンから取得してください。</div>}
          </div>
      </div>

      {/* 🔴 メイン価格テーブル (全20品目) ★ スマホで潰れないように min-h-[500px] と overflow-x-auto を追加 */}
      <div className="flex-1 bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] md:min-h-0">
          <div className="overflow-y-auto overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px] md:min-w-[900px]">
                  <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm">
                      <tr>
                          <th className="p-3 md:p-4 font-normal text-[10px] md:text-xs text-gray-500 w-[20%] tracking-widest whitespace-nowrap">全20品目 詳細比較</th>
                          <th className="p-3 md:p-4 font-bold text-xs text-gray-900 w-[20%] border-l border-r border-gray-200 bg-white shadow-sm whitespace-nowrap">
                              月寒製作所 (自社)
                          </th>
                          {competitors.length === 0 && <th className="p-4 font-normal text-xs text-gray-400">データ未取得</th>}
                          {competitors.map((comp, idx) => (
                              <th key={idx} className="p-3 md:p-4 font-normal text-[10px] md:text-xs text-gray-500 w-[20%] border-r border-gray-100 last:border-0 whitespace-nowrap">
                                  {comp.name}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {targetItems.map((item, idx) => {
                          const myPrice = myPrices[item] || 0;
                          const validCompetitorPrices = competitors.map(c => c.prices[item]).filter(p => typeof p === 'number' && p > 0);
                          const maxCompetitorPrice = validCompetitorPrices.length > 0 ? Math.max(...validCompetitorPrices) : 0;
                          const isLosing = maxCompetitorPrice > 0 && myPrice < maxCompetitorPrice;

                          return (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                  <td className="p-3 md:p-4 font-medium text-xs text-gray-800 whitespace-nowrap">{item}</td>
                                  <td className="p-3 md:p-4 border-l border-r border-gray-200 bg-white whitespace-nowrap">
                                      <div className="flex items-center justify-between gap-2">
                                          <span className="text-sm font-black text-gray-900 font-mono">¥{myPrice.toLocaleString()}</span>
                                          {isLosing && (
                                              <span className="text-[10px] font-bold text-[#D32F2F] border border-red-200 bg-red-50 px-1.5 py-0.5 rounded-sm flex items-center whitespace-nowrap">
                                                  <Icons.Alert /> 負け
                                              </span>
                                          )}
                                      </div>
                                  </td>
                                  {competitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
                                      if (!compPrice) return <td key={cIdx} className="p-3 md:p-4 text-xs text-gray-300 font-mono border-r border-gray-100 last:border-0 text-center">-</td>;
                                      const diff = myPrice - compPrice;
                                      return (
                                          <td key={cIdx} className="p-3 md:p-4 border-r border-gray-100 last:border-0 whitespace-nowrap">
                                              <div className="flex items-center gap-2">
                                                  <span className={`text-sm font-mono ${compPrice > myPrice ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                      ¥{compPrice.toLocaleString()}
                                                  </span>
                                                  {diff !== 0 && (
                                                      <span className={`text-[10px] font-mono ${diff < 0 ? 'text-[#D32F2F] font-bold' : 'text-gray-400'}`}>
                                                          {diff < 0 ? `(${(diff).toLocaleString()})` : `(+${diff.toLocaleString()})`}
                                                      </span>
                                                  )}
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
                  <div className="p-20 text-center text-gray-400 flex flex-col items-center">
                      <p className="text-sm font-bold mb-2">過去の取得データがありません。</p>
                      <p className="text-xs">右上の「最新情報を取得」ボタンを押してください。</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
