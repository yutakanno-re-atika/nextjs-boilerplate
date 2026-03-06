// @ts-nocheck
import React, { useState, useRef, useEffect, useMemo } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Image: () => <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Filter: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Camera: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  UploadCloud: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  SortAsc: () => <svg className="w-3 h-3 inline-block ml-1 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>,
  SortDesc: () => <svg className="w-3 h-3 inline-block ml-1 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>,
  SortNone: () => <svg className="w-3 h-3 inline-block ml-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Play: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Ruler: () => <svg className="w-4 h-4 inline-block text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-4-8v8m8-8v8M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z" /></svg>,
  AlertTriangle: () => <svg className="w-4 h-4 inline-block text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Mic: () => <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
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
  const [activeTab, setActiveTab] = useState<'WIRES' | 'UNKNOWN' | 'CASTINGS' | 'CLIENTS' | 'STAFF' | 'SETTINGS'>('WIRES');
  
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
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

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
  
  const [autoMarketSync, setAutoMarketSync] = useState(true);
  const [autoLeadGen, setAutoLeadGen] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isRunningBatch, setIsRunningBatch] = useState<'NONE' | 'MARKET' | 'LEAD' | 'BACKUP'>('NONE');

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
            ratio: pendingData.ratio || '', aiEstimatedRatio: pendingData.ratio || '',
            memo: `【POSからのAIアシスト引継ぎ】\nAI推論根拠: ${pendingData.reason || ''}\n※実測を行って歩留まりを上書きしてください。`,
            _pendingImageData1: pendingData.image1 || null, _pendingImageData2: pendingData.image2 || null,
            _aiInitialState: { maker: '', name: pendingData.name || '', conductor: pendingData.conductor || '', material: pendingData.material || '純銅', ratio: pendingData.ratio || '' }
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
    setEditingItem({ ...item, _sqValue: sqData.val, _sqUnit: sqData.unit, _coreValue: coreData, material: item?.material || '純銅' });
    setSampleTotal(item?.sampleTotal || ''); setSampleCopper(item?.sampleCopper || ''); setSampleCover(item?.sampleCover || ''); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null); setSampleTotal(''); setSampleCopper(''); setSampleCover(''); setIsModalOpen(false);
  };

  const calculateRatio = (total: number | '', copper: number | '') => {
      if (total && copper && Number(total) > 0) return ((Number(copper) / Number(total)) * 100).toFixed(2);
      return '';
  };

  const handleSampleTotalChange = (val: string) => { const num = val ? Number(val) : ''; setSampleTotal(num); setEditingItem({...editingItem, sampleTotal: num, ratio: calculateRatio(num, sampleCopper)}); };
  const handleSampleCopperChange = (val: string) => { const num = val ? Number(val) : ''; setSampleCopper(num); setEditingItem({...editingItem, sampleCopper: num, ratio: calculateRatio(sampleTotal, num)}); };
  const handleSampleCoverChange = (val: string) => { const num = val ? Number(val) : ''; setSampleCover(num); setEditingItem({...editingItem, sampleCover: num}); };

  const getJuteWeight = () => {
      if (sampleTotal && (sampleCopper || sampleCover)) {
          const jute = (Number(sampleTotal) || 0) - (Number(sampleCopper) || 0) - (Number(sampleCover) || 0);
          return jute > 0 ? jute.toFixed(3) : '0.000';
      }
      return '---';
  };

  const handlePromoteToWire = (unknownItem: any) => {
      setActiveTab('WIRES');
      setEditingItem({
          name: unknownItem.name.replace(/【.*?】/g, ''), maker: '', year: '', _sqValue: '', _sqUnit: 'sq', _coreValue: '', 
          conductor: '', material: unknownItem.material || '純銅', ratio: '', image1: unknownItem.image1, image2: unknownItem.image2, 
          memo: `【AI推論からの昇格】\n推論日時: ${unknownItem.createdAt}\nAIの根拠: ${unknownItem.reason}`
      });
      setIsModalOpen(true);
  };

  const handleCaliperInput = () => {
      const val = window.prompt("📐 ノギスで実測した「直径(mm)」を入力してください\n例: 2.0 または 3.5");
      if (!val) return;
      const d = parseFloat(val);
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

    if (finalItem._pendingImageData1) {
        try {
            const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPLOAD_IMAGE', data: finalItem._pendingImageData1, mimeType: 'image/jpeg', fileName: `master_sec_${Date.now()}.jpg` }) });
            const r = await res.json(); if (r.status === 'success') finalItem.image1 = r.url;
        } catch(e) {}
    }
    if (finalItem._pendingImageData2) {
        try {
            const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPLOAD_IMAGE', data: finalItem._pendingImageData2, mimeType: 'image/jpeg', fileName: `master_prt_${Date.now()}.jpg` }) });
            const r = await res.json(); if (r.status === 'success') finalItem.image2 = r.url;
        } catch(e) {}
    }
    if (finalItem._pendingImageData3) {
        try {
            const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPLOAD_IMAGE', data: finalItem._pendingImageData3, mimeType: 'image/jpeg', fileName: `master_nak_${Date.now()}.jpg` }) });
            const r = await res.json(); if (r.status === 'success') finalItem.image3 = r.url;
        } catch(e) {}
    }

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
        const updates: any = { 1: item.maker, 2: item.name, 3: item.year, 4: item.sq, 5: item.sampleTotal, 6: item.sampleCopper, 7: item.core, 8: item.conductor, 9: item.ratio, 10: item.memo, 16: item.material, 17: item.sampleCover };
        if (item.image1 !== undefined) updates[11] = item.image1;
        if (item.image2 !== undefined) updates[12] = item.image2;
        if (item.image3 !== undefined) updates[13] = item.image3;
        return updates;
    }
    if (tab === 'UNKNOWN') return { 1: item.name, 2: item.ratio, 3: item.reason, 9: item.material }; 
    if (tab === 'CASTINGS') return { 1: item.name, 2: item.type, 4: item.ratio };
    if (tab === 'CLIENTS') return { 1: item.name, 2: item.rank, 4: item.phone, 5: item.loginId, 6: item.password, 7: item.points, 8: item.memo, 9: item.address, 10: item.industry };
    if (tab === 'STAFF') return { 1: item.name, 2: item.role, 3: item.rate, 4: item.status, 5: item.loginId, 6: item.password };
    return {};
  };

  // ★ メモリ不足対応版 compressImage
  const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          if (!file) return reject(new Error("ファイルがありません"));
          const reader = new FileReader(); 
          reader.onload = (event) => {
              const img = new Image(); 
              img.onload = () => {
                  try {
                      const canvas = document.createElement('canvas');
                      const MAX = 1024; // メモリ不足対策
                      let w = img.width; let h = img.height;
                      if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
                      canvas.width = w; canvas.height = h;
                      const ctx = canvas.getContext('2d'); 
                      if (!ctx) throw new Error("Canvas context error");
                      ctx.drawImage(img, 0, 0, w, h);
                      resolve(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]); // 画質を少し落として軽量化
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

  // 既存のマスターに対する画像アップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, recordId: string, colIndex: number, sheetName: string) => {
      const file = e.target.files?.[0]; if (!file) return;
      setUploadingImageId(`${recordId}-${colIndex}`);
      try {
          const base64Data = await compressImage(file);
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'UPLOAD_IMAGE', sheetName: sheetName, recordId: recordId, colIndex: colIndex, data: base64Data, mimeType: 'image/jpeg', fileName: `img_${recordId}_${Date.now()}.jpg` }) });
          const result = await res.json();
          if (result.status === 'success') { window.location.reload(); } else { alert('エラー: ' + result.message); }
      } catch (err: any) { alert(err.message || '通信エラーが発生しました'); }
      setUploadingImageId(null); e.target.value = '';
  };

  // ★ AIアシスト用の画像アップロード（4枚枠対応）
  const handleAiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2 | 3 | 4) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { 
        const compressed = await compressImage(file); 
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
    setAiStatus('ANALYZING'); setAiProgressStep(1); 
    const progressInterval = setInterval(() => { setAiProgressStep(prev => { if (prev === 1) return 2; if (prev === 2) return 3; return 3; }); }, 2000);
    
    try {
      // ★ imageData3, 4 も送る
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'VISION_AI_REGISTER', imageData: imgData1, imageData2: imgData2, imageData3: imgData3, imageData4: imgData4, hint: aiHint }) });
      const result = await res.json();
      
      clearInterval(progressInterval); setAiProgressStep(4);

      setTimeout(() => {
          if (result.status === 'success') {
              if (isVoiceOutputEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const makerText = result.data.maker && result.data.maker !== '-' ? result.data.maker : 'メーカー不明';
                  const nameText = result.data.name && result.data.name !== '-' ? result.data.name : '品名不明';
                  const utterance = new SpeechSynthesisUtterance(`抽出完了。メーカー、${makerText}。品名、${nameText}。`);
                  utterance.lang = 'ja-JP'; utterance.rate = 1.4; window.speechSynthesis.speak(utterance);
              }

              const cleanSize = String(result.data.size || '').replace(/[^\d.]/g, '');
              const cleanCore = String(result.data.core || '').replace(/[^\d]/g, '');

              setEditingItem({
                  maker: result.data.maker === '-' ? '' : result.data.maker, name: result.data.name === '-' ? '' : result.data.name, year: result.data.year === '-' ? '' : result.data.year,
                  _sqValue: cleanSize === '-' ? '' : cleanSize, _sqUnit: 'sq', _coreValue: cleanCore === '-' ? '' : cleanCore,
                  conductor: result.data.conductor === '-' ? '' : result.data.conductor, material: result.data.material === '-' ? '純銅' : result.data.material,
                  ratio: result.data.estimatedRatio || '', aiEstimatedRatio: result.data.estimatedRatio || '',
                  memo: `【AIアシスト抽出】\nAI推論根拠: ${result.data.reason}\n※実測を行って歩留まりを上書きしてください。`,
                  _pendingImageData1: imgData1, _pendingImageData2: imgData2, _pendingImageData3: imgData3, _pendingImageData4: imgData4,
                  _aiInitialState: { maker: result.data.maker === '-' ? '' : result.data.maker, name: result.data.name === '-' ? '' : result.data.name, conductor: result.data.conductor === '-' ? '' : result.data.conductor, material: result.data.material === '-' ? '純銅' : result.data.material, ratio: result.data.estimatedRatio || '' }
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

  const handleRunBatchSettings = async (type: 'MARKET' | 'LEAD' | 'BACKUP') => {
      const typeLabel = type === 'MARKET' ? '市況データ（建値）' : type === 'LEAD' ? '営業リード' : 'データベースのバックアップ';
      if (!confirm(`${typeLabel} の処理を今すぐ実行します。よろしいですか？`)) return;
      setIsRunningBatch(type);
      try {
          const action = type === 'MARKET' ? 'RUN_MARKET_SYNC' : type === 'LEAD' ? 'RUN_LEAD_GEN' : 'CREATE_BACKUP';
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
          const result = await res.json();
          if (result.status === 'success') {
              alert('✅ ' + result.message);
              if (result.url) window.open(result.url, '_blank'); 
          } else { alert('エラーが発生しました: ' + result.message); }
      } catch (e) { alert('通信エラーが発生しました。'); }
      setIsRunningBatch('NONE');
  };
  const handleSaveSettings = () => {}; // ダミー

  const renderTable = () => {
    if (activeTab === 'SETTINGS') {
        return (
            <div className="p-6 md:p-10 bg-white h-full overflow-y-auto animate-in fade-in">
                <div className="max-w-3xl mx-auto space-y-10">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                            <Icons.Settings /> システム自動実行バッチの制御
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">
                            GAS（Google Apps Script）で1時間おきに実行されているバックグラウンド処理の稼働状況を制御します。
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                        <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></span>
                                        データベースのバックアップ
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">現在の全マスターデータをGoogleドライブに別ファイルとしてコピー保存します。</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-end">
                                <button onClick={() => handleRunBatchSettings('BACKUP')} disabled={isRunningBatch !== 'NONE'} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition disabled:opacity-50">
                                    {isRunningBatch === 'BACKUP' ? <><Icons.Refresh /> 作成中...</> : <><Icons.Save /> 今すぐバックアップ作成</>}
                                </button>
                            </div>
                        </div>
                        {/* 市況データなどは省略せずそのまま表示 */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                        <span className={`w-3 h-3 rounded-full ${autoMarketSync ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                        市況データ自動スクレイピング
                                    </h4>
                                    <p className="text-xs text-gray-500 mt-1">国内メーカー建値を自動取得し、価格を更新します。</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={autoMarketSync} onChange={(e) => setAutoMarketSync(e.target.checked)} />
                                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <div className="h-full overflow-y-auto relative">
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap md:whitespace-normal">
          <thead className="bg-gray-100 text-gray-500 uppercase tracking-wider text-xs sticky top-0 z-20 shadow-sm">
            <tr>
              {activeTab === 'WIRES' && (
                  <>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('maker')}>メーカー <SortIcon columnKey="maker" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('name')}>品名 <SortIcon columnKey="name" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('year')}>製造年 <SortIcon columnKey="year" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('sq')}>SQ/芯数 <SortIcon columnKey="sq" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('ratio')}>歩留まり <SortIcon columnKey="ratio" /></th>
                      <th className="p-3 text-center">画像 (1:断面 2:印字 3:剥線)</th>
                  </>
              )}
              {activeTab === 'UNKNOWN' && (
                  <>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('createdAt')}>登録日時 <SortIcon columnKey="createdAt" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('name')}>AI推定品名 <SortIcon columnKey="name" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('ratio')}>歩留まり <SortIcon columnKey="ratio" /></th>
                      <th className="p-3 w-1/3">推論の根拠</th>
                  </>
              )}
              {activeTab === 'CASTINGS' && (
                  <>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('name')}>品目名 <SortIcon columnKey="name" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('type')}>種別 <SortIcon columnKey="type" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('ratio')}>歩留まり <SortIcon columnKey="ratio" /></th>
                  </>
              )}
              {activeTab === 'CLIENTS' && (
                  <>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('name')}>業者名 <SortIcon columnKey="name" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('rank')}>ランク <SortIcon columnKey="rank" /></th>
                      <th className="p-3">電話番号</th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('points')}>ポイント <SortIcon columnKey="points" /></th>
                  </>
              )}
              {activeTab === 'STAFF' && (
                  <>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('name')}>スタッフ名 <SortIcon columnKey="name" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('role')}>権限 <SortIcon columnKey="role" /></th>
                      <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('status')}>ステータス <SortIcon columnKey="status" /></th>
                  </>
              )}
              {activeTab !== 'UNKNOWN' && (
                <th className="p-3 cursor-pointer hover:bg-gray-200 transition select-none" onClick={() => handleSort('updatedAt')}>登録/更新 <SortIcon columnKey="updatedAt" /></th>
              )}
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {sortedData.map((item: any, idx: number) => (
              <tr key={item.id || idx} className="hover:bg-gray-50 transition">
                {activeTab === 'WIRES' && (
                  <>
                    <td className="p-3 font-bold text-gray-700">{item.maker || '-'}</td>
                    <td className="p-3 font-bold text-gray-900">
                        {item.name}
                        {item.material === '錫メッキ' && <span className="ml-2 inline-flex items-center gap-0.5 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm"><Icons.AlertTriangle /> 錫</span>}
                        {item.material === 'アルミ' && <span className="ml-2 inline-flex items-center gap-0.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap shadow-sm">アルミ</span>}
                    </td>
                    <td className="p-3 text-gray-600">{item.year || '-'}</td>
                    <td className="p-3 text-gray-600 font-mono text-xs">{formatSqDisplay(item.sq)} / {formatCoreDisplay(item.core)}</td>
                    <td className="p-3 font-mono font-bold text-blue-600 text-base">{item.ratio}%</td>
                    <td className="p-3">
                        <div className="flex gap-2 justify-center">
                            {[11, 12, 13].map(colIdx => {
                                const hasImage = !!item[`image${colIdx-10}`];
                                return (
                                    <div key={colIdx} className="flex flex-col gap-1 items-center w-14">
                                        <div className="relative w-full h-12 border border-gray-300 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center group shadow-sm">
                                            {hasImage ? (
                                                <a href={getDriveViewUrl(item[`image${colIdx-10}`])} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                                                    <img src={getDriveImageUrl(item[`image${colIdx-10}`])} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform cursor-zoom-in" />
                                                </a>
                                            ) : ( <Icons.Image /> )}
                                            {uploadingImageId === `${item.id}-${colIdx}` && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Icons.Refresh /></div>}
                                        </div>
                                        <div className="flex gap-1 w-full">
                                            {/* ★ 修正ポイント：handleAiImageUploadではなく、既存のhandleImageUploadを呼ぶ */}
                                            <label className={`flex-1 flex justify-center items-center py-1 rounded-sm cursor-pointer transition ${hasImage ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'}`} title="カメラで撮影"><Icons.Camera /><input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleImageUpload(e, item.id, colIdx, 'Products_Wire')} /></label>
                                            <label className={`flex-1 flex justify-center items-center py-1 rounded-sm cursor-pointer transition ${hasImage ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'}`} title="フォルダから選択"><Icons.UploadCloud /><input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, item.id, colIdx, 'Products_Wire')} /></label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </td>
                  </>
                )}

                {activeTab === 'UNKNOWN' && (
                  <>
                    <td className="p-3 text-xs text-gray-500 font-mono">{formatTimeShort(item.createdAt)}</td>
                    <td className="p-3 font-bold text-orange-700 flex items-center gap-1"><Icons.Sparkles /> {item.name}</td>
                    <td className="p-3 font-mono font-black text-orange-600 text-lg">{item.ratio}%</td>
                    <td className="p-3 text-xs text-gray-600 leading-relaxed bg-orange-50/50 rounded-sm m-1 whitespace-normal">{item.reason}</td>
                  </>
                )}

                {activeTab === 'CASTINGS' && (
                  <>
                    <td className="p-3 font-bold text-gray-900">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.type}</td>
                    <td className="p-3 font-mono font-bold text-blue-600 text-base">{item.ratio}%</td>
                  </>
                )}
                
                {activeTab === 'CLIENTS' && (
                  <>
                    <td className="p-3 font-bold text-gray-900">{item.name}</td>
                    <td className="p-3"><span className="bg-gray-200 px-2 py-1 rounded-sm text-xs font-bold">{item.rank}</span></td>
                    <td className="p-3 font-mono">{item.phone}</td>
                    <td className="p-3 font-mono text-orange-600 font-bold">{item.points} pt</td>
                  </>
                )}
                
                {activeTab === 'STAFF' && (
                  <>
                    <td className="p-3 font-bold text-gray-900">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.role}</td>
                    <td className="p-3"><span className={`px-2 py-1 rounded-sm text-xs font-bold text-white ${item.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}>{item.status}</span></td>
                  </>
                )}

                {activeTab !== 'UNKNOWN' && (
                    <td className="p-3 text-[10px] text-gray-400 font-mono align-top">
                        <div className="flex flex-col gap-1"><span title="登録日">➕ {formatTimeShort(item.createdAt)}</span><span title="更新日">🔄 {formatTimeShort(item.updatedAt)}</span></div>
                    </td>
                )}

                <td className="p-3 text-right align-top">
                  <div className="flex justify-end gap-2">
                    {activeTab === 'UNKNOWN' && (
                        <button onClick={() => handlePromoteToWire(item)} className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-sm flex items-center gap-1 text-xs font-bold transition shadow-sm"><Icons.ArrowUp /> マスターへ</button>
                    )}
                    <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition"><Icons.Edit /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition"><Icons.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight">MASTER DB</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">コアデータベース管理 / AI推論監視</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto">
          {['WIRES', 'UNKNOWN', 'CASTINGS', 'CLIENTS', 'STAFF', 'SETTINGS'].map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab as any)} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1 ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'WIRES' ? '電線' : tab === 'UNKNOWN' ? '💡 未知線種' : tab === 'CASTINGS' ? '非鉄金属' : tab === 'CLIENTS' ? '顧客' : tab === 'STAFF' ? 'スタッフ' : <><Icons.Settings /> システム設定</>}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm flex-1 flex flex-col overflow-hidden relative">
        {activeTab !== 'SETTINGS' && (
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3 z-30 relative">
              
              {(isListening || voiceText) && (
                  <div className="absolute top-full left-0 w-full z-40 bg-blue-900 text-white p-2 text-center text-sm font-bold shadow-md animate-in slide-in-from-top-2">
                      {isListening ? <span className="animate-pulse">{voiceText}</span> : <span>{voiceText}</span>}
                  </div>
              )}

              {activeTab === 'WIRES' && (
                  <div className="bg-white border border-blue-200 rounded-sm shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 gap-4">
                      <div className="flex items-center gap-3 w-full lg:w-1/3">
                          <div className="bg-blue-100 text-blue-800 p-2 rounded-full hidden sm:block"><Icons.Camera /></div>
                          <div className="flex-1">
                              <h4 className="text-xs font-bold text-blue-900 tracking-widest flex justify-between">
                                  <span>📸 写真収集ミッション</span>
                                  <span>{Math.floor((wireStats.complete / wireStats.total) * 100)}% 完成</span>
                              </h4>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(wireStats.complete / wireStats.total) * 100}%` }}></div>
                              </div>
                          </div>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 [&::-webkit-scrollbar]:hidden">
                          <button onClick={() => setImageStatusFilter('ALL')} className={`px-3 py-1.5 rounded-sm text-xs font-bold transition whitespace-nowrap ${imageStatusFilter === 'ALL' ? 'bg-gray-800 text-white shadow-inner' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'}`}>
                              全 {wireStats.total}件
                          </button>
                          <button onClick={() => setImageStatusFilter('COMPLETE')} className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${imageStatusFilter === 'COMPLETE' ? 'bg-green-600 text-white shadow-inner' : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'}`}>
                              ✨ 完備 ({wireStats.complete})
                          </button>
                          <button onClick={() => setImageStatusFilter('PARTIAL')} className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${imageStatusFilter === 'PARTIAL' ? 'bg-yellow-500 text-white shadow-inner' : 'bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100'}`}>
                              🔄 一部不足 ({wireStats.partial})
                          </button>
                          <button onClick={() => setImageStatusFilter('NONE')} className={`px-3 py-1.5 rounded-sm text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${imageStatusFilter === 'NONE' ? 'bg-red-500 text-white shadow-inner' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}>
                              ❌ 未登録 ({wireStats.none})
                          </button>
                      </div>
                  </div>
              )}
              
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                  <div className="flex flex-1 gap-2 w-full flex-wrap">
                      <div className="relative flex-1 min-w-[200px]">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                        <input type="text" placeholder="AND検索 (例: 1C VV)..." className="w-full border border-gray-300 rounded-sm pl-10 pr-4 py-2 text-sm focus:border-blue-500 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      </div>

                      {activeTab === 'WIRES' && uniqueMakers.length > 0 && (
                          <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer font-bold text-gray-700 shadow-sm max-w-[140px]" value={filterMaker} onChange={e => setFilterMaker(e.target.value)}>
                              <option value="">全メーカー</option>
                              {uniqueMakers.map((m: any) => <option key={m} value={m}>{m}</option>)}
                          </select>
                      )}

                      {activeTab === 'CASTINGS' && uniqueTypes.length > 0 && (
                          <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white cursor-pointer font-bold text-gray-700 shadow-sm max-w-[140px]" value={filterType} onChange={e => setFilterType(e.target.value)}>
                              <option value="">すべての種別</option>
                              {uniqueTypes.map((t: any) => <option key={t} value={t}>{t === 'BRASS' ? '真鍮' : t === 'ZINC' ? '亜鉛' : t === 'LEAD' ? '鉛' : t}</option>)}
                          </select>
                      )}

                      <button onClick={toggleVoiceInput} className={`px-3 py-2 border rounded-sm flex items-center justify-center transition-all shadow-sm ${isListening ? 'bg-red-500 border-red-600 text-white animate-pulse' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`} title="音声で検索キーワード入力">
                          <Icons.Mic />
                      </button>
                  </div>

                  {activeTab !== 'UNKNOWN' && (
                      <div className="flex gap-2 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                        {activeTab === 'WIRES' && (
                            <button onClick={() => setIsAiModalOpen(true)} className="flex-1 lg:flex-none bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-sm text-sm font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
                                <Icons.Sparkles /> AIアシスト登録
                            </button>
                        )}
                        <button onClick={() => handleOpenModal()} className="flex-1 lg:flex-none bg-gray-900 text-white px-5 py-2 rounded-sm text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 shadow-sm">
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
                              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border shadow-sm ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'}`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>
              )}
            </div>
        )}
        
        <div className="flex-1 overflow-hidden relative">
            {renderTable()}
        </div>
      </div>

      {/* ★ AIアシストモーダル（4枚枠対応） */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-4xl rounded-md shadow-2xl animate-in zoom-in-95 border border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h3 className="font-black text-white flex items-center gap-2">
                <Icons.Sparkles /> AI マスター登録アシスタント
              </h3>
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
                    <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        未知の線種をマスターに登録します。<br/>
                        最大4枚の画像をアップロードしてAIに解析させてください。<br/>
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="flex flex-col p-3 border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-md">
                            {imgData1 ? ( <div className="relative h-24"><img src={`data:image/jpeg;base64,${imgData1}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData1('')} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm"><Icons.Trash/></button></div> ) : ( <><p className="text-[10px] font-bold text-blue-400 mb-2">1. 断面 (必須)</p><input type="file" onChange={e=>handleAiImageUpload(e,1)} className="w-full text-white text-[10px]"/></> )}
                        </div>
                        <div className="flex flex-col p-3 border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-md">
                            {imgData2 ? ( <div className="relative h-24"><img src={`data:image/jpeg;base64,${imgData2}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData2('')} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm"><Icons.Trash/></button></div> ) : ( <><p className="text-[10px] font-bold text-gray-300 mb-2">2. 全体・被覆 (任意)</p><input type="file" onChange={e=>handleAiImageUpload(e,2)} className="w-full text-white text-[10px]"/></> )}
                        </div>
                        <div className="flex flex-col p-3 border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-md">
                            {imgData3 ? ( <div className="relative h-24"><img src={`data:image/jpeg;base64,${imgData3}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData3('')} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm"><Icons.Trash/></button></div> ) : ( <><p className="text-[10px] font-bold text-gray-300 mb-2">3. 印字(引き) (任意)</p><input type="file" onChange={e=>handleAiImageUpload(e,3)} className="w-full text-white text-[10px]"/></> )}
                        </div>
                        <div className="flex flex-col p-3 border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-md">
                            {imgData4 ? ( <div className="relative h-24"><img src={`data:image/jpeg;base64,${imgData4}`} className="w-full h-full object-cover rounded-sm" /><button onClick={()=>setImgData4('')} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm"><Icons.Trash/></button></div> ) : ( <><p className="text-[10px] font-bold text-gray-300 mb-2">4. 印字(アップ) (任意)</p><input type="file" onChange={e=>handleAiImageUpload(e,4)} className="w-full text-white text-[10px]"/></> )}
                        </div>
                    </div>

                    <div className="mb-6 bg-gray-800/50 border border-gray-700 p-3 rounded-md relative">
                        <label className="block text-xs font-bold text-gray-400 mb-2 flex items-center justify-between">
                            <span>🗣️ AIへのヒント・補足（任意）</span>
                            <button onClick={toggleHintVoiceInput} className={`p-1.5 rounded transition ${isListeningHint ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-700 text-gray-300 hover:bg-blue-600'}`}>
                                <Icons.Mic />
                            </button>
                        </label>
                        <textarea className="w-full bg-gray-900 border border-gray-600 rounded text-sm text-white p-2 outline-none focus:border-blue-500 min-h-[60px]" placeholder="例: 中身は細線の束、かなり重い、雑線は入っていない等..." value={aiHint} onChange={e => setAiHint(e.target.value)} />
                    </div>

                    <button onClick={runAiExtraction} disabled={!imgData1 && !aiHint} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-md flex justify-center items-center gap-2 disabled:bg-gray-700 transition shadow-lg text-lg">
                        <Icons.Sparkles />解析してデータを埋める
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 編集・新規登録モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 md:p-0">
          <div className="bg-white w-full max-w-4xl rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                  {editingItem?.id ? <Icons.Edit /> : <Icons.Plus />}
                  {editingItem?.id ? 'データ編集' : '新規マスター登録'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>
            </div>
            
            <div className="p-4 md:p-6 max-h-[75vh] overflow-y-auto space-y-4">
                {activeTab === 'WIRES' && editingItem.id && (editingItem.image1 || editingItem.image2 || editingItem.image3) && !editingItem._pendingImageData1 && (
                    <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">現在登録されているマスター画像</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {editingItem.image1 && <div><p className="text-[10px] text-gray-400 mb-1">1. 断面</p><a href={getDriveViewUrl(editingItem.image1)} target="_blank" rel="noopener noreferrer"><img src={getDriveImageUrl(editingItem.image1)} referrerPolicy="no-referrer" className="w-full h-32 md:h-40 object-cover rounded-sm border border-gray-300 shadow-sm hover:opacity-80 transition cursor-zoom-in" /></a></div>}
                            {editingItem.image2 && <div><p className="text-[10px] text-gray-400 mb-1">2. 印字等</p><a href={getDriveViewUrl(editingItem.image2)} target="_blank" rel="noopener noreferrer"><img src={getDriveImageUrl(editingItem.image2)} referrerPolicy="no-referrer" className="w-full h-32 md:h-40 object-cover rounded-sm border border-gray-300 shadow-sm hover:opacity-80 transition cursor-zoom-in" /></a></div>}
                            {editingItem.image3 && <div><p className="text-[10px] text-gray-400 mb-1">3. 剥線後</p><a href={getDriveViewUrl(editingItem.image3)} target="_blank" rel="noopener noreferrer"><img src={getDriveImageUrl(editingItem.image3)} referrerPolicy="no-referrer" className="w-full h-32 md:h-40 object-cover rounded-sm border border-gray-300 shadow-sm hover:opacity-80 transition cursor-zoom-in" /></a></div>}
                        </div>
                    </div>
                )}

                {activeTab === 'WIRES' && editingItem._pendingImageData1 && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-sm text-xs text-blue-800 font-bold flex flex-col gap-1">
                        <div className="flex items-center gap-2"><Icons.Sparkles /> 画像からAIが推論結果を自動入力しました。</div>
                        <div className="text-gray-600 ml-6 font-normal">※ 下の「確定してマスターに登録」を押すと、アップロードした画像も同時に保存されます。</div>
                    </div>
                )}

                {activeTab === 'WIRES' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">メーカー</label><input type="text" className="w-full border p-2.5 rounded-sm outline-none focus:border-blue-500 font-bold" value={editingItem.maker || ''} onChange={e => setEditingItem({...editingItem, maker: e.target.value})} /></div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">品名</label><input type="text" className="w-full border p-2.5 rounded-sm outline-none focus:border-blue-500 font-bold" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">製造年</label><input type="text" placeholder="例: 2024" className="w-full border p-2.5 rounded-sm outline-none focus:border-blue-500" value={editingItem.year || ''} onChange={e => setEditingItem({...editingItem, year: e.target.value})} /></div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 flex items-center justify-between"><span>サイズ</span><button onClick={handleCaliperInput} className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded-sm border border-blue-200 transition shadow-sm"><Icons.Ruler /> <span className="text-[9px]">ノギス</span></button></label>
                                <div className="flex rounded-sm shadow-sm relative"><input type="number" step="0.01" className="w-full border-y border-l border-gray-300 p-2.5 rounded-l-sm outline-none focus:border-blue-500 font-mono text-right" value={editingItem._sqValue || ''} onChange={e => setEditingItem({...editingItem, _sqValue: e.target.value})} placeholder="2.0" /><select className="border border-gray-300 bg-gray-50 px-2 rounded-r-sm text-xs font-bold text-gray-600 outline-none focus:border-blue-500" value={editingItem._sqUnit || 'sq'} onChange={e => setEditingItem({...editingItem, _sqUnit: e.target.value})}><option value="sq">sq</option><option value="mm">mm</option></select></div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-500 mb-1">芯数</label><div className="relative"><input type="number" className="w-full border p-2.5 rounded-sm outline-none focus:border-blue-500 font-mono pr-8 text-right" value={editingItem._coreValue || ''} onChange={e => setEditingItem({...editingItem, _coreValue: e.target.value.replace(/[^\d]/g, '')})} placeholder="3" /><span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold pointer-events-none">C</span></div></div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">導体構成 (構造)</label><input type="text" placeholder="単線/7本より線等" className="w-full border p-2.5 rounded-sm outline-none focus:border-blue-500" value={editingItem.conductor || ''} onChange={e => setEditingItem({...editingItem, conductor: e.target.value})} />
                                <div className="flex gap-1 mt-1"><button onClick={() => setEditingItem({...editingItem, conductor: '単線'})} className="flex-1 bg-gray-100 hover:bg-gray-200 text-[10px] py-1 rounded-sm text-gray-600 font-bold border border-gray-200">単線</button><button onClick={() => setEditingItem({...editingItem, conductor: 'より線'})} className="flex-1 bg-gray-100 hover:bg-gray-200 text-[10px] py-1 rounded-sm text-gray-600 font-bold border border-gray-200">より線</button></div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-100 p-4 md:p-6 rounded-sm border border-gray-300 mt-6 relative shadow-inner">
                            <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-sm">HUMAN REQUIRED</span>
                            <label className="block text-sm font-black text-gray-800 mb-4 border-b border-gray-300 pb-2">⚖️ サンプル実測 (人間による確定)</label>
                            
                            <div className="mb-6 bg-white p-3 rounded-sm border border-gray-300 shadow-sm">
                                <label className="block text-xs font-bold text-gray-700 mb-2">成分要素 (材質)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button onClick={() => setEditingItem({...editingItem, material: '純銅'})} className={`py-2 rounded-sm text-sm font-bold border transition ${editingItem.material === '純銅' ? 'bg-orange-50 border-orange-400 text-orange-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>純銅</button>
                                    <button onClick={() => setEditingItem({...editingItem, material: '錫メッキ'})} className={`py-2 rounded-sm text-sm font-bold border transition ${editingItem.material === '錫メッキ' ? 'bg-red-50 border-red-500 text-red-700 animate-pulse' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>⚠️ 錫メッキ</button>
                                    <button onClick={() => setEditingItem({...editingItem, material: 'アルミ'})} className={`py-2 rounded-sm text-sm font-bold border transition ${editingItem.material === 'アルミ' ? 'bg-blue-50 border-blue-400 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}>アルミ</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
                                <div className="flex flex-col items-center border border-gray-300 p-2 rounded-sm bg-white h-[66px] justify-center relative overflow-hidden group shadow-sm w-full">
                                    {editingItem._pendingImageData3 ? (
                                        <><img src={`data:image/jpeg;base64,${editingItem._pendingImageData3}`} className="absolute inset-0 w-full h-full object-cover opacity-60" /><span className="relative z-10 text-xs font-bold text-blue-700 bg-white/80 px-2 py-0.5 rounded-sm backdrop-blur-sm">✅ 撮影済</span><button onClick={() => setEditingItem({...editingItem, _pendingImageData3: null})} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm shadow-md z-20 hover:bg-red-700"><Icons.Trash /></button></>
                                    ) : ( <div className="flex gap-1 w-full h-full"><label className="flex-1 cursor-pointer flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition border border-gray-200 rounded-sm" title="カメラ"><Icons.Camera /><span className="text-[8px] font-bold mt-1">剥線画像</span><input type="file" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if(file){
                                            compressImage(file).then(b64 => setEditingItem({...editingItem, _pendingImageData3: b64})).catch(e=>alert(e.message));
                                        }
                                    }} className="hidden" accept="image/*" capture="environment" /></label></div> )}
                                </div>
                                <div className="w-full"><label className="block text-[10px] font-bold text-gray-600 mb-1">全体重量(g)</label><input type="number" step="0.001" className="w-full border-none shadow-sm p-2 rounded-sm font-mono text-lg outline-none focus:ring-2 focus:ring-blue-500" value={sampleTotal} onChange={e => handleSampleTotalChange(e.target.value)} placeholder="0.000" /></div>
                                <div className="w-full"><label className="block text-[10px] font-bold text-[#D32F2F] mb-1">純銅重量(g)</label><input type="number" step="0.001" className="w-full border-none shadow-sm p-2 rounded-sm font-mono text-lg outline-none focus:ring-2 focus:ring-red-500" value={sampleCopper} onChange={e => handleSampleCopperChange(e.target.value)} placeholder="0.000" /></div>
                                <div className="w-full"><label className="block text-[10px] font-bold text-gray-600 mb-1">被覆重量(g)</label><input type="number" step="0.001" className="w-full border-none shadow-sm p-2 rounded-sm font-mono text-lg outline-none focus:ring-2 focus:ring-gray-500" value={sampleCover} onChange={e => handleSampleCoverChange(e.target.value)} placeholder="0.000" /></div>
                                <div className="w-full flex flex-col gap-2">
                                    <div className="bg-white border border-gray-300 shadow-inner p-1.5 rounded-sm flex justify-between items-center"><span className="text-[9px] font-bold text-gray-500">ダスト</span><span className="font-mono text-sm font-bold text-gray-700">{getJuteWeight()}g</span></div>
                                    <div className="bg-blue-50 border border-blue-200 shadow-inner p-1.5 rounded-sm flex justify-between items-center relative"><span className="text-[9px] font-bold text-blue-800">歩留まり</span>{editingItem.aiEstimatedRatio && !sampleTotal && <span className="absolute -top-2 -right-2 text-[8px] bg-blue-500 text-white px-1 py-0.5 rounded shadow animate-pulse">AI</span>}<span className="font-mono text-base font-black text-blue-700">{editingItem.ratio || '---'}%</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4"><label className="block text-xs font-bold text-gray-500 mb-1">メモ / 特記事項</label><textarea className="w-full border p-3 rounded-sm h-28 text-sm outline-none focus:border-gray-500 leading-relaxed shadow-sm bg-gray-50 whitespace-pre-wrap" value={editingItem.memo || editingItem.reason || ''} onChange={e => setEditingItem({...editingItem, memo: e.target.value, reason: e.target.value})} /></div>
                    </>
                )}

                {activeTab === 'CASTINGS' && (
                  <>
                    <div><label className="block text-xs font-bold text-gray-500 mb-1">品目名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">種別</label><select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.type || 'BRASS'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}><option value="BRASS">真鍮 (Brass)</option><option value="ZINC">亜鉛 (Zinc)</option><option value="LEAD">鉛 (Lead)</option></select></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">歩留まり (%)</label><input type="number" step="0.1" className="w-full border p-2 rounded-sm font-bold text-blue-600 outline-none focus:border-blue-500" value={editingItem.ratio || ''} onChange={e => setEditingItem({...editingItem, ratio: e.target.value})} /></div>
                    </div>
                  </>
                )}

                {activeTab === 'CLIENTS' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">業者名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">ランク</label><select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.rank || 'NORMAL'} onChange={e => setEditingItem({...editingItem, rank: e.target.value})}><option value="NORMAL">一般 (NORMAL)</option><option value="BRONZE">ブロンズ (BRONZE)</option><option value="SILVER">シルバー (SILVER)</option><option value="GOLD">ゴールド (GOLD)</option><option value="VIP">VIP</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">電話番号</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.phone || ''} onChange={e => setEditingItem({...editingItem, phone: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">保有ポイント</label><input type="number" className="w-full border p-2 rounded-sm font-bold text-orange-600 outline-none focus:border-orange-500" value={editingItem.points || 0} onChange={e => setEditingItem({...editingItem, points: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">ログインID</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500 font-mono" value={editingItem.loginId || ''} onChange={e => setEditingItem({...editingItem, loginId: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">パスワード</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500 font-mono" value={editingItem.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">業種</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.industry || ''} onChange={e => setEditingItem({...editingItem, industry: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">所在地</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.address || ''} onChange={e => setEditingItem({...editingItem, address: e.target.value})} /></div>
                    </div>
                  </>
                )}

                {activeTab === 'STAFF' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">スタッフ名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">ステータス</label><select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.status || 'ACTIVE'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}><option value="ACTIVE">有効 (ACTIVE)</option><option value="INACTIVE">停止 (INACTIVE)</option></select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">権限 (Role)</label><select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.role || 'FRONT'} onChange={e => setEditingItem({...editingItem, role: e.target.value})}><option value="FRONT">受付 (FRONT)</option><option value="INSPECTION">検収 (INSPECTION)</option><option value="PLANT">工場 (PLANT)</option><option value="MANAGER">工場長 (MANAGER)</option><option value="ALL">管理者 (ALL)</option></select></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">時給/単価</label><input type="number" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.rate || 0} onChange={e => setEditingItem({...editingItem, rate: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">ログインID</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500 font-mono" value={editingItem.loginId || ''} onChange={e => setEditingItem({...editingItem, loginId: e.target.value})} /></div>
                        <div><label className="block text-xs font-bold text-gray-500 mb-1">パスワード</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500 font-mono" value={editingItem.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /></div>
                    </div>
                  </>
                )}
            </div>
            
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-sm transition">キャンセル</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm active:scale-95">
                {isSubmitting ? '保存中...' : '確定してマスターに登録'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
