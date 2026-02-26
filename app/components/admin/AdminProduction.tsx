// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Factory: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  User: () => <svg className="w-4 h-4 inline-block mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Worker: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Scissors: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2-2m-2 2l-2-2m0 0a2 2 0 10-2.828-2.828 2 2 0 002.828 2.828zM3 21a2 2 0 102.828-2.828 2 2 0 00-2.828 2.828z" /></svg>,
  Blend: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
};

const WORKERS = ["未選択", "工場長", "佐藤", "鈴木", "高橋", "田中", "パートA"];

export const AdminProduction = ({ data, localReservations }: { data: any, localReservations: any[] }) => {
  const [activeTab, setActiveTab] = useState<'SORT' | 'PROCESS' | 'LOG'>('SORT');
  
  // モーダル制御
  const [sortingLot, setSortingLot] = useState<any>(null);
  const [blendingLots, setBlendingLots] = useState<any[]>([]);
  
  // 状態管理
  const [checkedLotIds, setCheckedLotIds] = useState<string[]>([]);

  // フォームステート (選別用)
  const [sortOutputs, setSortOutputs] = useState([{ product: '', weight: '' }]);
  const [sortDust, setSortDust] = useState('');
  const [sortTime, setSortTime] = useState('');
  const [sortWorker, setSortWorker] = useState('未選択');

  // フォームステート (ブレンド加工用)
  const [processInputWeight, setProcessInputWeight] = useState('');
  const [processOutputCopper, setProcessOutputCopper] = useState('');
  const [processWorker, setProcessWorker] = useState('未選択');
  const [processMemo, setProcessMemo] = useState('');         
  const [isSubmitting, setIsSubmitting] = useState(false);

  // データソース (GASから取得した本番データ)
  const productions = data?.productions || [];
  const sortings = data?.sortings || [];
  const wiresMaster = data?.wires || [];

  // ==========================================
  // 動的在庫の計算ロジック (本番環境仕様)
  // ==========================================
  const { toSortLots, readyLots } = useMemo(() => {
      let rawLots: any[] = [];
      
      // 1. 選別済/加工済として消費されたロットIDのリストを作成
      const consumedBySort = new Set(sortings.map((s:any) => s.originalLotId));
      const consumedByProcess = new Set();
      productions.forEach((p:any) => {
          if (p.consumedLotIds) {
              p.consumedLotIds.split(',').forEach((id:string) => consumedByProcess.add(id.trim()));
          } else if (p.reservationId && !p.consumedLotIds) {
              // 過去の互換性用 (古いデータ対応)
              consumedByProcess.add(`${p.reservationId}-0`);
          }
      });

      // 2. POS受付済みのロット(仕入れ分)を展開
      localReservations.filter(r => r.status === 'COMPLETED').forEach(res => {
          let items = [];
          try { 
              let temp = res.items; if (typeof temp === 'string') temp = JSON.parse(temp); if (typeof temp === 'string') temp = JSON.parse(temp);
              if (Array.isArray(temp)) items = temp;
          } catch(e) {}
          
          items.forEach((it: any, idx: number) => {
              const product = it.product || it.productName;
              const initialWeight = Number(it.weight) || 0;
              const lotId = `${res.id}-${idx}`; // POSから生まれたロットID

              // 選別も加工もされていない場合のみ在庫に追加
              if (initialWeight > 0 && product && !consumedBySort.has(lotId) && !consumedByProcess.has(lotId)) {
                  rawLots.push({
                      lotId, reservationId: res.id, memberName: res.memberName || '名称未設定',
                      date: res.visitDate ? String(res.visitDate).substring(5, 16) : '不明', 
                      product: product, remainingWeight: initialWeight, 
                      isSorted: false
                  });
              }
          });
      });

      // 3. 選別によって新たに生まれたロット(Sortings)を展開
      sortings.forEach((sortRecord: any) => {
          let outputs = [];
          try {
             outputs = typeof sortRecord.outputsJSON === 'string' ? JSON.parse(sortRecord.outputsJSON) : sortRecord.outputsJSON;
          } catch(e) {}

          outputs.forEach((out: any, idx: number) => {
              const lotId = `${sortRecord.id}-${idx}`; // 選別から生まれたロットID
              
              // まだ加工されていない場合のみ在庫に追加
              if (Number(out.weight) > 0 && out.product && !consumedByProcess.has(lotId)) {
                  rawLots.push({
                      lotId, reservationId: sortRecord.reservationId, memberName: `${sortRecord.memberName} (選別)`,
                      date: sortRecord.date ? String(sortRecord.date).substring(5, 16) : '不明', 
                      product: out.product, remainingWeight: Number(out.weight), 
                      isSorted: true
                  });
              }
          });
      });

      // 4. 選別待ち(雑線など) と 加工待ち(特号線、選別済みの線) に振り分け
      const sortList: any[] = [];
      const processList: any[] = [];

      rawLots.forEach(lot => {
          if (!lot.isSorted && (lot.product.includes('雑線') || lot.product.includes('家電') || lot.product.includes('未選別'))) {
              sortList.push(lot);
          } else {
              processList.push(lot);
          }
      });

      return { toSortLots: sortList, readyLots: processList };
  }, [localReservations, productions, sortings]);

  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);

  // 選別アクションの実行 (GASへPOST)
  const handleSortSubmit = async () => {
      if (!sortingLot || isSubmitting) return;
      setIsSubmitting(true);
      
      const payload = {
          action: 'REGISTER_SORTING',
          originalLotId: sortingLot.lotId,
          reservationId: sortingLot.reservationId,
          memberName: sortingLot.memberName,
          worker: sortWorker,
          timeMinutes: Number(sortTime) || 0,
          dustWeight: Number(sortDust) || 0,
          outputs: sortOutputs.filter(o => o.product && o.weight)
      };

      try {
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              alert('選別結果を保存しました！');
              setSortingLot(null);
              setSortOutputs([{ product: '', weight: '' }]);
              setSortDust(''); setSortTime(''); setSortWorker('未選択');
              setActiveTab('PROCESS'); 
              window.location.reload(); // 最新のGASデータを再取得
          } else { alert('エラー: ' + result.message); }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSubmitting(false);
  };

  // ブレンド加工モーダルを開く
  const openBlendModal = () => {
      const selected = readyLots.filter(l => checkedLotIds.includes(l.lotId));
      if (selected.length === 0) return alert('加工するロットを選択してください');
      setBlendingLots(selected);
      const totalWeight = selected.reduce((sum, l) => sum + l.remainingWeight, 0);
      setProcessInputWeight(String(totalWeight));
      setProcessOutputCopper('');
      setProcessWorker('未選択');
      setProcessMemo('');
  };

  // ブレンド加工アクション (GASへPOST)
  const handleProcessSubmit = async () => {
      if (blendingLots.length === 0 || !processInputWeight || !processOutputCopper) return;
      if (Number(processOutputCopper) > Number(processInputWeight)) return alert("産出重量が投入重量を上回っています。");
      
      setIsSubmitting(true);
      const inW = parseFloat(processInputWeight);
      const outC = parseFloat(processOutputCopper);
      const ratio = ((outC / inW) * 100).toFixed(1);

      const materialNames = blendingLots.map(l => l.product).join(' + ');
      const mixedName = blendingLots.length > 1 ? `混合バッチ (${materialNames})` : blendingLots[0].product;
      const reservationIds = blendingLots.map(l => l.reservationId).join(',');
      const consumedLotIds = blendingLots.map(l => l.lotId).join(','); // ★消費ロットIDを記録

      try {
          const payload = {
              action: 'REGISTER_PRODUCTION', 
              reservationId: reservationIds.substring(0, 40),
              consumedLotIds: consumedLotIds, // GAS側で保存できるように追加
              memberName: blendingLots.length > 1 ? 'ブレンド処理' : blendingLots[0].memberName,
              materialName: mixedName.substring(0, 50), 
              inputWeight: inW, 
              outputCopper: outC,
              actualRatio: parseFloat(ratio), 
              memo: `作業者: ${processWorker} | 元ロット: ${blendingLots.length}件 | ${processMemo}`
          };
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { 
              alert('加工データを記録しました！');
              setBlendingLots([]);
              setCheckedLotIds([]);
              window.location.reload(); 
          } else { alert('エラー: ' + result.message); }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans max-w-7xl mx-auto w-full">
      <header className="mb-6 flex-shrink-0 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
            <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
            生産・選別ワークフロー
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">PRODUCTION & SORTING WORKFLOW</p>
      </header>

      <div className="flex-shrink-0 bg-[#111] rounded-sm shadow-sm p-5 md:p-6 text-white mb-6 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 text-[#D32F2F]"><Icons.Factory /></div>
          <div className="relative z-10">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pure Copper Produced</h3>
              <p className="text-sm font-bold text-gray-200">累計 ピカ銅生産量</p>
          </div>
          <div className="flex items-end gap-2 relative z-10 mt-2 md:mt-0">
              <span className="text-4xl font-black text-white font-mono tracking-tighter leading-none">{totalProducedCopper.toLocaleString()}</span>
              <span className="text-lg text-gray-400 font-bold mb-0.5">kg</span>
          </div>
      </div>

      {/* タブ */}
      <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto">
          <button onClick={() => setActiveTab('SORT')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'SORT' ? 'bg-white border-t-2 border-t-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icons.Scissors /> 1. 選別待ち ({toSortLots.length})
          </button>
          <button onClick={() => setActiveTab('PROCESS')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'PROCESS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icons.Blend /> 2. 加工待ちヤード ({readyLots.length})
          </button>
          <button onClick={() => setActiveTab('LOG')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'LOG' ? 'bg-white border-t-2 border-t-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              <Icons.Check /> 3. 製造実績ログ
          </button>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 bg-white border-x border-b border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
          
          {/* ==========================================
              タブ1: 選別待ち (SORT)
             ========================================== */}
          {activeTab === 'SORT' && (
              <div className="p-4 overflow-y-auto bg-gray-50 flex-1">
                  {toSortLots.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 font-bold text-sm">選別待ちの荷物はありません</div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {toSortLots.map(lot => (
                              <div key={lot.lotId} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm hover:border-blue-400 transition flex flex-col">
                                  <div className="flex justify-between items-start mb-3">
                                      <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-sm">未選別</span>
                                      <span className="text-[10px] text-gray-400 font-mono">{lot.date} 入庫</span>
                                  </div>
                                  <h4 className="font-black text-gray-900 text-base mb-1">{lot.product}</h4>
                                  <p className="text-xs text-gray-500 flex items-center mb-4"><Icons.User /> {lot.memberName}</p>
                                  <div className="mt-auto border-t border-gray-100 pt-3 flex justify-between items-center">
                                      <p className="text-2xl font-black font-mono text-gray-900">{lot.remainingWeight.toFixed(1)}<span className="text-xs font-bold text-gray-500 ml-1">kg</span></p>
                                      <button onClick={() => setSortingLot(lot)} className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-sm shadow-sm hover:bg-blue-700 transition">選別する</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {/* ==========================================
              タブ2: 加工待ち (PROCESS)
             ========================================== */}
          {activeTab === 'PROCESS' && (
              <div className="flex flex-col h-full relative">
                  <div className="p-0 overflow-y-auto flex-1">
                      <table className="w-full text-left border-collapse">
                          <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                              <tr>
                                  <th className="p-3 w-12 text-center"><input type="checkbox" onChange={(e) => setCheckedLotIds(e.target.checked ? readyLots.map(l=>l.lotId) : [])} checked={checkedLotIds.length === readyLots.length && readyLots.length > 0} className="w-4 h-4 accent-[#D32F2F]" /></th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">状態/入庫</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">品目</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">業者・出処</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-900 uppercase tracking-widest text-right">重量</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {readyLots.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-sm font-bold text-gray-400">加工待ちのヤード在庫はありません</td></tr>}
                              {readyLots.map(lot => (
                                  <tr key={lot.lotId} className={`hover:bg-red-50/30 transition cursor-pointer ${checkedLotIds.includes(lot.lotId) ? 'bg-red-50/50' : ''}`} onClick={() => setCheckedLotIds(prev => prev.includes(lot.lotId) ? prev.filter(id => id !== lot.lotId) : [...prev, lot.lotId])}>
                                      <td className="p-3 text-center" onClick={e => e.stopPropagation()}><input type="checkbox" className="w-4 h-4 accent-[#D32F2F]" checked={checkedLotIds.includes(lot.lotId)} onChange={() => setCheckedLotIds(prev => prev.includes(lot.lotId) ? prev.filter(id => id !== lot.lotId) : [...prev, lot.lotId])} /></td>
                                      <td className="p-3">
                                          <div className="flex flex-col items-start gap-1">
                                              {lot.isSorted ? <span className="text-[9px] font-bold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-sm whitespace-nowrap">選別済</span> : <span className="text-[9px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded-sm whitespace-nowrap">原反</span>}
                                              <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">{lot.date}</span>
                                          </div>
                                      </td>
                                      <td className="p-3 font-bold text-sm text-gray-900">{lot.product}</td>
                                      <td className="p-3 text-xs text-gray-600">{lot.memberName}</td>
                                      <td className="p-3 text-right font-black font-mono text-lg text-gray-900">{lot.remainingWeight.toFixed(1)}<span className="text-[10px] text-gray-500 font-normal ml-1">kg</span></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                  
                  {/* フローティング アクションバー */}
                  {checkedLotIds.length > 0 && (
                      <div className="absolute bottom-0 left-0 w-full bg-[#111] text-white p-3 md:p-4 flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom-5">
                          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                              <span className="text-xs md:text-sm font-bold bg-gray-800 px-2 md:px-3 py-1 rounded-sm border border-gray-700">{checkedLotIds.length} 件選択中</span>
                              <span className="text-[10px] md:text-xs text-gray-400">合計 <span className="text-lg md:text-xl font-black font-mono text-white ml-1">{readyLots.filter(l => checkedLotIds.includes(l.lotId)).reduce((sum, l) => sum + l.remainingWeight, 0).toFixed(1)}</span> kg</span>
                          </div>
                          <button onClick={openBlendModal} className="bg-[#D32F2F] hover:bg-red-700 text-white px-4 md:px-6 py-2.5 rounded-sm font-bold text-xs md:text-sm shadow-lg flex items-center gap-2 transition whitespace-nowrap">
                              <Icons.Blend /> {checkedLotIds.length > 1 ? 'ブレンド加工' : '単体加工'}へ進む
                          </button>
                      </div>
                  )}
              </div>
          )}

          {/* ==========================================
              タブ3: 実績ログ (LOG)
             ========================================== */}
          {activeTab === 'LOG' && (
              <div className="p-0 overflow-y-auto flex-1">
                  <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                          <tr>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">加工日時</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">対象バッチ</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">投入量</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">産出銅</th>
                              <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">歩留</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {productions.slice(-20).reverse().map((p: any, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50 transition">
                                  <td className="p-3 text-xs text-gray-500 font-mono whitespace-nowrap">{String(p.date).substring(5,16)}</td>
                                  <td className="p-3">
                                      <p className="text-xs font-bold text-gray-900">{p.materialName}</p>
                                      <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-1">{p.memberName}</p>
                                  </td>
                                  <td className="p-3 text-right text-sm font-mono text-gray-600 whitespace-nowrap">{p.inputWeight} kg</td>
                                  <td className="p-3 text-right text-sm font-mono font-bold text-gray-900 whitespace-nowrap">{p.outputCopper} kg</td>
                                  <td className="p-3 text-right whitespace-nowrap"><span className="text-sm font-mono font-black text-[#D32F2F]">{p.actualRatio}%</span></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>

      {/* ==========================================
          モーダル1: 選別作業の入力
         ========================================== */}
      {sortingLot && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <div>
                          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Icons.Scissors /> 選別結果の登録</h3>
                          <p className="text-xs text-gray-500 mt-1 font-mono">元ロット: {sortingLot.product} ({sortingLot.remainingWeight}kg)</p>
                      </div>
                      <button onClick={() => setSortingLot(null)} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 space-y-6">
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm flex items-center gap-4 overflow-x-auto">
                          <label className="text-sm font-bold text-blue-900 whitespace-nowrap">作業担当</label>
                          <select className="w-full min-w-[100px] bg-white border border-blue-300 p-2 text-sm font-bold rounded-sm outline-none" value={sortWorker} onChange={e => setSortWorker(e.target.value)}>
                              {WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                          <label className="text-sm font-bold text-blue-900 whitespace-nowrap ml-2">時間</label>
                          <div className="relative w-24 md:w-32 flex-shrink-0">
                              <input type="number" className="w-full border border-blue-300 p-2 pr-8 text-sm font-mono rounded-sm outline-none text-right" placeholder="0" value={sortTime} onChange={e => setSortTime(e.target.value)} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">分</span>
                          </div>
                      </div>

                      <div>
                          <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest border-b border-gray-200 pb-1">仕分け後の線材</h4>
                          <div className="space-y-2">
                              {sortOutputs.map((out, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 border border-gray-200 rounded-sm">
                                      <select className="flex-1 p-2 bg-white border border-gray-300 rounded-sm text-xs md:text-sm font-bold outline-none" value={out.product} onChange={e => { const newOut = [...sortOutputs]; newOut[idx].product = e.target.value; setSortOutputs(newOut); }}>
                                          <option value="">品目を選択</option>
                                          {wiresMaster.map((w:any) => <option key={w.id} value={w.name}>{w.name}</option>)}
                                      </select>
                                      <div className="relative w-24 md:w-32 flex-shrink-0">
                                          <input type="number" className="w-full p-2 pr-6 border border-gray-300 rounded-sm text-sm font-mono text-right outline-none" placeholder="0" value={out.weight} onChange={e => { const newOut = [...sortOutputs]; newOut[idx].weight = e.target.value; setSortOutputs(newOut); }} />
                                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
                                      </div>
                                      <button onClick={() => setSortOutputs(sortOutputs.filter((_, i) => i !== idx))} className="p-2 text-gray-400 hover:text-red-600"><Icons.Trash /></button>
                                  </div>
                              ))}
                          </div>
                          <button onClick={() => setSortOutputs([...sortOutputs, { product: '', weight: '' }])} className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 p-2"><Icons.Plus /> 品目を追加</button>
                      </div>

                      <div>
                          <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest border-b border-gray-200 pb-1">除去したゴミ・異物</h4>
                          <div className="flex items-center gap-4 bg-gray-50 p-3 border border-gray-200 rounded-sm">
                              <span className="text-xs md:text-sm font-bold text-gray-700 flex-1">鉄・プラ等の重量</span>
                              <div className="relative w-24 md:w-32 flex-shrink-0">
                                  <input type="number" className="w-full p-2 pr-6 border border-gray-300 rounded-sm text-sm font-mono text-right outline-none" placeholder="0" value={sortDust} onChange={e => setSortDust(e.target.value)} />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
                              </div>
                          </div>
                      </div>

                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-100">
                      <button onClick={handleSortSubmit} disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-sm font-bold text-sm shadow-sm hover:bg-blue-700 transition disabled:opacity-50">
                          {isSubmitting ? '保存中...' : '選別結果を保存する'}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* ==========================================
          モーダル2: ブレンド加工の入力
         ========================================== */}
      {blendingLots.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-white rounded-sm shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                      <div>
                          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Icons.Blend /> {blendingLots.length > 1 ? 'ブレンド' : '単体'}加工の登録</h3>
                          <div className="text-xs text-gray-500 mt-2 space-y-1 bg-white p-2 border border-gray-200 rounded-sm max-h-24 overflow-y-auto">
                              {blendingLots.map(l => (
                                  <div key={l.lotId} className="flex justify-between font-mono"><span>{l.product}</span><span>{l.remainingWeight}kg</span></div>
                              ))}
                          </div>
                      </div>
                      <button onClick={() => setBlendingLots([])} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 space-y-5">
                      
                      <div className="bg-[#111] p-4 rounded-sm flex items-center gap-4 text-white">
                          <label className="text-sm font-bold flex items-center whitespace-nowrap text-gray-300"><Icons.Worker /> 担当</label>
                          <select className="w-full bg-gray-800 border border-gray-700 p-2 text-sm font-bold rounded-sm outline-none" value={processWorker} onChange={e => setProcessWorker(e.target.value)}>
                              {WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-2">投入重量 (kg)</label>
                              <div className="relative">
                                  <input type="number" className="w-full bg-gray-50 border border-gray-300 p-3 pr-8 rounded-sm text-xl font-black font-mono text-right outline-none focus:border-[#D32F2F]" value={processInputWeight} onChange={e => setProcessInputWeight(e.target.value)} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">kg</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-[#D32F2F] mb-2">産出ピカ銅 (kg)</label>
                              <div className="relative">
                                  <input type="number" className="w-full bg-red-50 border border-red-200 p-3 pr-8 rounded-sm text-xl font-black font-mono text-red-700 text-right outline-none focus:border-[#D32F2F] shadow-inner" value={processOutputCopper} onChange={e => setProcessOutputCopper(e.target.value)} placeholder="0" />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-red-500 font-bold">kg</span>
                              </div>
                          </div>
                      </div>

                      {processInputWeight && processOutputCopper && (
                          <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 text-center">
                              <p className="text-xs text-gray-500 font-bold mb-1 tracking-widest">実測歩留まり</p>
                              <p className="text-3xl font-black font-mono text-gray-900">
                                  {((parseFloat(processOutputCopper) / parseFloat(processInputWeight)) * 100).toFixed(1)} <span className="text-base font-normal">%</span>
                              </p>
                          </div>
                      )}

                      <div>
                          <label className="block text-xs font-bold text-gray-500 mb-2">特記事項</label>
                          <input type="text" className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-[#D32F2F]" placeholder="メモ..." value={processMemo} onChange={e => setProcessMemo(e.target.value)} />
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-gray-100">
                      <button onClick={handleProcessSubmit} disabled={!processOutputCopper || isSubmitting} className="w-full bg-[#D32F2F] text-white py-3.5 rounded-sm font-bold text-base shadow-sm hover:bg-red-800 transition disabled:opacity-50">
                          {isSubmitting ? '処理中...' : '加工実績を保存する'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
