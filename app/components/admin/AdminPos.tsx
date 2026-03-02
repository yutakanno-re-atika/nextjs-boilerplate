// @ts-nocheck
import React, { useState, useRef, useMemo, useEffect } from 'react';

const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Camera: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Sparkles: () => <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 8.134a1 1 0 010 1.932l-3.354.933-1.179 4.456a1 1 0 01-1.934 0l-1.179-4.456-3.354-.933a1 1 0 010-1.932l3.354-.933 1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" /></svg>,
  Calculator: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
};

export const AdminPos = ({ data, editingResId, localReservations, onSuccess, onClear }: { data: any, editingResId?: string | null, localReservations?: any[], onSuccess: () => void, onClear: () => void }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiStatus, setAiStatus] = useState<'IDLE' | 'ANALYZING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [aiResult, setAiResult] = useState<any>(null);

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [imgData1, setImgData1] = useState<string>('');
  const [imgData2, setImgData2] = useState<string>('');

  // ★ 超現実的利益シミュレーター用の設定値 (WN-800仕様)
  const [simConfig, setSimConfig] = useState({
    disposalCostPerKg: 40,   // 産廃処理費(円/kg) - 被覆・ジュート
    laborCostPerHour: 3000,  // 工場稼働コスト(円/時) - 人件費・電気・刃物損耗
    capacityPerHour: 150,    // WN-800の処理能力(kg/時) - PDF記載の100~200の中間
    targetMargin: 15         // 確保したい粗利率(%)
  });

  const copperPrice = data?.market?.copper?.price || 1400;

  useEffect(() => {
    if (editingResId && localReservations) {
      const res = localReservations.find(r => r.id === editingResId);
      if (res) {
        try { setCart(typeof res.items === 'string' ? JSON.parse(res.items) : res.items); } catch(e){}
        if (res.memberId !== 'GUEST' && data?.clients) {
          const client = data.clients.find((c:any) => c.id === res.memberId);
          if (client) setSelectedClient(client);
        }
      }
    } else {
      setCart([]); setSelectedClient(null); setAiResult(null); setImgData1(''); setImgData2('');
    }
  }, [editingResId, localReservations, data]);

  const addToCart = (product: any) => {
    setCart(prev => [...prev, { id: Date.now().toString(), product: product.name, ratio: product.ratio, weight: 0 }]);
    setSearchTerm('');
  };

  const updateWeight = (id: string, weight: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, weight } : item));
  };

  const removeItem = (id: string) => { setCart(prev => prev.filter(item => item.id !== id)); };

  // AI推論処理 (Black Box Opener)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, num: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      if (num === 1) setImgData1(base64); else setImgData2(base64);
    };
    reader.readAsDataURL(file);
  };

  const runAiAnalysis = async () => {
    if (!imgData1) return alert('最低1枚の画像をアップロードしてください');
    setAiStatus('ANALYZING');
    try {
      const res = await fetch('/api/gas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VISION_AI_ASSESS', imageData: imgData1, imageData2: imgData2 })
      });
      const result = await res.json();
      if (result.status === 'success') {
        setAiResult(result.data);
        setAiStatus('SUCCESS');
        
        // 推論結果を自動でカートに追加
        const newItem = {
            id: Date.now().toString(),
            product: result.data.isNewFlag ? `💡 ${result.data.wireType}` : result.data.wireType,
            ratio: result.data.estimatedRatio,
            weight: 0,
            isNewAi: result.data.isNewFlag,
            reason: result.data.reason
        };
        setCart(prev => [newItem, ...prev]);

        // 未知線種なら裏でマスター(UNKNOWN)へ登録
        if (result.data.isNewFlag) {
            fetch('/api/gas', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'ADD_DB_RECORD', sheetName: 'Products_Unknown', data: { name: result.data.wireType, estimatedRatio: result.data.estimatedRatio, reason: result.data.reason } })
            });
        }
      } else {
        setAiStatus('ERROR'); alert('AI解析エラー: ' + result.message);
      }
    } catch(err) { setAiStatus('ERROR'); alert('通信エラーが発生しました'); }
  };

  // ★ 超現実的利益計算シミュレーション (中核ロジック)
  const simulation = useMemo(() => {
    let totalWeight = 0;
    let cuWeight = 0;
    
    cart.forEach(item => {
      const w = Number(item.weight) || 0;
      const r = Number(item.ratio) || 0;
      totalWeight += w;
      cuWeight += w * (r / 100);
    });

    const wasteWeight = totalWeight - cuWeight;
    const grossCuValue = cuWeight * copperPrice; // 銅の純粋な売上価値
    
    const disposalCost = wasteWeight * simConfig.disposalCostPerKg; // 産廃処理費
    const processingHours = totalWeight / simConfig.capacityPerHour; // WN-800稼働時間
    const laborCost = processingHours * simConfig.laborCostPerHour; // 工場稼働費
    const targetProfitAmount = grossCuValue * (simConfig.targetMargin / 100); // 確保したい利益
    
    // 限界買取総額 ＝ 売上 － 産廃費 － 加工費 － 確保利益
    let limitTotalCost = grossCuValue - disposalCost - laborCost - targetProfitAmount;
    if (limitTotalCost < 0) limitTotalCost = 0;

    // 限界キロ単価
    const limitUnitPrice = totalWeight > 0 ? Math.floor(limitTotalCost / totalWeight) : 0;
    
    // 旧来の単純計算（比較用）
    const simpleTotalCost = totalWeight > 0 ? cart.reduce((sum, item) => sum + ((Number(item.weight)||0) * (Number(item.ratio)||0)/100 * copperPrice * 0.8), 0) : 0; // ざっくり歩留まり×80%

    return {
        totalWeight, cuWeight, wasteWeight, grossCuValue, disposalCost, laborCost, targetProfitAmount, limitTotalCost, limitUnitPrice, simpleTotalCost, processingHours
    };
  }, [cart, copperPrice, simConfig]);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('カートが空です');
    if (simulation.totalWeight === 0) return alert('重量を入力してください');
    
    setIsProcessing(true);
    const payload = {
      action: editingResId ? 'UPDATE_RESERVATION' : 'REGISTER_RESERVATION',
      reservationId: editingResId,
      memberId: selectedClient?.id || 'GUEST',
      memberName: selectedClient?.name || '新規/非会員 (現場持込)',
      items: cart,
      totalEstimate: simulation.limitTotalCost, // ★限界買取価格で保存
      status: 'RESERVED' // ➔ これでカンバンの「処理待ち」へ飛ぶ
    };

    try {
      const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') {
        alert('受付を完了し、工場カンバンへ送信しました。');
        onSuccess();
      } else { alert('エラー: ' + result.message); }
    } catch(err) { alert('通信エラーが発生しました'); }
    setIsProcessing(false);
  };

  const filteredProducts = (data?.wires || []).filter((w:any) => w.name.includes(searchTerm) || w.maker?.includes(searchTerm));

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in duration-500">
      
      {/* 左パネル: 商品選択 & AI解析 */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <header className="mb-2">
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight">AI POS & RECEPTION</h2>
          <p className="text-xs text-gray-500 font-mono">Vision AI ＆ 超現実的買取シミュレーター</p>
        </header>

        {/* AIブラックボックスオープナー */}
        <div className="bg-gray-900 rounded-sm p-4 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
          <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-blue-300">
            <Icons.Camera /> Vision AI ブラックボックス・オープナー
          </h3>
          <div className="flex gap-2 mb-4 relative z-10">
            <button onClick={() => fileInputRef1.current?.click()} className={`flex-1 py-8 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all ${imgData1 ? 'border-blue-400 bg-blue-900/30' : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800'}`}>
              <Icons.Camera />
              <span className="text-xs font-bold mt-2">{imgData1 ? '断面画像OK' : '1. 断面 + 定規'}</span>
            </button>
            <input type="file" ref={fileInputRef1} onChange={e => handleImageUpload(e, 1)} className="hidden" accept="image/*" />
            
            <button onClick={() => fileInputRef2.current?.click()} className={`flex-1 py-8 border-2 border-dashed rounded-sm flex flex-col items-center justify-center transition-all ${imgData2 ? 'border-blue-400 bg-blue-900/30' : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800'}`}>
              <Icons.Camera />
              <span className="text-xs font-bold mt-2">{imgData2 ? '印字画像OK' : '2. 表面印字 (任意)'}</span>
            </button>
            <input type="file" ref={fileInputRef2} onChange={e => handleImageUpload(e, 2)} className="hidden" accept="image/*" />
          </div>

          <button onClick={runAiAnalysis} disabled={!imgData1 || aiStatus === 'ANALYZING'} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-sm flex justify-center items-center gap-2 disabled:bg-gray-700 transition relative z-10 shadow-lg">
            {aiStatus === 'ANALYZING' ? <Icons.Refresh /> : <Icons.Sparkles />}
            {aiStatus === 'ANALYZING' ? 'AIが定規のスケールと印字を解析中...' : 'AIで歩留まりと線種を特定する'}
          </button>

          {aiResult && (
            <div className="mt-4 bg-gray-800 p-3 rounded-sm border border-gray-700 text-sm animate-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-400">{aiResult.wireType}</span>
                <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-sm font-mono font-bold">{aiResult.estimatedRatio}%</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{aiResult.reason}</p>
            </div>
          )}
        </div>

        {/* マスター検索パネル */}
        <div className="bg-white border border-gray-200 rounded-sm flex-1 flex flex-col shadow-sm">
          <div className="p-3 border-b border-gray-200 bg-gray-50 flex gap-2">
            <div className="relative flex-1">
              <Icons.Search />
              <input type="text" placeholder="マスターから線種を検索..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-sm text-sm focus:border-gray-500 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {searchTerm ? (
              filteredProducts.map((p:any) => (
                <div key={p.id} onClick={() => addToCart(p)} className="flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{p.name} <span className="text-xs text-gray-500 font-normal">({p.maker})</span></div>
                  </div>
                  <div className="font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-sm text-sm">{p.ratio}%</div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                <Icons.Search />
                <p className="mt-2 text-sm font-bold">キーワードを入力するか、<br/>上のカメラからAIに解析させてください</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右パネル: カート & 超現実的シミュレーション */}
      <div className="w-full lg:w-1/2 bg-white border border-gray-200 rounded-sm flex flex-col shadow-lg relative z-20">
        
        {/* 顧客選択 */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <label className="block text-xs font-bold text-gray-500 mb-1">持込業者 / 顧客</label>
          <select className="w-full border border-gray-300 p-2 rounded-sm text-sm font-bold bg-white outline-none focus:border-gray-500" value={selectedClient?.id || ''} onChange={e => { const client = data?.clients?.find((c:any) => c.id === e.target.value); setSelectedClient(client || null); }}>
            <option value="">新規 / 非会員 (飛込ゲスト)</option>
            {data?.clients?.map((c:any) => <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>)}
          </select>
        </div>

        {/* カート (計量入力) */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          {cart.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 p-3 rounded-sm mb-2 shadow-sm flex items-center gap-3">
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm flex items-center gap-1">
                  {item.product} {item.isNewAi && <span className="bg-yellow-100 text-yellow-800 text-[10px] px-1 rounded-sm">AI推論</span>}
                </div>
                <div className="text-xs font-mono text-gray-500">歩留: {item.ratio}%</div>
              </div>
              <div className="w-32 relative">
                <input type="number" className="w-full border-b-2 border-gray-400 bg-gray-50 p-2 text-right font-mono font-black text-lg outline-none focus:border-blue-500 focus:bg-white transition" value={item.weight || ''} onChange={e => updateWeight(item.id, Number(e.target.value))} placeholder="0" />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">kg</span>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition"><Icons.Trash /></button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <p className="font-bold text-sm">カートは空です</p>
            </div>
          )}
        </div>

        {/* 💰 超現実的・利益シミュレーター パネル */}
        <div className="bg-gray-900 text-white p-5 border-t-4 border-blue-500 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-black flex items-center gap-2 text-blue-300"><Icons.Calculator /> 超現実的 利益シミュレーター</h3>
            <div className="text-xs font-mono text-gray-400">LME建値基準: <span className="text-white font-bold">{copperPrice}円/kg</span></div>
          </div>

          {/* シミュレーション設定スライダー */}
          <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-800 p-3 rounded-sm border border-gray-700">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">産廃処分費(円/kg)</label>
              <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded-sm p-1 text-xs text-right outline-none focus:border-blue-400" value={simConfig.disposalCostPerKg} onChange={e => setSimConfig({...simConfig, disposalCostPerKg: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">工場コスト(円/時)</label>
              <input type="number" className="w-full bg-gray-900 border border-gray-600 rounded-sm p-1 text-xs text-right outline-none focus:border-blue-400" value={simConfig.laborCostPerHour} onChange={e => setSimConfig({...simConfig, laborCostPerHour: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">確保利益率(%)</label>
              <input type="number" className="w-full bg-blue-900 border border-blue-500 text-blue-100 font-bold rounded-sm p-1 text-xs text-right outline-none focus:border-white" value={simConfig.targetMargin} onChange={e => setSimConfig({...simConfig, targetMargin: Number(e.target.value)})} />
            </div>
          </div>

          {/* コスト分解ツリー */}
          <div className="space-y-1 mb-4 text-xs font-mono border-b border-gray-700 pb-3">
            <div className="flex justify-between text-gray-300"><span>総重量</span><span>{simulation.totalWeight.toFixed(1)} kg</span></div>
            <div className="flex justify-between text-blue-300"><span>回収見込 銅 (売上)</span><span>{simulation.cuWeight.toFixed(1)} kg ({simulation.grossCuValue.toLocaleString()} 円)</span></div>
            <div className="flex justify-between text-red-300"><span>産廃見込 ゴミ (▲費用)</span><span>{simulation.wasteWeight.toFixed(1)} kg (▲ {simulation.disposalCost.toLocaleString()} 円)</span></div>
            <div className="flex justify-between text-orange-300"><span>WN-800稼働 (▲費用)</span><span>{simulation.processingHours.toFixed(2)} 時間 (▲ {simulation.laborCost.toLocaleString()} 円)</span></div>
            <div className="flex justify-between text-yellow-300 font-bold mt-1 pt-1 border-t border-gray-700"><span>絶対確保利益 ({simConfig.targetMargin}%)</span><span>▲ {simulation.targetProfitAmount.toLocaleString()} 円</span></div>
          </div>

          {/* 最終提示価格 */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-1">限界提示単価 (赤字回避ライン)</p>
              <p className="text-4xl font-black font-mono text-white leading-none">¥{simulation.limitUnitPrice.toLocaleString()} <span className="text-sm font-normal text-gray-400">/kg</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">買取総額</p>
              <p className="text-xl font-bold font-mono text-white">¥{simulation.limitTotalCost.toLocaleString()}</p>
            </div>
          </div>

          <button onClick={handleCheckout} disabled={isProcessing || simulation.totalWeight === 0} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-sm transition shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 flex justify-center items-center gap-2 text-lg tracking-widest">
            {isProcessing ? <Icons.Refresh /> : '受付完了・カンバンへ送信'}
          </button>
          
          <div className="flex justify-between mt-3 px-2">
            <button onClick={() => {setCart([]); onClear();}} className="text-xs text-gray-500 font-bold hover:text-white transition">クリア</button>
            <span className="text-[10px] text-gray-600 font-mono">※旧計算式比較: ¥{simulation.simpleTotalCost.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
