// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Database: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Save: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
};

export const AdminDatabase = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'WIRES' | 'CASTINGS'>('CLIENTS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const clients = data?.clients || [];
  const wires = data?.wires || [];
  const castings = data?.castings || []; // ★ 非鉄マスターを追加

  const handleEditClick = (record: any, type: 'CLIENTS' | 'WIRES' | 'CASTINGS') => {
      setEditingId(record.id);
      if (type === 'CLIENTS') setEditForm({ name: record.name, phone: record.phone, memo: record.memo });
      else if (type === 'WIRES') setEditForm({ name: record.name, ratio: record.ratio });
      else if (type === 'CASTINGS') setEditForm({ name: record.name, ratio: record.ratio, type: record.type });
  };

  const handleSave = async (sheetName: string, id: string) => {
      setIsSaving(true);
      let updates = {};
      if (sheetName === 'Clients') updates = { 1: editForm.name, 4: editForm.phone, 8: editForm.memo };
      else if (sheetName === 'Products_Wire') updates = { 2: editForm.name, 6: editForm.ratio };
      else if (sheetName === 'Products_Casting') updates = { 1: editForm.name, 4: editForm.ratio }; // ★ 非鉄の更新設定

      try {
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: sheetName, recordId: id, updates: updates }) });
          const result = await res.json();
          if (result.status === 'success') { setEditingId(null); window.location.reload(); } 
          else { alert('保存に失敗しました: ' + result.message); }
      } catch (error) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-8 flex-shrink-0 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Icons.Database /> データベース管理
        </h2>
        <p className="text-base text-gray-500 mt-2">スプレッドシートを開かずに、顧客データやマスター設定を直接書き換えます。</p>
      </header>

      <div className="flex gap-3 mb-6 flex-shrink-0 overflow-x-auto pb-2">
          <button onClick={() => { setActiveTab('CLIENTS'); setEditingId(null); }} className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === 'CLIENTS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>👥 顧客データベース</button>
          <button onClick={() => { setActiveTab('WIRES'); setEditingId(null); }} className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === 'WIRES' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>🔌 電線マスター (銅率)</button>
          <button onClick={() => { setActiveTab('CASTINGS'); setEditingId(null); }} className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === 'CASTINGS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>⚙️ 非鉄マスター (歩留まり)</button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0 relative">
          
          {/* CLIENTS タブ */}
          {activeTab === 'CLIENTS' && (
              <div className="overflow-y-auto flex-1 p-0">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                          <tr>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[25%]">顧客名・社名</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[20%]">電話番号</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[40%]">引継ぎメモ</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[15%] text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {clients.map((client: any) => (
                              <tr key={client.id} className="hover:bg-gray-50 transition">
                                  {editingId === client.id ? (
                                      <>
                                          <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-base font-bold outline-none focus:border-[#D32F2F]" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                                          <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-[#D32F2F]" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></td>
                                          <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-[#D32F2F]" value={editForm.memo} onChange={e => setEditForm({...editForm, memo: e.target.value})} /></td>
                                          <td className="p-3 text-right space-x-2">
                                              <button onClick={() => handleSave('Clients', client.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"><Icons.Save /> 保存</button>
                                              <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"><Icons.Cancel /></button>
                                          </td>
                                      </>
                                  ) : (
                                      <>
                                          <td className="p-4 font-bold text-gray-900 text-base">{client.name}</td>
                                          <td className="p-4 text-sm text-gray-600 font-mono">{client.phone || '-'}</td>
                                          <td className="p-4 text-sm text-gray-500">{client.memo || '-'}</td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleEditClick(client, 'CLIENTS')} className="text-gray-400 hover:text-[#D32F2F] transition flex items-center justify-end gap-1 ml-auto text-sm font-bold">
                                                  <Icons.Edit /> 編集
                                              </button>
                                          </td>
                                      </>
                                  )}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          {/* WIRES タブ */}
          {activeTab === 'WIRES' && (
              <div className="overflow-y-auto flex-1 p-0">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                          <tr>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[50%]">品名 / 詳細 (メーカー・サイズ・芯数)</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[30%]">マスター歩留まり (銅率 %)</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[20%] text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {wires.map((wire: any) => (
                              <tr key={wire.id} className="hover:bg-gray-50 transition">
                                  {editingId === wire.id ? (
                                      <>
                                          <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-base font-bold outline-none focus:border-[#D32F2F]" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                                          <td className="p-3">
                                              <div className="relative w-32">
                                                  <input type="number" className="w-full border p-2.5 pr-8 rounded-lg text-lg font-black text-[#D32F2F] outline-none focus:border-[#D32F2F]" value={editForm.ratio} onChange={e => setEditForm({...editForm, ratio: e.target.value})} />
                                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                              </div>
                                          </td>
                                          <td className="p-3 text-right space-x-2">
                                              <button onClick={() => handleSave('Products_Wire', wire.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"><Icons.Save /> 保存</button>
                                              <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"><Icons.Cancel /></button>
                                          </td>
                                      </>
                                  ) : (
                                      <>
                                          <td className="p-4">
                                              <div className="font-bold text-gray-900 text-base">{wire.name}</div>
                                              <div className="text-xs text-gray-500 mt-1.5 flex gap-2 font-medium">
                                                  {wire.maker && <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md">{wire.maker}</span>}
                                                  {wire.sq && <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md">{wire.sq}</span>}
                                                  {wire.core && <span className="bg-white border border-gray-200 px-2 py-0.5 rounded-md">{wire.core}</span>}
                                              </div>
                                          </td>
                                          <td className="p-4">
                                              <span className="bg-red-50 text-[#D32F2F] px-3 py-1.5 rounded-lg text-base font-black border border-red-100 shadow-sm">
                                                  {wire.ratio} %
                                              </span>
                                          </td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleEditClick(wire, 'WIRES')} className="text-gray-400 hover:text-[#D32F2F] transition flex items-center justify-end gap-1 ml-auto text-sm font-bold">
                                                  <Icons.Edit /> 編集
                                              </button>
                                          </td>
                                      </>
                                  )}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          {/* ★ 新規: CASTINGS タブ */}
          {activeTab === 'CASTINGS' && (
              <div className="overflow-y-auto flex-1 p-0">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                          <tr>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[40%]">品名 / 種別</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[40%]">マスター歩留まり (%)</th>
                              <th className="p-4 text-sm font-bold text-gray-500 w-[20%] text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {castings.map((casting: any) => (
                              <tr key={casting.id} className="hover:bg-gray-50 transition">
                                  {editingId === casting.id ? (
                                      <>
                                          <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-base font-bold outline-none focus:border-[#D32F2F]" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                                          <td className="p-3">
                                              <div className="relative w-32">
                                                  <input type="number" className="w-full border p-2.5 pr-8 rounded-lg text-lg font-black text-[#D32F2F] outline-none focus:border-[#D32F2F]" value={editForm.ratio} onChange={e => setEditForm({...editForm, ratio: e.target.value})} />
                                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                              </div>
                                          </td>
                                          <td className="p-3 text-right space-x-2">
                                              <button onClick={() => handleSave('Products_Casting', casting.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"><Icons.Save /> 保存</button>
                                              <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"><Icons.Cancel /></button>
                                          </td>
                                      </>
                                  ) : (
                                      <>
                                          <td className="p-4">
                                              <div className="font-bold text-gray-900 text-base">{casting.name}</div>
                                              <div className="text-xs text-gray-500 mt-1 flex gap-2 font-medium">
                                                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md">{casting.type}</span>
                                              </div>
                                          </td>
                                          <td className="p-4">
                                              <span className="bg-red-50 text-[#D32F2F] px-3 py-1.5 rounded-lg text-base font-black border border-red-100 shadow-sm">
                                                  {casting.ratio} %
                                              </span>
                                          </td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleEditClick(casting, 'CASTINGS')} className="text-gray-400 hover:text-[#D32F2F] transition flex items-center justify-end gap-1 ml-auto text-sm font-bold">
                                                  <Icons.Edit /> 編集
                                              </button>
                                          </td>
                                      </>
                                  )}
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>
    </div>
  );
};
