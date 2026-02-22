// @ts-nocheck
import React, { useMemo } from 'react';

const Icons = {
  ArrowLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>,
  User: () => <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Scale: () => <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
  Factory: () => <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
};

export const AdminClientDetail = ({ data, clientName, onBack }: { data: any, clientName: string, onBack: () => void }) => {
  
  // 該当顧客の受付・買取履歴
  const clientReservations = useMemo(() => {
      return (data?.reservations || [])
          .filter((r: any) => r.memberName === clientName && (r.status === 'COMPLETED' || r.status === 'ARCHIVED'))
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [data?.reservations, clientName]);

  // 該当顧客のナゲット加工履歴
  const clientProductions = useMemo(() => {
      return (data?.productions || [])
          .filter((p: any) => p.memberName === clientName)
          .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [data?.productions, clientName]);

  // 総計データの算出
  const totalPurchaseAmount = clientReservations.reduce((sum, r) => sum + (Number(r.totalEstimate) || 0), 0);
  const totalPurchaseWeight = clientProductions.reduce((sum, p) => sum + (Number(p.inputWeight) || 0), 0);
  
  // 平均歩留まり差分
  let yieldDiffSum = 0;
  let yieldCount = 0;
  clientProductions.forEach(p => {
      const actual = Number(p.actualRatio) || 0;
      const master = data?.wires?.find((w:any) => w.name === p.materialName);
      let expected = master ? Number(master.ratio) : 0;
      if (expected === 0 && p.materialName) {
          if (p.materialName.includes('80')) expected = 80;
          else if (p.materialName.includes('70')) expected = 70;
          else if (p.materialName.includes('60')) expected = 60;
          else if (p.materialName.includes('50')) expected = 50;
          else if (p.materialName.includes('40')) expected = 40;
          else if (p.materialName.includes('雑線')) expected = 35;
      }
      if (expected > 0 && actual > 0) {
          yieldDiffSum += (actual - expected);
          yieldCount++;
      }
  });
  const avgYieldDiff = yieldCount > 0 ? (yieldDiffSum / yieldCount) : 0;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-300 max-w-6xl mx-auto w-full">
      <header className="mb-6 flex items-center gap-4 flex-shrink-0">
        <button onClick={onBack} className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition shadow-sm">
            <Icons.ArrowLeft />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-gray-100 rounded-full"><Icons.User /></div>
              {clientName} の取引カルテ
          </h2>
          <p className="text-xs text-gray-500 mt-1">過去のすべての買取履歴と、加工後の歩留まり評価を確認できます。</p>
        </div>
      </header>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5"><Icons.Scale /> 累計 買取金額</p>
              <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-gray-900">¥{totalPurchaseAmount.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-bold">({clientReservations.length}件)</span>
              </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <p className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1.5"><Icons.Factory /> 累計 加工重量</p>
              <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-gray-900">{totalPurchaseWeight.toLocaleString()}</span>
                  <span className="text-sm text-gray-500 font-bold">kg</span>
              </div>
          </div>
          <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${avgYieldDiff > 0 ? 'bg-green-50 border-green-200' : avgYieldDiff < 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="text-xs font-bold text-gray-500 mb-1">平均 歩留まり上振れ幅</p>
              <div className="flex items-baseline gap-1 mt-2">
                  <span className={`text-4xl font-black ${avgYieldDiff > 0 ? 'text-green-600' : avgYieldDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {avgYieldDiff > 0 ? '+' : ''}{avgYieldDiff.toFixed(1)}%
                  </span>
              </div>
              <p className={`text-[10px] font-bold mt-2 ${avgYieldDiff > 0 ? 'text-green-700' : avgYieldDiff < 0 ? 'text-red-700' : 'text-gray-500'}`}>
                  {avgYieldDiff > 0 ? '良質な線を持ち込む優良顧客です。単価アップを検討できます。' : avgYieldDiff < 0 ? 'ゴミが多く含まれている傾向があります。査定時に注意してください。' : '加工データがありません。'}
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          {/* 左側：買取履歴 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">🛒 過去の買取履歴</h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {clientReservations.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">履歴がありません</p> : 
                      clientReservations.map(res => (
                          <div key={res.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                  {/* ★ ここを修正（undefined対策） */}
                                  <span>{res.createdAt ? String(res.createdAt).substring(0, 16) : '日時不明'}</span>
                                  <span className="font-mono">{res.id}</span>
                              </div>
                              <p className="text-lg font-black text-gray-900 text-right mb-2">¥{Number(res.totalEstimate).toLocaleString()}</p>
                              <div className="space-y-1">
                                  {JSON.parse(res.items || '[]').map((it:any, idx:number) => (
                                      <div key={idx} className="flex justify-between text-xs bg-white p-1.5 rounded border border-gray-100">
                                          <span className="font-bold text-gray-700">{it.product || it.productName}</span>
                                          <span>{it.weight} kg</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ))
                  }
              </div>
          </div>

          {/* 右側：加工実績 */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">⚡ ナゲット加工実績 (品質評価)</h3>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {clientProductions.length === 0 ? <p className="text-center text-gray-400 text-sm py-10">加工データがありません</p> : 
                      clientProductions.map(prod => {
                          const actual = Number(prod.actualRatio) || 0;
                          const master = data?.wires?.find((w:any) => w.name === prod.materialName);
                          let expected = master ? Number(master.ratio) : 0;
                          if (expected === 0 && prod.materialName) {
                              if (prod.materialName.includes('80')) expected = 80;
                              else if (prod.materialName.includes('70')) expected = 70;
                              else if (prod.materialName.includes('60')) expected = 60;
                              else if (prod.materialName.includes('50')) expected = 50;
                              else if (prod.materialName.includes('40')) expected = 40;
                              else if (prod.materialName.includes('雑線')) expected = 35;
                          }
                          const diff = actual - expected;

                          return (
                              <div key={prod.id} className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition">
                                  <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                      {/* ★ ここを修正（undefined対策） */}
                                      <span>{prod.date ? String(prod.date).substring(0, 16) : '日時不明'}</span>
                                      <span className="font-mono">元荷物: {prod.reservationId}</span>
                                  </div>
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-[#D32F2F] text-sm">{prod.materialName}</span>
                                      <span className="text-xs font-bold text-gray-600">投入: {prod.inputWeight}kg → 銅: {prod.outputCopper}kg</span>
                                  </div>
                                  <div className="bg-gray-900 rounded p-2 flex justify-between items-center text-white">
                                      <span className="text-[10px] text-gray-400">実績: <span className="text-sm font-bold text-white">{actual}%</span> (想定{expected}%)</span>
                                      <span className={`text-xs font-black px-2 py-0.5 rounded ${diff >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                                      </span>
                                  </div>
                              </div>
                          )
                      })
                  }
              </div>
          </div>
      </div>
    </div>
  );
};
