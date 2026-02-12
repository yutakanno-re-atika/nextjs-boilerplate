"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 資産再利用: 初期データ & Fallback
// ==========================================
const REAL_HISTORY_2026 = [
  { date: '1/4', value: 2050 }, { date: '1/13', value: 2190 },
  { date: '1/30', value: 2180 }, { date: '2/6', value: 2100 },
  { date: '2/12', value: 2140 }
];

const FAQ_ITEMS = [
  { q: "インボイス制度には対応していますか？", a: "はい、完全対応しております。適格請求書発行事業者として登録済みですので、法人のお客様も安心してご利用いただけます。" },
  { q: "被覆付きの電線でもそのまま持ち込めますか？", a: "もちろんです！当社は独自のナゲットプラントを保有しており、被覆銅線から純度99.9%の銅を回収する技術を持っています。" },
  { q: "基板や電子部品も買取可能ですか？", a: "はい。E-Scrapも高度な選別技術により金・銀・パラジウムなどの希少金属として評価・買取いたします。" },
  { q: "支払いはいつになりますか？", a: "検収完了後、その場で現金にてお支払いいたします。法人様で掛け売りをご希望の場合はご相談ください。" }
];

const RANKS = [
  { id: 'GUEST', name: '一般 (未登録)', bonus: 0, color: 'text-gray-500', bg: 'bg-white/5', icon: '👤' },
  { id: 'MEMBER', name: 'レギュラー', bonus: 20, color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: '💎' },
  { id: 'VIP', name: 'プラチナ', bonus: 50, color: 'text-red-500', bg: 'bg-red-500/10', icon: '👑' },
];

// ==========================================
// 資産再利用: SVG Icons
// ==========================================
const IconChart = () => <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconArrowUp = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const IconCalculator = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" /><line x1="8" y1="6" x2="16" y2="6" strokeWidth="2" /><path d="M16 14v4M12 14v4M8 14v4" strokeWidth="2" /></svg>;
const IconChevronDown = ({className}: {className?: string}) => <svg className={className} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="2" /></svg>;
const IconCheck = () => <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="2" /></svg>;

// ==========================================
// 修正版: RealChart (日付フォーマット強化 & 大文字化)
// ==========================================
const RealChart = ({ data, color = "#ef4444" }: {data: any[], color?: string}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  if (!data || data.length < 2) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-700 bg-black/20 rounded-3xl border border-white/5 space-y-3">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em]">Synchronizing...</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d: any) => d.value));
  const minVal = Math.min(...data.map((d: any) => d.value));
  const range = maxVal - minVal || 100;
  const yMax = maxVal + range * 0.2;
  const yMin = minVal - range * 0.2;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => `${getX(i)},${100 - ((d.value - yMin) / (yMax - yMin)) * 100}`).join(' ');

  // 日付フォーマット関数: "2/10" -> "2026/02/10"
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'NOW' || dateStr === 'No Data') return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 2) {
      const m = parts[0].padStart(2, '0');
      const d = parts[1].padStart(2, '0');
      return `2026/${m}/${d}`;
    }
    return dateStr;
  };

  // 表示する日付（ホバー中ならその日付、そうでなければ最新の日付）
  const displayDate = activePoint ? activePoint.date : data[data.length - 1].date;
  const displayValue = activePoint ? activePoint.value : data[data.length - 1].value;

  return (
    <div className="w-full" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-6 animate-in fade-in duration-500">
        <div>
          {/* 変更点: 日付を大きく、見やすく表示 */}
          <p className="text-xl font-bold text-gray-400 font-mono tracking-wider mb-1">
            {formatDate(displayDate)}
          </p>
          <p className="text-5xl font-mono font-black text-white italic tracking-tighter leading-none">
            ¥{displayValue.toLocaleString()}
            <small className="text-lg ml-2 text-gray-500 font-normal not-italic">/kg</small>
          </p>
        </div>
        <div className="text-right">
           <div className="text-green-500 font-black text-xs flex items-center gap-1 justify-end animate-pulse"><IconArrowUp /> LME SYNC</div>
           <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mt-1">Daily High</p>
        </div>
      </div>
      <div className="h-48 w-full relative border-b border-white/5 rounded-b-xl overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={`M ${points} L 100,100 L 0,100 Z`} fill="url(#chartGrad)" />
          <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {data.map((d: any, i: number) => (
            <rect key={i} x={getX(i)-2} y="0" width="4" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default function WireMasterPortal() {
  const [view, setView] = useState<'LP' | 'CLIENT_LOGIN' | 'ADMIN_LOGIN' | 'MEMBER' | 'ADMIN'>('LP');
  // 初期値に2026年の歴史的データをセット
  const [data, setData] = useState<any>({ history: REAL_HISTORY_2026, config: { market_price: 2140 } });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [calcValue, setCalcValue] = useState('0');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { if(d.status === 'success') setData(d); })
      .catch(err => console.error("Data Sync Failed", err));
  }, []);

  const handleAuth = async (e: any, target: 'ADMIN' | 'MEMBER') => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/gas', {
      method: 'POST',
      body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value })
    });
    const result = await res.json();
    if (result.status === 'success') {
      if (target === 'ADMIN' && result.user.role !== 'ADMIN') { alert("管理者権限が必要です"); }
      else { setUser(result.user); setView(target === 'ADMIN' ? 'ADMIN' : 'MEMBER'); }
    } else { alert(result.message); }
    setLoading(false);
  };

  const marketPrice = data?.config?.market_price || 0;

  // ----------------------------------------------------------------
  // 1. Landing Page (LP)
  // ----------------------------------------------------------------
  if (view === 'LP') {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-red-900/50">
        <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0d1117]/90 backdrop-blur-md z-50">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white w-8 h-8 flex items-center justify-center font-black rounded text-lg italic shadow-lg shadow-red-900/40">W</div>
            <span className="font-black text-xl tracking-tighter uppercase text-white">Wire Master <span className="text-red-600 font-bold tracking-normal">Cloud</span></span>
          </div>
          <button onClick={() => setView('CLIENT_LOGIN')} className="text-[10px] font-black tracking-widest uppercase border border-white/10 px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all">Member Login</button>
        </nav>

        <main>
          {/* HERO */}
          <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
              <div className="inline-block px-3 py-1 bg-red-950/30 border border-red-500/30 text-red-500 text-[10px] font-black tracking-[0.3em] uppercase rounded">Est. 1961 - Tsukisamu Manufacturing</div>
              <h1 className="text-6xl md:text-8xl font-black leading-none italic tracking-tighter text-white">
                REDEFINING<br /><span className="text-red-600 tracking-normal">RECYCLING.</span>
              </h1>
              <p className="text-gray-400 leading-relaxed max-w-md font-medium text-lg">
                廃電線の価値を透明化し、最大化する。独自のナゲットプラント「WNシリーズ」が、リサイクルの常識を塗り替えます。
              </p>
              <button onClick={() => setView('CLIENT_LOGIN')} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-lg hover:bg-red-600 hover:text-white transition-all shadow-2xl">
                マイページで査定を開始
              </button>
            </div>
            <div className="bg-[#161b22] border border-white/10 p-10 rounded-[3rem] shadow-2xl animate-in fade-in slide-in-from-right-4 duration-1000">
              <RealChart data={data?.history} />
            </div>
          </section>

          {/* MAIN BUSINESS */}
          <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center border-t border-white/5">
            <div className="bg-white/5 aspect-video rounded-3xl border border-white/10 flex flex-col items-center justify-center relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent"></div>
               <IconChart />
               <p className="text-[10px] font-black uppercase tracking-widest mt-4 text-gray-500 italic">Self-owned Nugget Plant</p>
            </div>
            <div className="space-y-6">
              <span className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Our Advantage</span>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">廃電線一貫処理システム</h2>
              <p className="text-gray-400 leading-relaxed">
                持ち込まれた被覆銅線をその場で粉砕・選別。純度99.9%の銅ナゲットとして再生します。中間マージンを排除し、被覆付きの状態でも国内トップクラスの高価買取を実現。
              </p>
              <ul className="space-y-4">
                {["面倒な剥離作業は一切不要", "独自の湿式・乾式選別ハイブリッド技術", "インボイス制度・電子マニフェスト対応"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-gray-300 text-sm italic">
                    <IconCheck /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-24 px-6 bg-white/5 border-y border-white/5">
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-black text-white italic text-center mb-16 uppercase tracking-tighter">Frequently Asked Questions</h2>
              {FAQ_ITEMS.map((item, idx) => (
                <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-[#161b22]">
                  <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full flex justify-between items-center p-6 text-left font-bold text-white hover:bg-white/5 transition-colors">
                    <span className="flex items-center gap-4"><span className="text-red-600 font-black italic">Q.</span> {item.q}</span>
                    <IconChevronDown className={`transform transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === idx && <div className="p-6 bg-black/40 text-gray-400 text-sm leading-relaxed border-t border-white/5 animate-in slide-in-from-top-2 italic"><span className="font-black text-white mr-2">A.</span> {item.a}</div>}
                </div>
              ))}
            </div>
          </section>

          {/* LOCATION */}
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="bg-white/5 rounded-[3rem] border border-white/10 p-12 md:p-20 grid md:grid-cols-2 gap-16">
               <div>
                  <h3 className="font-black text-white text-3xl mb-8 italic uppercase tracking-tighter flex items-center gap-3"><span className="w-2 h-8 bg-red-600"></span>札幌本社工場</h3>
                  <p className="text-gray-500 font-medium leading-loose uppercase tracking-widest text-xs">〒004-0871 札幌市清田区平岡1条5丁目2番1号<br/>TEL: 011-881-1116(代)</p>
               </div>
               <div>
                  <h3 className="font-black text-white text-3xl mb-8 italic uppercase tracking-tighter flex items-center gap-3"><span className="w-2 h-8 bg-red-600"></span>苫小牧工場</h3>
                  <p className="text-gray-500 font-medium leading-loose uppercase tracking-widest text-xs">〒053-0001 苫小牧市一本松町9-6<br/>TEL: 0144-55-5544(代)</p>
               </div>
            </div>
          </section>
        </main>

        <footer className="p-12 bg-black text-center space-y-4">
          <div className="font-black text-2xl italic text-white tracking-tighter uppercase">TSUKISAMU <span className="text-red-600">GROUP</span></div>
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.5em]">Beyond Resources. Evolving Value. since 1961</p>
          <button onClick={() => setView('ADMIN_LOGIN')} className="text-gray-800 hover:text-white text-[9px] font-black uppercase underline transition-colors">Internal System Access</button>
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. Login & Dashboards
  // ----------------------------------------------------------------
  if (view === 'CLIENT_LOGIN' || view === 'ADMIN_LOGIN') {
    const isAdmin = view === 'ADMIN_LOGIN';
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-[#161b22] border border-white/10 p-12 rounded-[3rem] shadow-2xl relative">
          <button onClick={() => setView('LP')} className="absolute top-10 left-10 text-gray-600 text-[10px] font-black hover:text-white uppercase tracking-widest transition-colors">← Exit</button>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{isAdmin ? 'Admin Console' : 'Member Portal'}</h2>
          </div>
          <form onSubmit={(e) => handleAuth(e, isAdmin ? 'ADMIN' : 'MEMBER')} className="space-y-4">
            <input name="loginId" className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-600 transition-all font-mono text-sm" placeholder="USER ID" required />
            <input name="password" type="password" className="w-full bg-black border border-white/5 p-5 rounded-2xl text-white outline-none focus:border-red-600 transition-all font-mono text-sm" placeholder="ACCESS KEY" required />
            <button disabled={loading} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all ${isAdmin ? 'bg-cyan-600 shadow-cyan-900/20' : 'bg-red-600 shadow-red-900/20'} hover:brightness-125`}>
              {loading ? 'Authorizing...' : 'Initialize Session'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'MEMBER') {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0d1117]/90 backdrop-blur-md sticky top-0 z-50">
          <div className="font-black italic text-xl text-white">MEMBER <span className="text-red-600 font-bold uppercase tracking-tighter">Portal</span></div>
          <button onClick={() => setView('LP')} className="text-[10px] font-black text-gray-500 hover:text-white border border-white/10 px-6 py-2 rounded-full uppercase">Logout</button>
        </header>
        <main className="max-w-4xl mx-auto py-12 px-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#161b22] border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <span className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 inline-block tracking-widest">{user.role} RANK</span>
                <h2 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter leading-tight">{user.companyName} 様</h2>
                <p className="text-cyan-400 font-bold text-xs mt-4 uppercase flex items-center gap-2 italic">{user.benefitMsg}</p>
              </div>
              <div className="bg-black/40 p-8 rounded-[2rem] border border-white/10 text-right min-w-[240px]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Available Points</p>
                <p className="text-5xl font-mono font-black text-white leading-none">{(Number(user.points) || 0).toLocaleString()} <span className="text-sm text-gray-600 ml-1">PT</span></p>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-cyan-600 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem]">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3"><span className="w-1.5 h-4 bg-red-600"></span>Quality Performance</h3>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-mono font-black text-white italic">64.2%</span>
                <span className="text-green-500 font-black text-[10px] px-2 py-1 bg-green-500/10 rounded uppercase tracking-widest">Excellent</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed font-medium italic">前回の歩留まり結果は基準を上回りました。品質ボーナスを付与します。</p>
            </div>
            <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem]">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3"><span className="w-1.5 h-4 bg-cyan-500"></span>Membership Progress</h3>
              <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-widest text-gray-400"><span>Progress</span><span>GOLD Level</span></div>
              <div className="w-full bg-black h-2.5 rounded-full overflow-hidden mb-6"><div className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full w-[72%] shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div></div>
              <p className="text-[10px] text-right text-gray-500 font-bold uppercase tracking-[0.2em]">Next Rank Up: +245kg</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'ADMIN') {
    const monthlyTotal = data?.stats?.monthlyTotal || 0;
    const progress = Math.min(Math.round((monthlyTotal / 30000) * 100), 100);
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col md:flex-row">
        <aside className="w-full md:w-80 border-r border-white/5 bg-black/30 p-8 space-y-8 shrink-0 flex flex-col">
          <div className="font-black italic text-2xl text-white tracking-tighter">FACTORY <span className="text-cyan-500">OS</span></div>
          <div className="space-y-8 flex-1">
            <div className="bg-[#161b22] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Monthly Progress</span>
               <div className="text-5xl font-mono font-black text-white">{progress}%</div>
               <div className="w-full bg-black h-1 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full" style={{width: `${progress}%`}}></div></div>
            </div>
            <div className="bg-[#161b22] p-6 rounded-3xl border border-white/5 space-y-4">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block italic">LME Copper</span>
               <div className="text-3xl font-mono font-black text-red-500 italic">¥{Number(marketPrice).toLocaleString()}</div>
            </div>
          </div>
          <button onClick={() => setView('LP')} className="w-full py-4 text-[10px] font-black uppercase text-gray-600 border border-white/10 rounded-2xl hover:text-white hover:bg-red-600 transition-all tracking-widest">Logout</button>
        </aside>
        <main className="flex-1 p-8 space-y-8 overflow-y-auto animate-in fade-in duration-500">
           <div className="grid lg:grid-cols-2 gap-8">
              <section className="bg-[#161b22] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-3"><IconCalculator /> Entrance Evaluation</h3>
                  <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">System Active</span>
                </div>
                <div className="p-8 flex-1 grid grid-cols-2 gap-4 overflow-y-auto max-h-[450px]">
                  {data?.products?.map((p:any) => (
                    <button key={p.id} onClick={() => { setSelectedProduct(p); setCalcValue('0'); }} className={`p-6 rounded-[2rem] border transition-all text-left group ${selectedProduct?.id === p.id ? 'bg-cyan-600 border-cyan-400 shadow-xl' : 'bg-black/40 border-white/5 hover:border-white/20'}`}>
                      <span className="text-[8px] text-gray-500 font-black block mb-2 uppercase tracking-widest">{p.category}</span>
                      <p className="font-black text-white text-sm tracking-tight leading-tight">{p.name}</p>
                      <p className="text-xl font-mono font-black mt-3">¥{Math.floor(marketPrice * (p.ratio/100)).toLocaleString()}</p>
                    </button>
                  ))}
                </div>
                {selectedProduct && (
                  <div className="absolute inset-x-0 bottom-0 p-10 bg-black/95 backdrop-blur-xl border-t border-white/10 animate-in slide-in-from-bottom-8 duration-300 z-20">
                    <div className="flex justify-between items-end mb-8 text-white">
                      <div><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{selectedProduct.name}</p><p className="text-5xl font-mono font-black leading-none">{calcValue}<small className="text-lg text-gray-600 ml-2">kg</small></p></div>
                      <div className="text-right"><p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Subtotal</p><p className="text-5xl font-mono font-black text-cyan-500 leading-none">¥{Math.floor(Number(calcValue) * Math.floor(marketPrice * (selectedProduct.ratio/100))).toLocaleString()}</p></div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-8">
                      {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => (<button key={n} onClick={() => setCalcValue(prev => prev === '0' && n !== '.' ? String(n) : prev + n)} className="py-5 bg-white/5 rounded-2xl font-black text-xl text-white hover:bg-white/10 transition-all active:scale-95">{n}</button>))}
                      <button onClick={() => setCalcValue('0')} className="py-5 bg-red-950/30 text-red-500 rounded-2xl font-black text-xl active:scale-95 text-center">C</button>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedProduct(null)} className="flex-1 py-5 bg-white/5 rounded-2xl font-black text-[10px] text-gray-500 uppercase tracking-widest">Cancel</button>
                      <button onClick={() => alert("記録完了")} className="flex-[2] py-5 bg-cyan-600 rounded-2xl font-black text-xs text-white shadow-2xl shadow-cyan-900/40 uppercase tracking-widest hover:brightness-125 transition-all">Register Batch</button>
                    </div>
                  </div>
                )}
              </section>
              <section className="bg-[#161b22] rounded-[3rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
                <div className="px-10 py-8 bg-white/5 border-b border-white/5"><h3 className="text-xs font-black uppercase tracking-[0.2em] text-white italic">Processing Queue</h3></div>
                <div className="p-8 space-y-4 overflow-y-auto max-h-[600px]">
                  {data?.pending?.map((t:any) => (
                    <div key={t.id} className="bg-black/40 p-6 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-red-500/30 transition-all shadow-lg">
                      <div><span className="text-[8px] font-mono text-gray-600 uppercase mb-2 block">ID: {t.id}</span><p className="font-black text-white text-lg tracking-tight italic">{t.client}</p><p className="text-xs font-mono text-gray-500 mt-1">{t.weight} kg / {t.date}</p></div>
                      <button className="bg-white/5 text-gray-400 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest group-hover:bg-red-600 group-hover:text-white transition-all">Process</button>
                    </div>
                  ))}
                </div>
              </section>
           </div>
        </main>
      </div>
    );
  }

  return null;
}
