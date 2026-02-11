"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 資産再利用: SVG Icons & Components
// ==========================================
const IconChart = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const IconArrowUp = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const IconCalculator = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" /><line x1="8" y1="6" x2="16" y2="6" strokeWidth="2" /><path d="M16 14v4M12 14v4M8 14v4M16 10h.01M12 10h.01M8 10h.01" strokeWidth="2" /></svg>;

// 資産再利用: RealChart
const RealChart = ({ data, color = "#ef4444" }) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d:any) => d.value));
  const minVal = Math.min(...data.map((d:any) => d.value));
  const yMax = maxVal + (maxVal - minVal) * 0.2;
  const yMin = minVal - (maxVal - minVal) * 0.2;
  const getX = (i:number) => (i / (data.length - 1)) * 100;
  const getY = (v:number) => 100 - ((v - yMin) / (yMax - yMin)) * 100;
  const points = data.map((d:any, i:number) => `${getX(i)},${getY(d.value)}`).join(' ');

  return (
    <div className="w-full" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activePoint ? activePoint.date : 'Market Trend'}</p>
          <p className="text-2xl font-mono font-black text-white">¥{activePoint ? activePoint.value.toLocaleString() : data[data.length-1].value.toLocaleString()}</p>
        </div>
        <div className="text-right text-green-500 font-bold text-xs flex items-center gap-1"><IconArrowUp /> LME-Sync</div>
      </div>
      <div className="h-32 w-full relative border-b border-white/10">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path d={`M ${points} L 100,100 L 0,100 Z`} fill="url(#grad)" opacity="0.2" />
          <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color}/><stop offset="100%" stopColor="transparent"/></linearGradient></defs>
          {data.map((d:any, i:number) => (
            <rect key={i} x={getX(i)-2} y="0" width="4" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default function WireMasterCloud() {
  const [view, setView] = useState<'LP' | 'CLIENT_LOGIN' | 'ADMIN_LOGIN' | 'MEMBER' | 'ADMIN'>('LP');
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // POS用State
  const [calcValue, setCalcValue] = useState('0');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/gas').then(res => res.json()).then(d => { if(d.status === 'success') setData(d); });
  }, []);

  const handleLogin = async (e: any, target: 'ADMIN' | 'MEMBER') => {
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
      <div className="min-h-screen bg-[#0d1117] text-white">
        <nav className="p-6 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#0d1117]/80 backdrop-blur-md z-50">
          <div className="flex items-center gap-2 font-black text-xl italic uppercase tracking-tighter">
            <span className="text-red-600">Wire</span>Master Cloud
          </div>
          <button onClick={() => setView('CLIENT_LOGIN')} className="bg-red-600 px-6 py-2 rounded-full font-bold text-xs hover:bg-red-700 transition shadow-lg shadow-red-900/20">MEMBER LOGIN</button>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 bg-red-950/30 border border-red-500/30 text-red-500 text-[10px] font-black tracking-widest uppercase rounded">Tomakomai Factory Official</div>
            <h1 className="text-6xl font-black leading-none italic tracking-tighter">その電線に、<br/><span className="text-red-600">適正な光</span>を。</h1>
            <p className="text-gray-400 leading-relaxed max-w-md">LME銅相場に完全連動。ナゲットプラント「WNシリーズ」による高精度解析が、廃電線の価値を最大化します。</p>
            <div className="flex gap-4">
              <button onClick={() => setView('CLIENT_LOGIN')} className="bg-white text-black px-8 py-4 rounded-xl font-black hover:bg-gray-200 transition shadow-xl">今すぐ査定を開始</button>
            </div>
          </div>
          <div className="bg-[#161b22] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <RealChart data={data?.history} />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-[#0d1117] p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Current Copper</p>
                <p className="text-2xl font-mono font-black text-white">¥{Number(marketPrice).toLocaleString()}<small className="text-xs">/kg</small></p>
              </div>
              <div className="bg-[#0d1117] p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Factory Status</p>
                <p className="text-2xl font-mono font-black text-green-500">ACTIVE</p>
              </div>
            </div>
          </div>
        </main>

        <section className="bg-white/5 py-20 px-6 border-y border-white/5">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            {[
              { t: "透明な歩留まり解析", d: "加工後の実測データをフィードバック。根拠のある高価買取を実現します。" },
              { t: "会員ランクシステム", d: "取引量に応じたポイント付与と単価優遇。パートナーと共に成長します。" },
              { t: "即日現金決済", d: "検収完了後、その場で決済。インボイス制度にも完全対応しております。" }
            ].map((f, i) => (
              <div key={i} className="space-y-3">
                <div className="text-red-600 text-3xl font-black italic">0{i+1}</div>
                <h3 className="text-xl font-bold">{f.t}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="p-12 text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest border-t border-white/5">
          © 2026 Wire Master Cloud / Tsukisamu Seisakusho 
          <button onClick={() => setView('ADMIN_LOGIN')} className="ml-4 hover:text-white underline">Admin Access</button>
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. Login Screens
  // ----------------------------------------------------------------
  if (view === 'CLIENT_LOGIN' || view === 'ADMIN_LOGIN') {
    const isAdmin = view === 'ADMIN_LOGIN';
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-[#161b22] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative">
          <button onClick={() => setView('LP')} className="absolute top-8 left-8 text-gray-500 text-xs font-bold hover:text-white">← BACK</button>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{isAdmin ? 'Factory Admin' : 'Member Portal'}</h2>
          </div>
          <form onSubmit={(e) => handleAuth(e, isAdmin ? 'ADMIN' : 'MEMBER')} className="space-y-4">
            <input name="loginId" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-red-600 transition-all font-bold" placeholder="ID" required />
            <input name="password" type="password" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-red-600 transition-all font-bold" placeholder="PASS" required />
            <button disabled={loading} className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all ${isAdmin ? 'bg-cyan-600' : 'bg-red-600'} hover:brightness-125`}>
              {loading ? 'Authorizing...' : 'Enter System'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 3. Member Dashboard (Nurturing UI)
  // ----------------------------------------------------------------
  if (view === 'MEMBER') {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <header className="p-6 border-b border-white/5 flex justify-between items-center">
          <span className="font-black italic text-xl">MEMBER <span className="text-red-600">PORTAL</span></span>
          <button onClick={() => setView('LP')} className="text-[10px] font-bold text-gray-500 hover:text-white border border-white/10 px-4 py-2 rounded-lg">LOGOUT</button>
        </header>
        <main className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-gradient-to-br from-[#161b22] to-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <span className="bg-red-600/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">{user.role} RANK</span>
                <h2 className="text-5xl font-black italic tracking-tighter">{user.companyName} 様</h2>
                <p className="text-gray-500 font-bold text-xs mt-4 uppercase">{user.benefitMsg}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 text-right min-w-[220px]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Points Balance</p>
                <p className="text-5xl font-mono font-black text-white">{(user.points || 0).toLocaleString()} <small className="text-sm">PT</small></p>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-red-600 rounded-full blur-[100px] opacity-10"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-white/10 p-8 rounded-3xl">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-1.5 h-3 bg-red-600"></span>Quality Feedback</h3>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-mono font-black text-white">64.2%</span>
                <span className="text-green-500 font-black text-xs uppercase">Excellent</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">前回の持ち込み分は分別が非常に丁寧で、ナゲット加工の効率化に貢献いただきました。次回ボーナス付与対象です。</p>
            </div>
            <div className="bg-[#161b22] border border-white/10 p-8 rounded-3xl">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2"><span className="w-1.5 h-3 bg-cyan-500"></span>Next Rank Status</h3>
              <div className="flex justify-between text-[10px] font-bold mb-3 uppercase tracking-tighter text-gray-400"><span>Current</span><span>Next Level</span></div>
              <div className="w-full bg-black h-2 rounded-full overflow-hidden mb-4"><div className="bg-cyan-500 h-full w-[72%] shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div></div>
              <p className="text-[10px] text-right text-gray-500 font-bold uppercase">あと 245kg の取引で昇格</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 4. Admin Dashboard (Factory OS v2.1 + POS Simulator)
  // ----------------------------------------------------------------
  if (view === 'ADMIN') {
    const monthlyTotal = data?.stats?.monthlyTotal || 0;
    const progress = Math.min(Math.round((monthlyTotal / 30000) * 100), 100);

    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col md:flex-row">
        {/* Sidebar / Stats */}
        <aside className="w-full md:w-80 border-r border-white/5 bg-black/20 p-6 space-y-6 shrink-0">
          <div className="font-black italic text-xl mb-12">FACTORY <span className="text-cyan-500">OS</span></div>
          <div className="bg-[#161b22] p-6 rounded-2xl border border-white/5 space-y-4 shadow-xl">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Monthly Progress</span>
             <div className="text-5xl font-mono font-black text-white">{progress}%</div>
             <div className="w-full bg-black h-1 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full" style={{width: `${progress}%`}}></div></div>
          </div>
          <div className="bg-[#161b22] p-6 rounded-2xl border border-white/5 space-y-4">
             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">LME Copper Base</span>
             <div className="text-3xl font-mono font-black text-red-500 italic">¥{Number(marketPrice).toLocaleString()}</div>
          </div>
          <button onClick={() => setView('LP')} className="w-full py-4 text-[10px] font-black uppercase text-gray-500 border border-white/10 rounded-xl hover:text-white transition">Exit System</button>
        </aside>

        {/* Main Console */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* POS 買取エントランス (資産再利用) */}
            <section className="bg-[#161b22] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              <div className="px-8 py-6 bg-white/5 flex justify-between items-center border-b border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2"><IconCalculator /> Entrance POS</h3>
                <span className="text-[10px] font-bold text-cyan-500">READY TO EVALUATE</span>
              </div>
              <div className="p-8 flex-1 grid grid-cols-2 gap-3 overflow-y-auto max-h-[400px]">
                {data?.products?.map((p:any) => (
                  <button key={p.id} onClick={() => { setSelectedProduct(p); setCalcValue('0'); }} className={`p-5 rounded-2xl border transition-all text-left ${selectedProduct?.id === p.id ? 'bg-cyan-600 border-cyan-500 shadow-lg shadow-cyan-900/20' : 'bg-black border-white/5 hover:border-white/20'}`}>
                    <span className="text-[9px] text-gray-500 font-bold block mb-1 uppercase tracking-tighter">{p.category}</span>
                    <p className="font-bold text-white text-sm leading-tight">{p.name}</p>
                    <p className="text-xs font-mono font-black mt-2">¥{Math.floor(marketPrice * (p.ratio/100)).toLocaleString()}</p>
                  </button>
                ))}
              </div>
              {/* POS Calculator Overlay (電卓) */}
              {selectedProduct && (
                <div className="p-8 bg-black/80 backdrop-blur-md border-t border-white/10 animate-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Input Weight (kg)</p>
                      <p className="text-4xl font-mono font-black text-white">{calcValue}<span className="text-sm text-gray-500 ml-2">kg</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-500 uppercase">Subtotal</p>
                      <p className="text-4xl font-mono font-black text-cyan-500">¥{Math.floor(Number(calcValue) * Math.floor(marketPrice * (selectedProduct.ratio/100))).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-6">
                    {[7,8,9,4,5,6,1,2,3,0,'.'].map(n => (
                      <button key={n} onClick={() => setCalcValue(prev => prev === '0' ? String(n) : prev + n)} className="py-4 bg-white/5 rounded-xl font-bold text-white hover:bg-white/10 transition">{n}</button>
                    ))}
                    <button onClick={() => setCalcValue('0')} className="py-4 bg-red-950/30 text-red-500 rounded-xl font-bold">C</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedProduct(null)} className="flex-1 py-4 bg-white/5 rounded-xl font-bold text-gray-500">CANCEL</button>
                    <button onClick={() => alert("取引を記録しました")} className="flex-[2] py-4 bg-cyan-600 rounded-xl font-black text-white shadow-xl shadow-cyan-900/40 uppercase tracking-widest">Confirm & Print ID</button>
                  </div>
                </div>
              )}
            </section>

            {/* 加工キュー管理 */}
            <section className="bg-[#161b22] rounded-[2rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              <div className="px-8 py-6 bg-white/5 border-b border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Processing Queue (Pending)</h3>
              </div>
              <div className="p-6 space-y-3 overflow-y-auto max-h-[600px]">
                {data?.pending?.map((t:any) => (
                  <div key={t.id} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex justify-between items-center group">
                    <div>
                      <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block mb-1">ID: {t.id}</span>
                      <p className="font-bold text-white tracking-tight">{t.client}</p>
                      <p className="text-xs text-gray-500 mt-1">{t.weight} kg / {t.date}</p>
                    </div>
                    <button className="bg-white/5 text-gray-400 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg">Start Batch</button>
                  </div>
                ))}
                {(!data?.pending || data.pending.length === 0) && (
                   <div className="py-20 text-center font-black text-gray-700 uppercase italic tracking-widest">No active batches</div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
