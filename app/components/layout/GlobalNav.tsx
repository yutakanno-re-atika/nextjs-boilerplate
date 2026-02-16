"use client";
import React, { useState } from 'react';

export const GlobalNav = ({ setView, view }: { setView: (v: any) => void, view: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] transition-all duration-300 bg-white shadow-md border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
            <div className="cursor-pointer group" onClick={() => setView('LP')}>
                <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-500 mb-0.5 group-hover:text-[#D32F2F] transition-colors">Tsukisamu Mfg.</h1>
                <p className="text-xl font-serif font-bold tracking-widest leading-none text-black">月寒製作所</p>
            </div>

            <div className="hidden lg:flex items-center gap-10">
                {['HOME', 'FLOW', 'MEMBERSHIP', 'COMPANY', 'CONTACT'].map((item) => {
                    const viewTarget = item === 'HOME' ? 'LP' : item;
                    return (
                        <button 
                            key={item}
                            onClick={() => setView(viewTarget)}
                            className={`text-xs font-bold tracking-widest relative group py-2 ${view === viewTarget ? 'text-[#D32F2F]' : 'text-gray-500 hover:text-black'}`}
                        >
                            {item === 'FLOW' ? '買取の流れ' : item === 'MEMBERSHIP' ? '会員制度' : item === 'COMPANY' ? '会社概要' : item === 'CONTACT' ? 'お問い合わせ' : 'HOME'}
                            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#D32F2F] transition-all duration-300 ${view === viewTarget ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </button>
                    )
                })}
                <button onClick={() => setView('LOGIN')} className="bg-[#111] text-white text-[10px] px-6 py-2.5 rounded hover:bg-[#D32F2F] transition-all duration-300 uppercase tracking-widest font-bold shadow-lg">Login</button>
            </div>

            <div className="lg:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-black p-2">
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </div>
        </div>

        {isMenuOpen && (
            <div className="lg:hidden fixed inset-0 top-20 bg-white z-50 p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-200 shadow-xl border-t border-gray-100">
                 {['HOME', 'FLOW', 'MEMBERSHIP', 'COMPANY', 'CONTACT'].map((item) => {
                    const viewTarget = item === 'HOME' ? 'LP' : item;
                    return (
                        <button 
                            key={item}
                            onClick={() => { setView(viewTarget); setIsMenuOpen(false); }}
                            className="text-lg font-bold text-left border-b border-gray-100 pb-4 text-black"
                        >
                            {item === 'FLOW' ? '買取の流れ' : item === 'MEMBERSHIP' ? '会員制度' : item === 'COMPANY' ? '会社概要' : item === 'CONTACT' ? 'お問い合わせ' : 'HOME'}
                        </button>
                    )
                })}
                <button onClick={() => { setView('LOGIN'); setIsMenuOpen(false); }} className="w-full bg-[#D32F2F] text-white py-4 font-bold rounded">関係者ログイン</button>
            </div>
        )}
    </nav>
  );
};
