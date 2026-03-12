// app/components/admin/AdminDatabaseSpecs.tsx
// @ts-nocheck
import React, { useState, useMemo } from 'react';

const Icons = {
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Search: () => <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Document: () => <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  ExternalLink: () => <svg className="w-3 h-3 md:w-4 md:h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
};

// 全角数字・ピリオドを半角に自動変換する関数
const toHalfWidthNumber = (str: any) => {
  if (str == null || str === '') return '';
  return String(str)
    .replace(/[０-９．]/g, (s) => s === '．' ? '.' : String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[^0-9.]/g, ''); 
};

export const AdminDatabaseSpecs = ({ data }: { data: any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specsData = data?.wireSpecs || [];

  const filteredData = useMemo(() => {
    if (!searchTerm) return specsData;
    const terms = searchTerm.toLowerCase().replace(/　/g, ' ').split(' ').filter(Boolean);
    return specsData.filter((item: any) => {
      const target = `${item.maker} ${item.name} ${item.size} ${item.core}`.toLowerCase();
      return terms.every(term => target.includes(term));
    });
  }, [specsData, searchTerm]);

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item || {
      maker: '', name: '', size: '', core: '', outerDiameter: '', weightPerKm: '', theoreticalRatio: '', pdfUrl: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    let finalItem = { ...editingItem };
    
    // 数値系のサニタイズ
    finalItem.size = toHalfWidthNumber(finalItem.size);
    finalItem.core = toHalfWidthNumber(finalItem.core).replace(/\./g, '');
    finalItem.outerDiameter = toHalfWidthNumber(finalItem.outerDiameter);
    finalItem.weightPerKm = toHalfWidthNumber(finalItem.weightPerKm);
    finalItem.theoreticalRatio = toHalfWidthNumber(finalItem.theoreticalRatio);

    const action = finalItem.id ? 'UPDATE_DB_RECORD' : 'ADD_DB_RECORD';
    const payload = finalItem.id 
      ? { action, sheetName: 'Products_Wire_Specs', recordId: finalItem.id, updates: { 1: finalItem.maker, 2: finalItem.name, 3: finalItem.size, 4: finalItem.core, 5: finalItem.outerDiameter, 6: finalItem.weightPerKm, 7: finalItem.theoreticalRatio, 8: finalItem.pdfUrl } } 
      : { action, sheetName: 'Products_Wire_Specs', data: finalItem };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') { 
          alert('カタログデータを保存しました'); 
          window.location.reload(); 
      } else { 
          alert('エラー: ' + result.message); 
      }
    } catch (e) { alert('通信エラーが発生しました'); }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName: 'Products_Wire_Specs', recordId: id }) });
      const result = await res.json();
      if (result.status === 'success') { alert('削除しました'); window.location.reload(); }
    } catch (e) { alert('通信エラー'); }
  };

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-300">
      <div className="p-2 md:p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-2 justify-between items-start md:items-center z-30">
        <div className="flex gap-1.5 w-full flex-wrap">
          <div className="relative flex-1 min-w-[150px]">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none"><Icons.Search /></div>
            <input type="text" placeholder="品名やメーカーで検索..." className="w-full pl-7 pr-2 py-1.5 md:py-2 border border-gray-300 rounded-sm text-xs md:text-sm focus:border-blue-600 outline-none shadow-inner" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-1.5 w-full md:w-auto shrink-0">
          <button onClick={() => handleOpenModal()} className="flex-1 md:flex-none bg-blue-700 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-sm text-xs md:text-sm font-bold hover:bg-blue-800 transition flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap active:scale-95 shadow-sm">
            <Icons.Plus /> カタログ追加
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        <table className="w-full text-left border-collapse text-sm min-w-[800px]">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs sticky top-0 z-20 shadow-sm border-b border-gray-300">
            <tr>
              <th className="p-3 font-bold w-1/4">メーカー / 品名</th>
              <th className="p-3 font-bold">サイズ/芯数</th>
              <th className="p-3 font-bold text-right">仕上外径 (mm)</th>
              <th className="p-3 font-bold text-right">概算質量 (kg/km)</th>
              <th className="p-3 font-bold text-right text-blue-700">理論歩留 (%)</th>
              <th className="p-3 font-bold text-center">仕様書PDF</th>
              <th className="p-3 font-bold text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item: any, idx: number) => (
              <tr key={item.id || idx} className="hover:bg-blue-50/20 transition">
                <td className="p-3">
                  <div className="font-bold text-gray-900">{item.name}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{item.maker}</div>
                </td>
                <td className="p-3 font-mono font-bold text-gray-700">
                  {item.size && item.size !== '-' ? `${item.size}sq` : '-'} / {item.core && item.core !== '-' ? `${item.core}C` : '-'}
                </td>
                <td className="p-3 font-mono text-right text-gray-600">{item.outerDiameter || '-'}</td>
                <td className="p-3 font-mono text-right text-gray-600">{item.weightPerKm || '-'}</td>
                <td className="p-3 font-mono font-black text-right text-blue-700 text-lg">{item.theoreticalRatio ? `${item.theoreticalRatio}%` : '-'}</td>
                <td className="p-3 text-center">
                  {item.pdfUrl ? (
                    <a href={item.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 text-[10px] font-bold bg-blue-50 px-2 py-1 rounded-sm border border-blue-200 w-max mx-auto transition">
                      <Icons.Document /> PDF <Icons.ExternalLink />
                    </a>
                  ) : <span className="text-gray-300 text-[10px]">-</span>}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-sm transition"><Icons.Edit /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition"><Icons.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr><td colSpan={7} className="p-10 text-center text-gray-400 font-bold text-xs">データがありません</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 登録・編集モーダル */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-2 md:p-0">
          <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl animate-in zoom-in-95 duration-200 border-t-4 border-blue-700 overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-3 md:p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="font-black text-gray-900 text-base md:text-lg flex items-center gap-2">
                {editingItem?.id ? <Icons.Edit /> : <Icons.Plus />}
                {editingItem?.id ? 'カタログ編集' : 'カタログ新規登録'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-900 bg-white border border-gray-200 p-1.5 rounded-sm shadow-sm"><Icons.Close /></button>
            </div>
            
            <div className="p-4 md:p-6 overflow-y-auto space-y-4 bg-white flex-1">
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-sm mb-4">
                    <p className="text-xs text-blue-800 font-bold">💡 ここは「仕様書・カタログの理論値」を蓄積する専用データベースです。<br/>実際の買取査定で最優先されるのは「実測マスター（電線タブ）」の数値です。</p>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">メーカー</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 font-bold shadow-sm text-sm" value={editingItem.maker || ''} onChange={e => setEditingItem({...editingItem, maker: e.target.value})} placeholder="例: 住電HST" /></div>
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">品名</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 font-black text-base shadow-sm" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} placeholder="例: 6600V CV" /></div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">サイズ (sq等)</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 shadow-sm text-sm font-mono" value={editingItem.size || ''} onChange={e => setEditingItem({...editingItem, size: e.target.value})} placeholder="例: 14" /></div>
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">芯数 (C)</label><input type="text" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 shadow-sm text-sm font-mono" value={editingItem.core || ''} onChange={e => setEditingItem({...editingItem, core: e.target.value})} placeholder="例: 3" /></div>
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4 border-t border-gray-100 pt-4">
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">仕上外径 (mm)</label><input type="number" step="0.1" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 shadow-sm text-sm text-right font-mono" value={editingItem.outerDiameter || ''} onChange={e => setEditingItem({...editingItem, outerDiameter: e.target.value})} /></div>
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">概算質量 (kg/km)</label><input type="number" className="w-full bg-white border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 shadow-sm text-sm text-right font-mono" value={editingItem.weightPerKm || ''} onChange={e => setEditingItem({...editingItem, weightPerKm: e.target.value})} /></div>
                  <div><label className="block text-[9px] md:text-[10px] font-bold text-blue-700 mb-1 uppercase tracking-widest">理論歩留まり (%)</label><input type="number" step="0.01" className="w-full bg-blue-50 border border-blue-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 shadow-sm text-lg font-black text-blue-900 text-right font-mono tabular-nums" value={editingItem.theoreticalRatio || ''} onChange={e => setEditingItem({...editingItem, theoreticalRatio: e.target.value})} /></div>
                </div>

                <div className="pt-4">
                  <label className="block text-[9px] md:text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">仕様書 PDF リンクURL</label>
                  <input type="url" className="w-full bg-gray-50 border border-gray-300 p-2.5 md:p-3 rounded-sm outline-none focus:border-blue-600 shadow-inner text-xs font-mono" value={editingItem.pdfUrl || ''} onChange={e => setEditingItem({...editingItem, pdfUrl: e.target.value})} placeholder="https://drive.google.com/..." />
                </div>
            </div>
            
            <div className="p-3 md:p-4 border-t border-gray-200 flex justify-end gap-2 md:gap-3 bg-gray-50 shrink-0">
              <button onClick={handleCloseModal} className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm text-gray-600 font-bold hover:bg-gray-200 rounded-sm transition">キャンセル</button>
              <button onClick={handleSave} disabled={isSubmitting} className="px-5 py-2 md:px-8 md:py-3 bg-blue-700 text-white font-bold rounded-sm hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-1 md:gap-2 shadow-md active:scale-95 text-sm md:text-base">
                {isSubmitting ? '保存中...' : 'カタログに保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
