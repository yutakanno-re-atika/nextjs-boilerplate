"use client";
import React, { useState, useMemo } from 'react';
import { MarketData } from '../../types';

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

export const PriceList = ({ data, marketPrice }: { data: MarketData | null, marketPrice: number }) => {
  const [activeTab, setActiveTab] = useState<'WIRE' | 'CASTING'>('WIRE');

  // 1. 電線：名前に「ミックス」か「MIX」が含まれるものだけ (ボスの指示通り)
  const displayWires = useMemo(() => {
    if (!data?.wires) return [];
    return data.wires.filter(w => 
      w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')
    );
  }, [data?.wires]);

  // 2. 鋳造：【修正】フィルターを全解除して、あるものを全て出す
  const displayCastings = useMemo(() => {
    if (!data?.castings) return [];
    return data.castings; // フィルターなしで全件返す
  }, [data?.castings]);

  // データロード中
  if (!data) return <div className="py-20 text-center text-gray-400 animate-pulse">Loading Data...</div>;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <Icons.TrendingUp /> データ確認モード
            </span>
            <span className="text-gray-500 text-sm">LME銅建値: ¥{marketPrice.toLocaleString()}/kg</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900">買取単価一覧</h2>
        </div>

        {/* タブ */}
        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveTab('WIRE')} className={`px-6 py-3 rounded-full font-bold ${activeTab === 'WIRE' ? 'bg-[#D32F2F] text-white' : 'bg-white text-gray-600 border'}`}>電線 (ミックスのみ)</button>
          <button onClick={() => setActiveTab('CASTING')} className={`px-6 py-3 rounded-full font-bold ${activeTab === 'CASTING' ? 'bg-[#D32F2F] text-white' : 'bg-white text-gray-600 border'}`}>鋳造・その他 (全件表示)</button>
        </div>

        {/* リスト表示エリア */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* --- 電線リスト --- */}
          {activeTab === 'WIRE' && displayWires.map((item, idx) => {
            const price = Math.floor((marketPrice * (item.ratio / 100) * 0.9) - 15);
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.maker}</p>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/ kg</span>
                </div>
              </div>
            );
          })}

          {/* --- 鋳造リスト --- */}
          {activeTab === 'CASTING' && displayCastings.map((item, idx) => {
            // 計算: (建値 * 歩留まり) - 加工費
            const rawPrice = (marketPrice * (item.ratio / 100));
            const price = Math.floor(rawPrice - (item.price_offset || 0));
            
            return (
              <div key={idx} className="bg-white rounded-xl shadow-sm border p-6 border-l-4 border-l-orange-400">
                <div className="flex justify-between">
                   <h3 className="font-bold text-lg">{item.name}</h3>
                   {/* typeが何になっているか画面に表示して確認 */}
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded h-fit">{item.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{item.description}</p>
                <div className="flex items-end gap-2 mt-4">
                  <span className="text-3xl font-black text-[#D32F2F]">¥{price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">/ kg</span>
                </div>
                <p className="text-[10px] text-gray-300 mt-2">ID: {item.id} / Ratio: {item.ratio}%</p>
              </div>
            );
          })}
        </div>

        {/* --- デバッグ情報エリア (データが出ない時にここを見る) --- */}
        {activeTab === 'CASTING' && displayCastings.length === 0 && (
            <div className="mt-10 p-6 bg-gray-800 text-white rounded-xl font-mono text-xs overflow-x-auto">
                <h3 className="text-lg font-bold text-red-400 mb-4">⚠️ データが0件です。受信データの中身確認:</h3>
                <p className="mb-2">APIから受け取った生データ(data.castings):</p>
                {/* ここに受信した生データを強制出力 */}
                <pre>{JSON.stringify(data?.castings, null, 2)}</pre>
                
                <div className="mt-4 border-t border-gray-600 pt-4">
                    <p className="font-bold text-yellow-400">チェックポイント:</p>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>ここが <code>[]</code> (空) の場合: Googleスプレッドシートの「Products_Casting」シートにデータが入っていません。</li>
                        <li>ここが <code>null</code> の場合: GASのプログラムがエラーを起こしています。</li>
                        <li>データが表示されているのに上のカードが出ない場合: <code>type</code> のスペルが一致していません。</li>
                    </ul>
                </div>
            </div>
        )}

      </div>
    </section>
  );
};
