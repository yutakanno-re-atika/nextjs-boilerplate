"use client";
import React, { useState, useMemo } from 'react';
import { MarketData, ProductWire, ProductCasting } from '../../types';

// 画像パスのマッピング
const IMG_MAP: Record<string, string> = {
  // Wires
  'pika': '/images/pika_wire.png',
  'cv': '/images/cv_cable.png',
  'iv': '/images/iv_cable.png',
  'vvf': '/images/vvf_cable.png',
  'mixed': '/images/mixed_wire.png',
  'cabtire': '/images/cabtire_cable.png',
  // Casting (汎用画像)
  'brass': '/images/copper_nugget.png', 
  'bronze': '/images/copper_nugget.png',
  'alu': '/images/factory_floor.png'
};

type TabType = 'WIRE' | 'CASTING';

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<TabType>('WIRE');
  const [searchTerm, setSearchTerm] = useState('');
  const [wireFilter, setWireFilter] = useState('ALL'); // カテゴリフィルター
  const [visibleCount, setVisibleCount] = useState(9); // 初期表示件数

  // ------------------------------------------------
  // フィルタリングロジック (useMemoで高速化)
  // ------------------------------------------------
  const filteredWires = useMemo(() => {
    if (!data?.wires) return [];
    let wires = data.wires;

    // 1. ノイズ除去 (Legacyデータや空データを弾く)
    // ※ nameがあるものだけ表示するなど、最低限のクレンジング
    wires = wires.filter(w => w.name && w.name !== '');

    // 2. カテゴリフィルター
    if (wireFilter !== 'ALL') {
      // 部分一致でフィルタ (例: "IV" を選べば "600V IV" もヒットさせる)
      wires = wires.filter(w => 
        w.category && w.category.toUpperCase().includes(wireFilter)
      );
    }

    // 3. キーワード検索
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      wires = wires.filter(w => 
        (w.name && w.name.toLowerCase().includes(lower)) || 
        (w.maker && w.maker.toLowerCase().includes(lower)) ||
        (w.category && w.category.toLowerCase().includes(lower))
      );
    }
    return wires;
  }, [data?.wires, wireFilter, searchTerm]);

  const filteredCastings = useMemo(() => {
    if (!data?.castings) return [];
    let castings = data.castings;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      castings = castings.filter(c => 
        c.name.toLowerCase().includes(lower) || 
        c.type.toLowerCase().includes(lower)
      );
    }
    return castings;
  }, [data?.castings, searchTerm]);

  // ローディング表示
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
        
        {/* HEADER: PRICING LOGIC */}
        <div className="text-center mb-16">
            <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Realtime Market</span>
            <h2 className="text-4xl font-serif font-medium text-[#111] mb-6">本日の買取価格</h2>
            <div className="inline-flex flex-col md:flex-row items-center gap-4 bg-gray-50 px-8 py-4 rounded-full border border-gray-200 shadow-sm">
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

        {/* MAIN TABS (WIRE vs CASTING) */}
        <div className="flex justify-center gap-4 mb-8">
            <button 
                onClick={() => { setActiveTab('WIRE'); setVisibleCount(9); setSearchTerm(''); }}
                className={`px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 border rounded-full ${activeTab === 'WIRE' ? 'bg-[#111] text-white border-[#111] shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
            >
                Wire Scraps (電線)
            </button>
            <button 
                onClick={() => { setActiveTab('CASTING'); setVisibleCount(9); setSearchTerm(''); }}
                className={`px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 border rounded-full ${activeTab === 'CASTING' ? 'bg-[#111] text-white border-[#111] shadow-lg' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}`}
            >
                Casting / Alloy (鋳造・合金)
            </button>
        </div>

        {/* SUB FILTERS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12 bg-gray-50 p-4 rounded-xl border border-gray-100 sticky top-20 z-30 shadow-sm backdrop-blur-sm bg-gray-50/90">
            {activeTab === 'WIRE' ? (
                <div className="flex flex-wrap gap-2">
                    {['ALL', 'IV', 'CV', 'VVF', 'MIX'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => { setWireFilter(cat); setVisibleCount(9); }}
                            className={`px-4 py-1 text-xs font-bold rounded transition-colors ${wireFilter === cat ? 'bg-[#D32F2F] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
                        >
                            {cat === 'ALL' ? 'すべて' : cat}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Casting Categories</div>
            )}

            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="キーワード検索 (例: 矢崎 14sq)" 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:border-[#D32F2F] focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Icons.Search className="w-4 h-4 text-gray-400 absolute left-4 top-2.5" />
            </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* --- WIRE LIST --- */}
            {activeTab === 'WIRE' && filteredWires.slice(0, visibleCount).map((product, idx) => {
                // 画像判定ロジック
                const lowerCat = (product.category || '').toLowerCase();
                const lowerName = (product.name || '').toLowerCase();
                
                let imgKey = 'nugget';
                if (lowerCat.includes('iv') || lowerName.includes('iv')) imgKey = 'iv';
                else if (lowerCat.includes('cv') || lowerName.includes('cv')) imgKey = 'cv';
                else if (lowerCat.includes('vvf') || lowerName.includes('vvf')) imgKey = 'vvf';
                else if (lowerCat.includes('mix') || lowerName.includes('mix')) imgKey = 'mixed';
                else if (lowerCat.includes('cabtire') || lowerName.includes('cabtire')) imgKey = 'cabtire';
                else if (lowerName.includes('pika') || lowerName.includes('ピカ')) imgKey = 'pika';

                const imgSrc = IMG_MAP[imgKey];
                const price = Math.floor((marketPrice * (product.ratio / 100) * 0.9) - 15);

                return (
                    <div key={`${product.id}-${idx}`} className="group relative bg-white border border-gray-200 hover:border-[#D32F2F] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl rounded-lg">
                        <div className="h-48 overflow-hidden relative bg-gray-100">
                            <img src={imgSrc} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition duration-700" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-gray-500 rounded">
                                {product.category || 'WIRE'}
                            </div>
                            {product.ratio > 70 && <div className="absolute top-4 right-4 bg-[#D32F2F] text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-md rounded">High Grade</div>}
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold font-serif text-[#111] group-hover:text-[#D32F2F] transition-colors line-clamp-1">{product.name}</h3>
                                <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded shrink-0 ml-2">{product.id}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4 h-4 overflow-hidden">{product.maker} {product.sq}sq {product.core}C</p>
                            
                            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Est. Price / kg</p><p className="text-3xl font-serif font-bold text-[#111]">¥{price.toLocaleString()}</p></div>
                                <div className="text-right"><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Yield</p><p className="text-lg font-mono font-bold text-gray-600">{Number(product.ratio).toFixed(1)}%</p></div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* --- CASTING LIST --- */}
            {activeTab === 'CASTING' && filteredCastings.map((product) => {
                const imgKey = product.type.toLowerCase().includes('brass') ? 'brass' : 'bronze';
                const imgSrc = IMG_MAP[imgKey] || IMG_MAP['nugget'];
                const rawPrice = (marketPrice * (product.ratio / 100));
                const price = Math.floor(rawPrice - (product.price_offset || 0));

                return (
                    <div key={product.id} className="group relative bg-white border border-gray-200 hover:border-[#D32F2F] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl rounded-lg">
                        <div className="h-48 overflow-hidden relative bg-gray-800">
                            <div className={`absolute inset-0 opacity-20 ${product.type==='Brass' ? 'bg-yellow-500' : 'bg-orange-700'}`}></div>
                            <img src={imgSrc} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" />
                            <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded">
                                {product.type} / {product.form}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold font-serif mb-2 text-[#111] group-hover:text-[#D32F2F] transition-colors">{product.name}</h3>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-4">
                                <div><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Market Link</p><p className="text-3xl font-serif font-bold text-[#111]">¥{price.toLocaleString()}</p></div>
                                <div className="text-right"><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Cu Rate</p><p className="text-lg font-mono font-bold text-gray-600">{product.ratio}%</p></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-dashed border-gray-200"><p className="text-xs text-gray-500 line-clamp-2">{product.description}</p></div>
                        </div>
                    </div>
                );
            })}
            
            {/* NO DATA FALLBACK */}
            {activeTab === 'WIRE' && filteredWires.length === 0 && (
                 <div className="col-span-full py-20 text-center text-gray-400 flex flex-col items-center">
                    <p className="text-lg font-serif mb-2">No Wires Found</p>
                    <p className="text-xs">条件に一致する電線が見つかりませんでした。</p>
                 </div>
            )}
            {activeTab === 'CASTING' && filteredCastings.length === 0 && (
                 <div className="col-span-full py-20 text-center text-gray-400 flex flex-col items-center">
                    <p className="text-lg font-serif mb-2">No Castings Data</p>
                    <p className="text-xs">鋳造・合金データが登録されていません。</p>
                 </div>
            )}

        </div>

        {/* LOAD MORE BUTTON */}
        {activeTab === 'WIRE' && visibleCount < filteredWires.length && (
            <div className="mt-12 text-center">
                <button 
                    onClick={() => setVisibleCount(prev => prev + 9)}
                    className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-gray-50 hover:text-black hover:border-black transition-all shadow-sm"
                >
                    LOAD MORE ({filteredWires.length - visibleCount})
                </button>
            </div>
        )}

        {/* DISCLAIMER */}
        <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400">
                ※ 表示価格はLME相場連動の参考価格です。実際の買取価格は、現物の状態（付着物、油、酸化等）および持込数量により変動します。<br/>
                ※ WN-800ナゲットプラントおよび自社溶解炉による一貫処理が可能なため、中間マージンは発生しません。
            </p>
        </div>

      </div>
    </section>
  );
};

// アイコン用の小さなコンポーネント
const Icons = {
    Search: ({className}:{className?:string}) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    )
};
