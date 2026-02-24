"use client";
import React, { useState } from 'react';

export const AutoFaq = ({ faqData }: { faqData?: {q: string, a: string}[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (!faqData || faqData.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-[#F5F5F7]">
      <div className="max-w-[800px] mx-auto">
        <div className="text-center mb-12">
            <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">AI Insights</span>
            <h2 className="text-4xl font-serif font-medium text-gray-900">最新のよくあるご質問</h2>
            <p className="text-sm text-gray-500 mt-4">皆様からのお問い合わせログを元に、AIが毎日更新しています。</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:border-[#D32F2F] transition-colors">
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full text-left px-6 py-5 font-bold text-gray-800 flex justify-between items-center"
              >
                <span className="flex gap-4 items-start">
                    <span className="text-[#D32F2F] font-black">Q.</span>
                    {faq.q}
                </span>
                <span className={`text-xl font-light transition-transform duration-300 ${openIdx === idx ? 'rotate-45 text-[#D32F2F]' : 'text-gray-400'}`}>+</span>
              </button>
              
              <div className={`px-6 pb-5 pt-0 text-sm text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${openIdx === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 p-0'}`}>
                <div className="flex gap-4 items-start border-t border-gray-100 pt-4">
                    <span className="text-blue-600 font-black">A.</span>
                    <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
