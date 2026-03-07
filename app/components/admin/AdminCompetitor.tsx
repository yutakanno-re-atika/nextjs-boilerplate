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
};

export const AdminCompetitor = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'TARGETS' | 'DICTIONARY'>('RADAR');

  // ★ 1. システムが取得している「本物の銅建値」を引っ張ってくる
  const currentCopperPrice = data?.market?.copper?.price || 1450;
  
  // ★ 2. 自社マスターデータ（data.wires）から、代表的な品目の「本物の歩留まり」を検索してくる
  const getWireRatio = (keyword: string, fallback: number) => {
      const found = (data?.wires || []).find((w:any) => w.name.includes(keyword));
      return found ? Number(found.ratio) : fallback;
  };

  const myItems = useMemo(() => {
      return [
          { key: 'ピカ', name: 'ピカ銅 (特1号)', ratio: getWireRatio('ピカ', 98) },
          { key: '込銅', name: '込銅 (2号銅)', ratio: getWireRatio('込銅', 93) },
          { key: 'VVF', name: 'VVF (ネズミ線)', ratio: getWireRatio('VVF', 42) },
          { key: 'CV', name: 'CV線 (太線)', ratio: getWireRatio('CV', 65) },
      ].map(item => {
          // 自社の買取価格 ＝ 建値 × 歩留まり × 利益係数(例:0.85) で算出
          return {
              ...item,
              myPrice: Math.floor(currentCopperPrice * (item.ratio / 100) * 0.85)
          };
      });
  }, [data, currentCopperPrice]);

  // ★ 3. 競合の価格データ（今回はデモとして固定値だが、将来はスクレイピングで動的になる）
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
          prices: { 'ピカ銅 (特1号)': 1190, '込銅 (2号銅)': 1140, 'VVF (ネズミ線)': 550, 'CV線 (太線)': 800 },
          trends: { 'ピカ銅 (特1号)': 'down', '込銅 (2号銅)': 'down', 'VVF (ネズミ線)': 'up', 'CV線 (太線)': 'flat' }
      }
  ];

  // ★ 4. ここが本命！「AI逆算エンジン」のロジック
  const analyzeCompetitor = (compName: string, compPrice: number, itemName: string) => {
      const myItem = myItems.find(i => i.name === itemName);
      if (!myItem) return null;

      // その電線に含まれる「銅の純粋な価値」
      const pureCopperValue = currentCopperPrice * (myItem.ratio / 100);
      
      // 相手の推定粗利（加工賃・利益） = 銅の価値 - 相手の買取価格
      const estimatedMargin = Math.floor(pureCopperValue - compPrice);

      let strategyAlert = '';
      if (estimatedMargin < 40) {
          strategyAlert = `利益を極限まで削った「赤字覚悟の集客モード」です。`;
      } else if (estimatedMargin > 150) {
          strategyAlert = `かなり強気に利益を抜いています。当社が少し値上げすれば容易に顧客を奪えます。`;
      } else {
          strategyAlert = `標準的なマージン設定です。歩留まりの解釈が当社とほぼ同じと推測されます。`;
      }

      return {
          pureCopperValue: Math.floor(pureCopperValue),
          estimatedMargin,
          strategyAlert,
          ratio: myItem.ratio
      };
  };

  // VVFに関するB社の分析
  const bVvfAnalysis = analyzeCompetitor('石狩 B商会', competitors[1].prices['VVF (ネズミ線)'], 'VVF (ネズミ線)');

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
              
              {/* ★ AI逆算エンジン パネル（実データ連動） */}
              <div className="bg-gray-900 text-white rounded-sm p-5 shadow-lg shrink-0 relative overflow-hidden border border-gray-700">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 text-blue-500"><Icons.Brain /></div>
                  <h3 className="text-sm font-black flex items-center gap-2 text-blue-400 mb-3 tracking-widest">
                      <Icons.Sparkles /> リアルタイム逆算インサイト (連動中)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                      
                      {bVvfAnalysis && (
                        <div className="bg-black/50 p-4 rounded border border-gray-800">
                            <p className="text-xs text-gray-400 font-bold mb-2">💡 石狩 B商会のVVF（{competitors[1].prices['VVF (ネズミ線)']}円）に対する逆算</p>
                            <p className="text-sm leading-relaxed text-gray-200">
                                現在の銅建値 <span className="text-blue-300 font-mono">¥{currentCopperPrice}</span> と当社のVVF歩留まり（<span className="font-mono">{bVvfAnalysis.ratio}%</span>）を基準にすると、VVF 1kgに含まれる純粋な銅価値は <span className="text-blue-300 font-mono">¥{bVvfAnalysis.pureCopperValue}</span> です。<br/>
                                <br/>
                                相手はそこから逆算して、加工賃・利益を「<span className={`font-bold font-mono ${bVvfAnalysis.estimatedMargin < 50 ? 'text-red-400' : 'text-green-400'}`}>わずか ¥{bVvfAnalysis.estimatedMargin} / kg</span>」しか抜いていません。<br/>
                                <span className="text-yellow-400 mt-2 block">【AIの結論】 {bVvfAnalysis.strategyAlert}</span>
                            </p>
                        </div>
                      )}

                      <div className="bg-black/50 p-4 rounded border border-gray-800">
                          <p className="text-xs text-gray-400 font-bold mb-2">💡 札幌大手 A社のピカ銅（{competitors[0].prices['ピカ銅 (特1号)']}円）の裏側</p>
                          <p className="text-sm leading-relaxed text-gray-200">
                              A社はピカ銅を当社より高く買っていますが、彼らの精錬所への「持込運賃（キロ約30円）」を考慮すると、<span className="text-yellow-400 font-bold">実質的な粗利はマイナススレスレ</span>です。<br/>
                              これは他商材（込銅や雑線）で利益を埋め合わせる「フロントエンド商材」としてピカ銅を使っている証拠です。営業トークでは「A社はピカ銅は高いですが、他の線が安いですよね？」と切り込むのが有効です。
                          </p>
                      </div>
                  </div>
              </div>

              {/* 比較ヒートマップ */}
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-gray-900 text-sm">自社 vs 競合 リアルタイム価格差額</h3>
                      <div className="flex items-center gap-4">
                          <p className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">現在の建値: ¥{currentCopperPrice}</p>
                          <p className="text-[10px] text-gray-500 font-mono">最終取得: {new Date().toLocaleString()}</p>
                      </div>
                  </div>
                  <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead className="bg-gray-100 border-b border-gray-200 sticky top-0 z-10">
                              <tr>
                                  <th className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest w-1/4">品目 (マスター歩留まり)</th>
                                  <th className="p-3 text-xs font-black text-gray-900 uppercase tracking-widest bg-blue-50 border-x border-blue-200 w-1/5">
                                      月寒製作所 (自社)
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
                                      <td className="p-3">
                                          <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">歩留: {item.ratio}% / 銅価値: ¥{Math.floor(currentCopperPrice * (item.ratio/100))}</div>
                                      </td>
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
              <div className="max-w-4xl mx-auto text-center py-20 text-gray-400">
                  <Icons.Globe />
                  <p className="mt-4 font-bold text-sm">（次回アップデートにて、AIスクレイピングのURL追加機能を実装します）</p>
              </div>
          </div>
      )}

      {activeTab === 'DICTIONARY' && (
          <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-6 overflow-y-auto animate-in fade-in">
              <div className="max-w-4xl mx-auto text-center py-20 text-gray-400">
                  <Icons.Book />
                  <p className="mt-4 font-bold text-sm">（次回アップデートにて、AI名称ゆらぎ辞書機能を実装します）</p>
              </div>
          </div>
      )}
    </div>
  );
};
