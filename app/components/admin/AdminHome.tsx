// @ts-nocheck
import React from 'react';

const Icons = {
  Kanban: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
};

export const AdminHome = ({ data, localReservations, onNavigate }: { data: any, localReservations: any[], onNavigate: (tab: string, resId?: string) => void }) => {
  const reservedList = localReservations.filter((r: any) => r.status === 'RESERVED');
  const processingList = localReservations.filter((r: any) => r.status === 'PROCESSING' || r.status === 'ARRIVED');
  const completedList = localReservations.filter((r: any) => r.status === 'COMPLETED');

  // 実績と予測の計算ロジック
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  let actualVolume = 0;
  completedList.forEach(res => {
      const d = new Date(res.visitDate || new Date());
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          let items = [];
          try { 
              let temp = res.items;
              if (typeof temp === 'string') temp = JSON.parse(temp);
              if (typeof temp === 'string') temp = JSON.parse(temp);
              if (Array.isArray(temp)) items = temp;
          } catch(e) {}
          items.forEach((it: any) => { actualVolume += (Number(it.weight) || 0); });
      }
  });

  let forecastVolume = 0;
  [...reservedList, ...processingList].forEach(res => {
      let items = [];
      try { 
          let temp = res.items;
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (typeof temp === 'string') temp = JSON.parse(temp);
          if (Array.isArray(temp)) items = temp;
      } catch(e) {}
      items.forEach((it: any) => { forecastVolume += (Number(it.weight) || 0); });
  });

  const targetMonthly = Number(data?.config?.target_monthly) || 30000;
  const progressActual = Math.min(100, (actualVolume / targetMonthly) * 100);
  const progressForecast = Math.min(100, ((actualVolume + forecastVolume) / targetMonthly) * 100);

  return (
    <div className="max-w-5xl mx-auto w-full animate-in fade-in zoom-in-95 duration-300 flex flex-col h-full">
        <header className="mb-6 flex-shrink-0">
           <h2 className="text-3xl font-bold text-gray-900 mb-2">工場長、お疲れ様です。</h2>
        </header>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex-shrink-0">
           <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 今月の買付目標と実績</h3>
           <div className="flex justify-between items-end mb-2">
               <span className="text-xs text-gray-500 font-bold">現在の総買付量</span>
               <span className="text-2xl font-black text-gray-900">{actualVolume.toLocaleString()} <span className="text-xs font-bold text-gray-400">/ {targetMonthly.toLocaleString()} kg</span></span>
           </div>
           <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden flex mb-2">
               <div className="bg-[#D32F2F] h-full transition-all duration-1000 ease-out" style={{width: `${progressActual}%`}}></div>
               <div className="bg-orange-300 h-full transition-all duration-1000 ease-out opacity-80" style={{width: `${progressForecast}%`}}></div>
           </div>
           <div className="flex justify-between text-[10px] text-gray-500 font-bold">
               <span>■ 確定実績: {actualVolume.toLocaleString()} kg</span>
               <span className="text-orange-500">■ 本日の見込み (受付中): +{forecastVolume.toLocaleString()} kg</span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 flex-shrink-0">
            <button onClick={() => onNavigate('POS')} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#D32F2F] hover:shadow-md transition text-left flex items-start gap-4 group">
                <div className="w-12 h-12 bg-red-50 text-[#D32F2F] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Calc /></div>
                <div><h3 className="text-xl font-bold text-gray-900 mb-1">飛込受付・買取</h3><p className="text-xs text-gray-500">新規や予約なしのお客様の受付と明細発行</p></div>
            </button>
            <button onClick={() => onNavigate('OPERATIONS')} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-orange-500 hover:shadow-md transition text-left flex items-start gap-4 group">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition"><Icons.Kanban /></div>
                <div><h3 className="text-xl font-bold text-gray-900 mb-1">現場カンバン (進行状況)</h3><p className="text-xs text-gray-500">予約の確認、計量中の荷物、加工待ちのリスト管理</p></div>
            </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
           <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">本日の状況サマリー</h3>
           <div className="grid grid-cols-3 gap-4">
               <div className="bg-gray-50 p-4 rounded-xl"><p className="text-[10px] text-gray-500 font-bold mb-1">来場予定・受付済</p><p className="text-2xl font-black text-gray-900">{reservedList.length} <span className="text-xs font-normal text-gray-500">件</span></p></div>
               <div className="bg-red-50 p-4 rounded-xl border border-red-100"><p className="text-[10px] text-[#D32F2F] font-bold mb-1">現在 検収・計量中</p><p className="text-2xl font-black text-[#D32F2F]">{processingList.length} <span className="text-xs font-normal text-red-300">件</span></p></div>
               <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-[10px] text-blue-600 font-bold mb-1">計量完了 (ヤード保管)</p><p className="text-2xl font-black text-blue-600">{completedList.length} <span className="text-xs font-normal text-blue-300">件</span></p></div>
           </div>
        </div>
    </div>
  );
};
