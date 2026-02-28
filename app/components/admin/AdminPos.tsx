// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  User: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
};

// ★ プロベナンス・バッジ（AdminHomeと統一されたデザインルール）
const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN':
            return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
        case 'CO_OP':
            return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
        case 'AI_AUTO':
            return <span className={`${baseStyle} bg-gray-400`} title="AI予測・推論データ">AI</span>;
        default:
            return null;
    }
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any; editingResId: string | null; localReservations: any[]; onSuccess: () => void; onClear: () => void; }) => {
  const [clientName, setClientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('GUEST');
  const [showSuggest, setShowSuggest] = useState(false);
  const [items, setItems] = useState<any[]>([{ product: '', weight: '', price: '' }]);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inspector, setInspector] = useState('未選択');
  const [clientInsight, setClientInsight] = useState<{type: 'good'|'bad'|'neutral', diff: number, text: string} | null>(null);

  const wiresMaster = data?.wires || [];
  const castingsMaster = data?.castings || [];
  const clients = data?.clients || [];
  const staffs = data?.staffs || [];

  const inspectorList = staffs.filter((s:any) => s.role === 'ALL' || s.role === 'INSPECTION' || s.role === 'PLANT').map((s:any) => s.name);
  if (inspectorList.length === 0) inspectorList.push('工場長', '佐藤', '鈴木'); 

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
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
            const formatted = parsed.map((it: any) => ({ product: it.product || it.productName || '', weight: it.weight || '', price: it.price || it.unitPrice || '' }));
            setItems(formatted.length > 0 ? formatted : [{ product: '', weight: '', price: '' }]);
          } else { setItems([{ product: '', weight: '', price: '' }]); }
        } catch(e) { setItems([{ product: '', weight: '', price: '' }]); }
      }
    } else {
      setClientName(''); setSelectedClientId('GUEST'); setMemo(''); setItems([{ product: '', weight: '', price: '' }]); setInspector('未選択');
    }
  }, [editingResId, localReservations]);

  useEffect(() => {
      if (clientName && selectedClientId !== 'GUEST') {
          const clientProds = (data?.productions || []).filter((p:any) => p.memberName === clientName);
          if (clientProds.length === 0) {
              setClientInsight({ type: 'neutral', diff: 0, text: '過去の加工データがありません。マスター基準通りに検収してください。' });
              return;
          }
          
          let diffSum = 0;
          let count = 0;
          clientProds.forEach((p:any) => {
              const actual = Number(p.actualRatio) || 0;
              const master = wiresMaster.find((w:any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
              const expected = master ? Number(master.ratio) : 0;
              if (actual > 0 && expected > 0) {
                  diffSum += (actual - expected);
                  count++;
              }
          });

          if (count === 0) {
              setClientInsight(null);
              return;
          }

          const avgDiff = diffSum / count;
          if (avgDiff > 1.5) {
              setClientInsight({ type: 'good', diff: avgDiff, text: `【優良顧客】歩留実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。非常に良質です。強気の高値提示を推奨！` });
          } else if (avgDiff < -1.5) {
              setClientInsight({ type: 'bad', diff: avgDiff, text: `【要警戒】歩留実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。過去に異物混入の傾向あり。ダスト引きを推奨します。` });
          } else {
              setClientInsight({ type: 'neutral', diff: avgDiff, text: `【標準品質】歩留実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。通常通り検収してください。` });
          }
      } else {
          setClientInsight(null);
      }
  }, [clientName, selectedClientId, data?.productions, wiresMaster]);

  const handleNameChange = (e: any) => {
      setClientName(e.target.value);
      setSelectedClientId('GUEST');
      setShowSuggest(true);
  };

  const handleSelectClient = (client: any) => {
      const resolvedName = client.companyName || client.name || '';
      const resolvedId = client.clientId || client.id || 'GUEST';
      setClientName(resolvedName);
      setSelectedClientId(resolvedId);
      setShowSuggest(false);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product') {
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

  const addItem = () => setItems([...items, { product: '', weight: '', price: '' }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.weight) * Number(item.price) || 0), 0);

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

  const handlePrintReceipt = () => {
      if (!clientName) {
          alert("お客様名が入力されていません。");
          return;
      }
      window.print();
  };

  const inputClass = "w-full bg-white border border-gray-300 p-3 rounded-sm text-base md:text-lg font-bold text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition font-sans";

  const searchHitClients = clients.filter((c: any) => {
    const targetName = c.companyName || c.name || '';
    return targetName.toLowerCase().includes(clientName.toLowerCase());
  }).slice(0, 50);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-6xl mx-auto w-full text-gray-800 pb-28 md:pb-12 relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      {/* --- 通常の画面 (印刷時は非表示) --- */}
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
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 shadow-inner w-full md:w-auto relative">
                    {/* ★ 検収者は人間（HUMAN） */}
                    <div className="absolute -top-2.5 right-2 bg-white px-1">
                        <ProvenanceBadge type="HUMAN" />
                    </div>
                    <Icons.User />
                    <select className="bg-transparent text-sm font-bold text-gray-700 outline-none ml-2 cursor-pointer w-full" value={inspector} onChange={e => setInspector(e.target.value)}>
                        <option value="未選択">検収者を選択</option>
                        {inspectorList.map((name:string) => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                
                <button 
                    onClick={handlePrintReceipt} 
                    className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-sm font-bold hover:border-gray-400 transition shadow-sm flex items-center gap-2 whitespace-nowrap"
                >
                    <Icons.Print /> 伝票印刷
                </button>

                {editingResId && (
                    <button onClick={onClear} className="text-gray-500 hover:text-gray-900 bg-white border border-gray-300 px-4 py-2 rounded-sm text-sm font-bold shadow-sm transition flex items-center gap-1 whitespace-nowrap">
                        <Icons.Close /> 取消
                    </button>
                )}
            </div>
          </header>

          <div className="bg-white border border-gray-200 shadow-sm flex flex-col flex-1 rounded-sm overflow-hidden mb-4">
              <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                      <div className="flex-1 relative z-50">
                          <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                              お客様 (業者名)
                              {/* ★ 顧客情報の入力は人間（HUMAN） */}
                              <ProvenanceBadge type="HUMAN" />
                          </label>
                          <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                              <input 
                                  type="text" 
                                  className={`${inputClass} pl-10`}
                                  placeholder="業者名を入力・選択..." 
                                  value={clientName} 
                                  onChange={handleNameChange} 
                                  onFocus={()=>setShowSuggest(true)} 
                                  onBlur={()=>setTimeout(()=>setShowSuggest(false), 200)} 
                              />
                              {showSuggest && searchHitClients.length > 0 && (
                                  <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 shadow-2xl max-h-60 overflow-y-auto rounded-sm">
                                      {searchHitClients.map((c:any) => {
                                          const resolvedName = c.companyName || c.name || '不明な顧客';
                                          const resolvedId = c.clientId || c.id || 'GUEST';
                                          const resolvedSubInfo = c.rank ? `${c.rank} MEMBER` : (c.note || '');
                                          return (
                                              <li key={resolvedId} onMouseDown={() => handleSelectClient(c)} className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0 text-sm transition-colors">
                                                  <div className="font-bold text-gray-900">{resolvedName}</div>
                                                  <div className="text-xs text-gray-500 font-mono mt-0.5">{resolvedSubInfo}</div>
                                              </li>
                                          );
                                      })}
                                  </ul>
                              )}
                          </div>
                          {clientName && selectedClientId === 'GUEST' && !showSuggest && (
                              <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-[#D32F2F]">※ 顧客マスター未登録（GUEST）扱い</p>
                          )}
                      </div>
                      <div className="md:w-1/3 w-full mt-2 md:mt-0">
                          <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                              引継ぎメモ
                              <ProvenanceBadge type="HUMAN" />
                          </label>
                          <input type="text" className={inputClass} placeholder="備考" value={memo} onChange={e => setMemo(e.target.value)} />
                      </div>
                  </div>

                  {/* ★ AIインサイトメッセージ */}
                  {clientInsight && (
                      <div className={`mt-2 p-3 rounded-sm border flex items-start gap-3 animate-in slide-in-from-top-2 relative ${
                          clientInsight.type === 'good' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                          clientInsight.type === 'bad' ? 'bg-red-50 border-red-200 text-red-900' :
                          'bg-gray-100 border-gray-300 text-gray-800'
                      }`}>
                          <div className="absolute top-2 right-2">
                              <ProvenanceBadge type="AI_AUTO" />
                          </div>
                          <div className={`mt-0.5 ${clientInsight.type === 'good' ? 'text-blue-600' : clientInsight.type === 'bad' ? 'text-[#D32F2F]' : 'text-gray-500'}`}>
                              <Icons.Sparkles />
                          </div>
                          <div className="pr-8">
                              <p className="text-xs md:text-sm font-bold leading-relaxed">{clientInsight.text}</p>
                          </div>
                      </div>
                  )}
              </div>

              <div className="p-3 md:p-5 flex-1 overflow-y-auto bg-white">
                  <div className="hidden md:flex text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
                      <div className="flex-1 flex items-center gap-2">持込品目 <ProvenanceBadge type="HUMAN" /></div>
                      <div className="w-40 text-right flex items-center justify-end gap-2">重量 (kg) <ProvenanceBadge type="HUMAN" /></div>
                      <div className="w-44 text-right flex items-center justify-end gap-2">単価 (円) <ProvenanceBadge type="CO_OP" /></div>
                      <div className="w-44 text-right flex items-center justify-end gap-2">金額 <ProvenanceBadge type="CO_OP" /></div>
                      <div className="w-14"></div>
                  </div>
                  
                  <div className="space-y-3">
                      {items.map((item, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row gap-3 md:gap-2 md:items-center bg-gray-50 p-3 md:p-2 rounded-sm border border-gray-200 hover:border-gray-300 transition-colors">
                              
                              <div className="flex-1 w-full md:w-auto relative">
                                  <span className="md:hidden absolute -top-2 left-2 bg-gray-50 px-1 text-[10px] font-bold text-gray-400 flex items-center gap-1 z-10">品目 <ProvenanceBadge type="HUMAN" /></span>
                                  <select className="w-full bg-white md:bg-transparent border md:border-none border-gray-300 p-3 md:p-2 text-base md:text-lg font-bold text-gray-900 rounded-sm outline-none cursor-pointer relative z-0" value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                                      <option value="">品目を選択</option>
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

                              <div className="flex gap-2 items-center w-full md:w-auto">
                                  <div className="flex-1 md:w-40 relative">
                                      <span className="md:hidden absolute -top-2 left-2 bg-gray-50 px-1 text-[10px] font-bold text-gray-400 flex items-center gap-1 z-10">重量 <ProvenanceBadge type="HUMAN" /></span>
                                      <input type="number" inputMode="decimal" className={`${inputClass} text-right pr-8 pl-3 py-3 md:py-2.5 font-mono relative z-0`} placeholder="0" value={item.weight} onChange={e => handleItemChange(idx, 'weight', e.target.value)} />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 pointer-events-none z-10">kg</span>
                                  </div>
                                  <div className="flex-1 md:w-44 relative">
                                      <span className="md:hidden absolute -top-2 left-2 bg-gray-50 px-1 text-[10px] font-bold text-gray-400 flex items-center gap-1 z-10">単価 <ProvenanceBadge type="CO_OP" /></span>
                                      <input type="number" inputMode="decimal" className={`${inputClass} text-right pr-8 pl-3 py-3 md:py-2.5 font-mono relative z-0`} placeholder="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 pointer-events-none z-10">¥</span>
                                  </div>
                              </div>

                              <div className="flex justify-between items-center md:block md:w-44 md:text-right px-2 md:px-0 pt-2 md:pt-0 border-t border-dashed border-gray-200 md:border-none mt-1 md:mt-0 relative">
                                  <div className="md:hidden flex items-center gap-1">
                                      <span className="text-xs font-bold text-gray-500">小計</span>
                                      <ProvenanceBadge type="CO_OP" />
                                  </div>
                                  <p className="text-xl md:text-xl font-black text-gray-900 font-mono tracking-tighter">¥{(Number(item.weight) * Number(item.price) || 0).toLocaleString()}</p>
                                  
                                  <div className="md:hidden">
                                      <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-[#D32F2F] bg-white border border-gray-200 p-2 rounded-sm shadow-sm flex items-center gap-1 text-xs font-bold">
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
                  
                  <button onClick={addItem} className="mt-4 w-full py-4 border-2 border-dashed border-gray-300 rounded-sm text-gray-500 font-bold hover:border-gray-500 hover:text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm bg-gray-50">
                      <Icons.Plus /> 品目を追加する
                  </button>
              </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full md:relative md:w-auto bg-[#111] text-white p-4 md:p-6 flex flex-row justify-between items-center gap-4 z-[60] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.3)] md:shadow-none md:rounded-sm">
              <div className="text-left flex-1 relative">
                  <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">合計買掛金額</p>
                      <ProvenanceBadge type="CO_OP" />
                  </div>
                  <p className="text-3xl md:text-5xl font-black tracking-tighter font-mono text-white leading-none">¥{totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting || !clientName} className="bg-[#D32F2F] text-white px-6 md:px-10 py-3 md:py-4 rounded-sm text-sm md:text-lg font-bold hover:bg-red-600 transition shadow-sm flex items-center justify-center gap-2 disabled:bg-gray-800 disabled:text-gray-600 whitespace-nowrap">
                  {isSubmitting ? '処理中...' : <><Icons.Save /> 確定する</>}
              </button>
          </div>
      </div>

      {/* --- 🖨️ 印刷用レポート専用レイアウト (計量・買取伝票) --- */}
      <div className="hidden print:block w-[210mm] mx-auto bg-white text-black p-10 font-sans">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-3xl font-black font-serif tracking-widest mb-2">計量・買取計算書</h1>
              <p className="text-sm font-bold text-gray-600">株式会社月寒製作所 苫小牧工場</p>
          </div>

          <div className="flex justify-between items-end mb-8">
              <div className="flex-1 border-b border-black pb-1 mr-10">
                  <p className="text-2xl font-bold">{clientName || "　　　　　　　　"} <span className="text-lg font-normal">様</span></p>
              </div>
              <div className="text-right text-sm font-mono space-y-1">
                  <p>発行日: {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                  <p>時間: {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</p>
                  <p>検収者: {inspector !== '未選択' ? inspector : '________'}</p>
                  {editingResId && <p className="text-[10px] text-gray-500">伝票番号: {editingResId}</p>}
              </div>
          </div>

          <div className="mb-10">
              <table className="w-full text-left border-collapse text-base">
                  <thead>
                      <tr className="border-b-2 border-black text-sm">
                          <th className="py-3 w-[45%]">品目名</th>
                          <th className="py-3 text-right w-[15%]">重量 (kg)</th>
                          <th className="py-3 text-right w-[20%]">単価 (円)</th>
                          <th className="py-3 text-right w-[20%]">金額 (円)</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                      {items.map((item, idx) => {
                          if (!item.product) return null;
                          const subtotal = Number(item.weight) * Number(item.price) || 0;
                          return (
                              <tr key={idx} className="py-2">
                                  <td className="py-4 font-bold">{item.product}</td>
                                  <td className="py-4 text-right font-mono">{item.weight || 0}</td>
                                  <td className="py-4 text-right font-mono">{Number(item.price || 0).toLocaleString()}</td>
                                  <td className="py-4 text-right font-mono font-bold">{subtotal.toLocaleString()}</td>
                              </tr>
                          )
                      })}
                  </tbody>
              </table>
          </div>

          <div className="flex justify-end border-t-2 border-black pt-4 mb-10">
              <div className="w-1/2 flex justify-between items-baseline">
                  <span className="text-lg font-bold">合計金額</span>
                  <span className="text-4xl font-black font-mono tracking-tighter">¥{totalAmount.toLocaleString()}</span>
              </div>
          </div>

          {memo && (
              <div className="mb-8 border border-gray-400 p-4 min-h-[80px]">
                  <p className="text-xs font-bold text-gray-500 mb-1">備考</p>
                  <p className="text-sm">{memo}</p>
              </div>
          )}

          <div className="mt-16 pt-8 text-xs text-gray-500 text-center flex flex-col items-center">
              <p className="mb-2">毎度ありがとうございます。またのお越しをお待ちしております。</p>
              <div className="flex gap-16 mt-8">
                  <div className="text-center">
                      <p className="mb-8">受領印</p>
                      <div className="w-32 border-b border-black"></div>
                  </div>
                  <div className="text-center">
                      <p className="mb-8">検収印</p>
                      <div className="w-32 border-b border-black"></div>
                  </div>
              </div>
          </div>
      </div>

    </div>
  );
};
