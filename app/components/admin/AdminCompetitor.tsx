// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Alert: () => <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Crown: () => <svg className="w-3.5 h-3.5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Banknotes: () => <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Clock: () => <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
};

const defaultPricingRules = {
  "光線（ピカ線、特号）": { base: "copper", ratio: 96, offset: 0 },
  "1号線": { base: "copper", ratio: 94, offset: 0 },
  "2号線": { base: "copper", ratio: 91, offset: 0 },
  "上銅": { base: "copper", ratio: 89, offset: 0 },
  "並銅": { base: "copper", ratio: 87, offset: 0 },
  "下銅": { base: "copper", ratio: 82, offset: 0 },
  "山行銅": { base: "copper", ratio: 78, offset: 0 },
  "ビスマス砲金": { base: "copper", ratio: 70, offset: 0 },
  "砲金": { base: "copper", ratio: 68, offset: 0 },
  "メッキ砲金": { base: "copper", ratio: 65, offset: 0 },
  "バルブ砲金": { base: "copper", ratio: 63, offset: 0 },
  "込砲金": { base: "copper", ratio: 60, offset: 0 },
  "込中": { base: "brass", ratio: 83, offset: 0 }, 
  "山行中": { base: "brass", ratio: 78, offset: 0 }, 
  "被覆線80%": { base: "copper", ratio: 80, offset: -15 },
  "被覆線70%": { base: "copper", ratio: 70, offset: -15 },
  "被覆線60%": { base: "copper", ratio: 60, offset: -15 },
  "被覆線50%": { base: "copper", ratio: 50, offset: -15 },
  "被覆線40%": { base: "copper", ratio: 40, offset: -15 },
  "雑線": { base: "copper", ratio: 35, offset: -15 }
};

const targetItems = Object.keys(defaultPricingRules);
const keyItems = ["光線（ピカ線、特号）", "並銅", "砲金", "込中"];

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('最新情報を取得');
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [lastFetchDate, setLastFetchDate] = useState<string>('未取得');
  
  const [isEditing, setIsEditing] = useState(false);
  const [pricingRules, setPricingRules] = useState<any>(defaultPricingRules);
  const [isSavingRules, setIsSavingRules] = useState(false);

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const currentBrassPrice = data?.market?.brass?.price || 980;
  const currentZincPrice = data?.market?.zinc?.price || 450;
  const currentLeadPrice = data?.market?.lead?.price || 380;
  const currentTinPrice = data?.market?.tin?.price || 8900;

  useEffect(() => {
      const savedData = localStorage.getItem('factoryOS_competitors');
      const savedDate = localStorage.getItem('factoryOS_competitors_date');
      if (savedData) {
          try { setCompetitors(JSON.parse(savedData)); if (savedDate) setLastFetchDate(savedDate); } catch(e) {}
      }

      if (data?.config?.pricing_rules) {
          try {
              const savedRules = JSON.parse(data.config.pricing_rules);
              setPricingRules({ ...defaultPricingRules, ...savedRules });
          } catch(e) { console.error("Rules parse error"); }
      }
  }, [data]);

  const calculateMyPrice = (item: string, rules: any) => {
      const rule = rules[item];
      if (!rule) return 0;
      let basePrice = currentCopperPrice;
      if (rule.base === 'brass') basePrice = currentBrassPrice;
      if (rule.base === 'zinc') basePrice = currentZincPrice;
      if (rule.base === 'lead') basePrice = currentLeadPrice;
      return Math.floor(basePrice * (Number(rule.ratio) / 100)) + Number(rule.offset);
  };

  const handleRuleChange = (item: string, field: 'ratio' | 'offset', value: string) => {
      setPricingRules((prev: any) => ({ ...prev, [item]: { ...prev[item], [field]: value } }));
  };

  const handleSaveRules = async () => {
      setIsSavingRules(true);
      try {
          const res = await fetch('/api/gas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'pricing_rules', value: JSON.stringify(pricingRules), description: 'プライシングダッシュボードからの更新' })
          });
          const result = await res.json();
          if (result.status === 'success') {
              setIsEditing(false);
              alert("自社の買取設定（歩留まり・控除額）をデータベースに保存しました。");
          } else { alert("保存エラー: " + result.message); }
      } catch (e) { alert("通信エラーが発生しました。"); }
      setIsSavingRules(false);
  };

  const handleRefresh = async () => {
      setIsRefreshing(true);
      const results: any[] = [];
      const targets = [
          { key: "sapporo", name: "札幌銅" },
          { key: "rec", name: "REC" },
          { key: "ohata", name: "大畑商事" }
      ];
      
      for (const target of targets) {
          setStatusMessage(`${target.name}をAI解析中...`);
          try {
              const res = await fetch('/api/competitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetKey: target.key }) });
              if (res.ok) {
                  const result = await res.json();
                  if (result.status === 'success' && result.data) results.push(result.data);
              }
          } catch (error) {}
      }

      if (results.length > 0) {
          setCompetitors(results); 
          const now = new Date().toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
          setLastFetchDate(now);
          localStorage.setItem('factoryOS_competitors', JSON.stringify(results));
          localStorage.setItem('factoryOS_competitors_date', now);
          setStatusMessage('取得完了');
      } else {
          alert('すべてのデータ取得に失敗しました。');
      }
      setTimeout(() => { setIsRefreshing(false); setStatusMessage('最新情報を取得'); }, 2000);
  };

  const handleDownloadCSV = () => {
      if (competitors.length === 0) return alert("データがありません");
      const headers = ['品目名', '月寒製作所 (自社)', ...competitors.map(c => c.name)];
      const rows = targetItems.map(item => {
          const myPrice = calculateMyPrice(item, pricingRules);
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
                プライシング・ダッシュボード
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">AI COMPETITOR RESEARCH & DYNAMIC PRICING</p>
        </div>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button onClick={handleDownloadCSV} className="flex-1 sm:flex-none justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-sm text-xs font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <Icons.Download /> CSV
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none w-48 justify-center bg-[#111] text-white px-5 py-2.5 rounded-sm text-xs font-bold hover:bg-[#D32F2F] transition flex items-center gap-2 disabled:opacity-50">
                {isRefreshing && <span className="animate-spin"><Icons.Refresh /></span>}
                {statusMessage}
            </button>
        </div>
      </header>

      {/* 🔴 サマリーダッシュボード */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm mb-6 flex flex-col flex-shrink-0">
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
              </div>
              <div className="text-left md:text-right flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:gap-1 border-t lg:border-t-0 border-gray-200 pt-4 lg:pt-0">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center"><Icons.Clock /> AI最終巡回</span>
                  <span className="text-xs md:text-sm font-mono font-bold text-gray-800 bg-white px-2 md:px-3 py-1 border border-gray-200 rounded-sm shadow-sm">{lastFetchDate}</span>
              </div>
          </div>
      </div>

      {/* 🔴 メイン価格テーブル (全20品目) ＆ 編集モード */}
      <div className="flex-1 bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] md:min-h-0 relative">
          
          <div className="bg-gray-100 border-b border-gray-200 p-3 flex justify-between items-center sticky top-0 z-30">
              <span className="text-xs font-bold text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  自社価格 データベース連動
              </span>
              <div className="flex items-center gap-2">
                  {isEditing ? (
                      <>
                          <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-500 bg-white border border-gray-300 px-3 py-1.5 rounded-sm hover:bg-gray-50 transition flex items-center gap-1">
                              <Icons.Close /> 取消
                          </button>
                          <button onClick={handleSaveRules} disabled={isSavingRules} className="text-xs font-bold text-white bg-[#D32F2F] px-4 py-1.5 rounded-sm hover:bg-red-700 transition shadow-sm flex items-center gap-1 disabled:opacity-50">
                              {isSavingRules ? '保存中...' : <><Icons.Save /> DBへ反映</>}
                          </button>
                      </>
                  ) : (
                      <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-gray-700 bg-white border border-gray-300 px-4 py-1.5 rounded-sm hover:bg-gray-50 transition shadow-sm flex items-center gap-1">
                          <Icons.Edit /> 自社価格の調整
                      </button>
                  )}
              </div>
          </div>

          <div className="overflow-y-auto overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-20">
                      <tr>
                          <th className="p-3 font-normal text-[10px] text-gray-500 w-[15%] tracking-widest whitespace-nowrap">ベンチマーク品目</th>
                          <th className="p-3 font-bold text-[10px] text-white bg-[#111] w-[35%] border-r border-gray-800 whitespace-nowrap text-center">
                              自社の価格設定 (ベース建値 × <span className="text-red-400">歩留%</span> ＋ <span className="text-blue-400">調整額</span>)
                          </th>
                          {competitors.length === 0 && <th className="p-4 font-normal text-xs text-gray-400">AIデータ未取得</th>}
                          {competitors.map((comp, idx) => (
                              <th key={idx} className="p-3 font-normal text-[10px] text-gray-500 w-[16%] border-r border-gray-100 last:border-0 whitespace-nowrap text-center">
                                  {comp.name}
                              </th>
                          ))}
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {targetItems.map((item, idx) => {
                          const myPrice = calculateMyPrice(item, pricingRules);
                          const validCompetitorPrices = competitors.map(c => c.prices[item]).filter(p => typeof p === 'number' && p > 0);
                          const maxCompetitorPrice = validCompetitorPrices.length > 0 ? Math.max(...validCompetitorPrices) : 0;
                          
                          // ★ 勝敗の明確化
                          const isWinning = maxCompetitorPrice > 0 && myPrice >= maxCompetitorPrice;
                          const isLosing = maxCompetitorPrice > 0 && myPrice < maxCompetitorPrice;
                          
                          const rule = pricingRules[item];

                          return (
                              <tr key={idx} className={`hover:bg-gray-50 transition ${isEditing ? 'bg-blue-50/20' : ''}`}>
                                  <td className="p-3 font-medium text-xs text-gray-800 whitespace-nowrap">{item}</td>
                                  
                                  {/* 自社設定エリア */}
                                  <td className="p-2 md:p-3 border-l border-r border-gray-200 bg-white whitespace-nowrap">
                                      {isEditing ? (
                                          <div className="flex items-center justify-between gap-2 bg-gray-50 p-1.5 rounded border border-gray-200">
                                              <div className="flex items-center gap-1.5">
                                                  <span className="text-[10px] text-gray-400 font-mono w-6 text-center">{rule.base === 'brass' ? '真鍮' : '銅'}</span>
                                                  <span className="text-xs text-gray-400">×</span>
                                                  <input type="number" value={rule.ratio} onChange={e => handleRuleChange(item, 'ratio', e.target.value)} className="w-16 p-1 text-right text-sm font-bold font-mono border border-red-200 text-red-600 rounded-sm focus:outline-none focus:border-red-500" />
                                                  <span className="text-[10px] text-gray-500">%</span>
                                                  <span className="text-xs text-gray-400 ml-1">＋</span>
                                                  <input type="number" value={rule.offset} onChange={e => handleRuleChange(item, 'offset', e.target.value)} className="w-16 p-1 text-right text-sm font-bold font-mono border border-blue-200 text-blue-600 rounded-sm focus:outline-none focus:border-blue-500" />
                                                  <span className="text-[10px] text-gray-500">円</span>
                                              </div>
                                              <div className="text-base font-black text-gray-900 font-mono bg-white px-2 py-1 border border-gray-200 rounded shadow-sm">
                                                  ¥{myPrice.toLocaleString()}
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="flex items-center justify-between px-2">
                                              <span className="text-[10px] text-gray-400 font-mono">
                                                  ({rule.base === 'brass' ? '真鍮' : '銅'} × {rule.ratio}% {Number(rule.offset) >= 0 ? '+' : ''}{rule.offset}円)
                                              </span>
                                              <div className="flex items-center gap-2">
                                                  <span className="text-sm font-black text-gray-900 font-mono">¥{myPrice.toLocaleString()}</span>
                                                  {/* ★ 自社の全体的な勝敗を表示 */}
                                                  {isLosing && (
                                                      <span className="text-[10px] font-bold text-[#D32F2F] border border-red-200 bg-red-50 px-1.5 py-0.5 rounded-sm flex items-center shadow-sm">
                                                          <Icons.Alert /> 劣勢
                                                      </span>
                                                  )}
                                                  {isWinning && (
                                                      <span className="text-[10px] font-bold text-blue-700 border border-blue-200 bg-blue-50 px-1.5 py-0.5 rounded-sm flex items-center shadow-sm">
                                                          <Icons.Crown /> 優勢
                                                      </span>
                                                  )}
                                              </div>
                                          </div>
                                      )}
                                  </td>

                                  {/* 競合他社エリア */}
                                  {competitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
                                      if (!compPrice) return <td key={cIdx} className="p-3 text-xs text-gray-300 font-mono border-r border-gray-100 last:border-0 text-center">-</td>;
                                      
                                      const diff = myPrice - compPrice;
                                      return (
                                          <td key={cIdx} className="p-3 border-r border-gray-100 last:border-0 whitespace-nowrap bg-white">
                                              <div className="flex flex-col items-center justify-center gap-1">
                                                  <span className={`text-sm font-mono ${compPrice > myPrice ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                                                      ¥{compPrice.toLocaleString()}
                                                  </span>
                                                  
                                                  {/* ★ 1社ごとの勝敗と金額差をバッジで明確化 */}
                                                  {diff < 0 ? (
                                                      <span className="text-[9px] font-bold text-[#D32F2F] bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                                          自社が {Math.abs(diff).toLocaleString()}円 負け
                                                      </span>
                                                  ) : diff > 0 ? (
                                                      <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                          自社が {diff.toLocaleString()}円 勝ち
                                                      </span>
                                                  ) : (
                                                      <span className="text-[9px] font-bold text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                                                          同値
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
          </div>
      </div>
    </div>
  );
};
