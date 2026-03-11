// app/components/admin/AdminSales.tsx
// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Briefcase: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Download: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Key: () => <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4v-3.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
};

export const AdminSales = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  
  // ぶっこ抜き用のステート
  const [targetArea, setTargetArea] = useState('北海道浦河郡');
  const [targetKeyword, setTargetKeyword] = useState('電気');

  const targets = data?.salesTargets || [];

  // トークンをブラウザに保存して次回入力を省く
  useEffect(() => {
    const savedToken = localStorage.getItem('gbizApiToken');
    if (savedToken) setApiToken(savedToken);
  }, []);

  const handleTokenChange = (e: any) => {
    setApiToken(e.target.value);
    localStorage.setItem('gbizApiToken', e.target.value);
  };

  const filteredTargets = targets.filter((t: any) => {
      const matchSearch = t.company?.includes(searchTerm) || t.area?.includes(searchTerm) || t.corporateNumber?.includes(searchTerm);
      return matchSearch;
  });

  // gBizINFO APIからのデータぶっこ抜き処理
  const handleFetchGBizData = async () => {
      if (!apiToken) return alert('gBizINFOのAPIトークンを入力してください。');
      if (!targetArea || !targetKeyword) return alert('エリアとキーワードを入力してください。');
      
      setIsFetching(true);
      
      try {
          const payload = { area: targetArea, keyword: targetKeyword, apiToken };
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          
          if (result.success) { 
              alert(result.message); 
              window.location.reload(); 
          } else { 
              alert('取得エラー: ' + result.message); 
          }
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setIsFetching(false); }
  };

  const handleDeleteTarget = async (id: string) => {
      if (!confirm('このデータを削除しますか？')) return;
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
                <span className="w-1.5 h-6 bg-blue-700"></span>
                法人データベース取得ツール
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">gBizINFO API DIRECT EXTRACTOR</p>
        </div>
      </header>

      {/* データぶっこ抜きコントロールパネル */}
      <div className="mb-8 bg-white border border-gray-300 p-6 rounded-sm shadow-md relative overflow-hidden">
          <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900 text-lg">
              <Icons.Database /> gBizINFO API 一括取得エンジン
          </h3>
          <p className="text-xs text-gray-600 mb-6 max-w-3xl leading-relaxed">
              指定した「キーワード」で全国の企業をAPIから全ページ取得し、そこから「エリア（所在地）」でフィルタリングを行うことで、取りこぼしなく目的の地域の企業データをDB（スプレッドシート）にぶっこ抜きます。
          </p>
          
          <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">API トークン</label>
              <div className="relative max-w-md">
                  <Icons.Key />
                  <input type="text" value={apiToken} onChange={handleTokenChange} className="w-full pl-9 p-2.5 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-700 bg-gray-50 font-mono" placeholder="APIトークンをペースト" />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">対象エリア (所在地で絞り込み)</label>
                  <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.MapPin /></div>
                      <input type="text" value={targetArea} onChange={e => setTargetArea(e.target.value)} className="w-full pl-9 p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-700 bg-gray-50 font-bold" placeholder="例: 北海道浦河郡" disabled={isFetching} />
                  </div>
              </div>
              <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">検索キーワード (法人名の一部など)</label>
                  <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Briefcase /></div>
                      <input type="text" value={targetKeyword} onChange={e => setTargetKeyword(e.target.value)} className="w-full pl-9 p-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-blue-700 bg-gray-50 font-bold" placeholder="例: 電気" disabled={isFetching} />
                  </div>
              </div>
          </div>

          <div className="flex justify-end border-t border-gray-100 pt-4">
              <button 
                  onClick={handleFetchGBizData}
                  disabled={isFetching || !targetArea || !targetKeyword || !apiToken}
                  className="bg-blue-700 text-white px-8 py-3 rounded-sm text-sm font-bold shadow-lg hover:bg-blue-800 transition flex items-center gap-2 disabled:opacity-50"
              >
                  {isFetching ? <><Icons.Refresh /> 全ページ取得 ＆ フィルタリング中...</> : <><Icons.Download /> 指定エリアの企業をDBにぶっこ抜く</>}
              </button>
          </div>
      </div>

      {/* 検索枠 */}
      <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm flex gap-4 mb-6 shadow-sm">
        <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></div>
            <input 
                type="text" placeholder="取得済みの企業名、法人番号で検索..." 
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-blue-700"
            />
        </div>
      </div>

      {/* 取得したデータベースのリスト表示 */}
      <div className="space-y-4">
          <div className="text-xs text-gray-500 font-bold mb-2">現在のデータベース格納件数: {filteredTargets.length}件</div>
          
          {filteredTargets.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-sm p-16 text-center text-gray-400 font-bold shadow-sm flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Icons.Database /></div>
                  <p className="text-gray-900 text-lg mb-1">データが格納されていません</p>
                  <p className="text-xs font-normal">上の取得エンジンから、企業データをぶっこ抜いてください。</p>
              </div>
          ) : (
              filteredTargets.reverse().map((t: any) => (
                  <div key={t.id} className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden flex flex-col hover:border-blue-400 transition-colors">
                      
                      {/* ヘッダー */}
                      <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold">法人番号: {t.corporateNumber}</span>
                              </div>
                              <h3 className="text-lg font-black text-gray-900">{t.company}</h3>
                          </div>
                          <button onClick={() => handleDeleteTarget(t.id)} className="text-xs bg-white text-red-600 border border-red-200 px-3 py-2 rounded-sm font-bold shadow-sm hover:bg-red-50 hover:border-red-300 transition flex items-center gap-1 shrink-0">
                              <Icons.Trash /> 削除
                          </button>
                      </div>

                      {/* 取得データ詳細 */}
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white">
                          <div className="col-span-1 md:col-span-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">所在地</p>
                              <p className="text-sm text-gray-800 font-bold">{t.address || '-'}</p>
                          </div>
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">代表者名</p>
                              <p className="text-sm text-gray-800 font-bold">{t.representative || '-'}</p>
                          </div>
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">資本金</p>
                              <p className="text-sm text-gray-800 font-bold">{t.capital || '-'}</p>
                          </div>
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">従業員数</p>
                              <p className="text-sm text-gray-800 font-bold">{t.employees || '-'}</p>
                          </div>
                          <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">設立/創業</p>
                              <p className="text-sm text-gray-800 font-bold">{t.founded || '-'}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Webサイト</p>
                              <p className="text-sm font-mono text-blue-600 break-all">{t.website || '-'}</p>
                          </div>
                          <div className="col-span-1 md:col-span-2 lg:col-span-4">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">事業概要</p>
                              <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-sm border border-gray-100">{t.businessSummary || '情報なし'}</p>
                          </div>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};
