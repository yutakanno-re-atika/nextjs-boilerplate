"use client";
import React from 'react';

const Icons = {
  Brain: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Eye: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Radar: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Target: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>,
  Chat: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  Document: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  TrendingUp: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
};

export default function AIStrategyReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      className="min-h-screen bg-gray-100 py-10 font-sans print:bg-white print:py-0 text-gray-900"
      style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}
    >
      {/* 画面上部のアクションバー（印刷時には非表示） */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-end print:hidden px-4 md:px-0">
        <button 
          onClick={handlePrint} 
          className="bg-[#D32F2F] text-white px-6 py-3 rounded-sm font-bold shadow-sm hover:bg-red-800 transition flex items-center gap-2"
        >
          <Icons.Document /> PDFとして保存・印刷する
        </button>
      </div>

      {/* --- PAGE 1: 表紙 & Executive Summary --- */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-md print:shadow-none p-[20mm] box-border relative overflow-hidden print:break-after-page flex flex-col justify-between border-t-8 border-[#D32F2F]">
        
        <header className="text-center mt-10">
          <p className="text-[#D32F2F] font-bold tracking-[0.3em] text-sm mb-4">NEXT GENERATION RECYCLING PLATFORM</p>
          <h1 className="text-5xl font-black font-serif tracking-tight text-gray-900 mb-6 leading-tight">
            FACTORY OS
          </h1>
          <h2 className="text-xl font-bold text-gray-600 bg-gray-50 inline-block px-6 py-2 border border-gray-200 rounded-full">
            最前線の非鉄金属リサイクル工場から始まる、究極のデータエコシステム
          </h2>
        </header>

        <section className="my-16 bg-gray-900 text-white p-10 rounded-sm relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 opacity-10 transform scale-150 translate-x-10 -translate-y-10">
            <Icons.Brain />
          </div>
          <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Executive Summary</h3>
          <p className="text-base leading-relaxed text-gray-300 font-medium">
            従来の非鉄金属リサイクル業界は、相場の変動、歩留まりの目利き、属人的な営業手法など、不確実性に依存するビジネスモデルでした。<br/><br/>
            「FACTORY OS」は、モノ（廃電線）、カネ（LME相場と限界利益）、情報（顧客対応・営業）のすべての流れをデジタル化し、最新のGenerative AIとVision AIを組み込むことで、属人化を完全に排除。<br/><br/>
            工場の稼働効率と利益率を極限まで高める<strong className="text-white">「自己進化型プラットフォーム」</strong>です。
          </p>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-black text-gray-900 text-center mb-8 flex items-center justify-center gap-3">
            <span className="w-12 h-1 bg-[#D32F2F]"></span>
            AIが循環を加速させるフライホイール
            <span className="w-12 h-1 bg-[#D32F2F]"></span>
          </h3>
          
          <div className="flex justify-between items-center bg-gray-50 p-8 border border-gray-200 rounded-sm">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-white border-2 border-gray-900 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-sm">1</div>
              <p className="font-bold text-sm">現場のPOS実測<br/><span className="text-[10px] text-gray-500">正確な計量・検収</span></p>
            </div>
            <div className="text-[#D32F2F] font-black">▶</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-sm">2</div>
              <p className="font-bold text-sm">AI自動学習<br/><span className="text-[10px] text-gray-500">教師データの蓄積</span></p>
            </div>
            <div className="text-[#D32F2F] font-black">▶</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-white border-2 border-gray-900 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-sm">3</div>
              <p className="font-bold text-sm">AIターゲティング<br/><span className="text-[10px] text-gray-500">新規リード自動抽出</span></p>
            </div>
            <div className="text-[#D32F2F] font-black">▶</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-sm">4</div>
              <p className="font-bold text-sm">自動接客・獲得<br/><span className="text-[10px] text-gray-500">AIコンシェルジュ</span></p>
            </div>
          </div>
        </section>

        <footer className="text-right text-sm font-bold text-gray-500 pt-4 border-t border-gray-200">
          株式会社 月寒製作所 苫小牧工場
        </footer>
      </div>

      {/* --- PAGE 2: コア機能解説 --- */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-md print:shadow-none p-[20mm] box-border relative overflow-hidden print:break-after-page flex flex-col justify-between">
        
        <header className="mb-8 border-b-2 border-gray-900 pb-4">
          <h2 className="text-2xl font-black font-serif tracking-widest text-gray-900">
            CORE AI ARCHITECTURE <span className="text-[#D32F2F]">|</span> 実装機能群
          </h2>
        </header>

        <div className="flex-1 space-y-6">
          
          {/* Feature 1 */}
          <div className="flex gap-6 items-stretch border border-gray-200 rounded-sm p-5 bg-gray-50">
            <div className="w-16 h-16 bg-[#D32F2F] text-white rounded-sm flex items-center justify-center shrink-0 shadow-md">
              <Icons.Eye />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-1">【査定・計量】 Vision AI ハイブリッド画像査定</h3>
              <p className="text-sm font-bold text-[#D32F2F] mb-3">AIの視覚と、職人の感覚（ヒント）が融合する究極の目利き。</p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                <li><span className="font-bold">単一線種分析：</span> 断面・印字画像と作業員の「音声ヒント」から、線種と歩留まりを瞬時に推論。</li>
                <li><span className="font-bold">フレコン一括査定：</span> 複数画像から内容物の構成割合、平均銅歩留まり、推計重量を一括で推論。</li>
                <li className="text-gray-500 text-xs mt-2 list-none bg-white p-2 border border-gray-200">💡 <span className="font-bold">AI戦略：</span> 表面から見えない情報（重さなど）を人間が補完する設計により、査定の取りこぼしをゼロに。</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-6 items-stretch border border-gray-200 rounded-sm p-5 bg-white">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-sm flex items-center justify-center shrink-0 shadow-md">
              <Icons.Radar />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-1">【プライシング】 相場レーダー ＆ 動的限界利益計算</h3>
              <p className="text-sm font-bold text-gray-600 mb-3">絶対に赤字を出さない。競合の動きを24時間監視する防衛線。</p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                <li><span className="font-bold">限界単価の算出：</span> LME相場から処分費・加工費・目標利益を逆算し、赤字にならない単価を提示。</li>
                <li><span className="font-bold">競合サイト自動巡回：</span> AIが競合他社のWebを巡回し、表記の揺れを自己学習しながら自社品目にマッピング。</li>
                <li className="text-gray-500 text-xs mt-2 list-none bg-gray-50 p-2 border border-gray-200">💡 <span className="font-bold">AI戦略：</span> 自社と競合の価格差をリアルタイム比較し、過度な安売りや高値掴みを防ぐデータドリブンな値決め。</li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-6 items-stretch border border-gray-200 rounded-sm p-5 bg-gray-50">
            <div className="w-16 h-16 bg-[#D32F2F] text-white rounded-sm flex items-center justify-center shrink-0 shadow-md">
              <Icons.Target />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-1">【営業・マーケティング】 AIスナイパー ＆ ディープリサーチ</h3>
              <p className="text-sm font-bold text-[#D32F2F] mb-3">テレアポリストは不要。自社の強みが刺さる顧客だけを狙い撃つ。</p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                <li><span className="font-bold">優良顧客の教師データ化：</span> 既存のSランク顧客データをAIに読み込ませ、類似する地場の有力企業を自動抽出。</li>
                <li><span className="font-bold">自動プロファイリング：</span> 抽出した企業のWeb情報から排出特性を分析し、最適な営業提案シナリオを生成。</li>
                <li className="text-gray-500 text-xs mt-2 list-none bg-white p-2 border border-gray-200">💡 <span className="font-bold">AI戦略：</span> 大手支店などのノイズを排除し、「良質な原料」を持つ企業だけを高精度にリストアップするスケーラブルな営業基盤。</li>
              </ul>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex gap-6 items-stretch border border-gray-200 rounded-sm p-5 bg-white">
            <div className="w-16 h-16 bg-gray-900 text-white rounded-sm flex items-center justify-center shrink-0 shadow-md">
              <Icons.Chat />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-1">【顧客接点・品質保証】 AIコンシェルジュ ＆ 仮想トレーニング</h3>
              <p className="text-sm font-bold text-gray-600 mb-3">24時間働くトップセールスと、安全を担保するAI同士の模擬演習。</p>
              <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
                <li><span className="font-bold">AI接客と自動FAQ：</span> 常に最新の相場カンペを持ったAIが接客。チャットログからリアルなFAQを自動更新。</li>
                <li><span className="font-bold">仮想トレーニング：</span> 架空の顧客ペルソナを生成し、AI同士で模擬チャットを実施。</li>
                <li className="text-gray-500 text-xs mt-2 list-none bg-gray-50 p-2 border border-gray-200">💡 <span className="font-bold">AI戦略：</span> 顧客体験（CX）向上と、盗難品買取拒否などのコンプライアンス要件が機能しているかを本番前に自動テスト。</li>
              </ul>
            </div>
          </div>

        </div>
        
        <footer className="text-right text-sm font-bold text-gray-500 pt-4 border-t border-gray-200 mt-4">
          株式会社 月寒製作所 苫小牧工場
        </footer>
      </div>

      {/* --- PAGE 3: ビジネスインパクト --- */}
      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-md print:shadow-none p-[20mm] box-border relative overflow-hidden flex flex-col justify-between">
        
        <header className="mb-10 border-b-2 border-[#D32F2F] pb-4">
          <h2 className="text-2xl font-black font-serif tracking-widest text-gray-900">
            BUSINESS IMPACT <span className="text-gray-400">|</span> もたらす価値
          </h2>
        </header>

        <div className="flex-1">
          <div className="bg-gray-900 text-white p-10 rounded-sm mb-10 text-center shadow-xl">
            <Icons.TrendingUp />
            <h3 className="text-3xl font-black mt-4 mb-2">FACTORY OSがもたらす3つの確信</h3>
            <p className="text-gray-400 font-bold">データとAIが、工場経営の不確実性を排除します。</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="text-5xl font-black text-[#D32F2F] opacity-80">1</div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">収益の最大化とリスクの完全排除</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  精緻な限界単価計算ロジックと、AIによる24時間の競合価格監視により、相場急変時でも確実な利幅を確保します。<br/>
                  さらに、Vision AIによるハイブリッド査定が、人間の「歩留まりの目利きエラー」による致命的な損失を未然に防ぎます。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="text-5xl font-black text-gray-800 opacity-80">2</div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">スケーラビリティと圧倒的な生産性向上</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  紙の伝票を廃止し、POSから製造ラインまでのモノの流れをカンバンボードで可視化。<br/>
                  また、AIスナイパーによる高効率なターゲティング営業により、バックオフィスの人員を増やすことなく、処理量と取引先を飛躍的に拡大させることが可能です。
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="text-5xl font-black text-gray-800 opacity-80">3</div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2 border-b border-gray-200 pb-2">組織リテラシーの底上げとコンプライアンス</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  AI経営週報がデータを解釈して工場長へ戦略を提言し、教育メンターAIが現場スタッフのシステム習熟をサポートします。<br/>
                  写真による検収記録や電子帳票出力と合わせ、業界特有の属人化や法的リスクを最小化し、クリーンな事業運営を実現します。
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="text-center pt-8 border-t-2 border-gray-900 mt-12">
          <p className="text-xl font-black font-serif tracking-widest text-gray-900 mb-2">株式会社 月寒製作所</p>
          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Tsukisamu Manufacturing Co., Ltd.</p>
        </footer>
      </div>

    </div>
  );
}
