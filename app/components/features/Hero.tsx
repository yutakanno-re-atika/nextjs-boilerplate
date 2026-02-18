import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// 4つの重要品目定義
const HERO_ITEMS = [
  {
    name: '被覆電線',
    sub: 'INSULATED WIRE',
    desc: 'VVF・CV・IV・ハーネス等',
    // アップロードされた画像を使用
    img: '/images/items/vvf_cable.png', 
  },
  {
    name: '銅スクラップ',
    sub: 'COPPER SCRAP',
    desc: 'ピカ線・込銅・パイプ・板',
    // 仮パス（生成画像をここに配置してください）
    img: '/images/items/millberry.jpg',
  },
  {
    name: '砲金・バルブ',
    sub: 'GUNMETAL',
    desc: 'バルブ・メーター・軸受',
    img: '/images/items/bronze_valve.jpg',
  },
  {
    name: '真鍮・黄銅',
    sub: 'BRASS',
    desc: '蛇口・ナット・仏具・削粉',
    img: '/images/items/yellow_brass.jpg',
  },
];

export const Hero = () => {
  return (
    <div className="relative w-full bg-[#111] overflow-hidden">
      
      {/* 1. 背景画像エリア */}
      <div className="absolute inset-0 z-0">
        {/* 背景画像がない場合はダークグラデーションで代用 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <Image
          src="/images/hero_bg.jpg" // 既存の mixed_wire.png や 工場写真などを設定
          alt="Factory Background"
          fill
          className="object-cover opacity-60"
          priority
        />
      </div>

      {/* 2. コンテンツコンテナ */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-16 md:pt-48 md:pb-24">
        
        <div className="max-w-4xl">
          <p className="text-[#D32F2F] font-bold tracking-[0.2em] mb-4 animate-fade-in-up">
            HOKKAIDO / TOMAKOMAI FACTORY
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-serif leading-tight mb-8 drop-shadow-lg">
            価値ある資源を、<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              次世代の素材
            </span>
            へ。
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-16">
            <Link 
              href="#price-list" 
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <span>本日の買取価格を見る</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </Link>
            <Link 
              href="#access" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold transition-all"
            >
              アクセス・持込方法
            </Link>
          </div>
        </div>

        {/* 3. 重要品目 4カラムカード (Glassmorphism) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {HERO_ITEMS.map((item, index) => (
            <div 
              key={index}
              className="group relative h-48 md:h-64 rounded-xl overflow-hidden border border-white/20 shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* 背景画像 */}
              <Image
                src={item.img}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
              />
              
              {/* グラデーションオーバーレイ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

              {/* テキスト情報 */}
              <div className="absolute bottom-0 left-0 w-full p-4">
                <p className="text-[10px] text-[#D32F2F] font-bold tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {item.sub}
                </p>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1 font-serif">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-300 opacity-80 line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
