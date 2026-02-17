"use client";
import React from 'react';
import { MarketData } from '../../types';

// 🛠️ ミニマルデザインのカード
const PriceCard = ({ name, sub, ratio, price, desc }: any) => {
  return (
    <div className="group relative bg-white border border-gray-200 hover:border-black transition-colors duration-300">
      <div className="p-6">
        {/* ヘッダー: 品名とサブ情報 */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-1">
             <h3 className="font-bold text-lg text-black leading-tight group-hover:underline decoration-1 underline-offset-4">
               {name}
             </h3>
             <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1">
               Cu {ratio}%
             </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">{sub}</p>
        </div>

        {/* 説明文 */}
        <p className="text-[11px] text-gray-400 mb-6 leading-relaxed min-h-[2.5em]">
          {desc}
        </p>
        
        {/* 価格エリア */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-baseline justify-between">
             <span className="text-[10px] text-gray-400 uppercase tracking-wider">UNIT PRICE</span>
             <div className="flex items-baseline text-black">
               <span className="text-sm font-medium mr-1">¥</span>
               <span className="text-2xl font-bold tracking-tight">{price.toLocaleString()}</span>
               <span className="text-[10px] text-gray-400 ml-1">/kg</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PriceListProps {
  data: MarketData | null;
  marketPrice: number;
}

export const PriceList = ({ data, marketPrice }: PriceListProps) => {
  if (!data || !marketPrice) return (
    <div className="py-24 text-center border-y border-gray-100">
        <p className="text-xs font-mono text-gray-400 animate-pulse">SYNCING DATABASE...</p>
    </div>
  );

  const lastUpdate = data.history && data.history.length > 0 
    ? data.history[data.history.length - 1].date 
    : new Date().toLocaleDateString();

  // === データ定義 (Products_Wireシートの代表カテゴリー) ===
  const wireCategories = [
    { id: 'IV', name: 'IV線 (ピカ線)', sub: '剥離済み・高純度', ratio: 98, desc: '歩留まりが高く、最も高価なリサイクル素材。' },
    { id: 'CV', name: 'CVケーブル', sub: '幹線・動力ケーブル', ratio: 58, desc: '被覆が厚く、シース内部の銅率が高い幹線用。' },
    { id: 'VVF', name: 'VA線 (VVF)', sub: 'Fケーブル 2.0mm', ratio: 42, desc: '住宅・ビル解体等の工事残材として一般的。' },
    { id: 'CAB', name: 'キャブタイヤ', sub: '多芯・ゴム被覆', ratio: 38, desc: '柔軟性のある電源コード。銅率は低め。' },
    { id: 'MIX', name: '雑線ミックス', sub: '未選別・家電線', ratio: 45, desc: '選別されていない混合ケーブル類。' },
  ];

  // === データ定義 (Products_Castingシートから取得) ===
  const metalCategories = data.castings.filter(c => 
    ['特号', '1号', '2号', '込銅', '真鍮', '砲金'].some(key => c.name.includes(key))
  ).map(c => ({
      id: c.id,
      name: c.name,
      sub: c.type || 'NON-FERROUS',
      ratio: c.ratio,
      price_offset: c.price_offset,
      desc: c.description || '非鉄金属スクラップ'
  }));

  // 価格計算
  const calcWirePrice = (ratio: number) => Math.floor((marketPrice * (ratio / 100) * 0.9) - 15);
  const calcMetalPrice = (ratio: number, offset: number) => Math.floor((marketPrice * (ratio / 100)) + offset);

  return (
    <section className="py-24 bg-white" id="price-list">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* ヘッダーエリア */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-8 border-b border-gray-900">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-2 tracking-tight">
                  買取単価一覧
                </h2>
                <p className="text-gray-500 text-sm font-medium">
                  LME銅建値連動 / 税込価格表示
                </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">LAST UPDATED</p>
                <p className="text-sm font-mono font-bold text-black">
                   {lastUpdate}
                </p>
            </div>
        </div>

        {/* SECTION 1: 被覆電線 */}
        <div className="mb-20">
            <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-black"></span>
                被覆電線 (Wire Scrap)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-gray-200 border border-gray-200">
                {/* gap-pxとbg-gray-200でグリッド線を表現 */}
                {wireCategories.map((item) => (
                    <PriceCard key={item.id} {...item} price={calcWirePrice(item.ratio)} />
                ))}
            </div>
        </div>

        {/* SECTION 2: 非鉄原料 */}
        <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-widest mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400"></span>
                非鉄原料 (Non-Ferrous)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200 border border-gray-200">
                {metalCategories.length > 0 ? (
                    metalCategories.map((item) => (
                        <PriceCard key={item.id} {...item} price={calcMetalPrice(item.ratio, item.price_offset)} />
                    ))
                ) : (
                    <div className="col-span-full bg-white p-8 text-center text-gray-400 text-sm">
                        NO DATA AVAILABLE
                    </div>
                )}
            </div>
        </div>
        
        {/* 補足 */}
        <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400">
                ※ 価格は相場変動により予告なく変更される場合があります。大量持ち込み（1t〜）の特別単価についてはお問い合わせください。
            </p>
        </div>
      </div>
    </section>
  );
};
