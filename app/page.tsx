"use client";

import React, { useState, useEffect } from 'react';
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { RealChart } from './components/features/RealChart'; // 建値一覧パネル
import { Simulator } from './components/features/Simulator';
import { PriceList } from './components/features/PriceList';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MemberDashboard } from './components/member/MemberDashboard';
import { FlowGuide } from './components/features/FlowGuide'; // ★新規追加: 買取の流れ
import { MarketData, UserData } from './types';

// Images
const IMAGES = {
  hero: "/images/image_4.png", // 新しい工場の画像
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

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
      <GlobalNav setView={setView} view={view} />

      {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[100] bg-[#D32F2F]/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm p-12 shadow-2xl relative">
              <button onClick={() => setView('LP')} className="absolute top-6 right-6 text-gray-400">✕</button>
              <h2 className="text-xl font-serif text-[#D32F2F] mb-8 text-center font-bold">関係者ログイン</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input name="loginId" className="w-full bg-gray-50 border-b p-3 outline-none" placeholder="ID" required />
                <input name="password" type="password" className="w-full bg-gray-50 border-b p-3 outline-none" placeholder="PASSWORD" required />
                <button className="w-full bg-[#111] text-white py-4 font-bold hover:bg-[#D32F2F] transition">ENTER</button>
              </form>
            </div>
          </div>
      )}

      {view === 'LP' && (
        <>
            {/* HERO SECTION */}
            <section className="relative h-[70vh] min-h-[500px] flex items-center bg-[#D32F2F] text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={IMAGES.hero} className="w-full h-full object-cover opacity-30 mix-blend-multiply grayscale" alt="Factory" />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-transparent opacity-90"></div>
                </div>
                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-8 space-y-8">
                        <div className="inline-block bg-white text-[#D32F2F] px-4 py-1 text-xs font-bold tracking-widest mb-2">SINCE 1961</div>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight">
                            資源を、<br/>あるべき<span className="border-b-4 border-white/60">価値</span>へ。
                        </h1>
                        <p className="text-white/90 text-sm md:text-base max-w-lg leading-loose border-l-2 border-white/30 pl-6">
                            月寒製作所は「目利き」と「技術」で、リサイクルインフラを支えます。<br/>
                            独自のナゲットプラントによる中間コストの排除が、高価買取の根拠です。
                        </p>
                        <div className="pt-4">
                            <a href="#simulator" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-[#111] hover:text-white transition shadow-xl">査定シミュレーション</a>
                        </div>
                    </div>
                </div>
            </section>

            <RealChart data={data} />
            <Simulator marketPrice={marketPrice} />
            <PriceList data={data} marketPrice={marketPrice} />
        </>
      )}

      {/* SUB PAGES */}
      {view === 'FLOW' && <FlowGuide />}  {/* ★修正ポイント */}

      {['MEMBERSHIP', 'COMPANY', 'CONTACT'].includes(view) && (
          <div className="py-40 text-center bg-gray-50 min-h-[60vh]">
              <h2 className="text-2xl font-serif mb-4">{view} PAGE</h2>
              <p className="text-gray-500">準備中</p>
          </div>
      )}

      <FatFooter setView={setView} />
    </div>
  );
}
