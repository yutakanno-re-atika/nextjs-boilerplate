"use client";

import React, { useState, useEffect } from 'react';

// --- Components Import ---
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { RealChart } from './components/features/RealChart'; 
import { Simulator } from './components/features/Simulator'; 
import { ServiceCriteria } from './components/features/ServiceCriteria'; 
import { AdminDashboard } from './components/admin/AdminDashboard'; 
import { MemberDashboard } from './components/member/MemberDashboard'; 
import { FlowGuide } from './components/features/FlowGuide'; 
import { MembershipGuide } from './components/features/MembershipGuide'; 
import { Company } from './components/features/Company'; 
import { Contact } from './components/features/Contact'; 

// ★ここを修正しました (layout -> features)
import { Hero } from './components/features/Hero';          

import { MarketTicker } from './components/features/MarketTicker'; 
import { PriceList } from './components/features/PriceList'; 

import { MarketData, UserData } from './types';

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

  if (view === 'COMPANY' || view === 'CONTACT') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
        <GlobalNav setView={setView} view={view} />
        {view === 'COMPANY' ? <Company /> : <Contact />}
        <FatFooter setView={setView} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <GlobalNav setView={setView} view={view} />

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
            {/* New Hero Section */}
            <Hero />

            {/* New Market Ticker */}
            <MarketTicker data={data} />

            {/* Updated Price List */}
            <PriceList data={data} marketPrice={marketPrice} />

            {/* RealChart (Existing) */}
            <section className="py-12 bg-gray-50">
               <div className="container mx-auto px-4">
                  <h2 className="text-2xl font-bold text-center mb-8">相場推移チャート</h2>
                  <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <RealChart data={data} />
                  </div>
               </div>
            </section>

            {/* Existing Features */}
            <ServiceCriteria />
            <div id="simulator"><Simulator marketPrice={marketPrice} /></div>
        </>
      )}

      {view === 'FLOW' && <div className="pt-20"><FlowGuide /></div>}
      {view === 'MEMBERSHIP' && <div className="pt-20"><MembershipGuide /></div>}

      <FatFooter setView={setView} />
    </div>
  );
}
