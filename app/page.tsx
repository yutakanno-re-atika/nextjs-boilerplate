"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 画像パス定義 (現実の拡張子に完全準拠)
// ==========================================
const IMAGES = {
  hero: "/images/factory_floor.png",      // PNG
  pika: "/images/pika_wire.png",          // PNG
  cv: "/images/cv_cable.png",             // PNG
  iv: "/images/iv_cable.png",             // PNG
  vvf: "/images/vvf_cable.png",           // PNG
  mixed: "/images/mixed_wire.png",        // PNG
  cabtire: "/images/cabtire_cable.png",   // PNG
  weight: "/images/weighing_station.jpg", // JPG (ここ重要)
  nugget: "/images/copper_nugget.png",    // PNG
  
  // ★追加: 工場外観 (なければ hero と同じでもOK)
  factory: "/images/factory_floor.png"    
};

// ==========================================
// アイコン類 (Minimalist)
// ==========================================
const Icons = {
  ArrowRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>,
  ArrowUp: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
};

// ==========================================
// リアルタイムチャート (Hero Red Ver.)
// ==========================================
const RealChart = ({ data }: {data: any[]}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  if (!data || data.length < 2) return <div className="h-40 flex items-center justify-center text-xs tracking-widest text-white/50">LOADING MARKET DATA...</div>;

  const maxVal = Math.max(...data.map((d: any) => d.value));
  const minVal = Math.min(...data.map((d: any) => d.value));
  const range = maxVal - minVal || 100;
  const yMax = maxVal + range * 0.2;
  const yMin = minVal - range * 0.2;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => `${getX(i)},${100 - ((d.value - yMin) / (yMax - yMin)) * 100}`).join(' ');

  const displayDate = activePoint ? activePoint.date : data[data.length - 1].date;
  const displayValue = activePoint ? activePoint.value : data[data.length - 1].value;

  const formatDate = (d: string) => {
    if(!d) return '';
    const parts = d.split('/');
    if(parts.length < 2) return d;
    return `${parts.length===2 ? new Date().getFullYear() : parts[0]}.${parts[parts.length-2].padStart(2,'0')}.${parts[parts.length-1].padStart(2,'0')}`;
  }

  return (
    <div className="w-full" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-6 border-b border-white/30 pb-4">
        <div>
          <p className="text-[10px] font-medium text-white/70 tracking-[0.2em] mb-1">MARKET PRICE / {formatDate(displayDate)}</p>
          <p className="text-5xl font-serif text-white tracking-tight drop-shadow-md">
            <span className="text-2xl mr-1">¥</span>{displayValue.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
           <div className="text-white text-[10px] font-bold flex items-center justify-end gap-2 uppercase tracking-widest"><Icons.ArrowUp /> Rising</div>
           <p className="text-[10px] text-white/70 mt-1 font-serif">LME Copper</p>
        </div>
      </div>
      <div className="h-40 w-full relative overflow-visible">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* 純白のラインで清潔感を */}
          <path d={`M ${points}`} fill="none" stroke="#FFFFFF" strokeWidth="2" vectorEffect="non-scaling-stroke" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
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
  
  // シミュレーター
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  useEffect(() => {
    // 縦書き対応のため明朝体ロード
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;500;700;900&family=Oswald:wght@300;500&display=swap";
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

  // ----------------------------------------------------------------
  // 1. LP VIEW (Red & White Modern)
  // ----------------------------------------------------------------
  if (view === 'LP' || view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans selection:bg-[#D32F2F] selection:text-white">
        
        {/* Navigation */}
        <header className="fixed top-0 w-full z-50 transition-all duration-500 bg-gradient-to-b from-black/20 to-transparent">
          <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-between items-start">
            <div className="cursor-pointer text-white" onClick={()=>setView('LP')}>
              <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-80 mb-1">Tsukisamu Mfg.</h1>
              <p className="text-xl font-serif font-bold tracking-widest leading-none">月寒製作所</p>
            </div>
            <button onClick={() => setView('LOGIN')} className="bg-white/10 backdrop-blur border border-white/30 text-white text-[10px] px-6 py-2 rounded-full hover:bg-white hover:text-[#D32F2F] transition-all duration-300 uppercase tracking-widest font-bold">
              Login
            </button>
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

        {/* HERO SECTION - "Passion & Tradition" (Red Gradient) */}
        <section className="relative h-screen min-h-[800px] flex items-center bg-[#D32F2F] text-white overflow-hidden">
          {/* Background: Red Gradient + Texture */}
          <div className="absolute inset-0 z-0">
             <img src={IMAGES.hero} className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale" alt="Factory" />
             <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#E53935] opacity-90"></div>
             {/* 和モダンな装飾（円） */}
             <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] border-[1px] border-white/10 rounded-full opacity-50"></div>
             <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] border-[1px] border-white/10 rounded-full opacity-50"></div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
            {/* Typography */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6 relative">
                {/* 縦書きのアクセント (Sumiyoshi Style) */}
                <div className="hidden lg:block absolute -left-24 top-0 h-full w-10 border-r border-white/30">
                  <span className="block text-xs font-serif tracking-[0.5em] opacity-80" style={{writingMode: 'vertical-rl'}}>創業昭和三十六年</span>
                </div>

                <div className="inline-block bg-white text-[#D32F2F] px-4 py-1 text-xs font-bold tracking-widest mb-4">SINCE 1961</div>
                <h1 className="text-6xl md:text-8xl font-serif font-medium leading-tight tracking-tight drop-shadow-sm">
                  <span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">資源を、</span>
                  <span className="block animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">あるべき<span className="border-b-4 border-white/80 pb-2">価値</span>へ。</span>
                </h1>
              </div>
              <p className="text-white/90 text-sm md:text-base leading-loose max-w-lg font-medium tracking-wide animate-in fade-in duration-1000 delay-500 border-l-2 border-white/30 pl-6">
                月寒製作所は「目利き」と「技術」で、日本のリサイクルインフラを支え続けます。
                独自のナゲットプラントによる中間コストの排除。それが、高価買取の根拠です。
              </p>
              
              <div className="pt-8 flex gap-6 animate-in fade-in duration-1000 delay-700">
                 <a href="#simulator" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#111] hover:text-white transition-all shadow-xl">
                   査定シミュレーション
                 </a>
              </div>
            </div>

            {/* Market Data */}
            <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                <RealChart data={data?.history} />
                <div className="mt-8 pt-6 border-t border-white/20 flex justify-between items-center">
                   <div>
                     <p className="text-[9px] text-white/70 uppercase tracking-widest mb-1">Factory Status</p>
                     <p className="text-xs font-medium tracking-wider flex items-center gap-2 text-white">
                       <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></span> Accepting
                     </p>
                   </div>
                   <div className="text-right">
                     <p className="text-xs font-serif italic text-white/80">Tomakomai, Hokkaido</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONCEPT - Vertical Text & White Space */}
        <section id="about" className="py-32 px-6 bg-white relative">
          {/* 縦書きタイトル (背景あしらい) */}
          <div className="absolute right-6 top-32 text-[#f0f0f0] text-9xl font-serif font-bold opacity-50 select-none z-0" style={{writingMode: 'vertical-rl'}}>
            一貫処理
          </div>

          <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
             <div className="order-2 md:order-1 relative">
                <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
                   <img src={IMAGES.nugget} alt="Copper Nugget" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-[1.5s]" />
                   {/* 赤いアクセントライン */}
                   <div className="absolute top-0 left-0 w-2 h-full bg-[#D32F2F]"></div>
                </div>
             </div>
             <div className="order-1 md:order-2 space-y-12">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="h-[1px] w-12 bg-[#D32F2F]"></span>
                    <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase">Why Choose Us</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-medium leading-snug text-[#111]">
                    中間マージンを排除する、<br/>
                    <span className="bg-red-50 px-2">自社一貫体制</span>の強み。
                  </h2>
                </div>
                <div className="space-y-10">
                  {[
                    { t: "六十年の歴史と信用", d: "1961年の創業以来、北海道の地で積み重ねた実績。正確無比な計量と査定をお約束します。" },
                    { t: "自社ナゲットプラント", d: "被覆線を自社工場で粉砕・選別。商社を挟まず製錬所へ直納するため、高価買取価格として還元できます。" },
                    { t: "透明な価格基準", d: "LME（ロンドン金属取引所）の銅相場に完全連動。不透明な「言い値」での取引は一切行いません。" },
                  ].map((item, i) => (
                    <div key={i} className="group">
                      <h3 className="text-xl font-serif font-bold mb-3 flex items-center gap-3">
                        <span className="font-mono text-[#D32F2F] opacity-50 text-sm">0{i+1}</span>
                        {item.t}
                      </h3>
                      <p className="text-sm text-gray-600 leading-loose text-justify pl-8 border-l border-gray-200 group-hover:border-[#D32F2F] transition-colors duration-300">{item.d}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* SERVICE PLANS - Light & Energetic */}
        <section id="service" className="py-32 px-6 bg-[#F9F9F9]">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
               <div className="border-l-4 border-[#D32F2F] pl-6">
                 <span className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase block mb-2">Our Service</span>
                 <h2 className="text-4xl font-serif font-bold">買取プラン</h2>
               </div>
               <p className="text-sm text-gray-500 mt-4 md:mt-0 font-medium">ニーズに合わせた3つの取引形態</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Plan 1: Drop-off */}
              <div className="bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group border-t-4 border-transparent hover:border-[#D32F2F] relative overflow-hidden">
                 <div className="absolute top-4 right-4 text-gray-100 text-6xl font-black font-serif z-0 group-hover:text-red-50 transition-colors">01</div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-serif font-bold mb-4">お持ち込み</h3>
                   <div className="w-12 h-[2px] bg-gray-200 group-hover:bg-[#D32F2F] transition-colors mb-6"></div>
                   <p className="text-gray-500 text-sm leading-relaxed mb-8 h-16">
                     100kg以上の小ロットから対応。<br/>
                     検収後、その場で現金にてお支払い。<br/>
                     <span className="text-xs text-gray-400 mt-1 block">※1t以上は銀行振込</span>
                   </p>
                   <div className="aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                     <img src={IMAGES.weight} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 transform group-hover:scale-110" alt="weight" />
                   </div>
                   <div className="flex items-center text-xs tracking-widest font-bold group-hover:text-[#D32F2F] transition-colors">
                     VIEW DETAIL <span className="ml-2">→</span>
                   </div>
                 </div>
              </div>

              {/* Plan 2: Pick-up (Featured) */}
              <div className="bg-[#111] text-white p-10 shadow-2xl hover:shadow-2xl transition-all duration-500 group border-t-4 border-[#D32F2F] relative transform md:-translate-y-4">
                 <div className="absolute top-4 right-4 text-white/10 text-6xl font-black font-serif z-0">02</div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-serif font-bold mb-4">出張買取</h3>
                   <div className="w-12 h-[2px] bg-[#D32F2F] mb-6"></div>
                   <p className="text-gray-400 text-sm leading-relaxed mb-8 h-16">
                     1t〜2tの中規模ロット向け。<br/>
                     北海道全域、弊社トラックにて無料引取。<br/>
                     <span className="text-xs text-gray-500 mt-1 block">※要事前予約</span>
                   </p>
                   <div className="aspect-[4/3] bg-gray-800 mb-6 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[#D32F2F] mix-blend-overlay opacity-0 group-hover:opacity-40 transition duration-500 z-10"></div>
                     <img src={IMAGES.hero} className="w-full h-full object-cover grayscale transition duration-700 transform group-hover:scale-110" alt="truck" />
                   </div>
                   <div className="flex items-center text-xs tracking-widest font-bold text-[#D32F2F]">
                     VIEW DETAIL <span className="ml-2">→</span>
                   </div>
                 </div>
              </div>

              {/* Plan 3: Business */}
              <div className="bg-white p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group border-t-4 border-transparent hover:border-[#D32F2F] relative overflow-hidden">
                 <div className="absolute top-4 right-4 text-gray-100 text-6xl font-black font-serif z-0 group-hover:text-red-50 transition-colors">03</div>
                 <div className="relative z-10">
                   <h3 className="text-2xl font-serif font-bold mb-4">大規模買取</h3>
                   <div className="w-12 h-[2px] bg-gray-200 group-hover:bg-[#D32F2F] transition-colors mb-6"></div>
                   <p className="text-gray-500 text-sm leading-relaxed mb-8 h-16">
                     5t以上の大口取引。<br/>
                     道外対応・運送費弊社負担。<br/>
                     専任担当者が最適な条件をご提案。
                   </p>
                   <div className="aspect-[4/3] bg-gray-100 mb-6 overflow-hidden">
                     <img src={IMAGES.factory} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700 transform group-hover:scale-110" alt="business" />
                   </div>
                   <div className="flex items-center text-xs tracking-widest font-bold group-hover:text-[#D32F2F] transition-colors">
                     CONTACT US <span className="ml-2">→</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULATOR - Functional Beauty */}
        <section id="simulator" className="py-32 px-6 bg-white relative">
          <div className="max-w-[900px] mx-auto relative z-10">
             <div className="text-center mb-12">
                <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Estimation</span>
                <h2 className="text-4xl font-serif font-medium">買取シミュレーション</h2>
             </div>

             <div className="bg-[#F5F5F7] p-8 md:p-16 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                   <div className="flex-1 w-full space-y-8">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Wire Type</label>
                        <select className="w-full bg-white border border-gray-200 py-3 px-4 font-serif focus:border-[#D32F2F] focus:outline-none transition-colors cursor-pointer" value={simType} onChange={(e)=>setSimType(e.target.value)}>
                          <option value="">線種を選択</option>
                          <option value="pika">特1号銅線 (ピカ線)</option>
                          <option value="high">高銅率線 (80%~)</option>
                          <option value="medium">中銅率線 (60%~)</option>
                          <option value="low">低銅率線 (40%~)</option>
                          <option value="mixed">雑線・ミックス</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Weight (kg)</label>
                        <input type="number" className="w-full bg-white border border-gray-200 py-3 px-4 font-mono focus:border-[#D32F2F] focus:outline-none transition-colors" placeholder="0" value={simWeight} onChange={(e)=>setSimWeight(e.target.value)} />
                      </div>
                      <button onClick={calculateSim} className="w-full bg-[#D32F2F] text-white py-4 text-xs font-bold tracking-[0.2em] hover:bg-[#B71C1C] transition-colors duration-300 shadow-lg">
                        計算する
                      </button>
                   </div>
                   
                   <div className="w-full md:w-80 bg-white p-8 border border-gray-200 text-center shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 group-hover:bg-[#D32F2F] transition-colors"></div>
                      {simResult ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">{simResult.label} / {simResult.weight}kg</p>
                           <p className="text-5xl font-serif text-[#111] mb-2 tracking-tighter">¥{simResult.total.toLocaleString()}</p>
                           <p className="text-[10px] text-gray-400">参考単価: ¥{simResult.unit.toLocaleString()}/kg</p>
                        </div>
                      ) : (
                         <div className="py-8 text-gray-400 text-sm font-serif">
                           条件を入力して<br/>査定額を確認してください
                         </div>
                      )}
                   </div>
                </div>
                <div className="mt-8 text-center">
                   <div className="inline-flex items-center gap-2 text-xs font-mono text-gray-500">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Current Market Price: ¥{Number(marketPrice).toLocaleString()} / kg
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* ACCESS - Split Layout */}
        <section id="access" className="border-t border-gray-200">
           <div className="grid md:grid-cols-2">
              <div className="bg-[#1a1a1a] text-white p-16 md:p-24 flex flex-col justify-center">
                 <h2 className="text-2xl font-serif mb-12 flex items-center gap-4">
                   <span className="w-8 h-[1px] bg-[#D32F2F]"></span> 会社概要
                 </h2>
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
                       <p className="text-3xl font-serif text-white mb-2">0144-55-5544</p>
                       <p className="text-xs tracking-widest">平日 8:00 - 17:00 / 定休日: 土日祝</p>
                    </div>
                 </div>
              </div>
              <div className="h-[400px] md:h-auto bg-gray-300 relative group grayscale hover:grayscale-0 transition duration-700">
                 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.339790216788!2d141.6738927766324!3d42.69780077116297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f7566f07a092899%3A0x89e8360098f98072!2z44CSMDUzLTAwMDEg5YyX5rW36YGT6IuL5bCP54mn5biC5LiA5pys5p2-55S677yZ4oiS77yW!5e0!3m2!1sja!2sjp!4v1707727000000!5m2!1sja!2sjp" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
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
