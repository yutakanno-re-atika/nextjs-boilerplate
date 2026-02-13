"use client";

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// 型定義
// ==========================================
interface ProductData {
  id: string; maker: string; name: string; year: string; sq: string; core: string; ratio: number; category: string; source: string;
}

interface Transaction {
  id: string; date: string; type: string; weight: number; price: number; rank: 'A'|'B'|'C'; status: 'COMPLETED'|'PENDING';
}

interface UserData {
  id: string; name: string; rank: 'COPPER'|'SILVER'|'GOLD'; role: 'ADMIN'|'MEMBER'; companyName?: string;
}

interface ReservationData {
  id: string; date: string; memberId: string; memberName: string; items: string; total: number;
}

interface MarketData {
  status: string; 
  config: { market_price: number }; 
  history: { date: string; value: number }[]; 
  products: ProductData[]; 
  stats: { monthlyTotal: number };
  reservations?: ReservationData[];
}

interface ReservationItem {
  product: string; weight: number; unitPrice: number;
}

// ==========================================
// 画像パス定義
// ==========================================
const IMAGES = {
  hero: "/images/factory_floor.png", 
  pika: "/images/pika_wire.png", 
  cv: "/images/cv_cable.png", 
  iv: "/images/iv_cable.png", 
  vvf: "/images/vvf_cable.png", 
  mixed: "/images/mixed_wire.png", 
  cabtire: "/images/cabtire_cable.png", 
  weight: "/images/weighing_station.jpg", 
  nugget: "/images/copper_nugget.png", 
  factory: "/images/factory_floor.png"
};

// ==========================================
// アイコン類
// ==========================================
const Icons = {
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  ArrowUp: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
  ChevronDown: ({className}:{className?:string}) => <svg className={className} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>,
  Crown: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Star: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>,
  Refresh: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  Check: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
};

// ==========================================
// RealChart
// ==========================================
const RealChart = ({ data, currentPrice }: {data: any[], currentPrice: number}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  if (!data || !Array.isArray(data) || data.length < 2) return <div className="h-40 flex items-center justify-center text-xs tracking-widest text-white/50">LOADING...</div>;

  const maxVal = Math.max(...data.map((d: any) => d.value || 0), currentPrice);
  const minVal = Math.min(...data.map((d: any) => d.value || 0), currentPrice);
  const range = maxVal - minVal || 100;
  const yMax = maxVal + range * 0.2;
  const yMin = minVal - range * 0.2;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  
  const points = data.map((d: any, i: number) => {
    const val = d.value || 0;
    return `${getX(i)},${100 - ((val - yMin) / (yMax - yMin)) * 100}`;
  }).join(' ');

  const displayDate = activePoint ? activePoint.date : 'NOW';
  const displayValue = activePoint ? activePoint.value : currentPrice;

  return (
    <div className="w-full" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-6 border-b border-white/30 pb-4">
        <div>
          <p className="text-[10px] font-medium text-white/70 tracking-[0.2em] mb-1">MARKET PRICE / {displayDate}</p>
          <p className="text-5xl font-serif text-white tracking-tight drop-shadow-md">
            <span className="text-2xl mr-1">¥</span>{Number(displayValue).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
           <div className="text-white text-[10px] font-bold flex items-center justify-end gap-2 uppercase tracking-widest"><Icons.ArrowUp /> Live</div>
           <p className="text-[10px] text-white/70 mt-1 font-serif">LME Copper</p>
        </div>
      </div>
      <div className="h-40 w-full relative overflow-visible">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d={`M ${points}`} fill="none" stroke="#FFFFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          {data.map((d: any, i: number) => ( <rect key={i} x={getX(i)-1} y="0" width="2" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} /> ))}
        </svg>
      </div>
    </div>
  );
};

// ==========================================
// メインコンポーネント
// ==========================================
export default function WireMasterCloud() {
  const [view, setView] = useState<'LP' | 'LOGIN' | 'ADMIN' | 'MEMBER'>('LP');
  const [adminTab, setAdminTab] = useState<'POS' | 'STOCK' | 'MEMBERS'>('POS');
  const [memberTab, setMemberTab] = useState<'DASHBOARD' | 'HISTORY' | 'RESERVATION' | 'SETTINGS'>('DASHBOARD');

  const [data, setData] = useState<MarketData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('pika');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // シミュレーター
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  // POS (Admin)
  const [posUser, setPosUser] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 予約・明細関連
  const [adminReservations, setAdminReservations] = useState<any[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastTxData, setLastTxData] = useState<any>(null);
  
  // 会員予約フォーム
  const [reserveItems, setReserveItems] = useState<ReservationItem[]>([{product: '', weight: 0, unitPrice: 0}]);
  const [reserveDate, setReserveDate] = useState('');
  const [reserveMemo, setReserveMemo] = useState('');

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;500;700;900&family=Oswald:wght@300;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    fetch('/api/gas').then(res => res.json()).then(d => { 
        if(d.status === 'success') {
            setData(d);
            // 管理者の場合、予約リストをセット
            if(d.reservations) setAdminReservations(d.reservations);
        }
    });
  }, [user]); 

  const marketPrice = data?.config?.market_price || 0;

  // ログイン (DB認証対応)
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/gas', { 
        method: 'POST', 
        body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value }) 
    });
    const result = await res.json();
    if (result.status === 'success') {
      setUser(result.user);
      setView(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
    } else { alert(result.message); }
  };

  const calculateSim = () => {
    if (!simType || !simWeight) return;
    const w = parseFloat(simWeight);
    const ratios: any = { 'pika': 0.98, 'high': 0.82, 'medium': 0.65, 'low': 0.45, 'mixed': 0.40 };
    const estimatedUnit = Math.floor(marketPrice * ratios[simType]); 
    const total = Math.floor(estimatedUnit * w);
    const labels: any = { 'pika': '特1号銅線', 'high': '高銅率線', 'medium': '中銅率線', 'low': '低銅率線', 'mixed': '雑線' };
    setSimResult({ label: labels[simType], weight: w, unit: estimatedUnit, total: total });
  };

  // POS計算
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) { alert("商品と重量を入力してください"); return; }
    const currentMarketPrice = marketPrice > 0 ? marketPrice : 1450; 
    const product = data?.products.find(p => p.id === posProduct);
    if (!product) return;
    
    const weight = parseFloat(posWeight);
    const rankBonus = posRank === 'A' ? 1.02 : posRank === 'C' ? 0.95 : 1.0;
    const marketFactor = 0.90; 
    const processingCost = 15;

    const rawPrice = currentMarketPrice * (product.ratio / 100);
    const adjustedPrice = (rawPrice * rankBonus * marketFactor) - processingCost;
    const finalUnitPrice = Math.max(0, Math.floor(adjustedPrice));
    
    setPosResult(Math.floor(finalUnitPrice * weight));
  };

  // POS確定 & 明細モーダル表示
  const handlePosSubmitWithInvoice = async () => {
    if (isSubmitting || !posResult) return;
    setIsSubmitting(true);
    const product = data?.products.find(p => p.id === posProduct);
    const payload = {
      action: 'REGISTER_TRANSACTION',
      memberId: posUser || 'GUEST',
      productId: posProduct,
      productName: product ? `${product.maker} ${product.name} ${product.sq}sq` : 'Unknown',
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

  // 会員予約処理
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
     try {
         const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
         const d = await res.json();
         if(d.status === 'success') alert('予約が完了しました。工場でお待ちしております。');
     } catch(e) { alert('予約エラー'); }
  };

  // PDF発行: 見積書 (Member)
  const generateEstimatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("ESTIMATE / QUOTATION", 105, 20, { align: "center" });
    doc.setFontSize(12); doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 30);
    doc.text(`Client: ${user?.name || 'Guest'}`, 15, 38);
    doc.setFontSize(10); doc.text("Tsukisamu Manufacturing Co., Ltd.", 195, 30, { align: "right" });
    
    const tableBody = reserveItems.map(item => [item.product||'Item', `${item.weight} kg`, `Yen ${item.unitPrice.toLocaleString()}`, `Yen ${(item.weight * item.unitPrice).toLocaleString()}`]);
    const total = reserveItems.reduce((sum, item) => sum + (item.weight * item.unitPrice), 0);
    tableBody.push(['TOTAL', '', '', `Yen ${total.toLocaleString()}`]);

    autoTable(doc, { head: [['Item', 'Weight', 'Unit Price', 'Total']], body: tableBody, startY: 50 });
    doc.save(`Estimate_${new Date().getTime()}.pdf`);
  };

  // PDF発行: 買取明細書 (Admin)
  const generateInvoicePDF = () => {
    if(!lastTxData) return;
    const doc = new jsPDF();
    doc.setFontSize(20); doc.text("PURCHASE STATEMENT", 105, 20, { align: "center" });
    doc.setFontSize(10); doc.text(`Tx ID: ${lastTxData.id}`, 15, 30);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 35);
    doc.text(`Member: ${lastTxData.member}`, 15, 40);
    doc.text("BUYER: Tsukisamu Manufacturing Co., Ltd.", 195, 30, { align: "right" });
    doc.text("Reg No: T1234567890123", 195, 35, { align: "right" });

    const taxRate = 0.10;
    const price = lastTxData.price || 0;
    const tax = Math.floor(price * taxRate);
    const total = price + tax;

    autoTable(doc, {
      head: [['Description', 'Weight', 'Rank', 'Amount']],
      body: [
        [lastTxData.product, `${lastTxData.weight} kg`, lastTxData.rank, `Yen ${price.toLocaleString()}`],
        ['', '', 'Tax (10%)', `Yen ${tax.toLocaleString()}`],
        ['', '', 'TOTAL', `Yen ${total.toLocaleString()}`]
      ],
      startY: 50,
      theme: 'grid'
    });
    doc.save(`Invoice_${lastTxData.id}.pdf`);
  };

  const FAQ_ITEMS = [
    { q: "インボイス制度への対応について", a: "適格請求書発行事業者として登録済みです。法人のお客様も安心してご利用いただけます。" },
    { q: "被覆付き電線の買取について", a: "独自のナゲットプラントを保有しており、被覆のまま高価買取が可能です。剥離作業は不要です。" },
    { q: "お支払いサイトについて", a: "検収完了後、即時現金払いとなります。法人様の掛け売り（請求書払い）もご相談ください。" },
    { q: "出張買取のエリアについて", a: "基本的に北海道全域に対応しております。数量によって条件が異なりますので、まずはお気軽にお問い合わせください。" }
  ];

// ----------------------------------------------------------------
  // 1. PUBLIC LANDING PAGE (完全復旧版)
  // ----------------------------------------------------------------
  if (view === 'LP' || view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans selection:bg-[#D32F2F] selection:text-white">
        <header className="fixed top-0 w-full z-50 transition-all duration-500 bg-gradient-to-b from-black/20 to-transparent">
          <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-start">
            <div className="cursor-pointer text-white" onClick={()=>setView('LP')}>
              <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 mb-1">Tsukisamu Mfg.</h1>
              <p className="text-xl font-serif font-bold tracking-widest leading-none">月寒製作所</p>
            </div>
            <button onClick={() => setView('LOGIN')} className="bg-white/10 backdrop-blur border border-white/30 text-white text-[10px] px-6 py-2 rounded-full hover:bg-white hover:text-[#D32F2F] transition-all duration-300 uppercase tracking-widest font-bold">Login</button>
          </div>
        </header>

        {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[100] bg-[#D32F2F]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm p-12 shadow-2xl relative">
              <button onClick={() => setView('LP')} className="absolute top-6 right-6 text-gray-400 hover:text-black transition">✕</button>
              <h2 className="text-xl font-serif text-[#D32F2F] mb-8 tracking-widest text-center font-bold">関係者ログイン</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input name="loginId" className="w-full bg-gray-50 border-b-2 border-gray-200 py-3 px-4 text-black outline-none focus:border-[#D32F2F] transition-colors font-mono text-sm" placeholder="ID" required />
                <input name="password" type="password" className="w-full bg-gray-50 border-b-2 border-gray-200 py-3 px-4 text-black outline-none focus:border-[#D32F2F] transition-colors font-mono text-sm" placeholder="PASSWORD" required />
                <button className="w-full bg-[#111] text-white py-4 text-xs font-bold tracking-widest hover:bg-[#D32F2F] transition-colors duration-300 shadow-lg">ENTER SYSTEM</button>
              </form>
            </div>
          </div>
        )}
        
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[800px] flex items-center bg-[#D32F2F] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src={IMAGES.hero} className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale" alt="Factory" />
             <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#E53935] opacity-90"></div>
          </div>
          <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6 relative">
                <div className="inline-block bg-white text-[#D32F2F] px-4 py-1 text-xs font-bold tracking-widest mb-4">SINCE 1961</div>
                <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight tracking-tight drop-shadow-sm"><span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">資源を、</span><span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">あるべき<span className="border-b-4 border-white/80 pb-2">価値</span>へ。</span></h1>
              </div>
              <p className="text-white/90 text-sm md:text-base leading-loose max-w-lg font-medium tracking-wide animate-in fade-in duration-1000 delay-500 border-l-2 border-white/30 pl-6">月寒製作所は「目利き」と「技術」で、日本のリサイクルインフラを支え続けます。独自のナゲットプラントによる中間コストの排除。それが、高価買取の根拠です。</p>
              <div className="pt-8 flex gap-6 animate-in fade-in duration-1000 delay-700"><a href="#simulator" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#111] hover:text-white transition-all shadow-xl">査定シミュレーション</a></div>
            </div>
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <RealChart data={data?.history || []} currentPrice={marketPrice} />
                <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center"><div><p className="text-[9px] text-white/70 uppercase tracking-widest mb-1">Factory Status</p><p className="text-xs font-medium tracking-wider flex items-center gap-2 text-white"><span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></span> Accepting</p></div><div className="text-right"><p className="text-xs font-serif italic text-white/80">Tomakomai, Hokkaido</p></div></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* SIMULATOR */}
        <section id="simulator" className="py-32 px-6 bg-white relative">
          <div className="max-w-[900px] mx-auto relative z-10">
             <div className="text-center mb-12"><span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Estimation</span><h2 className="text-4xl font-serif font-medium">買取シミュレーション</h2></div>
             <div className="bg-[#F5F5F7] p-8 md:p-16 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                   <div className="flex-1 w-full space-y-8">
                      <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wire Type</label><select className="w-full bg-white border border-gray-200 py-3 px-4 font-serif focus:border-[#D32F2F] focus:outline-none transition-colors cursor-pointer" value={simType} onChange={(e)=>setSimType(e.target.value)}><option value="">線種を選択</option><option value="pika">特1号銅線 (ピカ線)</option><option value="high">高銅率線 (80%~)</option><option value="medium">中銅率線 (60%~)</option><option value="low">低銅率線 (40%~)</option><option value="mixed">雑線・ミックス</option></select></div>
                      <div><label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Weight (kg)</label><input type="number" className="w-full bg-white border border-gray-200 py-3 px-4 font-mono focus:border-[#D32F2F] focus:outline-none transition-colors" placeholder="0" value={simWeight} onChange={(e)=>setSimWeight(e.target.value)} /></div>
                      <button onClick={calculateSim} className="w-full bg-[#D32F2F] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#B71C1C] transition-colors duration-300 shadow-lg">計算する</button>
                   </div>
                   <div className="w-full md:w-80 bg-white p-8 border border-gray-200 text-center shadow-lg relative overflow-hidden group"><div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-[#D32F2F] transition-colors"></div>{simResult ? (<div className="animate-in fade-in slide-in-from-bottom-2 duration-500"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{simResult.label} / {simResult.weight}kg</p><p className="text-5xl font-serif text-[#111] mb-2 tracking-tighter">¥{simResult.total.toLocaleString()}</p><p className="text-[10px] text-gray-400">参考単価: ¥{simResult.unit.toLocaleString()}/kg</p></div>) : (<div className="py-8 text-gray-400 text-sm font-serif">条件を入力して<br/>査定額を確認してください</div>)}</div>
                </div>
                <div className="mt-8 text-center"><div className="inline-flex items-center gap-2 text-xs font-mono text-gray-500"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Current Market Price: ¥{Number(marketPrice).toLocaleString()} / kg</div></div>
             </div>
          </div>
        </section>

        {/* PRICE / WIRE TYPES (復旧) */}
        <section id="price" className="py-32 px-6 bg-white">
          <div className="max-w-[1200px] mx-auto">
             <div className="mb-20 flex items-end justify-between border-b border-gray-200 pb-6"><h2 className="text-3xl font-serif">取扱品目</h2><div className="flex gap-4">{['pika', 'cv', 'iv', 'mixed'].map(t => (<button key={t} onClick={()=>setActiveTab(t)} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors ${activeTab===t ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:text-black'}`}>{t}</button>))}</div></div>
             <div className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in duration-500" key={activeTab}>
               <div className="h-[400px] bg-gray-100 overflow-hidden relative group"><img src={IMAGES[activeTab as keyof typeof IMAGES]} alt={activeTab} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 border-[12px] border-white pointer-events-none"></div></div>
               <div className="space-y-8"><h3 className="text-3xl font-serif font-medium">{activeTab === 'pika' && '特1号銅線 (ピカ線)'}{activeTab === 'cv' && 'CV・CVTケーブル'}{activeTab === 'iv' && 'IV線'}{activeTab === 'mixed' && '雑線・ミックス'}</h3><p className="text-sm text-gray-600 leading-loose">{activeTab === 'pika' && '被覆を完全に除去した、直径1.3mm以上の純銅線。酸化やメッキがなく、光沢がある状態のものが最高値での買取対象となります。'}{activeTab === 'cv' && '工場やビルの電力供給用として使用される架橋ポリエチレン絶縁ビニルシースケーブル。銅率が高く、太いものが多いため高価買取が可能です。'}{activeTab === 'iv' && '屋内配線用として最も一般的に使用されるビニル絶縁電線。単線・撚り線問わず買取可能です。'}{activeTab === 'mixed' && '様々な種類の電線が混ざった状態や、家電コード、通信線などもまとめて引き受けます。選別不要でお持ち込みいただけます。'}</p><div className="inline-block border-l-2 border-red-600 pl-6 py-2"><span className="text-xs text-gray-400 block mb-1 tracking-widest uppercase">Target Price</span><span className="text-xl font-serif font-bold">{activeTab === 'pika' ? '最高値基準' : activeTab === 'mixed' ? '銅率により変動' : '高価買取対象'}</span></div></div>
             </div>
          </div>
        </section>

        {/* FAQ SECTION (復旧) */}
        <section id="faq" className="py-32 px-6 bg-[#F9F9F9] border-t border-gray-200">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-16"><span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Q & A</span><h2 className="text-3xl font-serif">よくある質問</h2></div>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                  <div role="button" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full flex justify-between items-center p-6 md:p-8 text-left group cursor-pointer">
                    <div className="flex items-start gap-6"><span className="text-[#D32F2F] font-serif font-bold text-lg leading-none mt-1">Q.</span><span className="font-serif font-medium text-[#111] group-hover:text-[#D32F2F] transition-colors">{item.q}</span></div>
                    <Icons.ChevronDown className={`text-gray-300 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                  </div>
                  {activeFaq === idx && (<div className="px-8 pb-8 pl-20 animate-in slide-in-from-top-1 fade-in duration-200"><p className="text-sm text-gray-500 leading-loose border-l-2 border-gray-100 pl-4">{item.a}</p></div>)}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ACCESS / FOOTER (復旧) */}
        <section id="access" className="border-t border-gray-200">
           <div className="grid md:grid-cols-2">
              <div className="bg-[#1a1a1a] text-white p-16 md:p-24 flex flex-col justify-center"><h2 className="text-2xl font-serif mb-12 flex items-center gap-4"><span className="w-8 h-[1px] bg-[#D32F2F]"></span> 会社概要</h2><div className="space-y-8 text-sm font-light tracking-wide text-gray-400"><div className="flex gap-8 border-b border-white/10 pb-4"><span className="w-24 shrink-0 font-bold text-white">社名</span><span>株式会社月寒製作所 苫小牧工場</span></div><div className="flex gap-8 border-b border-white/10 pb-4"><span className="w-24 shrink-0 font-bold text-white">所在地</span><span>〒053-0001 北海道苫小牧市一本松町9-6</span></div><div className="flex gap-8 border-b border-white/10 pb-4"><span className="w-24 shrink-0 font-bold text-white">許可証</span><span>北海道知事許可（般-18）石第00857号<br/>産廃処分業許可 第00120077601号</span></div><div className="pt-8"><p className="text-3xl font-serif text-white mb-2">0144-55-5544</p><p className="text-xs tracking-widest">平日 8:00 - 17:00 / 定休日: 土日祝</p></div></div></div>
              <div className="h-[400px] md:h-auto bg-gray-300 relative group grayscale hover:grayscale-0 transition duration-700"><iframe src="https://maps.google.com/maps?q=42.639373,141.747970&z=15&output=embed" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe></div>
           </div>
        </section>

        <footer className="bg-white py-12 px-6 border-t border-gray-200"><div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6"><div><p className="text-xs font-bold tracking-widest uppercase mb-1">Tsukisamu Manufacturing Co., Ltd.</p><p className="text-[10px] text-gray-400">Tomakomai Factory</p></div><p className="text-[10px] text-gray-300 tracking-widest">© 2026 TSUKISAMU. ALL RIGHTS RESERVED.</p></div></footer>
      </div>
    );
  }

  // =================================================================
  // 2. ADMIN DASHBOARD
  // =================================================================
  if (view === 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col md:flex-row">
        <aside className="w-full md:w-80 bg-black p-8 border-r border-white/10">
          <div className="mb-12"><h1 className="text-2xl font-serif font-bold text-white">FACTORY<span className="text-[#D32F2F]">OS</span></h1><p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Control</p></div>
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

                {/* 予約リスト */}
                <div className="mb-8 p-6 bg-[#1a1a1a] rounded-xl border border-white/10 overflow-x-auto">
                   <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-4">本日の入荷予約</h3>
                   <div className="flex gap-4">
                      {adminReservations.map((res, i) => (
                         <div key={i} onClick={()=>{
                            setPosUser(res.memberId);
                            try {
                               const items = JSON.parse(res.items);
                               if(items.length>0) setPosWeight(items[0].weight.toString());
                               alert('予約内容をコピーしました');
                            } catch(e){}
                         }} className="min-w-[200px] bg-black p-4 rounded border border-white/20 hover:border-[#D32F2F] cursor-pointer transition">
                            <p className="font-bold text-[#D32F2F]">{res.date}</p>
                            <p className="text-sm">{res.memberName}</p>
                            <p className="text-xs text-gray-500 mt-2">想定: ¥{Number(res.total).toLocaleString()}</p>
                         </div>
                      ))}
                      {adminReservations.length === 0 && <p className="text-sm text-gray-500">予約はありません</p>}
                   </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                   <div className="col-span-12 lg:col-span-8 space-y-8">
                      <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10">
                         <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 1. Customer</h3>
                         <div className="flex gap-4">
                            <input className="flex-1 bg-black border border-white/20 p-4 rounded text-white font-mono focus:border-[#D32F2F] outline-none" placeholder="会員ID" value={posUser} onChange={(e)=>setPosUser(e.target.value)} />
                            <button className="bg-white/10 border border-white/20 px-6 rounded hover:bg-white/20"><Icons.Search /></button>
                         </div>
                      </div>

                      <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10">
                         <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 2. Product</h3>
                         <select className="w-full bg-black border border-white/20 p-4 rounded text-white font-bold mb-4 focus:border-[#D32F2F] outline-none" value={posProduct} onChange={(e)=>setPosProduct(e.target.value)}>
                            <option value="">線種を選択</option>
                            {data?.products?.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
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
                         <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4">✓</div>
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
  }

  // =================================================================
  // 3. MEMBER DASHBOARD
  // =================================================================
  if (view === 'MEMBER') {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#111] font-sans flex flex-col md:flex-row">
        <aside className="w-full md:w-80 bg-white p-8 border-r border-gray-200">
          <div className="mb-12"><h1 className="text-2xl font-serif font-bold text-[#111]">MY <span className="text-[#D32F2F]">PAGE</span></h1></div>
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
                          const p = data?.products.find(x=>x.id===e.target.value);
                          const newItems = [...reserveItems];
                          newItems[0].product = p?.name || '';
                          newItems[0].unitPrice = Math.floor(marketPrice * (p?.ratio||0)/100 * 0.9);
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
  }

  return null;
}
