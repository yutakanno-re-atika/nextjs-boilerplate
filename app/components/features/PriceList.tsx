"use client";
import React, { useState, useMemo } from 'react';
import { MarketData } from '../../types';

// 画像マッピング (copperを追加)
const IMG_MAP: Record<string, string> = {
  'bronze': '/images/copper_nugget.png',
  'brass': '/images/copper_nugget.png',
  'urban': '/images/factory_floor.png',
  'copper': '/images/copper_nugget.png',
  'mix': '/images/mixed_wire.png', 
  'default': '/images/factory_floor.png'
};

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<'WIRE' | 'CASTING'>('WIRE');

  // 電線: MIX系のみ (ナゲット原料)
  const displayWires = useMemo(() => {
    if (!data?.wires) return [];
    return data.wires.filter(w => 
      w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')
    );
  }, [data?.wires]);

  // 鋳造原料・銅スクラップ: 全件表示
  const displayCastings = useMemo(() => {
    if (!data?.castings) return [];
    return data.castings;
  }, [data?.castings]);

  // データロード中
  if (!data) return <div className="py-20 text-center text-gray-400 animate-pulse">Loading Realtime Data...</div>;

  const safeMarketPrice = marketPrice > 0 ? marketPrice : 2140;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Icons.TrendingUp /> {data ? 'LIVE DATA' : 'OFFLINE'}
            </span>
            <span className="text-gray-500 text-sm">LME銅建値: ¥{safeMarketPrice.toLocaleString()}/kg</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">買取単価一覧</h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveTab('WIRE')} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'WIRE' ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            被覆電線 (ナゲット原料)
          </button>
          <button onClick={() => setActiveTab('CASTING')} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'CASTING' ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            非鉄原料
          </button>
        </div>

        {/* Grid Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* WIRE LIST */}
          {activeTab === 'WIRE' && displayWires.map((item, idx) => {
            const price = Math.floor((safeMarketPrice * (item.ratio / 100) * 0.9) - 15);
            return (
              <div key={`w-${idx}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                   <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">Cu: {item.ratio}%</span>
                </div>
                <div className="flex items-end gap-2 mt-4 border-t border-gray-50 pt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/ kg</span>
                </div>
              </div>
            );
          })}

          {/* CASTING LIST (銅・真鍮・砲金など) */}
          {activeTab === 'CASTING' && displayCastings.map((item, idx) => {
            // 計算式: 建値 * 歩留まり + オフセット(マイナス値)
            const rawPrice = safeMarketPrice * (item.ratio / 100);
            const price = Math.floor(rawPrice + (item.price_offset || 0));

            // 色分けロジック
            let typeStyle = 'bg-gray-100 text-gray-600';
            const typeLower = (item.type || '').toLowerCase();
            
            if (typeLower === 'copper') typeStyle = 'bg-red-100 text-red-800 border-red-200'; // 銅は赤系
            if (typeLower === 'bronze') typeStyle = 'bg-orange-100 text-orange-800 border-orange-200'; // 砲金はオレンジ
            if (typeLower === 'brass') typeStyle = 'bg-yellow-100 text-yellow-800 border-yellow-200'; // 真鍮は黄色
            if (typeLower === 'urban') typeStyle = 'bg-purple-100 text-purple-800 border-purple-200';

            return (
              <div key={`c-${idx}`} className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${typeLower === 'copper' ? 'border-red-100' : 'border-gray-100'}`}>
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                   <span className={`text-xs px-2 py-1 rounded font-bold border ${typeStyle}`}>
                     {item.type === 'copper' ? 'Copper' : item.type}
                   </span>
                </div>
                
                {/* 説明文がなければ form を表示 */}
                <p className="text-xs text-gray-500 mt-2 min-h-[1.5em]">
                  {item.description ? item.description : (item.form || '-')}
                </p>
                
                <div className="flex items-end gap-2 mt-4 border-t border-gray-50 pt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/ kg</span>
                </div>
                {/* デバッグ用: 計算根拠を小さく表示 */}
                <div className="mt-1 text-[10px] text-gray-300">
                   歩留:{item.ratio}% / 調整:{item.price_offset}
                </div>
              </div>
            );
          })}
          
          {activeTab === 'CASTING' && displayCastings.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-400">データが見つかりません</div>
          )}
        </div>
      </div>
    </section>
  );
};
