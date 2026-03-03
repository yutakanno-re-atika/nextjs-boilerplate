// @ts-nocheck
import React, { useMemo, useState, useEffect, useRef } from 'react';

const Icons = {
    TrendingUp: () => <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    TrendingDown: () => <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    Minus: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>,
    Truck: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4-4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
    Radar: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Factory: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    Scale: () => <svg className="w-6 h-6 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    ArrowRight: () => <svg className="w-5 h-5 text-gray-300 group-hover:text-[#D32F2F] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
    Message: () => <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
    Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
    Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    Brain: () => <svg className="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-11h-2v2h2V9zm0 4h-2v6h2v-6z" /></svg>,
    Camera: () => <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    UploadCloud: () => <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
    const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm";
    switch (type) {
        case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">実測</span>;
        case 'CO_OP': return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">AI+人</span>;
        case 'AI_AUTO': return <span className={`${baseStyle} bg-gray-400`} title="AI予測・推論データ">AI推論</span>;
        default: return null;
    }
};

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    if (!data || data.length < 2) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 4;
    const width = 100;
    const height = 40;
    
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = max === min ? height / 2 : height - padding - ((d - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    }).join(' ');

    const fillPoints = `${width},${height} 0,${height} ${points}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-aspect-ratio-none" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon points={fillPoints} fill={`url(#grad-${color.replace('#', '')})`} />
            <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points.split(' ').pop()?.split(',')[0]} cy={points.split(' ').pop()?.split(',')[1]} r="2" fill={color} />
        </svg>
    );
};

const getDisplayName = (w: any) => {
    if (!w) return "不明な品目";
    let name = w.name;
    if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
    if (w.core && w.core !== '-') name += ` ${w.core}C`;
    return name;
};

// ★修正: 最強の時間フォーマッター (iOS Safariのバグも、変な文字列も強引に解析)
const formatTime = (val: any) => {
    if (!val) return '--:--';
    try {
        let d = new Date(val);
        if (typeof val === 'string') d = new Date(val.replace(/-/g, '/'));
        if (!isNaN(d.getTime())) {
            return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        }
        
        const strVal = String(val);
        const match = strVal.match(/(\d{1,2}):(\d{2})/);
        if (match) return `${match[1].padStart(2, '0')}:${match[2]}`;
        
        return '--:--';
    } catch(e) { return '--:--'; }
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
    
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [showAiData, setShowAiData] = useState(true);

    // ★修正: 複数画像アップロード用ステート
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);
    
    const cameraRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const copperPrice = Number(data?.config?.market_price) || 1450;
    const brassPrice = Number(data?.config?.brass_price) || 980;
    const zincPrice = Number(data?.config?.zinc_price) || 450;
    const leadPrice = Number(data?.config?.lead_price) || 380;
    const tinPrice = Number(data?.config?.tin_price) || 8900;
    const usdjpy = Number(data?.config?.usdjpy) || 150.00;
    const lmeCopper = Number(data?.config?.lme_copper_usd) || 9000;
    const jpyCopperPrice = Math.floor((lmeCopper * usdjpy) / 1000);

    const history = data?.history || [];
    const currentPrice = history.length > 0 ? Number(history[history.length - 1].value) : copperPrice;
    
    const extractSparkData = (key: string, fallbackPrice: number) => {
        const vals = history.map((h: any) => Number(h[key] || (key === 'copper' ? h.value : fallbackPrice)));
        return vals.length >= 7 ? vals.slice(-7) : [...Array(7 - vals.length).fill(fallbackPrice), ...vals];
    };

    const copperSparkData = extractSparkData('copper', copperPrice);
    const brassSparkData = extractSparkData('brass', brassPrice);
    const zincSparkData = extractSparkData('zinc', zincPrice);
    const leadSparkData = extractSparkData('lead', leadPrice);
    const tinSparkData = extractSparkData('tin', tinPrice);

    const getDiff = (sparkData: number[]) => {
        if (sparkData.length >= 2) return sparkData[sparkData.length - 1] - sparkData[sparkData.length - 2];
        return 0;
    };
    const copperDiff = getDiff(copperSparkData);

    const marketItems = [
        { label: '銅建値 (JX)', price: copperPrice, unit: '円/kg', diff: copperDiff, isPrimary: true, sparkData: copperSparkData, provenance: 'AI_AUTO' },
        { label: '真鍮建値 (日伸)', price: brassPrice, unit: '円/kg', diff: getDiff(brassSparkData), sparkData: brassSparkData, provenance: 'AI_AUTO' },
        { label: '亜鉛建値 (三井)', price: zincPrice, unit: '円/kg', diff: getDiff(zincSparkData), sparkData: zincSparkData, provenance: 'AI_AUTO' },
        { label: '鉛建値 (三菱)', price: leadPrice, unit: '円/kg', diff: getDiff(leadSparkData), sparkData: leadSparkData, provenance: 'AI_AUTO' },
        { label: '錫建値 (三菱)', price: tinPrice, unit: '円/kg', diff: getDiff(tinSparkData), sparkData: tinSparkData, provenance: 'AI_AUTO' },
        { label: 'LME銅 3M', price: lmeCopper, unit: 'USD/t', sub: `為替換算: 約¥${jpyCopperPrice}/kg`, provenance: 'AI_AUTO' },
    ];

    const activeReservations = localReservations.filter(r => r.status === 'RESERVED' || r.status === 'PROCESSING');
    const todayCount = activeReservations.length;
    const todayWeight = activeReservations.reduce((sum, r) => {
        let weight = 0;
        try {
            let items = r.items;
            if (typeof items === 'string') items = JSON.parse(items);
            if (Array.isArray(items)) { weight = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0); }
        } catch(e){}
        return sum + weight;
    }, 0);

    const { totalCopperStock, inventoryValue } = useMemo(() => {
        const productions = data?.productions || [];
        const producedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputCopper) || 0), 0);
        const unprocessedCopper = 3500; 
        const total = producedCopper + unprocessedCopper;
        return { totalCopperStock: total, inventoryValue: total * currentPrice };
    }, [data?.productions, currentPrice]);

    const { mCopper, monthlyAvgYield, yieldStats, targetMonthly, projectedCopper, progressPercent } = useMemo(() => {
        const productions = data?.productions || [];
        const targetMonthly = Number(data?.config?.target_monthly) || 30000;
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const currentDay = Math.max(1, today.getDate());
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const thisMonthProds = productions.filter((p: any) => {
            try { const d = new Date(p.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; } catch(e) { return false; }
        });

        const curCop = thisMonthProds.reduce((sum, p) => sum + (Number(p.outputCopper) || 0), 0);
        const mYield = thisMonthProds.length > 0 ? thisMonthProds.reduce((sum, p) => sum + (Number(p.actualRatio) || 0), 0) / thisMonthProds.length : 0;

        const recent = productions.slice(-10);
        let diffSum = 0, count = 0;
        recent.forEach((p: any) => {
            const actual = Number(p.actualRatio) || 0;
            const master = data?.wires?.find((w: any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
            const expected = master ? Number(master.ratio) : 0;
            if (actual > 0 && expected > 0) { diffSum += (actual - expected); count++; }
        });
        const avgDiff = count > 0 ? (diffSum / count) : 0;

        const projected = Math.round((curCop / currentDay) * daysInMonth);
        const progress = Math.min(100, Math.round((curCop / targetMonthly) * 100));

        return { 
            mCopper: curCop, 
            monthlyAvgYield: mYield, 
            yieldStats: { diff: avgDiff, isPositive: avgDiff >= 0 }, 
            targetMonthly, projectedCopper: projected, progressPercent: progress
        };
    }, [data?.productions, data?.wires, data?.config?.target_monthly]);

    const { win, lose, draw } = useMemo(() => {
        const comps = data?.competitorPrices || [];
        let win = 0, lose = 0, draw = 0;
        
        try {
            const rulesStr = data?.config?.pricing_rules;
            if (!rulesStr) return { win, lose, draw };
            
            const rules = JSON.parse(rulesStr);
            const latestComps: Record<string, any> = {};
            comps.forEach((c: any) => {
                if (!latestComps[c.name] || new Date(c.date) > new Date(latestComps[c.name].date)) latestComps[c.name] = c;
            });
            const compList = Object.values(latestComps);

            Object.keys(rules).forEach(item => {
                const rule = rules[item];
                let basePrice = rule.base === 'brass' ? brassPrice : copperPrice;
                const myPrice = Math.floor(basePrice * (Number(rule.ratio) / 100)) + Number(rule.offset);

                const compPrices = compList.map(c => {
                    try { 
                        let p = c.prices;
                        if (typeof p === 'string') p = JSON.parse(p);
                        if (typeof p === 'string') p = JSON.parse(p);
                        return p[item]; 
                    } catch(e) { return null; }
                }).filter(p => typeof p === 'number' && p > 0);
                
                if (compPrices.length > 0) {
                    const maxComp = Math.max(...compPrices);
                    if (myPrice > maxComp) win++;
                    else if (myPrice < maxComp) lose++;
                    else draw++;
                }
            });
        } catch(e) {}
        return { win, lose, draw };
    }, [data?.competitorPrices, data?.config?.pricing_rules, copperPrice, brassPrice]);

    const handlePrintReport = () => {
        setIsGeneratingReport(true);
        setTimeout(() => { window.print(); setIsGeneratingReport(false); }, 500);
    };

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader(); reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image(); img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX = 2000; let w = img.width; let h = img.height;
                    if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
                    canvas.width = w; canvas.height = h;
                    const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]); 
                };
                img.onerror = (e) => reject(e);
            };
            reader.onerror = (e) => reject(e);
        });
    };

    const handleMultiPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        
        setIsUploadingPhoto(true);
        setUploadProgress({ current: 0, total: files.length });
        setUploadedPhotoUrls([]);
        
        let uploaderId = 'Staff';
        try {
            const userStr = localStorage.getItem('factoryOS_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                uploaderId = user.companyName || user.clientId || 'Staff';
            }
        } catch(err) {}

        const newUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            setUploadProgress({ current: i + 1, total: files.length });
            try {
                const base64Data = await compressImage(files[i]);
                const payload = {
                    action: 'UPLOAD_STAFF_PHOTO',
                    uploaderId: uploaderId,
                    fileName: `Photo_${new Date().getTime()}_${i+1}.jpg`,
                    mimeType: 'image/jpeg',
                    data: base64Data
                };
                
                const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                const result = await res.json();
                
                if (result.status === 'success') {
                    newUrls.push(result.url);
                } else { alert(`画像 ${i+1}枚目のアップロード失敗: ` + result.message); }
            } catch (err) { alert(`画像 ${i+1}枚目の処理エラー: ` + err); }
        }
        
        setUploadedPhotoUrls(newUrls);
        setIsUploadingPhoto(false);
        e.target.value = ''; 
    };

    if (!isMounted) return null;

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 w-full text-gray-900 pb-24 font-sans bg-[#FAFAFA] min-h-screen relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
            
            <div className="print:hidden max-w-[1400px] mx-auto w-full">
                <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-6 px-2">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-3 font-serif tracking-tight">
                            <span className="w-1.5 h-6 bg-[#D32F2F] rounded-full"></span>
                            エグゼクティブ・ダッシュボード
                        </h2>
                        <p className="text-xs text-gray-500 mt-2 font-mono tracking-widest ml-4 uppercase font-bold">経営概況および重要指標</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-gray-300 shadow-sm">
                            <button onClick={() => setShowAiData(true)} className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>AI予測あり</button>
                            <button onClick={() => setShowAiData(false)} className={`px-4 py-1.5 text-xs font-bold font-mono transition-colors ${!showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>実測データのみ</button>
                        </div>
                        <button onClick={handlePrintReport} disabled={isGeneratingReport} className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50">
                            {isGeneratingReport ? <span className="animate-spin"><Icons.Refresh /></span> : <Icons.Print />}
                            日次レポート作成
                        </button>
                    </div>
                </header>

                <div className="mb-10 px-2 w-full">
                    <div className={`transition-opacity duration-300 ${showAiData ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
                        <div className="flex xl:grid xl:grid-cols-6 gap-4 overflow-x-auto xl:overflow-visible no-scrollbar pb-4 xl:pb-0 snap-x w-full">
                            {marketItems.map((m, i) => (
                                <div key={i} className={`snap-start relative bg-white border ${m.isPrimary ? 'border-[#D32F2F] shadow-md ring-1 ring-red-50' : 'border-gray-200 shadow-sm hover:border-gray-300'} rounded-sm p-4 transition-all duration-300 w-[180px] shrink-0 xl:w-auto xl:shrink flex flex-col justify-between overflow-hidden group`}>
                                    <div className="absolute top-2 right-2 z-20"><ProvenanceBadge type={m.provenance as any} /></div>
                                    {m.sparkData && (
                                        <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                            <Sparkline data={m.sparkData} color={m.isPrimary ? '#D32F2F' : '#D1D5DB'} />
                                        </div>
                                    )}
                                    <p className="text-xs font-bold text-gray-500 mb-2 relative z-10 whitespace-nowrap">{m.label}</p>
                                    <div className="flex items-baseline gap-1 relative z-10 whitespace-nowrap">
                                        <span className="text-2xl 2xl:text-3xl font-black text-gray-900 tracking-tighter">{m.price.toLocaleString()}</span>
                                        <span className="text-[10px] 2xl:text-xs text-gray-400 font-bold ml-1">{m.unit}</span>
                                    </div>
                                    {m.diff !== undefined ? (
                                        <div className="mt-2 text-xs font-bold flex items-center gap-1.5 relative z-10 whitespace-nowrap">
                                            {m.diff > 0 ? <><Icons.TrendingUp /><span className="text-[#D32F2F]">+{m.diff}</span></> : m.diff < 0 ? <><Icons.TrendingDown /><span className="text-gray-900">{m.diff}</span></> : <><Icons.Minus /><span className="text-gray-400">±0</span></>}
                                        </div>
                                    ) : m.sub ? (
                                        <div className="mt-2 text-[10px] text-gray-400 font-mono font-bold relative z-10 whitespace-nowrap truncate">{m.sub}</div>
                                    ) : (
                                        <div className="mt-2 h-4 relative z-10"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-2">
                    <div className="bg-[#111] text-white p-6 md:p-8 rounded-sm shadow-xl flex flex-col relative overflow-hidden group">
                        <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="CO_OP" /></div>
                        <div className="absolute -right-4 -top-4 opacity-10 transform scale-150 group-hover:rotate-12 transition-transform duration-700"><Icons.Scale /></div>
                        <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10">推定総在庫 評価額</p>
                        <div className="flex items-baseline gap-2 mt-auto relative z-10">
                            <span className="text-2xl font-light text-gray-500">¥</span>
                            <span className={`text-5xl md:text-6xl font-black tracking-tighter transition-colors ${showAiData ? 'text-white' : 'text-gray-700'}`}>{showAiData ? inventoryValue.toLocaleString() : '---'}</span>
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-800 text-xs text-gray-400 font-mono relative z-10 flex justify-between items-center">
                            <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#D32F2F] rounded-full animate-pulse"></span>銅換算在庫 <span className="ml-2"><ProvenanceBadge type="HUMAN" /></span></span>
                            <span className="font-bold text-white text-sm">{totalCopperStock.toLocaleString()} kg</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-gray-300 transition-colors relative">
                        <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
                        <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2"><Icons.Truck /> 本日の現場稼働</p>
                        <div className="flex items-center gap-6 mt-auto">
                            <div>
                                <p className="text-xs text-gray-400 font-bold mb-1">受付件数</p>
                                <span className="text-4xl font-black text-gray-900 tracking-tighter">{todayCount}<span className="text-sm font-normal text-gray-500 ml-1">件</span></span>
                            </div>
                            <div className="w-px h-12 bg-gray-200"></div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold mb-1">持込予定量</p>
                                <span className="text-4xl font-black text-[#D32F2F] tracking-tighter">{todayWeight.toLocaleString()}<span className="text-sm font-normal text-gray-500 ml-1">kg</span></span>
                            </div>
                        </div>
                    </div>

                    <div className={`bg-gray-100 p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group transition-opacity duration-300 ${showAiData ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
                        <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="AI_AUTO" /></div>
                        <div className="absolute -right-4 -top-4 opacity-10 transform scale-150 text-gray-900 transition-transform duration-700"><Icons.Message /></div>
                        <p className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-gray-900 animate-pulse"></span>AIコンシェルジュ稼働</p>
                        <div className="flex items-baseline gap-2 mt-auto relative z-10">
                            <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter">{data?.chatStats?.today || 0}</span>
                            <span className="text-sm font-bold text-gray-600">件の対応</span>
                        </div>
                        <div className="mt-5 pt-4 border-t border-gray-300 text-xs text-gray-600 font-mono relative z-10 flex justify-between items-center">
                            <span className="font-bold">累計対応数: {data?.chatStats?.total || 0} 件</span>
                            <button onClick={async (e) => {
                                const btn = e.currentTarget; const originalText = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="animate-spin mr-1">↻</span> トレーニング中...';
                                try {
                                    const res = await fetch('/api/simulate', { method: 'POST' }); const simData = await res.json();
                                    if(simData.success) { alert("仮想トレーニング完了！\n\n【ペルソナ】\n" + simData.persona + "\n\n【生成された会話】\n" + simData.chatHistory); window.location.reload(); } else { alert("エラー: " + simData.message); }
                                } catch(err) { alert("通信エラーが発生しました。"); }
                                btn.disabled = false; btn.innerHTML = originalText;
                            }} className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-sm text-[10px] font-bold shadow-sm transition flex items-center gap-1 disabled:opacity-50">
                                <Icons.Brain /> 仮想トレーニング実行
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-2 mb-10">
                    <div className="xl:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className={`group bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer transition-all relative ${showAiData ? 'hover:border-[#D32F2F] hover:shadow-md' : 'opacity-20 grayscale pointer-events-none'}`} onClick={() => showAiData && onNavigate('COMPETITOR')}>
                                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="AI_AUTO" /></div>
                                <div className="flex justify-between items-start mb-6"><h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><Icons.Radar /> AI 競合価格勝敗</h3></div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-end justify-between mb-3"><span className="text-xs text-gray-500 font-bold mb-1">自社優勢 (Win)</span><span className="text-4xl font-black text-gray-900 tracking-tighter">{win}</span></div>
                                    <div className="w-full bg-gray-100 h-3 rounded-sm overflow-hidden mb-4 border border-gray-200 shadow-inner"><div className="h-full bg-gray-900 transition-all duration-1000" style={{ width: `${(win / Math.max(1, win + lose + draw)) * 100}%` }}></div></div>
                                    <div className="flex justify-between text-xs font-bold text-gray-500"><span>同値: {draw}</span><span>劣勢: {lose}</span></div>
                                </div>
                            </div>

                            <div className="group bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer hover:border-[#D32F2F] hover:shadow-md transition-all relative" onClick={() => onNavigate('PRODUCTION')}>
                                <div className="absolute top-4 right-4 z-20 flex gap-1"><ProvenanceBadge type="HUMAN" /></div>
                                <div className="flex justify-between items-start mb-6"><h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm"><Icons.Factory /> 今月の生産実績</h3><Icons.ArrowRight /></div>
                                <div className="flex-1 flex flex-col justify-center gap-6">
                                    <div className="flex items-center justify-between border-l-4 border-gray-900 pl-4 py-1">
                                        <div><p className="text-xs text-gray-500 font-bold mb-1">ピカ銅 生産量</p><div className="flex items-baseline gap-1"><span className="text-2xl font-black text-gray-900">{mCopper.toLocaleString()}</span><span className="text-xs text-gray-400 font-bold">kg</span></div></div>
                                        <div className="text-right"><p className="text-xs text-gray-500 font-bold mb-1">月末予測 <span className="ml-1"><ProvenanceBadge type="AI_AUTO" /></span></p><div className="flex items-baseline gap-1 justify-end"><span className={`text-xl font-black ${showAiData ? 'text-[#D32F2F]' : 'text-gray-300'}`}>{showAiData ? projectedCopper.toLocaleString() : '---'}</span><span className="text-xs text-gray-400 font-bold">kg</span></div></div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-bold">マスター比 乖離 (直近10件)</span>
                                        <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-sm shadow-sm border border-gray-100">
                                            <span className={`text-xl font-black tracking-tighter ${yieldStats.isPositive ? 'text-gray-900' : 'text-[#D32F2F]'}`}>{yieldStats.isPositive ? '+' : ''}{yieldStats.diff.toFixed(1)}</span><span className="text-xs text-gray-500 font-bold">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden group hover:border-gray-300 transition-colors h-fit relative">
                            <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="CO_OP" /></div>
                            <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center cursor-pointer pr-24" onClick={() => onNavigate('DATABASE')}>
                                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">本日の買取価格表 <span className="text-xs text-gray-400 font-normal">(主要品目)</span></h3><Icons.ArrowRight />
                            </div>
                            <div className="p-0 overflow-x-auto pb-2">
                                <table className="w-full text-left mb-2">
                                    <thead className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <tr><th className="p-4 pl-6">品名</th><th className="p-4 text-center">設定歩留まり</th><th className="p-4 pr-6 text-right">買取単価</th></tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 text-sm">
                                        {data?.wires?.slice(0, 5).map((w: any) => (
                                            <tr key={w.id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => onNavigate('DATABASE')}>
                                                <td className="p-4 pl-6 font-bold text-gray-800">{getDisplayName(w)}</td>
                                                <td className="p-4 text-center text-gray-500 font-bold">{w.ratio}% <span className="ml-1"><ProvenanceBadge type="HUMAN" /></span></td>
                                                <td className="p-4 pr-6 text-right font-black text-xl text-[#D32F2F] tracking-tighter">{showAiData ? `¥${Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()}` : '---'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px] relative">
                            <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
                            <div className="p-5 border-b border-gray-200 bg-[#111] text-white flex justify-between items-center cursor-pointer group transition pr-24" onClick={() => onNavigate('OPERATIONS')}>
                                <h3 className="font-bold text-sm flex items-center gap-3 tracking-widest">
                                    <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]"></span></span>
                                    リアルタイム稼働状況
                                </h3>
                                <Icons.ArrowRight />
                            </div>
                            <div className="p-6 overflow-y-auto flex-1 bg-white">
                                {activeReservations.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400 text-sm font-bold flex flex-col items-center gap-3"><Icons.Truck />本日の予定はありません</div>
                                ) : (
                                    <ul className="space-y-0">
                                        {activeReservations.map((res: any) => {
                                            let w = 0; let p = "品目不明";
                                            try { 
                                                let items = res.items; 
                                                if (typeof items === 'string') items = JSON.parse(items); 
                                                if (Array.isArray(items) && items.length > 0) { 
                                                    w = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0); 
                                                    p = items[0].product || items[0].productName; 
                                                    if(items.length > 1) p += " 他"; 
                                                } 
                                            } catch(e){}
                                            
                                            return (
                                                <li key={res.id} className="relative pl-6 pb-8 last:pb-0 group cursor-pointer" onClick={() => onNavigate('OPERATIONS')}>
                                                    <div className="absolute left-[7px] top-3 w-px h-full bg-gray-200 group-last:hidden"></div>
                                                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white ${res.status === 'PROCESSING' ? 'bg-gray-400' : 'bg-[#D32F2F] animate-pulse'} shadow-sm ring-1 ring-gray-100 z-10`}></div>
                                                    <div className="bg-white border border-gray-100 p-4 rounded-sm shadow-sm group-hover:border-[#D32F2F] transition-colors ml-4 -mt-2">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-100">
                                                                {formatTime(res.createdAt || res.visitDate)}
                                                            </span>
                                                            <span className="text-[10px] font-mono text-gray-400">{res.id}</span>
                                                        </div>
                                                        <p className="font-black text-base text-gray-900 mb-1 truncate">{res.memberName}</p>
                                                        <p className="text-xs text-gray-600 font-bold flex items-center justify-between"><span>{p}</span><span className="font-black text-[#D32F2F] text-lg">{w} <span className="text-xs font-normal text-gray-400">kg</span></span></p>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-2 mb-10 w-full">
                    <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-6 relative overflow-hidden">
                        <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                                    <Icons.Camera /> 広報・現場写真アップロード
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    撮影した写真をGoogle Driveに保存します。一括アップロードに対応しました。
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-4">
                            <button onClick={() => cameraRef.current?.click()} disabled={isUploadingPhoto} className="flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 py-6 rounded-sm font-bold flex flex-col items-center justify-center gap-2 transition disabled:opacity-50">
                                <Icons.Camera />
                                <span className="text-sm">カメラで撮影</span>
                            </button>
                            <button onClick={() => galleryRef.current?.click()} disabled={isUploadingPhoto} className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-6 rounded-sm font-bold flex flex-col items-center justify-center gap-2 transition disabled:opacity-50">
                                <Icons.UploadCloud />
                                <span className="text-sm">フォルダから複数選択</span>
                            </button>
                        </div>

                        <input type="file" accept="image/*" capture="environment" ref={cameraRef} onChange={handleMultiPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
                        <input type="file" accept="image/*" multiple ref={galleryRef} onChange={handleMultiPhotoUpload} className="hidden" disabled={isUploadingPhoto} />

                        {isUploadingPhoto && (
                            <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-sm">
                                <div className="text-blue-500 animate-spin mb-2 flex justify-center"><Icons.Refresh /></div>
                                <p className="text-sm font-bold text-gray-700">自動圧縮＆送信中... ({uploadProgress.current} / {uploadProgress.total} 枚)</p>
                                <div className="w-full bg-gray-200 h-2 mt-3 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}></div>
                                </div>
                            </div>
                        )}

                        {!isUploadingPhoto && uploadedPhotoUrls.length > 0 && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-sm">
                                <div className="flex items-center gap-2 mb-2 text-green-700">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                    <span className="font-bold text-sm">{uploadedPhotoUrls.length}枚のアップロード完了！</span>
                                </div>
                                <ul className="text-xs text-blue-600 space-y-1">
                                    {uploadedPhotoUrls.map((url, idx) => (
                                        <li key={idx} className="truncate"><a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">📎 画像 {idx+1}</a></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};
