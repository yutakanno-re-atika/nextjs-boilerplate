"use client";
import React, { useState } from 'react';

// アイコン
const Icons = {
  Phone: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Scale: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Bank: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>,
  ChevronDown: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
};

// フローデータ (運用に合わせて修正)
const STEPS = [
  { 
    id: 1, 
    title: '事前連絡・持ち込み', 
    desc: 'お持ち込みの際は、事前にお電話にてご連絡をお願いいたします。スムーズな受け入れ体制を整えてお待ちしております。',
    icon: <Icons.Phone />
  },
  { 
    id: 2, 
    title: '計量・検収', 
    desc: 'トラックスケールで正確に計量し、熟練スタッフが品目の検収（査定）を行います。',
    icon: <Icons.Scale />
  },
  { 
    id: 3, 
    title: 'お支払い', 
    desc: '検収完了後、指定の銀行口座へお振込みいたします。（※即日現金払いではございませんのでご注意ください）',
    icon: <Icons.Bank />
  },
];

// Q&Aデータ (修正済み)
const FAQS = [
  { q: '予約は必要ですか？', a: 'お持ち込みいただく際は事前連絡をお願いしています。トラックの待機時間短縮と安全確保のため、ご協力をお願いいたします。' },
  { q: '支払いはいつになりますか？', a: 'お持ち込みいただいた原料の検収後、銀行振り込みにて対応させていただきます。（大量持込や繁忙期の場合、数日お時間を頂く場合もございます。）' },
  { q: 'どのような状態の電線でも買取できますか？', a: '被覆がついたままで問題ありません。ただし、コネクタ、鉄、プラスチック等の「不純物」が付着している場合、歩留まり（銅の含有率）が下がるため、買取価格が下がる場合があります。' },
  { q: '個人でも持ち込めますか？', a: 'はい、個人様・法人様問わず大歓迎です。初回のみ、本人確認書類（運転免許証など）の提示をお願いしております。' },
  { q: '最低何kgから買取可能ですか？', a: '少量でも問題ありませんが、1kg未満の場合は計量誤差が出やすいため、ある程度まとめてのお持ち込みをおすすめしております。' },
  { q: '電線以外の金属も買取っていますか？', a: 'はい。銅、真鍮、砲金、給湯器、モーター、アルミ、ステンレス、鉛、バッテリーなど、非鉄金属全般を買取しております。鉄くずのみの持込はご遠慮いただいております。' },
];

export const FlowGuide = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen pt-20 pb-40">
      
      {/* Header */}
      <div className="bg-[#111] text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">買取の流れ</h2>
        <p className="text-gray-400 text-sm tracking-widest uppercase">FLOW & FAQ</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10">
        
        {/* STEPS CARD */}
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 mb-20 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-0"></div>

             {STEPS.map((step) => (
               <div key={step.id} className="relative text-center group">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 text-[#D32F2F]">
                   {step.icon}
                 </div>
                 <span className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 bg-[#D32F2F] text-white text-xs font-bold px-2 py-0.5 rounded-full">STEP {step.id}</span>
                 <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                 <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
               </div>
             ))}
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <span className="w-8 h-1 bg-[#D32F2F]"></span>
            よくあるご質問
            <span className="w-8 h-1 bg-[#D32F2F]"></span>
          </h3>

          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md bg-white">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-lg flex gap-4 items-center">
                  <span className="text-[#D32F2F] font-serif italic text-2xl">Q.</span>
                  {faq.q}
                </span>
                <span className={`transform transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''} text-gray-400`}>
                  <Icons.ChevronDown />
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${openFaq === idx ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-gray-600 leading-relaxed pl-14 border-t border-gray-50 bg-gray-50/50">
                  <span className="font-bold text-gray-800 mr-2">A.</span>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
           <p className="text-gray-500 mb-6">その他、ご不明な点がございましたらお気軽にお問い合わせください。</p>
           <a href="tel:0123-45-6789" className="inline-block bg-[#111] text-white px-8 py-4 rounded-full font-bold hover:bg-[#D32F2F] transition shadow-lg text-lg">
             0144-XX-XXXX (代表)
           </a>
        </div>

      </div>
    </div>
  );
};
