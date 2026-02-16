"use client";
import React, { useState, useEffect } from 'react';
import { MarketData } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// アイコン定義 (Admin専用)
const Icons = {
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Check: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
};

interface AdminProps {
  data: MarketData | null;
  setView: (view: any) => void;
}

export const AdminDashboard = ({ data, setView }: AdminProps) => {
  const [adminTab, setAdminTab] = useState<'POS' | 'STOCK' | 'MEMBERS'>('POS');
  const [posUser, setPosUser] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completeTxId, setCompleteTxId] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastTxData, setLastTxData] = useState<any>(null);
  
  // ★修正ポイント: Hydration Error対策 (サーバーとクライアントの日付不一致を防ぐ)
  const [dateStr, setDateStr] = useState<string>('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString());
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // POS計算ロジック
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) { alert("商品と重量を入力してください"); return; }
    const product = data?.wires.find(p => p.id === posProduct) || data?.castings.find(p => p.id === posProduct); // Both Wire and Casting
    if (!product) return;
    
    const weight = parseFloat(posWeight);
    const rankBonus = posRank === 'A' ? 1.02 : posRank === 'C' ? 0.95 : 1.0;
    const marketFactor = 0.90; 
    const processingCost = 15;

    // Castingの場合は price_offset を使う、Wireの場合は ratio 計算
    let rawPrice = 0;
    if ('price_offset' in product) {
        // Casting Logic: (LME * Ratio) - Offset
        rawPrice = (marketPrice * (product.ratio / 100)) - (product.price_offset || 0);
    } else {
        // Wire Logic
        rawPrice = (marketPrice * (product.ratio / 100) * marketFactor) - processingCost;
    }

    const adjustedPrice = rawPrice * rankBonus;
    const finalUnitPrice = Math.max(0, Math.floor(adjustedPrice));
    
    setPosResult(Math.floor(finalUnitPrice * weight));
    setCompleteTxId(null);
  };

  // 取引登録 & 明細発行
  const handlePosSubmitWithInvoice = async () => {
    if (isSubmitting || !posResult) return;
    setIsSubmitting(true);
    const product = data?.wires.find(p => p.id === posProduct) || data?.castings.find(p => p.id === posProduct);
    
    const payload = {
      action: 'REGISTER_TRANSACTION',
      memberId: posUser || 'GUEST',
      productId: posProduct,
      productName: product ? product.name : 'Unknown',
      weight: parseFloat(posWeight),
      rank: posRank,
      price: posResult
    };

    try {
      const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') {
        setLastTxData({
           id: result.data.transactionId,
           member: posUser || 'Guest',
           product: product?.name || 'Unknown',
           weight: posWeight,
           rank: posRank,
           price: posResult
        });
        setShowInvoiceModal(true);
        setPosProduct(''); setPosWeight(''); setPosResult(null);
      } else { alert('登録エラー: ' + result.message); }
    } catch (e) { alert('通信エラー'); } finally { setIsSubmitting(false); }
  };

  // PDF発行ロジック (簡易版)
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
      alert("日本語フォントの読み込みに失敗しました。");
      return false;
    }
  };

  const generateInvoicePDF = async () => {
    if(!lastTxData) return;
    const doc = new jsPDF();
    const fontLoaded = await loadFont(doc);
    if (!fontLoaded) return;

    doc.setFontSize(20); doc.text("買取明細書 兼 仕切書", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`取引ID: ${lastTxData.id}`, 15, 30);
    doc.text(`日付: ${new Date().toLocaleDateString()}`, 15, 35);
    
    const taxRate = 0.10;
    const price = lastTxData.price || 0;
    const tax = Math.floor(price * taxRate);
    const total = price + tax;

    autoTable(doc, {
      head: [['品目', '重量', 'ランク', '金額']],
      body: [[lastTxData.product, `${lastTxData.weight} kg`, lastTxData.rank, `¥${price.toLocaleString()}`], ['', '', '消費税 (10%)', `¥${tax.toLocaleString()}`], ['', '', '合計金額', `¥${total.toLocaleString()}`]],
      startY: 50, theme: 'grid', styles: { font: 'NotoSansJP', fontStyle: 'normal' }, headStyles: { fillColor: [20, 20, 20] }
    });
    doc.save(`Invoice_${lastTxData.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-black p-8 border-r border-white/10">
        <div className="mb-12 cursor-pointer" onClick={()=>setView('LP')}><h1 className="text-2xl font-serif font-bold text-white">FACTORY<span className="text-[#D32F2F]">OS</span></h1><p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Control</p></div>
        <nav className="space-y-4">
            <button onClick={()=>setAdminTab('POS')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Calc /> 買取POSレジ</button>
            <button onClick={()=>setAdminTab('STOCK')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='STOCK' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Box /> 在庫管理</button>
            <button onClick={()=>setAdminTab('MEMBERS')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='MEMBERS' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Users /> 会員管理</button>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
          {adminTab === 'POS' && (
            <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-300">
              <header className="flex justify-between items-end mb-12">
                <h2 className="text-4xl font-serif font-bold">Purchase Station</h2>
                <div className="flex gap-4"><span className="text-xs bg-green-500/20 text-green-500 px-3 py-1 rounded-full border border-green-500/30">SYSTEM ONLINE</span></div>
              </header>

              <div className="grid grid-cols-12 gap-8">
                 <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10">
                       <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 1. Customer</h3>
                       <div className="flex gap-4">
                          <input className="flex-1 bg-black border border-white/20 p-4 rounded text-white font-mono focus:border-[#D32F2F] outline-none" placeholder="会員ID / 電話番号" value={posUser} onChange={(e)=>setPosUser(e.target.value)} />
                          <button className="bg-white/10 border border-white/20 px-6 rounded hover:bg-white/20"><Icons.Search /></button>
                       </div>
                    </div>

                    <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10">
                       <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 2. Product</h3>
                       <select className="w-full bg-black border border-white/20 p-4 rounded text-white font-bold mb-4 focus:border-[#D32F2F] outline-none cursor-pointer" value={posProduct} onChange={(e)=>setPosProduct(e.target.value)}>
                          <option value="">商品を選択</option>
                          <optgroup label="電線 (Wire)">
                            {data?.wires?.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.sq}sq)</option>))}
                          </optgroup>
                          <optgroup label="鋳造・合金 (Casting)">
                            {data?.castings?.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                          </optgroup>
                       </select>
                       <div className="flex gap-4">
                          <div className="flex-1">
                             <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Weight (kg)</label>
                             <input type="number" className="w-full bg-black border border-white/20 p-4 rounded text-white font-mono text-xl focus:border-[#D32F2F] outline-none" placeholder="0.0" value={posWeight} onChange={(e)=>setPosWeight(e.target.value)} />
                          </div>
                          <div className="w-1/3">
                             <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Rank</label>
                             <select className="w-full bg-black border border-white/20 p-4 rounded text-white font-bold focus:border-[#D32F2F] outline-none" value={posRank} onChange={(e:any)=>setPosRank(e.target.value)}>
                                <option value="A">A (+2%)</option><option value="B">B (Std)</option><option value="C">C (-5%)</option>
                             </select>
                          </div>
                       </div>
                    </div>
                    <button onClick={handlePosCalculate} className="w-full bg-[#1a1a1a] border border-white/20 text-white py-6 rounded-xl font-bold text-lg tracking-widest hover:bg-[#333] transition">CALCULATE</button>
                 </div>

                 <div className="col-span-12 lg:col-span-4">
                    <div className="bg-white text-black p-8 rounded-xl shadow-2xl relative h-full flex flex-col">
                       <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                          <h4 className="font-serif font-bold text-xl mb-1">RECEIPT</h4>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">Tsukisamu Mfg.</p>
                       </div>
                       <div className="flex-1 space-y-4 font-mono text-sm">
                          <div className="flex justify-between"><span className="text-gray-500">MEMBER</span><span>{posUser || 'Guest'}</span></div>
                          <div className="border-b border-gray-200 my-4"></div>
                          <div className="flex justify-between text-xs text-gray-500"><span>{posProduct || '-'}</span><span>{posWeight || 0}kg / {posRank}</span></div>
                          {/* ★修正ポイント: dateStrを使用 */}
                          <div className="flex justify-between"><span className="text-gray-500">DATE</span><span>{dateStr}</span></div>
                       </div>
                       <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6">
                          <div className="flex justify-between items-end mb-6"><span className="font-bold text-gray-600">TOTAL</span><span className="text-3xl font-black tracking-tighter">¥{posResult ? posResult.toLocaleString() : '0'}</span></div>
                          {posResult !== null && (<button onClick={handlePosSubmitWithInvoice} disabled={isSubmitting} className="w-full bg-[#D32F2F] text-white py-4 rounded font-bold hover:bg-[#B71C1C] transition">{isSubmitting ? 'PROCESSING...' : 'CONFIRM'}</button>)}
                       </div>
                    </div>
                 </div>
              </div>

              {/* 明細発行モーダル */}
              {showInvoiceModal && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-white text-black p-8 rounded-xl max-w-sm w-full text-center">
                       <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4"><Icons.Check /></div>
                       <h3 className="text-2xl font-bold mb-2">取引完了</h3>
                       <p className="text-gray-500 mb-6">データ登録完了。明細を発行しますか？</p>
                       <button onClick={generateInvoicePDF} className="w-full bg-[#111] text-white py-3 rounded font-bold mb-3 hover:bg-[#333]">買取明細書(PDF)を発行</button>
                       <button onClick={()=>setShowInvoiceModal(false)} className="text-sm text-gray-400 hover:text-black">閉じる</button>
                    </div>
                 </div>
              )}
           </div>
         )}
         {adminTab === 'STOCK' && <div className="text-center py-20 text-gray-500">在庫管理機能は準備中です</div>}
      </main>
    </div>
  );
};
