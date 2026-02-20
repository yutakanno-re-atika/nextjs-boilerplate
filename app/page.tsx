// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { LP } from './components/lp/LP';
import { MemberDashboard } from './components/member/MemberDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MarketData } from './types';

export default function Home() {
  const [view, setView] = useState<'LP' | 'MEMBER' | 'ADMIN'>('LP');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // ★ 1. 初期ロード時の「記憶復元」と「データ取得」
  // ==========================================
  useEffect(() => {
    // ローカルストレージから通行証（記憶）を探す
    const savedUser = localStorage.getItem('factoryOS_user');
    const savedView = localStorage.getItem('factoryOS_view');

    if (savedUser && savedView) {
      // 記憶があれば、ログイン状態を復元する
      setUser(JSON.parse(savedUser));
      setView(savedView as 'MEMBER' | 'ADMIN');
    }

    // データベース（GAS）から最新相場とカンバンデータを取得
    fetchData();
  }, []);

  // データ取得用の関数（カンバン更新時にも呼び出せるように独立）
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
  // ★ 2. ログイン成功時の「記憶書き込み」
  // ==========================================
  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    const nextView = userData.role === 'ADMIN' ? 'ADMIN' : 'MEMBER';
    setView(nextView);
    
    // ブラウザの長期記憶（ローカルストレージ）に通行証を保存
    localStorage.setItem('factoryOS_user', JSON.stringify(userData));
    localStorage.setItem('factoryOS_view', nextView);
  };

  // ==========================================
  // ★ 3. ログアウト時の「記憶消去」
  // ==========================================
  const handleLogout = () => {
    setUser(null);
    setView('LP');
    localStorage.removeItem('factoryOS_user');
    localStorage.removeItem('factoryOS_view');
  };

  // ロード中の画面
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F5F5F7]">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-[#D32F2F] rounded-full mb-4"></div>
        <p className="text-gray-500 font-bold tracking-widest text-sm">LOADING FACTORY OS...</p>
      </div>
    );
  }

  // 画面の振り分け（ルーティング）
  // ※ onLogout などの関数を渡すことで、ダッシュボード側からログアウト処理を呼べるようにしています
  if (view === 'ADMIN') {
    return <AdminDashboard data={data} setView={setView} onLogout={handleLogout} />;
  }
  
  if (view === 'MEMBER') {
    return <MemberDashboard data={data} setView={setView} user={user} onLogout={handleLogout} />;
  }
  
  // デフォルトはLP（ログイン画面）
  return <LP data={data} onLoginSuccess={handleLoginSuccess} />;
}
