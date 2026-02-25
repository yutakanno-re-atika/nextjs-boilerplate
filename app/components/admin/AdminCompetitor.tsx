// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Alert: () => <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
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
  
  // 自社設定価格（仮）
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

  // ★ ダッシュボードで監視する代表4品目
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
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'FETCH_COMPETITORS' }) });
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
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12">
      <header className="mb-6 flex justify-between items-end flex-shrink-0 pb-4 border-b border-gray-200">
        <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                競合価格レーダー
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">COMPETITOR RESEARCH</p>
        </div>
        <div className="flex gap-3">
            <button onClick={handleDownloadCSV} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-sm text-xs font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <Icons.Download /> CSV
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="bg-[#111] text-white px-5 py-2 rounded-sm text-xs font-bold hover:bg-[#D32F2F] transition flex items-center gap-2 disabled:opacity-50">
                <span className={isRefreshing ? "animate-spin" : ""}><Icons.Refresh /></span>
                {isRefreshing ? '取得中...' : '最新情報を取得'}
            </button>
        </div>
      </header>

      {/* 🔴 サマリーダッシュボード (色を抑えたミニマルデザイン) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 flex-shrink-0">
          
          {/* 左側: 本日の建値 */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Official Market Price</h3>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <p className="text-[10px] text-gray-500 mb-1">銅 (JX)</p>
                      <p className="text-xl font-black font-mono">¥{currentCopperPrice.toLocaleString()}</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 mb-1">真鍮 (日本伸銅)</p>
                      <p className="text-lg font-bold text-gray-700 font-mono">¥{currentBrassPrice.toLocaleString()}</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 mb-1">亜鉛 (三井)</p>
                      <p className="text-lg font-bold text-gray-700 font-mono">¥{currentZincPrice.toLocaleString()}</p>
                  </div>
                  <div>
                      <p className="text-[10px] text-gray-500 mb-1">鉛 / 錫</p>
                      <p className="text-sm font-bold text-gray-600 font-mono mt-1">¥{currentLeadPrice} / ¥{currentTinPrice.toLocaleString()}</p>
                  </div>
              </div>
          </div>

          {/* 右側: 代表4品目スコアボード */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key Items Comparison</h3>
                  <span className="text-[10px] font-mono text-gray-400">Last Fetch: {lastFetchDate}</span>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                          <tr className="border-b border-gray-100">
                              <th className="py-2 pr-4 font-normal text-[10px] text-gray-400">対象品目</th>
                              <th className="py-2 px-4 font-bold text-[10px] text-gray-800 border-l border-r border-gray-100 bg-gray-50/50">自社設定</th>
                              {competitors.map(c => (
                                  <th key={c.name} className="py-2 px-4 font-normal text-[10px] text-gray-500">{c.name}</th>
                              ))}
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                          {keyItems.map(item => {
                              const myPrice = myPrices[item] || 0;
                              return (
                                  <tr key={item} className="hover:bg-gray-50 transition">
                                      <td className="py-2.5 pr-4 font-bold text-xs">{item.replace('（ピカ線、特号）', '')}</td>
                                      <td className="py-2.5 px-4 font-mono font-black border-l border-r border-gray-100 bg-gray-50/50">¥{myPrice.toLocaleString()}</td>
                                      {competitors.map(c => {
                                          const price = c.prices[item];
                                          const diff = myPrice - price;
                                          return (
                                              <td key={c.name} className="py-2.5 px-4 font-mono text-xs">
                                                  {price ? (
                                                      <div className="flex items-center gap-2">
                                                          <span className={diff < 0 ? 'font-bold text-gray-900' : 'text-gray-600'}>¥{price.toLocaleString()}</span>
                                                          <span className={`text-[10px] font-bold ${diff < 0 ? 'text-[#D32F2F]' : 'text-gray-400'}`}>
                                                              {diff < 0 ? `(${(diff).toLocaleString()})` : ''}
                                                          </span>
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
                  {competitors.length === 0 && <p className="text-xs text-gray-400 mt-2 text-center py-4">データがありません</p>}
              </div>
          </div>
      </div>

      {/* 🔴 メイン価格テーブル (色付けを排除し、テキストと記号のみで表現) */}
      <div className="flex-1 bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-200 shadow-sm">
                      <tr>
                          <th className="p-3 md:p-4 font-normal text-xs text-gray-500 w-[20%]">全20品目 詳細比較</th>
                          <th className="p-3 md:p-4 font-bold text-xs text-gray-900 w-[20%] border-l border-r border-gray-200 bg-white shadow-sm">
                              月寒製作所 (自社)
                          </th>
                          {competitors.length === 0 && <th className="p-4 font-normal text-xs text-gray-400">データ未取得</th>}
                          {competitors.map((comp, idx) => (
                              <th key={idx} className="p-3 md:p-4 font-normal text-xs text-gray-500 w-[20%] border-r border-gray-100 last:border-0">
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
                                  <td className="p-3 md:p-4 font-medium text-xs text-gray-800">{item}</td>
                                  <td className="p-3 md:p-4 border-l border-r border-gray-200 bg-white">
                                      <div className="flex items-center justify-between">
                                          <span className="text-sm font-black text-gray-900 font-mono">¥{myPrice.toLocaleString()}</span>
                                          {isLosing && (
                                              <span className="text-[9px] font-bold text-[#D32F2F] border border-red-200 bg-red-50 px-1.5 py-0.5 rounded-sm flex items-center">
                                                  <Icons.Alert /> 負け
                                              </span>
                                          )}
                                      </div>
                                  </td>
                                  {competitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
                                      if (!compPrice) return <td key={cIdx} className="p-3 md:p-4 text-xs text-gray-300 font-mono border-r border-gray-100 last:border-0">-</td>;
                                      const diff = myPrice - compPrice;
                                      return (
                                          <td key={cIdx} className="p-3 md:p-4 border-r border-gray-100 last:border-0">
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
