"use client";
import React from 'react';

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

  const subMetals = [
    { key: 'brass', label: '真鍮', symbol: 'Brass' },
    { key: 'zinc', label: '亜鉛', symbol: 'Zn' },
    { key: 'lead', label: '鉛', symbol: 'Pb' },
    { key: 'tin', label: '錫', symbol: 'Sn' },
  ];

  return (
    <div className="w-full bg-[#D32F2F] text-white rounded-none shadow-2xl overflow-hidden border border-white/10 relative">
      {/* 背景の装飾（微かなグラデーション） */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none"></div>

      {/* 1. Header: LME & 為替 */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm py-3 px-6 flex justify-between items-center text-xs font-mono tracking-widest border-b border-white/10">
        <div className="flex gap-4 opacity-80">
            <div>USD/JPY <span className="font-bold ml-1">{market.usdjpy}</span></div>
            <div className="border-l border-white/30 pl-4">LME <span className="font-bold ml-1">${market.lme_copper_usd?.toLocaleString()}</span></div>
        </div>
        <div className="flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
             <span className="text-[10px] opacity-60">LIVE</span>
        </div>
      </div>

      <div className="p-6 space-y-6 relative z-10">
        
        {/* 2. Main: Copper (銅) */}
        <div className="text-center py-2">
            <div className="flex justify-center items-center gap-2 mb-1 opacity-70">
                <span className="text-xs font-bold uppercase tracking-[0.2em]">COPPER PRICE</span>
                <span className="text-[10px] border border-white/40 px-1.5 rounded">Cu</span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-lg opacity-60 font-light">¥</span>
                <span className="text-6xl font-serif font-medium tracking-tighter drop-shadow-md">
                    {market.copper.price ? market.copper.price.toLocaleString() : '---'}
                </span>
                <span className="text-sm opacity-60 font-light">/kg</span>
            </div>
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/30 mx-auto"></div>

        {/* 3. Sub: Others (グリッド表示) */}
        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            {subMetals.map((m) => {
                const item = market[m.key] || { price: 0 };
                return (
                    <div key={m.key} className="bg-[#D32F2F]/50 p-3 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
                        <span className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{m.symbol}</span>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-lg font-bold tracking-tight">
                                {item.price ? item.price.toLocaleString() : '-'}
                            </span>
                            <span className="text-[9px] opacity-50">円</span>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="text-center opacity-40 text-[10px] font-light tracking-wider">
             MARKET DATA / REALTIME
        </div>
      </div>
    </div>
  );
};
