"use client";
import React from 'react';

export const Company = () => {
  const companyInfo = {
    name: "株式会社 月寒製作所",
    enName: "TSUKISAMU MFG. CO., LTD.",
    president: "代表取締役社長　石田 俊平",
    address: "〒004-0871 北海道札幌市清田区平岡1条5丁目2番1号",
    established: "昭和36年 2月（1961年）",
    capital: "6,300万円",
    business: [
      "分電盤・制御盤・配電盤の設計・製造・販売",
      "各種銅合金の製造・販売",
      "産業廃棄物処理（廃プラ・金属）",
      "金属資源リサイクル事業"
    ]
  };

  const locations = [
    {
      name: "本社・配電盤事業部",
      address: "北海道札幌市清田区平岡1条5丁目2番1号",
      tel: "011-881-1116",
      fax: "011-882-4439",
      type: "head",
      icon: "⚡️"
    },
    {
      name: "原料事業部・苫小牧工場",
      address: "北海道苫小牧市一本松町9-6",
      tel: "0144-55-5544",
      fax: "0144-55-5545",
      type: "plant",
      icon: "♻️"
    }
  ];

  const history = [
    { year: "昭和36年 2月", event: "札幌市月寒にて設立（資本金1,250万円）" },
    { year: "昭和37年11月", event: "電気用品製造免許 取得" },
    { year: "昭和46年 4月", event: "三事業部制（配電・原料・砕石）とし経営基盤を強化" },
    { year: "昭和46年 9月", event: "本社・工場を現在地（清田区平岡）に移転" },
    { year: "昭和49年 9月", event: "苫小牧市に原料事業部工場を新設、銅合金二次精錬部門に進出" },
    { year: "昭和52年 2月", event: "苫小牧工場に銅線リサイクル工場を新設" },
    { year: "平成 3年 8月", event: "本社新工場建設、レーザー加工システム及び立体倉庫導入" },
    { year: "平成 9年 9月", event: "原料事業部苫小牧工場に銅線リサイクル新設備を導入" },
    { year: "平成13年 7月", event: "北海道知事許可により産業廃棄物処分業に進出" },
    { year: "平成14年 4月", event: "JSIA優良工場（日本配電盤工業会）に認定" },
    { year: "平成23年10月", event: "資本金6,300万円に増資" },
  ];

  const licenses = [
    "建設業許可：北海道知事許可（般-18）石第00857号",
    "産業廃棄物処分業許可：第00120077601号",
    "電気用品製造免許",
    "JSIA優良工場認定（日本配電盤工業会）",
    "ISO9001 認証取得（配電盤事業部）"
  ];

  return (
    <div className="w-full bg-white text-[#111] font-sans">
      {/* 1. Hero Section */}
      <section className="relative bg-[#D32F2F] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-transparent opacity-90"></div>
        {/* 背景画像があればここに配置 */}
        {/* <div className="absolute inset-0 z-0 opacity-20 mix-blend-multiply grayscale"><img src="..." alt="" className="w-full h-full object-cover" /></div> */}
        
        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          <div className="inline-block bg-white text-[#D32F2F] px-4 py-1 text-xs font-bold tracking-widest mb-4">COMPANY PROFILE</div>
          <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-6">
            信頼と技術の<br/>
            <span className="border-b-4 border-white/60">モノづくり</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 font-light tracking-wider leading-relaxed max-w-2xl">
            電気と金属の融合で、未来のインフラを支える。<br/>
            創業以来の変わらぬ使命です。
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
        
        {/* 2. Company Profile Table */}
        <section>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#D32F2F]">
            <span className="text-3xl">🏢</span>
            <h2 className="text-3xl font-serif font-bold tracking-wide">会社概要</h2>
          </div>
          
          <div className="border-t border-gray-200">
            <dl>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <dt className="bg-gray-100 font-bold py-5 px-6 flex items-center">商号</dt>
                <dd className="col-span-3 py-5 px-6 font-medium flex flex-col justify-center">
                  <span className="text-xl">{companyInfo.name}</span>
                  <span className="text-sm text-gray-500 font-normal tracking-wider mt-1">{companyInfo.enName}</span>
                </dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <dt className="bg-gray-100 font-bold py-5 px-6 flex items-center">代表者</dt>
                <dd className="col-span-3 py-5 px-6 flex items-center">{companyInfo.president}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <dt className="bg-gray-100 font-bold py-5 px-6 flex items-center">本社所在地</dt>
                <dd className="col-span-3 py-5 px-6 flex items-center">{companyInfo.address}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <dt className="bg-gray-100 font-bold py-5 px-6 flex items-center">設立</dt>
                <dd className="col-span-3 py-5 px-6 flex items-center">{companyInfo.established}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <dt className="bg-gray-100 font-bold py-5 px-6 flex items-center">資本金</dt>
                <dd className="col-span-3 py-5 px-6 flex items-center">{companyInfo.capital}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-200">
                <dt className="bg-gray-100 font-bold py-5 px-6 flex items-start pt-6">事業内容</dt>
                <dd className="col-span-3 py-5 px-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {companyInfo.business.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-[#D32F2F]"></span>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 3. Locations */}
        <section>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#D32F2F]">
            <span className="text-3xl">📍</span>
            <h2 className="text-3xl font-serif font-bold tracking-wide">事業所一覧</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {locations.map((loc, idx) => (
              <div key={idx} className="bg-white p-8 shadow-lg border-t-8 border-[#D32F2F] relative group overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-8xl opacity-5 group-hover:opacity-10 transition-opacity select-none">
                    {loc.icon}
                </div>
                <div className="relative z-10">
                    <h3 className="font-serif font-bold text-2xl mb-4 flex items-center gap-3">
                        <span className="text-3xl">{loc.icon}</span>
                        {loc.name}
                    </h3>
                    <p className="text-gray-600 mb-6 flex items-start gap-2 font-medium leading-relaxed">
                    <span className="text-[#D32F2F] mt-1">〒</span>
                    {loc.address}
                    </p>
                    <div className="space-y-3 pl-4 border-l-4 border-gray-100">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-white bg-[#D32F2F] px-3 py-1 tracking-widest">TEL</span>
                        <span className="font-mono text-xl font-bold tracking-wider">{loc.tel}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 tracking-widest">FAX</span>
                        <span className="font-mono text-lg text-gray-600 tracking-wider">{loc.fax}</span>
                    </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Licenses */}
        <section>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#D32F2F]">
            <span className="text-3xl">🏅</span>
            <h2 className="text-3xl font-serif font-bold tracking-wide">許認可・認証</h2>
          </div>
          <div className="bg-gray-50 p-8 border-l-8 border-[#D32F2F] shadow-inner">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {licenses.map((lic, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-[#D32F2F] mt-1 text-xl font-bold">✓</span>
                  <span className="text-lg font-medium">{lic}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. History */}
        <section>
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-[#D32F2F]">
            <span className="text-3xl">📜</span>
            <h2 className="text-3xl font-serif font-bold tracking-wide">沿革</h2>
          </div>
          <div className="border-l-4 border-gray-200 ml-4">
             {history.map((item, idx) => (
               <div key={idx} className="relative pl-8 py-4 group">
                 {/* タイムラインの丸ポチ */}
                 <div className="absolute top-1/2 -mt-2 -left-[11px] w-5 h-5 bg-[#D32F2F] rounded-full border-4 border-white transition-transform group-hover:scale-125"></div>
                 <div className="flex flex-col md:flex-row items-start md:items-center bg-white p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                   <div className="md:w-1/4 font-bold text-[#D32F2F] text-lg mb-1 md:mb-0 whitespace-nowrap font-mono">
                     {item.year}
                   </div>
                   <div className="md:w-3/4 font-medium text-gray-800 leading-relaxed">
                     {item.event}
                   </div>
                 </div>
               </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
};
