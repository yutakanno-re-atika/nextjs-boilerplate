"use client";

import React, { useState, useEffect } from 'react';

export default function FactoryOS() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 初期データ取得
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { if (d.status === 'success') setData(d); });
  }, []);

  const login = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
        body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setUser(result.user);
        setRole(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
      } else { alert(result.message); }
    } catch (err) { alert("CONNECTION ERROR"); } finally { setLoading(false); }
  };

  // 目標進捗などの計算
  const currentWeight = data?.stats?.monthlyTotal || 0;
  const targetWeight = 30000;
  const progress = Math.min(Math.round((currentWeight / targetWeight) * 100), 100);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans selection:bg-red-500/30">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-[#0d1117]/80 backdrop-blur-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-baseline gap-2">
          <div className="bg-red-600 text-white px-1.5 rounded-sm font-black text-sm">✓</div>
          <h1 className="text-xl font-bold tracking-tighter text-white">FACTORY <span className="text-red-500">OS</span></h1>
          <span className="text-[9px] text-gray-500 font-mono ml-2">VER 2.0.4 [SECURE]</span>
        </div>
        
        {role !== 'GUEST' && (
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest">Administrator</span>
              <span className="text-sm font-bold text-cyan-400">{user?.companyName}</span>
            </div>
            <button onClick={() => window.location.reload()} className="p-2 hover:bg-white/5 rounded-full transition">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button onClick={() => setRole('GUEST')} className="bg-red-950/30 text-red-500 border border-red-500/30 px-4 py-1.5 rounded font-bold text-xs hover:bg-red-500 hover:text-white transition-all uppercase tracking-tighter">Logout</button>
          </div>
        )}
      </header>

      {role === 'GUEST' ? (
        <main className="max-w-md mx-auto py-32 px-6">
          <div className="bg-[#161b22] border border-white/10 p-10 rounded-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <h2 className="text-2xl font-bold text-white mb-8 tracking-tighter">TERMINAL LOGIN</h2>
            <form onSubmit={login} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">System ID</label>
                <input name="loginId" className="w-full bg-[#0d1117] border border-white/10 p-4 rounded text-white focus:border-red-500 outline-none transition-all font-mono" placeholder="ID" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Access Key</label>
                <input name="password" type="password" className="w-full bg-[#0d1117] border border-white/10 p-4 rounded text-white focus:border-red-500 outline-none transition-all font-mono" placeholder="••••" required />
              </div>
              <button disabled={loading} className="w-full bg-red-600 text-white py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20">
                {loading ? 'Authorizing...' : 'Initialize Session'}
              </button>
            </form>
          </div>
        </main>
      ) : (
        <main className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500">
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* MONTHLY TARGET */}
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Monthly Target</span>
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * progress) / 100} className="text-cyan-500 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">{progress}%</span>
                  <span className="text-[8px] text-gray-500 uppercase font-bold">Achieved</span>
                </div>
              </div>
              <div className="text-xl font-mono font-bold text-white">{currentWeight.toLocaleString()} <small className="text-[10px] text-gray-500">kg</small></div>
              <div className="text-[9px] text-gray-500 mt-1 uppercase">Target: 30,000 kg</div>
            </div>

            {/* TODAY'S MISSION */}
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-xl relative overflow-hidden">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block mb-4">Today's Mission</span>
              <div className="text-4xl font-mono font-black text-white mb-8">0 <small className="text-sm text-gray-500">kg</small></div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-1/3 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
              </div>
              <span className="text-[9px] text-gray-500 mt-4 block text-right uppercase font-bold">残り営業日: 0日</span>
            </div>

            {/* MEMBERS */}
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-xl relative">
              <div className="flex justify-between items-start mb-10">
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Members</span>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div className="text-4xl font-mono font-black text-white">3 <small className="text-sm text-gray-500">社</small></div>
              <div className="text-[10px] text-gray-500 mt-2 font-bold">+0 <span className="text-cyan-500">New {`{今月}`}</span></div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-[#161b22] border border-white/5 p-6 rounded-xl flex flex-col gap-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Quick Actions</span>
              <button className="flex items-center gap-3 w-full bg-[#0d1117] hover:bg-gray-800 p-3 rounded border border-white/5 text-xs font-bold transition-all text-gray-300 group">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                請求書発行
              </button>
              <button className="flex items-center gap-3 w-full bg-[#0d1117] hover:bg-gray-800 p-3 rounded border border-white/5 text-xs font-bold transition-all text-gray-300 group">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                月報作成
              </button>
            </div>
          </div>

          {/* PENDING JOBS QUEUE */}
          <div className="bg-[#161b22] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-white/5 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Pending Jobs Queue</h3>
              </div>
              <span className="bg-[#0d1117] text-[10px] px-3 py-1 rounded-full font-bold border border-white/10 text-gray-500 uppercase">{data?.pending?.length || 0} Tasks</span>
            </div>
            
            <div className="min-h-[300px] flex flex-col items-center justify-center p-12">
              {!data?.pending || data.pending.length === 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-white font-black text-xl mb-1 italic">ALL TASKS CLEARED</p>
                  <p className="text-gray-500 text-xs font-bold">現在、処理待ちの在庫はありません。</p>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.pending.map((t: any) => (
                    <div key={t.id} className="bg-[#0d1117] border border-white/5 p-5 rounded-lg flex justify-between items-center hover:border-cyan-500/50 transition-all group">
                      <div>
                        <span className="text-[9px] text-gray-600 font-mono block mb-1">TRX_{t.id}</span>
                        <p className="text-sm font-bold text-white mb-1">{t.client}</p>
                        <p className="text-xs font-mono text-cyan-500/70">{t.weight} KG</p>
                      </div>
                      <button className="bg-white/5 hover:bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded transition-all uppercase tracking-tighter border border-white/5">Start Batch</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
