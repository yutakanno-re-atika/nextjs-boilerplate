"use client";
import React from 'react';

export default function YieldReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    // ★ style属性で「印刷時も色を省略しない」設定を追加しています
    <div 
      className="min-h-screen bg-gray-100 py-10 font-sans print:bg-white print:py-0 text-gray-900"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      
      {/* 画面上部のアクションバー（印刷時には消えます） */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-end print:hidden px-4 md:px-0">
        <button 
          onClick={handlePrint} 
          className="bg-[#D32F2F] text-white px-6 py-3 rounded-sm font-bold shadow-sm hover:bg-red-800 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          PDFとして保存・印刷する
        </button>
      </div>

      {/* A4サイズのレポート本体 */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-md print:shadow-none p-6 md:p-[20mm] box-border relative overflow-hidden">
        
        {/* レポートヘッダー */}
        <header className="border-b-2 border-gray-900 pb-4 mb-8 mt-4 md:mt-0">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-2">
            <h1 className="text-xl md:text-2xl font-serif font-black tracking-widest text-gray-900">
              銅ナゲット製造実績および<br />歩留まり検証報告
            </h1>
            <div className="text-left md:text-right text-sm">
              <p className="font-mono text-gray-600">報告日: 2026年2月26日</p>
              <p className="font-bold text-gray-900 mt-1">株式会社 月寒製作所</p>
              <p className="text-gray-700 mt-0.5">作成: 菅野 雄太</p>
              <p className="text-xs text-gray-500">分析: AI Data Analyst (Gemini)</p>
            </div>
          </div>
        </header>

        {/* 1. テストの背景と目的 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">1. テストの背景と目的</h2>
          <p className="text-sm leading-relaxed text-gray-800">
            お疲れ様です。特号線（ピカ線）の販売枠超過による在庫滞留と、ナゲット原料（被覆線）不足の解消を目的としたテスト加工を実施しましたので、結果をご報告いたします。<br />
            本検証は、<strong>「滞留している特号線等を被覆線と混合してナゲット加工し、即売却可能な製品へ変換する」</strong>ことで、キャッシュフローの改善が図れるか、またその際の歩留まりにどのような影響が出るかを確認するものです。
          </p>
        </section>

        {/* 2. 製造実績データ */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">2. 製造データ実績（トータル7.2tバッチ）</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">▼ 投入原料（インプット）</h3>
              <ul className="text-sm space-y-1 text-gray-700 mb-4">
                <li className="flex justify-between"><span>特号線 (100%)</span><span className="font-mono font-bold text-gray-900">3,249 kg</span></li>
                <li className="flex justify-between"><span>1号線 (99%)</span><span className="font-mono font-bold text-gray-900">198 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (75%)</span><span className="font-mono font-bold text-gray-900">291 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (58%)</span><span className="font-mono font-bold text-gray-900">446 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (56%)</span><span className="font-mono font-bold text-gray-900">1,191 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (42%)</span><span className="font-mono font-bold text-gray-900">1,866 kg</span></li>
              </ul>
              <div className="bg-red-50 p-3 rounded-sm border border-red-100 print:border-red-200">
                <div className="flex justify-between font-bold text-[#D32F2F] mb-1">
                  <span>総投入量:</span><span className="font-mono text-lg">7,241 kg</span>
                </div>
                <div className="flex justify-between text-xs text-red-800">
                  <span>理論上含有される銅量:</span><span className="font-mono">5,372.6 kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">▼ 産出製品（アウトプット）</h3>
              <ul className="text-sm space-y-1 text-gray-700 mb-4">
                <li className="flex justify-between"><span>銅ナゲット (100%)</span><span className="font-mono font-bold text-gray-900">5,320 kg</span></li>
                <li className="flex justify-between"><span>水揚げナゲット (98%)</span><span className="font-mono font-bold text-gray-900">12 kg</span></li>
              </ul>
              <div className="bg-gray-800 p-3 rounded-sm text-white md:mt-16 print:border print:border-gray-800">
                <div className="flex justify-between font-bold mb-1">
                  <span>総産出量:</span><span className="font-mono text-lg">5,332 kg</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>実際の銅回収量:</span><span className="font-mono">5,331.8 kg</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 歩留まり・回収率の評価 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-4">3. 歩留まりと回収率の評価</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 border border-gray-300 p-3 text-center rounded-sm bg-white">
              <p className="text-xs text-gray-600 font-bold mb-1">重量ベースの歩留まり</p>
              <p className="text-2xl font-black font-mono text-gray-900">73.64 <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="flex-1 border-2 border-[#D32F2F] p-3 text-center rounded-sm bg-red-50/30">
              <p className="text-xs text-[#D32F2F] font-bold mb-1">銅ベースの真実回収率</p>
              <p className="text-2xl font-black font-mono text-[#D32F2F]">99.24 <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="flex-1 border border-gray-300 p-3 text-center rounded-sm bg-white">
              <p className="text-xs text-gray-600 font-bold mb-1">加工中の銅ロス量</p>
              <p className="text-2xl font-black font-mono text-gray-900">40.8 <span className="text-sm font-normal">kg</span></p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-800 border border-gray-300 p-4 bg-gray-50 rounded-sm">
            <strong>【現場の稼働状況について】</strong><br />
            銅の回収率が99.2%を超え、理論値に対するロスはわずか40kg強（全体の0.76%）に収まりました。手間のかかる水選別機への移行分も12kgのみであり、現在の乾式選別機（風力・振動）のセッティングは非常に高い精度で機能していると言えます。
          </p>
        </section>

        {/* 4. ロス発生源の考察 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">4. 銅ロス（40.8kg）に関する考察</h2>
          <p className="text-sm mb-3 text-gray-800">全体ロスは軽微ですが、発生要因として以下の2パターンが考えられます。</p>
          <div className="space-y-4">
            <div className="pl-4 border-l-2 border-gray-400">
              <h3 className="text-sm font-bold text-gray-900 mb-1">仮説A：被覆線から発生した場合</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                被覆線の銅回収率が約98.1%となります。雑線を多く含む加工としては非常に良好な数値です。特号線のような純銅はダストになりにくいため、実態としてはこの仮説が最も事実に近いと考えられます。
              </p>
            </div>
            <div className="pl-4 border-l-2 border-gray-400">
              <h3 className="text-sm font-bold text-gray-900 mb-1">仮説B：特号線から発生した場合</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                硬い特号線同士が機械内で接触し、微粉化してロスになったパターンです。しかし、この特号線がハンマーの役割を果たして雑線の被覆を効率よく粉砕し、システム全体の回収率向上（共摺り効果）に寄与した可能性も十分にあります。
              </p>
            </div>
          </div>
        </section>

        {/* 5. 結論と今後の課題 */}
        <section>
          <h2 className="text-base font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">5. 結論と今後の検証課題</h2>
          <p className="text-sm leading-relaxed text-gray-800 mb-4">
            今回の<strong>「特号線をナゲット化して売却する戦略」は、経営的観点から非常に有効</strong>であると判断します。<br />
            一定の加工コストや軽微な銅ロスは発生するものの、販売枠制限により滞留している在庫を「即売却可能な製品」へ変換できたことによる、在庫回転率およびキャッシュフロー向上のメリットがコストを大きく上回るためです。
          </p>
          <h3 className="text-sm font-bold text-gray-900 mb-2">▼ 今後の検証予定</h3>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-2 pl-2">
            <li><strong>特号線100%での単独テスト：</strong> 特号線のみを加工し、機械通過による純粋なロス率（微粉化の度合い）を測定します。</li>
            <li><strong>最適ブレンド比率の検証：</strong> 今回（約45%）よりも特号線の混合比率を下げてテストを実施し、歩留まりを維持しつつ加工コストを最小化できる最適な配合を探ります。</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
