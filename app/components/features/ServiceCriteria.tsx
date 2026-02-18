"use client";
import React from 'react';

export const ServiceCriteria = () => {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <div className="text-center mb-16">
            <p className="text-[#D32F2F] font-bold text-xs tracking-[0.3em] font-sans mb-3">SERVICE POLICY</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black">
                買取・引取基準について
            </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* 持込買取 */}
            <div className="bg-gray-50 border border-gray-200 p-8 md:p-12 text-center group hover:border-[#D32F2F] transition-colors duration-300">
                <h3 className="text-lg font-bold text-black mb-4 flex justify-center items-center gap-2">
                    <span className="w-2 h-2 bg-black"></span>
                    持込買取 (Carry-in)
                </h3>
                <div className="mb-6">
                    <span className="text-5xl md:text-6xl font-black text-[#D32F2F] tracking-tighter">100</span>
                    <span className="text-xl font-bold text-black ml-1">kg〜</span>
                </div>
                <p className="text-sm text-gray-500 leading-loose mb-6">
                    苫小牧工場へ直接お持ち込みください。<br/>
                    トラックスケールで計量後、<strong className="text-black border-b border-[#D32F2F]">全て銀行振込にてお支払い</strong>いたします。
                </p>
                <div className="bg-white py-3 px-4 text-xs font-mono font-bold text-gray-600 border border-gray-200 inline-block">
                    平日 8:00 〜 17:00 (土日祝: 要相談)
                </div>
            </div>

            {/* 出張買取 */}
            <div className="bg-[#D32F2F] text-white p-8 md:p-12 text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8h-3V4H3v16h2v-2h10v2h2v-2h3v-8.34l-3-1.66zM5 6h10v2H5V6zm5 10H8v-2h2v2zm0-4H8v-2h2v2zm6 4h-2v-2h2v2zm0-4h-2v-2h2v2zm3 2.5L17.5 9h1.9l1.6 1.5V14.5z"/></svg>
                </div>
                <h3 className="text-lg font-bold mb-4 flex justify-center items-center gap-2 relative z-10">
                    <span className="w-2 h-2 bg-white"></span>
                    出張買取 (Pickup)
                </h3>
                <div className="mb-6 relative z-10">
                    <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">500</span>
                    <span className="text-xl font-bold text-white/80 ml-1">kg〜</span>
                </div>
                <p className="text-sm text-white/90 leading-loose mb-6 relative z-10">
                    北海道内全域、ユニック車等で回収に伺います。<br/>
                    工場・解体現場への引き取りも可能です。<br/>
                    <span className="text-xs opacity-75">※少量の場合は運搬費をご相談させていただく場合があります。</span>
                </p>
                <a href="tel:0144555544" className="inline-flex items-center gap-2 bg-white text-[#D32F2F] py-3 px-8 text-sm font-bold hover:bg-black hover:text-white transition-colors duration-300 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    0144-55-5544
                </a>
            </div>
        </div>

        {/* 補足アラート */}
        <div className="mt-12 p-6 bg-gray-50 border-l-4 border-black text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
            <p className="font-bold text-black mb-1">⚠️ 産業廃棄物マニフェストについて</p>
            当社でお取引いただく電線・非鉄金属は「有価物」としての買取となるため、原則としてマニフェストの発行は不要です。<br/>
            ただし、排出事業者様のご要望に応じて「計量証明書」「買取明細書」等の発行は可能です。
        </div>

      </div>
    </section>
  );
};
