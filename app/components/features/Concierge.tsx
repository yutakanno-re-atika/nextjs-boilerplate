"use client";
import React, { useState, useEffect, useRef } from 'react';

// アイコン類
const ChatIcon = () => <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
const CloseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const SendIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const RobotIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h2m4 0h2m-6 4h4" /></svg>;

export const Concierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState<{text: string, isBot: boolean}[]>([
    { text: "こんにちは！月寒製作所のAIコンシェルジュです。本日の買取価格や、お持ち込みについて何でもご質問ください！", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが来たら一番下までスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ツールチップは10秒後、または開いた時に消す
  useEffect(() => {
    if (isOpen) setShowTooltip(false);
    const timer = setTimeout(() => setShowTooltip(false), 10000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // お客様のメッセージを追加
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');

    // ★ ここは後日、GAS（AIの頭脳）と接続します！今は仮の返答。
    setTimeout(() => {
        setMessages(prev => [...prev, { 
            text: "（※現在はAI接続の準備中です。工場長がご旅行から戻られ次第、最新価格や他社比較を踏まえたトップセールス回答ができるようになります！）", 
            isBot: true 
        }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      
      {/* 吹き出し（ツールチップ）アピール */}
      {showTooltip && !isOpen && (
        <div 
            className="mb-4 mr-2 animate-bounce bg-white text-gray-800 px-4 py-3 rounded-2xl shadow-xl border border-gray-100 relative max-w-[220px] cursor-pointer" 
            onClick={() => setIsOpen(true)}
        >
            <p className="text-xs font-bold leading-relaxed">
                <span className="text-[#D32F2F]">本日の価格</span>や持ち込みについて、AIがすぐにお答えします！🤖
            </p>
            {/* 吹き出しのしっぽ */}
            <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
        </div>
      )}

      {/* 開いているときのチャットウィンドウ */}
      {isOpen && (
        <div className="mb-4 bg-white w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* ヘッダー */}
          <div className="bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white p-4 flex justify-between items-center shadow-sm z-10">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <RobotIcon />
                </div>
                <div>
                    <h3 className="font-bold text-sm tracking-wider">月寒 AIコンシェルジュ</h3>
                    <p className="text-[10px] text-red-100 flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_5px_rgba(74,222,128,0.8)]"></span>
                        オンライン (即時回答)
                    </p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded hover:bg-white/20 transition">
              <CloseIcon />
            </button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#F5F5F7] space-y-4">
            <div className="text-center mb-6">
                <span className="bg-gray-200/50 text-gray-500 text-[10px] px-3 py-1 rounded-full font-bold">今日</span>
            </div>
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 text-sm ${msg.isBot ? 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-2xl rounded-tl-sm' : 'bg-[#111] text-white shadow-md rounded-2xl rounded-tr-sm'}`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="「VVFの価格は？」「何キロから？」" 
                className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-12 py-3.5 text-sm outline-none focus:border-[#D32F2F] focus:ring-2 focus:ring-red-100 transition font-medium"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="absolute right-1.5 w-10 h-10 flex items-center justify-center bg-[#D32F2F] text-white rounded-full hover:bg-red-700 transition disabled:opacity-30 disabled:hover:bg-[#D32F2F] shadow-sm"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* フローティングボタン本体 */}
      {!isOpen && (
          <button 
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-r from-[#D32F2F] to-[#B71C1C] text-white rounded-full shadow-2xl hover:shadow-red-900/50 hover:scale-105 transition-all duration-300 flex items-center justify-center relative group"
          >
            {/* オンラインバッジ（緑のドット） */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full z-10 shadow-sm"></span>
            
            {/* 波紋エフェクト（常に薄く波打つ） */}
            <span className="absolute inset-0 rounded-full bg-[#D32F2F] animate-ping opacity-20 duration-1000"></span>
            
            <ChatIcon />
          </button>
      )}
    </div>
  );
};
