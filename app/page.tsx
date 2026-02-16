"use client";

import React, { useState, useEffect } from 'react';
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { RealChart } from './components/features/RealChart';
import { Simulator } from './components/features/Simulator';
import { PriceList } from './components/features/PriceList';
// ▼▼▼ ここが重要：作成したダッシュボードコンポーネントを読み込む ▼▼▼
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MemberDashboard } from './components/member/MemberDashboard';
import { MarketData, UserData } from './types';

// Images (Temporary placeholder)
const IMAGES = {
  hero: "/images/factory_floor.png",
  weight: "/images/weighing_station.jpg",
  nugget: "/images/copper_nugget.png",
  factory: "/images/factory_floor.png"
};

export default function WireMasterCloud() {
  const [view, setView] = useState<'LP' | 'LOGIN' | 'ADMIN' | 'MEMBER' | 'FLOW' | 'MEMBERSHIP' | 'COMPANY' | 'CONTACT'>('LP');
  const [data, setData] = useState<MarketData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Fetch Data on Load
  useEffect(() => {
    fetch('/api/gas').then(res => res.json()).then(d => { 
        if(d.status === 'success') {
            setData(d);
        }
    });
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // --- Login Logic ---
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

  // ----------------------------------------------------------------
  // RENDERING
  // ----------------------------------------------------------------
  
  // 1. ADMIN DASHBOARD (ここが修正ポイント：コンポーネントを表示)
  if (view === 'ADMIN') {
      return <AdminDashboard data={data} setView={setView} />;
  }

  // 2. MEMBER DASHBOARD (ここが修正ポイント：コンポーネントを表示)
  if (view === 'MEMBER') {
      return <MemberDashboard user={user} data={data} setView={setView} />;
  }

  // 3. PUBLIC VIEWS
  return (
    <div className="min-h-screen bg-white text-[#111] font-sans selection:bg-[#D32F2F] selection:text-white pt-20">
      <GlobalNav setView={setView} view={view} />

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

            <Simulator marketPrice={marketPrice} />
            <PriceList data={data} marketPrice={marketPrice} />
        </>
      )}

      {/* SUB PAGES (Placeholders) */}
      {['FLOW', 'MEMBERSHIP', 'COMPANY', 'CONTACT'].includes(view) && (
          <div className="py-40 text-center bg-gray-50 min-h-[60vh]">
              <h2 className="text-2xl font-serif mb-4">{view} PAGE</h2>
              <p className="text-gray-500">現在コンテンツ準備中です。</p>
          </div>
      )}

      <FatFooter setView={setView} />
    </div>
  );
}
