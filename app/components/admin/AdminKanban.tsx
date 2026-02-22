// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Check: () => <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Archive: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
};

export const AdminKanban = ({ data, localReservations, setLocalReservations, onOpenPos, onAddClick }: { data: any; localReservations: any[]; setLocalReservations: any; onOpenPos: (id: string) => void; onAddClick: () => void; }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    // 画面上のステータスを即座に更新 (ラグなし)
    const updated = localReservations.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setLocalReservations(updated);

    // 裏側(GAS)へ非同期で送信
    try {
      await fetch('/api/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_RESERVATION_STATUS', reservationId: id, status: newStatus })
      });
    } catch (e) {
      console.error('Failed to update status in DB', e);
    }
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id && id !== draggedId) { updateStatus(id, newStatus); }
    setDraggedId(null);
  };

  // ★ アーカイブ処理（完了としてボードから消す）
  const handleArchive = (id: string) => {
      if(window.confirm('この荷物はナゲット加工・または出荷が完了しましたか？\n「OK」を押すとカンバンから非表示になり、実績データとして保存されます。')) {
          updateStatus(id, 'ARCHIVED');
      }
  };

  const parseItems = (items: any) => {
    try {
      let parsed = items;
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return []; }
  };

  // ★ ボードに表示するのは「ARCHIVED」以外のものだけ
  const columns = [
    { id: 'RESERVED', title: '① 受付・来店待ち', color: 'border-blue-200 bg-blue-50/30' },
    { id: 'IN_PROGRESS', title: '② 検収・計量中', color: 'border-yellow-200 bg-yellow-50/30' },
    { id: 'COMPLETED', title: '③ ヤード在庫 (加工/出荷待ち)', color: 'border-green-200 bg-green-50/30' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="mb-6 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">現場カンバン (進行管理)</h2>
          <p className="text-sm text-gray-500 mt-1">ドラッグ＆ドロップで状況を更新し、処理が終わったものは「アーカイブ」して実績化します。</p>
        </div>
        <button onClick={onAddClick} className="bg-[#D32F2F] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-sm">
          <Icons.Plus /> 飛び込み受付・新規登録
        </button>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 min-h-0">
        {columns.map(col => (
          <div key={col.id} className={`flex-1 min-w-[320px] rounded-2xl border ${col.color} flex flex-col overflow-hidden shadow-sm`} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.id)}>
            <div className="p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-gray-800">{col.title}</h3>
              <span className="bg-white text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold border border-gray-200 shadow-sm">
                {localReservations.filter(r => r.status === col.id).length}
              </span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {localReservations.filter(r => r.status === col.id).map(res => {
                const items = parseItems(res.items);
                return (
                  <div key={res.id} draggable onDragStart={(e) => onDragStart(e, res.id)} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition group relative">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono text-gray-400">{res.visitDate ? String(res.visitDate).substring(5, 16) : ''}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold">{res.id}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3">{res.memberName}</h4>
                    
                    <div className="space-y-1.5 mb-4">
                      {items.length > 0 ? items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs items-center bg-gray-50 p-1.5 rounded border border-gray-100">
                          <span className="text-gray-700 truncate pr-2 flex-1">{item.productName || item.product}</span>
                          <span className="font-bold text-[#D32F2F] whitespace-nowrap">{item.weight ? `${item.weight} kg` : '未計量'}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-gray-400 bg-gray-50 p-1.5 rounded border border-gray-100 text-center">品目未登録</p>
                      )}
                    </div>

                    <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                      <p className="text-sm font-black text-gray-900">¥{(res.totalEstimate || 0).toLocaleString()}</p>
                      
                      {/* ステータスに応じたアクションボタン */}
                      {col.id === 'RESERVED' && (
                          <button onClick={() => updateStatus(res.id, 'IN_PROGRESS')} className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                              計量へ進む <Icons.ArrowRight />
                          </button>
                      )}
                      {col.id === 'IN_PROGRESS' && (
                          <button onClick={() => onOpenPos(res.id)} className="text-xs font-bold text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-lg transition flex items-center gap-1 shadow-md">
                              <Icons.Calculator /> レジで計量・確定
                          </button>
                      )}
                      {col.id === 'COMPLETED' && (
                          <button onClick={() => handleArchive(res.id)} className="text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 px-2.5 py-1.5 rounded border border-gray-200 transition flex items-center gap-1">
                              <Icons.Archive /> アーカイブ (実績へ)
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
