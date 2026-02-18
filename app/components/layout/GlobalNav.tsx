"use client";
import React, { useState, useEffect } from 'react';

// ナビゲーションの型定義
type NavItem = {
  label: string;
  href?: string;
  action?: () => void;
  isButton?: boolean;  // ボタンとして表示するか
  isPrimary?: boolean; // 強調ボタン（LOGINなど）にするか
};

export const GlobalNav = ({ setView, view }: { setView: any, view: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDarkText = scrolled || view !== 'LP' || mobileMenuOpen;

  // ★修正: メニュー構造を「全てのナビゲーション」を含む完全なリストに変更
  const navItems: NavItem[] = [
    { label: 'TOP', action: () => setView('LP') },
    { label: '買取価格', href: '#price-list' },
    { label: 'ご利用の流れ', action: () => setView('FLOW') },      // 追加: FlowGuideへ
    { label: '会員制度', action: () => setView('MEMBERSHIP') },    // 追加: MembershipGuideへ
    { label: '会社概要', action: () => setView('COMPANY') },
    { label: 'お問い合わせ', action: () => setView('CONTACT') },
    // LOGINもデータとして管理し、レスポンシブ対応を完璧にする
    { label: 'LOGIN', action: () => setView('LOGIN'), isButton: true, isPrimary: true }, 
  ];

  // 共通のクリックハンドラ
  const handleItemClick = (item: NavItem) => {
    if (item.action) item.action();
    setMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || view !== 'LP' ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
        
        {/* ロゴエリア */}
        <div 
          className="cursor-pointer group relative z-50" 
          onClick={() => { setView('LP'); setMobileMenuOpen(false); }}
        >
          <div className="flex items-end gap-2">
             <h1 className={`text-2xl font-serif font-bold tracking-tight transition-colors ${isDarkText ? 'text-black' : 'text-white'}`}>
               月寒製作所
             </h1>
             <span className={`text-xs font-bold mb-1 transition-colors ${isDarkText ? 'text-gray-500' : 'text-white/80'}`}>
               (苫小牧工場)
             </span>
          </div>
          <p className={`text-[10px] tracking-widest uppercase transition-colors ${isDarkText ? 'text-[#D32F2F]' : 'text-white/60'}`}>
             Tsukisamu Mfg.
          </p>
        </div>

        {/* PCナビゲーション (配列から自動生成) */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, i) => {
            // ボタンスタイルの場合 (LOGIN)
            if (item.isButton) {
              return (
                <button 
                  key={i} 
                  onClick={() => item.action && item.action()}
                  className={`border px-6 py-2 text-xs font-bold tracking-widest hover:bg-[#D32F2F] hover:border-[#D32F2F] hover:text-white transition ${
                    isDarkText ? 'border-black text-black' : 'border-white text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            }
            // 通常リンクの場合
            return item.href ? (
              <a 
                key={i} 
                href={item.href} 
                className={`text-sm font-bold tracking-wider hover:text-[#D32F2F] transition ${
                  isDarkText ? 'text-black' : 'text-white'
                }`}
              >
                {item.label}
              </a>
            ) : (
              <button 
                key={i} 
                onClick={() => item.action && item.action()} 
                className={`text-sm font-bold tracking-wider hover:text-[#D32F2F] transition ${
                  isDarkText ? 'text-black' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* モバイルメニューボタン */}
        <button className="md:hidden z-50 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`w-6 h-0.5 mb-1.5 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2 bg-black' : (isDarkText ? 'bg-black' : 'bg-white')}`}></div>
          <div className={`w-6 h-0.5 mb-1.5 transition-all ${mobileMenuOpen ? 'opacity-0' : (isDarkText ? 'bg-black' : 'bg-white')}`}></div>
          <div className={`w-6 h-0.5 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2 bg-black' : (isDarkText ? 'bg-black' : 'bg-white')}`}></div>
        </button>

        {/* モバイルメニュー展開 (配列から自動生成) */}
        <div className={`fixed inset-0 bg-white z-40 flex flex-col justify-center items-center transition-all duration-500 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
           <nav className="flex flex-col gap-8 text-center">
             {navItems.map((item, i) => {
                // スマホ用スタイル: ボタン(LOGIN)は大きく強調
                if (item.isButton) {
                    return (
                        <button 
                            key={i} 
                            onClick={() => handleItemClick(item)} 
                            className="text-xl font-bold text-[#D32F2F] mt-4 border border-[#D32F2F] px-8 py-3"
                        >
                            {item.label}
                        </button>
                    );
                }
                return item.href ? (
                    <a key={i} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-black hover:text-[#D32F2F]">
                        {item.label}
                    </a>
                ) : (
                    <button key={i} onClick={() => handleItemClick(item)} className="text-2xl font-bold text-black hover:text-[#D32F2F]">
                        {item.label}
                    </button>
                );
             })}
           </nav>
        </div>

      </div>
    </header>
  );
};
