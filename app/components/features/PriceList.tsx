"use client";
import React from 'react';
import { MarketData } from '../../types';

// 🛠️ 月寒ブランドカラー (赤・黒・白) に統一したカードデザイン
const PriceCard = ({ name, sub, ratio, price, desc }: any) => {
  return (
    <div className="group relative bg-white border-l-4 border-[#D32F2F] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        {/* ヘッダー: 品名と銅率 */}
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-lg text-black leading-tight group-hover:text-[#D32F2F] transition-colors">
             {name}
           </h3>
           <span className="font-mono text-xs font-bold text-white bg-black px-2 py-1">
             {ratio}%
           </span>
        </div>
        
        {/* サブ情報 */}
        <p className="text-xs text-gray-500 font-bold mb-3 uppercase tracking-wider">{sub}</p>

        {/* 説明文 */}
        <p className="text-[11px] text-gray-400 mb-6 leading-relaxed min-h-[2.5em] border-t border-gray-100 pt-2">
          {desc}
        </p>
        
        {/* 価格エリア */}
        <div className="bg-gray-50 -mx-6 -mb-6 p-4 flex items-center justify-between group-hover:bg-[#D32F2F] group-hover:text-white transition-colors duration-300">
           <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">UNIT PRICE</span>
           <div className="flex items-baseline">
             <span className="text-sm font-bold mr-1">¥</span>
             <span className="text-2xl font-black tracking-tighter">{price.toLocaleString()}</span>
             <span className="text-[10px] font-bold opacity-70 ml-1">/kg</span>
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
        <div className="inline-block animate-spin w-6 h-6 border-2 border-gray-200 border-t-[#D32F2F] rounded-full"></div>
    </div>
  );

  // コンフィグシートまたは履歴から最新更新日時を取得
  // Configシートの 'market_price' 行の description に入っている "Updated: ..." を解析するのが最も正確ですが、
  // 簡易的に履歴の最新日付を使用します。
  const lastUpdate = data.history && data.history.length > 0 
    ? data.history[data.history.length - 1].date 
    : new Date().toLocaleDateString();

  // === データ定義: Products_Wire (被覆電線) ===
  const wireCategories = [
    { id: 'IV', name: 'IV線 (ピカ線)', sub: 'Copper Wire', ratio: 98, desc: '剥離済み・高純度の銅線。' },
    { id: 'CV', name: 'CVケーブル', sub: 'Power Cable', ratio: 58, desc: '被覆が厚く銅率が高い幹線用ケーブル。' },
    { id: 'VVF', name: 'VA線 (VVF)', sub: 'Flat Cable', ratio: 42, desc: '住宅・ビル解体等の工事残材として一般的。' },
    { id: 'CAB', name: 'キャブタイヤ', sub: 'Flexible Cable', ratio: 38, desc: '多芯で柔軟性のある電源コード類。' },
    { id: 'MIX', name: '雑線ミックス', sub: 'Mixed Wire', ratio: 45, desc: '未選別の混合ケーブル・家電線など。' },
  ];

  // === データ定義: Products_Casting (非鉄原料) ===
  const metalCategories = data.castings.filter(c => 
    ['特号', '1号', '2号', '込銅', '真鍮', '砲金'].some(key => c.name.includes(key))
  ).map(c => ({
      id: c.id,
      name: c.name,
      sub: 'Non-Ferrous', // 英語表記で統一
      ratio: c.ratio,
      price_offset: c.price_offset,
      desc: c.description || '非鉄金属スクラップ'
  }));

  // 価格計算
  const calcWirePrice = (ratio: number) => Math.floor((marketPrice * (ratio / 100) * 0.9) - 15);
  const calcMetalPrice = (ratio: number, offset: number) => Math.floor((marketPrice * (ratio / 100)) + offset);

  return (
    <section className="py-24 bg-white text-black" id="price-list">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* ヘッダーエリア */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 pb-6 border-b-2 border-black">
            <div>
                <h2 className="text-3xl md:text-4xl font-black text-black mb-2 uppercase tracking-tighter">
                  Market Price
                </h2>
                <p className="text-[#D32F2F] font-bold text-sm tracking-widest">
                  本日の買取単価一覧
                </p>
            </div>
            <div className="text-right mt-6 md:mt-0">
                <div className="inline-flex flex-col items-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">LAST UPDATED</span>
                    <span className="text-xl font-mono font-black text-black bg-gray-100 px-3 py-1">
                       {lastUpdate}
                    </span>
                </div>
            </div>
        </div>

        {/* SECTION 1: 被覆電線 */}
        <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
                <span className="w-3 h-3 bg-[#D32F2F]"></span>
                <h3 className="text-xl font-bold text-black tracking-tight">
                    被覆電線 <span className="text-sm font-normal text-gray-500 ml-2 font-mono">/ WIRE SCRAP</span>
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {wireCategories.map((item) => (
                    <PriceCard key={item.id} {...item} price={calcWirePrice(item.ratio)} />
                ))}
            </div>
        </div>

        {/* SECTION 2: 非鉄原料 */}
        <div>
            <div className="flex items-center gap-3 mb-8">
                <span className="w-3 h-3 bg-black"></span>
                <h3 className="text-xl font-bold text-black tracking-tight">
                    非鉄原料 <span className="text-sm font-normal text-gray-500 ml-2 font-mono">/ NON-FERROUS METAL</span>
                </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {metalCategories.length > 0 ? (
                    metalCategories.map((item) => (
                        <PriceCard key={item.id} {...item} price={calcMetalPrice(item.ratio, item.price_offset)} />
                    ))
                ) : (
                    <div className="col-span-full border-2 border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
                        NO DATA AVAILABLE
                    </div>
                )}
            </div>
        </div>
        
        {/* 注意書き */}
        <div className="mt-16 border-t border-gray-200 pt-8 text-center">
            <p className="text-xs text-gray-500 font-medium">
                ※ 価格は税込表示です。相場変動により予告なく変更される場合があります。<br className="hidden md:inline"/>
                大量持ち込み（1t以上）の場合は特別単価をご提示可能です。お問い合わせください。
            </p>
        </div>

      </div>
    </section>
  );
};
