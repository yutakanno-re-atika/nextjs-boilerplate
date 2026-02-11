"use client";

import React, { useState, useEffect } from 'react';

// 数字のフォーマット用
const fmt = (num: number | string) => Number(num || 0).toLocaleString();

export default function WireMasterPortal() {
  // 画面遷移管理: 'LP' | 'CLIENT_LOGIN' | 'ADMIN_LOGIN' | 'MEMBER' | 'ADMIN'
  const [view, setView] = useState<'LP' | 'CLIENT_LOGIN' | 'ADMIN_LOGIN' | 'MEMBER' | 'ADMIN'>('LP');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 初期データ取得（建値など）
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { if (d.status === 'success') setData(d); });
  }, []);

  // 認証処理
  const handleAuth = async (e: any, targetRole: 'ADMIN' | 'MEMBER') => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'AUTH_LOGIN',
          loginId: e.target.loginId.value,
          password: e.target.password.value
        })
      });
      const result = await res.json();
      if (result.status === 'success') {
        // ログイン画面の種別と、DB上の権限が一致するかチェック
        if (targetRole === 'ADMIN' && result.user.role !== 'ADMIN') {
          alert("管理者権限がありません。");
          return;
        }
        setUser(result.user);
        setView(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("通信エラー");
    } finally {
      setLoading(false);
    }
  };

  const marketPrice = data?.config?.market_price ? fmt(data.config.market_price) : '---';

  // ----------------------------------------------------------------
  // 1. LP (Landing Page)
  // ----------------------------------------------------------------
  if (view === 'LP') {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white font-sans">
        {/* Hero Section */}
        <nav className="p-6 flex justify-between items-center border-b border-white/5 bg-[#0d1117]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 px-2 py-1 rounded font-black italic">W</div>
            <span className="font-black text-xl tracking-tighter uppercase">Wire Master <span className="text-red-500">Cloud</span></span>
          </div>
          <button onClick={() => setView('CLIENT_LOGIN')} className="text-xs font-bold border border-white/20 px-4 py-2 rounded-full hover:bg-white hover:text-black transition">MEMBER LOGIN</button>
        </nav>

        <main>
          {/* Hero */}
          <section className="py-24 px-6 text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1.5 bg-red-950/30 border border-red-500/30 rounded-full text-red-500 text-[10px] font-black tracking-[0.3em] mb-6 uppercase">Tomakomai Factory Official</div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 italic tracking-tighter leading-none">
              その電線、<br />
              <span className="text-red-600">透明な価値</span>に変える。
            </h1>
            <p className="text-gray-400 text-sm md:text-lg mb-12 font-medium max-w-2xl mx-auto leading-relaxed">
              LME銅相場に完全連動した適正査定。最新の湿式プラント「WNシリーズ」による高精度な歩留まり解析が、あなたの取引を次のステージへ導きます。
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="bg-[#161b22] border border-white/10 p-6 rounded-2xl w-full md:w-64 text-center shadow-2xl">
                <span className="text-[10px] text-gray-500 font-bold block mb-2 uppercase tracking-widest">Copper Base Price</span>
                <span className="text-3xl font-mono font-black text-red-500">¥{marketPrice}</span>
              </div>
              <button onClick={() => setView('CLIENT_LOGIN')} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-900/20 transition-all">
                マイページへ
              </button>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white/5 py-24 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
              {[
                { t: "透明な査定", d: "最新のナゲット加工機による実測歩留まりをフィードバック。根拠のある買取価格を提示します。" },
                { t: "会員ランク特典", d: "取引量と品質に応じてランクアップ。継続的なお取引に最大級のベネフィットを。" },
                { t: "24h クラウド管理", d: "スマホひとつで過去の取引履歴、保有ポイント、品質評価をいつでも確認可能です。" }
              ].map((f, i) => (
                <div key={i} className="space-y-4">
                  <div className="text-red-600 font-black text-2xl italic">0{i+1}</div>
                  <h3 className="text-xl font-black text-white">{f.t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer className="p-12 border-t border-white/5 flex flex-col items-center gap-6">
          <p className="text-gray-600 text-[10px] font-bold tracking-widest uppercase">© 2026 Wire Master Cloud / Tsukisamu Seisakusho</p>
          <button onClick={() => setView('ADMIN_LOGIN')} className="text-gray-700 hover:text-gray-400 text-[10px] font-bold uppercase underline tracking-tighter transition">Admin Console</button>
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. LOGIN VIEWS
  // ----------------------------------------------------------------
  if (view === 'CLIENT_LOGIN' || view === 'ADMIN_LOGIN') {
    const isAdmin = view === 'ADMIN_LOGIN';
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#161b22] border border-white/10 p-10 rounded-3xl shadow-2xl relative">
          <button onClick={() => setView('LP')} className="absolute top-6 left-6 text-gray-500 hover:text-white flex items-center gap-1 text-xs font-bold uppercase">
            ← Back
          </button>
          <div className="text-center mb-10">
             <div className={`w-12 h-12 ${isAdmin ? 'bg-cyan-600' : 'bg-red-600'} mx-auto rounded-xl flex items-center justify-center font-black text-xl mb-4 italic text-white shadow-lg`}>
              {isAdmin ? 'A' : 'M'}
             </div>
             <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{isAdmin ? 'Admin Console' : 'Member Portal'}</h2>
             <p className="text-gray-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Authorized Access Only</p>
          </div>
          <form onSubmit={(e) => handleAuth(e, isAdmin ? 'ADMIN' : 'MEMBER')} className="space-y-6">
            <input name="loginId" className="w-full bg-[#0d1117] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-red-600 transition-all font-bold" placeholder="ID" required />
            <input name="password" type="password" className="w-full bg-[#0d1117] border border-white/10 p-4 rounded-xl text-white outline-none focus:border-red-600 transition-all font-bold" placeholder="Password" required />
            <button disabled={loading} className={`w-full ${isAdmin ? 'bg-cyan-600' : 'bg-red-600'} text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:brightness-110 transition-all shadow-xl`}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 3. MEMBER DASHBOARD (v2.1)
  // ----------------------------------------------------------------
  if (view === 'MEMBER') {
    return (
      <div className="min-h-screen bg-[#0d1117] text-white">
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="font-black text-lg italic tracking-tighter">MEMBER <span className="text-red-500">PORTAL</span></div>
          <button onClick={() => setView('LP')} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg">Logout</button>
        </header>

        <main className="max-w-4xl mx-auto py-12 px-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
              <div>
                <span className="bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-4 inline-block border border-cyan-500/30">{user.role} RANK</span>
                <h2 className="text-4xl font-black italic tracking-tight">{user.companyName} 様</h2>
                <p className="text-xs text-cyan-400 font-bold mt-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span> {user.benefitMsg}
                </p>
              </div>
              <div className="bg-black/40 p-6 rounded-3xl border border-white/5 text-right min-w-[200px]">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Available Points</p>
                <p className="text-4xl font-mono font-black text-white">{fmt(user.points)} <span className="text-sm text-gray-500">PT</span></p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#161b22] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Last Quality Assessment</h3>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-mono font-black text-white">{user.lastYield}</span>
                <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-[10px] font-black uppercase">Excellent</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                丁寧な分別により高純度のナゲット回収に成功しました。次回の買取単価に品質ボーナスが加算されます。
              </p>
            </div>
            <div className="bg-[#161b22] border border-white/10 p-6 rounded-2xl">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Next Rank Up</h3>
              <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-tighter">
                <span>{user.role}</span>
                <span className="text-red-500">Next Level</span>
              </div>
              <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full w-[65%] shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
              </div>
              <p className="text-[9px] text-right mt-3 text-gray-500 font-bold uppercase tracking-widest">あと 250kg の取引でランクアップ</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 4. ADMIN DASHBOARD (FACTORY OS v2.1)
  // ----------------------------------------------------------------
  if (view === 'ADMIN') {
    const monthlyTotal = data?.stats?.monthlyTotal || 0;
    const progress = Math.min(Math.round((monthlyTotal / 30000) * 100), 100);

    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans">
        <header className="border-b border-white/5 bg-[#0d1117]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-600 text-white w-8 h-8 flex items-center justify-center font-black rounded shadow-lg">A</div>
            <h1 className="text-lg font-bold tracking-tighter text-white uppercase italic">Factory OS <span className="text-cyan-500">v2.1</span></h1>
          </div>
          <button onClick={() => setView('LP')} className="bg-white/5 text-gray-400 border border-white/10 px-4 py-2 rounded font-bold text-[10px] hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">System Logout</button>
        </header>

        <main className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] border border-white/5 p-8 rounded-3xl relative overflow-hidden group shadow-xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 block">Monthly Progress (30t)</span>
              <div className="text-5xl font-mono font-black text-white mb-6">{progress}%</div>
              <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/5 p-8 rounded-3xl shadow-xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 block">Current LME Copper</span>
              <div className="text-5xl font-mono font-black text-red-500 italic">¥{marketPrice}</div>
              <p className="text-[9px] text-gray-500 mt-4 font-bold uppercase">Real-time Data Synchronized</p>
            </div>
            <div className="bg-[#161b22] border border-green-500/20 p-8 rounded-3xl shadow-xl">
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-4 block">Est. Profit (Feb)</span>
              <div className="text-5xl font-mono font-black text-white">¥1.82M</div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-8 py-5 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                Processing Queue
              </h3>
              <span className="text-[10px] font-bold text-gray-500">{data?.pending?.length || 0} Batches Wait</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.pending?.map((t: any) => (
                <div key={t.id} className="bg-[#0d1117] border border-white/5 p-6 rounded-2xl hover:border-cyan-500/50 transition-all group">
                  <div className="mb-6">
                    <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block mb-1">TXN_{t.id}</span>
                    <p className="text-lg font-bold text-white tracking-tight">{t.client}</p>
                    <p className="text-sm font-mono text-cyan-500">{fmt(t.weight)} kg</p>
                  </div>
                  <button className="w-full bg-white/5 border border-white/10 text-gray-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-all">Start Processing</button>
                </div>
              ))}
              {(!data?.pending || data.pending.length === 0) && (
                <div className="col-span-full py-20 text-center text-gray-600 font-black uppercase tracking-[0.2em] italic">No active tasks in queue</div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
