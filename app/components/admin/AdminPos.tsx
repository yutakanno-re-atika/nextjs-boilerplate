// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';

const Icons = {
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Save: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Search: () => <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 01-2 0v-1H3a1 1 0 010-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  User: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Camera: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Refresh: () => <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Check: () => <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' | 'AI_NEW' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'CO_OP': return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-blue-600`} title="AI予測・マスタ合致">AI MATCH</span>;
        case 'AI_NEW': return <span className={`${baseStyle} bg-orange-500 animate-pulse`} title="マスター未登録・新規候補">AI NEW!</span>;
        default: return null;
    }
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any; editingResId: string | null; localReservations: any[]; onSuccess: () => void; onClear: () => void; }) => {
  const [clientName, setClientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('GUEST');
  const [showSuggest, setShowSuggest] = useState(false);
  const [items, setItems] = useState<any[]>([{ product: '', weight: '', price: '', isAiAssessed: false, isNewFlag: false }]);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inspector, setInspector] = useState('未選択');
  const [clientInsight, setClientInsight] = useState<{type: 'good'|'bad'|'neutral', diff: number, text: string} | null>(null);

  // Vision AI 査定用ステート
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  
  const [imgData1, setImgData1] = useState<string | null>(null); 
  const [imgData2, setImgData2] = useState<string | null>(null); 

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const wiresMaster = data?.wires || [];
  const castingsMaster = data?.castings || [];
  const clients = data?.clients || [];
  const staffs = data?.staffs || [];

  const inspectorList = staffs.filter((s:any) => s.role === 'ALL' || s.role === 'INSPECTION' || s.role === 'PLANT' || s.role === 'MANAGER' || s.role === 'FRONT').map((s:any) => s.name);
  if (inspectorList.length === 0) inspectorList.push('工場長', '佐藤', '鈴木'); 

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
      if (w.maker && w.maker !== '-' && String(w.maker).trim() !== '') {
          name = `【${w.maker}】${name}`;
      }
      return name;
  };

  useEffect(() => {
    if (editingResId) {
      const res = localReservations.find(r => r.id === editingResId);
      if (res) {
        setClientName(res.memberName || '');
        setSelectedClientId(res.memberId || 'GUEST');
        
        let currentMemo = res.memo || '';
        const match = currentMemo.match(/\[検収:\s*(.*?)\]/);
        if (match) {
            setInspector(match[1]);
            currentMemo = currentMemo.replace(/\[検収:\s*.*?\]\s*/, '');
        }
        setMemo(currentMemo);

        try {
          let parsed = res.items;
          if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
          if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
          if (Array.isArray(parsed)) {
            const formatted = parsed.map((it: any) => ({ 
                product: it.product || it.productName || '', 
                weight: it.weight || '', 
                price: it.price || it.unitPrice || '',
                isAiAssessed: it.isAiAssessed || false,
                isNewFlag: it.isNewFlag || false
            }));
            setItems(formatted.length > 0 ? formatted : [{ product: '', weight: '', price: '', isAiAssessed: false, isNewFlag: false }]);
          } else { setItems([{ product: '', weight: '', price: '', isAiAssessed: false, isNewFlag: false }]); }
        } catch(e) { setItems([{ product: '', weight: '', price: '', isAiAssessed: false, isNewFlag: false }]); }
      }
    } else {
      setClientName(''); setSelectedClientId('GUEST'); setMemo(''); setItems([{ product: '', weight: '', price: '', isAiAssessed: false, isNewFlag: false }]); setInspector('未選択');
    }
  }, [editingResId, localReservations]);

  useEffect(() => {
      if (clientName && selectedClientId !== 'GUEST') {
          const clientProds = (data?.productions || []).filter((p:any) => p.memberName === clientName);
          if (clientProds.length === 0) {
              setClientInsight({ type: 'neutral', diff: 0, text: '過去の加工データがありません。マスター基準通りに検収してください。' });
              return;
          }
          let diffSum = 0; let count = 0;
          clientProds.forEach((p:any) => {
              const actual = Number(p.actualRatio) || 0;
              const master = wiresMaster.find((w:any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
              const expected = master ? Number(master.ratio) : 0;
              if (actual > 0 && expected > 0) { diffSum += (actual - expected); count++; }
          });
          if (count === 0) { setClientInsight(null); return; }
          const avgDiff = diffSum / count;
          if (avgDiff > 1.5) { setClientInsight({ type: 'good', diff: avgDiff, text: `【優良顧客】歩留実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。非常に良質です。強気の高値提示を推奨！` }); } 
          else if (avgDiff < -1.5) { setClientInsight({ type: 'bad', diff: avgDiff, text: `【要警戒】歩留実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。過去に異物混入の傾向あり。ダスト引きを推奨します。` }); } 
          else { setClientInsight({ type: 'neutral', diff: avgDiff, text: `【標準品質】歩留実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。通常通り検収してください。` }); }
      } else {
          setClientInsight(null);
      }
  }, [clientName, selectedClientId, data?.productions, wiresMaster]);

  const handleNameChange = (e: any) => { setClientName(e.target.value); setSelectedClientId('GUEST'); setShowSuggest(true); };
  const handleSelectClient = (client: any) => {
      const resolvedName = client.companyName || client.name || '';
      const resolvedId = client.clientId || client.id || 'GUEST';
      setClientName(resolvedName); setSelectedClientId(resolvedId); setShowSuggest(false);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product') {
        newItems[index].isAiAssessed = false;
        newItems[index].isNewFlag = false;
        const wire = wiresMaster.find((w:any) => getDisplayName(w) === value || w.name === value);
        const casting = castingsMaster.find((c:any) => c.name === value);
        if (wire) {
            const copperPrice = Number(data?.config?.market_price || 1450);
            const ratio = Number(wire.ratio || 0) / 100;
            newItems[index].price = Math.floor(copperPrice * ratio * 0.85); 
        } else if (casting) {
            let basePrice = Number(data?.config?.market_price || 1450);
            if (casting.type === 'BRASS') basePrice = Number(data?.config?.brass_price || 980);
            if (casting.type === 'ZINC') basePrice = Number(data?.config?.zinc_price || 450);
            if (casting.type === 'LEAD') basePrice = Number(data?.config?.lead_price || 380);
            const ratio = Number(casting.ratio || 0) / 100;
            newItems[index].price = Math.floor(basePrice * ratio * 0.90); 
        }
    }
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { product: '', weight: '', price: '', isAiAssessed: false, isNewFlag: false }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.weight) * Number(item.price) || 0), 0);

  const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
              const img = new Image();
              img.src = event.target?.result as string;
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 1920; 
                  const MAX_HEIGHT = 1920;
                  let width = img.width; let height = img.height;
                  if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } 
                  else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
                  canvas.width = width; canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return reject(new Error('Canvas context error'));
                  ctx.drawImage(img, 0, 0, width, height);
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.80);
                  resolve(dataUrl.split(',')[1]); 
              };
              img.onerror = (error) => reject(error);
          };
          reader.onerror = (error) => reject(error);
      });
  };

  const handleCapture1 = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const base64Data = await compressImage(file); setImgData1(base64Data); };
  const handleCapture2 = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const base64Data = await compressImage(file); setImgData2(base64Data); };

  const executeAssessment = async () => {
      if (!imgData1 && !imgData2) { alert('画像を撮影してください。'); return; }
      setIsAssessing(true); setAiResult(null);
      try {
          const payload = { action: 'VISION_AI_ASSESS', imageData: imgData1, imageData2: imgData2 };
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') { setAiResult(result.data); } else { alert('AI査定エラー: ' + result.message); }
      } catch (err) { alert('通信エラーが発生しました。'); } finally { setIsAssessing(false); }
  };

  const applyAiResultToPos = () => {
      if (!aiResult) return;
      
      const copperPrice = Number(data?.config?.market_price || 1450);
      const ratio = Number(aiResult.estimatedRatio || 40) / 100;
      const calculatedPrice = Math.floor(copperPrice * ratio * 0.85);
      const prefix = aiResult.isNewFlag ? "【推測】" : "";

      const newItem = {
          product: `${prefix}${aiResult.wireType}`,
          weight: '', 
          price: calculatedPrice,
          isAiAssessed: true,
          isNewFlag: aiResult.isNewFlag || false
      };

      if (items.length === 1 && !items[0].product && !items[0].weight) {
          setItems([newItem]);
      } else {
          setItems([...items, newItem]);
      }

      // ★ 新機能：AIが「未知」と判定した場合、自動的に Products_Unknown マスターへ登録申請を出す
      if (aiResult.isNewFlag) {
          fetch('/api/gas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  action: 'ADD_DB_RECORD',
                  sheetName: 'Products_Unknown',
                  data: {
                      name: aiResult.wireType,
                      estimatedRatio: aiResult.estimatedRatio,
                      reason: aiResult.reason,
                      image1: '', // POSからの直接登録時は画像アップロードの遅延を防ぐため空で登録（後でDB画面で付与可能）
                      image2: ''
                  }
              })
          }).catch(console.error);
      }
      
      setIsAiModalOpen(false); setAiResult(null); setImgData1(null); setImgData2(null);
  };

  const handleSubmit = async () => {
    if (!clientName) return alert('お客様名を入力してください');
    setIsSubmitting(true);
    const finalMemo = inspector !== '未選択' ? `[検収: ${inspector}] ${memo}` : memo;
    const payload = editingResId ? {
      action: 'UPDATE_RESERVATION', reservationId: editingResId, memberId: selectedClientId, memberName: clientName, items: items, totalEstimate: totalAmount, status: 'COMPLETED', memo: finalMemo
    } : { action: 'REGISTER_RESERVATION', memberId: selectedClientId, memberName: clientName, items: items, totalEstimate: totalAmount, memo: finalMemo };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') { alert('登録完了'); onSuccess(); window.location.reload(); } else { alert('エラー: ' + result.message); }
    } catch(e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  const handlePrintReceipt = () => { if (!clientName) { alert("お客様名が入力されていません。"); return; } window.print(); };

  const inputClass = "w-full bg-white border border-gray-300 p-4 md:p-3 min-h-[56px] md:min-h-0 rounded-sm text-lg md:text-base font-bold text-gray-900 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-300 transition font-sans shadow-inner";
  const searchHitClients = clients.filter((c: any) => { const targetName = c.companyName || c.name || ''; return targetName.toLowerCase().includes(clientName.toLowerCase()); }).slice(0, 50);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-6xl mx-auto w-full text-gray-800 pb-36 md:pb-12 relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      <div className="print:hidden flex flex-col h-full">
          <header className="mb-4 flex flex-col md:flex-row md:justify-between md:items-end flex-shrink-0 pb-4 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 font-serif">
                 <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                 {editingResId ? '検収・計量 (POS)' : '新規受付 (POS)'}
              </h2>
              <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">{editingResId ? 'EDIT MODE' : 'NEW ENTRY'}</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-sm px-3 py-3 md:py-2 shadow-inner w-full md:w-auto relative min-h-[50px] md:min-h-0">
                    <div className="absolute -top-2.5 right-2 bg-white px-1"><ProvenanceBadge type="HUMAN" /></div>
                    <Icons.User />
                    <select className="bg-transparent text-base md:text-sm font-bold text-gray-700 outline-none ml-2 cursor-pointer w-full" value={inspector} onChange={e => setInspector(e.target.value)}>
                        <option value="未選択">検収者を選択</option>
                        {inspectorList.map((name:string) => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                
                <button onClick={handlePrintReceipt} className="bg-white border border-gray-300 text-gray-800 px-4 py-3 md:py-2 rounded-sm text-base md:text-sm font-bold hover:bg-gray-50 transition shadow-sm flex items-center gap-2 whitespace-nowrap min-h-[50px] md:min-h-0">
                    <Icons.Print /> 伝票
                </button>

                {editingResId && (
                    <button onClick={onClear} className="text-gray-500 hover:text-gray-900 bg-white border border-gray-300 px-4 py-3 md:py-2 rounded-sm text-base md:text-sm font-bold shadow-sm transition flex items-center gap-1 whitespace-nowrap min-h-[50px] md:min-h-0">
                        <Icons.Close /> 取消
                    </button>
                )}
            </div>
          </header>

          <div className="bg-white border border-gray-200 shadow-sm flex flex-col flex-1 rounded-sm overflow-hidden mb-4">
              <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50 flex flex-col gap-5">
                  <div className="flex flex-col md:flex-row gap-5 md:gap-6">
                      <div className="flex-1 relative z-50">
                          <label className="text-xs md:text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                              お客様 (業者名) <ProvenanceBadge type="HUMAN" />
                          </label>
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Icons.Search /></div>
                              <input type="text" className={`${inputClass} pl-12 text-xl md:text-lg`} placeholder="業者名を入力・選択..." value={clientName} onChange={handleNameChange} onFocus={()=>setShowSuggest(true)} onBlur={()=>setTimeout(()=>setShowSuggest(false), 200)} />
                              {showSuggest && searchHitClients.length > 0 && (
                                  <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 shadow-2xl max-h-60 overflow-y-auto rounded-sm">
                                      {searchHitClients.map((c:any) => {
                                          const resolvedName = c.companyName || c.name || '不明な顧客';
                                          const resolvedId = c.clientId || c.id || 'GUEST';
                                          return (
                                              <li key={resolvedId} onMouseDown={() => handleSelectClient(c)} className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0 text-base transition-colors">
                                                  <div className="font-bold text-gray-900">{resolvedName}</div>
                                                  <div className="text-xs text-gray-500 font-mono mt-1">{c.rank ? `${c.rank} MEMBER` : (c.note || '')}</div>
                                              </li>
                                          );
                                      })}
                                  </ul>
                              )}
                          </div>
                          {clientName && selectedClientId === 'GUEST' && !showSuggest && <p className="absolute -bottom-6 left-0 text-xs font-bold text-[#D32F2F]">※ 顧客マスター未登録（GUEST）扱い</p>}
                      </div>
                      <div className="md:w-1/3 w-full mt-3 md:mt-0">
                          <label className="text-xs md:text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                              引継ぎメモ <ProvenanceBadge type="HUMAN" />
                          </label>
                          <input type="text" className={inputClass} placeholder="備考" value={memo} onChange={e => setMemo(e.target.value)} />
                      </div>
                  </div>

                  {clientInsight && (
                      <div className={`mt-2 p-4 rounded-sm border flex items-start gap-3 animate-in slide-in-from-top-2 relative ${clientInsight.type === 'good' ? 'bg-blue-50 border-blue-200 text-blue-900' : clientInsight.type === 'bad' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-gray-100 border-gray-300 text-gray-800'}`}>
                          <div className="absolute top-2 right-2"><ProvenanceBadge type="AI_AUTO" /></div>
                          <div className={`mt-0.5 ${clientInsight.type === 'good' ? 'text-blue-600' : clientInsight.type === 'bad' ? 'text-[#D32F2F]' : 'text-gray-500'}`}><Icons.Sparkles /></div>
                          <div className="pr-8"><p className="text-sm md:text-sm font-bold leading-relaxed">{clientInsight.text}</p></div>
                      </div>
                  )}
              </div>

              <div className="p-3 md:p-5 flex-1 overflow-y-auto bg-white relative">
                  <div className="hidden md:flex text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">
                      <div className="flex-1 flex items-center gap-2">持込品目 <ProvenanceBadge type="CO_OP" /></div>
                      <div className="w-40 text-right flex items-center justify-end gap-2">重量 (kg) <ProvenanceBadge type="HUMAN" /></div>
                      <div className="w-44 text-right flex items-center justify-end gap-2">単価 (円) <ProvenanceBadge type="CO_OP" /></div>
                      <div className="w-44 text-right flex items-center justify-end gap-2">金額 <ProvenanceBadge type="CO_OP" /></div>
                      <div className="w-14"></div>
                  </div>
                  
                  <div className="space-y-4 md:space-y-3">
                      {items.map((item, idx) => (
                          <div key={idx} className={`flex flex-col md:flex-row gap-4 md:gap-2 md:items-center p-4 md:p-2 rounded-sm border transition-colors relative ${item.isNewFlag ? 'bg-orange-50 border-orange-300 shadow-sm' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                              
                              <div className="flex-1 w-full md:w-auto relative">
                                  <span className="md:hidden absolute -top-2.5 left-2 bg-gray-50 px-2 text-[10px] font-bold text-gray-500 flex items-center gap-1 z-10 rounded-sm">品目</span>
                                  {item.isAiAssessed && (
                                      <div className="absolute right-10 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                          <ProvenanceBadge type={item.isNewFlag ? "AI_NEW" : "AI_AUTO"} />
                                      </div>
                                  )}
                                  <select className={`w-full bg-white md:bg-transparent border border-gray-300 md:border-none p-4 md:p-2 min-h-[56px] md:min-h-0 text-lg md:text-lg font-bold ${item.isNewFlag ? 'text-orange-700' : item.isAiAssessed ? 'text-blue-700' : 'text-gray-900'} rounded-sm outline-none cursor-pointer relative z-0 shadow-inner md:shadow-none`} value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                                      <option value="">品目を選択</option>
                                      {item.isAiAssessed && item.isNewFlag && <option value={item.product}>{item.product}</option>}
                                      <optgroup label="電線類">
                                          {wiresMaster.map((w:any) => {
                                              const dName = getDisplayName(w);
                                              return <option key={w.id} value={dName}>{dName} ({w.ratio}%)</option>;
                                          })}
                                      </optgroup>
                                      <optgroup label="非鉄金属">{castingsMaster.map((c:any) => <option key={c.id} value={c.name}>{c.name}</option>)}</optgroup>
                                      <option value="雑線">雑線</option>
                                  </select>
                              </div>

                              <div className="flex gap-3 items-center w-full md:w-auto">
                                  <div className="flex-1 md:w-40 relative">
                                      <span className="md:hidden absolute -top-2.5 left-2 bg-gray-50 px-2 text-[10px] font-bold text-gray-500 flex items-center gap-1 z-10 rounded-sm">重量 (kg)</span>
                                      <input type="number" inputMode="decimal" className={`${inputClass} text-right pr-10 pl-3 text-xl`} placeholder="0" value={item.weight} onChange={e => handleItemChange(idx, 'weight', e.target.value)} />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none z-10">kg</span>
                                  </div>
                                  <div className="flex-1 md:w-44 relative">
                                      <span className="md:hidden absolute -top-2.5 left-2 bg-gray-50 px-2 text-[10px] font-bold text-gray-500 flex items-center gap-1 z-10 rounded-sm">単価 (円)</span>
                                      <input type="number" inputMode="decimal" className={`${inputClass} text-right pr-10 pl-3 text-xl ${item.isNewFlag ? 'text-orange-700' : item.isAiAssessed ? 'text-blue-700' : ''}`} placeholder="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} />
                                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none z-10">¥</span>
                                  </div>
                              </div>

                              <div className="flex justify-between items-center md:block md:w-44 md:text-right px-2 md:px-0 pt-3 md:pt-0 border-t border-dashed border-gray-300 md:border-none mt-2 md:mt-0 relative">
                                  <div className="md:hidden flex items-center gap-2"><span className="text-sm font-bold text-gray-500">小計</span></div>
                                  <p className={`text-2xl md:text-xl font-black font-mono tracking-tighter ${item.isNewFlag ? 'text-orange-700' : item.isAiAssessed ? 'text-blue-700' : 'text-gray-900'}`}>¥{(Number(item.weight) * Number(item.price) || 0).toLocaleString()}</p>
                                  <div className="md:hidden">
                                      <button onClick={() => removeItem(idx)} className="text-gray-500 hover:text-[#D32F2F] bg-white border border-gray-300 p-3 rounded-sm shadow-sm flex items-center gap-2 text-sm font-bold active:bg-gray-100">
                                          <Icons.Trash /> 削除
                                      </button>
                                  </div>
                              </div>

                              <div className="hidden md:block w-14 text-center">
                                  <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-[#D32F2F] transition p-2"><Icons.Trash /></button>
                              </div>
                          </div>
                      ))}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 mt-8">
                      <button onClick={addItem} className="flex-1 py-5 md:py-4 border-2 border-dashed border-gray-300 rounded-sm text-gray-600 font-bold hover:border-gray-500 hover:text-gray-900 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-base md:text-sm bg-gray-50 shadow-sm active:bg-gray-200">
                          <Icons.Plus /> 品目を手動で追加
                      </button>
                      
                      <button onClick={() => setIsAiModalOpen(true)} className="flex-1 py-5 md:py-4 border-2 border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 rounded-sm text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 text-base md:text-sm shadow-lg relative overflow-hidden group active:scale-[0.98]">
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                          <Icons.Camera /> AIブラックボックス・オープナー
                      </button>
                  </div>
              </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full md:relative md:w-auto bg-[#111] text-white p-5 md:p-6 flex flex-row justify-between items-center gap-4 z-[60] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] md:shadow-none md:rounded-sm">
              <div className="text-left flex-1 relative">
                  <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">合計買掛金額</p>
                      <ProvenanceBadge type="CO_OP" />
                  </div>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter font-mono text-white leading-none">¥{totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting || !clientName} className="bg-[#D32F2F] text-white px-8 md:px-10 py-4 md:py-4 rounded-sm text-lg font-bold hover:bg-red-600 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-600 whitespace-nowrap active:scale-[0.98]">
                  {isSubmitting ? '処理中...' : <><Icons.Save /> 確定する</>}
              </button>
          </div>
      </div>

      {isAiModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 md:p-6 text-white flex justify-between items-center relative">
                      <div className="absolute top-2 right-2"><ProvenanceBadge type="AI_AUTO" /></div>
                      <div>
                          <h3 className="text-lg md:text-xl font-black flex items-center gap-2">
                              <Icons.Sparkles /> AI ブラックボックス・オープナー
                          </h3>
                          <p className="text-xs text-blue-100 mt-1">定規と一緒に撮影することで、AIが未知の線の歩留まりを計算します。</p>
                      </div>
                      <button onClick={() => { setIsAiModalOpen(false); setAiResult(null); setImgData1(null); setImgData2(null); }} className="text-white/50 hover:text-white p-2"><Icons.Close /></button>
                  </div>
                  
                  <div className="p-4 md:p-6 bg-gray-50">
                      {!aiResult && !isAssessing && (
                          <>
                              <h4 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                  <span className="w-1.5 h-4 bg-blue-600"></span>
                                  AIに正確な物理スケールを伝える2ステップ
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div className="relative group cursor-pointer h-40 md:h-48">
                                      <div className={`absolute inset-0 transition-colors rounded-sm shadow-sm border-2 border-dashed flex flex-col items-center justify-center ${imgData1 ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'}`}>
                                          {imgData1 ? (
                                              <div className="text-center">
                                                  <Icons.Check />
                                                  <p className="text-sm font-bold text-blue-600 mt-2">印字セット完了</p>
                                              </div>
                                          ) : (
                                              <div className="text-center p-4 text-gray-500 group-hover:text-blue-500">
                                                  <Icons.Camera />
                                                  <p className="text-sm font-bold mt-2 text-gray-900">① 表面の「印字」</p>
                                                  <p className="text-[10px] mt-1">メーカーや仕様の読み取り用</p>
                                              </div>
                                          )}
                                      </div>
                                      <input type="file" accept="image/*" capture="environment" onChange={handleCapture1} ref={fileInputRef1} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                  </div>

                                  <div className="relative group cursor-pointer h-40 md:h-48">
                                      <div className={`absolute inset-0 transition-colors rounded-sm shadow-sm border-2 border-dashed flex flex-col items-center justify-center ${imgData2 ? 'bg-blue-50 border-blue-500' : 'bg-white border-blue-400'}`}>
                                          {imgData2 ? (
                                              <div className="text-center">
                                                  <Icons.Check />
                                                  <p className="text-sm font-bold text-blue-600 mt-2">断面セット完了</p>
                                              </div>
                                          ) : (
                                              <div className="text-center p-4 text-blue-600 bg-blue-50 w-full h-full flex flex-col items-center justify-center rounded-sm">
                                                  <Icons.Camera />
                                                  <p className="text-sm font-black mt-2 text-blue-800">② 「定規」と「断面」</p>
                                                  <p className="text-[10px] mt-1 font-bold text-blue-600 text-center px-2">※必ず定規の目盛りを<br/>横に添えてください！</p>
                                              </div>
                                          )}
                                      </div>
                                      <input type="file" accept="image/*" capture="environment" onChange={handleCapture2} ref={fileInputRef2} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                  </div>
                              </div>

                              <button 
                                  onClick={executeAssessment}
                                  disabled={!imgData1 && !imgData2}
                                  className="w-full bg-blue-600 text-white font-bold py-5 rounded-sm shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98]"
                              >
                                  <Icons.Sparkles /> AI解析を実行する
                              </button>
                              <p className="text-[10px] text-center text-gray-400 mt-3">※定規（スケール）がない場合、正確な歩留まり推論はできません。</p>
                          </>
                      )}

                      {isAssessing && (
                          <div className="py-20 flex flex-col items-center justify-center text-center">
                              <Icons.Refresh />
                              <h3 className="text-xl font-black text-blue-900 mt-5 tracking-widest">VISION AI 解析中...</h3>
                              <p className="text-sm text-gray-500 mt-2">定規のピクセル間隔を計算し、銅面積から歩留まりを演算しています。</p>
                          </div>
                      )}

                      {aiResult && !isAssessing && (
                          <div className="animate-in fade-in zoom-in-95 duration-500">
                              <div className={`border rounded-sm p-5 shadow-sm mb-5 relative ${aiResult.isNewFlag ? 'bg-orange-50 border-orange-200' : 'bg-white border-blue-200'}`}>
                                  {aiResult.isNewFlag && (
                                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-sm animate-pulse">
                                          未登録の新規線種 (DB自動連携済)
                                      </div>
                                  )}
                                  <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4 mt-3">
                                      <div>
                                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">AI 判定品目</p>
                                          <h3 className={`text-2xl md:text-3xl font-black ${aiResult.isNewFlag ? 'text-orange-800' : 'text-gray-900'}`}>{aiResult.wireType}</h3>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">算出歩留まり</p>
                                          <p className={`text-4xl font-black font-mono ${aiResult.isNewFlag ? 'text-orange-600' : 'text-blue-600'}`}>{aiResult.estimatedRatio}<span className="text-xl font-bold ml-1">%</span></p>
                                      </div>
                                  </div>
                                  <div className="mb-3">
                                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">推論の根拠 (Reasoning)</p>
                                      <p className="text-base font-medium text-gray-700 leading-relaxed bg-white p-4 rounded-sm border border-gray-200">
                                          {aiResult.reason}
                                      </p>
                                  </div>
                                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                                      <span className="text-xs font-bold text-gray-500">AIの自信度:</span>
                                      <span className={`text-sm font-black px-3 py-1 rounded-sm ${aiResult.confidence === '高' ? 'bg-green-100 text-green-700' : aiResult.confidence === '中' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                          {aiResult.confidence}
                                      </span>
                                  </div>
                              </div>
                              <div className="flex gap-4">
                                  <button onClick={() => { setAiResult(null); setImgData1(null); setImgData2(null); }} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-4 rounded-sm hover:bg-gray-50 transition text-base shadow-sm active:bg-gray-100">
                                      再撮影する
                                  </button>
                                  <button onClick={applyAiResultToPos} className={`flex-1 text-white font-bold py-4 rounded-sm transition flex items-center justify-center gap-2 text-lg shadow-md active:scale-[0.98] ${aiResult.isNewFlag ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                      <Icons.Plus /> POSに反映する
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
      
      {/* 印刷用レイアウトは省略(既存のまま) */}
    </div>
  );
};
