"use client";

import React, { useState, useEffect } from 'react';

// 数字のフォーマット用ユーティリティ
const fmt = (num: number | string) => Number(num || 0).toLocaleString();

export default function FactoryOS() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('OFFLINE');

  // 初期データロード
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => {
        if (d.status === 'success') {
          setData(d);
          setStatus('ONLINE');
        }
      })
      .catch(() => setStatus('CONNECTION FAILED'));
  }, []);

  const login = async (e: any) => {
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
        setUser(result.user);
        setRole(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const marketPrice = data?.config?.market_price ? fmt(data.config.market_price) : '---';
  // 月間目標進捗（仮：目標30tに対する現在地）
  const currentTotal = data?.stats?.monthlyTotal || 0;
  const targetTotal = 30000;
  const progressPercent = Math.min(Math.round((currentTotal / targetTotal) * 100), 100);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-red-900/50">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-[#0d1117]/90 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-red-700 text-white w-8 h-8 flex items-center justify-center font-black rounded-md shadow-lg shadow-red-900/20">月</div>
          <h1 className="text-lg font-bold tracking-tighter text-white">FACTORY <span className="text-red-600">OS</span> <span className="text-[9px] text-gray-500 font-mono ml-1">v2.1</span></h1>
        </div>
        
        {role !== 'GUEST' && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-widest">{user?.role} Account</span>
              <span className="text-xs font-bold text-cyan-400">{user?.companyName}</span>
            </div>
            <button onClick={() => setRole('GUEST')} className="bg-white/5 text-gray-400 border border-white/10 px-3 py-1 rounded-md font-bold text-xs hover:bg-red-600 hover:text-white hover:border-red-600 transition-all uppercase tracking-wider">Logout</button>
          </div>
        )}

        {role === 'GUEST' && (
           <div className="text-right">
            <span className="text-[9px] text-gray-500 block font-bold uppercase tracking-widest">LME Copper</span>
            <span className="text-lg font-mono text-red-600 font-black tracking-tight">¥{marketPrice}</span>
          </div>
        )}
      </header>

      {/* GUEST LOGIN */}
      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6">
          <div className="bg-[#161b22] border border-white/10 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900"></div>
            <h2 className="text-2xl font-black text-center mb-8 text-white uppercase tracking-tighter">System Login</h2>
            <form onSubmit={login} className="space-y-5">
              <input name="loginId" className="w-full bg-[#0d1117] border border-white/10 focus:border-red-600 p-4 rounded-xl font-bold text-white outline-none transition-all placeholder:text-gray-600" placeholder="Enter ID" required />
              <input name="password" type="password" className="w-full bg-[#0d1117] border border-white/10 focus:border-red-600 p-4 rounded-xl font-bold text-white outline-none transition-all placeholder:text-gray-600" placeholder="Password" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Verifying...' : 'Authorize Access'}
              </button>
            </form>
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Status: {status}</p>
            </div>
          </div>
        </main>
      )}

      {/* ADMIN DASHBOARD (既存維持＋微調整) */}
      {role === 'ADMIN' && (
        <main className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Monthly Progress</p>
              <div className="text-3xl font-mono font-black text-white">{progressPercent}% <small className="text-xs text-gray-500">({fmt(currentTotal)} / 30t)</small></div>
              <div className="w-full bg-gray-800 h-1.5 mt-4 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full transition-all duration-1000 ease-out" style={{width: `${progressPercent}%`}}></div>
              </div>
            </div>
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-2xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Avg Yield (WN-800)</p>
              <div className="text-3xl font-mono font-black text-cyan-400">64.2% <small className="text-xs text-gray-500">Target: 62%</small></div>
            </div>
            <div className="bg-[#161b22] border border-green-500/20 p-6 rounded-2xl shadow-sm relative overflow-hidden">
               <div className="absolute -right-4 -top-4 text-green-500/10"><svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg></div>
              <p className="text-[10px] font-bold text-green-500 mb-2 uppercase tracking-widest">Est. Profit (Feb)</p>
              <div className="text-3xl font-mono font-black text-green-400">¥1.82M</div>
            </div>
          </div>

          <div className="bg-[#161b22] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-white/5 flex justify-between items-center border-b border-white/5">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-white">
                <span className="w-1.5 h-4 bg-red-600 rounded-full"></span>
                Pending Tasks
              </h3>
              <span className="bg-[#0d1117] text-[9px] px-3 py-1 rounded-full font-bold border border-white/10 text-gray-400 uppercase">{data?.pending?.length || 0} Queued</span>
            </div>
            <div className="p-4 grid gap-3 max-h-[400px] overflow-y-auto">
              {data?.pending?.map((t: any) => (
                <div key={t.id} className="bg-[#0d1117] p-4 rounded-xl border border-white/5 flex justify-between items-center hover:border-red-600/50 transition-all group">
                  <div>
                    <span className="text-[9px] text-gray-600 font-mono block">TRX ID: {t.id}</span>
                    <p className="font-bold text-white">{t.client}</p>
                    <p className="text-xs text-gray-500 font-mono">{fmt(t.weight)} kg / {t.date}</p>
                  </div>
                  <button className="bg-white/5 text-gray-300 px-4 py-2 rounded-lg font-black text-[10px] hover:bg-red-600 hover:text-white transition shadow-lg uppercase tracking-wider border border-white/10">Initiate Batch</button>
                </div>
              ))}
              {(!data?.pending || data.pending.length === 0) && (
                 <p className="text-center text-gray-500 text-xs py-10 font-bold uppercase tracking-widest">No Pending Tasks</p>
              )}
            </div>
          </div>
        </main>
      )}

      {/* MEMBER DASHBOARD (新実装: ランク・ポイント・品質評価) */}
      {role === 'MEMBER' && (
        <main className="max-w-4xl mx-auto py-12 px-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          
          {/* 1. 会員ランク＆ポイントカード */}
          <div className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border border-white/10 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase mb-3 border ${user.role.includes('GOLD') ? 'bg-yellow-900/30 text-yellow-500 border-yellow-500/30' : 'bg-cyan-900/30 text-cyan-500 border-cyan-500/30'}`}>
                    {user.role} Member
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black italic text-white tracking-tight">{user.companyName} 様</h2>
                </div>
                <div className="text-right bg-[#0d1117]/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Available Points</p>
                  <p className="text-3xl font-mono font-black text-white">{fmt(user.points)} <small className="text-sm text-gray-500">pt</small></p>
                </div>
              </div>

              <div className="bg-[#0d1117] p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                <div className="bg-cyan-500/10 p-2 rounded-lg text-cyan-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">現在の適用特典 (Benefit)</p>
                  <p className="text-sm text-cyan-400 font-bold">{user.benefitMsg}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. 品質評価フィードバック＆ネクストステップ */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 歩留まり評価 */}
            <div className="bg-[#161b22] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
              <h3 className="text-xs font-black text-gray-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Last Quality Check
              </h3>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-mono font-black text-white">{user.lastYield}</span>
                <span className="text-green-500 font-black text-sm px-2 py-1 bg-green-500/10 rounded-md uppercase">{user.yieldEvaluation}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                前回の持ち込み品は非常に良好な状態でした。丁寧な分別ありがとうございます。この品質が続くと、ランク昇格基準が緩和されます。
              </p>
            </div>

            {/* 次のランクへ */}
            <div className="bg-[#161b22] border border-white/10 p-6 rounded-2xl relative overflow-hidden">
               <h3 className="text-xs font-black text-gray-500 uppercase mb-6 tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Next Rank Progress
              </h3>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-white">{user.role}</span>
                <span className="text-yellow-500">GOLD</span>
              </div>
              <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden relative">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[65%] shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase text-right">
                あと 250kg の取引で昇格
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
