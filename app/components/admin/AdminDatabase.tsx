// @ts-nocheck
import React, { useState, useMemo, useEffect } from 'react';

const Icons = {
    Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Save: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
    Cancel: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
    Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Plus: () => <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
    Users: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    Target: () => <svg className="w-5 h-5 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    Box: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>,
    Search: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Card: () => <svg className="w-4 h-4 text-blue-500 hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>,
    Worker: () => <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
};

export const AdminDatabase = ({ data, onNavigate }: { data: any, onNavigate?: any }) => {
    const [activeTab, setActiveTab] = useState<'CLIENTS' | 'SALES_TARGETS' | 'WIRES' | 'CASTINGS' | 'STAFF'>('CLIENTS');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [formState, setFormState] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // ★ リロードを防ぐため、データをローカルステートで管理
    const [localClients, setLocalClients] = useState(data?.clients || []);
    const [localSalesTargets, setLocalSalesTargets] = useState(data?.salesTargets || []);
    const [localWires, setLocalWires] = useState(data?.wires || []);
    const [localCastings, setLocalCastings] = useState(data?.castings || []);
    const [localStaffs, setLocalStaffs] = useState(data?.staffs || [
        { id: 'S-001', name: '工場長 (菅野)', role: 'ALL', rate: 60, status: 'ACTIVE' },
        { id: 'S-002', name: '佐藤 (検収員)', role: 'INSPECTION', rate: 45, status: 'ACTIVE' },
        { id: 'S-003', name: '鈴木 (プラント)', role: 'PLANT', rate: 45, status: 'ACTIVE' },
        { id: 'S-004', name: 'パートA (選別)', role: 'SORTING', rate: 25, status: 'ACTIVE' },
    ]);

    // 親からのdataが更新されたら同期する
    useEffect(() => {
        if(data) {
            if(data.clients) setLocalClients(data.clients);
            if(data.salesTargets) setLocalSalesTargets(data.salesTargets);
            if(data.wires) setLocalWires(data.wires);
            if(data.castings) setLocalCastings(data.castings);
            if(data.staffs) setLocalStaffs(data.staffs);
        }
    }, [data]);

    // ★ 裏側で最新データを取ってくる関数（リロードの代替）
    const fetchLatestData = async () => {
        try {
            const res = await fetch('/api/gas');
            const d = await res.json();
            if (d.status === 'success') {
                setLocalClients(d.clients || []);
                setLocalSalesTargets(d.salesTargets || []);
                setLocalWires(d.wires || []);
                setLocalCastings(d.castings || []);
                setLocalStaffs(d.staffs || []);
                
                // 次回起動時のためにキャッシュも更新しておく
                const cached = JSON.parse(localStorage.getItem('factoryOS_masterData') || '{}');
                localStorage.setItem('factoryOS_masterData', JSON.stringify({ ...cached, ...d }));
            }
        } catch (e) {
            console.error("最新データ取得エラー", e);
        }
    };

    // 最新相場の取得
    const copperPrice = Number(data?.config?.market_price) || 1450;
    const brassPrice = Number(data?.config?.brass_price) || 980;
    const zincPrice = Number(data?.config?.zinc_price) || 450;
    const leadPrice = Number(data?.config?.lead_price) || 380;

    const handleTabChange = (tab: any) => {
        setActiveTab(tab); setEditingId(null); setIsAdding(false); setFormState({}); setSearchTerm('');
    };

    const handleEditClick = (record: any) => {
        setEditingId(record.id);
        setIsAdding(false);
        setFormState({ ...record });
    };

    const handleAddClick = () => {
        setIsAdding(true);
        setEditingId(null);
        setFormState({ type: 'BRASS', rank: 'NORMAL', points: 0, priority: 'B', status: '新規', role: 'ALL', rate: 30 }); 
    };

    const getSheetName = () => {
        if (activeTab === 'CLIENTS') return 'Clients';
        if (activeTab === 'SALES_TARGETS') return 'SalesTargets';
        if (activeTab === 'WIRES') return 'Products_Wire';
        if (activeTab === 'CASTINGS') return 'Products_Casting';
        if (activeTab === 'STAFF') return 'Staff';
        return '';
    };

    const formatUpdates = (sheetName: string, form: any) => {
        if (sheetName === 'Clients') return { 1: form.name, 2: form.rank, 4: form.phone, 5: form.loginId, 6: form.password, 7: form.points, 8: form.memo };
        if (sheetName === 'SalesTargets') return { 2: form.company, 4: form.area, 5: form.priority, 11: form.status, 12: form.contact, 14: form.memo };
        if (sheetName === 'Products_Wire') return { 2: form.name, 4: form.sq, 5: form.core, 6: form.ratio }; 
        if (sheetName === 'Products_Casting') return { 1: form.name, 4: form.ratio, 2: form.type };
        if (sheetName === 'Staff') return { 1: form.name, 2: form.role, 3: form.rate, 4: form.status };
        return {};
    };

    const handleSave = async (isNew: boolean, id?: string) => {
        setIsSaving(true);
        const sheetName = getSheetName();
        const payload = isNew 
            ? { action: 'ADD_DB_RECORD', sheetName, data: formState }
            : { action: 'UPDATE_DB_RECORD', sheetName, recordId: id, updates: formatUpdates(sheetName, formState) };

        try {
            const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
            const result = await res.json();
            if (result.status === 'success') { 
                // ★ 強制リロードを廃止し、裏で最新データを取得してUIを更新
                await fetchLatestData();
                setIsAdding(false);
                setEditingId(null);
                setFormState({});
            } 
            else { alert('エラー: ' + result.message); }
        } catch (error) { alert('通信エラーが発生しました'); }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("本当にこのデータを削除しますか？\n（元には戻せません）")) return;
        setIsSaving(true);
        try {
            const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify({ action: 'DELETE_DB_RECORD', sheetName: getSheetName(), recordId: id }) });
            const result = await res.json();
            if (result.status === 'success') { 
                // ★ 強制リロードを廃止
                await fetchLatestData(); 
            } 
            else { alert('エラー: ' + result.message); }
        } catch (error) { alert('通信エラーが発生しました'); }
        setIsSaving(false);
    };

    const filteredData = useMemo(() => {
        let sourceData = [];
        // ★ ローカルステートを参照するように変更
        if (activeTab === 'CLIENTS') sourceData = localClients;
        if (activeTab === 'SALES_TARGETS') sourceData = localSalesTargets;
        if (activeTab === 'WIRES') sourceData = localWires;
        if (activeTab === 'CASTINGS') sourceData = localCastings;
        if (activeTab === 'STAFF') sourceData = localStaffs;

        if (!searchTerm) return sourceData;

        const lowerTerm = searchTerm.toLowerCase();
        return sourceData.filter((item: any) => {
            const searchString = Object.values(item).join(' ').toLowerCase();
            return searchString.includes(lowerTerm);
        });
    }, [activeTab, localClients, localSalesTargets, localWires, localCastings, localStaffs, searchTerm]);

    const inputClass = "w-full min-w-0 border border-gray-300 p-2 rounded-sm focus:border-[#D32F2F] outline-none text-sm font-bold font-mono transition";
    
    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 max-w-7xl mx-auto w-full pb-8 text-gray-800">
            <header className="mb-6 flex-shrink-0 border-b border-gray-200 pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 font-serif">
                        <span className="w-1.5 h-6 bg-[#D32F2F]"></span>
                        中枢データ管理 (CORE DB)
                    </h2>
                    <p className="text-xs text-gray-500 mt-1 font-mono">MASTER DATA & COST MANAGEMENT</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm outline-none focus:border-[#D32F2F] shadow-inner" 
                            placeholder="全件検索..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                    <button onClick={handleAddClick} disabled={isAdding || editingId !== null} className="bg-[#111] text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-[#D32F2F] transition shadow-sm flex justify-center items-center gap-1 disabled:opacity-50 flex-shrink-0">
                        <Icons.Plus /> 新規追加
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-sm overflow-hidden mb-6 shadow-sm">
                <div className="bg-white p-4 flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-sm"><Icons.Users /></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-wider">登録顧客数</p>
                        <p className="text-xl font-black text-gray-900 font-mono">{localClients.length} <span className="text-xs font-bold text-gray-400">社</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-sm"><Icons.Target /></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-wider">営業ターゲット</p>
                        <p className="text-xl font-black text-gray-900 font-mono">{localSalesTargets.filter((t:any) => t.status !== '既存取引先').length} <span className="text-xs font-bold text-gray-400">件</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 flex items-center gap-4">
                    <div className="p-2 bg-red-50 rounded-sm"><Icons.Box /></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-wider">登録マスター品目</p>
                        <p className="text-xl font-black text-gray-900 font-mono">{localWires.length + localCastings.length} <span className="text-xs font-bold text-gray-400">種</span></p>
                    </div>
                </div>
                <div className="bg-white p-4 flex items-center gap-4">
                    <div className="p-2 bg-yellow-50 rounded-sm"><Icons.Worker /></div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold tracking-wider">登録スタッフ(労務費)</p>
                        <p className="text-xl font-black text-gray-900 font-mono">{localStaffs.length} <span className="text-xs font-bold text-gray-400">名</span></p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0 overflow-x-auto no-scrollbar">
                <button onClick={() => handleTabChange('CLIENTS')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${activeTab === 'CLIENTS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>👥 顧客マスター (CRM)</button>
                <button onClick={() => handleTabChange('SALES_TARGETS')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${activeTab === 'SALES_TARGETS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>🎯 営業リスト</button>
                <button onClick={() => handleTabChange('WIRES')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${activeTab === 'WIRES' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>⚡ 電線マスター</button>
                <button onClick={() => handleTabChange('CASTINGS')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${activeTab === 'CASTINGS' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>⚙️ 非鉄マスター</button>
                <button onClick={() => handleTabChange('STAFF')} className={`px-4 py-3 text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${activeTab === 'STAFF' ? 'bg-white border-t-2 border-t-[#D32F2F] text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>⏱️ STAFF・労務費</button>
            </div>

            <div className="flex-1 bg-white border-x border-b border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-0 rounded-b-sm">
                <div className="overflow-x-auto overflow-y-auto flex-1 p-0">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead className="sticky top-0 bg-gray-100 shadow-sm z-10 border-b border-gray-200">
                            <tr>
                                {activeTab === 'CLIENTS' && (
                                    <><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[25%]">顧客名・社名</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[15%]">ランク / Pt</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[15%]">連絡先</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[15%]">ログイン情報</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[20%]">メモ</th></>
                                )}
                                {activeTab === 'SALES_TARGETS' && (
                                    <><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[25%]">企業名</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[15%]">エリア / 優先度</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[15%]">連絡先</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[15%]">ステータス</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[20%]">メモ / 提案内容</th></>
                                )}
                                {activeTab === 'WIRES' && (
                                    <><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[40%]">品名 / サイズ (sq) / 芯数 (C)</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[25%] text-center">設定歩留まり (%)</th><th className="p-3 text-[10px] font-bold text-red-600 bg-red-50 uppercase w-[25%] text-right border-l border-red-100">💰 想定単価 (現在相場換算)</th></>
                                )}
                                {activeTab === 'CASTINGS' && (
                                    <><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[30%]">品名</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[20%]">種別 (相場)</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[20%] text-center">歩留まり (%)</th><th className="p-3 text-[10px] font-bold text-red-600 bg-red-50 uppercase w-[20%] text-right border-l border-red-100">💰 想定単価 (現在相場換算)</th></>
                                )}
                                {activeTab === 'STAFF' && (
                                    <><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[30%]">従業員名</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[25%]">役割 (Role)</th><th className="p-3 text-[10px] font-bold text-blue-600 bg-blue-50 uppercase w-[25%] text-right border-l border-blue-100">⏱️ 分間チャージレート (原価)</th><th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[10%] text-center">状態</th></>
                                )}
                                <th className="p-3 text-[10px] font-bold text-gray-500 uppercase w-[10%] text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            
                            {isAdding && (
                                <tr className="bg-gray-50">
                                    {activeTab === 'CLIENTS' && (
                                        <>
                                            <td className="p-2"><input autoFocus placeholder="会社名" className={inputClass} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                            <td className="p-2 space-y-1"><select className={inputClass} onChange={e => setFormState({...formState, rank: e.target.value})} defaultValue="NORMAL"><option value="NORMAL">NORMAL</option><option value="GOLD">GOLD</option></select><input type="number" inputMode="decimal" placeholder="Pt" className={inputClass} onChange={e => setFormState({...formState, points: e.target.value})} /></td>
                                            <td className="p-2"><input placeholder="連絡先" className={inputClass} onChange={e => setFormState({...formState, phone: e.target.value})} /></td>
                                            <td className="p-2 space-y-1"><input placeholder="ID" className={inputClass} onChange={e => setFormState({...formState, loginId: e.target.value})} /><input placeholder="PW" className={inputClass} onChange={e => setFormState({...formState, password: e.target.value})} /></td>
                                            <td className="p-2"><input placeholder="メモ" className={inputClass} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                        </>
                                    )}
                                    {activeTab === 'SALES_TARGETS' && (
                                        <>
                                            <td className="p-2"><input autoFocus placeholder="企業名" className={inputClass} onChange={e => setFormState({...formState, company: e.target.value})} /></td>
                                            <td className="p-2 space-y-1"><input placeholder="エリア" className={inputClass} onChange={e => setFormState({...formState, area: e.target.value})} /><select className={inputClass} onChange={e => setFormState({...formState, priority: e.target.value})} defaultValue="B"><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></td>
                                            <td className="p-2"><input placeholder="連絡先" className={inputClass} onChange={e => setFormState({...formState, contact: e.target.value})} /></td>
                                            <td className="p-2"><select className={inputClass} onChange={e => setFormState({...formState, status: e.target.value})} defaultValue="新規"><option value="新規">新規</option><option value="アプローチ中">アプローチ中</option><option value="既存取引先">既存取引先</option></select></td>
                                            <td className="p-2"><input placeholder="メモ" className={inputClass} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                        </>
                                    )}
                                    {activeTab === 'WIRES' && (
                                        <>
                                            <td className="p-2 flex items-center gap-1">
                                                <input autoFocus placeholder="品名 (例: IV)" className={inputClass} onChange={e => setFormState({...formState, name: e.target.value})} />
                                                <input placeholder="sq" className={inputClass + " w-16"} onChange={e => setFormState({...formState, sq: e.target.value})} />
                                                <input placeholder="芯" className={inputClass + " w-12"} onChange={e => setFormState({...formState, core: e.target.value})} />
                                            </td>
                                            <td className="p-2"><input type="number" inputMode="decimal" placeholder="40" className={`${inputClass} text-center font-black text-[#D32F2F]`} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td>
                                            <td className="p-2 bg-red-50 text-right font-mono text-gray-500 text-xs flex items-center justify-end h-full">保存後に計算</td>
                                        </>
                                    )}
                                    {activeTab === 'CASTINGS' && (
                                        <>
                                            <td className="p-2"><input autoFocus placeholder="品名" className={inputClass} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                            <td className="p-2"><select className={inputClass} value={formState.type} onChange={e => setFormState({...formState, type: e.target.value})}><option value="BRASS">BRASS</option><option value="COPPER">COPPER</option><option value="ZINC">ZINC</option><option value="LEAD">LEAD</option></select></td>
                                            <td className="p-2"><input type="number" inputMode="decimal" placeholder="100" className={`${inputClass} text-center font-black text-[#D32F2F]`} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td>
                                            <td className="p-2 bg-red-50 text-right font-mono text-gray-500 text-xs flex items-center justify-end h-full">保存後に計算</td>
                                        </>
                                    )}
                                    {activeTab === 'STAFF' && (
                                        <>
                                            <td className="p-2"><input autoFocus placeholder="山田 太郎" className={inputClass} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                            <td className="p-2"><select className={inputClass} value={formState.role} onChange={e => setFormState({...formState, role: e.target.value})}><option value="ALL">ALL (全般)</option><option value="INSPECTION">INSPECTION (検収)</option><option value="SORTING">SORTING (選別)</option><option value="PLANT">PLANT (機械)</option></select></td>
                                            <td className="p-2 bg-blue-50 relative"><input type="number" inputMode="decimal" placeholder="50" className={`${inputClass} text-right font-black text-blue-700 pr-8 bg-white/50`} onChange={e => setFormState({...formState, rate: e.target.value})} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">円</span></td>
                                            <td className="p-2"><select className={inputClass} value={formState.status} onChange={e => setFormState({...formState, status: e.target.value})}><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></td>
                                        </>
                                    )}
                                    <td className="p-2 text-right">
                                        <div className="flex flex-col gap-1 items-end">
                                            <button onClick={() => handleSave(true)} disabled={isSaving} className="bg-gray-900 text-white w-full py-1.5 rounded-sm text-[10px] font-bold hover:bg-black transition">{isSaving ? '処理中' : <><Icons.Save />保存</>}</button>
                                            <button onClick={() => setIsAdding(false)} className="bg-white border border-gray-300 text-gray-700 w-full py-1.5 rounded-sm text-[10px] font-bold hover:bg-gray-50 transition">取消</button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {filteredData.map((record: any) => {
                                let estimatedPrice = 0;
                                const currentRatio = editingId === record.id ? (formState.ratio || 0) : (record.ratio || 0);

                                if (activeTab === 'WIRES') {
                                    estimatedPrice = Math.floor(copperPrice * (Number(currentRatio)/100) * 0.85);
                                } else if (activeTab === 'CASTINGS') {
                                    let base = copperPrice;
                                    const rType = editingId === record.id ? formState.type : record.type;
                                    if (rType === 'BRASS') base = brassPrice;
                                    if (rType === 'ZINC') base = zincPrice;
                                    if (rType === 'LEAD') base = leadPrice;
                                    estimatedPrice = Math.floor(base * (Number(currentRatio)/100) * 0.90);
                                }

                                return (
                                <tr key={record.id} className="hover:bg-gray-50 transition">
                                    
                                    {editingId === record.id ? (
                                        <>
                                            {activeTab === 'CLIENTS' && (
                                                <>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                                    <td className="p-2 space-y-1"><select className={inputClass} value={formState.rank || 'NORMAL'} onChange={e => setFormState({...formState, rank: e.target.value})}><option value="NORMAL">NORMAL</option><option value="GOLD">GOLD</option></select><input type="number" inputMode="decimal" className={inputClass} value={formState.points || 0} onChange={e => setFormState({...formState, points: e.target.value})} /></td>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.phone || ''} onChange={e => setFormState({...formState, phone: e.target.value})} /></td>
                                                    <td className="p-2 space-y-1"><input type="text" className={inputClass} value={formState.loginId || ''} onChange={e => setFormState({...formState, loginId: e.target.value})} /><input type="text" className={inputClass} value={formState.password || ''} onChange={e => setFormState({...formState, password: e.target.value})} /></td>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.memo || ''} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                                </>
                                            )}
                                            {activeTab === 'SALES_TARGETS' && (
                                                <>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.company || ''} onChange={e => setFormState({...formState, company: e.target.value})} /></td>
                                                    <td className="p-2 space-y-1"><input type="text" className={inputClass} value={formState.area || ''} onChange={e => setFormState({...formState, area: e.target.value})} /><select className={inputClass} value={formState.priority || 'B'} onChange={e => setFormState({...formState, priority: e.target.value})}><option value="S">S</option><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></td>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.contact || ''} onChange={e => setFormState({...formState, contact: e.target.value})} /></td>
                                                    <td className="p-2"><select className={inputClass} value={formState.status || '新規'} onChange={e => setFormState({...formState, status: e.target.value})}><option value="新規">新規</option><option value="アプローチ中">アプローチ中</option><option value="既存取引先">既存取引先</option></select></td>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.memo || ''} onChange={e => setFormState({...formState, memo: e.target.value})} /></td>
                                                </>
                                            )}
                                            {activeTab === 'WIRES' && (
                                                <>
                                                    <td className="p-2 flex items-center gap-1">
                                                        <input type="text" className={inputClass} value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} />
                                                        <input type="text" placeholder="sq" className={inputClass + " w-16"} value={formState.sq === '-' ? '' : (formState.sq || '')} onChange={e => setFormState({...formState, sq: e.target.value})} />
                                                        <input type="text" placeholder="芯" className={inputClass + " w-12"} value={formState.core === '-' ? '' : (formState.core || '')} onChange={e => setFormState({...formState, core: e.target.value})} />
                                                    </td>
                                                    <td className="p-2"><input type="number" inputMode="decimal" className={`${inputClass} text-center font-black text-[#D32F2F]`} value={formState.ratio || 0} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td>
                                                    <td className="p-2 bg-red-50 border-l border-red-100 text-right"><span className="text-lg font-black font-mono text-red-600">¥{estimatedPrice.toLocaleString()}</span></td>
                                                </>
                                            )}
                                            {activeTab === 'CASTINGS' && (
                                                <>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                                    <td className="p-2"><select className={inputClass} value={formState.type || 'BRASS'} onChange={e => setFormState({...formState, type: e.target.value})}><option value="BRASS">BRASS</option><option value="COPPER">COPPER</option><option value="ZINC">ZINC</option><option value="LEAD">LEAD</option></select></td>
                                                    <td className="p-2"><input type="number" inputMode="decimal" className={`${inputClass} text-center font-black text-[#D32F2F]`} value={formState.ratio || 0} onChange={e => setFormState({...formState, ratio: e.target.value})} /></td>
                                                    <td className="p-2 bg-red-50 border-l border-red-100 text-right"><span className="text-lg font-black font-mono text-red-600">¥{estimatedPrice.toLocaleString()}</span></td>
                                                </>
                                            )}
                                            {activeTab === 'STAFF' && (
                                                <>
                                                    <td className="p-2"><input type="text" className={inputClass} value={formState.name || ''} onChange={e => setFormState({...formState, name: e.target.value})} /></td>
                                                    <td className="p-2"><select className={inputClass} value={formState.role || 'ALL'} onChange={e => setFormState({...formState, role: e.target.value})}><option value="ALL">ALL (全般)</option><option value="INSPECTION">INSPECTION (検収)</option><option value="SORTING">SORTING (選別)</option><option value="PLANT">PLANT (機械)</option></select></td>
                                                    <td className="p-2 bg-blue-50 relative border-l border-blue-100"><input type="number" inputMode="decimal" className={`${inputClass} text-right font-black text-blue-700 pr-8 bg-white/50`} value={formState.rate || 0} onChange={e => setFormState({...formState, rate: e.target.value})} /><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">円</span></td>
                                                    <td className="p-2"><select className={inputClass} value={formState.status || 'ACTIVE'} onChange={e => setFormState({...formState, status: e.target.value})}><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></td>
                                                </>
                                            )}
                                            <td className="p-2 text-right">
                                                <div className="flex flex-col gap-1 items-end">
                                                    <button onClick={() => handleSave(false, record.id)} disabled={isSaving} className="bg-gray-900 text-white w-full py-1.5 rounded-sm text-[10px] font-bold hover:bg-black transition">{isSaving ? '処理中' : <><Icons.Save />保存</>}</button>
                                                    <button onClick={() => setEditingId(null)} className="bg-white border border-gray-300 text-gray-700 w-full py-1.5 rounded-sm text-[10px] font-bold hover:bg-gray-50 transition">取消</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {activeTab === 'CLIENTS' && (
                                                <>
                                                    <td className="p-3 align-top">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-gray-900">{record.name}</span>
                                                            {onNavigate && (
                                                                <button onClick={() => onNavigate('CLIENT_DETAIL', record.name)} className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1 hover:bg-blue-600 hover:text-white transition group" title="取引カルテを開く">
                                                                    <Icons.Card /> <span className="hidden group-hover:inline">カルテ</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 align-top"><span className={`text-[10px] px-1.5 py-0.5 border rounded-sm font-mono ${record.rank === 'GOLD' ? 'bg-[#111] text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{record.rank}</span><div className="text-xs font-mono text-gray-600 mt-1">{record.points} pt</div></td>
                                                    <td className="p-3 align-top text-gray-600 font-mono text-xs">{record.phone || '-'}</td>
                                                    <td className="p-3 align-top text-[10px] font-mono text-gray-500 space-y-0.5"><div>ID: <span className="text-gray-900 font-bold">{record.loginId}</span></div><div>PW: <span className="text-gray-900 font-bold">{record.password}</span></div></td>
                                                    <td className="p-3 align-top text-xs text-gray-500" title={record.memo}>{record.memo || '-'}</td>
                                                </>
                                            )}
                                            {activeTab === 'SALES_TARGETS' && (
                                                <>
                                                    <td className="p-3 align-top font-bold text-gray-900">{record.company}</td>
                                                    <td className="p-3 align-top"><div className="text-xs text-gray-500 mb-0.5 font-mono">{record.area || '-'}</div><span className="text-[10px] px-1.5 py-0.5 rounded-sm border bg-gray-50 text-gray-600 font-mono">Rank {record.priority}</span></td>
                                                    <td className="p-3 align-top text-gray-600 font-mono text-xs">{record.contact || '-'}</td>
                                                    <td className="p-3 align-top"><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-sm text-[10px] border border-gray-200 font-bold">{record.status}</span></td>
                                                    <td className="p-3 align-top text-xs text-gray-500">{record.memo || record.proposal || '-'}</td>
                                                </>
                                            )}
                                            {activeTab === 'WIRES' && (
                                                <>
                                                    <td className="p-3 align-top font-bold text-gray-900">
                                                        {record.name}
                                                        {record.sq && record.sq !== '-' && <span className="ml-2 text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded">{record.sq}sq</span>}
                                                        {record.core && record.core !== '-' && <span className="ml-1 text-xs text-gray-500 font-mono bg-gray-100 px-1 rounded">{record.core}C</span>}
                                                    </td>
                                                    <td className="p-3 align-top text-center"><span className="text-sm font-mono font-black text-gray-700">{record.ratio}%</span></td>
                                                    <td className="p-3 align-top bg-red-50/30 border-l border-red-50 text-right"><span className="text-base font-black font-mono text-[#D32F2F]">¥{estimatedPrice.toLocaleString()}</span></td>
                                                </>
                                            )}
                                            {activeTab === 'CASTINGS' && (
                                                <>
                                                    <td className="p-3 align-top font-bold text-gray-900">{record.name}</td>
                                                    <td className="p-3 align-top"><span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm border border-gray-200 text-[10px] font-mono">{record.type}</span></td>
                                                    <td className="p-3 align-top text-center"><span className="text-sm font-mono font-black text-gray-700">{record.ratio}%</span></td>
                                                    <td className="p-3 align-top bg-red-50/30 border-l border-red-50 text-right"><span className="text-base font-black font-mono text-[#D32F2F]">¥{estimatedPrice.toLocaleString()}</span></td>
                                                </>
                                            )}
                                            {activeTab === 'STAFF' && (
                                                <>
                                                    <td className="p-3 align-top font-bold text-gray-900">{record.name}</td>
                                                    <td className="p-3 align-top"><span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm border border-gray-200 text-[10px] font-mono">{record.role}</span></td>
                                                    <td className="p-3 align-top bg-blue-50/30 border-l border-blue-50 text-right">
                                                        <span className="text-base font-black font-mono text-blue-700">{record.rate}</span>
                                                        <span className="text-[10px] text-gray-500 ml-1">円/分</span>
                                                        <div className="text-[10px] text-gray-400 mt-1 font-mono">(時給換算: {(record.rate * 60).toLocaleString()}円)</div>
                                                    </td>
                                                    <td className="p-3 align-top text-center">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${record.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{record.status}</span>
                                                    </td>
                                                </>
                                            )}
                                            <td className="p-3 align-top text-right">
                                                <div className="flex flex-col gap-1 items-end">
                                                    <button onClick={() => handleEditClick(record)} className="text-[10px] font-bold text-gray-500 border border-gray-300 px-2 py-1 hover:border-gray-900 hover:text-gray-900 transition rounded-sm w-full text-center">編集</button>
                                                    <button onClick={() => handleDelete(record.id)} className="text-[10px] font-bold text-gray-400 hover:text-[#D32F2F] transition w-full text-center py-1">削除</button>
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                                );
                            })}
                            
                            {filteredData.length === 0 && !isAdding && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-gray-400 font-bold text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <Icons.Search />
                                            データが見つかりません
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
