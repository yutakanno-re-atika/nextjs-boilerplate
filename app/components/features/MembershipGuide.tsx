"use client";
import React from 'react';

const Icons = {
  Crown: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Chart: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  User: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Star: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
};

const RANKS = [
  {
    id: 'GENERAL',
    name: '一般会員',
    req: '登録のみ',
    bonus: '±0',
    color: 'bg-gray-100 border-gray-200 text-gray-600',
    desc: '初回登録ですぐに会員証を発行。買取履歴のWEB確認が可能になります。',
  },
  {
    id: 'SILVER',
    name: 'シルバー会員',
    req: '月間 300kg以上',
    bonus: '+2',
    color: 'bg-slate-200 border-slate-300 text-slate-700',
    desc: '定期的なお持ち込みがあるプロのお客様向け。全ての買取単価が自動でアップします。',
  },
  {
    id: 'GOLD',
    name: 'ゴールド会員',
    req: '月間 1,000kg以上',
    bonus: '+5',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    desc: '大口取引のパートナー様へ。業界最高水準の特別単価を適用いたします。',
  },
];

export const MembershipGuide = () => {
  return (
    <div className="bg-white min-h-screen pt-20 pb-40">
      
      {/* Header */}
      <div className="bg-[#111] text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">会員制度</h2>
        <p className="text-gray-400 text-sm tracking-widest uppercase">MEMBERSHIP PROGRAM</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10">
        
        {/* Intro Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 md:p-12 mb-20 relative z-10 text-center">
          <div className="w-20 h-20 bg-[#D32F2F] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icons.Crown />
          </div>
          <h3 className="text-2xl font-bold mb-4">使えば使うほど、お得になる。</h3>
          <p className="text-gray-500 leading-loose max-w-2xl mx-auto">
            月寒製作所では、定期的にお取引いただけるパートナー様を大切にしています。<br />
            月間の持ち込み量に応じてランクがアップし、買取単価が自動的に加算されるシステムです。<br />
            <span className="font-bold text-[#D32F2F]">入会金・年会費は一切かかりません。</span>
          </p>
        </div>

        {/* Rank Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {RANKS.map((rank) => (
            <div key={rank.id} className={`relative rounded-xl border-2 p-8 transition-transform hover:-translate-y-2 duration-300 ${rank.color.replace('bg-', 'bg-opacity-50 ')}`}>
               {rank.id === 'GOLD' && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D32F2F] text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                   <Icons.Star /> POPULAR
                 </div>
               )}
               <div className="text-center mb-6">
                 <h4 className="text-xl font-bold mb-2">{rank.name}</h4>
                 <p className="text-sm font-bold opacity-70 bg-white/50 inline-block px-3 py-1 rounded">{rank.req}</p>
               </div>
               
               <div className="bg-white rounded-lg p-6 text-center shadow-sm mb-6">
                 <p className="text-xs text-gray-400 mb-1">買取単価ボーナス</p>
                 <p className="text-4xl font-black text-[#D32F2F] flex items-baseline justify-center gap-1">
                   {rank.bonus}
                   <span className="text-sm text-gray-500 font-normal">円/kg</span>
                 </p>
               </div>

               <p className="text-sm leading-relaxed opacity-80">{rank.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits List */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <h3 className="text-3xl font-bold font-serif">会員限定の<br />3つのメリット</h3>
            <div className="space-y-6">
               <div className="flex gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-[#D32F2F]"><Icons.Chart /></div>
                 <div>
                   <h4 className="font-bold text-lg">WEBで履歴確認</h4>
                   <p className="text-gray-500 text-sm">過去の取引履歴、重量、金額をスマホからいつでも確認できます。インボイス対応の明細発行も可能です。</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-[#D32F2F]"><Icons.User /></div>
                 <div>
                   <h4 className="font-bold text-lg">専用レーンで優先案内</h4>
                   <p className="text-gray-500 text-sm">混雑時でも、会員様は優先レーンへご案内。待ち時間を大幅に短縮できます。</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0 text-[#D32F2F]"><Icons.Star /></div>
                 <div>
                   <h4 className="font-bold text-lg">特別キャンペーン</h4>
                   <p className="text-gray-500 text-sm">「銅建値+10円キャンペーン」など、会員様限定のゲリライベントに招待いたします。</p>
                 </div>
               </div>
            </div>
          </div>
          <div className="bg-gray-100 h-80 rounded-2xl flex items-center justify-center relative overflow-hidden group">
             {/* Decorative Background */}
             <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100"></div>
             <div className="relative z-10 text-center p-8">
                <p className="text-gray-400 text-sm mb-4">MEMBER'S CARD</p>
                <div className="bg-black text-white w-64 h-40 rounded-xl shadow-2xl mx-auto flex flex-col justify-between p-6 text-left transform group-hover:scale-105 transition duration-500">
                   <div className="flex justify-between items-start">
                      <span className="font-bold text-lg tracking-widest text-[#D32F2F]">FACTORY<span className="text-white">OS</span></span>
                      <Icons.Crown />
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-400">MEMBER ID</p>
                      <p className="font-mono text-lg tracking-widest">0000 1234 5678</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#111] text-white rounded-2xl p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#D32F2F] rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
           <h3 className="text-3xl font-bold mb-6 relative z-10">今すぐ、無料登録。</h3>
           <p className="text-gray-400 mb-8 max-w-lg mx-auto relative z-10">
             登録は店頭、またはLINEで完了します。<br />
             次回のお持ち込みから、すぐに会員特典が適用されます。
           </p>
           <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-[#D32F2F] hover:text-white transition duration-300 shadow-lg relative z-10">
             会員登録について問い合わせる
           </button>
        </div>

      </div>
    </div>
  );
};
