// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Factory: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  ArrowDown: () => <svg className="w-6 h-6 mx-auto text-gray-400 my-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Copper: () => <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  User: () => <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Tag: () => <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
};

export const AdminProduction = ({ data, localReservations }: { data: any, localReservations: any[] }) => {
  const [selectedLot, setSelectedLot] = useState<any>(null);
  const [inputWeight, setInputWeight] = useState('');
  const [outputCopper, setOutputCopper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  // ★ 1. ロット（個体）ごとの在庫リストを生成する
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
              // 電線マスターにあるか、線関連の名前かチェック
              const isWire = wiresMaster.some((w: any) => w.name === product) || product.includes('線') || product.includes('VVF') || product.includes('VA');
              
              if (isWire) {
                  // このロットが過去にどれくらい加工されたか計算
                  const processedWeight = productions
                      .filter((p: any) => p.reservationId === res.id && p.materialName === product)
                      .reduce((sum: number, p: any) => sum + (Number(p.inputWeight) || 0), 0);
                  
                  const remainingWeight = initialWeight - processedWeight;

                  if (remainingWeight > 0) {
                      const productMaster = wiresMaster.find((w: any) => w.name === product);
                      lotInventory.push({
                          lotId: `${res.id}-${idx}`,
                          reservationId: res.id,
                          memberName: res.memberName || '名称未設定',
                          date: res.visitDate ? String(res.visitDate).substring(5, 16) : '不明',
                          product: product,
                          remainingWeight: remainingWeight,
                          expectedRatio: productMaster ? productMaster.ratio : 0
                      });
                  }
              }
          }
      });
  });

  // 日付順（古いものが上）にソート
  lotInventory.sort((a, b) => a.date.localeCompare(b.date));

  // 2. 加工後（ピカ銅ペレット）の総在庫を計算
  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);

  const calcActualRatio = () => {
      const inW = parseFloat(inputWeight);
      const outC = parseFloat(outputCopper);
      if (inW > 0 && outC > 0) return ((outC / inW) * 100).toFixed(1);
      return '0.0';
  };

  const handleSelectLot = (lot: any) => {
      setSelectedLot(lot);
      setInputWeight(String(lot.remainingWeight)); // デフォルトで残量を全投入
      setOutputCopper('');
  };

  const handleSubmit = async () => {
      if (!selectedLot || !inputWeight || !outputCopper) return;
      setIsSubmitting(true);
      try {
          const payload = {
              action: 'REGISTER_PRODUCTION',
              reservationId: selectedLot.reservationId, // ★ 誰の荷物か送信！
              memberName: selectedLot.memberName,       // ★ 誰の荷物か送信！
              materialName: selectedLot.product,
              inputWeight: parseFloat(inputWeight),
              outputCopper: parseFloat(outputCopper),
              actualRatio: parseFloat(calcActualRatio()),
              memo: `顧客: ${selectedLot.memberName}`
          };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              window.location.reload();
          } else { alert('エラー: ' + result.message); }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Icons.Factory /> ナゲット製造 (トレーサビリティ管理)
        </h2>
        <p className="text-xs text-gray-500 mt-1">「誰から買い取った、どの荷物か（ロット）」を追跡し、顧客別の歩留まりを評価します。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          
          {/* 左側：ロット別 未加工在庫リスト */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
                  <h3 className="font-bold text-gray-900">📦 個別ロット在庫 (入荷順)</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">全 {lotInventory.length} 件</span>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {lotInventory.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-10">現在、加工待ちのロットはありません。</p>
                  ) : lotInventory.map((lot) => (
                      <div 
                          key={lot.lotId} 
                          onClick={() => handleSelectLot(lot)}
                          className={`border rounded-xl p-3 flex flex-col gap-2 transition cursor-pointer ${selectedLot?.lotId === lot.lotId ? 'border-[#D32F2F] bg-red-50/30 shadow-md ring-1 ring-red-100' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                      >
                          <div className="flex justify-between items-start">
                              <div>
                                  <span className="text-[10px] text-gray-400 font-mono">{lot.date} 入荷</span>
                                  <p className="font-bold text-gray-900 text-sm mt-0.5 flex items-center"><Icons.User /> {lot.memberName}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-lg font-black text-[#D32F2F]">{lot.remainingWeight.toFixed(1)} <span className="text-xs text-gray-500 font-normal">kg</span></p>
                              </div>
                          </div>
                          <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                              <p className="text-xs font-bold text-gray-700 flex items-center"><Icons.Tag /> {lot.product}</p>
                              <p className="text-[10px] text-gray-500">想定歩留: <span className="font-bold">{lot.expectedRatio}%</span></p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 右側：製品在庫 ＆ 加工記録パネル */}
          <div className="flex flex-col gap-6">
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg p-5 text-white flex-shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Icons.Copper /></div>
                  <h3 className="font-bold text-gray-300 mb-2 flex items-center gap-2"><Icons.Copper /> ピカ銅（ペレット） 製品在庫</h3>
                  <div className="flex items-end gap-3 mt-2">
                      <span className="text-5xl font-black text-orange-400 tracking-tighter">{totalProducedCopper.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>
                      <span className="text-lg text-gray-400 font-bold mb-1">kg</span>
                  </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#D32F2F]"></div>
                  <div className="p-5 flex-1 overflow-y-auto">
                      <h3 className="font-bold text-gray-900 mb-4">⚡ 特定ロットの加工記録</h3>
                      
                      {!selectedLot ? (
                          <div className="h-full flex items-center justify-center text-sm font-bold text-gray-400">
                              ← 左のリストから加工する荷物を選んでください
                          </div>
                      ) : (
                          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                  <p className="text-[10px] text-gray-500 font-bold">ターゲット顧客</p>
                                  <p className="font-bold text-gray-900">{selectedLot.memberName}</p>
                                  <p className="text-sm font-bold text-[#D32F2F] mt-1">{selectedLot.product}</p>
                              </div>

                              <div className="bg-red-50 p-4 rounded-xl border border-red-100 relative">
                                  <label className="text-[10px] text-red-800 font-bold block mb-1">投入重量 (デフォルトは残量全投入)</label>
                                  <div className="relative">
                                      <input type="number" className="w-full bg-white border border-red-200 p-3 rounded-lg text-gray-900 text-lg font-black outline-none focus:ring-2 focus:ring-red-200" value={inputWeight} onChange={(e)=>setInputWeight(e.target.value)} />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                                  </div>
                                  <Icons.ArrowDown />
                                  <label className="text-[10px] text-blue-800 font-bold block mb-1">回収したピカ銅（ペレット）の重量</label>
                                  <div className="relative">
                                      <input type="number" className="w-full bg-white border border-blue-200 p-3 rounded-lg text-gray-900 text-lg font-black outline-none focus:ring-2 focus:ring-blue-200" placeholder="0" value={outputCopper} onChange={(e)=>setOutputCopper(e.target.value)} />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                                  </div>
                              </div>

                              {inputWeight && outputCopper && (
                                  <div className="bg-gray-900 p-4 rounded-xl text-center text-white shadow-lg">
                                      <p className="text-[10px] text-gray-400 font-bold mb-1">【{selectedLot.memberName}】の実質歩留まり</p>
                                      <div className="flex justify-center items-end gap-2">
                                          <span className="text-4xl font-black">{calcActualRatio()}</span><span className="text-lg">%</span>
                                      </div>
                                      <p className={`text-xs mt-2 font-bold ${parseFloat(calcActualRatio()) >= selectedLot.expectedRatio ? 'text-green-400' : 'text-red-400'}`}>
                                          マスター想定 ({selectedLot.expectedRatio}%) より 
                                          {parseFloat(calcActualRatio()) >= selectedLot.expectedRatio ? ' 優秀（優良顧客）↑' : ' 下振れ（要査定見直し）↓'}
                                      </p>
                                  </div>
                              )}
                          </div>
                      )}
                  </div>
                  
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                      <button onClick={handleSubmit} disabled={!selectedLot || !inputWeight || !outputCopper || isSubmitting} className="w-full bg-[#D32F2F] text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:bg-gray-300">
                          {isSubmitting ? '記録中...' : <><Icons.Check /> このロットの加工実績を保存する</>}
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
