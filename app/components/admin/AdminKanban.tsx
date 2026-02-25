// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Check: () => <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Archive: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
};

export const AdminKanban = ({ data, localReservations, setLocalReservations, onOpenPos, onAddClick }: { data: any; localReservations: any[]; setLocalReservations: any; onOpenPos: (id: string) => void; onAddClick: () => void; }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  // ★ 作業報告モーダル用のState
  const [reportModal, setReportModal] = useState<any>(null);
  const [reportForm, setReportForm] = useState({ itemIdx: 0, inputWeight: '', outputCopper: '', workTime: '', memo: '', autoArchive: true });
  const [isReporting, setIsReporting] = useState(false);

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
      if(window.confirm('この荷物は処理が完了しましたか？\n「OK」を押すとカンバンから非表示になり、実績データとして保存されます。')) { updateStatus(id, 'ARCHIVED'); }
  };

  const parseItems = (items: any) => {
    try {
      let parsed = items;
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) { return []; }
  };

  // ★ 作業報告モーダルを開く
  const openReportModal = (res: any) => {
      const items = parseItems(res.items);
      setReportModal(res);
      setReportForm({
          itemIdx: 0,
          inputWeight: items.length > 0 ? (items[0].weight || '') : '',
          outputCopper: '',
          workTime: '',
          memo: '',
          autoArchive: true
      });
  };

  // ★ 作業報告を送信
  const handleReportSubmit = async () => {
      const items = parseItems(reportModal.items);
      const targetItem = items[reportForm.itemIdx] || { product: '不明' };
      const materialName = targetItem.productName || targetItem.product || '不明';
      
      const inW = Number(reportForm.inputWeight);
      const outC = Number(reportForm.outputCopper);
      
      if (inW <= 0 || outC <= 0) return alert("投入重量と産出重量を正しく入力してください。");
      if (outC > inW) return alert("産出重量が投入重量を上回っています。数値を確認してください。");

      const ratio = (outC / inW) * 100;
      setIsReporting(true);

      const payload = {
          action: 'REGISTER_PRODUCTION',
          reservationId: reportModal.id,
          memberName: reportModal.memberName,
          materialName: materialName,
          inputWeight: inW,
          outputCopper: outC,
          actualRatio: ratio.toFixed(2),
          memo: `作業時間: ${reportForm.workTime || 0}分 | ${reportForm.memo}`
      };

      try {
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
          const d = await res.json();
          if(d.status === 'success') {
              alert(`歩留まり ${ratio.toFixed(2)}% でデータベースに記録しました！\n（今後のAIの査定基準に反映されます）`);
              if (reportForm.autoArchive) {
                  updateStatus(reportModal.id, 'ARCHIVED');
              }
              setReportModal(null);
          } else {
              alert('エラー: ' + d.message);
          }
      } catch (e) {
          alert('通信エラーが発生しました');
      }
      setIsReporting(false);
  };

  const columns = [
    { id: 'RESERVED', title: '① 受付・来店待ち', color: 'border-blue-200 bg-blue-50/30' },
    { id: 'IN_PROGRESS', title: '② 検収・計量中', color: 'border-yellow-200 bg-yellow-50/30' },
    { id: 'COMPLETED', title: '③ ヤード在庫 (加工/出荷待ち)', color: 'border-green-200 bg-green-50/30' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      <header className="mb-6 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">現場カンバン</h2>
          <p className="text-sm text-gray-500 mt-2">ドラッグ＆ドロップで状況を更新し、処理が終わったものは「アーカイブ」して実績化します。</p>
        </div>
        <button onClick={onAddClick} className="bg-[#D32F2F] text-white px-5 py-3 rounded-xl text-base font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-md">
          <Icons.Plus /> 飛び込み受付・新規登録
        </button>
      </header>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 min-h-0">
        {columns.map(col => (
          <div key={col.id} className={`flex-1 min-w-[340px] rounded-2xl border ${col.color} flex flex-col overflow-hidden shadow-sm`} onDragOver={onDragOver} onDrop={(e) => onDrop(e, col.id)}>
            <div className="p-4 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm flex justify-between items-center flex-shrink-0">
              <h3 className="font-bold text-gray-800 text-lg">{col.title}</h3>
              <span className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm font-bold border border-gray-200 shadow-sm">
                {localReservations.filter(r => r.status === col.id).length}
              </span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {localReservations.filter(r => r.status === col.id).map(res => {
                const items = parseItems(res.items);
                return (
                  <div key={res.id} draggable onDragStart={(e) => onDragStart(e, res.id)} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition group relative">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono text-gray-500">{res.visitDate ? String(res.visitDate).substring(5, 16) : ''}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-bold">{res.id}</span>
                    </div>
                    <h4 className="text-lg font-black text-gray-900 mb-4">{res.memberName}</h4>
                    
                    <div className="space-y-2 mb-5">
                      {items.length > 0 ? items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <span className="text-gray-800 font-bold truncate pr-2 flex-1">{item.productName || item.product}</span>
                          <span className="font-black text-[#D32F2F] whitespace-nowrap">{item.weight ? `${item.weight} kg` : '未計量'}</span>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-400 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-center font-bold">品目未登録</p>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <p className="text-xl font-black text-gray-900">¥{(res.totalEstimate || 0).toLocaleString()}</p>
                      
                      {col.id === 'RESERVED' && (
                          <button onClick={() => updateStatus(res.id, 'IN_PROGRESS')} className="text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition flex items-center gap-1 border border-blue-200">
                              計量へ <Icons.ArrowRight />
                          </button>
                      )}
                      {col.id === 'IN_PROGRESS' && (
                          <button onClick={() => onOpenPos(res.id)} className="text-sm font-bold text-white bg-gray-900 hover:bg-black px-4 py-2 rounded-lg transition flex items-center gap-1 shadow-md">
                              <Icons.Calculator /> レジで計量
                          </button>
                      )}
                      {/* ★ ヤード在庫には「作業報告」と「アーカイブ」の2つのボタンを配置 */}
                      {col.id === 'COMPLETED' && (
                          <div className="flex gap-2">
                              <button onClick={() => openReportModal(res)} className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg border border-green-200 transition flex items-center gap-1">
                                  🏭 加工・報告
                              </button>
                              <button onClick={() => handleArchive(res.id)} className="text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 p-2 rounded-lg border border-gray-200 transition">
                                  <Icons.Archive />
                              </button>
                          </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ================================================== */}
      {/* ★ 作業報告 (Production Report) モーダル */}
      {/* ================================================== */}
      {reportModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <div>
                          <h3 className="text-xl font-black text-gray-900">🏭 作業・歩留まり報告</h3>
                          <p className="text-sm text-gray-500 mt-1">{reportModal.memberName} の加工データを記録します</p>
                      </div>
                      <button onClick={() => setReportModal(null)} className="text-gray-400 hover:text-gray-900"><Icons.Close /></button>
                  </div>
                  
                  <div className="p-6 space-y-5">
                      {/* 対象品目選択 */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">対象品目</label>
                          <select 
                              className="w-full border border-gray-300 p-3 rounded-xl font-bold outline-none focus:border-green-500"
                              value={reportForm.itemIdx}
                              onChange={(e) => {
                                  const idx = Number(e.target.value);
                                  const items = parseItems(reportModal.items);
                                  setReportForm({...reportForm, itemIdx: idx, inputWeight: items[idx]?.weight || ''});
                              }}
                          >
                              {parseItems(reportModal.items).map((it: any, i: number) => (
                                  <option key={i} value={i}>{it.productName || it.product} ({it.weight}kg)</option>
                              ))}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          {/* 投入重量 */}
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">投入重量 (kg)</label>
                              <div className="relative">
                                  <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3 pr-8 rounded-xl text-lg font-black text-right outline-none focus:border-green-500 focus:bg-white" value={reportForm.inputWeight} onChange={e => setReportForm({...reportForm, inputWeight: e.target.value})} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">kg</span>
                              </div>
                          </div>
                          {/* 産出重量（銅） */}
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">産出重量・銅 (kg)</label>
                              <div className="relative">
                                  <input type="number" className="w-full bg-orange-50 border border-orange-200 p-3 pr-8 rounded-xl text-lg font-black text-orange-600 text-right outline-none focus:border-orange-500 focus:bg-white" value={reportForm.outputCopper} onChange={e => setReportForm({...reportForm, outputCopper: e.target.value})} placeholder="0" />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-orange-500 font-bold">kg</span>
                              </div>
                          </div>
                      </div>

                      {/* 歩留まりプレビュー表示 */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                          <span className="text-sm font-bold text-green-700 mr-2">実測歩留まり (AI学習用データ):</span>
                          <span className="text-2xl font-black text-green-700">
                              {Number(reportForm.inputWeight) > 0 && Number(reportForm.outputCopper) > 0 
                                  ? ((Number(reportForm.outputCopper) / Number(reportForm.inputWeight)) * 100).toFixed(2) 
                                  : '0.00'} %
                          </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">作業時間</label>
                              <div className="relative">
                                  <input type="number" className="w-full border border-gray-300 p-3 pr-8 rounded-xl outline-none focus:border-green-500 text-right" placeholder="0" value={reportForm.workTime} onChange={e => setReportForm({...reportForm, workTime: e.target.value})} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-bold">分</span>
                              </div>
                          </div>
                          <div className="col-span-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">メモ・特記事項</label>
                              <input type="text" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-green-500" placeholder="例: 刃の摩耗が早かった" value={reportForm.memo} onChange={e => setReportForm({...reportForm, memo: e.target.value})} />
                          </div>
                      </div>
                      
                      <label className="flex items-center gap-2 cursor-pointer pt-2">
                          <input type="checkbox" className="w-4 h-4 text-green-600 rounded" checked={reportForm.autoArchive} onChange={e => setReportForm({...reportForm, autoArchive: e.target.checked})} />
                          <span className="text-sm font-bold text-gray-700">報告と同時にこのカードを完了（アーカイブ）する</span>
                      </label>
                  </div>

                  <div className="p-6 border-t border-gray-100 flex gap-3">
                      <button onClick={() => setReportModal(null)} className="flex-1 bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition">キャンセル</button>
                      <button onClick={handleReportSubmit} disabled={isReporting} className="flex-[2] bg-green-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-green-700 transition disabled:bg-gray-300">
                          {isReporting ? '送信中...' : 'データを登録する'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
