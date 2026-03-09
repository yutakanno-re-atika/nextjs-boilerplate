// app/components/admin/AdminKanban.tsx
// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Printer: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Clock: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  User: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Alert: () => <svg className="w-4 h-4 inline-block text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  FrontDesk: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Inspection: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Plant: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const d = new Date(timeStr);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

// ★ 修正版：最強のJSONパース関数（改行コードで破壊されないよう保護）
export const parseItemsData = (rawItems: any) => {
    if (!rawItems) return [];
    if (Array.isArray(rawItems)) return rawItems;
    try {
        // 余計な置換をせず、まずは素直にパースを試みる
        const parsed = JSON.parse(rawItems);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'string') {
            const doubleParsed = JSON.parse(parsed);
            if (Array.isArray(doubleParsed)) return doubleParsed;
        }
    } catch (e1) {
        // パース失敗時のみ、安全なエスケープ置換を行う
        try {
            let temp = String(rawItems);
            if (temp.startsWith('"') && temp.endsWith('"')) temp = temp.slice(1, -1);
            temp = temp.replace(/""/g, '"');
            // 改行コードはスペースに置換してJSONの破壊を防ぐ
            temp = temp.replace(/\n/g, " ").replace(/\r/g, "");
            let parsed = JSON.parse(temp);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (Array.isArray(parsed)) return parsed;
        } catch (e2) {
            console.error("JSON parse failed. Raw data:", rawItems);
        }
    }
    return [];
};

export const AdminKanban = ({ localReservations = [], onUpdateStatus, onEditReservation }: { localReservations: any[], onUpdateStatus: (id: string, status: string) => void, onEditReservation: (id: string) => void }) => {
  
  const handlePrint = (res: any) => {
      const items = parseItemsData(res.items);
      const totalWeight = items.reduce((sum: number, item: any) => sum + Number(item.weight || 0), 0).toFixed(1);
      const hasTin = items.some((i: any) => i.material === '錫メッキ' || (i.product || i.name || '').includes('錫'));

      const itemsHtml = items.map((item: any) => {
          const itemName = item.product || item.name || '品名未設定';
          const itemMaterial = item.material || '純銅';
          const itemRatio = item.ratio !== undefined ? `${item.ratio}%` : '---';
          const itemWeight = item.weight !== undefined ? item.weight : '0';
          const isTinItem = itemMaterial === '錫メッキ' || itemName.includes('錫');

          return `
          <tr>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #111;">
                ${itemName}
                ${isTinItem ? '<span style="background: #fee2e2; color: #D32F2F; font-size: 10px; padding: 2px 4px; border-radius: 3px; margin-left: 5px;">⚠️錫</span>' : ''}
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${itemMaterial}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-family: monospace;">${itemRatio}</td>
              <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-family: monospace; font-weight: bold; font-size: 16px;">${itemWeight} kg</td>
          </tr>
          `;
      }).join('');

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
                  .info-grid { display: flex; justify-content: space-between; background: #f9f9f9; padding: 15px 20px; border-radius: 5px; margin-bottom: 30px; border: 1px solid #ddd; }
                  .info-box p { margin: 0 0 5px 0; font-size: 12px; color: #666; font-weight: bold; }
                  .info-box h3 { margin: 0; font-size: 18px; color: #111; }
                  table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                  th { background-color: #f1f5f9; padding: 12px 10px; text-align: left; font-size: 12px; color: #475569; border-bottom: 2px solid #cbd5e1; }
                  .total-row { display: flex; justify-content: flex-end; align-items: center; font-size: 24px; font-weight: 900; border-top: 2px solid #111; padding-top: 15px; }
                  .total-row span { font-size: 14px; color: #666; margin-right: 15px; font-weight: bold; }
                  .memo { margin-top: 40px; padding: 15px; border: 1px dashed #ccc; background: #fff; font-size: 12px; color: #444; border-radius: 5px; }
                  .alert { background: #fee2e2; border-left: 4px solid #D32F2F; padding: 10px; margin-bottom: 20px; font-size: 14px; color: #D32F2F; font-weight: bold; }
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
                  <tbody>${itemsHtml}</tbody>
              </table>
              <div class="total-row"><span>総重量</span> ${totalWeight} kg</div>
              ${res.memo ? `<div class="memo"><strong>【現場メモ / AI推論根拠】</strong><br/>${res.memo.replace(/\n/g, '<br/>')}</div>` : ''}
              <div style="margin-top: 50px; display: flex; justify-content: flex-end; gap: 50px;">
                  <div style="text-align: center; border-top: 1px solid #111; width: 200px; padding-top: 10px; font-size: 12px; color: #555;">検収担当者 印</div>
                  <div style="text-align: center; border-top: 1px solid #111; width: 200px; padding-top: 10px; font-size: 12px; color: #555;">事務所受領 印</div>
              </div>
              <script>window.onload = function() { setTimeout(() => { window.print(); window.close(); }, 300); };</script>
          </body>
          </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
  };

  const handleDragStart = (e: React.DragEvent, id: string) => { e.dataTransfer.setData('resId', id); };
  const handleDrop = (e: React.DragEvent, status: string) => { e.preventDefault(); const id = e.dataTransfer.getData('resId'); if (id) onUpdateStatus(id, status); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  // ★ デザインを白・黒・赤に完全統一
  const columns = [
    { 
      id: 'RESERVED', 
      title: '1. 受付・計量', 
      subtitle: 'フロント担当',
      icon: Icons.FrontDesk,
      desc: 'POSで受付。内容を確認して検収列へ。',
      borderColor: 'border-gray-900', 
      headerBg: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    { 
      id: 'RECEIVED', 
      title: '2. 検収完了 (ヤード待機)', 
      subtitle: '現場査定担当',
      icon: Icons.Inspection,
      desc: '現物確認済。プラントへの投入待ち。',
      borderColor: 'border-gray-900', 
      headerBg: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    { 
      id: 'IN_PROGRESS', 
      title: '3. プラント処理中', 
      subtitle: 'プラント担当',
      icon: Icons.Plant,
      desc: '現在ナゲット機や選別ラインで加工中。',
      borderColor: 'border-[#D32F2F]', 
      headerBg: 'bg-red-50',
      textColor: 'text-[#D32F2F]'
    },
    { 
      id: 'COMPLETED', 
      title: '4. 処理完了', 
      subtitle: '実績確定',
      icon: Icons.Check,
      desc: '加工終了。歩留まり確定済。',
      borderColor: 'border-gray-300', 
      headerBg: 'bg-gray-50',
      textColor: 'text-gray-500'
    }
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-sans">
      <header className="mb-4 flex items-center gap-2 shrink-0">
        <span className="w-1.5 h-6 bg-[#D32F2F] block"></span>
        <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">現場状況管理 (カンバン)</h2>
            <p className="text-xs text-gray-500 mt-1 font-bold">受付から製造までの全体ワークフロー管理</p>
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4 h-full items-stretch">
        {columns.map(col => {
          const safeReservations = localReservations || [];
          const colData = safeReservations.filter(r => r.status === col.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          return (
            <div key={col.id} className="flex-1 min-w-[300px] flex flex-col bg-gray-50 rounded-sm border border-gray-200 overflow-hidden shadow-sm" onDrop={(e) => handleDrop(e, col.id)} onDragOver={handleDragOver}>
              
              <div className={`p-3 border-t-4 ${col.borderColor} ${col.headerBg} border-b border-gray-200`}>
                <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold ${col.textColor} text-sm flex items-center tracking-widest`}>
                        <col.icon /> {col.title}
                    </h3>
                    <span className="bg-white px-2 py-0.5 rounded-sm border border-gray-300 text-xs font-bold text-gray-900 shadow-sm">{colData.length}</span>
                </div>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                {colData.map(res => {
                  const items = parseItemsData(res.items);
                  const totalW = items.reduce((sum: number, i: any) => sum + Number(i.weight || 0), 0);
                  const hasTin = items.some((i: any) => i.material === '錫メッキ' || (i.product || i.name || '').includes('錫'));

                  return (
                    <div key={res.id} draggable onDragStart={(e) => handleDragStart(e, res.id)} className={`bg-white p-3 rounded-sm shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md hover:border-gray-400 transition relative group ${hasTin ? 'border-red-400' : 'border-gray-300'}`}>
                      
                      {/* 左端のハイライト線 */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${hasTin ? 'bg-[#D32F2F]' : col.id === 'IN_PROGRESS' ? 'bg-[#D32F2F]' : 'bg-transparent'}`}></div>
                      
                      <div className="flex justify-between items-start mb-2 pl-1">
                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono font-bold"><Icons.Clock /> {formatTime(res.createdAt)}</div>
                        
                        <button onClick={() => handlePrint(res)} className="text-[10px] bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-2 py-1 rounded-sm shadow-sm flex items-center gap-1 transition opacity-0 group-hover:opacity-100 font-bold">
                            <Icons.Printer /> 帳票出力
                        </button>
                      </div>
                      
                      <div className="font-black text-gray-900 text-sm mb-2 flex items-center gap-1 pl-1">
                          <Icons.User /> {res.memberName || '新規・非会員'}
                      </div>

                      {hasTin && (
                          <div className="text-[10px] bg-[#D32F2F] text-white font-bold px-2 py-1 rounded-sm flex items-center gap-1 mb-2 shadow-sm ml-1">
                              <Icons.Alert /> 錫メッキ混入あり！別管理！
                          </div>
                      )}

                      <div className="bg-gray-50 rounded-sm p-2 text-xs mb-2 border border-gray-200 ml-1">
                        {items.length === 0 ? (
                            <div className="text-gray-400 text-center py-1 font-bold">データなし</div>
                        ) : (
                            items.slice(0, 3).map((item: any, idx: number) => {
                                const displayName = item.product || item.name || '不明な商材';
                                const displayWeight = item.weight !== undefined ? item.weight : '0';
                                const ratio = item.ratio !== undefined ? `${item.ratio}%` : '-';
                                
                                return (
                                    <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-0 truncate">
                                        <div className="flex flex-col min-w-0 pr-2">
                                            <span className="text-gray-900 font-bold truncate" title={displayName}>{displayName}</span>
                                            <span className="text-[9px] text-gray-500 font-mono">歩留: {ratio}</span>
                                        </div>
                                        <span className="font-mono font-black text-gray-900 shrink-0 text-sm tabular-nums">{displayWeight}kg</span>
                                    </div>
                                );
                            })
                        )}
                        {items.length > 3 && <div className="text-center text-[10px] text-gray-500 font-bold mt-1 pt-1 border-t border-gray-200">他 {items.length - 3} 品目...</div>}
                      </div>

                      <div className="flex justify-between items-end mt-3 ml-1">
                          <div className="text-[10px] text-gray-600 font-bold bg-gray-100 border border-gray-200 px-2 py-1 rounded-sm">
                              総重量: <span className="text-sm font-black text-gray-900 font-mono tabular-nums">{totalW.toFixed(1)}</span> kg
                          </div>
                          
                          {col.id === 'RESERVED' && (
                              <button onClick={() => onEditReservation(res.id)} className="text-[10px] text-gray-500 hover:text-gray-900 underline font-bold transition">
                                  POSで再編集
                              </button>
                          )}
                      </div>
                    </div>
                  );
                })}
                {colData.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm text-gray-400 p-4">
                        <span className="text-[10px] font-bold mb-2 text-center leading-relaxed">{col.desc}</span>
                        <span className="text-xs font-black bg-white px-3 py-1 rounded-sm border border-gray-200 shadow-sm">カードをドロップ</span>
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
