"use client";

import React, { useState, useEffect } from 'react';

export default function WireMasterCloud() {
  const [role, setRole] = useState<'GUEST' | 'MEMBER' | 'ADMIN'>('GUEST');
  const [user, setUser] = useState<any>(null);
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('接続中...');

  // 1. 初期データロード（建値など）
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => {
        setDb(d);
        setMsg('オンライン');
      })
      .catch(() => setMsg('オフライン'));
  }, []);

  // 2. ログイン処理（ビジネス垢スプレッドシート準拠）
  const onLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
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
      alert("通信エラー");
    } finally {
      setLoading(false);
    }
  };

  const marketPrice = db?.config?.market_price ? Number(db.config.market_price).toLocaleString() : '---';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-black text-xl italic italic">月寒製作所 <span className="text-red-600 font-bold">苫小牧工場</span></div>
        <div className="text-right">
          <span className="text-[10px] text-gray-400 block font-bold uppercase">LME Copper</span>
          <span className="text-xl font-mono text-red-600 font-black">¥{marketPrice}</span>
        </div>
      </header>

      {role === 'GUEST' && (
        <main className="max-w-md mx-auto py-24 px-6 text-center">
          <div className="bg-white border-4 border-black p-10 rounded-2xl shadow-2xl transition-all hover:scale-[1.01]">
            <h2 className="text-3xl font-black mb-8 italic uppercase tracking-tighter">Business Auth</h2>
            <form onSubmit={onLogin} className="space-y-6 text-left">
              <input name="loginId" className="w-full p-4 bg-slate-100 rounded-xl border-none font-bold" placeholder="ID" required />
              <input name="password" type="password" className="w-full p-4 bg-slate-100 rounded-xl border-none font-bold" placeholder="PASS" required />
              <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-xl font-black text-lg hover:bg-black transition-all">
                {loading ? 'WAIT...' : 'ENTER SYSTEM'}
              </button>
            </form>
          </div>
          <p className="mt-8 text-[10px] text-slate-400 font-mono tracking-widest uppercase">{msg}</p>
        </main>
      )}

      {/* ADMINモード：現場管理コックピット */}
      {role === 'ADMIN' && (
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-black border-l-8 border-red-600 pl-4 uppercase italic">Admin Cockpit</h2>
            <button onClick={() => setRole('GUEST')} className="text-xs underline text-slate-400">Logout</button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl">
              <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase">Current Progress</p>
              <div className="text-4xl font-mono font-black">42% <small className="text-sm opacity-50">/ 30t</small></div>
            </div>
            <div className="bg-white border-2 p-8 rounded-3xl shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase">Avg Yield</p>
              <div className="text-4xl font-mono font-black text-cyan-600">64.2%</div>
            </div>
            <div className="bg-green-50 p-8 rounded-3xl border border-green-200 shadow-sm">
              <p className="text-[10px] font-bold text-green-600 mb-2 uppercase">Est. Profit</p>
              <div className="text-4xl font-mono font-black text-green-700">¥1.82M</div>
            </div>
          </div>
          <div className="bg-white p-12 rounded-3xl border-4 border-black text-center text-slate-400">
            ここに現場タスク(Transactions)を表示します
          </div>
        </main>
      )}

      {/* MEMBERモード：会員マイページ */}
      {role === 'MEMBER' && (
        <main className="max-w-4xl mx-auto py-12 px-6 space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <h2 className="text-4xl font-black italic tracking-tighter mb-4">{user.companyName} 様</h2>
            <div className="bg-white/10 inline-block px-6 py-3 rounded-2xl border border-white/5 text-2xl font-mono font-black">
              {Number(user.points).toLocaleString()} pt
            </div>
            <button onClick={() => setRole('GUEST')} className="absolute top-10 right-10 text-xs opacity-30 underline">Logout</button>
          </div>
        </main>
      )}
    </div>
  );
}
