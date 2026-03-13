// app/components/admin/AdminDeepScout.tsx
// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>,
  Camera: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Brain: () => <svg className="w-6 h-6 animate-pulse text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

export const AdminDeepScout = ({ onClose, wireSpecs }: { onClose: () => void, wireSpecs: any[] }) => {
  const [images, setImages] = useState<string[]>([]);
  const [hint, setHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // 分析に特化するため、高解像度（最大2000px）、高画質（0.92）で圧縮。
  // ただし、通信量制限を考慮し、Vercelのペイロードリミットに注意。
  const compressImageHighRes = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 2000; 
          let w = img.width; let h = img.height;
          if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          if(!ctx) return reject();
          ctx.drawImage(img, 0, 0, w, h);
          // プレフィックス(data:image/jpeg;base64,)を外して返す
          const base64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
          resolve(base64);
        };
        img.onerror = () => reject();
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const newImages = [];
      for(let i=0; i<files.length; i++) {
        // 画像は最大4枚程度に制限（ペイロード対策）
        if(images.length + i >= 4) {
          alert("通信制限のため、画像は最大4枚までにしてください。");
          break;
        }
        const b64 = await compressImageHighRes(files[i]);
        newImages.push(b64);
      }
      setImages(prev => [...prev, ...newImages]);
    } catch(err) {
      alert("画像処理に失敗しました。");
    }
    e.target.value = '';
  };

  const handleAnalyze = async () => {
    if(images.length === 0) return alert("画像を撮影してください。");
    setIsAnalyzing(true);
    setResult(null);

    // カタログデータをプロンプトに仕込む（多すぎるとエラーになるため上位50件程度に絞るか、要約する）
    const specsContext = wireSpecs.slice(0, 50).map(s => 
      `[${s.maker}] ${s.name} ${s.size}sq ${s.core}C - 外径${s.outerDiameter}mm 質量${s.weightPerKm}kg/km 理論歩留${s.theoreticalRatio}%`
    ).join('\n');

    try {
      const res = await fetch('/api/deep-scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, hint, specsContext })
      });
      const data = await res.json();
      if(data.success) {
        setResult(data.result);
      } else {
        alert("エラー: " + data.message);
      }
    } catch(e) {
      alert("通信エラーが発生しました。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col text-white animate-in slide-in-from-bottom-full duration-300 font-sans">
      <div className="p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10">
        <h2 className="text-xl font-black flex items-center gap-2 tracking-widest text-red-500 font-serif">
          <Icons.Eye /> GOD'S EYE
        </h2>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md">
          <Icons.Close />
        </button>
      </div>

      <div className="flex-1 flex flex-col relative overflow-y-auto pb-32">
        {!result && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full p-6 mt-16">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm mb-2">最高精度で汚れを透過し、構造を分析</p>
              <p className="text-xs text-gray-500">※通信量を抑えるため画像は4枚まで</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden border-2 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                  <img src={`data:image/jpeg;base64,${img}`} className="w-full h-full object-cover opacity-80" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-black/70 p-2 rounded-full">
                    <Icons.Trash />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-square bg-gray-900 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <Icons.Camera />
                  <span className="text-xs font-bold mt-2 text-gray-400">タップして撮影</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" multiple />
                </label>
              )}
            </div>

            <textarea 
              className="w-full max-w-sm bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm outline-none focus:border-red-500 transition-colors"
              placeholder="現場からのヒント（例：かなり重い、被覆がカチカチに硬い等）"
              rows={3}
              value={hint}
              onChange={e => setHint(e.target.value)}
            />
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 border-4 border-red-500/30 rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <Icons.Eye />
            </div>
            <h3 className="text-xl font-bold tracking-widest text-red-500 mb-2">DEEP SCANNING...</h3>
            <p className="text-sm text-gray-400">画像エンハンスメント及びカタログ照合中</p>
          </div>
        )}

        {result && (
          <div className="p-6 pt-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-6 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex justify-between items-start mb-6 border-b border-gray-800 pb-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold tracking-widest mb-1">AI IDENTIFICATION</p>
                  <h3 className="text-2xl font-black text-white">{result.identifiedWire}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">CONFIDENCE</p>
                  <p className={`text-xl font-black font-mono ${result.confidence > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {result.confidence}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/50 p-4 rounded-xl border border-gray-800 text-center">
                  <p className="text-[10px] text-gray-500 font-bold mb-1">カタログ理論値</p>
                  <p className="text-2xl font-mono text-gray-300">{result.theoreticalYield ? `${result.theoreticalYield}%` : '---'}</p>
                </div>
                <div className="bg-red-900/20 p-4 rounded-xl border border-red-900/50 text-center shadow-[inset_0_0_15px_rgba(220,38,38,0.1)]">
                  <p className="text-[10px] text-red-400 font-bold mb-1">実質歩留まり予測</p>
                  <p className="text-3xl font-black font-mono text-red-500">{result.estimatedYield}%</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 flex items-center gap-2 mb-2"><Icons.Brain /> 推論プロセス</h4>
                  <p className="text-sm text-gray-300 leading-relaxed bg-black/30 p-4 rounded-xl">{result.analysis}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-gray-400 flex items-center gap-2 mb-2">💡 営業交渉アドバイス</h4>
                  <p className="text-sm font-bold text-white leading-relaxed bg-blue-900/20 border border-blue-900/50 p-4 rounded-xl">
                    {result.advice}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-500 mb-2">⚠️ リスクヘッジ (Plan B)</h4>
                  <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-yellow-700 pl-3">
                    {result.alternative}
                  </p>
                </div>
              </div>
            </div>

            <button onClick={() => {setImages([]); setResult(null); setHint('');}} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-colors">
              再スキャン
            </button>
          </div>
        )}
      </div>

      {!isAnalyzing && !result && (
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleAnalyze}
            disabled={images.length === 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-lg py-5 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none transition-all active:scale-95 flex justify-center items-center gap-2 tracking-widest"
          >
            <Icons.Eye /> DEEP SCAN
          </button>
        </div>
      )}
    </div>
  );
};