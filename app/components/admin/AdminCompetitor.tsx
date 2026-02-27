// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

const Icons = {
  Alert: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Crown: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Book: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  TrendUp: () => <svg className="w-4 h-4 text-[#D32F2F] inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>,
  TrendDown: () => <svg className="w-4 h-4 text-blue-500 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>,
  TrendFlat: () => <svg className="w-4 h-4 text-gray-300 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 12h14" /></svg>,
  Chart: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  Brain: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
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

const defaultAIPrompt = `[銅・砲金・真鍮類]\n- 「ピカ線・1号銅」のように併記されている場合は、『光線』と『1号線』の両方に同じ数値を設定してください。\n- 「込銅」しか記載がない場合、『上銅』および『並銅』の両方に「込銅」の数値を設定してください。\n- 「バルブ砲金」が見当たらない場合は、『込砲金』の数値を設定してください。\n- 「真鍮/黄銅」「真鍮」は『込中』に設定してください。\n- 「ミックスメタル」は『山行中』に設定してください。\n\n[電線類]\n- 「1本線」「8割」は『被覆線80%』です。\n- 「CV線」は『被覆線60%』です。\n- 「VA線」「VVF」「Fケーブル」は『被覆線40%』です。\n- 「家電線」「弱電線」は『雑線』です。`;

const targetItems = Object.keys(defaultPricingRules);
const chartItems = ["光線（ピカ線、特号）", "砲金", "込中"];

// 線形回帰（最小二乗法）によるロジック推定
const calculateLinearRegression = (dataPoints) => {
    const n = dataPoints.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    dataPoints.forEach(p => {
        sumX += p.x; sumY += p.y;
        sumXY += p.x * p.y; sumXX += p.x * p.x;
    });

    const denominator = (n * sumXX - sumX * sumX);
    if (denominator === 0) return null;

    const a = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - a * sumX) / n;
    return { ratio: a * 100, offset: b };
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('最新情報を取得');
  const [activeChartTab, setActiveChartTab] = useState(chartItems[0]);
  
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [pastCompetitors, setPastCompetitors] = useState<any[]>([]);
  const [allHistoryData, setAllHistoryData] = useState<any[]>([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  
  const [pricingRules, setPricingRules] = useState<any>(defaultPricingRules);
  const [aiPrompt, setAiPrompt] = useState<string>(defaultAIPrompt);
  const [isSaving, setIsSaving] = useState(false);

  const currentCopperPrice = data?.market?.copper?.price || 1450;
  const currentBrassPrice = data?.market?.brass?.price || 980;

  // 履歴マップ（MM/dd -> CopperPrice）
  const historyMap = useMemo(() => {
      const map: Record<string, number> = {};
      (data?.history || []).forEach((h:any) => { map[h.date] = h.value; });
      return map;
  }, [data?.history]);

  useEffect(() => {
      if (data?.competitorPrices && data.competitorPrices.length > 0) {
          const historyByName: Record<string, any[]> = {};
          const allRawHistory: any[] = [];
          
          data.competitorPrices.forEach((row: any) => {
              if (!historyByName[row.name]) historyByName[row.name] = [];
              let pricesObj = {};
              try { pricesObj = JSON.parse(row.prices); } catch(e) {}
              
              const dateObj = new Date(row.date);
              const mmdd = `${String(dateObj.getMonth()+1).padStart(2, '0')}/${String(dateObj.getDate()).padStart(2, '0')}`;
              
              const record = { date: row.date, mmdd: mmdd, prices: pricesObj };
              historyByName[row.name].push(record);
              allRawHistory.push({ name: row.name, ...record });
          });

          const currentList: any[] = [];
          const pastList: any[] = [];

          Object.keys(historyByName).forEach(name => {
              const sorted = historyByName[name].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
              if (sorted.length > 0) currentList.push({ name, prices: sorted[0].prices });
              if (sorted.length > 1) pastList.push({ name, prices: sorted[1].prices });
          });

          setCompetitors(currentList);
          setPastCompetitors(pastList);
          setAllHistoryData(allRawHistory);
      }

      if (data?.config?.pricing_rules) {
          try { setPricingRules({ ...defaultPricingRules, ...JSON.parse(data.config.pricing_rules) }); } catch(e) {}
      }
      if (data?.config?.ai_knowledge_base) {
          setAiPrompt(data.config.ai_knowledge_base);
      }
  }, [data]);

  const calculateMyPrice = (item: string, rules: any, overrideBase?: number) => {
      const rule = rules[item];
      if (!rule) return 0;
      let basePrice = overrideBase || currentCopperPrice;
      if (rule.base === 'brass') basePrice = overrideBase ? Math.floor(overrideBase * 0.7) : currentBrassPrice; // 簡易補正
      return Math.floor(basePrice * (Number(rule.ratio) / 100)) + Number(rule.offset);
  };

  const handleRuleChange = (item: string, field: 'ratio' | 'offset', value: string) => {
      setPricingRules((prev: any) => ({ ...prev, [item]: { ...prev[item], [field]: value } }));
  };

  const handleSaveConfig = async () => {
      setIsSaving(true);
      try {
          await fetch('/api/gas', { method: 'POST', body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'pricing_rules', value: JSON.stringify(pricingRules) }) });
          await fetch('/api/gas', { method: 'POST', body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'ai_knowledge_base', value: aiPrompt }) });
          setIsEditing(false); setIsEditingPrompt(false);
          alert("データベースに設定を保存しました。");
      } catch (e) { alert("通信エラーが発生しました。"); }
      setIsSaving(false);
  };

  const handleRefresh = async () => {
      setIsRefreshing(true); setStatusMessage(`競合サイトをAI解析中...`);
      const results: any[] = [];
      const targets = [{ key: "sapporo", name: "札幌銅リサイクル" }, { key: "rec", name: "REC環境サービス" }, { key: "ohata", name: "大畑商事" }];
      
      for (const target of targets) {
          try {
              const res = await fetch('/api/competitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetKey: target.key, customPrompt: aiPrompt }) });
              if (res.ok) {
                  const result = await res.json();
                  if (result.status === 'success' && result.data) results.push(result.data);
              }
          } catch (error) {}
      }

      if (results.length > 0) {
          fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'SAVE_COMPETITOR_PRICES', results: results }) }).catch(e => console.error(e));
          setPastCompetitors(competitors); setCompetitors(results); 
          setStatusMessage('取得完了');
      } else {
          alert('すべてのデータ取得に失敗しました。');
      }
      setTimeout(() => { setIsRefreshing(false); setStatusMessage('最新情報を取得'); }, 2000);
  };

  // --------------------------------------------------------
  // チャート・ロジック計算エリア
  // --------------------------------------------------------
  
  // X軸（日付）の生成
  const dateLabels = Object.keys(historyMap).slice(-7); // 直近7日分
  
  // 自社および各社の価格データを日付順に整理
  const chartDataSets = useMemo(() => {
      const sets: any[] = [];
      
      // 自社データ
      const myData = dateLabels.map(d => {
          const copperPoint = historyMap[d];
          return calculateMyPrice(activeChartTab, pricingRules, copperPoint);
      });
      sets.push({ name: '月寒製作所 (自社)', data: myData, color: '#D32F2F', stroke: 3, dash: '' });

      // 他社データ
      const compColors = ['#111111', '#666666', '#999999'];
      const uniqueComps = Array.from(new Set(allHistoryData.map(h => h.name)));
      
      uniqueComps.forEach((compName, idx) => {
          const compData = dateLabels.map(d => {
              // 該当日付の最新データを取得
              const records = allHistoryData.filter(h => h.name === compName && h.mmdd === d);
              if (records.length > 0) {
                  const sorted = records.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  return sorted[0].prices[activeChartTab] || null;
              }
              return null;
          });
          sets.push({ name: compName, data: compData, color: compColors[idx % compColors.length], stroke: 2, dash: '4,4' });
      });

      return sets;
  }, [dateLabels, allHistoryData, activeChartTab, pricingRules, historyMap]);

  // ロジック推定計算
  const estimatedLogics = useMemo(() => {
      const logics: Record<string, any> = {};
      const uniqueComps = Array.from(new Set(allHistoryData.map(h => h.name)));
      
      uniqueComps.forEach(compName => {
          const dataPoints: {x: number, y: number}[] = [];
          allHistoryData.filter(h => h.name === compName).forEach(h => {
              const copperX = historyMap[h.mmdd];
              const compY = h.prices[activeChartTab];
              if (copperX && compY && copperX > 0 && compY > 0) {
                  dataPoints.push({ x: copperX, y: compY });
              }
          });
          
          const result = calculateLinearRegression(dataPoints);
          if (result) {
              logics[compName] = result;
          }
      });
      return logics;
  }, [allHistoryData, historyMap, activeChartTab]);

  // SVG チャート描画関数
  const renderChart = () => {
      const width = 800;
      const height = 250;
      const padding = { top: 20, right: 40, bottom: 30, left: 60 };
      const innerW = width - padding.left - padding.right;
      const innerH = height - padding.top - padding.bottom;

      let min = Infinity, max = -Infinity;
      chartDataSets.forEach(set => {
          set.data.forEach((val: number | null) => {
              if (val !== null) {
                  if (val < min) min = val;
                  if (val > max) max = val;
              }
          });
      });

      if (min === Infinity) return <div className="text-center p-10 text-gray-400">データがありません</div>;
      
      // 見栄えのため少し余白を持たせる
      min = Math.floor(min * 0.98);
      max = Math.ceil(max * 1.02);
      const range = max - min || 1;

      return (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              {/* Y軸目盛り */}
              {[0, 0.25, 0.5, 0.75, 1].map(tick => {
                  const yVal = min + range * tick;
                  const yPos = padding.top + innerH - (tick * innerH);
                  return (
                      <g key={tick}>
                          <line x1={padding.left} y1={yPos} x2={width - padding.right} y2={yPos} stroke="#E5E7EB" strokeWidth="1" />
                          <text x={padding.left - 10} y={yPos + 4} textAnchor="end" fontSize="10" fill="#9CA3AF" fontFamily="monospace">¥{Math.round(yVal)}</text>
                      </g>
                  );
              })}

              {/* X軸ラベル */}
              {dateLabels.map((lbl, idx) => {
                  const xPos = padding.left + (idx / Math.max(1, dateLabels.length - 1)) * innerW;
                  return (
                      <g key={idx}>
                          <line x1={xPos} y1={height - padding.bottom} x2={xPos} y2={height - padding.bottom + 5} stroke="#9CA3AF" strokeWidth="1" />
                          <text x={xPos} y={height - padding.bottom + 20} textAnchor="middle" fontSize="10" fill="#6B7280" fontFamily="sans-serif" fontWeight="bold">{lbl}</text>
                      </g>
                  );
              })}

              {/* データライン */}
              {chartDataSets.map((set, setIdx) => {
                  const points = set.data.map((val: number | null, idx: number) => {
                      if (val === null) return null;
                      const x = padding.left + (idx / Math.max(1, dateLabels.length - 1)) * innerW;
                      const y = padding.top + innerH - ((val - min) / range) * innerH;
                      return `${x},${y}`;
                  }).filter(Boolean);

                  if (points.length < 2) return null;

                  return (
                      <g key={setIdx}>
                          <polyline points={points.join(' ')} fill="none" stroke={set.color} strokeWidth={set.stroke} strokeDasharray={set.dash} strokeLinejoin="round" strokeLinecap="round" />
                          {/* 最後の点にマーカー */}
                          {points.length > 0 && (
                              <circle cx={points[points.length-1].split(',')[0]} cy={points[points.length-1].split(',')[1]} r="4" fill={set.color} />
                          )}
                      </g>
                  );
              })}
          </svg>
      );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans max-w-[1400px] mx-auto w-full">
      <header className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end flex-shrink-0 pb-4 border-b border-gray-200 gap-4">
        <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                プライシング・ダッシュボード
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">AI COMPETITOR RESEARCH & DYNAMIC PRICING</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={() => setIsEditingPrompt(!isEditingPrompt)} className="flex-1 sm:flex-none justify-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-sm text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                <Icons.Book /> AI指示書 (教科書)
            </button>
            <button onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none w-56 justify-center bg-[#111] text-white px-5 py-2.5 rounded-sm text-sm font-bold hover:bg-[#D32F2F] transition flex items-center gap-2 disabled:opacity-50 shadow-sm">
                {isRefreshing && <span className="animate-spin"><Icons.Refresh /></span>}
                {statusMessage}
            </button>
        </div>
      </header>

      {/* AI教科書エディタ */}
      {isEditingPrompt && (
          <div className="bg-gray-50 border border-gray-200 p-5 rounded-sm mb-6 animate-in slide-in-from-top-2 shadow-inner">
              <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Icons.Book /> 月寒製作所 マスター・ナレッジベース（AI査定員へのスクレイピング指示）
                  </h3>
                  <button onClick={handleSaveConfig} disabled={isSaving} className="text-xs font-bold text-white bg-[#D32F2F] px-4 py-2 rounded-sm hover:bg-red-700 transition shadow-sm flex items-center gap-1">
                      {isSaving ? '保存中...' : '指示書を更新する'}
                  </button>
              </div>
              <textarea 
                  className="w-full h-48 p-4 text-sm font-mono border border-gray-300 rounded-sm focus:outline-none focus:border-[#D32F2F] shadow-sm leading-relaxed"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
              />
          </div>
      )}

      {/* ★ 新規: チャート＆ロジック推定セクション */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* 左側: チャート */}
          <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-sm p-5 flex flex-col min-h-[350px]">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Icons.Chart /> 市場価格トレンド</h3>
                  <div className="flex gap-2 bg-gray-50 p-1 rounded-sm border border-gray-200">
                      {chartItems.map(item => (
                          <button key={item} onClick={() => setActiveChartTab(item)} className={`px-4 py-1.5 text-xs font-bold rounded-sm transition ${activeChartTab === item ? 'bg-white shadow-sm text-[#D32F2F]' : 'text-gray-500 hover:text-gray-900'}`}>
                              {item}
                          </button>
                      ))}
                  </div>
              </div>
              <div className="flex-1 w-full h-full relative">
                  {renderChart()}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 justify-center text-[10px] font-bold text-gray-500">
                  {chartDataSets.map((set, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                          <span className="w-4 h-1 block" style={{ backgroundColor: set.color }}></span>
                          {set.name}
                      </div>
                  ))}
              </div>
          </div>

          {/* 右側: ロジック推定 AI */}
          <div className="bg-[#111] text-white border border-gray-800 shadow-sm rounded-sm p-5 flex flex-col relative overflow-hidden">
              <div className="absolute right-0 top-0 p-4 opacity-10 transform scale-150"><Icons.Brain /></div>
              <h3 className="text-sm font-bold flex items-center gap-2 mb-1 relative z-10">
                  <Icons.Brain /> AI ロジック逆算エンジン
              </h3>
              <p className="text-[10px] text-gray-400 mb-6 border-b border-gray-800 pb-3 relative z-10">過去のデータから他社の「建値に対する計算式」を自動推論します。</p>
              
              <div className="flex-1 space-y-4 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(estimatedLogics).length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-10">データが不足しているため計算できません</p>
                  ) : (
                      Object.entries(estimatedLogics).map(([compName, logic]) => (
                          <div key={compName} className="bg-white/10 p-3 rounded-sm border border-white/20 hover:bg-white/15 transition cursor-default">
                              <p className="text-xs font-bold text-gray-200 mb-2">{compName}</p>
                              <div className="flex justify-between items-end font-mono">
                                  <div>
                                      <p className="text-[10px] text-gray-400">推定歩留まり</p>
                                      <p className="text-xl font-black text-white">{logic.ratio.toFixed(1)}<span className="text-xs ml-0.5">%</span></p>
                                  </div>
                                  <div className="text-gray-500 font-black">×</div>
                                  <div className="text-right">
                                      <p className="text-[10px] text-gray-400">調整額 (オフセット)</p>
                                      <p className="text-xl font-black text-white">{logic.offset > 0 ? '+' : ''}{Math.round(logic.offset)}<span className="text-xs ml-0.5">円</span></p>
                                  </div>
                              </div>
                          </div>
                      ))
                  )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-800 text-[10px] text-gray-500 text-center relative z-10">
                  y (買取単価) = a (歩留%) × x (建値) + b (調整額)
              </div>
          </div>

      </div>

      {/* メイン価格テーブル */}
      <div className="flex-1 bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] relative">
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse"></span>
                  自社価格設定マトリクス
              </span>
              <div className="flex items-center gap-3">
                  {isEditing ? (
                      <>
                          <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-gray-600 bg-white border border-gray-300 px-4 py-2 rounded-sm hover:bg-gray-50 transition flex items-center gap-1 shadow-sm">
                              <Icons.Close /> 取消
                          </button>
                          <button onClick={handleSaveConfig} disabled={isSaving} className="text-xs font-bold text-white bg-[#111] px-5 py-2 rounded-sm hover:bg-gray-900 transition shadow-sm flex items-center gap-1 disabled:opacity-50">
                              {isSaving ? '保存中...' : <><Icons.Save /> DBへ反映</>}
                          </button>
                      </>
                  ) : (
                      <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-gray-700 bg-white border border-gray-300 px-5 py-2 rounded-sm hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                          <Icons.Edit /> 自社ロジックの調整
                      </button>
                  )}
              </div>
          </div>

          <div className="overflow-y-auto overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
                      <tr>
                          <th className="p-4 font-bold text-xs text-gray-500 w-[15%] tracking-widest whitespace-nowrap">ベンチマーク品目</th>
                          <th className="p-4 font-bold text-xs text-gray-900 bg-gray-100 w-[35%] border-r border-gray-200 whitespace-nowrap text-center">
                              自社の価格設定 (ベース建値 × <span className="text-[#D32F2F]">歩留%</span> ＋ <span className="text-blue-600">調整額</span>)
                          </th>
                          {competitors.length === 0 && <th className="p-4 font-normal text-sm text-gray-400">AIデータ未取得</th>}
                          {competitors.map((comp, idx) => (
                              <th key={idx} className="p-4 font-bold text-xs text-gray-500 w-[16%] border-r border-gray-100 last:border-0 whitespace-nowrap text-center">
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
                          
                          const isWinning = maxCompetitorPrice > 0 && myPrice >= maxCompetitorPrice;
                          const isLosing = maxCompetitorPrice > 0 && myPrice < maxCompetitorPrice;
                          const rule = pricingRules[item];

                          return (
                              <tr key={idx} className={`hover:bg-gray-50 transition ${isEditing ? 'bg-red-50/20' : ''}`}>
                                  <td className="p-4 font-bold text-sm text-gray-800 whitespace-nowrap">{item}</td>
                                  
                                  {/* 自社設定エリア */}
                                  <td className="p-3 md:p-4 border-l border-r border-gray-200 bg-white whitespace-nowrap">
                                      {isEditing ? (
                                          <div className="flex items-center justify-between gap-3 bg-gray-50 p-2 rounded-sm border border-gray-200 shadow-inner">
                                              <div className="flex items-center gap-2">
                                                  <span className="text-xs text-gray-500 font-bold w-8 text-center">{rule.base === 'brass' ? '真鍮' : '銅'}</span>
                                                  <span className="text-sm text-gray-400 font-black">×</span>
                                                  <input type="number" value={rule.ratio} onChange={e => handleRuleChange(item, 'ratio', e.target.value)} className="w-20 p-1.5 text-right text-base font-black font-mono border border-red-200 text-[#D32F2F] rounded-sm focus:outline-none focus:border-red-500" />
                                                  <span className="text-xs text-gray-500 font-bold">%</span>
                                                  <span className="text-sm text-gray-400 font-black ml-2">＋</span>
                                                  <input type="number" value={rule.offset} onChange={e => handleRuleChange(item, 'offset', e.target.value)} className="w-20 p-1.5 text-right text-base font-black font-mono border border-blue-200 text-blue-600 rounded-sm focus:outline-none focus:border-blue-500" />
                                                  <span className="text-xs text-gray-500 font-bold">円</span>
                                              </div>
                                              <div className="text-lg font-black text-gray-900 font-mono bg-white px-3 py-1.5 border border-gray-200 rounded-sm shadow-sm">
                                                  ¥{myPrice.toLocaleString()}
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="flex items-center justify-between px-3">
                                              <span className="text-xs text-gray-500 font-mono font-bold">
                                                  ({rule.base === 'brass' ? '真鍮' : '銅'} × {rule.ratio}% {Number(rule.offset) >= 0 ? '+' : ''}{rule.offset}円)
                                              </span>
                                              <div className="flex items-center gap-3">
                                                  <span className="text-lg font-black text-gray-900 font-mono">¥{myPrice.toLocaleString()}</span>
                                                  {isLosing && (
                                                      <span className="text-[10px] font-bold text-[#D32F2F] border border-red-200 bg-red-50 px-2 py-1 rounded-sm flex items-center shadow-sm">
                                                          <Icons.Alert /> 劣勢
                                                      </span>
                                                  )}
                                                  {isWinning && (
                                                      <span className="text-[10px] font-bold text-gray-900 border border-gray-300 bg-white px-2 py-1 rounded-sm flex items-center shadow-sm">
                                                          <Icons.Crown /> 優勢
                                                      </span>
                                                  )}
                                              </div>
                                          </div>
                                      )}
                                  </td>

                                  {/* 競合他社エリア (トレンド表示付き) */}
                                  {competitors.map((comp, cIdx) => {
                                      const compPrice = comp.prices[item];
                                      if (!compPrice) return <td key={cIdx} className="p-4 text-sm text-gray-300 font-mono border-r border-gray-100 last:border-0 text-center">-</td>;
                                      
                                      const diff = myPrice - compPrice;
                                      
                                      // 過去データと比較してトレンドを判定
                                      const pastComp = pastCompetitors.find(p => p.name === comp.name);
                                      const pastPrice = pastComp ? pastComp.prices[item] : null;
                                      let TrendIcon = Icons.TrendFlat;
                                      if (pastPrice) {
                                          if (compPrice > pastPrice) TrendIcon = Icons.TrendUp;
                                          if (compPrice < pastPrice) TrendIcon = Icons.TrendDown;
                                      }

                                      return (
                                          <td key={cIdx} className="p-4 border-r border-gray-100 last:border-0 whitespace-nowrap bg-white">
                                              <div className="flex flex-col items-center justify-center gap-1.5">
                                                  <div className="flex items-center">
                                                      <span className={`text-base font-mono ${compPrice > myPrice ? 'font-black text-gray-900' : 'font-bold text-gray-500'}`}>
                                                          ¥{compPrice.toLocaleString()}
                                                      </span>
                                                      {pastPrice && <TrendIcon />}
                                                  </div>
                                                  
                                                  {diff < 0 ? (
                                                      <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded-sm border border-red-100">
                                                          自社が {Math.abs(diff).toLocaleString()}円 負け
                                                      </span>
                                                  ) : diff > 0 ? (
                                                      <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-200">
                                                          自社が {diff.toLocaleString()}円 勝ち
                                                      </span>
                                                  ) : (
                                                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-sm border border-gray-200">
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
