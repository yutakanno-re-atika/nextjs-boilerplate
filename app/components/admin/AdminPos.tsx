// @ts-nocheck
import React, { useState, useEffect } from 'react';

const Icons = {
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Edit: () => <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any, editingResId: string | null, localReservations: any[], onSuccess: () => void, onClear: () => void }) => {
  const [posCompany, setPosCompany] = useState('');
  const [posPhone, setPosPhone] = useState('');
  const [posDate, setPosDate] = useState(''); 
  const [posMemo, setPosMemo] = useState('');
  const [clientType, setClientType] = useState<'MEMBER' | 'PAST_GUEST' | 'NEW' | null>(null);
  const [clientId, setClientId] = useState('GUEST');
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentRank, setCurrentRank] = useState<'A'|'B'|'C'>('B');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const market = data?.market || {};
  const copperPrice = market.copper?.price || data?.config?.market_price || 0;
  const allClients = data?.clients || [];
  const wireOptions = data?.wires?.filter((w: any) => w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')) || [];

  // 外部から editingResId が渡されたら、予約データを読み込んでセットする
  useEffect(() => {
      if (editingResId) {
          const res = localReservations.find(r => r.id === editingResId);
          if (res) {
              setPosCompany(res.memberName);
              setClientId(res.memberId);
              setPosDate(res.visitDate ? String(res.visitDate).substring(0, 16) : '');
              setPosMemo(res.memo || '');
              
              let items = [];
              try { 
                  let temp = res.items;
                  if (typeof temp === 'string') temp = JSON.parse(temp);
                  if (typeof temp === 'string') temp = JSON.parse(temp); 
                  if (Array.isArray(temp)) items = temp;
              } catch(e){}
              
              const loadedCart = items.map((it:any, idx:number) => {
                 const product = data?.wires?.find((p:any) => p.name === it.product) || data?.castings?.find((p:any) => p.name === it.product);
                 let calculatedPrice = 0;
                 if (product) {
                     const weight = parseFloat(it.weight) || 0;
                     const rank = it.rank || 'B';
                     const rankBonus = rank === 'A' ? 1.02 : (rank === 'C' ? 0.95 : 1.0);
                     let rawPrice = (copperPrice * (product.ratio / 100)) + (product.price_offset || 0);
                     if (product.category === 'wire' || it.product.includes('MIX')) { rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15; }
                     calculatedPrice = Math.floor(Math.max(0, Math.floor(rawPrice * rankBonus)) * weight);
                 } else { calculatedPrice = it.price || 0; }
                 return { id: Date.now().toString() + idx, productId: product ? product.id : '', productName: it.product, weight: it.weight, rank: it.rank || 'B', price: calculatedPrice };
              });
              setCartItems(loadedCart);
          }
      } else {
          // 新規の場合のリセット
          setPosCompany(''); setPosDate(''); setCartItems([]); setPosMemo('');
      }
  }, [editingResId, localReservations, data, copperPrice]);

  useEffect(() => {
      if (!posCompany) {
          setPosPhone(''); setClientType(null); setClientId('GUEST'); return;
      }
      const match = allClients.find((c:any) => c.name === posCompany);
      if (match) {
          setPosPhone(match.phone || ''); 
          if(!editingResId) setPosMemo(match.memo || ''); 
          setClientType(match.type as 'MEMBER' | 'PAST_GUEST'); setClientId(match.id);
      } else {
          setPosPhone(''); if(!editingResId) setPosMemo('【新規】'); setClientType('NEW'); setClientId('GUEST');
      }
  }, [posCompany, allClients, editingResId]);

  const handleAddItem = () => {
    if (!currentProduct || !currentWeight) return;
    const product = data?.wires?.find((p: any) => p.id === currentProduct) || data?.castings?.find((p: any) => p.id === currentProduct);
    if (!product) return;
    const weight = parseFloat(currentWeight);
    const rankBonus = currentRank === 'A' ? 1.02 : currentRank === 'C' ? 0.95 : 1.0;
    let rawPrice = (copperPrice * (product.ratio / 100)) + (product.price_offset || 0);
    if (product.category === 'wire' || currentProduct.includes('MIX')) { rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15; }
    const itemPrice = Math.floor(Math.max(0, Math.floor(rawPrice * rankBonus)) * weight);
    setCartItems([...cartItems, { id: Date.now().toString(), productId: product.id, productName: product.name, weight: weight, rank: currentRank, price: itemPrice }]);
    setCurrentProduct(''); setCurrentWeight(''); setCurrentRank('B');
  };

  const handleUpdateCartItemWeight = (id: string, newWeightStr: string) => {
      const weight = parseFloat(newWeightStr);
      if (isNaN(weight)) { setCartItems(cartItems.map(item => item.id === id ? { ...item, weight: newWeightStr, price: 0 } : item)); return; }
      setCartItems(cartItems.map(item => {
          if (item.id === id) {
              const product = data?.wires?.find((p: any) => p.name === item.productName) || data?.castings?.find((p: any) => p.name === item.productName);
              if (!product) return { ...item, weight: newWeightStr }; 
              const rankBonus = item.rank === 'A' ? 1.02 : item.rank === 'C' ? 0.95 : 1.0;
              let rawPrice = (copperPrice * (product.ratio / 100)) + (product.price_offset || 0);
              if (product.category === 'wire' || item.productName.includes('MIX')) { rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15; }
              const newPrice = Math.floor(Math.max(0, Math.floor(rawPrice * rankBonus)) * weight);
              return { ...item, weight: newWeightStr, price: newPrice };
          }
          return item;
      }));
  };

  const handleRemoveItem = (id: string) => setCartItems(cartItems.filter(item => item.id !== id));
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleSubmitReservation = async () => {
      if (cartItems.length === 0 || !posCompany) return;
      setIsSubmitting(true);
      try {
          const visitDateTime = posDate ? posDate : new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
          let payload: any = {
              visitDate: visitDateTime, memberId: clientId, memberName: posCompany,
              items: cartItems.map(i => ({ product: i.productName, weight: parseFloat(i.weight)||0, price: i.price, rank: i.rank })),
              totalEstimate: cartTotal, memo: posMemo
          };
          if (editingResId) { payload.action = 'UPDATE_RESERVATION'; payload.reservationId = editingResId; payload.status = 'COMPLETED'; } 
          else { payload.action = 'REGISTER_RESERVATION'; }

          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              onSuccess(); // 成功したら親コンポーネントへ通知（カンバンへ戻るなど）
          } else { alert('エラー: ' + result.message); }
      } catch (error) { alert('通信エラーが発生しました。'); }
      setIsSubmitting(false);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-300">
      <header className="mb-4 flex-shrink-0 flex justify-between items-end">
        <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                受付・買取フロント
                {editingResId && <span className="text-[10px] bg-red-100 text-[#D32F2F] px-2 py-1 rounded-full border border-red-200 animate-pulse">予約データの計量中</span>}
            </h2>
        </div>
        <button onClick={onClear} className="text-sm font-bold text-[#D32F2F] bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">入力をクリア</button>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-6 min-h-0">
         <div className="space-y-4 overflow-y-auto pr-2 pb-4">
            <div className={`bg-white p-5 rounded-xl border shadow-sm relative overflow-hidden transition ${editingResId ? 'border-[#D32F2F]' : 'border-gray-200'}`}>
               <div className="absolute top-0 left-0 w-1 h-full bg-[#D32F2F]"></div>
               <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">STEP 1</span> お客様情報</h3>
                   {clientType === 'MEMBER' && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">会員企業</span>}
                   {clientType === 'PAST_GUEST' && <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">過去に取引あり</span>}
                   {clientType === 'NEW' && <span className="text-[10px] font-bold bg-red-100 text-[#D32F2F] px-2 py-1 rounded-full animate-pulse">新規のお客様</span>}
               </div>
               <div className="space-y-3">
                   <div>
                       <label className="text-[10px] text-gray-500 font-bold block mb-1">企業名 / お名前</label>
                       <input list="client-list" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm focus:border-[#D32F2F] outline-none font-bold" value={posCompany} onChange={(e)=>setPosCompany(e.target.value)} />
                       <datalist id="client-list">{allClients.map((c:any) => <option key={c.name} value={c.name} />)}</datalist>
                   </div>
                   <div>
                       <label className="text-[10px] text-gray-500 font-bold block mb-1">引継ぎメモ (備考)</label>
                       <input className={`w-full border p-3 rounded-lg text-sm outline-none transition ${clientType === 'NEW' ? 'bg-red-50 border-red-200 text-[#D32F2F] font-bold' : 'bg-gray-50 border-gray-200'}`} placeholder="注意事項" value={posMemo} onChange={(e)=>setPosMemo(e.target.value)} />
                   </div>
               </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-gray-900"></div>
               <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">STEP 2</span> 新しい品目の追加</h3>
               <div className="space-y-3">
                   <div>
                       <label className="text-[10px] text-gray-500 font-bold block mb-1">銘柄</label>
                       <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm outline-none font-bold" value={currentProduct} onChange={(e)=>setCurrentProduct(e.target.value)}>
                          <option value="">-- 品物 --</option>
                          <optgroup label="電線">{wireOptions.map((p:any) => (<option key={p.id} value={p.id}>{p.name}</option>))}</optgroup>
                          <optgroup label="非鉄金属">{data?.castings?.map((p:any) => (<option key={p.id} value={p.id}>{p.name}</option>))}</optgroup>
                       </select>
                   </div>
                   <div className="flex gap-3">
                       <div className="flex-1 relative">
                           <label className="text-[10px] text-gray-500 font-bold block mb-1">重さ(kg)</label>
                           <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm font-black outline-none" placeholder="0" value={currentWeight} onChange={(e)=>setCurrentWeight(e.target.value)} />
                       </div>
                       <div className="w-24">
                           <label className="text-[10px] text-gray-500 font-bold block mb-1">状態</label>
                           <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm font-bold outline-none" value={currentRank} onChange={(e:any)=>setCurrentRank(e.target.value)}>
                              <option value="B">普通</option><option value="A">良</option><option value="C">劣</option>
                           </select>
                       </div>
                   </div>
                   <button onClick={handleAddItem} disabled={!currentProduct || !currentWeight} className="w-full bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-[#D32F2F] transition disabled:bg-gray-300 flex justify-center mt-2"><Icons.Plus /> カートに追加</button>
               </div>
            </div>
         </div>

         <div className="h-full pb-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg h-full flex flex-col relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cG9seWdvbiBwb2ludHM9IjAsMCA0LDggOCwwIiBmaWxsPSIjRjVGNUY3Ii8+Cjwvc3ZnPg==')] repeat-x"></div>
               <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4 mt-2 flex-shrink-0">
                  <h4 className="font-bold text-xl text-gray-900 tracking-widest">{editingResId ? '買取明細 (計量・修正)' : '受付・買取明細'}</h4>
               </div>
               <div className="mb-2 flex-shrink-0">
                   <div className="flex justify-between items-start">
                       <div><p className="text-[10px] text-gray-400 font-bold mb-0.5">お客様</p><p className="text-base font-bold text-gray-900">{posCompany || '未入力'}</p></div>
                       <div className="text-right"><p className="text-[10px] text-gray-400 font-bold mb-0.5">{editingResId ? '計量日' : '受付'}</p><p className="text-sm font-bold text-gray-900">{posDate ? posDate.replace('T', ' ') : '本日 (飛込)'}</p></div>
                   </div>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-3 border-t border-b border-gray-100 py-4 min-h-[150px]">
                   {cartItems.length === 0 ? <p className="text-center text-gray-400 text-sm mt-10">品物がありません</p> : cartItems.map((item) => (
                       <div key={item.id} className={`bg-gray-50 p-4 rounded-xl border flex flex-col gap-3 transition ${editingResId ? 'border-[#D32F2F]/30 shadow-sm' : 'border-gray-200'}`}>
                           <div className="flex justify-between items-center">
                               <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                   {item.productName}
                                   <span className="text-[9px] font-mono text-gray-400 border px-1 rounded">R:{item.rank}</span>
                               </p>
                               <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Icons.Trash /></button>
                           </div>
                           <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                               <div className="flex items-center gap-2">
                                   <label className="text-[10px] font-bold text-gray-400">実重量</label>
                                   <div className="relative">
                                       <input type="number" className="w-24 bg-red-50 border border-red-200 p-2 rounded text-base font-black text-[#D32F2F] outline-none focus:ring-2 focus:ring-red-200 transition" value={item.weight} onChange={(e) => handleUpdateCartItemWeight(item.id, e.target.value)} />
                                       <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#D32F2F] font-bold">kg</span>
                                   </div>
                                   {editingResId && <Icons.Edit />}
                               </div>
                               <div className="text-right">
                                   <p className="text-[10px] font-bold text-gray-400 mb-0.5">金額</p>
                                   <span className="font-bold text-gray-900">¥{item.price.toLocaleString()}</span>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>

               <div className="pt-4 flex-shrink-0">
                  <p className="text-[10px] text-gray-500 font-bold mb-1">お支払総額 (税込)</p>
                  <div className="flex justify-between items-end mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                      <span className="font-bold text-[#D32F2F] text-lg">¥</span><span className="text-4xl font-black text-[#D32F2F] tracking-tighter">{cartTotal.toLocaleString()}</span>
                  </div>
                  <button onClick={handleSubmitReservation} disabled={cartItems.length === 0 || !posCompany || isSubmitting} className="w-full bg-[#D32F2F] text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:bg-gray-300 flex justify-center items-center gap-2">
                      {isSubmitting ? <span className="animate-pulse">送信中...</span> : 
                       (editingResId ? <><Icons.Check /> 計量を確定して保管へ送る</> : 
                       <><Icons.Check /> 受付を完了して現場へ送る</>)}
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
