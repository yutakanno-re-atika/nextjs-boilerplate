"use client";
import React from 'react';

// 金属ごとのデザイン定義
const METALS_CONFIG = {
  copper: { name: '銅 (Copper)', symbol: 'Cu', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  brass: { name: '真鍮 (Brass)', symbol: 'Cu-Zn', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  zinc: { name: '亜鉛 (Zinc)', symbol: 'Zn', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  lead: { name: '鉛 (Lead)', symbol: 'Pb', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  tin: { name: '錫 (Tin)', symbol: 'Sn', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
};

export const RealChart = ({ data }: { data: any }) => {
  const market = data?.market || {
    usdjpy: 0,
    lme_copper_usd: 0,
    copper: { price: '---', change: 0 },
    brass: { price: '---', change: 0 },
    zinc: { price: '---', change: 0 },
    lead: { price: '---', change: 0 },
    tin: { price: '---', change: 0 }
  };

  const subMetals = ['brass', 'zinc', 'lead', 'tin'];

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden text-[#111]">
      
      {/* 1. Header: LME & 為替 */}
      <div className="bg-[#111] text-white py-3 px-5 flex justify-between items-center text-xs font-mono tracking-wider">
        <div className="flex gap-3">
            <div>USD/JPY: <span className="text-green-400 font-bold">{market.usdjpy}</span></div>
            <div className="border-l border-gray-600 pl-3">LME: <span className="text-orange-400 font-bold">${market.lme_copper_usd?.toLocaleString()}</span></div>
        </div>
        <div className="flex items-center gap-1">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="hidden md:inline text-[10px] text-gray-400">LIVE</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        
        {/* 2. Main: Copper (1段使う) */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center shadow-inner">
            <div className="flex justify-between items-center mb-1 px-2">
                <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Main Index</span>
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Cu</span>
            </div>
            <h3 className="text-sm text-gray-500 mb-1">銅建値 (Copper)</h3>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-gray-400">¥</span>
                <span className="text-5xl font-black tracking-tighter text-red-600 drop-shadow-sm">
                    {market.copper.price ? market.copper.price.toLocaleString() : '---'}
                </span>
                <span className="text-sm text-gray-400">/kg</span>
            </div>
        </div>

        {/* 3. Sub: Others (2列で表示) */}
        <div className="grid grid-cols-2 gap-3">
            {subMetals.map((key) => {
                const conf = METALS_CONFIG[key as keyof typeof METALS_CONFIG];
                const item = market[key] || { price: 0 };
                return (
                    <div key={key} className={`p-3 rounded-lg border ${conf.bg} ${conf.border} flex flex-col justify-between`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold text-gray-500">{conf.name}</span>
                        </div>
                        <div className="text-right">
                            <span className={`text-xl font-black tracking-tight ${conf.color}`}>
                                {item.price ? item.price.toLocaleString() : '---'}
                            </span>
                            <span className="text-[10px] text-gray-400 ml-1">/kg</span>
                        </div>
                    </div>
                );
            })}
        </div>
        
        <div className="text-center">
             <p className="text-[10px] text-gray-400">※価格は市場連動により変動します</p>
        </div>
      </div>
    </div>
  );
};
