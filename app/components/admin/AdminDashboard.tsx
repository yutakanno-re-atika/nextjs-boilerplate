// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';

// ★ 先ほど作った3つのファイルを呼び出す
import { AdminHome } from './AdminHome';
import { AdminKanban } from './AdminKanban';
import { AdminPos } from './AdminPos';

const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Radar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

export const AdminDashboard = ({ data, setView, onLogout }: { data: any; setView: any; onLogout?: any }) => {
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'COMPETITOR'>('HOME');
  
  // ★ 共通の「データ状態」だけを親が持つ
  const [localReservations, setLocalReservations] = useState<any[]>([]);
  const [editingResId, setEditingResId] = useState<string | null>(null);

  useEffect(() => {
      if (data?.reservations) { setLocalReservations(data.reservations); }
  }, [data?.reservations]);

  // ★ 子コンポーネントからの画面切り替えリクエストを受け取る関数
  const handleNavigate = (tab: 'HOME' | 'OPERATIONS' | 'POS' | 'COMPETITOR', resId?: string) => {
      if (resId) setEditingResId(resId);
      else setEditingResId(null);
      setAdminTab(tab);
  };

  const handlePosSuccess = () => {
      setEditingResId(null);
      setAdminTab('OPERATIONS');
      window.location.reload(); // データ全体をリフレッシュ
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
            <button onClick={()=>handleNavigate('COMPETITOR')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition flex items-center gap-3 ${adminTab==='COMPETITOR' ? 'bg-[#111] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}><Icons.Radar /> 他社価格AI</button>
        </nav>
        {onLogout && (
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
                <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition flex items-center gap-3"><Icons.Logout /> ログアウト</button>
            </div>
        )}
      </aside>

      {/* 🔴 メインエリア（中身は子コンポーネントに丸投げ） */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col relative">
         
         {adminTab === 'HOME' && (
             <AdminHome data={data} localReservations={localReservations} onNavigate={handleNavigate} />
         )}

         {adminTab === 'OPERATIONS' && (
             <AdminKanban 
                 data={data} 
                 localReservations={localReservations} 
                 setLocalReservations={setLocalReservations} 
                 onOpenPos={(resId) => handleNavigate('POS', resId)} 
                 onAddClick={() => handleNavigate('POS')} 
             />
         )}

         {adminTab === 'POS' && (
             <AdminPos 
                 data={data} 
                 editingResId={editingResId} 
                 localReservations={localReservations} 
                 onSuccess={handlePosSuccess} 
                 onClear={() => setEditingResId(null)} 
             />
         )}

         {/* 他社価格AI（開発中モック） */}
         {adminTab === 'COMPETITOR' && (
             <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3"><Icons.Radar /></div>
                 <h3 className="text-lg font-bold text-gray-900 mb-1">他社価格チェック (開発中)</h3>
                 <p className="text-xs text-gray-500">競合サイトを自動巡回するAIの準備をしています。</p>
             </div>
         )}

      </main>
    </div>
  );
};
