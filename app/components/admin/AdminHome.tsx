// app/components/admin/AdminHome.tsx
// @ts-nocheck
import React, { useMemo, useState, useEffect } from 'react';

const Icons = {
  TrendingUp: () => <svg className="w-4 h-4 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  TrendingDown: () => <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  Minus: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  ExternalLink: () => <svg className="w-3 h-3 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
  Calculator: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
  const baseStyle = "inline-block px-2 py-0.5 text-[10px] font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm border";
  switch (type) {
    case 'HUMAN': return <span className={`${baseStyle} bg-gray-900 border-gray-800`} title="実測・確定データ">HUMAN</span>;
    case 'CO_OP': return <span className={`${baseStyle} bg-gray-700 border-gray-600`} title="AI＋人間 協調データ">AI+HUMAN</span>;
    case 'AI_AUTO': return <span className={`${baseStyle} bg-[#D32F2F] border-red-800`} title="AI予測・推論データ">AI</span>;
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

export const parseItemsData = (rawItems: any) => {
    if (!rawItems) return [];
    if (Array.isArray(rawItems)) return rawItems;
    try {
        const parsed = JSON.parse(rawItems);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'string') {
            const doubleParsed = JSON.parse(parsed);
            if (Array.isArray(doubleParsed)) return doubleParsed;
        }
    } catch (e1) {
        try {
            let temp = String(rawItems);
            if (temp.startsWith('"') && temp.endsWith('"')) {
                temp = temp.slice(1, -1);
            }
            temp = temp.replace(/""/g, '"');
            temp = temp.replace(/\n/g, " ").replace(/\r/g, "");
            let parsed = JSON.parse(temp);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (Array.isArray(parsed)) return parsed;
        } catch (e2) {}
    }
    return [];
};


export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: any }) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showAiData, setShowAiData] = useState(true);
  
  useEffect(() => { setIsMounted(true); }, []);

  const copperPrice = Number(data?.config?.market_price) || 1450;
  const brassPrice = Number(data?.config?.brass_price) || 980;
  const zincPrice = Number(data?.config?.zinc_price) || 450;
  const leadPrice = Number(data?.config?.lead_price) || 380;
  const tinPrice = Number(data?.config?.tin_price) || 8900;

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
    { label: '銅建値 (JX)', price: copperPrice, unit: '円/kg', diff: copperDiff, sparkData: copperSparkData, provenance: 'AI_AUTO', url: 'https://www.jx-nmm.com/cuprice/' },
    { label: '真鍮建値 (日伸)', price: brassPrice, unit: '円/kg', diff: getDiff(brassSparkData), sparkData: brassSparkData, provenance: 'AI_AUTO', url: 'https://www.nippon-shindo.co.jp/' },
    { label: '亜鉛建値 (三井)', price: zincPrice, unit: '円/kg', diff: getDiff(zincSparkData), sparkData: zincSparkData, provenance: 'AI_AUTO', url: 'https://www.mitsui-kinzoku.com/' },
    { label: '鉛建値 (三菱)', price: leadPrice, unit: '円/kg', diff: getDiff(leadSparkData), sparkData: leadSparkData, provenance: 'AI_AUTO', url: 'https://www.mmc.co.jp/corporate/ja/' },
    { label: '錫建値 (三菱)', price: tinPrice, unit: '円/kg', diff: getDiff(tinSparkData), sparkData: tinSparkData, provenance: 'AI_AUTO', url: 'https://www.mmc.co.jp/corporate/ja/' },
  ];

  const activeReservations = localReservations.filter(r => r.status === 'RESERVED' || r.status === 'RECEIVED' || r.status === 'IN_PROGRESS');
  const todayCount = activeReservations.length;
  const todayWeight = activeReservations.reduce((sum, r) => {
    let weight = 0;
    try {
      const items = parseItemsData(r.items);
      weight = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0);
    } catch(e){}
    return sum + weight;
  }, 0);

  const { totalCopperStock, inventoryValue } = useMemo(() => {
    const productions = data?.productions || [];
    const producedCopper = productions.reduce((sum: number, p: any) => sum + (Number(p.outputRed) || Number(p.outputCopper) || 0) + (Number(p.outputMixed) || 0), 0);
    const unprocessedCopper = 0; 
    const total = producedCopper + unprocessedCopper;
    return { totalCopperStock: total, inventoryValue: total * currentPrice };
  }, [data?.productions, currentPrice]);

  const { mCopper, yieldStats, projectedCopper } = useMemo(() => {
    const productions = data?.productions || [];
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = Math.max(1, today.getDate());
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const thisMonthProds = productions.filter((p: any) => {
      try { const d = new Date(p.createdAt); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; } catch(e) { return false; }
    });

    const curCop = thisMonthProds.reduce((sum, p) => sum + (Number(p.outputRed) || Number(p.outputCopper) || 0) + (Number(p.outputMixed) || 0), 0);
    
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

    return { 
      mCopper: curCop, 
      yieldStats: { diff: avgDiff, isPositive: avgDiff >= 0 }, 
      projectedCopper: projected
    };
  }, [data?.productions, data?.wires]);

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

  const wireStats = useMemo(() => {
      const wires = data?.wires || [];
      let complete = 0, partial = 0, none = 0;
      wires.forEach((w:any) => {
          const has1 = !!w.image1; const has2 = !!w.image2; const has3 = !!w.image3;
          if (has1 && has2 && has3) complete++;
          else if (!has1 && !has2 && !has3) none++;
          else partial++;
      });
      return { total: wires.length, complete, partial, none };
  }, [data?.wires]);


  // ★★★ 修正ポイント：専用のHTMLレポート生成エンジン ★★★
  const handlePrintReport = () => {
    setIsGeneratingReport(true);
    
    // 別ウィンドウを開く（ここに綺麗なHTMLを流し込む）
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('ポップアップブロックを解除してください。');
      setIsGeneratingReport(false);
      return;
    }

    const todayStr = new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

    // 買取価格表のHTML文字列を構築
    const priceTableHtml = data?.wires?.slice(0, 15).map((w: any) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #111;">
                ${w.maker && w.maker !== '-' ? `【${w.maker}】` : ''}${w.name} ${w.sq !== '-' ? `${w.sq}sq` : ''} ${w.core !== '-' ? `${w.core}C` : ''}
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${w.material}</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center; font-family: monospace;">${w.ratio}%</td>
            <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right; font-family: monospace; font-weight: bold; color: #D32F2F; font-size: 16px;">
                ¥${Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()}
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4" style="text-align:center; padding: 10px;">データがありません</td></tr>';

    // A4サイズ・印刷に最適化されたHTML
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>経営ダッシュボード 日報_${todayStr}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; padding: 40px; color: #111; line-height: 1.6; background: #fff; }
                .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #D32F2F; padding-bottom: 10px; margin-bottom: 30px; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 900; letter-spacing: 2px; }
                .header p { margin: 0; color: #555; font-size: 12px; font-weight: bold; }
                
                .section-title { font-size: 16px; font-weight: 900; background: #f1f5f9; padding: 8px 12px; border-left: 4px solid #111; margin-bottom: 15px; margin-top: 30px;}
                
                .kpi-grid { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
                .kpi-box { flex: 1; min-width: 150px; background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                .kpi-box p { margin: 0 0 5px 0; font-size: 11px; color: #666; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                .kpi-box h3 { margin: 0; font-size: 24px; font-weight: 900; color: #111; font-family: monospace; }
                .kpi-box .sub { font-size: 11px; color: #888; margin-top: 5px; font-weight: bold; }

                .kpi-box.highlight { border-color: #D32F2F; border-bottom: 4px solid #D32F2F; }
                .kpi-box.highlight h3 { color: #D32F2F; }

                table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px; }
                th { background-color: #f8fafc; padding: 12px 10px; text-align: left; font-size: 11px; color: #475569; border-bottom: 2px solid #cbd5e1; text-transform: uppercase; letter-spacing: 1px; }
                
                @media print { 
                    body { padding: 0; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
                    @page { margin: 15mm; } 
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>経営管理 日次レポート</h1>
                <p>出力日時: ${todayStr}</p>
            </div>

            <div class="section-title">1. 市場・相場状況</div>
            <div class="kpi-grid">
                <div class="kpi-box highlight">
                    <p>銅建値 (JX)</p>
                    <h3>¥${copperPrice.toLocaleString()}</h3>
                    <div class="sub">前日比: ${copperDiff >= 0 ? '+' : ''}${copperDiff} 円</div>
                </div>
                <div class="kpi-box">
                    <p>真鍮建値 (日伸)</p>
                    <h3>¥${brassPrice.toLocaleString()}</h3>
                </div>
                <div class="kpi-box">
                    <p>亜鉛建値 (三井)</p>
                    <h3>¥${zincPrice.toLocaleString()}</h3>
                </div>
                <div class="kpi-box">
                    <p>鉛建値 (三菱)</p>
                    <h3>¥${leadPrice.toLocaleString()}</h3>
                </div>
            </div>

            <div class="section-title">2. 現場稼働・生産状況</div>
            <div class="kpi-grid">
                <div class="kpi-box">
                    <p>本日 受付件数 / 予定量</p>
                    <h3>${todayCount} 件 / ${todayWeight.toLocaleString()} kg</h3>
                </div>
                <div class="kpi-box highlight">
                    <p>推定総在庫 評価額</p>
                    <h3>¥${inventoryValue.toLocaleString()}</h3>
                    <div class="sub">銅換算在庫: ${totalCopperStock.toLocaleString()} kg</div>
                </div>
                <div class="kpi-box">
                    <p>今月生産量 / 月末予測</p>
                    <h3>${mCopper.toLocaleString()} kg <span style="font-size:14px;color:#666;">(予測: ${projectedCopper.toLocaleString()})</span></h3>
                    <div class="sub">歩留まりブレ: ${yieldStats.isPositive ? '+' : ''}${yieldStats.diff.toFixed(1)}%</div>
                </div>
            </div>

            <div class="section-title">3. AI・システム運用状況</div>
            <div class="kpi-grid">
                <div class="kpi-box">
                    <p>AI 競合価格勝敗</p>
                    <h3 style="color:#D32F2F;">Win: ${win}</h3>
                    <div class="sub">Lose: ${lose} / Draw: ${draw}</div>
                </div>
                <div class="kpi-box">
                    <p>マスターDB 完成度</p>
                    <h3>${wireStats.total > 0 ? Math.floor((wireStats.complete / wireStats.total) * 100) : 0}%</h3>
                    <div class="sub">全 ${wireStats.total}件 (写真完備: ${wireStats.complete})</div>
                </div>
            </div>

            <div class="section-title">4. 本日の主要買取価格表</div>
            <table>
                <thead>
                    <tr>
                        <th>メーカー / 品名 / サイズ</th>
                        <th style="text-align: center;">材質</th>
                        <th style="text-align: center;">銅分率 (歩留)</th>
                        <th style="text-align: right;">本日の買取単価</th>
                    </tr>
                </thead>
                <tbody>
                    ${priceTableHtml}
                </tbody>
            </table>

            <div style="text-align: right; margin-top: 50px; font-size: 12px; color: #555;">
                <p style="margin-bottom: 5px; font-weight: bold;">【承認印欄】</p>
                <div style="border: 1px solid #111; width: 90px; height: 90px; display: inline-block; margin-left: 10px;"></div>
                <div style="border: 1px solid #111; width: 90px; height: 90px; display: inline-block; margin-left: 10px;"></div>
                <div style="border: 1px solid #111; width: 90px; height: 90px; display: inline-block; margin-left: 10px;"></div>
            </div>

            <script>
                // レポート画面が読み込まれたら自動的に印刷プレビューを立ち上げる
                window.onload = function() { 
                    setTimeout(() => { 
                        window.print(); 
                        window.close(); // 印刷が終わったら自動で閉じる
                    }, 500); 
                };
            </script>
        </body>
        </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setIsGeneratingReport(false);
  };


  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full text-gray-900 pb-24 font-sans bg-[#FFFFFF] min-h-screen relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      <div className="print:hidden max-w-[1400px] mx-auto w-full">
        <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-6 px-2">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-3 font-serif tracking-tight">
              <span className="w-1.5 h-6 bg-[#D32F2F] rounded-full block"></span>
              経営ダッシュボード
            </h2>
            <p className="text-xs text-gray-500 mt-2 font-bold tracking-widest ml-4 uppercase">主要指標・運用情報一覧</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-gray-300 shadow-sm">
              <button onClick={() => setShowAiData(true)} className={`px-4 py-1.5 text-xs font-bold transition-colors ${showAiData ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>予測あり</button>
              <button onClick={() => setShowAiData(false)} className={`px-4 py-1.5 text-xs font-bold transition-colors ${!showAiData ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100'}`}>実測のみ</button>
            </div>
            <button onClick={handlePrintReport} disabled={isGeneratingReport} className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center gap-2 disabled:opacity-50">
              {isGeneratingReport ? <span className="animate-spin"><Icons.Refresh /></span> : <Icons.Print />}
              日次レポート作成
            </button>
          </div>
        </header>

        {/* 価格算出ロジック */}
        <div className="mb-8 px-2 w-full">
          <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm group hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest flex items-center gap-1">
                <Icons.Calculator /> PRICING LOGIC
              </span>
              <span className="text-xs font-bold text-gray-700">現在の買取単価 算出ロジック</span>
            </div>
            <div className="font-mono text-sm md:text-base font-black text-gray-900 flex items-center flex-wrap gap-2 md:gap-3 bg-white px-4 py-2 border border-gray-200 rounded-sm shadow-sm">
              <span className="text-gray-600 text-xs md:text-sm">基準建値</span>
              <span className="text-gray-400">×</span>
              <span className="text-gray-600 text-xs md:text-sm">歩留まり(%)</span>
              <span className="text-gray-400">＋</span>
              <span className="text-gray-600 text-xs md:text-sm">調整額(円)</span>
              <span className="text-gray-400">＝</span>
              <span className="text-[#D32F2F] text-base md:text-lg">買取単価</span>
            </div>
          </div>
        </div>

        {/* 建値情報 */}
        <div className="mb-10 px-2 w-full">
          <div className={`transition-opacity duration-300 ${showAiData ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
            <div className="flex xl:grid xl:grid-cols-5 gap-4 overflow-x-auto xl:overflow-visible no-scrollbar pb-4 xl:pb-0 snap-x w-full">
              {marketItems.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="snap-start relative bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#D32F2F] rounded-sm p-4 transition-all duration-300 w-[180px] shrink-0 xl:w-auto xl:shrink flex flex-col justify-between overflow-hidden group block">
                  <div className="absolute top-2 right-2 z-20"><ProvenanceBadge type={m.provenance as any} /></div>
                  
                  {m.sparkData && (
                    <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                      <Sparkline data={m.sparkData} color="#4B5563" />
                    </div>
                  )}
                  
                  <p className="text-xs font-bold text-gray-500 mb-2 relative z-10 flex items-center gap-1">
                    {m.label}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity"><Icons.ExternalLink /></span>
                  </p>
                  
                  <div className="flex items-baseline gap-1 relative z-10 whitespace-nowrap">
                    <span className="text-2xl 2xl:text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{m.price.toLocaleString()}</span>
                    <span className="text-[10px] 2xl:text-xs text-gray-400 font-bold ml-1">{m.unit}</span>
                  </div>
                  
                  {m.diff !== undefined ? (
                    <div className="mt-2 text-xs font-bold flex items-center gap-1.5 relative z-10 whitespace-nowrap tabular-nums">
                      {m.diff > 0 ? <><Icons.TrendingUp /><span className="text-[#D32F2F]">+{m.diff}</span></> : m.diff < 0 ? <><Icons.TrendingDown /><span className="text-gray-900">{m.diff}</span></> : <><Icons.Minus /><span className="text-gray-400">±0</span></>}
                    </div>
                  ) : (
                    <div className="mt-2 h-4 relative z-10"></div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 上段 3カラム */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 px-2">
          
          <div className="bg-gray-50 p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-[#D32F2F] hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="CO_OP" /></div>
            <div className="mb-6 relative z-10">
              <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Source: ナゲット製造管理</span>
              <h3 className="font-black text-gray-900 tracking-wider text-lg">推定総在庫 評価額</h3>
            </div>
            <div className="flex items-baseline gap-2 mt-auto relative z-10">
              <span className="text-2xl font-light text-gray-400">¥</span>
              <span className={`text-5xl md:text-6xl font-black tracking-tighter tabular-nums transition-colors ${showAiData ? 'text-[#D32F2F]' : 'text-gray-300'}`}>{showAiData ? inventoryValue.toLocaleString() : '---'}</span>
            </div>
            <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-600 font-mono relative z-10 flex justify-between items-center">
              <span className="flex items-center gap-2 font-bold uppercase tracking-widest">銅換算在庫</span>
              <span className="font-black text-gray-900 text-sm tabular-nums">{totalCopperStock.toLocaleString()} kg</span>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-[#D32F2F] hover:shadow-md transition-all relative">
            <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
            <div className="mb-6">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Source: POS (受付・計量)</span>
              <h3 className="font-black text-gray-900 tracking-wider text-lg">本日の現場稼働</h3>
            </div>
            <div className="flex items-center gap-6 mt-auto">
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">受付件数</p>
                <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{todayCount}<span className="text-sm font-normal text-gray-500 ml-1">件</span></span>
              </div>
              <div className="w-px h-12 bg-gray-200"></div>
              <div>
                <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">持込予定量</p>
                <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{todayWeight.toLocaleString()}<span className="text-sm font-normal text-gray-500 ml-1">kg</span></span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer group hover:border-[#D32F2F] hover:shadow-md transition-all relative" onClick={() => onNavigate('PRODUCTION')}>
            <div className="absolute top-4 right-4 z-20 flex gap-1"><ProvenanceBadge type="HUMAN" /></div>
            <div className="mb-6">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Source: ナゲット製造管理</span>
              <h3 className="font-black text-gray-900 tracking-wider text-lg">今月の生産実績</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="flex items-center justify-between border-l-4 border-gray-900 pl-4 py-1">
                <div><p className="text-[10px] text-gray-500 font-bold mb-1 uppercase tracking-widest">ピカ銅 生産量</p><div className="flex items-baseline gap-1"><span className="text-2xl font-black text-gray-900 tabular-nums">{mCopper.toLocaleString()}</span><span className="text-xs text-gray-400 font-bold">kg</span></div></div>
                <div className="text-right"><p className="text-[10px] text-gray-500 font-bold mb-1 flex items-center justify-end gap-1 uppercase tracking-widest">月末予測 <ProvenanceBadge type="AI_AUTO" /></p><div className="flex items-baseline gap-1 justify-end"><span className={`text-xl font-black tabular-nums ${showAiData ? 'text-gray-900' : 'text-gray-300'}`}>{showAiData ? projectedCopper.toLocaleString() : '---'}</span><span className="text-xs text-gray-400 font-bold">kg</span></div></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 flex justify-between items-center group-hover:bg-gray-100 transition-colors shadow-inner">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">マスター比 乖離 (直近10件)</span>
                <div className="flex items-baseline gap-1 bg-white px-3 py-1 rounded-sm shadow-sm border border-gray-300">
                  <span className={`text-xl font-black tracking-tighter tabular-nums ${yieldStats.isPositive ? 'text-gray-900' : 'text-[#D32F2F]'}`}>{yieldStats.isPositive ? '+' : ''}{yieldStats.diff.toFixed(1)}</span><span className="text-[10px] text-gray-500 font-bold">%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ★ 中段 3カラム */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 mb-10">
            
            <div className={`bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer transition-all relative group ${showAiData ? 'hover:border-[#D32F2F] hover:shadow-md' : 'opacity-20 grayscale pointer-events-none'}`} onClick={() => showAiData && onNavigate('COMPETITOR')}>
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="AI_AUTO" /></div>
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Source: 相場レーダー</span>
                  <h3 className="font-black text-gray-900 tracking-wider text-lg">AI 競合価格勝敗</h3>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-end justify-between mb-3"><span className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">自社優勢 (Win)</span><span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{win}</span></div>
                    <div className="w-full bg-gray-100 h-3 rounded-sm overflow-hidden mb-4 border border-gray-200 shadow-inner"><div className="h-full bg-[#D32F2F] transition-all duration-1000" style={{ width: `${(win / Math.max(1, win + lose + draw)) * 100}%` }}></div></div>
                    <div className="flex justify-between text-xs font-bold text-gray-500 tabular-nums"><span>同値: {draw}</span><span>劣勢: {lose}</span></div>
                </div>
            </div>

            <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col cursor-pointer transition-all relative group hover:border-[#D32F2F] hover:shadow-md" onClick={() => onNavigate('DATABASE')}>
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
                <div className="mb-6">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Source: マスターDB</span>
                  <h3 className="font-black text-gray-900 tracking-wider text-lg">写真収集ミッション</h3>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-end justify-between mb-3">
                        <span className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">マスター完成度</span>
                        <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                            {wireStats.total > 0 ? Math.floor((wireStats.complete / wireStats.total) * 100) : 0}
                            <span className="text-lg font-normal text-gray-400 ml-1">%</span>
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-sm overflow-hidden mb-4 border border-gray-200 shadow-inner">
                        <div className="h-full bg-gray-900 transition-all duration-1000" style={{ width: `${wireStats.total > 0 ? (wireStats.complete / wireStats.total) * 100 : 0}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 tabular-nums">
                        <span className="text-gray-900">完備: {wireStats.complete}</span>
                        <span className="text-gray-500">一部不足: {wireStats.partial}</span>
                        <span className="text-[#D32F2F]">未登録: {wireStats.none}</span>
                    </div>
                </div>
            </div>

            <div className={`bg-white p-6 md:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:border-[#D32F2F] hover:shadow-md ${showAiData ? 'opacity-100' : 'opacity-20 grayscale pointer-events-none'}`}>
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="AI_AUTO" /></div>
                <div className="mb-6 relative z-10">
                  <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1 block">Source: 一般向けWebサイト</span>
                  <h3 className="font-black text-gray-900 tracking-wider text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D32F2F] animate-pulse"></span>AIコンシェルジュ稼働
                  </h3>
                </div>
                <div className="flex items-baseline gap-2 mt-auto relative z-10">
                    <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter tabular-nums">{data?.chatStats?.today || 0}</span>
                    <span className="text-sm font-bold text-gray-500">件の対応</span>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 text-xs text-gray-600 font-mono relative z-10 flex justify-between items-center">
                    <span className="font-bold tabular-nums tracking-widest uppercase">累計対応数: {data?.chatStats?.total || 0} 件</span>
                    <button onClick={async (e) => {
                        const btn = e.currentTarget; const originalText = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="animate-spin mr-1">↻</span> トレーニング中...';
                        try {
                            const res = await fetch('/api/simulate', { method: 'POST' }); const simData = await res.json();
                            if(simData.success) { alert("仮想トレーニング完了！\n\n【ペルソナ】\n" + simData.persona + "\n\n【生成された会話】\n" + simData.chatHistory); window.location.reload(); } else { alert("エラー: " + simData.message); }
                        } catch(err) { alert("通信エラーが発生しました。"); }
                        btn.disabled = false; btn.innerHTML = originalText;
                    }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3 py-1.5 rounded-sm text-[10px] font-bold shadow-sm transition flex items-center gap-1 disabled:opacity-50 group-hover:border-gray-900 group-hover:text-gray-900">
                        仮想トレーニング
                    </button>
                </div>
            </div>

        </div>

        {/* ★ 買取価格表をフル幅化し、詳細を追加 */}
        <div className="px-2 mb-6 w-full">
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden group hover:border-[#D32F2F] hover:shadow-md transition-all relative cursor-pointer" onClick={() => onNavigate('DATABASE')}>
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="CO_OP" /></div>
                <div className="p-6 border-b border-gray-100 bg-gray-50 transition pr-24 shrink-0">
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Source: マスターDB</span>
                    <h3 className="font-black text-gray-900 tracking-wider text-lg">本日の買取価格表</h3>
                </div>
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <tr>
                                <th className="p-4 pl-6">メーカー / 品名 / サイズ</th>
                                <th className="p-4 text-center">材質</th>
                                <th className="p-4 text-center">銅分率 (歩留)</th>
                                <th className="p-4 pr-6 text-right">本日の買取単価</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm bg-white">
                            {data?.wires?.slice(0, 10).map((w: any) => (
                                <tr key={w.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 pl-6 font-bold text-gray-900">
                                        {w.maker && w.maker !== '-' ? `【${w.maker}】` : ''}{w.name} {w.sq !== '-' ? `${w.sq}sq` : ''} {w.core !== '-' ? `${w.core}C` : ''}
                                    </td>
                                    <td className="p-4 text-center text-gray-600 font-bold">{w.material}</td>
                                    <td className="p-4 text-center text-gray-900 font-bold font-mono tabular-nums">{w.ratio}%</td>
                                    <td className="p-4 pr-6 text-right font-black text-xl text-[#D32F2F] tracking-tighter tabular-nums">
                                        {showAiData ? `¥${Math.floor(copperPrice * (w.ratio/100) * 0.85).toLocaleString()}` : '---'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* ★ リアルタイム稼働状況 (カンバン抜粋) */}
        <div className="px-2 mb-10 w-full">
            <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[300px] relative group hover:border-[#D32F2F] hover:shadow-md transition-all">
                <div className="absolute top-4 right-4 z-20"><ProvenanceBadge type="HUMAN" /></div>
                <div className="p-6 border-b border-gray-100 bg-gray-50 cursor-pointer transition pr-24 shrink-0" onClick={() => onNavigate('OPERATIONS')}>
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 block">Source: 現場状況管理</span>
                    <h3 className="font-black text-gray-900 tracking-wider text-lg flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D32F2F] opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D32F2F]"></span></span>
                        リアルタイム稼働状況 (現場カンバン)
                    </h3>
                </div>
                
                <div className="p-6 bg-white flex-1 overflow-y-auto">
                    {activeReservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                            <p className="text-sm font-bold mt-3">本日の予定・処理待ちの荷物はありません</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeReservations.map((res: any) => {
                                let w = 0; let p = "品目不明";
                                try { 
                                    const items = parseItemsData(res.items); 
                                    if (Array.isArray(items) && items.length > 0) { 
                                        w = items.reduce((s:number, i:any) => s + (Number(i.weight)||0), 0); 
                                        p = items[0].product || items[0].name || items[0].productName || "不明"; 
                                        if(items.length > 1) p += " 他"; 
                                    } 
                                } catch(e){}
                                
                                return (
                                    <div key={res.id} className="bg-gray-50 border border-gray-200 p-4 rounded-sm shadow-sm hover:border-gray-900 transition-colors cursor-pointer group/card" onClick={() => onNavigate('OPERATIONS')}>
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${res.status === 'PROCESSING' || res.status === 'IN_PROGRESS' ? 'bg-[#D32F2F]' : 'bg-gray-900 animate-pulse'}`}></div>
                                                <span className="text-[10px] font-bold text-gray-600 bg-white px-2 py-0.5 rounded-sm border border-gray-200 shadow-sm tabular-nums tracking-widest">{formatTime(res.createdAt || res.visitDate)}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-gray-400 tracking-widest">{res.id}</span>
                                        </div>
                                        <p className="font-black text-base text-gray-900 mb-2 truncate">{res.memberName}</p>
                                        <p className="text-xs text-gray-600 font-bold flex items-center justify-between border-t border-gray-200 pt-2">
                                            <span className="truncate mr-2">{p}</span>
                                            <span className="font-black text-gray-900 text-lg shrink-0 tabular-nums">{w.toFixed(1)} <span className="text-[10px] font-bold text-gray-500">kg</span></span>
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
