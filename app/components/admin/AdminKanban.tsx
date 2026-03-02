// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Play: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Alert: () => <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Scale: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

// ★追加：時間をスマートに表示するためのフォーマッター (MM/DD HH:mm)
const formatTimeShort = (timeStr: string) => {
  if (!timeStr) return '--/-- --:--';
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return timeStr.substring(0, 16); // 万が一のフォールバック
    const MM = String(d.getMonth() + 1).padStart(2, '0');
    const DD = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${MM}/${DD} ${HH}:${mm}`;
  } catch(e) { return timeStr; }
};

// ローカルでの仮時間生成用
const getLocalNow = () => {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
};

export const AdminKanban = ({ data }: { data: any }) => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [productions, setProductions] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRes, setSelectedRes] = useState<any>(null);
  
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // WN-800 専用の入力ステート
  const [inWeight, setInWeight] = useState<number | ''>('');
  const [outRed, setOutRed] = useState<number | ''>('');
  const [outMixed, setOutMixed] = useState<number | ''>('');
  const [outChips, setOutChips] = useState<number | ''>('');
  const [outJute, setOutJute] = useState<number | ''>('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (data?.reservations) {
      const activeFlow = data.reservations.filter((r:any) => r.status === 'RESERVED' || r.status === 'COMPLETED' || r.status === 'PROCESSING');
      setReservations(activeFlow);
    }
    if (data?.productions) {
      setProductions(data.productions.slice(-20).reverse());
    }
  }, [data]);

  const updateStatus = async (id: string, status: string) => {
    setIsProcessingId(id);
    try {
      const res = await fetch('/api/gas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE_RESERVATION_STATUS', reservationId: id, status })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      
      if (result.status === 'success') {
        const nowStr = getLocalNow();
        // ★修正：ステータス移動と同時に、updatedAtもローカルで即座に書き換える
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: nowStr } : r));
      } else {
        alert('GAS側のエラー: ' + result.message);
      }
    } catch (e: any) { 
      alert('通信エラーの詳細: ' + e.message); 
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleOpenModal = (res: any) => {
    setSelectedRes(res);
    let initialWeight = 0;
    try {
      const items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items;
      initialWeight = items.reduce((sum: number, it: any) => sum + (Number(it.weight) || 0), 0);
    } catch (e) {}
    
    setInWeight(initialWeight || '');
    setOutRed(''); setOutMixed(''); setOutChips(''); setOutJute(''); setMemo('');
    setIsModalOpen(true);
  };

  const handleSaveProduction = async () => {
    if (!inWeight || Number(inWeight) <= 0) return alert('投入重量を入力してください');
    setIsSubmitting(true);

    let materialName = '不明な品目';
    try {
      const items = typeof selectedRes.items === 'string' ? JSON.parse(selectedRes.items) : selectedRes.items;
      materialName = items.map((i:any) => i.product).join(' + ');
    } catch (e) {}

    const totalCopper = (Number(outRed) || 0) + (Number(outMixed) || 0);
    const actualRatio = Number(inWeight) > 0 ? (totalCopper / Number(inWeight)) * 100 : 0;

    const payload = {
      action: 'REGISTER_PRODUCTION',
      reservationId: selectedRes.id,
      memberName: selectedRes.memberName,
      materialName: materialName,
      inputWeight: Number(inWeight),
      outputRed: Number(outRed) || 0,
      outputMixed: Number(outMixed) || 0,
      outputChips: Number(outChips) || 0,
      outputJute: Number(outJute) || 0,
      actualRatio: actualRatio.toFixed(1),
      memo: memo
    };

    try {
      // 1. 実績の保存
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      
      if (result.status === 'success') {
        // 2. ステータスを「完了」へ更新
        await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_RESERVATION_STATUS', reservationId: selectedRes.id, status: 'PROCESSED' }) });
        
        const nowStr = getLocalNow();
        // ★修正：ローカルのStateを更新（履歴側にもタイムスタンプを持たせる）
        setReservations(prev => prev.filter(r => r.id !== selectedRes.id));
        setProductions(prev => [{ 
            memberName: selectedRes.memberName, 
            inputWeight: Number(inWeight), 
            actualRatio: actualRatio.toFixed(1),
            createdAt: nowStr 
        }, ...prev]);
        
        setIsModalOpen(false);
      } else {
        alert('エラー: ' + result.message);
      }
    } catch (e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  const waitingList = reservations.filter(r => r.status === 'RESERVED' || r.status === 'COMPLETED');
  const processingList = reservations.filter(r => r.status === 'PROCESSING');

  const renderCard = (res: any, type: 'WAITING' | 'PROCESSING') => {
    let items = [];
    try { items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items; } catch (e) {}
    const totalWeight = items.reduce((sum: number, it: any) => sum + (Number(it.weight) || 0), 0);
    const isLoading = isProcessingId === res.id;

    return (
      <div key={res.id} className={`bg-white border border-gray-200 rounded-sm shadow-sm p-4 mb-3 transition-all ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:shadow-md'}`}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-black text-gray-900 text-lg">{res.memberName}</h4>
          <span className="text-xs font-mono text-gray-400">{res.id.split('-')[1]}</span>
        </div>
        
        <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-sm border border-gray-100">
          {items.map((it:any, idx:number) => (
            <div key={idx} className="flex justify-between border-b border-gray-200 last:border-0 py-1">
              <span className="font-bold">{it.product}</span>
              <span>{it.weight} kg</span>
            </div>
          ))}
          <div className="flex justify-between mt-1 pt-1 border-t border-gray-300 font-black text-gray-900">
            <span>総重量</span>
            <span>{totalWeight} kg</span>
          </div>
        </div>
        
        {/* ★追加：タイムスタンプ表示エリア（控えめなグレーで表示） */}
        <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mb-3 bg-gray-50/50 p-1.5 rounded-sm border border-gray-100/50">
          <div className="flex items-center gap-1" title={`登録日時: ${res.createdAt}`}>
            <span>🕒</span> 登録 {formatTimeShort(res.createdAt)}
          </div>
          <div className="flex items-center gap-1" title={`最終更新: ${res.updatedAt}`}>
            <span>✏️</span> 更新 {formatTimeShort(res.updatedAt)}
          </div>
        </div>

        {type === 'WAITING' ? (
          <button 
            onClick={() => updateStatus(res.id, 'PROCESSING')} 
            disabled={isLoading}
            className="w-full py-2 bg-blue-50 text-blue-700 font-bold border border-blue-200 rounded-sm hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
          >
            {isLoading ? <><Icons.Refresh /> 処理中...</> : <><Icons.Play /> プラント投入 (稼働)</>}
          </button>
        ) : (
          <button 
            onClick={() => handleOpenModal(res)} 
            className="w-full py-3 bg-gray-900 text-white font-bold rounded-sm hover:bg-gray-800 transition shadow-md flex items-center justify-center gap-2 animate-pulse"
          >
            <Icons.Scale /> WN-800 排出計量
          </button>
        )}
      </div>
    );
  };

  const valIn = Number(inWeight) || 0;
  const valRed = Number(outRed) || 0;
  const valMixed = Number(outMixed) || 0;
  const valChips = Number(outChips) || 0;
  const valJute = Number(outJute) || 0;
  
  const totalOut = valRed + valMixed + valChips + valJute;
  const recoveryRate = valIn > 0 ? (totalOut / valIn) * 100 : 0;
  const actualYield = valIn > 0 ? ((valRed + valMixed) / valIn) * 100 : 0;
  
  const isWarning = valIn > 0 && (recoveryRate < 95 || recoveryRate > 102);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight">FACTORY KANBAN</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">WN-800 プラント稼働・バッチ管理システム</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[600px]">
        {/* 1. 処理待ち */}
        <div className="bg-gray-100 rounded-sm border border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-200/50 flex justify-between items-center">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span> 処理待ち (フレコン)
            </h3>
            <span className="bg-white text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">{waitingList.length}</span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto">
            {waitingList.map(res => renderCard(res, 'WAITING'))}
            {waitingList.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">待機中のロットはありません</p>}
          </div>
        </div>

        {/* 2. 稼働中 */}
        <div className="bg-blue-50/50 rounded-sm border border-blue-100 flex flex-col">
          <div className="p-4 border-b border-blue-100 bg-blue-100/50 flex justify-between items-center">
            <h3 className="font-bold text-blue-800 flex items-center gap-2 animate-pulse">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> プラント稼働中
            </h3>
            <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm">{processingList.length}</span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto">
            {processingList.map(res => renderCard(res, 'PROCESSING'))}
            {processingList.length === 0 && <p className="text-center text-gray-400 text-sm mt-10">稼働中のロットはありません</p>}
          </div>
        </div>

        {/* 3. 完了履歴 */}
        <div className="bg-white rounded-sm border border-gray-200 flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> 完了・計量履歴
            </h3>
          </div>
          <div className="p-0 flex-1 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 sticky top-0">
                <tr>
                  <th className="p-3">業者名 / 日時</th>
                  <th className="p-3 text-right">投入</th>
                  <th className="p-3 text-right">歩留</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productions.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-bold text-gray-800">{p.memberName}</div>
                      {/* ★追加：履歴テーブルにも完了日時を小さく表示 */}
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">{formatTimeShort(p.createdAt)}</div>
                    </td>
                    <td className="p-3 text-right text-gray-600 font-mono align-middle">{p.inputWeight}kg</td>
                    <td className="p-3 text-right font-black text-blue-600 font-mono align-middle">{p.actualRatio}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* WN-800 実績登録モーダル */}
      {isModalOpen && selectedRes && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-900 text-white rounded-t-sm">
              <h3 className="font-black text-lg flex items-center gap-2">
                <Icons.Scale /> WN-800 排出計量登録
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition"><Icons.Close /></button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
              <div className="mb-6 bg-white p-4 rounded-sm border border-gray-200 shadow-sm flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">対象顧客 / ロット</p>
                  <p className="text-xl font-black text-gray-900">{selectedRes.memberName}</p>
                </div>
                <div className="text-right w-1/3">
                  <label className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1 block">投入総重量 (kg)</label>
                  <input type="number" className="w-full text-right text-2xl font-black font-mono border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 p-1 text-gray-900" value={inWeight} onChange={e => setInWeight(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 p-3 rounded-sm border border-red-200 shadow-inner">
                  <label className="block text-xs font-bold text-red-800 mb-2">① 赤ナゲ (kg)<br/><span className="text-[10px] text-red-600">高品質銅</span></label>
                  <input type="number" className="w-full border-none bg-white p-3 rounded-sm font-black text-red-700 text-xl text-right outline-none ring-1 ring-red-300 focus:ring-2 focus:ring-red-500" value={outRed} onChange={e => setOutRed(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
                </div>
                <div className="bg-orange-50 p-3 rounded-sm border border-orange-200 shadow-inner">
                  <label className="block text-xs font-bold text-orange-800 mb-2">② 雑ナゲ (kg)<br/><span className="text-[10px] text-orange-600">微細・混じり</span></label>
                  <input type="number" className="w-full border-none bg-white p-3 rounded-sm font-black text-orange-700 text-xl text-right outline-none ring-1 ring-orange-300 focus:ring-2 focus:ring-orange-500" value={outMixed} onChange={e => setOutMixed(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
                </div>
                <div className="bg-gray-100 p-3 rounded-sm border border-gray-300 shadow-inner">
                  <label className="block text-xs font-bold text-gray-700 mb-2">③ 被覆チップ (kg)<br/><span className="text-[10px] text-gray-500">産廃1</span></label>
                  <input type="number" className="w-full border-none bg-white p-3 rounded-sm font-black text-gray-800 text-xl text-right outline-none ring-1 ring-gray-300 focus:ring-2 focus:ring-gray-500" value={outChips} onChange={e => setOutChips(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
                </div>
                <div className="bg-stone-100 p-3 rounded-sm border border-stone-300 shadow-inner">
                  <label className="block text-xs font-bold text-stone-700 mb-2">④ ジュート (kg)<br/><span className="text-[10px] text-stone-500">産廃2 / 紙・粉</span></label>
                  <input type="number" className="w-full border-none bg-white p-3 rounded-sm font-black text-stone-800 text-xl text-right outline-none ring-1 ring-stone-300 focus:ring-2 focus:ring-stone-500" value={outJute} onChange={e => setOutJute(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
                </div>
              </div>

              <div className="bg-white border-2 border-dashed border-gray-300 p-5 rounded-sm mb-4 relative">
                {isWarning && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md animate-pulse whitespace-nowrap">
                    <Icons.Alert /> 機内残留または計量ミスの可能性があります！
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div className="text-gray-500 font-bold text-sm">排出合計 / 回収率</div>
                  <div className="text-right">
                    <span className={`text-2xl font-black font-mono ${isWarning ? 'text-red-600' : 'text-gray-900'}`}>{totalOut.toFixed(1)}</span>
                    <span className="text-sm font-bold text-gray-500 mx-1">kg /</span>
                    <span className={`text-xl font-bold font-mono ${isWarning ? 'text-red-600' : 'text-green-600'}`}>{recoveryRate.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-blue-800 font-black text-lg">実測 銅・歩留まり</div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-blue-600 font-mono tracking-tighter">{actualYield.toFixed(1)}</span>
                    <span className="text-xl font-bold text-blue-600 ml-1">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">作業メモ・特記事項</label>
                <input type="text" className="w-full border border-gray-300 p-3 rounded-sm outline-none focus:border-blue-500 text-sm" value={memo} onChange={e => setMemo(e.target.value)} placeholder="例: 異物混入多め、刃の交換を実施 等" />
              </div>
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-white rounded-b-sm">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-sm transition">キャンセル</button>
              <button 
                onClick={handleSaveProduction} 
                disabled={isSubmitting || !inWeight || isWarning} 
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-gray-400 flex items-center gap-2 shadow-md active:scale-95"
              >
                {isSubmitting ? <><Icons.Refresh /> 保存中...</> : <><Icons.Check /> 計量確定して完了</>}
              </button>
            </div>
            
            {isWarning && <p className="text-center text-xs text-red-500 pb-3 font-bold bg-white">※合計が95%〜102%の範囲に収まるまで確定できません。</p>}
          </div>
        </div>
      )}
    </div>
  );
};
