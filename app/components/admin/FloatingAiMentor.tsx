// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';

const Icons = {
  Sparkles: () => <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Send: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Minimize: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>,
  Resize: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 20h4v-4m0 4l-5-5m-7-5L4 4m0 0h4M4 4v4" /></svg>
};

export const FloatingAiMentor = ({ 
    onClose, 
    isVoiceOutputEnabled,
    currentTab = 'HOME',     // ★追加: 現在開いているタブ
    sessionId = 'TUTOR_001'  // ★追加: 会話履歴紐付け用のID
}: { 
    onClose: () => void, 
    isVoiceOutputEnabled?: boolean,
    currentTab?: string,
    sessionId?: string
}) => {
  const [pos, setPos] = useState({ x: window.innerWidth - 420, y: window.innerHeight - 620 });
  const [size, setSize] = useState({ width: 380, height: 600 });
  const [isMinimized, setIsMinimized] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const [messages, setMessages] = useState<{role: 'USER' | 'AI', text: string}[]>([
      { role: 'AI', text: `お疲れ様です！ここは「${currentTab}」画面ですね。現場の作業やシステム操作で分からないことがあれば、なんでも聞いてください。このウィンドウはヘッダーを掴んで自由に移動できますよ！` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = dragStart.current.posX + (e.clientX - dragStart.current.x);
        const newY = dragStart.current.posY + (e.clientY - dragStart.current.y);
        const maxX = window.innerWidth - 50; 
        const maxY = window.innerHeight - 50;
        setPos({ 
            x: Math.max(-size.width + 50, Math.min(newX, maxX)), 
            y: Math.max(0, Math.min(newY, maxY)) 
        });
      } else if (isResizing) {
        const newW = resizeStart.current.w + (e.clientX - resizeStart.current.x);
        const newH = resizeStart.current.h + (e.clientY - resizeStart.current.y);
        setSize({
            width: Math.max(300, Math.min(newW, 800)), 
            height: Math.max(400, Math.min(newH, 1000))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      document.body.style.userSelect = 'auto';
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size.width]);

  const onDragStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    document.body.style.userSelect = 'none';
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { x: e.clientX, y: e.clientY, w: size.width, h: size.height };
    document.body.style.userSelect = 'none';
  };

  // ★ 修正：本物のAPI通信ロジックを実装
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input;
    setInput('');
    const newMessages = [...messages, { role: 'USER' as const, text: userText }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
        // 過去のメッセージ履歴をAPIが読める形に整形
        const apiMessages = newMessages.map(m => ({ 
            role: m.role === 'AI' ? 'assistant' : 'user', 
            content: m.text 
        }));
        
        // 本物のTutor APIに送信
        const res = await fetch('/api/tutor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                messages: apiMessages,
                currentTab: currentTab,
                sessionId: sessionId
            })
        });
        const result = await res.json();
        
        setMessages(prev => [...prev, { role: 'AI', text: result.text || '（応答がありませんでした）' }]);

    } catch (e) {
        setMessages(prev => [...prev, { role: 'AI', text: '通信エラーが発生しました。' }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div 
      style={{ 
          position: 'fixed', 
          left: `${pos.x}px`, 
          top: `${pos.y}px`, 
          width: isMinimized ? '300px' : `${size.width}px`, 
          height: isMinimized ? 'auto' : `${size.height}px`,
          zIndex: 9999 
      }}
      className={`flex flex-col bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-300 overflow-hidden transition-opacity duration-200 ${isDragging || isResizing ? 'opacity-90' : 'opacity-100'}`}
    >
      <div 
        onMouseDown={onDragStart}
        className="bg-gradient-to-r from-blue-900 to-indigo-900 p-3 flex justify-between items-center cursor-move select-none shrink-0"
        title="ここを掴んで移動できます"
      >
        <div className="flex items-center gap-2 pointer-events-none">
            <div className="bg-white/20 p-1.5 rounded-full"><Icons.Sparkles /></div>
            <div>
                <h3 className="text-white font-bold text-sm leading-none">教育メンター AI</h3>
                <p className="text-blue-200 text-[10px] mt-0.5">オンライン • ドラッグで移動</p>
            </div>
        </div>
        <div className="flex gap-1">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded transition">
                <Icons.Minimize />
            </button>
            <button onClick={onClose} className="p-1.5 text-white/70 hover:text-red-400 hover:bg-white/20 rounded transition">
                <Icons.Close />
            </button>
        </div>
      </div>

      {!isMinimized && (
          <>
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4 relative">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'AI' && (
                            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0 mr-2 shadow-sm text-xs"><Icons.Sparkles /></div>
                        )}
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'USER' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center shrink-0 mr-2"><Icons.Sparkles /></div>
                        <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t border-gray-200 shrink-0 relative">
                <div className="flex gap-2 relative">
                    <textarea 
                        className="flex-1 border border-gray-300 rounded-md p-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none max-h-32 min-h-[44px]"
                        rows={1}
                        placeholder="質問を入力..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <button onClick={handleSend} disabled={!input.trim() || isTyping} className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-md flex items-center justify-center transition disabled:opacity-50 shadow-sm shrink-0">
                        <Icons.Send />
                    </button>
                </div>

                <div 
                    onMouseDown={onResizeStart}
                    className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end p-0.5 text-gray-400 hover:text-blue-500 transition-colors"
                    title="サイズ変更"
                >
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                </div>
            </div>
          </>
      )}
    </div>
  );
};
