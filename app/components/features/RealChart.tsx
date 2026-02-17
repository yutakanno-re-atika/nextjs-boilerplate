"use client";
import React from 'react';

// 金属ごとのデザイン定義
const METALS_CONFIG = {
  copper: { name: '銅 (Copper)', symbol: 'Cu', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  brass: { name: '真鍮 (Brass)', symbol: 'Cu-Zn', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
  zinc: { name: '亜鉛 (Zinc)', symbol: 'Zn', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  lead: { name: '鉛 (Lead)', symbol: 'Pb', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  tin: { name: '錫 (Tin)', symbol: 'Sn', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
};

// ★ここが修正ポイント: propsの型を any にして、nullがきても許容するように変更
export const RealChart = ({ data }: { data: any }) => {
  
  // データがない場合のデフォルト値 (Safety Check)
  const market = data?.market || {
    usdjpy: 0,
    lme_copper_usd: 0,
    copper: { price: '---', change: 0 },
    brass: { price: '---', change: 0 },
    zinc: { price: '---', change: 0 },
    lead: { price: '---', change: 0 },
    tin: { price: '---', change: 0 }
  };

  const metals = ['copper', 'brass', 'zinc', 'lead', 'tin'];

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm relative z-20 -mt-10 md:-mt-16 max-w-7xl mx-auto rounded-xl overflow-hidden">
      
      {/* 1. LME & 為替情報バー */}
      <div className="bg-[#111] text-white py-2 px-6 flex flex-wrap justify-between items-center text-xs md:text-sm font-mono tracking-wider">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <span className="text-gray-400">USD/JPY:</span>
                <span className="font-bold text-green-400">{market.usdjpy}</span>
            </div>
            <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
                <span className="text-gray-400">LME Copper:</span>
                <span className="font-bold text-orange-400">${market.lme_copper_usd?.toLocaleString()}</span>
                <span className="text-[10px] text-gray-500">/ton</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-[10px] text-gray-400">REALTIME MARKET</span>
        </div>
      </div>

      {/* 2. 国内建値パネル */}
      <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metals.map((key) => {
          const conf = METALS_CONFIG[key as keyof typeof METALS_CONFIG];
          const item = market[key] || { price: 0 };
          return (
            <div key={key} className={`p-4 rounded-xl border ${conf.bg} ${conf.border} flex flex-col justify-between group hover:shadow-lg transition-all duration-300`}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{conf.symbol}</span>
                    {key === 'copper' && <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">MAIN</span>}
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-600 mb-1">{conf.name}</h4>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-400">¥</span>
                        <span className={`text-2xl font-black tracking-tighter ${conf.color}`}>
                            {item.price ? item.price.toLocaleString() : '---'}
                        </span>
                        <span className="text-[10px] text-gray-400">/kg</span>
                    </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
