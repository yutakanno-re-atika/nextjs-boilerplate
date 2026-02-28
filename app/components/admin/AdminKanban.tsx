// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Clock: () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  ShieldCheck: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Handshake: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
};

// ★ プロベナンス・バッジ
const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN':
            return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'CO_OP':
            return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
        case 'AI_AUTO':
            return <span className={`${baseStyle} bg-gray-400`} title="AI予測・推論データ">AI</span>;
        default:
            return null;
    }
};

export const AdminKanban = ({ data, localReservations, setLocalReservations, onOpenPos, onAddClick }: { data: any; localReservations: any[]; setLocalReservations: any; onOpenPos: (id: string) => void; onAddClick: () => void; }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // ★ トラスト・トグル
  const [showAiData, setShowAiData] = useState(true);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

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

  const handlePrintReport = async () => {
      setIsGeneratingReport(true);

      const reservedCount = localReservations.filter(r => r.status === 'RESERVED').length;
      const progressCount = localReservations.filter(r => r.status === 'IN_PROGRESS').length;
      const completedCount = localReservations.filter(r => r.status === 'COMPLETED').length;

      const promptData = `
      ・データモード: ${showAiData ? 'AI予測データ含む' : '実測確定データのみ'}
      ・受付・来店待ち: ${reservedCount} 件
      ・検収・計量中: ${progressCount} 件
      ・未加工のヤード在庫: ${completedCount} 件
      ※工場長や現場責任者が確認する『本日のヤード稼働状況スケジュール』です。滞留している場所の指摘や、本日の現場のボトルネック解消に向けた指示出しを行ってください。
      `;

      try {
          const res = await fetch('/api/print-summary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pageName: '本日のヤード稼働状況', promptData })
          });
          const result = await res.json();
          if (result.success) {
              setAiSummary(result.summary);
              setTimeout(() => {
                  window.print();
                  setIsGeneratingReport(false);
              }, 500);
          } else {
              alert('AI要約の生成に失敗しました: ' + result.message);
              setIsGeneratingReport(false);
          }
      } catch(e) {
          alert('通信エラーが発生しました');
          setIsGeneratingReport(false);
      }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 text-gray-800 relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* --- 通常の画面 --- */}
      <div className="print:hidden flex flex-col h-full">
          <header className="mb-4 flex flex-col md:flex-row justify-between md:items-end flex-shrink-0 pb-4 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 font-serif">
                 <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                 現場状況管理
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">リアルタイム状況監視</p>
            </div>
            
            <div className="flex gap-3 items-center">
                {/* ★ トラスト・トグル */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-gray-300 shadow-sm mr-2">
                    <button 
                        onClick={() => setShowAiData(true)}
                        className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        MIX
                    </button>
                    <button 
                        onClick={() => setShowAiData(false)}
                        className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${!showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        HUMAN ONLY
                    </button>
                </div>

                <button 
                    onClick={handlePrintReport} 
                    disabled={isGeneratingReport}
                    className="bg-white border border-gray-300 text-gray-800 px-4 py-2.5 rounded-sm text-sm font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                    {isGeneratingReport ? <Icons.Refresh /> : <Icons.Print />}
                    {isGeneratingReport ? 'AI分析中...' : 'スケジュール印刷'}
                </button>
                <button onClick={onAddClick} className="bg-[#111] text-white px-5 py-2.5 rounded-sm text-sm font-bold hover:bg-[#D32F2F] transition flex items-center gap-2 shadow-sm whitespace-nowrap">
                  <Icons.Plus /> 新規受付
                </button>
            </div>
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
                        <div className="absolute top-3 right-3">
                            <ProvenanceBadge type="HUMAN" />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                              <Icons.Clock />
                              <span>{res.visitDate ? String(res.visitDate).substring(5, 16) : ''}</span>
                          </div>
                          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm mr-12">{res.id}</span>
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

      {/* --- 🖨️ 印刷用レポート専用レイアウト --- */}
      <div className="hidden print:block w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto font-sans">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-black font-serif tracking-widest">本日のヤード稼働状況</h1>
                  <p className="text-sm font-bold text-gray-600 mt-2">株式会社月寒製作所 苫小牧工場</p>
              </div>
              <div className="text-right">
                  <p className="text-lg font-bold font-mono">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
                  <p className="text-xs font-bold bg-black text-white px-2 py-0.5 inline-block mt-1">
                      {showAiData ? 'MIX (AI予測 + 実測)' : 'HUMAN ONLY (実測確定のみ)'}
                  </p>
              </div>
          </div>

          {/* AIサマリーセクション */}
          <section className="mb-8 border-2 border-black p-6 rounded-sm bg-gray-50 relative">
              {showAiData && <div className="absolute top-2 right-2"><ProvenanceBadge type="AI_AUTO" /></div>}
              <h2 className="text-lg font-black text-black flex items-center gap-2 mb-4">
                  <Icons.Brain /> AI参謀からの現場オペレーション指示
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-bold text-gray-800">
                  {showAiData ? (aiSummary || "（データ処理中です...）") : "※AI予測モードがOFFのため、インサイトは表示されません。"}
              </div>
          </section>

          {/* カンバン各ステータスのリスト出力 */}
          <div className="space-y-8">
              {columns.map(col => {
                  const itemsInCol = localReservations.filter(r => r.status === col.id);
                  if (itemsInCol.length === 0) return null;

                  return (
                      <section key={col.id} className="relative">
                          <h2 className="text-sm font-bold text-white bg-black px-3 py-1.5 inline-block mb-3">
                              {col.title} ({itemsInCol.length} 件)
                          </h2>
                          <div className="border border-gray-400 p-0 relative">
                              <div className="absolute -top-6 right-0"><ProvenanceBadge type="HUMAN" /></div>
                              <table className="w-full text-left border-collapse text-sm">
                                  <thead>
                                      <tr className="border-b border-gray-400 bg-gray-100 text-xs">
                                          <th className="py-2 px-3 w-[20%]">来店予定・時刻</th>
                                          <th className="py-2 px-3 w-[35%]">業者名</th>
                                          <th className="py-2 px-3 w-[45%]">持込予定品目 / 重量</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-300">
                                      {itemsInCol.map(res => {
                                          const items = parseItems(res.items);
                                          return (
                                              <tr key={res.id}>
                                                  <td className="py-2 px-3 font-mono text-xs text-gray-600">{res.visitDate ? String(res.visitDate).substring(5, 16) : '-'}</td>
                                                  <td className="py-2 px-3 font-bold">{res.memberName}</td>
                                                  <td className="py-2 px-3 text-xs">
                                                      {items.map((it:any, idx:number) => (
                                                          <div key={idx} className="flex justify-between">
                                                              <span>{it.productName || it.product}</span>
                                                              <span className="font-mono font-bold">{it.weight ? `${it.weight}kg` : ''}</span>
                                                          </div>
                                                      ))}
                                                  </td>
                                              </tr>
                                          )
                                      })}
                                  </tbody>
                              </table>
                          </div>
                      </section>
                  )
              })}
          </div>
          
          <div className="mt-8 text-center text-[10px] font-mono text-gray-400">
              GENERATED BY FACTORY OS - AI CONCIERGE ENGINE
          </div>
      </div>

    </div>
  );
};
