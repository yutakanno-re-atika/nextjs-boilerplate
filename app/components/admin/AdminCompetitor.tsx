// app/components/admin/AdminCompetitor.tsx
// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';

const Icons = {
  Radar: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Sparkles: () => <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  TrendingUp: () => <svg className="w-3 h-3 inline-block text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-3 h-3 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Globe: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Book: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  LightBulb: () => <svg className="w-5 h-5 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Filter: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
};

const Sparkline = ({ data, trend }: { data: number[], trend: string }) => {
  if (!data || data.length < 2) return <div className="w-12 h-5"></div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 48; const height = 16;
  const points = data.map((val, i) => `${(i / (data.length - 1)) * width},${height - ((val - min) / range) * height}`).join(' ');
  const color = trend === 'up' ? '#DC2626' : trend === 'down' ? '#2563EB' : '#9CA3AF'; 

  return (
    <svg viewBox={`0 -2 ${width} ${height + 4}`} className="w-12 h-5 overflow-visible opacity-70" title={`推移: ${data.join(' → ')}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'TARGETS' | 'DICTIONARY'>('RADAR');
  const [isProcessing, setIsProcessing] = useState(false);

  const savedMarginRate = Number(data?.config?.target_margin_rate) || 85;
  const [currentMarginRate, setCurrentMarginRate] = useState(savedMarginRate);
  const [newTarget, setNewTarget] = useState({ name: '', type: '同業(競合)', url: '', hint: '' });

  // ★ レーダー上で表示したい「標準カテゴリ」のマスターリスト
  const ALL_RADAR_ITEMS = [
      { key: 'ピカ銅', type: 'copper' },
      { key: '込銅', type: 'copper' },
      { key: 'VVF', type: 'copper' },
      { key: 'CV線', type: 'copper' },
      { key: '雑線', type: 'copper' },
      { key: '砲金', type: 'brass' },
      { key: '込真鍮', type: 'brass' }
  ];

  // 表示する項目をローカルステートで管理（初期値は全てON）
  const [visibleItems, setVisibleItems] = useState<string[]>(ALL_RADAR_ITEMS.map(i => i.key));

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const currentBrassPrice = data?.market?.brass?.price || 980; // 黄銅系のベース
  
  const getWireRatio = (keyword: string, fallback: number) => {
      const found = (data?.wires || []).find((w:any) => w.name.includes(keyword));
      return found ? Number(found.ratio) : fallback;
  };

  // ★ 自社の表示価格（標準カテゴリに対してマッピングして計算）
  const myItems = useMemo(() => {
      return ALL_RADAR_ITEMS.map(item => {
          let ratio = 0;
          let basePrice = 0;

          if (item.key === 'ピカ銅') { ratio = getWireRatio('ピカ', 98); basePrice = currentCopperPrice; }
          else if (item.key === '込銅') { ratio = getWireRatio('込銅', 93); basePrice = currentCopperPrice; }
          else if (item.key === 'VVF') { ratio = getWireRatio('VVF', 42); basePrice = currentCopperPrice; }
          else if (item.key === 'CV線') { ratio = getWireRatio('CV', 65); basePrice = currentCopperPrice; }
          else if (item.key === '雑線') { ratio = getWireRatio('雑線', 40); basePrice = currentCopperPrice; }
          else if (item.key === '砲金') { ratio = 90; basePrice = currentBrassPrice; } // 砲金はとりあえず黄銅ベース+αとするか固定
          else if (item.key === '込真鍮') { ratio = 95; basePrice = currentBrassPrice; } 

          const pureValue = Math.floor(basePrice * (ratio / 100));
          const myPrice = Math.floor(pureValue * (currentMarginRate / 100)); 
          const myMargin = Math.floor(pureValue - myPrice); 
          
          return { name: item.key, ratio, pureValue, myPrice, myMargin, type: item.type };
      });
  }, [data, currentCopperPrice, currentBrassPrice, currentMarginRate]);

  // ★ 競合データにAIが抽出した全品目データを取り込む
  const processedCompetitors = useMemo(() => {
      const targets = data?.competitorTargets || [];
      const pricesLog = [...(data?.competitorPrices || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return targets.map((t: any) => {
          const tPrices = pricesLog.filter(p => p.name === t.name);
          let current = {}; let prev = {};
          try { current = tPrices[0] ? JSON.parse(tPrices[0].prices) : {}; } catch(e){}
          try { prev = tPrices[1] ? JSON.parse(tPrices[1].prices) : {}; } catch(e){}
          
          const trends: any = {}; const history: any = {};
          
          Object.keys(current).forEach(k => {
              if (!prev[k]) trends[k] = 'flat';
              else if (current[k] > prev[k]) trends[k] = 'up';
              else if (current[k] < prev[k]) trends[k] = 'down';
              else trends[k] = 'flat';

              const hist = tPrices.slice(0, 10).reverse().map(p => {
                  try { return JSON.parse(p.prices)[k] || null; } catch { return null; }
              }).filter(v => v !== null);
              
              if (hist.length < 2) {
                  const base = current[k] || 0;
                  history[k] = base > 0 ? [Math.floor(base*0.95), Math.floor(base*0.98), base] : [];
              } else {
                  history[k] = hist;
              }
          });
          return { ...t, prices: current, trends, history };
      });
  }, [data]);

  const marketAnalysis = useMemo(() => {
      if (processedCompetitors.length === 0) return null;
      const vvfItem = myItems.find(i => i.name === 'VVF');
      if (!vvfItem) return null;

      const vvfPrices = processedCompetitors.map(c => c.prices['VVF']).filter(p => p > 0);
      const vvfMax = vvfPrices.length > 0 ? Math.max(...vvfPrices) : 0;
      const vvfAvg = vvfPrices.length > 0 ? Math.floor(vvfPrices.reduce((a,b)=>a+b,0)/vvfPrices.length) : 0;

      let vvfStatus = '';
      if (vvfItem.myPrice >= vvfMax && vvfMax > 0) vvfStatus = `当社のVVF買取価格は市場最高値圏にあります。`;
      else if (vvfItem.myPrice < vvfAvg && vvfAvg > 0) vvfStatus = `当社のVVF買取価格は市場平均（約¥${vvfAvg}）を下回っています。`;
      else if (vvfAvg > 0) vvfStatus = `当社のVVF買取価格は市場平均水準で推移しています。`;
      else vvfStatus = `市場データが十分に取得できていません。`;

      let marginStatus = '';
      const avgMargin = Math.floor(vvfItem.pureValue - vvfAvg);
      if (avgMargin < 50 && vvfAvg > 0) marginStatus = `市場は利益幅を削った集客競争が起きています（他社平均マージン: 約¥${avgMargin}）。無理な追従は避けるべきです。`;
      else if (avgMargin > 100 && vvfAvg > 0) marginStatus = `市場全体が利益を多めに確保しています。当社が少し掛率を上げればシェアを獲得できるチャンスです。`;
      else if (vvfAvg > 0) marginStatus = `市場全体のマージン設定は安定しています。現在の掛率で十分戦えます。`;
      else marginStatus = `マージン推測データが不足しています。`;

      return { vvfStatus, marginStatus };
  }, [processedCompetitors, myItems, currentMarginRate]);

  const getDiffLabel = (my: number, comp: number) => {
      if (!comp) return <span className="text-gray-300 font-bold text-xs">-</span>;
      const diff = my - comp;
      if (diff > 0) return <span className="text-blue-600 font-bold text-xs">+{diff} 勝</span>;
      if (diff < 0) return <span className="text-red-600 font-bold text-xs">{diff} 負</span>;
      return <span className="text-gray-400 font-bold text-xs">同額</span>;
  };

  const hasChanges = currentMarginRate !== savedMarginRate;

  const handleSaveMarginRate = async () => {
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'target_margin_rate', value: currentMarginRate }) });
          localStorage.removeItem('factoryOS_masterData'); 
          alert(`ベース掛率を【${currentMarginRate}%】で保存しました。`); window.location.reload(); 
      } catch(e) { alert("設定の保存に失敗しました。"); setIsProcessing(false); }
  };

  const handleAddTarget = async () => {
      if (!newTarget.name || !newTarget.url) return alert('企業名とURLは必須です');
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADD_COMPETITOR_TARGET', data: newTarget }) });
          setNewTarget({ name: '', type: '同業(競合)', url: '', hint: '' }); alert('監視ターゲットを追加しました！画面を更新します。'); window.location.reload();
      } catch(e) { alert('エラーが発生しました'); setIsProcessing(false); }
  };

  const handleDeleteTarget = async (id: string) => {
      if (!confirm('削除しますか？')) return;
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_COMPETITOR_TARGET', id }) });
          window.location.reload();
      } catch(e) { alert('エラーが発生しました'); setIsProcessing(false); }
  };

  const handleRunScrape = async () => {
      if (!confirm('全URLをAIが巡回して価格を抽出します。\n※数分かかる場合がありますが実行しますか？')) return;
      setIsProcessing(true);
      try {
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'RUN_COMPETITOR_SCRAPE' }) });
          const json = await res.json();
          if (json.status === 'success') { alert(json.message); window.location.reload(); } else { alert('エラー: ' + json.message); setIsProcessing(false); }
      } catch(e) { alert('通信エラー'); setIsProcessing(false); }
  };

  const toggleVisibleItem = (key: string) => {
      setVisibleItems(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full font-sans">
      <header className="mb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-3 border-b border-gray-200 pb-3 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
            <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
            COMPETITOR RADAR
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-mono tracking-wider ml-3">競合相場スクレイピング / AIマーケット分析</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-md overflow-x-auto shadow-inner">
            <button onClick={() => setActiveTab('RADAR')} className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'RADAR' ? 'bg-white text-blue-700 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Radar /> ヒートマップ
            </button>
            <button onClick={() => setActiveTab('TARGETS')} className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'TARGETS' ? 'bg-white text-blue-700 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Globe /> 監視サイト登録
            </button>
            <button onClick={() => setActiveTab('DICTIONARY')} className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'DICTIONARY' ? 'bg-white text-blue-700 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Book /> 呼称辞書
            </button>
        </div>
      </header>

      {activeTab === 'RADAR' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              
              {/* 上部: 2カラム (コントロールパネル & AI分析) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
                  <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5 relative flex flex-col justify-between">
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-widest">PRICING CONTROL</div>
                      <div>
                          <label className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                              ベース買取掛率（％）
                          </label>
                          <p className="text-xs text-gray-500 mb-3">純粋な価値（建値×歩留まり）から何％でお客様から買い取るか</p>
                          <div className="flex items-center gap-4">
                              <input 
                                  type="range" min="60" max="95" step="1" 
                                  value={currentMarginRate} onChange={(e) => setCurrentMarginRate(Number(e.target.value))} 
                                  className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                              />
                              <span className="text-4xl font-black text-blue-600 font-mono w-24 text-right tracking-tighter">{currentMarginRate}%</span>
                          </div>
                      </div>
                      
                      <div className="mt-5 flex justify-between items-end h-10">
                          <div className="text-xs text-gray-400 font-bold flex flex-col justify-end">
                              <span className="mb-0.5">◀ 利益重視 (60%)</span>
                              <span>▶ 薄利多売 (95%)</span>
                          </div>
                          {hasChanges && (
                              <button onClick={handleSaveMarginRate} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-bold shadow-md flex items-center gap-2 transition animate-pulse">
                                  {isProcessing ? <Icons.Refresh /> : <Icons.Save />} 保存して反映
                              </button>
                          )}
                      </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col justify-between">
                      <div>
                          <h3 className="text-sm font-black flex items-center gap-2 text-gray-900 mb-3 tracking-widest border-b border-gray-100 pb-2">
                              <span className="text-blue-600"><Icons.Brain /></span> AI マーケット分析
                          </h3>
                          {marketAnalysis ? (
                              <ul className="space-y-3 text-sm leading-relaxed text-gray-700 list-disc list-inside mt-2">
                                  <li>{marketAnalysis.vvfStatus}</li>
                                  <li>{marketAnalysis.marginStatus}</li>
                              </ul>
                          ) : (
                              <div className="w-full text-center py-6 text-gray-400 text-sm font-bold border border-dashed border-gray-200 rounded-md mt-2">
                                  監視ターゲットが登録されていません。
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* 下部: 比較ヒートマップ */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between md:items-center shrink-0 gap-3">
                      <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900 text-base">自社 vs 競合 価格差額ヒートマップ</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">銅建値: ¥{currentCopperPrice}</span>
                      </div>
                      
                      {/* 表示項目のカスタマイズUI */}
                      <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Icons.Filter /> 表示:</span>
                          {ALL_RADAR_ITEMS.map(item => (
                              <label key={item.key} className="flex items-center gap-1 text-xs text-gray-700 cursor-pointer bg-white px-2 py-1 rounded border border-gray-200 shadow-sm hover:bg-gray-50">
                                  <input type="checkbox" checked={visibleItems.includes(item.key)} onChange={() => toggleVisibleItem(item.key)} className="accent-blue-600" />
                                  {item.key}
                              </label>
                          ))}
                          <button onClick={handleRunScrape} disabled={isProcessing || processedCompetitors.length === 0} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition active:scale-95">
                              {isProcessing ? <Icons.Refresh /> : <Icons.Sparkles />} 手動巡回
                          </button>
                      </div>
                  </div>

                  <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse text-sm whitespace-nowrap min-w-[800px]">
                          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-20">
                              <tr>
                                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 border-r border-gray-200 sticky left-0 z-30 shadow-[1px_0_0_rgba(0,0,0,0.1)]">品目 / 歩留</th>
                                  <th className="p-3 text-xs font-black text-blue-900 uppercase tracking-widest bg-blue-50 border-r border-blue-200 min-w-[140px] shadow-[inset_0_-2px_0_rgba(59,130,246,0.3)]">
                                      月寒製作所 (自社)
                                  </th>
                                  {processedCompetitors.map(comp => (
                                      <th key={comp.id} className="p-3 text-xs font-bold text-gray-600 uppercase tracking-widest min-w-[160px] bg-gray-50 border-r border-gray-200">
                                          {comp.name}<br/><span className="text-[10px] text-gray-400 font-normal">{comp.type}</span>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {myItems.filter(item => visibleItems.includes(item.name)).map(item => (
                                  <tr key={item.name} className="hover:bg-blue-50/20 transition group">
                                      <td className="p-3 bg-white border-r border-gray-200 sticky left-0 z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)] group-hover:bg-gray-50">
                                          <div className="font-bold text-gray-900 text-sm mb-1">{item.name}</div>
                                          <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                              <span className="bg-gray-100 px-1.5 py-0.5 rounded">歩留:{item.ratio}%</span> 
                                              <span>価値:¥{item.pureValue}</span>
                                          </div>
                                      </td>
                                      
                                      <td className="p-3 bg-blue-50/30 border-r border-blue-100 relative">
                                          <div className="font-mono font-black text-2xl text-blue-700 tracking-tighter">¥{item.myPrice.toLocaleString()}</div>
                                          <div className="text-xs font-bold text-blue-600 mt-1">
                                              粗利: ¥{item.myMargin}
                                          </div>
                                      </td>

                                      {processedCompetitors.map(comp => {
                                          const compPrice = comp.prices[item.name];
                                          const trend = comp.trends[item.name];
                                          const historyData = comp.history[item.name] || [];
                                          
                                          return (
                                              <td key={comp.id} className="p-3 bg-white border-r border-gray-100">
                                                  <div className="flex flex-col">
                                                      <div className="flex items-center justify-between">
                                                          <div className="flex items-center gap-1.5">
                                                              <span className={`font-mono text-xl font-bold ${compPrice ? 'text-gray-800' : 'text-gray-300'}`}>
                                                                  {compPrice ? `¥${compPrice.toLocaleString()}` : '---'}
                                                              </span>
                                                              {compPrice && trend === 'up' ? <Icons.TrendingUp /> : compPrice && trend === 'down' ? <Icons.TrendingDown /> : null}
                                                          </div>
                                                          <Sparkline data={historyData} trend={trend} />
                                                      </div>
                                                      <div className="mt-1">
                                                          {getDiffLabel(item.myPrice, compPrice)}
                                                      </div>
                                                  </div>
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      {myItems.filter(item => visibleItems.includes(item.name)).length === 0 && (
                          <div className="p-10 text-center text-gray-400 font-bold text-sm">
                              表示する品目が選択されていません。
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* TARGETS タブと DICTIONARY タブの表示は変更なしのため省略せずに残します */}
      {activeTab === 'TARGETS' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-base mb-4 flex items-center gap-2"><Icons.Plus /> 新規ターゲットの追加</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <input type="text" placeholder="企業名 (例: 札幌 A社)" className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-white" value={newTarget.name} onChange={e => setNewTarget({...newTarget, name: e.target.value})} />
                          <select className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-white" value={newTarget.type} onChange={e => setNewTarget({...newTarget, type: e.target.value})}>
                              <option value="同業(競合)">同業(競合)</option>
                              <option value="メーカー直系">メーカー直系</option>
                              <option value="輸出ヤード">輸出ヤード</option>
                          </select>
                          <input type="url" placeholder="トップページのURL" className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none font-mono focus:border-blue-500 bg-white" value={newTarget.url} onChange={e => setNewTarget({...newTarget, url: e.target.value})} />
                      </div>
                      <div className="flex flex-col md:flex-row gap-4">
                          <input type="text" placeholder="AIへのヒント (例: FケーブルはVVFとして扱う等)" className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:border-blue-500 bg-white flex-1" value={newTarget.hint} onChange={e => setNewTarget({...newTarget, hint: e.target.value})} />
                          <button onClick={handleAddTarget} disabled={isProcessing || !newTarget.name || !newTarget.url} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-md text-sm font-bold shadow-md transition disabled:opacity-50 whitespace-nowrap">
                              {isProcessing ? '処理中...' : '登録する'}
                          </button>
                      </div>
                  </div>

                  <div className="space-y-3 mt-8">
                      <h4 className="font-bold text-sm text-gray-500 uppercase tracking-widest">登録済みターゲット</h4>
                      {processedCompetitors.map(target => (
                          <div key={target.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 bg-white shadow-sm hover:border-blue-300 transition-colors group">
                              <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg">{target.name} <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-sm text-gray-500 font-normal ml-2 border border-gray-200">{target.type}</span></h4>
                                  <a href={target.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-mono mt-1 hover:underline truncate block max-w-[300px] md:max-w-md">{target.url}</a>
                              </div>
                              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
                                  <div className="text-right">
                                      <p className="text-[10px] text-gray-400 font-bold tracking-widest">最終AIクロール</p>
                                      <p className="text-xs font-mono text-gray-900 mt-1">
                                          {target.lastCrawled || '未実行'} 
                                          {target.status === '成功' && <span className="text-green-600 font-bold ml-2 bg-green-50 px-2 py-0.5 rounded-sm">● 成功</span>}
                                          {target.status && target.status !== '成功' && <span className="text-red-600 font-bold ml-2 bg-red-50 px-2 py-0.5 rounded-sm">❌ {target.status}</span>}
                                      </p>
                                  </div>
                                  <button onClick={() => handleDeleteTarget(target.id)} disabled={isProcessing} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-sm transition opacity-50 group-hover:opacity-100"><Icons.Trash /></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'DICTIONARY' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <div>
                          <h3 className="text-lg font-black text-gray-900">名称ゆらぎ・シノニム辞書</h3>
                          <p className="text-sm text-gray-500 mt-1">AIが他社サイトを巡回する際、「この単語は当社のこの品目のことだ」と翻訳するための辞書です。</p>
                      </div>
                  </div>
                  <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-50 p-3 border-b border-gray-200">
                              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> ピカ銅</h4>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2.5 bg-white">
                              <span className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-sm text-xs font-bold">1号銅線</span>
                              <span className="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-sm text-xs font-bold">光線</span>
                              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1"><Icons.Sparkles /> 特号銅 (自動学習)</span>
                          </div>
                      </div>
                      {/* VVFやその他の辞書データ... */}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
