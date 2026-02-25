// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Factory: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Copper: () => <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  User: () => <svg className="w-4 h-4 inline-block mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Tag: () => <svg className="w-4 h-4 inline-block mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Clock: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Worker: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Timeline: () => <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

// ★ 作業担当者のリスト（必要に応じて追加・変更してください）
const WORKERS = ["未選択", "工場長", "佐藤", "鈴木", "高橋", "田中", "パートA"];

export const AdminProduction = ({ data, localReservations }: { data: any, localReservations: any[] }) => {
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [inputWeight, setInputWeight] = useState('');
  const [outputCopper, setOutputCopper] = useState('');
  const [workTime, setWorkTime] = useState(''); 
  const [workerName, setWorkerName] = useState('未選択'); // ★ 作業者
  const [memo, setMemo] = useState('');         
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  let lotInventory: any[] = [];
  localReservations.filter(r => r.status === 'COMPLETED').forEach(res => {
      let items = [];
      try { 
          let temp = res.items;
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (typeof temp === 'string') temp = JSON.parse(temp);
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
                          createdAt: res.createdAt ? String(res.createdAt).substring(5, 16) : '不明', // ★ 受付日時の追加
                          product: product,
                          maker: productMaster?.maker, sq: productMaster?.sq, core: productMaster?.core,
                          remainingWeight: remainingWeight, expectedRatio: productMaster ? productMaster.ratio : 0
                      });
                  }
              }
          }
      });
  });
  lotInventory.sort((a, b) => a.date.localeCompare(b.date));

  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);

  const calcActualRatio = () => {
      const inW = parseFloat(inputWeight); const outC = parseFloat(outputCopper);
      if (inW > 0 && outC > 0) return ((outC / inW) * 100).toFixed(1);
      return '0.0';
  };

  const handleSelectLot = (lot: any) => { 
      setSelectedLot(lot); 
      setInputWeight(String(lot.remainingWeight)); 
      setOutputCopper(''); 
      setWorkTime('');
      setWorkerName('未選択');
      setMemo('');
  };

  const handleSubmit = async () => {
      if (!selectedLot || !inputWeight || !outputCopper) return;
      if (Number(outputCopper) > Number(inputWeight)) return alert("産出重量が投入重量を上回っています。");
      
      setIsSubmitting(true);
      try {
          const payload = {
              action: 'REGISTER_PRODUCTION', 
              reservationId: selectedLot.reservationId, 
              memberName: selectedLot.memberName,
              materialName: selectedLot.product, 
              inputWeight: parseFloat(inputWeight), 
              outputCopper: parseFloat(outputCopper),
              actualRatio: parseFloat(calcActualRatio()), 
              memo: `作業者: ${workerName} | 時間: ${workTime || 0}分 | ${memo}` // ★ 作業者情報も構造化して保存
          };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { 
              alert('加工データを記録しました！');
              setSelectedLot(null);
              window.location.reload(); 
          } else { 
              alert('エラー: ' + result.message); 
          }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full pb-8">
      <header className="mb-6 flex-shrink-0 border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 md:gap-3">
            <Icons.Factory /> ナゲット製造・加工報告
        </h2>
        <p className="text-sm md:text-base text-gray-500 mt-2">ヤード在庫（カンバンで③になったもの）を加工し、実測歩留まりを記録します。</p>
      </header>

      {/* サマリーパネル */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg p-5 md:p-6 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Icons.Copper /></div>
          <h3 className="text-sm md:text-lg font-bold text-gray-300 mb-1 md:mb-2 flex items-center gap-2"><Icons.Copper /> ピカ銅（ペレット） 製品在庫</h3>
          <div className="flex items-end gap-2 md:gap-3 mt-2">
              <span className="text-4xl md:text-5xl font-black text-orange-400 tracking-tighter">{totalProducedCopper.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
              <span className="text-lg md:text-xl text-gray-400 font-bold mb-1">kg</span>
          </div>
      </div>

      {/* ロットリスト */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
              <h3 className="text-base md:text-lg font-bold text-gray-900">📦 加工待ちヤード在庫 (入荷順)</h3>
              <span className="text-xs md:text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-bold border border-blue-200">全 {lotInventory.length} 件</span>
          </div>

          <div className="p-4 md:p-5 flex-1 overflow-y-auto space-y-3 md:space-y-4">
              {lotInventory.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm md:text-base py-10 font-bold">現在、加工待ちのロットはありません。</p>
              ) : lotInventory.map((lot) => (
                  <div 
                      key={lot.lotId} onClick={() => handleSelectLot(lot)}
                      className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3 transition cursor-pointer shadow-sm hover:border-blue-300 hover:bg-blue-50/30 group"
                  >
                      <div className="flex justify-between items-start">
                          <div>
                              <span className="text-[10px] md:text-xs text-gray-500 font-mono font-bold bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{lot.date} 入庫</span>
                              <p className="font-black text-gray-900 text-sm md:text-base mt-2 flex items-center group-hover:text-blue-700 transition"><Icons.User /> {lot.memberName}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-xl md:text-2xl font-black text-[#D32F2F]">{lot.remainingWeight.toFixed(1)} <span className="text-xs md:text-sm text-gray-500 font-bold">kg</span></p>
                          </div>
                      </div>
                      <div className="bg-gray-50 group-hover:bg-white p-3 rounded-lg border border-gray-100 transition">
                          <div className="flex justify-between items-center">
                              <p className="text-sm md:text-base font-bold text-gray-800 flex items-center"><Icons.Tag /> {lot.product}</p>
                              <p className="text-xs md:text-sm text-gray-500 font-bold">想定: <span className="text-gray-800">{lot.expectedRatio}%</span></p>
                          </div>
                          <div className="flex gap-2 mt-2">
                              {lot.maker && <span className="text-[10px] font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{lot.maker}</span>}
                              {lot.sq && <span className="text-[10px] font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{lot.sq}</span>}
                              {lot.core && <span className="text-[10px] font-medium bg-white text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{lot.core}</span>}
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* ================================================== */}
      {/* ★ スマホ最適化: 作業報告モーダル */}
      {/* ================================================== */}
      {selectedLot && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-in fade-in">
              <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 flex flex-col max-h-[90vh]">
                  
                  <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50 flex-shrink-0">
                      <div>
                          <h3 className="text-lg md:text-xl font-black text-gray-900">🏭 加工報告</h3>
                          <p className="text-xs md:text-sm text-gray-500 mt-1 font-bold">{selectedLot.memberName} / {selectedLot.product}</p>
                          
                          {/* ★ タイムライン・トレーサビリティ表示 */}
                          <div className="mt-3 flex items-center gap-2 text-[10px] md:text-xs text-gray-500 bg-white px-2 py-1.5 rounded-lg border border-gray-200 inline-flex font-mono">
                              <Icons.Timeline />
                              <span>受付: {selectedLot.createdAt}</span>
                              <span className="text-gray-300">|</span>
                              <span className="text-blue-600 font-bold">ヤード移動: {selectedLot.date}</span>
                          </div>
                      </div>
                      <button onClick={() => setSelectedLot(null)} className="text-gray-400 hover:text-gray-900 bg-white p-2 rounded-full shadow-sm border border-gray-100"><Icons.Close /></button>
                  </div>
                  
                  <div className="p-5 md:p-6 space-y-5 overflow-y-auto flex-1">
                      
                      {/* ★ 作業者選択 */}
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                          <label className="text-xs font-bold text-blue-800 flex items-center whitespace-nowrap"><Icons.Worker /> 担当者</label>
                          <select className="w-full bg-white border border-blue-200 p-2 rounded-lg font-bold text-sm outline-none focus:border-blue-500" value={workerName} onChange={e => setWorkerName(e.target.value)}>
                              {WORKERS.map(w => <option key={w} value={w}>{w}</option>)}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">投入重量 (kg)</label>
                              <div className="relative">
                                  <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full bg-gray-50 border border-gray-200 p-3 pr-8 rounded-xl text-lg md:text-xl font-black text-right outline-none focus:border-blue-500 focus:bg-white transition" value={inputWeight} onChange={e => setInputWeight(e.target.value)} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 font-bold">kg</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">産出ピカ銅 (kg)</label>
                              <div className="relative">
                                  <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full bg-orange-50 border border-orange-200 p-3 pr-8 rounded-xl text-lg md:text-xl font-black text-orange-600 text-right outline-none focus:border-orange-500 focus:bg-white transition shadow-inner" value={outputCopper} onChange={e => setOutputCopper(e.target.value)} placeholder="0" />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-orange-500 font-bold">kg</span>
                              </div>
                          </div>
                      </div>

                      {/* 歩留まり表示 */}
                      <div className="bg-gray-900 rounded-xl p-4 text-center text-white shadow-md">
                          <p className="text-xs text-gray-400 font-bold mb-1">実測歩留まり (想定: {selectedLot.expectedRatio}%)</p>
                          <div className="flex justify-center items-baseline gap-1">
                              <span className={`text-3xl md:text-4xl font-black ${parseFloat(calcActualRatio()) >= selectedLot.expectedRatio ? 'text-green-400' : 'text-red-400'}`}>{calcActualRatio()}</span>
                              <span className="text-lg text-gray-400 font-bold">%</span>
                          </div>
                      </div>

                      {/* 作業時間とメモ */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                          <div className="md:col-span-1">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2"><Icons.Clock /> 作業時間</label>
                              <div className="relative">
                                  <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full border border-gray-300 p-3 pr-8 rounded-xl outline-none focus:border-blue-500 text-right font-bold transition" placeholder="0" value={workTime} onChange={e => setWorkTime(e.target.value)} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs md:text-sm text-gray-500 font-bold">分</span>
                              </div>
                          </div>
                          <div className="md:col-span-2">
                              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">作業メモ (刃の摩耗等)</label>
                              <input type="text" className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:border-blue-500 text-sm font-bold transition" placeholder="気づいた事などを記録" value={memo} onChange={e => setMemo(e.target.value)} />
                          </div>
                      </div>
                  </div>

                  <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                      <button onClick={handleSubmit} disabled={!inputWeight || !outputCopper || isSubmitting} className="w-full bg-[#D32F2F] text-white py-4 rounded-xl text-base md:text-lg font-bold hover:bg-red-700 transition shadow-lg flex justify-center items-center gap-2 disabled:bg-gray-300 disabled:shadow-none active:scale-95">
                          {isSubmitting ? '記録中...' : <><Icons.Check /> このロットの加工実績を保存する</>}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
