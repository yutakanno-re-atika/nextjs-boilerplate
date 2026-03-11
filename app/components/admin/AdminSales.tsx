// app/components/admin/AdminSales.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Brain: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Document: () => <svg className="w-4 h-4 inline-block text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Phone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  CheckCircle: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const targets = data?.salesTargets || [];

  const filteredTargets = targets.filter((t: any) => {
      return t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.corporateNumber?.includes(searchTerm);
  });

  const getTeacherClients = () => {
      return (data?.clients || []).filter((c:any) => c.rank === 'S' || c.rank === 'A').map((c:any) => ({ name: c.name, industry: c.industry })); 
  };

  // AI分析の実行（エンリッチメント）
  const handleAnalyze = async (target: any) => {
      setAnalyzingId(target.id);
      try {
          const payload = { mode: 'analyze', target, teacherClients: getTeacherClients() };
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.success) { window.location.reload(); } 
          else { alert('エラー: ' + result.message); }
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setAnalyzingId(null); }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'SalesTargets', recordId: id, updates: { 16: newStatus } }) });
          window.location.reload();
      } catch(e) { alert('更新に失敗しました'); }
  };

  const handleDeleteTarget = async (id: string) => {
      if (!confirm('このデータを削除しますか？')) return;
      try {
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName: 'SalesTargets', recordId: id }) });
          window.location.reload();
      } catch(e) { alert('削除に失敗しました'); }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20">
      <header className="mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
            <span className="w-1.5 h-6 bg-blue-700"></span>
            仕入パイプライン (ローカルDB連携 RAG)
        </h2>
        <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">TEACHER DATA ENRICHMENT SYSTEM</p>
      </header>

      {/* スプレッドシート連動ガイド */}
      <div className="mb-8 bg-blue-50 border border-blue-200 p-6 rounded-sm shadow-sm relative overflow-hidden">
          <h3 className="font-bold flex items-center gap-2 mb-2 text-blue-900 text-base">
              <Icons.Database /> 教師データのインポート手順（プランB）
          </h3>
          <ol className="list-decimal list-inside text-xs text-blue-800 leading-relaxed space-y-1">
              <li>gBizINFO等からダウンロードした全件CSVをローカル（Excel等）で開き、目的のエリアや業種でフィルタリングしてください。</li>
              <li>抽出した完璧なデータを、Googleスプレッドシートの <code>SalesTargets</code> シートに直接貼り付けます。</li>
              <li>P列（ステータス）に <strong>「未分析」</strong> と入力してください。システムが自動で読み込み、以下のリストに表示します。</li>
          </ol>
      </div>

      {/* 検索枠 */}
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm flex gap-4 mb-6 shadow-sm">
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            <input type="text" placeholder="スプレッドシートのデータを検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-blue-700" />
        </div>
      </div>

      <div className="space-y-4">
          <div className="text-xs text-gray-500 font-bold mb-2">スプレッドシート読込件数: {filteredTargets.length}件</div>
          
          {filteredTargets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-16 text-center text-gray-400 font-bold shadow-sm">
                  <p className="text-gray-900 text-lg mb-1">データがインポートされていません</p>
                  <p className="text-xs font-normal">スプレッドシートにデータを貼り付けてください。</p>
              </div>
          ) : (
              filteredTargets.reverse().map((t: any) => {
                  const isUnanalyzed = t.status === '未分析' || t.status === 'API抽出データ';
                  
                  let displayMemo = t.memo || '';
                  let dmText = '';
                  if (displayMemo.includes('【🤖 AI作成 DM・FAX送信用原稿】')) {
                      const parts = displayMemo.split('【🤖 AI作成 DM・FAX送信用原稿】');
                      displayMemo = parts[0].trim();
                      dmText = parts[1].trim();
                  }

                  return (
                      <div key={t.id} className={`bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col transition-colors ${isUnanalyzed ? 'border-blue-300 bg-blue-50/20' : 'border-gray-300'}`}>
                          
                          {/* ヘッダー */}
                          <div className={`border-b p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isUnanalyzed ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      {t.corporateNumber && <span className="bg-green-700 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold tracking-widest"><Icons.CheckCircle /> 確定データ</span>}
                                      {t.corporateNumber && <span className="text-[10px] text-gray-500 font-mono">法人番号: {t.corporateNumber}</span>}
                                  </div>
                                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                      {t.priority && <span className={`text-sm w-6 h-6 flex items-center justify-center rounded-sm text-white ${t.priority === 'S' ? 'bg-red-600' : t.priority === 'A' ? 'bg-gray-800' : 'bg-gray-400'}`}>{t.priority}</span>}
                                      {t.company}
                                  </h3>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                  {!isUnanalyzed && (
                                      <select value={t.status || '未確認'} onChange={(e) => handleStatusChange(t.id, e.target.value)} className="p-2 text-xs font-bold rounded-sm border outline-none cursor-pointer bg-white border-gray-300 shadow-sm">
                                          <option value="未確認">未確認</option>
                                          <option value="アプローチ中">アプローチ中</option>
                                          <option value="見送り">見送り</option>
                                      </select>
                                  )}
                                  <button onClick={() => handleDeleteTarget(t.id)} className="text-xs bg-white text-red-600 border border-red-200 px-3 py-2 rounded-sm font-bold hover:bg-red-50 transition shadow-sm"><Icons.Trash /></button>
                              </div>
                          </div>

                          {/* ボディ */}
                          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                              <div className="w-full lg:w-1/3 p-4 space-y-3 shrink-0">
                                  <div className="grid grid-cols-2 gap-2">
                                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">所在地</p><p className="text-xs font-bold text-gray-800">{t.address || '-'}</p></div>
                                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">代表者名</p><p className="text-xs font-bold text-gray-800">{t.representative || '-'}</p></div>
                                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">資本金</p><p className="text-xs font-bold text-gray-800">{t.capital || '-'}</p></div>
                                      <div><p className="text-[9px] font-bold text-gray-400 uppercase">設立/創業</p><p className="text-xs font-bold text-gray-800">{t.founded || '-'}</p></div>
                                  </div>
                                  <div className="pt-2 border-t border-gray-100">
                                      <p className="text-[9px] font-bold text-gray-400 uppercase">事業概要</p>
                                      <p className="text-xs text-gray-600 line-clamp-3">{t.businessSummary || '-'}</p>
                                  </div>
                                  {/* AI分析後に追加される情報 */}
                                  {!isUnanalyzed && (
                                      <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                                          <div><p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5"><Icons.Phone /> 電話番号</p><p className="text-xs font-mono font-bold">{t.contact || '不明'}</p></div>
                                          <div><p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5"><Icons.Globe /> Web</p><a href={t.website} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-600 hover:underline truncate block">{t.website || '-'}</a></div>
                                      </div>
                                  )}
                              </div>

                              <div className="w-full lg:w-2/3 p-4 bg-gray-50 flex flex-col gap-4 justify-center">
                                  {isUnanalyzed ? (
                                      <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-sm bg-white">
                                          <p className="text-sm font-bold text-blue-900 mb-2">確定データを元にAIで営業戦略を構築します</p>
                                          <button 
                                              onClick={() => handleAnalyze(t)}
                                              disabled={analyzingId === t.id}
                                              className="bg-blue-700 text-white px-6 py-2.5 rounded-sm text-sm font-bold shadow-md hover:bg-blue-800 transition flex items-center justify-center gap-2 w-full md:w-auto mx-auto disabled:opacity-50"
                                          >
                                              {analyzingId === t.id ? <><Icons.Refresh /> AIリサーチ中...</> : <><Icons.Brain /> 🤖 AIで連絡先を検索 ＆ DM原稿を生成</>}
                                          </button>
                                      </div>
                                  ) : (
                                      <div className="flex flex-col gap-4 h-full">
                                          <div className="bg-white p-3 border border-gray-200 rounded-sm shadow-sm">
                                              <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">AI分析: ターゲット選定理由 (想定排出量: <span className="text-[#D32F2F] font-black">{t.volume}</span>)</p>
                                              <p className="text-sm text-gray-800 font-medium">{t.reason || '理由データなし'}</p>
                                          </div>
                                          <div className="bg-gray-900 p-4 rounded-sm border border-gray-800 text-white flex-1 shadow-inner">
                                              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 border-b border-gray-700 pb-1">AI生成: 提案シナリオ</p>
                                              <p className="text-sm text-gray-200 leading-relaxed font-bold">{t.proposal || '提案データなし'}</p>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>

                          {dmText && (
                              <details className="bg-blue-50/50 border-t border-blue-100 group">
                                  <summary className="p-3 text-xs font-bold text-blue-800 cursor-pointer hover:bg-blue-50 flex items-center gap-2 select-none"><Icons.Document /> AI自動生成 DM・FAX原稿を表示</summary>
                                  <div className="p-4 pt-0"><textarea readOnly className="w-full h-32 p-3 text-xs text-gray-700 bg-white border border-blue-200 rounded-sm shadow-inner outline-none" value={dmText} /></div>
                              </details>
                          )}
                      </div>
                  )
              })
          )}
      </div>
    </div>
  );
};
