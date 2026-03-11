// app/components/admin/AdminSales.tsx
// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Brain: () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Plus: () => <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  CheckCircle: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export const AdminSales = ({ data }: { data: any }) => {
  // Tier 1: ローカルDBのステート
  const [localDb, setLocalDb] = useState<any[]>([]);
  const [dbSearchTerm, setDbSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('ALL');
  const [addingId, setAddingId] = useState<string | null>(null);
  
  // Tier 2: CRMのステート
  const [crmSearchTerm, setCrmSearchTerm] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const crmTargets = data?.salesTargets || [];

  // コンポーネントマウント時に public/hokkaido_db.json を読み込む（爆速）
  useEffect(() => {
    fetch('/hokkaido_db.json')
      .then(res => res.json())
      .then(data => setLocalDb(data))
      .catch(err => console.error("ローカルDB読込エラー:", err));
  }, []);

  // エリア分布の集計（ブラウザメモリで一瞬で計算）
  const areaStats = useMemo(() => {
      const areas = {
          '道北': { count: 0, color: 'bg-blue-300', top: '15%', left: '55%', keys: ['旭川', '稚内', '富良野', '留萌'] },
          '道東': { count: 0, color: 'bg-blue-400', top: '35%', left: '85%', keys: ['帯広', '釧路', '北見', '十勝', '網走', '根室'] },
          '札幌圏': { count: 0, color: 'bg-blue-700', top: '45%', left: '40%', keys: ['札幌', '石狩', '江別', '恵庭', '千歳', '小樽'] },
          '苫小牧・室蘭': { count: 0, color: 'bg-[#D32F2F]', top: '65%', left: '50%', keys: ['苫小牧', '室蘭', '登別', '白老', '日高', '浦河'] }, 
          '道南': { count: 0, color: 'bg-blue-500', top: '80%', left: '15%', keys: ['函館', '北斗', '七飯', '松前'] },
      };
      
      localDb.forEach((t: any) => {
          const a = t.address || '';
          let matched = false;
          for (const [key, val] of Object.entries(areas)) {
              if (val.keys.some(k => a.includes(k))) { areas[key].count++; matched = true; break; }
          }
      });
      return areas;
  }, [localDb]);

  // ローカルDBのフィルタリング（上位50件のみ描画して軽くする）
  const filteredLocalDb = useMemo(() => {
      let filtered = localDb;
      if (selectedArea !== 'ALL') {
          const keys = areaStats[selectedArea].keys;
          filtered = filtered.filter(t => keys.some(k => (t.address||'').includes(k)));
      }
      if (dbSearchTerm) {
          filtered = filtered.filter(t => (t.company||'').includes(dbSearchTerm) || (t.address||'').includes(dbSearchTerm));
      }
      return filtered.slice(0, 50); // DOMの負荷を下げるため50件表示
  }, [localDb, selectedArea, dbSearchTerm, areaStats]);

  // CRMのフィルタリング
  const filteredCrm = crmTargets.filter((t: any) => (t.company||'').includes(crmSearchTerm) || (t.address||'').includes(crmSearchTerm));

  // Tier 1 -> Tier 2 への移動処理
  const handleAddToCrm = async (target: any) => {
      setAddingId(target.id);
      try {
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'add_to_crm', target }) });
          if (res.ok) window.location.reload();
      } catch (err) { alert('登録に失敗しました。'); }
      finally { setAddingId(null); }
  };

  // Tier 2 (CRM) 上でのAIエンリッチメント処理
  const handleAnalyze = async (target: any) => {
      setAnalyzingId(target.id);
      try {
          const teacherClients = (data?.clients || []).filter((c:any) => c.rank === 'S' || c.rank === 'A');
          const res = await fetch('/api/lead-gen', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'analyze', target, teacherClients }) });
          if (res.ok) window.location.reload();
      } catch (err) { alert('通信エラーが発生しました。'); } 
      finally { setAnalyzingId(null); }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto w-full pb-20 space-y-8">
      
      {/* ==========================================
          Tier 1: 潜在リード・データベース
      ========================================== */}
      <section className="bg-white border border-gray-300 shadow-sm rounded-sm overflow-hidden">
          <div className="bg-gray-900 p-4 border-b border-gray-800 text-white flex justify-between items-center">
              <h2 className="text-xl font-black flex items-center gap-2"><Icons.Database /> 潜在リード・データベース (北海道全域)</h2>
              <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-sm text-xs font-mono font-bold border border-gray-700">総格納数: {localDb.length.toLocaleString()}件</span>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* マップUI */}
              <div className="lg:col-span-1 border border-gray-200 bg-gray-50 rounded-sm p-4 relative">
                  <h3 className="text-xs font-bold text-gray-500 mb-4 flex items-center gap-1"><Icons.MapPin /> エリア別 分布マップ</h3>
                  <div className="relative w-full aspect-[4/3] bg-white rounded-sm border border-gray-200 overflow-hidden shadow-inner">
                      {Object.entries(areaStats).map(([label, d]) => (
                          <div key={label} onClick={() => setSelectedArea(selectedArea === label ? 'ALL' : label)} className={`absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 cursor-pointer group ${selectedArea === label ? 'scale-110 z-10' : 'hover:scale-105'}`} style={{ top: d.top, left: d.left }}>
                              <div className={`w-4 h-4 rounded-full shadow-md mb-0.5 border-2 ${selectedArea === label ? 'border-gray-900 bg-white' : `border-transparent ${d.color}`}`} />
                              <span className="text-[9px] font-bold bg-white/90 px-1 rounded-sm text-gray-800 shadow-sm">{label}</span>
                              <span className="bg-white border border-gray-200 px-1.5 py-0.5 text-[10px] font-black rounded-sm shadow-sm mt-0.5 tabular-nums text-gray-900">{d.count}</span>
                          </div>
                      ))}
                  </div>
              </div>

              {/* リストUI */}
              <div className="lg:col-span-2 flex flex-col">
                  <div className="flex gap-2 mb-4">
                      <div className="relative flex-1">
                          <Icons.Search />
                          <input type="text" placeholder="企業名や住所で高速検索..." value={dbSearchTerm} onChange={e => setDbSearchTerm(e.target.value)} className="w-full pl-9 p-2 border border-gray-300 rounded-sm text-sm focus:border-blue-700 outline-none" />
                      </div>
                      <button onClick={() => {setSelectedArea('ALL'); setDbSearchTerm('');}} className="px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-sm text-xs font-bold hover:bg-gray-200">リセット</button>
                  </div>
                  
                  <div className="flex-1 border border-gray-200 rounded-sm overflow-hidden bg-white flex flex-col">
                      <div className="bg-gray-100 px-4 py-2 text-[10px] font-bold text-gray-500 flex justify-between border-b border-gray-200">
                          <span>{selectedArea !== 'ALL' ? `${selectedArea}の企業` : '全エリア'} (上位50件を表示)</span>
                      </div>
                      <div className="overflow-y-auto max-h-[400px] divide-y divide-gray-100">
                          {filteredLocalDb.map(t => (
                              <div key={t.id} className="p-3 hover:bg-blue-50/50 transition flex justify-between items-center group">
                                  <div>
                                      <p className="text-sm font-black text-gray-900">{t.company}</p>
                                      <p className="text-[10px] text-gray-500 mt-0.5"><Icons.MapPin /> {t.address}</p>
                                  </div>
                                  <button onClick={() => handleAddToCrm(t)} disabled={addingId === t.id} className="opacity-0 group-hover:opacity-100 transition px-3 py-1.5 bg-blue-700 text-white text-xs font-bold rounded-sm shadow-sm hover:bg-blue-800 disabled:opacity-50 flex items-center">
                                      {addingId === t.id ? <Icons.Refresh /> : <Icons.Plus />} CRMへ登録
                                  </button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* ==========================================
          Tier 2: アクティブ・パイプライン (CRM)
      ========================================== */}
      <section>
          <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-black flex items-center gap-2 font-serif"><span className="w-1.5 h-6 bg-[#D32F2F]"></span>アクティブ・パイプライン</h2>
              <span className="text-xs text-gray-500 font-bold">進行中: {crmTargets.length}件</span>
          </div>
          
          <div className="space-y-4">
              {filteredCrm.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-sm p-12 text-center text-gray-400 font-bold shadow-sm">
                      上のデータベースからアプローチしたい企業を「CRMへ登録」してください。
                  </div>
              ) : (
                  filteredCrm.reverse().map((t: any) => {
                      const isUnanalyzed = t.status === '未分析';
                      return (
                          <div key={t.id} className={`bg-white border rounded-sm shadow-sm overflow-hidden flex flex-col ${isUnanalyzed ? 'border-blue-300' : 'border-gray-300'}`}>
                              <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                                  <div>
                                      <span className="bg-green-700 text-white px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold"><Icons.CheckCircle /> {t.corporateNumber}</span>
                                      <h3 className="text-lg font-black text-gray-900 mt-1">{t.company}</h3>
                                  </div>
                              </div>
                              <div className="p-4 flex flex-col md:flex-row gap-4">
                                  <div className="w-full md:w-1/3">
                                      <p className="text-[10px] text-gray-500 font-bold mb-1"><Icons.MapPin /> {t.address}</p>
                                      <p className="text-xs text-gray-600 line-clamp-2">{t.businessSummary}</p>
                                  </div>
                                  <div className="w-full md:w-2/3 bg-gray-50 p-4 rounded-sm border border-gray-200 flex flex-col justify-center">
                                      {isUnanalyzed ? (
                                          <button onClick={() => handleAnalyze(t)} disabled={analyzingId === t.id} className="bg-blue-700 text-white px-6 py-2.5 rounded-sm text-sm font-bold shadow-md hover:bg-blue-800 transition mx-auto flex items-center gap-2">
                                              {analyzingId === t.id ? <Icons.Refresh /> : <><Icons.Brain /> 🤖 連絡先調査 ＆ 営業戦略をAI生成</>}
                                          </button>
                                      ) : (
                                          <div className="grid grid-cols-2 gap-4">
                                              <div><p className="text-[9px] text-gray-400 font-bold uppercase mb-1">電話番号</p><p className="text-sm font-mono font-black">{t.contact || '-'}</p></div>
                                              <div><p className="text-[9px] text-gray-400 font-bold uppercase mb-1">想定排出量</p><p className="text-sm font-black text-[#D32F2F]">{t.volume}</p></div>
                                              <div className="col-span-2"><p className="text-[9px] text-gray-400 font-bold uppercase mb-1">提案シナリオ</p><p className="text-xs font-bold text-gray-800">{t.proposal}</p></div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      );
                  })
              )}
          </div>
      </section>
    </div>
  );
};
