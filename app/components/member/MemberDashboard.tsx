"use client";
import React, { useState } from 'react';
import { UserData, MarketData } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
};

interface MemberProps {
  user: UserData | null;
  data: MarketData | null;
  setView: (view: any) => void;
}

export const MemberDashboard = ({ user, data, setView }: MemberProps) => {
  const [memberTab, setMemberTab] = useState<'DASHBOARD' | 'HISTORY' | 'RESERVATION'>('DASHBOARD');
  const [reserveProduct, setReserveProduct] = useState('');
  const [reserveWeight, setReserveWeight] = useState('');
  const [reserveDate, setReserveDate] = useState('');
  const [reserveMemo, setReserveMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const marketPrice = data?.config?.market_price || 0;
  const myClientId = (user as any)?.clientId || (user as any)?.id;

  // ★ GASのReservationsから自分の取引データだけを抽出（日付降順）
  const myHistory = (data?.reservations || [])
    .filter((r: any) => r.memberId === myClientId)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getUnitPrice = () => {
    const product = data?.wires.find(x => x.id === reserveProduct) || data?.castings.find(x => x.id === reserveProduct);
    if (!product) return 0;
    const basePrice = marketPrice > 0 ? marketPrice : 1450;
    return Math.floor(basePrice * (product.ratio / 100) * 0.9);
  };

  const handleReserveSubmit = async () => {
      const unitPrice = getUnitPrice();
      const weight = parseFloat(reserveWeight);
      const total = weight * unitPrice;
      
      if (!reserveProduct || isNaN(weight) || weight <= 0) { alert("品目と重量を正しく入力してください。"); return; }
      if (!reserveDate) { alert("訪問予定日時を選択してください。"); return; }
      
      setIsSubmitting(true);
      const productObj = data?.wires.find(x => x.id === reserveProduct) || data?.castings.find(x => x.id === reserveProduct);

      const payload = {
        action: 'REGISTER_RESERVATION',
        visitDate: reserveDate,
        memberId: myClientId,
        memberName: (user as any)?.companyName || (user as any)?.name,
        memo: reserveMemo,
        items: [{ product: productObj?.name, weight: weight, price: unitPrice }], // price に統一
        totalEstimate: total
      };
      
      try {
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
          const d = await res.json();
          if(d.status === 'success') {
            alert('予約が完了しました。工場でお待ちしております。');
            setReserveProduct(''); setReserveWeight('');
            // ページリロードなしで最新データを取得できるとベストですが、今回はアラートのみ
          } else {
            alert('予約エラー: ' + d.message);
          }
      } catch(e) { alert('通信エラーが発生しました'); }
      finally { setIsSubmitting(false); }
  };

  const generateEstimatePDF = async () => {
    const unitPrice = getUnitPrice();
    const weight = parseFloat(reserveWeight) || 0;
    if(weight <= 0) { alert("重量を入力してください"); return; }

    const doc = new jsPDF();
    try {
      const res = await fetch('/fonts/NotoSansJP-Regular.ttf');
      if (!res.ok) throw new Error();
      const fontBuffer = await res.arrayBuffer();
      const fontBase64 = Buffer.from(fontBuffer).toString('base64');
      doc.addFileToVFS('NotoSansJP.ttf', fontBase64);
      doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal');
      doc.setFont('NotoSansJP');
    } catch (e) { alert("フォントエラー"); return; }

    doc.setFontSize(18); doc.text("御見積書 / QUOTATION", 105, 20, { align: "center" });
    doc.setFontSize(12); doc.text(`日付: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text(`お客様: ${(user as any)?.companyName || (user as any)?.name || 'ご担当者様'}`, 15, 38);
    doc.setFontSize(10); doc.text("株式会社 月寒製作所 苫小牧工場", 195, 30, { align: "right" });
    
    const productObj = data?.wires.find(x => x.id === reserveProduct) || data?.castings.find(x => x.id === reserveProduct);
    const total = weight * unitPrice;

    autoTable(doc, { 
        head: [['品目', '予定重量', '概算単価', '概算金額']], 
        body: [
          [productObj?.name || '未選択', `${weight} kg`, `¥${unitPrice.toLocaleString()}`, `¥${total.toLocaleString()}`],
          ['合計 (税込)', '', '', `¥${total.toLocaleString()}`]
        ], 
        startY: 50,
        styles: { font: 'NotoSansJP' },
        headStyles: { fillColor: [211, 47, 47] }
    });
    doc.save(`Estimate.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111] font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-white p-8 border-r border-gray-200">
        <div className="mb-12 cursor-pointer" onClick={()=>setView('LP')}>
            <h1 className="text-2xl font-serif font-bold text-[#111]">MY <span className="text-[#D32F2F]">PAGE</span></h1>
        </div>
        <div className="text-center mb-8">
           <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl shadow-inner">🏗️</div>
           <p className="font-bold text-lg mb-2">{(user as any)?.companyName || (user as any)?.name || 'User'}</p>
           <span className={`text-xs px-4 py-1.5 rounded-full font-bold border shadow-sm ${user?.rank==='GOLD' ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 border-yellow-300' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
               {user?.rank} MEMBER
           </span>
        </div>
        <nav className="space-y-2">
           <button onClick={()=>setMemberTab('DASHBOARD')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${memberTab==='DASHBOARD' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.Dashboard /> ダッシュボード</button>
           <button onClick={()=>setMemberTab('RESERVATION')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${memberTab==='RESERVATION' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.Calc /> 予約・見積</button>
           <button onClick={()=>setMemberTab('HISTORY')} className={`w-full text-left p-4 rounded-xl text-sm font-bold transition flex items-center gap-3 ${memberTab==='HISTORY' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.History /> 取引履歴</button>
        </nav>
        <div className="mt-auto pt-12">
            <button onClick={() => setView('LP')} className="w-full text-xs text-gray-400 hover:text-[#D32F2F] font-bold uppercase tracking-widest transition">Log out</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
         {memberTab === 'DASHBOARD' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
               <div className="bg-gradient-to-br from-[#111] to-[#222] text-white rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-10 opacity-10 scale-150"><Icons.Star /></div>
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                     <div>
                         <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Partner Status</p>
                         <h2 className="text-4xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{user?.rank} RANK</h2>
                         <p className="text-sm text-gray-300 leading-relaxed">月寒製作所は貴社のリサイクルパートナーです。<br/>現在の保有ポイント: <span className="font-bold text-xl text-white ml-1">{(user as any)?.points || 0}</span> pt</p>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {memberTab === 'RESERVATION' && (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-2xl font-serif font-bold mb-8 text-[#111] flex items-center gap-3">
                   <span className="w-2 h-8 bg-[#D32F2F] rounded-full"></span> 買取予約・見積作成
               </h2>
               
               <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">訪問予定日時</label>
                     <input type="datetime-local" className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-[#D32F2F] outline-none transition" onChange={(e)=>setReserveDate(e.target.value)} />
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">現場名メモ (任意)</label>
                     <input type="text" className="w-full bg-white border border-gray-200 p-3 rounded-lg focus:border-[#D32F2F] outline-none transition" placeholder="例: ○○ビル解体分" onChange={(e)=>setReserveMemo(e.target.value)} />
                  </div>
               </div>

               <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">持込予定の品目</label>
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                     <select className="flex-1 bg-white border border-gray-200 p-4 rounded-lg font-bold focus:border-[#D32F2F] outline-none transition cursor-pointer" value={reserveProduct} onChange={(e)=>setReserveProduct(e.target.value)}>
                        <option value="">品目を選択してください</option>
                        <optgroup label="電線">
                            {data?.wires.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                        </optgroup>
                        <optgroup label="非鉄金属">
                            {data?.castings.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                        </optgroup>
                     </select>
                     <div className="relative">
                         <input type="number" placeholder="0.0" className="w-full md:w-32 bg-white border border-gray-200 p-4 rounded-lg font-mono text-lg focus:border-[#D32F2F] outline-none transition" value={reserveWeight} onChange={(e)=>setReserveWeight(e.target.value)} />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kg</span>
                     </div>
                  </div>
                  <div className="text-right border-t border-dashed border-gray-200 pt-4">
                      <span className="text-gray-400 text-sm font-bold mr-4">概算見積金額</span>
                      <span className="font-black text-3xl text-[#D32F2F] tracking-tighter">¥{(getUnitPrice() * (parseFloat(reserveWeight)||0)).toLocaleString()}</span>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={handleReserveSubmit} disabled={isSubmitting} className="flex-1 bg-[#111] text-white py-5 rounded-xl font-bold tracking-widest hover:bg-[#D32F2F] transition-all shadow-lg active:scale-95 disabled:bg-gray-400">
                      {isSubmitting ? '送信中...' : '予約を確定する'}
                  </button>
                  <button onClick={generateEstimatePDF} className="px-8 py-5 border-2 border-gray-200 rounded-xl text-gray-600 font-bold tracking-widest hover:bg-gray-50 transition active:scale-95">
                      PDF見積書
                  </button>
               </div>
            </div>
         )}
         
         {/* ★ 取引履歴（HISTORY）の実装 */}
         {memberTab === 'HISTORY' && (
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
               <div className="p-8 border-b border-gray-100 bg-gray-50">
                   <h3 className="font-serif font-bold text-2xl text-[#111]">取引履歴</h3>
                   <p className="text-sm text-gray-500 mt-2">過去のお持ち込み・計量実績をご確認いただけます。</p>
               </div>
               
               {myHistory.length === 0 ? (
                   <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                       <Icons.History />
                       <p className="mt-4 font-bold text-lg">まだ取引データがありません</p>
                       <p className="text-sm mt-2">お持ち込みの予約や、計量が完了するとここに表示されます。</p>
                   </div>
               ) : (
                   <div className="overflow-x-auto">
                       <table className="w-full text-left">
                           <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200">
                               <tr>
                                   <th className="p-6">日付 / 受付ID</th>
                                   <th className="p-6">品目・重量</th>
                                   <th className="p-6 text-right">買掛金額</th>
                                   <th className="p-6 text-center">ステータス</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                               {myHistory.map((record: any) => {
                                   let parsedItems: any[] = [];
                                   try {
                                       let raw = record.items;
                                       if (typeof raw === 'string') raw = JSON.parse(raw);
                                       if (typeof raw === 'string') raw = JSON.parse(raw); // 念のため2回
                                       if (Array.isArray(raw)) parsedItems = raw;
                                   } catch(e) {}

                                   const isCompleted = record.status === 'COMPLETED';

                                   return (
                                       <tr key={record.id} className="hover:bg-gray-50 transition">
                                           <td className="p-6">
                                               <div className="font-bold text-gray-900">{new Date(record.createdAt).toLocaleDateString()}</div>
                                               <div className="text-xs text-gray-400 mt-1 font-mono">{record.id}</div>
                                           </td>
                                           <td className="p-6">
                                               {parsedItems.length > 0 ? (
                                                   <div className="space-y-1">
                                                       {parsedItems.map((item, i) => (
                                                           <div key={i} className="text-sm font-bold text-gray-700">
                                                               {item.product || item.productName} <span className="text-gray-400 mx-2">/</span> {item.weight} kg
                                                           </div>
                                                       ))}
                                                   </div>
                                               ) : (
                                                   <span className="text-gray-400 text-sm">詳細なし</span>
                                               )}
                                           </td>
                                           <td className="p-6 text-right">
                                               <div className="text-lg font-black text-gray-900">
                                                   ¥{(Number(record.totalEstimate) || 0).toLocaleString()}
                                               </div>
                                           </td>
                                           <td className="p-6 text-center">
                                               <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isCompleted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                                   {isCompleted ? '計量完了 (支払済)' : '受付済・検収待ち'}
                                               </span>
                                           </td>
                                       </tr>
                                   );
                               })}
                           </tbody>
                       </table>
                   </div>
               )}
            </div>
         )}
      </main>
    </div>
  );
};
