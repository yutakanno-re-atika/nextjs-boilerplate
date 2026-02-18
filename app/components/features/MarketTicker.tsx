"use client";

import React from 'react';
import { MarketData } from '../../types';

interface MarketTickerProps {
  data: MarketData | null;
}

export const MarketTicker = ({ data }: MarketTickerProps) => {
  // データ未取得時のプレースホルダー
  const copperPrice = data?.market?.copper?.price?.toLocaleString() || "---";
  const leadPrice = data?.market?.lead?.price?.toLocaleString() || "---"; // 鉛対応済
  const usdJpy = data?.market?.usdjpy?.toFixed(2) || "---";
  const lmeCopper = data?.market?.lme_copper_usd?.toLocaleString() || "---";

  return (
    <div className="w-full bg-black text-white overflow-hidden border-b border-[#D32F2F] shadow-lg relative z-20">
      {/* スマホでも見やすいようにスクロールではなく、フレックスで均等配置推奨 */}
      {/* 画面幅が狭い場合はスクロール、広い場合は固定などレスポンシブ対応 */}
      <div className="flex items-center justify-between md:justify-center gap-8 py-3 px-4 overflow-x-auto whitespace-nowrap no-scrollbar">
        
        {/* 建値情報ブロック */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#D32F2F] bg-white/10 px-2 py-1 rounded">DOMESTIC</span>
          <span className="text-sm text-gray-400 font-bold">銅建値:</span>
          <span className="text-lg font-mono font-bold text-white">{copperPrice}</span>
          <span className="text-xs text-gray-500">円/kg</span>
        </div>

        <div className="w-[1px] h-4 bg-gray-700 hidden md:block"></div>

        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-gray-400 bg-white/10 px-2 py-1 rounded">LME</span>
           <span className="text-sm text-gray-400 font-bold">LME Copper:</span>
           <span className="text-base font-mono font-bold text-[#D32F2F]">${lmeCopper}</span>
           <span className="text-xs text-gray-500">/t</span>
        </div>

        <div className="w-[1px] h-4 bg-gray-700 hidden md:block"></div>

        <div className="flex items-center gap-2">
           <span className="text-sm text-gray-400 font-bold">鉛建値:</span>
           <span className="text-base font-mono font-bold text-white">{leadPrice}</span>
           <span className="text-xs text-gray-500">円/kg</span>
        </div>

        <div className="w-[1px] h-4 bg-gray-700 hidden md:block"></div>

        <div className="flex items-center gap-2">
           <span className="text-sm text-gray-400 font-bold">TTS:</span>
           <span className="text-base font-mono font-bold text-white">{usdJpy}</span>
           <span className="text-xs text-gray-500">円</span>
        </div>

      </div>
    </div>
  );
};
