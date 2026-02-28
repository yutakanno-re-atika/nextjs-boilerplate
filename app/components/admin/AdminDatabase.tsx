// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Save: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
};

export const AdminDatabase = ({ data, onNavigate }: { data: any, onNavigate?: any }) => {
  const [activeTab, setActiveTab] = useState<'WIRES' | 'CASTINGS' | 'CLIENTS' | 'CONFIG'>('WIRES');
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // ★ 印刷用ステート
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

  const wires = data?.wires || [];
  const castings = data?.castings || [];
  const clients = data?.clients || [];
  const config = data?.config || {};

  const copperPrice = Number(config.market_price) || 1450;
  const brassPrice = Number(config.brass_price) || 980;
  const zincPrice = Number(config.zinc_price) || 450;
  const leadPrice = Number(config.lead_price) || 380;

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
      return name;
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id || item.clientId);
      setEditValues({ ...item });
  };

  const handleSave = async (sheetName: string, id: string) => {
      setIsSaving(true);
      try {
          // 簡易保存処理（実際はAPIでアップデート処理を走らせる）
          const payload = { action: 'UPDATE_DB_RECORD', sheetName, recordId: id, updates: editValues };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              setEditingId(null);
              window.location.reload();
          } else {
              alert('エラー: ' + result.message);
          }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  // ★ 追加: 印刷＆AIレポート生成ハンドラ
  const handlePrintReport = async () => {
      setIsGeneratingReport(true);
      
      let promptData = '';
      let pageName = '';

      if (activeTab === 'WIRES' || activeTab === 'CASTINGS') {
          pageName = '本日の買取価格表（マージン計算済）';
          promptData = `
          ・本日の銅建値: ${copperPrice} 円/kg
          ・本日の真鍮建値: ${brassPrice} 円/kg
          ・登録されている電線類: ${wires.length} 品目
          ・登録されている非鉄類: ${castings.length} 品目
          ※顧客に提示・配布するための相場表です。現在の相場動向に対する一言を添えてください。
          `;
      } else if (activeTab === 'CLIENTS') {
          pageName = '顧客ディレクトリ（名簿）';
          promptData = `
          ・現在の登録顧客数: ${clients.length} 社
          ・ランクS顧客: ${clients.filter((c:any)=>c.rank==='S').length} 社
          ・ランクA顧客: ${clients.filter((c:any)=>c.rank==='A').length} 社
          ※社内管理用の顧客リストです。上位顧客の割合などから今後の営業戦略に対する一言を添えてください。
          `;
      } else {
          // CONFIG等は印刷対象外とするか簡易出力
          pageName = 'システム設定一覧';
          promptData = `システム稼働用のコンフィグデータです。`;
      }

      try {
          const res = await fetch('/api/print-summary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pageName, promptData })
          });
          const result = await res.json();
          if (result.success) {
              setAiSummary(result.summary);
              setTimeout(() => {
                  window.print();
                  setIsGeneratingReport(false);
              }, 500);
          } else {
              alert('AI要約の生成に失敗しました');
              setIsGeneratingReport(false);
          }
      } catch(e) {
          alert('通信エラー');
          setIsGeneratingReport(false);
      }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans max-w-7xl mx-auto w-full relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* --- 通常の画面 (印刷時は非表示) --- */}
      <div className="print:hidden flex flex-col h-full">
          <header className="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4 flex-shrink-0">
            <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                    <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                    マスターDB管理
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">DATABASE & SETTINGS</p>
            </div>
            {/* ★ 印刷ボタン */}
            <button 
                onClick={handlePrintReport} 
                disabled={isGeneratingReport || activeTab === 'CONFIG'}
                className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {isGeneratingReport ? <Icons.Refresh /> : <Icons.Print />}
                {activeTab === 'CONFIG' ? '印刷非対応' : isGeneratingReport ? 'AI分析中...' : 'このタブを印刷する'}
            </button>
          </header>

          <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('WIRES')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'WIRES' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  電線類 マスター
              </button>
              <button onClick={() => setActiveTab('CASTINGS')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CASTINGS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  非鉄類 マスター
              </button>
              <button onClick={() => setActiveTab('CLIENTS')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CLIENTS' ? 'bg-white border-t-2 border-t-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Users /> 顧客 マスター
              </button>
              <button onClick={() => setActiveTab('CONFIG')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CONFIG' ? 'bg-white border-t-2 border-t-gray-800 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Settings /> システム設定
              </button>
          </div>

          <div className="flex-1 bg-white border-x border-b border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
              
              {activeTab === 'WIRES' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                              <tr>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[10%]">ID</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[30%]">品名</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[15%] text-center">歩留設定 (%)</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[25%] text-right">参考単価 (円/kg)</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest w-[20%] text-center">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {wires.map((w: any) => {
                                  const isEditing = editingId === w.id;
                                  const calcPrice = Math.floor(copperPrice * (Number(w.ratio) / 100) * 0.85); // 85%掛けをマージンとする
                                  return (
                                      <tr key={w.id} className="hover:bg-gray-50 transition">
                                          <td className="p-3 font-mono text-xs text-gray-400">{w.id}</td>
                                          <td className="p-3 font-bold text-gray-900">{getDisplayName(w)}</td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <input type="number" className="w-20 border border-gray-300 p-1 text-center font-mono rounded-sm outline-none focus:border-[#D32F2F]" value={editValues.ratio || ''} onChange={(e)=>setEditValues({...editValues, ratio: e.target.value})} />
                                              ) : (
                                                  <span className="font-mono font-bold">{w.ratio} %</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-right">
                                              <span className="text-xs text-gray-400 mr-2">目安:</span>
                                              <span className="font-black text-[#D32F2F] text-lg tracking-tighter">¥{calcPrice.toLocaleString()}</span>
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <div className="flex gap-2 justify-center">
                                                      <button onClick={() => handleSave('Wires', w.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1 text-[10px] font-bold rounded-sm hover:bg-black transition"><Icons.Save /> 保存</button>
                                                      <button onClick={() => setEditingId(null)} className="text-gray-400 text-[10px] font-bold hover:text-gray-900">取消</button>
                                                  </div>
                                              ) : (
                                                  <button onClick={() => handleEdit(w)} className="text-gray-400 hover:text-gray-900 transition p-2"><Icons.Edit /></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {activeTab === 'CASTINGS' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                          <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                              <tr>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">品名</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">ベース建値</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">掛率 (%)</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">参考単価 (円/kg)</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {castings.map((c: any) => {
                                  let basePrice = copperPrice;
                                  let baseName = "銅";
                                  if (c.type === 'BRASS') { basePrice = brassPrice; baseName = "真鍮"; }
                                  if (c.type === 'ZINC') { basePrice = zincPrice; baseName = "亜鉛"; }
                                  if (c.type === 'LEAD') { basePrice = leadPrice; baseName = "鉛"; }
                                  
                                  const calcPrice = Math.floor(basePrice * (Number(c.ratio) / 100) * 0.90);
                                  return (
                                      <tr key={c.id} className="hover:bg-gray-50 transition">
                                          <td className="p-3 font-mono text-xs text-gray-400">{c.id}</td>
                                          <td className="p-3 font-bold text-gray-900">{c.name}</td>
                                          <td className="p-3 text-xs text-gray-500"><span className="bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm">{baseName}</span></td>
                                          <td className="p-3 text-center font-mono font-bold">{c.ratio} %</td>
                                          <td className="p-3 text-right">
                                              <span className="text-xs text-gray-400 mr-2">目安:</span>
                                              <span className="font-black text-gray-900 text-lg tracking-tighter">¥{calcPrice.toLocaleString()}</span>
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {activeTab === 'CLIENTS' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                          <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                              <tr>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">顧客名 / 代表者</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">ランク</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">連絡先</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">特記事項</th>
                                  <th className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">詳細</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {clients.map((client: any) => (
                                  <tr key={client.clientId} className="hover:bg-blue-50/30 transition cursor-pointer" onClick={() => onNavigate && onNavigate('CLIENT_DETAIL', client.companyName || client.name)}>
                                      <td className="p-3">
                                          <p className="font-bold text-gray-900">{client.companyName || client.name}</p>
                                          <p className="text-xs text-gray-500 mt-0.5">{client.representative || '-'}</p>
                                      </td>
                                      <td className="p-3 text-center">
                                          <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-xs font-black ${client.rank === 'S' ? 'bg-[#D32F2F] text-white' : client.rank === 'A' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>{client.rank || 'B'}</span>
                                      </td>
                                      <td className="p-3 text-xs font-mono text-gray-600">{client.phone || '-'}</td>
                                      <td className="p-3 text-xs text-gray-500 truncate max-w-[200px]">{client.note || '-'}</td>
                                      <td className="p-3 text-right">
                                          <Icons.ArrowRight />
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              )}

              {activeTab === 'CONFIG' && (
                  <div className="p-6 overflow-y-auto">
                      <div className="max-w-xl mx-auto space-y-6">
                          <div className="bg-gray-50 p-6 rounded-sm border border-gray-200">
                              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Icons.Settings /> 外部連携・相場設定</h3>
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                      <span className="text-xs font-bold text-gray-500">銅建値 (手動上書き用)</span>
                                      <span className="font-mono font-black text-lg">{copperPrice} 円/kg</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                      <span className="text-xs font-bold text-gray-500">為替レート (USD/JPY)</span>
                                      <span className="font-mono font-bold">{config.usdjpy || 150} 円</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                      <span className="text-xs font-bold text-gray-500">LME銅 3M</span>
                                      <span className="font-mono font-bold">{config.lme_copper_usd || 9000} USD/t</span>
                                  </div>
                              </div>
                          </div>
                          <p className="text-[10px] text-gray-400 text-center">※システム設定の変更はGoogle Spreadsheetの「Config」シートから行ってください。</p>
                      </div>
                  </div>
              )}

          </div>
      </div>

      {/* --- 🖨️ 印刷用レポート専用レイアウト (通常時は非表示) --- */}
      <div className="hidden print:block w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto font-sans">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
              <div>
                  <h1 className="text-3xl font-black font-serif tracking-widest">
                      {activeTab === 'WIRES' || activeTab === 'CASTINGS' ? '本日の買取価格表' : 
                       activeTab === 'CLIENTS' ? '顧客ディレクトリ (社内秘)' : 'システムレポート'}
                  </h1>
                  <p className="text-sm font-bold text-gray-600 mt-2">株式会社月寒製作所 苫小牧工場</p>
              </div>
              <div className="text-right">
                  <p className="text-lg font-bold font-mono">{new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}</p>
              </div>
          </div>

          {/* AIサマリーセクション */}
          <section className="mb-8 border-2 border-black p-6 rounded-sm bg-gray-50">
              <h2 className="text-lg font-black text-black flex items-center gap-2 mb-4">
                  <Icons.Brain /> 本日の相場概況とインサイト
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-bold text-gray-800">
                  {aiSummary || "（データ処理中です...）"}
              </div>
          </section>

          {/* 動的テーブル出力 (開いているタブに応じて切り替え) */}
          {(activeTab === 'WIRES' || activeTab === 'CASTINGS') && (
              <div className="mb-8">
                  <div className="flex justify-between text-sm font-bold bg-black text-white px-4 py-2 mb-4">
                      <span>基準相場: 銅建値 {copperPrice}円/kg | 真鍮建値 {brassPrice}円/kg | 亜鉛建値 {zincPrice}円/kg</span>
                  </div>
                  <table className="w-full text-left border-collapse text-sm">
                      <thead>
                          <tr className="border-b-2 border-black text-xs">
                              <th className="py-2 w-[40%]">品目名</th>
                              <th className="py-2 text-center w-[20%]">評価ベース</th>
                              <th className="py-2 text-center w-[20%]">歩留/掛率</th>
                              <th className="py-2 text-right w-[20%]">参考買取単価</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                          {activeTab === 'WIRES' ? wires.map((w:any) => (
                              <tr key={w.id} className="py-1">
                                  <td className="py-2 font-bold">{getDisplayName(w)}</td>
                                  <td className="py-2 text-center text-gray-600">銅</td>
                                  <td className="py-2 text-center font-mono">{w.ratio}%</td>
                                  <td className="py-2 text-right font-black font-mono">¥{Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()} /kg</td>
                              </tr>
                          )) : castings.map((c:any) => (
                              <tr key={c.id} className="py-1">
                                  <td className="py-2 font-bold">{c.name}</td>
                                  <td className="py-2 text-center text-gray-600">{c.type === 'BRASS' ? '真鍮' : c.type === 'ZINC' ? '亜鉛' : c.type === 'LEAD' ? '鉛' : '銅'}</td>
                                  <td className="py-2 text-center font-mono">{c.ratio}%</td>
                                  <td className="py-2 text-right font-black font-mono">
                                      ¥{Math.floor((c.type === 'BRASS' ? brassPrice : c.type === 'ZINC' ? zincPrice : c.type === 'LEAD' ? leadPrice : copperPrice) * (c.ratio/100) * 0.90).toLocaleString()} /kg
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
                  <p className="text-[10px] text-gray-500 text-right mt-2">※上記単価はあくまで目安であり、持ち込み量やダストの有無により変動します。</p>
              </div>
          )}

          {activeTab === 'CLIENTS' && (
              <div className="mb-8">
                  <table className="w-full text-left border-collapse text-sm">
                      <thead>
                          <tr className="border-b-2 border-black text-xs">
                              <th className="py-2 w-[40%]">顧客・企業名</th>
                              <th className="py-2 text-center w-[10%]">ランク</th>
                              <th className="py-2 w-[25%]">連絡先</th>
                              <th className="py-2 w-[25%]">特記事項</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                          {clients.map((c:any) => (
                              <tr key={c.clientId} className="py-1">
                                  <td className="py-2 font-bold">{c.companyName || c.name}</td>
                                  <td className="py-2 text-center font-black">{c.rank || 'B'}</td>
                                  <td className="py-2 font-mono text-xs">{c.phone || '-'}</td>
                                  <td className="py-2 text-xs text-gray-600 truncate">{c.note || '-'}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

      </div>
    </div>
  );
};