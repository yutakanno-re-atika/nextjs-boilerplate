// app/components/admin/AdminSales.tsx
// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Brain: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
};

const formatTimeShort = (timeStr: string) => {
  if (!timeStr) return '--/-- --:--';
  const str = String(timeStr);
  const match = str.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
  if (match) {
    const MM = match[2].padStart(2, '0'); const DD = match[3].padStart(2, '0');
    const HH = match[4].padStart(2, '0'); const mm = match[5].padStart(2, '0');
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
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetArea, setTargetArea] = useState('北海道札幌市');
  const [targetIndustry, setTargetIndustry] = useState('電気工事業、解体業');
  const [targetCount, setTargetCount] = useState(5);

  const targets = data?.salesTargets || [];

  const filteredTargets = targets.filter((t: any) => {
      const matchSearch = t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.industry?.includes(searchTerm);
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchSearch && matchPriority && matchStatus;
  });

  const handleGenerateLeads = async () => {
      if (!targetArea || !targetIndustry) return alert('エリアと業種を入力してください。');
      setIsGenerating(true);
      try {
          const payload = { action: 'GENERATE_LEADS_DYNAMIC', area: targetArea, industry: targetIndustry, count: targetCount };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { alert(`成功！ ${result.count}件の新規ターゲットを抽出しました。`); window.location.reload(); } 
          else { alert('エラーが発生しました: ' + result.message); }
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setIsGenerating(false); }
  };

  // ★ 追加: ステータス更新処理
  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 10: newStatus } }) // 10 is status column
          });
          window.location.reload();
      } catch(e) { alert('ステータスの更新に失敗しました'); }
  };

  // ★ 追加: 顧客マスターへの昇格処理
  const handlePromoteToClient = async (id: string, company: string) => {
      if (!confirm(`「${company}」を既存取引先（顧客マスター）に昇格させますか？\n※昇格後はPOSレジの顧客一覧に表示されます。`)) return;
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'CONVERT_TARGET_TO_CLIENT', targetId: id })
          });
          alert('顧客マスターへの昇格が完了しました！');
          window.location.reload();
      } catch(e) { alert('エラーが発生しました'); }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                営業・ターゲット管理
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">SALES & CRM</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border ${isAiPanelOpen ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-gray-900 text-white hover:bg-black border-transparent'}`}
            >
                <Icons.Target /> AIスナイパー (条件指定抽出)
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
                  既存の優良顧客（SUPPLIER）の特性データを教師とし、類似する見込み客をGemini 2.5 Proがウェブ上から自動抽出します。
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
                type="text" placeholder="企業名、エリア、業種で検索..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#D32F2F]"
            />
        </div>
        <div className="flex items-center gap-2">
            <div className="text-gray-400"><Icons.Filter /></div>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#D32F2F] bg-white font-bold text-gray-700">
                <option value="ALL">すべてのランク</option>
                <option value="S">ランク S (最優先)</option>
                <option value="A">ランク A</option>
                <option value="B">ランク B</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border border-gray-300 rounded-sm py-2 px-3 text-sm focus:outline-none focus:border-[#D32F2F] bg-white font-bold text-gray-700">
                <option value="ALL">全ステータス</option>
                <option value="確認中">確認中 (未着手)</option>
                <option value="アプローチ中">アプローチ中</option>
                <option value="見送り">見送り</option>
                <option value="既存取引先">既存取引先 (昇格済)</option>
            </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest border-b border-gray-200">
                    <tr>
                        <th className="p-4 w-[25%]">企業名 / エリア</th>
                        <th className="p-4 w-[10%] text-center">ランク</th>
                        <th className="p-4 w-[20%]">アプローチ根拠</th>
                        <th className="p-4 w-[25%]">AI提案シナリオ</th>
                        <th className="p-4 w-[20%] text-right">進捗ステータス</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                    {filteredTargets.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-bold">ターゲットが見つかりません。AIスナイパーで抽出してください。</td></tr>
                    ) : (
                        filteredTargets.reverse().map((t: any) => {
                            const isAi = t.memo?.includes('AI_AUTO') || t.source === 'AI_AUTO' || t.memo?.includes('AIスナイパー') || t.memo?.includes('AI自動抽出');
                            const isClient = t.status === '既存取引先';
                            return (
                                <tr key={t.id} className={`hover:bg-gray-50 transition group ${isClient ? 'bg-gray-50 opacity-60' : ''}`}>
                                    <td className="p-4 align-top">
                                        <div className="flex items-start gap-2">
                                            <p className="font-bold text-gray-900 mb-1">{t.company}</p>
                                            {isAi && !isClient && <ProvenanceBadge type="AI_AUTO" />}
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-mono mb-1">{t.address || t.area}</p>
                                        <span className="inline-block bg-gray-100 border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-sm font-bold">
                                            {t.industry || '業種不明'}
                                        </span>
                                        <div className="mt-2 text-[10px] text-gray-400 font-mono">
                                            <span title={`抽出日時: ${t.createdAt}`}>🕒 {formatTimeShort(t.createdAt)}</span>
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
                                    <td className="p-4 align-top text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            {/* ★ ステータス変更プルダウン */}
                                            <select 
                                                value={t.status || '確認中'} 
                                                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                                disabled={isClient}
                                                className={`p-2 text-xs font-bold rounded-sm border outline-none cursor-pointer shadow-sm ${
                                                    t.status === 'アプローチ中' ? 'bg-yellow-50 border-yellow-300 text-yellow-800' :
                                                    t.status === '見送り' ? 'bg-gray-100 border-gray-300 text-gray-500' :
                                                    isClient ? 'bg-green-50 border-green-300 text-green-800' :
                                                    'bg-white border-gray-300 text-gray-800'
                                                }`}
                                            >
                                                <option value="確認中">未着手 (確認中)</option>
                                                <option value="アプローチ中">アプローチ中</option>
                                                <option value="見送り">見送り</option>
                                                {isClient && <option value="既存取引先">既存取引先</option>}
                                            </select>

                                            {/* ★ 顧客マスターへ昇格ボタン */}
                                            {!isClient && (
                                                <button 
                                                    onClick={() => handlePromoteToClient(t.id, t.company)}
                                                    className="mt-2 text-[10px] bg-gray-900 text-white px-3 py-1.5 rounded-sm font-bold shadow-sm hover:bg-[#D32F2F] transition flex items-center gap-1"
                                                >
                                                    <Icons.ArrowUp /> 顧客マスターへ昇格
                                                </button>
                                            )}
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
