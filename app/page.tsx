"use client";

import React, { useState, useEffect } from 'react';
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { RealChart } from './components/features/RealChart';
import { Simulator } from './components/features/Simulator';
import { PriceList } from './components/features/PriceList';
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

  // --- Login Logic (Keep it here for now) ---
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
  
  // 1. ADMIN & MEMBER VIEWS (Legacy Code - To be refactored later)
  if (view === 'ADMIN' || view === 'MEMBER') {
      return <div className="p-10 text-center">Dashboard Loaded (Component Split Pending) <button onClick={()=>setView('LP')}>Back</button></div>;
  }

  // 2. PUBLIC VIEWS
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
            
            {/* UPDATED: Price List Component */}
            <PriceList data={data} marketPrice={marketPrice} />
        </>
      )}

      {/* PLACEHOLDER PAGES */}
      {view === 'FLOW' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 px-6 bg-gray-50 min-h-[60vh]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-serif font-bold mb-8 text-[#111]">買取の流れ</h2>
                    <div className="p-12 bg-white border border-gray-200 shadow-sm">
                        <p className="text-gray-400 font-bold tracking-widest uppercase mb-4">COMING SOON</p>
                        <p className="text-sm text-gray-500">初めてのお客様でも安心・スムーズな買取フローをご案内するページを準備中です。<br/>現在は「お問い合わせ」より直接ご相談ください。</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl">1</div>
                            <div className="w-8 h-1 bg-gray-200 mt-8"></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl">2</div>
                            <div className="w-8 h-1 bg-gray-200 mt-8"></div>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 font-bold text-xl">3</div>
                        </div>
                    </div>
                </div>
            </div>
      )}

      {view === 'MEMBERSHIP' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-20 pb-32 px-6 bg-[#1a1a1a] text-white relative overflow-hidden min-h-[80vh]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a1a1a] via-[#D32F2F] to-[#1a1a1a]"></div>
                <div className="absolute -right-20 top-40 text-white/5 text-9xl font-serif font-bold select-none z-0" style={{writingMode: 'vertical-rl'}}>会員制度</div>
                <div className="max-w-[1200px] mx-auto relative z-10">
                <div className="text-center mb-20"><span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-4">Partnership Program</span><h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">アカウントを育てる。<br/>価値を最大化する。</h2><p className="text-gray-400 text-sm font-light tracking-wide leading-loose">取引量と品質に応じて、あなたの会員ランクは進化します。<br/>ランクアップに伴い、買取単価や待遇が優遇されるパートナーシップ制度です。</p></div>
                <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-20 text-center md:text-left"><div className="bg-white/5 border border-white/10 px-8 py-6 rounded-xl"><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Volume</p><p className="text-xl font-serif">取引数量</p></div><div className="text-2xl text-gray-600 font-serif">×</div><div className="bg-white/5 border border-white/10 px-8 py-6 rounded-xl"><p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Quality</p><p className="text-xl font-serif">分別品質</p></div><div className="text-2xl text-[#D32F2F] font-bold">＝</div><div className="flex items-center gap-4"><div><p className="text-[10px] text-[#D32F2F] uppercase tracking-widest mb-1">Rank Up</p><p className="text-2xl font-serif font-bold text-white">高価買取・優遇</p></div></div></div>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-[#222] border border-white/10 p-8 rounded-lg relative group hover:border-[#b87333] transition-colors duration-500"><div className="absolute top-0 left-0 w-full h-1 bg-[#b87333]"></div><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-serif text-[#b87333]">COPPER</h3><span className="text-[10px] bg-[#b87333]/20 text-[#b87333] px-2 py-1 rounded">一般会員</span></div><p className="text-xs text-gray-400 mb-8 h-12">初回取引後に発行されるスタンダードプラン。全ての基本機能をご利用いただけます。</p><ul className="space-y-3 text-sm text-gray-300"><li className="flex items-center gap-3"><span className="text-[#b87333] text-lg">●</span> ポイント付与 <span className="font-bold">1.0倍</span></li><li className="flex items-center gap-3"><span className="text-[#b87333] text-lg">●</span> Web明細確認</li></ul></div>
                    <div className="bg-[#222] border border-white/10 p-8 rounded-lg relative group hover:border-gray-400 transition-colors duration-500"><div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-serif text-gray-300">SILVER</h3><span className="text-[10px] bg-gray-400/20 text-gray-300 px-2 py-1 rounded">優良会員</span></div><p className="text-xs text-gray-400 mb-8 h-12">継続的なお取引と、安定した品質の荷込みをいただけるお客様向けのプラン。</p><ul className="space-y-3 text-sm text-gray-300"><li className="flex items-center gap-3"><span className="text-gray-400 text-lg">●</span> ポイント付与 <span className="font-bold text-white">1.2倍</span></li><li className="flex items-center gap-3"><span className="text-gray-400 text-lg">●</span> 優先荷下ろしレーン</li></ul></div>
                    <div className="bg-gradient-to-b from-[#2a2a2a] to-[#222] border border-yellow-600/30 p-8 rounded-lg relative group transform md:-translate-y-4 shadow-xl shadow-yellow-900/10"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 animate-pulse"></div><div className="flex justify-between items-start mb-6"><h3 className="text-2xl font-serif text-yellow-500 flex items-center gap-2"> GOLD</h3><span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded border border-yellow-500/30">特別会員</span></div><p className="text-xs text-gray-400 mb-8 h-12">大口取引、かつ分別品質が極めて高いプロフェッショナルなパートナー様へ。</p><ul className="space-y-4 text-sm text-white"><li className="flex items-center gap-3"><span className="text-yellow-500 text-lg">★</span> ポイント付与 <span className="font-bold text-yellow-400 text-lg">1.5倍</span></li><li className="flex items-center gap-3"><span className="text-yellow-500 text-lg">★</span> 買取単価 <span className="font-bold text-yellow-400 text-lg">特別優遇</span></li><li className="flex items-center gap-3"><span className="text-yellow-500 text-lg">★</span> 専用キャンペーン招待</li></ul></div>
                </div>
                </div>
            </div>
      )}

      {view === 'COMPANY' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 px-6 bg-gray-50 min-h-[60vh]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-[#111]">会社概要</h2>
                        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Corporate Profile</p>
                    </div>
                    <div className="bg-white p-12 border border-gray-200 shadow-sm space-y-8">
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">社名</span>
                            <span className="text-sm text-gray-600">株式会社 月寒製作所 苫小牧工場</span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">設立</span>
                            <span className="text-sm text-gray-600">1961年（昭和36年）</span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">所在地</span>
                            <span className="text-sm text-gray-600">〒053-0001 北海道苫小牧市一本松町9-6</span>
                        </div>
                        <div className="flex border-b border-gray-100 pb-4">
                            <span className="w-32 font-bold text-sm text-gray-800">事業内容</span>
                            <span className="text-sm text-gray-600">非鉄金属リサイクル、銅ナゲット製造、産業廃棄物収集運搬・処分</span>
                        </div>
                    </div>
                </div>
            </div>
      )}

      {view === 'CONTACT' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-32 px-6 bg-gray-50 min-h-[60vh]">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif font-bold mb-4 text-[#111]">お問い合わせ</h2>
                        <p className="text-xs tracking-[0.2em] text-gray-500 uppercase">Contact Us</p>
                    </div>
                    <form className="bg-white p-8 md:p-12 border border-gray-200 shadow-sm space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">御社名 / お名前</label>
                            <input className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#D32F2F] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">メールアドレス</label>
                            <input type="email" className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#D32F2F] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">お問い合わせ内容</label>
                            <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 p-4 outline-none focus:border-[#D32F2F] transition-colors"></textarea>
                        </div>
                        <button className="w-full bg-[#111] text-white py-4 font-bold tracking-widest hover:bg-[#D32F2F] transition-colors">送信する</button>
                    </form>
                </div>
            </div>
      )}

      <FatFooter setView={setView} />
    </div>
  );
}
