// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Save: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Camera: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Upload: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
  ImagePlaceholder: () => <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

// ★ プロベナンス・バッジ（白抜き・グレー濃淡）
const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'CO_OP': return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-gray-400`} title="AI予測・推論データ">AI</span>;
        default: return null;
    }
};

const ROLE_OPTIONS = [
  { value: 'SUPPLIER', short: '仕入先', label: '仕入先 (原料供給)', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'BUYER', short: '売却先', label: '売却先 (出荷・エンド)', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'PARTNER', short: 'パートナー', label: 'パートナー (相互融通・産廃等)', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'COMPETITOR', short: '競合', label: '競合他社 (相場監視)', color: 'bg-gray-100 text-gray-800 border-gray-300' },
  { value: 'SYSTEM_PARTNER', short: 'システム', label: 'システム・開発', color: 'bg-gray-100 text-gray-800 border-gray-300' }
];

export const AdminDatabase = ({ data, onNavigate }: { data: any, onNavigate?: any }) => {
  const [activeTab, setActiveTab] = useState<'WIRES' | 'CASTINGS' | 'CLIENTS' | 'CONFIG'>('WIRES');
  const [showAiData, setShowAiData] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [addingTab, setAddingTab] = useState<string | null>(null);
  const [addValues, setAddValues] = useState<any>({});
  
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

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

  const isAiGenerated = (item: any) => {
      if (item.source === 'AI' || item.source === 'AI_AUTO') return true;
      if (item.memo && String(item.memo).includes('AI')) return true;
      return false;
  };

  const filteredWires = wires.filter(w => showAiData ? true : !isAiGenerated(w));
  const filteredCastings = castings.filter(c => showAiData ? true : !isAiGenerated(c));
  const filteredClients = clients.filter(c => showAiData ? true : !isAiGenerated(c));

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
      return name;
  };

  const handleEdit = (item: any) => {
      setEditingId(item.id || item.clientId || null);
      setEditValues({ ...item });
      setAddingTab(null);
  };

  const handleCancel = () => {
      setEditingId(null);
      setAddingTab(null);
      setEditValues({});
      setAddValues({});
  };

  // ★ 画像アップロード処理 (Google Driveへ保存し、URLを取得)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, colIndex: number) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
          alert('ファイルサイズは5MB以下にしてください。');
          return;
      }
      
      setUploadingField(fieldName);
      const reader = new FileReader();
      reader.onload = async (ev) => {
          const base64Data = (ev.target?.result as string).split(',')[1];
          const payload = {
              action: 'UPLOAD_IMAGE',
              sheetName: 'Products_Wire',
              recordId: editingId,
              colIndex: colIndex, 
              fileName: `${editingId}_${fieldName}_${file.name}`,
              mimeType: file.type,
              data: base64Data
          };
          try {
              const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              const result = await res.json();
              if (result.status === 'success') {
                  setEditValues(prev => ({ ...prev, [fieldName]: result.url }));
              } else {
                  alert('アップロード失敗: ' + result.message);
              }
          } catch (err) {
              alert('通信エラーが発生しました');
          }
          setUploadingField(null);
      };
      reader.readAsDataURL(file);
  };

  const handleSave = async (sheetName: string, id: string) => {
      setIsSaving(true);
      try {
          let updates = {};
          if (sheetName === 'Products_Wire') {
              updates = { 
                  2: editValues.name, 
                  4: editValues.sq, 
                  7: editValues.core, 
                  9: editValues.ratio 
              };
          } else if (sheetName === 'Products_Casting') {
              updates = { 1: editValues.name, 2: editValues.type, 4: editValues.ratio };
          } else if (sheetName === 'Clients') {
              updates = { 
                  1: editValues.companyName || editValues.name,
                  2: editValues.rank, 
                  4: editValues.phone,
                  8: editValues.memo, 
                  9: editValues.address,
                  10: editValues.industry,
                  11: editValues.businessRole
              };
          }

          const payload = { action: 'UPDATE_DB_RECORD', sheetName, recordId: id, updates };
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

  const handleAdd = async (sheetName: string) => {
      setIsSaving(true);
      try {
          const payload = { action: 'ADD_DB_RECORD', sheetName, data: addValues };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { setAddingTab(null); window.location.reload(); }
          else { alert('エラー: ' + result.message); }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  const handleDelete = async (sheetName: string, id: string) => {
      if(!window.confirm('本当にこのデータを削除しますか？\n（※この操作は取り消せません）')) return;
      setIsSaving(true);
      try {
          const payload = { action: 'DELETE_DB_RECORD', sheetName, recordId: id };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { window.location.reload(); }
          else { alert('エラー: ' + result.message); }
      } catch(e) { alert('通信エラーが発生しました'); }
      setIsSaving(false);
  };

  const handlePrintReport = async () => {
      setIsGeneratingReport(true);
      let promptData = '';
      let pageName = '';

      if (activeTab === 'WIRES' || activeTab === 'CASTINGS') {
          pageName = '本日の買取価格表（マスタ一覧）';
          promptData = `
          ・データモード: ${showAiData ? 'AI予測データ含む' : '実測確定データのみ'}
          ・本日の銅建値: ${copperPrice} 円/kg
          ・本日の真鍮建値: ${brassPrice} 円/kg
          ・登録されている電線類: ${filteredWires.length} 品目
          ・登録されている非鉄類: ${filteredCastings.length} 品目
          ※顧客に提示・配布するための相場表です。現在の相場動向に対する一言を添えてください。
          `;
      } else if (activeTab === 'CLIENTS') {
          pageName = '顧客ディレクトリ（名簿）';
          promptData = `
          ・データモード: ${showAiData ? 'AI予測データ含む' : '実測確定データのみ'}
          ・現在の登録顧客数: ${filteredClients.length} 社
          ・ランクS顧客: ${filteredClients.filter((c:any)=>c.rank==='S').length} 社
          ・ランクA顧客: ${filteredClients.filter((c:any)=>c.rank==='A').length} 社
          ※社内管理用の顧客リストです。上位顧客の割合などから今後の営業戦略に対する一言を添えてください。
          `;
      } else {
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
              setTimeout(() => { window.print(); setIsGeneratingReport(false); }, 500);
          } else {
              alert('AI要約の生成に失敗しました'); setIsGeneratingReport(false);
          }
      } catch(e) { alert('通信エラー'); setIsGeneratingReport(false); }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans max-w-7xl mx-auto w-full relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      <div className="print:hidden flex flex-col h-full">
          <header className="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4 flex-shrink-0">
            <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                    <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                    マスターDB管理
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">DATABASE & SETTINGS</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-gray-300 shadow-sm">
                    <button onClick={() => setShowAiData(true)} className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>MIX</button>
                    <button onClick={() => setShowAiData(false)} className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${!showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>HUMAN ONLY</button>
                </div>
                <button onClick={handlePrintReport} disabled={isGeneratingReport || activeTab === 'CONFIG'} className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
                    {isGeneratingReport ? <Icons.Refresh /> : <Icons.Print />}
                    {activeTab === 'CONFIG' ? '印刷非対応' : isGeneratingReport ? 'AI分析中...' : 'このタブを印刷する'}
                </button>
            </div>
          </header>

          <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto no-scrollbar">
              <button onClick={() => {setActiveTab('WIRES'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'WIRES' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  電線類 マスター
              </button>
              <button onClick={() => {setActiveTab('CASTINGS'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CASTINGS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  非鉄類 マスター
              </button>
              <button onClick={() => {setActiveTab('CLIENTS'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CLIENTS' ? 'bg-white border-t-2 border-t-blue-600 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Users /> 顧客・ロール管理
              </button>
              <button onClick={() => {setActiveTab('CONFIG'); handleCancel();}} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'CONFIG' ? 'bg-white border-t-2 border-t-gray-800 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Settings /> システム設定
              </button>
          </div>

          <div className="flex-1 bg-white border-x border-b border-gray-200 shadow-sm flex flex-col min-h-[500px] overflow-hidden">
              
              {/* ================= WIRES TAB ================= */}
              {activeTab === 'WIRES' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0 relative">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-end z-20">
                          <button onClick={() => { setAddingTab('WIRES'); setEditingId(null); setAddValues({}); }} className="bg-[#111] text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center shadow-sm hover:bg-[#D32F2F] transition">
                              <Icons.Plus /> 新規追加
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 w-[10%]">ID</th>
                                  <th className="p-3 w-[30%]">品名・詳細</th>
                                  <th className="p-3 w-[20%]">登録画像</th>
                                  <th className="p-3 w-[10%] text-center">歩留設定</th>
                                  <th className="p-3 w-[15%] text-right">参考単価</th>
                                  <th className="p-3 w-[15%] text-center">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {addingTab === 'WIRES' && (
                                  <tr className="bg-blue-50/30 border-b-2 border-blue-200">
                                      <td className="p-3 font-mono text-xs text-blue-400 font-bold">NEW</td>
                                      <td className="p-3 flex gap-2">
                                          <input type="text" placeholder="品名 (例: CV線)" value={addValues.name || ''} onChange={e => setAddValues({...addValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                          <input type="text" placeholder="sq" value={addValues.sq || ''} onChange={e => setAddValues({...addValues, sq: e.target.value})} className="w-12 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                          <input type="text" placeholder="C" value={addValues.core || ''} onChange={e => setAddValues({...addValues, core: e.target.value})} className="w-12 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-[#D32F2F]" />
                                      </td>
                                      <td className="p-3 text-[10px] text-gray-400">※画像は登録後に追加可能</td>
                                      <td className="p-3 text-center">
                                          <input type="number" placeholder="歩留" value={addValues.ratio || ''} onChange={e => setAddValues({...addValues, ratio: e.target.value})} className="w-16 p-1.5 border border-gray-300 rounded-sm text-xs text-center font-mono outline-none focus:border-[#D32F2F]" />
                                      </td>
                                      <td className="p-3 text-right text-gray-400">-</td>
                                      <td className="p-3 text-center">
                                          <div className="flex gap-2 justify-center">
                                              <button onClick={() => handleAdd('Products_Wire')} disabled={isSaving || !addValues.name || !addValues.ratio} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-black transition disabled:opacity-50 shadow-sm"><Icons.Save /> 登録</button>
                                              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 text-[10px] font-bold">取消</button>
                                          </div>
                                      </td>
                                  </tr>
                              )}
                              
                              {filteredWires.map((w: any) => {
                                  const isEditing = editingId === w.id;
                                  const isAi = isAiGenerated(w);
                                  const calcPrice = Math.floor(copperPrice * (Number(w.ratio) / 100) * 0.85);
                                  
                                  return (
                                      <React.Fragment key={w.id}>
                                          <tr className={`hover:bg-gray-50 transition ${isEditing ? 'bg-red-50/10' : ''}`}>
                                              <td className="p-3 font-mono text-xs text-gray-400">{w.id}</td>
                                              <td className="p-3">
                                                  {isEditing ? (
                                                      <div className="flex gap-2">
                                                          <input type="text" value={editValues.name || ''} onChange={e => setEditValues({...editValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-gray-900" placeholder="品名" />
                                                          <input type="text" value={editValues.sq || ''} onChange={e => setEditValues({...editValues, sq: e.target.value})} className="w-12 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900" placeholder="sq" />
                                                          <input type="text" value={editValues.core || ''} onChange={e => setEditValues({...editValues, core: e.target.value})} className="w-12 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900" placeholder="C" />
                                                      </div>
                                                  ) : (
                                                      <div className="flex items-center gap-2">
                                                          <span className="font-bold text-gray-900">{getDisplayName(w)}</span>
                                                          <ProvenanceBadge type={isAi ? 'AI_AUTO' : 'HUMAN'} />
                                                      </div>
                                                  )}
                                              </td>
                                              
                                              {/* ★ 画像サムネイル表示領域 */}
                                              <td className="p-3">
                                                  <div className="flex gap-1.5">
                                                      {[w.image1, w.image2, w.image3].map((imgUrl, idx) => (
                                                          imgUrl ? (
                                                              <a key={idx} href={imgUrl} target="_blank" rel="noopener noreferrer" className="block w-8 h-8 rounded-sm overflow-hidden border border-gray-300 shadow-sm hover:border-[#D32F2F] hover:scale-150 transform transition-all z-10 hover:z-50 relative">
                                                                  <img src={imgUrl} alt={`wire_img_${idx}`} className="w-full h-full object-cover" />
                                                              </a>
                                                          ) : (
                                                              <div key={idx} className="w-8 h-8 rounded-sm border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 opacity-50">
                                                                  <Icons.ImagePlaceholder />
                                                              </div>
                                                          )
                                                      ))}
                                                  </div>
                                              </td>

                                              <td className="p-3 text-center">
                                                  {isEditing ? (
                                                      <input type="number" className="w-16 border border-gray-900 p-1.5 text-center font-mono font-bold text-gray-900 rounded-sm outline-none focus:border-[#D32F2F]" value={editValues.ratio || ''} onChange={(e)=>setEditValues({...editValues, ratio: e.target.value})} />
                                                  ) : (
                                                      <span className="font-mono font-bold text-gray-800">{w.ratio} %</span>
                                                  )}
                                              </td>
                                              <td className="p-3 text-right">
                                                  <span className="text-xs text-gray-400 mr-2">目安:</span>
                                                  <span className="font-black text-[#D32F2F] text-lg tracking-tighter">¥{calcPrice.toLocaleString()}</span>
                                              </td>
                                              <td className="p-3 text-center">
                                                  {isEditing ? (
                                                      <div className="flex gap-2 justify-center">
                                                          <button onClick={() => handleSave('Products_Wire', w.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-black transition shadow-sm"><Icons.Save /> 保存</button>
                                                          <button onClick={() => handleDelete('Products_Wire', w.id)} disabled={isSaving} className="bg-white text-gray-600 border border-gray-300 px-2 py-1.5 text-[10px] font-bold rounded-sm hover:bg-red-50 hover:text-[#D32F2F] transition shadow-sm"><Icons.Trash /></button>
                                                          <button onClick={handleCancel} className="text-gray-400 text-[10px] font-bold hover:text-gray-900">取消</button>
                                                      </div>
                                                  ) : (
                                                      <button onClick={() => handleEdit(w)} className="text-gray-400 hover:text-gray-900 transition p-2 bg-white rounded-sm border border-gray-200 shadow-sm"><Icons.Edit /></button>
                                                  )}
                                              </td>
                                          </tr>

                                          {/* ★ 画像アップロード拡張UI (編集時のみ行の下に展開) */}
                                          {isEditing && (
                                              <tr className="bg-gray-50/50 border-b-2 border-gray-200">
                                                  <td colSpan={6} className="p-4 pt-0">
                                                      <div className="flex flex-col bg-white p-4 border border-gray-200 rounded-sm shadow-inner mt-2">
                                                          <span className="text-xs font-bold text-gray-500 mb-3 flex items-center gap-1">
                                                              <Icons.Camera /> 画像データ (AI教師データとしてGoogle Driveへ保存)
                                                          </span>
                                                          <div className="flex gap-4">
                                                              {[1, 2, 3].map(num => {
                                                                  const field = `image${num}`;
                                                                  const url = editValues[field];
                                                                  const isUploading = uploadingField === field;
                                                                  // ★ L列(11), M列(12), N列(13) に対応
                                                                  const colIndex = 10 + num; 
                                                                  return (
                                                                      <div key={num} className="flex flex-col gap-1">
                                                                          <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Image {num}</span>
                                                                          <div className={`w-28 h-28 bg-gray-50 border-2 border-dashed ${url ? 'border-gray-300' : 'border-gray-300 hover:border-gray-500'} rounded-sm flex flex-col items-center justify-center relative overflow-hidden group transition-colors cursor-pointer`}>
                                                                              {isUploading ? (
                                                                                  <div className="text-gray-900 animate-spin"><Icons.Refresh /></div>
                                                                              ) : url ? (
                                                                                  <>
                                                                                      <img src={url} alt={`img${num}`} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                                                                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/40">
                                                                                          <Icons.Upload />
                                                                                      </div>
                                                                                  </>
                                                                              ) : (
                                                                                  <>
                                                                                      <Icons.Plus />
                                                                                      <span className="text-[10px] text-gray-400 font-bold mt-1">Upload</span>
                                                                                  </>
                                                                              )}
                                                                              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, field, colIndex)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title={`画像${num}をアップロード`} disabled={isUploading} />
                                                                          </div>
                                                                      </div>
                                                                  )
                                                              })}
                                                          </div>
                                                      </div>
                                                  </td>
                                              </tr>
                                          )}
                                      </React.Fragment>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* ================= CASTINGS TAB ================= */}
              {activeTab === 'CASTINGS' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0 relative">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-end z-20">
                          <button onClick={() => { setAddingTab('CASTINGS'); setEditingId(null); setAddValues({}); }} className="bg-[#111] text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center shadow-sm hover:bg-[#D32F2F] transition">
                              <Icons.Plus /> 新規追加
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 w-[10%]">ID</th>
                                  <th className="p-3 w-[30%]">品名</th>
                                  <th className="p-3 w-[15%]">ベース</th>
                                  <th className="p-3 w-[15%] text-center">掛率 (%)</th>
                                  <th className="p-3 w-[15%] text-right">参考単価</th>
                                  <th className="p-3 w-[15%] text-center">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {addingTab === 'CASTINGS' && (
                                  <tr className="bg-blue-50/30 border-b-2 border-blue-200">
                                      <td className="p-3 font-mono text-xs text-blue-400 font-bold">NEW</td>
                                      <td className="p-3">
                                          <input type="text" placeholder="品名 (例: 砲金)" value={addValues.name || ''} onChange={e => setAddValues({...addValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900" />
                                      </td>
                                      <td className="p-3">
                                          <select value={addValues.type || 'COPPER'} onChange={e => setAddValues({...addValues, type: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900">
                                              <option value="COPPER">銅</option>
                                              <option value="BRASS">真鍮</option>
                                              <option value="ZINC">亜鉛</option>
                                              <option value="LEAD">鉛</option>
                                          </select>
                                      </td>
                                      <td className="p-3 text-center">
                                          <input type="number" placeholder="掛率" value={addValues.ratio || ''} onChange={e => setAddValues({...addValues, ratio: e.target.value})} className="w-20 p-1.5 border border-gray-300 rounded-sm text-xs text-center font-mono outline-none focus:border-gray-900" />
                                      </td>
                                      <td className="p-3 text-right text-gray-400">-</td>
                                      <td className="p-3 text-center flex gap-2 justify-center">
                                          <button onClick={() => handleAdd('Products_Casting')} disabled={isSaving || !addValues.name || !addValues.ratio} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-black transition disabled:opacity-50 shadow-sm"><Icons.Save /> 登録</button>
                                          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 text-[10px] font-bold">取消</button>
                                      </td>
                                  </tr>
                              )}

                              {filteredCastings.map((c: any) => {
                                  const isEditing = editingId === c.id;
                                  const isAi = isAiGenerated(c);
                                  let basePrice = copperPrice; let baseName = "銅";
                                  if (c.type === 'BRASS') { basePrice = brassPrice; baseName = "真鍮"; }
                                  if (c.type === 'ZINC') { basePrice = zincPrice; baseName = "亜鉛"; }
                                  if (c.type === 'LEAD') { basePrice = leadPrice; baseName = "鉛"; }
                                  const calcPrice = Math.floor(basePrice * (Number(c.ratio) / 100) * 0.90);
                                  
                                  return (
                                      <tr key={c.id} className={`hover:bg-gray-50 transition ${isEditing ? 'bg-red-50/10' : ''}`}>
                                          <td className="p-3 font-mono text-xs text-gray-400">{c.id}</td>
                                          <td className="p-3">
                                              {isEditing ? (
                                                  <input type="text" value={editValues.name || ''} onChange={e => setEditValues({...editValues, name: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-gray-900" />
                                              ) : (
                                                  <div className="flex items-center gap-2">
                                                      <span className="font-bold text-gray-900">{c.name}</span>
                                                      <ProvenanceBadge type={isAi ? 'AI_AUTO' : 'HUMAN'} />
                                                  </div>
                                              )}
                                          </td>
                                          <td className="p-3 text-xs text-gray-500">
                                              {isEditing ? (
                                                  <select value={editValues.type || ''} onChange={e => setEditValues({...editValues, type: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm outline-none focus:border-gray-900">
                                                      <option value="COPPER">銅</option>
                                                      <option value="BRASS">真鍮</option>
                                                      <option value="ZINC">亜鉛</option>
                                                      <option value="LEAD">鉛</option>
                                                  </select>
                                              ) : (
                                                  <span className="bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm">{baseName}</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <input type="number" value={editValues.ratio || ''} onChange={e => setEditValues({...editValues, ratio: e.target.value})} className="w-20 p-1.5 border border-gray-900 text-center font-mono font-bold text-gray-900 rounded-sm outline-none focus:border-[#D32F2F]" />
                                              ) : (
                                                  <span className="font-mono font-bold">{c.ratio} %</span>
                                              )}
                                          </td>
                                          <td className="p-3 text-right">
                                              <span className="text-xs text-gray-400 mr-2">目安:</span>
                                              <span className="font-black text-gray-900 text-lg tracking-tighter">¥{calcPrice.toLocaleString()}</span>
                                          </td>
                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <div className="flex gap-2 justify-center">
                                                      <button onClick={() => handleSave('Products_Casting', c.id)} disabled={isSaving} className="bg-gray-900 text-white px-3 py-1.5 text-[10px] font-bold rounded-sm hover:bg-black transition shadow-sm"><Icons.Save /> 保存</button>
                                                      <button onClick={() => handleDelete('Products_Casting', c.id)} disabled={isSaving} className="bg-white text-gray-600 border border-gray-300 px-2 py-1.5 text-[10px] font-bold rounded-sm hover:bg-red-50 hover:text-[#D32F2F] transition shadow-sm"><Icons.Trash /></button>
                                                      <button onClick={handleCancel} className="text-gray-400 text-[10px] font-bold hover:text-gray-900">取消</button>
                                                  </div>
                                              ) : (
                                                  <button onClick={() => handleEdit(c)} className="text-gray-400 hover:text-gray-900 transition p-2 bg-white rounded-sm border border-gray-200 shadow-sm"><Icons.Edit /></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* ================= CLIENTS TAB ================= */}
              {activeTab === 'CLIENTS' && (
                  <div className="flex-1 overflow-y-auto overflow-x-auto p-0 relative">
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-end z-20">
                          <button onClick={() => { setAddingTab('CLIENTS'); setEditingId(null); setAddValues({}); }} className="bg-[#111] text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center shadow-sm hover:bg-[#D32F2F] transition">
                              <Icons.Plus /> 新規顧客の登録
                          </button>
                      </div>
                      <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              <tr>
                                  <th className="p-3 w-[25%]">顧客・企業情報</th>
                                  <th className="p-3 w-[10%] text-center">ランク</th>
                                  <th className="p-3 w-[25%]">役割 (Roles)</th>
                                  <th className="p-3 w-[25%]">エリア / 特記事項</th>
                                  <th className="p-3 w-[15%] text-right">操作</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm">
                              {/* 新規追加フォーム行 */}
                              {addingTab === 'CLIENTS' && (
                                  <tr className="bg-blue-50/30 border-b-2 border-blue-200">
                                      <td className="p-3">
                                          <input type="text" placeholder="企業名" value={addValues.name || ''} onChange={e => setAddValues({...addValues, name: e.target.value})} className="w-full mb-1 p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-gray-900" />
                                          <input type="text" placeholder="電話番号" value={addValues.phone || ''} onChange={e => setAddValues({...addValues, phone: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-mono outline-none focus:border-gray-900" />
                                      </td>
                                      <td className="p-3 text-center">
                                          <select value={addValues.rank || 'B'} onChange={e => setAddValues({...addValues, rank: e.target.value})} className="bg-white border border-gray-300 p-1.5 rounded-sm text-xs font-bold outline-none shadow-sm">
                                              <option value="S">S</option>
                                              <option value="A">A</option>
                                              <option value="B">B</option>
                                          </select>
                                      </td>
                                      <td className="p-3">
                                          <div className="flex flex-col gap-1 p-2 bg-white border border-gray-200 shadow-inner rounded-sm">
                                              {ROLE_OPTIONS.map(opt => {
                                                  const currentRoles = addValues.businessRole ? addValues.businessRole.split(',') : [];
                                                  const isChecked = currentRoles.includes(opt.value);
                                                  return (
                                                      <label key={opt.value} className="flex items-center gap-2 text-[10px] font-bold cursor-pointer">
                                                          <input type="checkbox" checked={isChecked} onChange={() => {
                                                              let newRoles = [...currentRoles];
                                                              if (isChecked) newRoles = newRoles.filter(r => r !== opt.value);
                                                              else newRoles.push(opt.value);
                                                              setAddValues({...addValues, businessRole: newRoles.join(',')});
                                                          }} className="accent-gray-900" />
                                                          {opt.label}
                                                      </label>
                                                  );
                                              })}
                                          </div>
                                      </td>
                                      <td className="p-3">
                                          <input type="text" placeholder="所在地" value={addValues.address || ''} onChange={e => setAddValues({...addValues, address: e.target.value})} className="w-full mb-1 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900" />
                                          <input type="text" placeholder="業種" value={addValues.industry || ''} onChange={e => setAddValues({...addValues, industry: e.target.value})} className="w-full mb-1 p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900" />
                                          <input type="text" placeholder="メモ" value={addValues.memo || ''} onChange={e => setAddValues({...addValues, memo: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900" />
                                      </td>
                                      <td className="p-3 text-right">
                                          <div className="flex flex-col gap-2 items-end">
                                              <button onClick={() => handleAdd('Clients')} disabled={isSaving || !addValues.name} className="bg-gray-900 text-white px-4 py-2 text-[10px] font-bold rounded-sm hover:bg-black transition shadow-sm w-full"><Icons.Save /> 登録</button>
                                              <button onClick={handleCancel} className="text-gray-500 hover:text-gray-900 text-[10px] font-bold w-full">取消</button>
                                          </div>
                                      </td>
                                  </tr>
                              )}

                              {filteredClients.length === 0 && (
                                  <tr><td colSpan={5} className="p-16 text-center text-sm text-gray-400 font-bold bg-white">表示するデータがありません</td></tr>
                              )}

                              {filteredClients.map((c:any) => {
                                  const isEditing = editingId === (c.id || c.clientId);
                                  const isAi = isAiGenerated(c);
                                  const currentRoles = (isEditing ? editValues.businessRole : c.businessRole) || '';
                                  const rolesArray = currentRoles.split(/[,/，、]+/).map((r:string) => r.trim()).filter(Boolean);

                                  return (
                                      <tr key={c.id || c.clientId} className={`hover:bg-gray-50 transition ${isEditing ? 'bg-red-50/10' : ''}`}>
                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="space-y-1.5">
                                                      <input type="text" value={editValues.companyName || editValues.name || ''} onChange={e => setEditValues({...editValues, companyName: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-bold outline-none focus:border-gray-900" placeholder="企業名" />
                                                      <input type="text" value={editValues.phone || ''} onChange={e => setEditValues({...editValues, phone: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs font-mono outline-none focus:border-gray-900" placeholder="連絡先" />
                                                  </div>
                                              ) : (
                                                  <div className="cursor-pointer" onClick={() => !isEditing && onNavigate && onNavigate('CLIENT_DETAIL', c.companyName || c.name)}>
                                                      <div className="flex items-center gap-2">
                                                          <p className="font-bold text-gray-900 hover:text-[#D32F2F] transition-colors">{c.companyName || c.name}</p>
                                                          <ProvenanceBadge type={isAi ? 'AI_AUTO' : 'HUMAN'} />
                                                      </div>
                                                      <p className="text-[10px] font-mono text-gray-500 mt-1">{c.phone || '-'}</p>
                                                  </div>
                                              )}
                                          </td>

                                          <td className="p-3 text-center">
                                              {isEditing ? (
                                                  <select value={editValues.rank || 'B'} onChange={e => setEditValues({...editValues, rank: e.target.value})} className="bg-white border border-gray-300 p-1.5 rounded-sm text-xs font-bold outline-none shadow-sm">
                                                      <option value="S">S</option>
                                                      <option value="A">A</option>
                                                      <option value="B">B</option>
                                                  </select>
                                              ) : (
                                                  <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-xs font-black ${c.rank === 'S' ? 'bg-[#D32F2F] text-white' : c.rank === 'A' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>{c.rank || 'B'}</span>
                                              )}
                                          </td>

                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="flex flex-col gap-1 p-2 bg-gray-50 border border-gray-200 shadow-inner rounded-sm">
                                                      {ROLE_OPTIONS.map(opt => {
                                                          const isChecked = rolesArray.includes(opt.value);
                                                          return (
                                                              <label key={opt.value} className={`flex items-center gap-2 text-xs font-bold cursor-pointer px-2 py-1.5 rounded-sm border transition-colors ${isChecked ? 'bg-white border-gray-400 text-gray-900 shadow-sm' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-100'}`}>
                                                                  <input type="checkbox" checked={isChecked} onChange={() => {
                                                                      let newRoles = [...rolesArray];
                                                                      if (isChecked) newRoles = newRoles.filter(r => r !== opt.value);
                                                                      else newRoles.push(opt.value);
                                                                      setEditValues({...editValues, businessRole: newRoles.join(',')});
                                                                  }} className="accent-gray-900 w-4 h-4" />
                                                                  <span className={`px-2 py-0.5 rounded-sm border text-[10px] ${opt.color}`}>{opt.short}</span>
                                                                  <span className="text-[10px] font-normal text-gray-500">{opt.label.replace(opt.short, '').trim()}</span>
                                                              </label>
                                                          );
                                                      })}
                                                  </div>
                                              ) : (
                                                  <div className="flex flex-wrap gap-1.5">
                                                      {rolesArray.length > 0 ? rolesArray.map((roleStr: string, i: number) => {
                                                          const matchedOption = ROLE_OPTIONS.find(opt => opt.value === roleStr);
                                                          const colorClass = matchedOption ? matchedOption.color : 'bg-gray-100 text-gray-600 border-gray-200';
                                                          const label = matchedOption ? matchedOption.short : roleStr;
                                                          return <span key={i} className={`text-[10px] px-2 py-1 border rounded-sm font-bold shadow-sm ${colorClass}`}>{label}</span>;
                                                      }) : <span className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded-sm">未設定</span>}
                                                  </div>
                                              )}
                                          </td>

                                          <td className="p-3">
                                              {isEditing ? (
                                                  <div className="space-y-1.5">
                                                      <input type="text" value={editValues.address || ''} onChange={e => setEditValues({...editValues, address: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900 shadow-sm" placeholder="所在地" />
                                                      <input type="text" value={editValues.industry || ''} onChange={e => setEditValues({...editValues, industry: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900 shadow-sm" placeholder="業種" />
                                                      <input type="text" value={editValues.memo || ''} onChange={e => setEditValues({...editValues, memo: e.target.value})} className="w-full p-1.5 border border-gray-300 rounded-sm text-xs outline-none focus:border-gray-900 shadow-sm" placeholder="特記事項..." />
                                                  </div>
                                              ) : (
                                                  <div>
                                                      <p className="text-[10px] text-gray-400 truncate mb-1">{c.address || ''} {c.industry ? `(${c.industry})` : ''}</p>
                                                      <p className="text-xs text-gray-700 font-medium truncate max-w-[200px] xl:max-w-[250px]">{c.memo || '-'}</p>
                                                  </div>
                                              )}
                                          </td>

                                          <td className="p-3 text-right">
                                              {isEditing ? (
                                                  <div className="flex flex-col gap-2 items-end">
                                                      <button onClick={() => handleSave('Clients', c.id || c.clientId)} disabled={isSaving} className="bg-gray-900 text-white px-4 py-2 text-[10px] font-bold rounded-sm hover:bg-black transition flex items-center justify-center gap-1 shadow-sm w-full"><Icons.Save /> 保存</button>
                                                      <div className="flex w-full gap-2">
                                                          <button onClick={() => handleDelete('Clients', c.id || c.clientId)} disabled={isSaving} className="bg-white text-gray-600 border border-gray-300 py-1.5 text-[10px] font-bold rounded-sm hover:bg-red-50 hover:text-[#D32F2F] transition shadow-sm w-1/2 flex justify-center"><Icons.Trash /></button>
                                                          <button onClick={handleCancel} className="text-gray-500 bg-gray-100 border border-gray-200 py-1.5 text-[10px] font-bold hover:bg-gray-200 transition rounded-sm w-1/2">取消</button>
                                                      </div>
                                                  </div>
                                              ) : (
                                                  <button onClick={(e) => { e.stopPropagation(); handleEdit(c); }} className="text-gray-400 hover:text-gray-900 transition p-2 bg-white rounded-sm border border-gray-200 shadow-sm"><Icons.Edit /></button>
                                              )}
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* ================= CONFIG TAB ================= */}
              {activeTab === 'CONFIG' && (
                  <div className="p-6 overflow-y-auto relative">
                      <div className="absolute top-6 right-6"><ProvenanceBadge type="HUMAN" /></div>
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
                          <p className="text-[10px] text-gray-400 text-center">※システム設定の詳細な変更はGoogle Spreadsheetの「Config」シートから行ってください。</p>
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
                  <p className="text-xs font-bold bg-black text-white px-2 py-0.5 inline-block mt-1">
                      {showAiData ? 'MIX (AI予測 + 実測)' : 'HUMAN ONLY (実測確定のみ)'}
                  </p>
              </div>
          </div>

          <section className="mb-8 border-2 border-black p-6 rounded-sm bg-gray-50 relative">
              {showAiData && <div className="absolute top-2 right-2"><ProvenanceBadge type="AI_AUTO" /></div>}
              <h2 className="text-lg font-black text-black flex items-center gap-2 mb-4">
                  <Icons.Brain /> 本日の相場概況とインサイト
              </h2>
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-bold text-gray-800">
                  {showAiData ? (aiSummary || "（データ処理中です...）") : "※AI予測モードがOFFのため、インサイトは表示されません。"}
              </div>
          </section>

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
                          {activeTab === 'WIRES' ? filteredWires.map((w:any) => (
                              <tr key={w.id} className="py-1">
                                  <td className="py-2 font-bold">{getDisplayName(w)} {isAiGenerated(w) && <ProvenanceBadge type="AI_AUTO" />}</td>
                                  <td className="py-2 text-center text-gray-600">銅</td>
                                  <td className="py-2 text-center font-mono">{w.ratio}%</td>
                                  <td className="py-2 text-right font-black font-mono">¥{Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()} /kg</td>
                              </tr>
                          )) : filteredCastings.map((c:any) => (
                              <tr key={c.id} className="py-1">
                                  <td className="py-2 font-bold">{c.name} {isAiGenerated(c) && <ProvenanceBadge type="AI_AUTO" />}</td>
                                  <td className="py-2 text-center text-gray-600">{c.type === 'BRASS' ? '真鍮' : c.type === 'ZINC' ? '亜鉛' : c.type === 'LEAD' ? '鉛' : '銅'}</td>
                                  <td className="py-2 text-center font-mono">{c.ratio}%</td>
                                  <td className="py-2 text-right font-black font-mono">
                                      ¥{Math.floor((c.type === 'BRASS' ? brassPrice : c.type === 'ZINC' ? zincPrice : c.type === 'LEAD' ? leadPrice : copperPrice) * (c.ratio/100) * 0.90).toLocaleString()} /kg
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}

          {activeTab === 'CLIENTS' && (
              <div className="mb-8">
                  <table className="w-full text-left border-collapse text-sm">
                      <thead>
                          <tr className="border-b-2 border-black text-xs">
                              <th className="py-2 w-[35%]">顧客・企業名</th>
                              <th className="py-2 text-center w-[10%]">ランク</th>
                              <th className="py-2 w-[20%]">役割</th>
                              <th className="py-2 w-[35%]">特記事項</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-300">
                          {filteredClients.map((c:any) => (
                              <tr key={c.clientId} className="py-1">
                                  <td className="py-2">
                                      <p className="font-bold flex items-center gap-1">{c.companyName || c.name} {isAiGenerated(c) && <ProvenanceBadge type="AI_AUTO" />}</p>
                                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{c.phone || '-'}</p>
                                  </td>
                                  <td className="py-2 text-center font-black">{c.rank || 'B'}</td>
                                  <td className="py-2 font-mono text-xs">{c.businessRole || '-'}</td>
                                  <td className="py-2 text-xs text-gray-600 truncate">{c.memo || '-'}</td>
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
