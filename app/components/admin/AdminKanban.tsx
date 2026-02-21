// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  DragGrip: () => <svg className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-16h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
};

export const AdminKanban = ({ data, localReservations, setLocalReservations, onOpenPos, onAddClick }: { data: any, localReservations: any[], setLocalReservations: any, onOpenPos: (resId: string) => void, onAddClick: () => void }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const reservedList = localReservations.filter((r: any) => r.status === 'RESERVED');
  const processingList = localReservations.filter((r: any) => r.status === 'PROCESSING' || r.status === 'ARRIVED');
  const completedList = localReservations.filter((r: any) => r.status === 'COMPLETED');

  const handleUpdateStatus = async (resId: string, nextStatus: string) => {
      setLocalReservations((prev: any[]) => prev.map(res => res.id === resId ? { ...res, status: nextStatus } : res));
      setIsUpdatingStatus(resId);
      try {
          const payload = { action: 'UPDATE_RESERVATION_STATUS', reservationId: resId, status: nextStatus };
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } catch (error) { alert('通信エラーが発生しました。'); }
      setIsUpdatingStatus(null);
  };

  const handleDragStart = (e: React.DragEvent, resId: string) => { e.dataTransfer.setData('resId', resId); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragOver = (e: React.DragEvent, colStatus: string) => { e.preventDefault(); setDragOverCol(colStatus); };
  const handleDragLeave = () => { setDragOverCol(null); };
  const handleDrop = (e: React.DragEvent, newStatus: string) => {
      e.preventDefault(); setDragOverCol(null);
      const resId = e.dataTransfer.getData('resId');
      if (resId) { handleUpdateStatus(resId, newStatus); }
  };

  const renderCard = (res: any, currentStatus: string) => {
      let items: any[] = [];
      try { 
          let temp = res.items;
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (Array.isArray(temp)) items = temp;
      } catch(e){}
      
      const totalWeight = items ? items.reduce((sum:number, i:any) => sum + (Number(i.weight)||0), 0) : 0;
      const isMember = res.memberId && res.memberId !== 'GUEST';
      
      let hasWire = false;
      let hasCasting = false;
      items.forEach((it:any) => {
          const isWire = data?.wires?.some((w:any) => w.name === it.product) || it.product.includes('線') || it.product.includes('MIX');
          if (isWire) hasWire = true; else hasCasting = true;
      });

      let timeStr = "日時不明";
      try {
          if (res.visitDate) {
              const d = new Date(res.visitDate);
              timeStr = !isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` : String(res.visitDate).replace('T', ' ').substring(0, 16);
          }
      } catch(e){}

      return (
        <div 
          key={res.id} 
          draggable
          onDragStart={(e) => handleDragStart(e, res.id)}
          className={`bg-white p-3 rounded-xl shadow-sm border transition relative overflow-hidden group cursor-grab active:cursor-grabbing ${isUpdatingStatus === res.id ? 'opacity-50 scale-95 border-dashed border-gray-400' : 'border-gray-100 hover:shadow-md hover:border-gray-300'}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStatus === 'PROCESSING' ? 'bg-[#D32F2F]' : currentStatus === 'COMPLETED' ? 'bg-blue-500' : isMember ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            <div className="pl-2">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                        <Icons.DragGrip />
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isMember ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{isMember ? '会員' : '非会員'}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">{timeStr}</span>
                </div>
                
                <p className="font-bold text-gray-900 text-sm truncate pl-5 mb-1">{res.memberName}</p>
                
                <div className="flex gap-1 pl-5 mb-2">
                    {hasWire && <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold border border-indigo-100">🔌 剥線・ナゲット</span>}
                    {hasCasting && <span className="text-[9px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold border border-emerald-100">📦 非鉄ストック</span>}
                </div>

                <div className="mb-2 bg-gray-50 rounded p-1.5 border border-gray-100 max-h-16 overflow-y-auto ml-5">
                    {items.map((it:any, idx:number) => (
                        <p key={idx} className="text-[10px] text-gray-600 truncate flex justify-between"><span>{it.product}</span><span className="font-mono">{it.weight}kg</span></p>
                    ))}
                    <div className="border-t border-gray-200 mt-1 pt-1 text-right"><span className="text-[10px] font-bold text-gray-900">計 {totalWeight} kg</span></div>
                </div>
                {res.memo && <p className={`text-[9px] mb-2 p-1 rounded font-bold truncate ml-5 ${res.memo.includes('【新規】') ? 'bg-red-50 text-[#D32F2F]' : 'bg-yellow-50 text-yellow-800'}`}>{res.memo}</p>}
                
                <div className="ml-5">
                    {currentStatus === 'RESERVED' && (
                        <button onClick={() => handleUpdateStatus(res.id, 'PROCESSING')} disabled={isUpdatingStatus === res.id} className="w-full bg-red-50 text-[#D32F2F] py-1.5 rounded-lg text-xs font-bold hover:bg-[#D32F2F] hover:text-white transition flex items-center justify-center">
                            {isUpdatingStatus === res.id ? '移動中...' : <>検収・計量へ <Icons.ArrowRight /></>}
                        </button>
                    )}
                    {currentStatus === 'PROCESSING' && (
                        <button onClick={() => onOpenPos(res.id)} disabled={isUpdatingStatus === res.id} className="w-full bg-red-50 text-[#D32F2F] py-1.5 rounded-lg text-xs font-bold hover:bg-[#D32F2F] hover:text-white transition flex items-center justify-center border border-red-100">
                            <Icons.Calc /> レジで計量を確定する
                        </button>
                    )}
                </div>
            </div>
        </div>
      );
  };

  return (
      <div className="flex flex-col h-full animate-in fade-in duration-300">
          <header className="mb-6 flex justify-between items-center flex-shrink-0">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">現場カンバン</h2>
                <p className="text-xs text-gray-500 mt-1">カードをドラッグして次の列へ移動できます。</p>
            </div>
            <button onClick={onAddClick} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D32F2F] transition shadow-sm">＋ 飛込受付</button>
          </header>
          <div className="flex-1 flex gap-5 overflow-x-auto min-h-0 pb-4">
              
              <div 
                  className={`flex-none w-[300px] flex flex-col bg-gray-100/60 rounded-2xl border transition-all duration-200 overflow-hidden ${dragOverCol === 'RESERVED' ? 'border-gray-500 shadow-lg scale-[1.02] bg-gray-200/50' : 'border-gray-200'}`}
                  onDragOver={(e) => handleDragOver(e, 'RESERVED')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'RESERVED')}
              >
                  <div className="p-3.5 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                      <span className="font-bold text-sm text-gray-800">① 来場待ち / 受付済</span><span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-bold">{reservedList.length}</span>
                  </div>
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">{reservedList.length === 0 ? <p className="text-xs text-gray-400 text-center py-8">現在予定はありません</p> : reservedList.map(res => renderCard(res, 'RESERVED'))}</div>
              </div>

              <div 
                  className={`flex-none w-[300px] flex flex-col bg-red-50/40 rounded-2xl border transition-all duration-200 overflow-hidden ${dragOverCol === 'PROCESSING' ? 'border-[#D32F2F] shadow-lg scale-[1.02] bg-red-100/60' : 'border-red-100'}`}
                  onDragOver={(e) => handleDragOver(e, 'PROCESSING')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'PROCESSING')}
              >
                  <div className="p-3.5 border-b-2 border-b-[#D32F2F] flex justify-between items-center bg-white shadow-sm z-10">
                      <span className="font-bold text-sm text-[#D32F2F]">② 検収・計量中</span><span className="bg-[#D32F2F] text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">{processingList.length}</span>
                  </div>
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">{processingList.length === 0 ? <p className="text-xs text-gray-400 text-center py-8">現在計量中はありません</p> : processingList.map(res => renderCard(res, 'PROCESSING'))}</div>
              </div>

              <div 
                  className={`flex-none w-[300px] flex flex-col bg-blue-50/40 rounded-2xl border transition-all duration-200 overflow-hidden ${dragOverCol === 'COMPLETED' ? 'border-blue-500 shadow-lg scale-[1.02] bg-blue-100/60' : 'border-blue-100'}`}
                  onDragOver={(e) => handleDragOver(e, 'COMPLETED')} onDragLeave={handleDragLeave} onDrop={(e) => handleDrop(e, 'COMPLETED')}
              >
                  <div className="p-3.5 border-b-2 border-b-blue-500 flex justify-between items-center bg-white shadow-sm z-10">
                      <span className="font-bold text-sm text-blue-600">③ 計量完了 (ヤード保管)</span><span className="bg-blue-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">{completedList.length}</span>
                  </div>
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto">{completedList.length === 0 ? <p className="text-xs text-blue-300 text-center py-8">現在完了した荷物はありません</p> : completedList.map(res => renderCard(res, 'COMPLETED'))}</div>
              </div>
          </div>
      </div>
  );
};
