// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Location: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Building: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Fire: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
};

export const AdminSales = ({ data }: { data: any }) => {
  // 検索・フィルター用ステート
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('未確認'); // デフォルトは「未確認」を表示
  const [filterArea, setFilterArea] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');

  // 編集用ステート
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editMemo, setEditMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const targets = data?.salesTargets || [];

  // ==========================================
  // 1. ダッシュボード用：各種統計データの算出
  // ==========================================
  const stats = useMemo(() => {
      const areaCount: Record<string, number> = {};
      const industryCount: Record<string, number> = {};
      const priorityCount = { S: 0, A: 0, B: 0 };
      const statusCount = { '未確認': 0, 'アプローチ中': 0, '既存取引先': 0, '取引停止': 0 };

      targets.forEach((t: any) => {
          if (t.area) areaCount[t.area] = (areaCount[t.area] || 0) + 1;
          if (t.industry) industryCount[t.industry] = (industryCount[t.industry] || 0) + 1;
          if (priorityCount[t.priority as keyof typeof priorityCount] !== undefined) priorityCount[t.priority as keyof typeof priorityCount]++;
          if (statusCount[t.status as keyof typeof statusCount] !== undefined) statusCount[t.status as keyof typeof statusCount]++;
      });

      // エリア上位5件
      const topAreas = Object.entries(areaCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const maxArea = topAreas.length > 0 ? topAreas[0][1] : 1;

      // 業種上位5件
      const topIndustries = Object.entries(industryCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const maxIndustry = topIndustries.length > 0 ? topIndustries[0][1] : 1;

      return { topAreas, maxArea, topIndustries, maxIndustry, priorityCount, statusCount, total: targets.length };
  }, [targets]);

  // ==========================================
  // 2. リスト用：フィルター処理
  // ==========================================
  const filteredTargets = useMemo(() => {
    return targets.filter((t: any) => {
      const matchSearch = t.company.toLowerCase().includes(searchTerm.toLowerCase()) || t.address.includes(searchTerm);
      const matchPriority = filterPriority ? t.priority === filterPriority : true;
      const matchStatus = filterStatus ? t.status === filterStatus : true;
      const matchArea = filterArea ? t.area === filterArea : true;
      const matchIndustry = filterIndustry ? t.industry === filterIndustry : true;
      return matchSearch && matchPriority && matchStatus && matchArea && matchIndustry;
    });
  }, [targets, searchTerm, filterPriority, filterStatus, filterArea, filterIndustry]);

  const handleEdit = (target: any) => {
    setEditingId(target.id);
    setEditStatus(target.status || '未確認');
    setEditMemo(target.memo || '');
  };

  const handleSave = async (id: string) => {
    setIsSaving(true);
    // CSV列構成: ID(0),会社(1),住所(2),エリア(3),優先度(4),業種(5),排出量(6),根拠(7),提案(8),WN(9),ステータス(10),連絡先(11),Web(12),メモ(13)
    const updates = { 10: editStatus, 13: editMemo };
    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates }) });
      const result = await res.json();
      if (result.status === 'success') { setEditingId(null); window.location.reload(); }
      else { alert('エラー: ' + result.message); }
    } catch (e) { alert('通信エラーが発生しました'); }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full pb-8">
      
      {/* 🔴 ヘッダー */}
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Icons.Briefcase /> 営業戦略ダッシュボード</h2>
          <p className="text-base text-gray-500 mt-2">全 {stats.total} 社のターゲットリスト。エリアや業種から今日の営業ルートを組み立てます。</p>
        </div>
      </header>

      {/* 🔴 戦略ダッシュボード・パネル群 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* 1. 優先度＆進捗サマリー */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-2 -top-2 opacity-10"><Icons.Fire /></div>
              <h3 className="text-base font-bold text-gray-300 flex items-center gap-2 mb-4"><Icons.Fire /> ターゲット優先度 (熱量)</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 cursor-pointer hover:bg-red-500/30 transition" onClick={() => setFilterPriority('S')}>
                      <p className="text-sm font-bold text-red-300 mb-1">ランク S</p>
                      <p className="text-3xl font-black text-white">{stats.priorityCount.S}</p>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-3 cursor-pointer hover:bg-orange-500/30 transition" onClick={() => setFilterPriority('A')}>
                      <p className="text-sm font-bold text-orange-300 mb-1">ランク A</p>
                      <p className="text-3xl font-black text-white">{stats.priorityCount.A}</p>
                  </div>
                  <div className="bg-gray-700/50 border border-gray-600 rounded-xl p-3 cursor-pointer hover:bg-gray-700 transition" onClick={() => setFilterPriority('B')}>
                      <p className="text-sm font-bold text-gray-400 mb-1">ランク B</p>
                      <p className="text-3xl font-black text-white">{stats.priorityCount.B}</p>
                  </div>
              </div>
          </div>

          {/* 2. エリア別 分布 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-4"><Icons.Location /> 主要ターゲットエリア</h3>
              <div className="space-y-3 flex-1">
                  {stats.topAreas.map(([area, count]) => (
                      <div key={area} className="group cursor-pointer" onClick={() => setFilterArea(area === filterArea ? '' : area)}>
                          <div className="flex justify-between items-center text-sm font-bold mb-1">
                              <span className={area === filterArea ? 'text-[#D32F2F]' : 'text-gray-700 group-hover:text-red-500 transition'}>{area}</span>
                              <span className="text-gray-500">{count} 社</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div className={`h-2 rounded-full transition-all duration-500 ${area === filterArea ? 'bg-[#D32F2F]' : 'bg-blue-300 group-hover:bg-red-300'}`} style={{ width: `${(count / stats.maxArea) * 100}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 3. 業種別 分布 */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 mb-4"><Icons.Building /> ターゲット業種</h3>
              <div className="space-y-3 flex-1">
                  {stats.topIndustries.map(([industry, count]) => (
                      <div key={industry} className="group cursor-pointer" onClick={() => setFilterIndustry(industry === filterIndustry ? '' : industry)}>
                          <div className="flex justify-between items-center text-sm font-bold mb-1">
                              <span className={industry === filterIndustry ? 'text-[#D32F2F]' : 'text-gray-700 group-hover:text-red-500 transition'}>{industry}</span>
                              <span className="text-gray-500">{count} 社</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div className={`h-2 rounded-full transition-all duration-500 ${industry === filterIndustry ? 'bg-[#D32F2F]' : 'bg-emerald-300 group-hover:bg-red-300'}`} style={{ width: `${(count / stats.maxIndustry) * 100}%` }}></div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* 🔴 リスト操作・フィルターバー */}
      <div className="bg-white p-5 rounded-t-2xl border-t border-l border-r border-gray-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
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
            {(filterArea || filterIndustry) && (
                <button onClick={() => { setFilterArea(''); setFilterIndustry(''); }} className="px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition">
                    エリア/業種絞り込み解除
                </button>
            )}
        </div>
      </div>

      {/* 🔴 ターゲットリスト本体 */}
      <div className="bg-white rounded-b-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-600">表示中のターゲット: <span className="text-lg font-black text-gray-900">{filteredTargets.length}</span> 社</span>
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
                          <tr><td colSpan={5} className="p-10 text-center text-gray-400 font-bold">条件に一致するターゲットが見つかりません</td></tr>
                      ) : filteredTargets.map((target: any) => (
                          <tr key={target.id} className="hover:bg-blue-50/30 transition">
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
