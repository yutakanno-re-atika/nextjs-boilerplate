// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Database: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Cancel: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Users: () => <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Target: () => <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Box: () => <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
};

export const AdminDatabase = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'SALES_TARGETS' | 'WIRES' | 'CASTINGS'>('CLIENTS');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formState, setFormState] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const clients = data?.clients || [];
  const salesTargets = data?.salesTargets || [];
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
      setFormState({ type: 'BRASS', rank: 'NORMAL', points: 0, priority: 'B', status: '新規' }); 
  };

  const getSheetName = () => {
      if (activeTab === 'CLIENTS') return 'Clients';
      if (activeTab === 'SALES_TARGETS') return 'SalesTargets';
      if (activeTab === 'WIRES') return 'Products_Wire';
      return 'Products_Casting';
  };

  const formatUpdates = (sheetName: string, form: any) => {
      if (sheetName === 'Clients') return { 1: form.name, 2: form.rank, 4: form.phone, 5: form.loginId, 6: form.password, 7: form.points, 8: form.memo };
      if (sheetName === 'SalesTargets') return { 2: form.company, 4: form.area, 5: form.priority, 11: form.status, 12: form.contact, 14: form.memo };
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

  const inputClass = "w-full min-w-0 border border-gray-300 p-2 rounded focus:border-[#D32F2F] outline-none text-sm transition";
  
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full">
      <header className="mb-6 flex-shrink-0 border-b border-gray-200 pb-4 flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                <Icons.Database /> データベース管理
            </h2>
            <p className="text-sm text-gray-500 mt-2">ブラウザから直接、顧客データやマスター設定を自由に追加・編集・削除できます。</p>
        </div>
        <button onClick={handleAddClick} disabled={isAdding || editingId !== null} className="bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#D32F2F] transition shadow-md flex items-center gap-2 disabled:opacity-50">
            <Icons.Plus /> 新規追加
        </button>
      </header>

      {/* ★ DBダッシュボード（サマリー） */}
      <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl"><Icons.Users /></div>
              <div>
                  <p className="text-xs text-gray-500 font-bold tracking-wider">登録顧客数</p>
                  <p className="text-2xl font-black text-gray-900">{clients.length} <span className="text-sm font-bold text-gray-400">社</span></p>
              </div>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 rounded-xl"><Icons.Target /></div>
              <div>
                  <p className="text-xs text-gray-500 font-bold tracking-wider">営業ターゲット (未取引)</p>
                  <p className="text-2xl font-black text-gray-900">{salesTargets.filter(t => t.status !== '既存取引先').length} <span className="text-sm font-bold text-gray-400">件</span></p>
              </div>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl"><Icons.Box /></div>
              <div>
                  <p className="text-xs text-gray-500 font-bold tracking-wider">登録マスター品目</p>
                  <p className="text-2xl font-black text-gray-900">{wires.length + castings.length} <span className="text-sm font-bold text-gray-400">種</span></p>
              </div>
          </div>
      </div>

      <div className="flex gap-2 mb-4 flex-shrink-0 overflow-x-auto pb-2">
          <button onClick={() => handleTabChange('CLIENTS')} className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${activeTab === 'CLIENTS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>👥 顧客マスター</button>
          <button onClick={() => handleTabChange('SALES_TARGETS')} className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${activeTab === 'SALES_TARGETS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>🎯 営業リスト (CRM)</button>
          <button onClick={() => handleTabChange('WIRES')} className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${activeTab === 'WIRES' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>🔌 電線マスター</button>
          <button onClick={() => handleTabChange('CASTINGS')} className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm ${activeTab === 'CASTINGS' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>⚙️ 非鉄マスター</button>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0 relative">
          <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-left border-collapse table-fixed">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                      <tr>
                          {activeTab === 'CLIENTS' && (
                              <><th className="p-3 text-xs font-bold text-gray-500 w-[20%] truncate">顧客名・社名</th><th className="p-3 text-xs font-bold text-gray-500 w-[15%] truncate">ランク / Pt</th><th className="p-3 text-xs font-bold text-gray-500 w-[15%] truncate">連絡先</th><th className="p-3 text-xs font-bold text-gray-500 w-[20%] truncate">ログイン情報</th><th className="p-3 text-xs font-bold text-gray-500 w-[20%] truncate">メモ</th></>
                          )}
                          {activeTab === 'SALES_TARGETS' && (
                              <><th className="p-3 text-xs font-bold text-gray-500 w-[25%] truncate">企業名</th><th className="p-3 text-xs font-bold text-gray-500 w-[15%] truncate">エリア / 優先度</th><th className="p-3 text-xs font-bold text-gray-500 w-[15%] truncate">連絡先</th><th className="p-3 text-xs font-bold text-gray-500 w-[15%] truncate">ステータス</th><th className="p-3 text-xs font-bold text-gray-500 w-[20%] truncate">メモ / 提案内容</th></>
                          )}
                          {activeTab === 'WIRES' && (
                              <><th className="p-3 text-xs font-bold text-gray-500 w-[50%] truncate">品名 / 詳細</th><th className="p-3 text-xs font-bold text-gray-500 w-[30%] truncate">マスター歩留まり (%)</th></>
                          )}
                          {activeTab === 'CASTINGS' && (
                              <><th className="p-3 text-xs font-bold text-gray-500 w-[35%] truncate">品名</th><th className="p-3 text-xs font-bold text-gray-500 w-[25%] truncate">種別 (相場)</th><th className="p-3 text-xs font-bold text-gray-500 w-[25%] truncate">歩留まり (%)</th></>
                          )}
                          <th className="p-3 text-xs font-bold text-gray-500 w-[10%] text-right truncate">操作</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                      
                      {/* ★ 新規追加用フォーム */}
                      {isAdding && (
                          <tr className="bg-blue-50/50">
                              {activeTab === 'CLIENTS' && (
                                  <>
                                      <td className="p-2 align-top"><input autoFocus placeholder="会社名" className={`${inputClass} font-bold`} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                      <td className="p-2 align-top space-y-1.5"><select className={inputClass} onChange={e => setFormState({...formState, rank: e.target.value})} defaultValue="NORMAL"><option value="NORMAL">NORMAL</option><option value="GOLD">GOLD</option></select><input type="number" placeholder="初期Pt: 0" className={inputClass} onChange={e => setFormState({...formState, points: e.target.value})} /></td>
                                      <td className="p-2 align-top"><input placeholder="090-XXXX" className={inputClass} onChange={e => setFormState({...formState, phone: e.target.value})} /></td>
                                      <td className="p-2 align-top space-y-1.5"><input placeholder="ID (任意)" className={inputClass} onChange={e => setFormState({...formState, loginId: e.target.value})} /><input placeholder="PW (任意)" className={inputClass} onChange={e => setFormState({...formState, password: e.target.value})} /></td>
                                      <td className="p-2 align-top"><input placeholder="メモ" className={inputClass} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                  </>
                              )}
                              {activeTab === 'SALES_TARGETS' && (
                                  <>
                                      <td className="p-2 align-top"><input autoFocus placeholder="ターゲット企業名" className={`${inputClass} font-bold`} onChange={e => setFormState({...formState, company: e.target.value})} /></td>
                                      <td className="p-2 align-top space-y-1.5"><input placeholder="エリア (例: 苫小牧)" className={inputClass} onChange={e => setFormState({...formState, area: e.target.value})} /><select className={inputClass} onChange={e => setFormState({...formState, priority: e.target.value})} defaultValue="B"><option value="A">優先度: A</option><option value="B">優先度: B</option><option value="C">優先度: C</option></select></td>
                                      <td className="p-2 align-top"><input placeholder="連絡先" className={inputClass} onChange={e => setFormState({...formState, contact: e.target.value})} /></td>
                                      <td className="p-2 align-top"><select className={inputClass} onChange={e => setFormState({...formState, status: e.target.value})} defaultValue="新規"><option value="新規">新規</option><option value="アプローチ中">アプローチ中</option><option value="既存取引先">既存取引先</option></select></td>
                                      <td className="p-2 align-top"><input placeholder="メモ・提案内容" className={inputClass} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                  </>
                              )}
                              {activeTab === 'WIRES' && (
                                  <><td className="p-2 align-top space-y-1.5"><input autoFocus placeholder="品名 (例: VVF)" className={`${inputClass} font-bold`} onChange={e => setFormState({...formState, name: e.target.value})} /></td><td className="p-2 align-top"><input type="number" placeholder="40" className={`${inputClass} font-black text-[#D32F2F]`} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                              )}
                              {activeTab === 'CASTINGS' && (
                                  <><td className="p-2 align-top"><input autoFocus placeholder="品名 (例: 込真鍮)" className={`${inputClass} font-bold`} onChange={e => setFormState({...formState, name: e.target.value})} /></td><td className="p-2 align-top"><select className={`${inputClass} font-bold`} value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})}><option value="BRASS">BRASS</option><option value="COPPER">COPPER</option><option value="ZINC">ZINC</option><option value="LEAD">LEAD</option></select></td><td className="p-2 align-top"><input type="number" placeholder="100" className={`${inputClass} font-black text-[#D32F2F]`} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                              )}
                              <td className="p-2 align-top text-right">
                                  <div className="flex flex-col gap-1 items-end">
                                      <button onClick={() => handleSave(true)} disabled={isSaving} className="bg-blue-600 text-white w-full py-1.5 rounded flex justify-center items-center hover:bg-blue-700 disabled:bg-gray-300 transition"><Icons.Save /></button>
                                      <button onClick={() => setIsAdding(false)} className="bg-gray-200 text-gray-700 w-full py-1.5 rounded flex justify-center items-center hover:bg-gray-300 transition"><Icons.Cancel /></button>
                                  </div>
                              </td>
                          </tr>
                      )}

                      {/* 既存データのリスト表示 */}
                      {(activeTab === 'CLIENTS' ? clients : activeTab === 'SALES_TARGETS' ? salesTargets : activeTab === 'WIRES' ? wires : castings).map((record: any) => (
                          <tr key={record.id} className="hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                              
                              {/* --- 編集モード --- */}
                              {editingId === record.id ? (
                                  <>
                                      {activeTab === 'CLIENTS' && (
                                          <>
                                              <td className="p-2 align-top"><input type="text" className={`${inputClass} font-bold`} value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                              <td className="p-2 align-top space-y-1.5"><select className={`${inputClass} font-bold`} value={formState.rank} onChange={e => setFormState({...formState, rank: e.target.value})}><option value="NORMAL">NORMAL</option><option value="GOLD">GOLD</option></select><input type="number" className={inputClass} value={formState.points} onChange={e => setFormState({...formState, points: e.target.value})} /></td>
                                              <td className="p-2 align-top"><input type="text" className={inputClass} value={formState.phone} onChange={e => setFormState({...formState, phone: e.target.value})} /></td>
                                              <td className="p-2 align-top space-y-1.5"><input type="text" className={inputClass} value={formState.loginId} onChange={e => setFormState({...formState, loginId: e.target.value})} /><input type="text" className={inputClass} value={formState.password} onChange={e => setFormState({...formState, password: e.target.value})} /></td>
                                              <td className="p-2 align-top"><input type="text" className={inputClass} value={formState.memo} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                          </>
                                      )}
                                      {activeTab === 'SALES_TARGETS' && (
                                          <>
                                              <td className="p-2 align-top"><input type="text" className={`${inputClass} font-bold`} value={formState.company} onChange={e => setFormState({...formState, company: e.target.value})} /></td>
                                              <td className="p-2 align-top space-y-1.5"><input type="text" className={inputClass} value={formState.area} onChange={e => setFormState({...formState, area: e.target.value})} /><select className={inputClass} value={formState.priority} onChange={e => setFormState({...formState, priority: e.target.value})}><option value="A">優先度: A</option><option value="B">優先度: B</option><option value="C">優先度: C</option></select></td>
                                              <td className="p-2 align-top"><input type="text" className={inputClass} value={formState.contact} onChange={e => setFormState({...formState, contact: e.target.value})} /></td>
                                              <td className="p-2 align-top"><select className={inputClass} value={formState.status} onChange={e => setFormState({...formState, status: e.target.value})}><option value="新規">新規</option><option value="アプローチ中">アプローチ中</option><option value="既存取引先">既存取引先</option></select></td>
                                              <td className="p-2 align-top"><input type="text" className={inputClass} value={formState.memo} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                          </>
                                      )}
                                      {activeTab === 'WIRES' && (
                                          <><td className="p-2 align-top"><input type="text" className={`${inputClass} font-bold`} value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} /></td><td className="p-2 align-top"><input type="number" className={`${inputClass} font-black text-[#D32F2F]`} value={formState.ratio} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                                      )}
                                      {activeTab === 'CASTINGS' && (
                                          <><td className="p-2 align-top"><input type="text" className={`${inputClass} font-bold`} value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} /></td><td className="p-2 align-top"><select className={`${inputClass} font-bold`} value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})}><option value="BRASS">BRASS</option><option value="COPPER">COPPER</option><option value="ZINC">ZINC</option><option value="LEAD">LEAD</option></select></td><td className="p-2 align-top"><input type="number" className={`${inputClass} font-black text-[#D32F2F]`} value={formState.ratio} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td></>
                                      )}
                                      <td className="p-2 align-top text-right">
                                          <div className="flex flex-col gap-1 items-end">
                                              <button onClick={() => handleSave(false, record.id)} disabled={isSaving} className="bg-[#D32F2F] text-white w-full py-1.5 rounded flex justify-center items-center hover:bg-red-700 disabled:bg-gray-300 transition"><Icons.Save /></button>
                                              <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 w-full py-1.5 rounded flex justify-center items-center hover:bg-gray-300 transition"><Icons.Cancel /></button>
                                          </div>
                                      </td>
                                  </>
                              ) : (
                              
                              /* --- 通常表示モード --- */
                                  <>
                                      {activeTab === 'CLIENTS' && (
                                          <>
                                              <td className="p-3 align-top font-bold text-gray-900 truncate">{record.name}</td>
                                              <td className="p-3 align-top"><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${record.rank === 'GOLD' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{record.rank}</span><div className="text-xs font-bold text-blue-600 mt-1.5">{record.points} pt</div></td>
                                              <td className="p-3 align-top text-gray-600 font-mono text-xs truncate">{record.phone || '-'}</td>
                                              <td className="p-3 align-top text-[11px] font-mono text-gray-500 space-y-1 truncate"><div>ID: <span className="text-gray-900 font-bold">{record.loginId}</span></div><div>PW: <span className="text-gray-900 font-bold">{record.password}</span></div></td>
                                              <td className="p-3 align-top text-xs text-gray-500 truncate" title={record.memo}>{record.memo || '-'}</td>
                                          </>
                                      )}
                                      {activeTab === 'SALES_TARGETS' && (
                                          <>
                                              <td className="p-3 align-top font-bold text-gray-900 truncate">{record.company}</td>
                                              <td className="p-3 align-top"><div className="text-xs text-gray-500 mb-1">{record.area || '-'}</div><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${record.priority === 'A' ? 'bg-red-50 text-red-700 border-red-200' : record.priority === 'B' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>優先度 {record.priority}</span></td>
                                              <td className="p-3 align-top text-gray-600 font-mono text-xs truncate">{record.contact || '-'}</td>
                                              <td className="p-3 align-top"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{record.status}</span></td>
                                              <td className="p-3 align-top text-xs text-gray-500 truncate" title={record.memo}>{record.memo || record.proposal || '-'}</td>
                                          </>
                                      )}
                                      {activeTab === 'WIRES' && (
                                          <>
                                              <td className="p-3 align-top font-bold text-gray-900 truncate">{record.name}</td>
                                              <td className="p-3 align-top"><span className="bg-red-50 text-[#D32F2F] px-2 py-1 rounded text-sm font-black border border-red-100">{record.ratio} %</span></td>
                                          </>
                                      )}
                                      {activeTab === 'CASTINGS' && (
                                          <>
                                              <td className="p-3 align-top font-bold text-gray-900 truncate">{record.name}</td>
                                              <td className="p-3 align-top"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 text-[10px] font-bold">{record.type}</span></td>
                                              <td className="p-3 align-top"><span className="bg-red-50 text-[#D32F2F] px-2 py-1 rounded text-sm font-black border border-red-100">{record.ratio} %</span></td>
                                          </>
                                      )}
                                      <td className="p-3 align-top text-right">
                                          <div className="flex items-center justify-end gap-3 h-full pt-1">
                                              <button onClick={() => handleEditClick(record)} className="text-gray-400 hover:text-blue-600 transition" title="編集"><Icons.Edit /></button>
                                              <button onClick={() => handleDelete(record.id)} className="text-gray-300 hover:text-red-600 transition" title="削除"><Icons.Trash /></button>
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
