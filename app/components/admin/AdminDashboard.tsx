// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { MarketData } from '../../types';

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Radar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
};

// ★ 2つのデータベース（会員 / 過去の非会員）をシミュレート
// ※ 将来的にGASの doGet で「安全な顧客リスト」を取得してここに流し込みます
const memberDB = [
  { id: "M-001", name: "月寒建設 株式会社", phone: "090-1111-2222", memo: "特1号銅線が多い。荷降ろし手伝い不要。" },
  { id: "M-002", name: "道央設備", phone: "080-3333-4444", memo: "いつも午後イチに来店。" }
];
const pastGuestDB = [
  { id: "GUEST", name: "佐藤モータース", phone: "011-555-6666", memo: "自動車ハーネス中心。歩留まり要確認。" },
  { id: "GUEST", name: "田中スクラップ", phone: "090-9999-8888", memo: "前回は雑線のみ。現金払い希望。" }
];
const allClients = [
    ...memberDB.map(c => ({...c, type: 'MEMBER'})), 
    ...pastGuestDB.map(c => ({...c, type: 'PAST_GUEST'}))
];

export const AdminDashboard = ({ data, setView }: { data: any; setView: any }) => {
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'COMPETITOR'>('POS');
  
  // 受付フロント用ステート
  const [posCompany, setPosCompany] = useState<string>('');
  const [posPhone, setPosPhone] = useState<string>('');
  const [posDate, setPosDate] = useState<string>(''); 
  const [posMemo, setPosMemo] = useState<string>('');
  const [clientType, setClientType] = useState<'MEMBER' | 'PAST_GUEST' | 'NEW' | null>(null);
  const [clientId, setClientId] = useState<string>('GUEST');
  
  // 複数品目用ステート (カート)
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentProduct, setCurrentProduct] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [currentRank, setCurrentRank] = useState<'A'|'B'|'C'>('B');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 相場データ
  const market = data?.market || {};
  const copperPrice = market.copper?.price || data?.config?.market_price || 0;
  
  // --- 顧客の予測・自動補完ロジック ---
  useEffect(() => {
      if (!posCompany) {
          setPosPhone(''); setPosMemo(''); setClientType(null); setClientId('GUEST'); return;
      }
      const match = allClients.find(c => c.name === posCompany);
      if (match) {
          setPosPhone(match.phone);
          setPosMemo(match.memo);
          setClientType(match.type as 'MEMBER' | 'PAST_GUEST');
          setClientId(match.id);
      } else {
          setPosPhone('');
          setPosMemo('【新規】'); // 現場へ送る備考
          setClientType('NEW');
          setClientId('GUEST');
      }
  }, [posCompany]);

  // --- カート追加 ---
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
    
    setCartItems([...cartItems, {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        weight: weight,
        rank: currentRank,
        price: itemPrice
    }]);
    setCurrentProduct(''); setCurrentWeight(''); setCurrentRank('B');
  };

  const handleRemoveItem = (id: string) => setCartItems(cartItems.filter(item => item.id !== id));
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  // ★ 受付完了（GASへの送信）アクション
  const handleSubmitReservation = async () => {
      if (cartItems.length === 0 || !posCompany) return;
      setIsSubmitting(true);
      
      try {
          // 日時が空欄の場合は「現在時刻（飛込）」として送信
          const visitDateTime = posDate ? posDate : new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
          
          const payload = {
              action: 'REGISTER_RESERVATION',
              visitDate: visitDateTime,
              memberId: clientId,
              memberName: posCompany,
              // GASに保存するために、簡易的なJSON文字列に変換
              items: cartItems.map(i => ({ product: i.productName, weight: i.weight, price: i.price })),
              totalEstimate: cartTotal,
              memo: posMemo
          };

          const response = await fetch('/api/gas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          const result = await response.json();
          if (result.status === 'success') {
              alert('受付データが現場へ送信されました！');
              // フォームをリセット
              setPosCompany(''); setPosDate(''); setCartItems([]); setPosMemo(''); setPosPhone('');
              // カンバン画面へ自動遷移して確認させる
              setAdminTab('OPERATIONS');
              // ※ 理想的にはここでデータを再フェッチ（ページリロード等）してカンバンを更新します
              window.location.reload(); 
          } else {
              alert('エラーが発生しました: ' + result.message);
          }
      } catch (error) {
          alert('通信エラー: データベースに接続できませんでした。');
      }
      setIsSubmitting(false);
  };

  // カンバン描画用
  const reservations = data?.reservations || [];
  const reservedList = reservations.filter((r: any) => r.status === 'RESERVED');
  const processingList = reservations.filter((r: any) => r.status === 'PROCESSING' || r.status === 'ARRIVED');
  const renderCard = (res: any, isProcessing: boolean = false) => {
      let items: any[] = [];
      try { items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items; } catch(e){}
      const mainItem = items && items[0] ? items[0].product : '不明な品目';
      const totalWeight = items ? items.reduce((sum:number, i:any) => sum + (Number(i.weight)||0), 0) : 0;
      const isMember = res.memberId && res.memberId !== 'GUEST';
      let timeStr = "未定";
      try {
          if (res.visitDate) {
              const d = new Date(res.visitDate);
              timeStr = !isNaN(d.getTime()) ? `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` : String(res.visitDate).replace('T', ' ').substring(0, 16);
          }
      } catch(e){}

      return (
        <div key={res.id} className={`bg-white p-3 rounded-lg shadow-sm border border-gray-100 transition hover:shadow-md ${isProcessing ? 'border-l-4 border-l-[#D32F2F]' : (isMember ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-gray-400')}`}>
            <div className="flex justify-between items-center mb-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${isMember ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                    {isMember ? '会員' : '非会員'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold">{timeStr}</span>
            </div>
            <p className="font-bold text-gray-900 text-sm truncate">{res.memberName}</p>
            <p className="text-xs text-gray-600 truncate">{mainItem} / 約 <span className="font-bold text-gray-900">{totalWeight}</span> kg</p>
        </div>
      );
  };

  const wireOptions = data?.wires?.filter((w: any) => w.name.includes('ミックス') || w.name.toUpperCase().includes('MIX')) || [];

  return (
    <div className="h-screen w-full bg-[#F5F5F7] text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* 🔴 サイドバー (省略) */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
        <div className="p-5 cursor-pointer border-b border-gray-50" onClick={()=>setView('LP')}>
            <h1 className="text-xl font-serif font-bold text-gray-900">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            <button onClick={()=>setAdminTab('HOME')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='HOME' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Home /> ホーム</button>
            <button onClick={()=>setAdminTab('OPERATIONS')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='OPERATIONS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Kanban /> 現場カンバン</button>
            <button onClick={()=>setAdminTab('POS')} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Calc /> 受付・買取レジ</button>
        </nav>
      </aside>

      {/* 🔴 メインエリア */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
         
         {/* 2. OPERATIONS */}
         {adminTab === 'OPERATIONS' && (
             <div className="flex flex-col h-full animate-in fade-in duration-300">
                 <header className="mb-4 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">現場カンバン</h2>
                    <button onClick={()=>setAdminTab('POS')} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#D32F2F] transition shadow-sm">＋ 飛込受付</button>
                 </header>
                 <div className="flex-1 flex gap-4 overflow-x-auto min-h-0">
                     <div className="flex-none w-[280px] flex flex-col bg-gray-100/50 rounded-xl border border-gray-200 overflow-hidden">
                         <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white">
                             <span className="font-bold text-sm text-gray-700">① 来場待ち / 受付済</span>
                             <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold">{reservedList.length}</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                             {reservedList.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">予定なし</p> : reservedList.map(res => renderCard(res, false))}
                         </div>
                     </div>
                     <div className="flex-none w-[280px] flex flex-col bg-red-50/30 rounded-xl border border-red-100 overflow-hidden">
                         <div className="p-3 border-b-2 border-b-[#D32F2F] flex justify-between items-center bg-white">
                             <span className="font-bold text-sm text-[#D32F2F]">② 検収・計量中</span>
                         </div>
                         <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                              {processingList.length === 0 ? <p className="text-xs text-gray-400 text-center py-4">計量中なし</p> : processingList.map(res => renderCard(res, true))}
                         </div>
                     </div>
                 </div>
             </div>
         )}

         {/* 3. POS (受付フロント特化) */}
         {adminTab === 'POS' && (
            <div className="h-full flex flex-col animate-in fade-in duration-300">
              <header className="mb-4 flex-shrink-0 flex justify-between items-end">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">受付・買取フロント</h2>
                </div>
                <button onClick={()=>{setPosCompany(''); setPosDate(''); setCartItems([]);}} className="text-sm font-bold text-[#D32F2F] bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition">リセット</button>
              </header>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 min-h-0">
                 
                 {/* 左側：入力フォーム */}
                 <div className="space-y-4 overflow-y-auto pr-2 pb-4">
                    
                    {/* ① お客様情報 */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-[#D32F2F]"></div>
                       <div className="flex justify-between items-center mb-4">
                           <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                               <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">STEP 1</span> 受付情報
                           </h3>
                           {/* ★ 顧客タイプによるバッジの出し分け */}
                           {clientType === 'MEMBER' && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">会員企業</span>}
                           {clientType === 'PAST_GUEST' && <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">過去に取引あり</span>}
                           {clientType === 'NEW' && <span className="text-[10px] font-bold bg-red-100 text-[#D32F2F] px-2 py-1 rounded-full animate-pulse">新規のお客様</span>}
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3 mb-3">
                           <div className="col-span-2 md:col-span-1">
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">企業名 / お名前</label>
                               <input 
                                 list="client-list"
                                 className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm focus:border-[#D32F2F] outline-none transition font-bold" 
                                 placeholder="名前を入力..." 
                                 value={posCompany} 
                                 onChange={(e)=>setPosCompany(e.target.value)} 
                               />
                               <datalist id="client-list">
                                   {allClients.map(c => <option key={c.name} value={c.name} />)}
                               </datalist>
                           </div>
                           <div className="col-span-2 md:col-span-1">
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">ご連絡先</label>
                               <input type="tel" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm outline-none" placeholder="090-XXXX" value={posPhone} onChange={(e)=>setPosPhone(e.target.value)} />
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                           <div>
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">受付日時 (空欄なら「今すぐ」)</label>
                               <input type="datetime-local" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm focus:border-[#D32F2F] outline-none" value={posDate} onChange={(e)=>setPosDate(e.target.value)} />
                           </div>
                           <div>
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">現場への引継ぎメモ (備考)</label>
                               <input 
                                 className={`w-full border p-3 rounded-lg text-sm outline-none transition ${clientType === 'NEW' ? 'bg-red-50 border-red-200 text-[#D32F2F] font-bold' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                 placeholder="注意事項など" value={posMemo} onChange={(e)=>setPosMemo(e.target.value)} 
                               />
                           </div>
                       </div>
                    </div>

                    {/* ② 銘柄追加 */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-1 h-full bg-gray-900"></div>
                       <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                           <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">STEP 2</span> 持ち込み品目の登録
                       </h3>
                       
                       <div className="flex flex-col md:flex-row gap-3 items-end">
                           <div className="flex-1 w-full">
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">銘柄</label>
                               <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm outline-none font-bold" value={currentProduct} onChange={(e)=>setCurrentProduct(e.target.value)}>
                                  <option value="">-- 品物 --</option>
                                  <optgroup label="電線">{wireOptions.map((p:any) => (<option key={p.id} value={p.id}>{p.name}</option>))}</optgroup>
                                  <optgroup label="非鉄金属">{data?.castings?.map((p:any) => (<option key={p.id} value={p.id}>{p.name}</option>))}</optgroup>
                               </select>
                           </div>
                           <div className="w-full md:w-28 relative">
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">重さ(kg)</label>
                               <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm font-black outline-none" placeholder="0" value={currentWeight} onChange={(e)=>setCurrentWeight(e.target.value)} />
                           </div>
                           <div className="w-full md:w-24">
                               <label className="text-[10px] text-gray-500 font-bold block mb-1">状態</label>
                               <select className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-900 text-sm font-bold outline-none" value={currentRank} onChange={(e:any)=>setCurrentRank(e.target.value)}>
                                  <option value="B">普通</option><option value="A">良</option><option value="C">劣</option>
                               </select>
                           </div>
                           <button onClick={handleAddItem} disabled={!currentProduct || !currentWeight} className="w-full md:w-auto bg-gray-900 text-white p-3 rounded-lg font-bold hover:bg-[#D32F2F] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-1">
                               <Icons.Plus /> 追加
                           </button>
                       </div>
                    </div>
                 </div>

                 {/* 右側：受付票 */}
                 <div className="h-full pb-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg h-full flex flex-col relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cG9seWdvbiBwb2ludHM9IjAsMCA0LDggOCwwIiBmaWxsPSIjRjVGNUY3Ii8+Cjwvc3ZnPg==')] repeat-x"></div>
                       
                       <div className="text-center border-b border-dashed border-gray-300 pb-4 mb-4 mt-2 flex-shrink-0">
                          <h4 className="font-bold text-xl text-gray-900 tracking-widest">{posDate ? '事前予約受付票' : '受付・買取明細'}</h4>
                       </div>
                       
                       <div className="mb-4 flex-shrink-0">
                           <div className="flex justify-between items-start mb-2">
                               <div>
                                  <p className="text-[10px] text-gray-400 font-bold mb-0.5">お客様</p>
                                  <p className="text-base font-bold text-gray-900">{posCompany || '未入力'}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[10px] text-gray-400 font-bold mb-0.5">受付予定</p>
                                  <p className="text-sm font-bold text-gray-900">{posDate ? posDate.replace('T', ' ') : '本日 (飛込)'}</p>
                               </div>
                           </div>
                           {posMemo && <div className={`p-2 rounded text-xs font-bold border mt-2 ${clientType === 'NEW' ? 'bg-red-50 text-[#D32F2F] border-red-100' : 'bg-yellow-50 text-yellow-800 border-yellow-100'}`}>
                               備考: {posMemo}
                           </div>}
                       </div>
                       
                       <div className="flex-1 overflow-y-auto space-y-2 border-t border-b border-gray-100 py-3 min-h-[150px]">
                           {cartItems.length === 0 ? (
                               <p className="text-center text-gray-400 text-sm mt-10">品物が登録されていません</p>
                           ) : (
                               cartItems.map((item, index) => (
                                   <div key={item.id} className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center group">
                                       <div className="flex-1">
                                           <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                               {item.productName}
                                               <span className="text-[9px] font-mono text-gray-400 border border-gray-200 px-1 rounded">R:{item.rank}</span>
                                           </p>
                                           <p className="text-xs text-gray-500 font-mono mt-1">{item.weight} kg</p>
                                       </div>
                                       <div className="text-right flex items-center gap-3">
                                           <span className="font-bold text-gray-900">¥{item.price.toLocaleString()}</span>
                                           <button onClick={() => handleRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 transition p-1"><Icons.Trash /></button>
                                       </div>
                                   </div>
                               ))
                           )}
                       </div>

                       <div className="pt-4 mt-2 flex-shrink-0">
                          <p className="text-[10px] text-gray-500 font-bold mb-1">お支払予定額 (税込)</p>
                          <div className="flex justify-between items-end mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
                              <span className="font-bold text-[#D32F2F] text-lg">¥</span>
                              <span className="text-4xl font-black text-[#D32F2F] tracking-tighter">{cartTotal.toLocaleString()}</span>
                          </div>
                          
                          {/* ★ 送信ボタン（API連動） */}
                          <button 
                            onClick={handleSubmitReservation}
                            disabled={cartItems.length === 0 || !posCompany || isSubmitting}
                            className="w-full bg-[#D32F2F] text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition shadow-md disabled:bg-gray-300 disabled:shadow-none flex justify-center items-center gap-2"
                          >
                              {isSubmitting ? (
                                  <span className="animate-pulse">送信中...</span>
                              ) : (
                                  <><Icons.Check /> {posDate ? '予約を確定して現場へ送る' : '受付を完了して現場へ送る'}</>
                              )}
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
