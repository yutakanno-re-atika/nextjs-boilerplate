// app/components/admin/AdminSettings.tsx
// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Save: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Globe: () => <svg className="w-5 h-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Refresh: () => <svg className="w-5 h-5 animate-spin inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Target: () => <svg className="w-5 h-5 inline-block text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
};

export const AdminSettings = ({ data }: { data: any }) => {
  const [lpConfig, setLpConfig] = useState({
      autoMarketSync: String(data?.config?.auto_market_sync) !== 'false',
      autoLeadGen: String(data?.config?.auto_lead_gen) === 'true', // ★追加
      showSimulator: String(data?.config?.show_simulator) !== 'false',
      showFaq: String(data?.config?.show_faq) !== 'false',
      showConcierge: String(data?.config?.show_concierge) !== 'false',
      showPriceList: String(data?.config?.show_price_list) !== 'false',
      showMarketRates: String(data?.config?.show_market_rates) !== 'false',
  });
  
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isRunningBatch, setIsRunningBatch] = useState<'NONE' | 'MARKET' | 'LEAD' | 'BACKUP'>('NONE');

  const handleSaveLpConfig = async () => {
    setIsSavingConfig(true);
    try {
      const updates = [
        { key: 'auto_market_sync', value: lpConfig.autoMarketSync ? 'true' : 'false' },
        { key: 'auto_lead_gen', value: lpConfig.autoLeadGen ? 'true' : 'false' }, // ★追加
        { key: 'show_simulator', value: lpConfig.showSimulator ? 'true' : 'false' },
        { key: 'show_faq', value: lpConfig.showFaq ? 'true' : 'false' },
        { key: 'show_concierge', value: lpConfig.showConcierge ? 'true' : 'false' },
        { key: 'show_price_list', value: lpConfig.showPriceList ? 'true' : 'false' },
        { key: 'show_market_rates', value: lpConfig.showMarketRates ? 'true' : 'false' }
      ];

      for (const req of updates) {
        await fetch('/api/gas', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'UPDATE_CONFIG', key: req.key, value: req.value })
        });
      }
      
      localStorage.removeItem('factoryOS_masterData'); 
      alert("システム設定を保存しました。画面を更新して反映します。");
      window.location.reload(); 
    } catch(e) {
      alert("設定の保存に失敗しました。");
      setIsSavingConfig(false);
    }
  };

  const handleRunBatchSettings = async (type: 'MARKET' | 'LEAD' | 'BACKUP') => {
      const typeLabel = type === 'MARKET' ? '市況データ（建値）' : type === 'LEAD' ? '営業リード' : 'データベースのバックアップ';
      if (!confirm(`${typeLabel} の処理を今すぐ実行します。よろしいですか？`)) return;
      setIsRunningBatch(type);
      try {
          const action = type === 'MARKET' ? 'RUN_MARKET_SYNC' : type === 'LEAD' ? 'RUN_LEAD_GEN' : 'CREATE_BACKUP';
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) });
          const result = await res.json();
          if (result.status === 'success') {
              alert('✅ ' + result.message);
              if (result.url) window.open(result.url, '_blank'); 
          } else { alert('エラーが発生しました: ' + result.message); }
      } catch (e) { alert('通信エラーが発生しました。'); }
      setIsRunningBatch('NONE');
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 font-serif tracking-tight">SYSTEM SETTINGS</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">システム全体設定 / 自動バッチ制御</p>
        </div>
      </header>

      <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-sm p-6 md:p-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-10">
              <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                      <Icons.Settings /> システム自動実行バッチの制御
                  </h3>
                  <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                  <span className={`w-3 h-3 rounded-full ${lpConfig.autoMarketSync ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                  市況データ自動スクレイピング
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">国内メーカー建値を定期的に自動取得します。</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.autoMarketSync} onChange={(e) => setLpConfig({...lpConfig, autoMarketSync: e.target.checked})} />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                      </div>

                      {/* ★ 追加: AIスナイパーの自動実行トグル */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                  <span className={`w-3 h-3 rounded-full ${lpConfig.autoLeadGen ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                  AIスナイパー (自動ターゲット抽出)
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">AIが定期的にWebを巡回し、営業ターゲットを自動リストアップします。</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.autoLeadGen} onChange={(e) => setLpConfig({...lpConfig, autoLeadGen: e.target.checked})} />
                              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                          </label>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                  <span className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></span>
                                  データベースのバックアップ
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">現在の全マスターデータをGoogleドライブに別ファイルとしてコピー保存します。</p>
                          </div>
                          <button onClick={() => handleRunBatchSettings('BACKUP')} disabled={isRunningBatch !== 'NONE'} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 hover:bg-gray-50 transition disabled:opacity-50 whitespace-nowrap">
                              {isRunningBatch === 'BACKUP' ? <><Icons.Refresh /> 作成中...</> : <><Icons.Save /> 今すぐバックアップ作成</>}
                          </button>
                      </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                      <Icons.Globe /> LP（一般向けWebサイト）の表示制御
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      お客様が閲覧するWebサイトの各機能をリアルタイムにON/OFFできます。
                  </p>
                  <div className="space-y-4 mb-6">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">本日の買取価格表</h4>
                              <p className="text-xs text-gray-500 mt-1">LPに買取価格の一覧表を表示する</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.showPriceList} onChange={(e) => setLpConfig({...lpConfig, showPriceList: e.target.checked})} />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">市況指標（各建値）の表示</h4>
                              <p className="text-xs text-gray-500 mt-1">買取価格表の上に銅・黄銅・亜鉛などの建値を表示する</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.showMarketRates} onChange={(e) => setLpConfig({...lpConfig, showMarketRates: e.target.checked})} />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">限界買取シミュレーター</h4>
                              <p className="text-xs text-gray-500 mt-1">お客様が自分で歩留まりを計算できる機能</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.showSimulator} onChange={(e) => setLpConfig({...lpConfig, showSimulator: e.target.checked})} />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">AIコンシェルジュチャット</h4>
                              <p className="text-xs text-gray-500 mt-1">画面右下に浮いているAIチャットボット</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.showConcierge} onChange={(e) => setLpConfig({...lpConfig, showConcierge: e.target.checked})} />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center shadow-sm">
                          <div>
                              <h4 className="font-bold text-gray-900">AI自動生成FAQ</h4>
                              <p className="text-xs text-gray-500 mt-1">過去の問い合わせからAIが自動生成した「よくある質問」</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={lpConfig.showFaq} onChange={(e) => setLpConfig({...lpConfig, showFaq: e.target.checked})} />
                              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                      </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex justify-end">
                      <button 
                          onClick={handleSaveLpConfig} 
                          disabled={isSavingConfig} 
                          className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-sm shadow-md flex items-center gap-2 transition disabled:opacity-50"
                      >
                          {isSavingConfig ? <span className="animate-spin"><Icons.Refresh /></span> : <Icons.Save />}
                          {isSavingConfig ? '保存中...' : '設定を保存して反映する'}
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
