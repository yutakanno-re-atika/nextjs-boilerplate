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
  Refresh: () => <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

export const AdminDatabase = ({ data }: { data: any }) => {
  const [activeTab, setActiveTab] = useState<'WIRES' | 'UNKNOWN' | 'CASTINGS' | 'CLIENTS' | 'STAFF'>('WIRES');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);

  const wires = data?.wires || [];
  const unknownWires = data?.unknownWires || []; 
  const castings = data?.castings || [];
  const clients = data?.clients || [];
  const staffs = data?.staffs || [];

  // ★ 追加：Google Driveの画像URLを「リンク切れしないサムネイル用URL」に変換する関数
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handlePromoteToWire = (unknownItem: any) => {
      setActiveTab('WIRES');
      setEditingItem({
          name: unknownItem.name.replace(/【.*?】/g, ''), 
          maker: '', 
          sq: '', 
          core: '', 
          ratio: unknownItem.ratio,
          memo: `【AI推論からの昇格】\n推論日時: ${unknownItem.date}\nAIの根拠: ${unknownItem.reason}`
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
    if (tab === 'WIRES') return { 1: item.maker, 2: item.name, 3: item.year, 4: item.sq, 7: item.core, 8: item.conductor, 9: item.ratio, 10: item.memo };
    if (tab === 'UNKNOWN') return { 2: item.name, 3: item.ratio, 4: item.reason };
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
                  const MAX = 1920; let w = img.width; let h = img.height;
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
  };

const renderTable = () => {
    let filteredData = [];
    if (activeTab === 'WIRES') filteredData = wires.filter((w:any) => w.name.includes(searchTerm) || w.maker?.includes(searchTerm));
    if (activeTab === 'UNKNOWN') filteredData = unknownWires.filter((u:any) => u.name?.includes(searchTerm) || u.reason?.includes(searchTerm));
    if (activeTab === 'CASTINGS') filteredData = castings.filter((c:any) => c.name.includes(searchTerm));
    if (activeTab === 'CLIENTS') filteredData = clients.filter((c:any) => c.name.includes(searchTerm));
    if (activeTab === 'STAFF') filteredData = staffs.filter((s:any) => s.name.includes(searchTerm));

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm whitespace-nowrap md:whitespace-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-500 uppercase tracking-wider text-xs">
              {activeTab === 'WIRES' && <><th className="p-3">メーカー</th><th className="p-3">品名</th><th className="p-3">SQ/芯数</th><th className="p-3">歩留まり</th><th className="p-3">画像 (印字/断面)</th></>}
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
                    <td className="p-3 text-gray-600">{item.sq || '-'} sq / {item.core || '-'}C</td>
                    <td className="p-3 font-mono font-bold text-blue-600 text-base">{item.ratio}%</td>
                    <td className="p-3 flex gap-2">
                        {[11, 12].map(colIdx => (
                            <div key={colIdx} className="relative w-10 h-10 border border-gray-300 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center group">
                                {item[`image${colIdx-10}`] ? (
                                    /* ★ 修正：getDriveImageUrl で画像を安全に表示 */
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
                    <td className="p-3 text-xs text-gray-500 font-mono">{item.date?.split(' ')[0]}</td>
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
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">メーカー</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.maker || ''} onChange={e => setEditingItem({...editingItem, maker: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">品名</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-bold text-gray-500 mb-1">SQ (断面積)</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.sq || ''} onChange={e => setEditingItem({...editingItem, sq: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">芯数</label><input type="text" className="w-full border p-2 rounded-sm outline-none focus:border-gray-500" value={editingItem.core || ''} onChange={e => setEditingItem({...editingItem, core: e.target.value})} /></div>
            <div><label className="block text-xs font-bold text-gray-500 mb-1">歩留まり (%)</label><input type="number" step="0.1" className="w-full border p-2 rounded-sm font-bold text-blue-600 outline-none focus:border-blue-500" value={editingItem.ratio || ''} onChange={e => setEditingItem({...editingItem, ratio: e.target.value})} /></div>
        </div>
        <div><label className="block text-xs font-bold text-gray-500 mb-1">メモ / 推論の根拠</label><textarea className="w-full border p-2 rounded-sm h-24 text-sm outline-none focus:border-gray-500" value={editingItem.memo || editingItem.reason || ''} onChange={e => setEditingItem({...editingItem, memo: e.target.value, reason: e.target.value})} /></div>
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
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-sm text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {tab === 'WIRES' ? '電線' : tab === 'UNKNOWN' ? '💡 未知線種 (AI)' : tab === 'CASTINGS' ? '非鉄金属' : tab === 'CLIENTS' ? '顧客' : 'スタッフ'}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search />
            </div>
            <input type="text" placeholder="検索..." className="w-full border border-gray-300 rounded-sm pl-10 pr-4 py-2 text-sm focus:border-gray-500 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          {activeTab !== 'UNKNOWN' && (
              <button onClick={() => handleOpenModal()} className="bg-gray-900 text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-gray-800 transition flex items-center gap-2 whitespace-nowrap active:scale-95">
                <Icons.Plus /> 新規登録
              </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {renderTable()}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                  {editingItem?.id ? <Icons.Edit /> : <Icons.Plus />}
                  {editingItem?.id ? 'データ編集' : '新規登録'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 p-1"><Icons.Close /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {renderModalContent()}
            </div>
            <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
              <button onClick={handleCloseModal} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-sm transition">キャンセル</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2 shadow-sm active:scale-95">
                {isSubmitting ? '保存中...' : '保存する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};