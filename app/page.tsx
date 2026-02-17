"use client";

import React, { useState, useEffect } from 'react';
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { RealChart } from './components/features/RealChart';
import { Simulator } from './components/features/Simulator';
import { PriceList } from './components/features/PriceList';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MemberDashboard } from './components/member/MemberDashboard';
import { FlowGuide } from './components/features/FlowGuide';
import { MembershipGuide } from './components/features/MembershipGuide';
import { Company } from './components/features/Company';
import { Contact } from './components/features/Contact';
import { MarketData, UserData } from './types';

// Images
const IMAGES = {
  hero: "/images/mixed_wire.png", 
};

export default function WireMasterCloud() {
  const [view, setView] = useState<'LP' | 'LOGIN' | 'ADMIN' | 'MEMBER' | 'FLOW' | 'MEMBERSHIP' | 'COMPANY' | 'CONTACT'>('LP');
  const [data, setData] = useState<MarketData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  // Fetch Data on Load
  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { 
        if(d.status === 'success') setData(d);
      })
      .catch(err => console.error(err));
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // --- Login Logic ---
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
        const res = await fetch('/api/gas', { 
            method: 'POST', 
            body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value }) 
        });
        const result = await res.json();
        if (result.status === 'success') {
          setUser(result.user);
          setView(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        } else { alert(result.message); }
    } catch(e) { alert("Login Error"); }
  };

  // RENDERING
  if (view === 'ADMIN') return <AdminDashboard data={data} setView={setView} />;
  if (view === 'MEMBER') return <MemberDashboard user={user} data={data} setView={setView} />;

  if (view === 'COMPANY') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
        <GlobalNav setView={setView} view={view} />
        <Company />
        <FatFooter setView={setView} />
      </div>
    );
  }

  if (view === 'CONTACT') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
        <GlobalNav setView={setView} view={view} />
        <Contact />
        <FatFooter setView={setView} />
      </div>
    );
  }

  // トップページ (LP)
  return (
    <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
      <GlobalNav setView={setView} view={view} />

      {/* ログインモーダル */}
      {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm p-12 shadow-2xl relative border-t-4 border-[#D32F2F]">
              <button onClick={() => setView('LP')} className="absolute top-6 right-6 text-gray-400 hover:text-black">✕</button>
              <h2 className="text-xl font-serif text-[#D32F2F] mb-8 text-center font-bold">関係者ログイン</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input name="loginId" className="w-full bg-gray-50 border-b p-3 outline-none focus:border-[#D32F2F] transition" placeholder="ID" required />
                <input name="password" type="password" className="w-full bg-gray-50 border-b p-3 outline-none focus:border-[#D32F2F] transition" placeholder="PASSWORD" required />
                <button className="w-full bg-[#111] text-white py-4 font-bold hover:bg-[#D32F2F] transition">ENTER</button>
              </form>
            </div>
          </div>
      )}

      {view === 'LP' && (
        <>
            {/* HERO SECTION */}
            <section className="relative min-h-[700px] flex items-center bg-black text-white overflow-hidden py-20 lg:py-0">
                <div className="absolute inset-0 z-0">
                    <img 
                      src={IMAGES.hero} 
                      className="w-full h-full object-cover opacity-80" 
                      alt="Copper Wire Recycling Factory" 
                    />
                    {/* グラデーション: 文字の視認性を確保 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10"></div>
                    {/* ブランドカラーの微細なオーバーレイ */}
                    <div className="absolute inset-0 bg-[#D32F2F]/10 mix-blend-overlay z-10"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-20">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        {/* LEFT COLUMN: COPY */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="inline-flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-[#D32F2F]"></span>
                                <span className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase">Est. 1961 Tomakomai</span>
                            </div>
                            
                            {/* ★ここを明朝体(font-serif)に指定★ */}
                            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1]">
                                資源を、<br/>
                                あるべき<span className="text-[#D32F2F]">価値</span>へ。
                            </h1>
                            
                            <p className="text-gray-300 text-sm md:text-base max-w-lg leading-loose font-sans">
                                株式会社 月寒製作所は「技術」と「信頼」で、リサイクルインフラを支えます。
                                独自のナゲットプラントによる中間コストの排除が、高価買取の根拠です。
                            </p>
                            
                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <a href="#price-list" className="bg-[#D32F2F] text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#B71C1C] transition text-center shadow-lg shadow-red-900/20">
                                    本日の買取価格
                                </a>
                                <a href="#contact" className="border border-white/30 text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-white hover:text-black transition text-center">
                                    お問い合わせ
                                </a>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: REAL CHART */}
                        <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                             <RealChart data={data} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Price List Section */}
            {/* ※PriceList内部の見出しも明朝体にしたい場合は、PriceList.tsx側で font-serif を指定してください */}
            <PriceList data={data} marketPrice={marketPrice} />

            {/* Simulator Section */}
            <div id="simulator">
                <Simulator marketPrice={marketPrice} />
            </div>
        </>
      )}

      {/* SUB PAGES */}
      {view === 'FLOW' && <FlowGuide />}
      {view === 'MEMBERSHIP' && <MembershipGuide />}

      <FatFooter setView={setView} />
    </div>
  );
}
