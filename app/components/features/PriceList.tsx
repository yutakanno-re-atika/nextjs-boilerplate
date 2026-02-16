"use client";
import React, { useState, useMemo } from 'react';
import { MarketData } from '../../types';

// アイコン定義
const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Calculator: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  ArrowUpRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7v10" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  AlertCircle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

// 画像パスのマッピング
const IMG_MAP: Record<string, string> = {
  // Wire
  'pika': '/images/pika_wire.png',
  'cv': '/images/cv_cable.png',
  'iv': '/images/iv_cable.png',
  'vvf': '/images/vvf_cable.png',
  'mixed': '/images/mixed_wire.png',
  'cabtire': '/images/cabtire_cable.png',
  // Non-Ferrous (詳細化)
  'bronze': '/images/copper_nugget.png', // 砲金用画像(仮)
  'brass': '/images/copper_nugget.png',  // 真鍮用画像(仮)
  'turnings': '/images/factory_floor.png', // ダライ粉用(仮)
  'urban': '/images/factory_floor.png', 
  'nugget': '/images/copper_nugget.png'
};

// 詳細化されたカテゴリ定義
type CategoryKey = 'copper_wire' | 'bronze' | 'brass' | 'urban_mine';

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('copper_wire');
  const [simulatorWeight, setSimulatorWeight] = useState<string>('');
  const [selectedItemPrice, setSelectedItemPrice] = useState<number | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<string>('');

  // カテゴリ定義（真鍮・砲金を分離）
  const categories = [
    { id: 'copper_wire', name: '銅・電線', desc: 'WN-800ナゲットプラント直結。被覆線から99.9%純銅を抽出。' },
    { id: 'bronze', name: '砲金 (Bronze)', desc: 'BC6バルブ・中砲・リン青銅。銅純度が高いため最高値で買取。' },
    { id: 'brass', name: '真鍮 (Brass)', desc: '込真鍮・セパ・ダライ粉。自社炉の原料として独自の高値提示。' },
    { id: 'urban_mine', name: '雑品・都市鉱山', desc: '給湯器・モーター・基板。複合素材も適正評価。' }
  ];

  // データ振り分け処理
  const displayItems = useMemo(() => {
    if (!data) return [];
    
    // 1. 銅・電線
    if (activeCategory === 'copper_wire') {
      return data.wires.map(w => {
        const price = Math.floor((marketPrice * (w.ratio / 100) * 0.9) - 15);
        let imgKey = 'nugget';
        const lowerName = w.name.toLowerCase();
        const lowerCat = w.category.toLowerCase();
        if (lowerCat.includes('iv') || lowerName.includes('iv')) imgKey = 'iv';
        else if (lowerCat.includes('cv') || lowerName.includes('cv')) imgKey = 'cv';
        else if (lowerCat.includes('vvf') || lowerName.includes('vvf')) imgKey = 'vvf';
        else if (lowerCat.includes('mix') || lowerName.includes('mix')) imgKey = 'mixed';
        else if (lowerCat.includes('cabtire') || lowerName.includes('cabtire')) imgKey = 'cabtire';
        else if (lowerName.includes('pika')) imgKey = 'pika';

        return {
          id: w.id,
          name: w.name,
          sub: `${w.maker} ${w.sq}sq`,
          price: price,
          ratio: w.ratio,
          unit: 'kg',
          img: IMG_MAP[imgKey],
          tag: w.ratio > 80 ? 'High Grade' : 'Standard'
        };
      }).filter(w => w.name).slice(0, 12); 
    } 
    // 2. 砲金・真鍮・その他
    else {
      return data.castings.filter(c => {
        if (activeCategory === 'bronze') return c.type === 'Bronze';
        if (activeCategory === 'brass') return c.type === 'Brass';
        if (activeCategory === 'urban_mine') return c.type === 'Urban'; 
        return false;
      }).map(c => {
        // 価格ロジック: (LME * Ratio) - Offset
        const rawPrice = (marketPrice * (c.ratio / 100));
        const price = Math.floor(rawPrice - (c.price_offset || 0));
        
        // 詳細画像判定
        let imgKey = 'urban';
        if (c.type === 'Bronze') imgKey = 'bronze';
        if (c.type === 'Brass') imgKey = 'brass';
        if (c.form === 'Turnings') imgKey = 'turnings'; // ダライ粉
        
        return {
          id: c.id,
          name: c.name,
          sub: c.description,
          price: price > 0 ? price : '要査定',
          ratio: c.ratio,
          unit: 'kg',
          img: IMG_MAP[imgKey],
          tag: c.form // Solid / Turnings などを表示
        };
      });
    }
  }, [data, activeCategory, marketPrice]);

  const currentCatDesc = categories.find(c => c.id === activeCategory)?.desc;

  const calculateTotal = () => {
    const w = parseFloat(simulatorWeight);
    if (!isNaN(w) && selectedItemPrice && typeof selectedItemPrice === 'number') {
      return Math.floor(w * selectedItemPrice).toLocaleString();
    }
    return '---';
  };

  if (!data) return <div className="py-20 text-center text-gray-400 animate-pulse">Loading Realtime Data...</div>;

  return (
    <section className="py-16 bg-gray-50" id="price-list">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Icons.TrendingUp /> 2026.02.16 更新
            </span>
            <span className="text-gray-500 text-sm">LME銅建値: ¥{marketPrice.toLocaleString()}/kg 連動</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-gray-900 mb-4">
            本日の買取単価一覧
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            苫小牧工場のナゲットプラント直結・自社炉活用により、中間マージンを排除した
            「メーカー直結価格」をご提示します。
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id as CategoryKey); setSelectedItemName(''); setSelectedItemPrice(null); }}
              className={`px-6 py-3 rounded-full font-bold transition-all duration-200 ${
                activeCategory === cat.id
                 ? 'bg-[#D32F2F] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Category Description */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg max-w-4xl mx-auto">
          <p className="text-blue-800 font-medium text-sm md:text-base">
            <span className="font-bold mr-2">💡 戦略ポイント:</span>
            {currentCatDesc}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayItems.length > 0 ? displayItems.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group cursor-pointer ${selectedItemName === item.name ? 'ring-2 ring-[#D32F2F]' : ''}`}
              onClick={() => {
                  if(typeof item.price === 'number') {
                    setSelectedItemPrice(item.price);
                    setSelectedItemName(item.name);
                  } else {
                    alert("この商品は要査定です。LINEでお問い合わせください。");
                  }
              }}
            >
              {/* Image Area */}
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gray-800/10 group-hover:bg-transparent transition-colors z-10" />
                <div className={`absolute inset-0 opacity-20 ${item.tag.includes('Bronze') ? 'bg-orange-700' : 'bg-yellow-500'}`}></div>
                <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white z-20">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${item.tag==='Solid'?'bg-blue-600':item.tag==='Turnings'?'bg-gray-600':'bg-[#D32F2F]'}`}>
                    {item.tag}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{item.name}</h3>
                  <Icons.ArrowUpRight />
                </div>
                <p className="text-xs text-gray-400 mb-2 line-clamp-1">{item.sub}</p>
                
                <div className="flex items-end gap-1 mt-2">
                  <span className="text-3xl font-black text-[#D32F2F] tracking-tight">
                    {typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                  </span>
                  <span className="text-sm text-gray-500 font-medium mb-1">
                    {typeof item.price === 'number' ? `円 / ${item.unit} (税込)` : ''}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-400">Ref Yield: {item.ratio}%</span>
                  <button className="text-sm text-blue-600 font-bold flex items-center hover:underline">
                    シミュレーションへ <span className="ml-1"><Icons.Calculator /></span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="mb-2 font-bold">データが見つかりません</p>
                <p className="text-xs">GASの `Products_Casting` シートにデータを追加してください。</p>
            </div>
          )}
        </div>

        {/* Quick Simulator (Same as before) */}
        <div id="quick-sim" className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
           {/* ...シミュレーター部分は共通... */}
           <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Icons.Calculator /> 買取シミュレーター</h3>
              <p className="text-gray-400 mb-6 text-sm">上のカードをタップして単価を選択し、重量を入力してください。</p>
              <div className="flex gap-4 items-end">
                <div className="flex-1"><label className="block text-xs font-medium text-gray-400 mb-1">重量 (kg)</label><input type="number" value={simulatorWeight} onChange={(e) => setSimulatorWeight(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-white outline-none" placeholder="0" /></div>
                <div className="pb-3 text-xl font-bold text-gray-500">×</div>
                <div className="flex-1"><label className="block text-xs font-medium text-gray-400 mb-1">単価</label><div className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-xl font-bold text-gray-300">{selectedItemPrice ? `¥${selectedItemPrice.toLocaleString()}` : '---'}</div></div>
              </div>
              {selectedItemName && <p className="text-xs text-[#D32F2F] mt-2">Selected: {selectedItemName}</p>}
            </div>
            <div className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm border border-white/10">
              <span className="block text-sm text-gray-300 mb-2">概算受取金額</span>
              <div className="text-5xl font-black text-yellow-400 tracking-tight mb-2">{calculateTotal()} <span className="text-2xl text-white">円</span></div>
              <button className="mt-4 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"><Icons.Camera /> LINEで写真を送って査定</button>
            </div>
           </div>
        </div>

        <div className="mt-8 flex items-start gap-2 text-xs text-gray-500 bg-white p-4 rounded-lg border border-gray-200">
          <div className="mt-0.5 flex-shrink-0"><Icons.AlertCircle /></div>
          <p>※ 上記価格は苫小牧工場へのお持ち込み価格（税込）です。大口・定期契約は別途ご相談ください。</p>
        </div>

      </div>
    </section>
  );
};
