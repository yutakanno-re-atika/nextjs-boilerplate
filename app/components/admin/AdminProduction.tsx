// app/components/admin/AdminProduction.tsx
// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';

const Icons = {
  Factory: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Check: () => <svg className="w-5 h-5 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
  User: () => <svg className="w-4 h-4 inline-block mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Worker: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Scissors: () => <svg className="w-5 h-5 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2-2m-2 2l-2-2m0 0a2 2 0 10-2.828-2.828 2 2 0 002.828 2.828zM3 21a2 2 0 102.828-2.828 2 2 0 00-2.828 2.828z" /></svg>,
  Blend: () => <svg className="w-5 h-5 inline-block md:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  FastForward: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>,
  Print: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Brain: () => <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
};

const ProvenanceBadge = ({ type }: { type: 'HUMAN' | 'AI_AUTO' | 'CO_OP' }) => {
  const baseStyle = "inline-block px-1.5 py-0.5 text-[9px] font-bold tracking-widest rounded-sm text-white cursor-default shadow-sm ml-1 align-middle";
  switch (type) {
    case 'HUMAN': return <span className={`${baseStyle} bg-gray-900`} title="実測・確定データ">HUMAN</span>;
    case 'CO_OP': return <span className={`${baseStyle} bg-gray-600`} title="AI＋人間 協調データ">CO-P</span>;
    case 'AI_AUTO': return <span className={`${baseStyle} bg-[#D32F2F]`} title="AI予測・推論データ">AI</span>;
    default: return null;
  }
};

const parseItemsData = (rawItems: any) => {
  if (!rawItems) return [];
  if (Array.isArray(rawItems)) return rawItems;
  try {
      let temp = String(rawItems);
      if (temp.startsWith('"') && temp.endsWith('"')) temp = temp.slice(1, -1);
      temp = temp.replace(/""/g, '"');
      temp = temp.replace(/\\n/g, "\\n").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t");
      temp = temp.replace(/\n/g, "\\n").replace(/\r/g, "");
      
      let parsed = JSON.parse(temp);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) return parsed;
  } catch (e) {}
  return [];
};

export const AdminProduction = ({ data, localReservations }: { data: any, localReservations: any[] }) => {
  const [activeTab, setActiveTab] = useState<'SORT' | 'PROCESS' | 'LOG'>('SORT');
  const [showAiData, setShowAiData] = useState(true);

  const [sortingLot, setSortingLot] = useState<any>(null); 
  const [blendingLots, setBlendingLots] = useState<any[]>([]); 
  
  const [checkedLotIds, setCheckedLotIds] = useState<string[]>([]);
  const [localSortedLots, setLocalSortedLots] = useState<any[]>([]); 
  const [localConsumedIds, setLocalConsumedIds] = useState<string[]>([]); 

  const [sortOutputs, setSortOutputs] = useState([{ category: '', ratio: '', weight: '' }]);
  const [sortTime, setSortTime] = useState('');
  const [sortWorker, setSortWorker] = useState('未選択');

  const [processInputWeight, setProcessInputWeight] = useState('');
  const [processOutputRed, setProcessOutputRed] = useState(''); 
  const [processOutputMixed, setProcessOutputMixed] = useState(''); 
  const [processOutputCover, setProcessOutputCover] = useState(''); 
  const [processWorker, setProcessWorker] = useState('未選択');
  const [processMemo, setProcessMemo] = useState('');         
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');

  const productions = data?.productions || [];
  const wiresMaster = data?.wires || [];
  const staffs = data?.staffs || [];

  const workerList = useMemo(() => {
      const list = staffs
          .filter((s: any) => s.status !== 'INACTIVE' && (s.role === 'ALL' || s.role === 'SORTING' || s.role === 'PLANT'))
          .map((s: any) => s.name);
      
      if (list.length === 0) return ["未選択", "工場長", "佐藤", "鈴木", "高橋", "田中", "パートA"];
      return ["未選択", ...list];
  }, [staffs]);

  const getDisplayName = (w: any) => {
      let name = w.name;
      if (w.sq && w.sq !== '-') name += ` ${w.sq}sq`;
      if (w.core && w.core !== '-') name += ` ${w.core}C`;
      return name;
  };

  useEffect(() => {
      const globalStateStr = data?.config?.global_production_state;
      if (globalStateStr) {
          try {
              const state = JSON.parse(globalStateStr);
              setLocalSortedLots(state.sortedLots || []);
              setLocalConsumedIds(state.consumedIds || []);
          } catch(e) {}
      } else {
          const savedSorted = localStorage.getItem('factoryOS_sortedLots');
          const savedConsumed = localStorage.getItem('factoryOS_consumedIds');
          if (savedSorted) setLocalSortedLots(JSON.parse(savedSorted));
          if (savedConsumed) setLocalConsumedIds(JSON.parse(savedConsumed));
      }
  }, [data?.config]);

  const syncStateToServer = async (newSorted: any[], newConsumed: string[]) => {
      const val = JSON.stringify({ sortedLots: newSorted, consumedIds: newConsumed });
      localStorage.setItem('factoryOS_sortedLots', JSON.stringify(newSorted));
      localStorage.setItem('factoryOS_consumedIds', JSON.stringify(newConsumed));
      try {
          await fetch('/api/gas', { 
              method: 'POST', headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ action: 'UPDATE_CONFIG', key: 'global_production_state', value: val }) 
          });
      } catch(e) {}
  };

  const { toSortLots, readyLots } = useMemo(() => {
      let rawLots: any[] = [];
      
      localReservations.filter(r => r.status === 'RECEIVED' || r.status === 'IN_PROGRESS').forEach(res => {
          const items = parseItemsData(res.items);
          items.forEach((it: any, idx: number) => {
              const product = it.product || it.productName;
              const initialWeight = Number(it.weight) || 0;
              const lotId = `${res.id}-${idx}`;

              if (initialWeight > 0 && product && !localConsumedIds.includes(lotId)) {
                  const processedWeight = productions.filter((p: any) => p.reservationId === res.id && p.materialName === product).reduce((sum: number, p: any) => sum + (Number(p.inputWeight) || 0), 0);
                  const remainingWeight = initialWeight - processedWeight;
                  
                  if (remainingWeight > 0) {
                      const productMaster = wiresMaster.find((w: any) => getDisplayName(w) === product || w.name === product);
                      rawLots.push({
                          lotId, reservationId: res.id, memberName: res.memberName || '名称未設定',
                          date: res.createdAt ? String(res.createdAt).substring(5, 16) : '不明', 
                          product: product, remainingWeight: remainingWeight, expectedRatio: productMaster ? productMaster.ratio : 0,
                          isSorted: false, isTin: product.includes('錫') || it.material === '錫メッキ' 
                      });
                  }
              }
          });
      });

      localSortedLots.forEach(lot => { if (!localConsumedIds.includes(lot.lotId)) rawLots.push(lot); });

      const sortList: any[] = [];
      const processList: any[] = [];

      rawLots.forEach(lot => {
          if (!lot.isSorted) sortList.push(lot);
          else processList.push(lot);
      });

      return { toSortLots: sortList, readyLots: processList };
  }, [localReservations, productions, wiresMaster, localSortedLots, localConsumedIds]);

  const totalRedNugget = productions.reduce((sum: number, p: any) => sum + (Number(p.outputRed) || Number(p.outputCopper) || 0), 0);
  const totalMixedNugget = productions.reduce((sum: number, p: any) => sum + (Number(p.outputMixed) || 0), 0);

  const handleSkipSort = async (lot: any) => {
    setIsSubmitting(true);
    const newSortedLots = [...localSortedLots];
    newSortedLots.push({
        lotId: `${lot.lotId}-S-SKIP`, reservationId: lot.reservationId, memberName: lot.memberName,
        date: lot.date, product: lot.product, remainingWeight: lot.remainingWeight, expectedRatio: lot.expectedRatio, isSorted: true, isTin: lot.isTin
    });
    const newConsumedIds = [...localConsumedIds, lot.lotId];
    setLocalSortedLots(newSortedLots); setLocalConsumedIds(newConsumedIds);
    await syncStateToServer(newSortedLots, newConsumedIds);
    setIsSubmitting(false);
  };

  const handleSortSubmit = async () => {
    if (!sortingLot) return;
    setIsSubmitting(true);
    const newSortedLots = [...localSortedLots];
    
    sortOutputs.forEach((out, idx) => {
        if (out.category && out.weight) {
            let productName = out.category;
            let expectedRatio = 0;

            if (out.category === '被覆B') {
                const ratioVal = Number(out.ratio) || 0;
                productName = `被覆B (${ratioVal}%)`;
                expectedRatio = ratioVal;
            }

            newSortedLots.push({
                lotId: `${sortingLot.lotId}-S${idx}`, 
                reservationId: sortingLot.reservationId, 
                memberName: `${sortingLot.memberName} (選別済)`,
                date: sortingLot.date, 
                product: productName, 
                remainingWeight: Number(out.weight), 
                expectedRatio: expectedRatio, 
                isSorted: true, 
                isTin: sortingLot.isTin
            });
        }
    });
    
    const newConsumedIds = [...localConsumedIds, sortingLot.lotId]; 
    setLocalSortedLots(newSortedLots); setLocalConsumedIds(newConsumedIds);
    await syncStateToServer(newSortedLots, newConsumedIds);
    
    setSortingLot(null); 
    setSortOutputs([{ category: '', ratio: '', weight: '' }]); 
    setSortTime(''); 
    setSortWorker('未選択'); 
    setActiveTab('PROCESS'); 
    setIsSubmitting(false);
  };

  const openBlendModal = () => {
    const selected = readyLots.filter(l => checkedLotIds.includes(l.lotId));
    if (selected.length === 0) return alert('加工するロットを選択してください');

    const hasTin = selected.some(l => l.isTin);
    const hasCopper = selected.some(l => !l.isTin);

    if (hasTin && hasCopper) {
        return alert('🛑【重大な警告】🛑\n\n錫メッキ線と純銅線が混在して選択されています！\nこれらを一緒に加工すると「メッキ混入」となり品質事故になります。\n\n必ず別々に加工してください。');
    }

    setBlendingLots(selected);
    const totalWeight = selected.reduce((sum, l) => sum + l.remainingWeight, 0);
    setProcessInputWeight(String(totalWeight)); setProcessOutputRed(''); setProcessOutputMixed(''); setProcessOutputCover(''); setProcessWorker('未選択'); setProcessMemo('');
  };

  const handleProcessSubmit = async () => {
    if (blendingLots.length === 0 || !processInputWeight) return;
    const inW = parseFloat(processInputWeight) || 0; 
    const outRed = parseFloat(processOutputRed) || 0; 
    const outMixed = parseFloat(processOutputMixed) || 0;
    const coverInput = parseFloat(processOutputCover) || 0;
    const outCu = outRed + outMixed;

    if (outCu === 0) return alert("産出されたナゲット重量（上または雑）を入力してください。");
    if (outCu > inW) return alert("産出重量が投入重量を上回っています。");
    
    setIsSubmitting(true);

    const coverW = coverInput > 0 ? coverInput : Math.max(0, inW - outCu);
    const dustW = coverInput > 0 ? Math.max(0, inW - outCu - coverInput) : 0;
    const ratio = inW > 0 ? ((outCu / inW) * 100).toFixed(1) : 0;
    
    const materialNames = blendingLots.map(l => l.product).join(' + ');
    const mixedName = blendingLots.length > 1 ? `混合バッチ (${materialNames})` : blendingLots[0].product;
    const reservationIds = blendingLots.map(l => l.reservationId).join(',');

    try {
        const payload = {
            action: 'REGISTER_PRODUCTION', 
            reservationId: reservationIds.substring(0, 40), 
            memberName: blendingLots.length > 1 ? 'ブレンド処理' : blendingLots[0].memberName,
            materialName: mixedName.substring(0, 50), 
            inputWeight: inW, 
            outputRed: outRed, 
            outputMixed: outMixed, 
            outputChips: coverW, 
            outputJute: dustW, 
            actualRatio: parseFloat(ratio), 
            memo: `作業者: ${processWorker} | 元ロット: ${blendingLots.length}件 | ${processMemo}`
        };
        const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const result = await res.json();
        if (result.status === 'success') { 
            const newConsumedIds = [...localConsumedIds, ...blendingLots.map(l => l.lotId)];
            setLocalConsumedIds(newConsumedIds);
            await syncStateToServer(localSortedLots, newConsumedIds);
            alert('ブレンド加工データを記録しました！\n（作業がすべて終わった場合は、カンバン画面で該当カードを「処理完了」に移動させてください）');
            setBlendingLots([]); setCheckedLotIds([]); window.location.reload(); 
        } else { alert('エラー: ' + result.message); }
    } catch(e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  const handlePrintReport = async () => {
    setIsGeneratingReport(true);
    const recentLogs = productions.slice(-10).map((p:any) => `${p.materialName}: 歩留${p.actualRatio}% (投入${p.inputWeight}kg)`).join('\n');
    const promptData = `
    ・データモード: ${showAiData ? 'AI予測データ含む' : '実測確定データのみ'}
    ・累計 上ナゲット生産量: ${totalRedNugget.toLocaleString()} kg
    ・現在の選別待ちロット: ${toSortLots.length} 件
    ・現在の加工待ちヤード在庫: ${readyLots.length} 件
    ・直近10件の加工ログ:
    ${recentLogs}
    ※工場長へ提出する本日のナゲット製造管理レポートです。稼働状況から読み取れる現場の課題や、明日への改善アドバイスを鋭く記載してください。
    `;

    try {
        const res = await fetch('/api/print-summary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pageName: 'ナゲット製造管理 統計レポート', promptData })
        });
        const result = await res.json();
        if (result.success) {
            setAiSummary(result.summary);
            setTimeout(() => { window.print(); setIsGeneratingReport(false); }, 500);
        } else {
            alert('AI要約の生成に失敗しました: ' + result.message); setIsGeneratingReport(false);
        }
    } catch(e) {
        alert('通信エラーが発生しました'); setIsGeneratingReport(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-gray-900 pb-12 font-sans max-w-7xl mx-auto w-full relative" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      
      <div className="print:hidden flex flex-col h-full">
          <header className="mb-4 md:mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-4 flex-shrink-0">
            <div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                    ナゲット製造管理
                </h2>
                <p className="text-xs text-gray-500 mt-1 font-bold ml-3">選別フローと歩留まり・ダスト計測</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white p-1 rounded-sm border border-gray-300 shadow-sm">
                    <button 
                        onClick={() => setShowAiData(true)}
                        className={`px-4 py-1.5 text-xs font-bold transition-colors ${showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        MIX
                    </button>
                    <button 
                        onClick={() => setShowAiData(false)}
                        className={`px-4 py-1.5 text-xs font-bold transition-colors ${!showAiData ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                        HUMAN ONLY
                    </button>
                </div>

                <button 
                    onClick={handlePrintReport} 
                    disabled={isGeneratingReport}
                    className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-sm text-xs font-bold hover:border-[#D32F2F] hover:text-[#D32F2F] transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGeneratingReport ? <span className="animate-spin"><Icons.Refresh /></span> : <Icons.Print />}
                    レポート印刷
                </button>
            </div>
          </header>

          <div className="bg-gray-100 border border-gray-200 rounded-sm shadow-sm p-4 md:p-6 text-gray-900 mb-6 relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-4 flex-shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-5 transform scale-150 text-gray-900"><Icons.Factory /></div>
              <div className="relative z-10">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">TOTAL COPPER NUGGET</h3>
                  <p className="text-sm font-bold text-gray-900 flex items-center">累計 銅ナゲット生産量 <ProvenanceBadge type="HUMAN" /></p>
              </div>
              <div className="flex items-center gap-4 md:gap-8 relative z-10">
                  <div className="text-right">
                      <p className="text-[10px] md:text-xs text-gray-600 font-bold mb-1 uppercase tracking-widest">上ナゲット (赤)</p>
                      <div className="flex items-end gap-1 justify-end">
                          <span className="text-3xl md:text-4xl font-black text-[#D32F2F] tabular-nums tracking-tighter">{totalRedNugget.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 font-bold mb-1">kg</span>
                      </div>
                  </div>
                  
                  <div className="w-px h-10 bg-gray-300 hidden md:block"></div>

                  <div className="text-right">
                      <p className="text-[10px] md:text-xs text-gray-600 font-bold mb-1 uppercase tracking-widest">雑ナゲット</p>
                      <div className="flex items-end gap-1 justify-end">
                          <span className="text-3xl md:text-4xl font-black text-gray-900 tabular-nums tracking-tighter">{totalMixedNugget.toLocaleString()}</span>
                          <span className="text-sm text-gray-600 font-bold mb-1">kg</span>
                      </div>
                  </div>
              </div>
          </div>

          <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto no-scrollbar">
              <button onClick={() => setActiveTab('SORT')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'SORT' ? 'bg-white border-t-2 border-t-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Scissors /> 1. 選別待ち ({toSortLots.length})
              </button>
              <button onClick={() => setActiveTab('PROCESS')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'PROCESS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Blend /> 2. 加工ヤード ({readyLots.length})
              </button>
              <button onClick={() => setActiveTab('LOG')} className={`px-4 py-3 md:py-4 text-xs md:text-sm font-bold tracking-widest whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'LOG' ? 'bg-white border-t-2 border-t-gray-900 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                  <Icons.Check /> 3. 製造ログ
              </button>
          </div>

          <div className="flex-1 bg-white border-x border-b border-gray-200 shadow-sm flex flex-col min-h-[400px] overflow-hidden">
              
              {activeTab === 'SORT' && (
                  <div className="p-4 md:p-6 overflow-y-auto bg-gray-50 flex-1">
                      {toSortLots.length === 0 ? (
                          <div className="text-center py-16 text-gray-400 font-bold text-sm">選別待ちの荷物はありません</div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {toSortLots.map(lot => (
                                  <div key={lot.lotId} className={`bg-white border ${lot.isTin ? 'border-red-300' : 'border-gray-200'} rounded-sm p-5 shadow-sm hover:border-gray-400 transition flex flex-col`}>
                                      <div className="flex justify-between items-start mb-3">
                                          <div className="flex items-center gap-1">
                                              <span className="text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200 px-2 py-0.5 rounded-sm">未選別</span>
                                              <ProvenanceBadge type="HUMAN" />
                                          </div>
                                          <span className="text-[10px] text-gray-400 tabular-nums">{lot.date} 入庫</span>
                                      </div>
                                      <h4 className="font-black text-gray-900 text-lg mb-1 flex items-center gap-1">
                                          {lot.isTin && <span className="bg-[#D32F2F] text-white text-[9px] px-1.5 py-0.5 rounded-sm">⚠️錫メッキ</span>}
                                          {lot.product}
                                      </h4>
                                      <p className="text-sm text-gray-500 flex items-center mb-5"><Icons.User /> {lot.memberName}</p>
                                      <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center">
                                          <p className="text-3xl font-black tabular-nums text-gray-900 tracking-tighter">{lot.remainingWeight.toFixed(1)}<span className="text-xs font-bold text-gray-500 ml-1">kg</span></p>
                                          
                                          <div className="flex gap-2">
                                              <button onClick={() => handleSkipSort(lot)} disabled={isSubmitting} className="bg-gray-100 text-gray-600 border border-gray-300 text-xs font-bold px-3 py-2.5 rounded-sm hover:bg-gray-200 transition flex items-center gap-1 disabled:opacity-50">
                                                  直行 <Icons.FastForward />
                                              </button>
                                              
                                              {/* ★ スマート初期値セット機能 */}
                                              <button onClick={() => {
                                                  setSortingLot(lot);
                                                  setSortOutputs([{ 
                                                      category: '被覆B', 
                                                      ratio: String(lot.expectedRatio || ''), 
                                                      weight: String(lot.remainingWeight) 
                                                  }]);
                                              }} className="bg-gray-900 text-white text-sm font-bold px-4 py-2.5 rounded-sm shadow-sm hover:bg-black transition">
                                                  選別
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}

              {activeTab === 'PROCESS' && (
                  <div className="flex flex-col h-full relative">
                      <div className="p-0 overflow-y-auto overflow-x-auto flex-1 pb-20">
                          <table className="w-full text-left border-collapse min-w-[600px]">
                              <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10">
                                  <tr>
                                      <th className="p-3 w-12 text-center"><input type="checkbox" onChange={(e) => setCheckedLotIds(e.target.checked ? readyLots.map(l=>l.lotId) : [])} checked={checkedLotIds.length === readyLots.length && readyLots.length > 0} className="w-4 h-4 accent-[#D32F2F]" /></th>
                                      <th className="p-3 text-xs font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">状態 / 入庫</th>
                                      <th className="p-3 text-xs font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">品目 <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">業者名 <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs font-bold text-gray-900 uppercase tracking-widest text-right whitespace-nowrap">重量 <ProvenanceBadge type="HUMAN" /></th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {readyLots.length === 0 && <tr><td colSpan={5} className="py-16 text-center text-sm font-bold text-gray-400">加工待ちのヤード在庫はありません</td></tr>}
                                  {readyLots.map(lot => (
                                      <tr key={lot.lotId} className={`hover:bg-red-50/30 transition cursor-pointer ${checkedLotIds.includes(lot.lotId) ? 'bg-red-50/50' : ''}`} onClick={() => setCheckedLotIds(prev => prev.includes(lot.lotId) ? prev.filter(id => id !== lot.lotId) : [...prev, lot.lotId])}>
                                          <td className="p-3 text-center" onClick={e => e.stopPropagation()}><input type="checkbox" className="w-5 h-5 accent-[#D32F2F]" checked={checkedLotIds.includes(lot.lotId)} onChange={() => setCheckedLotIds(prev => prev.includes(lot.lotId) ? prev.filter(id => id !== lot.lotId) : [...prev, lot.lotId])} /></td>
                                          <td className="p-3">
                                              <div className="flex flex-col items-start gap-1">
                                                  {lot.isSorted ? <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-sm">選別済</span> : <span className="text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded-sm">原反</span>}
                                                  <span className="text-xs text-gray-400 tabular-nums">{lot.date}</span>
                                              </div>
                                          </td>
                                          <td className="p-3 font-bold text-base text-gray-900">
                                              <div className="flex items-center gap-1">
                                                  {lot.isTin && <span className="bg-[#D32F2F] text-white text-[9px] px-1.5 py-0.5 rounded-sm shadow-sm animate-pulse">⚠️錫</span>}
                                                  {lot.product}
                                              </div>
                                          </td>
                                          <td className="p-3 text-sm text-gray-600">{lot.memberName}</td>
                                          <td className="p-3 text-right font-black tabular-nums text-xl text-gray-900 tracking-tighter">{lot.remainingWeight.toFixed(1)}<span className="text-xs text-gray-500 font-normal ml-1">kg</span></td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                      
                      {checkedLotIds.length > 0 && (
                          <div className="fixed bottom-0 left-0 md:absolute md:bottom-0 md:left-0 w-full bg-gray-100 border-t border-gray-200 p-4 flex justify-between items-center shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-50">
                              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                                  <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-sm border border-gray-300 inline-block w-max text-gray-700">{checkedLotIds.length} 件選択中</span>
                                  <span className="text-sm text-gray-500">合計 <span className="text-2xl font-black tabular-nums text-gray-900 ml-1 tracking-tighter">{readyLots.filter(l => checkedLotIds.includes(l.lotId)).reduce((sum, l) => sum + l.remainingWeight, 0).toFixed(1)}</span> kg</span>
                              </div>
                              <button onClick={openBlendModal} className="bg-[#D32F2F] hover:bg-red-700 text-white px-5 py-3 md:px-8 md:py-3.5 rounded-sm font-bold text-sm md:text-base shadow-sm flex items-center gap-2 transition whitespace-nowrap">
                                  <Icons.Blend /> ブレンド加工へ
                              </button>
                          </div>
                      )}
                  </div>
              )}

              {activeTab === 'LOG' && (
                  <div className="flex flex-col flex-1 overflow-hidden relative">
                      <div className={`transition-all duration-500 flex-shrink-0 ${showAiData ? 'max-h-40 opacity-100 border-b border-gray-200' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                          <div className="bg-gray-50 p-4 border-b border-gray-200">
                              <h4 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-1.5"><Icons.Brain /> AI アラート・分析</h4>
                              {productions.length > 0 ? (() => {
                                  const recent = productions.slice(-1);
                                  const last = recent[0];
                                  const master = wiresMaster.find((w:any) => getDisplayName(w) === last.materialName || w.name === last.materialName);
                                  const expected = master ? Number(master.ratio) : 0;
                                  const actual = Number(last.actualRatio);
                                  const diff = actual - expected;
                                  
                                  if (expected > 0 && Math.abs(diff) > 2.0) {
                                      return (
                                          <div className={`p-3 rounded-sm border text-sm font-bold ${diff > 0 ? 'bg-white border-gray-300 text-gray-800' : 'bg-red-50 border-red-200 text-[#D32F2F]'}`}>
                                              <ProvenanceBadge type="AI_AUTO" /> 最新ロット（{last.materialName}）の歩留まりがマスタ設定値({expected}%)から大きく乖離({diff > 0 ? '+'+diff.toFixed(1) : diff.toFixed(1)}%)しています。{diff < 0 ? '異物混入や機械の摩耗の可能性があります。' : '非常に良質なロットでした。'}
                                          </div>
                                      );
                                  } else {
                                      return <div className="p-3 bg-white border border-gray-200 rounded-sm text-sm text-gray-500"><ProvenanceBadge type="AI_AUTO" /> 直近の加工データに異常な歩留まりのブレは検出されていません。正常稼働です。</div>;
                                  }
                              })() : <div className="text-xs text-gray-400">データがありません</div>}
                          </div>
                      </div>

                      <div className="p-0 overflow-y-auto overflow-x-auto flex-1">
                          <table className="w-full text-left border-collapse min-w-[800px]">
                              <thead className="sticky top-0 bg-gray-100 border-b border-gray-200 z-10 shadow-sm">
                                  <tr>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">登録日時 <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">対象バッチ</th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap text-right">投入量 <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-[#D32F2F] uppercase tracking-widest whitespace-nowrap text-right">上ナゲット <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap text-right">雑ナゲット <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap text-right">被覆 <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap text-right">ダスト <ProvenanceBadge type="HUMAN" /></th>
                                      <th className="p-3 text-xs md:text-sm font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap text-right">実質歩留 <ProvenanceBadge type="HUMAN" /></th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                  {productions.slice(-20).reverse().map((p: any, idx: number) => {
                                      const master = wiresMaster.find((w:any) => getDisplayName(w) === p.materialName || w.name === p.materialName);
                                      const expected = master ? Number(master.ratio) : 0;
                                      const diff = Number(p.actualRatio) - expected;
                                      const isAlert = expected > 0 && Math.abs(diff) > 2.0;
                                      
                                      const outputRedVal = Number(p.outputRed) || Number(p.outputCopper) || 0;
                                      const outputMixedVal = Number(p.outputMixed) || 0;
                                      const outputCoverVal = Number(p.outputChips) || 0;
                                      const outputDustVal = Number(p.outputJute) || 0;

                                      return (
                                          <tr key={idx} className={`hover:bg-gray-50 transition ${showAiData && isAlert && diff < 0 ? 'bg-red-50/30' : ''}`}>
                                              <td className="p-3 text-xs md:text-sm text-gray-500 tabular-nums whitespace-nowrap">
                                                  {p.createdAt ? String(p.createdAt).substring(5,16) : '不明'}
                                              </td>
                                              <td className="p-3 min-w-[150px]">
                                                  <p className="text-sm font-bold text-gray-900 leading-tight">{p.materialName}</p>
                                                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{p.memberName}</p>
                                              </td>
                                              <td className="p-3 text-right text-sm md:text-base tabular-nums text-gray-600 whitespace-nowrap">{Number(p.inputWeight || 0).toLocaleString()} kg</td>
                                              <td className="p-3 text-right text-sm md:text-base tabular-nums font-bold text-[#D32F2F] whitespace-nowrap">{outputRedVal.toLocaleString()} kg</td>
                                              <td className="p-3 text-right text-sm md:text-base tabular-nums font-bold text-gray-900 whitespace-nowrap">{outputMixedVal.toLocaleString()} kg</td>
                                              <td className="p-3 text-right text-sm md:text-base tabular-nums text-gray-500 whitespace-nowrap">{outputCoverVal.toLocaleString()} kg</td>
                                              <td className="p-3 text-right text-sm md:text-base tabular-nums text-gray-500 whitespace-nowrap">{outputDustVal > 0 ? <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded-sm font-bold border border-gray-200">{outputDustVal.toLocaleString()} kg</span> : '0 kg'}</td>
                                              <td className="p-3 text-right whitespace-nowrap">
                                                  <span className={`text-base md:text-lg tabular-nums font-black tracking-tighter ${showAiData && isAlert && diff < 0 ? 'text-[#D32F2F]' : 'text-gray-900'}`}>{p.actualRatio}%</span>
                                                  {showAiData && expected > 0 && (
                                                      <div className="text-[9px] text-gray-400 tabular-nums mt-0.5">
                                                          (マスタ比: {diff > 0 ? '+' : ''}{diff.toFixed(1)})
                                                      </div>
                                                  )}
                                              </td>
                                          </tr>
                                      );
                                  })}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
          
          {/* ★ 選別・仕分けモーダル */}
          {sortingLot && (
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-in fade-in">
                  <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl flex flex-col max-h-[95vh]">
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                          <div>
                              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Icons.Scissors /> 選別結果の登録 <ProvenanceBadge type="HUMAN" /></h3>
                              <p className="text-xs text-gray-500 mt-1 font-mono">元ロット: {sortingLot.product} ({sortingLot.remainingWeight}kg) / {sortingLot.memberName}</p>
                          </div>
                          <button onClick={() => setSortingLot(null)} className="text-gray-400 hover:text-gray-900 p-2 bg-white border border-gray-200 rounded-sm shadow-sm"><Icons.Close /></button>
                      </div>
                      
                      <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6 bg-white">
                          <div className="bg-gray-100 border border-gray-200 p-3 md:p-4 rounded-sm flex flex-col md:flex-row md:items-center gap-3 text-gray-900">
                              <div className="flex-1 flex items-center gap-3">
                                  <label className="text-sm font-bold text-gray-900 whitespace-nowrap"><Icons.Worker /> 作業担当</label>
                                  <select className="w-full bg-white border border-gray-300 p-2.5 md:p-3 text-sm md:text-base font-bold rounded-sm outline-none focus:border-gray-500" value={sortWorker} onChange={e => setSortWorker(e.target.value)}>
                                      {workerList.map(w => <option key={w} value={w}>{w}</option>)}
                                  </select>
                              </div>
                              <div className="flex-1 flex items-center gap-3">
                                  <label className="text-sm font-bold text-gray-900 whitespace-nowrap">時間</label>
                                  <div className="relative w-full">
                                      <input type="number" inputMode="decimal" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 pr-8 text-lg tabular-nums rounded-sm outline-none focus:border-gray-500 text-right" placeholder="0" value={sortTime} onChange={e => setSortTime(e.target.value)} />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">分</span>
                                  </div>
                              </div>
                          </div>

                          <div>
                              <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest border-b border-gray-200 pb-1">仕分け後の品目・重量</h4>
                              <div className="space-y-3">
                                  {sortOutputs.map((out, idx) => (
                                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 bg-gray-50 p-3 border border-gray-200 rounded-sm">
                                          
                                          {/* ★ 選択肢を現場のオペレーションに完全特化 */}
                                          <select className="w-full md:w-1/3 p-3 bg-white border border-gray-300 rounded-sm text-base font-bold outline-none" value={out.category} onChange={e => { const newOut = [...sortOutputs]; newOut[idx].category = e.target.value; setSortOutputs(newOut); }}>
                                              <option value="">品目を選択</option>
                                              <option value="被覆B">被覆B (ナゲット原料)</option>
                                              <option value="被覆C">被覆C (異物付き)</option>
                                              <option value="鉄">鉄</option>
                                              <option value="ゴミ">ゴミ・廃棄物</option>
                                          </select>

                                          {/* ★ 被覆Bの場合のみ、歩留まり入力枠が出現 */}
                                          {out.category === '被覆B' ? (
                                              <div className="relative w-full md:w-28">
                                                  <span className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">歩留</span>
                                                  <input type="number" inputMode="decimal" className="w-full p-3 pr-8 pl-12 md:pl-3 border border-[#D32F2F] rounded-sm text-lg tabular-nums text-right outline-none focus:ring-1 focus:ring-[#D32F2F] bg-red-50/30" placeholder="0" value={out.ratio} onChange={e => { const newOut = [...sortOutputs]; newOut[idx].ratio = e.target.value; setSortOutputs(newOut); }} />
                                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#D32F2F]">%</span>
                                              </div>
                                          ) : (
                                              <div className="w-full md:w-28 hidden md:block"></div>
                                          )}

                                          <div className="flex items-center gap-2 w-full md:w-auto md:flex-1">
                                              <div className="relative flex-1">
                                                  <span className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">重量</span>
                                                  <input type="number" inputMode="decimal" className="w-full p-3 pr-8 pl-12 md:pl-3 border border-gray-300 rounded-sm text-lg tabular-nums text-right outline-none focus:border-gray-500" placeholder="0" value={out.weight} onChange={e => { const newOut = [...sortOutputs]; newOut[idx].weight = e.target.value; setSortOutputs(newOut); }} />
                                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">kg</span>
                                              </div>
                                              <button onClick={() => setSortOutputs(sortOutputs.filter((_, i) => i !== idx))} className="p-3 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-sm"><Icons.Trash /></button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              <button onClick={() => setSortOutputs([...sortOutputs, { category: '', ratio: '', weight: '' }])} className="mt-3 w-full border-2 border-dashed border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-100 py-3 rounded-sm flex items-center justify-center gap-1 transition"><Icons.Plus /> 品目を追加</button>
                          </div>
                      </div>
                      
                      <div className="p-4 border-t border-gray-200 bg-gray-100 shrink-0">
                          <button onClick={handleSortSubmit} disabled={isSubmitting} className="w-full bg-[#D32F2F] text-white py-4 rounded-sm font-bold text-base shadow-md hover:bg-red-800 transition disabled:opacity-50">
                              {isSubmitting ? '処理中...' : '選別結果を保存して、加工待ちヤードへ送る'}
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* ブレンド加工モーダル */}
          {blendingLots.length > 0 && (
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-in fade-in">
                  <div className="bg-white rounded-sm shadow-2xl w-full max-w-2xl flex flex-col max-h-[95vh]">
                      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-start shrink-0">
                          <div>
                              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><Icons.Blend /> ブレンド加工の登録 <ProvenanceBadge type="HUMAN" /></h3>
                              <div className="text-xs text-gray-500 mt-2 space-y-1 bg-white p-2 border border-gray-200 rounded-sm max-h-24 overflow-y-auto tabular-nums">
                                  {blendingLots.map(l => (
                                      <div key={l.lotId} className="flex justify-between">
                                        <span className="flex items-center gap-1">
                                            {l.isTin && <span className="bg-[#D32F2F] text-white text-[9px] px-1 py-0.5 rounded-sm">錫</span>}
                                            {l.product} ({l.memberName})
                                        </span>
                                        <span>{l.remainingWeight.toFixed(1)}kg</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                          <button onClick={() => setBlendingLots([])} className="text-gray-400 hover:text-gray-900 p-2 bg-white border border-gray-200 rounded-sm shadow-sm"><Icons.Close /></button>
                      </div>
                      
                      <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6 bg-white">
                          <div className="bg-gray-100 border border-gray-200 p-3 md:p-4 rounded-sm flex flex-col md:flex-row md:items-center gap-3 text-gray-900">
                              <label className="text-sm font-bold flex items-center whitespace-nowrap"><Icons.Worker /> プラント担当</label>
                              <select className="w-full bg-white border border-gray-300 p-2.5 md:p-3 text-sm md:text-base font-bold rounded-sm outline-none focus:border-gray-500" value={processWorker} onChange={e => setProcessWorker(e.target.value)}>
                                  {workerList.map(w => <option key={w} value={w}>{w}</option>)}
                              </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                              <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                                  <label className="block text-xs font-bold text-gray-600 mb-2">総投入重量 (kg)</label>
                                  <div className="relative">
                                      <input type="number" inputMode="decimal" className="w-full bg-white border border-gray-300 p-3 pr-10 rounded-sm text-xl font-black tabular-nums text-right outline-none focus:border-[#D32F2F] shadow-inner" value={processInputWeight} onChange={e => setProcessInputWeight(e.target.value)} />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">kg</span>
                                  </div>
                              </div>
                              <div className="bg-red-50 p-4 border border-red-200 rounded-sm">
                                  <label className="block text-[11px] md:text-xs font-bold text-[#D32F2F] mb-2 whitespace-nowrap">産出 上ナゲット(赤)</label>
                                  <div className="relative">
                                      <input type="number" inputMode="decimal" className="w-full bg-white border border-[#D32F2F] p-3 pr-10 rounded-sm text-xl font-black tabular-nums text-gray-900 text-right outline-none focus:ring-2 focus:ring-[#D32F2F] shadow-inner" value={processOutputRed} onChange={e => setProcessOutputRed(e.target.value)} placeholder="0" />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">kg</span>
                                  </div>
                              </div>
                              <div className="bg-gray-100 p-4 border border-gray-300 rounded-sm">
                                  <label className="block text-[11px] md:text-xs font-bold text-gray-700 mb-2 whitespace-nowrap">産出 雑ナゲット</label>
                                  <div className="relative">
                                      <input type="number" inputMode="decimal" className="w-full bg-white border border-gray-400 p-3 pr-10 rounded-sm text-xl font-black tabular-nums text-gray-900 text-right outline-none focus:ring-2 focus:ring-gray-500 shadow-inner" value={processOutputMixed} onChange={e => setProcessOutputMixed(e.target.value)} placeholder="0" />
                                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold">kg</span>
                                  </div>
                              </div>
                          </div>

                          <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                              <label className="block text-xs font-bold text-gray-700 mb-1">回収 被覆重量 (kg) <span className="text-gray-400 font-normal ml-1">※任意</span></label>
                              <p className="text-[10px] text-gray-500 mb-2 leading-relaxed">
                                CV線などで紙や介在物（ゴミ）が含まれる場合のみ入力してください。<br/>未入力の場合は「総重量 − ナゲット ＝ すべて被覆（ダスト0）」として自動計算されます。
                              </p>
                              <div className="relative md:w-1/2">
                                  <input type="number" step="0.1" placeholder="入力なしで自動計算" className="w-full p-3 pr-10 border border-gray-300 rounded-sm text-sm tabular-nums outline-none focus:border-gray-900 bg-white text-right" value={processOutputCover} onChange={e => setProcessOutputCover(e.target.value)} />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">kg</span>
                              </div>
                          </div>

                          {processInputWeight && (processOutputRed || processOutputMixed) && (
                              <div className="bg-gray-100 border border-gray-300 text-gray-900 rounded-sm p-4 flex justify-between items-center shadow-sm">
                                  <div>
                                      <p className="text-[10px] text-gray-600 font-bold mb-1">算出ダスト(ゴミ)重量</p>
                                      <p className="tabular-nums font-black text-2xl text-gray-900 tracking-tighter">
                                          {(parseFloat(processOutputCover) > 0 ? Math.max(0, parseFloat(processInputWeight) - (parseFloat(processOutputRed)||0) - (parseFloat(processOutputMixed)||0) - parseFloat(processOutputCover)) : 0).toFixed(1)} <span className="text-sm font-normal text-gray-500">kg</span>
                                      </p>
                                  </div>
                                  <div className="text-right border-l border-gray-300 pl-4">
                                      <div className="flex items-center gap-2 justify-end mb-1">
                                          <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">ブレンド実測歩留</p>
                                          <ProvenanceBadge type="HUMAN" />
                                      </div>
                                      <p className="text-3xl md:text-4xl font-black tabular-nums tracking-tighter">
                                          {(((parseFloat(processOutputRed)||0) + (parseFloat(processOutputMixed)||0)) / parseFloat(processInputWeight) * 100).toFixed(1)} <span className="text-lg font-normal text-gray-500">%</span>
                                      </p>
                                  </div>
                              </div>
                          )}

                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">特記事項・刃の摩耗チェック等</label>
                              <input type="text" className="w-full border border-gray-300 p-3 rounded-sm text-sm outline-none focus:border-gray-900 bg-gray-50" placeholder="メモ..." value={processMemo} onChange={e => setProcessMemo(e.target.value)} />
                          </div>
                      </div>

                      <div className="p-4 border-t border-gray-200 bg-gray-100 shrink-0">
                          <button onClick={handleProcessSubmit} disabled={(!processOutputRed && !processOutputMixed) || isSubmitting} className="w-full bg-[#D32F2F] text-white py-4 rounded-sm font-bold text-lg shadow-md hover:bg-red-800 transition disabled:opacity-50">
                              {isSubmitting ? '処理中...' : 'ブレンド実績を保存する'}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};
