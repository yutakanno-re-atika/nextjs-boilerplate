"use client";
import React from 'react';

export const Contact = () => {
  return (
    <div className="w-full bg-white text-[#111] font-sans">
      {/* 1. Hero Section */}
      <section className="relative bg-[#D32F2F] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-transparent opacity-90"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block bg-white text-[#D32F2F] px-4 py-1 text-xs font-bold tracking-widest mb-4">CONTACT US</div>
          <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-6">
            お問い合わせ
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-light tracking-wider leading-relaxed max-w-2xl">
            お急ぎの場合はお電話にてお問い合わせください。<br/>
            原料の持ち込み・お見積りも随時承っております。
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
        
        {/* 2. Phone Contact (Priority) */}
        <section>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#D32F2F]">
            <span className="text-3xl">📞</span>
            <h2 className="text-3xl font-serif font-bold tracking-wide">お電話でのお問い合わせ</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tomakomai (Recycle) */}
            <div className="bg-white p-8 shadow-xl border-t-8 border-[#D32F2F] relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-serif font-bold group-hover:opacity-10 transition-opacity">RE</div>
               <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                 <span className="w-2 h-6 bg-[#D32F2F]"></span>
                 原料事業部・苫小牧工場
               </h3>
               <p className="text-sm text-gray-500 mb-6 pl-4">銅線・非鉄金属・産業廃棄物に関する件</p>
               
               <div className="pl-4">
                 <p className="text-4xl font-mono font-bold text-[#D32F2F] tracking-tighter mb-1">
                   0144-55-5544
                 </p>
                 <p className="text-sm text-gray-600 flex justify-between items-center border-t border-dashed border-gray-300 pt-2">
                   <span>FAX: 0144-55-5545</span>
                   <span className="text-xs bg-gray-100 px-2 py-1 rounded">平日 8:00 - 17:00</span>
                 </p>
               </div>
            </div>

            {/* Headquarters (Electric) */}
            <div className="bg-gray-50 p-8 border border-gray-200 border-t-8 border-gray-600 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 text-8xl font-serif font-bold group-hover:opacity-10 transition-opacity">HQ</div>
               <h3 className="text-xl font-bold text-gray-700 mb-2 flex items-center gap-2">
                 <span className="w-2 h-6 bg-gray-600"></span>
                 本社・配電盤事業部
               </h3>
               <p className="text-sm text-gray-500 mb-6 pl-4">配電盤・制御盤・総務に関する件</p>
               
               <div className="pl-4">
                 <p className="text-3xl font-mono font-bold text-gray-700 tracking-tighter mb-1">
                   011-881-1116
                 </p>
                 <p className="text-sm text-gray-600 flex justify-between items-center border-t border-dashed border-gray-300 pt-2">
                   <span>FAX: 011-882-4439</span>
                   <span className="text-xs bg-white px-2 py-1 rounded border">平日 8:30 - 17:30</span>
                 </p>
               </div>
            </div>
          </div>
        </section>

        {/* 3. Web Form */}
        <section>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#D32F2F]">
            <span className="text-3xl">✉️</span>
            <h2 className="text-3xl font-serif font-bold tracking-wide">メールフォーム</h2>
          </div>

          <form className="bg-white shadow-lg border border-gray-100 p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  会社名 <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded">任意</span>
                </label>
                <input type="text" className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="例）株式会社 月寒製作所" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  お名前 <span className="text-[10px] bg-[#D32F2F] text-white px-2 py-0.5 rounded">必須</span>
                </label>
                <input type="text" className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="例）月寒 太郎" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  メールアドレス <span className="text-[10px] bg-[#D32F2F] text-white px-2 py-0.5 rounded">必須</span>
                </label>
                <input type="email" className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="example@tsukisamu.co.jp" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  電話番号 <span className="text-[10px] bg-[#D32F2F] text-white px-2 py-0.5 rounded">必須</span>
                </label>
                <input type="tel" className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="090-0000-0000" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                お問い合わせ種別 <span className="text-[10px] bg-[#D32F2F] text-white px-2 py-0.5 rounded">必須</span>
              </label>
              <div className="relative">
                <select className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 appearance-none focus:outline-none focus:border-[#D32F2F] transition-colors">
                  <option>銅線・非鉄金属の買取について</option>
                  <option>産業廃棄物の処理について</option>
                  <option>ナゲットプラント視察のご依頼</option>
                  <option>配電盤・制御盤について</option>
                  <option>その他のお問い合わせ</option>
                </select>
                <div className="absolute right-4 top-4 text-gray-400 pointer-events-none">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                お問い合わせ内容 <span className="text-[10px] bg-[#D32F2F] text-white px-2 py-0.5 rounded">必須</span>
              </label>
              <textarea rows={6} className="w-full bg-gray-50 border-b-2 border-gray-200 p-3 focus:outline-none focus:border-[#D32F2F] transition-colors" placeholder="お問い合わせ内容をご記入ください。"></textarea>
            </div>

            <div className="pt-8 text-center">
              <button type="button" className="bg-[#111] text-white px-12 py-4 font-bold tracking-widest hover:bg-[#D32F2F] transition-colors shadow-xl">
                送信内容を確認する
              </button>
            </div>
          </form>
        </section>

      </div>
    </div>
  );
};
