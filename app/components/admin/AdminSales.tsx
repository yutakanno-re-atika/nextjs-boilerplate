// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Search: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Phone: () => <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Save: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Location: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Building: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Fire: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  XCircle: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  UserAdd: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
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

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-[1400px] mx-auto w-full pb-12 font-sans text-gray-800">
      
      {/* 🔴 Header: Minimal */}
      <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight font-serif">CRM Targets</h2>
          <p className="text-xs font-mono text-gray-500 mt-1 uppercase tracking-widest">Total: {masterStats.total} Companies</p>
        </div>
      </header>

      {/* 🔴 Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111] p-5 rounded-sm shadow-sm text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 scale-150 text-[#D32F2F]"><Icons.Fire /></div>
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Current Priority</h3>
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
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Area Distribution</h3>
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
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Industry Distribution</h3>
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

      {/* 🔴 Search & Filters */}
      <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.Search /></div>
            <input type="text" placeholder="企業名や住所で検索..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 text-sm font-bold outline-none focus:border-[#D32F2F] rounded-sm transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <select className="px-3 py-2 bg-white border border-gray-300 text-xs font-bold outline-none cursor-pointer rounded-sm" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">Priority: ALL</option>
                <option value="S">S (High)</option>
                <option value="A">A (Medium)</option>
                <option value="B">B (Low)</option>
            </select>
            <select className="px-3 py-2 bg-white border border-gray-300 text-xs font-bold outline-none cursor-pointer rounded-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Status: ALL</option>
                <option value="未確認">未確認</option>
                <option value="アプローチ中">アプローチ中</option>
                <option value="既存取引先">既存取引先</option>
            </select>
            {(searchTerm || filterPriority || filterStatus || filterArea || filterIndustry) && (
                <button onClick={clearFilters} className="px-3 py-2 text-xs font-bold text-[#D32F2F] bg-white border border-red-200 hover:bg-red-50 transition rounded-sm flex items-center">
                    <Icons.XCircle /> CLEAR
                </button>
            )}
        </div>
      </div>

      {/* 🔴 Data Table */}
      <div className="bg-white border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col rounded-sm">
          <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                      <tr>
                          <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[25%]">Company</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[10%] text-center">Rank</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[25%]">Context & Proposal</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[20%]">Status / Note</th>
                          <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-[20%] text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {filteredTargets.length === 0 ? (
                          <tr><td colSpan={5} className="p-12 text-center text-xs text-gray-400 font-bold bg-white">No targets found</td></tr>
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
                                          <input type="text" className="w-full p-2 border border-gray-300 text-xs outline-none focus:border-[#D32F2F] rounded-sm" placeholder="Note..." value={editMemo} onChange={e => setEditMemo(e.target.value)} />
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
                                          <button onClick={() => handleSave(target.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold hover:bg-black w-full flex justify-center items-center rounded-sm"><Icons.Save /> SAVE</button>
                                          {target.status !== '既存取引先' && (
                                              <button onClick={() => handleConvertToClient(target)} disabled={isSaving} className="bg-white border border-gray-300 text-gray-900 px-3 py-1.5 text-[10px] font-bold hover:bg-gray-50 w-full flex justify-center items-center rounded-sm"><Icons.UserAdd /> TO CLIENT</button>
                                          )}
                                          <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-[10px] font-bold py-1 w-full text-center">CANCEL</button>
                                      </div>
                                  ) : (
                                      <button onClick={() => handleEdit(target)} className="text-[10px] font-bold text-gray-500 border border-gray-300 px-3 py-1.5 hover:border-gray-900 hover:text-gray-900 transition rounded-sm">
                                          EDIT
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
  );
};
