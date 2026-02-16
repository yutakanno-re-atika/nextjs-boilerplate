"use client";
import React from 'react';

export const FatFooter = ({ setView }: { setView: (v: any) => void }) => (
    <footer className="bg-[#111] text-white pt-20 pb-10 border-t border-[#D32F2F]">
        <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1 space-y-6">
                <div>
                    <h2 className="text-2xl font-serif font-bold tracking-widest mb-2">月寒製作所</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Tsukisamu Mfg. Tomakomai</p>
                </div>
                <div className="text-sm text-gray-400 font-light leading-loose">
                    <p>〒053-0001</p>
                    <p>北海道苫小牧市一本松町9-6</p>
                    <p className="mt-4 text-white font-bold text-lg font-serif">TEL: 0144-55-5544</p>
                    <p className="text-xs">FAX: 0144-55-5545</p>
                </div>
            </div>
            <div className="md:col-span-1">
                <h3 className="text-xs font-bold text-[#D32F2F] tracking-widest uppercase mb-6">Contents</h3>
                <ul className="space-y-4 text-sm text-gray-400">
                    <li><button onClick={()=>setView('LP')} className="hover:text-white transition-colors">ホーム</button></li>
                    <li><button onClick={()=>setView('FLOW')} className="hover:text-white transition-colors">買取の流れ</button></li>
                    <li><button onClick={()=>setView('MEMBERSHIP')} className="hover:text-white transition-colors">会員制度</button></li>
                    <li><button onClick={()=>setView('COMPANY')} className="hover:text-white transition-colors">会社概要</button></li>
                    <li><button onClick={()=>setView('CONTACT')} className="hover:text-white transition-colors">お問い合わせ</button></li>
                </ul>
            </div>
            <div className="md:col-span-1">
                <h3 className="text-xs font-bold text-[#D32F2F] tracking-widest uppercase mb-6">License</h3>
                <ul className="space-y-4 text-xs text-gray-500">
                    <li className="flex flex-col"><span className="text-gray-300 font-bold">北海道知事許可</span><span>（般-18）石第00857号</span></li>
                    <li className="flex flex-col"><span className="text-gray-300 font-bold">産業廃棄物処分業</span><span>第00120077601号</span></li>
                    <li className="flex flex-col"><span className="text-gray-300 font-bold">金属くず商許可</span><span>胆安第123号</span></li>
                    <li className="flex flex-col"><span className="text-gray-300 font-bold">適格請求書発行事業者</span><span>T1234567890123</span></li>
                </ul>
            </div>
            <div className="md:col-span-1 h-60 bg-gray-800 relative group overflow-hidden border border-white/10 rounded-sm">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2926.764576767676!2d141.67676767676767!3d42.67676767676767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDQwJzM2LjQiTiAxNDHCsDQwJzM2LjQiRQ!5e0!3m2!1sja!2sjp!4v1600000000000!5m2!1sja!2sjp" width="100%" height="100%" style={{border:0}} loading="lazy" className="grayscale group-hover:grayscale-0 transition duration-700"></iframe>
            </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-[10px] text-gray-500 tracking-widest font-mono">© 2026 TSUKISAMU MANUFACTURING CO., LTD. ALL RIGHTS RESERVED.</p>
        </div>
    </footer>
);
