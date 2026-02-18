"use client";

import React, { useState, useEffect } from 'react';
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { RealChart } from './components/features/RealChart';
import { Simulator } from './components/features/Simulator';
import { PriceList } from './components/features/PriceList';
import { ServiceCriteria } from './components/features/ServiceCriteria';
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

  useEffect(() => {
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { if(d.status === 'success') setData(d); })
      .catch(err => console.error(err));
  }, []);

  const marketPrice = data?.config?.market_price || 0;

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

  if (view === 'ADMIN') return <AdminDashboard data={data} setView={setView} />;
  if (view === 'MEMBER') return <MemberDashboard user={user} data={data} setView={setView} />;

  // 共通レイアウト (COMPANY, CONTACT)
  if (view === 'COMPANY' || view === 'CONTACT') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
        <GlobalNav setView={setView} view={view} />
        {view === 'COMPANY' ? <Company /> : <Contact />}
        <FatFooter setView={setView} />
      </div>
    );
  }

  // LP (トップページ)
  return (
    // ⚠️重要: ここから pt-20 を削除しました。これでヘッダーの下に画像が配置されます。
    <div className="min-h-screen bg-white text-[#111] font-sans">
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
                    <img src={IMAGES.hero} className="w-full h-full object-cover opacity-90" alt="Factory" />
                    {/* グラデーション: 文字が見やすいように調整 */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#D32F2F_0%,#D32F2F_35%,rgba(211,47,47,0.7)_65%,transparent_100%)] z-10"></div>
                    <div className="absolute inset-0 bg-[#D32F2F]/10 mix-blend-overlay z-10"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-20">
                    {/* PCレイアウト: ヘッダー被りを避けるため内部で余白を取る */}
                    <div className="grid lg:grid-cols-12 gap-12 items-center pt-24">
                        <div className="lg:col-span-7 space-y-8">
                            <div className="inline-flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-white"></span>
                                <span className="text-white/90 text-xs font-bold tracking-[0.3em] uppercase">Est. 1961 Tomakomai</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] drop-shadow-md">
                                資源を、<br/>あるべき<span className="border-b-4 border-white/40 pb-2">価値</span>へ。
                            </h1>
                            <p className="text-white text-sm md:text-base max-w-lg leading-loose font-sans font-medium drop-shadow-sm">
                                株式会社 月寒製作所は「技術」と「信頼」で、リサイクルインフラを支えます。独自のナゲットプラントによる中間コストの排除が、高価買取の根拠です。
                            </p>
                            <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                <a href="#price-list" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition text-center shadow-xl">
                                    本日の買取価格
                                </a>
                                <a href="#contact" className="border border-white text-white px-8
