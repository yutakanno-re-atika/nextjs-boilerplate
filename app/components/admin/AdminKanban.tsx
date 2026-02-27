// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
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

  const parseItems = (items: any) => {
    try {
      let parsed = items;
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return []; }
  };

  const columns = [
    { id: 'RESERVED', title: '01 受付・来店待ち', subtitle: '受付', borderTop: 'border-t-4 border-blue-600', bg: 'bg-gray-50' },
    { id: 'IN_PROGRESS', title: '02 検収・計量中', subtitle: '計量', borderTop: 'border-t-4 border-yellow-500', bg: 'bg-gray-50' },
    { id: 'COMPLETED', title: '03 ヤード在庫', subtitle: '在庫', borderTop: 'border-t-4 border-green-600', bg: 'bg-gray-50' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 text-gray-800">
      <header className="mb-4 flex justify-between items-end flex-shrink-0 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 font-serif">
             <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
             現場カンバン
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">リアルタイム状況監視</p>
        </div>
        <button onClick={onAddClick} className="bg-[#111] text-white px-5 py-2.5 rounded-sm text-sm font-bold hover:bg-[#D32F2F] transition flex items-center gap-2 shadow-sm">
          <Icons.Plus /> 新規受付
        </button>
      </header>

      <div className="flex-1 flex gap-4 overflow-x-auto pb-2 min-h-0">
        {columns.map(col => (
          <div key={col.id} className={`flex-1 min-w-[340px] bg-white border border-gray-200 flex flex-col overflow-hidden shadow-sm ${col.borderTop}`} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.id)}>
            
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                  <h3 className="font-bold text-gray-900 text-base">{col.title}</h3>
              </div>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-sm text-sm font-mono font-bold border border-gray-200">
                {localReservations.filter(r => r.status === col.id).length}
              </span>
            </div>
            
            <div className={`p-3 flex-1 overflow-y-auto space-y-3 ${col.bg}`}>
              {localReservations.filter(r => r.status === col.id).map(res => {
                const items = parseItems(res.items);
                return (
                  <div key={res.id} draggable onDragStart={(e) => onDragStart(e, res.id)} className="bg-white p-4 border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-gray-400 transition-all duration-200 group relative rounded-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                          <Icons.Clock />
                          <span>{res.visitDate ? String(res.visitDate).substring(5, 16) : ''}</span>
                      </div>
                      <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm">{res.id}</span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-3 line-clamp-1 border-b border-gray-100 pb-2">{res.memberName}</h4>
                    
                    <div className="space-y-2 mb-4">
                      {items.length > 0 ? items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm items-center text-gray-700">
                          <span className="truncate pr-2 flex-1 font-medium">{item.productName || item.product}</span>
                          <span className="font-mono font-bold whitespace-nowrap text-gray-900 text-base">{item.weight ? `${item.weight}kg` : '-'}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-gray-400 italic">品目未登録</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex flex-col">
                          <span className="text-xs text-gray-400 font-bold mb-1">合計金額</span>
                          <p className="text-xl font-black text-gray-900 tracking-tight font-mono">¥{(res.totalEstimate || 0).toLocaleString()}</p>
                      </div>
                      
                      {col.id === 'RESERVED' && (
                          <button onClick={() => updateStatus(res.id, 'IN_PROGRESS')} className="bg-blue-600 text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-blue-700 transition flex items-center gap-1 shadow-sm">
                              計量へ <Icons.ArrowRight />
                          </button>
                      )}
                      {col.id === 'IN_PROGRESS' && (
                          <button onClick={() => onOpenPos(res.id)} className="bg-gray-900 text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-black transition flex items-center gap-2 shadow-sm">
                              <Icons.Calculator /> POS入力
                          </button>
                      )}
                      {col.id === 'COMPLETED' && (
                          <p className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-sm border border-green-200">
                             製造待ち
                          </p>
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
