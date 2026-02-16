"use client";
import React, { useState, useMemo } from 'react';
import { MarketData } from '../../types';

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<'WIRE' | 'CASTING'>('WIRE');

  // 1. 電線：名前に「ミックス」か「MIX」が含まれるものだけ
  const displayWires = useMemo(() => {
    if (!data?.wires) return [];
    return data.wires.filter(w => 
      w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')
    );
  }, [data?.wires]);

  // 2. 鋳造：データがあれば無条件で表示（デバッグ用）し、その後フィルタリング
  const displayCastings = useMemo(() => {
    if (!data?.castings) return [];
    // 安全のため、type判定を小文字化して柔軟にする
    return data.castings.filter(c => {
       const t = (c.type || '').toLowerCase();
       return t.includes('bronze') || t.includes('brass') || t.includes('砲金') || t.includes('真鍮');
    });
  }, [data?.castings]);

  if (!data) return <div className="py-20 text-center text-gray-400 animate-pulse">Loading Data...</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Icons.TrendingUp /> 本日更新
            </span>
            <span className="text-gray-500 text-sm">LME銅建値: ¥{marketPrice.toLocaleString()}/kg</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">本日の買取単価</h2>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveTab('WIRE')} className={`px-6 py-3 rounded-full font-bold ${activeTab === 'WIRE' ? 'bg-[#D32F2F] text-white' : 'bg-white text-gray-600 border'}`}>電線 (ミックス)</button>
          <button onClick={() => setActiveTab('CASTING')} className={`px-6 py-3 rounded-full font-bold ${activeTab === 'CASTING' ? 'bg-[#D32F2F] text-white' : 'bg-white text-gray-600 border'}`}>真鍮・砲金</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 電線 */}
          {activeTab === 'WIRE' && displayWires.map((item, idx) => {
            const price = Math.floor((marketPrice * (item.ratio / 100) * 0.9) - 15);
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/ kg</span>
                </div>
              </div>
            );
          })}

          {/* 鋳造 */}
          {activeTab === 'CASTING' && displayCastings.map((item, idx) => {
            // 計算: (建値 * 歩留まり) - 加工費
            const rawPrice = (marketPrice * (item.ratio / 100));
            const price = Math.floor(rawPrice - (item.price_offset || 0));
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between">
                   <h3 className="font-bold text-lg">{item.name}</h3>
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded h-fit">{item.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{item.description}</p>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/ kg</span>
                </div>
              </div>
            );
          })}

          {activeTab === 'CASTING' && displayCastings.length === 0 && (
            <div className="col-span-full text-center py-10 text-red-500 font-bold">
              データが表示されません。<br/>スプレッドシートの「Products_Casting」にデータが入っているか確認してください。
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
