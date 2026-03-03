// @ts-nocheck
import React, { useState, useRef, useMemo, useEffect } from 'react';

const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Settings: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  ScaleIndividual: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Mic: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  CheckCircle: () => <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  UploadCloud: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any, editingResId?: string | null, localReservations?: any[], onSuccess: () => void, onClear: () => void }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'ANALYZING'>('IDLE');
  const [aiProgressStep, setAiProgressStep] = useState(0);
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: 'success' | 'info'} | null>(null);

  const [posMode, setPosMode] = useState<'INDIVIDUAL' | 'BULK'>('INDIVIDUAL');
  const [bulkTotalWeight, setBulkTotalWeight] = useState<number | ''>('');
  const [showSimDetails, setShowSimDetails] = useState(false);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [imgData1, setImgData1] = useState<string>('');
  const [imgData2, setImgData2] = useState<string>('');

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);

  const [simConfig, setSimConfig] = useState({
    disposalCostPerKg: 40,   
    laborCostPerHour: 3000,  
    capacityPerHour: 150,    
    targetMargin: 15         
  });

  const copperPrice = data?.market?.copper?.price || 1400;

  useEffect(() => {
    if (editingResId && localReservations) {
      const res = localReservations.find(r => r.id === editingResId);
      if (res) {
        try { 
            const items = typeof res.items === 'string' ? JSON.parse(res.items) : res.items;
            setCart(items); 
            if (items.some((i:any) => i.percentage !== undefined)) setPosMode('BULK');
        } catch(e){}
        if (res.memberId !== 'GUEST' && data?.clients) {
          const client = data.clients.find((c:any) => c.id === res.memberId);
          if (client) setSelectedClient(client);
        }
      }
    } else {
      setCart([]); setSelectedClient(null); setImgData1(''); setImgData2(''); setBulkTotalWeight('');
    }
  }, [editingResId, localReservations, data]);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
      setToastMessage({ title, desc, type });
      setTimeout(() => setToastMessage(null), 6000);
  };

  const buildProductName = (p: any) => {
    const maker = p.maker && p.maker !== '-' ? `【${p.maker}】` : '';
    const sizeStr = p.size || p.sq;
    const size = sizeStr && sizeStr !== '-' ? ` ${sizeStr}sq` : '';
    const coreStr = p.core || p.cores || p.coreCount;
    const core = coreStr && coreStr !== '-' ? ` ${coreStr}C` : '';
    return `${maker}${p.name}${size}${core}`.trim();
  };

  const addToCart = (product: any, overrideWeight?: number) => {
    const newItemId = Date.now().toString();
    setCart(prev => [...prev, { 
        id: newItemId, 
        product: buildProductName(product),
        ratio: product.ratio, 
        weight: overrideWeight !== undefined ? overrideWeight : 0,
        percentage: 0
    }]);
    setSearchTerm('');
  };

  const updateWeight = (id: string, weight: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, weight } : item));
  };

  const updatePercentage = (id: string, percentage: number) => {
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setCart(prev => prev.map(item => item.id === id ? { ...item, percentage } : item));
  };

  const removeItem = (id: string) => { setCart(prev => prev.filter(item => item.id !== id)); };

  const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader(); reader.readAsDataURL(file);
          reader.onload = (event) => {
              const img = new Image(); img.src = event.target?.result as string;
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX = 1200; let w = img.width; let h = img.height;
                  if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
                  canvas.width = w; canvas.height = h;
                  const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
                  resolve(canvas.toDataURL('image/jpeg', 0.8).split(',')[1]);
              };
              img.onerror = () => reject(new Error('Image loading failed'));
          };
          reader.onerror = () => reject(new Error('File reading failed'));
      });
  };

  const handleAiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
        const compressedBase64 = await compressImage(file);
        if (num === 1) setImgData1(compressedBase64); else setImgData2(compressedBase64);
    } catch (err) { alert("画像の処理に失敗しました。"); }
    e.target.value = '';
  };

  const runAiAnalysis = async () => {
    if (!imgData1) return alert('最低1枚の画像をアップロードしてください');
    
    setAiStatus('ANALYZING');
    setAiProgressStep(1); 

    const progressInterval = setInterval(() => {
        setAiProgressStep(prev => {
            if (prev === 1) return 2;
            if (prev === 2) return 3;
            return 3; 
        });
    }, 2000);

    try {
      const res = await fetch('/api/gas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VISION_AI_ASSESS', imageData: imgData1, imageData2: imgData2 })
      });
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      
      clearInterval(progressInterval);
      setAiProgressStep(4); 

      setTimeout(() => {
          if (result.status === 'success') {
            const isMixed = result.data.wireType.includes('フレコン') || result.data.wireType.includes('混合');
            const displayName = result.data.isNewFlag || isMixed ? `💡 AI査定: ${result.data.wireType}` : result.data.wireType;
            
            setCart(prev => [{
                id: Date.now().toString(), product: displayName, ratio: result.data.estimatedRatio, weight: 0, percentage: 0, isNewAi: true, reason: result.data.reason
            }, ...prev]);

            if (result.data.isNewFlag) {
                showToast('未知線種を仮登録しました', `「${result.data.wireType}」の画像とデータをデータベースに保存しました。`, 'success');
            } else {
                showToast('既存マスターと一致', `「${result.data.wireType}」として査定しました。`, 'info');
            }

            // ★ Web Speech API による音声読み上げ処理 (超簡潔化＆スピード1.4)
            if (isVoiceOutputEnabled && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const speakText = result.data.isNewFlag
                    ? `新規線種です。${result.data.wireType}、推定歩留まり、${result.data.estimatedRatio}パーセント。`
                    : `判定完了。${result.data.wireType} です。`;
                const utterance = new SpeechSynthesisUtterance(speakText);
                utterance.lang = 'ja-JP';
                utterance.rate = 1.4;
                window.speechSynthesis.speak(utterance);
            }

            setIsAiModalOpen(false);
            setImgData1(''); setImgData2(''); setAiProgressStep(0);
          } else { 
            alert('AI解析エラー: ' + result.message); 
            setIsAiModalOpen(false); setAiProgressStep(0);
          }
      }, 800);

    } catch(err: any) { 
        clearInterval(progressInterval);
        alert(`通信エラー: ${err.message}`); 
        setAiStatus('IDLE'); setAiProgressStep(0);
    } 
  };

  const startVoiceInput = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) { alert('お使いのブラウザは音声入力に対応していません。'); return; }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP'; recognition.interimResults = false; recognition.maxAlternatives = 1;

      recognition.onstart = () => { setIsListening(true); setVoiceText('🎤 途切れないように一気に喋ってください...'); };
      recognition.onresult = async (event) => {
          const text = event.results[0][0].transcript;
          setVoiceText(text); setIsListening(false);
          await processVoiceCommand(text);
      };
      recognition.onerror = (event) => { setIsListening(false); setVoiceText('音声が認識できませんでした'); setTimeout(() => setVoiceText(''), 2000); };
      recognition.onend = () => { setIsListening(false); };
      recognition.start();
  };

  const processVoiceCommand = async (text: string) => {
      if (!text) return;
      setIsProcessingVoice(true);
      try {
          const res = await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'PARSE_VOICE_COMMAND', text: text })
          });
          const result = await res.json();
          if (result.status === 'success' && result.parsed) {
              const p = result.parsed;
              const matchedWire = (data?.wires || []).find((w: any) => {
                  const mName = String(w.name || '').toLowerCase(); const mMaker = String(w.maker || '').toLowerCase();
                  const mSq = String(w.sq || w.size || ''); const mCore = String(w.core || w.cores || '');
                  const isNameMatch = p.name ? mName.includes(p.name.toLowerCase()) : true;
                  const isMakerMatch = p.maker ? mMaker.includes(p.maker.toLowerCase()) : true;
                  const isSqMatch = p.sq ? mSq === String(p.sq) : true; const isCoreMatch = p.core ? mCore === String(p.core) : true;
                  return (isNameMatch || isMakerMatch) && isSqMatch && isCoreMatch;
              });
              if (matchedWire) { addToCart(matchedWire, p.weight || 0); setVoiceText(`追加完了: ${buildProductName(matchedWire)} ${p.weight ? p.weight+'kg' : ''}`); } 
              else { setVoiceText('該当するマスターが見つかりませんでした。'); }
          } else { setVoiceText('聞き取れませんでした。もう一度お試しください。'); }
      } catch (e) { setVoiceText('通信エラーが発生しました。'); }
      setIsProcessingVoice(false); setTimeout(() => setVoiceText(''), 3000);
  };

  const simulation = useMemo(() => {
    let totalWeight = 0; let cuWeight = 0;
    cart.forEach(item => {
      const w = posMode === 'BULK' ? (Number(bulkTotalWeight) || 0) * ((Number(item.percentage) || 0) / 100) : (Number(item.weight) || 0);
      const r = Number(item.ratio) || 0;
      totalWeight += w; cuWeight += w * (r / 100);
    });
    const wasteWeight = totalWeight - cuWeight; const grossCuValue = cuWeight * copperPrice; 
    const disposalCost = wasteWeight * simConfig.disposalCostPerKg; const processingHours = totalWeight / simConfig.capacityPerHour; 
    const laborCost = processingHours * simConfig.laborCostPerHour; const targetProfitAmount = grossCuValue * (simConfig.targetMargin / 100); 
    let limitTotalCost = grossCuValue - disposalCost - laborCost - targetProfitAmount; if (limitTotalCost < 0) limitTotalCost = 0;
    const limitUnitPrice = totalWeight > 0 ? Math.floor(limitTotalCost / totalWeight) : 0;
    const expectedYield = totalWeight > 0 ? (cuWeight / totalWeight) * 100 : 0;
    return { totalWeight, cuWeight, wasteWeight, grossCuValue, disposalCost, laborCost, targetProfitAmount, limitTotalCost, limitUnitPrice, processingHours, expectedYield };
  }, [cart, copperPrice, simConfig, posMode, bulkTotalWeight]);

  const totalPercentage = cart.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
  const isPercentageValid = totalPercentage === 100;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('カートが空です');
    if (posMode === 'INDIVIDUAL' && simulation.totalWeight === 0) return alert('重量を入力してください');
    if (posMode === 'BULK') {
        if (!bulkTotalWeight || Number(bulkTotalWeight) <= 0) return alert('フレコンの総重量を入力してください');
        if (!isPercentageValid) return alert(`割合の合計を100%にしてください（現在: ${totalPercentage}%）`);
    }
    setIsProcessing(true);
    const finalCart = cart.map(item => ({ ...item, weight: posMode === 'BULK' ? ((Number(bulkTotalWeight) || 0) * ((Number(item.percentage) || 0) / 100)).toFixed(1) : item.weight }));
    const payload = { action: editingResId ? 'UPDATE_RESERVATION' : 'REGISTER_RESERVATION', reservationId: editingResId, memberId: selectedClient?.id || 'GUEST', memberName: selectedClient?.name || '新規・非会員 (飛込)', items: finalCart, totalEstimate: simulation.limitTotalCost, status: 'RESERVED' };
    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') onSuccess(); else alert('エラー: ' + result.message);
    } catch(err: any) { alert('通信エラー: ' + err.message); }
    setIsProcessing(false);
  };

  const filteredProducts = (data?.wires || []).filter((w:any) => {
      const searchTarget = `${w.name} ${w.maker} ${w.size || w.sq} ${w.core || w.cores || w.coreCount} ${w.year}`.toLowerCase();
      return searchTarget.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-full animate-in fade-in duration-300 pb-24 lg:pb-0 relative">
      
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] animate-in slide-in-from-top-10 fade-in duration-300 w-[90%] max-w-md">
            <div className={`bg-white border-l-4 ${toastMessage.type === 'success' ? 'border-green-500' : 'border-blue-500'} p-4 rounded-sm shadow-2xl flex items-start gap-3`}>
                <div className="mt-0.5">{toastMessage.type === 'success' ? <Icons.CheckCircle /> : <Icons.Sparkles />}</div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{toastMessage.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{toastMessage.desc}</p>
                </div>
            </div>
        </div>
      )}

      {/* 左パネル: 商品リスト */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden h-[50vh] lg:h-full shrink-0">
        
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-3 items-center relative shrink-0">
          {(isListening || isProcessingVoice || voiceText) && (
              <div className="absolute top-full left-0 w-full z-10 bg-blue-900 text-white p-2 text-center text-sm font-bold shadow-md animate-in slide-in-from-top-2">
                  {isListening ? <span className="animate-pulse">{voiceText}</span> :
                   isProcessingVoice ? <span><Icons.Refresh className="inline mr-2 animate-spin"/> AIが解析中...</span> :
                   <span>{voiceText}</span>}
              </div>
          )}
          <div className="flex w-full gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                <input type="text" placeholder="品目、メーカー等で検索..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <button 
                  onClick={startVoiceInput}
                  disabled={isListening || isProcessingVoice}
                  className={`px-4 py-3 border rounded-sm flex items-center justify-center transition-all ${isListening ? 'bg-red-500 border-red-600 text-white animate-pulse' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                  title="音声で追加"
              >
                  <Icons.Mic />
              </button>
          </div>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="w-full md:w-auto bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-5 rounded-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            <Icons.Camera />
            <span>AI 線種分析</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-100/50">
          <p className="text-xs font-bold text-gray-500 mb-3 tracking-widest">よく使うマスター線種をタップ</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredProducts.map((p:any) => (
              <button 
                key={p.id} onClick={() => addToCart(p)} 
                className="bg-white border border-gray-200 p-3 rounded-md shadow-sm hover:shadow-md hover:border-blue-400 text-left transition-all active:scale-95 flex flex-col justify-between min-h-[105px] relative overflow-hidden group"
              >
                <div>
                  <div className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">{p.name}</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.maker && p.maker !== '-' && <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-sm font-bold shadow-sm">{p.maker}</span>}
                    {(p.size || p.sq) && (p.size !== '-' && p.sq !== '-') && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-sm font-mono font-bold shadow-sm">{(p.size || p.sq)}sq</span>}
                    {(p.core || p.cores || p.coreCount) && (p.core !== '-' && p.cores !== '-' && p.coreCount !== '-') && <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-sm font-mono font-bold shadow-sm">{(p.core || p.cores || p.coreCount)}C</span>}
                  </div>
                </div>
                <div className="flex justify-end mt-2"><span className="font-mono font-black text-blue-600 bg-blue-50/50 px-2 py-0.5 rounded-sm text-sm">{p.ratio}%</span></div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 右パネル: カート＆利益計算 */}
      <div className="w-full lg:w-5/12 bg-white border border-gray-200 rounded-sm flex flex-col shadow-lg relative overflow-hidden min-h-[50vh] lg:h-full shrink-0">
        
        <div className="flex shrink-0">
          <button onClick={() => setPosMode('INDIVIDUAL')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${posMode === 'INDIVIDUAL' ? 'bg-white text-blue-700 border-t-4 border-t-blue-600' : 'bg-gray-100 text-gray-400 border-t-4 border-t-transparent border-b border-b-gray-200'}`}><Icons.ScaleIndividual /> 個別計量モード</button>
          <button onClick={() => setPosMode('BULK')} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${posMode === 'BULK' ? 'bg-white text-blue-700 border-t-4 border-t-blue-600' : 'bg-gray-100 text-gray-400 border-t-4 border-t-transparent border-b border-b-gray-200'}`}><Icons.Box /> フレコン一括モード</button>
        </div>

        <div className="p-3 border-b border-gray-200 bg-white shrink-0">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">持込業者・顧客</label>
          <select className="w-full border border-gray-300 bg-white p-2 rounded-sm text-sm font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm" value={selectedClient?.id || ''} onChange={e => { const client = data?.clients?.find((c:any) => c.id === e.target.value); setSelectedClient(client || null); }}>
            <option value="">新規・非会員 (飛込ゲスト)</option>
            {data?.clients?.map((c:any) => <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>)}
          </select>
        </div>

        {posMode === 'BULK' && (
          <div className="p-4 bg-blue-50 border-b border-blue-100 shadow-inner shrink-0">
            <label className="block text-xs font-bold text-blue-800 mb-2 uppercase tracking-widest">フレコン総重量 (一括計量)</label>
            <div className="relative">
              <input type="number" className="w-full p-3 text-right font-mono font-black text-3xl rounded-sm outline-none focus:ring-2 focus:ring-blue-400 border border-blue-200 shadow-sm text-blue-900" value={bulkTotalWeight} onChange={e => setBulkTotalWeight(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-blue-400 font-bold pointer-events-none">kg</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3 bg-gray-50/50 min-h-[200px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 py-10"><p className="font-bold text-sm">左から商材を選択してください</p></div>
          ) : (
            <div className="space-y-3 pb-2">
              {cart.map(item => (
                <div key={item.id} className={`border p-4 rounded-sm flex flex-col gap-2 relative shadow-sm ${item.isNewAi ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div className="pr-6">
                      <div className="font-bold text-gray-900 text-base leading-tight flex items-center gap-1">{item.product}</div>
                      <div className="text-xs text-gray-500 mt-1">歩留まり: <span className="font-mono font-bold text-blue-600">{item.ratio}%</span></div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 absolute top-3 right-3"><Icons.Trash /></button>
                  </div>
                  
                  <div className="flex justify-end items-center mt-2">
                    {posMode === 'INDIVIDUAL' ? (
                      <div className="w-44 relative">
                        <input type="number" className="w-full border border-gray-300 bg-gray-50 p-3 text-right font-mono font-black text-2xl rounded-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 transition-all" value={item.weight || ''} onChange={e => updateWeight(item.id, Number(e.target.value))} placeholder="0" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold pointer-events-none">kg</span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center gap-3">
                        <input type="range" min="0" max="100" className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" value={item.percentage || 0} onChange={e => updatePercentage(item.id, Number(e.target.value))} />
                        <div className="w-24 relative flex-shrink-0">
                          <input type="number" className="w-full border border-gray-300 bg-gray-50 p-2 pr-6 text-right font-mono font-black text-xl rounded-sm outline-none" value={item.percentage || ''} onChange={e => updatePercentage(item.id, Number(e.target.value))} placeholder="0" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold pointer-events-none">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {item.reason && <div className="mt-3 bg-white border border-blue-200 p-3 rounded-sm text-xs lg:text-sm text-gray-700 leading-relaxed shadow-sm"><span className="font-black text-blue-700 block mb-1">💡 AI推論の根拠</span>{item.reason}</div>}
                </div>
              ))}
              {posMode === 'BULK' && cart.length > 0 && (
                <div className={`p-3 rounded-sm text-center text-sm font-bold border transition-colors ${isPercentageValid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200 animate-pulse'}`}>
                  割合合計: {totalPercentage}% {isPercentageValid ? '✨ 完璧です' : '⚠️ 100%に調整してください'}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[#111111] text-white p-5 border-t-4 border-red-600 relative shrink-0">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black text-sm tracking-widest text-gray-300 flex items-center gap-2">限界買取シミュレーター</h3>
            <button onClick={() => setShowSimDetails(!showSimDetails)} className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold bg-gray-800 px-2 py-1 rounded-sm transition"><Icons.Settings /> 設定</button>
          </div>

          {showSimDetails && (
            <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-800 p-3 rounded-sm border border-gray-700">
              <div><label className="block text-[10px] text-gray-400 mb-1">産廃処分(円)</label><input type="number" className="w-full bg-gray-900 border-gray-600 rounded-sm p-1.5 text-sm text-right" value={simConfig.disposalCostPerKg} onChange={e => setSimConfig({...simConfig, disposalCostPerKg: Number(e.target.value)})} /></div>
              <div><label className="block text-[10px] text-gray-400 mb-1">工場コスト(円)</label><input type="number" className="w-full bg-gray-900 border-gray-600 rounded-sm p-1.5 text-sm text-right" value={simConfig.laborCostPerHour} onChange={e => setSimConfig({...simConfig, laborCostPerHour: Number(e.target.value)})} /></div>
              <div><label className="block text-[10px] text-red-400 mb-1">利益率(%)</label><input type="number" className="w-full bg-red-900/30 border-red-500 text-red-100 font-bold rounded-sm p-1.5 text-sm text-right" value={simConfig.targetMargin} onChange={e => setSimConfig({...simConfig, targetMargin: Number(e.target.value)})} /></div>
            </div>
          )}

          <div className="flex justify-between items-end mb-4 bg-gray-800 p-4 rounded-sm border border-gray-700">
            <div>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest mb-1">単価上限</p>
              <div className="flex items-baseline gap-1"><span className="text-4xl font-black font-mono text-white leading-none">¥{simulation.limitUnitPrice.toLocaleString()}</span><span className="text-sm text-gray-400 font-bold">/kg</span></div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 mb-1 font-bold tracking-widest">総重量 {simulation.totalWeight.toFixed(1)}kg</p>
              <p className="text-xl font-bold font-mono text-white">計 ¥{simulation.limitTotalCost.toLocaleString()}</p>
            </div>
          </div>

          <button onClick={handleCheckout} disabled={isProcessing || simulation.totalWeight === 0 || (posMode === 'BULK' && !isPercentageValid)} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-sm transition shadow-[0_4px_14px_0_rgba(220,38,38,0.39)] disabled:opacity-50 flex justify-center items-center text-lg">{isProcessing ? <Icons.Refresh /> : '受付を確定してカンバンへ'}</button>
          <div className="mt-3 text-center"><button onClick={() => {setCart([]); onClear(); setBulkTotalWeight('');}} className="text-[10px] text-gray-500 font-bold border border-gray-700 px-3 py-1 rounded-sm">カートをリセット</button></div>
        </div>
      </div>

      {/* ★ AI モーダル */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-2xl rounded-md shadow-2xl animate-in zoom-in-95 border border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h3 className="font-black text-white flex items-center gap-2"><Icons.Sparkles /> AI 線種分析</h3>
              {aiStatus !== 'ANALYZING' && <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 hover:text-white"><Icons.Close /></button>}
            </div>
            
            <div className="p-6">
              {aiStatus === 'ANALYZING' ? (
                <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative w-20 h-20 mb-8">
                        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-blue-400"><Icons.Sparkles /></div>
                    </div>
                    <div className="space-y-5 w-full max-w-xs font-bold text-sm">
                        <div className={`flex items-center gap-4 transition-all duration-500 ${aiProgressStep >= 1 ? 'text-blue-400 translate-x-0 opacity-100' : 'text-gray-700 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 2 ? '✅' : aiProgressStep === 1 ? '🔄' : '・'}</span>
                            <span>画像をサーバーへ送信中...</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ${aiProgressStep >= 2 ? 'text-blue-400 translate-x-0 opacity-100' : 'text-gray-700 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 3 ? '✅' : aiProgressStep === 2 ? '🔄' : '・'}</span>
                            <span>AIが画像を解析・特徴抽出中...</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ${aiProgressStep >= 3 ? 'text-blue-400 translate-x-0 opacity-100' : 'text-gray-700 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 4 ? '✅' : aiProgressStep === 3 ? '🔄' : '・'}</span>
                            <span>マスターデータと照合・推論中...</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ${aiProgressStep >= 4 ? 'text-green-400 scale-110 translate-x-0 opacity-100' : 'text-gray-700 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 4 ? '✨' : '・'}</span>
                            <span>解析完了！結果を出力します</span>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="animate-in fade-in">
                    <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                        判断に迷う特殊な線種をAIに査定させます。<br/>
                        スケール（定規）が写った断面写真と、あれば印字の写真をアップロードしてください。<br/>
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className={`flex-1 p-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-all ${imgData1 ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
                            <span className={`text-sm font-bold mb-4 ${imgData1 ? 'text-blue-400' : 'text-gray-300'}`}>
                                {imgData1 ? '✅ 断面画像 (読込済)' : '1. 断面画像 (必須)'}
                            </span>
                            <div className="flex gap-2 w-full">
                                <label className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-sm">
                                    <Icons.Camera /> カメラ
                                    <input type="file" onChange={e => handleAiImageUpload(e, 1)} className="hidden" accept="image/*" capture="environment" />
                                </label>
                                <label className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-sm">
                                    <Icons.UploadCloud /> フォルダ
                                    <input type="file" onChange={e => handleAiImageUpload(e, 1)} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <div className={`flex-1 p-4 border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-all ${imgData2 ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 bg-gray-800/50'}`}>
                            <span className={`text-sm font-bold mb-4 ${imgData2 ? 'text-blue-400' : 'text-gray-300'}`}>
                                {imgData2 ? '✅ 印字画像 (読込済)' : '2. 表面印字 (任意)'}
                            </span>
                            <div className="flex gap-2 w-full">
                                <label className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-sm">
                                    <Icons.Camera /> カメラ
                                    <input type="file" onChange={e => handleAiImageUpload(e, 2)} className="hidden" accept="image/*" capture="environment" />
                                </label>
                                <label className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-sm text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer shadow-sm">
                                    <Icons.UploadCloud /> フォルダ
                                    <input type="file" onChange={e => handleAiImageUpload(e, 2)} className="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <button onClick={runAiAnalysis} disabled={!imgData1} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-md flex justify-center items-center gap-2 disabled:bg-gray-700 transition shadow-lg text-lg">
                        <Icons.Sparkles />解析してカートに追加する
                    </button>

                    <div className="mt-4 flex justify-center">
                        <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={isVoiceOutputEnabled} 
                                onChange={e => setIsVoiceOutputEnabled(e.target.checked)}
                                className="w-4 h-4 accent-blue-500 rounded-sm cursor-pointer"
                            />
                            🔊 査定結果と根拠を音声で読み上げる
                        </label>
                    </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
