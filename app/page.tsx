"use client";

import React, { useState, useEffect } from 'react';

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
// コンポーネント: リアルタイムチャート (LP用デザイン)
// ==========================================
const RealChart = ({ data, color = "#D32F2F" }: {data: any[], color?: string}) => {
  const [activePoint, setActivePoint] = useState<any>(null);
  
  if (!data || data.length < 2) return <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">Loading Market Data...</div>;

  const maxVal = Math.max(...data.map((d: any) => d.value));
  const minVal = Math.min(...data.map((d: any) => d.value));
  const range = maxVal - minVal || 100;
  const yMax = maxVal + range * 0.2;
  const yMin = minVal - range * 0.2;
  const getX = (i: number) => (i / (data.length - 1)) * 100;
  const points = data.map((d: any, i: number) => `${getX(i)},${100 - ((d.value - yMin) / (yMax - yMin)) * 100}`).join(' ');

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
    <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-gray-100" onMouseLeave={() => setActivePoint(null)}>
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{formatDate(displayDate)}</p>
          <p className="text-4xl font-black text-[#1a1a1a] tracking-tighter">
            ¥{displayValue.toLocaleString()}
            <span className="text-sm text-gray-500 font-normal ml-1">/kg</span>
          </p>
        </div>
        <div className="text-right">
           <div className="text-green-600 font-bold text-xs flex items-center justify-end gap-1 animate-pulse"><Icons.ArrowUp /> REALTIME</div>
           <p className="text-[10px] text-gray-400 font-bold">LME Copper Price</p>
        </div>
      </div>
      <div className="h-32 w-full relative overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradLP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={`M ${points} L 100,100 L 0,100 Z`} fill="url(#chartGradLP)" />
          <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {data.map((d: any, i: number) => (
            <rect key={i} x={getX(i)-2} y="0" width="4" height="100" fill="transparent" onMouseEnter={() => setActivePoint(d)} />
          ))}
        </svg>
      </div>
    </div>
  );
};

// ==========================================
// メインコンポーネント
// ==========================================
export default function TsukisamuFactory() {
  const [view, setView] = useState<'LP' | 'LOGIN' | 'ADMIN' | 'MEMBER'>('LP');
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pika');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // シミュレーター用State
  const [simType, setSimType] = useState('');
  const [simWeight, setSimWeight] = useState('');
  const [simResult, setSimResult] = useState<any>(null);

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

  // シミュレーション計算ロジック
  const calculateSim = () => {
    if (!simType || !simWeight) return;
    const w = parseFloat(simWeight);
    const ratios: any = { 'high': 0.82, 'medium': 0.65, 'low': 0.45, 'mixed': 0.40 }; // 想定歩留まり
    const labels: any = { 'high': '高銅率 (80%~)', 'medium': '中銅率 (60-79%)', 'low': '低銅率 (40-59%)', 'mixed': '雑線・混合' };
    
    // 実際に建値連動させる (市場価格 * 歩留まり * 係数0.9など調整)
    const estimatedUnit = Math.floor(marketPrice * ratios[simType]); 
    const total = Math.floor(estimatedUnit * w);

    setSimResult({
      label: labels[simType],
      weight: w,
      unit: estimatedUnit,
      total: total
    });
  };

  // ----------------------------------------------------------------
  // 1. PUBLIC LANDING PAGE (RED & WHITE THEME)
  // ----------------------------------------------------------------
  if (view === 'LP' || view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">
        {/* Header */}
        <header className="fixed top-0 w-full bg-white/95 backdrop-blur shadow-sm z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
            <div className="leading-tight cursor-pointer" onClick={()=>setView('LP')}>
              <h1 className="text-lg font-bold text-gray-900">株式会社月寒製作所<br/><span className="text-[#D32F2F] text-sm">苫小牧工場</span></h1>
            </div>
            <nav className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
              <a href="#features" className="hover:text-[#D32F2F] transition">特徴</a>
              <a href="#simulator" className="hover:text-[#D32F2F] transition">買取シミュレーション</a>
              <a href="#types" className="hover:text-[#D32F2F] transition">電線の種類</a>
              <a href="#access" className="hover:text-[#D32F2F] transition">アクセス</a>
            </nav>
            <div className="flex gap-4 items-center">
              <a href="tel:0144555544" className="hidden md:flex items-center gap-2 bg-[#D32F2F] text-white px-5 py-2.5 rounded hover:bg-[#B71C1C] transition font-bold shadow-lg shadow-red-200">
                <Icons.Phone /> 0144-55-5544
              </a>
              <button onClick={() => setView('LOGIN')} className="text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded hover:bg-gray-50">MEMBER LOGIN</button>
            </div>
          </div>
        </header>

        {view === 'LOGIN' && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm p-8 rounded-2xl shadow-2xl relative">
              <button onClick={() => setView('LP')} className="absolute top-4 right-4 text-gray-400 hover:text-black">✕</button>
              <h2 className="text-2xl font-black text-center mb-6 text-gray-900">MEMBER LOGIN</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <input name="loginId" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-[#D32F2F]" placeholder="ID" required />
                <input name="password" type="password" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-[#D32F2F]" placeholder="PASSWORD" required />
                <button className="w-full bg-[#D32F2F] text-white py-4 rounded-lg font-black hover:bg-[#B71C1C] transition shadow-lg">ログイン</button>
              </form>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 bg-[url('https://images.unsplash.com/photo-1565610261709-5c5697d74556?auto=format&fit=crop&q=80')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex gap-3">
                <span className="bg-[#D32F2F] text-white px-3 py-1 text-xs font-bold rounded">創業1961年</span>
                <span className="bg-white/20 backdrop-blur px-3 py-1 text-xs font-bold rounded">北海道知事許可</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                繋げ、未来へ。<br/>
                <span className="text-[#D32F2F]">資源</span>を<span className="text-[#D32F2F]">価値</span>に。
              </h1>
              <p className="text-lg text-gray-300 font-medium max-w-lg">
                60年以上の実績と、独自の「銅ナゲットプラント」で中間マージンをカット。
                確かな目利きで、あなたの電線を適正価格で買い取ります。
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#simulator" className="bg-white text-[#D32F2F] px-8 py-4 rounded font-bold shadow-xl hover:bg-gray-100 transition flex items-center gap-2">
                  <Icons.Calc /> 買取価格シミュレーション
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              {/* チャート埋め込み */}
              <RealChart data={data?.history} />
              <div className="mt-4 flex gap-4">
                <div className="bg-black/60 backdrop-blur p-4 rounded-lg flex-1 border border-white/10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">本日の建値</p>
                  <p className="text-2xl font-mono font-black text-white">¥{Number(marketPrice).toLocaleString()}</p>
                </div>
                <div className="bg-black/60 backdrop-blur p-4 rounded-lg flex-1 border border-white/10">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">工場稼働状況</p>
                  <p className="text-2xl font-mono font-black text-green-500">受入可能 🟢</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-gray-900">選ばれる<span className="text-[#D32F2F] border-b-4 border-[#D32F2F]">4つの理由</span></h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { n: "01", t: "60年以上の実績", d: "1961年創業。長年のノウハウで、どのような電線でも正確に査定します。" },
                { n: "02", t: "自社ナゲット工場", d: "中間業者を通さず自社で銅を取り出すため、他社より高価買取が可能です。" },
                { n: "03", t: "透明な価格設定", d: "LME銅建値に完全連動。法人・個人問わず同一基準で公正に査定します。" },
                { n: "04", t: "幅広い対応力", d: "CV・IV・VVF・雑線など、ごちゃ混ぜの状態でもお任せください。" }
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded border border-gray-200 hover:-translate-y-2 hover:shadow-xl hover:border-[#D32F2F] transition-all duration-300">
                  <div className="w-16 h-16 bg-[#D32F2F] text-white text-2xl font-black flex items-center justify-center mb-6">{f.n}</div>
                  <h3 className="text-xl font-bold mb-4">{f.t}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simulator (Powered by System Data) */}
        <section id="simulator" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gray-50 border border-gray-200 p-8 md:p-12 rounded-2xl shadow-sm">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-4">買取価格<span className="text-[#D32F2F]">シミュレーター</span></h2>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left text-sm text-yellow-800">
                  <strong>⚠️ リアルタイム連動中</strong><br/>
                  現在の銅建値 <strong>¥{Number(marketPrice).toLocaleString()}/kg</strong> を基準に計算しています。
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block font-bold mb-2">被覆線の種類</label>
                  <select className="w-full p-4 border border-gray-300 rounded bg-white font-bold" value={simType} onChange={(e)=>setSimType(e.target.value)}>
                    <option value="">選択してください</option>
                    <option value="high">高銅率 (CVT/太物) - 80%~</option>
                    <option value="medium">中銅率 (IV/CV) - 60%~</option>
                    <option value="low">低銅率 (VVF/VA) - 40%~</option>
                    <option value="mixed">雑線・ミックス - 込真鍮など</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-2">重量 (kg)</label>
                  <input type="number" className="w-full p-4 border border-gray-300 rounded bg-white font-bold" placeholder="例: 100" value={simWeight} onChange={(e)=>setSimWeight(e.target.value)} />
                </div>
              </div>

              <button onClick={calculateSim} className="w-full bg-[#D32F2F] text-white font-bold py-5 rounded text-lg hover:bg-[#B71C1C] transition shadow-lg flex items-center justify-center gap-2">
                <Icons.Calc /> 査定額を計算する
              </button>

              {simResult && (
                <div className="mt-8 border-2 border-[#D32F2F] bg-white p-8 animate-in slide-in-from-top-4">
                  <div className="flex justify-between border-b border-gray-100 pb-4 mb-4">
                    <span className="text-gray-500 font-bold">{simResult.label}</span>
                    <span className="font-bold">{simResult.weight} kg</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-bold mb-2">概算買取総額 (税込)</p>
                    <p className="text-5xl font-black text-[#D32F2F] tracking-tight">
                      ¥{simResult.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">単価目安: ¥{simResult.unit.toLocaleString()}/kg</p>
                  </div>
                  <div className="mt-6 text-center">
                    <a href="tel:0144555544" className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-bold hover:bg-black transition">この価格で問い合わせる</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Wire Types (Tabs) */}
        <section id="types" className="py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-black text-center mb-12">取り扱い<span className="text-[#D32F2F]">線種一覧</span></h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['pika', 'cv', 'iv', 'vvf', 'mixed'].map((type) => (
                <button 
                  key={type}
                  onClick={() => setActiveTab(type)}
                  className={`px-6 py-3 font-bold rounded transition ${activeTab === type ? 'bg-[#D32F2F] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                >
                  {type === 'pika' ? 'ピカ線' : type === 'cv' ? 'CVケーブル' : type === 'iv' ? 'IV線' : type === 'vvf' ? 'VVF (VA)' : '雑線'}
                </button>
              ))}
            </div>

            <div className="bg-white p-8 md:p-12 rounded border border-gray-200 min-h-[400px] flex items-center">
              {activeTab === 'pika' && (
                <div className="grid md:grid-cols-2 gap-12 w-full animate-in fade-in">
                  <div className="bg-gray-100 h-64 rounded flex items-center justify-center text-gray-400 font-bold text-lg">写真: ピカ線</div>
                  <div>
                    <h3 className="text-2xl font-black mb-4">特1号銅線 (ピカ線)</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">被覆を剥いた純度の高い銅線。直径1.3mm以上のもの。酸化やメッキがない光沢のある状態。</p>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2"><span className="font-bold text-gray-500">特徴</span><span>最高値での買取対象</span></div>
                      <div className="flex justify-between border-b pb-2"><span className="font-bold text-gray-500">条件</span><span>油・塗料・エナメル付着なし</span></div>
                    </div>
                  </div>
                </div>
              )}
              {/* 他のタブも同様に実装可能 */}
              {activeTab !== 'pika' && (
                <div className="text-center w-full py-20 text-gray-400">
                  <p className="font-bold">その他の線種詳細データ ({activeTab})</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Company & Access */}
        <section id="access" className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black mb-8">会社情報</h2>
              <div className="space-y-6">
                <div className="flex gap-4 border-b border-gray-100 pb-4">
                  <span className="w-24 font-bold text-gray-500">社名</span>
                  <span>株式会社月寒製作所 苫小牧工場</span>
                </div>
                <div className="flex gap-4 border-b border-gray-100 pb-4">
                  <span className="w-24 font-bold text-gray-500">住所</span>
                  <span>〒053-0001 北海道苫小牧市一本松町9-6</span>
                </div>
                <div className="flex gap-4 border-b border-gray-100 pb-4">
                  <span className="w-24 font-bold text-gray-500">許可証</span>
                  <div className="text-sm">
                    北海道知事許可（般-18）石第00857号<br/>
                    産廃処分業許可 第00120077601号
                  </div>
                </div>
                <div className="flex gap-4 border-b border-gray-100 pb-4">
                  <span className="w-24 font-bold text-gray-500">設備</span>
                  <span>70t トラックスケール 2基 / ナゲットプラント</span>
                </div>
              </div>
            </div>
            <div className="h-[400px] bg-gray-100 rounded overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2931.5!2d141.6!3d42.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM5JzAwLjAiTiAxNDHCsDM2JzAwLjAiRQ!5e0!3m2!1sja!2sjp!4v1234567890" width="100%" height="100%" loading="lazy"></iframe>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1a1a1a] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-xl font-bold mb-4">株式会社月寒製作所 苫小牧工場</p>
            <p className="text-gray-500 text-sm">© 2026 TSUKISAMU MANUFACTURING CO., LTD. All Rights Reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // 2. ADMIN & MEMBER DASHBOARD (DARK MODE)
  // ※ここは以前のFactory OSデザインを維持
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
          {/* 这里に以前のFactory OSのメインコンテンツ (POS, Queueなど) が入ります */}
          {/* コードが長くなりすぎるため、LP統合の確認用として一旦簡略表示します */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">Dashboard <span className="text-gray-600">/ {isAdmin ? 'Processing' : 'My Page'}</span></h2>
            <div className="grid lg:grid-cols-2 gap-8">
               {/* Placeholders for actual Factory OS components */}
               <div className="bg-[#161b22] h-64 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest">POS System Module</div>
               <div className="bg-[#161b22] h-64 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-gray-600 font-bold uppercase tracking-widest">{isAdmin ? 'Batch Queue' : 'Quality Feedback'}</div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
