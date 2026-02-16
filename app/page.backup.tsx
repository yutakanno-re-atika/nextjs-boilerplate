"use client";

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// BACKUP VERSION: 2025-02-15
// DESCRIPTION: UI Complete (G-Nav, Rank System, Fat Footer)
// ==========================================

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
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  History: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
};

// ==========================================
// RealChart
// ==========================================
const RealChart = ({ data, currentPrice }: {data: any[], currentPrice: number}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
   
  if (!data || !Array.isArray(data) || data.length < 2) return <div className="h-40 flex items-center justify-center text-xs tracking-widest text-white/50">LOADING...</div>;

  const effectivePrice = currentPrice > 0 ? currentPrice : (data.length > 0 ? data[data.length-1].value : 0);
  const maxVal = Math.max(...data.map((d: any) => d.value || 0), effectivePrice);
  const minVal = Math.min(...data.map((d: any) => d.value || 0), effectivePrice);
  const range = maxVal - minVal || 100;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => {
    const val = d.value || 0;
    const yMax = maxVal + range * 0.2;
    const yMin = minVal - range * 0.2;
    return `${getX(i)},${100 - ((val - yMin) / (yMax - yMin)) * 100}`;
  }).join(' ');

  const displayDate = activePoint ? activePoint.date : 'NOW';
  const displayValue = activePoint ? activePoint.value : effectivePrice;

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
  const [view, setView] = useState<'LP' | 'LOGIN' | 'ADMIN' | 'MEMBER' | 'FLOW' | 'MEMBERSHIP' | 'COMPANY' | 'CONTACT'>('LP');
  const [adminTab, setAdminTab] = useState<'POS' | 'STOCK' | 'MEMBERS'>('POS');
  const [memberTab, setMemberTab] = useState<'DASHBOARD' | 'HISTORY' | 'RESERVATION' | 'SETTINGS'>('DASHBOARD');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [data, setData] = useState<MarketData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('pika');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
   
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  const [posUser, setPosUser] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
   
  const [adminReservations, setAdminReservations] = useState<any[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastTxData, setLastTxData] = useState<any>(null);
   
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
            if(d.reservations) setAdminReservations(d.reservations);
        }
    });
  }, [user]); 

  const marketPrice = data?.config?.market_price || 0;

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
    const basePrice = marketPrice > 0 ? marketPrice : 1450;
    const estimatedUnit = Math.floor(basePrice * ratios[simType]); 
    const total = Math.floor(estimatedUnit * w);
    const labels: any = { 'pika': '特1号銅線', 'high': '高銅率線', 'medium': '中銅率線', 'low': '低銅率線', 'mixed': '雑線' };
    setSimResult({ label: labels[simType], weight: w, unit: estimatedUnit, total: total });
  };

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

  const handleReserveSubmit = async () => {
      const total = reserveItems.reduce((sum, i) => sum + (i.weight * i.unitPrice), 0);
      if (total === 0) {
        alert("金額が0円です。品目を選択し直してください。");
        return;
      }
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
      alert("日本語フォントの読み込みに失敗しました。public/fonts/NotoSansJP-Regular.ttf を確認してください。");
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
    doc.text("北海道苫小牧市勇払123-4", 195, 35, { align: "right" });
     
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
     
    doc.save(`Estimate_${new Date().getTime()}.pdf`);
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
    doc.text(`会員様: ${lastTxData.member}`, 15, 40);

    doc.text("買主: 株式会社 月寒製作所", 195, 30, { align: "right" });
    doc.text("登録番号: T1234567890123", 195, 35, { align: "right" });

    const taxRate = 0.10;
    const price = lastTxData.price || 0;
    const tax = Math.floor(price * taxRate);
    const total = price + tax;

    autoTable(doc, {
      head: [['品目', '重量', 'ランク', '金額']],
      body: [
        [lastTxData.product, `${lastTxData.weight} kg`, lastTxData.rank, `¥${price.toLocaleString()}`],
        ['', '', '消費税 (10%)', `¥${tax.toLocaleString()}`],
        ['', '', '合計金額', `¥${total.toLocaleString()}`]
      ],
      startY: 50,
      theme: 'grid',
      styles: { font: 'NotoSansJP', fontStyle: 'normal' },
      headStyles: { fillColor: [20, 20, 20] }
    });

    doc.text("毎度ありがとうございます。", 105, (doc as any).lastAutoTable.finalY + 20, {align: "center"});
    doc.save(`Invoice_${lastTxData.id}.pdf`);
  };

  const FAQ_ITEMS = [
    { q: "インボイス制度への対応について", a: "適格請求書発行事業者として登録済みです。法人のお客様も安心してご利用いただけます。" },
    { q: "被覆付き電線の買取について", a: "独自のナゲットプラントを保有しており、被覆のまま高価買取が可能です。剥離作業は不要です。" },
    { q: "お支払いサイトについて", a: "検収完了後、即時現金払いとなります。法人様の掛け売り（請求書払い）もご相談ください。" },
    { q: "出張買取のエリアについて", a: "基本的に北海道全域に対応しております。数量によって条件が異なりますので、まずはお気軽にお問い合わせください。" }
  ];

  // ----------------------------------------------------------------
  // GLOBAL NAVIGATION COMPONENT
  // ----------------------------------------------------------------
  const GlobalNav = () => (
    <nav className="fixed top-0 w-full z-[100] transition-all duration-300 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
            {/* LOGO */}
            <div className="cursor-pointer group" onClick={() => setView('LP')}>
                <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-0.5 group-hover:text-[#D32F2F] transition-colors">Tsukisamu Mfg.</h1>
                <p className="text-xl font-serif font-bold tracking-widest leading-none text-black">月寒製作所</p>
            </div>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-10">
                {['HOME', 'FLOW', 'MEMBERSHIP', 'COMPANY', 'CONTACT'].map((item) => {
                    const viewTarget = item === 'HOME' ? 'LP' : item;
                    return (
                        <button 
                            key={item}
                            onClick={() => setView(viewTarget as any)}
                            className={`text-xs font-bold tracking-widest relative group py-2 ${view === viewTarget ? 'text-[#D32F2F]' : 'text-gray-500 hover:text-black'}`}
                        >
                            {item === 'FLOW' ? '買取の流れ' : item === 'MEMBERSHIP' ? '会員制度' : item === 'COMPANY' ? '会社概要' : item === 'CONTACT' ? 'お問い合わせ' : 'HOME'}
                            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#D32F2F] transition-all duration-300 ${view === viewTarget ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </button>
                    )
                })}
                <button onClick={() => setView('LOGIN')} className="bg-[#111] text-white text-[10px] px-6 py-2.5 rounded hover:bg-[#D32F2F] transition-all duration-300 uppercase tracking-widest font-bold shadow-lg">Login</button>
            </div>

            {/* MOBILE HAMBURGER */}
            <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black p-2">
                    {isMenuOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
            </div>
        </div>

        {/* MOBILE MENU OVERLAY */}
        {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-20 bg-white z-50 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-200 shadow-xl border-t border-gray-100">
                 {['HOME', 'FLOW', 'MEMBERSHIP', 'COMPANY', 'CONTACT'].map((item) => {
                    const viewTarget = item === 'HOME' ? 'LP' : item;
                    return (
                        <button 
                            key={item}
                            onClick={() => { setView(viewTarget as any); setIsMenuOpen(false); }}
                            className="text-lg font-bold text-left border-b border-gray-100 pb-4 text-black"
                        >
                            {item === 'FLOW' ? '買取の流れ' : item === 'MEMBERSHIP' ? '会員制度' : item === 'COMPANY' ? '会社概要' : item === 'CONTACT' ? 'お問い合わせ' : 'HOME'}
                        </button>
                    )
                })}
                <button onClick={() => { setView('LOGIN'); setIsMenuOpen(false); }} className="w-full bg-[#D32F2F] text-white py-4 font-bold rounded">関係者ログイン</button>
            </div>
        )}
    </nav>
  );

  // ----------------------------------------------------------------
  // FAT FOOTER COMPONENT
  // ----------------------------------------------------------------
  const FatFooter = () => (
    <footer className="bg-[#111] text-white pt-20 pb-10 border-t border-[#D32F2F]">
        <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
            
            {/* 1. BRAND & ADDRESS */}
            <div className="md:col-span-1 space-y-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold tracking-widest mb-2">月寒製作所</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Tsukisamu Mfg. Tomakomai</p>
                </div>
                <div className="text-sm text-gray-400 font-light leading-loose">
                    <p>〒053-0001</p>
                    <p>北海道苫小牧市一本松町9-6</p>
                    <p className="mt-4 text-white font-bold text-lg font-serif">TEL: 0144-55-5544</p>
                    <p className="text-xs">FAX: 0144-55-5545</p>
                </div>
            </div>

            {/* 2. SITEMAP */}
            <div className="md:col-span-1">
                <h3 className="text-xs font-bold text-[#D32F2F] tracking-widest uppercase mb-6">Contents</h3>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li><button onClick={()=>setView('LP')} className="hover:text-white transition-colors">ホーム</button></li>
                    <li><button onClick={()=>setView('FLOW')} className="hover:text-white transition-colors">買取の流れ</button></li>
                    <li><button onClick={()=>setView('MEMBERSHIP')} className="hover:text-white transition-colors">会員制度</button></li>
                    <li><button onClick={()=>setView('COMPANY')} className="hover:text-white transition-colors">会社概要</button></li>
                    <li><button onClick={()=>setView('CONTACT')} className="hover:text-white transition-colors">お問い合わせ</button></li>
                    <li><button onClick={()=>setView('LOGIN')} className="hover:text-white transition-colors">関係者ログイン</button></li>
                </ul>
            </div>

            {/* 3. LICENSE & PERMITS */}
            <div className="md:col-span-1">
                <h3 className="text-xs font-bold text-[#D32F2F] tracking-widest uppercase mb-6">License</h3>
                <ul className="space-y-4 text-xs text-gray-500">
                    <li className="flex flex-col">
                        <span className="text-gray-300 font-bold">北海道知事許可</span>
                        <span>（般-18）石第00857号</span>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-gray-300 font-bold">産業廃棄物処分業</span>
                        <span>第00120077601号</span>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-gray-300 font-bold">金属くず商許可</span>
                        <span>胆安第123号</span>
                    </li>
                    <li className="flex flex-col">
                        <span className="text-gray-300 font-bold">適格請求書発行事業者</span>
                        <span>T1234567890123</span>
                    </li>
                </ul>
            </div>

            {/* 4. GOOGLE MAPS */}
            <div className="md:col-span-1 h-60 bg-gray-800 relative group overflow-hidden border border-white/10 rounded-sm">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2926.764576767676!2d141.67676767676767!3d42.67676767676767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDQwJzM2LjQiTiAxNDHCsDQwJzM2LjQiRQ!5e0!3m2!1sja!2sjp!4v1600000000000!5m2!1sja!2sjp" 
                    width="100%" 
                    height="100%" 
                    style={{border:0}} 
                    loading="lazy" 
                    className="grayscale group-hover:grayscale-0 transition duration-700"
                ></iframe>
                <div className="absolute bottom-0 left-0 bg-black/80 text-white text-[10px] px-2 py-1">苫小牧工場</div>
            </div>
        </div>

        {/* COPYRIGHT BAR */}
        <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-[10px] text-gray-500 tracking-widest font-mono">
                © 2026 TSUKISAMU MANUFACTURING CO., LTD. ALL RIGHTS RESERVED.
            </p>
        </div>
    </footer>
  );

  // ----------------------------------------------------------------
  // PUBLIC VIEWS WRAPPER (LP, FLOW, MEMBERSHIP, COMPANY, CONTACT)
  // ----------------------------------------------------------------
  if (['LP', 'FLOW', 'MEMBERSHIP', 'COMPANY', 'CONTACT'].includes(view) || view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans selection:bg-[#D32F2F] selection:text-white pt-20">
        <GlobalNav />

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

        {view === 'LP' && (
            <>
                {/* HERO SECTION */}
                <section className="relative h-[85vh] min-h-[600px] flex items-center bg-[#D32F2F] text-white overflow-hidden">
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

                {/* PRICE LIST SECTION */}
                <section id="price" className="py-24 bg-[#111] text-white">
                  <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-16">
                      <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Today's Price</span>
                      <h2 className="text-4xl font-serif font-medium text-white">本日の買取価格</h2>
                      <p className="text-gray-500 mt-4 text-sm font-mono">※相場変動により予告なく変更する場合があります</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                      {data?.products?.filter(p => ['pika', 'cv', 'iv', 'vvf', 'mixed', 'cabtire'].some(k => p.id.includes(k) || p.category.includes(k) || Object.keys(IMAGES).includes(p.id))).slice(0, 6).map((product, i) => {
                        const imgKey = Object.keys(IMAGES).find(k => product.id.toLowerCase().includes(k) || product.category.toLowerCase().includes(k)) || 'nugget';
                        // @ts-ignore
                        const imgSrc = IMAGES[imgKey];
                        return (
                          <div key={product.id} className="group relative bg-[#1a1a1a] border border-white/10 overflow-hidden hover:border-[#D32F2F] transition-all duration-500">
                            <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 mix-blend-overlay" style={{backgroundImage: `url(${imgSrc})`}}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                            <div className="relative p-8 h-full flex flex-col justify-end">
                              <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-[10px] text-[#D32F2F] font-bold tracking-widest uppercase mb-2 block">{product.category}</span>
                                <h3 className="text-2xl font-bold font-serif leading-tight mb-1">{product.name}</h3>
                                <p className="text-xs text-gray-400 font-mono">{product.sq}sq / {product.core}C</p>
                              </div>
                              <div className="border-t border-white/20 pt-4 flex justify-between items-end">
                                <div>
                                   <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Unit Price</span>
                                   <div className="text-3xl font-serif font-bold tracking-tighter text-white group-hover:text-[#D32F2F] transition-colors">
                                     ¥{Math.floor(marketPrice * (product.ratio / 100) * 0.9).toLocaleString()}
                                   </div>
                                </div>
                                <div className="text-right">
                                   <span className="text-[10px] text-gray-500 uppercase tracking-wider block">Cu Yield</span>
                                   <span className="text-lg font-mono font-bold">
                                     {product.ratio !== undefined && product.ratio !== null ? Number(product.ratio).toFixed(1) + '%' : '-'}
                                   </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
                
                {/* FAQ SECTION */}
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
            </>
        )}

        {view === 'FLOW' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 px-6 bg-gray-50 min-h-[60vh]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold mb-8 text-[#111]">買取の流れ</h2>
                    <div className="p-12 bg-white border border-gray-200 shadow-sm">
                        <p className="text-gray-400 font-bold tracking-widest uppercase mb-4">COMING SOON</p>
                        <p className="text-sm text-gray-500">初めてのお客様でも安心・スムーズな買取フローをご案内するページを準備中です。<br/>現在は「お問い合わせ」より直接ご相談ください。</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl">1</div>
                            <div className="w-8 h-1 bg-gray-200 mt-8"></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl">2</div>
                            <div className="w-8 h-1 bg-gray-200 mt-8"></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl">3</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {view === 'MEMBERSHIP' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20 pb-32 px-6 bg-[#1a1a1a] text-white relative overflow-hidden min-h-[80vh]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a1a1a] via-[#D32F2F] to-[#1a1a1a]"></div>
                <div className="absolute -right-20 top-40 text-white/5 text-9xl font-serif font-bold select-none z-0" style={{writingMode: 'vertical-rl'}}>会員制度</div>
                <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-20"><span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-4">Partnership Program</span><h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">アカウントを育てる。<br/>価値を最大化する。</h2><p className="text-gray-400 text-sm font-light tracking-wide leading-loose">取引量と品質に応じて、あなたの会員ランクは進化します。<br/>ランクアップに伴い、買取単価や待遇が優遇されるパートナーシップ制度です。</p></div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20 text-center md:text-left"><div className="bg-white/5 border border-white/10 px-8 py-6 rounded-xl"><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Volume</p><p className="text-xl font-serif">取引数量</p></div><div className="text-2xl text-gray-600 font-serif">×</div><div className="bg-white/5 border border-white/10 px-8 py-6 rounded-xl"><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Quality</p><p className="text-xl font-serif">分別品質</p></div><div className="text-2xl text-[#D32F2F] font-bold">＝</div><div className="flex items-center gap-4"><Icons.Crown /><div><p className="text-[10px] text-[#D32F2F] uppercase tracking-widest mb-1">Rank Up</p><p className="text-2xl font-serif font-bold text-white">高価買取・優遇</p></div></div></div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-[#222] border border-white/10 p-8 rounded-lg relative group hover:border-[#b87333] transition-colors duration-500"><div className="absolute top-0 left-0 w-full h-1 bg-[#b87333]"></div><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-serif text-[#b87333]">COPPER</h3><span className="text-[10px] bg-[#b87333]/20 text-[#b87333] px-2 py-1 rounded">一般会員</span></div><p className="text-xs text-gray-400 mb-8 h-12">初回取引後に発行されるスタンダードプラン。全ての基本機能をご利用いただけます。</p><ul className="space-y-3 text-sm text-gray-300"><li className="flex items-center gap-3"><span className="text-[#b87333] text-lg">●</span> ポイント付与 <span className="font-bold">1.0倍</span></li><li className="flex items-center gap-3"><span className="text-[#b87333] text-lg">●</span> Web明細確認</li></ul></div>
                    <div className="bg-[#222] border border-white/10 p-8 rounded-lg relative group hover:border-gray-400 transition-colors duration-500"><div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-serif text-gray-300">SILVER</h3><span className="text-[10px] bg-gray-400/20 text-gray-300 px-2 py-1 rounded">優良会員</span></div><p className="text-xs text-gray-400 mb-8 h-12">継続的なお取引と、安定した品質の荷込みをいただけるお客様向けのプラン。</p><ul className="space-y-3 text-sm text-gray-300"><li className="flex items-center gap-3"><span className="text-gray-400 text-lg">●</span> ポイント付与 <span className="font-bold text-white">1.2倍</span></li><li className="flex items-center gap-3"><span className="text-gray-400 text-lg">●</span> 優先荷下ろしレーン</li></ul></div>
                    <div className="bg-gradient-to-b from-[#2a2a2a] to-[#222] border border-yellow-600/30 p-8 rounded-lg relative group transform md:-translate-y-4 shadow-xl shadow-yellow-900/10"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 animate-pulse"></div><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-serif text-yellow-500 flex items-center gap-2"><Icons.Star /> GOLD</h3><span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30">特別会員</span></div><p className="text-xs text-gray-400 mb-8 h-12">大口取引、かつ分別品質が極めて高いプロフェッショナルなパートナー様へ。</p><ul className="space-y-4 text-sm text-white"><li className="flex items-center gap-3"><span className="text-yellow-500 text-lg">★</span> ポイント付与 <span className="font-bold text-yellow-400 text-lg">1.5倍</span></li><li className="flex items-center gap-3"><span className="text-yellow-500 text-lg">★</span> 買取単価 <span className="font-bold text-yellow-400 text-lg">特別優遇</span></li><li className="flex items-center gap-3"><span className="text-yellow-500 text-lg">★</span> 専用キャンペーン招待</li></ul></div>
                </div>
                </div>
            </div>
        )}

        {view === 'COMPANY' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 px-6 bg-gray-50 min-h-[60vh]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-[#111]">会社概要</h2>
                        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Corporate Profile</p>
                    </div>
                    <div className="bg-white p-12 border border-gray-200 shadow-sm space-y-8">
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">社名</span>
                            <span className="text-sm text-gray-600">株式会社 月寒製作所 苫小牧工場</span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">設立</span>
                            <span className="text-sm text-gray-600">1961年（昭和36年）</span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">所在地</span>
                            <span className="text-sm text-gray-600">〒053-0001 北海道苫小牧市一本松町9-6</span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">事業内容</span>
                            <span className="text-sm text-gray-600">非鉄金属リサイクル、銅ナゲット製造、産業廃棄物収集運搬・処分</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {view === 'CONTACT' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 px-6 bg-gray-50 min-h-[60vh]">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-[#111]">お問い合わせ</h2>
                        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Contact Us</p>
                    </div>
                    <form className="bg-white p-8 md:p-12 border border-gray-200 shadow-sm space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">御社名 / お名前</label>
                            <input className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#D32F2F] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">メールアドレス</label>
                            <input type="email" className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#D32F2F] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">お問い合わせ内容</label>
                            <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#D32F2F] transition-colors"></textarea>
                        </div>
                        <button className="w-full bg-[#111] text-white py-4 font-bold tracking-widest hover:bg-[#D32F2F] transition-colors">送信する</button>
                    </form>
                </div>
            </div>
        )}

        <FatFooter />
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
                            <p className="text-xs text-gray-500 mt-2">想定: ¥{Number(res.total || 0).toLocaleString()}</p>
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
                          const basePrice = marketPrice > 0 ? marketPrice : 1450;
                          newItems[0].unitPrice = Math.floor(basePrice * (p?.ratio||0)/100 * 0.9);
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
