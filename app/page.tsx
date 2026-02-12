"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 画像パス定義 (修正版)
// ==========================================
const IMAGES = {
  hero: "/images/factory_floor.png",      // PNG
  pika: "/images/pika_wire.png",          // PNG
  cv: "/images/cv_cable.png",             // PNG
  iv: "/images/iv_cable.png",             // PNG
  vvf: "/images/vvf_cable.png",           // PNG
  mixed: "/images/mixed_wire.png",        // PNG
  cabtire: "/images/cabtire_cable.png",   // PNG
  weight: "/images/weighing_station.jpg", // JPG
  nugget: "/images/copper_nugget.png",    // PNG
  
  // ★追加: これが抜けていました！
  factory: "/images/factory_exterior.png" // PNG (工場外観)
};

// ==========================================
// 必要最小限の機能アイコン (装飾用は排除)
// ==========================================
const Icons = {
  ArrowUp: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  ChevronDown: ({className}:{className?:string}) => <svg className={className} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>,
};

// ==========================================
// リアルタイムチャート (Intellectual Mode)
// ==========================================
const RealChart = ({ data }: {data: any[]}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  if (!data || data.length < 2) return <div className="h-40 flex items-center justify-center text-xs tracking-widest text-gray-400">MARKET DATA SYNC...</div>;

  const maxVal = Math.max(...data.map((d: any) => d.value));
  const minVal = Math.min(...data.map((d: any) => d.value));
  const range = maxVal - minVal || 100;
  const yMax = maxVal + range * 0.2;
  const yMin = minVal - range * 0.2;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => `${getX(i)},${100 - ((d.value - yMin) / (yMax - yMin)) * 100}`).join(' ');

  const displayDate = activePoint ? activePoint.date : data[data.length - 1].date;
  const displayValue = activePoint ? activePoint.value : data[data.length - 1].value;

  // 日付整形
  const formatDate = (d: string) => {
    if(!d) return '';
    const parts = d.split('/');
    if(parts.length < 2) return d;
    // 2026.02.12 形式に変換
    return `${parts.length===2 ? new Date().getFullYear() : parts[0]}.${parts[parts.length-2].padStart(2,'0')}.${parts[parts.length-1].padStart(2,'0')}`;
  }

  return (
    <div className="w-full" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-6 border-b border-white/20 pb-4">
        <div>
          <p className="text-[10px] font-medium text-gray-400 tracking-[0.2em] mb-1">MARKET PRICE / {formatDate(displayDate)}</p>
          <p className="text-5xl font-serif text-white tracking-tight">
            <span className="text-2xl mr-1">¥</span>{displayValue.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
           <div className="text-red-500 text-[10px] font-bold flex items-center justify-end gap-2 uppercase tracking-widest"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> Live</div>
           <p className="text-[10px] text-gray-500 mt-1 font-serif">LME Copper</p>
        </div>
      </div>
      <div className="h-40 w-full relative overflow-visible">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d={`M ${points}`} fill="none" stroke="#D32F2F" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {/* グラデーション等は廃止し、線一本で潔く見せる */}
          {data.map((d: any, i: number) => (
            <rect key={i} x={getX(i)-1} y="0" width="2" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} />
          ))}
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
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pika');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // シミュレーター
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    // Google Fontsの読み込み (Noto Serif JP & Oswald)
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;500;700&family=Oswald:wght@300;500&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fetch('/api/gas').then(res => res.json()).then(d => { if(d.status === 'success') setData(d); });
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/gas', {
      method: 'POST', body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value })
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

  const FAQ_ITEMS = [
    { q: "インボイス制度への対応について", a: "適格請求書発行事業者として登録済みです。法人のお客様も安心してご利用いただけます。" },
    { q: "被覆付き電線の買取について", a: "独自のナゲットプラントを保有しており、被覆のまま高価買取が可能です。剥離作業は不要です。" },
    { q: "お支払いサイトについて", a: "検収完了後、即時現金払いとなります。法人様の掛け売り（請求書払い）もご相談ください。" }
  ];

  // ----------------------------------------------------------------
  // 1. LP VIEW (Sophisticated Design)
  // ----------------------------------------------------------------
  if (view === 'LP' || view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-[#F9F9F9] text-[#111] font-sans selection:bg-red-900 selection:text-white">
        
        {/* Navigation - Minimal & Translucent */}
        <header className="fixed top-0 w-full z-50 mix-blend-difference text-white transition-all duration-500">
          <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-end">
            <div className="cursor-pointer" onClick={()=>setView('LP')}>
              <h1 className="text-xs font-bold tracking-[0.3em] uppercase opacity-70 mb-1">Tsukisamu Mfg.</h1>
              <p className="text-xl font-serif font-bold tracking-widest leading-none">月寒製作所</p>
            </div>
            <div className="flex items-center gap-8">
              <nav className="hidden md:flex gap-8 text-[11px] font-medium tracking-[0.2em] uppercase">
                {['About', 'Service', 'Price', 'Access'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} className="relative group overflow-hidden">
                    <span className="block translate-y-0 group-hover:-translate-y-full transition-transform duration-300">{item}</span>
                    <span className="absolute top-0 left-0 block translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-red-500">{item}</span>
                  </a>
                ))}
              </nav>
              <button onClick={() => setView('LOGIN')} className="text-[10px] border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest">
                Partner Login
              </button>
            </div>
          </div>
        </header>

        {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-[#111] w-full max-w-sm p-12 border border-white/10 relative">
              <button onClick={() => setView('LP')} className="absolute top-6 right-6 text-gray-500 hover:text-white transition">✕</button>
              <h2 className="text-xl font-serif text-white mb-8 tracking-widest text-center">関係者ログイン</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="group relative">
                  <input name="loginId" className="w-full bg-transparent border-b border-gray-700 py-3 text-white outline-none focus:border-red-600 transition-colors font-mono text-sm" placeholder=" " required />
                  <label className="absolute left-0 top-3 text-gray-500 text-xs transition-all pointer-events-none group-focus-within:-top-4 group-focus-within:text-[10px] group-focus-within:text-red-500">ID</label>
                </div>
                <div className="group relative">
                  <input name="password" type="password" className="w-full bg-transparent border-b border-gray-700 py-3 text-white outline-none focus:border-red-600 transition-colors font-mono text-sm" placeholder=" " required />
                  <label className="absolute left-0 top-3 text-gray-500 text-xs transition-all pointer-events-none group-focus-within:-top-4 group-focus-within:text-[10px] group-focus-within:text-red-500">PASSWORD</label>
                </div>
                <button className="w-full bg-white text-black py-4 text-xs font-bold tracking-widest hover:bg-red-600 hover:text-white transition-colors duration-300">ENTER SYSTEM</button>
              </form>
            </div>
          </div>
        )}

        {/* HERO SECTION - Deep & Intellectual */}
        <section className="relative h-screen min-h-[800px] flex items-center bg-[#0a0a0a] text-white overflow-hidden">
          {/* Background Image with Parallax-like fix */}
          <div className="absolute inset-0 z-0">
             <img src={IMAGES.hero} className="w-full h-full object-cover opacity-40 grayscale" alt="Factory" />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-end pb-24">
            {/* Typography */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <p className="text-red-600 font-bold text-xs tracking-[0.4em] uppercase animate-in fade-in slide-in-from-bottom-4 duration-700">Since 1961 / Hokkaido</p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight tracking-tight">
                  <span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">資源を、</span>
                  <span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">あるべき<span className="text-red-600">価値</span>へ。</span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm leading-loose max-w-md font-light tracking-wide animate-in fade-in duration-1000 delay-500">
                創業60余年。月寒製作所は「目利き」と「技術」で、<br/>
                日本のリサイクルインフラを支え続けます。<br/>
                独自のナゲットプラントによる中間コストの排除。<br/>
                それが、高価買取の根拠です。
              </p>
              
              <div className="pt-8 flex gap-8 items-center animate-in fade-in duration-1000 delay-700">
                 <a href="#simulator" className="group flex items-center gap-4 text-sm font-bold tracking-widest hover:text-red-500 transition-colors">
                   <span className="w-12 h-[1px] bg-white group-hover:bg-red-500 transition-colors"></span>
                   ESTIMATE
                 </a>
                 <a href="#service" className="group flex items-center gap-4 text-sm font-bold tracking-widest hover:text-red-500 transition-colors">
                   <span className="w-12 h-[1px] bg-white group-hover:bg-red-500 transition-colors"></span>
                   SERVICE
                 </a>
              </div>
            </div>

            {/* Market Data - Glassmorphism Minimal */}
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-10">
                <RealChart data={data?.history} />
                <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-8">
                   <div>
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                     <p className="text-xs font-medium tracking-wider flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span> Accepting
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1">Location</p>
                     <p className="text-xs font-medium tracking-wider">Tomakomai Plant</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONCEPT / ABOUT - Minimal Layout */}
        <section id="about" className="py-32 px-6 bg-[#F9F9F9]">
          <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center">
             <div className="order-2 md:order-1 relative">
                <div className="aspect-[4/5] bg-gray-200 overflow-hidden">
                   <img src={IMAGES.nugget} alt="Copper Nugget" className="w-full h-full object-cover hover:scale-105 transition duration-[1.5s]" />
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#111] text-white p-6 flex flex-col justify-between">
                   <span className="text-3xl font-serif">99.9<small className="text-sm">%</small></span>
                   <span className="text-[10px] tracking-widest uppercase">Purity of<br/>Copper</span>
                </div>
             </div>
             <div className="order-1 md:order-2 space-y-12">
                <div className="flex flex-col gap-2">
                  <span className="text-red-600 text-xs font-bold tracking-[0.3em] uppercase">Why Choose Us</span>
                  <h2 className="text-4xl md:text-5xl font-serif font-medium leading-snug">
                    中間マージンを排除する、<br/>
                    <span className="border-b border-red-600 pb-1">一貫処理</span>の強み。
                  </h2>
                </div>
                <div className="space-y-8">
                  {[
                    { t: "60年の歴史と信用", d: "1961年の創業以来、北海道の地で積み重ねた実績。正確無比な計量と査定をお約束します。" },
                    { t: "自社ナゲットプラント", d: "被覆線を自社工場で粉砕・選別。商社を挟まず製錬所へ直納するため、買取価格に還元できます。" },
                    { t: "透明な価格基準", d: "LME（ロンドン金属取引所）の銅相場に完全連動。不透明な「言い値」での取引は一切行いません。" },
                  ].map((item, i) => (
                    <div key={i} className="border-t border-gray-300 pt-6">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="text-lg font-serif font-bold">{item.t}</h3>
                        <span className="text-xs font-mono text-gray-400">0{i+1}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-loose text-justify">{item.d}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* SERVICE PLANS - "Magazine" Layout */}
        <section id="service" className="py-32 px-6 bg-[#111] text-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/20 pb-8">
               <div>
                 <span className="text-red-500 text-xs font-bold tracking-[0.3em] uppercase block mb-4">Our Service</span>
                 <h2 className="text-4xl font-serif">買取プラン</h2>
               </div>
               <p className="text-sm text-gray-400 mt-4 md:mt-0 font-light tracking-wide">規模やニーズに合わせた3つの取引形態</p>
            </div>

            <div className="grid md:grid-cols-3 gap-0 border-l border-white/20">
              {/* Plan 1 */}
              <div className="group border-r border-b md:border-b-0 border-white/20 p-10 hover:bg-white/5 transition duration-500 relative">
                 <span className="text-xs font-mono text-gray-500 mb-8 block">01 / DROP-OFF</span>
                 <h3 className="text-2xl font-serif mb-4 group-hover:text-red-500 transition-colors">お持ち込み</h3>
                 <p className="text-gray-400 text-sm leading-relaxed mb-8 h-20">
                   100kg以上の小ロットから対応。<br/>
                   検収後、その場で現金にてお支払いいたします。<br/>
                   <span className="text-xs opacity-60 mt-2 block">※1t以上は銀行振込</span>
                 </p>
                 <div className="aspect-video bg-gray-800 mb-6 grayscale group-hover:grayscale-0 transition duration-700 overflow-hidden">
                   <img src={IMAGES.weight} className="w-full h-full object-cover" alt="weight" />
                 </div>
                 <div className="flex items-center text-xs tracking-widest font-bold">
                   VIEW DETAIL <Icons.ArrowRight />
                 </div>
              </div>

              {/* Plan 2 */}
              <div className="group border-r border-b md:border-b-0 border-white/20 p-10 hover:bg-white/5 transition duration-500 relative">
                 <span className="text-xs font-mono text-gray-500 mb-8 block">02 / PICK-UP</span>
                 <h3 className="text-2xl font-serif mb-4 group-hover:text-red-500 transition-colors">出張買取</h3>
                 <p className="text-gray-400 text-sm leading-relaxed mb-8 h-20">
                   1t〜2tの中規模ロット向け。<br/>
                   北海道全域、弊社トラックにて無料でお伺いします。<br/>
                   <span className="text-xs opacity-60 mt-2 block">※要事前予約</span>
                 </p>
                 <div className="aspect-video bg-gray-800 mb-6 grayscale group-hover:grayscale-0 transition duration-700 overflow-hidden">
                   <img src={IMAGES.hero} className="w-full h-full object-cover" alt="truck" />
                 </div>
                 <div className="flex items-center text-xs tracking-widest font-bold">
                   VIEW DETAIL <Icons.ArrowRight />
                 </div>
              </div>

              {/* Plan 3 */}
              <div className="group border-r border-white/20 p-10 hover:bg-white/5 transition duration-500 relative">
                 <span className="text-xs font-mono text-gray-500 mb-8 block">03 / BUSINESS</span>
                 <h3 className="text-2xl font-serif mb-4 group-hover:text-red-500 transition-colors">大規模買取</h3>
                 <p className="text-gray-400 text-sm leading-relaxed mb-8 h-20">
                   5t以上の大口取引。<br/>
                   道外対応・運送費弊社負担。<br/>
                   専任担当者が最適な条件をご提案します。
                 </p>
                 <div className="aspect-video bg-gray-800 mb-6 grayscale group-hover:grayscale-0 transition duration-700 overflow-hidden">
                   <img src={IMAGES.factory} className="w-full h-full object-cover" alt="business" />
                 </div>
                 <div className="flex items-center text-xs tracking-widest font-bold">
                   CONTACT US <Icons.ArrowRight />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULATOR - Clean UI */}
        <section id="simulator" className="py-32 px-6 bg-[#F5F5F7]">
          <div className="max-w-[1000px] mx-auto">
             <div className="text-center mb-16">
                <span className="text-red-600 text-xs font-bold tracking-[0.3em] uppercase block mb-4">Estimation</span>
                <h2 className="text-4xl font-serif mb-6">買取シミュレーション</h2>
                <div className="inline-block bg-white px-6 py-2 rounded-full border border-gray-200 text-xs tracking-widest shadow-sm">
                   <span className="w-2 h-2 bg-red-500 rounded-full inline-block mr-2 animate-pulse"></span>
                   現在の基準価格: <span className="font-bold text-base ml-1">¥{Number(marketPrice).toLocaleString()}</span> / kg
                </div>
             </div>

             <div className="bg-white p-12 shadow-2xl shadow-gray-200/50">
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Wire Type</label>
                        <select className="w-full bg-transparent border-b border-gray-300 py-3 text-lg font-serif focus:border-red-600 focus:outline-none transition-colors cursor-pointer" value={simType} onChange={(e)=>setSimType(e.target.value)}>
                          <option value="">線種を選択</option>
                          <option value="pika">特1号銅線 (ピカ線)</option>
                          <option value="high">高銅率線 (80%~)</option>
                          <option value="medium">中銅率線 (60%~)</option>
                          <option value="low">低銅率線 (40%~)</option>
                          <option value="mixed">雑線・ミックス</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Weight (kg)</label>
                        <input type="number" className="w-full bg-transparent border-b border-gray-300 py-3 text-lg font-mono focus:border-red-600 focus:outline-none transition-colors" placeholder="0" value={simWeight} onChange={(e)=>setSimWeight(e.target.value)} />
                      </div>
                      <button onClick={calculateSim} className="w-full bg-[#111] text-white py-5 text-xs font-bold tracking-[0.2em] hover:bg-red-600 transition-colors duration-300">
                        CALCULATE
                      </button>
                   </div>
                   
                   <div className="bg-[#F9F9F9] p-8 flex flex-col justify-center items-center text-center border border-gray-100 relative overflow-hidden">
                      {simResult ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
                           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">{simResult.label} / {simResult.weight}kg</p>
                           <p className="text-5xl md:text-6xl font-serif text-[#111] mb-2 tracking-tighter">¥{simResult.total.toLocaleString()}</p>
                           <p className="text-[10px] text-gray-400">参考単価: ¥{simResult.unit.toLocaleString()}/kg</p>
                        </div>
                      ) : (
                         <div className="text-gray-300 text-sm font-serif">
                           条件を入力して<br/>査定額を確認してください
                         </div>
                      )}
                      {/* Decoration */}
                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-200 rounded-full opacity-50 z-0"></div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* WIRE TYPES - Minimal Catalog */}
        <section id="price" className="py-32 px-6 bg-white">
          <div className="max-w-[1200px] mx-auto">
             <div className="mb-20 flex items-end justify-between border-b border-gray-200 pb-6">
               <h2 className="text-3xl font-serif">取扱品目</h2>
               <div className="flex gap-4">
                  {['pika', 'cv', 'iv', 'mixed'].map(t => (
                    <button key={t} onClick={()=>setActiveTab(t)} className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 transition-colors ${activeTab===t ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:text-black'}`}>
                      {t}
                    </button>
                  ))}
               </div>
             </div>
             
             <div className="grid md:grid-cols-2 gap-16 items-center animate-in fade-in duration-500" key={activeTab}>
               <div className="h-[400px] bg-gray-100 overflow-hidden relative group">
                 <img src={IMAGES[activeTab as keyof typeof IMAGES]} alt={activeTab} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 border-[12px] border-white pointer-events-none"></div>
               </div>
               <div className="space-y-8">
                 <h3 className="text-3xl font-serif font-medium">
                   {activeTab === 'pika' && '特1号銅線 (ピカ線)'}
                   {activeTab === 'cv' && 'CV・CVTケーブル'}
                   {activeTab === 'iv' && 'IV線'}
                   {activeTab === 'mixed' && '雑線・ミックス'}
                 </h3>
                 <p className="text-sm text-gray-600 leading-loose">
                   {activeTab === 'pika' && '被覆を完全に除去した、直径1.3mm以上の純銅線。酸化やメッキがなく、光沢がある状態のものが最高値での買取対象となります。'}
                   {activeTab === 'cv' && '工場やビルの電力供給用として使用される架橋ポリエチレン絶縁ビニルシースケーブル。銅率が高く、太いものが多いため高価買取が可能です。'}
                   {activeTab === 'iv' && '屋内配線用として最も一般的に使用されるビニル絶縁電線。単線・撚り線問わず買取可能です。'}
                   {activeTab === 'mixed' && '様々な種類の電線が混ざった状態や、家電コード、通信線などもまとめて引き受けます。選別不要でお持ち込みいただけます。'}
                 </p>
                 <div className="inline-block border-l-2 border-red-600 pl-6 py-2">
                   <span className="text-xs text-gray-400 block mb-1 tracking-widest uppercase">Target Price</span>
                   <span className="text-xl font-serif font-bold">
                     {activeTab === 'pika' ? '最高値基準' : activeTab === 'mixed' ? '銅率により変動' : '高価買取対象'}
                   </span>
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* INFO / ACCESS - Grid Layout */}
        <section id="access" className="border-t border-gray-200">
           <div className="grid md:grid-cols-2">
              <div className="bg-[#111] text-white p-16 md:p-24 flex flex-col justify-center">
                 <h2 className="text-2xl font-serif mb-12">会社概要</h2>
                 <div className="space-y-8 text-sm font-light tracking-wide text-gray-400">
                    <div className="flex gap-8 border-b border-white/10 pb-4">
                       <span className="w-24 shrink-0 font-bold text-white">社名</span>
                       <span>株式会社月寒製作所 苫小牧工場</span>
                    </div>
                    <div className="flex gap-8 border-b border-white/10 pb-4">
                       <span className="w-24 shrink-0 font-bold text-white">所在地</span>
                       <span>〒053-0001 北海道苫小牧市一本松町9-6</span>
                    </div>
                    <div className="flex gap-8 border-b border-white/10 pb-4">
                       <span className="w-24 shrink-0 font-bold text-white">許可証</span>
                       <span>北海道知事許可（般-18）石第00857号<br/>産廃処分業許可 第00120077601号</span>
                    </div>
                    <div className="pt-8">
                       <p className="text-2xl font-mono text-white mb-2">0144-55-5544</p>
                       <p className="text-xs">平日 8:00 - 17:00 / 定休日: 土日祝</p>
                    </div>
                 </div>
              </div>
              <div className="h-[500px] md:h-auto bg-gray-200 grayscale relative group hover:grayscale-0 transition duration-700">
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.339790216788!2d141.6738927766324!3d42.69780077116297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f7566f07a092899%3A0x89e8360098f98072!2z44CSMDUzLTAwMDEg5YyX5rW36YGT6IuL5bCP54mn5biC5LiA5pys5p2-55S677yZ4oiS77yW!5e0!3m2!1sja!2sjp!4v1707727000000!5m2!1sja!2sjp" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
                 <div className="absolute inset-0 bg-black/10 pointer-events-none group-hover:bg-transparent transition"></div>
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white py-12 px-6 border-t border-gray-200">
           <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                 <p className="text-xs font-bold tracking-widest uppercase mb-1">Tsukisamu Manufacturing Co., Ltd.</p>
                 <p className="text-[10px] text-gray-400">Tomakomai Factory</p>
              </div>
              <p className="text-[10px] text-gray-300 tracking-widest">© 2026 TSUKISAMU. ALL RIGHTS RESERVED.</p>
           </div>
        </footer>
      </div>
    );
  }

  return null;
}
