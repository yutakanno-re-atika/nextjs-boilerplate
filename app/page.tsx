"use client";

import React, { useState, useEffect } from 'react';
// PDF生成用ライブラリ
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// フォントは標準の日本語フォントが使えないため、実運用ではフォント追加が必要ですが
// 今回は英語またはデフォルトフォントで動作する範囲で記述します。

// ... (既存の型定義) ...

// 予約アイテム用インターフェース
interface ReservationItem {
  product: string;
  weight: number;
  unitPrice: number;
}

// ... (既存の定数・コンポーネント) ...

export default function WireMasterCloud() {
  // ... (既存のState) ...
  
  // 新規追加State
  const [reserveItems, setReserveItems] = useState<ReservationItem[]>([{product: '', weight: 0, unitPrice: 0}]);
  const [reserveDate, setReserveDate] = useState('');
  const [reserveMemo, setReserveMemo] = useState('');
  
  const [adminReservations, setAdminReservations] = useState<any[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastTxData, setLastTxData] = useState<any>(null); // 直近の取引データ(PDF用)

  // ... (useEffectでデータ取得) ...
  // 管理者ログイン時に予約リストも取得するように修正
  useEffect(() => {
     if(user?.role === 'ADMIN') {
        fetch('/api/gas').then(res=>res.json()).then(d => {
           if(d.reservations) setAdminReservations(d.reservations);
        });
     }
  }, [user]);

  // ==========================================
  // PDF発行関数 (クライアントサイド)
  // ==========================================
  
  // 1. 会員用：見積書PDF
  const generateEstimatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("ESTIMATE / QUOTATION", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text(`Client: ${user?.name || 'Guest'}`, 15, 38);
    
    doc.setFontSize(10);
    doc.text("Tsukisamu Manufacturing Co., Ltd.", 195, 30, { align: "right" });
    doc.text("Tomakomai Factory", 195, 35, { align: "right" });
    
    // Table
    const tableBody = reserveItems.map(item => [
       item.product || 'Item',
       `${item.weight} kg`,
       `¥${item.unitPrice.toLocaleString()}`,
       `¥${(item.weight * item.unitPrice).toLocaleString()}`
    ]);
    
    // 合計計算
    const total = reserveItems.reduce((sum, item) => sum + (item.weight * item.unitPrice), 0);
    tableBody.push(['TOTAL', '', '', `¥${total.toLocaleString()}`]);

    autoTable(doc, {
      head: [['Item', 'Weight', 'Unit Price', 'Total']],
      body: tableBody,
      startY: 50,
    });
    
    doc.save(`Estimate_${new Date().getTime()}.pdf`);
  };

  // 2. 管理者用：買取明細書（仕切書）PDF
  const generateInvoicePDF = () => {
    if(!lastTxData) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text("PURCHASE STATEMENT", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text(`Transaction ID: ${lastTxData.id}`, 15, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 35);
    doc.text(`Member: ${lastTxData.member}`, 15, 40);

    doc.text("BUYER: Tsukisamu Manufacturing Co., Ltd.", 195, 30, { align: "right" });
    doc.text("Reg No: T1234567890123", 195, 35, { align: "right" }); // インボイス番号

    // Item Details
    const taxRate = 0.10;
    const price = lastTxData.price || 0;
    const tax = Math.floor(price * taxRate);
    const total = price + tax;

    autoTable(doc, {
      head: [['Description', 'Weight', 'Rank', 'Amount']],
      body: [
        [lastTxData.product, `${lastTxData.weight} kg`, lastTxData.rank, `¥${price.toLocaleString()}`],
        ['', '', 'Tax (10%)', `¥${tax.toLocaleString()}`],
        ['', '', 'TOTAL', `¥${total.toLocaleString()}`]
      ],
      startY: 50,
      theme: 'grid'
    });

    doc.text("Thank you for your business.", 105, doc.lastAutoTable.finalY + 20, {align: "center"});
    doc.save(`Invoice_${lastTxData.id}.pdf`);
  };

  // ... (既存のhandleLoginなどはGASのレスポンスに合わせて修正不要、GAS側が合わせました) ...

  // 予約処理
  const handleReserveSubmit = async () => {
     const total = reserveItems.reduce((sum, i) => sum + (i.weight * i.unitPrice), 0);
     const payload = {
        action: 'REGISTER_RESERVATION',
        visitDate: reserveDate,
        memberId: user?.id,
        memberName: user?.name,
        items: reserveItems,
        totalEstimate: total
     };
     // fetch POST to GAS...
     const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
     const d = await res.json();
     if(d.status === 'success') alert('予約完了しました');
  };

  // POS確定後の処理（モーダル表示）
  const handlePosSubmitWithInvoice = async () => {
     // ... (既存の登録処理) ...
     const payload = { /* ...既存... */ };
     const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
     const result = await res.json();
     
     if(result.status === 'success') {
        // 直近データを保存してモーダル表示
        setLastTxData({
           id: result.data.transactionId,
           member: posUser || 'Guest',
           product: data?.products.find(p=>p.id===posProduct)?.name,
           weight: posWeight,
           rank: posRank,
           price: posResult
        });
        setShowInvoiceModal(true);
        // 入力クリア
        setPosProduct(''); setPosWeight(''); setPosResult(null);
     }
  };


  // =================================================================
  // VIEW: MEMBER (予約タブ追加)
  // =================================================================
  if (view === 'MEMBER') {
    return (
      <div className="flex h-screen bg-[#F5F5F7]">
        {/* Sidebar... */}
        <aside className="w-64 bg-white p-6 border-r">
           {/* ...既存サイドバー... */}
           <button onClick={()=>setMemberTab('RESERVATION')} className="w-full text-left p-3 font-bold hover:bg-gray-100 rounded">予約・見積</button>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
           {memberTab === 'RESERVATION' && (
             <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-serif font-bold mb-6 text-[#D32F2F]">買取予約・見積</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">訪問予定日時</label>
                      <input type="datetime-local" className="w-full border p-3 rounded" onChange={(e)=>setReserveDate(e.target.value)} />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2">現場名メモ</label>
                      <input type="text" className="w-full border p-3 rounded" placeholder="例: ○○ビル解体分" />
                   </div>
                </div>

                {/* 品目リスト追加フォーム（簡易版） */}
                <div className="mb-6 p-4 bg-gray-50 rounded">
                   <div className="flex gap-4 mb-2">
                      <select className="flex-1 p-2 border rounded" onChange={(e)=>{
                         const p = data?.products.find(x=>x.id===e.target.value);
                         const newItems = [...reserveItems];
                         newItems[0].product = p?.name || '';
                         newItems[0].unitPrice = Math.floor(marketPrice * (p?.ratio||0)/100 * 0.9); // 簡易計算
                         setReserveItems(newItems);
                      }}>
                         <option>品目を選択</option>
                         {data?.products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <input type="number" placeholder="kg" className="w-24 p-2 border rounded" onChange={(e)=>{
                         const newItems = [...reserveItems];
                         newItems[0].weight = Number(e.target.value);
                         setReserveItems(newItems);
                      }} />
                   </div>
                   <div className="text-right font-bold text-xl">
                      概算: ¥{(reserveItems[0].weight * reserveItems[0].unitPrice).toLocaleString()}
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={handleReserveSubmit} className="flex-1 bg-black text-white py-4 rounded font-bold hover:bg-[#D32F2F] transition">予約を確定する</button>
                   <button onClick={generateEstimatePDF} className="px-6 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">PDF見積書</button>
                </div>
             </div>
           )}
           {/* ...他のタブ... */}
        </main>
      </div>
    );
  }

  // =================================================================
  // VIEW: ADMIN (予約リスト & 完了モーダル追加)
  // =================================================================
  if (view === 'ADMIN') {
    return (
      <div className="flex h-screen bg-[#111] text-white">
        {/* ...Sidebar... */}
        <main className="flex-1 p-8 overflow-y-auto relative">
           {/* 予約リスト (ダッシュボードの一部として表示) */}
           {adminTab === 'POS' && (
             <div className="mb-8 p-6 bg-[#1a1a1a] rounded-xl border border-white/10">
                <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-4">本日の入荷予約</h3>
                <div className="flex gap-4 overflow-x-auto">
                   {adminReservations.map((res, i) => (
                      <div key={i} onClick={()=>{
                         // 予約クリックでPOSに入力コピー
                         setPosUser(res.memberId); // ID検索
                         // 簡易的に最初のアイテムをセット
                         const items = JSON.parse(res.items);
                         if(items.length > 0) setPosWeight(items[0].weight);
                         alert('予約内容をコピーしました');
                      }} className="min-w-[200px] bg-black p-4 rounded border border-white/20 hover:border-[#D32F2F] cursor-pointer transition">
                         <p className="font-bold text-[#D32F2F]">{res.date}</p>
                         <p className="text-sm">{res.memberName}</p>
                         <p className="text-xs text-gray-500 mt-2">想定: ¥{Number(res.total).toLocaleString()}</p>
                      </div>
                   ))}
                   {adminReservations.length === 0 && <p className="text-sm text-gray-500">予約はありません</p>}
                </div>
             </div>
           )}
           
           {/* ...POS画面 (ボタンを handlePosSubmitWithInvoice に変更) ... */}
           
           {/* 完了モーダル */}
           {showInvoiceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                 <div className="bg-white text-black p-8 rounded-xl max-w-sm w-full text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
                    <h3 className="text-2xl font-bold mb-2">取引完了</h3>
                    <p className="text-gray-500 mb-6">データが登録されました。</p>
                    <button onClick={generateInvoicePDF} className="w-full bg-[#111] text-white py-3 rounded font-bold mb-3 hover:bg-[#333]">
                       買取明細書(PDF)を発行
                    </button>
                    <button onClick={()=>setShowInvoiceModal(false)} className="text-sm text-gray-400 hover:text-black">
                       閉じる
                    </button>
                 </div>
              </div>
           )}
        </main>
      </div>
    );
  }

  return null;
}
