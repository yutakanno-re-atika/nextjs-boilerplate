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
  Briefcase: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Scale: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  // ★ 欠落していた Plus アイコンを復活
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  Document: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  CheckCircle: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'GBIZ_VERIFIED' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`}>HUMAN</span>;
        case 'GBIZ_VERIFIED': return <span className={`${baseStyle} bg-green-700`}><Icons.CheckCircle /> 国の公式データ</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-gray-900`}>AI抽出</span>;
        default: return null;
    }
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [isAutoModeOpen, setIsAutoModeOpen] = useState(false);
  const [isCatchModeOpen, setIsCatchModeOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 自動抽出用のステート
  const [targetArea, setTargetArea] = useState('北海道浦河郡');
  const [targetIndustry, setTargetIndustry] = useState('電気工事');
  const [catchInput, setCatchInput] = useState('');

  const targets = data?.salesTargets || [];

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

  const areaStats = useMemo(() => {
      const areas = {
          '道北': { count: 0, color: 'bg-gray-300', top: '15%', left: '55%' },
          '道東': { count: 0, color: 'bg-gray-400', top: '35%', left: '85%' },
          '札幌圏': { count: 0, color: 'bg-gray-600', top: '45%', left: '40%' },
          '苫小牧・室蘭': { count: 0, color: 'bg-[#D32F2F]', top: '65%', left: '50%' }, 
          '道南': { count: 0, color: 'bg-gray-500', top: '80%', left: '15%' },
      };
      let otherCount = 0;
      
      targets.forEach((t: any) => {
          const a = (t.area || t.address || '').toLowerCase();
          if (a.includes('苫小牧') || a.includes('室蘭') || a.includes('登別') || a.includes('白老') || a.includes('日高') || a.includes('浦河')) areas['苫小牧・室蘭'].count++;
          else if (a.includes('札幌') || a.includes('石狩') || a.includes('江別') || a.includes('恵庭') || a.includes('千歳')) areas['札幌圏'].count++;
          else if (a.includes('旭川') || a.includes('稚内') || a.includes('富良野') || a.includes('留萌')) areas['道北'].count++;
          else if (a.includes('帯広') || a.includes('釧路') || a.includes('北見') || a.includes('十勝')) areas['道東'].count++;
          else if (a.includes('函館') || a.includes('北斗') || a.includes('七飯')) areas['道南'].count++;
          else if (a) otherCount++;
      });
      return { areas, otherCount };
  }, [targets]);

  const filteredTargets = targets.filter((t: any) => {
      const matchSearch = t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.industry?.includes(searchTerm) || t.corporateNumber?.includes(searchTerm);
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchSearch && matchPriority && matchStatus;
  });

  const getTeacherClients = () => {
      return (data?.clients || []).filter((c:any) => c.rank === 'S' || c.rank === 'A').map((c:any) => ({ name: c.name, industry: c.industry })); 
  };

  const handleAutoGenerate = async () => {
      if (!targetArea || !targetIndustry) return alert('エリアと業種を入力してください。');
      setIsGenerating(true);
      
      try {
          const payload = { mode: 'auto', area: targetArea, industry: targetIndustry, teacherClients: getTeacherClients() };
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.success) { 
              alert(`成功！ gBizINFOの公式データベースから実在する ${result.count}件 の企業を抽出し、リスト化しました。`); 
              window.location.reload(); 
          } else { 
              alert('抽出エラー: ' + result.message); 
          }
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setIsGenerating(false); }
  };

  const handleCatchLead = async () => {
      if (!catchInput) return alert("名簿テキストを貼り付けてください。");
      setIsGenerating(true);
      try {
          const payload = { mode: 'catch', inputText: catchInput, area: '北海道', industry: '不明', teacherClients: getTeacherClients() };
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.success) { alert(`成功！ ${result.count}件の法人を登録しました。`); setCatchInput(''); window.location.reload(); } 
          else { alert('エラー: ' + result.message); }
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setIsGenerating(false); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 15: newStatus } }) 
          });
          window.location.reload();
      } catch(e) { alert('ステータスの更新に失敗しました'); }
  };

  const handleDeleteTarget = async (id: string) => {
      if (!confirm('このターゲットを削除しますか？')) return;
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName: 'SalesTargets', recordId: id }) 
          });
          window.location.reload();
      } catch(e) { alert('削除に失敗しました'); }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                仕入パイプライン管理
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">SOURCING PIPELINE (gBizINFO SYNCED)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
            <button 
                onClick={() => {setIsAutoModeOpen(!isAutoModeOpen); setIsCatchModeOpen(false);}}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border ${isAutoModeOpen ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-gray-900 text-white hover:bg-black border-transparent'}`}
            >
                <Icons.Target /> エリア一括抽出
            </button>
            <button 
                onClick={() => {setIsCatchModeOpen(!isCatchModeOpen); setIsAutoModeOpen(false);}}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border ${isCatchModeOpen ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
                <Icons.Sparkles /> 名簿コピペ登録
            </button>
        </div>
      </header>

      {/* 上部ダッシュボード */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 md:p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Icons.Chart /></div>
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
                           <p className="text-2xl font-black text-gray-700">{pipelineStats.total > 0 ? Math.floor((pipelineStats.approaching + pipelineStats.converted) / pipelineStats.total * 100) : 0}%</p>
                       </div>
                       <div className="text-center">
                           <p className="text-[10px] text-gray-500 font-bold mb-1">顧客転換率</p>
                           <p className="text-2xl font-black text-[#D32F2F]">{pipelineStats.total > 0 ? Math.floor(pipelineStats.converted / pipelineStats.total * 100) : 0}%</p>
                       </div>
                  </div>
                  
                  <div className="flex gap-1 md:gap-2 relative z-10">
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
          
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 md:p-6 relative overflow-hidden">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-sm md:text-base border-b border-gray-100 pb-2">
                  <Icons.MapPin /> エリア別 分布マップ (北海道)
              </h3>
              <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative w-full md:w-1/2 aspect-[4/3] bg-gray-50 rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <line x1="55" y1="15" x2="40" y2="45" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="40" y1="45" x2="85" y2="35" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="40" y1="45" x2="50" y2="65" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="50" y1="65" x2="15" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                          <line x1="50" y1="65" x2="85" y2="35" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                      </svg>
                      {Object.entries(areaStats.areas).map(([label, d]) => (
                          <div key={label} className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-default group" style={{ top: d.top, left: d.left }}>
                              <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full shadow-md mb-0.5 transition-transform group-hover:scale-125 ${d.count > 0 ? d.color : 'bg-gray-200 border border-gray-300'}`} />
                              <span className={`text-[8px] md:text-[9px] font-bold bg-white/70 px-1 rounded-sm ${d.count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                              {d.count > 0 && <span className="bg-white border border-gray-200 px-1 py-0.5 text-[8px] font-black rounded-sm shadow-sm mt-0.5 tabular-nums text-gray-800">{d.count}</span>}
                          </div>
                      ))}
                  </div>
                  <div className="flex-1 w-full space-y-2.5">
                      {Object.entries(areaStats.areas).map(([label, d]) => (
                          <div key={label} className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold w-16 truncate ${d.count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                              <div className="flex-1 h-2 md:h-3 bg-gray-100 rounded-sm overflow-hidden flex shadow-inner">
                                  <div className={`h-full ${d.color} transition-all duration-1000`} style={{ width: `${Math.max(2, (d.count / Math.max(1, pipelineStats.total)) * 100)}%`, opacity: d.count > 0 ? 1 : 0 }}></div>
                              </div>
                              <span className={`text-[10px] font-mono tabular-nums w-6 text-right ${d.count > 0 ? 'text-gray-900 font-bold' : 'text-gray-400'}`}>{d.count}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* エリア一括抽出（AUTOモード）パネル */}
      {isAutoModeOpen && (
          <div className="mb-8 bg-gray-900 border border-gray-800 p-6 rounded-sm shadow-xl relative overflow-hidden animate-in slide-in-from-top-4 text-white">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Icons.Target /></div>
              <h3 className="font-bold flex items-center gap-2 mb-2 text-lg">
                  <Icons.Target /> 地域・業種 一括取得エンジン
              </h3>
              <p className="text-xs text-gray-400 mb-6 max-w-2xl leading-relaxed">
                  指定したエリアと業種から、AIがネット上の企業をリストアップし、さらに<strong>経産省(gBizINFO)のデータベースと直結して「本物の法人データ」だけをふるいにかけて一括登録</strong>します。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10">
                  <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">ターゲットエリア</label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Icons.MapPin /></div>
                          <input type="text" value={targetArea} onChange={e => setTargetArea(e.target.value)} className="w-full pl-9 p-3 border border-gray-700 rounded-sm text-sm outline-none focus:border-white bg-gray-800 text-white shadow-inner font-bold" placeholder="例: 北海道浦河郡" disabled={isGenerating} />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">対象業種・キーワード</label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Icons.Briefcase /></div>
                          <input type="text" value={targetIndustry} onChange={e => setTargetIndustry(e.target.value)} className="w-full pl-9 p-3 border border-gray-700 rounded-sm text-sm outline-none focus:border-white bg-gray-800 text-white shadow-inner font-bold" placeholder="例: 電気工事、解体工事" disabled={isGenerating} />
                      </div>
                  </div>
              </div>

              <div className="flex justify-end border-t border-gray-700 pt-4">
                  <button 
                      onClick={handleAutoGenerate}
                      disabled={isGenerating || !targetArea || !targetIndustry}
                      className="bg-[#D32F2F] text-white px-8 py-3 rounded-sm text-sm font-bold shadow-lg hover:bg-red-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                      {isGenerating ? <><Icons.Refresh /> gBizINFOと通信し、企業データを一括取得中 (最大60秒)...</> : <><Icons.Sparkles /> エリア内の企業を一括取得する</>}
                  </button>
              </div>
          </div>
      )}

      {/* 名簿コピペ登録（CATCHモード）パネル */}
      {isCatchModeOpen && (
          <div className="mb-8 bg-white border border-gray-200 p-6 rounded-sm shadow-sm relative overflow-hidden animate-in slide-in-from-top-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Icons.Brain /> 名簿テキスト 一発登録 (法人番号ぶっこ抜き)
              </h3>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm shadow-inner">
                  <p className="text-[10px] text-gray-500 mb-3">
                      Googleで <code>site:info.gbiz.go.jp 北海道浦河郡 電気工事</code> と検索し、その結果のテキストをここに貼り付けてください。13桁の法人番号を瞬時に引き抜いて登録します。
                  </p>
                  <textarea 
                      className="w-full p-3 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900 shadow-sm min-h-[120px] leading-relaxed" 
                      placeholder="Googleの検索結果テキストを全選択（Ctrl+A）して、ここにコピー＆ペースト..." 
                      value={catchInput} 
                      onChange={e => setCatchInput(e.target.value)} 
                      disabled={isGenerating} 
                  />
                  <div className="flex justify-end mt-3">
                      <button 
                          onClick={handleCatchLead} 
                          disabled={isGenerating || !catchInput}
                          className="bg-gray-900 text-white px-6 py-3 rounded-sm text-sm font-bold shadow-md hover:bg-black transition flex items-center gap-2 disabled:opacity-50"
                      >
                          {isGenerating ? <><Icons.Refresh /> 情報を精査中...</> : <><Icons.Plus /> テキストから抽出・登録</>}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* 検索とフィルター */}
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm flex flex-col md:flex-row gap-4 mb-6 shadow-sm">
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            <input 
                type="text" placeholder="企業名、エリア、法人番号で検索..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#D32F2F]"
            />
        </div>
      </div>

      {/* リスト表示部分 */}
      <div className="space-y-4">
          {filteredTargets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-16 text-center text-gray-400 font-bold shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Icons.Target /></div>
                  <p className="text-gray-900 text-lg mb-1">ターゲットが登録されていません</p>
                  <p className="text-xs font-normal">上の「エリア一括抽出」ボタンから、企業データを取得してください。</p>
              </div>
          ) : (
              filteredTargets.reverse().map((t: any) => {
                  const hasCorpNumber = t.corporateNumber && t.corporateNumber.trim() !== '';
                  const isClient = t.status === '既存取引先';
                  
                  let displayMemo = t.memo || '';
                  let dmText = '';
                  if (displayMemo.includes('【🤖 AI作成 DM・FAX送信用原稿】')) {
                      const parts = displayMemo.split('【🤖 AI作成 DM・FAX送信用原稿】');
                      displayMemo = parts[0].trim();
                      dmText = parts[1].trim();
                  }

                  return (
                      <div key={t.id} className={`bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col group transition-all duration-300 ${isClient ? 'border-gray-200 opacity-70 bg-gray-50' : 'border-gray-300 hover:border-gray-500 hover:shadow-md'}`}>
                          
                          {/* ヘッダー */}
                          <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                  <span className={`flex items-center justify-center w-8 h-8 rounded-sm text-sm font-black shadow-sm shrink-0 ${t.priority === 'S' ? 'bg-[#D32F2F] text-white' : t.priority === 'A' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}>
                                      {t.priority || 'B'}
                                  </span>
                                  <div>
                                      <h3 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-2">
                                          {t.company}
                                          {hasCorpNumber && <ProvenanceBadge type="GBIZ_VERIFIED" />}
                                      </h3>
                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] text-gray-500 font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded-sm">{t.industry || '業種不明'}</span>
                                          <span className="text-[10px] text-gray-400 font-mono tracking-widest flex items-center gap-0.5"><Icons.MapPin /> {t.area || t.address}</span>
                                          {hasCorpNumber && <span className="text-[9px] text-gray-400 font-mono">法人番号: {t.corporateNumber}</span>}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                  <select 
                                      value={t.status || '未確認'} 
                                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                      disabled={isClient}
                                      className={`p-2 text-xs font-bold rounded-sm border outline-none cursor-pointer shadow-sm transition-colors ${
                                          t.status === 'アプローチ中' ? 'bg-gray-800 border-gray-900 text-white' :
                                          t.status === '見送り' ? 'bg-gray-100 border-gray-300 text-gray-500' :
                                          'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                                      }`}
                                  >
                                      <option value="未確認">未確認</option>
                                      <option value="確認中">潜在リード</option>
                                      <option value="アプローチ中">アプローチ中</option>
                                      <option value="見送り">見送り</option>
                                  </select>
                                  <button onClick={() => handleDeleteTarget(t.id)} className="text-xs bg-white text-red-600 border border-red-200 px-3 py-2 rounded-sm font-bold shadow-sm hover:bg-red-50 hover:border-red-300 transition flex items-center gap-1" title="削除"><Icons.Trash /></button>
                              </div>
                          </div>

                          {/* ボディ */}
                          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                              <div className="w-full lg:w-1/3 p-4 bg-white space-y-3 shrink-0">
                                  <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">代表者名</p>
                                      <p className="text-sm font-bold text-gray-800">{t.representative || '-'}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">資本金</p>
                                          <p className="text-sm font-bold text-gray-800">{t.capital || '-'}</p>
                                      </div>
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">設立/創業</p>
                                          <p className="text-sm font-bold text-gray-800">{t.founded || '-'}</p>
                                      </div>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">事業概要 (gBizINFO)</p>
                                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{t.businessSummary || '-'}</p>
                                  </div>
                                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5"><Icons.Phone /> 電話番号</p>
                                          <p className="text-xs font-mono font-bold text-gray-800">{t.contact || '調査中'}</p>
                                      </div>
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5"><Icons.Globe /> Web</p>
                                          <a href={t.website} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-600 hover:underline truncate block">{t.website || '-'}</a>
                                      </div>
                                  </div>
                              </div>

                              <div className="w-full lg:w-2/3 p-4 bg-gray-50/50 flex flex-col gap-4">
                                  <div className="flex-1 bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">AI分析: ターゲット選定の理由 (排出量推測: <span className="text-[#D32F2F] font-black">{t.volume}</span>)</p>
                                      <p className="text-sm text-gray-800 leading-relaxed font-medium">{t.reason || '理由データなし'}</p>
                                  </div>
                                  <div className="flex-1 bg-gray-900 p-4 rounded-sm border border-gray-800 shadow-inner text-white relative overflow-hidden">
                                      <div className="absolute top-2 right-2 opacity-10"><Icons.Brain /></div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-700 pb-1">AI生成: 提案シナリオ</p>
                                      <p className="text-sm text-gray-200 leading-relaxed font-bold relative z-10">{t.proposal || '提案データなし'}</p>
                                  </div>
                              </div>
                          </div>

                          {dmText && (
                              <details className="bg-blue-50/50 border-t border-blue-100 group">
                                  <summary className="p-3 text-xs font-bold text-blue-800 cursor-pointer hover:bg-blue-50 select-none flex items-center gap-2">
                                      <Icons.Document /> 自動生成されたDM・FAX送信用原稿を表示
                                  </summary>
                                  <div className="p-4 pt-0">
                                      <textarea readOnly className="w-full h-32 p-3 text-xs text-gray-700 bg-white border border-blue-200 rounded-sm outline-none resize-y" value={dmText} />
                                  </div>
                              </details>
                          )}
                      </div>
                  )
              })
          )}
      </div>
    </div>
  );
};
