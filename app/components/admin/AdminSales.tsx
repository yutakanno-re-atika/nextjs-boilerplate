// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Search: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Phone: () => <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Save: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Fire: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  XCircle: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  UserAdd: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Robot: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); 
  const [filterArea, setFilterArea] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editMemo, setEditMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [isGeneratingLeads, setIsGeneratingLeads] = useState(false);

  // ★ 印刷用レポートのステート
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

  const targets = data?.salesTargets || [];

  const masterStats = useMemo(() => {
      const areaCount: Record<string, number> = {};
      const industryCount: Record<string, number> = {};
      targets.forEach((t: any) => {
          const a = (t.area || '').trim();
          const i = (t.industry || '').trim();
          if (a) areaCount[a] = (areaCount[a] || 0) + 1;
          if (i) industryCount[i] = (industryCount[i] || 0) + 1;
      });
      const topAreas = Object.entries(areaCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
      const topIndustries = Object.entries(industryCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x[0]);
      return { topAreas, topIndustries, total: targets.length };
  }, [targets]);

  const filteredTargets = useMemo(() => {
    return targets.filter((t: any) => {
      const tCompany = (t.company || '').toLowerCase().replace(/　/g, ' '); 
      const tAddress = (t.address || '').toLowerCase();
      const tPriority = (t.priority || '').trim();
      const tStatus = (t.status || '未確認').trim();
      const tArea = (t.area || '').trim();
      const tIndustry = (t.industry || '').trim();

      const matchSearch = searchTerm === '' || tCompany.includes(searchTerm.toLowerCase().trim()) || tAddress.includes(searchTerm.toLowerCase().trim());
      const matchPriority = filterPriority === '' || tPriority === filterPriority;
      const matchStatus = filterStatus === '' || tStatus === filterStatus;
      const matchArea = filterArea === '' || tArea === filterArea;
      const matchIndustry = filterIndustry === '' || tIndustry === filterIndustry;
      
      return matchSearch && matchPriority && matchStatus && matchArea && matchIndustry;
    });
  }, [targets, searchTerm, filterPriority, filterStatus, filterArea, filterIndustry]);

  const currentStats = useMemo(() => {
      const areaCount: Record<string, number> = {};
      const industryCount: Record<string, number> = {};
      const priorityCount = { S: 0, A: 0, B: 0, All_S: 0, All_A: 0, All_B: 0 };
      
      targets.forEach((t: any) => {
          const p = (t.priority || '').trim();
          if (p === 'S') priorityCount.All_S++;
          if (p === 'A') priorityCount.All_A++;
          if (p === 'B') priorityCount.All_B++;
      });

      filteredTargets.forEach((t: any) => {
          const p = (t.priority || '').trim();
          const a = (t.area || '').trim();
          const i = (t.industry || '').trim();
          if (a) areaCount[a] = (areaCount[a] || 0) + 1;
          if (i) industryCount[i] = (industryCount[i] || 0) + 1;
          if (priorityCount[p as keyof typeof priorityCount] !== undefined) priorityCount[p as keyof typeof priorityCount]++;
      });

      return { areaCount, industryCount, priorityCount };
  }, [targets, filteredTargets]);

  const handleEdit = (target: any) => {
    setEditingId(target.id);
    setEditStatus((target.status || '未確認').trim());
    setEditMemo(target.memo || '');
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    const updates = { 10: editStatus, 13: editMemo };
    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates }) });
      const result = await res.json();
      if (result.status === 'success') { setEditingId(null); window.location.reload(); }
      else { alert('エラー: ' + result.message); }
    } catch (e) { alert('通信エラーが発生しました'); }
    setIsSaving(false);
  };

  const handleConvertToClient = async (target: any) => {
    if(!window.confirm(`${target.company} を顧客マスターに登録しますか？\n（営業リストのステータスも「既存取引先」に自動変更されます）`)) return;
    setIsSaving(true);
    try {
        const res = await fetch('/api/gas', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'CONVERT_TARGET_TO_CLIENT', targetId: target.id })
        });
        const result = await res.json();
        if (result.status === 'success') { window.location.reload(); } 
        else { alert('エラー: ' + result.message); }
    } catch (e) { alert('通信エラーが発生しました'); }
    setIsSaving(false);
  };

  const clearFilters = () => {
      setSearchTerm(''); setFilterPriority(''); setFilterStatus(''); setFilterArea(''); setFilterIndustry('');
  };

  const handleGenerateLeads = async () => {
      if (!window.confirm("AIを使用して北海道周辺の「解体業者・電気設備業者」の有望リストを5件自動抽出しますか？\n（完了まで10〜20秒程度かかります）")) return;
      
      setIsGeneratingLeads(true);
      try {
          const res = await fetch('/api/lead-gen', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ area: '北海道 苫小牧市周辺、札幌市周辺', industry: '解体工事業、電気通信工事業', count: 5 })
          });
          const result = await res.json();
          if (result.success) {
              alert(`AIが ${result.count} 件の有望なターゲットを抽出・生成し、データベースに登録しました！\n画面をリロードします。`);
              window.location.reload();
          } else {
              alert('AIの生成中にエラーが発生しました: ' + result.message);
          }
      } catch (e) {
          alert('通信エラーが発生しました');
      }
      setIsGeneratingLeads(false);
  };

  // ★ 印刷＆AI要約機能ハンドラ
  const handlePrintReport = async () => {
      if(filteredTargets.length === 0) {
          alert('印刷するターゲットがありません。AIリード自動収集を実行するか、検索条件をクリアしてください。');
          return;
      }
      
      setIsGeneratingReport(true);
      
      const uniqueAreas = [...new Set(filteredTargets.map((t:any)=>t.area).filter(Boolean))].slice(0, 3).join(', ');
      const uniqueIndustries = [...new Set(filteredTargets.map((t:any)=>t.industry).filter(Boolean))].slice(0, 3).join(', ');

      const promptData = `
      ・現在リストアップされているターゲット数: ${filteredTargets.length} 件
      ・内訳: ランクS ${currentStats.priorityCount.S}件, ランクA ${currentStats.priorityCount.A}件
      ・主な抽出エリア: ${uniqueAreas || '指定なし'}
      ・主な業種: ${uniqueIndustries || '指定なし'}
      
      ※工場長や営業担当者に渡す『本日の営業アプローチ用リスト』です。上記のデータをもとに、どういった優先順位で回るべきか、どの業種を狙うべきかなど、現場目線で鋭く実践的な戦略アドバイスを記述してください。
      `;

      try {
          const res = await fetch('/api/print-summary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pageName: '本日の営業ターゲット リスト', promptData })
          });
          const result = await res.json();
          if (result.success) {
              setAiSummary(result.summary);
              setTimeout(() => {
                  window.print();
                  setIsGeneratingReport(false);
              }, 500);
          } else {
              alert('AI要約の生成に失敗しました: ' + result.message);
              setIsGeneratingReport(false);
          }
      } catch(e) {
          alert('通信エラーが発生しました');
          setIsGeneratingReport(false);
      }
  };

  return (
    <div className="flex flex-col animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-12 text-gray-800 relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* --- 通常の画面 (印刷時は非表示) --- */}
      <div className="print:hidden flex flex-col h-full w-full">
          <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-4 mb-6 mt-2 gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight font-serif flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                  営業ターゲット
              </h2>
              <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-widest ml-3">Total: {masterStats.total} Companies</p>
            </div>
            {/* ★ 印刷ボタン */}
            <button 
                onClick={handlePrintReport} 
                disabled={isGeneratingReport || filteredTargets.length === 0}
                className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-sm text-sm font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isGeneratingReport ? <Icons.Refresh /> : <Icons.Print />}
                {isGeneratingReport ? 'AIが戦略を立案中...' : 'このリストをレポート印刷'}
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#111] p-5 rounded-sm shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150 text-[#D32F2F]"><Icons.Fire /></div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">優先度分布</h3>
                  <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                      <div className={`p-2 rounded-sm border transition ${filterPriority === 'S' ? 'bg-[#D32F2F]/20 border-[#D32F2F]' : 'border-gray-800 hover:border-gray-600 cursor-pointer'}`} onClick={() => setFilterPriority(filterPriority === 'S' ? '' : 'S')}>
                          <p className="text-[10px] text-gray-400 mb-1">Rank S</p>
                          <p className="text-2xl font-black font-mono">{currentStats.priorityCount.S}</p>
                      </div>
                      <div className={`p-2 rounded-sm border transition ${filterPriority === 'A' ? 'bg-white/10 border-white/30' : 'border-gray-800 hover:border-gray-600 cursor-pointer'}`} onClick={() => setFilterPriority(filterPriority === 'A' ? '' : 'A')}>
                          <p className="text-[10px] text-gray-400 mb-1">Rank A</p>
                          <p className="text-2xl font-black font-mono">{currentStats.priorityCount.A}</p>
                      </div>
                      <div className={`p-2 rounded-sm border transition ${filterPriority === 'B' ? 'bg-white/10 border-white/30' : 'border-gray-800 hover:border-gray-600 cursor-pointer'}`} onClick={() => setFilterPriority(filterPriority === 'B' ? '' : 'B')}>
                          <p className="text-[10px] text-gray-400 mb-1">Rank B</p>
                          <p className="text-2xl font-black font-mono">{currentStats.priorityCount.B}</p>
                      </div>
                  </div>
              </div>

              <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">エリア分布</h3>
                  <div className="space-y-2 flex-1">
                      {masterStats.topAreas.map((area) => {
                          const isActive = filterArea === area;
                          const isDimmed = filterArea !== '' && filterArea !== area;
                          const count = currentStats.areaCount[area] || 0; 
                          const maxTarget = Math.max(...Object.values(currentStats.areaCount), 1); 
                          return (
                              <div key={area} className={`group cursor-pointer transition ${isDimmed ? 'opacity-30' : 'opacity-100'}`} onClick={() => setFilterArea(isActive ? '' : area)}>
                                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                                      <span className={isActive ? 'text-[#D32F2F]' : 'text-gray-700'}>{area}</span>
                                      <span className="font-mono text-gray-900">{count}</span>
                                  </div>
                                  <div className="w-full bg-gray-100 h-1.5 overflow-hidden">
                                      <div className={`h-1.5 transition-all duration-500 ${isActive ? 'bg-[#D32F2F]' : 'bg-gray-300'}`} style={{ width: `${(count / maxTarget) * 100}%` }}></div>
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>

              <div className="bg-white p-5 rounded-sm border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">業種分布</h3>
                  <div className="space-y-2 flex-1">
                      {masterStats.topIndustries.map((industry) => {
                          const isActive = filterIndustry === industry;
                          const isDimmed = filterIndustry !== '' && filterIndustry !== industry;
                          const count = currentStats.industryCount[industry] || 0;
                          const maxTarget = Math.max(...Object.values(currentStats.industryCount), 1);
                          return (
                              <div key={industry} className={`group cursor-pointer transition ${isDimmed ? 'opacity-30' : 'opacity-100'}`} onClick={() => setFilterIndustry(isActive ? '' : industry)}>
                                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                                      <span className={isActive ? 'text-[#D32F2F]' : 'text-gray-700'}>{industry}</span>
                                      <span className="font-mono text-gray-900">{count}</span>
                                  </div>
                                  <div className="w-full bg-gray-100 h-1.5 overflow-hidden">
                                      <div className={`h-1.5 transition-all duration-500 ${isActive ? 'bg-[#D32F2F]' : 'bg-gray-300'}`} style={{ width: `${(count / maxTarget) * 100}%` }}></div>
                                  </div>
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 flex flex-col lg:flex-row gap-4 items-center mb-1">
            <div className="flex-1 flex flex-col md:flex-row gap-3 w-full">
                <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.Search /></div>
                    <input type="text" placeholder="企業名や住所で検索..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 text-sm font-bold outline-none focus:border-[#D32F2F] rounded-sm transition shadow-inner" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                
                <button 
                    onClick={handleGenerateLeads} 
                    disabled={isGeneratingLeads} 
                    className="bg-white border border-[#D32F2F] text-[#D32F2F] px-4 py-2.5 rounded-sm text-sm font-bold hover:bg-red-50 transition flex justify-center items-center gap-2 disabled:opacity-50 shadow-sm whitespace-nowrap"
                >
                    {isGeneratingLeads ? <span className="animate-spin"><Icons.Refresh /></span> : <Icons.Robot />}
                    {isGeneratingLeads ? 'AIがリスト抽出中...' : 'AI リード自動収集'}
                </button>
            </div>

            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <select className="px-3 py-2.5 bg-white border border-gray-300 text-xs font-bold outline-none cursor-pointer rounded-sm" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                    <option value="">すべての優先度</option>
                    <option value="S">S (激アツ)</option>
                    <option value="A">A (高)</option>
                    <option value="B">B (中)</option>
                </select>
                <select className="px-3 py-2.5 bg-white border border-gray-300 text-xs font-bold outline-none cursor-pointer rounded-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">すべてのステータス</option>
                    <option value="未確認">未確認</option>
                    <option value="アプローチ中">アプローチ中</option>
                    <option value="既存取引先">既存取引先</option>
                </select>
                {(searchTerm || filterPriority || filterStatus || filterArea || filterIndustry) && (
                    <button onClick={clearFilters} className="px-3 py-2.5 text-xs font-bold text-[#D32F2F] bg-white border border-red-200 hover:bg-red-50 transition rounded-sm flex items-center">
                        <Icons.XCircle /> 条件クリア
                    </button>
                )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col rounded-sm mt-4 min-h-[600px]">
              <div className="flex-1 overflow-y-auto overflow-x-auto p-0">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                          <tr>
                              <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase w-[25%]">企業情報</th>
                              <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase w-[10%] text-center">ランク</th>
                              <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase w-[25%]">営業根拠・提案</th>
                              <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase w-[20%]">ステータス / メモ</th>
                              <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase w-[20%] text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {filteredTargets.length === 0 ? (
                              <tr><td colSpan={5} className="p-16 text-center text-sm text-gray-400 font-bold bg-white">ターゲットが見つかりません。上のボタンからAIに収集させてみましょう。</td></tr>
                          ) : filteredTargets.map((target: any, idx: number) => (
                              <tr key={`${target.id}-${idx}`} className="hover:bg-gray-50 transition">
                                  <td className="p-4">
                                      <p className="font-bold text-gray-900 text-sm">{target.company}</p>
                                      <div className="text-[10px] text-gray-500 mt-1 flex gap-2 font-mono">
                                          <span className="bg-gray-100 px-1.5 py-0.5 border border-gray-200">{target.area}</span>
                                          <span className="bg-gray-100 px-1.5 py-0.5 border border-gray-200">{target.industry}</span>
                                      </div>
                                      <p className="text-xs text-gray-600 mt-2 font-mono flex items-center"><Icons.Phone /> {target.contact}</p>
                                  </td>
                                  <td className="p-4 text-center">
                                      <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-xs font-black ${target.priority === 'S' ? 'bg-[#D32F2F] text-white' : target.priority === 'A' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                          {target.priority}
                                      </span>
                                  </td>
                                  <td className="p-4">
                                      <p className="text-xs text-gray-900 font-bold leading-relaxed">{target.reason}</p>
                                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed bg-gray-50 p-2 border border-gray-100 rounded-sm">💡 {target.proposal}</p>
                                  </td>
                                  <td className="p-4">
                                      {editingId === target.id ? (
                                          <div className="space-y-2">
                                              <select className="w-full p-2 border border-gray-300 text-xs font-bold outline-none focus:border-[#D32F2F] rounded-sm" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                                                  <option value="未確認">未確認</option>
                                                  <option value="アプローチ中">アプローチ中</option>
                                                  <option value="既存取引先">既存取引先</option>
                                                  <option value="取引停止">取引停止</option>
                                              </select>
                                              <input type="text" className="w-full p-2 border border-gray-300 text-xs outline-none focus:border-[#D32F2F] rounded-sm" placeholder="メモ..." value={editMemo} onChange={e => setEditMemo(e.target.value)} />
                                          </div>
                                      ) : (
                                          <div>
                                              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold mb-1 border rounded-sm ${target.status === '既存取引先' ? 'bg-green-50 text-green-700 border-green-200' : target.status === 'アプローチ中' ? 'bg-blue-50 text-blue-700 border-blue-200' : target.status === '取引停止' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-white text-gray-600 border-gray-300'}`}>
                                                  {target.status || '未確認'}
                                              </span>
                                              <p className="text-xs text-gray-600 font-medium">{target.memo || '-'}</p>
                                          </div>
                                      )}
                                  </td>
                                  <td className="p-4 text-right">
                                      {editingId === target.id ? (
                                          <div className="flex flex-col gap-1.5 items-end">
                                              <button onClick={() => handleSave(target.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold hover:bg-black w-full flex justify-center items-center rounded-sm"><Icons.Save /> 保存</button>
                                              {target.status !== '既存取引先' && (
                                                  <button onClick={() => handleConvertToClient(target)} disabled={isSaving} className="bg-white border border-gray-300 text-gray-900 px-3 py-1.5 text-[10px] font-bold hover:bg-gray-50 w-full flex justify-center items-center rounded-sm"><Icons.UserAdd /> 顧客登録</button>
                                              )}
                                              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-[10px] font-bold py-1 w-full text-center">取消</button>
                                          </div>
                                      ) : (
                                          <button onClick={() => handleEdit(target)} className="text-[10px] font-bold text-gray-500 border border-gray-300 px-3 py-1.5 hover:border-gray-900 hover:text-gray-900 transition rounded-sm">
                                              編集
                                          </button>
                                      )}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      {/* --- 🖨️ 印刷用レポート専用レイアウト (通常時は非表示) --- */}
      <div className="hidden print:block w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto font-sans">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-black font-serif tracking-widest">本日の営業ターゲット リスト</h1>
                  <p className="text-sm font-bold text-gray-600 mt-2">株式会社月寒製作所 苫小牧工場</p>
              </div>
              <div className="text-right">
                  <p className="text-lg font-bold font-mono">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
              </div>
          </div>

          {/* AIサマリーセクション */}
          <section className="mb-8 border-2 border-black p-6 rounded-sm bg-gray-50">
              <h2 className="text-lg font-black text-black flex items-center gap-2 mb-4">
                  <Icons.Brain /> AI参謀からの本日の営業戦略
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-bold text-gray-800">
                  {aiSummary || "（データ処理中です...）"}
              </div>
          </section>

          {/* リスト一覧 */}
          <div className="mb-8">
              <div className="flex justify-between items-center bg-black text-white px-4 py-2 mb-4 font-bold text-sm">
                  <span>抽出条件: {filterArea || '全エリア'} / {filterIndustry || '全業種'}</span>
                  <span>合計: {filteredTargets.length} 件</span>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                  <thead>
                      <tr className="border-b-2 border-black text-xs">
                          <th className="py-2 w-[30%]">企業名 / エリア</th>
                          <th className="py-2 text-center w-[10%]">ランク</th>
                          <th className="py-2 w-[60%]">営業アプローチ根拠・提案シナリオ</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                      {filteredTargets.map((t:any, idx:number) => (
                          <tr key={idx} className="py-2">
                              <td className="py-3 align-top">
                                  <p className="font-bold text-base">{t.company}</p>
                                  <p className="text-[10px] text-gray-600 mt-1">{t.area} / {t.industry}</p>
                                  <p className="text-[10px] font-mono mt-1">TEL: {t.contact || '不明'}</p>
                              </td>
                              <td className="py-3 align-top text-center">
                                  <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-xs font-black ${t.priority === 'S' ? 'bg-black text-white' : 'border border-gray-400 text-gray-800'}`}>
                                      {t.priority}
                                  </span>
                              </td>
                              <td className="py-3 align-top">
                                  <p className="text-xs font-bold text-gray-800 mb-1">【狙い目】 {t.reason}</p>
                                  <p className="text-[10px] text-gray-600 bg-gray-50 p-2 border border-gray-200">💡提案: {t.proposal}</p>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
};
