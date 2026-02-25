// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any; editingResId: string | null; localReservations: any[]; onSuccess: () => void; onClear: () => void; }) => {
  const [clientName, setClientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('GUEST'); // ★ 顧客IDの保持
  const [showSuggest, setShowSuggest] = useState(false); // ★ サジェスト表示フラグ
  const [items, setItems] = useState<any[]>([]);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wiresMaster = data?.wires || [];
  const castingsMaster = data?.castings || [];
  const clients = data?.clients || []; // ★ 顧客マスター

  useEffect(() => {
    if (editingResId) {
      const res = localReservations.find(r => r.id === editingResId);
      if (res) {
        setClientName(res.memberName || '');
        setSelectedClientId(res.memberId || 'GUEST');
        setMemo(res.memo || '');
        try {
          let parsed = res.items;
          if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
          if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch(e) {} }
          if (Array.isArray(parsed)) {
            const formatted = parsed.map(it => ({ product: it.product || it.productName || '', weight: it.weight || '', price: it.price || it.unitPrice || '' }));
            setItems(formatted.length > 0 ? formatted : [{ product: '', weight: '', price: '' }]);
          } else { setItems([{ product: '', weight: '', price: '' }]); }
        } catch(e) { setItems([{ product: '', weight: '', price: '' }]); }
      }
    } else {
      setClientName(''); setSelectedClientId('GUEST'); setMemo(''); setItems([{ product: '', weight: '', price: '' }]);
    }
  }, [editingResId, localReservations]);

  // ★ 顧客名の入力とサジェスト処理
  const handleNameChange = (e: any) => {
      setClientName(e.target.value);
      setSelectedClientId('GUEST'); // 手入力で変更されたら一旦GUEST（新規）に戻す
      setShowSuggest(true);
  };
  const handleSelectClient = (client: any) => {
      setClientName(client.name);
      setSelectedClientId(client.id);
      setShowSuggest(false);
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product') {
        const wire = wiresMaster.find((w:any) => w.name === value);
        const casting = castingsMaster.find((c:any) => c.name === value);
        if (wire) {
            const copperPrice = Number(data?.market?.copper?.price || 1450);
            const ratio = Number(wire.ratio || 0) / 100;
            newItems[index].price = Math.floor(copperPrice * ratio * 0.85); 
        } else if (casting) {
            let basePrice = Number(data?.market?.copper?.price || 1450);
            if (casting.type === 'BRASS') basePrice = Number(data?.market?.brass?.price || 980);
            if (casting.type === 'ZINC') basePrice = Number(data?.market?.zinc?.price || 450);
            if (casting.type === 'LEAD') basePrice = Number(data?.market?.lead?.price || 380);
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
    
    // ★ memberId をペイロードに追加して紐付けを確実に
    const payload = editingResId ? {
      action: 'UPDATE_RESERVATION', reservationId: editingResId, memberId: selectedClientId, memberName: clientName, items: items, totalEstimate: totalAmount, status: 'COMPLETED', memo: memo
    } : { action: 'REGISTER_RESERVATION', memberId: selectedClientId, memberName: clientName, items: items, totalEstimate: totalAmount, memo: memo };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') { 
          alert('受付・計量が完了しました！');
          onSuccess(); 
          window.location.reload(); 
      } else { alert('エラー: ' + result.message); }
    } catch(e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-5xl mx-auto w-full">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-gray-900">{editingResId ? '検収・計量 (POS)' : '新規受付 (POS)'}</h2>
          <p className="text-base text-gray-500 mt-2">重量と単価を入力して買掛金額を確定します。</p>
        </div>
        {editingResId && (
            <button onClick={onClear} className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition flex items-center gap-2 font-bold text-sm bg-white border border-gray-300 px-4 py-2.5 rounded-xl shadow-sm">
                <Icons.Close /> 閉じる
            </button>
        )}
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="flex-1 relative">
                  <label className="text-sm text-gray-600 font-bold block mb-2">お客様 (業者名)</label>
                  {/* ★ サジェスト付き入力欄 */}
                  <input type="text" className="w-full border border-gray-300 p-3.5 rounded-xl text-lg font-bold outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 transition" placeholder="業者名を入力..." value={clientName} onChange={handleNameChange} onFocus={()=>setShowSuggest(true)} onBlur={()=>setTimeout(()=>setShowSuggest(false), 200)} />
                  {showSuggest && clientName && (
                      <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {clients.filter((c:any) => c.name.includes(clientName)).map((c:any) => (
                              <li key={c.id} onMouseDown={() => handleSelectClient(c)} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                                  <div className="font-bold text-gray-900">{c.name}</div>
                                  <div className="text-xs text-gray-500">{c.phone || '連絡先未登録'}</div>
                              </li>
                          ))}
                          {clients.filter((c:any) => c.name.includes(clientName)).length === 0 && (
                              <li className="p-3 text-sm text-gray-500 bg-gray-50">「{clientName}」で新規業者として登録されます</li>
                          )}
                      </ul>
                  )}
              </div>
              <div className="md:w-1/3 w-full">
                  <label className="text-sm text-gray-600 font-bold block mb-2">引継ぎメモ</label>
                  <input type="text" className="w-full border border-gray-300 p-3.5 rounded-xl text-base outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 transition" placeholder="例：泥汚れ多め" value={memo} onChange={e => setMemo(e.target.value)} />
              </div>
          </div>

          <div className="p-4 md:p-6 flex-1 overflow-y-auto bg-gray-50/30">
              <div className="hidden md:flex text-sm font-bold text-gray-500 mb-3 px-2">
                  <div className="flex-1">持込品目</div>
                  <div className="w-36 text-right">重量 (kg)</div>
                  <div className="w-40 text-right">買取単価 (円)</div>
                  <div className="w-40 text-right">金額</div>
                  <div className="w-12"></div>
              </div>
              
              <div className="space-y-4">
                  {items.map((item, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-center bg-white p-4 md:p-3 rounded-xl border border-gray-200 shadow-sm group hover:border-[#D32F2F] transition">
                          <div className="flex-1 w-full md:w-auto">
                              <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">持込品目</label>
                              <select className="w-full bg-transparent p-2 md:p-2 border md:border-transparent border-gray-300 rounded-lg text-base font-bold outline-none cursor-pointer text-gray-900" value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                                  <option value="">-- 品目を選択 --</option>
                                  <optgroup label="電線類 (W/M)">
                                      {wiresMaster.map((w:any) => <option key={`w-${w.id}`} value={w.name}>{w.name} [銅率{w.ratio}%]</option>)}
                                  </optgroup>
                                  <optgroup label="非鉄金属類 (C/M)">
                                      {castingsMaster.map((c:any) => <option key={`c-${c.id}`} value={c.name}>{c.name} [{c.type}]</option>)}
                                  </optgroup>
                                  <option value="雑線">雑線 (手入力)</option>
                                  <option value="その他">その他 (手入力)</option>
                              </select>
                          </div>
                          
                          <div className="flex gap-3 items-end">
                              <div className="flex-1 md:w-36 relative">
                                  <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">重量 (kg)</label>
                                  <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full bg-gray-50 border border-gray-200 p-3 pr-8 rounded-xl text-xl font-black text-right outline-none focus:border-[#D32F2F] focus:bg-white transition" placeholder="0" value={item.weight} onChange={e => handleItemChange(idx, 'weight', e.target.value)} />
                                  <span className="absolute right-3 bottom-3 text-sm text-gray-500 font-bold">kg</span>
                              </div>
                              <div className="flex-1 md:w-40 relative">
                                  <label className="md:hidden text-xs font-bold text-gray-500 mb-1 block">単価 (円)</label>
                                  <input type="number" inputMode="decimal" pattern="[0-9]*" className="w-full bg-gray-50 border border-gray-200 p-3 pr-6 rounded-xl text-xl font-bold text-right outline-none focus:border-[#D32F2F] focus:bg-white transition" placeholder="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} />
                                  <span className="absolute right-3 bottom-3 text-sm text-gray-500 font-bold">円</span>
                              </div>
                          </div>

                          <div className="flex justify-between items-center mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-dashed border-gray-200">
                              <div className="md:w-40 md:text-right px-2">
                                  <label className="md:hidden text-xs font-bold text-gray-500 block">金額</label>
                                  <p className="text-2xl font-black text-gray-900">¥{(Number(item.weight) * Number(item.price) || 0).toLocaleString()}</p>
                              </div>
                              <div className="w-12 text-right md:text-center">
                                  <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 transition p-3 md:p-2.5 rounded-lg"><Icons.Trash /></button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              <button onClick={addItem} className="mt-6 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-3.5 rounded-xl transition flex items-center gap-2 border border-blue-200 border-dashed w-full justify-center">
                  <Icons.Plus /> 品目を追加する
              </button>
          </div>

          <div className="p-4 md:p-6 border-t border-gray-200 bg-white flex flex-col md:flex-row md:justify-between items-center gap-4">
              <div className="w-full md:w-auto text-center md:text-left">
                  <p className="text-sm font-bold text-gray-500 mb-1">合計 買掛金額</p>
                  <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">¥{totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting || !clientName} className="w-full md:w-auto bg-[#D32F2F] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-red-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:shadow-none">
                  {isSubmitting ? '保存中...' : <><Icons.Save /> {editingResId ? '計量を確定しヤード在庫へ' : '新規受付を完了する'}</>}
              </button>
          </div>
      </div>
    </div>
  );
};
