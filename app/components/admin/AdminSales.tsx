// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Brain: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
};

// ★修正：タイムゾーン問題を回避する安全な文字列切り出し
const formatTimeShort = (timeStr: string) => {
  if (!timeStr) return '--/-- --:--';
  const str = String(timeStr);
  // 例: "2026-03-03 17:46:35" または "2026/03/03 17:46"
  const match = str.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
  if (match) {
    const MM = match[2].padStart(2, '0');
    const DD = match[3].padStart(2, '0');
    const HH = match[4].padStart(2, '0');
    const mm = match[5].padStart(2, '0');
    return `${MM}/${DD} ${HH}:${mm}`;
  }
  return str.substring(0, 16);
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'CO_OP': return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-gray-400`} title="AI予測・推論データ">AI</span>;
        default: return null;
    }
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetArea, setTargetArea] = useState('北海道札幌市');
  const [targetIndustry, setTargetIndustry] = useState('電気工事業、解体業');
  const [targetCount, setTargetCount] = useState(5);

  const targets = data?.salesTargets || [];

  const filteredTargets = targets.filter((t: any) => {
      const matchSearch = t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.industry?.includes(searchTerm);
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      return matchSearch && matchPriority;
  });

  const handleGenerateLeads = async () => {
      if (!targetArea || !targetIndustry) {
          alert('エリアと業種を入力してください。');
          return;
      }
      
      setIsGenerating(true);
      try {
          const payload = {
              action: 'GENERATE_LEADS_DYNAMIC',
              area: targetArea,
              industry: targetIndustry,
              count: targetCount
          };
          
          const res = await fetch('/api/gas', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify(payload) 
          });
          
          const result = await res.json();
          if (result.status === 'success') {
              alert(`成功！ ${result.count}件の新規ターゲットを抽出しました。`);
              window.location.reload(); 
          } else {
              alert('エラーが発生しました: ' + result.message);
          }
      } catch (err) {
          alert('通信エラーが発生しました。');
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                営業・ターゲット管理
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">SALES & LEADS</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border ${isAiPanelOpen ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-gray-900 text-white hover:bg-black border-transparent'}`}
            >
                <Icons.Target /> AIスナイパー (条件指定リサーチ)
            </button>
        </div>
      </header>

      {isAiPanelOpen && (
          <div className="mb-8 bg-blue-50/50 border border-blue-200 p-6 rounded-sm shadow-inner relative overflow-hidden animate-in slide-in-from-top-4">
              <div className="absolute top-4 right-4"><ProvenanceBadge type="AI_AUTO" /></div>
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
                  <Icons.Brain /> ディープリサーチ・パラメータ設定
              </h3>
              <p className="text-xs text-gray-600 mb-6 max-w-2xl">
                  既存の優良顧客（SUPPLIER）の特性データを教師とし、類似する見込み客をGemini 2.5 Proがウェブ上からディープリサーチして自動抽出します。協業他社とのバッティングを避けるため、エリアをピンポイントで指定できます。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">ターゲットエリア</label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.MapPin /></div>
                          <input type="text" value={targetArea} onChange={e => setTargetArea(e.target.value)} className="w-full pl-9 p-2.5 border border-blue-200 rounded-sm text-sm outline-none focus:border-blue-500 bg-white shadow-sm" placeholder="例: 北海道苫小牧市" disabled={isGenerating} />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">対象業種キーワード</label>
                      <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2"><Icons.Briefcase /></div>
                          <input type="text" value={targetIndustry} onChange={e => setTargetIndustry(e.target.value)} className="w-full pl-9 p-2.5 border border-blue-200 rounded-sm text-sm outline-none focus:border-blue-500 bg-white shadow-sm" placeholder="例: 電気工事, 解体業" disabled={isGenerating} />
                      </div>
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">抽出件数</label>
                      <select value={targetCount} onChange={e => setTargetCount(Number(e.target.value))} className="w-full p-2.5 border border-blue-200 rounded-sm text-sm outline-none focus:border-blue-500 bg-white shadow-sm font-mono font-bold" disabled={isGenerating}>
                          <option value={5}>5件 (高速)</option>
                          <option value={10}>10件 (標準)</option>
                          <option value={20}>20件 (ディープ)</option>
                      </select>
                  </div>
              </div>

              <div className="flex justify-end border-t border-blue-200 pt-4">
                  <button 
                      onClick={handleGenerateLeads}
                      disabled={isGenerating}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-sm text-sm font-bold shadow-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                      {isGenerating ? <><Icons.Refresh /> リサーチ実行中 (約10〜30秒)...</> : <><Icons.Target /> この条件で抽出を開始する</>}
                  </button>
              </div>
          </div>
      )}

      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm flex flex-col md:flex-row gap-4 mb-6 shadow-sm">
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            <input 
                type="text" 
                placeholder="企業名、エリア、業種で検索..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#D32F2F]"
            />
        </div>
        <div className="flex items-center gap-2">
            <div className="text-gray-400"><Icons.Filter /></div>
            <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#D32F2F] bg-white font-bold"
            >
                <option value="ALL">すべてのランク</option>
                <option value="S">ランク S (最優先)</option>
                <option value="A">ランク A</option>
                <option value="B">ランク B</option>
            </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-[#111] text-white text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                        <th className="p-4 w-[25%]">企業名 / エリア</th>
                        <th className="p-4 w-[10%] text-center">優先度</th>
                        <th className="p-4 w-[35%]">アプローチ根拠 (AI分析)</th>
                        <th className="p-4 w-[30%]">提案シナリオ</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {filteredTargets.length === 0 ? (
                        <tr><td colSpan={4} className="p-12 text-center text-gray-400 font-bold">ターゲットが見つかりません。AIスナイパーで抽出してください。</td></tr>
                    ) : (
                        filteredTargets.reverse().map((t: any) => {
                            const isAi = t.memo?.includes('AI_AUTO') || t.source === 'AI_AUTO' || t.memo?.includes('AIスナイパー');
                            return (
                                <tr key={t.id} className="hover:bg-gray-50 transition group">
                                    <td className="p-4 align-top">
                                        <div className="flex items-start gap-2">
                                            <p className="font-bold text-gray-900 mb-1">{t.company}</p>
                                            {isAi && <ProvenanceBadge type="AI_AUTO" />}
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">{t.address || t.area}</p>
                                        <span className="inline-block bg-gray-100 border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-sm font-bold">
                                            {t.industry || '業種不明'}
                                        </span>
                                        
                                        <div className="flex gap-3 mt-3 text-[10px] text-gray-400 font-mono">
                                            <span title={`抽出日時: ${t.createdAt}`}>🕒 {formatTimeShort(t.createdAt)}</span>
                                            <span title={`最終更新: ${t.updatedAt}`}>✏️ {formatTimeShort(t.updatedAt)}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center align-top">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-sm font-black shadow-sm ${t.priority === 'S' ? 'bg-[#D32F2F] text-white' : t.priority === 'A' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                            {t.priority || 'B'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <p className="text-xs text-gray-700 leading-relaxed font-medium line-clamp-3 group-hover:line-clamp-none transition-all">
                                            {t.reason || '-'}
                                        </p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="bg-blue-50/50 p-3 rounded-sm border border-blue-100">
                                            <p className="text-xs text-blue-900 leading-relaxed font-bold flex gap-1">
                                                <Icons.Brain />
                                                <span className="line-clamp-3 group-hover:line-clamp-none transition-all">{t.proposal || '-'}</span>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
