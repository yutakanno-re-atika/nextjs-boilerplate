// app/components/features/PriceList.tsx
// @ts-nocheck
import React, { useState } from 'react';

const CATEGORIES = ['すべて', 'IV線', 'CV・電力線', 'VVF / VV (ネズミ線)', '制御・通信線', 'キャブタイヤ・雑線', 'その他'];

export const PriceList = ({ data, marketPrice }: { data: any, marketPrice: number }) => {
  const [activeCat, setActiveCat] = useState('すべて');

  const validWires = (data?.wires || []).filter((w: any) => String(w.showOnWeb) !== 'false');

  const getCategory = (name: string) => {
    if (!name) return 'その他';
    const n = name.toUpperCase();
    if (n.includes('VVF') || n.includes('VA') || n.includes('EEF/F') || (n.includes('VV') && !n.includes('CVV'))) return 'VVF / VV (ネズミ線)';
    if (n.includes('IV') || n.includes('IE/F')) return 'IV線';
    if (n.includes('CVT') || (n.includes('CV') && !n.includes('CVV')) || n.includes('CE/F') || n.includes('EM')) return 'CV・電力線';
    if (n.includes('CVV') || n.includes('AE') || n.includes('通信') || n.includes('LAN') || n.includes('弱電') || n.includes('光')) return '制御・通信線';
    if (n.includes('VCT') || n.includes('雑線') || n.includes('家電') || n.includes('ハーネス')) return 'キャブタイヤ・雑線';
    return 'その他';
  };

  const filteredWires = validWires.filter((w: any) => activeCat === 'すべて' || getCategory(w.name) === activeCat);

  // ★ 建値指標のON/OFFフラグとデータ
  const showMarketRates = String(data?.config?.show_market_rates) !== 'false';
  const market = data?.market || {};

  return (
    <section id="price-list" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-10 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <h2 className="text-3xl md:text-5xl font-black font-serif tracking-tight text-gray-900 mb-4">
            本日の買取価格
          </h2>
          <p className="text-gray-500 font-bold">国内建値とリアルタイム連動。透明性の高い価格を提示します。</p>
        </div>

        {/* ★ 各種建値（指標）パネルの表示 */}
        {showMarketRates && market && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10 animate-in fade-in slide-in-from-bottom-5">
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">銅建値 (JX)</p>
                  <p className="text-2xl font-black text-[#D32F2F] font-mono">¥{market.copper?.price?.toLocaleString() || '---'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">黄銅建値</p>
                  <p className="text-2xl font-black text-gray-800 font-mono">¥{market.brass?.price?.toLocaleString() || '---'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">亜鉛建値</p>
                  <p className="text-2xl font-black text-gray-800 font-mono">¥{market.zinc?.price?.toLocaleString() || '---'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center shadow-sm">
                  <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">鉛建値</p>
                  <p className="text-2xl font-black text-gray-800 font-mono">¥{market.lead?.price?.toLocaleString() || '---'}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center shadow-sm col-span-2 md:col-span-1">
                  <p className="text-[10px] font-bold text-gray-500 mb-1 tracking-widest">錫建値</p>
                  <p className="text-2xl font-black text-gray-800 font-mono">¥{market.tin?.price?.toLocaleString() || '---'}</p>
              </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => {
            const count = validWires.filter((w: any) => cat === 'すべて' || getCategory(w.name) === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                  activeCat === cat
                    ? 'bg-[#D32F2F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat} <span className="opacity-70 ml-1 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="p-4 text-sm font-bold tracking-widest">品名・構成</th>
                <th className="p-4 text-sm font-bold tracking-widest text-center">材質</th>
                <th className="p-4 text-sm font-bold tracking-widest text-right">参考歩留まり</th>
                <th className="p-4 text-sm font-bold tracking-widest text-right">本日の買取単価 (税込)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-gray-900">
              {filteredWires.map((w: any) => {
                const price = Math.floor(marketPrice * (w.ratio / 100) * 0.85); 
                const isTin = w.material === '錫メッキ' || w.name?.includes('錫');

                return (
                  <tr key={w.id} className="hover:bg-red-50/30 transition group">
                    <td className="p-4">
                      <div className="font-bold text-base flex items-center gap-2">
                        {w.maker && w.maker !== '-' && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{w.maker}</span>}
                        {w.name}
                        {isTin && <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-sm">⚠️錫</span>}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {w.sq !== '-' && `${w.sq}sq`} {w.core !== '-' && `/ ${w.core}C`} {w.conductor && `(${w.conductor})`}
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-600">{w.material}</td>
                    <td className="p-4 text-right font-mono font-bold text-gray-500">{w.ratio}%</td>
                    <td className="p-4 text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-sm font-bold text-gray-400">¥</span>
                        <span className="text-2xl font-black text-[#D32F2F] tracking-tighter">{price.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-gray-400">/kg</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredWires.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-400 font-bold">
                    該当する商材がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
