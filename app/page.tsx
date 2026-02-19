"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 

// --- Components Import ---
import { GlobalNav } from './components/layout/GlobalNav';
import { FatFooter } from './components/layout/FatFooter';
import { Simulator } from './components/features/Simulator'; 
import { ServiceCriteria } from './components/features/ServiceCriteria'; 
import { AdminDashboard } from './components/admin/AdminDashboard'; 
import { MemberDashboard } from './components/member/MemberDashboard'; 
import { FlowGuide } from './components/features/FlowGuide'; 
import { MembershipGuide } from './components/features/MembershipGuide'; 
import { Company } from './components/features/Company'; 
import { Contact } from './components/features/Contact'; 
import { Concierge } from './components/features/Concierge';
import { PriceList } from './components/features/PriceList'; 

// Types
import { MarketData, UserData } from './types';

// Images
const IMAGES = {
  hero: "/images/mixed_wire.png", 
};

// 右側に表示する4品目データ
const HERO_RIGHT_ITEMS = [
    { name: '被覆電線', sub: 'INSULATED WIRE', img: '/images/items/vvf_cable.png', desc: 'VVF, CV, IV, ハーネス等' },
    { name: '銅スクラップ', sub: 'COPPER SCRAP', img: '/images/items/millberry.jpg', desc: 'ピカ線, 込銅, パイプ, 板' },
    { name: '砲金・バルブ', sub: 'GUNMETAL', img: '/images/items/bronze_valve.jpg', desc: 'バルブ, メーター, 軸受' },
    { name: '真鍮・黄銅', sub: 'BRASS', img: '/images/items/yellow_brass.jpg', desc: '蛇口, ナット, 仏具, 削粉' },
];

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
        <Concierge />
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
            {/* === HERO SECTION (RED THEME) === */}
            <section className="relative min-h-[600px] flex items-center bg-[#D32F2F] text-white overflow-hidden py-20 lg:py-0">
                {/* 背景: シンプルな赤色ベース + 薄い画像 */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#D32F2F] z-10"></div>
                    {/* 画像を薄く重ねてテクスチャ感を出す */}
                    <Image src={IMAGES.hero} alt="Factory" fill className="object-cover opacity-20 mix-blend-multiply" priority />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] opacity-90 z-20"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-30">
                    <div className="grid lg:grid-cols-12 gap-12 items-center pt-24">
                        
                        {/* 左側: メインコピー */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-white"></span>
                                <span className="text-white/90 text-xs font-bold tracking-[0.3em] uppercase">Est. 1961 Tomakomai</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] drop-shadow-sm">
                                資源を、<br/>あるべき<span className="border-b-4 border-white/40 pb-2">価値</span>へ。
                            </h1>
                            <p className="text-white text-sm md:text-base max-w-lg leading-loose font-sans font-medium">
                                株式会社 月寒製作所は「技術」と「信頼」で、リサイクルインフラを支えます。独自のナゲットプラントによる中間コストの排除が、高価買取の根拠です。
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <a href="#price-list" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition text-center shadow-lg rounded-full">
                                    本日の買取価格
                                </a>
                                <a href="#contact" className="border border-white text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-white hover:text-[#D32F2F] transition text-center rounded-full">
                                    お問い合わせ
                                </a>
                            </div>
                        </div>

                        {/* 右側: 主要4品目のみ表示 (建値削除) */}
                        <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                             {/* ガラス効果のあるコンテナ */}
                             <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
                                <h3 className="text-white font-bold tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-white/20 pb-3">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    MAIN HANDLING ITEMS
                                </h3>
                                
                                {/* 2x2グリッドで4品目を整列 */}
                                <div className="grid grid-cols-2 gap-4">
                                    {HERO_RIGHT_ITEMS.map((item, idx) => (
                                        <div key={idx} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-white transition-all shadow-md bg-black/20">
                                            {/* 画像 */}
                                            {item.img && (
                                              <Image 
                                                  src={item.img} 
                                                  alt={item.name} 
                                                  fill 
                                                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                                  sizes="(max-width: 768px) 50vw, 25vw"
                                              />
                                            )}
                                            {/* グラデーション & テキスト */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 w-full p-3">
                                                <p className="text-[9px] text-[#ffcccc] font-bold tracking-wider mb-0.5">{item.sub}</p>
                                                <h4 className="text-sm md:text-base font-bold text-white leading-tight mb-1">{item.name}</h4>
                                                <p className="text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </div>

                    </div>
                </div>
            </section>
            {/* === END HERO SECTION === */}

            <PriceList data={data} marketPrice={marketPrice} />
            
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
