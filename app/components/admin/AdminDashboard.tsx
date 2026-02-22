// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';

// 各種子コンポーネントを呼び出す
import { AdminHome } from './AdminHome';
import { AdminKanban } from './AdminKanban';
import { AdminPos } from './AdminPos';
import { AdminCompetitor } from './AdminCompetitor';
import { AdminProduction } from './AdminProduction';
import { AdminDatabase } from './AdminDatabase'; // ★ 追加

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Factory: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Radar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>, // ★ これが抜けていた可能性大
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

export const AdminDashboard = ({ data, setView, onLogout }: { data: any; setView: any; onLogout?: any }) => {
  // ★ 'DATABASE' タブを型に追加
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'PRODUCTION' | 'COMPETITOR' | 'DATABASE'>('HOME');
  const [localReservations, setLocalReservations] = useState<any[]>([]);
  const [editingResId, setEditingResId] = useState<string | null>(null);

  useEffect(() => {
      if (data?.reservations) { setLocalReservations(data.reservations); }
  }, [data?.reservations]);

  const handleNavigate = (tab: 'HOME' | 'OPERATIONS' | 'POS' | 'PRODUCTION' | 'COMPETITOR' | 'DATABASE', resId?: string) => {
      if (resId) setEditingResId(resId);
      else setEditingResId(null);
      setAdminTab(tab);
  };

  const handlePosSuccess = () => {
      setEditingResId(null);
      setAdminTab('OPERATIONS');
      window.location.reload(); 
  };

  return (
    <div className="h-screen w-full bg-[#F5F5F7] text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* 🔴 サイドバー（ナビゲーション） */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">
        <div className="p-5 cursor-pointer border-b border-gray-50" onClick={()=>setView('LP')}>
            <h1 className="text-xl font-serif font-bold text-gray-900">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            <button onClick={()=>handleNavigate('HOME')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='HOME' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Home /> ホーム</button>
            <button onClick={()=>handleNavigate('OPERATIONS')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='OPERATIONS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Kanban /> 現場カンバン</button>
            <button onClick={()=>handleNavigate('POS')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='POS' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Calc /> 受付・買取フロント</button>
            <button onClick={()=>handleNavigate('PRODUCTION')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='PRODUCTION' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Factory /> ナゲット製造・在庫</button>
            <button onClick={()=>handleNavigate('COMPETITOR')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='COMPETITOR' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Radar /> 競合価格レーダー</button>
            
            {/* ★ DB管理ボタン */}
            <button onClick={()=>handleNavigate('DATABASE')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='DATABASE' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Database /> DB管理・マスタ設定</button>
        </nav>
        {onLogout && (
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition flex items-center gap-3"><Icons.Logout /> ログアウト</button>
            </div>
        )}
      </aside>

      {/* 🔴 メインエリア */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col relative">
         {adminTab === 'HOME' && <AdminHome data={data} localReservations={localReservations} onNavigate={handleNavigate} />}
         {adminTab === 'OPERATIONS' && <AdminKanban data={data} localReservations={localReservations} setLocalReservations={setLocalReservations} onOpenPos={(resId) => handleNavigate('POS', resId)} onAddClick={() => handleNavigate('POS')} />}
         {adminTab === 'POS' && <AdminPos data={data} editingResId={editingResId} localReservations={localReservations} onSuccess={handlePosSuccess} onClear={() => setEditingResId(null)} />}
         {adminTab === 'PRODUCTION' && <AdminProduction data={data} localReservations={localReservations} />}
         {adminTab === 'COMPETITOR' && <AdminCompetitor data={data} />}
         
         {/* ★ データベース管理パネル */}
         {adminTab === 'DATABASE' && <AdminDatabase data={data} />}
      </main>
    </div>
  );
};
