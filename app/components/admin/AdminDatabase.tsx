// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Save: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
};

const ROLE_OPTIONS = [
  { value: 'SUPPLIER', short: '仕入先', label: '仕入先 (原料供給)', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'BUYER', short: '売却先', label: '売却先 (出荷・エンド)', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'PARTNER', short: 'パートナー', label: 'パートナー (相互融通・産廃等)', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: 'COMPETITOR', short: '競合', label: '競合他社 (相場監視)', color: 'bg-red-100 text-red-800 border-red-300' },
  { value: 'SYSTEM_PARTNER', short: 'システム', label: 'システム・開発', color: 'bg-gray-100 text-gray-800 border-gray-300' }
];

export const AdminDatabase = ({ data, onNavigate }: { data: any, onNavigate?: any }) => {
  const [activeTab, setActiveTab] = useState<'WIRES' | 'CASTINGS' | 'CLIENTS' | 'CONFIG'>('WIRES');
  
  // 編集用ステート
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  
  // 追加用ステート
  const [addingTab, setAddingTab] = useState<string | null>(null);
  const [addValues, setAddValues] = useState<any>({});
  
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

  const wires = data?.wires || [];
  const castings = data?.castings || [];
  const clients = data?.clients || [];
  const config = data?.config || {};

  const copperPrice = Number(config.market_price) || 1450;
  const brassPrice = Number(config.brass_price) || 980;
  const zincPrice = Number(config.zinc_price) || 450;
  const leadPrice = Number(config.lead_price) || 380;

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
      return name;
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id || item.clientId || null);
      setEditValues({ ...item });
      setAddingTab(null);
  };

  const handleCancel = () => {
      setEditingId(null);
      setAddingTab(null);
      setEditValues({});
      setAddValues({});
  };

  // ★ データの更新 (Update)
  const handleSave = async (sheetName: string, id: string) => {
      setIsSaving(true);
      try {
          let updates = {};
          if (sheetName === 'Products_Wire') {
              updates = { 
                  2: editValues.name, 
                  4: editValues.sq, 
                  7: editValues.core, 
                  9: editValues.ratio 
              };
          } else if (sheetName === 'Products_Casting') {
              updates = { 
                  1: editValues.name, 
                  2: editValues.type, 
                  4: editValues.ratio 
              };
          } else if (sheetName === 'Clients') {
              updates = { 
                  1: editValues.companyName || editValues.name,
                  2: editValues.rank, 
                  4: editValues.phone,
                  8: editValues.memo, 
                  9: editValues.address,
                  10: editValues.industry,
                  11: editValues.businessRole
              };
          }

          const payload = { action: 'UPDATE_DB_RECORD', sheetName, recordId: id, updates };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              setEditingId(null);
              window.location.reload();
          } else {
              alert('エラー: ' + result.message);
          }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  // ★ データの追加 (Create)
  const handleAdd = async (sheetName: string) => {
      setIsSaving(true);
      try {
          const payload = { action: 'ADD_DB_RECORD', sheetName, data: addValues };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              setAddingTab(null);
              window.location.reload();
          } else {
              alert('エラー: ' + result.message);
          }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  // ★ データの削除 (Delete)
  const handleDelete = async (sheetName: string, id: string) => {
      if(!window.confirm('本当にこのデータを削除しますか？\n（※この操作は取り消せません）')) return;
      setIsSaving(true);
      try {
          const payload = { action: 'DELETE_DB_RECORD', sheetName, recordId: id };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              window.location.reload();
          } else {
              alert('エラー: ' + result.message);
          }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  const handlePrintReport = async () => {
      setIsGeneratingReport(true);
      // ...（既存の印刷処理ロジックそのまま）
      setTimeout(() => { window.print(); setIsGeneratingReport(false); }, 500);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans max-w-7xl mx-auto w-full relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* --- 通常の画面 --- */}
      <div className="print:hidden flex flex-col h-full">
          <header className="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4 flex-shrink-0">
            <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                    <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                    マスターDB管理
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">DATABASE & SETTINGS</p>
            </div>
            <button onClick={handlePrintReport} disabled={isGeneratingReport || activeTab === 'CONFIG'} className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {isGeneratingReport ? <Icons.Refresh /> : <Icons.Print />}
                {activeTab === 'CONFIG' ? '印刷非対応' : isGeneratingReport ? 'AI分析中...' : 'このタブを印刷する'}
            </button>
          </header>

          <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto no-scrollbar">
              <button onClick={() => {setActiveTab('WIRES'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'WIRES' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  電線類 マスター
              </button>
              <button onClick={() => {setActiveTab('CASTINGS'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CASTINGS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  非鉄類 マスター
              </button>
              <button onClick={() => {setActiveTab('CLIENTS'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CLIENTS' ? 'bg-white border-t-2 border-t-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Users /> 顧客・ロール管理
              </button>
              <button onClick={() => {setActiveTab('CONFIG'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CONFIG' ? 'bg-white border-t-2 border-t-gray-800 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Settings /> システム設定
              </button>
          </div>

          <div className="flex-1 bg-white border-x border-b border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
              
              {/* ================= WIRES TAB ================= */}
              {activeTab === 'WIRES' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0 relative">
                      {/* 追加ボタンエリア */}
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-end z-20">
                          <button onClick={() => { setAddingTab('WIRES'); setEditingId(null); setAddValues({}); }} className="bg-[#111] text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center shadow-sm hover:bg-[#D32F2F] transition">
                              <Icons.Plus /> 新規追加
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 w-[10%]">ID</th>
                                  <th className="p-3 w-[35%]">品名・詳細</th>
                                  <th className="p-3 w-[15%] text-center">歩留設定 (%)</th>
                                  <th className="p-3 w-[20%] text-right">参考単価</th>
                                  <th className="p-3 w-[20%] text-center">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {/* 新規追加フォーム行 */}
                              {addingTab === 'WIRES' && (
                                  <tr className="bg-blue-50/30 border-b-2 border-blue-200">
                                      <td className="p-3 font-mono text-xs text-blue-400 font-bold">NEW</td>
                                      <td className="p-3 flex gap-2">
                                          <input type="text" placeholder="品名 (例: CV線)" value={addValues.name || ''} onChange={e => setAddValues({...addValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                          <input type="text" placeholder="sq" value={addValues.sq || ''} onChange={e => setAddValues({...addValues, sq: e.target.value})} className="w-16 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                          <input type="text" placeholder="C(芯)" value={addValues.core || ''} onChange={e => setAddValues({...addValues, core: e.target.value})} className="w-16 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                      </td>
                                      <td className="p-3 text-center">
                                          <input type="number" placeholder="歩留" value={addValues.ratio || ''} onChange={e => setAddValues({...addValues, ratio: e.target.value})} className="w-20 p-1.5 border border-gray-300 rounded-sm text-xs text-center font-mono outline-none focus:border-[#D32F2F]" />
                                      </td>
                                      <td className="p-3 text-right text-gray-400">-</td>
                                      <td className="p-3 text-center flex gap-2 justify-center">
                                          <button onClick={() => handleAdd('Products_Wire')} disabled={isSaving || !addValues.name || !addValues.ratio} className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold rounded-sm hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"><Icons.Save /> 登録</button>
                                          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 text-[10px] font-bold">取消</button>
                                      </td>
                                  </tr>
                              )}
                              
                              {wires.map((w: any) => {
                                  const isEditing = editingId === w.id;
                                  const calcPrice = Math.floor(copperPrice * (Number(w.ratio) / 100) * 0.85);
                                  return (
                                      <tr key={w.id} className={`hover:bg-gray-50 transition ${isEditing ? 'bg-red-50/10' : ''}`}>
                                          <td className="p-3 font-mono text-xs text-gray-400">{w.id}</td>
                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="flex gap-2">
                                                      <input type="text" value={editValues.name || ''} onChange={e => setEditValues({...editValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-[#D32F2F]" placeholder="品名" />
                                                      <input type="text" value={editValues.sq || ''} onChange={e => setEditValues({...editValues, sq: e.target.value})} className="w-16 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" placeholder="sq" />
                                                      <input type="text" value={editValues.core || ''} onChange={e => setEditValues({...editValues, core: e.target.value})} className="w-16 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" placeholder="C" />
                                                  </div>
                                              ) : (
                                                  <span className="font-bold text-gray-900">{getDisplayName(w)}</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <input type="number" className="w-20 border border-red-300 p-1.5 text-center font-mono font-bold text-[#D32F2F] rounded-sm outline-none focus:border-red-500" value={editValues.ratio || ''} onChange={(e)=>setEditValues({...editValues, ratio: e.target.value})} />
                                              ) : (
                                                  <span className="font-mono font-bold">{w.ratio} %</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-right">
                                              <span className="text-xs text-gray-400 mr-2">目安:</span>
                                              <span className="font-black text-[#D32F2F] text-lg tracking-tighter">¥{calcPrice.toLocaleString()}</span>
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <div className="flex gap-2 justify-center">
                                                      <button onClick={() => handleSave('Products_Wire', w.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-black transition shadow-sm"><Icons.Save /> 保存</button>
                                                      <button onClick={() => handleDelete('Products_Wire', w.id)} disabled={isSaving} className="bg-red-50 text-red-600 border border-red-200 px-2 py-1.5 text-[10px] font-bold rounded-sm hover:bg-red-100 transition shadow-sm"><Icons.Trash /></button>
                                                      <button onClick={handleCancel} className="text-gray-400 text-[10px] font-bold hover:text-gray-900">取消</button>
                                                  </div>
                                              ) : (
                                                  <button onClick={() => handleEdit(w)} className="text-gray-400 hover:text-gray-900 transition p-2"><Icons.Edit /></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* ================= CASTINGS TAB ================= */}
              {activeTab === 'CASTINGS' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0 relative">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-end z-20">
                          <button onClick={() => { setAddingTab('CASTINGS'); setEditingId(null); setAddValues({}); }} className="bg-[#111] text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center shadow-sm hover:bg-[#D32F2F] transition">
                              <Icons.Plus /> 新規追加
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 w-[10%]">ID</th>
                                  <th className="p-3 w-[30%]">品名</th>
                                  <th className="p-3 w-[15%]">ベース</th>
                                  <th className="p-3 w-[15%] text-center">掛率 (%)</th>
                                  <th className="p-3 w-[15%] text-right">参考単価</th>
                                  <th className="p-3 w-[15%] text-center">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {addingTab === 'CASTINGS' && (
                                  <tr className="bg-blue-50/30 border-b-2 border-blue-200">
                                      <td className="p-3 font-mono text-xs text-blue-400 font-bold">NEW</td>
                                      <td className="p-3">
                                          <input type="text" placeholder="品名 (例: 砲金)" value={addValues.name || ''} onChange={e => setAddValues({...addValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                      </td>
                                      <td className="p-3">
                                          <select value={addValues.type || 'COPPER'} onChange={e => setAddValues({...addValues, type: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]">
                                              <option value="COPPER">銅</option>
                                              <option value="BRASS">真鍮</option>
                                              <option value="ZINC">亜鉛</option>
                                              <option value="LEAD">鉛</option>
                                          </select>
                                      </td>
                                      <td className="p-3 text-center">
                                          <input type="number" placeholder="掛率" value={addValues.ratio || ''} onChange={e => setAddValues({...addValues, ratio: e.target.value})} className="w-20 p-1.5 border border-gray-300 rounded-sm text-xs text-center font-mono outline-none focus:border-[#D32F2F]" />
                                      </td>
                                      <td className="p-3 text-right text-gray-400">-</td>
                                      <td className="p-3 text-center flex gap-2 justify-center">
                                          <button onClick={() => handleAdd('Products_Casting')} disabled={isSaving || !addValues.name || !addValues.ratio} className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold rounded-sm hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"><Icons.Save /> 登録</button>
                                          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 text-[10px] font-bold">取消</button>
                                      </td>
                                  </tr>
                              )}

                              {castings.map((c: any) => {
                                  const isEditing = editingId === c.id;
                                  let basePrice = copperPrice; let baseName = "銅";
                                  if (c.type === 'BRASS') { basePrice = brassPrice; baseName = "真鍮"; }
                                  if (c.type === 'ZINC') { basePrice = zincPrice; baseName = "亜鉛"; }
                                  if (c.type === 'LEAD') { basePrice = leadPrice; baseName = "鉛"; }
                                  const calcPrice = Math.floor(basePrice * (Number(c.ratio) / 100) * 0.90);
                                  
                                  return (
                                      <tr key={c.id} className={`hover:bg-gray-50 transition ${isEditing ? 'bg-red-50/10' : ''}`}>
                                          <td className="p-3 font-mono text-xs text-gray-400">{c.id}</td>
                                          <td className="p-3">
                                              {isEditing ? (
                                                  <input type="text" value={editValues.name || ''} onChange={e => setEditValues({...editValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-[#D32F2F]" />
                                              ) : (
                                                  <span className="font-bold text-gray-900">{c.name}</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-xs text-gray-500">
                                              {isEditing ? (
                                                  <select value={editValues.type || ''} onChange={e => setEditValues({...editValues, type: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm outline-none focus:border-[#D32F2F]">
                                                      <option value="COPPER">銅</option>
                                                      <option value="BRASS">真鍮</option>
                                                      <option value="ZINC">亜鉛</option>
                                                      <option value="LEAD">鉛</option>
                                                  </select>
                                              ) : (
                                                  <span className="bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm">{baseName}</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <input type="number" value={editValues.ratio || ''} onChange={e => setEditValues({...editValues, ratio: e.target.value})} className="w-20 p-1.5 border border-red-300 text-center font-mono font-bold text-[#D32F2F] rounded-sm outline-none focus:border-red-500" />
                                              ) : (
                                                  <span className="font-mono font-bold">{c.ratio} %</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-right">
                                              <span className="text-xs text-gray-400 mr-2">目安:</span>
                                              <span className="font-black text-gray-900 text-lg tracking-tighter">¥{calcPrice.toLocaleString()}</span>
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <div className="flex gap-2 justify-center">
                                                      <button onClick={() => handleSave('Products_Casting', c.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-black transition shadow-sm"><Icons.Save /> 保存</button>
                                                      <button onClick={() => handleDelete('Products_Casting', c.id)} disabled={isSaving} className="bg-red-50 text-red-600 border border-red-200 px-2 py-1.5 text-[10px] font-bold rounded-sm hover:bg-red-100 transition shadow-sm"><Icons.Trash /></button>
                                                      <button onClick={handleCancel} className="text-gray-400 text-[10px] font-bold hover:text-gray-900">取消</button>
                                                  </div>
                                              ) : (
                                                  <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-gray-900 transition p-2"><Icons.Edit /></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* ================= CLIENTS TAB ================= */}
              {activeTab === 'CLIENTS' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0 relative">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-end z-20">
                          <button onClick={() => { setAddingTab('CLIENTS'); setEditingId(null); setAddValues({}); }} className="bg-blue-600 text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center shadow-sm hover:bg-blue-700 transition">
                              <Icons.Plus /> 新規顧客の登録
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 w-[25%]">顧客・企業情報</th>
                                  <th className="p-3 w-[10%] text-center">ランク</th>
                                  <th className="p-3 w-[25%]">役割 (Roles)</th>
                                  <th className="p-3 w-[25%]">エリア / 特記事項</th>
                                  <th className="p-3 w-[15%] text-right">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {/* 新規追加フォーム行 */}
                              {addingTab === 'CLIENTS' && (
                                  <tr className="bg-blue-50/30 border-b-2 border-blue-200">
                                      <td className="p-3">
                                          <input type="text" placeholder="企業名" value={addValues.name || ''} onChange={e => setAddValues({...addValues, name: e.target.value})} className="w-full mb-1 p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-blue-500" />
                                          <input type="text" placeholder="電話番号" value={addValues.phone || ''} onChange={e => setAddValues({...addValues, phone: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-mono outline-none focus:border-blue-500" />
                                      </td>
                                      <td className="p-3 text-center">
                                          <select value={addValues.rank || 'B'} onChange={e => setAddValues({...addValues, rank: e.target.value})} className="bg-white border border-gray-300 p-1.5 rounded-sm text-xs font-bold outline-none shadow-sm">
                                              <option value="S">S</option>
                                              <option value="A">A</option>
                                              <option value="B">B</option>
                                          </select>
                                      </td>
                                      <td className="p-3">
                                          <div className="flex flex-col gap-1 p-2 bg-white border border-gray-200 shadow-inner rounded-sm">
                                              {ROLE_OPTIONS.map(opt => {
                                                  const currentRoles = addValues.businessRole ? addValues.businessRole.split(',') : [];
                                                  const isChecked = currentRoles.includes(opt.value);
                                                  return (
                                                      <label key={opt.value} className="flex items-center gap-2 text-[10px] font-bold cursor-pointer">
                                                          <input type="checkbox" checked={isChecked} onChange={() => {
                                                              let newRoles = [...currentRoles];
                                                              if (isChecked) newRoles = newRoles.filter(r => r !== opt.value);
                                                              else newRoles.push(opt.value);
                                                              setAddValues({...addValues, businessRole: newRoles.join(',')});
                                                          }} className="accent-blue-600" />
                                                          {opt.label}
                                                      </label>
                                                  );
                                              })}
                                          </div>
                                      </td>
                                      <td className="p-3">
                                          <input type="text" placeholder="所在地" value={addValues.address || ''} onChange={e => setAddValues({...addValues, address: e.target.value})} className="w-full mb-1 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-blue-500" />
                                          <input type="text" placeholder="業種" value={addValues.industry || ''} onChange={e => setAddValues({...addValues, industry: e.target.value})} className="w-full mb-1 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-blue-500" />
                                          <input type="text" placeholder="メモ" value={addValues.memo || ''} onChange={e => setAddValues({...addValues, memo: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-blue-500" />
                                      </td>
                                      <td className="p-3 text-right">
                                          <div className="flex flex-col gap-2 items-end">
                                              <button onClick={() => handleAdd('Clients')} disabled={isSaving || !addValues.name} className="bg-blue-600 text-white px-4 py-2 text-[10px] font-bold rounded-sm hover:bg-blue-700 transition shadow-sm w-full"><Icons.Save /> 登録</button>
                                              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 text-[10px] font-bold w-full">取消</button>
                                          </div>
                                      </td>
                                  </tr>
                              )}

                              {clients.map((c:any) => {
                                  const isEditing = editingId === (c.id || c.clientId);
                                  const currentRoles = (isEditing ? editValues.businessRole : c.businessRole) || '';
                                  const rolesArray = currentRoles.split(/[,/，、]+/).map((r:string) => r.trim()).filter(Boolean);

                                  return (
                                      <tr key={c.id || c.clientId} className={`hover:bg-blue-50/20 transition ${isEditing ? 'bg-red-50/10' : ''}`}>
                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="space-y-1.5">
                                                      <input type="text" value={editValues.companyName || editValues.name || ''} onChange={e => setEditValues({...editValues, companyName: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-[#D32F2F]" placeholder="企業名" />
                                                      <input type="text" value={editValues.phone || ''} onChange={e => setEditValues({...editValues, phone: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-mono outline-none focus:border-[#D32F2F]" placeholder="連絡先" />
                                                  </div>
                                              ) : (
                                                  <div className="cursor-pointer" onClick={() => onNavigate && onNavigate('CLIENT_DETAIL', c.companyName || c.name)}>
                                                      <p className="font-bold text-gray-900 hover:text-[#D32F2F] transition-colors">{c.companyName || c.name}</p>
                                                      <p className="text-[10px] font-mono text-gray-500 mt-1">{c.phone || '-'}</p>
                                                  </div>
                                              )}
                                          </td>

                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <select value={editValues.rank || 'B'} onChange={e => setEditValues({...editValues, rank: e.target.value})} className="bg-white border border-gray-300 p-1.5 rounded-sm text-xs font-bold outline-none shadow-sm">
                                                      <option value="S">S</option>
                                                      <option value="A">A</option>
                                                      <option value="B">B</option>
                                                  </select>
                                              ) : (
                                                  <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-xs font-black ${c.rank === 'S' ? 'bg-[#D32F2F] text-white' : c.rank === 'A' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>{c.rank || 'B'}</span>
                                              )}
                                          </td>

                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="flex flex-col gap-1 p-2 bg-gray-50 border border-gray-200 shadow-inner rounded-sm">
                                                      {ROLE_OPTIONS.map(opt => {
                                                          const isChecked = rolesArray.includes(opt.value);
                                                          return (
                                                              <label key={opt.value} className={`flex items-center gap-2 text-[10px] font-bold cursor-pointer px-2 py-1.5 rounded-sm border transition-colors ${isChecked ? 'bg-white border-blue-400 text-gray-900 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100'}`}>
                                                                  <input type="checkbox" checked={isChecked} onChange={() => {
                                                                      let newRoles = [...rolesArray];
                                                                      if (isChecked) newRoles = newRoles.filter(r => r !== opt.value);
                                                                      else newRoles.push(opt.value);
                                                                      setEditValues({...editValues, businessRole: newRoles.join(',')});
                                                                  }} className="accent-blue-600 w-3 h-3" />
                                                                  <span className={`px-2 py-0.5 rounded-sm border text-[9px] ${opt.color}`}>{opt.short}</span>
                                                                  <span className="font-normal text-gray-500">{opt.label.replace(opt.short, '').trim()}</span>
                                                              </label>
                                                          );
                                                      })}
                                                  </div>
                                              ) : (
                                                  <div className="flex flex-wrap gap-1.5">
                                                      {rolesArray.length > 0 ? rolesArray.map((roleStr: string, i: number) => {
                                                          const matchedOption = ROLE_OPTIONS.find(opt => opt.value === roleStr);
                                                          const colorClass = matchedOption ? matchedOption.color : 'bg-gray-100 text-gray-600 border-gray-200';
                                                          const label = matchedOption ? matchedOption.short : roleStr;
                                                          return <span key={i} className={`text-[10px] px-2 py-1 border rounded-sm font-bold shadow-sm ${colorClass}`}>{label}</span>;
                                                      }) : <span className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded-sm">未設定</span>}
                                                  </div>
                                              )}
                                          </td>

                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="space-y-1.5">
                                                      <input type="text" value={editValues.address || ''} onChange={e => setEditValues({...editValues, address: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F] shadow-sm" placeholder="所在地" />
                                                      <input type="text" value={editValues.industry || ''} onChange={e => setEditValues({...editValues, industry: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F] shadow-sm" placeholder="業種" />
                                                      <input type="text" value={editValues.memo || ''} onChange={e => setEditValues({...editValues, memo: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F] shadow-sm" placeholder="特記事項..." />
                                                  </div>
                                              ) : (
                                                  <div>
                                                      <p className="text-[10px] text-gray-400 truncate mb-1">{c.address || ''} {c.industry ? `(${c.industry})` : ''}</p>
                                                      <p className="text-xs text-gray-700 font-medium truncate max-w-[200px] xl:max-w-[250px]">{c.memo || '-'}</p>
                                                  </div>
                                              )}
                                          </td>

                                          <td className="p-3 text-right">
                                              {isEditing ? (
                                                  <div className="flex flex-col gap-2 items-end">
                                                      <button onClick={() => handleSave('Clients', c.id || c.clientId)} disabled={isSaving} className="bg-gray-900 text-white px-4 py-2 text-[10px] font-bold rounded-sm hover:bg-black transition flex items-center justify-center gap-1 shadow-sm w-full"><Icons.Save /> 保存</button>
                                                      <div className="flex w-full gap-2">
                                                          <button onClick={() => handleDelete('Clients', c.id || c.clientId)} disabled={isSaving} className="bg-red-50 text-red-600 border border-red-200 py-1.5 text-[10px] font-bold rounded-sm hover:bg-red-100 transition shadow-sm w-1/2 flex justify-center"><Icons.Trash /></button>
                                                          <button onClick={handleCancel} className="text-gray-500 bg-gray-100 border border-gray-200 py-1.5 text-[10px] font-bold hover:bg-gray-200 transition rounded-sm w-1/2">取消</button>
                                                      </div>
                                                  </div>
                                              ) : (
                                                  <button onClick={(e) => { e.stopPropagation(); handleEdit(c); }} className="text-gray-400 hover:text-blue-600 transition p-2"><Icons.Edit /></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* ================= CONFIG TAB ================= */}
              {activeTab === 'CONFIG' && (
                  <div className="p-6 overflow-y-auto">
                      <div className="max-w-xl mx-auto space-y-6">
                          <div className="bg-gray-50 p-6 rounded-sm border border-gray-200">
                              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Icons.Settings /> 外部連携・相場設定</h3>
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                      <span className="text-xs font-bold text-gray-500">銅建値 (手動上書き用)</span>
                                      <span className="font-mono font-black text-lg">{copperPrice} 円/kg</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                      <span className="text-xs font-bold text-gray-500">為替レート (USD/JPY)</span>
                                      <span className="font-mono font-bold">{config.usdjpy || 150} 円</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                      <span className="text-xs font-bold text-gray-500">LME銅 3M</span>
                                      <span className="font-mono font-bold">{config.lme_copper_usd || 9000} USD/t</span>
                                  </div>
                              </div>
                          </div>
                          <p className="text-[10px] text-gray-400 text-center">※システム設定の詳細な変更はGoogle Spreadsheetの「Config」シートから行ってください。</p>
                      </div>
                  </div>
              )}

          </div>
      </div>
      
      {/* 印刷用レイアウトは省略(既存のまま) */}
    </div>
  );
};
