// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Factory: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  ArrowDown: () => <svg className="w-6 h-6 mx-auto text-gray-400 my-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>,
  Copper: () => <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  Alert: () => <svg className="w-4 h-4 text-orange-500 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

export const AdminProduction = ({ data, localReservations }: { data: any, localReservations: any[] }) => {
  const [inputMaterial, setInputMaterial] = useState('');
  const [inputWeight, setInputWeight] = useState('');
  const [outputCopper, setOutputCopper] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];

  // 1. ヤードに入庫済みの総重量を品目ごとに集計（計量完了分のみ）
  const incomingInventory: Record<string, number> = {};
  let zeroWeightCount = 0; // 重量ゼロの荷物をカウント

  localReservations.filter(r => r.status === 'COMPLETED').forEach(res => {
      let items = [];
      try { 
          let temp = res.items;
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (Array.isArray(temp)) items = temp;
      } catch(e) {}

      // もしアイテムが空なら（POSレジを通していないなら）カウント
      if (items.length === 0) zeroWeightCount++;

      items.forEach((it: any) => {
          const product = it.product || it.productName;
          const weight = Number(it.weight) || 0;
          if (weight === 0) zeroWeightCount++;
          
          if (product) {
              if (!incomingInventory[product]) incomingInventory[product] = 0;
              incomingInventory[product] += weight;
          }
      });
  });

  // 2. 過去に加工した総重量を引いて「現在の未加工在庫」を算出
  const currentInventory = { ...incomingInventory };
  productions.forEach((p: any) => {
      if (currentInventory[p.materialName] !== undefined) {
          currentInventory[p.materialName] -= p.inputWeight;
      }
  });

  // 3. 在庫リストを配列化して、在庫があるものだけを抽出（フィルター緩和）
  const inventoryList = Object.entries(currentInventory)
      .filter(([name, weight]) => {
          if (weight <= 0) return false; // 重量が0以下のものは表示しない
          // 電線マスターに存在するか、名前に特定のキーワードが含まれるものを許可
          const isWire = wiresMaster.some((w: any) => w.name === name);
          const hasKeyword = name.includes('線') || name.includes('VVF') || name.includes('ケーブル') || name.includes('ハーネス') || name.includes('MIX') || name.toUpperCase().includes('VA');
          return isWire || hasKeyword;
      })
      .map(([name, weight]) => {
          const productMaster = wiresMaster.find((w: any) => w.name === name);
          const ratio = productMaster ? productMaster.ratio : 0;
          return { name, weight, expectedRatio: ratio };
      })
      .sort((a, b) => b.weight - a.weight);

  // 4. 加工後（ピカ銅ペレット）の総在庫を計算
  const totalProducedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);

  // 実歩留まり計算ロジック
  const calcActualRatio = () => {
      const inW = parseFloat(inputWeight);
      const outC = parseFloat(outputCopper);
      if (inW > 0 && outC > 0) return ((outC / inW) * 100).toFixed(1);
      return '0.0';
  };

  const selectedMaster = inventoryList.find(i => i.name === inputMaterial);

  const handleSubmit = async () => {
      if (!inputMaterial || !inputWeight || !outputCopper) return;
      setIsSubmitting(true);
      try {
          const payload = {
              action: 'REGISTER_PRODUCTION',
              materialName: inputMaterial,
              inputWeight: parseFloat(inputWeight),
              outputCopper: parseFloat(outputCopper),
              actualRatio: parseFloat(calcActualRatio()),
              memo: ''
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
            <Icons.Factory /> ナゲット製造・在庫コックピット
        </h2>
        <p className="text-xs text-gray-500 mt-1">受付から流れてきたヤードの未加工在庫を管理し、ナゲット機の実質歩留まり（利益）を分析します。</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* 左側：ヤード在庫状況 (未加工) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-shrink-0">
                  <h3 className="font-bold text-gray-900">📦 現在のヤード在庫 (未加工)</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">受付データから自動計算</span>
              </div>
              
              {/* ★ 新設：重量未入力のアラート */}
              {zeroWeightCount > 0 && (
                  <div className="bg-orange-50 border-b border-orange-100 p-3 flex items-start gap-2">
                      <Icons.Alert />
                      <p className="text-[10px] text-orange-800 font-bold leading-relaxed">
                          カンバンの「③ 保管」に、POSレジで重量が入力されていない（0kgの）荷物が {zeroWeightCount} 件あります。これらは在庫として合算されていません。
                      </p>
                  </div>
              )}

              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {inventoryList.length === 0 ? (
                      <p className="text-center text-gray-400 text-sm py-10">現在、加工待ちの在庫はありません。</p>
                  ) : inventoryList.map((item, idx) => (
                      <div key={idx} className="border border-gray-100 rounded-xl p-3 flex justify-between items-center hover:bg-gray-50 transition cursor-pointer" onClick={() => setInputMaterial(item.name)}>
                          <div>
                              <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">マスター設定歩留まり: {item.expectedRatio}%</p>
                          </div>
                          <div className="text-right">
                              <p className="text-lg font-black text-[#D32F2F]">{item.weight.toFixed(1)} <span className="text-xs text-gray-500 font-normal">kg</span></p>
                              <p className="text-[10px] text-gray-500">推定銅量: {((item.weight * item.expectedRatio)/100).toFixed(1)} kg</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* 右側：製品在庫 ＆ 加工記録パネル */}
          <div className="flex flex-col gap-6">
              
              {/* 加工後（製品）在庫パネル */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 shadow-lg p-5 text-white flex-shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Icons.Copper /></div>
                  <h3 className="font-bold text-gray-300 mb-2 flex items-center gap-2">
                      <Icons.Copper /> ピカ銅（ペレット） 製品在庫
                  </h3>
                  <div className="flex items-end gap-3 mt-2">
                      <span className="text-5xl font-black text-orange-400 tracking-tighter">
                          {totalProducedCopper.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </span>
                      <span className="text-lg text-gray-400 font-bold mb-1">kg</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-3 border-t border-gray-700 pt-2">
                      ※これまでにナゲット加工されて工場内に保管されているピカ銅の総量です。
                  </p>
              </div>

              {/* 加工記録パネル */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-1 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#D32F2F]"></div>
                  <div className="p-5 flex-1 overflow-y-auto">
                      <h3 className="font-bold text-gray-900 mb-4">⚡ ナゲット機 稼働記録を入力</h3>
                      <div className="space-y-4">
                          <div>
                              <label className="text-[10px] text-gray-500 font-bold block mb-1">1. 投入する銘柄 (左から選ぶか選択)</label>
                              <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm font-bold outline-none focus:border-[#D32F2F]" value={inputMaterial} onChange={(e)=>setInputMaterial(e.target.value)}>
                                  <option value="">-- 銘柄を選択 --</option>
                                  {inventoryList.map(i => <option key={i.name} value={i.name}>{i.name} (在庫: {i.weight}kg)</option>)}
                              </select>
                          </div>

                          <div className="bg-red-50 p-4 rounded-xl border border-red-100 relative">
                              <label className="text-[10px] text-red-800 font-bold block mb-1">2. 実際の投入重量</label>
                              <div className="relative">
                                  <input type="number" className="w-full bg-white border border-red-200 p-3 rounded-lg text-gray-900 text-lg font-black outline-none" placeholder="0" value={inputWeight} onChange={(e)=>setInputWeight(e.target.value)} />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                              </div>
                              <Icons.ArrowDown />
                              <label className="text-[10px] text-blue-800 font-bold block mb-1">3. 回収したピカ銅（ペレット）の重量</label>
                              <div className="relative">
                                  <input type="number" className="w-full bg-white border border-blue-200 p-3 rounded-lg text-gray-900 text-lg font-black outline-none" placeholder="0" value={outputCopper} onChange={(e)=>setOutputCopper(e.target.value)} />
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                              </div>
                          </div>

                          {inputWeight && outputCopper && (
                              <div className="bg-gray-900 p-4 rounded-xl text-center text-white shadow-lg">
                                  <p className="text-[10px] text-gray-400 font-bold mb-1">実質歩留まり (実績値)</p>
                                  <div className="flex justify-center items-end gap-2">
                                      <span className="text-4xl font-black">{calcActualRatio()}</span><span className="text-lg">%</span>
                                  </div>
                                  {selectedMaster && (
                                      <p className={`text-xs mt-2 font-bold ${parseFloat(calcActualRatio()) >= selectedMaster.expectedRatio ? 'text-green-400' : 'text-red-400'}`}>
                                          マスター想定 ({selectedMaster.expectedRatio}%) より 
                                          {parseFloat(calcActualRatio()) >= selectedMaster.expectedRatio ? ' 優秀（利益増）↑' : ' 下振れ（要確認）↓'}
                                      </p>
                                  )}
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                      <button onClick={handleSubmit} disabled={!inputMaterial || !inputWeight || !outputCopper || isSubmitting} className="w-full bg-[#D32F2F] text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:bg-gray-300">
                          {isSubmitting ? '記録中...' : <><Icons.Check /> 加工完了としてデータベースに記録する</>}
                      </button>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
};
