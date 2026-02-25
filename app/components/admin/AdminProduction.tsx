// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Factory: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  User: () => <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Tag: () => <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Clock: () => <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Worker: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
};

const WORKERS = ["未選択", "工場長", "佐藤", "鈴木", "高橋", "田中", "パートA"];

export const AdminProduction = ({ data, localReservations }: { data: any, localReservations: any[] }) => {
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [inputWeight, setInputWeight] = useState('');
  const [outputCopper, setOutputCopper] = useState('');
  const [workTime, setWorkTime] = useState(''); 
  const [workerName, setWorkerName] = useState('未選択');
  const [memo, setMemo] = useState('');         
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  let lotInventory: any[] = [];
  localReservations.filter(r => r.status === 'COMPLETED').forEach(res => {
      let items = [];
      try { 
          let temp = res.items; if (typeof temp === 'string') temp = JSON.parse(temp); if (typeof temp === 'string') temp = JSON.parse(temp);
          if (Array.isArray(temp)) items = temp;
      } catch(e) {}

      items.forEach((it: any, idx: number) => {
          const product = it.product || it.productName;
          const initialWeight = Number(it.weight) || 0;
          if (initialWeight > 0 && product) {
              const isWire = wiresMaster.some((w: any) => w.name === product) || product.includes('線') || product.includes('VVF') || product.includes('VA');
              if (isWire) {
                  const processedWeight = productions.filter((p: any) => p.reservationId === res.id && p.materialName === product).reduce((sum: number, p: any) => sum + (Number(p.inputWeight) || 0), 0);
                  const remainingWeight = initialWeight - processedWeight;
                  if (remainingWeight > 0) {
                      const productMaster = wiresMaster.find((w: any) => w.name === product);
                      lotInventory.push({
                          lotId: `${res.id}-${idx}`, reservationId: res.id, memberName: res.memberName || '名称未設定',
                          date: res.visitDate ? String(res.visitDate).substring(5, 16) : '不明', 
                          createdAt: res.createdAt ? String(res.createdAt).substring(5, 16) : '不明',
                          product: product, maker: productMaster?.maker, sq: productMaster?.sq, core: productMaster?.core,
                          remainingWeight: remainingWeight, expectedRatio: productMaster ? productMaster.ratio : 0
                      });
                  }
              }
          }
      });
  });
  lotInventory.sort((a, b) => a.date.localeCompare(b.date));

  const calcActualRatio = () => {
      const inW = parseFloat(inputWeight); const outC = parseFloat(outputCopper);
      if (inW > 0 && outC > 0) return ((outC / inW) * 100).toFixed(1);
      return '0.0';
  };

  const handleSelectLot = (lot: any) => { 
      setSelectedLot(lot); 
      setInputWeight(String(lot.remainingWeight)); 
      setOutputCopper(''); setWorkTime(''); setWorkerName('未選択'); setMemo('');
  };

  const handleSubmit = async () => {
      if (!selectedLot || !inputWeight || !outputCopper) return;
      if (Number(outputCopper) > Number(inputWeight)) return alert("産出重量が投入重量を上回っています。");
      
      setIsSubmitting(true);
      try {
          const payload = {
              action: 'REGISTER_PRODUCTION', reservationId: selectedLot.reservationId, memberName: selectedLot.memberName,
              materialName: selectedLot.product, inputWeight: parseFloat(inputWeight), outputCopper: parseFloat(outputCopper),
              actualRatio: parseFloat(calcActualRatio()), memo: `作業者: ${workerName} | 時間: ${workTime || 0}分 | ${memo}`
          };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { 
              alert('加工データを記録しました！');
              setSelectedLot(null); window.location.reload(); 
          } else { alert('エラー: ' + result.message); }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSubmitting(false);
  };

  const inputClass = "w-full bg-transparent border-b border-gray-300 py-3 text-2xl font-mono text-gray-900 outline-none focus:border-[#D32F2F] transition rounded-none";

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex-shrink-0 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
             Production / MES
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-4">MANUFACTURING EXECUTION SYSTEM</p>
      </header>

      {/* スプリットペインレイアウト (左: リスト, 右: フォーム) */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* 左ペイン：在庫リスト */}
          <div className="w-full lg:w-1/3 flex flex-col bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden flex-shrink-0 lg:flex-shrink">
              <div className="p-4 border-b border-gray-200 bg-[#FAFAFA] flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Unprocessed Inventory</span>
                  <span className="text-xs font-mono font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded">{lotInventory.length}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#FAFAFA]">
                  {lotInventory.length === 0 ? (
                      <p className="p-8 text-center text-xs text-gray-400 font-medium">現在、加工待ちの在庫はありません。</p>
                  ) : lotInventory.map((lot) => {
                      const isActive = selectedLot?.lotId === lot.lotId;
                      return (
                          <div 
                              key={lot.lotId} onClick={() => handleSelectLot(lot)}
                              className={`p-3 rounded-sm cursor-pointer transition-all border ${isActive ? 'bg-white border-[#D32F2F] shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100'}`}
                          >
                              <div className="flex justify-between items-start mb-1">
                                  <p className={`text-sm font-bold truncate pr-2 ${isActive ? 'text-[#D32F2F]' : 'text-gray-900'}`}>{lot.memberName}</p>
                                  <p className="text-sm font-mono font-black text-gray-900">{lot.remainingWeight.toFixed(1)}<span className="text-[10px] text-gray-500 font-sans ml-0.5">kg</span></p>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-gray-500">
                                  <span className="flex items-center gap-1"><Icons.Tag /> {lot.product}</span>
                                  <span className="font-mono">Exp: {lot.expectedRatio}%</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* 右ペイン：実績入力 */}
          <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden min-h-0">
              {!selectedLot ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#FAFAFA]">
                      <Icons.Factory className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm font-medium tracking-wide">左のリストから加工するロットを選択してください</p>
                  </div>
              ) : (
                  <div className="flex-1 flex flex-col relative animate-in fade-in slide-in-from-right-4 duration-300">
                      
                      {/* 選択中のロット情報（ヘッダー的） */}
                      <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-start">
                          <div>
                              <p className="text-[10px] font-bold text-[#D32F2F] uppercase tracking-widest mb-1">Target Lot</p>
                              <h3 className="text-2xl font-black text-gray-900 font-serif">{selectedLot.memberName}</h3>
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 font-medium">
                                  <span className="flex items-center gap-1"><Icons.Tag /> {selectedLot.product}</span>
                                  <span className="flex items-center gap-1"><Icons.Clock /> {selectedLot.date} 入庫</span>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Expected Yield</p>
                              <p className="text-xl font-mono font-black text-gray-900">{selectedLot.expectedRatio}%</p>
                          </div>
                      </div>

                      {/* 入力フォーム */}
                      <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                              <div className="relative">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Input Weight (投入量)</label>
                                  <div className="relative">
                                      <input type="number" inputMode="decimal" className={inputClass} value={inputWeight} onChange={e => setInputWeight(e.target.value)} />
                                      <span className="absolute right-0 bottom-4 text-xs font-bold text-gray-400 pointer-events-none uppercase">kg</span>
                                  </div>
                              </div>
                              <div className="relative">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Output Copper (産出銅)</label>
                                  <div className="relative">
                                      <input type="number" inputMode="decimal" className={`${inputClass} text-[#D32F2F]`} placeholder="0.0" value={outputCopper} onChange={e => setOutputCopper(e.target.value)} />
                                      <span className="absolute right-0 bottom-4 text-xs font-bold text-[#D32F2F] pointer-events-none uppercase">kg</span>
                                  </div>
                              </div>
                          </div>

                          {/* リアルタイムKPI */}
                          <div className="bg-[#111] p-6 rounded-sm flex justify-between items-center text-white">
                              <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Actual Yield (実測歩留)</p>
                                  <div className="flex items-baseline gap-2">
                                      <span className={`text-5xl font-black font-mono tracking-tighter ${parseFloat(calcActualRatio()) >= selectedLot.expectedRatio ? 'text-green-400' : 'text-[#D32F2F]'}`}>
                                          {calcActualRatio()}
                                      </span>
                                      <span className="text-xl text-gray-500 font-mono">%</span>
                                  </div>
                              </div>
                              {inputWeight && outputCopper && (
                                  <div className="text-right">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Variance</p>
                                      <span className={`text-lg font-mono font-bold px-2 py-1 border rounded-sm ${parseFloat(calcActualRatio()) >= selectedLot.expectedRatio ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-[#D32F2F] border-red-500/30 bg-red-500/10'}`}>
                                          {(parseFloat(calcActualRatio()) - selectedLot.expectedRatio).toFixed(1)}%
                                      </span>
                                  </div>
                              )}
                          </div>

                          {/* 作業詳細 */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 flex items-center gap-1"><Icons.Worker /> Operator</label>
                                  <select className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm font-bold text-gray-900 outline-none focus:border-gray-400 rounded-sm" value={workerName} onChange={e => setWorkerName(e.target.value)}>
                                      {WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 flex items-center gap-1"><Icons.Clock /> Time (Min)</label>
                                  <input type="number" inputMode="decimal" className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm font-bold text-gray-900 outline-none focus:border-gray-400 rounded-sm text-right" placeholder="0" value={workTime} onChange={e => setWorkTime(e.target.value)} />
                              </div>
                              <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Note</label>
                                  <input type="text" className="w-full bg-gray-50 border border-gray-200 p-2.5 text-sm font-bold text-gray-900 outline-none focus:border-gray-400 rounded-sm" placeholder="刃の摩耗等" value={memo} onChange={e => setMemo(e.target.value)} />
                              </div>
                          </div>

                      </div>

                      {/* アクションフッター */}
                      <div className="p-6 border-t border-gray-100 bg-[#FAFAFA]">
                          <button onClick={handleSubmit} disabled={!inputWeight || !outputCopper || isSubmitting} className="w-full bg-[#111] text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-[#D32F2F] transition-colors disabled:bg-gray-200 disabled:text-gray-400 rounded-sm">
                              {isSubmitting ? 'Processing...' : 'Save Production Record'}
                          </button>
                      </div>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
