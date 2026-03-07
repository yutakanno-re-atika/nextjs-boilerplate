// app/components/admin/AdminCompetitor.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Radar: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Sparkles: () => <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  TrendingUp: () => <svg className="w-4 h-4 inline-block text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-4 h-4 inline-block text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Globe: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Book: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'TARGETS' | 'DICTIONARY'>('RADAR');
  const [isProcessing, setIsProcessing] = useState(false);

  // ターゲット追加用のステート
  const [newTarget, setNewTarget] = useState({ name: '', type: 'メーカー直系', url: '', hint: '' });

  // 本物の銅建値
  const currentCopperPrice = data?.market?.copper?.price || 1450;
  
  // 自社歩留まり
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
      ].map(item => ({ ...item, myPrice: Math.floor(currentCopperPrice * (item.ratio / 100) * 0.85) }));
  }, [data, currentCopperPrice]);

  // ★ AIが引いてきた「本物の」競合価格データを処理
  const processedCompetitors = useMemo(() => {
      const targets = data?.competitorTargets || [];
      const pricesLog = [...(data?.competitorPrices || [])].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      return targets.map((t: any) => {
          const tPrices = pricesLog.filter(p => p.name === t.name);
          let current = {}; let prev = {};
          try { current = tPrices[0] ? JSON.parse(tPrices[0].prices) : {}; } catch(e){}
          try { prev = tPrices[1] ? JSON.parse(tPrices[1].prices) : {}; } catch(e){}
          
          const trends: any = {};
          Object.keys(current).forEach(k => {
              if (!prev[k]) trends[k] = 'flat';
              else if (current[k] > prev[k]) trends[k] = 'up';
              else if (current[k] < prev[k]) trends[k] = 'down';
              else trends[k] = 'flat';
          });

          return { ...t, prices: current, trends };
      });
  }, [data]);

  // AI逆算エンジン
  const analyzeCompetitor = (comp: any, itemName: string) => {
      const compPrice = comp.prices[itemName];
      if (!compPrice) return null;

      const myItem = myItems.find(i => i.name === itemName);
      if (!myItem) return null;

      const pureCopperValue = currentCopperPrice * (myItem.ratio / 100);
      const estimatedMargin = Math.floor(pureCopperValue - compPrice);

      let strategyAlert = '';
      if (estimatedMargin < 40) strategyAlert = `利益を極限まで削った「赤字覚悟の集客モード」です。当社は追従せず別商材を集めるべきです。`;
      else if (estimatedMargin > 150) strategyAlert = `かなり強気に利益を抜いています。当社が少し値上げすれば容易に顧客を奪えます。`;
      else strategyAlert = `標準的なマージン設定です。`;

      return { compName: comp.name, itemName, compPrice, pureCopperValue: Math.floor(pureCopperValue), estimatedMargin, strategyAlert, ratio: myItem.ratio };
  };

  const getDiffLabel = (my: number, comp: number) => {
      if (!comp) return <span className="text-gray-300 font-bold">-</span>;
      const diff = my - comp;
      if (diff > 0) return <span className="text-blue-600 font-bold">+{diff} (勝)</span>;
      if (diff < 0) return <span className="text-red-600 font-bold">{diff} (負)</span>;
      return <span className="text-gray-400 font-bold">同額</span>;
  };

  const handleAddTarget = async () => {
      if (!newTarget.name || !newTarget.url) return alert('企業名とURLは必須です');
      setIsProcessing(true);
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'ADD_COMPETITOR_TARGET', data: newTarget }) });
          setNewTarget({ name: '', type: 'メーカー直系', url: '', hint: '' });
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
      if (!confirm('登録されているすべてのURLをAIが巡回して価格を抽出します。数分かかる場合がありますが実行しますか？')) return;
      setIsProcessing(true);
      try {
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'RUN_COMPETITOR_SCRAPE' }) });
          const json = await res.json();
          if (json.status === 'success') { alert(json.message); window.location.reload(); }
          else { alert('エラー: ' + json.message); setIsProcessing(false); }
      } catch(e) { alert('通信エラー'); setIsProcessing(false); }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight flex items-center gap-2">
            <Icons.Radar /> COMPETITOR RADAR
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">競合相場スクレイピング / AI戦略逆算エンジン</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto">
            <button onClick={() => setActiveTab('RADAR')} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'RADAR' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              📊 比較ヒートマップ
            </button>
            <button onClick={() => setActiveTab('TARGETS')} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'TARGETS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Globe /> 監視サイト登録
            </button>
            <button onClick={() => setActiveTab('DICTIONARY')} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'DICTIONARY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Book /> 呼称・シノニム辞書
            </button>
        </div>
      </header>

      {activeTab === 'RADAR' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              
              <div className="bg-gray-900 text-white rounded-sm p-5 shadow-lg shrink-0 relative overflow-hidden border border-gray-700">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 text-blue-500"><Icons.Brain /></div>
                  <h3 className="text-sm font-black flex items-center gap-2 text-blue-400 mb-3 tracking-widest">
                      <Icons.Sparkles /> リアルタイム逆算インサイト (稼働中)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      
                      {/* VVFの逆算をピックアップ表示 */}
                      {processedCompetitors.map(comp => {
                          const analysis = analyzeCompetitor(comp, 'VVF (ネズミ線)');
                          if (!analysis) return null;
                          return (
                              <div key={comp.id} className="bg-black/50 p-4 rounded border border-gray-800">
                                  <p className="text-xs text-gray-400 font-bold mb-2">💡 {analysis.compName}のVVF（{analysis.compPrice}円）に対する逆算</p>
                                  <p className="text-sm leading-relaxed text-gray-200">
                                      現在の銅建値 <span className="text-blue-300 font-mono">¥{currentCopperPrice}</span> と当社のVVF歩留まり（<span className="font-mono">{analysis.ratio}%</span>）を基準にすると、VVF 1kgに含まれる純粋な銅価値は <span className="text-blue-300 font-mono">¥{analysis.pureCopperValue}</span> です。<br/>
                                      <br/>
                                      相手はそこから逆算して、加工賃・利益を「<span className={`font-bold font-mono ${analysis.estimatedMargin < 50 ? 'text-red-400' : 'text-green-400'}`}>推定 ¥{analysis.estimatedMargin} / kg</span>」しか抜いていません。<br/>
                                      <span className="text-yellow-400 mt-2 block">【AIの結論】 {analysis.strategyAlert}</span>
                                  </p>
                              </div>
                          );
                      })}
                      {processedCompetitors.length === 0 && (
                          <p className="text-gray-500 text-sm">監視ターゲットが登録されていません。「監視サイト登録」から競合URLを追加してください。</p>
                      )}
                  </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-gray-900 text-sm">自社 vs 競合 リアルタイム価格差額</h3>
                      <div className="flex items-center gap-4">
                          <button onClick={handleRunScrape} disabled={isProcessing || processedCompetitors.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 shadow-sm disabled:opacity-50">
                              {isProcessing ? <Icons.Refresh /> : <Icons.Sparkles />} AI手動巡回
                          </button>
                      </div>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                              <tr>
                                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/4">品目 (マスター歩留まり)</th>
                                  <th className="p-3 text-xs font-black text-gray-900 uppercase tracking-widest bg-blue-50 border-x border-blue-200 w-1/5">
                                      月寒製作所 (自社)
                                  </th>
                                  {processedCompetitors.map(comp => (
                                      <th key={comp.id} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/5">
                                          {comp.name}<br/><span className="text-[9px] text-gray-400 font-normal">{comp.type}</span>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {myItems.map(item => (
                                  <tr key={item.name} className="hover:bg-gray-50 transition">
                                      <td className="p-3">
                                          <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">歩留: {item.ratio}% / 銅価値: ¥{Math.floor(currentCopperPrice * (item.ratio/100))}</div>
                                      </td>
                                      <td className="p-3 bg-blue-50/30 border-x border-blue-100 font-mono font-black text-lg text-gray-900">
                                          ¥{item.myPrice.toLocaleString()}
                                      </td>
                                      {processedCompetitors.map(comp => {
                                          const compPrice = comp.prices[item.name];
                                          const trend = comp.trends[item.name];
                                          return (
                                              <td key={comp.id} className="p-3">
                                                  <div className="flex flex-col">
                                                      <div className="flex items-center gap-2">
                                                          <span className="font-mono text-base text-gray-700">{compPrice ? `¥${compPrice.toLocaleString()}` : '---'}</span>
                                                          {compPrice && trend === 'up' ? <Icons.TrendingUp /> : compPrice && trend === 'down' ? <Icons.TrendingDown /> : <Icons.Minus />}
                                                      </div>
                                                      <div className="text-xs mt-1 bg-white inline-block w-max px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">
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
                      {processedCompetitors.length === 0 && (
                          <div className="p-10 text-center text-gray-400 font-bold text-sm">
                              「監視サイト登録」タブから、競合他社のURLを追加してください。
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'TARGETS' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <div>
                          <h3 className="text-lg font-black text-gray-900">AI監視ターゲット設定</h3>
                          <p className="text-xs text-gray-500 mt-1">ここで設定したURLを夜間にAIスナイパーが自動巡回し、価格を引っこ抜きます。</p>
                      </div>
                  </div>

                  {/* 登録フォーム */}
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-md shadow-sm">
                      <h4 className="font-bold text-sm mb-3">＋ 新規ターゲットの追加</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div><input type="text" placeholder="企業名 (例: 札幌 A社)" className="w-full p-2 border rounded text-sm outline-none" value={newTarget.name} onChange={e => setNewTarget({...newTarget, name: e.target.value})} /></div>
                          <div><select className="w-full p-2 border rounded text-sm outline-none" value={newTarget.type} onChange={e => setNewTarget({...newTarget, type: e.target.value})}><option value="メーカー直系">メーカー直系</option><option value="輸出ヤード">輸出ヤード</option><option value="同業(競合)">同業(競合)</option></select></div>
                      </div>
                      <div className="mb-3">
                          <input type="url" placeholder="買取価格が載っているページのURL (https://...)" className="w-full p-2 border rounded text-sm outline-none font-mono" value={newTarget.url} onChange={e => setNewTarget({...newTarget, url: e.target.value})} />
                      </div>
                      <div className="mb-3">
                          <input type="text" placeholder="AIへのヒント (例: FケーブルはVVFのこと。価格は税抜で表示されている等)" className="w-full p-2 border rounded text-sm outline-none" value={newTarget.hint} onChange={e => setNewTarget({...newTarget, hint: e.target.value})} />
                      </div>
                      <button onClick={handleAddTarget} disabled={isProcessing || !newTarget.name || !newTarget.url} className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded text-sm font-bold shadow-sm transition disabled:opacity-50">
                          {isProcessing ? '処理中...' : 'ターゲットを登録'}
                      </button>
                  </div>

                  <div className="space-y-3">
                      {processedCompetitors.map(target => (
                          <div key={target.id} className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row md:items-center gap-4 bg-white shadow-sm hover:border-blue-300 transition">
                              <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-base">{target.name} <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-normal ml-2">{target.type}</span></h4>
                                  <a href={target.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 font-mono mt-1 hover:underline truncate block max-w-[300px] md:max-w-md">{target.url}</a>
                                  {target.hint && <p className="text-[10px] text-gray-400 mt-1">ヒント: {target.hint}</p>}
                              </div>
                              <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                                  <div className="text-right">
                                      <p className="text-[10px] text-gray-500 font-bold">最終AIクロール</p>
                                      <p className="text-xs font-mono text-gray-900 mt-0.5">
                                          {target.lastCrawled || '未実行'} 
                                          {target.status === '成功' && <span className="text-green-500 ml-1">● 成功</span>}
                                          {target.status && target.status !== '成功' && <span className="text-red-500 ml-1">❌ {target.status}</span>}
                                      </p>
                                  </div>
                                  <button onClick={() => handleDeleteTarget(target.id)} disabled={isProcessing} className="text-gray-300 hover:text-red-600 p-2 bg-gray-50 hover:bg-red-50 rounded shadow-sm border border-gray-200 transition"><Icons.Trash /></button>
                              </div>
                          </div>
                      ))}
                      {processedCompetitors.length === 0 && <p className="text-center text-gray-400 text-sm py-4">ターゲットが登録されていません</p>}
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'DICTIONARY' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <div>
                          <h3 className="text-lg font-black text-gray-900">名称ゆらぎ・シノニム辞書</h3>
                          <p className="text-xs text-gray-500 mt-1">AIが他社サイトを巡回する際、「この単語は当社のこの品目のことだ」と翻訳するための辞書です。このデータ自体がSEOや営業の強力な資産になります。</p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> ピカ銅 (当社のマスター名)</h4>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2">
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">1号銅線</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">光線</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">特号銅</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">ピカ線</span>
                              <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm flex items-center gap-1"><Icons.Sparkles /> 光銅 (AIが自動学習)</span>
                          </div>
                      </div>

                      <div className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span> VVFケーブル (当社のマスター名)</h4>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2">
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">VA線</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">Fケーブル</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">ネズミ線</span>
                              <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm flex items-center gap-1"><Icons.Sparkles /> 雑線VVF (AIが自動学習)</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
