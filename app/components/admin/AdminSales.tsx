// app/components/admin/AdminSales.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Brain: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
};

const formatTimeShort = (timeStr: string) => {
  if (!timeStr) return '--/-- --:--';
  const str = String(timeStr);
  const match = str.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
  if (match) {
    const MM = match[2].padStart(2, '0'); const DD = match[3].padStart(2, '0');
    const HH = match[4].padStart(2, '0'); const mm = match[5].padStart(2, '0');
    return `${MM}/${DD} ${HH}:${mm}`;
  }
  return str.substring(0, 16);
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'CO_OP': return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-gray-900`} title="AI予測・推論データ">AI抽出</span>; // AIバッジも青から黒に変更
        default: return null;
    }
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 初期値を「苫小牧」「解体・電気工事（中規模以上）」に設定
  const [targetArea, setTargetArea] = useState('北海道苫小牧市');
  const [targetIndustry, setTargetIndustry] = useState('解体工事業、電気工事業（中規模以上）');
  const [targetCount, setTargetCount] = useState(5);

  const targets = data?.salesTargets || [];

  // ★ パイプライン（ファネル）の集計
  const pipelineStats = useMemo(() => {
      let uncontacted = 0, approaching = 0, converted = 0, passed = 0;
      targets.forEach((t: any) => {
          if (t.status === '確認中' || t.status === '未確認' || !t.status) uncontacted++;
          else if (t.status === 'アプローチ中') approaching++;
          else if (t.status === '既存取引先') converted++;
          else if (t.status === '見送り') passed++;
      });
      return { uncontacted, approaching, converted, passed, total: targets.length };
  }, [targets]);

  // ★ 北海道エリア別の集計（モノトーン＋赤の配色に修正）
  const areaStats = useMemo(() => {
      const areas = {
          '道北': { count: 0, color: 'bg-gray-300', top: '15%', left: '55%' },
          '道東': { count: 0, color: 'bg-gray-400', top: '35%', left: '85%' },
          '札幌圏': { count: 0, color: 'bg-gray-600', top: '45%', left: '40%' },
          '苫小牧・室蘭': { count: 0, color: 'bg-[#D32F2F]', top: '65%', left: '50%' }, // ターゲットのみ赤
          '道南': { count: 0, color: 'bg-gray-500', top: '80%', left: '15%' },
      };
      let otherCount = 0;
      
      targets.forEach((t: any) => {
          const a = (t.area || t.address || '').toLowerCase();
          if (a.includes('苫小牧') || a.includes('室蘭') || a.includes('登別') || a.includes('白老') || a.includes('日高')) areas['苫小牧・室蘭'].count++;
          else if (a.includes('札幌') || a.includes('石狩') || a.includes('江別') || a.includes('恵庭') || a.includes('千歳') || a.includes('北広島')) areas['札幌圏'].count++;
          else if (a.includes('旭川') || a.includes('稚内') || a.includes('名寄') || a.includes('富良野') || a.includes('留萌')) areas['道北'].count++;
          else if (a.includes('帯広') || a.includes('釧路') || a.includes('北見') || a.includes('網走') || a.includes('十勝') || a.includes('根室')) areas['道東'].count++;
          else if (a.includes('函館') || a.includes('北斗') || a.includes('七飯') || a.includes('松前')) areas['道南'].count++;
          else if (a) otherCount++;
      });
      return { areas, otherCount };
  }, [targets]);

  const filteredTargets = targets.filter((t: any) => {
      const matchSearch = t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.industry?.includes(searchTerm);
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchSearch && matchPriority && matchStatus;
  });

  const handleGenerateLeads = async () => {
      if (!targetArea || !targetIndustry) return alert('エリアと業種を入力してください。');
      setIsGenerating(true);
      try {
          const payload = { action: 'GENERATE_LEADS_DYNAMIC', area: targetArea, industry: targetIndustry, count: targetCount };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { alert(`成功！ ${result.count}件の新規ターゲットを抽出しました。`); window.location.reload(); } 
          else { alert('エラーが発生しました: ' + result.message); }
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setIsGenerating(false); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 10: newStatus } }) 
          });
          window.location.reload();
      } catch(e) { alert('ステータスの更新に失敗しました'); }
  };

  const handleMemoChange = async (id: string, newMemo: string) => {
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 13: newMemo } }) 
          });
      } catch(e) { console.error('メモの更新に失敗しました'); }
  };

  const handlePromoteToClient = async (id: string, company: string) => {
      if (!confirm(`「${company}」を既存取引先（顧客マスター）に昇格させますか？\n※昇格後はPOSレジの顧客一覧に表示されます。`)) return;
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'CONVERT_TARGET_TO_CLIENT', targetId: id })
          });
          alert('顧客マスターへの昇格が完了しました！');
          window.location.reload();
      } catch(e) { alert('エラーが発生しました'); }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                仕入パイプライン管理
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">SOURCING PIPELINE & CRM</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border ${isAiPanelOpen ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-gray-900 text-white hover:bg-black border-transparent'}`}
            >
                <Icons.Target /> AIスナイパー (条件指定抽出)
            </button>
        </div>
      </header>

      {/* 上部ダッシュボード（ファネル ＆ 北海道マップ） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          
          {/* 左：セールスパイプライン（ファネル） */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 md:p-6 flex flex-col justify-between">
              <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-sm md:text-base border-b border-gray-100 pb-2">
                      <Icons.Chart /> パイプライン・コンバージョン
                  </h3>
                  <div className="flex justify-between items-center mb-6 px-2">
                       <div className="text-center">
                           <p className="text-[10px] text-gray-500 font-bold mb-1">総ターゲット</p>
                           <p className="text-3xl font-black text-gray-900">{pipelineStats.total}</p>
                       </div>
                       <div className="text-center">
                           <p className="text-[10px] text-gray-500 font-bold mb-1">アプローチ率</p>
                           {/* 修正: 色をモノトーンに */}
                           <p className="text-2xl font-black text-gray-700">{pipelineStats.total > 0 ? Math.floor((pipelineStats.approaching + pipelineStats.converted) / pipelineStats.total * 100) : 0}%</p>
                       </div>
                       <div className="text-center">
                           <p className="text-[10px] text-gray-500 font-bold mb-1">顧客転換率</p>
                           {/* 修正: 最終成果を赤に */}
                           <p className="text-2xl font-black text-[#D32F2F]">{pipelineStats.total > 0 ? Math.floor(pipelineStats.converted / pipelineStats.total * 100) : 0}%</p>
                       </div>
                  </div>
                  
                  {/* 修正: ファネルの色調をモノトーンの濃淡で表現 */}
                  <div className="flex gap-1 md:gap-2">
                      <div className="flex-1 bg-gray-50 border border-gray-200 p-2 md:p-3 rounded-sm text-center relative shadow-sm">
                         <span className="text-[9px] md:text-[10px] font-bold text-gray-500 block mb-1">潜在リード</span>
                         <span className="text-xl md:text-2xl font-black text-gray-600">{pipelineStats.uncontacted}</span>
                         <div className="absolute top-1/2 -right-2 md:-right-3 transform -translate-y-1/2 text-gray-300 z-10 text-xs md:text-sm">▶</div>
                      </div>
                      <div className="flex-1 bg-gray-100 border border-gray-300 p-2 md:p-3 rounded-sm text-center relative shadow-sm">
                         <span className="text-[9px] md:text-[10px] font-bold text-gray-700 block mb-1">アプローチ中</span>
                         <span className="text-xl md:text-2xl font-black text-gray-900">{pipelineStats.approaching}</span>
                         <div className="absolute top-1/2 -right-2 md:-right-3 transform -translate-y-1/2 text-gray-400 z-10 text-xs md:text-sm">▶</div>
                      </div>
                      <div className="flex-1 bg-gray-900 border border-gray-900 p-2 md:p-3 rounded-sm text-center shadow-sm">
                         <span className="text-[9px] md:text-[10px] font-bold text-gray-300 block mb-1">顧客化 (既存)</span>
                         <span className="text-xl md:text-2xl font-black text-white">{pipelineStats.converted}</span>
                      </div>
                  </div>
                  <div className="text-right mt-2"><span className="text-[9px] text-gray-400 font-bold">見送り: {pipelineStats.passed}件</span></div>
              </div>
          </div>
          
          {/* 右：エリア別 分布図（ネットワークマップ） */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 md:p-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-sm md:text-base border-b border-gray-100 pb-2">
                  <Icons.MapPin /> エリア別 分布マップ (北海道)
              </h3>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* デフォルメ北海道マップ */}
                  <div className="relative w-full md:w-1/2 aspect-[4/3] bg-gray-50 rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                      {/* ネットワークの線 */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <line x1="55" y1="15" x2="40" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="40" y1="45" x2="85" y2="35" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="40" y1="45" x2="50" y2="65" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="50" y1="65" x2="15" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="50" y1="65" x2="85" y2="35" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                      </svg>
                      {/* エリアノード */}
                      {Object.entries(areaStats.areas).map(([label, d]) => (
                          <div key={label} className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-default group" style={{ top: d.top, left: d.left }}>
                              <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full shadow-md mb-0.5 transition-transform group-hover:scale-125 ${d.count > 0 ? d.color : 'bg-gray-200'} ${d.count > 0 && label === '苫小牧・室蘭' ? 'ring-4 ring-red-100 animate-pulse' : ''}`} />
                              <span className={`text-[8px] md:text-[9px] font-bold bg-white/70 px-1 rounded-sm ${d.count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                              {d.count > 0 && <span className="bg-white border border-gray-200 px-1 py-0.5 text-[8px] font-black rounded-sm shadow-sm mt-0.5 tabular-nums text-gray-800">{d.count}</span>}
                          </div>
                      ))}
                  </div>
                  {/* エリア別バーチャート */}
                  <div className="flex-1 w-full space-y-2.5">
                      {Object.entries(areaStats.areas).map(([label, d]) => (
                          <div key={label} className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold w-16 truncate ${d.count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                              <div className="flex-1 h-2 md:h-3 bg-gray-100 rounded-sm overflow-hidden flex shadow-inner">
                                  <div className={`h-full ${d.color} transition-all duration-1000`} style={{ width: `${(d.count / Math.max(1, pipelineStats.total)) * 100}%` }}></div>
                              </div>
                              <span className={`text-[10px] font-mono tabular-nums w-6 text-right ${d.count > 0 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>{d.count}</span>
                          </div>
                      ))}
                      {areaStats.otherCount >= 0 && (
                          <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold w-16 truncate text-gray-500">その他</span>
                              <div className="flex-1 h-2 md:h-3 bg-gray-100 rounded-sm overflow-hidden flex shadow-inner">
                                  <div className="h-full bg-gray-300 transition-all duration-1000" style={{ width: `${(areaStats.otherCount / Math.max(1, pipelineStats.total)) * 100}%` }}></div>
                              </div>
                              <span className="text-[10px] font-mono tabular-nums w-6 text-right text-gray-500">{areaStats.otherCount}</span>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>

      {/* AIスナイパー設定パネル */}
      {isAiPanelOpen && (
          <div className="mb-8 bg-gray-50 border border-gray-200 p-6 rounded-sm shadow-inner relative overflow-hidden animate-in slide-in-from-top-4">
              <div className="absolute top-4 right-4"><ProvenanceBadge type="AI_AUTO" /></div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <Icons.Brain /> AIスナイパー・パラメータ設定
              </h3>
              <p className="text-xs text-gray-600 mb-6 max-w-2xl leading-relaxed">
                  Web上の企業情報をAIが分析し、中規模以上の「廃電線・非鉄スクラップを定期的に排出する企業」をリストアップします。<br/>
                  <span className="font-bold text-[#D32F2F]">※まずは足元の「苫小牧エリア」の優良顧客を一本釣りする戦略を推奨します。</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">ターゲットエリア</label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.MapPin /></div>
                          <input type="text" value={targetArea} onChange={e => setTargetArea(e.target.value)} className="w-full pl-9 p-2.5 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white shadow-sm font-bold" placeholder="例: 北海道苫小牧市" disabled={isGenerating} />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">対象業種キーワード</label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.Briefcase /></div>
                          <input type="text" value={targetIndustry} onChange={e => setTargetIndustry(e.target.value)} className="w-full pl-9 p-2.5 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white shadow-sm font-bold" placeholder="例: 解体工事業、電気工事業" disabled={isGenerating} />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">抽出件数</label>
                      <select value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-sm text-sm outline-none focus:border-gray-900 bg-white shadow-sm font-mono font-bold" disabled={isGenerating}>
                          <option value={5}>5件 (質の高い順)</option>
                          <option value={10}>10件 (標準・推奨)</option>
                          <option value={20}>20件 (広範囲)</option>
                      </select>
                  </div>
              </div>

              <div className="flex justify-end border-t border-gray-200 pt-4">
                  <button 
                      onClick={handleGenerateLeads}
                      disabled={isGenerating}
                      className="bg-gray-900 text-white px-6 py-2.5 rounded-sm text-sm font-bold shadow-md hover:bg-black transition flex items-center gap-2 disabled:opacity-50"
                  >
                      {isGenerating ? <><Icons.Refresh /> リサーチ実行中 (約10〜30秒)...</> : <><Icons.Target /> この条件で抽出を開始する</>}
                  </button>
              </div>
          </div>
      )}

      {/* 検索とフィルター */}
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm flex flex-col md:flex-row gap-4 mb-6 shadow-sm">
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            <input 
                type="text" placeholder="企業名、エリア、業種で検索..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#D32F2F]"
            />
        </div>
        <div className="flex items-center gap-2">
            <div className="text-gray-400"><Icons.Filter /></div>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#D32F2F] bg-white font-bold text-gray-700">
                <option value="ALL">すべてのランク</option>
                <option value="S">ランク S (最優先)</option>
                <option value="A">ランク A</option>
                <option value="B">ランク B</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#D32F2F] bg-white font-bold text-gray-700">
                <option value="ALL">全ステータス</option>
                <option value="確認中">潜在リード (未着手)</option>
                <option value="アプローチ中">アプローチ中 (育成)</option>
                <option value="見送り">見送り</option>
                <option value="既存取引先">既存顧客 (刈り取り済)</option>
            </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest border-b border-gray-200">
                    <tr>
                        <th className="p-4 w-[25%]">企業名 / エリア</th>
                        <th className="p-4 w-[5%] text-center">ランク</th>
                        <th className="p-4 w-[20%]">営業根拠 (なぜ狙うか)</th>
                        <th className="p-4 w-[20%]">AI提案シナリオ</th>
                        <th className="p-4 w-[30%]">進捗ステータス / アプローチ履歴</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {filteredTargets.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-bold">ターゲットが見つかりません。AIスナイパーで抽出してください。</td></tr>
                    ) : (
                        filteredTargets.reverse().map((t: any) => {
                            const isAi = t.memo?.includes('AI_AUTO') || t.source === 'AI_AUTO' || t.memo?.includes('AIスナイパー') || t.memo?.includes('AI自動抽出');
                            const isClient = t.status === '既存取引先';
                            return (
                                <tr key={t.id} className={`hover:bg-gray-50 transition group ${isClient ? 'bg-gray-50 opacity-60' : ''}`}>
                                    <td className="p-4 align-top">
                                        <div className="flex items-start gap-2">
                                            <p className="font-bold text-gray-900 mb-1">{t.company}</p>
                                            {isAi && !isClient && <ProvenanceBadge type="AI_AUTO" />}
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">{t.address || t.area}</p>
                                        <span className="inline-block bg-gray-100 border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-sm font-bold">
                                            {t.industry || '業種不明'}
                                        </span>
                                        <div className="mt-2 text-[10px] text-gray-400 font-mono">
                                            <span title={`抽出日時: ${t.createdAt}`}>🕒 {formatTimeShort(t.createdAt)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center align-top">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-black shadow-sm ${t.priority === 'S' ? 'bg-[#D32F2F] text-white' : t.priority === 'A' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                            {t.priority || 'B'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-4 group-hover:line-clamp-none transition-all">
                                            {t.reason || '-'}
                                        </p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="bg-gray-50 p-3 rounded-sm border border-gray-200">
                                            <p className="text-xs text-gray-800 leading-relaxed font-bold flex gap-1">
                                                <Icons.Brain />
                                                <span className="line-clamp-4 group-hover:line-clamp-none transition-all">{t.proposal || '-'}</span>
                                            </p>
                                        </div>
                                    </td>
                                    
                                    {/* ★ ステータスとメモ欄を統合した実戦的UI（モノトーン修正） */}
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-2 h-full">
                                            <div className="flex items-center justify-between">
                                                <select 
                                                    value={t.status || '確認中'} 
                                                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                                    disabled={isClient}
                                                    className={`p-2 text-xs font-bold rounded-sm border outline-none cursor-pointer shadow-sm w-3/5 ${
                                                        t.status === 'アプローチ中' ? 'bg-gray-100 border-gray-400 text-gray-900' :
                                                        t.status === '見送り' ? 'bg-gray-50 border-gray-200 text-gray-400' :
                                                        isClient ? 'bg-gray-900 border-gray-900 text-white' :
                                                        'bg-white border-gray-300 text-gray-800'
                                                    }`}
                                                >
                                                    <option value="確認中">潜在リード (未着手)</option>
                                                    <option value="アプローチ中">アプローチ中 (育成)</option>
                                                    <option value="見送り">見送り</option>
                                                    {isClient && <option value="既存取引先">既存顧客 (刈り取り済)</option>}
                                                </select>
                                                
                                                {!isClient && (
                                                    <button 
                                                        onClick={() => handlePromoteToClient(t.id, t.company)}
                                                        className="text-[10px] bg-gray-900 text-white px-2 py-2 rounded-sm font-bold shadow-sm hover:bg-[#D32F2F] transition flex items-center gap-1"
                                                    >
                                                        <Icons.ArrowUp /> 顧客へ昇格
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col mt-1">
                                                <textarea 
                                                    defaultValue={t.memo === '🤖 AIによる自動抽出ターゲット' || t.memo === '🤖 AIスナイパー' ? '' : t.memo}
                                                    placeholder="電話した結果や、次回訪問予定などを記録..."
                                                    onBlur={(e) => handleMemoChange(t.id, e.target.value)}
                                                    disabled={isClient}
                                                    className={`w-full flex-1 min-h-[60px] p-2 text-xs border rounded-sm outline-none resize-none shadow-inner leading-relaxed transition-colors ${isClient ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-gray-50 border-gray-300 focus:border-gray-900 focus:bg-white text-gray-900'}`}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
