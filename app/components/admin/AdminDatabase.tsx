// @ts-nocheck
import React, { useState, useRef } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Image: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  ArrowUp: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Filter: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
  Camera: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  UploadCloud: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
};

export const AdminDatabase = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'WIRES' | 'UNKNOWN' | 'CASTINGS' | 'CLIENTS' | 'STAFF'>('WIRES');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaker, setFilterMaker] = useState('');
  const [filterType, setFilterType] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'ANALYZING'>('IDLE');
  const [imgData1, setImgData1] = useState<string>('');
  const [imgData2, setImgData2] = useState<string>('');
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true);

  const [sampleTotal, setSampleTotal] = useState<number | ''>('');
  const [sampleCopper, setSampleCopper] = useState<number | ''>('');

  const wires = data?.wires || [];
  const unknownWires = data?.unknownWires || []; 
  const castings = data?.castings || [];
  const clients = data?.clients || [];
  const staffs = data?.staffs || [];

  const uniqueMakers = Array.from(new Set(wires.map((w:any) => w.maker).filter((m:any) => m && m !== '-')));
  const uniqueTypes = Array.from(new Set(castings.map((c:any) => c.type).filter(Boolean)));

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setSearchTerm('');
    setFilterMaker('');
    setFilterType('');
  };

  const getDriveImageUrl = (url: string) => {
      if (!url) return '';
      if (url.includes('drive.google.com/uc')) {
          const match = url.match(/id=([^&]+)/);
          if (match && match[1]) {
              return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
          }
      }
      return url;
  };

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item || {});
    setSampleTotal(item?.sampleTotal || '');
    setSampleCopper(item?.sampleCopper || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setSampleTotal('');
    setSampleCopper('');
    setIsModalOpen(false);
  };

  const calculateRatio = (total: number | '', copper: number | '') => {
      if (total && copper && Number(total) > 0) {
          const r = (Number(copper) / Number(total)) * 100;
          return r.toFixed(2);
      }
      return '';
  };

  const handleSampleTotalChange = (val: string) => {
      const num = val ? Number(val) : '';
      setSampleTotal(num);
      setEditingItem({...editingItem, sampleTotal: num, ratio: calculateRatio(num, sampleCopper)});
  };

  const handleSampleCopperChange = (val: string) => {
      const num = val ? Number(val) : '';
      setSampleCopper(num);
      setEditingItem({...editingItem, sampleCopper: num, ratio: calculateRatio(sampleTotal, num)});
  };

  const handlePromoteToWire = (unknownItem: any) => {
      setActiveTab('WIRES');
      setEditingItem({
          name: unknownItem.name.replace(/【.*?】/g, ''), 
          maker: '', 
          year: '', 
          sq: '', 
          core: '', 
          ratio: unknownItem.ratio,
          memo: `【AI推論からの昇格】\n推論日時: ${unknownItem.createdAt}\nAIの根拠: ${unknownItem.reason}`
      });
      setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    let sheetName = '';
    if (activeTab === 'WIRES') sheetName = 'Products_Wire';
    if (activeTab === 'UNKNOWN') sheetName = 'Products_Unknown';
    if (activeTab === 'CASTINGS') sheetName = 'Products_Casting';
    if (activeTab === 'CLIENTS') sheetName = 'Clients';
    if (activeTab === 'STAFF') sheetName = 'Staff';

    const action = editingItem.id ? 'UPDATE_DB_RECORD' : 'ADD_DB_RECORD';
    
    const payload = editingItem.id 
      ? { action, sheetName, recordId: editingItem.id, updates: getUpdatesMap(editingItem, activeTab) }
      : { action, sheetName, data: editingItem };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') {
        alert('保存しました');
        window.location.reload();
      } else {
        alert('エラー: ' + result.message);
      }
    } catch (e) { alert('通信エラー'); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    let sheetName = '';
    if (activeTab === 'WIRES') sheetName = 'Products_Wire';
    if (activeTab === 'UNKNOWN') sheetName = 'Products_Unknown';
    if (activeTab === 'CASTINGS') sheetName = 'Products_Casting';
    if (activeTab === 'CLIENTS') sheetName = 'Clients';
    if (activeTab === 'STAFF') sheetName = 'Staff';

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName, recordId: id }) });
      const result = await res.json();
      if (result.status === 'success') {
        alert('削除しました');
        window.location.reload();
      }
    } catch (e) { alert('通信エラー'); }
  };

  const getUpdatesMap = (item: any, tab: string) => {
    if (tab === 'WIRES') return { 
        1: item.maker, 2: item.name, 3: item.year, 4: item.sq, 
        5: item.sampleTotal, 6: item.sampleCopper,
        7: item.core, 8: item.conductor, 9: item.ratio, 10: item.memo 
    };
    if (tab === 'UNKNOWN') return { 1: item.name, 2: item.ratio, 3: item.reason }; 
    if (tab === 'CASTINGS') return { 1: item.name, 2: item.type, 4: item.ratio };
    if (tab === 'CLIENTS') return { 1: item.name, 2: item.rank, 4: item.phone, 5: item.loginId, 6: item.password, 7: item.points, 8: item.memo, 9: item.address, 10: item.industry };
    if (tab === 'STAFF') return { 1: item.name, 2: item.role, 3: item.rate, 4: item.status, 5: item.loginId, 6: item.password };
    return {};
  };

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
          };
      });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, recordId: string, colIndex: number, sheetName: string) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingImageId(`${recordId}-${colIndex}`);
      try {
          const base64Data = await compressImage(file);
          const res = await fetch('/api/gas', {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'UPLOAD_IMAGE', sheetName: sheetName, recordId: recordId, colIndex: colIndex, data: base64Data, mimeType: 'image/jpeg', fileName: `img_${recordId}_${Date.now()}.jpg` })
          });
          const result = await res.json();
          if (result.status === 'success') { alert('画像をアップロードしました'); window.location.reload(); } else { alert('エラー: ' + result.message); }
      } catch (err) { alert('通信エラーが発生しました'); }
      setUploadingImageId(null);
      e.target.value = '';
  };

  const runAiExtraction = async () => {
    if (!imgData1) return alert('最低1枚の画像（断面など）をアップロードしてください');
    setAiStatus('ANALYZING');
    
    try {
      const res = await fetch('/api/gas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VISION_AI_REGISTER', imageData: imgData1, imageData2: imgData2 })
      });
      const result = await res.json();
      
      if (result.status === 'success') {
          // ★ Web Speech API による音声読み上げ処理 (超簡潔化＆スピード1.4)
          if (isVoiceOutputEnabled && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const makerText = result.data.maker && result.data.maker !== '-' ? result.data.maker : 'メーカー不明';
              const nameText = result.data.name && result.data.name !== '-' ? result.data.name : '品名不明';
              const speakText = `解析完了。${makerText}、${nameText}。実測を行ってください。`;
              const utterance = new SpeechSynthesisUtterance(speakText);
              utterance.lang = 'ja-JP';
              utterance.rate = 1.4;
              window.speechSynthesis.speak(utterance);
          }

          setEditingItem({
              maker: result.data.maker === '-' ? '' : result.data.maker,
              name: result.data.name === '-' ? '' : result.data.name,
              year: result.data.year === '-' ? '' : result.data.year,
              sq: result.data.size === '-' ? '' : result.data.size,
              core: result.data.core === '-' ? '' : result.data.core,
              conductor: result.data.conductor === '-' ? '' : result.data.conductor,
              ratio: '',
              memo: '【AIアシスト抽出】\n画像を元に仕様を自動入力しました。実測による歩留まりを入力してください。',
              _pendingImageData1: imgData1,
              _pendingImageData2: imgData2
          });
          setSampleTotal('');
          setSampleCopper('');
          
          setIsAiModalOpen(false);
          setIsModalOpen(true);
      } else {
          alert('AI抽出エラー: ' + result.message);
      }
    } catch(err) {
      alert('通信エラーが発生しました。');
    }
    setAiStatus('IDLE');
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

  const renderTable = () => {
    let filteredData = [];
    
    if (activeTab === 'WIRES') {
        filteredData = wires.filter((w:any) => 
            (w.name.includes(searchTerm) || w.maker?.includes(searchTerm)) &&
            (filterMaker === '' || w.maker === filterMaker)
        );
    }
    if (activeTab === 'UNKNOWN') {
        filteredData = unknownWires.filter((u:any) => u.name?.includes(searchTerm) || u.reason?.includes(searchTerm));
    }
    if (activeTab === 'CASTINGS') {
        filteredData = castings.filter((c:any) => 
            c.name.includes(searchTerm) &&
            (filterType === '' || c.type === filterType)
        );
    }
    if (activeTab === 'CLIENTS') filteredData = clients.filter((c:any) => c.name.includes(searchTerm));
    if (activeTab === 'STAFF') filteredData = staffs.filter((s:any) => s.name.includes(searchTerm));

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap md:whitespace-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              {activeTab === 'WIRES' && <><th className="p-3">メーカー</th><th className="p-3">品名</th><th className="p-3">製造年</th><th className="p-3">SQ/芯数</th><th className="p-3">歩留まり</th><th className="p-3">画像 (印字/断面)</th></>}
              {activeTab === 'UNKNOWN' && <><th className="p-3">登録日時</th><th className="p-3">AI推定品名</th><th className="p-3">算出歩留まり</th><th className="p-3 w-1/3">推論の根拠 (Reasoning)</th></>}
              {activeTab === 'CASTINGS' && <><th className="p-3">品目名</th><th className="p-3">種別</th><th className="p-3">歩留まり</th></>}
              {activeTab === 'CLIENTS' && <><th className="p-3">業者名</th><th className="p-3">ランク</th><th className="p-3">電話番号</th><th className="p-3">保有ポイント</th></>}
              {activeTab === 'STAFF' && <><th className="p-3">スタッフ名</th><th className="p-3">権限</th><th className="p-3">ステータス</th></>}
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.map((item: any, idx: number) => (
              <tr key={idx} className="hover:bg-gray-50 transition">
                {activeTab === 'WIRES' && (
                  <>
                    <td className="p-3 font-bold text-gray-700">{item.maker || '-'}</td>
                    <td className="p-3 font-bold text-gray-900">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.year || '-'}</td>
                    <td className="p-3 text-gray-600">{item.sq || '-'} sq / {item.core || '-'}C</td>
                    <td className="p-3 font-mono font-bold text-blue-600 text-base">{item.ratio}%</td>
                    <td className="p-3 flex gap-2">
                        {[11, 12].map(colIdx => (
                            <div key={colIdx} className="relative w-10 h-10 border border-gray-300 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center group">
                                {item[`image${colIdx-10}`] ? (
                                    <img src={getDriveImageUrl(item[`image${colIdx-10}`])} className="w-full h-full object-cover" alt="Wire" />
                                ) : (
                                    <Icons.Image />
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, item.id, colIdx, 'Products_Wire')} />
                                {uploadingImageId === `${item.id}-${colIdx}` && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Icons.Refresh /></div>}
                            </div>
                        ))}
                    </td>
                  </>
                )}

                {activeTab === 'UNKNOWN' && (
                  <>
                    <td className="p-3 text-xs text-gray-500 font-mono">{item.createdAt?.split(' ')[0]}</td>
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

                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    {activeTab === 'UNKNOWN' && (
                        <button onClick={() => handlePromoteToWire(item)} className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-sm flex items-center gap-1 text-xs font-bold transition shadow-sm">
                            <Icons.ArrowUp /> 確定マスターへ
                        </button>
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

  const renderModalContent = () => {
    if (activeTab === 'WIRES' || activeTab === 'UNKNOWN') return (
      <div className="space-y-4">
        {editingItem._pendingImageData1 && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-sm text-xs text-blue-800 font-bold flex items-center gap-2">
                <Icons.Sparkles /> 画像からAIが仕様を自動入力しました。サンプルを実測して確定してください。
            </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">メーカー</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-blue-500 font-bold" value={editingItem.maker || ''} onChange={e => setEditingItem({...editingItem, maker: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">品名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-blue-500 font-bold" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">製造年</label><input type="text" placeholder="例: 2024" className="w-full border p-2 rounded-sm outline-none focus:border-blue-500" value={editingItem.year || ''} onChange={e => setEditingItem({...editingItem, year: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">SQ (サイズ)</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-blue-500" value={editingItem.sq || ''} onChange={e => setEditingItem({...editingItem, sq: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">芯数 (C)</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-blue-500" value={editingItem.core || ''} onChange={e => setEditingItem({...editingItem, core: e.target.value})} /></div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-sm border border-gray-300 mt-4 relative">
            <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-sm">HUMAN REQUIRED</span>
            <label className="block text-sm font-black text-gray-800 mb-3 border-b border-gray-300 pb-2">⚖️ サンプル実測 (人間が入力)</label>
            <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">被覆込み 総重量 (g)</label>
                    <input type="number" step="0.001" className="w-full border-none shadow-sm p-3 rounded-sm font-mono text-lg outline-none focus:ring-2 focus:ring-blue-500" value={sampleTotal} onChange={e => handleSampleTotalChange(e.target.value)} placeholder="0.000" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-[#D32F2F] mb-1">剥線後 銅重量 (g)</label>
                    <input type="number" step="0.001" className="w-full border-none shadow-sm p-3 rounded-sm font-mono text-lg outline-none focus:ring-2 focus:ring-red-500" value={sampleCopper} onChange={e => handleSampleCopperChange(e.target.value)} placeholder="0.000" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-blue-800 mb-1">歩留まり (%)</label>
                    <div className="w-full bg-white border border-blue-200 shadow-inner p-3 rounded-sm font-mono text-xl font-black text-blue-600 text-right">
                        {editingItem.ratio || '---'} %
                    </div>
                </div>
            </div>
        </div>

        <div><label className="block text-xs font-bold text-gray-500 mb-1">メモ / 特記事項</label><textarea className="w-full border p-2 rounded-sm h-16 text-sm outline-none focus:border-gray-500" value={editingItem.memo || editingItem.reason || ''} onChange={e => setEditingItem({...editingItem, memo: e.target.value, reason: e.target.value})} /></div>
      </div>
    );

    if (activeTab === 'CASTINGS') return (
      <div className="space-y-4">
        <div><label className="block text-xs font-bold text-gray-500 mb-1">品目名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">種別</label>
                <select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.type || 'BRASS'} onChange={e => setEditingItem({...editingItem, type: e.target.value})}>
                    <option value="BRASS">真鍮 (Brass)</option>
                    <option value="ZINC">亜鉛 (Zinc)</option>
                    <option value="LEAD">鉛 (Lead)</option>
                </select>
            </div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">歩留まり (%)</label><input type="number" step="0.1" className="w-full border p-2 rounded-sm font-bold text-blue-600 outline-none focus:border-blue-500" value={editingItem.ratio || ''} onChange={e => setEditingItem({...editingItem, ratio: e.target.value})} /></div>
        </div>
      </div>
    );

    if (activeTab === 'CLIENTS') return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">業者名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">ランク</label>
                <select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.rank || 'NORMAL'} onChange={e => setEditingItem({...editingItem, rank: e.target.value})}>
                    <option value="NORMAL">一般 (NORMAL)</option>
                    <option value="BRONZE">ブロンズ (BRONZE)</option>
                    <option value="SILVER">シルバー (SILVER)</option>
                    <option value="GOLD">ゴールド (GOLD)</option>
                    <option value="VIP">VIP</option>
                </select>
            </div>
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
        <div><label className="block text-xs font-bold text-gray-500 mb-1">メモ</label><textarea className="w-full border p-2 rounded-sm text-sm outline-none focus:border-gray-500" value={editingItem.memo || ''} onChange={e => setEditingItem({...editingItem, memo: e.target.value})} /></div>
      </div>
    );

    if (activeTab === 'STAFF') return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">スタッフ名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">ステータス</label>
                <select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.status || 'ACTIVE'} onChange={e => setEditingItem({...editingItem, status: e.target.value})}>
                    <option value="ACTIVE">有効 (ACTIVE)</option>
                    <option value="INACTIVE">停止 (INACTIVE)</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">権限 (Role)</label>
                <select className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.role || 'FRONT'} onChange={e => setEditingItem({...editingItem, role: e.target.value})}>
                    <option value="FRONT">受付 (FRONT)</option>
                    <option value="INSPECTION">検収 (INSPECTION)</option>
                    <option value="PLANT">工場 (PLANT)</option>
                    <option value="MANAGER">工場長 (MANAGER)</option>
                    <option value="ALL">管理者 (ALL)</option>
                </select>
            </div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">時給/単価</label><input type="number" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.rate || 0} onChange={e => setEditingItem({...editingItem, rate: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">ログインID</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500 font-mono" value={editingItem.loginId || ''} onChange={e => setEditingItem({...editingItem, loginId: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">パスワード</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500 font-mono" value={editingItem.password || ''} onChange={e => setEditingItem({...editingItem, password: e.target.value})} /></div>
        </div>
      </div>
    );

    return null;
  };

return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight">MASTER DB</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">コアデータベース管理 / AI推論監視</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-sm overflow-x-auto">
          {['WIRES', 'UNKNOWN', 'CASTINGS', 'CLIENTS', 'STAFF'].map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab as any)} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'WIRES' ? '電線' : tab === 'UNKNOWN' ? '💡 未知線種 (AI)' : tab === 'CASTINGS' ? '非鉄金属' : tab === 'CLIENTS' ? '顧客' : 'スタッフ'}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-2 flex-col md:flex-row">
              <div className="relative flex-1 max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icons.Search />
                </div>
                <input type="text" placeholder="キーワード検索..." className="w-full border border-gray-300 rounded-sm pl-10 pr-4 py-2 text-sm focus:border-gray-500 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>

              {activeTab === 'WIRES' && uniqueMakers.length > 0 && (
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Filter /></div>
                      <select className="w-full md:w-auto border border-gray-300 rounded-sm pl-10 pr-8 py-2 text-sm outline-none focus:border-gray-500 bg-white appearance-none cursor-pointer" value={filterMaker} onChange={e => setFilterMaker(e.target.value)}>
                          <option value="">すべてのメーカー</option>
                          {uniqueMakers.map((m: any) => <option key={m} value={m}>{m}</option>)}
                      </select>
                  </div>
              )}

              {activeTab === 'CASTINGS' && uniqueTypes.length > 0 && (
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Filter /></div>
                      <select className="w-full md:w-auto border border-gray-300 rounded-sm pl-10 pr-8 py-2 text-sm outline-none focus:border-gray-500 bg-white appearance-none cursor-pointer" value={filterType} onChange={e => setFilterType(e.target.value)}>
                          <option value="">すべての種別</option>
                          {uniqueTypes.map((t: any) => <option key={t} value={t}>{t === 'BRASS' ? '真鍮' : t === 'ZINC' ? '亜鉛' : t === 'LEAD' ? '鉛' : t}</option>)}
                      </select>
                  </div>
              )}
          </div>

          {activeTab !== 'UNKNOWN' && (
              <div className="flex gap-2">
                {activeTab === 'WIRES' && (
                    <button onClick={() => setIsAiModalOpen(true)} className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-sm text-sm font-bold hover:bg-blue-100 transition flex items-center gap-2 whitespace-nowrap shadow-sm">
                        <Icons.Sparkles /> AIアシストで新規登録
                    </button>
                )}
                <button onClick={() => handleOpenModal()} className="bg-gray-900 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 shadow-sm">
                    <Icons.Plus /> 手動で新規登録
                </button>
              </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderTable()}
        </div>
      </div>

      {/* ★ AIアシスト用の画像アップロードモーダル (分割ボタン) */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900 w-full max-w-2xl rounded-md shadow-2xl animate-in zoom-in-95 border border-gray-700 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/50">
              <h3 className="font-black text-white flex items-center gap-2">
                <Icons.Sparkles /> AI マスター登録アシスタント
              </h3>
              <button onClick={() => setIsAiModalOpen(false)} className="text-gray-400 hover:text-white"><Icons.Close /></button>
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
                        未知の線種をマスターに登録します。<br/>
                        断面写真や表面の印字（メーカー名等）の写真をアップロードしてください。<br/>
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        {/* 1. 断面画像 */}
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

                        {/* 2. 表面印字画像 */}
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

                    <button onClick={runAiExtraction} disabled={!imgData1} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-md flex justify-center items-center gap-2 disabled:bg-gray-700 transition shadow-lg text-lg">
                        <Icons.Sparkles />解析してデータを埋める
                    </button>

                    {/* ★ 音声読み上げON/OFFトグル */}
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

      {/* 編集・新規登録モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                  {editingItem?.id ? <Icons.Edit /> : <Icons.Plus />}
                  {editingItem?.id ? 'データ編集' : '新規マスター登録'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>
            </div>
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {renderModalContent()}
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-sm transition">キャンセル</button>
              <button onClick={handleSave} disabled={isSubmitting || (activeTab === 'WIRES' && (!sampleTotal || !sampleCopper))} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm active:scale-95">
                {isSubmitting ? '保存中...' : '確定してマスターに登録'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
