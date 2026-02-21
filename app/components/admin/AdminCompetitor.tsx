// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Alert: () => <svg className="w-4 h-4 text-orange-500 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // ★ モックを廃止し、取得したデータを保持するステートに変更
  const [competitors, setCompetitors] = useState<any[]>([]);

  // 自社の基準価格（銅建値から計算）
  const copperPrice = data?.market?.copper?.price || 1450;
  const myPrices = {
      "特1号銅線": Math.floor(copperPrice * 0.98), 
      "ピカ線": Math.floor(copperPrice * 0.96),   
      "VVF (VA)": Math.floor(copperPrice * 0.42) - 15, 
      "雑線": Math.floor(copperPrice * 0.38) - 15      
  };

  const targetItems = ["特1号銅線", "ピカ線", "VVF (VA)", "雑線"];

  // ★ GASのAIクローラーを呼び出す処理
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
              setCompetitors(result.data); // 取得した3社のデータを画面にセット！
          } else {
              alert('取得に失敗しました。');
          }
      } catch (error) {
          alert('通信エラーが発生しました。');
      }
      setIsRefreshing(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-6 flex justify-between items-end flex-shrink-0">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                競合価格レーダー (AIリサーチ)
            </h2>
            <p className="text-xs text-gray-500 mt-1">「札幌銅リサイクル」「REC環境サービス」「札幌金属興業」の最新価格を自動取得します。</p>
        </div>
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
            <span className={isRefreshing ? "animate-spin" : ""}><Icons.Refresh /></span>
            {isRefreshing ? 'AIサイト巡回中...' : '最新情報を取得 (クローラー起動)'}
        </button>
      </header>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-4 font-bold text-sm text-gray-500 w-[15%]">買取品目</th>
                          <th className="p-4 font-black text-sm text-[#D32F2F] bg-red-50/50 w-[25%]">月寒製作所 (自社)</th>
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
                          
                          // 競合の中で、数字が取れた（nullじゃない）一番高い価格を探す
                          const validCompetitorPrices = competitors.map(c => c.prices[item]).filter(p => p !== null);
                          const maxCompetitorPrice = validCompetitorPrices.length > 0 ? Math.max(...validCompetitorPrices) : 0;
                          
                          // 自社が負けているか（他社最高値より安いか）
                          const isLosing = maxCompetitorPrice > 0 && myPrice < maxCompetitorPrice;

                          return (
                              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                                  <td className="p-4 font-bold text-gray-900 text-sm">
                                      {item}
                                  </td>
                                  <td className="p-4 bg-red-50/30">
                                      <div className="flex items-center justify-between gap-2">
                                          <span className="text-lg font-black text-gray-900">¥{myPrice.toLocaleString()}</span>
                                          {isLosing && (
                                              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200 animate-pulse">
                                                  <Icons.Alert /> 他社に負けています
                                              </span>
                                          )}
                                          {!isLosing && maxCompetitorPrice > 0 && (
                                              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                                                  地域最高値
                                              </span>
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
