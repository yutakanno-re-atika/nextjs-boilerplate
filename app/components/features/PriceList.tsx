"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// --- 型定義 ---
type PriceItem = {
  id: string;
  name: string;
  category: 'copper' | 'brass_bronze' | 'wire' | 'other';
  imageSrc: string; // 画像パス
  ratio: number; // 銅率または係数 (%)
  description: string;
  priceOffset?: number; // 建値からの固定マイナス値など
};

// --- 商品データ定義 (CSVの内容 + 画像パス) ---
// ※本来はAPI/CSVから読み込むべきですが、表示制御のためフロントでマスタ定義します
const ITEM_MASTER: PriceItem[] = [
  // 【銅 Copper】
  {
    id: 'co-001',
    name: '特号銅線 (ピカ線)',
    category: 'copper',
    imageSrc: '/images/items/millberry.jpg',
    ratio: 100, // 銅建値 * 100% - コスト
    description: '1.3mm以上の光沢のある剥き線。酸化・油・メッキのないもの。',
    priceOffset: -30 // 建値 - 30円/kg (例)
  },
  {
    id: 'co-006',
    name: '上故銅 (込銅)',
    category: 'copper',
    imageSrc: '/images/items/heavy_copper.jpg',
    ratio: 95,
    description: 'パイプ、板、使用済み銅管など。緑青や多少の汚れ可。',
    priceOffset: -50
  },
  
  // 【真鍮・砲金 Brass & Bronze】
  {
    id: 'bro-003',
    name: '砲金バルブ',
    category: 'brass_bronze',
    imageSrc: '/images/items/bronze_valve.jpg',
    ratio: 85, // 実際は単価設定が多いが、ここでは仮に係数化
    description: 'バルブ、メーター、軸受など。真鍮より赤みがある鋳物。',
  },
  {
    id: 'bra-001',
    name: '込真鍮',
    category: 'brass_bronze',
    imageSrc: '/images/items/yellow_brass.jpg',
    ratio: 60,
    description: '蛇口、ナット、ボルトなど。黄色い金属。プラスチック付は減額。',
  },

  // 【電線 Wire】
  {
    id: 'mix-high',
    name: 'VA・VVFケーブル',
    category: 'wire',
    imageSrc: '/images/items/vvf_cable.png', // アップロードされた画像を使用
    ratio: 42, // 平均的な歩留まり
    description: '住宅屋内で使われる平型ケーブル。剥離しやすく高価買取。',
  },
  {
    id: 'mix-mid',
    name: '雑線 (ミックス)',
    category: 'wire',
    imageSrc: '/images/items/mixed_wire.png',
    ratio: 45, // 雑線の平均係数
    description: '家電線、細線、通信線などが混ざった状態。',
  }
];

// --- カテゴリ定義 ---
const CATEGORIES = [
  { id: 'copper', label: '銅・ピカ線', color: 'bg-red-600' },
  { id: 'wire', label: '雑線・被覆線', color: 'bg-orange-500' },
  { id: 'brass_bronze', label: '真鍮・砲金', color: 'bg-yellow-600' },
  { id: 'other', label: 'その他', color: 'bg-gray-500' },
];

export default function PriceList() {
  const [activeTab, setActiveTab] = useState('copper');
  const [marketData, setMarketData] = useState<any>(null);

  // APIから相場情報を取得 (GASバックエンド)
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        // GASのウェブアプリURLを指定 (環境変数推奨)
        const res = await fetch('YOUR_GAS_WEB_APP_URL_HERE');
        const data = await res.json();
        setMarketData(data);
      } catch (e) {
        console.error("Market data fetch error", e);
      }
    };
    fetchMarket();
  }, []);

  // 表示用データのフィルタリング
  const displayItems = ITEM_MASTER.filter(item => item.category === activeTab);

  // 価格計算ロジック (簡易版)
  const calculatePrice = (item: PriceItem) => {
    if (!marketData) return '---';
    
    // 銅建値 (例: 1300)
    const copperBase = marketData.market?.copper?.price || 1300;
    
    // ロジック例: (建値 - オフセット) * 歩留まり
    // ※実際は御社の厳密な計算式に合わせて調整してください
    let price = 0;
    
    if (item.category === 'copper') {
       price = (copperBase + (item.priceOffset || 0));
    } else if (item.category === 'wire') {
       price = copperBase * (item.ratio / 100) * 0.8; // 電線は加工費(0.8)を引くなど
    } else {
       // 真鍮などは固定単価の場合もあるが、ここでは連動計算
       price = copperBase * (item.ratio / 100); 
    }

    return Math.floor(price / 10) * 10; // 10円単位切り捨て
  };

  return (
    <section className="py-12 bg-gray-50" id="price-list">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">
            本日の買取価格
          </h2>
          <p className="text-gray-600">
            相場変動により毎日更新中。<br className="md:hidden"/>
            大量持込の場合は別途お見積りいたします。
          </p>
          {marketData && (
            <div className="mt-4 inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-red-100">
              <span className="text-sm text-gray-500 mr-2">銅建値基準:</span>
              <span className="text-xl font-bold text-red-600">
                {marketData.market?.copper?.price?.toLocaleString()}円/kg
              </span>
              <span className="text-xs text-gray-400 ml-2">
                ({new Date(marketData.timestamp || Date.now()).toLocaleDateString()}更新)
              </span>
            </div>
          )}
        </div>

        {/* タブナビゲーション */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === cat.id
                  ? `${cat.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* カードグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              {/* 画像エリア (アスペクト比 4:3) */}
              <div className="relative h-48 w-full bg-gray-200">
                {/* 注: next/imageを使用する場合、width/heightまたはfillを指定する必要があります。
                  実際の運用では placeholder="blur" を推奨
                */}
                 <Image
                    src={item.imageSrc}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* カテゴリバッジ */}
                  <div className="absolute top-2 left-2">
                     <span className={`text-xs text-white px-2 py-1 rounded shadow-sm ${
                       CATEGORIES.find(c => c.id === item.category)?.color || 'bg-gray-500'
                     }`}>
                       {CATEGORIES.find(c => c.id === item.category)?.label}
                     </span>
                  </div>
              </div>

              {/* コンテンツエリア */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {item.name}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                  {item.description}
                </p>

                <div className="mt-auto pt-4 border-t border-dashed border-gray-200">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">
                      参考買取単価
                    </span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-red-600 font-sans tracking-tighter">
                        {calculatePrice(item).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">円/kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 注意書き */}
        <div className="mt-8 text-center text-xs text-gray-400">
          ※ 上記価格は参考価格です。状態（付き物、油、酸化など）により変動します。
        </div>

      </div>
    </section>
  );
}
