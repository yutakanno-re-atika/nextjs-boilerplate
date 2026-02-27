// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Search: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  User: () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any; editingResId: string | null; localReservations: any[]; onSuccess: () => void; onClear: () => void; }) => {
  const [clientName, setClientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('GUEST');
  const [showSuggest, setShowSuggest] = useState(false);
  const [items, setItems] = useState<any[]>([{ product: '', weight: '', price: '' }]);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ★ 追加: 検収担当スタッフのステート
  const [inspector, setInspector] = useState('未選択');
  // ★ 追加: AI査定アシストのステート
  const [clientInsight, setClientInsight] = useState<{type: 'good'|'bad'|'neutral', diff: number, text: string} | null>(null);

  const wiresMaster = data?.wires || [];
  const castingsMaster = data?.castings || [];
  const clients = data?.clients || [];
  const staffs = data?.staffs || [];

  // 担当者リスト（検収・全般ロールのスタッフを抽出）
  const inspectorList = staffs.filter((s:any) => s.role === 'ALL' || s.role === 'INSPECTION' || s.role === 'PLANT').map((s:any) => s.name);
  if (inspectorList.length === 0) inspectorList.push('工場長', '佐藤', '鈴木'); // フォールバック

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
        
        // メモ欄から担当者を抽出（存在すれば）
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

  // ★ 追加: 顧客選択時にAI査定アシストを生成するロジック
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
              setClientInsight({ type: 'good', diff: avgDiff, text: `【優良顧客】歩留まり実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。非常に良質な線材です。他社に取られないよう、強気の高値提示を推奨します！` });
          } else if (avgDiff < -1.5) {
              setClientInsight({ type: 'bad', diff: avgDiff, text: `【要警戒】歩留まり実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。過去にダストや異物混入の傾向があります。コネクタ・鉄を厳しく確認し、ダスト引き（減額）を推奨します。` });
          } else {
              setClientInsight({ type: 'neutral', diff: avgDiff, text: `【標準品質】歩留まり実績: 平均 ${avgDiff > 0 ? '+' : ''}${avgDiff.toFixed(1)}%。標準的な品質です。通常通り検収してください。` });
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
    
    // ★ 追加: メモの先頭に担当者を刻印
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

  const inputClass = "w-full bg-white border border-gray-300 p-2.5 rounded-sm text-lg font-bold text-gray-900 outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] transition font-mono";

  const searchHitClients = clients.filter((c: any) => {
    const targetName = c.companyName || c.name || '';
    return targetName.toLowerCase().includes(clientName.toLowerCase());
  }).slice(0, 10);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 max-w-6xl mx-auto w-full text-gray-800">
      <header className="mb-4 flex flex-col md:flex-row md:justify-between md:items-end flex-shrink-0 pb-4 border-b border-gray-200 gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2 font-serif">
             <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
             {editingResId ? '検収・計量 (POS)' : '新規受付 (POS)'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-mono tracking-wider ml-3">{editingResId ? 'EDIT MODE' : 'NEW ENTRY'}</p>
        </div>
        
        <div className="flex items-center gap-3">
            {/* ★ 追加: 検収担当スタッフのプルダウン */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-sm px-3 py-1.5 shadow-inner">
                <Icons.User />
                <select className="bg-transparent text-sm font-bold text-gray-700 outline-none ml-2 cursor-pointer" value={inspector} onChange={e => setInspector(e.target.value)}>
                    <option value="未選択">検収者を選択</option>
                    {inspectorList.map((name:string) => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>

            {editingResId && (
                <button onClick={onClear} className="text-gray-500 hover:text-gray-900 bg-white border border-gray-300 px-4 py-2 rounded-sm text-xs font-bold shadow-sm transition flex items-center gap-2">
                    <Icons.Close /> キャンセル
                </button>
            )}
        </div>
      </header>

      <div className="bg-white border border-gray-200 shadow-sm flex flex-col flex-1 rounded-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 relative z-50">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">お客様 (業者名)</label>
                      <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                          <input 
                              type="text" 
                              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-lg font-bold outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] transition shadow-inner" 
                              placeholder="業者名を検索..." 
                              value={clientName} 
                              onChange={handleNameChange} 
                              onFocus={()=>setShowSuggest(true)} 
                              onBlur={()=>setTimeout(()=>setShowSuggest(false), 200)} 
                          />
                          {showSuggest && clientName && searchHitClients.length > 0 && (
                              <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 shadow-2xl max-h-60 overflow-y-auto rounded-sm">
                                  {searchHitClients.map((c:any) => {
                                      const resolvedName = c.companyName || c.name || '不明な顧客';
                                      const resolvedId = c.clientId || c.id || 'GUEST';
                                      const resolvedSubInfo = c.rank ? `${c.rank} MEMBER` : (c.note || '');
                                      return (
                                          <li key={resolvedId} onMouseDown={() => handleSelectClient(c)} className="p-3 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-0 text-sm transition-colors">
                                              <div className="font-bold text-gray-900">{resolvedName}</div>
                                              <div className="text-xs text-gray-500 font-mono mt-0.5">{resolvedSubInfo}</div>
                                          </li>
                                      );
                                  })}
                              </ul>
                          )}
                      </div>
                      {clientName && selectedClientId === 'GUEST' && !showSuggest && (
                          <p className="absolute -bottom-5 left-0 text-[10px] font-bold text-[#D32F2F]">※ 顧客マスター未登録（GUEST）として処理されます</p>
                      )}
                  </div>
                  <div className="md:w-1/3 w-full">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">引継ぎメモ</label>
                      <input type="text" className="w-full border border-gray-300 p-2.5 rounded-sm text-base outline-none focus:border-[#D32F2F] transition shadow-inner" placeholder="備考" value={memo} onChange={e => setMemo(e.target.value)} />
                  </div>
              </div>

              {/* ★ 追加: AI査定アシストバナー */}
              {clientInsight && (
                  <div className={`mt-2 p-3 rounded-sm border flex items-start gap-3 animate-in slide-in-from-top-2 ${
                      clientInsight.type === 'good' ? 'bg-blue-50 border-blue-200 text-blue-900' :
                      clientInsight.type === 'bad' ? 'bg-red-50 border-red-200 text-red-900' :
                      'bg-gray-100 border-gray-300 text-gray-800'
                  }`}>
                      <div className={`mt-0.5 ${clientInsight.type === 'good' ? 'text-blue-600' : clientInsight.type === 'bad' ? 'text-red-600' : 'text-gray-500'}`}>
                          <Icons.Sparkles />
                      </div>
                      <p className="text-sm font-bold leading-relaxed">{clientInsight.text}</p>
                  </div>
              )}
          </div>

          <div className="p-5 flex-1 overflow-y-auto bg-white">
              <div className="hidden md:flex text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-2">
                  <div className="flex-1">持込品目</div>
                  <div className="w-36 text-right">重量 (kg)</div>
                  <div className="w-40 text-right">単価 (円)</div>
                  <div className="w-40 text-right">金額</div>
                  <div className="w-12"></div>
              </div>
              
              <div className="space-y-2">
                  {items.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-2 md:items-center bg-gray-50 p-2 rounded-sm border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex-1 w-full md:w-auto">
                              <select className="w-full bg-transparent p-2 text-base font-bold text-gray-900 outline-none cursor-pointer" value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                                  <option value="">品目を選択</option>
                                  <optgroup label="電線類 (W/M)">
                                      {wiresMaster.map((w:any) => {
                                          const dName = getDisplayName(w);
                                          return <option key={w.id} value={dName}>{dName} ({w.ratio}%)</option>;
                                      })}
                                  </optgroup>
                                  <optgroup label="非鉄金属 (C/M)">{castingsMaster.map((c:any) => <option key={c.id} value={c.name}>{c.name}</option>)}</optgroup>
                                  <option value="雑線">雑線</option>
                              </select>
                          </div>
                          <div className="flex gap-2 items-center">
                              <div className="flex-1 md:w-36 relative">
                                  <input type="number" inputMode="decimal" className={inputClass + " text-right pr-8"} placeholder="0" value={item.weight} onChange={e => handleItemChange(idx, 'weight', e.target.value)} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">kg</span>
                              </div>
                              <div className="flex-1 md:w-40 relative">
                                  <input type="number" inputMode="decimal" className={inputClass + " text-right pr-8"} placeholder="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">¥</span>
                              </div>
                          </div>
                          <div className="flex justify-between items-center md:block md:w-40 md:text-right px-2">
                              <span className="md:hidden text-xs font-bold text-gray-400">小計</span>
                              <p className="text-lg font-black text-gray-900 font-mono">¥{(Number(item.weight) * Number(item.price) || 0).toLocaleString()}</p>
                          </div>
                          <div className="w-12 text-right md:text-center">
                              <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-[#D32F2F] transition p-2"><Icons.Trash /></button>
                          </div>
                      </div>
                  ))}
              </div>
              
              <button onClick={addItem} className="mt-4 w-full py-3 border border-dashed border-gray-300 rounded-sm text-gray-500 font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] hover:bg-red-50 transition flex items-center justify-center gap-2 text-sm">
                  <Icons.Plus /> 行を追加
              </button>
          </div>

          <div className="p-6 bg-[#111] text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">合計買掛金額</p>
                  <p className="text-4xl md:text-5xl font-black tracking-tighter font-mono">¥{totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting || !clientName} className="w-full md:w-auto bg-[#D32F2F] text-white px-10 py-4 rounded-sm text-lg font-bold hover:bg-red-600 transition shadow-sm flex items-center justify-center gap-3 disabled:bg-gray-700 disabled:text-gray-500">
                  {isSubmitting ? '処理中...' : <><Icons.Save /> 確定する</>}
              </button>
          </div>
      </div>
    </div>
  );
};
