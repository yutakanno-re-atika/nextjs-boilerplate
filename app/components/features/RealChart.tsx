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

  // 表示設定：日本語表記に統一
  const subMetals = [
    { key: 'brass', name: '黄銅', unit: '円/kg' },
    { key: 'zinc', name: '亜鉛', unit: '円/kg' },
    { key: 'lead', name: '鉛', unit: '円/kg' },
    { key: 'tin', name: '錫', unit: '円/kg' },
  ];

  return (
    <div className="w-full bg-[#D32F2F] text-white rounded-none shadow-2xl overflow-hidden border border-white/10 relative">
      {/* 背景の装飾（微かなグラデーション） */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none"></div>

      {/* 1. Header: 国内公表建値タイトル & LIVE表示 */}
      <div className="relative z-10 bg-black/10 backdrop-blur-sm py-2 px-4 flex justify-between items-center border-b border-white/10">
        <div className="text-xs font-bold tracking-widest opacity-90">
            国内公表建値
        </div>
        <div className="flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
             <span className="text-[10px] opacity-80 tracking-widest">LIVE</span>
        </div>
      </div>

      <div className="p-6 space-y-6 relative z-10">
        
        {/* 2. Main: 銅建値 (Copper) */}
        <div className="text-center py-2">
            <div className="flex justify-center items-center gap-2 mb-2 opacity-80">
                <span className="text-sm font-bold tracking-widest border-b border-white/40 pb-0.5">
                    電気銅建値
                </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-lg opacity-70 font-light">¥</span>
                <span className="text-7xl font-serif font-medium tracking-tighter drop-shadow-lg">
                    {market.copper.price ? market.copper.price.toLocaleString() : '---'}
                </span>
                <span className="text-base opacity-70 font-light ml-1">/kg</span>
            </div>
            {/* 前日比などを出さないシンプルな構成 */}
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/30 mx-auto"></div>

        {/* 3. Sub: その他金属 (グリッド表示・日本語) */}
        <div className="grid grid-cols-2 gap-px bg-white/20 border border-white/20">
            {subMetals.map((m) => {
                const item = market[m.key] || { price: 0 };
                return (
                    <div key={m.key} className="bg-[#B71C1C] p-4 flex flex-col items-center justify-center hover:bg-[#C62828] transition-colors">
                        <span className="text-xs font-bold tracking-widest opacity-80 mb-1 border-b border-white/20 pb-0.5">
                            {m.name}
                        </span>
                        <div className="flex items-baseline gap-0.5 mt-1">
                            <span className="text-2xl font-bold tracking-tight">
                                {item.price ? item.price.toLocaleString() : '-'}
                            </span>
                            <span className="text-[10px] opacity-60">円</span>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="text-center opacity-50 text-[10px] font-light tracking-wider">
             ※各メーカー公表値を自動取得
        </div>
      </div>
    </div>
  );
};
