// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  TrendingFlat: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14" /></svg>,
  Alert: () => <svg className="w-4 h-4 text-orange-500 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

// ★ GASからの取得を想定した他社データ（モック）
const mockCompetitors = [
  {
    name: "A社 (札幌市)",
    lastUpdated: "本日 08:30",
    prices: { "特1号銅線": 1420, "ピカ線": 1400, "VVF (VA)": 480, "雑線": 350 }
  },
  {
    name: "B社 (苫小牧近郊)",
    lastUpdated: "昨日 17:00",
    prices: { "特1号銅線": 1400, "ピカ線": 1380, "VVF (VA)": 450, "雑線": 360 } // 雑線だけ強い
  }
];

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 自社の価格（データから計算、またはconfigから取得）
  const copperPrice = data?.market?.copper?.price || 1450;
  
  // 自社価格の計算シミュレート（実際は商品マスターから引っ張る）
  const myPrices = {
      "特1号銅線": Math.floor(copperPrice * 0.98), // 例: 1421
      "ピカ線": Math.floor(copperPrice * 0.96),   // 例: 1392
      "VVF (VA)": Math.floor(copperPrice * 0.42) - 15, // 例: 594
      "雑線": Math.floor(copperPrice * 0.38) - 15      // 例: 536
  };

  const targetItems = ["特1号銅線", "ピカ線", "VVF (VA)", "雑線"];

  const handleRefresh = () => {
      setIsRefreshing(true);
      // ★ ここで将来、GASに「今すぐ他社サイトを見に行け」という命令を出す
      setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-6 flex justify-between items-end flex-shrink-0">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                競合価格レーダー (AIリサーチ)
            </h2>
            <p className="text-xs text-gray-500 mt-1">近隣競合のウェブサイトを自動巡回し、自社価格との勝敗を判定します。</p>
        </div>
        <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
        >
            <span className={isRefreshing ? "animate-spin" : ""}><Icons.Refresh /></span>
            {isRefreshing ? 'AI巡回中...' : '最新情報を取得'}
        </button>
      </header>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="p-4 font-bold text-sm text-gray-500 w-1/4">買取品目</th>
                          <th className="p-4 font-black text-sm text-[#D32F2F] bg-red-50/50 w-1/4">自社設定価格 (月寒製作所)</th>
                          {mockCompetitors.map((comp, idx) => (
                              <th key={idx} className="p-4 font-bold text-sm text-gray-700">
                                  {comp.name}
                                  <div className="text-[9px] text-gray-400 font-normal mt-1">更新: {comp.lastUpdated}</div>
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody>
                      {targetItems.map((item, idx) => {
                          const myPrice = myPrices[item];
                          
                          // 各社の中で一番高い価格を探す
                          const maxCompetitorPrice = Math.max(...mockCompetitors.map(c => c.prices[item] || 0));
                          
                          // 自社が負けているか（他社最高値より安いか）
                          const isLosing = myPrice < maxCompetitorPrice;

                          return (
                              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition group">
                                  <td className="p-4 font-bold text-gray-900 text-sm">
                                      {item}
                                  </td>
                                  <td className="p-4 bg-red-50/30">
                                      <div className="flex items-center gap-2">
                                          <span className="text-lg font-black text-gray-900">¥{myPrice.toLocaleString()}</span>
                                          {isLosing && (
                                              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200 animate-pulse">
                                                  <Icons.Alert /> 他社に負けています
                                              </span>
                                          )}
                                          {!isLosing && (
                                              <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">
                                                  地域最高値
                                              </span>
                                          )}
                                      </div>
                                  </td>
                                  {mockCompetitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
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
          </div>
          
          <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
              <p className="text-xs text-gray-500 leading-relaxed">
                  💡 <strong>AIからのアドバイス:</strong><br/>
                  現在「{targetItems.find(item => myPrices[item] < Math.max(...mockCompetitors.map(c => c.prices[item] || 0)))}」の価格設定が近隣A社を下回っています。持ち込み客が流出するリスクがあるため、+10円の価格調整を推奨します。
              </p>
          </div>
      </div>
    </div>
  );
};
