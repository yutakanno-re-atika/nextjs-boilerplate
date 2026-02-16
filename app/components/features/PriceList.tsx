"use client";
import React, { useState, useMemo } from 'react';
import { MarketData } from '../../types';

// アイコン
const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  ArrowUpRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" /></svg>,
};

// 画像マップ
const IMG_MAP: Record<string, string> = {
  'mixed': '/images/mixed_wire.png',
  'bronze': '/images/copper_nugget.png',
  'brass': '/images/copper_nugget.png',
  'nugget': '/images/copper_nugget.png'
};

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<'WIRE' | 'CASTING'>('WIRE');

  // ★修正ポイント：電線は「ミックス」または「MIX」を含むものだけ抽出
  const displayWires = useMemo(() => {
    if (!data?.wires) return [];
    return data.wires.filter(w => 
      w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')
    );
  }, [data?.wires]);

  // 鋳造品（真鍮・砲金）の抽出
  const displayCastings = useMemo(() => {
    if (!data?.castings) return [];
    return data.castings.filter(c => 
      c.type === 'Bronze' || c.type === 'Brass'
    );
  }, [data?.castings]);

  if (!data) return <div className="py-20 text-center text-gray-400 animate-pulse">Loading Data...</div>;

  return (
    <section className="py-16 bg-gray-50" id="price-list">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Icons.TrendingUp /> 本日更新
            </span>
            <span className="text-gray-500 text-sm">LME銅建値: ¥{marketPrice.toLocaleString()}/kg 連動</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">本日の買取単価</h2>
        </div>

        {/* タブ切り替え */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('WIRE')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'WIRE' ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 border'}`}
          >
            電線 (ミックス)
          </button>
          <button 
            onClick={() => setActiveTab('CASTING')}
            className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'CASTING' ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 border'}`}
          >
            真鍮・砲金
          </button>
        </div>

        {/* リスト表示 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 電線 (ミックスのみ) */}
          {activeTab === 'WIRE' && displayWires.map((item, idx) => {
            // 価格計算: (LME * Ratio * 0.9) - 15
            const price = Math.floor((marketPrice * (item.ratio / 100) * 0.9) - 15);
            return (
              <div key={`${item.id}-${idx}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Yield: {item.ratio}%</span>
                </div>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/ kg (税込)</span>
                </div>
              </div>
            );
          })}

          {/* 鋳造 (真鍮・砲金) */}
          {activeTab === 'CASTING' && displayCastings.map((item, idx) => {
             // 価格計算: (LME * Ratio) - Offset
            const rawPrice = (marketPrice * (item.ratio / 100));
            const price = Math.floor(rawPrice - (item.price_offset || 0));
            return (
              <div key={`${item.id}-${idx}`} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${item.type === 'Bronze' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.type}</span>
                    <h3 className="font-bold text-lg text-gray-800 mt-1">{item.name}</h3>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">{item.description}</p>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 mb-1">/ kg (税込)</span>
                </div>
              </div>
            );
          })}
          
          {/* データなしの場合 */}
          {activeTab === 'WIRE' && displayWires.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">「ミックス」を含む電線データが見つかりません</div>
          )}
           {activeTab === 'CASTING' && displayCastings.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-400">真鍮・砲金データが見つかりません</div>
          )}

        </div>
      </div>
    </section>
  );
};
