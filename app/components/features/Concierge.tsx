"use client";

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';

export const Concierge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが来たら一番下まで自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      
      {/* チャットウィンドウ */}
      {isOpen && (
        <div className="mb-4 w-[350px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* ヘッダー */}
          <div className="bg-[#D32F2F] p-4 text-white flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">月寒製作所 AIコンシェルジュ</p>
              <p className="text-[10px] opacity-80">Gemini 1.5 Flash 搭載</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition">
              ✕
            </button>
          </div>

          {/* メッセージエリア */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 && (
              <div className="text-xs text-gray-500 text-center mt-4 space-y-4">
                <p>👋 こんにちは！<br/>買取価格や持ち込み方法について<br/>お気軽にご質問ください。</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-white border p-2 rounded text-xs text-center text-gray-600">「今日の銅建値は？」</div>
                  <div className="bg-white border p-2 rounded text-xs text-center text-gray-600">「VVFケーブル 50kgっていくらになる？」</div>
                </div>
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-[#D32F2F] text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none shadow-sm">
                   <div className="flex gap-1 items-center h-4">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                   </div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="メッセージを入力..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D32F2F]/50"
            />
            <button type="submit" disabled={isLoading || !input.trim()} className="bg-[#111] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#D32F2F] transition disabled:opacity-50">
              ➤
            </button>
          </form>
        </div>
      )}

      {/* 起動ボタン (ランチャー) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} transition-all duration-300 bg-[#D32F2F] hover:bg-[#B71C1C] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center group`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 group-hover:scale-110 transition">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
      </button>

    </div>
  );
};
