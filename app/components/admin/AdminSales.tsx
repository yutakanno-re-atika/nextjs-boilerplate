// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Location: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Building: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Fire: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>,
  XCircle: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

  // 1. 全件のマスター集計 (グラフのベース枠を作るため)
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

  // 2. フィルタリング処理（安全な文字列比較）
  const filteredTargets = useMemo(() => {
    return targets.filter((t: any) => {
      const tCompany = (t.company || '').toLowerCase().replace(/　/g, ' '); // 全角スペース対策
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

  // ★ 3. ダッシュボード動的連動：現在表示されている結果の集計
  const currentStats = useMemo(() => {
      const areaCount: Record<string, number> = {};
      const industryCount: Record<string, number> = {};
      const priorityCount = { S: 0, A: 0, B: 0, All_S: 0, All_A: 0, All_B: 0 };
      
      // 全体の優先度数を取得
      targets.forEach(t => {
          const p = (t.priority || '').trim();
          if (p === 'S') priorityCount.All_S++;
          if (p === 'A') priorityCount.All_A++;
          if (p === 'B') priorityCount.All_B++;
      });

      // 絞り込まれた後の数を取得
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

  const clearFilters = () => {
      setSearchTerm(''); setFilterPriority(''); setFilterStatus(''); setFilterArea(''); setFilterIndustry('');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full pb-8">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Icons.Briefcase /> 営業戦略ダッシュボード</h2>
          <p className="text-base text-gray-500 mt-2">全 {masterStats.total} 社のターゲットリスト。条件を絞り込むとグラフも連動して動きます。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* 1. 優先度パネル (ダイナミック表示) */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-2 -top-2 opacity-10"><Icons.Fire /></div>
              <h3 className="text-base font-bold text-gray-300 flex items-center gap-2 mb-4"><Icons.Fire /> 現在の該当ターゲット</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                  <div className={`rounded-xl p-3 cursor-pointer transition ${filterPriority === 'S' ? 'bg-red-500/40 border-red-400 ring-2 ring-red-400 scale-105' : 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30'} border`} onClick={() => setFilterPriority(filterPriority === 'S' ? '' : 'S')}>
                      <p className="text-xs font-bold text-red-300 mb-1">ランク S</p>
                      <p className="text-3xl font-black text-white">{currentStats.priorityCount.S}</p>
                      <p className="text-[10px] text-red-200/50 mt-1">/ 全 {currentStats.priorityCount.All_S}社</p>
                  </div>
                  <div className={`rounded-xl p-3 cursor-pointer transition ${filterPriority === 'A' ? 'bg-orange-500/40 border-orange-400 ring-2 ring-orange-400 scale-105' : 'bg-orange-500/20 border-orange-500/30 hover:bg-orange-500/30'} border`} onClick={() => setFilterPriority(filterPriority === 'A' ? '' : 'A')}>
                      <p className="text-xs font-bold text-orange-300 mb-1">ランク A</p>
                      <p className="text-3xl font-black text-white">{currentStats.priorityCount.A}</p>
                      <p className="text-[10px] text-orange-200/50 mt-1">/ 全 {currentStats.priorityCount.All_A}社</p>
                  </div>
                  <div className={`rounded-xl p-3 cursor-pointer transition ${filterPriority === 'B' ? 'bg-gray-600/70 border-gray-400 ring-2 ring-gray-400 scale-105' : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'} border`} onClick={() => setFilterPriority(filterPriority === 'B' ? '' : 'B')}>
                      <p className="text-xs font-bold text-gray-400 mb-1">ランク B</p>
                      <p className="text-3xl font-black text-white">{currentStats.priorityCount.B}</p>
                      <p className="text-[10px] text-gray-400/50 mt-1">/ 全 {currentStats.priorityCount.All_B}社</p>
                  </div>
              </div>
          </div>

          {/* 2. エリア別 分布 (ダイナミックゲージ) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-4"><Icons.Location /> エリア分布 (現在該当分)</h3>
              <div className="space-y-3 flex-1">
                  {masterStats.topAreas.map((area) => {
                      const isActive = filterArea === area;
                      const isDimmed = filterArea !== '' && filterArea !== area;
                      const count = currentStats.areaCount[area] || 0; // 現在の条件での件数
                      const maxTarget = Math.max(...Object.values(currentStats.areaCount), 1); // ゲージの最大値
                      return (
                          <div key={area} className={`group cursor-pointer transition ${isDimmed ? 'opacity-40' : 'opacity-100'}`} onClick={() => setFilterArea(isActive ? '' : area)}>
                              <div className="flex justify-between items-center text-sm font-bold mb-1">
                                  <span className={isActive ? 'text-[#D32F2F] text-base' : 'text-gray-700 group-hover:text-[#D32F2F] transition'}>{area}</span>
                                  <span className={count === 0 ? 'text-red-400' : 'text-gray-900 font-black'}>{count} 社</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className={`h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[#D32F2F]' : count === 0 ? 'bg-transparent' : 'bg-blue-300 group-hover:bg-[#D32F2F]'}`} style={{ width: `${(count / maxTarget) * 100}%` }}></div>
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>

          {/* 3. 業種別 分布 (ダイナミックゲージ) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-4"><Icons.Building /> 業種分布 (現在該当分)</h3>
              <div className="space-y-3 flex-1">
                  {masterStats.topIndustries.map((industry) => {
                      const isActive = filterIndustry === industry;
                      const isDimmed = filterIndustry !== '' && filterIndustry !== industry;
                      const count = currentStats.industryCount[industry] || 0;
                      const maxTarget = Math.max(...Object.values(currentStats.industryCount), 1);
                      return (
                          <div key={industry} className={`group cursor-pointer transition ${isDimmed ? 'opacity-40' : 'opacity-100'}`} onClick={() => setFilterIndustry(isActive ? '' : industry)}>
                              <div className="flex justify-between items-center text-sm font-bold mb-1">
                                  <span className={isActive ? 'text-[#D32F2F] text-base' : 'text-gray-700 group-hover:text-[#D32F2F] transition'}>{industry}</span>
                                  <span className={count === 0 ? 'text-red-400' : 'text-gray-900 font-black'}>{count} 社</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div className={`h-2 rounded-full transition-all duration-500 ${isActive ? 'bg-[#D32F2F]' : count === 0 ? 'bg-transparent' : 'bg-emerald-300 group-hover:bg-[#D32F2F]'}`} style={{ width: `${(count / maxTarget) * 100}%` }}></div>
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>
      </div>

      <div className="bg-white p-5 rounded-t-2xl border-t border-l border-r border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center relative z-20">
        <div className="flex-1 relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.Search /></div>
            <input type="text" placeholder="企業名や住所で検索..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-base font-bold outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <select className="px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold bg-white outline-none cursor-pointer hover:bg-gray-50 flex-1 sm:flex-none" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">全ての優先度</option>
                <option value="S">優先度: S (激アツ)</option><option value="A">優先度: A (高)</option><option value="B">優先度: B (中)</option>
            </select>
            <select className="px-4 py-3 rounded-xl border border-gray-300 text-sm font-bold bg-white outline-none cursor-pointer hover:bg-gray-50 flex-1 sm:flex-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">全てのステータス</option>
                <option value="未確認">未確認のみ</option>
                <option value="アプローチ中">アプローチ中</option>
                <option value="既存取引先">既存取引先</option>
                <option value="取引停止">取引停止</option>
            </select>
            {(searchTerm || filterPriority || filterStatus || filterArea || filterIndustry) && (
                <button onClick={clearFilters} className="px-4 py-3 rounded-xl text-sm font-bold text-[#D32F2F] bg-red-50 hover:bg-red-100 transition flex items-center border border-red-200">
                    <Icons.XCircle /> 条件クリア
                </button>
            )}
        </div>
      </div>

      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col relative z-10">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">表示中のターゲット: <span className="text-xl font-black text-[#D32F2F] mx-1">{filteredTargets.length}</span> 社</span>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                      <tr>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[25%]">企業情報</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[10%] text-center">優先度</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[25%]">営業根拠・アプローチ提案</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[25%]">ステータス / 営業メモ</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[15%] text-right">操作</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {filteredTargets.length === 0 ? (
                          <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold bg-gray-50">条件に一致するターゲットが見つかりません</td></tr>
                      ) : filteredTargets.map((target: any, idx: number) => (
                          {/* ★ keyを target.id と idx の複合にして残像バグを完全に排除 */}
                          <tr key={`${target.id}-${idx}`} className="hover:bg-blue-50/30 transition">
                              <td className="p-4">
                                  <p className="font-bold text-gray-900 text-base">{target.company}</p>
                                  <div className="text-xs text-gray-500 mt-1.5 flex gap-1.5 font-medium">
                                      <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{target.area}</span>
                                      <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{target.industry}</span>
                                  </div>
                                  <p className="text-sm text-blue-600 mt-2 font-mono font-bold"><Icons.Phone /> {target.contact}</p>
                              </td>
                              <td className="p-4 text-center">
                                  <span className={`inline-block px-3 py-1.5 rounded-lg text-sm font-black border shadow-sm ${target.priority === 'S' ? 'bg-red-100 text-red-700 border-red-200' : target.priority === 'A' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                      {target.priority}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <p className="text-sm text-gray-900 font-bold">{target.reason}</p>
                                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed bg-gray-50 p-2 rounded-md border border-gray-100">💡 {target.proposal}</p>
                              </td>
                              <td className="p-4">
                                  {editingId === target.id ? (
                                      <div className="space-y-2">
                                          <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm font-bold outline-none focus:border-[#D32F2F]" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                                              <option value="未確認">未確認</option>
                                              <option value="アプローチ中">アプローチ中</option>
                                              <option value="既存取引先">既存取引先</option>
                                              <option value="取引停止">取引停止</option>
                                          </select>
                                          <input type="text" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#D32F2F]" placeholder="訪問メモ等を入力..." value={editMemo} onChange={e => setEditMemo(e.target.value)} />
                                      </div>
                                  ) : (
                                      <div>
                                          <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold mb-2 border ${target.status === '既存取引先' ? 'bg-green-100 text-green-700 border-green-200' : target.status === 'アプローチ中' ? 'bg-blue-100 text-blue-700 border-blue-200' : target.status === '取引停止' ? 'bg-gray-200 text-gray-600 border-gray-300' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                              {target.status || '未確認'}
                                          </span>
                                          <p className="text-sm text-gray-700 font-medium">{target.memo || '-'}</p>
                                      </div>
                                  )}
                              </td>
                              <td className="p-4 text-right">
                                  {editingId === target.id ? (
                                      <div className="flex flex-col gap-2 items-end">
                                          <button onClick={() => handleSave(target.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700 shadow-sm w-full flex justify-center items-center"><Icons.Save /> 保存</button>
                                          <button onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 border border-gray-200 w-full">取消</button>
                                      </div>
                                  ) : (
                                      <button onClick={() => handleEdit(target)} className="text-gray-600 hover:text-[#D32F2F] hover:bg-red-50 font-bold text-sm bg-white border border-gray-300 px-4 py-2.5 rounded-xl transition shadow-sm w-full">
                                          営業記録を入力
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
