"use client";

import React, { useState, useEffect } from 'react';

// ==========================================
// 画像パス定義 (拡張子を .png に修正)
// ==========================================
const IMAGES = {
  hero: "/images/factory_floor.png",      // .jpg -> .png
  pika: "/images/pika_wire.png",          // .jpg -> .png
  cv: "/images/cv_cable.png",             // .jpg -> .png
  iv: "/images/iv_cable.png",             // .jpg -> .png
  vvf: "/images/vvf_cable.png",           // .jpg -> .png
  mixed: "/images/mixed_wire.png",        // .jpg -> .png
  cabtire: "/images/cabtire_cable.png",   // .jpg -> .png
  weight: "/images/weighing_station.png", // .jpg -> .png
  nugget: "/images/copper_nugget.png"     // .jpg -> .png
};

// ==========================================
// コンポーネント: アイコン類
// ==========================================
const Icons = {
  Chart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  ArrowUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/></svg>,
  Calc: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14v4M12 14v4M8 14v4M16 10h.01M12 10h.01M8 10h.01"/></svg>,
  Phone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
  Check: () => <svg className="w-5 h-5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  ChevronDown: ({className}:{className?:string}) => <svg className={className} width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
};

// ==========================================
// コンポーネント: リアルタイムチャート
// ==========================================
const RealChart = ({ data, color = "#D32F2F" }: {data: any[], color?: string}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  if (!data || data.length < 2) return (
    <div className="h-32 w-full bg-black/20 backdrop-blur rounded-xl border border-white/10 flex items-center justify-center">
      <div className="text-white/50 text-xs font-bold animate-pulse">CONNECTING TO MARKET...</div>
    </div>
  );

  const maxVal = Math.max(...data.map((d: any) => d.value));
  const minVal = Math.min(...data.map((d: any) => d.value));
  const range = maxVal - minVal || 100;
  const yMax = maxVal + range * 0.2;
  const yMin = minVal - range * 0.2;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => `${getX(i)},${100 - ((d.value - yMin) / (yMax - yMin)) * 100}`).join(' ');

  // 日付フォーマット調整
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === 'NOW' || dateStr === 'No Data') return dateStr;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[0]}/${parts[1].padStart(2,'0')}/${parts[2].padStart(2,'0')}`;
    if (parts.length === 2) return `${new Date().getFullYear()}/${parts[0].padStart(2,'0')}/${parts[1].padStart(2,'0')}`;
    return dateStr;
  };

  const displayDate = activePoint ? activePoint.date : data[data.length - 1].date;
  const displayValue = activePoint ? activePoint.value : data[data.length - 1].value;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-2xl border-4 border-white/20" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{formatDate(displayDate)}</p>
          <p className="text-4xl font-black text-[#1a1a1a] tracking-tighter leading-none">
            ¥{displayValue.toLocaleString()}
            <span className="text-sm text-gray-500 font-normal ml-1">/kg</span>
          </p>
        </div>
        <div className="text-right">
           <div className="text-green-600 font-bold text-xs flex items-center justify-end gap-1 animate-pulse"><Icons.ArrowUp /> RISING</div>
           <p className="text-[10px] text-gray-400 font-bold">LME Copper Price</p>
        </div>
      </div>
      <div className="h-32 w-full relative overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradLP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.1"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={`M ${points} L 100,100 L 0,100 Z`} fill="url(#chartGradLP)" />
          <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {data.map((d: any, i: number) => (
            <rect key={i} x={getX(i)-2} y="0" width="4" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} />
          ))}
        </svg>
      </div>
    </div>
  );
};

// ==========================================
// サブコンポーネント: 線種詳細 (画像対応)
// ==========================================
const WireDetail = ({ img, title, desc, price }: {img:string, title:string, desc:string, price:string}) => (
  <div className="grid md:grid-cols-2 gap-12 w-full animate-in fade-in">
    <div className="h-64 rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
      <img src={img} alt={title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
    </div>
    <div className="flex flex-col justify-center">
      <h3 className="text-2xl font-black mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-6 leading-relaxed font-medium">{desc}</p>
      <div className="bg-[#D32F2F]/5 border-l-4 border-[#D32F2F] p-4">
        <p className="text-sm text-gray-500 font-bold mb-1">参考価格目安</p>
        <p className="text-xl font-black text-[#D32F2F]">{price}</p>
      </div>
    </div>
  </div>
);

// サブコンポーネント: 会社情報行
const InfoRow = ({ label, value }: {label:string, value:string}) => (
  <div className="flex gap-4 border-b border-gray-100 pb-4">
    <span className="w-24 font-bold text-gray-400 text-sm shrink-0">{label}</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

// ==========================================
// メインアプリケーション
// ==========================================
export default function TsukisamuFactory() {
  const [view, setView] = useState<'LP' | 'LOGIN' | 'ADMIN' | 'MEMBER'>('LP');
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pika');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // シミュレーター用
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

  // データ取得
  useEffect(() => {
    fetch('/api/gas').then(res => res.json()).then(d => { if(d.status === 'success') setData(d); });
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // ログイン処理
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await fetch('/api/gas', {
      method: 'POST', body: JSON.stringify({ action: 'AUTH_LOGIN', loginId: e.target.loginId.value, password: e.target.password.value })
    });
    const result = await res.json();
    if (result.status === 'success') {
      setUser(result.user);
      setView(result.user.role === 'ADMIN' ? 'ADMIN' : 'MEMBER');
    } else { alert(result.message); }
  };

  // シミュレーション計算
  const calculateSim = () => {
    if (!simType || !simWeight) return;
    const w = parseFloat(simWeight);
    const ratios: any = { 'pika': 0.98, 'high': 0.82, 'medium': 0.65, 'low': 0.45, 'mixed': 0.40 };
    const labels: any = { 'pika': 'ピカ線 (特1号)', 'high': '高銅率 (80%~)', 'medium': '中銅率 (60-79%)', 'low': '低銅率 (40-59%)', 'mixed': '雑線・混合' };
    
    const estimatedUnit = Math.floor(marketPrice * ratios[simType]); 
    const total = Math.floor(estimatedUnit * w);

    setSimResult({
      label: labels[simType],
      weight: w,
      unit: estimatedUnit,
      total: total
    });
  };

  const FAQ_ITEMS = [
    { q: "インボイス制度には対応していますか？", a: "はい、完全対応しております。適格請求書発行事業者として登録済みですので、法人のお客様も安心してご利用いただけます。" },
    { q: "被覆付きの電線でもそのまま持ち込めますか？", a: "もちろんです！当社は独自のナゲットプラントを保有しており、被覆銅線から純度99.9%の銅を回収する技術を持っています。" },
    { q: "基板や電子部品も買取可能ですか？", a: "はい。E-Scrapも高度な選別技術により金・銀・パラジウムなどの希少金属として評価・買取いたします。" },
    { q: "支払いはいつになりますか？", a: "検収完了後、その場で現金にてお支払いいたします。法人様で掛け売りをご希望の場合はご相談ください。" }
  ];

  // ----------------------------------------------------------------
  // 1. PUBLIC LANDING PAGE
  // ----------------------------------------------------------------
  if (view === 'LP' || view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-white text-[#1a1a1a] font-sans scroll-smooth selection:bg-red-100 selection:text-red-900">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur shadow-sm z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="leading-tight cursor-pointer group" onClick={()=>setView('LP')}>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight group-hover:opacity-70 transition">株式会社月寒製作所<br/><span className="text-[#D32F2F] text-sm font-bold">苫小牧工場</span></h1>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
              <a href="#features" className="hover:text-[#D32F2F] transition relative group">特徴<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span></a>
              <a href="#simulator" className="hover:text-[#D32F2F] transition relative group">買取シミュレーション<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span></a>
              <a href="#types" className="hover:text-[#D32F2F] transition relative group">電線の種類<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span></a>
              <a href="#access" className="hover:text-[#D32F2F] transition relative group">アクセス<span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#D32F2F] transition-all group-hover:w-full"></span></a>
            </nav>
            <div className="flex gap-4 items-center">
              <a href="tel:0144555544" className="hidden lg:flex items-center gap-2 bg-[#D32F2F] text-white px-5 py-2.5 rounded hover:bg-[#B71C1C] transition font-bold shadow-lg shadow-red-200">
                <Icons.Phone /> 0144-55-5544
              </a>
              <button onClick={() => setView('LOGIN')} className="text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded hover:bg-gray-50 uppercase tracking-widest">Login</button>
            </div>
          </div>
        </header>

        {/* Login Modal */}
        {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm p-10 rounded-2xl shadow-2xl relative">
              <button onClick={() => setView('LP')} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
              <h2 className="text-2xl font-black text-center mb-2 text-gray-900">MEMBER LOGIN</h2>
              <p className="text-xs text-center text-gray-500 mb-8 font-bold">取引先専用システムへアクセス</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="loginId" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-[#D32F2F] transition-colors" placeholder="ID" required />
                <input name="password" type="password" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-[#D32F2F] transition-colors" placeholder="PASSWORD" required />
                <button className="w-full bg-[#D32F2F] text-white py-4 rounded-lg font-black hover:bg-[#B71C1C] transition shadow-lg tracking-widest uppercase">Enter</button>
              </form>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 bg-gray-900 min-h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0">
             <img src={IMAGES.hero} alt="工場内部" className="w-full h-full object-cover opacity-30" />
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="text-white space-y-8 animate-in slide-in-from-left-4 duration-700">
              <div className="inline-flex gap-3 flex-wrap">
                <span className="bg-[#D32F2F] text-white px-3 py-1 text-xs font-bold rounded tracking-wider">創業1961年</span>
                <span className="bg-white/10 backdrop-blur border border-white/20 px-3 py-1 text-xs font-bold rounded tracking-wider">北海道知事許可</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                繋げ、未来へ。<br/>
                <span className="text-[#D32F2F]">資源</span>を<span className="text-[#D32F2F]">価値</span>に。
              </h1>
              <p className="text-lg text-gray-300 font-medium max-w-lg leading-relaxed">
                60年以上の実績と、独自の「銅ナゲットプラント」で中間マージンをカット。
                確かな目利きで、あなたの電線を適正価格で買い取ります。
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#simulator" className="bg-white text-[#D32F2F] px-8 py-4 rounded font-bold shadow-xl hover:bg-gray-100 transition flex items-center gap-2">
                  <Icons.Calc /> 買取価格シミュレーション
                </a>
              </div>
            </div>
            <div className="hidden lg:block animate-in slide-in-from-right-4 duration-700 delay-200">
              {/* チャート埋め込み */}
              <RealChart data={data?.history} />
              <div className="mt-4 flex gap-4">
                <div className="bg-black/60 backdrop-blur p-4 rounded-lg flex-1 border border-white/10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">本日の建値</p>
                  <p className="text-2xl font-mono font-black text-white">¥{Number(marketPrice).toLocaleString()}</p>
                </div>
                <div className="bg-black/60 backdrop-blur p-4 rounded-lg flex-1 border border-white/10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">工場稼働状況</p>
                  <p className="text-2xl font-mono font-black text-green-500 flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> 受入可能</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-16 text-gray-900 tracking-tight">選ばれる<span className="text-[#D32F2F] border-b-4 border-[#D32F2F] inline-block pb-1">4つの理由</span></h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { n: "01", t: "60年以上の実績", d: "1961年創業以来、被覆線取り扱いのノウハウを蓄積。熟練スタッフによる正確な査定。" },
                { n: "02", t: "自社ナゲット工場", d: "純度99.9%の銅ナゲットを自社製造。中間業者を通さず直接製錬所へ納品するため、高価買取を実現。" },
                { n: "03", t: "透明な価格設定", d: "銅建値に基づく公正な価格。法人・個人問わず同一基準で査定します。" },
                { n: "04", t: "幅広い対応力", d: "CV・IV・VVF・雑線など幅広く対応。ごちゃ混ぜの被覆線もOK。持ち込み・出張買取どちらも対応。" }
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded border border-gray-200 hover:-translate-y-2 hover:shadow-2xl hover:border-[#D32F2F]/30 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-[#D32F2F] text-white text-2xl font-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{f.n}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{f.t}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simulator */}
        <section id="simulator" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gray-50 border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">買取価格<span className="text-[#D32F2F]">シミュレーター</span></h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-sm text-yellow-800 font-medium inline-block rounded-r">
                  <strong>⚠️ リアルタイム連動中</strong><br/>
                  現在の銅建値 <strong>¥{Number(marketPrice).toLocaleString()}/kg</strong> を基準に計算しています。
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block font-bold mb-2 text-gray-700">被覆線の種類</label>
                  <select className="w-full p-4 border border-gray-300 rounded bg-white font-bold text-gray-900 focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]" value={simType} onChange={(e)=>setSimType(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="pika">ピカ線 (特1号)</option>
                    <option value="high">高銅率（80%以上）- CV高圧/太物</option>
                    <option value="medium">中銅率（60-79%）- CV/IV/VVF</option>
                    <option value="low">低銅率（40-59%）- 雑線/通信線</option>
                    <option value="mixed">ごちゃ混ぜ - ミックス</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2 text-gray-700">重量 (kg)</label>
                  <input type="number" className="w-full p-4 border border-gray-300 rounded bg-white font-bold text-gray-900 focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]" placeholder="例: 100" value={simWeight} onChange={(e)=>setSimWeight(e.target.value)} />
                </div>
              </div>

              <button onClick={calculateSim} className="w-full bg-[#D32F2F] text-white font-bold py-5 rounded text-lg hover:bg-[#B71C1C] transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95 duration-100">
                <Icons.Calc /> 査定額を計算する
              </button>

              {simResult && (
                <div className="mt-8 border-2 border-[#D32F2F] bg-white p-8 animate-in slide-in-from-top-4 duration-300 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between border-b border-gray-100 pb-4 mb-4">
                      <span className="text-gray-500 font-bold">{simResult.label}</span>
                      <span className="font-bold text-xl">{simResult.weight} kg</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 font-bold mb-2 uppercase tracking-widest">概算買取総額 (税込)</p>
                      <p className="text-5xl md:text-6xl font-black text-[#D32F2F] tracking-tight">
                        ¥{simResult.total.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400 mt-2 font-bold">単価目安: ¥{simResult.unit.toLocaleString()}/kg</p>
                    </div>
                    <div className="mt-8 text-center">
                      <a href="tel:0144555544" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition shadow-lg">この価格で問い合わせる</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Wire Types (Tabs) */}
        <section id="types" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-12 tracking-tight">取り扱い<span className="text-[#D32F2F]">線種一覧</span></h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['pika', 'cv', 'iv', 'vvf', 'mixed', 'cabtire'].map((type) => (
                <button 
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-6 py-3 font-bold rounded transition ${activeTab === type ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-200'}`}
                >
                  {type === 'pika' ? 'ピカ線' : type === 'cv' ? 'CVケーブル' : type === 'iv' ? 'IV線' : type === 'vvf' ? 'VVF (VA)' : type === 'mixed' ? '雑線' : 'キャブタイヤ'}
                </button>
              ))}
            </div>

            <div className="bg-white p-8 md:p-12 rounded border border-gray-200 min-h-[400px] flex items-center relative overflow-hidden">
              {activeTab === 'pika' && <WireDetail img={IMAGES.pika} title="特1号銅線 (ピカ線)" desc="被覆を剥いた純度の高い銅線。直径1.3mm以上のもの。酸化やメッキがない光沢のある状態。" price="最高値での買取対象" />}
              {activeTab === 'cv' && <WireDetail img={IMAGES.cv} title="CV・CVTケーブル" desc="架橋ポリエチレン絶縁ビニルシースケーブル。工場やビルの電力供給用。太くて重量があるため高価買取。" price="1,100円～1,450円/kg" />}
              {activeTab === 'iv' && <WireDetail img={IMAGES.iv} title="IVケーブル" desc="屋内配線用ビニル絶縁電線。建物内の配線に広く使用される。単線または撚り線。" price="1,150円～1,280円/kg" />}
              {activeTab === 'vvf' && <WireDetail img={IMAGES.vvf} title="VVFケーブル (VA線)" desc="ビニル絶縁ビニルシースケーブル平形。一般住宅の配線として最も一般的。" price="650円～750円/kg" />}
              {activeTab === 'mixed' && <WireDetail img={IMAGES.mixed} title="雑線・ミックス" desc="様々な種類の電線が混ざった状態。家電コードや通信線、LANケーブルなどが含まれていてもOK。" price="550円～750円/kg" />}
              {activeTab === 'cabtire' && <WireDetail img={IMAGES.cabtire} title="キャブタイヤケーブル" desc="ゴムやビニルで被覆された移動用ケーブル。工事現場や工場で使用される丈夫な電線。" price="銅率により変動" />}
            </div>
          </div>
        </section>

        {/* Company & Access */}
        <section id="access" className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black mb-8 text-gray-900">会社情報</h2>
              <div className="space-y-6 text-gray-600">
                <InfoRow label="社名" value="株式会社月寒製作所 苫小牧工場" />
                <InfoRow label="住所" value="〒053-0001 北海道苫小牧市一本松町9-6" />
                <InfoRow label="許可証" value="北海道知事許可（般-18）石第00857号 / 産廃処分業許可 第00120077601号" />
                <InfoRow label="設備" value="70t トラックスケール 2基 / ナゲットプラント / 剥離機" />
                <div className="pt-4 grid grid-cols-2 gap-4">
                   <div className="h-32 rounded-lg overflow-hidden border border-gray-100"><img src={IMAGES.weight} alt="計量所" className="w-full h-full object-cover" /></div>
                   <div className="h-32 rounded-lg overflow-hidden border border-gray-100"><img src={IMAGES.nugget} alt="銅ナゲット" className="w-full h-full object-cover" /></div>
                </div>
              </div>
            </div>
            <div className="h-[500px] bg-gray-100 rounded-2xl overflow-hidden shadow-inner relative">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2932.339790216788!2d141.6738927766324!3d42.69780077116297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f7566f07a092899%3A0x89e8360098f98072!2z44CSMDUzLTAwMDEg5YyX5rW36YGT6IuL5bCP54mn5biC5LiA5pys5p2-55S677yZ4oiS77yW!5e0!3m2!1sja!2sjp!4v1707727000000!5m2!1sja!2sjp" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded shadow-lg max-w-xs">
                 <p className="font-bold text-sm">苫小牧工場</p>
                 <p className="text-xs text-gray-600">大型トラックでの搬入もスムーズに行えます。</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1a1a1a] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-sm">
            <div>
              <h3 className="text-lg font-bold mb-4">株式会社月寒製作所 苫小牧工場</h3>
              <p className="text-gray-400 leading-relaxed mb-4">〒053-0001 北海道苫小牧市一本松町9-6</p>
              <p className="text-2xl font-bold">0144-55-5544</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">営業時間</h3>
              <p className="text-gray-400">平日 8:00～17:00</p>
              <p className="text-gray-400">定休日: 土日祝（要相談）</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">事業内容</h3>
              <ul className="text-gray-400 space-y-2">
                <li>非鉄金属リサイクル</li>
                <li>銅ナゲット製造</li>
                <li>分電盤・制御盤製造</li>
              </ul>
            </div>
          </div>
          <div className="text-center border-t border-white/10 mt-12 pt-8 text-gray-500 text-xs">
            © 2026 TSUKISAMU MANUFACTURING CO., LTD. All Rights Reserved.
          </div>
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. ADMIN & MEMBER DASHBOARD (DARK MODE)
  // ----------------------------------------------------------------
  if (view === 'ADMIN' || view === 'MEMBER') {
    const isAdmin = view === 'ADMIN';
    const progress = Math.min(Math.round(((data?.stats?.monthlyTotal || 0) / 30000) * 100), 100);

    return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-80 border-r border-white/5 bg-black/30 p-8 shrink-0 flex flex-col">
          <div className="font-black italic text-2xl text-white tracking-tighter mb-12">FACTORY <span className="text-cyan-500">OS</span></div>
          <div className="space-y-6 flex-1">
            {isAdmin && (
              <div className="bg-[#161b22] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Monthly Progress</span>
                 <div className="text-5xl font-mono font-black text-white">{progress}%</div>
                 <div className="w-full bg-black h-1 rounded-full overflow-hidden"><div className="bg-cyan-500 h-full" style={{width: `${progress}%`}}></div></div>
              </div>
            )}
            <div className="bg-[#161b22] p-6 rounded-3xl border border-white/5 space-y-4">
               <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block italic">LME Copper</span>
               <div className="text-3xl font-mono font-black text-red-500 italic">¥{Number(marketPrice).toLocaleString()}</div>
            </div>
            {/* User Info Card */}
            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Account</p>
              <p className="text-white font-bold text-lg">{user?.companyName}</p>
              <p className="text-cyan-500 text-xs font-bold mt-1">{user?.role} ACCESS</p>
            </div>
          </div>
          <button onClick={() => setView('LP')} className="mt-8 w-full py-4 text-[10px] font-black uppercase text-gray-500 border border-white/10 rounded-2xl hover:bg-white/5 hover:text-white transition-all tracking-widest">Logout</button>
        </aside>

        {/* Dashboard Main */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Dashboard <span className="text-gray-600">/ {isAdmin ? 'Processing' : 'My Page'}</span></h2>
            
            {isAdmin ? (
              // Admin View
              <div className="grid lg:grid-cols-2 gap-8">
                 <div className="bg-[#161b22] p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Queue Status</h3>
                    {data?.pending?.length > 0 ? (
                      <div className="space-y-4">
                        {data.pending.map((t:any) => (
                          <div key={t.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                            <div><span className="text-xs text-gray-500 block">ID: {t.id}</span><span className="text-white font-bold">{t.client}</span></div>
                            <span className="text-cyan-500 font-mono">{t.weight}kg</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-600 font-bold uppercase tracking-widest">All Tasks Cleared</div>
                    )}
                 </div>
                 <div className="bg-[#161b22] h-64 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest">POS System Module</div>
              </div>
            ) : (
              // Member View
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3"><span className="w-1.5 h-4 bg-red-600"></span>Quality Performance</h3>
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-5xl font-mono font-black text-white italic">64.2%</span>
                    <span className="text-green-500 font-black text-[10px] px-2 py-1 bg-green-500/10 rounded uppercase tracking-widest">Excellent</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium italic">前回の歩留まり結果は基準を上回りました。品質ボーナスを付与します。</p>
                </div>
                <div className="bg-[#161b22] border border-white/10 p-8 rounded-[2.5rem]">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-3"><span className="w-1.5 h-4 bg-cyan-500"></span>Membership Progress</h3>
                  <div className="w-full bg-black h-2.5 rounded-full overflow-hidden mb-6"><div className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full w-[72%] shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div></div>
                  <p className="text-[10px] text-right text-gray-500 font-bold uppercase tracking-[0.2em]">Next Rank Up: +245kg</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return null;
}
