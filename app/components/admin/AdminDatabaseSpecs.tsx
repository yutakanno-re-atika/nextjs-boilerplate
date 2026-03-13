// app/components/admin/AdminDatabaseSpecs.tsx
import React, { useState, useEffect, useMemo } from 'react';

const Icons = {
  Search: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Book: () => <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  SortAsc: () => <svg className="w-3 h-3 inline-block ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>,
  SortDesc: () => <svg className="w-3 h-3 inline-block ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>,
  SortNone: () => <svg className="w-3 h-3 inline-block ml-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>,
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Refresh: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
};

// 対象ファイル名と、それに紐づく公式メーカー名
const MAKER_MAP: Record<string, string> = {
  yazaki: '矢崎エナジーシステム',
  fujikura: 'フジクラ・ダイヤケーブル',
  sumitomo: '住友電工',
  furukawa: '古河電工',
  swcc: 'SWCC',
  proterial: 'プロテリアル',
  fuji: '富士電線工業',
  yasaka: '弥栄電線',
  kawai: 'カワイ電線',
  suganami: '菅波電線'
};
const MAKER_FILES = Object.keys(MAKER_MAP);
const ITEMS_PER_PAGE = 100;

// ★ あいまい検索用の正規化関数
const normalizeText = (text: string) => {
  if (!text) return '';
  return String(text)
    .normalize('NFKC') // 全角英数→半角、半角カナ→全角に統一
    .toLowerCase()     // 大文字→小文字
    .replace(/[\s　]+/g, ' ') // 全角・半角スペースを統一
    .trim();
};

export const AdminDatabaseSpecs = () => {
  const [specs, setSpecs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // フィルター用の状態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMakers, setSelectedMakers] = useState<string[]>([]);
  const [selectedCores, setSelectedCores] = useState<string[]>([]);
  const [selectedConductors, setSelectedConductors] = useState<string[]>([]);
  const [sqRange, setSqRange] = useState({ min: '', max: '' });
  const [ratioRange, setRatioRange] = useState({ min: '', max: '' });
  
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. データの読み込みと自動クレンジング
  useEffect(() => {
    const fetchAllSpecs = async () => {
      setIsLoading(true);
      let allData: any[] = [];

      const fetchPromises = MAKER_FILES.map(makerKey => 
        fetch(`/specs/${makerKey}.json`).then(res => {
          if (!res.ok) throw new Error('Not found');
          return { key: makerKey, data: res.json() };
        })
      );

      const results = await Promise.allSettled(fetchPromises);
      
      for (const result of results) {
        if (result.status === 'fulfilled') {
          const { key, data } = result.value;
          const jsonData = await data;
          
          if (Array.isArray(jsonData)) {
            const defaultMakerName = MAKER_MAP[key] || key;

            // ★ データの強力なクレンジング
            const cleanedData = jsonData.map(spec => {
              let mName = String(spec.maker || '');
              let cName = String(spec.name || '');
              
              // ① メーカー名の浄化
              if (!mName || mName === '-' || mName.trim() === '') {
                mName = defaultMakerName;
              } else if (mName.includes('矢崎') || mName.toLowerCase().includes('yazaki')) {
                mName = '矢崎エナジーシステム';
              } else if (mName.includes('フジクラ') || mName.toLowerCase().includes('fujikura') || mName.includes('ダイヤケーブル')) {
                mName = 'フジクラ・ダイヤケーブル';
              } else if (mName.includes('富士電線') || mName.toUpperCase().includes('FUJI ELECTRIC')) {
                mName = '富士電線工業';
              }

              // ② 品名の浄化（長すぎる英語や特殊文字のカット）
              if (cName.includes('Class2 Natural Rubber') || cName.includes('2CT Class2')) {
                cName = '2種天然ゴム絶縁キャブタイヤケーブル (2CT)';
              } else if (cName.includes('200Type') || cName.includes('200タイプ')) {
                cName = cName.replace(/200Type|200タイプ/g, '200V用').trim();
              }
              // ③ アース付きセパレート線などを強引に「メインの線」だけの名前にする
              if (cName.includes('+') || cName.toLowerCase().includes('separate')) {
                cName = cName.split('+')[0].replace(/Separate type/i, '').trim();
              }

              return { ...spec, maker: mName, name: cName };
            });

            allData = allData.concat(cleanedData);
          }
        }
      }

      setSpecs(allData);
      setIsLoading(false);
    };

    fetchAllSpecs();
  }, []);

  const availableMakers = useMemo(() => Array.from(new Set(specs.map(s => s.maker).filter(Boolean))).sort(), [specs]);

  // 2. フィルタリングとソート
  const filteredAndSortedSpecs = useMemo(() => {
    let result = specs.filter(spec => {
      
      // あいまいキーワード検索
      if (searchTerm) {
        const normalizedSearch = normalizeText(searchTerm);
        const terms = normalizedSearch.split(' ').filter(Boolean);
        const target = normalizeText(`${spec.maker} ${spec.name} ${spec.size}sq ${spec.size}mm ${spec.core}c ${spec.core}芯 ${spec.conductor}`);
        if (!terms.every(term => target.includes(term))) return false;
      }

      if (selectedMakers.length > 0 && !selectedMakers.includes(spec.maker)) return false;

      if (selectedCores.length > 0) {
        const coreVal = parseInt(spec.core);
        const coreMatch = selectedCores.some(c => {
          if (c === '5+') return coreVal >= 5;
          return parseInt(c) === coreVal;
        });
        if (!coreMatch) return false;
      }

      if (selectedConductors.length > 0) {
        const cText = String(spec.conductor || '');
        const strands = parseInt(spec.conductorStrands);
        const isSolid = cText.includes('単線') || strands === 1;
        const wireType = isSolid ? '単線' : 'より線';
        if (!selectedConductors.includes(wireType)) return false;
      }

      const sq = parseFloat(spec.size);
      if (!isNaN(sq)) {
        if (sqRange.min && sq < parseFloat(sqRange.min)) return false;
        if (sqRange.max && sq > parseFloat(sqRange.max)) return false;
      }

      const ratio = parseFloat(spec.theoreticalRatio);
      if (!isNaN(ratio)) {
        if (ratioRange.min && ratio < parseFloat(ratioRange.min)) return false;
        if (ratioRange.max && ratio > parseFloat(ratioRange.max)) return false;
      }

      return true;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          aVal = aNum; bVal = bNum;
        } else {
          aVal = String(aVal || ''); bVal = String(bVal || '');
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [specs, searchTerm, selectedMakers, selectedCores, selectedConductors, sqRange, ratioRange, sortConfig]);

  const paginatedSpecs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedSpecs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedSpecs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedSpecs.length / ITEMS_PER_PAGE);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <Icons.SortNone />;
    return sortConfig.direction === 'asc' ? <Icons.SortAsc /> : <Icons.SortDesc />;
  };

  const clearFilters = () => {
    setSearchTerm(''); setSelectedMakers([]); setSelectedCores([]); setSelectedConductors([]);
    setSqRange({ min: '', max: '' }); setRatioRange({ min: '', max: '' });
    setCurrentPage(1);
  };

  const toggleSelection = (state: string[], setState: any, value: string) => {
    if (state.includes(value)) setState(state.filter(item => item !== value));
    else setState([...state, value]);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-white animate-in fade-in duration-500 overflow-hidden">
      
      {/* 🟢 左側：検索・フィルターパネル */}
      <div className="w-full md:w-72 bg-gray-50 border-r border-gray-200 shrink-0 flex flex-col h-full overflow-y-auto">
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="font-black flex items-center gap-2"><Icons.Filter /> 絞り込み検索</div>
          <button onClick={clearFilters} className="text-xs text-gray-300 hover:text-white flex items-center gap-1 font-bold bg-gray-800 px-2 py-1 rounded transition">
            <Icons.Refresh /> クリア
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* キーワード */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">キーワード</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
              <input
                type="text" placeholder="例: ＣＶ 22sq..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded bg-white text-sm focus:border-blue-500 outline-none shadow-inner"
                value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-1.5">※全角/半角、大文字/小文字を自動で吸収します</p>
          </div>

          {/* 歩留まりレンジ */}
          <div className="bg-white p-3 rounded border border-gray-200 shadow-sm">
            <label className="block text-xs font-bold text-gray-700 mb-2 text-blue-800">理論歩留まり (%)</label>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded p-1.5 text-sm text-center outline-none focus:border-blue-500" value={ratioRange.min} onChange={e => { setRatioRange({...ratioRange, min: e.target.value}); setCurrentPage(1); }} />
              <span className="text-gray-400 font-bold">〜</span>
              <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded p-1.5 text-sm text-center outline-none focus:border-blue-500" value={ratioRange.max} onChange={e => { setRatioRange({...ratioRange, max: e.target.value}); setCurrentPage(1); }} />
            </div>
          </div>

          {/* 導体構成 (単線/より線) ボタン */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">導体構成</label>
            <div className="flex flex-wrap gap-1.5">
              {['単線', 'より線'].map(c => (
                <button
                  key={c} onClick={() => toggleSelection(selectedConductors, setSelectedConductors, c)}
                  className={`px-4 py-2 rounded text-xs font-bold transition border shadow-sm ${selectedConductors.includes(c) ? 'bg-gray-900 text-white border-gray-900 shadow-inner' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 芯数ボタン */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">芯数 (Core)</label>
            <div className="flex flex-wrap gap-1.5">
              {['1', '2', '3', '4', '5+'].map(c => (
                <button
                  key={c} onClick={() => toggleSelection(selectedCores, setSelectedCores, c)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition border ${selectedCores.includes(c) ? 'bg-gray-900 text-white border-gray-900 shadow-inner' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                >
                  {c === '5+' ? '5芯以上' : `${c}C`}
                </button>
              ))}
            </div>
          </div>

          {/* サイズ(SQ)レンジ */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">サイズ (SQ/mm)</label>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full border border-gray-300 rounded p-1.5 text-sm text-center outline-none focus:border-gray-900 shadow-inner" value={sqRange.min} onChange={e => { setSqRange({...sqRange, min: e.target.value}); setCurrentPage(1); }} />
              <span className="text-gray-400 font-bold">〜</span>
              <input type="number" placeholder="Max" className="w-full border border-gray-300 rounded p-1.5 text-sm text-center outline-none focus:border-gray-900 shadow-inner" value={sqRange.max} onChange={e => { setSqRange({...sqRange, max: e.target.value}); setCurrentPage(1); }} />
            </div>
          </div>

          {/* メーカー */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">メーカー</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 bg-white p-2 rounded border border-gray-200">
              {availableMakers.map(maker => (
                <label key={maker} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    checked={selectedMakers.includes(maker)}
                    onChange={() => toggleSelection(selectedMakers, setSelectedMakers, maker)}
                  />
                  <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900 truncate">{maker}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 右側：結果一覧テーブル */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <div className="p-3 bg-white border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-3 shadow-sm z-10 shrink-0">
          <div className="text-sm">
            <span className="font-bold text-gray-500">該当件数: </span>
            <span className="text-2xl font-black text-blue-800 font-mono tracking-tighter">{filteredAndSortedSpecs.length}</span>
            <span className="text-gray-500 font-bold ml-1">件</span>
            <span className="text-[10px] text-gray-400 ml-2 font-mono">/ 全 {specs.length} 件</span>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2 font-mono text-sm bg-gray-50 rounded border border-gray-200 p-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30 transition"
              ><Icons.ChevronLeft /></button>
              <span className="px-2 font-bold text-gray-700">{currentPage} <span className="text-gray-400 text-xs">/ {totalPages}</span></span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30 transition"
              ><Icons.ChevronRight /></button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto bg-gray-100">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-400 font-bold gap-3">
               <div className="animate-spin text-blue-600"><Icons.Refresh /></div>
               <p>複数のメーカーカタログを統合・クレンジング中...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm whitespace-nowrap bg-white">
              <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-[10px] md:text-xs sticky top-0 shadow-sm border-b border-gray-300 z-10">
                <tr>
                  <th className="p-2 md:p-3 cursor-pointer hover:bg-gray-200 transition font-bold" onClick={() => handleSort('maker')}>メーカー <SortIcon columnKey="maker" /></th>
                  <th className="p-2 md:p-3 cursor-pointer hover:bg-gray-200 transition font-bold" onClick={() => handleSort('name')}>品名 <SortIcon columnKey="name" /></th>
                  <th className="p-2 md:p-3 cursor-pointer hover:bg-gray-200 transition font-bold" onClick={() => handleSort('size')}>SQ / 芯数 <SortIcon columnKey="size" /></th>
                  <th className="p-2 md:p-3 cursor-pointer hover:bg-gray-200 transition font-bold" onClick={() => handleSort('conductor')}>導体構成 <SortIcon columnKey="conductor" /></th>
                  <th className="p-2 md:p-3 cursor-pointer hover:bg-gray-200 transition font-bold text-right" onClick={() => handleSort('outerDiameter')}>外径/質量 <SortIcon columnKey="outerDiameter" /></th>
                  <th className="p-2 md:p-3 cursor-pointer hover:bg-blue-50 transition font-black text-blue-800 text-right bg-blue-50/30" onClick={() => handleSort('theoreticalRatio')}>理論歩留 <SortIcon columnKey="theoreticalRatio" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs md:text-sm">
                {paginatedSpecs.map((spec, index) => {
                  const isSolid = spec.conductor && (spec.conductor.includes('単線') || parseInt(spec.conductorStrands) === 1);
                  
                  return (
                    <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="p-2 md:p-3 text-[9px] md:text-xs text-gray-500 font-bold truncate max-w-[100px]" title={spec.maker}>{spec.maker}</td>
                      <td className="p-2 md:p-3 font-black text-gray-900">{spec.name}</td>
                      <td className="p-2 md:p-3 font-mono font-bold text-gray-700">
                        {spec.size !== '-' ? <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{spec.size}sq</span> : '-'} 
                        <span className="mx-1 text-gray-300">/</span> 
                        {spec.core !== '-' ? <span className="font-black">{spec.core}C</span> : '-'}
                      </td>
                      <td className="p-2 md:p-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            {isSolid ? (
                              <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-orange-200">単線</span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">より線</span>
                            )}
                            {spec.conductorStrands !== '-' && spec.conductorStrands && (
                               <span className="font-black text-gray-900 text-sm md:text-base">{spec.conductorStrands}本</span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <span className="truncate">{spec.conductor}</span>
                            {spec.conductorStrandDia !== '-' && <span className="bg-gray-100 px-1 rounded">素線: {spec.conductorStrandDia}mm</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-2 md:p-3 text-right">
                        <div className="flex flex-col items-end gap-1 font-mono text-xs md:text-sm">
                          <div>
                            <span className="text-[10px] text-gray-500 font-bold mr-1">外径:</span>
                            <span className="font-black text-gray-900">{spec.outerDiameter}</span>
                            <span className="text-[9px] text-gray-400 font-normal ml-0.5">mm</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-500 font-bold mr-1">質量:</span>
                            <span className="font-bold text-gray-800">{spec.weightPerKm}</span>
                            <span className="text-[9px] text-gray-400 font-normal ml-0.5">kg</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 md:p-3 text-right bg-blue-50/10 group-hover:bg-transparent transition-colors">
                        <span className="font-mono font-black text-blue-700 text-base md:text-xl tracking-tighter">
                          {spec.theoreticalRatio ? `${spec.theoreticalRatio}%` : '-'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {paginatedSpecs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-16 text-center">
                      <div className="inline-flex flex-col items-center justify-center text-gray-400">
                        <Icons.Search />
                        <span className="mt-2 font-bold text-sm">条件に一致するデータが見つかりません</span>
                        <button onClick={clearFilters} className="mt-4 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold transition">条件をクリアする</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
