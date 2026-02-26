// @ts-nocheck
"use client";
import React, { useState } from 'react';

// ★ data (マスター情報) を受け取れるように引数を追加
export const Simulator = ({ marketPrice, data }: { marketPrice: number, data: any }) => {
  const [simProduct, setSimProduct] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
      return name;
  };

  const calculateSim = () => {
    if (!simProduct || !simWeight) return;
    const w = parseFloat(simWeight);
    
    const productObj = data?.wires.find((x:any) => x.id === simProduct) || data?.castings.find((x:any) => x.id === simProduct);
    if (!productObj) return;

    const isWire = !!data?.wires.find((x:any) => x.id === simProduct);
    
    // 真鍮などの建値切り替え（簡易版）
    let basePrice = marketPrice > 0 ? marketPrice : 1450;
    if (!isWire && productObj.type === 'BRASS') {
        basePrice = data?.market?.brass?.price || 980;
    }

    const ratio = productObj.ratio / 100;
    
    let estimatedUnit = 0;
    if (isWire) {
        estimatedUnit = Math.floor((basePrice * ratio * 0.85) - 15);
    } else {
        estimatedUnit = Math.floor((basePrice * ratio) + (productObj.priceOffset || 0));
    }
    
    if(estimatedUnit < 0) estimatedUnit = 0;

    const total = Math.floor(estimatedUnit * w);
    const label = isWire ? getDisplayName(productObj) : productObj.name;
    
    setSimResult({ label: label, weight: w, unit: estimatedUnit, total: total });
  };

  return (
    <section id="simulator" className="py-32 px-6 bg-white relative">
        <div className="max-w-[900px] mx-auto relative z-10">
            <div className="text-center mb-12">
                <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Estimation</span>
                <h2 className="text-4xl font-serif font-medium">買取シミュレーション</h2>
            </div>
            <div className="bg-[#F5F5F7] p-8 md:p-16 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 w-full space-y-8">
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wire / Metal Type</label>
                        <select className="w-full bg-white border border-gray-200 py-3 px-4 font-serif focus:border-[#D32F2F] focus:outline-none transition-colors cursor-pointer" value={simProduct} onChange={(e)=>setSimProduct(e.target.value)}>
                            <option value="" disabled>買取希望品目を選択</option>
                            <optgroup label="電線類">
                                {data?.wires.map((w:any) => <option key={w.id} value={w.id}>{getDisplayName(w)} ({w.ratio}%)</option>)}
                            </optgroup>
                            <optgroup label="非鉄金属">
                                {data?.castings.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </optgroup>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Weight (kg)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 py-3 px-4 font-mono focus:border-[#D32F2F] focus:outline-none transition-colors" placeholder="0" value={simWeight} onChange={(e)=>setSimWeight(e.target.value)} />
                    </div>
                    <button onClick={calculateSim} className="w-full bg-[#D32F2F] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#B71C1C] transition-colors duration-300 shadow-lg active:scale-95">計算する</button>
                </div>
                <div className="w-full md:w-80 bg-white p-8 border border-gray-200 text-center shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-[#D32F2F] transition-colors"></div>
                    {simResult ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{simResult.label} / {simResult.weight}kg</p>
                            <p className="text-5xl font-serif text-[#111] mb-2 tracking-tighter">¥{simResult.total.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">参考単価: ¥{simResult.unit.toLocaleString()}/kg</p>
                        </div>
                    ) : (
                        <div className="py-8 text-gray-400 text-sm font-serif">条件を入力して<br/>査定額を確認してください</div>
                    )}
                </div>
            </div>
            <div className="mt-8 text-center"><div className="inline-flex items-center gap-2 text-xs font-mono text-gray-500"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Current Copper Price: ¥{Number(marketPrice).toLocaleString()} / kg</div></div>
            </div>
        </div>
    </section>
  );
};
