// app/components/admin/AdminPos.tsx
// @ts-nocheck
import React, { useState, useRef, useMemo, useEffect } from 'react';

const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Camera: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  UploadCloud: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Trash: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-4 h-4 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Settings: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Box: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  ScaleIndividual: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Mic: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  CheckCircle: () => <svg className="w-5 h-5 text-green-500 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  AlertTriangle: () => <svg className="w-4 h-4 inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Edit: () => <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  ChevronDown: () => <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
  Document: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> // ★ 追加
};

const parseItemsData = (rawItems: any) => {
  if (!rawItems) return [];
  if (Array.isArray(rawItems)) return rawItems;
  try {
      let temp = String(rawItems);
      if (temp.startsWith('"') && temp.endsWith('"')) temp = temp.slice(1, -1);
      temp = temp.replace(/""/g, '"');
      temp = temp.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
      let parsed = JSON.parse(temp);
      if (typeof parsed === 'string') parsed = JSON.parse(parsed);
      if (Array.isArray(parsed)) return parsed;
  } catch (e) {
      console.error("Cart load error", e);
  }
  return [];
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear, isVoiceOutputEnabled }: { data: any, editingResId?: string | null, localReservations?: any[], onSuccess: (data: any) => void, onClear: () => void, isVoiceOutputEnabled?: boolean }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [selectedMaker, setSelectedMaker] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, desc: string, type: 'success' | 'info'} | null>(null);

  const [posMode, setPosMode] = useState<'INDIVIDUAL' | 'BULK'>('INDIVIDUAL');
  const [bulkTotalWeight, setBulkTotalWeight] = useState<number | ''>('');
  const [showSimDetails, setShowSimDetails] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'ANALYZING'>('IDLE');
  const [aiProgressStep, setAiProgressStep] = useState(0);
  
  const [imgData1, setImgData1] = useState<string>('');
  const [imgData2, setImgData2] = useState<string>('');
  const [imgData3, setImgData3] = useState<string>('');
  const [imgData4, setImgData4] = useState<string>('');
  const [aiHint, setAiHint] = useState<string>('');

  const [isBulkAiModalOpen, setIsBulkAiModalOpen] = useState(false);
  const [bulkImages, setBulkImages] = useState<string[]>([]);

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const recognitionRef = useRef<any>(null);

const [isListeningHint, setIsListeningHint] = useState(false);
  const hintRecognitionRef = useRef<any>(null);

  const [catalogsData, setCatalogsData] = useState<any[]>([]);
  useEffect(() => {
      const fetchAllCatalogs = async () => {
          const CATALOG_FILES = ['/specs/yazaki.json', '/specs/fujikura.json', '/specs/sumitomo.json', '/specs/hst.json', '/specs/swcc.json', '/specs/fuji.json'];
          try {
              const responses = await Promise.all(CATALOG_FILES.map(file => fetch(file).then(res => res.ok ? res.json() : [])));
              setCatalogsData(responses.flat());
          } catch(e) {}
      };
      fetchAllCatalogs();
  }, []);

  const [simConfig, setSimConfig] = useState({
      chipCostPerKg: 30,         
      juteCostPerKg: 50,         
      laborCostPerHour: 2515,     
      powerCostPerHour: 1125,     
      capacityPerHour: 150,       
      machineLossPercent: 1,     
      targetMargin: 15           
  });

  const copperPrice = data?.market?.copper?.price || 2130; 

  const CATEGORIES = ['すべて', 'IV線', 'CV・電力線', 'VVF / VV (ネズミ線)', '制御・通信線', 'キャブタイヤ・雑線', 'その他'];
  const getCategory = (name: string) => {
      if (!name) return 'その他';
      const n = name.toUpperCase();
      if (n.includes('VVF') || n.includes('VA') || n.includes('EEF/F') || (n.includes('VV') && !n.includes('CVV'))) return 'VVF / VV (ネズミ線)';
      if (n.includes('IV') || n.includes('IE/F')) return 'IV線';
      if (n.includes('CVT') || (n.includes('CV') && !n.includes('CVV')) || n.includes('CE/F') || n.includes('EM')) return 'CV・電力線';
      if (n.includes('CVV') || n.includes('AE') || n.includes('通信') || n.includes('LAN') || n.includes('弱電') || n.includes('光')) return '制御・通信線';
      if (n.includes('VCT') || n.includes('雑線') || n.includes('家電') || n.includes('ハーネス')) return 'キャブタイヤ・雑線';
      return 'その他';
  };

  const uniqueMakers = useMemo(() => Array.from(new Set((data?.wires || []).map((w:any) => w.maker).filter((m:any) => m && m !== '-'))), [data]);

  useEffect(() => {
    if (editingResId && localReservations) {
      const res = localReservations.find(r => r.id === editingResId);
      if (res) {
        const items = parseItemsData(res.items);
        setCart(items); 
        
        if (items.some((i:any) => i.percentage !== undefined && i.percentage > 0)) {
            setPosMode('BULK');
            const totalW = items.reduce((sum: number, i: any) => sum + Number(i.weight || 0), 0);
            setBulkTotalWeight(totalW);
        } else {
            setPosMode('INDIVIDUAL');
            setBulkTotalWeight('');
        }
        
        if (res.memberId !== 'GUEST' && data?.clients) {
          const client = data.clients.find((c:any) => c.id === res.memberId);
          if (client) setSelectedClient(client);
        } else {
          setSelectedClient(null);
        }
      }
    } else {
      setCart([]); setSelectedClient(null); 
      setImgData1(''); setImgData2(''); setImgData3(''); setImgData4(''); 
      setBulkTotalWeight(''); setAiHint('');
    }
  }, [editingResId, localReservations, data]);

  const showToast = (title: string, desc: string, type: 'success' | 'info' = 'success') => {
      setToastMessage({ title, desc, type });
      setTimeout(() => setToastMessage(null), 6000);
  };

  const buildProductName = (p: any) => {
    const maker = p.maker && p.maker !== '-' ? `【${p.maker}】` : '';
    const sizeStr = p.size || p.sq;
    const size = sizeStr && sizeStr !== '-' ? ` ${sizeStr}${String(sizeStr).match(/[a-zA-Z]/) ? '' : 'sq'}` : '';
    const coreStr = p.core || p.cores || p.coreCount;
    const core = coreStr && coreStr !== '-' ? ` ${coreStr}${String(coreStr).match(/[a-zA-Z]/) ? '' : 'C'}` : '';
    const yearStr = p.year && p.year !== '-' ? ` (製造年: ${p.year})` : '';
    return `${maker}${p.name}${size}${core}${yearStr}`.trim();
  };

  const addToCart = (product: any, overrideWeight?: number) => {
    const newItemId = Date.now().toString() + Math.random().toString(36).substring(7);
    const productName = product.isSpec ? `📖[理論値] ${buildProductName(product)}` : buildProductName(product);
    
    setCart(prev => [...prev, { 
        id: newItemId, product: productName, ratio: product.ratio, 
        weight: overrideWeight !== undefined ? overrideWeight : 0, percentage: 0,
        conductor: product.conductor || '', material: product.material || '純銅',
        chipRatio: product.chipRatio || 85,
        isSpec: product.isSpec || false // ★ カタログ由来のフラグを保持
    }]);
    setSearchTerm('');
  };

  const updateWeight = (id: string, weight: number) => setCart(prev => prev.map(item => item.id === id ? { ...item, weight } : item));
  const updatePercentage = (id: string, percentage: number) => {
    if (percentage < 0) percentage = 0; if (percentage > 100) percentage = 100;
    setCart(prev => prev.map(item => item.id === id ? { ...item, percentage } : item));
  };
  const updateRatio = (id: string, ratio: number) => {
    if (ratio < 0) ratio = 0; if (ratio > 100) ratio = 100;
    setCart(prev => prev.map(item => item.id === id ? { ...item, ratio } : item));
  };

  const removeItem = (id: string) => { setCart(prev => prev.filter(item => item.id !== id)); };

  const compressImage = (file: File, isDetailMode: boolean = false): Promise<string> => {
      return new Promise((resolve, reject) => {
          if (!file) return reject(new Error("ファイルがありません"));
          const reader = new FileReader(); 
          reader.onload = (event) => {
              const img = new Image(); 
              img.onload = () => {
                  try {
                      const canvas = document.createElement('canvas');
                      const MAX = isDetailMode ? 1600 : 800; 
                      const quality = isDetailMode ? 0.85 : 0.6; 
                      
                      let w = img.width; let h = img.height;
                      if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
                      canvas.width = w; canvas.height = h;
                      const ctx = canvas.getContext('2d'); 
                      if (!ctx) throw new Error("Canvas context error");
                      ctx.drawImage(img, 0, 0, w, h);
                      
                      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]); 
                  } catch (e) {
                      reject(new Error("画像の圧縮に失敗しました。解像度を下げてお試しください。"));
                  }
              };
              img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
              img.src = event.target?.result as string;
          };
          reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
          reader.readAsDataURL(file);
      });
  };

  const handleAiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2 | 3 | 4) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { 
        const isDetailMode = (num === 1 || num === 3 || num === 4);
        const compressed = await compressImage(file, isDetailMode); 
        
        if (num === 1) setImgData1(compressed); 
        else if (num === 2) setImgData2(compressed); 
        else if (num === 3) setImgData3(compressed); 
        else if (num === 4) setImgData4(compressed); 
    } catch (err: any) {
        alert(err.message || "画像処理エラーが発生しました。");
    } finally {
        e.target.value = '';
    }
  };

  const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files || files.length === 0) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) { 
        try { 
            newImages.push(await compressImage(files[i], false)); 
        } catch(err) {} 
    }
    setBulkImages(prev => [...prev, ...newImages]); 
    e.target.value = '';
  };
  const removeBulkImage = (index: number) => setBulkImages(prev => prev.filter((_, i) => i !== index));

const runAiAnalysis = async () => {
    if (!imgData1) return alert('1. 断面画像（必須）をアップロードしてください');
    
    // ★ 安全装置：通信データの上限（約4MB）を超えないかチェック
    const totalSize = (imgData1.length + imgData2.length + imgData3.length + imgData4.length) * 0.75;
    if (totalSize > 4 * 1024 * 1024) {
        return alert('⚠️ 画像サイズの合計が大きすぎます（通信エラーになります）。\n不要な画像を削除するか、もう少し離れて撮影してください。');
    }

    setAiStatus('ANALYZING'); setAiProgressStep(1); 
    const progressInterval = setInterval(() => { setAiProgressStep(prev => prev < 3 ? prev + 1 : 3); }, 2000);

    try {
      const catalogContext = catalogsData.map(c => `- ${c.maker} ${c.name} ${c.size} ${c.core} (外径:${c.outerDiameter}mm, 理論歩留:${c.theoreticalRatio}%)`).join('\n');
      const res = await fetch('/api/gas', { 
          method: 'POST', headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ action: 'VISION_AI_ASSESS', imageData: imgData1, imageData2: imgData2, imageData3: imgData3, imageData4: imgData4, hint: aiHint, catalogData: catalogContext }) 
      });
      const result = await res.json();
      clearInterval(progressInterval); setAiProgressStep(4); 

      setTimeout(() => {
          if (result.status === 'success') {
            const wireTypeStr = result.data.wireType || result.data.name || '不明な線種';
            const isMixed = wireTypeStr.includes('フレコン') || wireTypeStr.includes('混合');
            const displayName = result.data.isNewFlag || isMixed ? `💡 AI査定: ${wireTypeStr}` : wireTypeStr;
            setCart(prev => [{
                id: `ai-${Date.now()}`, product: displayName, ratio: result.data.estimatedRatio || 0, weight: 0, percentage: 0, 
                isNewAi: result.data.isNewFlag, reason: result.data.reason || '', masterId: result.data.masterId, 
                isMasterImageEmpty: result.data.isMasterImageEmpty, 
                pendingImg1: imgData1, pendingImg2: imgData2, pendingImg3: imgData3, pendingImg4: imgData4,
                conductor: result.data.conductor || '', material: result.data.material || '純銅', chipRatio: 85
            }, ...prev]);
            showToast(result.data.isNewFlag ? '未知線種を仮登録しました' : '既存マスターと一致', `「${wireTypeStr}」として査定しました。`, result.data.isNewFlag ? 'success' : 'info');
            setIsAiModalOpen(false); setImgData1(''); setImgData2(''); setImgData3(''); setImgData4(''); setAiHint(''); setAiProgressStep(0);
          } else { alert('AI解析エラー: ' + result.message); setIsAiModalOpen(false); setAiProgressStep(0); }
          setAiStatus('IDLE');
      }, 800);
    } catch(err: any) { clearInterval(progressInterval); alert(`通信エラー`); setAiStatus('IDLE'); setAiProgressStep(0); } 
  };

  const runBulkAiAnalysis = async () => {
    if (bulkImages.length === 0) return alert('画像をアップロードしてください。');
    
    const totalSize = bulkImages.reduce((sum, img) => sum + img.length, 0) * 0.75;
    if (totalSize > 4 * 1024 * 1024) {
        return alert('⚠️ 画像サイズの合計が大きすぎます（通信エラーになります）。\n一度に送る枚数を減らすか、被写体から少し離れて撮影してください。');
    }

    setAiStatus('ANALYZING'); setAiProgressStep(1); 
    const progressInterval = setInterval(() => { setAiProgressStep(prev => prev < 3 ? prev + 1 : 3); }, 3000); 

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'VISION_AI_BULK_ASSESS', images: bulkImages, hint: aiHint }) });
      const result = await res.json();
      clearInterval(progressInterval); setAiProgressStep(4); 

      setTimeout(() => {
          if (result.status === 'success' && result.data) {
            setPosMode('BULK');
            
            if (result.data.estimatedWeight) {
                setBulkTotalWeight(Number(result.data.estimatedWeight));
            }

            let clientMatched = false;
            let foundClientName = '';
            if (result.data.clientName && data?.clients) {
                foundClientName = result.data.clientName;
                const noiseRegex = /(株式会社|有限会社|合同会社|\(株\)|\(有\)|\(同\)|㈱|㈲|㈾|営業所|支店|現場|\s|　)/g;
                const cleanAiName = foundClientName.replace(noiseRegex, '').toLowerCase();

                if (cleanAiName.length >= 2) { 
                    const matchedClient = data.clients.find((c:any) => {
                        const cleanDbName = c.name.replace(noiseRegex, '').toLowerCase();
                        return cleanDbName && (cleanAiName.includes(cleanDbName) || cleanDbName.includes(cleanAiName));
                    });
                    if (matchedClient) {
                        setSelectedClient(matchedClient);
                        clientMatched = true;
                    }
                }
            }

            const newCartItems = (result.data.components || []).map((comp: any, idx: number) => ({
                id: `bulk-${Date.now()}-${idx}`, product: `📦 AI解析: ${comp.name || '不明'}`,
                ratio: comp.copperYield || comp.ratio || 0, weight: 0, percentage: comp.mixPercentage || comp.percentage || 0,
                isNewAi: true, reason: idx === 0 ? result.data.reason : '', material: '純銅', chipRatio: 85
            }));
            
            setCart(newCartItems);

            let toastMsg = `歩留まり ${result.data.overallYield || result.data.overallRatio || '---'}% で展開しました。`;
            if (result.data.estimatedWeight) toastMsg += `\n⚖️ 重量 ${result.data.estimatedWeight}kg を自動入力しました。`;
            if (foundClientName) {
                if (clientMatched) toastMsg += `\n👤 顧客「${selectedClient?.name || foundClientName}」を自動選択しました。`;
                else toastMsg += `\n👤 顧客「${foundClientName}」の記載を確認（未登録）。`;
            }

            showToast('フレコン一括解析 完了', toastMsg, 'success');
            setIsBulkAiModalOpen(false); setBulkImages([]); setAiHint(''); setAiProgressStep(0);
          } else { alert('AI解析エラー: ' + result.message); setIsBulkAiModalOpen(false); setAiProgressStep(0); }
          setAiStatus('IDLE');
      }, 800);
    } catch(err: any) { clearInterval(progressInterval); alert(`通信エラー`); setAiStatus('IDLE'); setAiProgressStep(0); } 
  };

  const toggleVoiceInput = () => {
      if (isListening) { if (recognitionRef.current) recognitionRef.current.stop(); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP'; recognition.continuous = true; recognition.interimResults = true;
      recognition.onstart = () => { setIsListening(true); setVoiceText('🎤 認識中... (もう一度押すと終了して送信)'); };
      
      let finalTranscript = '';
      recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
              else interimTranscript += event.results[i][0].transcript;
          }
          setVoiceText(finalTranscript + interimTranscript);
      };
      recognition.onerror = () => { setIsListening(false); setVoiceText('認識エラー'); setTimeout(() => setVoiceText(''), 2000); };
      recognition.onend = () => { setIsListening(false); if (finalTranscript) processVoiceCommand(finalTranscript); else setTimeout(() => setVoiceText(''), 2000); };
      recognitionRef.current = recognition; recognition.start();
  };

  const processVoiceCommand = async (text: string) => {
      setIsProcessingVoice(true);
      try {
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'PARSE_VOICE_COMMAND', text: text }) });
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
              if (matchedWire) { addToCart(matchedWire, p.weight || 0); setVoiceText(`追加: ${buildProductName(matchedWire)}`); } 
              else { setVoiceText('マスターが見つかりませんでした。'); }
          } else { setVoiceText('解析できませんでした。'); }
      } catch (e) { setVoiceText('通信エラー'); }
      setIsProcessingVoice(false); setTimeout(() => setVoiceText(''), 3000);
  };

  const toggleHintVoiceInput = () => {
      if (isListeningHint) { if (hintRecognitionRef.current) hintRecognitionRef.current.stop(); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP'; recognition.continuous = true; recognition.interimResults = true;
      let currentHint = aiHint;
      recognition.onstart = () => { setIsListeningHint(true); };
      let finalStr = '';
      recognition.onresult = (event: any) => {
          let interim = ''; finalStr = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) finalStr += event.results[i][0].transcript;
              else interim += event.results[i][0].transcript;
          }
          setAiHint(currentHint + (currentHint ? ' ' : '') + finalStr + interim);
      };
      recognition.onend = () => { setIsListeningHint(false); setAiHint(currentHint + (currentHint ? ' ' : '') + finalStr); };
      hintRecognitionRef.current = recognition;
      recognition.start();
  };

  const handlePrepareMasterRegistration = (item: any) => {
      const pendingData = {
          name: item.product.replace(/💡 AI査定: |📦 AI解析: |📖\[理論値\] /, '').trim(),
          ratio: item.ratio, reason: item.reason, conductor: item.conductor, material: item.material,
          image1: item.pendingImg1, 
          image2: item.pendingImg2,
          image4: item.pendingImg3,
          image5: item.pendingImg4 
      };
      localStorage.setItem('factoryOS_pendingAIItem', JSON.stringify(pendingData));
      showToast('データ転送完了', '左メニューから「マスターDB」を開くと、自動で入力画面が立ち上がります。', 'success');
  };

  // ★ 既存の実測マスターの絞り込み
  const filteredProducts = useMemo(() => {
      return (data?.wires || []).filter((w:any) => {
          if (selectedCategory !== 'すべて' && getCategory(w.name) !== selectedCategory) return false;
          if (selectedMaker && w.maker !== selectedMaker) return false;

          if (searchTerm) {
              const coreStr = String(w.core || w.cores || w.coreCount || '');
              const coreFormatted = coreStr && coreStr !== '-' ? `${coreStr}c ${coreStr}芯` : '';
              const sqStr = String(w.size || w.sq || '');
              const sqFormatted = sqStr && sqStr !== '-' ? `${sqStr}sq ${sqStr}スケ` : '';
              
              const searchTarget = `${w.name} ${w.maker} ${sqFormatted} ${sqStr} ${coreFormatted} ${coreStr} ${w.year}`.toLowerCase();
              const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
              return terms.every(term => searchTarget.includes(term));
          }
          return true;
      });
  }, [data, selectedCategory, selectedMaker, searchTerm]);

  // ★ 新規追加: カタログマスターからのサジェスト検索
  const filteredSpecs = useMemo(() => {
      if (!searchTerm) return []; // 検索キーワードが入っている時だけ表示
      const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
      return (data?.wireSpecs || []).filter((s:any) => {
          const searchTarget = `${s.name} ${s.maker} ${s.size}sq ${s.core}C ${s.size} ${s.core}`.toLowerCase();
          return terms.every(term => searchTarget.includes(term));
      });
  }, [data, searchTerm]);

  const simulation = useMemo(() => {
    let totalWeight = 0; 
    let cuWeight = 0;
    let totalChipWeight = 0;

    cart.forEach(item => {
      const w = posMode === 'BULK' ? (Number(bulkTotalWeight) || 0) * ((Number(item.percentage) || 0) / 100) : (Number(item.weight) || 0);
      const r = Number(item.ratio) || 0;
      
      totalWeight += w; 
      
      const effectiveRatio = r * (1 - (simConfig.machineLossPercent / 100));
      cuWeight += w * (effectiveRatio / 100);

      const wasteW = w * (1 - (r / 100));
      const chipRatio = item.chipRatio || 85; 
      totalChipWeight += wasteW * (chipRatio / 100);
    });

    const expectedYield = totalWeight > 0 ? (cuWeight / totalWeight) * 100 : 0;
    
    const totalWasteWeight = totalWeight - cuWeight; 
    const juteWeight = totalWasteWeight - totalChipWeight;

    const disposalCost = (totalChipWeight * simConfig.chipCostPerKg) + (juteWeight * simConfig.juteCostPerKg);

    const processingHours = totalWeight / simConfig.capacityPerHour; 
    const laborCost = processingHours * simConfig.laborCostPerHour; 
    const powerCost = processingHours * simConfig.powerCostPerHour;
    const totalFactoryCost = laborCost + powerCost;

    const grossCuValue = cuWeight * copperPrice; 
    const targetProfitAmount = grossCuValue * (simConfig.targetMargin / 100); 
    
    let limitTotalCost = grossCuValue - disposalCost - totalFactoryCost - targetProfitAmount; 
    if (limitTotalCost < 0) limitTotalCost = 0;
    
    const limitUnitPrice = totalWeight > 0 ? Math.floor(limitTotalCost / totalWeight) : 0;
    
    return { 
        totalWeight, cuWeight, totalWasteWeight, totalChipWeight, juteWeight,
        grossCuValue, disposalCost, laborCost, powerCost, totalFactoryCost, targetProfitAmount, 
        limitTotalCost, limitUnitPrice, processingHours, expectedYield 
    };
  }, [cart, copperPrice, simConfig, posMode, bulkTotalWeight]);

  const totalPercentage = cart.reduce((sum, item) => sum + (Number(item.percentage) || 0), 0);
  const isPercentageValid = totalPercentage === 100;
  const hasTinPlated = cart.some(item => item.material === '錫メッキ' || item.product?.includes('錫'));

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('カートが空です');
    if (posMode === 'INDIVIDUAL' && simulation.totalWeight === 0) return alert('重量を入力してください');
    if (posMode === 'BULK') {
        if (!bulkTotalWeight || Number(bulkTotalWeight) <= 0) return alert('フレコンの総重量を入力してください');
        if (!isPercentageValid) return alert(`割合の合計を100%にしてください（現在: ${totalPercentage}%）`);
    }
    if (hasTinPlated) {
        if (!window.confirm("⚠️ 警告 ⚠️\nカート内に「錫メッキ線」が含まれています。\n「別管理（または専用処理）」として受付を確定しますか？")) return;
    }
    
    // カタログ理論値が含まれているかチェック
    const hasSpecItem = cart.some(item => item.isSpec);
    if (hasSpecItem) {
        if (!window.confirm("⚠️ お知らせ ⚠️\n実測値のない「カタログ理論値」を含む商品が含まれています。\nこのまま仮査定として受付を確定しますか？\n（後ほど実測してマスターに登録することをお勧めします）")) return;
    }

    setIsProcessing(true);
    
    const finalCart = cart.map(item => ({ 
        ...item, 
        weight: posMode === 'BULK' ? ((Number(bulkTotalWeight) || 0) * ((Number(item.percentage) || 0) / 100)).toFixed(1) : item.weight 
    }));
    
    const optimisticData = {
        id: editingResId || `R-TEMP-${Date.now()}`,
        memberId: selectedClient?.id || 'GUEST',
        memberName: selectedClient?.name || '新規・非会員 (飛込)',
        items: JSON.stringify(finalCart),
        totalEstimate: simulation.limitTotalCost,
        status: 'RESERVED',
        memo: hasTinPlated ? '【要確認】錫メッキ線が含まれています。別ラインでの処理・保管を徹底してください。' : '',
        createdAt: new Date().toISOString()
    };

    const payload = { 
        action: editingResId ? 'UPDATE_RESERVATION' : 'REGISTER_RESERVATION', 
        reservationId: editingResId, memberId: selectedClient?.id || 'GUEST', memberName: selectedClient?.name || '新規・非会員 (飛込)', 
        items: finalCart, totalEstimate: simulation.limitTotalCost, status: 'RESERVED',
        memo: hasTinPlated ? '【要確認】錫メッキ線が含まれています。別ラインでの処理・保管を徹底してください。' : '' 
    };
    
    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') {
          if (result.reservationId) optimisticData.id = result.reservationId;
          onSuccess(optimisticData); 
      } else { 
          alert('エラー: ' + result.message); 
      }
    } catch(err: any) { alert('通信エラー'); }
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 h-auto lg:h-full animate-in fade-in duration-300 pb-24 lg:pb-0 relative font-sans">
      
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] animate-in slide-in-from-top-10 fade-in duration-300 w-[90%] max-w-md">
            <div className={`bg-white border-l-4 ${toastMessage.type === 'success' ? 'border-green-500' : 'border-[#D32F2F]'} p-3 rounded-sm shadow-2xl flex items-start gap-2 whitespace-pre-wrap`}>
                <div className="mt-0.5">{toastMessage.type === 'success' ? <Icons.CheckCircle /> : <Icons.Sparkles />}</div>
                <div><h4 className="font-bold text-gray-900 text-sm">{toastMessage.title}</h4><p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{toastMessage.desc}</p></div>
            </div>
        </div>
      )}

      {/* 左側：マスター検索＆AI機能 */}
      <div className="w-full lg:w-7/12 flex flex-col bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden h-[45vh] lg:h-full shrink-0">
        
        <header className="p-3 border-b border-gray-200 bg-white flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-5 bg-[#D32F2F] block"></span>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">POSレジ受付・AI査定</h2>
        </header>

        <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-col gap-2 relative shrink-0">
          {(isListening || isProcessingVoice || voiceText) && (
              <div className="absolute top-full left-0 w-full z-10 bg-gray-900 text-white p-2 text-center text-sm font-bold shadow-md animate-in slide-in-from-top-2">
                  {isListening ? <span className="animate-pulse">{voiceText}</span> : isProcessingVoice ? <span><Icons.Refresh /> AIが解析中...</span> : <span>{voiceText}</span>}
              </div>
          )}
          
          <div className="flex flex-col gap-2">
              <div className="flex w-full gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                    <input type="text" placeholder="AND検索 (例: 1C VV)..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-sm text-sm focus:border-gray-900 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>
                  <select className="border border-gray-300 rounded-sm px-2 py-2 text-sm outline-none focus:border-gray-900 bg-white max-w-[110px] text-gray-700 font-bold shadow-sm" value={selectedMaker} onChange={e => setSelectedMaker(e.target.value)}>
                      <option value="">全メーカー</option>
                      {uniqueMakers.map(m => <option key={m as string} value={m as string}>{m as string}</option>)}
                  </select>
                  <button onClick={toggleVoiceInput} className={`px-3 py-2 border rounded-sm flex items-center justify-center transition-all ${isListening ? 'bg-[#D32F2F] border-red-800 text-white animate-pulse shadow-inner' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} title="音声で検索キーワード入力"><Icons.Mic /></button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-colors border ${selectedCategory === cat ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'}`}>
                          {cat}
                      </button>
                  ))}
              </div>
          </div>

          <div className="flex gap-2">
              <button onClick={() => setIsAiModalOpen(true)} className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 px-2 rounded-sm flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 text-xs">
                <Icons.Camera /> 単一分析
              </button>
              <button onClick={() => setIsBulkAiModalOpen(true)} className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 px-2 rounded-sm flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95 text-xs border border-gray-700">
                <Icons.Sparkles /> 一括査定
              </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-gray-100/50">
          {/* 実測マスター */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filteredProducts.map((p:any) => {
              const isTin = p.material === '錫メッキ' || p.name?.includes('錫');
              return (
                  <button key={p.id} onClick={() => addToCart(p)} className={`bg-white border p-2.5 rounded-sm shadow-sm hover:shadow-md hover:border-gray-400 text-left transition-all active:scale-95 flex flex-col justify-between min-h-[75px] relative overflow-hidden group ${isTin ? 'border-red-300 bg-red-50/20' : 'border-gray-200'}`}>
                    <div>
                      <div className="font-bold text-gray-800 text-xs leading-tight line-clamp-2">{buildProductName(p)}</div>
                      {isTin && <span className="inline-block mt-1 bg-[#D32F2F] text-white text-[8px] px-1 rounded-sm font-bold">⚠️錫</span>}
                    </div>
                    <div className="flex justify-end mt-1"><span className="font-mono font-black text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-sm text-xs tabular-nums">{p.ratio}%</span></div>
                  </button>
              );
            })}
            {filteredProducts.length === 0 && filteredSpecs.length === 0 && (
                <div className="col-span-full py-10 text-center text-gray-400 font-bold text-xs">該当する線種が見つかりません</div>
            )}
          </div>

          {/* ★ カタログからのサジェスト表示 */}
          {filteredSpecs.length > 0 && (
            <div className="mt-6 mb-2 animate-in fade-in slide-in-from-bottom-2">
              <h4 className="text-[10px] md:text-xs font-bold text-blue-800 flex items-center gap-1.5 border-b border-blue-200 pb-1.5 mb-3">
                <Icons.Document /> 仕様書カタログからのサジェスト (理論歩留まり)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filteredSpecs.map((s:any) => (
                   <button 
                       key={s.id} 
                       onClick={() => addToCart({...s, sq: s.size, ratio: s.theoreticalRatio, isSpec: true})} 
                       className="bg-blue-50 border border-blue-200 p-2.5 rounded-sm shadow-sm hover:shadow-md hover:border-blue-400 text-left transition-all active:scale-95 flex flex-col justify-between min-h-[75px] relative overflow-hidden"
                   >
                      <div>
                         <div className="font-bold text-blue-900 text-[11px] leading-tight line-clamp-2">
                            {s.maker && s.maker !== '-' ? `【${s.maker}】` : ''}{s.name} {s.size}sq {s.core}C
                         </div>
                      </div>
                      <div className="flex justify-end mt-1">
                         <span className="font-mono font-black text-blue-700 bg-white px-1.5 py-0.5 rounded-sm text-xs tabular-nums border border-blue-100">{s.theoreticalRatio}%</span>
                      </div>
                   </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 右側：カート＆シミュレーション */}
      <div className="w-full lg:w-5/12 bg-white border border-gray-200 rounded-sm flex flex-col shadow-lg relative overflow-hidden min-h-[50vh] lg:h-full shrink-0">
        <div className="flex shrink-0">
          <button onClick={() => setPosMode('INDIVIDUAL')} className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${posMode === 'INDIVIDUAL' ? 'bg-white text-gray-900 border-t-4 border-t-[#D32F2F]' : 'bg-gray-100 text-gray-400 border-t-4 border-t-transparent border-b border-b-gray-200'}`}><Icons.ScaleIndividual /> 個別計量</button>
          <button onClick={() => setPosMode('BULK')} className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${posMode === 'BULK' ? 'bg-white text-gray-900 border-t-4 border-t-[#D32F2F]' : 'bg-gray-100 text-gray-400 border-t-4 border-t-transparent border-b border-b-gray-200'}`}><Icons.Box /> フレコン一括</button>
        </div>

        <div className="p-2 border-b border-gray-200 bg-white shrink-0 flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 whitespace-nowrap">持込業者:</span>
          <select className="flex-1 border border-gray-300 bg-white p-1.5 rounded-sm text-xs font-bold text-gray-800 outline-none cursor-pointer shadow-sm focus:border-gray-900" value={selectedClient?.id || ''} onChange={e => { const client = data?.clients?.find((c:any) => c.id === e.target.value); setSelectedClient(client || null); }}>
            <option value="">新規・非会員 (飛込ゲスト)</option>
            {data?.clients?.map((c:any) => <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>)}
          </select>
        </div>

        {posMode === 'BULK' && (
          <div className="p-3 bg-gray-50 border-b border-gray-200 shadow-inner shrink-0 flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800">フレコン総重量</label>
            <div className="relative w-32">
              <input type="number" className="w-full p-1.5 text-right font-mono font-black text-lg rounded-sm outline-none focus:ring-2 focus:ring-[#D32F2F] border border-gray-300 text-gray-900 pr-6 tabular-nums" value={bulkTotalWeight} onChange={e => setBulkTotalWeight(e.target.value ? Number(e.target.value) : '')} placeholder="0" />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-bold pointer-events-none">kg</span>
            </div>
          </div>
        )}

        {hasTinPlated && (
            <div className="bg-[#D32F2F] text-white text-[10px] font-bold p-1.5 flex items-center justify-center gap-1 shadow-md shrink-0 animate-pulse">
                <Icons.AlertTriangle /> 錫メッキ線が含まれています。純銅とは別管理にしてください。
            </div>
        )}

        <div className="flex-1 overflow-y-auto p-2 bg-gray-50/50 min-h-[200px]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300"><p className="font-bold text-xs">左から商材を選択してください</p></div>
          ) : (
            <div className="space-y-2 pb-2">
              {cart.map((item, idx) => {
                const isItemTin = item.material === '錫メッキ' || item.product?.includes('錫');
                const isSpec = item.isSpec; // カタログデータ判定
                return (
                  <div key={item.id} className={`border p-2 rounded-sm flex flex-col gap-1.5 shadow-sm ${item.isNewAi ? 'bg-gray-100 border-gray-300' : isItemTin ? 'bg-red-50 border-red-300' : isSpec ? 'bg-blue-50/30 border-blue-200' : 'bg-white border-gray-200'}`}>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                          <div className={`font-bold text-xs leading-tight ${isSpec ? 'text-blue-900' : 'text-gray-900'}`}>
                              {isItemTin && <span className="bg-[#D32F2F] text-white px-1 py-0.5 rounded-sm text-[8px] mr-1 align-middle">⚠️錫</span>}
                              {posMode === 'BULK' && <span className="text-[10px] text-gray-400 mr-1">{idx+1}.</span>}
                              {item.product}
                          </div>
                          {(item.isNewAi || isSpec) && !String(item.id).startsWith('bulk-') && (
                              <button onClick={() => handlePrepareMasterRegistration(item)} className="text-[9px] text-[#D32F2F] hover:underline flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 rounded-sm border border-red-100 shrink-0">
                                  <Icons.Edit /> {isSpec ? '実測して確定' : 'マスター登録'}
                              </button>
                          )}
                      </div>

                      <div className="flex items-center justify-end gap-2 shrink-0">
                        {/* 歩留まり(%) 手動調整 */}
                        <div className="relative w-[65px] group">
                           <span className="text-[8px] text-gray-400 absolute -top-3 left-0">歩留(銅分)</span>
                           <input 
                              type="number" 
                              className={`w-full p-1 text-right font-mono text-sm font-bold border rounded-sm outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] tabular-nums ${isSpec ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300'}`} 
                              value={item.ratio} 
                              onChange={e => updateRatio(item.id, Number(e.target.value))} 
                           />
                           <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 font-bold pointer-events-none">%</span>
                        </div>

                        {posMode === 'INDIVIDUAL' ? (
                          <div className="relative w-[80px]">
                            <span className="text-[8px] text-gray-400 absolute -top-3 left-0">重量</span>
                            <div className="flex items-center bg-white border border-gray-300 rounded-sm overflow-hidden focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900">
                              <input type="number" className="w-full p-1 text-right font-mono text-sm font-bold outline-none tabular-nums" value={item.weight || ''} onChange={e => updateWeight(item.id, Number(e.target.value))} placeholder="0" />
                              <span className="px-1.5 py-1 text-[9px] text-gray-500 bg-gray-100 border-l border-gray-200 font-bold">kg</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 mt-1">
                            <input type="range" min="0" max="100" className={`w-14 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer ${isItemTin ? 'accent-[#D32F2F]' : 'accent-gray-800'}`} value={item.percentage || 0} onChange={e => updatePercentage(item.id, Number(e.target.value))} />
                            <div className="relative w-[60px]">
                                <span className="text-[8px] text-gray-400 absolute -top-3 left-0">割合</span>
                                <div className="flex items-center bg-white border border-gray-300 rounded-sm overflow-hidden focus-within:ring-1 focus-within:ring-gray-900">
                                    <input type="number" className="w-full p-1 text-right font-mono text-sm font-bold outline-none tabular-nums" value={item.percentage || ''} onChange={e => updatePercentage(item.id, Number(e.target.value))} placeholder="0" />
                                    <span className="px-1 py-1 text-[9px] text-gray-500 bg-gray-100 border-l font-bold">%</span>
                                </div>
                            </div>
                          </div>
                        )}
                        <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-white hover:bg-gray-800 p-1.5 rounded-sm transition-colors mt-1"><Icons.Trash /></button>
                      </div>
                    </div>

                    {item.reason && (
                      <details className="mt-1 group">
                        <summary className="text-[9px] font-bold text-gray-600 cursor-pointer select-none flex items-center gap-0.5 w-max outline-none opacity-80 hover:opacity-100 list-none">
                          <Icons.Sparkles /> AI推論の根拠 <Icons.ChevronDown />
                        </summary>
                        <div className="mt-1 bg-white border border-gray-200 p-1.5 rounded-sm text-[10px] text-gray-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                          {item.reason}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
              {posMode === 'BULK' && cart.length > 0 && (
                <div className={`p-2 rounded-sm text-center text-xs font-bold border transition-colors tabular-nums ${isPercentageValid ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-red-50 text-[#D32F2F] border-red-300 animate-pulse'}`}>
                  割合合計: {totalPercentage}% {isPercentageValid ? '✨ OK' : '⚠️ 100%に調整してください'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 下部シミュレーションエリア (白黒赤デザイン統一) */}
        <div className={`bg-gray-900 text-white p-3 border-t-4 relative shrink-0 ${hasTinPlated ? 'border-[#D32F2F]' : 'border-gray-700'}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-xs tracking-widest text-gray-300 flex items-center gap-1">真の限界買取シミュレーション</h3>
            <button onClick={() => setShowSimDetails(!showSimDetails)} className="text-gray-400 hover:text-white flex items-center gap-1 text-[9px] bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded-sm transition"><Icons.Settings /> コスト設定</button>
          </div>

          {showSimDetails && (
            <div className="mb-3 bg-gray-800 p-2.5 rounded-sm border border-gray-700 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-[9px] text-gray-400 mb-0.5">チップ処分(円/kg)</label><input type="number" className="w-full bg-gray-900 border-gray-600 rounded-sm p-1 text-xs text-right text-gray-300 outline-none focus:border-gray-500 tabular-nums" value={simConfig.chipCostPerKg} onChange={e => setSimConfig({...simConfig, chipCostPerKg: Number(e.target.value)})} /></div>
                  <div><label className="block text-[9px] text-gray-400 mb-0.5">ジュート処分(円/kg)</label><input type="number" className="w-full bg-gray-900 border-gray-600 rounded-sm p-1 text-xs text-right text-gray-300 outline-none focus:border-gray-500 tabular-nums" value={simConfig.juteCostPerKg} onChange={e => setSimConfig({...simConfig, juteCostPerKg: Number(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-[9px] text-gray-400 mb-0.5">真の時給(円)</label><input type="number" className="w-full bg-gray-900 border-gray-600 rounded-sm p-1 text-xs text-right text-gray-300 outline-none focus:border-gray-500 tabular-nums" value={simConfig.laborCostPerHour} onChange={e => setSimConfig({...simConfig, laborCostPerHour: Number(e.target.value)})} /></div>
                  <div><label className="block text-[9px] text-gray-400 mb-0.5">機械ロス率(%)</label><input type="number" className="w-full bg-gray-900 border-gray-600 rounded-sm p-1 text-xs text-right text-[#D32F2F] font-bold outline-none focus:border-red-500 tabular-nums" value={simConfig.machineLossPercent} onChange={e => setSimConfig({...simConfig, machineLossPercent: Number(e.target.value)})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                  <div><label className="block text-[9px] text-white mb-0.5">目標利益率(%)</label><input type="number" className="w-full bg-gray-700 border-gray-500 text-white font-bold rounded-sm p-1 text-xs text-right outline-none focus:border-white tabular-nums" value={simConfig.targetMargin} onChange={e => setSimConfig({...simConfig, targetMargin: Number(e.target.value)})} /></div>
                  <div className="text-[9px] text-gray-500 flex flex-col justify-end text-right pb-1 tabular-nums">※電気代: ¥{simConfig.powerCostPerHour}/h<br/>※能力: {simConfig.capacityPerHour}kg/h</div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-[9px] text-gray-400 font-bold mb-0.5">絶対に赤字にならない限界単価</p>
              <div className="flex items-baseline gap-0.5"><span className="text-3xl font-black tabular-nums text-white leading-none">¥{simulation.limitUnitPrice.toLocaleString()}</span><span className="text-[10px] text-gray-400 font-bold">/kg</span></div>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] text-gray-400 font-bold tabular-nums">総重量: {simulation.totalWeight.toFixed(1)}kg</p>
              {simulation.totalWeight > 0 && (
                  <>
                    <p className="text-[10px] text-gray-200 mt-0.5 tabular-nums">実回収銅: <span className="font-bold">{simulation.cuWeight.toFixed(1)}kg ({simulation.expectedYield.toFixed(1)}%)</span></p>
                    <p className="text-[10px] text-gray-500 mt-0.5 flex gap-2 tabular-nums"><span>C: {simulation.totalChipWeight.toFixed(1)}kg</span><span>ごみ: {simulation.juteWeight.toFixed(1)}kg</span></p>
                  </>
              )}
              <p className="text-lg font-bold tabular-nums text-white mt-1 border-t border-gray-700 pt-1">予算上限 ¥{simulation.limitTotalCost.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleCheckout} disabled={isProcessing || simulation.totalWeight === 0 || (posMode === 'BULK' && !isPercentageValid)} className={`flex-1 font-bold py-3 rounded-sm transition shadow-sm flex justify-center items-center text-sm ${hasTinPlated ? 'bg-[#D32F2F] text-white hover:bg-red-800 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700' : 'bg-white text-gray-900 hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:border-gray-700'}`}>
                {isProcessing ? <Icons.Refresh /> : hasTinPlated ? '⚠️ 確認して受付確定' : '受付を確定してカンバンへ'}
            </button>
            <button onClick={() => {setCart([]); onClear(); setBulkTotalWeight('');}} className="px-4 text-[10px] text-gray-400 bg-gray-800 font-bold border border-gray-700 rounded-sm hover:bg-gray-700 hover:text-white transition">リセット</button>
          </div>
        </div>
      </div>

      {/* AIモーダル (単一) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl animate-in zoom-in-95 border-t-4 border-[#D32F2F] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><Icons.Sparkles /> AI 線種分析 (精密マクロ解析)</h3>
              {aiStatus !== 'ANALYZING' && <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>}
            </div>
            <div className="p-6 overflow-y-auto bg-white">
              {aiStatus === 'ANALYZING' ? (
                <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative w-20 h-20 mb-8"><div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div><div className="absolute inset-0 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div><div className="absolute inset-0 flex items-center justify-center text-gray-900"><Icons.Sparkles /></div></div>
                    <div className="space-y-5 w-full max-w-xs font-bold text-sm text-center text-gray-700">マクロ画像・印字を解析中...</div>
                </div>
              ) : (
                <div className="animate-in fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData1 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData1}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData1('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">①断面</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-700 mb-1.5 text-center">① 断面 (必須)</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,1)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,1)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData2 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData2}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData2('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">②全体</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-500 mb-1.5 text-center">② 全体・被覆</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,2)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-200 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,2)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData3 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData3}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData3('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">③印字1</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-500 mb-1.5 text-center">③ 印字アップ1</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,3)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,3)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData4 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData4}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData4('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">④印字2</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-500 mb-1.5 text-center">④ 印字アップ2</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,4)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,4)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                    </div>

                    <div className="mb-6 bg-gray-50 border border-gray-200 p-3 rounded-sm relative">
                        <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                            <span>🗣️ AIへのヒント・補足（任意）</span>
                            <button onClick={toggleHintVoiceInput} className={`p-1.5 rounded transition ${isListeningHint ? 'bg-[#D32F2F] text-white animate-pulse shadow-inner' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                                <Icons.Mic />
                            </button>
                        </label>
                        <textarea className="w-full bg-white border border-gray-300 rounded-sm text-sm text-gray-900 p-2 outline-none focus:border-gray-900 min-h-[60px]" placeholder="例: 中身は細線の束、かなり重い、雑線は入っていない等..." value={aiHint} onChange={e => setAiHint(e.target.value)} />
                    </div>
                    <button onClick={runAiAnalysis} disabled={!imgData1} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-sm flex justify-center items-center gap-2 disabled:bg-gray-400 transition">解析してカートに追加</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AIモーダル (一括) */}
      {isBulkAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl animate-in zoom-in-95 border-t-4 border-[#D32F2F] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 flex items-center gap-2"><Icons.Sparkles /> AI フレコン一括査定</h3>
              {aiStatus !== 'ANALYZING' && <button onClick={() => {setIsBulkAiModalOpen(false); setBulkImages([]);}} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>}
            </div>
            <div className="p-6 overflow-y-auto bg-white">
              {aiStatus === 'ANALYZING' ? (
                <div className="py-12 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative w-24 h-24 mb-8"><div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div><div className="absolute inset-0 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div><div className="absolute inset-0 flex items-center justify-center text-gray-900 text-2xl"><Icons.Box /></div></div>
                    <div className="space-y-5 w-full max-w-md font-bold text-sm text-center text-gray-700">空間・質量を一括推論中...</div>
                </div>
              ) : (
                <div className="animate-in fade-in">
                    <div className="bg-gray-50 border border-gray-200 p-3 rounded-sm mb-4 flex items-start gap-2">
                        <div className="mt-0.5 text-gray-600"><Icons.Sparkles /></div>
                        <p className="text-xs text-gray-600 leading-relaxed font-bold">
                            連続で撮影したい場合は、スマホの標準カメラアプリでまとめて撮影した後、「📁 フォルダから複数選択」ボタンで一括アップロードするのが最速です。
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                        {bulkImages.map((b64, idx) => (
                            <div key={idx} className="relative aspect-square rounded-sm overflow-hidden border border-gray-300 group shadow-sm"><img src={`data:image/jpeg;base64,${b64}`} className="w-full h-full object-cover" /><div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 rounded">{idx + 1}</div><button onClick={() => removeBulkImage(idx)} className="absolute top-1 right-1 bg-[#D32F2F]/90 hover:bg-red-700 text-white p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash /></button></div>
                        ))}
                        <label className="aspect-square rounded-sm border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-500 transition-all flex flex-col items-center justify-center cursor-pointer text-gray-500">
                            <Icons.Camera />
                            <span className="text-[10px] font-bold mt-2 text-center">📷 カメラで<br/>1枚追加</span>
                            <input type="file" accept="image/*" capture="environment" onChange={handleBulkImageUpload} className="hidden" />
                        </label>
                        <label className="aspect-square rounded-sm border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-500 transition-all flex flex-col items-center justify-center cursor-pointer text-gray-500">
                            <Icons.UploadCloud />
                            <span className="text-[10px] font-bold mt-2 text-center">📁 フォルダから<br/>複数選択</span>
                            <input type="file" multiple accept="image/*" onChange={handleBulkImageUpload} className="hidden" />
                        </label>
                    </div>
                    
                    <div className="mb-6 bg-gray-50 border border-gray-200 p-3 rounded-sm relative">
                        <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                            <span>🗣️ AIへのヒント・補足（任意）</span>
                            <button onClick={toggleHintVoiceInput} className={`p-1.5 rounded transition ${isListeningHint ? 'bg-[#D32F2F] text-white animate-pulse shadow-inner' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                                <Icons.Mic />
                            </button>
                        </label>
                        <textarea className="w-full bg-white border border-gray-300 rounded-sm text-sm text-gray-900 p-2 outline-none focus:border-gray-900 min-h-[60px]" placeholder="例: 表面の通信線の下は全部太いCV線、計量器の重量は520kg..." value={aiHint} onChange={e => setAiHint(e.target.value)} />
                    </div>
                    <button onClick={runBulkAiAnalysis} disabled={bulkImages.length === 0 && !aiHint} className="w-full bg-gray-900 hover:bg-black text-white font-black py-4 rounded-sm flex justify-center items-center gap-2 disabled:bg-gray-400 shadow-md transition">
                        <Icons.Sparkles /> 画像 {bulkImages.length} 枚で一括査定を実行
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
