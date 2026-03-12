// app/components/admin/AdminDatabase.tsx
// @ts-nocheck
import React, { useState, useRef, useEffect, useMemo } from 'react';

// ============================================================================
// ⚠️ 重要：スプレッドシートの設定
// ============================================================================
const STATUS_COLUMN_INDEX = 21; 

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Search: () => <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Image: () => <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>,
  Sparkles: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 01-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-4 h-4 md:w-5 md:h-5 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Camera: () => <svg className="w-3 h-3 md:w-4 md:h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  UploadCloud: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Ruler: () => <svg className="w-4 h-4 inline-block text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-4-8v8m8-8v8M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
  Globe: () => <svg className="w-3 h-3 md:w-4 md:h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  EyeOff: () => <svg className="w-3 h-3 md:w-4 md:h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  SortAsc: () => <svg className="w-3 h-3 inline-block ml-1 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>,
  SortDesc: () => <svg className="w-3 h-3 inline-block ml-1 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>,
  SortNone: () => <svg className="w-3 h-3 inline-block ml-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>,
  Mic: () => <svg className="w-4 h-4 md:w-5 md:h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  AlertTriangle: () => <svg className="w-3 h-3 md:w-4 md:h-4 inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Cpu: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  Users: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
};

// ★全角数字・ピリオドを半角に自動変換（サニタイズ）する関数
const toHalfWidthNumber = (str: any) => {
  if (str == null) return '';
  return String(str)
    .replace(/[０-９．]/g, (s) => {
      if (s === '．') return '.';
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    })
    .replace(/[^0-9.]/g, ''); // 半角数字とピリオド以外を除去
};

const formatTimeShort = (timeStr: string) => {
  if (!timeStr) return '-';
  const str = String(timeStr);
  const match = str.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})[T\s](\d{1,2}):(\d{1,2})/);
  if (match) {
    const YY = match[1].substring(2); const MM = match[2].padStart(2, '0'); const DD = match[3].padStart(2, '0');
    const HH = match[4].padStart(2, '0'); const mm = match[5].padStart(2, '0');
    return `${YY}/${MM}/${DD} ${HH}:${mm}`;
  }
  return str.substring(0, 16);
};

const formatSqDisplay = (sq: any) => {
  if (!sq || sq === '-') return '-';
  const s = String(sq).toLowerCase();
  if (s.includes('sq') || s.includes('mm')) return sq;
  return `${sq} sq`;
};
const formatCoreDisplay = (core: any) => {
  if (!core || core === '-') return '-';
  const c = String(core).toUpperCase();
  if (c.includes('C') || c.includes('芯')) return core;
  return `${core}C`;
};

const parseSqForInput = (sq: string) => {
  if (!sq || sq === '-') return { val: '', unit: 'sq' };
  const str = String(sq).toLowerCase();
  const match = str.match(/^([\d.]+)\s*(sq|mm)?$/);
  if (match) return { val: match[1], unit: match[2] || 'sq' };
  return { val: str, unit: 'sq' };
};
const parseCoreForInput = (core: string) => {
  if (!core || core === '-') return '';
  const match = String(core).match(/(\d+)/);
  return match ? match[1] : String(core);
};

const getDriveImageUrl = (url: string) => {
  if (!url) return '';
  const match = url.match(/id=([^&]+)/) || url.match(/file\/d\/([^\/]+)/);
  if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
  }
  return url;
};

const getDriveViewUrl = (url: string) => {
  if (!url) return '';
  const match = url.match(/id=([^&]+)/) || url.match(/file\/d\/([^\/]+)/);
  if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/view`;
  }
  return url;
};

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

export const AdminDatabase = ({ data, isVoiceOutputEnabled }: { data: any, isVoiceOutputEnabled?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'WIRES' | 'UNKNOWN' | 'CASTINGS' | 'CLIENTS' | 'STAFF'>('WIRES');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [filterMaker, setFilterMaker] = useState('');
  const [filterType, setFilterType] = useState('');
  const [imageStatusFilter, setImageStatusFilter] = useState<'ALL' | 'COMPLETE' | 'PARTIAL' | 'NONE'>('ALL');

  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'ANALYZING'>('IDLE');
  const [aiProgressStep, setAiProgressStep] = useState(0); 
  const [imgData1, setImgData1] = useState<string>('');
  const [imgData2, setImgData2] = useState<string>('');
  const [imgData3, setImgData3] = useState<string>('');
  const [imgData4, setImgData4] = useState<string>('');
  const [aiHint, setAiHint] = useState<string>('');
  const [isListeningHint, setIsListeningHint] = useState(false);
  const hintRecognitionRef = useRef<any>(null);

  const [analyzingName, setAnalyzingName] = useState<string | null>(null);
  const [mergeProposal, setMergeProposal] = useState<any>(null);
  const [isMerging, setIsMerging] = useState(false);
  
  const [sampleTotal, setSampleTotal] = useState<number | ''>('');
  const [sampleCopper, setSampleCopper] = useState<number | ''>('');
  const [sampleCover, setSampleCover] = useState<number | ''>('');

  const wires = data?.wires || [];
  const unknownWires = data?.unknownWires || []; 
  const castings = data?.castings || [];
  const clients = data?.clients || [];
  const staffs = data?.staffs || [];

  const uniqueMakers = Array.from(new Set(wires.map((w:any) => w.maker).filter((m:any) => m && m !== '-')));
  const uniqueTypes = Array.from(new Set(castings.map((c:any) => c.type).filter(Boolean)));

  const wireStats = useMemo(() => {
      let complete = 0, partial = 0, none = 0;
      wires.forEach((w:any) => {
          const has1 = !!w.image1; const has2 = !!w.image2; const has3 = !!w.image3;
          if (has1 && has2 && has3) complete++;
          else if (!has1 && !has2 && !has3) none++;
          else partial++;
      });
      return { total: wires.length, complete, partial, none };
  }, [wires]);

  useEffect(() => {
    const pendingItemStr = localStorage.getItem('factoryOS_pendingAIItem');
    if (pendingItemStr) {
      try {
        const pendingData = JSON.parse(pendingItemStr);
        localStorage.removeItem('factoryOS_pendingAIItem'); 

        setActiveTab('WIRES'); 
        setEditingItem({
            maker: '', name: pendingData.name || '', year: '', _sqValue: '', _sqUnit: 'sq', _coreValue: '',
            conductor: pendingData.conductor || '', material: pendingData.material || '純銅',
            ratio: pendingData.ratio || '', aiEstimatedRatio: pendingData.ratio || '', showOnWeb: true,
            memo: `【POSからのAIアシスト引継ぎ】\nAI推論根拠: ${pendingData.reason || ''}\n※実測を行って歩留まりを上書きしてください。`,
            _pendingImageData1: pendingData.image1 || null, 
            _pendingImageData2: pendingData.image2 || null,
            _pendingImageData4: pendingData.image4 || null,
            _pendingImageData5: pendingData.image5 || null
        });
        setSampleTotal(''); setSampleCopper(''); setSampleCover('');
        setIsModalOpen(true); 
      } catch (e) {}
    }
  }, []);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab); setSearchTerm(''); setSelectedCategory('すべて'); setFilterMaker(''); setFilterType(''); setSortConfig(null); setImageStatusFilter('ALL');
  };

  const handleOpenModal = (item: any = null) => {
    const sqData = parseSqForInput(item?.sq); const coreData = parseCoreForInput(item?.core);
    setEditingItem({ ...item, _sqValue: sqData.val, _sqUnit: sqData.unit, _coreValue: coreData, material: item?.material || '純銅', showOnWeb: item ? String(item.showOnWeb) !== 'false' : true });
    setSampleTotal(item?.sampleTotal || ''); setSampleCopper(item?.sampleCopper || ''); setSampleCover(item?.sampleCover === 0 ? '' : (item?.sampleCover || '')); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null); setSampleTotal(''); setSampleCopper(''); setSampleCover(''); setIsModalOpen(false);
  };

  const handleEnrichClient = async (targetItem?: any) => {
      const itemToEnrich = targetItem || editingItem;
      if(!itemToEnrich || !itemToEnrich.name) return alert("企業名がありません");
      setIsSubmitting(true);
      try {
          const res = await fetch('/api/enrich-client', {
              method:'POST', headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ companyName: itemToEnrich.name, address: itemToEnrich.address, industry: itemToEnrich.industry, currentMemo: itemToEnrich.memo })
          });
          const d = await res.json();
          if(d.success) {
              setEditingItem({ ...itemToEnrich, industry: d.data.industry, memo: `${d.data.memo}`.trim() });
              if (!targetItem) setIsModalOpen(true);
              alert("AIが企業情報を深掘りし、データを補完しました！\n「マスター登録」を押して保存してください。");
          } else { alert("情報の取得に失敗しました"); }
      } catch(e) { alert("通信エラー"); }
      setIsSubmitting(false);
  };

  const calculateRatio = (total: number | '', copper: number | '') => {
      if (total && copper && Number(total) > 0) return ((Number(copper) / Number(total)) * 100).toFixed(2);
      return '';
  };

  const handleSampleTotalChange = (val: string) => { 
      const cleanVal = toHalfWidthNumber(val);
      const num = cleanVal ? Number(cleanVal) : ''; 
      setSampleTotal(num); 
      setEditingItem({...editingItem, sampleTotal: num, ratio: calculateRatio(num, sampleCopper)}); 
  };
  const handleSampleCopperChange = (val: string) => { 
      const cleanVal = toHalfWidthNumber(val);
      const num = cleanVal ? Number(cleanVal) : ''; 
      setSampleCopper(num); 
      setEditingItem({...editingItem, sampleCopper: num, ratio: calculateRatio(sampleTotal, num)}); 
  };
  const handleSampleCoverChange = (val: string) => { 
      const cleanVal = toHalfWidthNumber(val);
      const num = cleanVal ? Number(cleanVal) : ''; 
      setSampleCover(num); 
      setEditingItem({...editingItem, sampleCover: num}); 
  };

  const getJuteWeight = () => {
      if (sampleTotal && sampleCopper) {
          const coverVal = Number(sampleCover) || 0;
          if (coverVal === 0) return '0.000'; 
          const jute = (Number(sampleTotal) || 0) - (Number(sampleCopper) || 0) - coverVal;
          return jute > 0 ? jute.toFixed(3) : '0.000';
      }
      return '---';
  };

  const getAutoCoverWeight = () => {
      if (sampleTotal && sampleCopper && (Number(sampleCover) || 0) === 0) {
          const autoCover = (Number(sampleTotal) || 0) - (Number(sampleCopper) || 0);
          return autoCover > 0 ? autoCover.toFixed(3) : '0.000';
      }
      return '0.000';
  };

  const handlePromoteToWire = (unknownItem: any) => {
      setActiveTab('WIRES');
      setEditingItem({
          name: unknownItem.name.replace(/【.*?】/g, ''), maker: '', year: '', _sqValue: '', _sqUnit: 'sq', _coreValue: '', 
          conductor: '', material: unknownItem.material || '純銅', ratio: '', image1: unknownItem.image1, image2: unknownItem.image2, showOnWeb: true,
          memo: `【AI推論からの昇格】\n推論日時: ${unknownItem.createdAt}\nAIの根拠: ${unknownItem.reason}`
      });
      setIsModalOpen(true);
  };

  const handleCaliperInput = () => {
      const val = window.prompt("📐 ノギスで実測した「直径(mm)」を入力してください\n例: 2.0 または 3.5");
      if (!val) return;
      const cleanVal = toHalfWidthNumber(val);
      const d = parseFloat(cleanVal);
      if (isNaN(d) || d <= 0) return alert("正しい数値を入力してください。");

      const isSolid = editingItem.conductor && (editingItem.conductor.includes('単線') || editingItem.conductor === 'Solid');
      if (isSolid) {
          setEditingItem({ ...editingItem, _sqValue: String(d), _sqUnit: 'mm' });
      } else {
          const approxSq = ((d / 2) * (d / 2) * Math.PI) * 0.75;
          const jisSqs = [1.25, 2, 3.5, 5.5, 8, 14, 22, 38, 60, 100, 150, 200, 250, 325];
          const closestSq = jisSqs.reduce((prev, curr) => Math.abs(curr - approxSq) < Math.abs(prev - approxSq) ? curr : prev);
          if (window.confirm(`【概算結果】 直径: ${d}mm → 約${approxSq.toFixed(1)}sq\nJIS規格「${closestSq} sq」を適用しますか？`)) {
              setEditingItem({ ...editingItem, _sqValue: String(closestSq), _sqUnit: 'sq' });
          }
      }
  };

  const handleSave = async () => {
    let finalItem = { ...editingItem };
    finalItem.sq = finalItem._sqValue ? `${finalItem._sqValue}${finalItem._sqUnit === 'mm' ? 'mm' : ''}` : ''; 
    finalItem.core = finalItem._coreValue ? `${finalItem._coreValue}` : '';

    setIsSubmitting(true);
    let sheetName = '';
    if (activeTab === 'WIRES') sheetName = 'Products_Wire';
    if (activeTab === 'UNKNOWN') sheetName = 'Products_Unknown';
    if (activeTab === 'CASTINGS') sheetName = 'Products_Casting';
    if (activeTab === 'CLIENTS') sheetName = 'Clients';
    if (activeTab === 'STAFF') sheetName = 'Staff';

    const uploadPendingImage = async (pendingKey: string, dbKey: string, suffix: string) => {
        if (finalItem[pendingKey]) {
            try {
                const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPLOAD_IMAGE', data: finalItem[pendingKey], mimeType: 'image/jpeg', fileName: `master_${suffix}_${Date.now()}.jpg` }) });
                const r = await res.json(); if (r.status === 'success') finalItem[dbKey] = r.url;
            } catch(e) {}
        }
    };
    await uploadPendingImage('_pendingImageData1', 'image1', 'sec');
    await uploadPendingImage('_pendingImageData2', 'image2', 'all');
    await uploadPendingImage('_pendingImageData3', 'image3', 'nak');
    await uploadPendingImage('_pendingImageData4', 'image4', 'prt1');
    await uploadPendingImage('_pendingImageData5', 'image5', 'prt2');

    const action = finalItem.id ? 'UPDATE_DB_RECORD' : 'ADD_DB_RECORD';
    const payload = finalItem.id ? { action, sheetName, recordId: finalItem.id, updates: getUpdatesMap(finalItem, activeTab) } : { action, sheetName, data: finalItem };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') { alert('マスターに登録しました'); window.location.reload(); } 
      else { alert('エラー: ' + result.message); }
    } catch (e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    let sheetName = activeTab === 'WIRES' ? 'Products_Wire' : activeTab === 'UNKNOWN' ? 'Products_Unknown' : activeTab === 'CASTINGS' ? 'Products_Casting' : activeTab === 'CLIENTS' ? 'Clients' : 'Staff';
    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName, recordId: id }) });
      const result = await res.json();
      if (result.status === 'success') { alert('削除しました'); window.location.reload(); }
    } catch (e) { alert('通信エラー'); }
  };

  const getUpdatesMap = (item: any, tab: string) => {
    if (tab === 'WIRES') {
        const updates: any = { 1: item.maker, 2: item.name, 3: item.year, 4: item.sq, 5: item.sampleTotal, 6: item.sampleCopper, 7: item.core, 8: item.conductor, 9: item.ratio, 10: item.memo, 18: item.material, 19: item.sampleCover, 20: item.showOnWeb };
        if (item.image1 !== undefined) updates[11] = item.image1;
        if (item.image2 !== undefined) updates[12] = item.image2;
        if (item.image3 !== undefined) updates[13] = item.image3;
        if (item.image4 !== undefined) updates[14] = item.image4;
        if (item.image5 !== undefined) updates[15] = item.image5;
        if (item.status !== undefined) updates[STATUS_COLUMN_INDEX] = item.status;
        return updates;
    }
    if (tab === 'UNKNOWN') return { 1: item.name, 2: item.ratio, 3: item.reason, 9: item.material }; 
    if (tab === 'CASTINGS') return { 1: item.name, 2: item.type, 4: item.ratio };
    if (tab === 'CLIENTS') return { 1: item.name, 2: item.rank, 4: item.phone, 5: item.loginId, 6: item.password, 7: item.points, 8: item.memo, 9: item.address, 10: item.industry };
    if (tab === 'STAFF') return { 1: item.name, 2: item.role, 3: item.rate, 4: item.status, 5: item.loginId, 6: item.password };
    return {};
  };

  // ★ AI重複マージの実行
  const handleAiMergeAnalyze = async (wireName: string, groupData: any) => {
    setAnalyzingName(wireName);
    const records = [groupData.captain, ...groupData.members];
    try {
      const res = await fetch('/api/ai-merge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetName: wireName, records })
      });
      const data = await res.json();
      if (data.success) {
        setMergeProposal({ name: wireName, records, allIds: groupData.allIds, ...data.result });
      } else {
        alert("分析エラー: " + data.message);
      }
    } catch (e) {
      alert("通信エラーが発生しました。");
    } finally {
      setAnalyzingName(null);
    }
  };

  const handleApplyMerge = async () => {
    if (!confirm('統合データをマスターとして新規登録しますか？\n（元のデータは全てアーカイブとして保持されます）')) return;
    setIsMerging(true);
    const gasUrl = "/api/gas"; 

    try {
      const updatePromises = mergeProposal.allIds.map((id: string) => {
        return fetch(gasUrl, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ action: 'UPDATE_DB_RECORD', sheetName: 'Products_Wire', recordId: id, updates: { [STATUS_COLUMN_INDEX]: 'archived' } }) 
        });
      });
      await Promise.all(updatePromises);

      const baseItem = mergeProposal.records[0];
      const payload = {
        action: 'ADD_DB_RECORD',
        sheetName: 'Products_Wire',
        data: {
          ...baseItem,
          name: mergeProposal.name,
          ratio: mergeProposal.mergedYieldRate,
          memo: `【AI統合データ】\n${mergeProposal.mergedDescription}\n\n※過去${mergeProposal.records.length}件のデータを統合。`,
          status: 'active'
        }
      };
      delete payload.data.id; delete payload.data.createdAt; delete payload.data.updatedAt;

      await fetch(gasUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      
      alert("✨ マージ完了！統合データを作成し、過去のデータは教師データとして保持しました。");
      window.location.reload();
    } catch (e) {
      alert("マージ処理中にエラーが発生しました。");
      setIsMerging(false);
    }
  };

  const compressImage = (file: File, isDetailMode: boolean = true): Promise<string> => {
      return new Promise((resolve, reject) => {
          if (!file) return reject(new Error("ファイルがありません"));
          const reader = new FileReader(); 
          reader.onload = (event) => {
              const img = new Image(); 
              img.onload = () => {
                  try {
                      const canvas = document.createElement('canvas');
                      const MAX = isDetailMode ? 1600 : 1024; 
                      const quality = isDetailMode ? 0.85 : 0.7;
                      
                      let w = img.width; let h = img.height;
                      if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
                      canvas.width = w; canvas.height = h;
                      const ctx = canvas.getContext('2d'); 
                      if (!ctx) throw new Error("Canvas context error");
                      ctx.drawImage(img, 0, 0, w, h);
                      resolve(canvas.toDataURL('image/jpeg', quality).split(',')[1]); 
                  } catch (e) {
                      reject(new Error("画像の圧縮に失敗しました。"));
                  }
              };
              img.onerror = () => reject(new Error('画像の読み込みに失敗しました'));
              img.src = event.target?.result as string;
          };
          reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
          reader.readAsDataURL(file);
      });
  };

  const handleImageUploadLocal = async (e: React.ChangeEvent<HTMLInputElement>, pendingKey: string) => {
      const file = e.target.files?.[0]; if (!file) return;
      try {
          const isDetail = pendingKey !== '_pendingImageData2';
          const b64 = await compressImage(file, isDetail);
          setEditingItem({...editingItem, [pendingKey]: b64});
      } catch(err: any) { alert(err.message); }
      e.target.value = '';
  };

  const handleAiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2 | 3 | 4) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { 
        const isDetail = num !== 2;
        const compressed = await compressImage(file, isDetail); 
        
        if (num === 1) setImgData1(compressed); 
        else if (num === 2) setImgData2(compressed); 
        else if (num === 3) setImgData3(compressed); 
        else if (num === 4) setImgData4(compressed); 
    } catch (err: any) { alert(err.message); } 
    finally { e.target.value = ''; }
  };

  const toggleVoiceInput = () => {
      if (isListening) { if (recognitionRef.current) recognitionRef.current.stop(); return; }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP'; recognition.continuous = true; recognition.interimResults = true;

      recognition.onstart = () => { setIsListening(true); setVoiceText('🎤 認識中... (もう一度押すと終了)'); };
      
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
      recognition.onend = () => { 
          setIsListening(false); 
          if (finalTranscript) setSearchTerm(prev => prev + (prev ? ' ' : '') + finalTranscript);
          setTimeout(() => setVoiceText(''), 2000); 
      };
      recognitionRef.current = recognition; recognition.start();
  };

  const toggleHintVoiceInput = () => {
      if (isListeningHint) {
          if (hintRecognitionRef.current) hintRecognitionRef.current.stop();
          return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return alert('非対応');
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

  const runAiExtraction = async () => {
    if (!imgData1) return alert('最低1枚の画像（断面など）をアップロードしてください');
    
    const totalSize = (imgData1.length + imgData2.length + imgData3.length + imgData4.length) * 0.75;
    if (totalSize > 4 * 1024 * 1024) {
        return alert('⚠️ 画像サイズの合計が大きすぎます（通信エラーになります）。\n不要な画像を削除するか、もう少し離れて撮影してください。');
    }

    setAiStatus('ANALYZING'); setAiProgressStep(1); 
    const progressInterval = setInterval(() => { setAiProgressStep(prev => { if (prev === 1) return 2; if (prev === 2) return 3; return 3; }); }, 2000);
    
    try {
      const res = await fetch('/api/gas', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ action: 'VISION_AI_REGISTER', imageData: imgData1, imageData2: imgData2, imageData3: imgData3, imageData4: imgData4, hint: aiHint }) 
      });
      const result = await res.json();
      
      clearInterval(progressInterval); setAiProgressStep(4);

      setTimeout(() => {
          if (result.status === 'success') {
              const cleanSize = String(result.data.size || '').replace(/[^\d.]/g, '');
              const cleanCore = String(result.data.core || '').replace(/[^\d]/g, '');

              setEditingItem({
                  maker: result.data.maker === '-' ? '' : result.data.maker, name: result.data.name === '-' ? '' : result.data.name, year: result.data.year === '-' ? '' : result.data.year,
                  _sqValue: cleanSize === '-' ? '' : cleanSize, _sqUnit: 'sq', _coreValue: cleanCore === '-' ? '' : cleanCore,
                  conductor: result.data.conductor === '-' ? '' : result.data.conductor, material: result.data.material === '-' ? '純銅' : result.data.material,
                  ratio: result.data.estimatedRatio || '', aiEstimatedRatio: result.data.estimatedRatio || '', showOnWeb: true,
                  memo: `【AIアシスト抽出】\nAI推論根拠: ${result.data.reason}\n※実測を行って歩留まりを上書きしてください。`,
                  _pendingImageData1: imgData1, _pendingImageData2: imgData2, _pendingImageData4: imgData3, _pendingImageData5: imgData4
              });

              setSampleTotal(''); setSampleCopper(''); setSampleCover('');
              setIsAiModalOpen(false); setIsModalOpen(true);
          } else { alert('AI抽出エラー: ' + result.message); }
          setAiStatus('IDLE'); setAiProgressStep(0);
      }, 800);

    } catch(err) { clearInterval(progressInterval); alert('通信エラーが発生しました。'); setAiStatus('IDLE'); setAiProgressStep(0); }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };
  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <Icons.SortNone />;
    return sortConfig.direction === 'asc' ? <Icons.SortAsc /> : <Icons.SortDesc />;
  };

  let filteredData = [];
  
  if (activeTab === 'WIRES') {
      filteredData = wires.filter((w:any) => {
          if (selectedCategory !== 'すべて' && getCategory(w.name) !== selectedCategory) return false;
          if (filterMaker && w.maker !== filterMaker) return false;

          const has1 = !!w.image1; const has2 = !!w.image2; const has3 = !!w.image3;
          if (imageStatusFilter === 'COMPLETE' && !(has1 && has2 && has3)) return false;
          if (imageStatusFilter === 'NONE' && (has1 || has2 || has3)) return false;
          if (imageStatusFilter === 'PARTIAL' && ((has1 && has2 && has3) || (!has1 && !has2 && !has3))) return false;

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
  }
  if (activeTab === 'UNKNOWN') {
      filteredData = unknownWires.filter((u:any) => {
          if (searchTerm) {
              const searchTarget = `${u.name} ${u.reason}`.toLowerCase();
              const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
              return terms.every(term => searchTarget.includes(term));
          }
          return true;
      });
  }
  if (activeTab === 'CASTINGS') {
      filteredData = castings.filter((c:any) => {
          if (filterType && c.type !== filterType) return false;
          if (searchTerm) {
              const searchTarget = `${c.name} ${c.type}`.toLowerCase();
              const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
              return terms.every(term => searchTarget.includes(term));
          }
          return true;
      });
  }
  if (activeTab === 'CLIENTS') {
      filteredData = clients.filter((c:any) => {
          if (searchTerm) {
              const searchTarget = `${c.name} ${c.phone} ${c.rank} ${c.industry}`.toLowerCase();
              const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
              return terms.every(term => searchTarget.includes(term));
          }
          return true;
      });
  }
  if (activeTab === 'STAFF') {
      filteredData = staffs.filter((s:any) => {
          if (searchTerm) {
              const searchTarget = `${s.name} ${s.role}`.toLowerCase();
              const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
              return terms.every(term => searchTarget.includes(term));
          }
          return true;
      });
  }

  let sortedData = [...filteredData];
  if (sortConfig !== null) {
    sortedData.sort((a, b) => {
      let aValue = a[sortConfig.key]; let bValue = b[sortConfig.key];
      const isDate = (val: any) => typeof val === 'string' && val.match(/^\d{4}[-\/]\d{2}[-\/]\d{2}/);
      if (isDate(aValue) || isDate(bValue)) {
          const dateA = aValue ? new Date(aValue).getTime() : 0;
          const dateB = bValue ? new Date(bValue).getTime() : 0;
          if (dateA < dateB) return sortConfig.direction === 'asc' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      }
      if (aValue !== '' && bValue !== '' && !isNaN(Number(aValue)) && !isNaN(Number(bValue))) { aValue = Number(aValue); bValue = Number(bValue); } 
      else { aValue = String(aValue || '').toLowerCase(); bValue = String(bValue || '').toLowerCase(); }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  } else {
      sortedData.sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return dateB - dateA;
      });
  }

  // ★ 線種データをさらに厳密なキーでグループ化
  const groupedWires = useMemo(() => {
    if (activeTab !== 'WIRES') return [];
    const groups: { [key: string]: { captain: any, members: any[], allIds: string[] } } = {};
    
    sortedData.forEach(w => {
      const maker = w.maker && w.maker !== '-' ? `【${w.maker}】` : '';
      const name = w.name || '名称未設定';
      const voltage = w.voltage ? ` (${w.voltage})` : '';
      const sq = w.sq && w.sq !== '-' ? ` ${w.sq}sq` : '';
      const core = w.core && w.core !== '-' ? ` ${w.core}C` : ''; 
      const year = w.year && w.year !== '-' ? ` (${w.year}年)` : '';
      const conductor = w.conductor && w.conductor !== '-' ? ` [${w.conductor}]` : '';
      
      let groupKey = `${maker}${name}${voltage}${sq}${core}${year}${conductor}`.trim();

      // 🚨 安全装置：スケア(sq)や芯数(core)が未登録のデータは、マージによる破壊を防ぐため完全に孤立させる
      if (!w.sq || w.sq === '-' || !w.core || w.core === '-') {
         groupKey = `${groupKey}_独自ID:${w.id}`;
      }

      if (!groups[groupKey]) groups[groupKey] = { captain: null, members: [], allIds: [] };
      
      groups[groupKey].allIds.push(w.id);

      if (w.status !== 'archived') {
        if (!groups[groupKey].captain) {
          groups[groupKey].captain = w;
        } else {
          groups[groupKey].members.push(w);
        }
      } else {
        groups[groupKey].members.push(w);
      }
    });

    Object.keys(groups).forEach(key => {
      if (!groups[key].captain && groups[key].members.length > 0) {
         groups[key].captain = groups[key].members[0];
         groups[key].members = groups[key].members.slice(1);
      }
    });

    return Object.entries(groups).map(([name, data]) => ({ name, ...data }));
  }, [sortedData, activeTab]);

  const ImageSlot = ({ title, imageKey, colIdx, pendingKey }: { title: string, imageKey: string, colIdx: number, pendingKey: string }) => {
    const savedImage = editingItem[imageKey];
    const pendingImage = editingItem[pendingKey];
    const hasImage = !!savedImage || !!pendingImage;

    return (
        <div className="flex flex-col items-center border border-gray-300 p-1.5 md:p-2 rounded-sm bg-white h-[70px] md:h-[90px] justify-center relative overflow-hidden group shadow-sm w-full">
            <span className="absolute top-0 left-0 bg-gray-100 text-gray-600 text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-br-sm z-10">{title}</span>
            {pendingImage ? (
                <>
                    <img src={`data:image/jpeg;base64,${pendingImage}`} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <span className="relative z-10 text-[9px] md:text-[10px] font-bold text-gray-900 bg-white/80 px-1.5 py-0.5 rounded-sm backdrop-blur-sm shadow-sm border border-gray-300">未保存</span>
                    <button onClick={() => setEditingItem({...editingItem, [pendingKey]: null})} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md z-20 hover:bg-red-800"><Icons.Trash /></button>
                </>
            ) : savedImage ? (
                <>
                    <a href={getDriveViewUrl(savedImage)} target="_blank" rel="noopener noreferrer" className="absolute inset-0 w-full h-full block">
                        <img src={getDriveImageUrl(savedImage)} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-zoom-in" />
                    </a>
                </>
            ) : ( 
                <div className="flex gap-1 w-full h-full mt-3 md:mt-4">
                    <label className="flex-1 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition border border-gray-300 rounded-sm" title="カメラ"><Icons.Camera /><input type="file" onChange={(e) => handleImageUploadLocal(e, pendingKey)} className="hidden" accept="image/*" capture="environment" /></label>
                    <label className="flex-1 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition border border-gray-300 rounded-sm" title="フォルダ"><Icons.UploadCloud /><input type="file" onChange={(e) => handleImageUploadLocal(e, pendingKey)} className="hidden" accept="image/*" /></label>
                </div> 
            )}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 font-sans">
      <header className="mb-2 md:mb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 md:h-6 bg-[#D32F2F] block"></span>
          <div>
            <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight">マスターデータベース</h2>
            <p className="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1 font-bold">コアデータ管理 / AI推論監視</p>
          </div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto shadow-inner border border-gray-200">
          {['WIRES', 'UNKNOWN', 'CASTINGS', 'CLIENTS', 'STAFF'].map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab as any)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-sm text-[10px] md:text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'}`}>
              {tab === 'WIRES' ? '電線' : tab === 'UNKNOWN' ? '💡 未知' : tab === 'CASTINGS' ? '非鉄' : tab === 'CLIENTS' ? '顧客' : 'スタッフ'}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm flex-1 flex flex-col overflow-hidden relative">
        <div className="p-2 md:p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-2 z-30 relative">
          
          {(isListening || voiceText) && (
              <div className="absolute top-full left-0 w-full z-40 bg-gray-900 text-white p-2 text-center text-sm font-bold shadow-md animate-in slide-in-from-top-2">
                  {isListening ? <span className="animate-pulse">{voiceText}</span> : <span>{voiceText}</span>}
              </div>
          )}

          {activeTab === 'WIRES' && (
              <div className="bg-white border border-gray-300 rounded-sm shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between p-2 md:p-3 gap-2 md:gap-4 hidden md:flex">
                  <div className="flex items-center gap-3 w-full lg:w-1/3">
                      <div className="bg-gray-100 text-gray-800 border border-gray-200 p-2 rounded-full hidden sm:block"><Icons.Camera /></div>
                      <div className="flex-1">
                          <h4 className="text-xs font-bold text-gray-900 tracking-widest flex justify-between">
                              <span>📸 写真収集ミッション</span>
                              <span>{Math.floor((wireStats.complete / wireStats.total) * 100)}% 完成</span>
                          </h4>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden shadow-inner">
                              <div className="bg-gray-900 h-full rounded-full transition-all duration-1000" style={{ width: `${(wireStats.complete / wireStats.total) * 100}%` }}></div>
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 [&::-webkit-scrollbar]:hidden">
                      <button onClick={() => setImageStatusFilter('ALL')} className={`px-2 py-1 md:px-3 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold transition whitespace-nowrap border ${imageStatusFilter === 'ALL' ? 'bg-gray-900 text-white border-gray-900 shadow-inner' : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'}`}>
                          全 {wireStats.total}件
                      </button>
                      <button onClick={() => setImageStatusFilter('COMPLETE')} className={`px-2 py-1 md:px-3 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold transition flex items-center gap-1 whitespace-nowrap border ${imageStatusFilter === 'COMPLETE' ? 'bg-green-700 text-white border-green-800 shadow-inner' : 'bg-white text-green-700 border-green-300 hover:bg-green-50'}`}>
                          ✨ 完備 ({wireStats.complete})
                      </button>
                      <button onClick={() => setImageStatusFilter('PARTIAL')} className={`px-2 py-1 md:px-3 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold transition flex items-center gap-1 whitespace-nowrap border ${imageStatusFilter === 'PARTIAL' ? 'bg-yellow-600 text-white border-yellow-700 shadow-inner' : 'bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50'}`}>
                          🔄 不足 ({wireStats.partial})
                      </button>
                      <button onClick={() => setImageStatusFilter('NONE')} className={`px-2 py-1 md:px-3 md:py-1.5 rounded-sm text-[9px] md:text-[10px] font-bold transition flex items-center gap-1 whitespace-nowrap border ${imageStatusFilter === 'NONE' ? 'bg-[#D32F2F] text-white border-red-800 shadow-inner' : 'bg-white text-[#D32F2F] border-red-300 hover:bg-red-50'}`}>
                          ❌ 未登録 ({wireStats.none})
                      </button>
                  </div>
              </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center">
              <div className="flex flex-1 gap-1.5 w-full flex-wrap">
                  <div className="relative flex-1 min-w-[150px]">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><Icons.Search /></div>
                    <input type="text" placeholder="AND検索 (例: 1C VV)..." className="w-full pl-7 pr-2 py-1.5 md:py-2 border border-gray-300 rounded-sm text-xs md:text-sm focus:border-gray-900 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  </div>

                  {activeTab === 'WIRES' && uniqueMakers.length > 0 && (
                      <select className="border border-gray-300 rounded-sm px-1 py-1.5 md:py-2 text-xs md:text-sm outline-none focus:border-gray-900 bg-white cursor-pointer font-bold text-gray-700 shadow-sm max-w-[100px] md:max-w-[140px]" value={filterMaker} onChange={e => setFilterMaker(e.target.value)}>
                          <option value="">全メーカー</option>
                          {uniqueMakers.map((m: any) => <option key={m} value={m}>{m}</option>)}
                      </select>
                  )}

                  {activeTab === 'CASTINGS' && uniqueTypes.length > 0 && (
                      <select className="border border-gray-300 rounded-sm px-1 py-1.5 md:py-2 text-xs md:text-sm outline-none focus:border-gray-900 bg-white cursor-pointer font-bold text-gray-700 shadow-sm max-w-[100px] md:max-w-[140px]" value={filterType} onChange={e => setFilterType(e.target.value)}>
                          <option value="">すべての種別</option>
                          {uniqueTypes.map((t: any) => <option key={t} value={t}>{t === 'BRASS' ? '真鍮' : t === 'ZINC' ? '亜鉛' : t === 'LEAD' ? '鉛' : t}</option>)}
                      </select>
                  )}

                  <button onClick={toggleVoiceInput} className={`px-2 py-1.5 md:py-2 border rounded-sm flex items-center justify-center transition-all shadow-sm ${isListening ? 'bg-[#D32F2F] border-red-800 text-white animate-pulse shadow-inner' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} title="音声検索">
                      <Icons.Mic />
                  </button>
              </div>

              {activeTab !== 'UNKNOWN' && (
                  <div className="flex gap-1.5 w-full md:w-auto shrink-0">
                    {activeTab === 'WIRES' && (
                        <button onClick={() => setIsAiModalOpen(true)} className="flex-1 md:flex-none bg-white text-gray-900 border border-gray-300 px-3 py-1.5 md:px-4 md:py-2 rounded-sm text-xs md:text-sm font-bold hover:bg-gray-100 hover:border-gray-400 transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap shadow-sm">
                            <Icons.Sparkles /> AI登録
                        </button>
                    )}
                    <button onClick={() => handleOpenModal()} className="flex-1 md:flex-none bg-gray-900 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-sm text-xs md:text-sm font-bold hover:bg-black transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap active:scale-95 shadow-sm">
                        <Icons.Plus /> 手動登録
                    </button>
                  </div>
              )}
          </div>

          {activeTab === 'WIRES' && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {CATEGORIES.map(cat => (
                      <button 
                          key={cat} 
                          onClick={() => setSelectedCategory(cat)} 
                          className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold whitespace-nowrap transition-colors border shadow-sm ${selectedCategory === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden relative bg-gray-100 md:bg-white">
            <div className="h-full overflow-y-auto relative">
              
              <table className="hidden md:table w-full text-left border-collapse text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs sticky top-0 z-20 shadow-sm border-b border-gray-300">
                  <tr>
                    {activeTab === 'WIRES' && (
                        <>
                            <th className="p-3 w-10 text-center" title="Web(LP)の価格表に表示するかどうか"><Icons.Globe /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('maker')}>メーカー <SortIcon columnKey="maker" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('name')}>品名 <SortIcon columnKey="name" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('year')}>製造年 <SortIcon columnKey="year" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('sq')}>SQ/芯数 <SortIcon columnKey="sq" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('ratio')}>歩留まり <SortIcon columnKey="ratio" /></th>
                            <th className="p-3 text-center font-bold"><Icons.Camera /> 画像データ</th>
                        </>
                    )}
                    {activeTab === 'UNKNOWN' && (
                        <>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('createdAt')}>登録日時 <SortIcon columnKey="createdAt" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('name')}>AI推定品名 <SortIcon columnKey="name" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('ratio')}>歩留まり <SortIcon columnKey="ratio" /></th>
                            <th className="p-3 w-1/3 font-bold">推論の根拠</th>
                        </>
                    )}
                    {activeTab === 'CASTINGS' && (
                        <>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('name')}>品目名 <SortIcon columnKey="name" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('type')}>種別 <SortIcon columnKey="type" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('ratio')}>歩留まり <SortIcon columnKey="ratio" /></th>
                        </>
                    )}
                    {activeTab === 'CLIENTS' && (
                        <>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('name')}>業者名 <SortIcon columnKey="name" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('rank')}>ランク <SortIcon columnKey="rank" /></th>
                            <th className="p-3 font-bold">電話番号</th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('points')}>ポイント <SortIcon columnKey="points" /></th>
                        </>
                    )}
                    {activeTab === 'STAFF' && (
                        <>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('name')}>スタッフ名 <SortIcon columnKey="name" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('role')}>権限 <SortIcon columnKey="role" /></th>
                            <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('status')}>ステータス <SortIcon columnKey="status" /></th>
                        </>
                    )}
                    {activeTab !== 'UNKNOWN' && activeTab !== 'WIRES' && (
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none font-bold" onClick={() => handleSort('updatedAt')}>登録/更新 <SortIcon columnKey="updatedAt" /></th>
                    )}
                    <th className="p-3 text-right font-bold">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* ★ WIRES の場合はチーム型グループ展開で描画する */}
                  {activeTab === 'WIRES' ? (
                    groupedWires.map((group, idx) => {
                      const item = group.captain;
                      if (!item) return null;
                      const members = group.members;
                      const needsMerge = members.filter(m => m.status !== 'archived').length > 0;

                      return (
                        <React.Fragment key={item.id || idx}>
                          <tr className={`hover:bg-gray-50 transition ${String(item.showOnWeb) === 'false' ? 'opacity-50 bg-gray-100' : ''} ${needsMerge ? 'bg-blue-50/20' : ''}`}>
                            <td className="p-3 text-center">
                                {String(item.showOnWeb) === 'false' ? <span className="text-gray-400" title="Web非表示"><Icons.EyeOff /></span> : <span className="text-gray-900" title="Web表示中"><Icons.Globe /></span>}
                            </td>
                            <td className="p-3 font-bold text-gray-700">{item.maker || '-'}</td>
                            <td className="p-3 font-black text-gray-900 text-base">
                                <div className="flex items-center gap-2">
                                    {item.name}
                                    {item.material === '錫メッキ' && <span className="inline-flex items-center gap-0.5 bg-[#D32F2F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm"><Icons.AlertTriangle /> 錫</span>}
                                    {item.material === 'アルミ' && <span className="inline-flex items-center gap-0.5 bg-gray-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm">アルミ</span>}
                                    {needsMerge && <span className="bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded text-[9px] font-bold animate-pulse">重複検知</span>}
                                </div>
                            </td>
                            <td className="p-3 text-gray-600">{item.year || '-'}</td>
                            <td className="p-3 text-gray-600 font-mono font-bold text-xs">
                                {formatSqDisplay(item.sq)} / {formatCoreDisplay(item.core)}
                                {item.conductor && item.conductor !== '-' && <div className="text-[10px] text-gray-400 font-normal mt-0.5">{item.conductor}</div>}
                            </td>
                            <td className="p-3 font-mono font-black text-gray-900 text-lg">{item.ratio ? `${item.ratio}%` : '未設定'}</td>
                            <td className="p-3">
                                <div className="flex gap-2 justify-center">
                                    {[11, 12, 13, 14, 15].map(colIdx => {
                                        const hasImage = !!item[`image${colIdx-10}`];
                                        return (
                                            <div key={colIdx} className="flex flex-col gap-1 items-center w-10">
                                                <div className={`relative w-full h-8 border ${hasImage ? 'border-gray-400' : 'border-gray-200 border-dashed'} rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center group shadow-sm`}>
                                                    {hasImage ? (
                                                        <a href={getDriveViewUrl(item[`image${colIdx-10}`])} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                                            <img src={getDriveImageUrl(item[`image${colIdx-10}`])} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-zoom-in" />
                                                        </a>
                                                    ) : ( <span className="text-[8px] text-gray-300 font-bold">空</span> )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </td>
                            <td className="p-3 text-right align-top">
                              <div className="flex flex-col items-end gap-1.5">
                                <div className="flex gap-2">
                                  <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 border border-transparent hover:border-gray-300 rounded-sm transition shadow-sm"><Icons.Edit /></button>
                                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-[#D32F2F] hover:bg-red-50 border border-transparent hover:border-red-200 rounded-sm transition shadow-sm"><Icons.Trash /></button>
                                </div>
                                {needsMerge && (
                                  <button onClick={() => handleAiMergeAnalyze(group.name, group)} className="text-[10px] bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded-sm shadow-sm flex items-center gap-1">
                                    <Icons.Cpu /> AIマージ
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {/* 過去データの折りたたみ表示 (PC版) */}
                          {members.length > 0 && (
                            <tr className="bg-gray-50/50">
                              <td colSpan={8} className="p-0 border-b border-gray-200">
                                <details className="group">
                                  <summary className="text-[10px] text-gray-500 font-bold p-2 cursor-pointer hover:bg-gray-100 select-none flex items-center gap-2">
                                     <span className="w-4 text-center">▼</span>
                                     <Icons.Users /> <span>裏側のチームデータ（AI教師用画像） {members.length}件を表示</span>
                                  </summary>
                                  <div className="p-3 flex gap-3 overflow-x-auto bg-gray-100/50">
                                     {members.map((m: any, i: number) => (
                                       <div 
                                         key={m.id || i} 
                                         onClick={() => handleOpenModal(m)}
                                         className="bg-white border border-gray-300 hover:border-blue-400 rounded-sm p-2 flex gap-3 w-64 shrink-0 relative shadow-sm cursor-pointer transition group"
                                       >
                                          {m.status === 'archived' && <span className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded-bl-sm z-10">Archived</span>}
                                          {m.image1 ? (
                                              <img src={getDriveImageUrl(m.image1)} className="w-14 h-14 object-cover border border-gray-200 rounded-sm shrink-0" />
                                          ) : (
                                              <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center text-[8px] text-gray-400 shrink-0">No Image</div>
                                          )}
                                          <div className="flex flex-col text-[10px] min-w-0 justify-center">
                                             <span className="font-bold text-gray-900 truncate pr-8">{m.name}</span>
                                             <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-500 font-mono flex-wrap">
                                                 <span className="font-black text-gray-800">歩留: {m.ratio ? `${m.ratio}%` : '未設定'}</span>
                                                 <span>|</span>
                                                 <span className="truncate">{m.maker && m.maker !== '-' ? `【${m.maker}】` : ''}{formatSqDisplay(m.sq)}/{formatCoreDisplay(m.core)}</span>
                                                 {m.year && m.year !== '-' && <span>| {m.year}年</span>}
                                                 {m.conductor && m.conductor !== '-' && <span>| {m.conductor}</span>}
                                             </div>
                                             <span className="truncate text-gray-500 text-[9px] mt-0.5 group-hover:text-blue-600">{m.memo || 'メモなし'}</span>
                                          </div>
                                       </div>
                                     ))}
                                  </div>
                                </details>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    sortedData.map((item: any, idx: number) => (
                      <tr key={item.id || idx} className="hover:bg-gray-50 transition">
                        {activeTab === 'UNKNOWN' && (
                            <>
                              <td className="p-3 text-xs text-gray-500 font-mono">{formatTimeShort(item.createdAt)}</td>
                              <td className="p-3 font-bold text-gray-900 flex items-center gap-1"><Icons.Sparkles /> {item.name}</td>
                              <td className="p-3 font-mono font-black text-gray-900 text-lg">{item.ratio}%</td>
                              <td className="p-3 text-xs text-gray-700 leading-relaxed bg-gray-50 rounded-sm m-1 whitespace-normal border border-gray-200 shadow-inner">{item.reason}</td>
                            </>
                        )}
                        {activeTab === 'CASTINGS' && (
                            <>
                              <td className="p-3 font-bold text-gray-900">{item.name}</td>
                              <td className="p-3 text-gray-600">{item.type}</td>
                              <td className="p-3 font-mono font-black text-gray-900 text-lg">{item.ratio}%</td>
                            </>
                        )}
                        {activeTab === 'CLIENTS' && (
                            <>
                              <td className="p-3 font-bold text-gray-900">{item.name}</td>
                              <td className="p-3"><span className="bg-gray-200 px-2 py-1 rounded-sm text-xs font-bold text-gray-800 border border-gray-300">{item.rank}</span></td>
                              <td className="p-3 font-mono text-gray-600">{item.phone}</td>
                              <td className="p-3 font-mono text-gray-900 font-bold">{item.points} pt</td>
                            </>
                        )}
                        {activeTab === 'STAFF' && (
                            <>
                              <td className="p-3 font-bold text-gray-900">{item.name}</td>
                              <td className="p-3 text-gray-600">{item.role}</td>
                              <td className="p-3"><span className={`px-2 py-1 rounded-sm text-xs font-bold text-white shadow-sm ${item.status === 'ACTIVE' ? 'bg-gray-900' : 'bg-gray-400'}`}>{item.status}</span></td>
                            </>
                        )}
                        {activeTab !== 'UNKNOWN' && activeTab !== 'WIRES' && (
                            <td className="p-3 text-[10px] text-gray-400 font-mono align-top">
                                <div className="flex flex-col gap-1"><span title="登録日">➕ {formatTimeShort(item.createdAt)}</span><span title="更新日">🔄 {formatTimeShort(item.updatedAt)}</span></div>
                            </td>
                        )}

                        <td className="p-3 text-right align-top">
                          <div className="flex justify-end gap-2">
                            {activeTab === 'UNKNOWN' && (
                                <button onClick={() => handlePromoteToWire(item)} className="px-3 py-1.5 text-white bg-gray-900 hover:bg-black rounded-sm flex items-center gap-1 text-xs font-bold transition shadow-sm"><Icons.ArrowUp /> マスターへ</button>
                            )}
                            {activeTab === 'CLIENTS' && (
                                <button 
                                    onClick={() => {
                                        setEditingItem(item);
                                        handleEnrichClient(item);
                                    }} 
                                    disabled={isSubmitting}
                                    className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 border border-transparent hover:border-yellow-200 rounded-sm transition shadow-sm"
                                    title="AIで企業情報を深掘り"
                                >
                                    <Icons.Sparkles />
                                </button>
                            )}
                            <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 border border-transparent hover:border-gray-300 rounded-sm transition shadow-sm"><Icons.Edit /></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-[#D32F2F] hover:bg-red-50 border border-transparent hover:border-red-200 rounded-sm transition shadow-sm"><Icons.Trash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* ★ スマホ版レイアウト */}
              <div className="md:hidden divide-y divide-gray-200 bg-white pb-20">
                {activeTab === 'WIRES' ? (
                  groupedWires.map((group, idx) => {
                    const item = group.captain;
                    if (!item) return null;
                    const members = group.members;
                    const needsMerge = members.filter(m => m.status !== 'archived').length > 0;

                    return (
                      <div key={item.id || idx} className={`flex flex-col border-b border-gray-200 transition-colors ${String(item.showOnWeb) === 'false' ? 'opacity-60 bg-gray-100' : ''}`}>
                        <div className={`p-2.5 flex flex-col gap-1 ${needsMerge ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              {String(item.showOnWeb) === 'false' ? <span className="text-gray-400 shrink-0"><Icons.EyeOff /></span> : <span className="text-gray-900 shrink-0"><Icons.Globe /></span>}
                              {item.maker && item.maker !== '-' && <span className="text-[9px] bg-gray-100 border border-gray-200 px-1 rounded-sm text-gray-600 whitespace-nowrap shrink-0">{item.maker}</span>}
                              <span className="text-[13px] font-black text-gray-900 truncate leading-tight">{item.name}</span>
                              {item.material === '錫メッキ' && <span className="text-[8px] bg-[#D32F2F] text-white px-1 py-0.5 rounded-sm shrink-0">錫</span>}
                            </div>
                            <div className="flex items-baseline shrink-0 ml-2">
                              <span className="text-base font-black text-gray-900 font-mono tracking-tighter">{item.ratio ? `${item.ratio}%` : '未設定'}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-0.5">
                            <div className="text-[10px] text-gray-500 flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{formatSqDisplay(item.sq)}/{formatCoreDisplay(item.core)}</span>
                              {item.year && item.year !== '-' && <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{item.year}年</span>}
                              {item.conductor && item.conductor !== '-' && <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">{item.conductor}</span>}
                              {needsMerge && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[8px] font-bold">重複あり</span>}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1 border-r border-gray-200 pr-2">
                                {needsMerge && (
                                  <button onClick={() => handleAiMergeAnalyze(group.name, group)} className="p-1.5 text-blue-700 bg-blue-50 border border-blue-200 rounded-sm font-bold text-[9px] flex items-center gap-1"><Icons.Cpu /> マージ</button>
                                )}
                                <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-sm"><Icons.Edit /></button>
                                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#D32F2F] bg-red-50 border border-red-100 rounded-sm"><Icons.Trash /></button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* スマホ用 メンバーアコーディオン */}
                        {members.length > 0 && (
                          <details className="bg-gray-50 group border-t border-gray-100">
                            <summary className="text-[9px] text-gray-500 font-bold p-2 cursor-pointer hover:bg-gray-100 select-none flex items-center gap-2">
                              <span>▼ 過去の教師データ {members.length}件</span>
                            </summary>
                            <div className="p-2 grid grid-cols-1 gap-2 bg-gray-100/50">
                               {members.map((m: any, i: number) => (
                                 <div 
                                   key={m.id || i} 
                                   onClick={() => handleOpenModal(m)}
                                   className="bg-white border border-gray-300 hover:border-blue-400 rounded-sm p-2 flex gap-3 relative shadow-sm cursor-pointer transition group"
                                 >
                                    {m.status === 'archived' && <span className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[8px] font-bold px-1.5 py-0.5 rounded-bl-sm z-10">Archived</span>}
                                    {m.image1 ? (
                                        <img src={getDriveImageUrl(m.image1)} className="w-14 h-14 object-cover border border-gray-200 rounded-sm shrink-0" />
                                    ) : (
                                        <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center text-[8px] text-gray-400 shrink-0">No Image</div>
                                    )}
                                    <div className="flex flex-col text-[10px] min-w-0 justify-center">
                                       <span className="font-bold text-gray-900 truncate pr-8">{m.name}</span>
                                       <div className="flex items-center gap-1 mt-0.5 text-[9px] text-gray-500 font-mono flex-wrap">
                                           <span className="font-black text-gray-800">歩留: {m.ratio ? `${m.ratio}%` : '未設定'}</span>
                                           <span>|</span>
                                           <span className="truncate">{m.maker && m.maker !== '-' ? `【${m.maker}】` : ''}{formatSqDisplay(m.sq)}/{formatCoreDisplay(m.core)}</span>
                                           {m.year && m.year !== '-' && <span>| {m.year}年</span>}
                                       </div>
                                       <span className="truncate text-gray-500 text-[9px] mt-0.5 group-hover:text-blue-600">{m.memo || 'メモなし'}</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          </details>
                        )}
                      </div>
                    );
                  })
                ) : (
                  sortedData.map((item: any, idx: number) => (
                    <div key={item.id || idx} className={`p-2.5 flex flex-col gap-1 active:bg-gray-50 transition-colors`}>
                      
                      {activeTab === 'UNKNOWN' && (
                        <>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-1 font-bold text-gray-900 text-[13px] truncate"><span className="text-gray-900"><Icons.Sparkles /></span> {item.name}</div>
                            <span className="text-base font-black text-gray-900 font-mono">{item.ratio}%</span>
                          </div>
                          <p className="text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-100 line-clamp-2">{item.reason}</p>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-[9px] text-gray-400 font-mono">{formatTimeShort(item.createdAt)}</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => handlePromoteToWire(item)} className="px-2 py-1 text-white bg-gray-900 rounded-sm text-[10px] font-bold"><Icons.ArrowUp /> マスターへ</button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#D32F2F] bg-red-50 rounded-sm border border-red-100"><Icons.Trash /></button>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'CASTINGS' && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[13px] text-gray-900 truncate">{item.name}</span>
                            <span className="text-base font-black text-gray-900 font-mono">{item.ratio}%</span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{item.type}</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-sm"><Icons.Edit /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#D32F2F] bg-red-50 border border-red-100 rounded-sm"><Icons.Trash /></button>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'CLIENTS' && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[13px] text-gray-900 truncate">{item.name}</span>
                            <span className="text-[9px] font-bold bg-gray-100 border border-gray-200 text-gray-800 px-1.5 py-0.5 rounded-sm">{item.rank}</span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-mono">📞 {item.phone}</span>
                              <span className="text-[10px] text-gray-900 font-bold">✨ {item.points} pt</span>
                            </div>
                            
                            <div className="flex gap-1.5">
                              <button 
                                  onClick={() => {
                                      setEditingItem(item);
                                      handleEnrichClient(item);
                                  }} 
                                  disabled={isSubmitting}
                                  className="p-1.5 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-sm hover:bg-yellow-100 transition"
                                  title="AIで企業情報を深掘り"
                              >
                                  <Icons.Sparkles />
                              </button>
                              <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-sm"><Icons.Edit /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#D32F2F] bg-red-50 border border-red-100 rounded-sm"><Icons.Trash /></button>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === 'STAFF' && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[13px] text-gray-900">{item.name}</span>
                            <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded-sm ${item.status === 'ACTIVE' ? 'bg-gray-900' : 'bg-gray-400'}`}>{item.status}</span>
                          </div>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">{item.role}</span>
                            <div className="flex gap-1.5">
                              <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-600 bg-gray-50 border border-gray-200 rounded-sm"><Icons.Edit /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-[#D32F2F] bg-red-50 border border-red-100 rounded-sm"><Icons.Trash /></button>
                            </div>
                          </div>
                        </>
                      )}

                    </div>
                  ))
                )}
                {sortedData.length === 0 && (
                   <div className="p-10 text-center text-gray-400 font-bold text-xs">データがありません</div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* ★ AIマージ提案のモーダル */}
      {mergeProposal && (
        <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full p-6 border-t-4 border-blue-700">
            <h3 className="text-lg md:text-xl font-black mb-4 flex items-center gap-2 text-blue-900 border-b border-gray-100 pb-3">
              <Icons.Cpu /> AI統合提案: {mergeProposal.name}
            </h3>
            
            {mergeProposal.alert && (
              <div className="mb-4 bg-red-50 border border-red-200 p-3 text-red-800 text-sm font-bold flex items-start gap-2 shadow-sm rounded-sm">
                <Icons.AlertTriangle /> {mergeProposal.alert}
              </div>
            )}
            
            <div className="space-y-4 text-sm max-h-[60vh] overflow-y-auto">
              <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 shadow-inner">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">AIの分析・評価</p>
                <p className="font-bold text-gray-800 leading-relaxed">{mergeProposal.recommendation}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 border border-blue-200 rounded-sm">
                  <p className="text-[10px] text-blue-600 font-bold uppercase mb-2">統合後の歩留まり（採用案）</p>
                  <p className="font-black text-blue-900 text-2xl">{mergeProposal.mergedYieldRate}</p>
                </div>
                <div className="bg-blue-50/50 p-4 border border-blue-200 rounded-sm">
                  <p className="text-[10px] text-blue-600 font-bold uppercase mb-2">統合後の詳細説明（ハイブリッド版）</p>
                  <p className="font-bold text-gray-800 leading-relaxed">{mergeProposal.mergedDescription}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setMergeProposal(null)} disabled={isMerging} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-sm disabled:opacity-50">キャンセル</button>
              <button onClick={handleApplyMerge} disabled={isMerging} className="px-5 py-2 bg-blue-700 text-white text-sm font-bold rounded-sm shadow-md hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2">
                {isMerging ? <><Icons.Refresh /> マージ実行中...</> : '✨ 承認してゴールデンレコードを作成'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ★ AIアシスト登録モーダル */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl animate-in zoom-in-95 border-t-4 border-[#D32F2F] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 flex items-center gap-2">
                <Icons.Sparkles /> AI マスター登録アシスタント
              </h3>
              {aiStatus !== 'ANALYZING' && <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 hover:text-gray-900"><Icons.Close /></button>}
            </div>
            
            <div className="p-6 overflow-y-auto">
              {aiStatus === 'ANALYZING' ? (
                <div className="py-8 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="relative w-20 h-20 mb-8">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-gray-900 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-gray-900"><Icons.Sparkles /></div>
                    </div>
                    <div className="space-y-5 w-full max-w-xs font-bold text-sm">
                        <div className={`flex items-center gap-4 transition-all duration-500 ${aiProgressStep >= 1 ? 'text-gray-900 translate-x-0 opacity-100' : 'text-gray-300 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 2 ? '✅' : aiProgressStep === 1 ? '🔄' : '・'}</span>
                            <span>画像をサーバーへ送信中...</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ${aiProgressStep >= 2 ? 'text-gray-900 translate-x-0 opacity-100' : 'text-gray-300 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 3 ? '✅' : aiProgressStep === 2 ? '🔄' : '・'}</span>
                            <span>AIが画像を解析・特徴抽出中...</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ${aiProgressStep >= 3 ? 'text-gray-900 translate-x-0 opacity-100' : 'text-gray-300 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 4 ? '✅' : aiProgressStep === 3 ? '🔄' : '・'}</span>
                            <span>マスターデータと照合・推論中...</span>
                        </div>
                        <div className={`flex items-center gap-4 transition-all duration-500 delay-300 ${aiProgressStep >= 4 ? 'text-green-600 scale-110 translate-x-0 opacity-100' : 'text-gray-300 -translate-x-4 opacity-0'}`}>
                            <span className="w-6 text-center text-xl">{aiProgressStep >= 4 ? '✨' : '・'}</span>
                            <span>解析完了！結果を出力します</span>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="animate-in fade-in">
                    <p className="text-xs md:text-sm text-gray-600 mb-4 leading-relaxed font-bold bg-gray-50 p-3 rounded-sm border border-gray-200">
                        未知の線種をマスターに登録します。<br/>
                        最大4枚の画像をアップロードしてAIに解析させてください。<br/>
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData1 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData1}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData1('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">①断面</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-900 mb-1.5 text-center">① 断面 (必須)</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,1)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,1)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData2 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData2}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData2('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">②全体</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-500 mb-1.5 text-center">② 全体・被覆</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,2)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,2)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData3 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData3}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData3('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">③印字1</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-500 mb-1.5 text-center">③ 印字アップ1</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,3)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,3)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                        <div className="flex flex-col p-2 border-2 border-dashed border-gray-300 bg-gray-50 rounded-sm h-28">
                            {imgData4 ? ( <div className="relative w-full h-full"><img src={`data:image/jpeg;base64,${imgData4}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData4('')} className="absolute top-1 right-1 bg-[#D32F2F] text-white p-1 rounded-sm shadow-md"><Icons.Trash/></button><span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1 rounded">④印字2</span></div> ) : ( <><p className="text-[10px] font-bold text-gray-500 mb-1.5 text-center">④ 印字アップ2</p><div className="flex gap-1.5 h-full"><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.Camera /><span className="text-[8px] mt-1 font-bold">カメラ</span><input type="file" onChange={e=>handleAiImageUpload(e,4)} className="hidden" accept="image/*" capture="environment"/></label><label className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-sm flex flex-col items-center justify-center cursor-pointer transition text-gray-500 hover:text-gray-900 shadow-sm"><Icons.UploadCloud /><span className="text-[8px] mt-1 font-bold">フォルダ</span><input type="file" onChange={e=>handleAiImageUpload(e,4)} className="hidden" accept="image/*"/></label></div></> )}
                        </div>
                    </div>

                    <div className="mb-6 bg-gray-50 border border-gray-200 p-3 rounded-sm relative shadow-inner">
                        <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
                            <span>🗣️ AIへのヒント・補足（任意）</span>
                            <button onClick={toggleHintVoiceInput} className={`p-1.5 rounded-sm transition ${isListeningHint ? 'bg-[#D32F2F] text-white animate-pulse shadow-inner' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                                <Icons.Mic />
                            </button>
                        </label>
                        <textarea className="w-full bg-white border border-gray-300 rounded-sm text-sm text-gray-900 p-3 outline-none focus:border-gray-900 min-h-[60px] shadow-sm" placeholder="例: 中身は細線の束、かなり重い、雑線は入っていない等..." value={aiHint} onChange={e => setAiHint(e.target.value)} />
                    </div>

                    <button onClick={runAiExtraction} disabled={!imgData1 && !aiHint} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 md:py-4 rounded-sm flex justify-center items-center gap-2 disabled:bg-gray-400 transition shadow-md text-base md:text-lg">
                        <Icons.Sparkles />解析してデータを埋める
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ★ 編集・新規登録モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-2 md:p-0">
          <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl animate-in zoom-in-95 duration-200 border-t-4 border-gray-900 overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-black text-gray-900 text-base md:text-lg flex items-center gap-2">
                  {editingItem?.id ? <Icons.Edit /> : <Icons.Plus />}
                  {editingItem?.id ? 'データ編集' : '新規マスター登録'}
              </h3>
              <div className="flex gap-2">
                  {/* PC版：AIディープリサーチボタン */}
                  {activeTab === 'CLIENTS' && editingItem?.name && (
                      <button 
                          onClick={() => handleEnrichClient()}
                          disabled={isSubmitting}
                          className="bg-yellow-50 text-yellow-800 border border-yellow-300 px-3 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1 hover:bg-yellow-100 transition disabled:opacity-50"
                      >
                          <Icons.Sparkles /> AIディープリサーチで補完
                      </button>
                  )}
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 bg-white border border-gray-200 p-1.5 rounded-sm shadow-sm"><Icons.Close /></button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto space-y-4 bg-white flex-1">
                
                {activeTab === 'WIRES' && (
                    <div className="bg-gray-50 border border-gray-200 p-3 md:p-4 rounded-sm flex justify-between items-center shadow-inner mb-2">
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm md:text-base flex items-center gap-2">
                                <Icons.Globe /> LPの価格表に表示する
                            </h4>
                            <p className="text-[9px] md:text-[10px] text-gray-500 mt-1 font-bold">OFFにすると社内システム専用になります。</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={String(editingItem.showOnWeb) !== 'false'} onChange={(e) => setEditingItem({...editingItem, showOnWeb: e.target.checked})} />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                        </label>
                    </div>
                )}

                {activeTab === 'WIRES' && (
                    <div className="bg-gray-50 p-3 md:p-4 border border-gray-200 rounded-sm">
                        <label className="block text-[10px] md:text-xs font-bold text-gray-600 mb-2 uppercase tracking-widest">マスター画像 (全5枠)</label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                            <ImageSlot title="① 断面" imageKey="image1" colIdx={11} pendingKey="_pendingImageData1" />
                            <ImageSlot title="② 全体" imageKey="image2" colIdx={12} pendingKey="_pendingImageData2" />
                            <ImageSlot title="④ 剥線" imageKey="image3" colIdx={13} pendingKey="_pendingImageData3" />
                            <ImageSlot title="③ 印字UP1" imageKey="image4" colIdx={14} pendingKey="_pendingImageData4" />
                            <ImageSlot title="③ 印字UP2" imageKey="image5" colIdx={15} pendingKey="_pendingImageData5" />
                        </div>
                    </div>
                )}

                {activeTab === 'WIRES' && (editingItem._pendingImageData1 || editingItem._pendingImageData4) && (
                    <div className="bg-blue-50 border border-blue-200 p-2 md:p-3 rounded-sm text-[10px] md:text-xs text-blue-800 font-bold flex flex-col gap-1 shadow-sm">
                        <div className="flex items-center gap-2"><Icons.Sparkles /> 画像からAIが推論結果を自動入力しました。</div>
                        <div className="text-gray-600 ml-6 font-normal">※ 下の「マスター登録」を押すと、アップロードした画像も同時に保存されます。</div>
                    </div>
                )}

                {activeTab === 'WIRES' && (
                    <>
                        <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                            <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">メーカー</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.maker || ''} onChange={e => setEditingItem({...editingItem, maker: e.target.value})} /></div>
                            <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">品名</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-black text-base md:text-lg shadow-sm" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">製造年</label><input type="text" placeholder="例: 2024" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 shadow-sm text-sm" value={editingItem.year || ''} onChange={e => setEditingItem({...editingItem, year: toHalfWidthNumber(e.target.value).replace(/\./g, '')})} /></div>
                            <div>
                                <label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 flex items-center justify-between uppercase tracking-widest"><span>サイズ</span><button onClick={handleCaliperInput} className="text-gray-700 hover:text-gray-900 flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded-sm border border-gray-300 transition shadow-sm"><Icons.Ruler /> <span className="text-[8px] md:text-[9px] font-bold">ノギス</span></button></label>
                                <div className="flex rounded-sm shadow-sm relative"><input type="number" step="0.01" className="w-full bg-white border-y border-l border-gray-300 p-2.5 md:p-3 rounded-l-sm outline-none focus:border-gray-900 font-mono text-right font-bold text-sm" value={editingItem._sqValue || ''} onChange={e => setEditingItem({...editingItem, _sqValue: toHalfWidthNumber(e.target.value)})} placeholder="2.0" /><select className="border border-gray-300 bg-gray-100 px-1 md:px-2 rounded-r-sm text-[10px] md:text-xs font-bold text-gray-700 outline-none focus:border-gray-900" value={editingItem._sqUnit || 'sq'} onChange={e => setEditingItem({...editingItem, _sqUnit: e.target.value})}><option value="sq">sq</option><option value="mm">mm</option></select></div>
                            </div>
                            <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">芯数</label><div className="relative"><input type="number" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono pr-8 text-right font-bold shadow-sm text-sm" value={editingItem._coreValue || ''} onChange={e => setEditingItem({...editingItem, _coreValue: toHalfWidthNumber(e.target.value).replace(/\./g, '')})} placeholder="3" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold pointer-events-none">C</span></div></div>
                            <div>
                                <label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">導体構成 (構造)</label><input type="text" placeholder="単線/7本より線等" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 shadow-sm text-xs md:text-sm font-bold" value={editingItem.conductor || ''} onChange={e => setEditingItem({...editingItem, conductor: e.target.value})} />
                                <div className="flex gap-1 mt-1.5"><button onClick={() => setEditingItem({...editingItem, conductor: '単線'})} className="flex-1 bg-gray-100 hover:bg-gray-200 text-[9px] py-1.5 rounded-sm text-gray-600 font-bold border border-gray-200 transition">単線</button><button onClick={() => setEditingItem({...editingItem, conductor: 'より線'})} className="flex-1 bg-gray-100 hover:bg-gray-200 text-[9px] py-1.5 rounded-sm text-gray-600 font-bold border border-gray-200 transition">より線</button></div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-100 p-3 md:p-6 rounded-sm border border-gray-300 mt-4 md:mt-6 relative shadow-inner">
                            <span className="absolute top-0 right-0 bg-gray-900 text-white text-[8px] md:text-[9px] font-bold tracking-widest px-2 py-1 rounded-bl-sm">HUMAN REQUIRED</span>
                            <label className="block text-xs md:text-sm font-black text-gray-900 mb-3 border-b border-gray-300 pb-2">⚖️ サンプル実測 (人間による確定)</label>
                            
                            <div className="mb-4 bg-white p-3 md:p-4 rounded-sm border border-gray-200 shadow-sm">
                                <label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">成分要素 (材質)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setEditingItem({...editingItem, material: '純銅'})} className={`py-1.5 md:py-2 rounded-sm text-xs md:text-sm font-bold border transition ${editingItem.material === '純銅' ? 'bg-orange-50 border-orange-400 text-orange-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>純銅</button>
                                    <button onClick={() => setEditingItem({...editingItem, material: '錫メッキ'})} className={`py-1.5 md:py-2 rounded-sm text-xs md:text-sm font-bold border transition ${editingItem.material === '錫メッキ' ? 'bg-red-50 border-[#D32F2F] text-[#D32F2F] animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>⚠️錫メッキ</button>
                                    <button onClick={() => setEditingItem({...editingItem, material: 'アルミ'})} className={`py-1.5 md:py-2 rounded-sm text-xs md:text-sm font-bold border transition ${editingItem.material === 'アルミ' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>アルミ</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                                <div className="w-full"><label className="block text-[9px] md:text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest">全体重量(g)</label><input type="number" step="0.001" className="w-full border border-gray-300 shadow-sm p-2.5 md:p-3 rounded-sm font-mono text-base md:text-xl outline-none focus:border-gray-900 text-right bg-white font-bold tabular-nums" value={sampleTotal} onChange={e => handleSampleTotalChange(e.target.value)} placeholder="0.000" /></div>
                                <div className="w-full"><label className="block text-[9px] md:text-[10px] font-bold text-[#D32F2F] mb-1 uppercase tracking-widest">純銅重量(g)</label><input type="number" step="0.001" className="w-full border border-gray-300 shadow-sm p-2.5 md:p-3 rounded-sm font-mono text-base md:text-xl outline-none focus:border-[#D32F2F] text-right bg-white font-bold tabular-nums" value={sampleCopper} onChange={e => handleSampleCopperChange(e.target.value)} placeholder="0.000" /></div>
                                
                                <div className="w-full">
                                    <label className="block text-[9px] md:text-[10px] font-bold text-gray-600 mb-1 uppercase tracking-widest flex justify-between items-end">
                                        <span>被覆重量(g)</span>
                                        <span className="text-[8px] text-gray-400 font-normal normal-case">※省略時は自動算出</span>
                                    </label>
                                    <input 
                                        type="number" step="0.001" 
                                        className="w-full border border-gray-300 shadow-sm p-2.5 md:p-3 rounded-sm font-mono text-base md:text-xl outline-none focus:border-gray-900 text-right bg-white font-bold tabular-nums placeholder:text-gray-300 placeholder:text-xs" 
                                        value={sampleCover} 
                                        onChange={e => handleSampleCoverChange(e.target.value)} 
                                        placeholder={sampleTotal && sampleCopper && !sampleCover ? `(自動) ${getAutoCoverWeight()}` : "0.000"} 
                                    />
                                </div>
                                
                                <div className="w-full flex flex-col gap-1.5 md:gap-2">
                                    <div className="bg-white border border-gray-300 shadow-sm p-1.5 md:p-2 rounded-sm flex justify-between items-center"><span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest">ダスト</span><span className="font-mono text-sm md:text-base font-bold text-gray-800 tabular-nums">{getJuteWeight()}g</span></div>
                                    <div className="bg-gray-900 border border-black shadow-inner p-1.5 md:p-2 rounded-sm flex justify-between items-center relative"><span className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest">歩留まり</span>{editingItem.aiEstimatedRatio && !sampleTotal && <span className="absolute -top-2 -right-2 text-[8px] bg-gray-500 text-white px-1.5 py-0.5 rounded shadow animate-pulse">AI</span>}<span className="font-mono text-lg md:text-xl font-black text-white tabular-nums">
                                      <input type="number" step="0.01" className="w-20 bg-transparent text-right outline-none" value={editingItem.ratio || ''} onChange={e => setEditingItem({...editingItem, ratio: toHalfWidthNumber(e.target.value)})} placeholder="---" />%
                                    </span></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4"><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">メモ / 特記事項</label><textarea className="w-full bg-white border border-gray-300 p-3 rounded-sm h-24 text-xs md:text-sm outline-none focus:border-gray-900 leading-relaxed shadow-sm whitespace-pre-wrap" value={editingItem.memo || editingItem.reason || ''} onChange={e => setEditingItem({...editingItem, memo: e.target.value, reason: e.target.value})} /></div>
                    </>
                )}

                {activeTab === 'CASTINGS' && (
                  <>
                    <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">品目名</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">種別</label><select className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.type || 'BRASS'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}><option value="BRASS">真鍮 (Brass)</option><option value="ZINC">亜鉛 (Zinc)</option><option value="LEAD">鉛 (Lead)</option></select></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">歩留まり (%)</label><input type="number" step="0.1" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm font-black text-base md:text-lg text-gray-900 outline-none focus:border-gray-900 shadow-sm text-right tabular-nums" value={editingItem.ratio || ''} onChange={e => setEditingItem({...editingItem, ratio: toHalfWidthNumber(e.target.value)})} /></div>
                    </div>
                  </>
                )}

                {activeTab === 'CLIENTS' && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">業者名</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">ランク</label><select className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.rank || 'NORMAL'} onChange={e => setEditingItem({...editingItem, rank: e.target.value})}><option value="NORMAL">一般 (NORMAL)</option><option value="BRONZE">ブロンズ (BRONZE)</option><option value="SILVER">シルバー (SILVER)</option><option value="GOLD">ゴールド (GOLD)</option><option value="VIP">VIP</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">電話番号</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono shadow-sm text-sm" value={editingItem.phone || ''} onChange={e => setEditingItem({...editingItem, phone: toHalfWidthNumber(e.target.value)})} /></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">保有ポイント</label><input type="number" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm font-black text-base md:text-lg text-gray-900 outline-none focus:border-gray-900 shadow-sm text-right tabular-nums" value={editingItem.points || 0} onChange={e => setEditingItem({...editingItem, points: toHalfWidthNumber(e.target.value)})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">ログインID</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono shadow-sm text-sm" value={editingItem.loginId || ''} onChange={e => setEditingItem({...editingItem, loginId: e.target.value})} /></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">パスワード</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono shadow-sm text-sm" value={editingItem.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">業種</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 shadow-sm text-sm" value={editingItem.industry || ''} onChange={e => setEditingItem({...editingItem, industry: e.target.value})} /></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">所在地</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 shadow-sm text-sm" value={editingItem.address || ''} onChange={e => setEditingItem({...editingItem, address: e.target.value})} /></div>
                    </div>
                    <div>
                        <label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest flex justify-between items-center">
                            <span>顧客メモ・AIプロファイル</span>
                        </label>
                        <textarea className="w-full bg-white border border-gray-300 p-3 rounded-sm min-h-[120px] text-xs md:text-sm outline-none focus:border-gray-900 leading-relaxed shadow-sm whitespace-pre-wrap" value={editingItem.memo || ''} onChange={e => setEditingItem({...editingItem, memo: e.target.value})} />
                    </div>
                  </div>
                )}

                {activeTab === 'STAFF' && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">スタッフ名</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">ステータス</label><select className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.status || 'ACTIVE'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}><option value="ACTIVE">有効 (ACTIVE)</option><option value="INACTIVE">停止 (INACTIVE)</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">権限 (Role)</label><select className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-bold shadow-sm text-sm" value={editingItem.role || 'FRONT'} onChange={e => setEditingItem({...editingItem, role: e.target.value})}><option value="FRONT">受付 (FRONT)</option><option value="INSPECTION">検収 (INSPECTION)</option><option value="PLANT">工場 (PLANT)</option><option value="MANAGER">工場長 (MANAGER)</option><option value="ALL">管理者 (ALL)</option></select></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">時給/単価</label><input type="number" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono shadow-sm text-right tabular-nums text-sm" value={editingItem.rate || 0} onChange={e => setEditingItem({...editingItem, rate: toHalfWidthNumber(e.target.value)})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">ログインID</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono shadow-sm text-sm" value={editingItem.loginId || ''} onChange={e => setEditingItem({...editingItem, loginId: e.target.value})} /></div>
                        <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">パスワード</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-gray-900 font-mono shadow-sm text-sm" value={editingItem.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /></div>
                    </div>
                  </div>
                )}
            </div>
            
            <div className="p-3 md:p-4 border-t border-gray-200 flex justify-end gap-2 md:gap-3 bg-gray-50 shrink-0">
              <button onClick={handleCloseModal} className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm text-gray-600 font-bold hover:bg-gray-200 rounded-sm transition">キャンセル</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-5 py-2 md:px-8 md:py-3 bg-[#D32F2F] text-white font-bold rounded-sm hover:bg-red-800 transition disabled:opacity-50 flex items-center gap-1 md:gap-2 shadow-md active:scale-95 text-sm md:text-lg">
                {isSubmitting ? '保存中...' : 'マスター登録'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
