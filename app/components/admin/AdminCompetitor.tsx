// app/components/admin/AdminCompetitor.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Radar: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Sparkles: () => <svg className="w-5 h-5 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  TrendingUp: () => <svg className="w-4 h-4 inline-block text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-4 h-4 inline-block text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Globe: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Book: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  AlertTriangle: () => <svg className="w-4 h-4 inline-block text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'TARGETS' | 'DICTIONARY'>('RADAR');

  // ★ 将来的にGASから取得するデータのモック（ビジョン共有用）
  const copperPrice = data?.market?.copper?.price || 1450;
  
  // 自社データ
  const myItems = [
      { name: 'ピカ銅 (特1号)', ratio: 98, myPrice: Math.floor(copperPrice * 0.98 * 0.85) },
      { name: '込銅 (2号銅)', ratio: 93, myPrice: Math.floor(copperPrice * 0.93 * 0.85) },
      { name: 'VVF (ネズミ線)', ratio: 42, myPrice: Math.floor(copperPrice * 0.42 * 0.85) },
      { name: 'CV線 (太線)', ratio: 65, myPrice: Math.floor(copperPrice * 0.65 * 0.85) },
  ];

  // 競合データ
  const competitors = [
      { 
          name: '札幌大手 A社', 
          type: 'メーカー直系',
          prices: { 'ピカ銅 (特1号)': 1210, '込銅 (2号銅)': 1150, 'VVF (ネズミ線)': 520, 'CV線 (太線)': 810 },
          trends: { 'ピカ銅 (特1号)': 'up', '込銅 (2号銅)': 'flat', 'VVF (ネズミ線)': 'down', 'CV線 (太線)': 'up' }
      },
      { 
          name: '石狩 B商会', 
          type: '輸出ヤード',
          prices: { 'ピカ銅 (特1号)': 1190, '込銅 (2号銅)': 1140, 'VVF (ネズミ線)': 540, 'CV線 (太線)': 800 },
          trends: { 'ピカ銅 (特1号)': 'down', '込銅 (2号銅)': 'down', 'VVF (ネズミ線)': 'up', 'CV線 (太線)': 'flat' }
      },
      { 
          name: 'ネット業者 C', 
          type: '宅配買取',
          prices: { 'ピカ銅 (特1号)': 1250, '込銅 (2号銅)': 1180, 'VVF (ネズミ線)': 500, 'CV線 (太線)': 780 },
          trends: { 'ピカ銅 (特1号)': 'up', '込銅 (2号銅)': 'up', 'VVF (ネズミ線)': 'down', 'CV線 (太線)': 'down' }
      }
  ];

  const getDiffLabel = (my: number, comp: number) => {
      const diff = my - comp;
      if (diff > 0) return <span className="text-blue-600 font-bold">+{diff} (勝)</span>;
      if (diff < 0) return <span className="text-red-600 font-bold">{diff} (負)</span>;
      return <span className="text-gray-400 font-bold">同額</span>;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight flex items-center gap-2">
            <Icons.Radar /> COMPETITOR RADAR
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">競合相場スクレイピング / AI戦略逆算エンジン</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto">
            <button onClick={() => setActiveTab('RADAR')} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'RADAR' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              📊 比較ヒートマップ
            </button>
            <button onClick={() => setActiveTab('TARGETS')} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'TARGETS' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Globe /> 監視サイト登録
            </button>
            <button onClick={() => setActiveTab('DICTIONARY')} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === 'DICTIONARY' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icons.Book /> 呼称・シノニム辞書
            </button>
        </div>
      </header>

      {activeTab === 'RADAR' && (
          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              
              {/* AI逆算エンジン パネル */}
              <div className="bg-gray-900 text-white rounded-sm p-5 shadow-lg shrink-0 relative overflow-hidden border border-gray-700">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 text-blue-500"><Icons.Brain /></div>
                  <h3 className="text-sm font-black flex items-center gap-2 text-blue-400 mb-3 tracking-widest">
                      <Icons.Sparkles /> AI戦略逆算インサイト (PROTOTYPE)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      <div className="bg-black/50 p-4 rounded border border-gray-800">
                          <p className="text-xs text-gray-400 font-bold mb-2">💡 石狩 B商会のVVF（540円）に対する逆算</p>
                          <p className="text-sm leading-relaxed text-gray-200">
                              現在の銅建値(1,450円)に対し、B社はVVFを非常に高値で集めています。<br/>
                              AIの推測: 相手は歩留まりを「約43%」で計算し、加工賃・利益を「わずか40円/kg」に設定している<span className="text-red-400 font-bold">赤字覚悟の集客モード</span>です。当社は価格競争を避け、B社が手薄な「ピカ銅」の集荷に注力すべきです。
                          </p>
                      </div>
                      <div className="bg-black/50 p-4 rounded border border-gray-800">
                          <p className="text-xs text-gray-400 font-bold mb-2">💡 ネット業者 Cのピカ銅（1,250円）に対する逆算</p>
                          <p className="text-sm leading-relaxed text-gray-200">
                              C社はピカ銅を当社より約40円高く買っていますが、<span className="text-yellow-400 font-bold">「持込（送料客負担）」の条件が隠れています</span>。<br/>
                              苫小牧近郊の顧客がC社に送る場合、キロ約30円の運賃がかかるため、当社の「持込価格」のほうが実質的な手取りは上回ります。営業トークでこの点を強調してください。
                          </p>
                      </div>
                  </div>
              </div>

              {/* 比較ヒートマップ */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-gray-900 text-sm">自社 vs 競合 リアルタイム価格差額</h3>
                      <p className="text-[10px] text-gray-500 font-mono">最終取得: {new Date().toLocaleString()}</p>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                              <tr>
                                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/5">品目</th>
                                  <th className="p-3 text-xs font-black text-gray-900 uppercase tracking-widest bg-blue-50 border-x border-blue-200 w-1/5">
                                      月寒製作所 (自社)<br/><span className="text-[9px] text-blue-600 font-normal">ベース建値: ¥{copperPrice}</span>
                                  </th>
                                  {competitors.map(comp => (
                                      <th key={comp.name} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/5">
                                          {comp.name}<br/><span className="text-[9px] text-gray-400 font-normal">{comp.type}</span>
                                      </th>
                                  ))}
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {myItems.map(item => (
                                  <tr key={item.name} className="hover:bg-gray-50 transition">
                                      <td className="p-3 font-bold text-gray-800 text-sm">{item.name}</td>
                                      <td className="p-3 bg-blue-50/30 border-x border-blue-100 font-mono font-black text-lg text-gray-900">
                                          ¥{item.myPrice.toLocaleString()}
                                      </td>
                                      {competitors.map(comp => {
                                          const compPrice = comp.prices[item.name as keyof typeof comp.prices];
                                          const trend = comp.trends[item.name as keyof typeof comp.trends];
                                          return (
                                              <td key={comp.name} className="p-3">
                                                  <div className="flex flex-col">
                                                      <div className="flex items-center gap-2">
                                                          <span className="font-mono text-base text-gray-700">¥{compPrice.toLocaleString()}</span>
                                                          {trend === 'up' ? <Icons.TrendingUp /> : trend === 'down' ? <Icons.TrendingDown /> : <Icons.Minus />}
                                                      </div>
                                                      <div className="text-xs mt-1 bg-white inline-block w-max px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">
                                                          {getDiffLabel(item.myPrice, compPrice)}
                                                      </div>
                                                  </div>
                                              </td>
                                          );
                                      })}
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'TARGETS' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <div>
                          <h3 className="text-lg font-black text-gray-900">AI監視ターゲット設定</h3>
                          <p className="text-xs text-gray-500 mt-1">ここで設定したURLを夜間にAIスナイパーが自動巡回し、価格を引っこ抜きます。</p>
                      </div>
                      <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-sm text-sm font-bold shadow-sm flex items-center gap-1 transition">
                          <Icons.Plus /> 監視サイトを追加
                      </button>
                  </div>

                  <div className="space-y-4">
                      <div className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row md:items-center gap-4 bg-gray-50">
                          <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base">札幌大手 A社</h4>
                              <p className="text-xs text-blue-600 font-mono mt-1 hover:underline cursor-pointer">https://example-a.com/price/</p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                  <p className="text-[10px] text-gray-500 font-bold">最終クロール</p>
                                  <p className="text-xs font-mono text-gray-900">今日 03:00 <span className="text-green-500 ml-1">● 成功</span></p>
                              </div>
                              <button className="text-gray-400 hover:text-blue-600 p-2 bg-white rounded shadow-sm border border-gray-200 transition"><Icons.Radar /></button>
                          </div>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 flex flex-col md:flex-row md:items-center gap-4 bg-gray-50">
                          <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-base">石狩 B商会</h4>
                              <p className="text-xs text-blue-600 font-mono mt-1 hover:underline cursor-pointer">https://example-b.com/kaitori/</p>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                              <div className="text-right">
                                  <p className="text-[10px] text-gray-500 font-bold">最終クロール</p>
                                  <p className="text-xs font-mono text-gray-900">昨日 23:45 <span className="text-yellow-500 ml-1">▲ 構造変更あり(AI補正済)</span></p>
                              </div>
                              <button className="text-gray-400 hover:text-blue-600 p-2 bg-white rounded shadow-sm border border-gray-200 transition"><Icons.Radar /></button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'DICTIONARY' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <div>
                          <h3 className="text-lg font-black text-gray-900">名称ゆらぎ・シノニム辞書</h3>
                          <p className="text-xs text-gray-500 mt-1">AIが他社サイトを巡回する際、「この単語は当社のこの品目のことだ」と翻訳するための辞書です。このデータ自体がSEOや営業の強力な資産になります。</p>
                      </div>
                  </div>

                  <div className="space-y-6">
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-500"></span> ピカ銅 (当社のマスター名)</h4>
                              <button className="text-[10px] text-blue-600 font-bold hover:underline">+ 呼称を追加</button>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2">
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">1号銅線</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">光線</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">特号銅</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">ピカ線</span>
                              <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm flex items-center gap-1"><Icons.Sparkles /> 光銅 (AIが自動学習)</span>
                          </div>
                      </div>

                      <div className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
                              <h4 className="font-black text-gray-900 text-sm flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-500"></span> VVFケーブル (当社のマスター名)</h4>
                              <button className="text-[10px] text-blue-600 font-bold hover:underline">+ 呼称を追加</button>
                          </div>
                          <div className="p-4 flex flex-wrap gap-2">
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">VA線</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">Fケーブル</span>
                              <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm">ネズミ線</span>
                              <span className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm flex items-center gap-1"><Icons.Sparkles /> 雑線VVF (AIが自動学習)</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
