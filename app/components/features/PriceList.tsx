// @ts-nocheck
"use client";

import React from 'react';
import Image from 'next/image';
import { MarketData } from '../../types';

const getImageUrl = (name: string, category: string): string => {
  const DEFAULT_IMG = '/images/items/mixed_wire.png'; 
  
  if (name.includes('IV') || name.includes('ピカ')) return '/images/items/millberry.jpg';
  if (name.includes('CV')) return '/images/items/cv_cable.png';
  if (name.includes('VVF') || name.includes('VA')) return '/images/items/vvf_cable.png';
  if (name.includes('キャブタイヤ')) return '/images/items/cabtire_cable.png';
  if (name.includes('雑線') || name.includes('ミックス')) return '/images/items/mixed_wire.png';
  
  if (name.includes('込銅') || name.includes('上故')) return '/images/items/heavy_copper.jpg';
  if (name.includes('真鍮')) return '/images/items/yellow_brass.jpg';
  if (name.includes('砲金')) return '/images/items/bronze_valve.jpg';
  
  return DEFAULT_IMG;
};

// ★ 追加: 表示名を動的に生成（sqと芯数を結合）
const getDisplayName = (w: any) => {
    let name = w.name;
    if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
    if (w.core && w.core !== '-') name += ` ${w.core}C`;
    return name;
};

interface PriceListProps {
  data: MarketData | null;
  marketPrice: number;
}

export function PriceList({ data, marketPrice }: PriceListProps) {
  if (!data || !marketPrice) {
    return (
      <div className="py-24 text-center border-y border-gray-100 bg-gray-50">
         <div className="inline-block animate-spin w-8 h-8 border-4 border-gray-200 border-t-[#D32F2F] rounded-full"></div>
         <p className="mt-4 text-gray-400 text-sm">Loading market data...</p>
      </div>
    );
  }

  const lastUpdate = data.history && data.history.length > 0 
    ? data.history[data.history.length - 1].date 
    : new Date().toLocaleDateString();

  // ★ 修正: MIXだけでなく、歩留まりが設定されている電線をすべて抽出し、名前を動的生成
  const wireItems = (data.wires || [])
    .filter(w => w.ratio > 0)
    .map(w => {
      const displayName = getDisplayName(w);
      let desc = w.maker && w.maker !== '-' ? `メーカー: ${w.maker}` : '電線・ケーブル類';
      if (w.id.includes('MIX')) {
          if (w.id === 'MIX-75') desc = '太線や高銅率ケーブルが中心の高品質ミックス。';
          else if (w.id === 'MIX-56') desc = '中程度の太さのケーブルが混ざった一般的なミックス。';
          else if (w.id === 'MIX-42') desc = 'VVF（VA線）や細線が中心のミックス。';
          else if (w.id === 'MIX-30') desc = '歩留まりの低い家電線や通信線などのミックス。';
      }
      
      return {
        id: w.id,
        name: displayName,
        ratio: w.ratio,
        desc: desc,
        image: getImageUrl(w.name, 'wire')
      };
    });

  const metalItems = (data.castings || [])
    .filter(c => ['特号', '1号', '2号', '込銅', '真鍮', '砲金'].some(key => c.name.includes(key)))
    .map(c => ({
      id: c.id,
      name: c.name,
      ratio: c.ratio,
      priceOffset: c.price_offset,
      desc: c.description || '非鉄金属スクラップ',
      image: getImageUrl(c.name, 'metal')
    }));

  const displayItems = [
    ...wireItems.map(item => ({ ...item, category: 'wire' as const })),
    ...metalItems.map(item => ({ ...item, category: 'metal' as const }))
  ];

  const calcPrice = (item: any, type: 'wire' | 'metal') => {
    let price = 0;
    if (type === 'wire') {
      price = (marketPrice * (item.ratio / 100) * 0.85) - 15;
    } else {
      price = (marketPrice * (item.ratio / 100)) + (item.priceOffset || 0);
    }
    return Math.floor(price / 10) * 10;
  };

  return (
    <section className="py-16 bg-gray-50" id="price-list">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
             <span className="w-8 h-[2px] bg-[#D32F2F]"></span>
             <span className="text-[#D32F2F] font-bold text-xs tracking-[0.2em] font-sans">MARKET PRICE</span>
             <span className="w-8 h-[2px] bg-[#D32F2F]"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
            本日の買取単価
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-sm text-gray-600">
             <p>LME銅建値連動・リアルタイム更新</p>
             <div className="bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200">
                <span className="text-xs text-gray-400 mr-2">最終更新:</span>
                <span className="font-mono font-bold text-black">{lastUpdate}</span>
             </div>
          </div>
        </div>

        {/* リスト表示 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayItems.map((item) => (
            <div 
              key={item.category + '-' + item.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.category === 'wire' ? 'bg-orange-500' : 'bg-yellow-500'} group-hover:w-2 transition-all z-10`}></div>

              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                 <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-0 right-0 bg-black/80 text-white text-xs font-mono px-3 py-1 rounded-bl-lg backdrop-blur-sm z-10">
                    {item.ratio.toFixed(1)}%
                  </div>
              </div>

              <div className="p-5 flex flex-col flex-grow pl-7">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#D32F2F] transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                </div>
                
                <div className="mb-4">
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm whitespace-nowrap">
                        {item.category === 'wire' ? '被覆電線' : '非鉄金属'}
                    </span>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 min-h-[2.5em]">
                      {item.desc}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-dashed border-gray-100">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      UNIT PRICE
                    </span>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold text-gray-400">¥</span>
                        <span className="text-2xl font-black text-[#D32F2F] font-sans tracking-tighter">
                          {calcPrice(item, item.category).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">/kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
            ※ 上記価格は税込・参考価格です。状態（付き物、油、酸化など）や相場変動により予告なく変更される場合があります。<br/>
            ※ 10kg未満のお持ち込み、または事業系廃棄物の場合は単価が異なる場合があります。
            </p>
        </div>
      </div>
    </section>
  );
}
