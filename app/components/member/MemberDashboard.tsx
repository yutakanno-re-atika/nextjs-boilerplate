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
  Crown: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
};

interface MemberProps {
  user: UserData | null;
  data: MarketData | null;
  setView: (view: any) => void;
}

export const MemberDashboard = ({ user, data, setView }: MemberProps) => {
  const [memberTab, setMemberTab] = useState<'DASHBOARD' | 'HISTORY' | 'RESERVATION'>('DASHBOARD');
  const [reserveItems, setReserveItems] = useState([{product: '', weight: 0, unitPrice: 0}]);
  const [reserveDate, setReserveDate] = useState('');
  const [reserveMemo, setReserveMemo] = useState('');

  const marketPrice = data?.config?.market_price || 0;

  // 予約ロジック
  const handleReserveSubmit = async () => {
      const total = reserveItems.reduce((sum, i) => sum + (i.weight * i.unitPrice), 0);
      if (total === 0) { alert("金額が0円です。"); return; }
      
      const payload = {
        action: 'REGISTER_RESERVATION',
        visitDate: reserveDate,
        memberId: user?.id,
        memberName: user?.name,
        items: reserveItems,
        totalEstimate: total
      };
      
      try {
          const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
          const d = await res.json();
          if(d.status === 'success') alert('予約が完了しました。工場でお待ちしております。');
      } catch(e) { alert('予約エラー'); }
  };

  // PDF (見積書)
  const loadFont = async (doc: any) => {
    try {
      const res = await fetch('/fonts/NotoSansJP-Regular.ttf');
      if (!res.ok) throw new Error('Font file not found');
      const fontBuffer = await res.arrayBuffer();
      const fontBase64 = Buffer.from(fontBuffer).toString('base64');
      doc.addFileToVFS('NotoSansJP.ttf', fontBase64);
      doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal');
      doc.setFont('NotoSansJP');
      return true;
    } catch (e) {
      console.error("Font loading failed", e);
      alert("フォント読み込みエラー");
      return false;
    }
  };

  const generateEstimatePDF = async () => {
    const doc = new jsPDF();
    const fontLoaded = await loadFont(doc);
    if (!fontLoaded) return;

    doc.setFontSize(18); doc.text("御見積書 / QUOTATION", 105, 20, { align: "center" });
    doc.setFontSize(12); doc.text(`日付: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text(`顧客名: ${user?.companyName || user?.name || 'お客様'}`, 15, 38);
    doc.setFontSize(10); doc.text("株式会社 月寒製作所 苫小牧工場", 195, 30, { align: "right" });
    
    const tableBody = reserveItems.map(item => [
        item.product || '未選択', 
        `${item.weight} kg`, 
        `¥${item.unitPrice.toLocaleString()}`, 
        `¥${(item.weight * item.unitPrice).toLocaleString()}`
    ]);
    const total = reserveItems.reduce((sum, item) => sum + (item.weight * item.unitPrice), 0);
    tableBody.push(['合計 (税込)', '', '', `¥${total.toLocaleString()}`]);

    autoTable(doc, { 
        head: [['品目', '重量', '単価', '金額']], 
        body: tableBody, 
        startY: 50,
        styles: { font: 'NotoSansJP', fontStyle: 'normal' },
        headStyles: { fillColor: [211, 47, 47] }
    });
    doc.save(`Estimate.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111] font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-white p-8 border-r border-gray-200">
        <div className="mb-12 cursor-pointer" onClick={()=>setView('LP')}><h1 className="text-2xl font-serif font-bold text-[#111]">MY <span className="text-[#D32F2F]">PAGE</span></h1></div>
        <div className="text-center mb-8">
           <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">🏗️</div>
           <p className="font-bold text-lg">{user?.name || 'User'}</p>
           <span className={`text-xs px-3 py-1 rounded-full font-bold border ${user?.rank==='GOLD' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>{user?.rank} MEMBER</span>
        </div>
        <nav className="space-y-2">
           <button onClick={()=>setMemberTab('DASHBOARD')} className={`w-full text-left p-4 rounded-lg text-sm font-bold transition flex items-center gap-3 ${memberTab==='DASHBOARD' ? 'bg-[#111] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.Dashboard /> ダッシュボード</button>
           <button onClick={()=>setMemberTab('RESERVATION')} className={`w-full text-left p-4 rounded-lg text-sm font-bold transition flex items-center gap-3 ${memberTab==='RESERVATION' ? 'bg-[#111] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.Calc /> 予約・見積</button>
           <button onClick={()=>setMemberTab('HISTORY')} className={`w-full text-left p-4 rounded-lg text-sm font-bold transition flex items-center gap-3 ${memberTab==='HISTORY' ? 'bg-[#111] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.History /> 取引履歴</button>
        </nav>
        <div className="mt-auto pt-12"><button onClick={() => setView('LP')} className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest">Log out</button></div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
         {memberTab === 'DASHBOARD' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in">
               <div className="bg-[#111] text-white rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                     <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Status</p><h2 className="text-4xl font-serif font-bold mb-6">{user?.rank} RANK</h2><p className="text-sm text-gray-300">月寒製作所とのパートナーシップ状況です。</p></div>
                  </div>
               </div>
            </div>
         )}

         {memberTab === 'RESERVATION' && (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm animate-in fade-in">
               <h2 className="text-2xl font-serif font-bold mb-6 text-[#D32F2F]">買取予約・見積作成</h2>
               <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2">訪問予定日時</label>
                     <input type="datetime-local" className="w-full border p-3 rounded" onChange={(e)=>setReserveDate(e.target.value)} />
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-gray-400 mb-2">現場名メモ</label>
                     <input type="text" className="w-full border p-3 rounded" placeholder="例: ○○ビル解体分" onChange={(e)=>setReserveMemo(e.target.value)} />
                  </div>
               </div>
               <div className="mb-6 p-4 bg-gray-50 rounded">
                  <div className="flex gap-4 mb-2">
                     <select className="flex-1 p-2 border rounded" onChange={(e)=>{
                        const p = data?.wires.find(x=>x.id===e.target.value);
                        const newItems = [...reserveItems];
                        newItems[0].product = p?.name || '';
                        const basePrice = marketPrice > 0 ? marketPrice : 1450;
                        newItems[0].unitPrice = Math.floor(basePrice * (p?.ratio||0)/100 * 0.9);
                        setReserveItems(newItems);
                     }}>
                        <option>品目を選択 (電線)</option>
                        {data?.wires.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                     <input type="number" placeholder="kg" className="w-24 p-2 border rounded" onChange={(e)=>{
                        const newItems = [...reserveItems];
                        newItems[0].weight = Number(e.target.value);
                        setReserveItems(newItems);
                     }} />
                  </div>
                  <div className="text-right font-bold text-xl">概算: ¥{(reserveItems[0].weight * reserveItems[0].unitPrice).toLocaleString()}</div>
               </div>
               <div className="flex gap-4">
                  <button onClick={handleReserveSubmit} className="flex-1 bg-black text-white py-4 rounded font-bold hover:bg-[#D32F2F] transition">予約を確定する</button>
                  <button onClick={generateEstimatePDF} className="px-6 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">PDF見積書</button>
               </div>
            </div>
         )}
         
         {memberTab === 'HISTORY' && (
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100"><h3 className="font-serif font-bold">取引履歴</h3></div>
                <div className="p-8 text-center text-gray-500">履歴データは準備中です</div>
            </div>
         )}
      </main>
    </div>
  );
};
