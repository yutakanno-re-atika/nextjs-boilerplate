// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Alert: () => <svg className="w-4 h-4 text-orange-500 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [competitors, setCompetitors] = useState<any[]>([]);

  // 基準となる銅建値
  const copperPrice = data?.market?.copper?.price || 1450;
  
  // ★ 月寒製作所の公式設定価格（仮の掛け目でシミュレート）
  const myPrices = {
      "光線（ピカ線、特号）": Math.floor(copperPrice * 0.96),
      "1号線": Math.floor(copperPrice * 0.94),
      "2号線": Math.floor(copperPrice * 0.91),
      "上銅": Math.floor(copperPrice * 0.89),
      "並銅": Math.floor(copperPrice * 0.87),
      "下銅": Math.floor(copperPrice * 0.82),
      "山行銅": Math.floor(copperPrice * 0.78),
      "ビスマス砲金": Math.floor(copperPrice * 0.70),
      "砲金": Math.floor(copperPrice * 0.68),
      "メッキ砲金": Math.floor(copperPrice * 0.65),
      "バルブ砲金": Math.floor(copperPrice * 0.63),
      "込砲金": Math.floor(copperPrice * 0.60),
      "込中": Math.floor(copperPrice * 0.58),
      "山行中": Math.floor(copperPrice * 0.55),
      "被覆線80%": Math.floor(copperPrice * 0.80) - 15,
      "被覆線70%": Math.floor(copperPrice * 0.70) - 15,
      "被覆線60%": Math.floor(copperPrice * 0.60) - 15,
      "被覆線50%": Math.floor(copperPrice * 0.50) - 15,
      "被覆線40%": Math.floor(copperPrice * 0.40) - 15,
      "雑線": Math.floor(copperPrice * 0.35) - 15
  };

  // ★ 監視する20品目リスト
  const targetItems = [
      "光線（ピカ線、特号）", "1号線", "2号線", "上銅", "並銅", "下銅", "山行銅",
      "ビスマス砲金", "砲金", "メッキ砲金", "バルブ砲金", "込砲金",
      "込中", "山行中",
      "被覆線80%", "被覆線70%", "被覆線60%", "被覆線50%", "被覆線40%", "雑線"
  ];

  const handleRefresh = async () => {
      setIsRefreshing(true);
      try {
          const res = await fetch('/api/gas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'FETCH_COMPETITORS' })
          });
          const result = await res.json();
          if (result.status === 'success' && result.data) {
              setCompetitors(result.data); 
          } else {
              alert('取得に失敗しました。');
          }
      } catch (error) {
          alert('通信エラーが発生しました。');
      }
      setIsRefreshing(false);
  };

  // CSVダウンロード機能
  const handleDownloadCSV = () => {
      if (competitors.length === 0) {
          alert("先に「最新情報を取得」ボタンでデータを読み込んでください。");
          return;
      }
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
      const dateStr = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').slice(0, 16);
      link.setAttribute('download', `competitor_prices_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-6 flex justify-between items-end flex-shrink-0">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                競合価格レーダー (AIリサーチ)
            </h2>
            <p className="text-xs text-gray-500 mt-1">月寒製作所の公式20品目に基づいて、札幌近郊3社の価格を自動翻訳・比較します。</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleDownloadCSV}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
            >
                <Icons.Download /> CSVで出力
            </button>
            <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
                <span className={isRefreshing ? "animate-spin" : ""}><Icons.Refresh /></span>
                {isRefreshing ? 'AIサイト巡回中...' : '最新情報を取得 (クローラー起動)'}
            </button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50 border-b border-gray-200 shadow-sm">
                          <th className="p-4 font-bold text-sm text-gray-500 w-[20%]">買取品目 (公式)</th>
                          <th className="p-4 font-black text-sm text-[#D32F2F] bg-red-50/90 w-[20%] border-r border-red-100">月寒製作所 (自社)</th>
                          {competitors.length === 0 && (
                              <th className="p-4 font-bold text-sm text-gray-400">データ未取得（右上のボタンを押してください）</th>
                          )}
                          {competitors.map((comp, idx) => (
                              <th key={idx} className="p-4 font-bold text-sm text-gray-700 w-[20%]">
                                  {comp.name}
                                  <div className="text-[9px] text-gray-400 font-normal mt-1">取得: {comp.lastUpdated}</div>
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {competitors.length > 0 && targetItems.map((item, idx) => {
                          const myPrice = myPrices[item];
                          
                          const validCompetitorPrices = competitors.map(c => c.prices[item]).filter(p => p !== null);
                          const maxCompetitorPrice = validCompetitorPrices.length > 0 ? Math.max(...validCompetitorPrices) : 0;
                          
                          const isLosing = maxCompetitorPrice > 0 && myPrice < maxCompetitorPrice;

                          return (
                              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                                  <td className="p-4 font-bold text-gray-900 text-sm whitespace-nowrap">
                                      {item}
                                  </td>
                                  <td className="p-4 bg-red-50/30 border-r border-red-50">
                                      <div className="flex flex-col gap-1">
                                          <span className="text-lg font-black text-gray-900">¥{myPrice.toLocaleString()}</span>
                                          {isLosing ? (
                                              <span className="text-[9px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded border border-orange-200 inline-block w-max">
                                                  <Icons.Alert /> 負けています
                                              </span>
                                          ) : (
                                              maxCompetitorPrice > 0 ? (
                                                  <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded border border-green-200 inline-block w-max">
                                                      地域最高値
                                                  </span>
                                              ) : (
                                                  <span className="text-[9px] text-gray-400">-</span>
                                              )
                                          )}
                                      </div>
                                  </td>
                                  {competitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
                                      if (!compPrice) {
                                          return <td key={cIdx} className="p-4 text-xs text-gray-300 font-bold">- 記載なし -</td>;
                                      }
                                      const diff = myPrice - compPrice;
                                      return (
                                          <td key={cIdx} className="p-4">
                                              <div className="flex flex-col">
                                                  <span className={`text-base font-bold ${compPrice > myPrice ? 'text-red-600' : 'text-gray-700'}`}>
                                                      ¥{compPrice.toLocaleString()}
                                                  </span>
                                                  <span className={`text-[10px] font-bold mt-0.5 ${diff > 0 ? 'text-green-500' : (diff < 0 ? 'text-red-500' : 'text-gray-400')}`}>
                                                      (自社比 {diff > 0 ? '+' : ''}{diff}円)
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
                  <div className="p-12 text-center text-gray-400">
                      <Icons.Refresh />
                      <p className="mt-2 text-sm font-bold">右上の「最新情報を取得」ボタンを押して、競合サイトを巡回させてください。</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
