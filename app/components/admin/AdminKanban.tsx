// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Printer: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Clock: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  User: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Alert: () => <svg className="w-4 h-4 inline-block text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const AdminKanban = ({ localReservations, onUpdateStatus, onEditReservation }: { localReservations: any[], onUpdateStatus: (id: string, status: string) => void, onEditReservation: (id: string) => void }) => {
  
  // ★ 現場提出用の「検収報告書」をPDF/印刷出力する機能
  const handlePrint = (res: any) => {
      let items = [];
      try { items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items; } catch (e) {}
      
      const totalWeight = items.reduce((sum: number, item: any) => sum + Number(item.weight || 0), 0).toFixed(1);
      const hasTin = items.some((i: any) => i.material === '錫メッキ' || i.product.includes('錫'));

      const itemsHtml = items.map((item: any) => `
          <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #333;">
                ${item.product}
                ${(item.material === '錫メッキ' || item.product.includes('錫')) ? '<span style="background: #fee2e2; color: #dc2626; font-size: 10px; padding: 2px 4px; border-radius: 3px; margin-left: 5px;">⚠️錫</span>' : ''}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.material || '純銅'}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-family: monospace;">${item.ratio}%</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-family: monospace; font-weight: bold;">${item.weight} kg</td>
          </tr>
      `).join('');

      const printWindow = window.open('', '_blank');
      if (!printWindow) return alert('ポップアップブロックを解除してください。');

      const html = `
          <!DOCTYPE html>
          <html>
          <head>
              <title>検収内訳書_${res.memberName || 'ゲスト'}</title>
              <style>
                  body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
                  .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #111; padding-bottom: 10px; margin-bottom: 30px; }
                  .header h1 { margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px; }
                  .header p { margin: 0; color: #555; font-size: 12px; }
                  .info-grid { display: flex; justify-content: space-between; background: #f9f9f9; padding: 15px 20px; border-radius: 5px; margin-bottom: 30px; border: 1px solid #eee; }
                  .info-box p { margin: 0 0 5px 0; font-size: 12px; color: #666; font-weight: bold; }
                  .info-box h3 { margin: 0; font-size: 18px; color: #111; }
                  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  th { background-color: #f1f5f9; padding: 12px 10px; text-align: left; font-size: 12px; color: #475569; border-bottom: 2px solid #cbd5e1; }
                  .total-row { display: flex; justify-content: flex-end; align-items: center; font-size: 20px; font-weight: 900; border-top: 2px solid #111; padding-top: 15px; }
                  .total-row span { font-size: 14px; color: #666; margin-right: 15px; font-weight: bold; }
                  .memo { margin-top: 40px; padding: 15px; border: 1px dashed #ccc; background: #fff; font-size: 12px; color: #444; border-radius: 5px; }
                  .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 10px; margin-bottom: 20px; font-size: 14px; color: #b91c1c; font-weight: bold; }
                  @media print { body { padding: 0; margin: 0; } @page { margin: 15mm; } }
              </style>
          </head>
          <body>
              <div class="header">
                  <h1>現場検収 内訳報告書</h1>
                  <p>印刷日時: ${new Date().toLocaleString('ja-JP')}</p>
              </div>

              ${hasTin ? '<div class="alert">⚠️ 注意：このロットには「錫メッキ線」が含まれています。純銅ラインへの混入を防止してください。</div>' : ''}

              <div class="info-grid">
                  <div class="info-box">
                      <p>持込業者・顧客名</p>
                      <h3>${res.memberName || '新規・非会員 (飛込)'} 様</h3>
                  </div>
                  <div class="info-box" style="text-align: right;">
                      <p>受付日時</p>
                      <h3>${new Date(res.createdAt).toLocaleString('ja-JP')}</h3>
                  </div>
              </div>

              <table>
                  <thead>
                      <tr>
                          <th>電線品名 / 構成</th>
                          <th style="text-align: center;">材質</th>
                          <th style="text-align: right;">銅分 (歩留)</th>
                          <th style="text-align: right;">計量重量</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${itemsHtml}
                  </tbody>
              </table>

              <div class="total-row">
                  <span>総重量</span> ${totalWeight} kg
              </div>

              ${res.memo ? `<div class="memo"><strong>【現場メモ / AI推論根拠】</strong><br/>${res.memo.replace(/\n/g, '<br/>')}</div>` : ''}

              <div style="margin-top: 50px; display: flex; justify-content: flex-end; gap: 50px;">
                  <div style="text-align: center; border-top: 1px solid #111; width: 200px; padding-top: 10px; font-size: 12px; color: #555;">検収担当者 印</div>
                  <div style="text-align: center; border-top: 1px solid #111; width: 200px; padding-top: 10px; font-size: 12px; color: #555;">事務所受領 印</div>
              </div>

              <script>
                  window.onload = function() { 
                      setTimeout(() => { window.print(); window.close(); }, 300); 
                  };
              </script>
          </body>
          </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
  };

  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('resId', id); };
  const handleDrop = (e: React.DragEvent, status: string) => { e.preventDefault(); const id = e.dataTransfer.getData('resId'); if (id) onUpdateStatus(id, status); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const columns = [
    { id: 'RESERVED', title: '受付・計量 (POS)', color: 'border-blue-500', bg: 'bg-blue-50' },
    { id: 'RECEIVED', title: '検収完了 (投入待ち)', color: 'border-purple-500', bg: 'bg-purple-50' },
    { id: 'IN_PROGRESS', title: 'プラント処理中', color: 'border-orange-500', bg: 'bg-orange-50' },
    { id: 'COMPLETED', title: '処理完了', color: 'border-green-500', bg: 'bg-green-50' }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight">PLANT KANBAN</h2>
        <p className="text-xs text-gray-500 mt-1 font-mono">プラント投入・処理ステータス管理</p>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 h-full">
        {columns.map(col => {
          const colData = localReservations.filter(r => r.status === col.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          return (
            <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-gray-100/50 rounded-md border border-gray-200 overflow-hidden" onDrop={(e) => handleDrop(e, col.id)} onDragOver={handleDragOver}>
              <div className={`p-3 border-t-4 ${col.color} ${col.bg} flex justify-between items-center shadow-sm`}>
                <h3 className="font-bold text-gray-800 text-sm">{col.title}</h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm">{colData.length}</span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {colData.map(res => {
                  let items = [];
                  try { items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items; } catch(e){}
                  const totalW = items.reduce((sum: number, i: any) => sum + Number(i.weight || 0), 0);
                  const hasTin = items.some((i: any) => i.material === '錫メッキ' || i.product.includes('錫'));

                  return (
                    <div key={res.id} draggable onDragStart={(e) => handleDragStart(e, res.id)} className={`bg-white p-3 rounded-sm shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition relative group ${hasTin ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'}`}>
                      
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono"><Icons.Clock /> {formatTime(res.createdAt)}</div>
                        
                        {/* ★ PDF出力/印刷ボタン */}
                        <button onClick={() => handlePrint(res)} className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded shadow-sm flex items-center gap-1 transition opacity-0 group-hover:opacity-100">
                            <Icons.Printer /> 帳票出力
                        </button>
                      </div>
                      
                      <div className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1">
                          <Icons.User /> {res.memberName || '新規・非会員'}
                      </div>

                      {hasTin && (
                          <div className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm inline-flex items-center gap-1 mb-2">
                              <Icons.Alert /> 錫メッキ混入あり
                          </div>
                      )}

                      <div className="bg-gray-50 rounded-sm p-2 text-xs mb-2 border border-gray-100">
                        {items.slice(0, 3).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center py-0.5 border-b border-gray-200 last:border-0 truncate">
                                <span className="text-gray-700 truncate mr-2" title={item.product}>{item.product}</span>
                                <span className="font-mono font-bold text-gray-900 shrink-0">{item.weight}kg</span>
                            </div>
                        ))}
                        {items.length > 3 && <div className="text-center text-[10px] text-gray-400 mt-1 pt-1">他 {items.length - 3} 品目...</div>}
                      </div>

                      <div className="flex justify-between items-end mt-3">
                          <div className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-sm">総重量: <span className="text-sm font-black text-gray-800 font-mono">{totalW.toFixed(1)}</span> kg</div>
                          
                          <button onClick={() => onEditReservation(res.id)} className="text-[10px] text-blue-600 hover:underline font-bold">
                              POSで再編集 ✏️
                          </button>
                      </div>
                    </div>
                  );
                })}
                {colData.length === 0 && (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-sm">
                        <span className="text-xs font-bold text-gray-400">カードをドロップ</span>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
