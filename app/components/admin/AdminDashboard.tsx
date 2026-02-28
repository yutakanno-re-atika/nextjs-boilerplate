// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';

import { AdminHome } from './AdminHome';
import { AdminKanban } from './AdminKanban';
import { AdminPos } from './AdminPos';
import { AdminCompetitor } from './AdminCompetitor';
import { AdminProduction } from './AdminProduction';
import { AdminDatabase } from './AdminDatabase';
import { AdminClientDetail } from './AdminClientDetail';
import { AdminSales } from './AdminSales';

const Icons = {
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Kanban: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Factory: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Radar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Database: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Briefcase: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Menu: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Brain: () => <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
};

export const AdminDashboard = ({ data, setView, onLogout }: { data: any; setView: any; onLogout?: any }) => {
  const [adminTab, setAdminTab] = useState<'HOME' | 'OPERATIONS' | 'POS' | 'PRODUCTION' | 'COMPETITOR' | 'DATABASE' | 'CLIENT_DETAIL' | 'SALES'>('HOME');
  const [localReservations, setLocalReservations] = useState<any[]>([]);
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ★ AI Co-Pilot 用のステート
  const [coPilotMessage, setCoPilotMessage] = useState("お疲れ様です！本日の稼働データがまとまっています。右上の「日次レポート作成」から工場長へ報告しましょう！");
  const [isCoPilotVisible, setIsCoPilotVisible] = useState(true);

  useEffect(() => {
      if (data?.reservations) { setLocalReservations(data.reservations); }
  }, [data?.reservations]);

  // ★ タブが切り替わるたびに、AIが「今すべきこと」を空気を読んで発言する
  useEffect(() => {
      setIsCoPilotVisible(false);
      setTimeout(() => {
          let newMessage = "";
          switch(adminTab) {
              case 'HOME':
                  newMessage = "ダッシュボードですね。まずは右上の「日次レポート」を作って印刷してみてください。私が本日の戦略アドバイスを書き下ろしますよ！";
                  break;
              case 'OPERATIONS':
                  newMessage = "ここは現場のカンバンです。トラックが到着したら、カードをドラッグ＆ドロップして『計量』へ進めてくださいね。";
                  break;
              case 'POS':
                  newMessage = "POS画面です。業者名を選ぶと、過去の取引データから『ダスト引きすべきか、高値で買うべきか』を私がこっそり教えます。";
                  break;
              case 'PRODUCTION':
                  newMessage = "ナゲット製造の要です。『加工ヤード』タブで複数のロットをまとめて選んで『ブレンド加工』を押せば、一発で原価計算が終わりますよ！";
                  break;
              case 'SALES':
                  newMessage = "営業リスト画面です。リストが空なら右上の『🤖AIリード自動収集』を押してください！私が北海道中の解体業者を自動でリストアップしてきます。";
                  break;
              case 'COMPETITOR':
                  newMessage = "他社の買取価格を監視しています。右上の『AI指示書』ボタンから、私に新しいスクレイピングの指示を出すことも可能です。";
                  break;
              case 'DATABASE':
                  newMessage = "マスターデータです。ここの「設定歩留まり」を変えると、システム全体の原価計算やPOSの買取価格に瞬時に連動しますのでご注意を。";
                  break;
              default:
                  newMessage = "何かお手伝いできることはありますか？";
          }
          setCoPilotMessage(newMessage);
          setIsCoPilotVisible(true);
      }, 300); // フワッと切り替わる演出
  }, [adminTab]);

  const handleNavigate = (tab: any, id?: string) => {
      if (tab === 'POS' && id) setEditingResId(id); else setEditingResId(null);
      if (tab === 'CLIENT_DETAIL' && id) setSelectedClientName(id); else setSelectedClientName(null);
      setAdminTab(tab);
      setIsMobileMenuOpen(false);
  };

  const handlePosSuccess = () => { setEditingResId(null); setAdminTab('OPERATIONS'); window.location.reload(); };

  const MENU_ITEMS = [
      { id: 'HOME', icon: Icons.Home, label: 'ダッシュボード' },
      { id: 'OPERATIONS', icon: Icons.Kanban, label: '現場状況管理' },
      { id: 'POS', icon: Icons.Calc, label: 'POS (受付・計量)' },
      { id: 'PRODUCTION', icon: Icons.Factory, label: 'ナゲット製造管理' },
      { id: 'SALES', icon: Icons.Briefcase, label: '営業・顧客' },
      { id: 'COMPETITOR', icon: Icons.Radar, label: '相場レーダー' },
      { id: 'DATABASE', icon: Icons.Database, label: 'マスターDB' },
  ];

  return (
    <div className="h-screen w-full bg-[#FFFFFF] text-[#111111] font-sans flex flex-col md:flex-row overflow-hidden relative">
      
      <div className="md:hidden bg-[#FAFAFA] border-b border-[#E5E7EB] p-4 flex justify-between items-center z-40 flex-shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={()=>setView('LP')}>
              <div className="w-4 h-4 bg-[#D32F2F]"></div>
              <h1 className="text-lg font-black tracking-tight font-serif">FACTORY OS</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors">
              {isMobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
      </div>

      {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white/80 z-30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <aside className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          fixed md:relative top-[61px] md:top-0 left-0 h-[calc(100vh-61px)] md:h-full w-60
          bg-[#FAFAFA] border-r border-[#E5E7EB] flex flex-col z-40 flex-shrink-0
          transition-transform duration-300 ease-in-out
      `}>
        <div className="hidden md:flex p-6 items-center gap-3 cursor-pointer" onClick={()=>setView('LP')}>
            <div className="w-5 h-5 bg-[#D32F2F]"></div>
            <h1 className="text-xl font-black tracking-tighter font-serif">FACTORY OS</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-4">メインメニュー</p>
            {MENU_ITEMS.map((item) => {
                const isActive = adminTab === item.id || (item.id === 'HOME' && adminTab === 'CLIENT_DETAIL');
                return (
                    <button 
                        key={item.id}
                        onClick={() => handleNavigate(item.id)} 
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-bold transition-all flex items-center gap-3 relative ${isActive ? 'text-gray-900 bg-white shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#D32F2F] rounded-r-md"></div>}
                        <item.icon />
                        {item.label}
                    </button>
                )
            })}
        </nav>
        
        {onLogout && (
            <div className="p-4 border-t border-[#E5E7EB] flex-shrink-0">
                <button onClick={onLogout} className="w-full text-left px-3 py-2 rounded-md text-sm font-bold text-gray-500 hover:text-[#D32F2F] hover:bg-red-50 transition flex items-center gap-3">
                    <Icons.Logout /> ログアウト
                </button>
            </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#FFFFFF] p-4 md:p-8 lg:p-10 flex flex-col relative w-full selection:bg-red-100 selection:text-red-900 pb-32 md:pb-10">
         {adminTab === 'HOME' && <AdminHome data={data} localReservations={localReservations} onNavigate={handleNavigate} />}
         {adminTab === 'OPERATIONS' && <AdminKanban data={data} localReservations={localReservations} setLocalReservations={setLocalReservations} onOpenPos={(resId) => handleNavigate('POS', resId)} onAddClick={() => handleNavigate('POS')} />}
         {adminTab === 'POS' && <AdminPos data={data} editingResId={editingResId} localReservations={localReservations} onSuccess={handlePosSuccess} onClear={() => setEditingResId(null)} />}
         {adminTab === 'PRODUCTION' && <AdminProduction data={data} localReservations={localReservations} />}
         {adminTab === 'COMPETITOR' && <AdminCompetitor data={data} />}
         {adminTab === 'SALES' && <AdminSales data={data} />}
         {adminTab === 'DATABASE' && <AdminDatabase data={data} onNavigate={handleNavigate} />}
         {adminTab === 'CLIENT_DETAIL' && selectedClientName && <AdminClientDetail data={data} clientName={selectedClientName} onBack={() => handleNavigate('HOME')} />}
      </main>

      {/* ★ AI Co-Pilot (画面右下のフローティングウィジェット) */}
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-end gap-3 pointer-events-none">
          {/* 吹き出し部分 */}
          <div className={`transition-all duration-500 ease-out origin-bottom-right pointer-events-auto ${isCoPilotVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
              <div className="bg-white border border-blue-200 shadow-2xl rounded-2xl rounded-br-sm p-4 w-64 md:w-72 relative">
                  <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">FACTORY OS Co-Pilot</span>
                      <button onClick={() => setIsCoPilotVisible(false)} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                  </div>
                  <p className="text-sm font-bold text-gray-800 leading-relaxed">
                      {coPilotMessage}
                  </p>
                  {/* しっぽ部分 */}
                  <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-blue-200 transform rotate-45"></div>
              </div>
          </div>
          
          {/* アイコン部分 */}
          <button 
              onClick={() => setIsCoPilotVisible(!isCoPilotVisible)}
              className="bg-blue-600 hover:bg-blue-700 shadow-xl rounded-full p-4 transition-transform hover:scale-105 pointer-events-auto flex-shrink-0"
          >
              <div className={isCoPilotVisible ? 'animate-pulse' : ''}>
                  <Icons.Brain />
              </div>
          </button>
      </div>

    </div>
  );
};