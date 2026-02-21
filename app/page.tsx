// @ts-nocheck
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

// ★ ここで新入社員（コンシェルジュ）を呼び出しています
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
  const [isLoading, setIsLoading] = useState(true); // ★ 追加：ロード中ステート

  const [loginError, setLoginError] = useState(''); // ★ 追加：ログインエラー表示用
  const [isLoggingIn, setIsLoggingIn] = useState(false); // ★ 追加：ログイン中ボタン状態用

  // ==========================================
  // ★ 1. 初期ロード時の「記憶復元」と「データ取得」
  // ==========================================
  useEffect(() => {
    // ローカルストレージから通行証を探す
    const savedUser = localStorage.getItem('factoryOS_user');
    const savedView = localStorage.getItem('factoryOS_view');

    if (savedUser && savedView) {
      setUser(JSON.parse(savedUser));
      setView(savedView as 'MEMBER' | 'ADMIN');
    }

    // データ取得
    fetch('/api/gas')
      .then(res => res.json())
      .then(d => { 
          if(d.status === 'success') setData(d); 
          setIsLoading(false);
      })
      .catch(err => {
          console.error(err);
          setIsLoading(false);
      });
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // ==========================================
  // ★ 2. ログイン処理 ＆「記憶書き込み」
  // ==========================================
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
        const res = await fetch('/api/gas', { 
            method: 'POST', 
            body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value }) 
        });
        const result = await res.json();
        if (result.status === 'success') {
          const userData = result.user;
          setUser(userData);
          const nextView = userData.role === 'ADMIN' ? 'ADMIN' : 'MEMBER';
          setView(nextView);
          
          // ブラウザの長期記憶に保存
          localStorage.setItem('factoryOS_user', JSON.stringify(userData));
          localStorage.setItem('factoryOS_view', nextView);
        } else { 
          setLoginError(result.message || 'ログインに失敗しました'); 
        }
    } catch(err) { 
        setLoginError("通信エラーが発生しました"); 
    }
    setIsLoggingIn(false);
  };

  // ==========================================
  // ★ 3. ログアウト処理
  // ==========================================
  const handleLogout = () => {
    setUser(null);
    setView('LP'); // ログアウトしたらLPに戻る
    localStorage.removeItem('factoryOS_user');
    localStorage.removeItem('factoryOS_view');
  };

  // ==========================================
  // 画面の振り分け（ルーティング）
  // ==========================================
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7]">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-[#D32F2F] rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold tracking-widest text-sm">LOADING...</p>
      </div>
    );
  }

  // ★ ダッシュボードには onLogout を渡す
  if (view === 'ADMIN') return <AdminDashboard data={data} setView={setView} onLogout={handleLogout} />;
  if (view === 'MEMBER') return <MemberDashboard user={user} data={data} setView={setView} onLogout={handleLogout} />;
  
  if (view === 'COMPANY' || view === 'CONTACT') {
    return (
      <div className="min-h-screen bg-white text-[#111] font-sans pt-20">
        <GlobalNav setView={setView} view={view} />
        {view === 'COMPANY' ? <Company /> : <Contact />}
        <FatFooter setView={setView} />
      </div>
    );
  }

  // ==========================================
  // LP（一般向けページ）とログインモーダルの表示
  // ==========================================
  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <GlobalNav setView={setView} view={view} />

      {/* ★ ログインモーダル（ボスのデザインにエラー表示などを追加） */}
      {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm p-12 shadow-2xl relative border-t-4 border-[#D32F2F]">
              <button onClick={() => setView('LP')} className="absolute top-6 right-6 text-gray-400 hover:text-black">✕</button>
              <h2 className="text-xl font-serif text-[#D32F2F] mb-6 text-center font-bold">関係者ログイン</h2>
              
              {loginError && (
                  <div className="bg-red-50 text-[#D32F2F] p-3 rounded text-xs font-bold mb-4 text-center border border-red-100">
                      {loginError}
                  </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <input name="loginId" className="w-full bg-gray-50 border-b p-3 outline-none focus:border-[#D32F2F] transition" placeholder="ID" required />
                <input name="password" type="password" className="w-full bg-gray-50 border-b p-3 outline-none focus:border-[#D32F2F] transition" placeholder="PASSWORD" required />
                <button disabled={isLoggingIn} className="w-full bg-[#111] text-white py-4 font-bold hover:bg-[#D32F2F] transition disabled:bg-gray-400">
                    {isLoggingIn ? '認証中...' : 'ENTER'}
                </button>
              </form>
            </div>
          </div>
      )}

      {/* ★ ボスのオリジナルLPデザイン */}
      {view === 'LP' && (
        <>
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
                                資源を、<br/>あるべき<span>価値</span>へ。
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

                        <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                             <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-2xl">
                                <h3 className="text-white font-bold tracking-widest text-xs mb-4 flex items-center gap-2 border-b border-white/20 pb-3">
                                    <span className="w-2 h-2 bg-white rounded-full"></span>
                                    強化買取実施中
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

      <Concierge />

      <FatFooter setView={setView} />
    </div>
  );
}
