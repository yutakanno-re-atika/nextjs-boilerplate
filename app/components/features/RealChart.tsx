"use client";
import React, { useState } from 'react';

export const RealChart = ({ data, currentPrice }: {data: any[], currentPrice: number}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  if (!data || !Array.isArray(data) || data.length < 2) return <div className="h-40 flex items-center justify-center text-xs tracking-widest text-white/50">LOADING MARKET DATA...</div>;

  const effectivePrice = currentPrice > 0 ? currentPrice : (data.length > 0 ? data[data.length-1].value : 0);
  const maxVal = Math.max(...data.map((d: any) => d.value || 0), effectivePrice);
  const minVal = Math.min(...data.map((d: any) => d.value || 0), effectivePrice);
  const range = maxVal - minVal || 100;
  
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => {
    const val = d.value || 0;
    const yMax = maxVal + range * 0.2;
    const yMin = minVal - range * 0.2;
    return `${getX(i)},${100 - ((val - yMin) / (yMax - yMin)) * 100}`;
  }).join(' ');

  const displayDate = activePoint ? activePoint.date : 'NOW';
  const displayValue = activePoint ? activePoint.value : effectivePrice;

  return (
    <div className="w-full" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-6 border-b border-white/30 pb-4">
        <div>
          <p className="text-[10px] font-medium text-white/70 tracking-[0.2em] mb-1">MARKET PRICE / {displayDate}</p>
          <p className="text-5xl font-serif text-white tracking-tight drop-shadow-md">
            <span className="text-2xl mr-1">¥</span>{Number(displayValue).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
            <div className="text-white text-[10px] font-bold flex items-center justify-end gap-2 uppercase tracking-widest">Live</div>
            <p className="text-[10px] text-white/70 mt-1 font-serif">LME Copper</p>
        </div>
      </div>
      <div className="h-40 w-full relative overflow-visible">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d={`M ${points}`} fill="none" stroke="#FFFFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          {data.map((d: any, i: number) => ( <rect key={i} x={getX(i)-1} y="0" width="2" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} /> ))}
        </svg>
      </div>
    </div>
  );
};
