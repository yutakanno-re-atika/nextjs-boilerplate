// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Archive: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export const AdminKanban = ({ data, localReservations, setLocalReservations, onOpenPos, onAddClick }: { data: any; localReservations: any[]; setLocalReservations: any; onOpenPos: (id: string) => void; onAddClick: () => void; }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    const updated = localReservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setLocalReservations(updated);
    try {
      await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_RESERVATION_STATUS', reservationId: id, status: newStatus }) });
    } catch (e) {}
  };

  const onDragStart = (e: React.DragEvent, id: string) => { setDraggedId(id); e.dataTransfer.setData('text/plain', id); };
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault(); const id = e.dataTransfer.getData('text/plain');
    if (id && id !== draggedId) { updateStatus(id, newStatus); }
    setDraggedId(null);
  };

  const handleArchive = (id: string) => {
      if(window.confirm('この荷物は「加工済・出荷済」として実績化しますか？\n（カンバンからは非表示になります）')) { updateStatus(id, 'ARCHIVED'); }
  };

  const parseItems = (items: any) => {
    try {
      let parsed = items;
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return []; }
  };

  // デザイン定義: カラムごとのテーマカラー
  const columns = [
    { id: 'RESERVED', title: '① 受付・来店待ち', subtitle: 'Reception', theme: 'blue', headerBg: 'bg-blue-50', borderColor: 'border-blue-200', countColor: 'bg-blue-100 text-blue-700' },
    { id: 'IN_PROGRESS', title: '② 検収・計量中', subtitle: 'Processing', theme: 'yellow', headerBg: 'bg-yellow-50', borderColor: 'border-yellow-200', countColor: 'bg-yellow-100 text-yellow-800' },
    { id: 'COMPLETED', title: '③ ヤード在庫', subtitle: 'Inventory', theme: 'green', headerBg: 'bg-green-50', borderColor: 'border-green-200', countColor: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex justify-between items-end flex-shrink-0">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">Operation Board</h2>
          <p className="text-sm text-gray-500 mt-1">リアルタイム現場カンバン</p>
        </div>
        <button onClick={onAddClick} className="bg-[#111] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#D32F2F] transition shadow-lg flex items-center gap-2 transform active:scale-95">
          <Icons.Plus /> 新規受付
        </button>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 min-h-0">
        {columns.map(col => (
          <div key={col.id} className={`flex-1 min-w-[340px] rounded-2xl border ${col.borderColor} bg-white/50 backdrop-blur-sm flex flex-col overflow-hidden shadow-sm`} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.id)}>
            
            {/* カラムヘッダー */}
            <div className={`p-4 border-b ${col.borderColor} ${col.headerBg} flex justify-between items-center flex-shrink-0`}>
              <div>
                  <h3 className="font-bold text-gray-900 text-lg">{col.title}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{col.subtitle}</p>
              </div>
              <span className={`${col.countColor} px-3 py-1 rounded-full text-sm font-black`}>
                {localReservations.filter(r => r.status === col.id).length}
              </span>
            </div>
            
            {/* カードエリア */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-gray-50/50">
              {localReservations.filter(r => r.status === col.id).map(res => {
                const items = parseItems(res.items);
                return (
                  <div key={res.id} draggable onDragStart={(e) => onDragStart(e, res.id)} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-gray-300 transition-all duration-200 group relative">
                    {/* カードヘッダー */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                          <Icons.Clock />
                          <span>{res.visitDate ? String(res.visitDate).substring(5, 16) : ''}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{res.id}</span>
                    </div>

                    {/* 顧客名 */}
                    <h4 className="text-lg font-black text-gray-900 mb-4 line-clamp-1">{res.memberName}</h4>
                    
                    {/* 品目リスト */}
                    <div className="space-y-2 mb-5">
                      {items.length > 0 ? items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                          <span className="text-gray-700 font-bold truncate pr-2 flex-1 text-xs">{item.productName || item.product}</span>
                          <span className="font-black text-gray-900 text-xs whitespace-nowrap">{item.weight ? `${item.weight} kg` : '-'}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg border border-gray-100 text-center font-bold">品目未登録</p>
                      )}
                    </div>

                    {/* フッターアクション */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TOTAL</span>
                          <p className="text-xl font-black text-gray-900 tracking-tighter">¥{(res.totalEstimate || 0).toLocaleString()}</p>
                      </div>
                      
                      {col.id === 'RESERVED' && (
                          <button onClick={() => updateStatus(res.id, 'IN_PROGRESS')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1 shadow-md">
                              計量へ <Icons.ArrowRight />
                          </button>
                      )}
                      {col.id === 'IN_PROGRESS' && (
                          <button onClick={() => onOpenPos(res.id)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition flex items-center gap-1 shadow-md">
                              <Icons.Calculator /> POS
                          </button>
                      )}
                      {col.id === 'COMPLETED' && (
                          <button onClick={() => handleArchive(res.id)} className="bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition flex items-center gap-1">
                              <Icons.Archive /> 完了
                          </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
