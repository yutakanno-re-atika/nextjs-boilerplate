"use client";
import React, { useState, useMemo } from 'react';
import { MarketData } from '../../types';

// 画像マッピング (データと画像を紐付け)
const IMG_MAP: Record<string, string> = {
  'Bronze': '/images/copper_nugget.png',
  'Brass': '/images/copper_nugget.png',
  'Urban': '/images/factory_floor.png',
  'MIX': '/images/mixed_wire.png', 
  'DEFAULT': '/images/factory_floor.png'
};

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<'WIRE' | 'CASTING'>('WIRE');

  // 1. 電線： "MIX" または "ミックス" を含むものだけ抽出
  const displayWires = useMemo(() => {
    if (!data?.wires) return [];
    return data.wires.filter(w => 
      w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')
    );
  }, [data?.wires]);

  // 2. 鋳造・その他： APIから来たデータを「全件」表示 (余計なフィルタを廃止)
  const displayCastings = useMemo(() => {
    if (!data?.castings) return [];
    return data.castings;
  }, [data?.castings]);

  // データロード中
  if (!data) return <div className="py-20 text-center text-gray-400 animate-pulse">Loading Realtime Data...</div>;

  // 安全な銅建値 (0ならデフォルト2140円を使用)
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
            電線 (ミックス)
          </button>
          <button onClick={() => setActiveTab('CASTING')} className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'CASTING' ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}>
            鋳造・都市鉱山
          </button>
        </div>

        {/* Grid Display */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* --- WIRE LIST --- */}
          {activeTab === 'WIRE' && displayWires.map((item, idx) => {
            // 電線価格: (建値 * 歩留まり% * 0.9) - 加工費15円
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

          {/* --- CASTING LIST --- */}
          {activeTab === 'CASTING' && displayCastings.map((item, idx) => {
            // 鋳造価格: (建値 * 歩留まり%) + オフセット(マイナス値)
            // ★修正ポイント: offsetはマイナスで来るので「足す」のが正解
            const rawPrice = safeMarketPrice * (item.ratio / 100);
            const price = Math.floor(rawPrice + (item.price_offset || 0));

            // 色分け装飾
            let typeStyle = 'bg-gray-100 text-gray-600';
            if (item.type === 'Bronze') typeStyle = 'bg-orange-100 text-orange-800';
            if (item.type === 'Brass') typeStyle = 'bg-yellow-100 text-yellow-800';
            if (item.type === 'Urban') typeStyle = 'bg-purple-100 text-purple-800';

            return (
              <div key={`c-${idx}`} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                   <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                   <span className={`text-xs px-2 py-1 rounded font-bold ${typeStyle}`}>{item.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 min-h-[1.5em]">{item.description || item.form}</p>
                
                <div className="flex items-end gap-2 mt-4 border-t border-gray-50 pt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/ kg</span>
                </div>
                {/* デバッグ用: 計算根拠を小さく表示 */}
                <div className="mt-1 text-[10px] text-gray-300">
                   Ratio: {item.ratio}% / Offset: {item.price_offset}
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {activeTab === 'WIRE' && displayWires.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-400">電線データ (MIX) が見つかりません</div>
          )}
          {activeTab === 'CASTING' && displayCastings.length === 0 && (
             <div className="col-span-full py-12 text-center text-gray-400">鋳造データが見つかりません (GASを確認してください)</div>
          )}

        </div>
      </div>
    </section>
  );
};
