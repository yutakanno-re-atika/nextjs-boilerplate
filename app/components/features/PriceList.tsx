"use client";
import React from 'react';
import { MarketData } from '../../types';

// 🛠️ 画像を使わないシンプルなカードコンポーネント
const PriceCard = ({ name, sub, ratio, price, desc, isMetal = false }: any) => {
  // アクセントカラーの定義
  const accentColor = isMetal ? 'bg-blue-600' : 'bg-[#D32F2F]';
  const textColor = isMetal ? 'text-blue-600' : 'text-[#D32F2F]';
  const borderColor = isMetal ? 'group-hover:border-blue-600' : 'group-hover:border-[#D32F2F]';

  return (
    <div className={`relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-200 ${borderColor}`}>
      {/* 左側のカラーバーアクセント */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentColor}`} />

      <div className="p-5 pl-7">
        {/* ヘッダー部分: 品名とサブ情報 */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              {sub || (isMetal ? 'NON-FERROUS' : 'SCRAP WIRE')}
            </span>
            <h3 className="font-bold text-lg text-gray-800 leading-tight">{name}</h3>
          </div>
          {/* 歩留まりバッジ */}
          <div className={`text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600`}>
            {ratio}%
          </div>
        </div>

        {/* 説明文 */}
        <p className="text-xs text-gray-400 mb-4 h-8 leading-4 overflow-hidden">
          {desc}
        </p>
        
        {/* 価格エリア */}
        <div className="border-t border-dashed border-gray-100 pt-3 mt-auto">
          <div className="flex items-end justify-between">
             <span className="text-xs text-gray-400 font-medium">買取単価</span>
             <div className={`flex items-baseline gap-0.5 ${textColor}`}>
               <span className="text-sm font-bold">¥</span>
               <span className="text-2xl font-black tracking-tighter">{price.toLocaleString()}</span>
               <span className="text-xs font-bold text-gray-400 ml-1">/kg</span>
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
    <div className="py-32 text-center space-y-4 bg-gray-50">
        <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-[#D32F2F] rounded-full mx-auto"></div>
        <p className="text-gray-400 text-xs tracking-widest">LOADING DATA...</p>
    </div>
  );

  // 更新日の取得 (履歴の最新日付を使用)
  const lastUpdate = data.history && data.history.length > 0 
    ? data.history[data.history.length - 1].date 
    : new Date().toLocaleDateString();

  // === データ定義 ===
  // 1. 被覆電線 (Wires)
  const wireCategories = [
    { id: 'IV', name: 'IV線 (ピカ線)', sub: '剥離済み・高純度', ratio: 98, desc: '最も高価なリサイクル素材' },
    { id: 'CV', name: 'CVケーブル', sub: '幹線・動力ケーブル', ratio: 58, desc: '被覆が厚く銅率が高い' },
    { id: 'VVF', name: 'VA線 (VVF)', sub: 'Fケーブル 2.0mm', ratio: 42, desc: '住宅解体・工事残材の定番' },
    { id: 'CAB', name: 'キャブタイヤ', sub: '多芯・ゴム被覆', ratio: 38, desc: '柔軟性のある電源コード' },
    { id: 'MIX', name: '雑線ミックス', sub: '未選別・家電線', ratio: 45, desc: '選別前の混合ケーブル' },
  ];

  // 2. 非鉄原料 (Metals)
  const metalCategories = data.castings.filter(c => 
    ['特号', '1号', '2号', '込銅', '真鍮', '砲金'].some(key => c.name.includes(key))
  ).map(c => ({
      id: c.id,
      name: c.name,
      sub: c.type || '非鉄金属',
      ratio: c.ratio,
      price_offset: c.price_offset,
      desc: c.description || '-'
  }));

  // 価格計算ロジック
  const calcWirePrice = (ratio: number) => Math.floor((marketPrice * (ratio / 100) * 0.9) - 15);
  const calcMetalPrice = (ratio: number, offset: number) => Math.floor((marketPrice * (ratio / 100)) + offset);

  return (
    <section className="py-20 bg-[#f8f9fa]" id="price-list">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* ヘッダーエリア */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-gray-200">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  本日の買取単価
                </h2>
                <p className="text-gray-500 text-sm">
                  市場連動型の透明な価格提示。すべて1kgあたりの税込価格です。
                </p>
            </div>
            <div className="text-right mt-4 md:mt-0">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-mono">
                   建値更新日: {lastUpdate}
                </span>
            </div>
        </div>

        {/* SECTION 1: 被覆電線 */}
        <div className="mb-16">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-[#D32F2F] mr-3 rounded-sm"></span>
                被覆電線 <span className="text-sm font-normal text-gray-500 ml-2">Copper Wire Scrap</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {wireCategories.map((item) => (
                    <PriceCard key={item.id} {...item} price={calcWirePrice(item.ratio)} />
                ))}
            </div>
        </div>

        {/* SECTION 2: 非鉄原料 */}
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-blue-600 mr-3 rounded-sm"></span>
                非鉄原料 <span className="text-sm font-normal text-gray-500 ml-2">Non-Ferrous Metals</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {metalCategories.length > 0 ? (
                    metalCategories.map((item) => (
                        <PriceCard key={item.id} {...item} price={calcMetalPrice(item.ratio, item.price_offset)} isMetal={true} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 bg-white rounded border border-gray-200 text-gray-400 text-sm">
                        現在表示できる非鉄原料データがありません
                    </div>
                )}
            </div>
        </div>
      </div>
    </section>
  );
};
