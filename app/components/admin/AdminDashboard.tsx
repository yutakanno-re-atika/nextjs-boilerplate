// @ts-nocheck
"use client";
import React, { useState, useEffect, useRef } from 'react';

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
  Brain: () => <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm1-11h-2v2h2V9zm0 4h-2v6h2v-6z" /></svg>,
  Shield: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  School: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
};

const ROLE_PERMISSIONS = {
  ADMIN:   ['HOME', 'OPERATIONS', 'POS', 'PRODUCTION', 'COMPETITOR', 'DATABASE', 'SALES', 'CLIENT_DETAIL'],
  MANAGER: ['HOME', 'OPERATIONS', 'POS', 'PRODUCTION', 'COMPETITOR', 'DATABASE', 'SALES', 'CLIENT_DETAIL'],
  FRONT:   ['OPERATIONS', 'POS', 'CLIENT_DETAIL'],
  PLANT:   ['OPERATIONS', 'PRODUCTION'],
  SALES:   ['SALES', 'CLIENT_DETAIL', 'COMPETITOR']
};

export const AdminDashboard = ({ user, data, setView, onLogout }: { user?: any; data: any; setView: any; onLogout?: any }) => {
  const currentRole = user?.role || 'FRONT';
  const allowedTabs = ROLE_PERMISSIONS[currentRole as keyof typeof ROLE_PERMISSIONS] || ROLE_PERMISSIONS.FRONT;

  const defaultTab = () => {
    if (!user || !user.role) return 'OPERATIONS';
    if (user.role === 'ADMIN' || user.role === 'MANAGER') return 'HOME';
    if (user.role === 'FRONT') return 'POS';
    if (user.role === 'PLANT') return 'PRODUCTION';
    if (user.role === 'SALES') return 'SALES';
    return 'OPERATIONS';
  };

  const [adminTab, setAdminTab] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('factoryOS_adminTab');
      if (savedTab === 'CLIENT_DETAIL') return 'HOME';
      if (savedTab && allowedTabs.includes(savedTab)) {
        return savedTab;
      }
    }
    return defaultTab();
  });

  const [localReservations, setLocalReservations] = useState<any[]>([]);
  const [editingResId, setEditingResId] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 各種トグル
  const [isCoPilotEnabled, setIsCoPilotEnabled] = useState(true);
  const [isVoiceOutputEnabled, setIsVoiceOutputEnabled] = useState(true); 
  const [isLearningMode, setIsLearningMode] = useState(false); // ★ 追加: 学習モード
  
  // Co-Pilotチャット用ステート
  const [coPilotMessages, setCoPilotMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [coPilotInput, setCoPilotInput] = useState("");
  const [isCoPilotVisible, setIsCoPilotVisible] = useState(false);
  const [isCoPilotTyping, setIsCoPilotTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('factoryOS_adminTab', adminTab);
    }
  }, [adminTab]);

  useEffect(() => {
    if (!allowedTabs.includes(adminTab)) {
      console.warn(`[FACTORY OS Guard] Access Denied: User role ${currentRole} cannot access ${adminTab}`);
      setAdminTab(defaultTab()); 
    }
  }, [adminTab, currentRole, allowedTabs]);

  useEffect(() => {
      if (data?.reservations) { setLocalReservations(data.reservations); }
  }, [data?.reservations]);

  // タブ切り替え時の初期メッセージ生成
  useEffect(() => {
      if (!isCoPilotEnabled) {
          setIsCoPilotVisible(false);
          return;
      }
      
      setIsCoPilotVisible(false);
      setTimeout(() => {
          let newMessage = "";
          switch(adminTab) {
              case 'HOME': newMessage = "ダッシュボードですね。右上の「日次レポート」から戦略アドバイスを書き下ろします！"; break;
              case 'OPERATIONS': newMessage = "現場のカンバンです。処理待ちのロットを『プラント稼働』へ進めてください。"; break;
              case 'POS': newMessage = "POS画面です。カメラアイコンから『AI 線種分析』が使えますよ。"; break;
              case 'PRODUCTION': newMessage = "ナゲット製造の要です。排出された4種類の重量を計量し、確実に入力してください。"; break;
              case 'SALES': newMessage = "営業リスト画面です。右上の『🤖AIスナイパー』で私がターゲット企業を自動抽出します！"; break;
              case 'COMPETITOR': newMessage = "他社の買取価格を監視し、自社の歩留まり設定を調整する画面です。"; break;
              case 'DATABASE': newMessage = "マスターデータです。AI推論の確認や、新しい線種の登録ができます。"; break;
              default: newMessage = "今日も1日、ご安全に！";
          }
          
          if (isLearningMode) {
              newMessage = `【学習モード作動中】\nここは「${adminTab}」画面です。操作方法や用語（歩留まりとは？等）で分からないことがあれば、下の入力欄から何でも質問してください。`;
          }
          
          setCoPilotMessages([{ role: 'ai', text: newMessage }]);
          setIsCoPilotVisible(true);
      }, 300);
  }, [adminTab, currentRole, isCoPilotEnabled, isLearningMode]);

  useEffect(() => {
      if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [coPilotMessages, isCoPilotTyping]);

  const handleSendCoPilot = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!coPilotInput.trim() || isCoPilotTyping) return;

      const userText = coPilotInput;
      setCoPilotInput("");
      setCoPilotMessages(prev => [...prev, { role: 'user', text: userText }]);
      setIsCoPilotTyping(true);

      try {
          const res = await fetch('/api/tutor', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                  messages: [{ role: 'user', content: userText }],
                  currentTab: adminTab 
              })
          });
          const result = await res.json();
          setCoPilotMessages(prev => [...prev, { role: 'ai', text: result.text || 'エラーが発生しました。' }]);
      } catch (err) {
          setCoPilotMessages(prev => [...prev, { role: 'ai', text: '通信エラーが発生しました。' }]);
      }
      setIsCoPilotTyping(false);
  };

  const handleNavigate = (tab: any, id?: string) => {
      if (!allowedTabs.includes(tab)) {
          alert("この機能にアクセスする権限がありません。");
          return;
      }
      if (tab === 'POS' && id) setEditingResId(id); else setEditingResId(null);
      if (tab === 'CLIENT_DETAIL' && id) setSelectedClientName(id); else setSelectedClientName(null);
      setAdminTab(tab);
      setIsMobileMenuOpen(false);
  };

  const handlePosSuccess = () => { setEditingResId(null); setAdminTab('OPERATIONS'); window.location.reload(); };

  const ALL_MENU_ITEMS = [
      { id: 'HOME', icon: Icons.Home, label: 'ダッシュボード', reqRole: 'MANAGER〜' },
      { id: 'OPERATIONS', icon: Icons.Kanban, label: '現場状況管理', reqRole: 'FRONT/PLANT〜' },
      { id: 'POS', icon: Icons.Calc, label: 'POS (受付・計量)', reqRole: 'FRONT〜' },
      { id: 'PRODUCTION', icon: Icons.Factory, label: '製造(WN-800)', reqRole: 'PLANT〜' },
      { id: 'SALES', icon: Icons.Briefcase, label: '営業・顧客', reqRole: 'SALES〜' },
      { id: 'COMPETITOR', icon: Icons.Radar, label: '相場レーダー', reqRole: 'MANAGER〜' },
      { id: 'DATABASE', icon: Icons.Database, label: 'マスターDB', reqRole: 'MANAGER〜' },
  ];

  const MENU_ITEMS = ALL_MENU_ITEMS.filter(item => allowedTabs.includes(item.id as keyof typeof ROLE_PERMISSIONS['ADMIN']));

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
        
        <div className="px-5 pb-4 border-b border-gray-200 flex flex-col gap-1">
            <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name || user?.companyName || 'スタッフ'}</p>
                {currentRole === 'ADMIN' && <Icons.Shield />}
            </div>
            <p className="text-[10px] font-mono text-white font-bold bg-gray-800 px-2 py-0.5 rounded-sm inline-block w-fit">
               [現在] ROLE: {currentRole}
            </p>
            
            <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="text-blue-500"><Icons.Brain /></span> AI Co-Pilot
                    </span>
                    <button onClick={() => setIsCoPilotEnabled(!isCoPilotEnabled)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isCoPilotEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isCoPilotEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                </div>
                {/* ★ 学習モード・トグル */}
                <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="text-green-600"><Icons.School /></span> 学習モード
                    </span>
                    <button onClick={() => { setIsLearningMode(!isLearningMode); if(!isLearningMode) setIsCoPilotEnabled(true); }} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isLearningMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isLearningMode ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                </div>
                <div className="flex items-center justify-between bg-white border border-gray-200 p-2 rounded-md shadow-sm">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <span className="text-blue-500">🔊</span> 音声読み上げ
                    </span>
                    <button onClick={() => setIsVoiceOutputEnabled(!isVoiceOutputEnabled)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${isVoiceOutputEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isVoiceOutputEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 mt-2">メインメニュー</p>
            {MENU_ITEMS.map((item) => {
                const isActive = adminTab === item.id || (item.id === 'HOME' && adminTab === 'CLIENT_DETAIL');
                return (
                    <button 
                        key={item.id}
                        onClick={() => handleNavigate(item.id)} 
                        className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-bold transition-all flex items-center justify-between group relative ${isActive ? 'text-gray-900 bg-white shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#D32F2F] rounded-r-md"></div>}
                        <div className="flex items-center gap-3">
                            <item.icon />
                            {item.label}
                        </div>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-sm ${isActive ? 'bg-gray-100 text-gray-500' : 'bg-gray-200 text-gray-400 group-hover:bg-gray-300'}`}>
                            {item.reqRole}
                        </span>
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
         {adminTab === 'OPERATIONS' && <AdminKanban data={data} onSuccess={() => {}} />}
         {adminTab === 'POS' && <AdminPos data={data} editingResId={editingResId} localReservations={localReservations} onSuccess={handlePosSuccess} onClear={() => setEditingResId(null)} isVoiceOutputEnabled={isVoiceOutputEnabled} />}
         {adminTab === 'PRODUCTION' && <AdminProduction data={data} localReservations={localReservations} />}
         {adminTab === 'COMPETITOR' && <AdminCompetitor data={data} />}
         {adminTab === 'SALES' && <AdminSales data={data} />}
         {adminTab === 'DATABASE' && <AdminDatabase data={data} isVoiceOutputEnabled={isVoiceOutputEnabled} />}
         {adminTab === 'CLIENT_DETAIL' && selectedClientName && <AdminClientDetail data={data} clientName={selectedClientName} onBack={() => handleNavigate('HOME')} />}
      </main>

      {/* ★ 拡張された AI Co-Pilot (学習モード対応) */}
      {isCoPilotEnabled && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-end gap-3 pointer-events-none">
              <div className={`transition-all duration-500 ease-out origin-bottom-right pointer-events-auto ${isCoPilotVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}>
                  <div className={`bg-white border shadow-2xl rounded-2xl rounded-br-sm flex flex-col overflow-hidden relative ${isLearningMode ? 'w-80 md:w-96 h-96 border-green-300' : 'w-64 md:w-72 border-blue-200 p-4'}`}>
                      
                      {/* 通常モードの表示 */}
                      {!isLearningMode && (
                          <>
                              <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase">FACTORY OS Co-Pilot</span>
                                  <button onClick={() => setIsCoPilotVisible(false)} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                              </div>
                              <p className="text-sm font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                                  {coPilotMessages[coPilotMessages.length - 1]?.text}
                              </p>
                              <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white border-b border-r border-blue-200 transform rotate-45"></div>
                          </>
                      )}

                      {/* 学習モードの表示 (チャットUI) */}
                      {isLearningMode && (
                          <>
                              <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 flex justify-between items-center shrink-0">
                                  <span className="text-xs font-bold text-white tracking-widest flex items-center gap-1.5"><Icons.School /> 教育メンターAI</span>
                                  <button onClick={() => setIsCoPilotVisible(false)} className="text-white/80 hover:text-white"><Icons.X /></button>
                              </div>
                              
                              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3" ref={chatScrollRef}>
                                  {coPilotMessages.map((msg, idx) => (
                                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                          <div className={`text-sm px-3 py-2 rounded-xl max-w-[85%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                                              {msg.text}
                                          </div>
                                      </div>
                                  ))}
                                  {isCoPilotTyping && (
                                      <div className="flex justify-start">
                                          <div className="bg-white border border-gray-200 px-3 py-2 rounded-xl rounded-bl-sm shadow-sm flex gap-1 items-center">
                                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <form onSubmit={handleSendCoPilot} className="p-2 bg-white border-t border-gray-200 shrink-0 flex gap-2">
                                  <input 
                                      type="text" 
                                      value={coPilotInput} 
                                      onChange={e => setCoPilotInput(e.target.value)} 
                                      placeholder="操作方法を質問する..." 
                                      className="flex-1 bg-gray-100 border-transparent rounded-sm px-3 py-2 text-sm focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition"
                                      disabled={isCoPilotTyping}
                                  />
                                  <button type="submit" disabled={!coPilotInput.trim() || isCoPilotTyping} className="bg-green-600 text-white p-2 rounded-sm hover:bg-green-700 disabled:bg-gray-300 transition">
                                      <Icons.Send />
                                  </button>
                              </form>
                          </>
                      )}
                  </div>
              </div>
              
              <button 
                  onClick={() => setIsCoPilotVisible(!isCoPilotVisible)}
                  className={`${isLearningMode ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white shadow-xl rounded-full p-4 transition-transform hover:scale-105 pointer-events-auto flex-shrink-0`}
              >
                  <div className={isCoPilotVisible && !isLearningMode ? 'animate-pulse' : ''}>
                      {isLearningMode ? <Icons.School /> : <Icons.Brain />}
                  </div>
              </button>
          </div>
      )}

    </div>
  );
};
