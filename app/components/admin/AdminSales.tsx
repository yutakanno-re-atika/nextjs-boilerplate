// app/components/admin/AdminSales.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Filter: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Brain: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Target: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  Chart: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Scale: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  Document: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  CheckCircle: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CloudSync: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'GBIZ_VERIFIED' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'GBIZ_VERIFIED': return <span className={`${baseStyle} bg-green-700`} title="gBizINFO 連携・実在証明済"><Icons.CheckCircle /> 国の公式データ</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-gray-900`} title="AI予測・推論データ">AI抽出</span>;
        default: return null;
    }
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  const [isManualAddOpen, setIsManualAddOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [catchInput, setCatchInput] = useState('');
  const [newTarget, setNewTarget] = useState({ company: '', area: '北海道苫小牧市', industry: '電気設備工事', contact: '', website: '', reason: '' });

  const targets = data?.salesTargets || [];

  const filteredTargets = targets.filter((t: any) => {
      const matchSearch = t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.industry?.includes(searchTerm) || t.corporateNumber?.includes(searchTerm);
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      return matchSearch && matchPriority && matchStatus;
  });

  // ★ 新機能：既存リストの gBizINFO 一括同期（エンリッチメント）
  const handleSyncGBizInfo = async () => {
      // 法人番号が空欄のターゲットを抽出
      const targetsToSync = targets.filter((t:any) => !t.corporateNumber || t.corporateNumber.trim() === '');
      if (targetsToSync.length === 0) {
          return alert("全てのリストは既に法人番号（公式データ）が同期されています！");
      }
      if (!confirm(`法人番号が未登録の ${targetsToSync.length} 件の企業に対し、国のデータベース(gBizINFO)から公式情報を取得し、資本金や設立年などのデータを一括で上書き補完しますか？`)) return;
      
      setIsSyncing(true);
      try {
          // バックエンドに同期リクエストを投げる
          const res = await fetch('/api/lead-gen', { 
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ mode: 'sync', targets: targetsToSync.map((t:any) => ({ id: t.id, company: t.company, area: t.area })) }) 
          });
          const result = await res.json();
          if (result.success) {
              alert(result.message);
              window.location.reload();
          } else {
              alert('同期エラー: ' + result.message);
          }
      } catch (err) {
          alert('通信エラーが発生しました。');
      } finally {
          setIsSyncing(false);
      }
  };

  const handleCatchLead = async () => {
      if (!catchInput) return alert("名簿のテキストやURLなどを貼り付けてください。");
      setIsGenerating(true);
      
      try {
          const payload = { 
            mode: 'catch', 
            inputText: catchInput, 
            area: newTarget.area, 
            industry: newTarget.industry
          };
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          
          if (result.success) { 
              alert(`成功！ AIがテキストを分析し、経産省のAPIで実在確認を行った ${result.count}件 の本物の法人を登録しました。`); 
              setCatchInput('');
              window.location.reload(); 
          } else { 
              alert('エラーが発生しました: ' + result.message); 
          }
      } catch (err) { alert('通信エラーが発生しました。時間をおいて再試行してください。'); } 
      finally { setIsGenerating(false); }
  };

  // ★ 列インデックス（順番）が新しくなったため、15列目(ステータス)と18列目(メモ)に変更
  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 15: newStatus } }) 
          });
          window.location.reload();
      } catch(e) { alert('ステータスの更新に失敗しました'); }
  };

  const handleMemoChange = async (id: string, newMemo: string) => {
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 18: newMemo } }) 
          });
      } catch(e) { console.error('メモの更新に失敗しました'); }
  };

  const handleDeleteTarget = async (id: string) => {
      if (!confirm('このターゲットを削除しますか？')) return;
      try {
          await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName: 'SalesTargets', recordId: id }) 
          });
          window.location.reload();
      } catch(e) { alert('削除に失敗しました'); }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4">
        <div>
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                仕入パイプライン管理
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">SOURCING PIPELINE (gBizINFO SYNCED)</p>
        </div>
        <div className="flex gap-2 flex-wrap">
            <button 
                onClick={handleSyncGBizInfo}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 disabled:opacity-50"
            >
                {isSyncing ? <Icons.Refresh /> : <Icons.CloudSync />} gBizINFO 一括同期
            </button>
            <button 
                onClick={() => setIsManualAddOpen(!isManualAddOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm shadow-sm transition-colors border ${isManualAddOpen ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-gray-900 text-white hover:bg-black border-transparent'}`}
            >
                <Icons.Sparkles /> リスト一発登録
            </button>
        </div>
      </header>

      {/* AIディープリサーチ ＆ 手動追加パネル */}
      {isManualAddOpen && (
          <div className="mb-8 bg-white border border-gray-200 p-6 rounded-sm shadow-sm relative overflow-hidden animate-in slide-in-from-top-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Icons.Sparkles /> 経産省DB直結・名簿一発登録
              </h3>
              
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm shadow-inner">
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                     <Icons.Brain /> ツクリンクや役場の名簿テキストをガサッと貼り付けるだけ
                  </label>
                  <p className="text-[10px] text-gray-500 mb-3">
                      貼り付けられたテキストの中からAIが企業名を抽出し、<strong className="text-gray-900 border-b border-gray-300">経産省の法人データベース(gBizINFO)</strong>に直接照会をかけます。国に登記されている100%本物の法人だけを厳選し、公式情報とともにリスト化します。
                  </p>
                  <textarea 
                      className="w-full p-3 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900 shadow-sm min-h-[100px] leading-relaxed" 
                      placeholder="例：検索結果ページでテキストを全選択（Ctrl+A）して、ここにコピー＆ペースト..." 
                      value={catchInput} 
                      onChange={e => setCatchInput(e.target.value)} 
                      disabled={isGenerating} 
                  />
                  <div className="flex justify-end mt-3">
                      <button 
                          onClick={handleCatchLead} 
                          disabled={isGenerating || !catchInput}
                          className="bg-[#D32F2F] text-white px-6 py-3 rounded-sm text-sm font-bold shadow-md hover:bg-red-800 transition flex items-center gap-2 disabled:opacity-50"
                      >
                          {isGenerating ? <><Icons.Refresh /> gBizINFOと通信・精査中...</> : <><Icons.Sparkles /> 公式データで抽出・登録</>}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* 検索とフィルター */}
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm flex flex-col md:flex-row gap-4 mb-6 shadow-sm">
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            <input 
                type="text" placeholder="企業名、エリア、法人番号で検索..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-[#D32F2F]"
            />
        </div>
      </div>

      <div className="space-y-4">
          {filteredTargets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center text-gray-400 font-bold shadow-sm">
                  ターゲットが見つかりません。
              </div>
          ) : (
              filteredTargets.reverse().map((t: any) => {
                  const hasCorpNumber = t.corporateNumber && t.corporateNumber.trim() !== '';
                  const isClient = t.status === '既存取引先';
                  
                  // メモ欄からDM原稿を分離
                  let displayMemo = t.memo || '';
                  let dmText = '';
                  if (displayMemo.includes('【🤖 AI作成 DM・FAX送信用原稿】')) {
                      const parts = displayMemo.split('【🤖 AI作成 DM・FAX送信用原稿】');
                      displayMemo = parts[0].trim();
                      dmText = parts[1].trim();
                  }

                  return (
                      <div key={t.id} className={`bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col group transition-all duration-300 ${isClient ? 'border-gray-200 opacity-70 bg-gray-50' : 'border-gray-300 hover:border-gray-500 hover:shadow-md'}`}>
                          
                          {/* 1. ヘッダー：企業名とバッジ */}
                          <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                  <span className={`flex items-center justify-center w-8 h-8 rounded-sm text-sm font-black shadow-sm shrink-0 ${t.priority === 'S' ? 'bg-[#D32F2F] text-white' : t.priority === 'A' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}>
                                      {t.priority || 'B'}
                                  </span>
                                  <div>
                                      <h3 className="text-lg md:text-xl font-black text-gray-900 flex items-center gap-2">
                                          {t.company}
                                          {hasCorpNumber && <ProvenanceBadge type="GBIZ_VERIFIED" />}
                                      </h3>
                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] text-gray-500 font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded-sm">{t.industry || '業種不明'}</span>
                                          <span className="text-[10px] text-gray-400 font-mono tracking-widest flex items-center gap-0.5"><Icons.MapPin /> {t.area || t.address}</span>
                                          {hasCorpNumber && <span className="text-[9px] text-gray-400 font-mono">法人番号: {t.corporateNumber}</span>}
                                      </div>
                                  </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                  <select 
                                      value={t.status || '未確認'} 
                                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                      disabled={isClient}
                                      className={`p-2 text-xs font-bold rounded-sm border outline-none cursor-pointer shadow-sm transition-colors ${
                                          t.status === 'アプローチ中' ? 'bg-gray-800 border-gray-900 text-white' :
                                          t.status === '見送り' ? 'bg-gray-100 border-gray-300 text-gray-500' :
                                          'bg-white border-gray-300 text-gray-900 hover:bg-gray-50'
                                      }`}
                                  >
                                      <option value="未確認">未確認</option>
                                      <option value="確認中">潜在リード</option>
                                      <option value="アプローチ中">アプローチ中</option>
                                      <option value="見送り">見送り</option>
                                  </select>
                                  <button onClick={() => handleDeleteTarget(t.id)} className="text-xs bg-white text-red-600 border border-red-200 px-3 py-2 rounded-sm font-bold shadow-sm hover:bg-red-50 hover:border-red-300 transition flex items-center gap-1" title="削除"><Icons.Trash /></button>
                              </div>
                          </div>

                          {/* 2. ボディ：公式データ ＆ AIインサイト */}
                          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                              
                              {/* 左：gBizINFO 公式データ */}
                              <div className="w-full lg:w-1/3 p-4 bg-white space-y-3 shrink-0">
                                  <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">代表者名</p>
                                      <p className="text-sm font-bold text-gray-800">{t.representative || '-'}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">資本金</p>
                                          <p className="text-sm font-bold text-gray-800">{t.capital || '-'}</p>
                                      </div>
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">設立/創業</p>
                                          <p className="text-sm font-bold text-gray-800">{t.founded || '-'}</p>
                                      </div>
                                  </div>
                                  <div>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">事業概要 (gBizINFO)</p>
                                      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{t.businessSummary || '-'}</p>
                                  </div>
                                  <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5"><Icons.Phone /> 電話番号</p>
                                          <p className="text-xs font-mono font-bold text-gray-800">{t.contact || '調査中'}</p>
                                      </div>
                                      <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5"><Icons.Globe /> Web</p>
                                          <a href={t.website} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-600 hover:underline truncate block">{t.website || '-'}</a>
                                      </div>
                                  </div>
                              </div>

                              {/* 右：AIインサイト（営業根拠と提案） */}
                              <div className="w-full lg:w-2/3 p-4 bg-gray-50/50 flex flex-col gap-4">
                                  <div className="flex-1 bg-white p-4 rounded-sm border border-gray-200 shadow-sm">
                                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-100 pb-1">AI分析: ターゲット選定の理由 (排出量推測: <span className="text-[#D32F2F] font-black">{t.volume}</span>)</p>
                                      <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                          {t.reason || '理由データなし'}
                                      </p>
                                  </div>
                                  <div className="flex-1 bg-gray-900 p-4 rounded-sm border border-gray-800 shadow-inner text-white relative overflow-hidden">
                                      <div className="absolute top-2 right-2 opacity-10"><Icons.Brain /></div>
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-700 pb-1">AI生成: 提案シナリオ</p>
                                      <p className="text-sm text-gray-200 leading-relaxed font-bold relative z-10">
                                          {t.proposal || '提案データなし'}
                                      </p>
                                  </div>
                              </div>
                          </div>

                          {/* DM原稿表示アコーディオン */}
                          {dmText && (
                              <details className="bg-blue-50/50 border-t border-blue-100 group">
                                  <summary className="p-3 text-xs font-bold text-blue-800 cursor-pointer hover:bg-blue-50 select-none flex items-center gap-2">
                                      <Icons.Document /> 自動生成されたDM・FAX送信用原稿を表示
                                  </summary>
                                  <div className="p-4 pt-0">
                                      <textarea readOnly className="w-full h-32 p-3 text-xs text-gray-700 bg-white border border-blue-200 rounded-sm outline-none resize-y" value={dmText} />
                                  </div>
                              </details>
                          )}

                          {/* 3. フッター：営業メモ入力欄 */}
                          <div className="p-4 border-t border-gray-200 bg-gray-50">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                                  <span>📝 アプローチ履歴・営業メモ</span>
                              </p>
                              <textarea 
                                  defaultValue={displayMemo}
                                  placeholder="電話をかけた結果や、次回訪問予定などを記録してください..."
                                  onBlur={(e) => handleMemoChange(t.id, e.target.value)}
                                  className="w-full min-h-[80px] p-3 text-sm border border-gray-300 rounded-sm outline-none resize-y leading-relaxed bg-white focus:border-gray-900 shadow-inner"
                              />
                          </div>
                      </div>
                  )
              })
          )}
      </div>
    </div>
  );
};
