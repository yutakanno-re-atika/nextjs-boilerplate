"use client";
import React from 'react';
// lucide-react のインポートを削除

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
      icon: "⚡️" // アイコンを絵文字に変更
    },
    {
      name: "原料事業部・苫小牧工場",
      address: "北海道苫小牧市一本松町9-6",
      tel: "0144-55-5544",
      fax: "0144-55-5545",
      type: "plant",
      icon: "♻️" // アイコンを絵文字に変更
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
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* 1. Hero Section */}
      <div className="bg-[#1a237e] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom-left"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-widest mb-6">信頼の経営</h1>
          <p className="text-lg md:text-xl opacity-90 font-light tracking-wider leading-relaxed">
            信頼を礎に優れた製品を市場に提供する。<br/>
            電気と金属の融合で、未来のインフラを支えます。
          </p>
          <div className="mt-8 w-16 h-1 bg-yellow-400 mx-auto"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-16">
        
        {/* 2. Company Profile */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#1a237e] pb-2">
            <span className="text-2xl">🏢</span>
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">会社概要</h2>
          </div>
          
          <div className="bg-white shadow-lg rounded-sm overflow-hidden border border-gray-200">
            <dl className="divide-y divide-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <dt className="bg-gray-50 text-gray-600 font-bold py-4 px-6 md:border-r border-gray-100 flex items-center">商号</dt>
                <dd className="col-span-3 py-4 px-6 text-gray-800 font-medium">
                  {companyInfo.name}<br/>
                  <span className="text-sm text-gray-400 font-normal">{companyInfo.enName}</span>
                </dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <dt className="bg-gray-50 text-gray-600 font-bold py-4 px-6 md:border-r border-gray-100 flex items-center">代表者</dt>
                <dd className="col-span-3 py-4 px-6 text-gray-800">{companyInfo.president}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <dt className="bg-gray-50 text-gray-600 font-bold py-4 px-6 md:border-r border-gray-100 flex items-center">本社所在地</dt>
                <dd className="col-span-3 py-4 px-6 text-gray-800">{companyInfo.address}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <dt className="bg-gray-50 text-gray-600 font-bold py-4 px-6 md:border-r border-gray-100 flex items-center">設立</dt>
                <dd className="col-span-3 py-4 px-6 text-gray-800">{companyInfo.established}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <dt className="bg-gray-50 text-gray-600 font-bold py-4 px-6 md:border-r border-gray-100 flex items-center">資本金</dt>
                <dd className="col-span-3 py-4 px-6 text-gray-800">{companyInfo.capital}</dd>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <dt className="bg-gray-50 text-gray-600 font-bold py-4 px-6 md:border-r border-gray-100 flex items-center">事業内容</dt>
                <dd className="col-span-3 py-4 px-6 text-gray-800 leading-relaxed">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {companyInfo.business.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#1a237e] rounded-full"></span>
                        {item}
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
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#1a237e] pb-2">
            <span className="text-2xl">📍</span>
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">事業所一覧</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map((loc, idx) => (
              <div key={idx} className="bg-white p-6 shadow-md border-t-4 border-[#1a237e] hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <div className="text-2xl">{loc.icon}</div>
                    <h3 className="font-bold text-xl text-gray-800">{loc.name}</h3>
                </div>
                <p className="text-base text-gray-600 mb-4 flex items-start gap-2">
                  <span className="text-gray-400">〒</span>
                  {loc.address}
                </p>
                <div className="space-y-2 pl-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white bg-[#1a237e] px-2 py-0.5 rounded">TEL</span>
                    <span className="font-mono text-lg text-gray-800 font-bold">{loc.tel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">FAX</span>
                    <span className="font-mono text-gray-600">{loc.fax}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Licenses */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#1a237e] pb-2">
            <span className="text-2xl">🏅</span>
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">許認可・認証</h2>
          </div>
          <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenses.map((lic, idx) => (
                <li key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 transition-colors">
                  <span className="text-[#1a237e] mt-0.5">✔︎</span>
                  <span className="text-gray-700 font-medium">{lic}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. History */}
        <section>
          <div className="flex items-center gap-3 mb-6 border-b-2 border-[#1a237e] pb-2">
            <span className="text-2xl">📜</span>
            <h2 className="text-2xl font-bold text-gray-800 tracking-wide">沿革</h2>
          </div>
          <div className="bg-white shadow-sm border border-gray-200 p-2">
             {history.map((item, idx) => (
               <div key={idx} className={`flex flex-col md:flex-row p-4 hover:bg-gray-50 transition-colors ${idx !== history.length - 1 ? 'border-b border-gray-100' : ''}`}>
                 <div className="md:w-1/4 font-bold text-[#1a237e] mb-1 md:mb-0 whitespace-nowrap font-mono">
                   {item.year}
                 </div>
                 <div className="md:w-3/4 text-gray-700">
                   {item.event}
                 </div>
               </div>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
};
