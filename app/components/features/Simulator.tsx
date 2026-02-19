"use client";
import React, { useState } from 'react';

export const Simulator = ({ marketPrice }: { marketPrice: number }) => {
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  const calculateSim = () => {
    if (!simType || !simWeight) return;
    const w = parseFloat(simWeight);
    // ★非鉄原料(non_ferrous)の計算レートを暫定で0.60に設定しています。実態に合わせて調整してください。
    const ratios: any = { 'pika': 0.98, 'high': 0.82, 'medium': 0.65, 'low': 0.45, 'mixed': 0.40, 'non_ferrous': 0.60 };
    const basePrice = marketPrice > 0 ? marketPrice : 1450;
    const estimatedUnit = Math.floor(basePrice * ratios[simType]); 
    const total = Math.floor(estimatedUnit * w);
    const labels: any = { 'pika': '特1号銅線', 'high': '高銅率線', 'medium': '中銅率線', 'low': '低銅率線', 'mixed': '雑線', 'non_ferrous': '非鉄原料' };
    setSimResult({ label: labels[simType], weight: w, unit: estimatedUnit, total: total });
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
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wire Type</label>
                        <select className="w-full bg-white border border-gray-200 py-3 px-4 font-serif focus:border-[#D32F2F] focus:outline-none transition-colors cursor-pointer" value={simType} onChange={(e)=>setSimType(e.target.value)}>
                            {/* ★初期値を無効なプレースホルダーに変更 */}
                            <option value="" disabled>買取希望項目を選択</option>
                            <option value="pika">特1号銅線 (ピカ線)</option>
                            <option value="high">高銅率線 (80%~)</option>
                            <option value="medium">中銅率線 (60%~)</option>
                            <option value="low">低銅率線 (40%~)</option>
                            <option value="mixed">雑線・ミックス</option>
                            {/* ★非鉄原料を追加 */}
                            <option value="non_ferrous">非鉄原料</option>
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
            <div className="mt-8 text-center"><div className="inline-flex items-center gap-2 text-xs font-mono text-gray-500"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Current Market Price: ¥{Number(marketPrice).toLocaleString()} / kg</div></div>
            </div>
        </div>
    </section>
  );
};
