"use client";
import React, { useState } from 'react';
import { MarketData, ProductWire, ProductCasting } from '../../types';

// 画像パスのマッピング（実際はDBから取得するパスを使用しますが、ここでは仮置き）
const IMG_MAP: Record<string, string> = {
  'pika': '/images/pika_wire.png',
  'cv': '/images/cv_cable.png',
  'iv': '/images/iv_cable.png',
  'vvf': '/images/vvf_cable.png',
  'mixed': '/images/mixed_wire.png',
  'cabtire': '/images/cabtire_cable.png',
  // 鋳造用仮画像
  'brass': '/images/copper_nugget.png', 
  'bronze': '/images/copper_nugget.png',
};

type TabType = 'WIRE' | 'CASTING';

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<TabType>('WIRE');

  // データがロードされるまでのスケルトン表示
  if (!data) return (
    <div className="py-20 px-6 max-w-[1200px] mx-auto animate-pulse">
        <div className="h-10 bg-gray-200 w-1/3 mx-auto mb-10 rounded"></div>
        <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-100 rounded"></div>)}
        </div>
    </div>
  );

  return (
    <section id="price" className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* SECTION HEADER: FACTORY DIRECT LOGIC */}
        <div className="text-center mb-16">
            <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Realtime Market</span>
            <h2 className="text-4xl font-serif font-medium text-[#111] mb-6">本日の買取価格</h2>
            
            {/* 競争優位性の可視化 (第一原理) */}
            <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-gray-50 px-8 py-4 rounded-full border border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pricing Logic:</span>
                <div className="flex items-center gap-2 text-sm font-mono text-gray-700">
                    <span className="font-bold">LME Market</span>
                    <span className="text-gray-400">×</span>
                    <span className="font-bold">Yield(%)</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-xs bg-[#D32F2F] text-white px-2 py-1 rounded">No Middleman Cost</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-xl font-bold text-[#D32F2F] border-b-2 border-[#D32F2F]">High Price</span>
                </div>
            </div>
        </div>

        {/* TABS */}
        <div className="flex justify-center gap-2 mb-12">
            <button 
                onClick={() => setActiveTab('WIRE')}
                className={`px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${activeTab === 'WIRE' ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
            >
                Wire Scraps (電線)
            </button>
            <button 
                onClick={() => setActiveTab('CASTING')}
                className={`px-8 py-3 text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${activeTab === 'CASTING' ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
            >
                Casting / Alloy (鋳造・合金)
            </button>
        </div>

        {/* CONTENT GRID: VISUAL SELECTOR */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* WIRE LIST */}
            {activeTab === 'WIRE' && data.wires?.map((product) => {
                // 画像取得ロジック（IDやカテゴリから推定）
                const imgKey = Object.keys(IMG_MAP).find(k => product.id.toLowerCase().includes(k) || product.category.toLowerCase().includes(k)) || 'nugget';
                const imgSrc = IMG_MAP[imgKey];
                
                // 価格計算 (レポートの数式に基づく簡易版)
                // P = (Market * Ratio) - Cost(15)
                const price = Math.floor((marketPrice * (product.ratio / 100) * 0.9) - 15);

                return (
                    <div key={product.id} className="group relative bg-white border border-gray-200 hover:border-[#D32F2F] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl">
                        {/* Image Area */}
                        <div className="h-48 overflow-hidden relative bg-gray-100">
                            <img src={imgSrc} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                                {product.category}
                            </div>
                            {product.ratio > 80 && (
                                <div className="absolute top-4 right-4 bg-[#D32F2F] text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-md">
                                    High Grade
                                </div>
                            )}
                        </div>

                        {/* Info Area */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold font-serif mb-2 text-[#111] group-hover:text-[#D32F2F] transition-colors">{product.name}</h3>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Est. Price / kg</p>
                                    <p className="text-3xl font-serif font-bold text-[#111]">
                                        ¥{price.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Yield</p>
                                    <p className="text-lg font-mono font-bold text-gray-600">{product.ratio}%</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                <p className="text-xs text-gray-500 line-clamp-2">
                                    {product.maker} {product.sq}sq {product.core}C - WN-800プラント直結処理により高価買取中。
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* CASTING LIST (Placeholder for new DB) */}
            {activeTab === 'CASTING' && (
                <div className="col-span-full py-20 text-center bg-gray-50 border border-dashed border-gray-300">
                    <p className="text-gray-400 mb-4 font-serif text-lg">Coming Soon</p>
                    <p className="text-sm text-gray-500">真鍮・砲金・アルミ等の鋳造原料データベースを準備中です。<br/>Google Sheetsの "Products_Casting" シートを作成してください。</p>
                </div>
            )}

        </div>

        {/* DISCLAIMER */}
        <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400">
                ※ 表示価格はLME相場連動の参考価格です。実際の買取価格は、現物の状態（付着物、油、酸化等）および持込数量により変動します。<br/>
                ※ WN-800ナゲットプラントによる自社処理が可能なため、被覆線の中間マージンは発生しません。
            </p>
        </div>

      </div>
    </section>
  );
};
