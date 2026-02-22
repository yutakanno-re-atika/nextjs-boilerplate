// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Cancel: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
};

export const AdminDatabase = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'CLIENTS' | 'WIRES'>('CLIENTS');
  
  // 編集用のステート
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // 顧客リスト
  const clients = data?.clients || [];
  // 品目（電線）リスト
  const wires = data?.wires || [];

  const handleEditClick = (record: any, type: 'CLIENTS' | 'WIRES') => {
      setEditingId(record.id);
      if (type === 'CLIENTS') {
          // 顧客データの場合の初期値
          setEditForm({ name: record.name, phone: record.phone, memo: record.memo });
      } else {
          // 品目データの場合の初期値
          setEditForm({ name: record.name, ratio: record.ratio });
      }
  };

  const handleSave = async (sheetName: string, id: string) => {
      setIsSaving(true);
      let updates = {};

      // スプレッドシートの列番号（0始まり）とマッピングする
      if (sheetName === 'Clients') {
          // Clientsシート: B列(1)=社名, E列(4)=電話番号, I列(8)=メモ
          updates = {
              1: editForm.name,
              4: editForm.phone,
              8: editForm.memo
          };
      } else if (sheetName === 'Products_Wire') {
          // Products_Wireシート: C列(2)=品名, G列(6)=銅率(%)
          updates = {
              2: editForm.name,
              6: editForm.ratio
          };
      }

      try {
          const res = await fetch('/api/gas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  action: 'UPDATE_DB_RECORD',
                  sheetName: sheetName,
                  recordId: id,
                  updates: updates
              })
          });
          const result = await res.json();
          if (result.status === 'success') {
              setEditingId(null);
              window.location.reload(); // 保存成功したら画面をリロードして最新化
          } else {
              alert('保存に失敗しました: ' + result.message);
          }
      } catch (error) {
          alert('通信エラーが発生しました');
      }
      setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Icons.Database /> データベース管理
        </h2>
        <p className="text-xs text-gray-500 mt-1">スプレッドシートを開かずに、顧客データやマスター設定を直接書き換えます。</p>
      </header>

      {/* タブ切り替え */}
      <div className="flex gap-2 mb-6 flex-shrink-0">
          <button 
              onClick={() => { setActiveTab('CLIENTS'); setEditingId(null); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${activeTab === 'CLIENTS' ? 'bg-gray-900 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
              👥 顧客データベース
          </button>
          <button 
              onClick={() => { setActiveTab('WIRES'); setEditingId(null); }}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition ${activeTab === 'WIRES' ? 'bg-gray-900 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
              🔌 品目マスター (銅率設定)
          </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0 relative">
          
          {/* 🔴 顧客データベース表示 */}
          {activeTab === 'CLIENTS' && (
              <div className="overflow-y-auto flex-1 p-0">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                          <tr>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[25%]">顧客名・社名</th>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[20%]">電話番号</th>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[40%]">引継ぎメモ</th>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[15%] text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {clients.map((client: any) => (
                              <tr key={client.id} className="hover:bg-gray-50 transition">
                                  {editingId === client.id ? (
                                      <>
                                          <td className="p-3"><input type="text" className="w-full border p-2 rounded text-sm font-bold outline-none focus:border-[#D32F2F]" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                                          <td className="p-3"><input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-[#D32F2F]" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></td>
                                          <td className="p-3"><input type="text" className="w-full border p-2 rounded text-sm outline-none focus:border-[#D32F2F]" value={editForm.memo} onChange={e => setEditForm({...editForm, memo: e.target.value})} /></td>
                                          <td className="p-3 text-right space-x-2">
                                              <button onClick={() => handleSave('Clients', client.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50"><Icons.Save /> 保存</button>
                                              <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300"><Icons.Cancel /></button>
                                          </td>
                                      </>
                                  ) : (
                                      <>
                                          <td className="p-4 font-bold text-gray-900 text-sm">{client.name}</td>
                                          <td className="p-4 text-sm text-gray-600 font-mono">{client.phone || '-'}</td>
                                          <td className="p-4 text-xs text-gray-500">{client.memo || '-'}</td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleEditClick(client, 'CLIENTS')} className="text-gray-400 hover:text-[#D32F2F] transition flex items-center justify-end gap-1 ml-auto text-xs font-bold">
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

          {/* 🔴 品目マスター表示 */}
          {activeTab === 'WIRES' && (
              <div className="overflow-y-auto flex-1 p-0">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 border-b border-gray-200">
                          <tr>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[50%]">品名（受付画面に表示される名前）</th>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[30%]">マスター歩留まり (銅率 %)</th>
                              <th className="p-4 text-xs font-bold text-gray-500 w-[20%] text-right">操作</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {wires.map((wire: any) => (
                              <tr key={wire.id} className="hover:bg-gray-50 transition">
                                  {editingId === wire.id ? (
                                      <>
                                          <td className="p-3"><input type="text" className="w-full border p-2 rounded text-sm font-bold outline-none focus:border-[#D32F2F]" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></td>
                                          <td className="p-3">
                                              <div className="relative w-32">
                                                  <input type="number" className="w-full border p-2 pr-8 rounded text-sm font-black text-[#D32F2F] outline-none focus:border-[#D32F2F]" value={editForm.ratio} onChange={e => setEditForm({...editForm, ratio: e.target.value})} />
                                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                                              </div>
                                          </td>
                                          <td className="p-3 text-right space-x-2">
                                              <button onClick={() => handleSave('Products_Wire', wire.id)} disabled={isSaving} className="bg-[#D32F2F] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-700 disabled:opacity-50"><Icons.Save /> 保存</button>
                                              <button onClick={() => setEditingId(null)} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300"><Icons.Cancel /></button>
                                          </td>
                                      </>
                                  ) : (
                                      <>
                                          <td className="p-4 font-bold text-gray-900 text-sm">{wire.name}</td>
                                          <td className="p-4">
                                              <span className="bg-red-50 text-[#D32F2F] px-2.5 py-1 rounded text-sm font-black border border-red-100">
                                                  {wire.ratio} %
                                              </span>
                                          </td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleEditClick(wire, 'WIRES')} className="text-gray-400 hover:text-[#D32F2F] transition flex items-center justify-end gap-1 ml-auto text-xs font-bold">
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
