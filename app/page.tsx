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
import { PriceList } from './components/features/PriceList'; 
import { Concierge } from './components/features/Concierge'; 

// Types
import { MarketData, UserData } from './types';

// Images
const IMAGES = {
  hero: "/images/mixed_wire.png", 
};

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
  
  // ★ デミス視点: システムの正確な状態管理のためのステート
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginPending, setIsLoginPending] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // 初回マウント時に相場データを取得
    setIsLoading(true);
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { 
        if(d.status === 'success') setData(d); 
      })
      .catch(err => {
        console.error("相場データ取得エラー:", err);
        // ★ ダリオ視点: 障害時もシステムを落とさないフォールバック
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // ★ イーロン視点: alertを排除し、シームレスなUXを追求
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoginPending(true);

    const form = e.currentTarget;
    const loginId = (form.elements.namedItem('loginId') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    try {
        const res = await fetch('/api/gas', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'AUTH_LOGIN', loginId, password }) 
        });
        
        if (!res.ok) throw new Error('ネットワークエラーが発生しました');
        
        const result = await res.json();
        
        if (result.status === 'success') {
          setUser(result.user);
          // 権限によるルーティング制御
          setView(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
        } else { 
          setLoginError(result.message || "IDまたはパスワードが正しくありません"); 
        }
    } catch(err: any) { 
        setLoginError("通信に失敗しました。電波状況を確認してください。");
        console.error("Login Error:", err);
    } finally {
        setIsLoginPending(false);
    }
  };

  // --- ルーティング（View制御） ---
  
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

  // --- メインLPレンダリング ---
  return (
    <div className="min-h-screen bg-white text-[#111] font-sans relative">
      {/* 画面全体のローディングオーバーレイ（初期データ取得時） */}
      {isLoading && view === 'LP' && (
        <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#D32F2F] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[#D32F2F] font-bold tracking-widest text-sm">LOADING MARKET DATA...</p>
            </div>
        </div>
      )}

      <GlobalNav setView={setView} view={view} />

      {/* ★ ログインモーダル改善: 現場の手袋でも押しやすいサイズ、エラーのインライン表示 */}
      {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm p-8 md:p-12 shadow-2xl relative border-t-4 border-[#D32F2F] rounded-b-lg animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={() => { setView('LP'); setLoginError(null); }} 
                className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition"
                aria-label="閉じる"
              >✕</button>
              
              <h2 className="text-xl font-serif text-[#D32F2F] mb-6 text-center font-bold tracking-widest">関係者ログイン</h2>
              
              {loginError && (
                <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-in slide-in-from-top-2">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <input 
                    name="loginId" 
                    className="w-full bg-gray-50 border-b-2 border-gray-200 p-4 text-lg outline-none focus:border-[#D32F2F] focus:bg-white transition" 
                    placeholder="ID" 
                    required 
                    disabled={isLoginPending}
                    autoComplete="username"
                  />
                </div>
                <div>
                  <input 
                    name="password" 
                    type="password" 
                    className="w-full bg-gray-50 border-b-2 border-gray-200 p-4 text-lg outline-none focus:border-[#D32F2F] focus:bg-white transition" 
                    placeholder="PASSWORD" 
                    required 
                    disabled={isLoginPending}
                    autoComplete="current-password"
                  />
                </div>
                <button 
                  disabled={isLoginPending}
                  className="w-full bg-[#111] text-white py-4 font-bold tracking-widest hover:bg-[#D32F2F] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex justify-center items-center h-14"
                >
                  {isLoginPending ? (
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : "ENTER"}
                </button>
              </form>
            </div>
          </div>
      )}

      {view === 'LP' && (
        <>
            {/* HERO SECTION */}
            <section className="relative min-h-[600px] flex items-center bg-[#D32F2F] text-white overflow-hidden py-20 lg:py-0">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[#D32F2F] z-10"></div>
                    <Image src={IMAGES.hero} alt="Factory" fill className="object-cover opacity-20 mix-blend-multiply" priority />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D32F2F] to-[#B71C1C] opacity-90 z-20"></div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 w-full relative z-30">
                    <div className="grid lg:grid-cols-12 gap-12 items-center pt-24">
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
                                <a href="#price-list" className="bg-white text-[#D32F2F] px-8 py-4 text-sm font-bold tracking-widest hover:bg-black hover:text-white transition text-center shadow-lg rounded-full active:scale-95">
                                    本日の買取価格
                                </a>
                                <a href="#contact" className="border border-white text-white px-8 py-4 text-sm font-bold tracking-widest hover:bg-white hover:text-[#D32F2F] transition text-center rounded-full active:scale-95">
                                    お問い合わせ
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                             <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
                                <h3 className="text-white font-bold tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-white/20 pb-3">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    MAIN HANDLING ITEMS
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {HERO_RIGHT_ITEMS.map((item, idx) => (
                                        <div key={idx} className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 hover:border-white transition-all shadow-md bg-black/20">
                                            {item.img && (
                                              <Image 
                                                  src={item.img} 
                                                  alt={item.name} 
                                                  fill 
                                                  className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                                  sizes="(max-width: 768px) 50vw, 25vw"
                                              />
                                            )}
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

            <PriceList data={data} marketPrice={marketPrice} />
            <ServiceCriteria />
            <div id="simulator"><Simulator marketPrice={marketPrice} /></div>
        </>
      )}

      {view === 'FLOW' && <div className="pt-20"><FlowGuide /></div>}
      {view === 'MEMBERSHIP' && <div className="pt-20"><MembershipGuide /></div>}

      {/* コンシェルジュはフローティングなので常時表示 */}
      <Concierge />

      <FatFooter setView={setView} />
    </div>
  );
}
