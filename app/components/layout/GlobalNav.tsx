"use client";
import React, { useState, useEffect } from 'react';

// 共通ナビゲーション
export const GlobalNav = ({ setView, view }: { setView: any, view: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // スクロール検知
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ナビゲーション項目
  const navItems = [
    { label: 'TOP', action: () => setView('LP') },
    { label: '買取価格', href: '#price-list' },
    { label: '選ばれる理由', href: '#simulator' },
    { label: '会社概要', action: () => setView('COMPANY') },
    { label: 'お問い合わせ', action: () => setView('CONTACT') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || view !== 'LP' ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
        
        {/* ロゴエリア */}
        <div 
          className="cursor-pointer group" 
          onClick={() => setView('LP')}
        >
          <div className="flex items-end gap-2">
             {/* メインロゴ */}
             <h1 className={`text-2xl font-serif font-bold tracking-tight transition-colors ${
               scrolled || view !== 'LP' ? 'text-black' : 'text-white'
             }`}>
               月寒製作所
             </h1>
             {/* 苫小牧工場表記 */}
             <span className={`text-xs font-bold mb-1 transition-colors ${
               scrolled || view !== 'LP' ? 'text-gray-500' : 'text-white/80'
             }`}>
               (苫小牧工場)
             </span>
          </div>
          {/* 英語表記 */}
          <p className={`text-[10px] tracking-widest uppercase transition-colors ${
             scrolled || view !== 'LP' ? 'text-[#D32F2F]' : 'text-white/60'
          }`}>
             Tsukisamu Mfg.
          </p>
        </div>

        {/* PCナビゲーション */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => (
            item.href ? (
              <a 
                key={i} 
                href={item.href} 
                className={`text-sm font-bold tracking-wider hover:text-[#D32F2F] transition ${
                  scrolled || view !== 'LP' ? 'text-black' : 'text-white'
                }`}
              >
                {item.label}
              </a>
            ) : (
              <button 
                key={i} 
                // 修正: item.actionが存在する場合のみ実行
                onClick={() => item.action && item.action()} 
                className={`text-sm font-bold tracking-wider hover:text-[#D32F2F] transition ${
                  scrolled || view !== 'LP' ? 'text-black' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            )
          ))}
          {/* ログインボタン */}
          <button 
            onClick={() => setView('LOGIN')} 
            className={`border px-6 py-2 text-xs font-bold tracking-widest hover:bg-[#D32F2F] hover:border-[#D32F2F] hover:text-white transition ${
              scrolled || view !== 'LP' ? 'border-black text-black' : 'border-white text-white'
            }`}
          >
            LOGIN
          </button>
        </nav>

        {/* モバイルメニューボタン (ハンバーガー) */}
        <button 
          className="md:hidden z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={`w-6 h-0.5 mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2 bg-black' : (scrolled || view !== 'LP' ? 'bg-black' : 'bg-white')}`}></div>
          <div className={`w-6 h-0.5 mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : (scrolled || view !== 'LP' ? 'bg-black' : 'bg-white')}`}></div>
          <div className={`w-6 h-0.5 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2 bg-black' : (scrolled || view !== 'LP' ? 'bg-black' : 'bg-white')}`}></div>
        </button>

        {/* モバイルメニュー展開 */}
        <div className={`fixed inset-0 bg-white z-40 flex flex-col justify-center items-center transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
           <nav className="flex flex-col gap-8 text-center">
             {navItems.map((item, i) => (
               item.href ? (
                 <a key={i} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-black hover:text-[#D32F2F]">{item.label}</a>
               ) : (
                 <button 
                    key={i} 
                    // 修正: item.actionが存在するかチェックしてから実行
                    onClick={() => { if(item.action) item.action(); setMobileMenuOpen(false); }} 
                    className="text-2xl font-bold text-black hover:text-[#D32F2F]"
                 >
                    {item.label}
                 </button>
               )
             ))}
             <button onClick={() => { setView('LOGIN'); setMobileMenuOpen(false); }} className="text-xl font-bold text-[#D32F2F] mt-4">関係者ログイン</button>
           </nav>
        </div>

      </div>
    </header>
  );
};
