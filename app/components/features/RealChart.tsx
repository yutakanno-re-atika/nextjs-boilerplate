"use client";
import React from 'react';

// 金属ごとの設定データ
const METALS = [
  { id: 'copper', name: '銅 (Copper)', symbol: 'Cu', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  { id: 'brass', name: '真鍮 (Brass)', symbol: 'Zn-Cu', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { id: 'zinc', name: '亜鉛 (Zinc)', symbol: 'Zn', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' },
  { id: 'lead', name: '鉛 (Lead)', symbol: 'Pb', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  { id: 'tin', name: '錫 (Tin)', symbol: 'Sn', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
];

export const RealChart = ({ data, currentPrice }: { data: any[], currentPrice: number }) => {
  
  // 今は銅以外のデータがないので、銅建値を基準にした「仮の相場比率」で表示させます
  // ※後でGASから正しい値を送るようにすれば、ここは不要になります
  const rates: Record<string, number> = {
    copper: currentPrice || 1450,         // 銅建値 (kg)
    brass: Math.floor(currentPrice * 0.7), // 真鍮はおよそ銅の6-7割
    zinc: 450,  // 亜鉛建値 (仮)
    lead: 380,  // 鉛建値 (仮)
    tin: 4800,  // 錫建値 (仮)
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Market Rates (LME Linked)
            </h3>
            <span className="text-[10px] text-gray-400">※ 銅以外は参考価格です</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {METALS.map((metal) => (
            <div key={metal.id} className={`relative p-4 rounded-xl border ${metal.bg} ${metal.border} flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{metal.symbol}</span>
                    {metal.id === 'copper' && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">MAIN</span>}
                </div>
                <div>
                    <h4 className={`text-xs font-bold text-gray-600 mb-1`}>{metal.name}</h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-400">¥</span>
                        <span className={`text-2xl font-black tracking-tighter ${metal.color}`}>
                            {rates[metal.id]?.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-gray-400">/kg</span>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
