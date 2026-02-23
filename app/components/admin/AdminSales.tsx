// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Briefcase: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Phone: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Save: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // 編集用ステート
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editMemo, setEditMemo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const targets = data?.salesTargets || [];

  const filteredTargets = useMemo(() => {
    return targets.filter(t => {
      const matchSearch = t.company.toLowerCase().includes(searchTerm.toLowerCase()) || t.address.includes(searchTerm);
      const matchPriority = filterPriority ? t.priority === filterPriority : true;
      const matchStatus = filterStatus ? t.status === filterStatus : true;
      return matchSearch && matchPriority && matchStatus;
    });
  }, [targets, searchTerm, filterPriority, filterStatus]);

  const handleEdit = (target: any) => {
    setEditingId(target.id);
    setEditStatus(target.status);
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
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3"><Icons.Briefcase /> 営業支援ツール (CRM)</h2>
          <p className="text-base text-gray-500 mt-2">全282社のターゲットリスト。ナゲット機(WN-800)の導入提案や新規開拓のステータスを管理します。</p>
        </div>
      </header>

      {/* 検索・フィルター */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative w-full">
            <Icons.Search />
            <input type="text" placeholder="企業名や住所で検索..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-red-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <select className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-gray-50 outline-none flex-1 md:flex-none" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="">全ての優先度</option>
                <option value="S">優先度: S (激アツ)</option>
                <option value="A">優先度: A (高)</option>
                <option value="B">優先度: B (中)</option>
            </select>
            <select className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-bold bg-gray-50 outline-none flex-1 md:flex-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">全てのステータス</option>
                <option value="未確認">未確認</option>
                <option value="アプローチ中">アプローチ中</option>
                <option value="既存取引先">既存取引先</option>
                <option value="取引停止">取引停止</option>
            </select>
        </div>
      </div>

      {/* リスト表示 */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex-1 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-700">該当: {filteredTargets.length} 社</span>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
              <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
                      <tr>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[20%]">企業情報</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[10%]">優先度</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[25%]">営業根拠・提案</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[30%]">ステータス / 営業メモ</th>
                          <th className="p-4 text-sm font-bold text-gray-500 w-[15%] text-right">操作</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {filteredTargets.map((target) => (
                          <tr key={target.id} className="hover:bg-gray-50 transition">
                              <td className="p-4">
                                  <p className="font-bold text-gray-900 text-base">{target.company}</p>
                                  <p className="text-xs text-gray-500 mt-1">{target.area} / {target.industry}</p>
                                  <p className="text-xs text-blue-600 mt-1 font-mono"><Icons.Phone /> {target.contact}</p>
                              </td>
                              <td className="p-4">
                                  <span className={`px-3 py-1 rounded-md text-sm font-black border shadow-sm ${target.priority === 'S' ? 'bg-red-100 text-red-700 border-red-200' : target.priority === 'A' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                      ランク {target.priority}
                                  </span>
                              </td>
                              <td className="p-4">
                                  <p className="text-sm text-gray-800 font-bold">{target.reason}</p>
                                  <p className="text-xs text-gray-500 mt-1">提案: {target.proposal}</p>
                              </td>
                              
                              <td className="p-4">
                                  {editingId === target.id ? (
                                      <div className="space-y-2">
                                          <select className="w-full p-2 border border-gray-300 rounded text-sm outline-none" value={editStatus} onChange={e => setEditStatus(e.target.value)}>
                                              <option value="未確認">未確認</option>
                                              <option value="アプローチ中">アプローチ中</option>
                                              <option value="既存取引先">既存取引先</option>
                                              <option value="取引停止">取引停止</option>
                                          </select>
                                          <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm outline-none" placeholder="メモを入力..." value={editMemo} onChange={e => setEditMemo(e.target.value)} />
                                      </div>
                                  ) : (
                                      <div>
                                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-2 ${target.status === '既存取引先' ? 'bg-green-100 text-green-700' : target.status === 'アプローチ中' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                              {target.status}
                                          </span>
                                          <p className="text-sm text-gray-700">{target.memo || '-'}</p>
                                      </div>
                                  )}
                              </td>

                              <td className="p-4 text-right">
                                  {editingId === target.id ? (
                                      <div className="space-x-2">
                                          <button onClick={() => handleSave(target.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700 shadow-sm"><Icons.Save /> 保存</button>
                                          <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-300">取消</button>
                                      </div>
                                  ) : (
                                      <button onClick={() => handleEdit(target)} className="text-gray-500 hover:text-[#D32F2F] font-bold text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg transition shadow-sm">
                                          営業記録
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
