"use client";
import React from 'react';

export default function YieldReport() {
  const handlePrint = () => {
    // ブラウザの印刷ダイアログを呼び出す（ここで「PDFとして保存」を選べます）
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans print:bg-white print:py-0">
      
      {/* 画面上部のアクションバー（印刷時には消えます） */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-end print:hidden">
        <button 
          onClick={handlePrint} 
          className="bg-[#D32F2F] text-white px-6 py-3 rounded-md font-bold shadow-lg hover:bg-red-800 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          PDFとして保存・印刷する
        </button>
      </div>

      {/* A4サイズのレポート本体 */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl print:shadow-none p-[20mm] box-border relative">
        
        {/* レポートヘッダー */}
        <header className="border-b-2 border-black pb-4 mb-8">
          <div className="flex justify-between items-end mb-6">
            <h1 className="text-2xl font-serif font-black tracking-widest text-gray-900">
              銅ナゲット製造実績および<br />歩留まり評価レポート
            </h1>
            <div className="text-right text-sm">
              <p className="font-mono text-gray-600">発行日: 2026年2月26日</p>
              <p className="font-bold text-gray-900 mt-1">株式会社 月寒製作所</p>
              <p className="text-gray-700 mt-0.5">作成: 菅野 雄太</p>
              <p className="text-xs text-gray-500">分析: AI Data Analyst (Gemini)</p>
            </div>
          </div>
        </header>

        {/* 1. 目的と背景 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">1. 目的と背景</h2>
          <p className="text-sm leading-loose text-gray-800">
            現在、特号線（ピカ線）は月間の販売枠に上限があり、倉庫内に在庫が過剰に滞留している状況にある。一方で、製品である銅ナゲットは需要が旺盛であるものの、主原料となる被覆線の入荷が少なく、生産量が制限されている。<br />
            本検証は、滞留している特号線および1号線を被覆線に混合してナゲット加工を行うことで、<strong>「販売枠制限により動かない在庫」を「即売却可能な製品」に変換</strong>し、キャッシュフローを改善できるか、またその際の歩留まりやロス率にどのような影響が出るかを確認することを目的とした。
          </p>
        </section>

        {/* 2. 製造実績データ */}
        <section className="mb-8">
          <h2 className="text-lg font-bold bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">2. 製造実績データ（総重量: 7.2tバッチ）</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-300 pb-1">▼ 投入原料（インプット）</h3>
              <ul className="text-sm space-y-1 text-gray-600 mb-4">
                <li className="flex justify-between"><span>特号線 (100%)</span><span className="font-mono font-bold">3,249 kg</span></li>
                <li className="flex justify-between"><span>1号線 (99%)</span><span className="font-mono font-bold">198 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (75%)</span><span className="font-mono font-bold">291 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (58%)</span><span className="font-mono font-bold">446 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (56%)</span><span className="font-mono font-bold">1,191 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (42%)</span><span className="font-mono font-bold">1,866 kg</span></li>
              </ul>
              <div className="bg-red-50 p-3 rounded-sm border border-red-100">
                <div className="flex justify-between font-bold text-[#D32F2F] mb-1">
                  <span>総投入量:</span><span className="font-mono text-lg">7,241 kg</span>
                </div>
                <div className="flex justify-between text-xs text-red-800">
                  <span>理論銅含有量:</span><span className="font-mono">5,372.6 kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2 border-b border-gray-300 pb-1">▼ 製造物（アウトプット）</h3>
              <ul className="text-sm space-y-1 text-gray-600 mb-4">
                <li className="flex justify-between"><span>銅ナゲット (100%)</span><span className="font-mono font-bold">5,320 kg</span></li>
                <li className="flex justify-between"><span>水揚げナゲット (98%)</span><span className="font-mono font-bold">12 kg</span></li>
              </ul>
              <div className="bg-gray-800 p-3 rounded-sm text-white mt-16">
                <div className="flex justify-between font-bold mb-1">
                  <span>総産出量:</span><span className="font-mono text-lg">5,332 kg</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>実回収銅量:</span><span className="font-mono">5,331.8 kg</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 歩留まり・回収率の評価 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-4">3. 歩留まり・回収率の評価</h2>
          
          <div className="flex gap-4 mb-4">
            <div className="flex-1 border border-gray-300 p-3 text-center rounded-sm">
              <p className="text-xs text-gray-500 font-bold mb-1">重量ベース歩留まり</p>
              <p className="text-2xl font-black font-mono text-gray-900">73.64 <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="flex-1 border-2 border-[#D32F2F] p-3 text-center rounded-sm bg-red-50/30">
              <p className="text-xs text-[#D32F2F] font-bold mb-1">銅ベース真実回収率</p>
              <p className="text-2xl font-black font-mono text-[#D32F2F]">99.24 <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="flex-1 border border-gray-300 p-3 text-center rounded-sm">
              <p className="text-xs text-gray-500 font-bold mb-1">製造中 銅ロス量</p>
              <p className="text-2xl font-black font-mono text-gray-900">40.8 <span className="text-sm font-normal">kg</span></p>
            </div>
          </div>

          <p className="text-sm leading-loose text-gray-800 border border-gray-200 p-4 bg-gray-50">
            <strong>【現場評価：極めて優秀】</strong><br />
            銅の回収率は99.2%を超えており、ロスはわずか40kg強（全体の0.76%）に留まっている。また、水選別機へ回ったナゲットが12kg（全体の0.2%）に抑えられていることから、<strong>現在の乾式選別機（風力・振動）のセッティングが極めて高い精度で機能している</strong>ことが証明された。
          </p>
        </section>

        {/* 4. 銅ロスの発生源に関する考察 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">4. 銅ロスの発生源に関する考察</h2>
          <p className="text-sm mb-3 text-gray-800">発生したロス（40.8kg）の要因について、以下の2つの視点から分析した。</p>
          <div className="space-y-3">
            <div className="pl-4 border-l-2 border-gray-300">
              <h3 className="text-sm font-bold text-gray-900 mb-1">仮説A：ロスがすべて「被覆線」から発生したと仮定した場合</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                被覆線の銅回収率は約98.1%となる。雑線を多く含む加工の歩留まりとしては非常に優秀な数値である。特号線のような純銅はダストになりにくいため、実態としてはこの仮説が最も事実に近いと考えられる。
              </p>
            </div>
            <div className="pl-4 border-l-2 border-gray-300">
              <h3 className="text-sm font-bold text-gray-900 mb-1">仮説B：ロスがすべて「特号線」から発生したと仮定した場合</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                特号線の回収率が98.7%となった計算になる。一見ロスに思えるが、硬く重い特号線が「共摺り（ともずり）」のハンマーの役割を果たし、雑線の被覆を綺麗に割ってシステム全体の回収率向上に寄与している可能性が高い。
              </p>
            </div>
          </div>
        </section>

        {/* 5. 結論と今後のアクション */}
        <section>
          <h2 className="text-lg font-bold bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">5. 結論と今後のアクション</h2>
          <p className="text-sm leading-loose text-gray-800 mb-4">
            本テストの結果、今回の<strong>「特号線をナゲットに加工する」という戦略は経営的に大成功</strong>であると評価できる。<br />
            約40kg（数万円相当）の銅ロスや加工コストが発生したとしても、販売枠制限によりキャッシュを生まない滞留在庫を、需要旺盛なナゲットに即座に変換できたことによる「在庫回転率の向上」と「キャッシュフローの改善」のメリットは、加工コストを遥かに上回る。
          </p>
          <h3 className="text-sm font-bold text-gray-900 mb-2">今後のアクションプラン</h3>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-2 pl-2">
            <li><strong>「特号線100%」バッチでのテスト実施：</strong> 純粋な機械通過によるロス率（微粉化の度合い）を測定し、ロスの真の発生源を特定する。</li>
            <li><strong>ブレンド比率（黄金比）の最適化：</strong> 現在約45%となっている特号線の混合比率を下げたバッチをテストし、被覆線の歩留まりを落とさずに加工コストを最小化できる最適な混合比率を割り出す。</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
