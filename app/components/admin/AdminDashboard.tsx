// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  ArrowRight: () => <svg className="w-4 h-4 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Edit: () => <svg className="w-3 h-3 inline-block ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  DragGrip: () => <svg className="w-4 h-4 text-gray-300 cursor-grab active:cursor-grabbing" fill="currentColor" viewBox="0 0 24 24"><path d="M9 3H7v2h2V3zm0 4H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-16h-2v2h2V3zm0 4h-2v2h2V7zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2z" /></svg>
};

export const AdminDashboard = ({ data, setView, onLogout }: { data: any; setView: any; onLogout?: any }) => {
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'COMPETITOR'>('HOME');
  
  const [posCompany, setPosCompany] = useState<string>('');
  const [posPhone, setPosPhone] = useState<string>('');
  const [posDate, setPosDate] = useState<string>(''); 
  const [posMemo, setPosMemo] = useState<string>('');
  const [clientType, setClientType] = useState<'MEMBER' | 'PAST_GUEST' | 'NEW' | null>(null);
  const [clientId, setClientId] = useState<string>('GUEST');
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentRank, setCurrentRank] = useState<'A'|'B'|'C'>('B');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // ★ 魔法のステート：GASから来たデータをフロントエンドに一時コピーし、遅延ゼロで操作する
  const [localReservations, setLocalReservations] = useState<any[]>([]);

  const market = data?.market || {};
  const copperPrice = market.copper?.price || data?.config?.market_price || 0;
  const allClients = data?.clients || [];
  
  // 初期ロード時にGASのデータを localReservations にコピー
  useEffect(() => {
      if (data?.reservations) {
          setLocalReservations(data.reservations);
      }
  }, [data?.reservations]);

  // 以降の計算や表示はすべて「localReservations（遅延ゼロのデータ）」を使う
  const reservedList = localReservations.filter((r: any) => r.status === 'RESERVED');
  const processingList = localReservations.filter((r: any) => r.status === 'PROCESSING' || r.status === 'ARRIVED');
  const completedList = localReservations.filter((r: any) => r.status === 'COMPLETED');

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let actualVolume = 0;
  completedList.forEach(res => {
      const d = new Date(res.visitDate || new Date());
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          let items = [];
          try { 
              let temp = res.items;
              if (typeof temp === 'string') temp = JSON.parse(temp);
              if (typeof temp === 'string') temp = JSON.parse(temp);
              if (Array.isArray(temp)) items = temp;
          } catch(e) {}
          items.forEach((it: any) => { actualVolume += (Number(it.weight) || 0); });
      }
  });

  let forecastVolume = 0;
  [...reservedList, ...processingList].forEach(res => {
      let items = [];
      try { 
          let temp = res.items;
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (Array.isArray(temp)) items = temp;
      } catch(e) {}
      items.forEach((it: any) => { forecastVolume += (Number(it.weight) || 0); });
  });

  const targetMonthly = Number(data?.config?.target_monthly) || 30000;
  const progressActual = Math.min(100, (actualVolume / targetMonthly) * 100);
  const progressForecast = Math.min(100, ((actualVolume + forecastVolume) / targetMonthly) * 100);

  useEffect(() => {
      if (!posCompany) {
          setPosPhone(''); setPosMemo(''); setClientType(null); setClientId('GUEST'); return;
      }
      const match = allClients.find((c:any) => c.name === posCompany);
      if (match) {
          setPosPhone(match.phone || '');
          setPosMemo(match.memo || '');
          setClientType(match.type as 'MEMBER' | 'PAST_GUEST');
          setClientId(match.id);
      } else {
          setPosPhone('');
          if(!editingResId) setPosMemo('【新規】'); 
          setClientType('NEW');
          setClientId('GUEST');
      }
  }, [posCompany, allClients, editingResId]);

  const openPosWithData = (res: any) => {
      setEditingResId(res.id);
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
             if (product.category === 'wire' || it.product.includes('MIX')) {
                 rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15;
             }
             calculatedPrice = Math.floor(Math.max(0, Math.floor(rawPrice * rankBonus)) * weight);
         } else { calculatedPrice = it.price || 0; }
         return { id: Date.now().toString() + idx, productId: product ? product.id : '', productName: it.product, weight: it.weight, rank: it.rank || 'B', price: calculatedPrice };
      });
      setCartItems(loadedCart);
      setAdminTab('POS');
  };

  const handleResetPos = () => {
      setPosCompany(''); setPosDate(''); setCartItems([]); setPosMemo(''); setEditingResId(null);
  };

  const handleAddItem = () => {
    if (!currentProduct || !currentWeight) return;
    const product = data?.wires?.find((p: any) => p.id === currentProduct) || data?.castings?.find((p: any) => p.id === currentProduct);
    if (!product) return;
    const weight = parseFloat(currentWeight);
    const rankBonus = currentRank === 'A' ? 1.02 : currentRank === 'C' ? 0.95 : 1.0;
    let rawPrice = (copperPrice * (product.ratio / 100)) + (product.price_offset || 0);
    if (product.category === 'wire' || currentProduct.includes('MIX')) {
        rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15;
    }
    const itemPrice = Math.floor(Math.max(0, Math.floor(rawPrice * rankBonus)) * weight);
    setCartItems([...cartItems, { id: Date.now().toString(), productId: product.id, productName: product.name, weight: weight, rank: currentRank, price: itemPrice }]);
    setCurrentProduct(''); setCurrentWeight(''); setCurrentRank('B');
  };

  const handleUpdateCartItemWeight = (id: string, newWeightStr: string) => {
      const weight = parseFloat(newWeightStr);
      if (isNaN(weight)) {
          setCartItems(cartItems.map(item => item.id === id ? { ...item, weight: newWeightStr, price: 0 } : item));
          return;
      }
      setCartItems(cartItems.map(item => {
          if (item.id === id) {
              const product = data?.wires?.find((p: any) => p.name === item.productName) || data?.castings?.find((p: any) => p.name === item.productName);
              if (!product) return { ...item, weight: newWeightStr }; 
              const rankBonus = item.rank === 'A' ? 1.02 : item.rank === 'C' ? 0.95 : 1.0;
              let rawPrice = (copperPrice * (product.ratio / 100)) + (product.price_offset || 0);
              if (product.category === 'wire' || item.productName.includes('MIX')) {
                  rawPrice = (copperPrice * (product.ratio / 100) * 0.9) - 15;
              }
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
          if (editingResId) {
              payload.action = 'UPDATE_RESERVATION'; payload.reservationId = editingResId; payload.status = 'COMPLETED'; 
          } else { payload.action = 'REGISTER_RESERVATION'; }

          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          if (result.status === 'success') {
              handleResetPos(); setAdminTab('OPERATIONS'); 
              // 新規追加や重量上書き時は全体のデータ更新が必要なためリロードする
              window.location.reload(); 
          } else { alert('エラー: ' + result.message); }
      } catch (error) { alert('通信エラーが発生しました。'); }
      setIsSubmitting(false);
  };

  // ==========================================
  // ★ 魔法の発動：Optimistic UI Update (遅延ゼロステータス移動)
  // ==========================================
  const handleUpdateStatus = async (resId: string, nextStatus: string) => {
      // 1. 通信を待たずに、画面の見た目（localReservations）だけを一瞬で書き換える
      setLocalReservations(prev => 
          prev.map(res => res.id === resId ? { ...res, status: nextStatus } : res)
      );
      
      // 2. 裏側でこっそりGASへ送信
      setIsUpdatingStatus(resId);
      try {
          const payload = { action: 'UPDATE_RESERVATION_STATUS', reservationId: resId, status: nextStatus };
          await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          // ★ window.location.reload() を削除！これで画面が白くなりません。
      } catch (error) { 
          alert('通信エラーが発生しました。カードが元の位置に戻る可能性があります。'); 
      }
      setIsUpdatingStatus(null);
  };

  // ドラッグ＆ドロップイベント
  const handleDragStart = (e: React.DragEvent, resId: string) => {
      e.dataTransfer.setData('resId', resId);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colStatus: string) => {
      e.preventDefault(); 
      setDragOverCol(colStatus); 
  };

  const handleDragLeave = () => {
      setDragOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
      e.preventDefault();
      setDragOverCol(null);
      const resId = e.dataTransfer.getData('resId');
      if (resId) {
          handleUpdateStatus(resId, newStatus); // 遅延ゼロ移動を発動！
      }
  };

  const renderCard = (res: any, currentStatus: string) => {
      let items: any[] = [];
      try { 
          let temp = res.items;
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (Array.isArray(temp)) items = temp;
      } catch(e){}
      const totalWeight = items ? items.reduce((sum:number, i:any) => sum + (Number(i.weight)||0), 0) : 0;
      const isMember = res.memberId && res.memberId !== 'GUEST';
      let timeStr = "日時不明";
      try {
          if (res.visitDate) {
              const d = new Date(res.visitDate);
              timeStr = !isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` : String(res.visitDate).replace('T', ' ').substring(0, 16);
          }
      } catch(e){}

      return (
        <div 
          key={res.id} 
          draggable
          onDragStart={(e) => handleDragStart(e, res.id)}
          className={`bg-white p-3 rounded-xl shadow-sm border transition relative overflow-hidden group cursor-grab active:cursor-grabbing ${isUpdatingStatus === res.id ? 'opacity-50 scale-95 border-dashed border-gray-400' : 'border-gray-100 hover:shadow-md hover:border-gray-300'}`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${currentStatus === 'PROCESSING' ? 'bg-[#D32F2F]' : currentStatus === 'COMPLETED' ? 'bg-blue-500' : isMember ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
            <div className="pl-2">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                        <Icons.DragGrip />
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isMember ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{isMember ? '会員' : '非会員'}</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">{timeStr}</span>
                </div>
                <p className="font-bold text-gray-900 text-sm truncate pl-5">{res.memberName}</p>
                <div className="mt-1 mb-2 bg-gray-50 rounded p-1.5 border border-gray-100 max-h-16 overflow-y-auto ml-5">
                    {items.map((it:any, idx:number) => (
                        <p key={idx} className="text-[10px] text-gray-600 truncate flex justify-between"><span>{it.product}</span><span className="font-mono">{it.weight}kg</span></p>
                    ))}
                    <div className="border-t border-gray-200 mt-1 pt-1 text-right"><span className="text-[10px] font-bold text-gray-900">計 {totalWeight} kg</span></div>
                </div>
                {res.memo && <p className={`text-[9px] mb-2 p-1 rounded font-bold truncate ml-5 ${res.memo.includes('【新規】') ? 'bg-red-50 text-[#D32F2F]' : 'bg-yellow-50 text-yellow-800'}`}>{res.memo}</p>}
                
                <div className="ml-5">
                    {currentStatus === 'RESERVED' && (
                        <button onClick={() => handleUpdateStatus(res.id, 'PROCESSING')} disabled={isUpdatingStatus === res.id} className="w-full bg-red-50 text-[#D32F2F] py-1.5 rounded-lg text-xs font-bold hover:bg-[#D32F2F] hover:text-white transition flex items-center justify-center">
                            {isUpdatingStatus === res.id ? '移動中...' : <>検収・計量へ <Icons.ArrowRight /></>}
                        </button>
                    )}
                    {currentStatus === 'PROCESSING' && (
                        <button onClick={() => openPosWithData(res)} disabled={isUpdatingStatus === res.id} className="w-full bg-red-50 text-[#D32F2F] py-1.5 rounded-lg text-xs font-bold hover:bg-[#D32F2F] hover:text-white transition flex items-center justify-center border border-red-100">
                            <Icons.Calc /> レジで計量を確定する
                        </button>
                    )}
                </div>
            </div>
        </div>
      );
  };

  const wireOptions = data?.wires?.filter((w: any) => w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')) || [];

  return (
    <div className="h-screen w-full bg-[#F5F5F7] text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* 🔴 サイドバー */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
        <div className="p-5 cursor-pointer border-b border-gray-50" onClick={()=>setView('LP')}>
            <h1 className="text-xl font-serif font-bold text-gray-900">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <button onClick={()=>setAdminTab('HOME')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='HOME' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Home /> ホーム</button>
            <button onClick={()=>setAdminTab('OPERATIONS')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='OPERATIONS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Kanban /> 現場カンバン</button>
            <button onClick={()=>{handleResetPos(); setAdminTab('POS');}} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Calc /> 受付・買取フロント</button>
        </nav>
        {onLogout && (
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition flex items-center gap-3"><Icons.Logout /> ログアウト</button>
            </div>
        )}
      </aside>

      {/* 🔴 メインエリア */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col relative">
         
         {/* HOME */}
         {adminTab === 'HOME' && (
             <div className="max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col h-full">
                 <header className="mb-6 flex-shrink-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">工場長、お疲れ様です。</h2>
                 </header>
                 <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex-shrink-0">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 今月の買付目標と実績</h3>
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs text-gray-500 font-bold">現在の総買付量</span>
                        <span className="text-2xl font-black text-gray-900">{actualVolume.toLocaleString()} <span className="text-xs font-bold text-gray-400">/ {targetMonthly.toLocaleString()} kg</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex mb-2">
                        <div className="bg-[#D32F2F] h-full transition-all duration-1000 ease-out" style={{width: `${progressActual}%`}}></div>
                        <div className="bg-orange-300 h-full transition-all duration-1000 ease-out opacity-80" style={{width: `${progressForecast}%`}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold">
                        <span>■ 確定実績: {actualVolume.toLocaleString()} kg</span>
                        <span className="text-orange-500">■ 本日の見込み (受付中): +{forecastVolume.toLocaleString()} kg</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex-shrink-0">
                     <button onClick={()=>{handleResetPos(); setAdminTab('POS');}} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#D32F2F] hover:shadow-md transition text-left flex items-start gap-4 group">
                         <div className="w-12 h-12 bg-red-50 text-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Calc /></div>
                         <div><h3 className="text-xl font-bold text-gray-900 mb-1">飛込受付・買取</h3><p className="text-xs text-gray-500">新規や予約なしのお客様の受付と明細発行</p></div>
                     </button>
                     <button onClick={()=>setAdminTab('OPERATIONS')} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-orange-500 hover:shadow-md transition text-left flex items-start gap-4 group">
                         <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Kanban /></div>
                         <div><h3 className="text-xl font-bold text-gray-900 mb-1">現場カンバン (進行状況)</h3><p className="text-xs text-gray-500">予約の確認、計量中の荷物、加工待ちのリスト管理</p></div>
                     </button>
                 </div>
             </div>
         )}

         {/* OPERATIONS */}
         {adminTab === 'OPERATIONS' && (
             <div className="flex flex-col h-full animate-in fade-in duration-300">
                 <header className="mb-6 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">現場カンバン</h2>
                        <p className="text-xs text-gray-500 mt-1">カードをドラッグして次の列へ移動できます。</p>
                    </div>
                    <button onClick={()=>{handleResetPos(); setAdminTab('POS');}} className="bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#D32F2F] transition shadow-sm">＋ 飛込受付</button>
                 </header>
                 <div className="flex-1 flex gap-5 overflow-x-auto min-h-0 pb-4">
                     
                     <div 
                         className={`flex-none w-[300px] flex flex-col bg-gray-100/60 rounded-2xl border transition-all duration-200 overflow-hidden ${dragOverCol === 'RESERVED' ? 'border-gray-500 shadow-lg scale-[1.02] bg-gray-200/50' : 'border-gray-200'}`}
                         onDragOver={(e) => handleDragOver(e, 'RESERVED')}
                         onDragLeave={handleDragLeave}
                         onDrop={(e) => handleDrop(e, 'RESERVED')}
                     >
                         <div className="p-3.5 border-b border-gray-200 flex justify-between items-center bg-white shadow-sm z-10">
                             <span className="font-bold text-sm text-gray-800">① 来場待ち / 受付済</span><span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-0.5 rounded-full font-bold">{reservedList.length}</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">{reservedList.length === 0 ? <p className="text-xs text-gray-400 text-center py-8">現在予定はありません</p> : reservedList.map(res => renderCard(res, 'RESERVED'))}</div>
                     </div>

                     <div 
                         className={`flex-none w-[300px] flex flex-col bg-red-50/40 rounded-2xl border transition-all duration-200 overflow-hidden ${dragOverCol === 'PROCESSING' ? 'border-[#D32F2F] shadow-lg scale-[1.02] bg-red-100/60' : 'border-red-100'}`}
                         onDragOver={(e) => handleDragOver(e, 'PROCESSING')}
                         onDragLeave={handleDragLeave}
                         onDrop={(e) => handleDrop(e, 'PROCESSING')}
                     >
                         <div className="p-3.5 border-b-2 border-b-[#D32F2F] flex justify-between items-center bg-white shadow-sm z-10">
                             <span className="font-bold text-sm text-[#D32F2F]">② 検収・計量中</span><span className="bg-[#D32F2F] text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">{processingList.length}</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">{processingList.length === 0 ? <p className="text-xs text-gray-400 text-center py-8">現在計量中はありません</p> : processingList.map(res => renderCard(res, 'PROCESSING'))}</div>
                     </div>

                     <div 
                         className={`flex-none w-[300px] flex flex-col bg-blue-50/40 rounded-2xl border transition-all duration-200 overflow-hidden ${dragOverCol === 'COMPLETED' ? 'border-blue-500 shadow-lg scale-[1.02] bg-blue-100/60' : 'border-blue-100'}`}
                         onDragOver={(e) => handleDragOver(e, 'COMPLETED')}
                         onDragLeave={handleDragLeave}
                         onDrop={(e) => handleDrop(e, 'COMPLETED')}
                     >
                         <div className="p-3.5 border-b-2 border-b-blue-500 flex justify-between items-center bg-white shadow-sm z-10">
                             <span className="font-bold text-sm text-blue-600">③ ナゲット加工待ち</span><span className="bg-blue-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold shadow-sm">{completedList.length}</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">{completedList.length === 0 ? <p className="text-xs text-blue-300 text-center py-8">現在加工待ちはありません</p> : completedList.map(res => renderCard(res, 'COMPLETED'))}</div>
                     </div>
                 </div>
             </div>
         )}

         {/* POS */}
         {adminTab === 'POS' && (
            <div className="h-full flex flex-col animate-in fade-in duration-300">
              <header className="mb-4 flex-shrink-0 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        受付・買取フロント
                        {editingResId && <span className="text-[10px] bg-red-100 text-[#D32F2F] px-2 py-1 rounded-full border border-red-200 animate-pulse">予約データの計量中</span>}
                    </h2>
                </div>
                <button onClick={handleResetPos} className="text-sm font-bold text-[#D32F2F] bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">入力をクリア</button>
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
                                               <input 
                                                   type="number" 
                                                   className="w-24 bg-red-50 border border-red-200 p-2 rounded text-base font-black text-[#D32F2F] outline-none focus:ring-2 focus:ring-red-200 transition" 
                                                   value={item.weight} 
                                                   onChange={(e) => handleUpdateCartItemWeight(item.id, e.target.value)} 
                                               />
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
                               (editingResId ? <><Icons.Check /> 計量を確定して加工待ちへ送る</> : 
                               <><Icons.Check /> 受付を完了して現場へ送る</>)}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}

      </main>
    </div>
  );
};
