// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
// ★ ボスの環境に合わせた正しいパス
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MemberDashboard } from './components/member/MemberDashboard';
import { MarketData } from './types'; // typesの場所が違う場合は修正してください

export default function Home() {
  // 画面とユーザーの記憶ステート
  const [view, setView] = useState<'LP' | 'MEMBER' | 'ADMIN'>('LP');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ログインフォーム用のステート
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ==========================================
  // ★ 1. 初期ロード時の「記憶復元」と「データ取得」
  // ==========================================
  useEffect(() => {
    // ローカルストレージから通行証を探す
    const savedUser = localStorage.getItem('factoryOS_user');
    const savedView = localStorage.getItem('factoryOS_view');

    if (savedUser && savedView) {
      setUser(JSON.parse(savedUser));
      setView(savedView as 'MEMBER' | 'ADMIN');
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/gas');
      const resData = await res.json();
      if (resData.status === 'success') {
        setData(resData);
      }
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ★ 2. ログイン処理 ＆「記憶書き込み」
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'AUTH_LOGIN', loginId, password })
      });
      const result = await res.json();

      if (result.status === 'success') {
        const userData = result.user;
        setUser(userData);
        const nextView = userData.role === 'ADMIN' ? 'ADMIN' : 'MEMBER';
        setView(nextView);
        
        // ブラウザの長期記憶に保存（これでリロードしても消えません！）
        localStorage.setItem('factoryOS_user', JSON.stringify(userData));
        localStorage.setItem('factoryOS_view', nextView);
      } else {
        setLoginError(result.message || 'ログインに失敗しました');
      }
    } catch (err) {
      setLoginError('通信エラーが発生しました');
    }
    setIsLoggingIn(false);
  };

  // ==========================================
  // ★ 3. ログアウト時の「記憶消去」
  // ==========================================
  const handleLogout = () => {
    setUser(null);
    setView('LP');
    setLoginId('');
    setPassword('');
    localStorage.removeItem('factoryOS_user');
    localStorage.removeItem('factoryOS_view');
  };

  // --- 画面レンダリング ---

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7]">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-[#D32F2F] rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold tracking-widest text-sm">LOADING FACTORY OS...</p>
      </div>
    );
  }

  // ★ 記憶があれば、LPをスキップしてそれぞれのダッシュボードを即座に表示！
  if (view === 'ADMIN') {
    return <AdminDashboard data={data} setView={setView} onLogout={handleLogout} />;
  }
  
  if (view === 'MEMBER') {
    return <MemberDashboard data={data} setView={setView} user={user} onLogout={handleLogout} />;
  }
  
  // ==========================================
  // ★ 4. LP（トップページ・ログイン画面）のUI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#111] p-8 text-center">
            <h1 className="text-3xl font-serif font-bold text-white tracking-wider">FACTORY<span className="text-[#D32F2F]">OS</span></h1>
            <p className="text-gray-400 text-xs mt-2 font-bold tracking-widest">TSUKISAMU SEISAKUSHO</p>
        </div>
        
        <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">システムにログイン</h2>
            
            {loginError && (
                <div className="bg-red-50 text-[#D32F2F] p-3 rounded-lg text-sm font-bold mb-6 text-center border border-red-100">
                    {loginError}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">ログインID</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-gray-900 focus:border-[#D32F2F] outline-none transition" 
                      value={loginId} 
                      onChange={(e)=>setLoginId(e.target.value)} 
                      required 
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">パスワード</label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-gray-900 focus:border-[#D32F2F] outline-none transition" 
                      value={password} 
                      onChange={(e)=>setPassword(e.target.value)} 
                      required 
                    />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="w-full bg-[#D32F2F] text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition shadow-md disabled:bg-gray-300 mt-4"
                >
                  {isLoggingIn ? '認証中...' : 'ログイン'}
                </button>
            </form>
        </div>
        
        {/* 本日の相場表示 (LPのアクセント) */}
        {data?.config?.market_price && (
            <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500 font-bold">本日の基準銅建値</p>
                <p className="text-xl font-black text-gray-900 tracking-tighter">¥{Number(data.config.market_price).toLocaleString()}</p>
            </div>
        )}
      </div>
      
      {/* 以前ボスのLPにあった他のコンテンツがあれば、この下に追加してください */}
      
    </div>
  );
}
