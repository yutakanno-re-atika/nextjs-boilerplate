// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Database: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Save: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
};

export const AdminDatabase = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'WIRES' | 'CASTINGS'>('CLIENTS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const clients = data?.clients || [];
  const wires = data?.wires || [];
  const castings = data?.castings || [];

  const handleTabChange = (tab: any) => {
      setActiveTab(tab); setEditingId(null); setIsAdding(false); setFormState({});
  };

  const handleEditClick = (record: any) => {
      setEditingId(record.id);
      setIsAdding(false);
      setFormState({ ...record });
  };

  const handleAddClick = () => {
      setIsAdding(true);
      setEditingId(null);
      setFormState({ type: 'BRASS', rank: 'NORMAL', points: 0 }); // デフォルト値
  };

  const getSheetName = () => {
      if (activeTab === 'CLIENTS') return 'Clients';
      if (activeTab === 'WIRES') return 'Products_Wire';
      return 'Products_Casting';
  };

  const formatUpdates = (sheetName: string, form: any) => {
      // スプレッドシートの列（1始まり）に合わせる
      if (sheetName === 'Clients') return { 1: form.name, 2: form.rank, 4: form.phone, 5: form.loginId, 6: form.password, 7: form.points, 8: form.memo };
      if (sheetName === 'Products_Wire') return { 2: form.name, 6: form.ratio };
      if (sheetName === 'Products_Casting') return { 1: form.name, 4: form.ratio, 2: form.type };
      return {};
  };

  const handleSave = async (isNew: boolean, id?: string) => {
      setIsSaving(true);
      const sheetName = getSheetName();
      
      const payload = isNew 
        ? { action: 'ADD_DB_RECORD', sheetName, data: formState }
        : { action: 'UPDATE_DB_RECORD', sheetName, recordId: id, updates: formatUpdates(sheetName, formState) };

      try {
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { window.location.reload(); } 
          else { alert('エラー: ' + result.message); }
      } catch (error) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
      if (!window.confirm("本当にこのデータを削除しますか？\n（元には戻せません）")) return;
      setIsSaving(true);
      try {
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName: getSheetName(), recordId: id }) });
          const result = await res.json();
          if (result.status === 'success') { window.location.reload(); } 
          else { alert('エラー: ' + result.message); }
      } catch (error) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full">
      <header className="mb-8 flex-shrink-0 border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Icons.Database /> データベース管理
            </h2>
            <p className="text-base text-gray-500 mt-2">ブラウザから直接、顧客データやマスター設定を自由に追加・編集・削除できます。</p>
        </div>
        <button onClick={handleAddClick} disabled={isAdding || editingId !== null} className="bg-[#111] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#D32F2F] transition shadow-md flex items-center gap-2 disabled:opacity-50">
            <Icons.Plus /> 新規追加
        </button>
      </header>

      <div className="flex gap-3 mb-6 flex-shrink-0 overflow-x-auto pb-2">
          <button onClick={() => handleTabChange('CLIENTS')} className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === 'CLIENTS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>👥 顧客データベース</button>
          <button onClick={() => handleTabChange('WIRES')} className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === 'WIRES' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>🔌 電線マスター</button>
          <button onClick={() => handleTabChange('CASTINGS')} className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === 'CASTINGS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>⚙️ 非鉄マスター</button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0 relative">
          <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-left border-collapse min-w-max">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                      <tr>
                          {activeTab === 'CLIENTS' && (
                              <>
                                  <th className="p-4 text-sm font-bold text-gray-500 w-[20%]">顧客名・社名</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 w-[15%]">ランク / Pt</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 w-[15%]">連絡先</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 w-[20%]">ログイン情報</th>
                                  <th className="p-4 text-sm font-bold text-gray-500 w-[15%]">メモ</th>
                              </>
                          )}
                          {activeTab === 'WIRES' && (
                              <><th className="p-4 text-sm font-bold text-gray-500 w-[50%]">品名 / 詳細</th><th className="p-4 text-sm font-bold text-gray-500 w-[30%]">マスター歩留まり (%)</th></>
                          )}
                          {activeTab === 'CASTINGS' && (
                              <><th className="p-4 text-sm font-bold text-gray-500 w-[30%]">品名</th><th className="p-4 text-sm font-bold text-gray-500 w-[20%]">種別 (相場)</th><th className="p-4 text-sm font-bold text-gray-500 w-[30%]">マスター歩留まり (%)</th></>
                          )}
                          <th className="p-4 text-sm font-bold text-gray-500 w-[15%] text-right">操作</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      
                      {/* ★ 新規追加用フォーム */}
                      {isAdding && (
                          <tr className="bg-blue-50/50">
                              {activeTab === 'CLIENTS' && (
                                  <>
                                      <td className="p-3"><input autoFocus placeholder="会社名" className="w-full border p-2.5 rounded-lg font-bold outline-none focus:border-blue-500" onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                      <td className="p-3 space-y-2">
                                          <select className="w-full border p-2 rounded outline-none focus:border-blue-500 font-bold text-xs" onChange={e => setFormState({...formState, rank: e.target.value})} defaultValue="NORMAL">
                                              <option value="NORMAL">NORMAL</option>
                                              <option value="GOLD">GOLD</option>
                                          </select>
                                          <input type="number" placeholder="初期Pt: 0" className="w-full border p-2 rounded text-xs outline-none focus:border-blue-500" onChange={e => setFormState({...formState, points: e.target.value})} />
                                      </td>
                                      <td className="p-3"><input placeholder="090-0000-0000" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-blue-500" onChange={e => setFormState({...formState, phone: e.target.value})} /></td>
                                      <td className="p-3 space-y-2">
                                          <input placeholder="ログインID" className="w-full border p-2 rounded text-xs outline-none focus:border-blue-500" onChange={e => setFormState({...formState, loginId: e.target.value})} />
                                          <input placeholder="パスワード" className="w-full border p-2 rounded text-xs outline-none focus:border-blue-500" onChange={e => setFormState({...formState, password: e.target.value})} />
                                      </td>
                                      <td className="p-3"><input placeholder="メモ" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-blue-500" onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                  </>
                              )}
                              {activeTab === 'WIRES' && (
                                  <><td className="p-3 space-y-2">
                                      <input autoFocus placeholder="品名 (例: VVF)" className="w-full border p-2.5 rounded-lg font-bold outline-none focus:border-blue-500" onChange={e => setFormState({...formState, name: e.target.value})} />
                                  </td>
                                  <td className="p-3"><input type="number" placeholder="40" className="w-32 border p-2.5 rounded-lg font-black text-[#D32F2F] outline-none focus:border-blue-500" onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                              )}
                              {activeTab === 'CASTINGS' && (
                                  <><td className="p-3"><input autoFocus placeholder="品名 (例: 込真鍮)" className="w-full border p-2.5 rounded-lg font-bold outline-none focus:border-blue-500" onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                  <td className="p-3">
                                      <select className="w-full border p-2.5 rounded-lg outline-none focus:border-blue-500 font-bold" value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})}>
                                          <option value="BRASS">真鍮相場 (BRASS)</option>
                                          <option value="COPPER">銅相場 (COPPER)</option>
                                          <option value="ZINC">亜鉛相場 (ZINC)</option>
                                          <option value="LEAD">鉛相場 (LEAD)</option>
                                      </select>
                                  </td>
                                  <td className="p-3"><input type="number" placeholder="100" className="w-32 border p-2.5 rounded-lg font-black text-[#D32F2F] outline-none focus:border-blue-500" onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                              )}
                              <td className="p-3 text-right space-x-2">
                                  <button onClick={() => handleSave(true)} disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">追加</button>
                                  <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"><Icons.Cancel /></button>
                              </td>
                          </tr>
                      )}

                      {/* 既存データのリスト表示 */}
                      {(activeTab === 'CLIENTS' ? clients : activeTab === 'WIRES' ? wires : castings).map((record: any) => (
                          <tr key={record.id} className="hover:bg-gray-50 transition">
                              
                              {/* --- 編集モード --- */}
                              {editingId === record.id ? (
                                  <>
                                      {activeTab === 'CLIENTS' && (
                                          <>
                                              <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-base font-bold outline-none focus:border-[#D32F2F]" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                              <td className="p-3 space-y-2">
                                                  <select className="w-full border p-2 rounded outline-none focus:border-[#D32F2F] font-bold text-xs" value={formState.rank} onChange={e => setFormState({...formState, rank: e.target.value})}>
                                                      <option value="NORMAL">NORMAL</option>
                                                      <option value="GOLD">GOLD</option>
                                                  </select>
                                                  <input type="number" className="w-full border p-2 rounded text-xs outline-none focus:border-[#D32F2F]" value={formState.points} onChange={e => setFormState({...formState, points: e.target.value})} />
                                              </td>
                                              <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-[#D32F2F]" value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} /></td>
                                              <td className="p-3 space-y-2">
                                                  <input type="text" className="w-full border p-2 rounded text-xs outline-none focus:border-[#D32F2F]" value={formState.loginId} onChange={e => setFormState({...formState, loginId: e.target.value})} />
                                                  <input type="text" className="w-full border p-2 rounded text-xs outline-none focus:border-[#D32F2F]" value={formState.password} onChange={e => setFormState({...formState, password: e.target.value})} />
                                              </td>
                                              <td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-sm outline-none focus:border-[#D32F2F]" value={formState.memo} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                          </>
                                      )}
                                      {activeTab === 'WIRES' && (
                                          <><td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-base font-bold outline-none focus:border-[#D32F2F]" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                          <td className="p-3"><input type="number" className="w-32 border p-2.5 rounded-lg text-lg font-black text-[#D32F2F] outline-none focus:border-[#D32F2F]" value={formState.ratio} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                                      )}
                                      {activeTab === 'CASTINGS' && (
                                          <><td className="p-3"><input type="text" className="w-full border p-2.5 rounded-lg text-base font-bold outline-none focus:border-[#D32F2F]" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                          <td className="p-3">
                                              <select className="w-full border p-2.5 rounded-lg outline-none focus:border-blue-500 font-bold" value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})}>
                                                  <option value="BRASS">真鍮相場 (BRASS)</option>
                                                  <option value="COPPER">銅相場 (COPPER)</option>
                                                  <option value="ZINC">亜鉛相場 (ZINC)</option>
                                                  <option value="LEAD">鉛相場 (LEAD)</option>
                                              </select>
                                          </td>
                                          <td className="p-3"><input type="number" className="w-32 border p-2.5 rounded-lg text-lg font-black text-[#D32F2F] outline-none focus:border-[#D32F2F]" value={formState.ratio} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                                      )}
                                      <td className="p-3 text-right space-x-2">
                                          <button onClick={() => handleSave(false, record.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-700"><Icons.Save /> 保存</button>
                                          <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300"><Icons.Cancel /></button>
                                      </td>
                                  </>
                              ) : (
                              
                              /* --- 通常表示モード --- */
                                  <>
                                      {activeTab === 'CLIENTS' && (
                                          <>
                                              <td className="p-4 font-bold text-gray-900 text-base">{record.name}</td>
                                              <td className="p-4">
                                                  <span className={`text-xs px-2 py-1 rounded font-bold border ${record.rank === 'GOLD' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{record.rank}</span>
                                                  <div className="text-sm font-bold text-blue-600 mt-1">{record.points} pt</div>
                                              </td>
                                              <td className="p-4 text-sm text-gray-600 font-mono">{record.phone || '-'}</td>
                                              <td className="p-4 text-xs font-mono text-gray-500 space-y-1">
                                                  <div>ID: <span className="text-gray-900 font-bold">{record.loginId}</span></div>
                                                  <div>PW: <span className="text-gray-900 font-bold">{record.password}</span></div>
                                              </td>
                                              <td className="p-4 text-sm text-gray-500">{record.memo || '-'}</td>
                                          </>
                                      )}
                                      {activeTab === 'WIRES' && (
                                          <><td className="p-4 font-bold text-gray-900 text-base">{record.name}</td>
                                          <td className="p-4"><span className="bg-red-50 text-[#D32F2F] px-3 py-1.5 rounded-lg font-black border border-red-100">{record.ratio} %</span></td></>
                                      )}
                                      {activeTab === 'CASTINGS' && (
                                          <><td className="p-4 font-bold text-gray-900 text-base">{record.name}</td>
                                          <td className="p-4"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 text-xs font-bold">{record.type}</span></td>
                                          <td className="p-4"><span className="bg-red-50 text-[#D32F2F] px-3 py-1.5 rounded-lg font-black border border-red-100">{record.ratio} %</span></td></>
                                      )}
                                      <td className="p-4 text-right">
                                          <div className="flex items-center justify-end gap-3">
                                              <button onClick={() => handleEditClick(record)} className="text-gray-400 hover:text-blue-600 transition flex items-center gap-1 text-sm font-bold">
                                                  <Icons.Edit /> 編集
                                              </button>
                                              <button onClick={() => handleDelete(record.id)} className="text-gray-300 hover:text-red-600 transition">
                                                  <Icons.Trash />
                                              </button>
                                          </div>
                                      </td>
                                  </>
                              )}
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
