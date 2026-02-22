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
  const [items, setItems] = useState<any[]>([]);
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wiresMaster = data?.wires || [];

  useEffect(() => {
    if (editingResId) {
      const res = localReservations.find(r => r.id === editingResId);
      if (res) {
        setClientName(res.memberName || '');
        setMemo(res.memo || '');
        try {
          let parsed = res.items;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (Array.isArray(parsed)) {
            const formatted = parsed.map(it => ({
              product: it.product || it.productName || '',
              weight: it.weight || '',
              price: it.price || it.unitPrice || '',
            }));
            setItems(formatted.length > 0 ? formatted : [{ product: '', weight: '', price: '' }]);
          } else {
            setItems([{ product: '', weight: '', price: '' }]);
          }
        } catch(e) { setItems([{ product: '', weight: '', price: '' }]); }
      }
    } else {
      setClientName('');
      setMemo('');
      setItems([{ product: '', weight: '', price: '' }]);
    }
  }, [editingResId, localReservations]);

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'product') {
        const master = wiresMaster.find((w:any) => w.name === value);
        if (master) {
            const copperPrice = Number(data?.market?.copper?.price || 1450);
            const ratio = Number(master.ratio || 0) / 100;
            // 粗利を抜いた想定単価を自動セット（少し安めに設定）
            newItems[index].price = Math.floor(copperPrice * ratio * 0.85); 
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
    
    const payload = editingResId ? {
      action: 'UPDATE_RESERVATION',
      reservationId: editingResId,
      memberName: clientName,
      items: items,
      totalEstimate: totalAmount,
      status: 'COMPLETED', // 計量完了してヤード在庫へ
      memo: memo
    } : {
      action: 'REGISTER_RESERVATION',
      memberName: clientName,
      items: items,
      totalEstimate: totalAmount,
      memo: memo
    };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') { onSuccess(); } 
      else { alert('エラー: ' + result.message); }
    } catch(e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-4xl mx-auto w-full">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{editingResId ? '検収・計量 (POS)' : '新規受付 (POS)'}</h2>
          <p className="text-sm text-gray-500 mt-1">重量と単価を入力して買掛金額を確定します。</p>
        </div>
        {editingResId && (
            <button onClick={onClear} className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1 font-bold text-sm bg-white border border-gray-200 px-3 py-2 rounded-lg">
                <Icons.Close /> 閉じる
            </button>
        )}
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex gap-6">
              <div className="flex-1">
                  {/* ★ 極小フォントだった部分を text-sm に修正 */}
                  <label className="text-sm text-gray-600 font-bold block mb-1.5">お客様 (業者名)</label>
                  <input type="text" className="w-full border border-gray-300 p-3 rounded-xl text-base font-bold outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 transition" placeholder="持込業者名を入力" value={clientName} onChange={e => setClientName(e.target.value)} />
              </div>
              <div className="w-1/3">
                  <label className="text-sm text-gray-600 font-bold block mb-1.5">引継ぎメモ</label>
                  <input type="text" className="w-full border border-gray-300 p-3 rounded-xl text-sm outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 transition" placeholder="例：泥汚れ多め" value={memo} onChange={e => setMemo(e.target.value)} />
              </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto bg-gray-50/30">
              <div className="flex text-sm font-bold text-gray-500 mb-3 px-2">
                  <div className="flex-1">持込品目</div>
                  <div className="w-32 text-right">重量 (kg)</div>
                  <div className="w-32 text-right">買取単価 (円)</div>
                  <div className="w-32 text-right">金額</div>
                  <div className="w-12"></div>
              </div>
              
              <div className="space-y-3">
                  {items.map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-gray-200 shadow-sm group">
                          <div className="flex-1">
                              <select className="w-full bg-transparent p-2 text-base font-bold outline-none cursor-pointer" value={item.product} onChange={e => handleItemChange(idx, 'product', e.target.value)}>
                                  <option value="">品目を選択</option>
                                  {wiresMaster.map((w:any) => <option key={w.name} value={w.name}>{w.name}</option>)}
                                  <option value="雑線">雑線 (手入力)</option>
                                  <option value="その他">その他 (手入力)</option>
                              </select>
                          </div>
                          <div className="w-32 relative">
                              <input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 pr-8 rounded-lg text-lg font-black text-right outline-none focus:border-[#D32F2F]" placeholder="0" value={item.weight} onChange={e => handleItemChange(idx, 'weight', e.target.value)} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">kg</span>
                          </div>
                          <div className="w-32 relative">
                              <input type="number" className="w-full bg-gray-50 border border-gray-200 p-2 pr-6 rounded-lg text-lg font-bold text-right outline-none focus:border-[#D32F2F]" placeholder="0" value={item.price} onChange={e => handleItemChange(idx, 'price', e.target.value)} />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">円</span>
                          </div>
                          <div className="w-32 text-right px-2">
                              <p className="text-xl font-black text-gray-900">¥{(Number(item.weight) * Number(item.price) || 0).toLocaleString()}</p>
                          </div>
                          <div className="w-12 text-center">
                              <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 transition p-2"><Icons.Trash /></button>
                          </div>
                      </div>
                  ))}
              </div>
              
              <button onClick={addItem} className="mt-4 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition flex items-center gap-1 border border-blue-200 border-dashed w-full justify-center">
                  <Icons.Plus /> 品目を追加する
              </button>
          </div>

          <div className="p-6 border-t border-gray-200 bg-white flex justify-between items-end">
              <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">合計 買掛金額</p>
                  <p className="text-5xl font-black text-gray-900 tracking-tight">¥{totalAmount.toLocaleString()}</p>
              </div>
              <button onClick={handleSubmit} disabled={isSubmitting || !clientName} className="bg-[#D32F2F] text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-red-700 transition shadow-lg flex items-center gap-2 disabled:bg-gray-300 disabled:shadow-none">
                  {isSubmitting ? '保存中...' : <><Icons.Save /> {editingResId ? '計量を確定しヤード在庫へ' : '新規受付を完了する'}</>}
              </button>
          </div>
      </div>
    </div>
  );
};
