"use client";

import React, { useState, useEffect } from 'react';

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
  id: string; name: string; rank: 'COPPER'|'SILVER'|'GOLD'; totalWeight: number; points: number; history: Transaction[];
}

interface MarketData {
  status: string; config: { market_price: number }; history: { date: string; value: number }[]; products: ProductData[]; stats: { monthlyTotal: number };
}

// ==========================================
// 画像パス定義
// ==========================================
const IMAGES = {
  hero: "/images/factory_floor.png", pika: "/images/pika_wire.png", cv: "/images/cv_cable.png", iv: "/images/iv_cable.png", vvf: "/images/vvf_cable.png", mixed: "/images/mixed_wire.png", cabtire: "/images/cabtire_cable.png", weight: "/images/weighing_station.jpg", nugget: "/images/copper_nugget.png", factory: "/images/factory_floor.png"
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
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
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
  const [memberTab, setMemberTab] = useState<'DASHBOARD' | 'HISTORY' | 'SETTINGS'>('DASHBOARD');

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
  const [completeTxId, setCompleteTxId] = useState<string | null>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;500;700;900&family=Oswald:wght@300;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    fetch('/api/gas').then(res => res.json()).then(d => { if(d.status === 'success') setData(d); });
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value }) });
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

  // ==============================================
  // POS計算ロジック (haisen_master思想導入)
  // ==============================================
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) { alert("商品と重量を入力してください"); return; }
    if (!data) { alert("データ読み込み中..."); return; }

    const product = data.products.find(p => p.id === posProduct);
    if (!product) return;
    
    // データが0の場合はフォールバック値を使用
    const currentMarketPrice = marketPrice > 0 ? marketPrice : 1450; 
    const weight = parseFloat(posWeight);
    
    // 1. ランク補正
    const rankBonus = posRank === 'A' ? 1.02 : posRank === 'C' ? 0.95 : 1.0;
    // 2. 市場係数 (安全マージン 90%)
    const marketFactor = 0.90; 
    // 3. 加工コスト (15円/kg)
    const processingCost = 15;

    // 計算式: (建値 * 銅率% * ランク * 市場係数) - コスト
    const rawPrice = currentMarketPrice * (product.ratio / 100);
    const adjustedPrice = (rawPrice * rankBonus * marketFactor) - processingCost;
    const finalUnitPrice = Math.max(0, Math.floor(adjustedPrice)); // マイナス防止
    
    setPosResult(Math.floor(finalUnitPrice * weight));
    setCompleteTxId(null);
  };

  const handlePosSubmit = async () => {
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
        setCompleteTxId(result.data.transactionId);
        setPosProduct(''); setPosWeight(''); setPosResult(null);
      } else { alert('登録エラー: ' + result.message); }
    } catch (e) { alert('通信エラー'); } finally { setIsSubmitting(false); }
  };

  const FAQ_ITEMS = [
    { q: "インボイス制度への対応について", a: "適格請求書発行事業者として登録済みです。法人のお客様も安心してご利用いただけます。" },
    { q: "被覆付き電線の買取について", a: "独自のナゲットプラントを保有しており、被覆のまま高価買取が可能です。剥離作業は不要です。" },
    { q: "お支払いサイトについて", a: "検収完了後、即時現金払いとなります。法人様の掛け売り（請求書払い）もご相談ください。" },
    { q: "出張買取のエリアについて", a: "基本的に北海道全域に対応しております。数量によって条件が異なりますので、まずはお気軽にお問い合わせください。" }
  ];

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

        <section className="relative h-screen min-h-[800px] flex items-center bg-[#D32F2F] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src={IMAGES.hero} className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale" alt="Factory" />
             <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#E53935] opacity-90"></div>
             <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] border-[1px] border-white/10 rounded-full opacity-50"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] border-[1px] border-white/10 rounded-full opacity-50"></div>
          </div>
          <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6 relative">
                <div className="hidden lg:block absolute -left-24 top-0 h-full w-10 border-r border-white/30"><span className="block text-xs font-serif tracking-[0.5em] opacity-80" style={{writingMode: 'vertical-rl'}}>創業昭和三十六年</span></div>
                <div className="inline-block bg-white text-[#D32F2F] px-4 py-1 text-xs font-bold tracking-widest mb-4">SINCE 1961</div>
                <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight tracking-tight drop-shadow-sm"><span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">資源を、</span><span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">あるべき<span className="border-b-4 border-white/80 pb-2">価値</span>へ。</span></h1>
              </div>
              <p className="text-white/90 text-sm md:text-base leading-loose max-w-lg font-medium tracking-wide animate-in fade-in duration-1000 delay-500 border-l-2 border-white/30 pl-6">月寒製作所は「目利き」と「技術」で、日本のリサイクルインフラを支え続けます。独自のナゲットプラントによる中間コストの排除。それが、高価買取の根拠です。</p>
              <div className="pt-8 flex gap-6 animate-in fade-in duration-1000 delay-700"><a href="#simulator" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#111] hover:text-white transition-all shadow-xl">査定シミュレーション</a></div>
            </div>
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                <RealChart data={data?.history || []} currentPrice={marketPrice} />
                <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center"><div><p className="text-[9px] text-white/70 uppercase tracking-widest mb-1">Factory Status</p><p className="text-xs font-medium tracking-wider flex items-center gap-2 text-white"><span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></span> Accepting</p></div><div className="text-right"><p className="text-xs font-serif italic text-white/80">Tomakomai, Hokkaido</p></div></div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-32 px-6 bg-white relative">
          <div className="absolute right-6 top-32 text-[#f0f0f0] text-9xl font-serif font-bold opacity-50 select-none z-0" style={{writingMode: 'vertical-rl'}}>一貫処理</div>
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
             <div className="order-2 md:order-1 relative"><div className="aspect-[4/5] bg-gray-100 overflow-hidden relative"><img src={IMAGES.nugget} alt="Copper Nugget" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-[1.5s]" /><div className="absolute top-0 left-0 w-2 h-full bg-[#D32F2F]"></div></div></div>
             <div className="order-1 md:order-2 space-y-12">
                <div className="flex flex-col gap-4"><div className="flex items-center gap-4"><span className="h-[1px] w-12 bg-[#D32F2F]"></span><span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase">Why Choose Us</span></div><h2 className="text-4xl md:text-5xl font-serif font-medium leading-snug text-[#111]">中間マージンを排除する、<br/><span className="bg-red-50 px-2">自社一貫体制</span>の強み。</h2></div>
                <div className="space-y-10">
                  {[{ t: "六十年の歴史と信用", d: "1961年の創業以来、北海道の地で積み重ねた実績。正確無比な計量と査定をお約束します。" }, { t: "自社ナゲットプラント", d: "被覆線を自社工場で粉砕・選別。商社を挟まず製錬所へ直納するため、高価買取価格として還元できます。" }, { t: "透明な価格基準", d: "LME（ロンドン金属取引所）の銅相場に完全連動。不透明な「言い値」での取引は一切行いません。" }].map((item, i) => (<div key={i} className="group"><h3 className="text-xl font-serif font-bold mb-3 flex items-center gap-3"><span className="font-mono text-[#D32F2F] opacity-50 text-sm">0{i+1}</span>{item.t}</h3><p className="text-sm text-gray-600 leading-loose text-justify pl-8 border-l border-gray-200 group-hover:border-[#D32F2F] transition-colors duration-300">{item.d}</p></div>))}
                </div>
             </div>
          </div>
        </section>

        <section id="service" className="py-32 px-6 bg-[#F9F9F9]">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16"><div className="border-l-4 border-[#D32F2F] pl-6"><span className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase block mb-2">Our Service</span><h2 className="text-4xl font-serif font-bold">買取プラン</h2></div><p className="text-sm text-gray-500 mt-4 md:mt-0 font-medium">ニーズに合わせた3つの取引形態</p></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group border-t-4 border-transparent hover:border-[#D32F2F] relative overflow-hidden"><div className="absolute top-4 right-4 text-gray-100 text-6xl font-black font-serif z-0 group-hover:text-red-50 transition-colors">01</div><div className="relative z-10"><h3 className="text-2xl font-serif font-bold mb-4">お持ち込み</h3><div className="w-12 h-[2px] bg-gray-200 group-hover:bg-[#D32F2F] transition-colors mb-6"></div><p className="text-gray-500 text-sm leading-relaxed mb-8 h-16">100kg以上の小ロットから対応。<br/>検収後、その場で現金にてお支払い。<br/><span className="text-xs text-gray-400 mt-1 block">※1t以上は銀行振込</span></p><div className="aspect-[4/3] bg-gray-100 mb-6 overflow-hidden"><img src={IMAGES.weight} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 transform group-hover:scale-110" alt="weight" /></div><div className="flex items-center text-xs tracking-widest font-bold group-hover:text-[#D32F2F] transition-colors">VIEW DETAIL <span className="ml-2">→</span></div></div></div>
              <div className="bg-[#111] text-white p-10 shadow-2xl hover:shadow-2xl transition-all duration-500 group border-t-4 border-[#D32F2F] relative transform md:-translate-y-4"><div className="absolute top-4 right-4 text-white/10 text-6xl font-black font-serif z-0">02</div><div className="relative z-10"><h3 className="text-2xl font-serif font-bold mb-4">出張買取</h3><div className="w-12 h-[2px] bg-[#D32F2F] mb-6"></div><p className="text-gray-400 text-sm leading-relaxed mb-8 h-16">1t〜2tの中規模ロット向け。<br/>北海道全域、弊社トラックにて無料引取。<br/><span className="text-xs text-gray-500 mt-1 block">※要事前予約</span></p><div className="aspect-[4/3] bg-gray-800 mb-6 overflow-hidden relative"><div className="absolute inset-0 bg-[#D32F2F] mix-blend-overlay opacity-0 group-hover:opacity-40 transition duration-500 z-10"></div><img src={IMAGES.hero} className="w-full h-full object-cover grayscale transition duration-700 transform group-hover:scale-110" alt="truck" /></div><div className="flex items-center text-xs tracking-widest font-bold text-[#D32F2F]">VIEW DETAIL <span className="ml-2">→</span></div></div></div>
              <div className="bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group border-t-4 border-transparent hover:border-[#D32F2F] relative overflow-hidden"><div className="absolute top-4 right-4 text-gray-100 text-6xl font-black font-serif z-0 group-hover:text-red-50 transition-colors">03</div><div className="relative z-10"><h3 className="text-2xl font-serif font-bold mb-4">大規模買取</h3><div className="w-12 h-[2px] bg-gray-200 group-hover:bg-[#D32F2F] transition-colors mb-6"></div><p className="text-gray-500 text-sm leading-relaxed mb-8 h-16">5t以上の大口取引。<br/>道外対応・運送費弊社負担。<br/>専任担当者が最適な条件をご提案。</p><div className="aspect-[4/3] bg-gray-100 mb-6 overflow-hidden"><img src={IMAGES.factory} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 transform group-hover:scale-110" alt="business" /></div><div className="flex items-center text-xs tracking-widest font-bold group-hover:text-[#D32F2F] transition-colors">CONTACT US <span className="ml-2">→</span></div></div></div>
            </div>
          </div>
        </section>

        <section id="membership" className="py-32 px-6 bg-[#1a1a1a] text-white relative overflow-hidden">
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
        </section>

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

        <section id="price" className="py-32 px-6 bg-white">
          <div className="max-w-[1200px] mx-auto">
             <div className="mb-20 flex items-end justify-between border-b border-gray-200 pb-6"><h2 className="text-3xl font-serif">取扱品目</h2><div className="flex gap-4">{['pika', 'cv', 'iv', 'mixed'].map(t => (<button key={t} onClick={()=>setActiveTab(t)} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors ${activeTab===t ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:text-black'}`}>{t}</button>))}</div></div>
             <div className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in duration-500" key={activeTab}>
               <div className="h-[400px] bg-gray-100 overflow-hidden relative group"><img src={IMAGES[activeTab as keyof typeof IMAGES]} alt={activeTab} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 border-[12px] border-white pointer-events-none"></div></div>
               <div className="space-y-8"><h3 className="text-3xl font-serif font-medium">{activeTab === 'pika' && '特1号銅線 (ピカ線)'}{activeTab === 'cv' && 'CV・CVTケーブル'}{activeTab === 'iv' && 'IV線'}{activeTab === 'mixed' && '雑線・ミックス'}</h3><p className="text-sm text-gray-600 leading-loose">{activeTab === 'pika' && '被覆を完全に除去した、直径1.3mm以上の純銅線。酸化やメッキがなく、光沢がある状態のものが最高値での買取対象となります。'}{activeTab === 'cv' && '工場やビルの電力供給用として使用される架橋ポリエチレン絶縁ビニルシースケーブル。銅率が高く、太いものが多いため高価買取が可能です。'}{activeTab === 'iv' && '屋内配線用として最も一般的に使用されるビニル絶縁電線。単線・撚り線問わず買取可能です。'}{activeTab === 'mixed' && '様々な種類の電線が混ざった状態や、家電コード、通信線などもまとめて引き受けます。選別不要でお持ち込みいただけます。'}</p><div className="inline-block border-l-2 border-red-600 pl-6 py-2"><span className="text-xs text-gray-400 block mb-1 tracking-widest uppercase">Target Price</span><span className="text-xl font-serif font-bold">{activeTab === 'pika' ? '最高値基準' : activeTab === 'mixed' ? '銅率により変動' : '高価買取対象'}</span></div></div>
             </div>
          </div>
        </section>

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

        <section id="access" className="border-t border-gray-200">
           <div className="grid md:grid-cols-2">
              <div className="bg-[#1a1a1a] text-white p-16 md:p-24 flex flex-col justify-center"><h2 className="text-2xl font-serif mb-12 flex items-center gap-4"><span className="w-8 h-[1px] bg-[#D32F2F]"></span> 会社概要</h2><div className="space-y-8 text-sm font-light tracking-wide text-gray-400"><div className="flex gap-8 border-b border-white/10 pb-4"><span className="w-24 shrink-0 font-bold text-white">社名</span><span>株式会社月寒製作所 苫小牧工場</span></div><div className="flex gap-8 border-b border-white/10 pb-4"><span className="w-24 shrink-0 font-bold text-white">所在地</span><span>〒053-0001 北海道苫小牧市一本松町9-6</span></div><div className="flex gap-8 border-b border-white/10 pb-4"><span className="w-24 shrink-0 font-bold text-white">許可証</span><span>北海道知事許可（般-18）石第00857号<br/>産廃処分業許可 第00120077601号</span></div><div className="pt-8"><p className="text-3xl font-serif text-white mb-2">0144-55-5544</p><p className="text-xs tracking-widest">平日 8:00 - 17:00 / 定休日: 土日祝</p></div></div></div>
              <div className="h-[400px] md:h-auto bg-gray-300 relative group grayscale hover:grayscale-0 transition duration-700"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.339790216788!2d141.6738927766324!3d42.69780077116297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f7566f07a092899%3A0x89e8360098f98072!2z44CSMDUzLTAwMDEg5YyX5rW36YGT6IuL5bCP54mn5biC5LiA5pys5p2-55S677yZ4oiS77yW!5e0!3m2!1sja!2sjp!4v1707727000000!5m2!1sja!2sjp" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe></div>
           </div>
        </section>

        <footer className="bg-white py-12 px-6 border-t border-gray-200"><div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6"><div><p className="text-xs font-bold tracking-widest uppercase mb-1">Tsukisamu Manufacturing Co., Ltd.</p><p className="text-[10px] text-gray-400">Tomakomai Factory</p></div><p className="text-[10px] text-gray-300 tracking-widest">© 2026 TSUKISAMU. ALL RIGHTS RESERVED.</p></div></footer>
      </div>
    );
  }

  // =================================================================
  // ADMIN DASHBOARD
  // =================================================================
  if (view === 'ADMIN') {
    return (
      <div className="min-h-screen bg-[#111] text-white font-sans flex flex-col md:flex-row">
        <aside className="w-full md:w-80 bg-black p-8 border-r border-white/10">
          <div className="mb-12"><h1 className="text-2xl font-serif font-bold text-white">FACTORY<span className="text-[#D32F2F]">OS</span></h1><p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Control</p></div>
          <nav className="space-y-4">
             <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Module</div>
             <button onClick={()=>setAdminTab('POS')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Calc /> 買取POSレジ</button>
             <button onClick={()=>setAdminTab('STOCK')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='STOCK' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Box /> 在庫管理</button>
             <button onClick={()=>setAdminTab('MEMBERS')} className={`w-full text-left p-4 rounded text-sm font-bold transition flex items-center gap-3 ${adminTab==='MEMBERS' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icons.Users /> 会員管理</button>
          </nav>
          <div className="mt-auto pt-12">
            <div className="bg-white/5 p-4 rounded border border-white/10 mb-4">
              <p className="text-[10px] text-gray-500 uppercase">Copper Price</p>
              <p className="text-2xl font-serif text-[#D32F2F]">¥{Number(marketPrice).toLocaleString()}</p>
            </div>
            <button onClick={() => setView('LP')} className="text-xs text-gray-500 hover:text-white uppercase tracking-widest">Log out</button>
          </div>
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
                         <h3 className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-2 h-2 bg-[#D32F2F] rounded-full"></span> 2. Product (DB)</h3>
                         <select className="w-full bg-black border border-white/20 p-4 rounded text-white font-bold mb-4 focus:border-[#D32F2F] outline-none cursor-pointer" value={posProduct} onChange={(e)=>setPosProduct(e.target.value)}>
                            <option value="">線種を選択 (データベース参照)</option>
                            {data?.products?.map(p => (
                              <option key={p.id} value={p.id}>{p.id} : {p.maker} {p.name} {p.sq}sq ({p.ratio}%)</option>
                            ))}
                         </select>
                         <div className="flex gap-4">
                            <div className="flex-1">
                               <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Weight (kg)</label>
                               <input type="number" className="w-full bg-black border border-white/20 p-4 rounded text-white font-mono text-xl focus:border-[#D32F2F] outline-none" placeholder="0.0" value={posWeight} onChange={(e)=>setPosWeight(e.target.value)} />
                            </div>
                            <div className="w-1/3">
                               <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Quality Rank</label>
                               <select className="w-full bg-black border border-white/20 p-4 rounded text-white font-bold focus:border-[#D32F2F] outline-none cursor-pointer" value={posRank} onChange={(e:any)=>setPosRank(e.target.value)}>
                                  <option value="A">Rank A (+2%)</option>
                                  <option value="B">Rank B (Std)</option>
                                  <option value="C">Rank C (-5%)</option>
                               </select>
                            </div>
                         </div>
                      </div>

                      <button onClick={handlePosCalculate} className="w-full bg-[#1a1a1a] border border-white/20 text-white py-6 rounded-xl font-bold text-lg tracking-widest hover:bg-[#333] transition">
                        CALCULATE PREVIEW
                      </button>
                   </div>

                   <div className="col-span-12 lg:col-span-4">
                      <div className="bg-white text-black p-8 rounded-xl shadow-2xl relative h-full flex flex-col">
                         {completeTxId ? (
                           <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                             <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-2 shadow-lg"><Icons.Check /></div>
                             <h3 className="text-2xl font-black text-gray-800">TRANSACTION<br/>COMPLETED</h3>
                             <p className="font-mono text-gray-500 bg-gray-100 px-4 py-2 rounded">ID: {completeTxId}</p>
                             <button onClick={()=>setCompleteTxId(null)} className="text-xs font-bold text-[#D32F2F] hover:underline mt-4 uppercase tracking-widest">Start New Transaction</button>
                           </div>
                         ) : (
                           <>
                             <div className="text-center border-b-2 border-dashed border-gray-300 pb-6 mb-6">
                                <h4 className="font-serif font-bold text-xl mb-1">PURCHASE RECEIPT</h4>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Tsukisamu Manufacturing</p>
                             </div>
                             <div className="flex-1 space-y-4 font-mono text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">DATE</span><span>{new Date().toLocaleDateString()}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">MEMBER</span><span>{posUser || 'Guest'}</span></div>
                                <div className="border-b border-gray-200 my-4"></div>
                                <div>
                                   <p className="font-bold mb-1">{posProduct ? data?.products.find(p=>p.id===posProduct)?.name : '---'}</p>
                                   <div className="flex justify-between text-xs text-gray-500">
                                     <span>{posProduct || '-'}</span>
                                     <span>{posWeight || 0}kg × Rank {posRank}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="border-t-2 border-dashed border-gray-300 pt-6 mt-6">
                                <div className="flex justify-between items-end mb-6">
                                   <span className="font-bold text-gray-600">TOTAL</span>
                                   <span className="text-3xl font-black tracking-tighter">¥{posResult ? posResult.toLocaleString() : '0'}</span>
                                </div>
                                {posResult !== null && (
                                  <button 
                                    onClick={handlePosSubmit} 
                                    disabled={isSubmitting}
                                    className="w-full bg-[#D32F2F] text-white py-4 rounded font-bold shadow-lg hover:bg-[#B71C1C] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                  >
                                    {isSubmitting ? 'PROCESSING...' : 'CONFIRM PURCHASE'}
                                  </button>
                                )}
                             </div>
                           </>
                         )}
                      </div>
                   </div>
                </div>
             </div>
           )}

           {adminTab === 'STOCK' && (
             <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in">
                <div className="inline-block p-8 bg-white/5 rounded-full mb-6"><Icons.Box /></div>
                <h2 className="text-2xl font-serif font-bold mb-2">Inventory Management</h2>
                <p className="text-gray-500 mb-8">在庫管理モジュールは現在準備中です</p>
                <div className="bg-[#1a1a1a] p-8 rounded-xl border border-white/10 max-w-sm mx-auto">
                   <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Estimated Stock</p>
                   <p className="text-4xl font-mono text-white">4,250<span className="text-sm text-gray-500 ml-2">kg</span></p>
                </div>
             </div>
           )}

           {adminTab === 'MEMBERS' && (
             <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in">
                <div className="inline-block p-8 bg-white/5 rounded-full mb-6"><Icons.Users /></div>
                <h2 className="text-2xl font-serif font-bold mb-2">Member Management</h2>
                <p className="text-gray-500">会員管理・分析モジュールは現在準備中です</p>
             </div>
           )}
        </main>
      </div>
    );
  }

  if (view === 'MEMBER') {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#111] font-sans flex flex-col md:flex-row">
        <aside className="w-full md:w-80 bg-white p-8 border-r border-gray-200">
          <div className="mb-12"><h1 className="text-2xl font-serif font-bold text-[#111]">MY <span className="text-[#D32F2F]">PAGE</span></h1><p className="text-[10px] text-gray-400 uppercase tracking-widest">Member Portal</p></div>
          <div className="text-center mb-8"><div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">🏗️</div><p className="font-bold text-lg">{user?.name || 'User'}</p><span className="bg-[#b87333]/10 text-[#b87333] border border-[#b87333]/20 text-xs px-3 py-1 rounded-full font-bold">COPPER MEMBER</span></div>
          <nav className="space-y-2">
             <button onClick={()=>setMemberTab('DASHBOARD')} className={`w-full text-left p-4 rounded-lg text-sm font-bold transition flex items-center gap-3 ${memberTab==='DASHBOARD' ? 'bg-[#111] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.Dashboard /> ダッシュボード</button>
             <button onClick={()=>setMemberTab('HISTORY')} className={`w-full text-left p-4 rounded-lg text-sm font-bold transition flex items-center gap-3 ${memberTab==='HISTORY' ? 'bg-[#111] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.History /> 取引履歴</button>
             <button onClick={()=>setMemberTab('SETTINGS')} className={`w-full text-left p-4 rounded-lg text-sm font-bold transition flex items-center gap-3 ${memberTab==='SETTINGS' ? 'bg-[#111] text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}><Icons.Users /> アカウント設定</button>
          </nav>
          <div className="mt-auto pt-12"><button onClick={() => setView('LP')} className="text-xs text-gray-400 hover:text-red-500 font-bold uppercase tracking-widest">Log out</button></div>
        </aside>

        <main className="flex-1 p-8 overflow-y-auto">
           {memberTab === 'DASHBOARD' && (
             <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-[#111] text-white rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F] rounded-full filter blur-[100px] opacity-20"></div>
                   <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                      <div><p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Current Status</p><h2 className="text-4xl font-serif font-bold mb-6 text-[#b87333]">COPPER RANK</h2><p className="text-sm text-gray-300 leading-relaxed mb-8">現在、一般会員ランクです。<br/>あと <span className="text-white font-bold border-b border-white">240kg</span> の取引で、シルバーランクへ昇格します。</p><div className="w-full bg-white/10 h-2 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-[#b87333] to-orange-400 h-full w-[65%]"></div></div><div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono"><span>0kg</span><span>NEXT: 1000kg</span></div></div>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl"><h3 className="text-xs font-bold uppercase tracking-widest mb-4">Rank Benefits</h3><ul className="space-y-4 text-sm"><li className="flex items-center gap-3 opacity-50"><span className="text-gray-500">●</span> ポイント還元 1.0%</li><li className="flex items-center gap-3 opacity-50"><span className="text-gray-500">●</span> 通常レーン利用</li><li className="flex items-center gap-3 text-yellow-500 font-bold"><Icons.Star /> 次のランクで還元率 1.2% にUP!</li></ul></div>
                   </div>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Total Volume</p><p className="text-3xl font-mono font-bold">760<span className="text-sm text-gray-400 ml-1">kg</span></p></div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Total Amount</p><p className="text-3xl font-mono font-bold">¥542,000</p></div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Last Visit</p><p className="text-xl font-bold">2026.02.01</p></div>
                </div>
             </div>
           )}

           {memberTab === 'HISTORY' && (
             <div className="max-w-5xl mx-auto animate-in fade-in">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-8 border-b border-gray-100 flex justify-between items-center"><h3 className="font-serif font-bold">取引履歴</h3><button className="text-xs font-bold text-[#D32F2F]">EXPORT CSV</button></div>
                   <table className="w-full text-sm text-left"><thead className="bg-gray-50 text-gray-500 font-mono text-xs uppercase tracking-wider"><tr><th className="px-8 py-4">Date</th><th className="px-8 py-4">Item</th><th className="px-8 py-4">Weight</th><th className="px-8 py-4 text-right">Amount</th></tr></thead><tbody className="divide-y divide-gray-100"><tr className="hover:bg-gray-50 transition"><td className="px-8 py-4 font-mono text-gray-500">2026.02.01</td><td className="px-8 py-4 font-bold">特1号銅線 (ピカ線)</td><td className="px-8 py-4">120kg</td><td className="px-8 py-4 text-right font-mono font-bold">¥142,000</td></tr><tr className="hover:bg-gray-50 transition"><td className="px-8 py-4 font-mono text-gray-500">2026.01.15</td><td className="px-8 py-4 font-bold">CVケーブル (中銅率)</td><td className="px-8 py-4">350kg</td><td className="px-8 py-4 text-right font-mono font-bold">¥280,000</td></tr></tbody></table>
                </div>
             </div>
           )}

           {memberTab === 'SETTINGS' && (
             <div className="max-w-xl mx-auto text-center py-20 animate-in fade-in">
               <Icons.Users />
               <p className="text-gray-500 mt-4">アカウント設定機能は準備中です</p>
             </div>
           )}
        </main>
      </div>
    );
  }

  return null;
}
