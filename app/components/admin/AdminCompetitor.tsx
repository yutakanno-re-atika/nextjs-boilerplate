// app/components/admin/AdminCompetitor.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Radar: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  TrendingUp: () => <svg className="w-3 h-3 inline-block text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-3 h-3 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-3 h-3 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Globe: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Book: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  LightBulb: () => <svg className="w-5 h-5 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
};

// スパークライン（ミニグラフ）コンポーネント
const Sparkline = ({ data, trend }: { data: number[], trend: string }) => {
  if (!data || data.length < 2) return <div className="w-16 h-6"></div>;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = trend === 'up' ? '#DC2626' : trend === 'down' ? '#2563EB' : '#9CA3AF'; 

  return (
    <svg viewBox={`0 -2 ${width} ${height + 4}`} className="w-16 h-5 overflow-visible mt-1 opacity-80" title={`最近の推移: ${data.join(' → ')}`}>
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

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  
  const getWireRatio = (keyword: string, fallback: number) => {
      const found = (data?.wires || []).find((w:any) => w.name.includes(keyword));
      return found ? Number(found.ratio) : fallback;
  };

  const myItems = useMemo(() => {
      return [
          { key: 'ピカ', name: 'ピカ銅 (特1号)', ratio: getWireRatio('ピカ', 98) },
          { key: '込銅', name: '込銅 (2号銅)', ratio: getWireRatio('込銅', 93) },
          { key: 'VVF', name: 'VVF (ネズミ線)', ratio: getWireRatio('VVF', 42) },
          { key: 'CV', name: 'CV線 (太線)', ratio: getWireRatio('CV', 65) },
      ].map(item => {
          const pureValue = Math.floor(currentCopperPrice * (item.ratio / 100));
          const myPrice = Math.floor(pureValue * (currentMarginRate / 100)); 
          const myMargin = Math.floor(pureValue - myPrice); 
          return { ...item, pureValue, myPrice, myMargin };
      });
  }, [data, currentCopperPrice, currentMarginRate]);

  const processedCompetitors = useMemo(() => {
      const targets = data?.competitorTargets || [];
      const pricesLog = [...(data?.competitorPrices || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return targets.map((t: any) => {
          const tPrices = pricesLog.filter(p => p.name === t.name);
          let current = {}; let prev = {};
          try { current = tPrices[0] ? JSON.parse(tPrices[0].prices) : {}; } catch(e){}
          try { prev = tPrices[1] ? JSON.parse(tPrices[1].prices) : {}; } catch(e){}
          
          const trends: any = {};
          const history: any = {};
          
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

  // ★ 市場全体を俯瞰するAI分析ロジック
  const marketAnalysis = useMemo(() => {
      if (processedCompetitors.length === 0) return null;

      const vvfItem = myItems.find(i => i.name === 'VVF (ネズミ線)');
      if (!vvfItem) return null;

      const vvfPrices = processedCompetitors.map(c => c.prices['VVF (ネズミ線)']).filter(p => p > 0);

      const vvfMax = vvfPrices.length > 0 ? Math.max(...vvfPrices) : 0;
      const vvfAvg = vvfPrices.length > 0 ? Math.floor(vvfPrices.reduce((a,b)=>a+b,0)/vvfPrices.length) : 0;

      let vvfStatus = '';
      if (vvfItem.myPrice >= vvfMax && vvfMax > 0) {
          vvfStatus = `当社のVVF買取価格（¥${vvfItem.myPrice}）は、現在取得できている市場の中でトップクラスの高値をキープしています。`;
      } else if (vvfItem.myPrice < vvfAvg && vvfAvg > 0) {
          vvfStatus = `当社のVVF買取価格（¥${vvfItem.myPrice}）は市場平均（約¥${vvfAvg}）を下回っています。集荷量を重視する場合、ベース掛率の引き上げを検討してください。`;
      } else if (vvfAvg > 0) {
          vvfStatus = `当社のVVF買取価格は市場平均（約¥${vvfAvg}）と同等水準で推移しており、適正なバランスを保っています。`;
      } else {
          vvfStatus = `市場データが十分に取得できていません。`;
      }

      let marginStatus = '';
      const avgMargin = Math.floor(vvfItem.pureValue - vvfAvg);
      if (avgMargin < 50 && vvfAvg > 0) {
          marginStatus = `市場全体で利益幅を極限まで削った集客競争が起きています（他社平均推定マージン: 約¥${avgMargin}/kg）。無理な価格追従は避け、利益率の高い別商材に注力する戦略も有効です。`;
      } else if (avgMargin > 100 && vvfAvg > 0) {
          marginStatus = `市場全体が利益を多めに確保している傾向があります。当社が少し掛率を上げるだけで、容易に他社から顧客を奪えるチャンスです。`;
      } else if (vvfAvg > 0) {
          marginStatus = `市場全体のマージン設定は安定しています。現在のベース掛率（${currentMarginRate}%）で十分に戦える市況です。`;
      } else {
          marginStatus = `マージンを推測するためのデータが不足しています。`;
      }

      return { vvfStatus, marginStatus };
  }, [processedCompetitors, myItems, currentMarginRate]);

  const getDiffLabel = (my: number, comp: number) => {
      if (!comp) return <span className="text-gray-300 font-bold">-</span>;
      const diff = my - comp;
      if (diff > 0) return <span className="text-blue-600 font-bold">+{diff} (勝)</span>;
      if (diff < 0) return <span className="text-red-600 font-bold">{diff} (負)</span>;
      return <span className="text-gray-400 font-bold">同額</span>;
  };

  const handleSaveMarginRate = async () => {
      setIsProcessing(true);
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'target_margin_rate', value: currentMarginRate })
          });
          localStorage.removeItem('factoryOS_masterData'); 
          alert(`ベース掛率を【${currentMarginRate}%】で保存し、LP等に反映しました！`);
          window.location.reload(); 
      } catch(e) {
          alert("設定の保存に失敗しました。");
          setIsProcessing(false);
      }
  };

  const handleAddTarget = async () => {
      if (!newTarget.name || !newTarget.url) return alert('企業名とURLは必須です');
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADD_COMPETITOR_TARGET', data: newTarget }) });
          setNewTarget({ name: '', type: '同業(競合)', url: '', hint: '' });
          alert('監視ターゲットを追加しました！画面を更新します。');
          window.location.reload();
      } catch(e) { alert('エラーが発生しました'); setIsProcessing(false); }
  };

  const handleDeleteTarget = async (id: string) => {
      if (!confirm('この監視ターゲットを削除しますか？')) return;
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_COMPETITOR_TARGET', id }) });
          window.location.reload();
      } catch(e) { alert('エラーが発生しました'); setIsProcessing(false); }
  };

  const handleRunScrape = async () => {
      if (!confirm('登録されているすべてのURLをAIが巡回して価格を抽出します。\n※数分かかる場合がありますが実行しますか？')) return;
      setIsProcessing(true);
      try {
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'RUN_COMPETITOR_SCRAPE' }) });
          const json = await res.json();
          if (json.status === 'success') { alert(json.message); window.location.reload(); }
          else { alert('エラー: ' + json.message); setIsProcessing(false); }
      } catch(e) { alert('通信エラー'); setIsProcessing(false); }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
            <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
            COMPETITOR RADAR
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">競合相場スクレイピング / AIマーケット分析</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-md overflow-x-auto shadow-inner">
            <button onClick={() => setActiveTab('RADAR')} className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'RADAR' ? 'bg-white text-blue-700 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Radar /> 比較ヒートマップ
            </button>
            <button onClick={() => setActiveTab('TARGETS')} className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'TARGETS' ? 'bg-white text-blue-700 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Globe /> 監視サイト登録
            </button>
            <button onClick={() => setActiveTab('DICTIONARY')} className={`px-4 py-2 rounded text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'DICTIONARY' ? 'bg-white text-blue-700 shadow border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Book /> 呼称・シノニム辞書
            </button>
        </div>
      </header>

      {activeTab === 'RADAR' && (
          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              
              {/* コントロールパネル */}
              <div className="bg-white border border-blue-200 rounded-lg shadow-sm p-5 shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-lg tracking-widest">PRICING CONTROL</div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                          <label className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                              ベース買取掛率（％）
                              <span className="text-xs text-gray-500 font-normal">純粋な銅価値から、何％でお客様から買い取るか</span>
                          </label>
                          <div className="flex items-center gap-4 mt-3">
                              <input 
                                  type="range" 
                                  min="60" max="95" step="1" 
                                  value={currentMarginRate} 
                                  onChange={(e) => setCurrentMarginRate(Number(e.target.value))} 
                                  className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                              />
                              <span className="text-4xl font-black text-blue-600 font-mono w-24 text-right tracking-tighter">{currentMarginRate}%</span>
                          </div>
                          <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold tracking-widest">
                              <span>利益重視 (60%)</span>
                              <span>買取強化・薄利多売 (95%)</span>
                          </div>
                      </div>

                      {currentMarginRate !== savedMarginRate && (
                          <div className="shrink-0 animate-in zoom-in duration-300">
                              <button 
                                  onClick={handleSaveMarginRate} 
                                  disabled={isProcessing}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-bold shadow-md flex items-center justify-center gap-2 transition text-base w-full md:w-auto hover:shadow-lg active:scale-95"
                              >
                                  {isProcessing ? <Icons.Refresh /> : <Icons.Save />}
                                  設定を保存してLPに反映
                              </button>
                          </div>
                      )}
                  </div>
              </div>

              {/* AI マーケット分析 */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 shrink-0">
                  <h3 className="text-sm font-black flex items-center gap-2 text-gray-900 mb-4 tracking-widest border-b border-gray-100 pb-2">
                      <span className="text-blue-600"><Icons.Brain /></span> AI マーケット分析
                  </h3>
                  {marketAnalysis ? (
                      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                          <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                              <Icons.LightBulb /> 市場全体のトレンド vs 当社の現在地
                          </p>
                          <ul className="space-y-3 text-xs leading-relaxed text-gray-700 list-disc list-inside ml-1">
                              <li>{marketAnalysis.vvfStatus}</li>
                              <li>{marketAnalysis.marginStatus}</li>
                          </ul>
                      </div>
                  ) : (
                      <div className="w-full text-center py-6 text-gray-400 text-sm font-bold border-2 border-dashed border-gray-200 rounded-lg">
                          監視ターゲットが登録されていません。<br/><span className="text-xs font-normal">「監視サイト登録」タブから、競合他社のURLを追加してください。</span>
                      </div>
                  )}
              </div>

              {/* 比較ヒートマップ */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-gray-900 text-sm">自社 vs 競合 リアルタイム価格差額シミュレーション</h3>
                      <div className="flex items-center gap-4">
                          <button onClick={handleRunScrape} disabled={isProcessing || processedCompetitors.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition active:scale-95">
                              {isProcessing ? <Icons.Refresh /> : <Icons.Sparkles />} AI手動巡回
                          </button>
                      </div>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-20">
                              <tr>
                                  <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-widest w-64 bg-gray-100">品目 (マスター歩留まり)</th>
                                  <th className="p-4 text-xs font-black text-gray-900 uppercase tracking-widest bg-blue-50 border-x border-blue-200 min-w-[200px] shadow-[inset_0_-2px_0_rgba(59,130,246,0.5)]">
                                      月寒製作所 (シミュレーション)<br/>
                                      <span className="text-[9px] text-blue-600 font-normal">ベース建値: ¥{currentCopperPrice}</span>
                                  </th>
                                  {processedCompetitors.map(comp => (
                                      <th key={comp.id} className="p-4 text-xs font-bold text-gray-600 uppercase tracking-widest min-w-[180px] bg-gray-50">
                                          {comp.name}<br/><span className="text-[9px] text-gray-400 font-normal">{comp.type}</span>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {myItems.map(item => (
                                  <tr key={item.name} className="hover:bg-gray-50 transition group">
                                      <td className="p-4 bg-white">
                                          <div className="font-bold text-gray-900 text-sm mb-1">{item.name}</div>
                                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                                              <span className="bg-gray-100 px-1.5 py-0.5 rounded">歩留: {item.ratio}%</span> 
                                              <span>純銅価値: ¥{item.pureValue}</span>
                                          </div>
                                      </td>
                                      
                                      <td className="p-4 bg-blue-50/20 border-x border-blue-100 relative group-hover:bg-blue-50/40 transition-colors">
                                          <div className="font-mono font-black text-2xl text-blue-700 tracking-tighter">¥{item.myPrice.toLocaleString()}</div>
                                          <div className="text-[10px] font-bold text-blue-600 mt-1 inline-block bg-blue-100 px-1.5 py-0.5 rounded">
                                              粗利: ¥{item.myMargin} / kg
                                          </div>
                                      </td>

                                      {processedCompetitors.map(comp => {
                                          const compPrice = comp.prices[item.name];
                                          const trend = comp.trends[item.name];
                                          const historyData = comp.history[item.name] || [];
                                          
                                          return (
                                              <td key={comp.id} className="p-4 bg-white">
                                                  <div className="flex flex-col">
                                                      <div className="flex items-center justify-between mb-1">
                                                          <div className="flex items-center gap-1.5">
                                                              <span className={`font-mono text-lg font-bold ${compPrice ? 'text-gray-800' : 'text-gray-300'}`}>
                                                                  {compPrice ? `¥${compPrice.toLocaleString()}` : '---'}
                                                              </span>
                                                              {compPrice && trend === 'up' ? <Icons.TrendingUp /> : compPrice && trend === 'down' ? <Icons.TrendingDown /> : null}
                                                          </div>
                                                      </div>
                                                      <div className="flex items-center justify-between">
                                                          <div className="text-xs bg-gray-50 inline-block px-2 py-0.5 rounded border border-gray-200">
                                                              {getDiffLabel(item.myPrice, compPrice)}
                                                          </div>
                                                          <Sparkline data={historyData} trend={trend} />
                                                      </div>
                                                  </div>
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'TARGETS' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <div>
                          <h3 className="text-lg font-black text-gray-900">AI監視ターゲット設定</h3>
                          <p className="text-xs text-gray-500 mt-1">ここで設定したURLに夜間AIが自動巡回し、価格情報を抽出します。</p>
                      </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 p-5 rounded-lg shadow-sm">
                      <h4 className="font-bold text-sm mb-4 flex items-center gap-2"><Icons.Plus /> 新規ターゲットの追加</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">企業名</label>
                              <input type="text" placeholder="例: 札幌 A社" className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 bg-white" value={newTarget.name} onChange={e => setNewTarget({...newTarget, name: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">業態種別</label>
                              <select className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 bg-white" value={newTarget.type} onChange={e => setNewTarget({...newTarget, type: e.target.value})}>
                                  <option value="同業(競合)">同業(競合)</option>
                                  <option value="メーカー直系">メーカー直系</option>
                                  <option value="輸出ヤード">輸出ヤード</option>
                              </select>
                          </div>
                      </div>
                      <div className="mb-4">
                          <label className="block text-xs font-bold text-gray-500 mb-1">WebサイトURL (トップページでOK)</label>
                          <input type="url" placeholder="https://..." className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none font-mono focus:border-blue-500 bg-white" value={newTarget.url} onChange={e => setNewTarget({...newTarget, url: e.target.value})} />
                      </div>
                      <div className="mb-5">
                          <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">AIへのヒント・特殊ルール <Icons.Brain /></label>
                          <input type="text" placeholder="例: 価格は税抜表記。FケーブルはVVFとして扱う等" className="w-full p-2.5 border border-gray-300 rounded text-sm outline-none focus:border-blue-500 bg-white" value={newTarget.hint} onChange={e => setNewTarget({...newTarget, hint: e.target.value})} />
                      </div>
                      <div className="flex justify-end">
                          <button onClick={handleAddTarget} disabled={isProcessing || !newTarget.name || !newTarget.url} className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded text-sm font-bold shadow-md transition disabled:opacity-50">
                              {isProcessing ? '処理中...' : 'ターゲットを登録'}
                          </button>
                      </div>
                  </div>

                  <div className="space-y-3 mt-8">
                      <h4 className="font-bold text-sm text-gray-700">登録済みターゲット一覧</h4>
                      {processedCompetitors.map(target => (
                          <div key={target.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 bg-white shadow-sm hover:border-blue-300 transition-colors group">
                              <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-base">{target.name} <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-normal ml-2 border border-gray-200">{target.type}</span></h4>
                                  <a href={target.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-mono mt-1.5 hover:underline truncate block max-w-[300px] md:max-w-md">{target.url}</a>
                                  {target.hint && <p className="text-[10px] text-gray-500 mt-1.5 bg-gray-50 p-1.5 rounded inline-block border border-gray-100">💡 ヒント: {target.hint}</p>}
                              </div>
                              <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                                  <div className="text-right">
                                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">最終AIクロール</p>
                                      <p className="text-xs font-mono text-gray-900 mt-0.5">
                                          {target.lastCrawled || '未実行'} 
                                          {target.status === '成功' && <span className="text-green-600 font-bold ml-1 bg-green-50 px-1.5 py-0.5 rounded">● 成功</span>}
                                          {target.status && target.status !== '成功' && <span className="text-red-600 font-bold ml-1 bg-red-50 px-1.5 py-0.5 rounded">❌ {target.status}</span>}
                                      </p>
                                  </div>
                                  <button onClick={() => handleDeleteTarget(target.id)} disabled={isProcessing} className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded transition opacity-50 group-hover:opacity-100"><Icons.Trash /></button>
                              </div>
                          </div>
                      ))}
                      {processedCompetitors.length === 0 && <p className="text-center text-gray-400 text-sm py-8 border-2 border-dashed border-gray-200 rounded-lg">ターゲットが登録されていません</p>}
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
                          <p className="text-xs text-gray-500 mt-1">AIが他社サイトを巡回する際、「この単語は当社のこの品目のことだ」と翻訳するための辞書です。このデータ自体がSEOや営業の強力な資産になります。</p>
                      </div>
                  </div>
                  <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-50 p-3.5 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> ピカ銅 (当社のマスター名)</h4>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2.5 bg-white">
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">1号銅線</span>
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">光線</span>
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">特号銅</span>
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">ピカ線</span>
                              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"><Icons.Sparkles /> 光銅 (AIが自動学習)</span>
                          </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-50 p-3.5 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-600"></span> VVFケーブル (当社のマスター名)</h4>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2.5 bg-white">
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">VA線</span>
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">Fケーブル</span>
                              <span className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold">ネズミ線</span>
                              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"><Icons.Sparkles /> 雑線VVF (AIが自動学習)</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
