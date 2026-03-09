// app/components/admin/AdminCompetitor.tsx
// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';

const Icons = {
  Radar: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  TrendingUp: () => <svg className="w-3 h-3 inline-block text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-3 h-3 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" /></svg>,
  Brain: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Globe: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  LightBulb: () => <svg className="w-4 h-4 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Filter: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Info: () => <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
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
  const [activeTab, setActiveTab] = useState<'RADAR' | 'TARGETS'>('RADAR');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scrapeProgress, setScrapeProgress] = useState({ current: 0, total: 0, targetName: '' });

  const savedMarginRate = Number(data?.config?.target_margin_rate) || 85;
  const [currentMarginRate, setCurrentMarginRate] = useState(savedMarginRate);

  const savedGlobalPrompt = data?.config?.global_scrape_prompt || "";
  const [globalPrompt, setGlobalPrompt] = useState(savedGlobalPrompt);

  const [newTarget, setNewTarget] = useState({ name: '', type: '同業(競合)', url: '', hint: '' });

  const ALL_RADAR_ITEMS = [
      { key: '光線', type: 'copper', searchKey: 'ピカ', defaultRatio: 98 },
      { key: '下銅', type: 'copper', searchKey: '込銅', defaultRatio: 93 },
      { key: '砲金', type: 'brass', searchKey: '砲金', defaultRatio: 90 },
      { key: '込砲金', type: 'brass', searchKey: '込砲金', defaultRatio: 85 },
      { key: '真鍮', type: 'brass', searchKey: '真鍮', defaultRatio: 65 },
      { key: '込真鍮', type: 'brass', searchKey: '込真鍮', defaultRatio: 60 },
      { key: '被覆線（80%）', type: 'copper', searchKey: '80%', defaultRatio: 80 },
      { key: '被覆線（60%）', type: 'copper', searchKey: '60%', defaultRatio: 60 },
      { key: '被覆線（50%）', type: 'copper', searchKey: '50%', defaultRatio: 50 },
      { key: 'ネズミ線（VA・VVFなど）', type: 'copper', searchKey: 'VVF', defaultRatio: 42 },
      { key: 'LANケーブル', type: 'copper', searchKey: 'LAN', defaultRatio: 40 },
      { key: '雑線（ハーネスや家電線など）', type: 'copper', searchKey: '雑線', defaultRatio: 35 }
  ];

  const initialVisible = ['光線', '下銅', '砲金', '込真鍮', '被覆線（80%）', 'ネズミ線（VA・VVFなど）', '雑線（ハーネスや家電線など）'];
  const [visibleItems, setVisibleItems] = useState<string[]>(initialVisible);

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const currentBrassPrice = data?.market?.brass?.price || 980; 
  
  const getWireRatio = (keyword: string, fallback: number) => {
      const found = (data?.wires || []).find((w:any) => w.name.includes(keyword));
      return found ? Number(found.ratio) : fallback;
  };

  const myItems = useMemo(() => {
      return ALL_RADAR_ITEMS.map(item => {
          const ratio = getWireRatio(item.searchKey, item.defaultRatio);
          const basePrice = item.type === 'copper' ? currentCopperPrice : currentBrassPrice;

          const pureValue = Math.floor(basePrice * (ratio / 100));
          const myPrice = Math.floor(pureValue * (currentMarginRate / 100)); 
          const myMargin = Math.floor(pureValue - myPrice); 
          
          return { name: item.key, ratio, pureValue, myPrice, myMargin, type: item.type };
      });
  }, [data, currentCopperPrice, currentBrassPrice, currentMarginRate]);

  const processedCompetitors = useMemo(() => {
      const targets = data?.competitorTargets || [];
      const pricesLog = [...(data?.competitorPrices || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return targets.map((t: any) => {
          const tPrices = pricesLog.filter(p => p.name === t.name);
          
          let currentObj: any = {}; let prevObj: any = {};
          try { currentObj = tPrices[0] ? JSON.parse(tPrices[0].prices) : {}; } catch(e){}
          try { prevObj = tPrices[1] ? JSON.parse(tPrices[1].prices) : {}; } catch(e){}
          
          const currentPrices = currentObj.prices || currentObj;
          const currentEvidence = currentObj.evidence || {};
          const prevPrices = prevObj.prices || prevObj;

          const trends: any = {}; const history: any = {};
          
          Object.keys(currentPrices).forEach(k => {
              if (!prevPrices[k]) trends[k] = 'flat';
              else if (currentPrices[k] > prevPrices[k]) trends[k] = 'up';
              else if (currentPrices[k] < prevPrices[k]) trends[k] = 'down';
              else trends[k] = 'flat';

              const hist = tPrices.slice(0, 10).reverse().map(p => {
                  try { 
                      const pObj = JSON.parse(p.prices);
                      return (pObj.prices ? pObj.prices[k] : pObj[k]) || null;
                  } catch { return null; }
              }).filter(v => v !== null);
              
              if (hist.length < 2) {
                  const base = currentPrices[k] || 0;
                  history[k] = base > 0 ? [Math.floor(base*0.95), Math.floor(base*0.98), base] : [];
              } else {
                  history[k] = hist;
              }
          });
          return { ...t, prices: currentPrices, evidence: currentEvidence, trends, history };
      });
  }, [data]);

  const marketAnalysis = useMemo(() => {
      if (processedCompetitors.length === 0) return null;
      const vvfItem = myItems.find(i => i.name === 'ネズミ線（VA・VVFなど）');
      if (!vvfItem) return null;

      const vvfPrices = processedCompetitors.map(c => c.prices['ネズミ線（VA・VVFなど）']).filter(p => p > 0);
      const vvfMax = vvfPrices.length > 0 ? Math.max(...vvfPrices) : 0;
      const vvfAvg = vvfPrices.length > 0 ? Math.floor(vvfPrices.reduce((a,b)=>a+b,0)/vvfPrices.length) : 0;

      let vvfStatus = '';
      if (vvfItem.myPrice >= vvfMax && vvfMax > 0) vvfStatus = `当社のネズミ線買取価格は市場最高値圏にあります。`;
      else if (vvfItem.myPrice < vvfAvg && vvfAvg > 0) vvfStatus = `当社のネズミ線買取価格は市場平均（約¥${vvfAvg}）を下回っています。`;
      else if (vvfAvg > 0) vvfStatus = `当社のネズミ線買取価格は市場平均水準で推移しています。`;
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

  const handleSaveGlobalPrompt = async () => {
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'global_scrape_prompt', value: globalPrompt }) 
          });
          localStorage.removeItem('factoryOS_masterData'); 
          alert('全体共通ルール（プロンプト）を保存しました。次回のAI巡回から全企業に適用されます。');
          setIsProcessing(false);
      } catch(e) { alert("エラーが発生しました。"); setIsProcessing(false); }
  };

  const handleAddTarget = async () => {
      if (!newTarget.name || !newTarget.url) return alert('企業名とURLは必須です');
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADD_COMPETITOR_TARGET', data: newTarget }) });
          window.location.reload();
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
      if (processedCompetitors.length === 0) return;
      if (!confirm(`登録されているすべてのURLをAIが順番に巡回して価格と呼称を抽出・学習します。\n（1社につき数秒かかります）\n実行しますか？`)) return;
      
      setIsProcessing(true);
      let successCount = 0;
      
      for (let i = 0; i < processedCompetitors.length; i++) {
          const target = processedCompetitors[i];
          setScrapeProgress({ current: i + 1, total: processedCompetitors.length, targetName: target.name });
          try {
              const res = await fetch('/api/gas', { 
                  method: 'POST', headers: { 'Content-Type': 'application/json' }, 
                  body: JSON.stringify({ action: 'RUN_COMPETITOR_SCRAPE', targetId: target.id }) 
              });
              const json = await res.json();
              if (json.status === 'success') successCount++;
          } catch(e) { console.error(target.name + ' の取得エラー'); }
      }
      
      alert(`${successCount}社のデータを取得・学習しました！画面を更新します。`);
      setIsProcessing(false); setScrapeProgress({ current: 0, total: 0, targetName: '' });
      window.location.reload();
  };

  const toggleVisibleItem = (key: string) => {
      setVisibleItems(prev => prev.includes(key) ? prev.filter(i => i !== key) : [...prev, key]);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full font-sans">
      <header className="mb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-3 border-b border-gray-200 pb-3 shrink-0">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2 font-serif tracking-tight">
            <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
            相場レーダー
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-bold ml-3">自己学習型クローラー / AIマーケット分析</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto shadow-inner border border-gray-200">
            <button onClick={() => setActiveTab('RADAR')} className={`px-4 py-2 rounded-sm text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'RADAR' ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'}`}>
              <Icons.Radar /> 競合価格ヒートマップ
            </button>
            <button onClick={() => setActiveTab('TARGETS')} className={`px-4 py-2 rounded-sm text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'TARGETS' ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'}`}>
              <Icons.Globe /> ターゲット管理 & ルール設定
            </button>
        </div>
      </header>

      {activeTab === 'RADAR' && (
          // ★ 修正: スマホ表示時に表が潰れないよう、親の overflow-hidden を外し、縦スクロール可能（overflow-y-auto）にしました
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-10">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
                  <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 relative flex flex-col justify-between">
                      <div className="absolute top-0 right-0 bg-[#D32F2F] text-white text-[9px] font-bold px-3 py-1 rounded-bl-sm tracking-widest uppercase">利益コントロール</div>
                      <div>
                          <label className="font-bold text-gray-900 text-base flex items-center gap-1.5">
                              ベース買取掛率（％）
                          </label>
                          <p className="text-xs text-gray-500 mb-3">純粋な価値（建値×歩留まり）から何％でお客様から買い取るか</p>
                          <div className="flex items-center gap-4">
                              <input 
                                  type="range" min="60" max="95" step="1" 
                                  value={currentMarginRate} onChange={(e) => setCurrentMarginRate(Number(e.target.value))} 
                                  className="w-full accent-[#D32F2F] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                              />
                              <span className="text-4xl font-black text-gray-900 font-mono w-24 text-right tracking-tighter tabular-nums">{currentMarginRate}%</span>
                          </div>
                      </div>
                      
                      <div className="mt-5 flex justify-between items-end h-10">
                          <div className="text-xs text-gray-400 font-bold flex flex-col justify-end">
                              <span className="mb-0.5">◀ 利益重視 (60%)</span>
                              <span>▶ 薄利多売 (95%)</span>
                          </div>
                          {hasChanges && (
                              <button onClick={handleSaveMarginRate} disabled={isProcessing} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-sm text-sm font-bold shadow-md flex items-center gap-2 transition animate-pulse">
                                  {isProcessing ? <Icons.Refresh /> : <Icons.Save />} 保存して反映
                              </button>
                          )}
                      </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 flex flex-col justify-between">
                      <div>
                          <h3 className="text-sm font-black flex items-center gap-2 text-gray-900 mb-3 tracking-widest border-b border-gray-100 pb-2">
                              <span className="text-gray-900"><Icons.Brain /></span> AI マーケット全体分析
                          </h3>
                          {marketAnalysis ? (
                              <ul className="space-y-3 text-sm leading-relaxed text-gray-700 list-disc list-inside mt-2 font-bold">
                                  <li>{marketAnalysis.vvfStatus}</li>
                                  <li>{marketAnalysis.marginStatus}</li>
                              </ul>
                          ) : (
                              <div className="w-full text-center py-6 text-gray-400 text-sm font-bold border border-dashed border-gray-200 rounded-sm mt-2">
                                  監視ターゲットが登録されていません。
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* ★ 修正: min-h を持たせることで、スマホでも表領域が潰れずに表示されます */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex-1 flex flex-col min-h-[500px] overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col xl:flex-row justify-between xl:items-center shrink-0 gap-4 relative">
                      <div className="flex items-center gap-3">
                          <h3 className="font-bold text-gray-900 text-base">自社 vs 競合 価格差額ヒートマップ</h3>
                          <span className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded-sm font-bold shadow-sm">銅建値: ¥{currentCopperPrice} / 黄銅: ¥{currentBrassPrice}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap bg-white p-2 rounded-sm border border-gray-200 shadow-sm">
                          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 pl-1"><Icons.Filter /> 表示:</span>
                          <div className="flex flex-wrap gap-1.5 flex-1">
                            {ALL_RADAR_ITEMS.map(item => (
                                <label key={item.key} className={`flex items-center gap-1 text-[11px] font-bold cursor-pointer px-2 py-1 rounded-sm transition-colors border ${visibleItems.includes(item.key) ? 'bg-gray-900 text-white border-gray-900 shadow-inner' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}>
                                    <input type="checkbox" checked={visibleItems.includes(item.key)} onChange={() => toggleVisibleItem(item.key)} className="hidden" />
                                    {item.key}
                                </label>
                            ))}
                          </div>
                          <button onClick={handleRunScrape} disabled={isProcessing || processedCompetitors.length === 0} className="ml-2 bg-white border border-gray-300 hover:border-gray-900 hover:text-gray-900 text-gray-600 px-4 py-1.5 rounded-sm text-sm font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition active:scale-95 shrink-0">
                              {isProcessing ? <Icons.Refresh /> : <Icons.Sparkles />} 手動巡回
                          </button>
                      </div>

                      {isProcessing && scrapeProgress.total > 0 && (
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center gap-3 animate-in fade-in">
                              <span className="text-[#D32F2F]"><Icons.Refresh /></span>
                              <span className="font-bold text-sm text-gray-800">
                                  AI自動学習・巡回中 ({scrapeProgress.current}/{scrapeProgress.total}) : <span className="text-[#D32F2F]">{scrapeProgress.targetName}</span> を分析しています...
                              </span>
                          </div>
                      )}
                  </div>

                  <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse text-base whitespace-nowrap min-w-[800px]">
                          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-20">
                              <tr>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-100 border-r border-gray-200 sticky left-0 z-30 shadow-[1px_0_0_rgba(0,0,0,0.1)] w-56">標準品目 / 基準歩留</th>
                                  <th className="p-3 text-[10px] font-black text-white uppercase tracking-widest bg-gray-900 border-r border-gray-800 min-w-[140px]">
                                      月寒製作所 (自社)
                                  </th>
                                  {processedCompetitors.map(comp => (
                                      <th key={comp.id} className="p-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest min-w-[160px] bg-white border-r border-gray-200">
                                          {comp.name}<br/><span className="text-[9px] text-gray-400 font-normal">{comp.type}</span>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {myItems.filter(item => visibleItems.includes(item.name)).map(item => (
                                  <tr key={item.name} className="hover:bg-red-50/20 transition group">
                                      <td className="p-3 bg-white border-r border-gray-200 sticky left-0 z-10 shadow-[1px_0_0_rgba(0,0,0,0.1)] group-hover:bg-gray-50">
                                          <div className="font-bold text-gray-900 text-sm mb-1">{item.name}</div>
                                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                                              <span className="bg-gray-100 px-1.5 py-0.5 rounded-sm border border-gray-200 font-bold">歩留:{item.ratio}%</span> 
                                              <span>価値:¥{item.pureValue}</span>
                                          </div>
                                      </td>
                                      
                                      <td className="p-3 bg-gray-50 border-r border-gray-200 relative">
                                          <div className="font-mono font-black text-2xl text-gray-900 tracking-tighter">¥{item.myPrice.toLocaleString()}</div>
                                          <div className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                                              粗利: ¥{item.myMargin}
                                          </div>
                                      </td>

                                      {processedCompetitors.map(comp => {
                                          const compPrice = comp.prices[item.name];
                                          const compEvidence = comp.evidence[item.name];
                                          const trend = comp.trends[item.name];
                                          const historyData = comp.history[item.name] || [];
                                          
                                          return (
                                              <td key={comp.id} className="p-3 bg-white border-r border-gray-100 align-top group/cell hover:bg-gray-50">
                                                  <div className="flex flex-col h-full justify-between">
                                                      <div>
                                                          <div className="flex items-center justify-between mb-1">
                                                              <div className="flex items-center gap-1.5">
                                                                  <span className={`font-mono text-xl font-bold tabular-nums ${compPrice ? 'text-gray-800' : 'text-gray-300'}`}>
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
                                                      
                                                      {compEvidence && (
                                                          <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                                                              <p className="text-[9px] text-gray-500 leading-tight flex items-start gap-1">
                                                                  <span className="text-gray-400 mt-0.5"><Icons.Info /></span>
                                                                  <span>AI抽出元: 「{compEvidence}」</span>
                                                              </p>
                                                          </div>
                                                      )}
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

      {activeTab === 'TARGETS' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-4 md:p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  
                  {/* ★ AI全体プロンプト（グローバルルール）設定エリア */}
                  <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-bl-sm tracking-widest uppercase">GLOBAL AI PROMPT</div>
                      <h4 className="font-bold text-base text-gray-900 mb-2 flex items-center gap-2"><Icons.Brain /> AI共通ルール設定（ボスからの特別指示）</h4>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed font-bold">
                          すべてのターゲット企業を巡回する際、AIが<span className="text-[#D32F2F]">最優先で守るべき絶対ルール</span>を設定できます。<br/>
                          （例: 「価格は税込で計算して」「建値ベースという表記があれば1450を足して」など）
                      </p>
                      <textarea 
                          className="w-full p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white min-h-[80px] shadow-inner" 
                          placeholder="例: 価格は必ず税込で取得すること。"
                          value={globalPrompt} 
                          onChange={(e) => setGlobalPrompt(e.target.value)}
                      />
                      <div className="flex justify-end mt-3">
                          <button 
                              onClick={handleSaveGlobalPrompt} 
                              disabled={isProcessing || globalPrompt === savedGlobalPrompt} 
                              className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-sm text-sm font-bold shadow-sm transition disabled:opacity-50"
                          >
                              {isProcessing ? '保存中...' : 'ルールを保存'}
                          </button>
                      </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-5 rounded-sm shadow-sm mt-8">
                      <h4 className="font-bold text-base mb-4 flex items-center gap-2"><Icons.Plus /> 個別ターゲットの追加</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <input type="text" placeholder="企業名 (例: 札幌 A社)" className="w-full p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white shadow-sm" value={newTarget.name} onChange={e => setNewTarget({...newTarget, name: e.target.value})} />
                          <select className="w-full p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white shadow-sm font-bold text-gray-700" value={newTarget.type} onChange={e => setNewTarget({...newTarget, type: e.target.value})}>
                              <option value="同業(競合)">同業(競合)</option>
                              <option value="メーカー直系">メーカー直系</option>
                              <option value="輸出ヤード">輸出ヤード</option>
                          </select>
                          <input type="url" placeholder="トップページのURL" className="w-full p-3 border border-gray-300 rounded-sm text-sm outline-none font-mono focus:border-gray-900 bg-white shadow-sm" value={newTarget.url} onChange={e => setNewTarget({...newTarget, url: e.target.value})} />
                      </div>
                      <div className="flex flex-col md:flex-row gap-3">
                          <input type="text" placeholder="AIへの初回ヒント (例: FケーブルはVVF。以後はAIが自己更新します)" className="w-full p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white flex-1 shadow-sm" value={newTarget.hint} onChange={e => setNewTarget({...newTarget, hint: e.target.value})} />
                          <button onClick={handleAddTarget} disabled={isProcessing || !newTarget.name || !newTarget.url} className="bg-[#D32F2F] hover:bg-red-800 text-white px-8 py-3 rounded-sm text-sm font-bold shadow-md transition disabled:opacity-50 whitespace-nowrap">
                              {isProcessing ? '処理中...' : '登録する'}
                          </button>
                      </div>
                  </div>

                  <div className="space-y-3 mt-8">
                      <h4 className="font-bold text-xs text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2">登録済みターゲット（AI自己学習状況）</h4>
                      {processedCompetitors.map(target => (
                          <div key={target.id} className="border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row gap-4 bg-white shadow-sm hover:border-gray-400 transition-colors group">
                              <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-gray-900 text-base">{target.name}</h4>
                                      <span className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded-sm text-gray-600 font-bold border border-gray-200">{target.type}</span>
                                  </div>
                                  <a href={target.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 font-mono mb-3 hover:text-gray-900 hover:underline truncate block max-w-[300px] md:max-w-md">{target.url}</a>
                                  
                                  <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-sm shadow-inner">
                                      <p className="text-[9px] font-bold text-gray-500 mb-1 flex items-center gap-1 uppercase tracking-widest"><Icons.Sparkles /> AIが生成した抽出ルール (次回以降適用)</p>
                                      <p className="text-[11px] text-gray-800 font-bold leading-relaxed">{target.hint || 'まだルールは生成されていません。巡回を実行してください。'}</p>
                                  </div>
                              </div>
                              <div className="flex items-center justify-end gap-6 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6 min-w-[150px]">
                                  <div className="text-right">
                                      <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase">最終AIクロール</p>
                                      <p className="text-xs font-mono font-bold text-gray-900 mt-1">
                                          {target.lastCrawled || '未実行'} 
                                      </p>
                                      <p className="mt-1">
                                          {target.status && target.status.includes('成功') && <span className="text-[9px] text-green-700 font-bold bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-sm">● {target.status}</span>}
                                          {target.status && !target.status.includes('成功') && target.status !== '未実行' && <span className="text-[9px] text-[#D32F2F] font-bold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-sm">❌ {target.status}</span>}
                                      </p>
                                  </div>
                                  <button onClick={() => handleDeleteTarget(target.id)} disabled={isProcessing} className="text-gray-400 hover:text-[#D32F2F] p-2 hover:bg-red-50 rounded-sm transition opacity-50 group-hover:opacity-100"><Icons.Trash /></button>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
