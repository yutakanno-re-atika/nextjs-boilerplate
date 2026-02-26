"use client";
import React from 'react';

export default function YieldReport() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans print:bg-white print:py-0 text-gray-900">
      
      {/* 画面上部のアクションバー（印刷時には消えます） */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-end print:hidden px-4 md:px-0">
        <button 
          onClick={handlePrint} 
          className="bg-[#D32F2F] text-white px-6 py-3 rounded-sm font-bold shadow-lg hover:bg-red-800 transition flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          PDFとして保存・印刷する
        </button>
      </div>

      {/* A4サイズのレポート本体 */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-2xl print:shadow-none p-6 md:p-[20mm] box-border relative overflow-hidden">
        
        {/* レポートヘッダー */}
        <header className="border-b-2 border-gray-900 pb-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-6">
            <h1 className="text-xl md:text-2xl font-serif font-black tracking-widest text-gray-900">
              銅ナゲット製造実績と<br />歩留まりに関するご報告
            </h1>
            <div className="text-left md:text-right text-sm">
              <p className="font-mono text-gray-600">発行日: 2026年2月26日</p>
              <p className="font-bold text-gray-900 mt-1">株式会社 月寒製作所</p>
              <p className="text-gray-700 mt-0.5">作成: 菅野 雄太</p>
              <p className="text-xs text-gray-500">分析: AI Data Analyst (Gemini)</p>
            </div>
          </div>
        </header>

        {/* 1. 今回のテストの背景と狙い */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">1. 今回のテストの背景と狙い</h2>
          <p className="text-sm leading-loose text-gray-800">
            お疲れ様です！現在、特号線（ピカ線）の販売枠がいっぱいで倉庫に眠ってしまっている一方で、ナゲットは需要が旺盛なのに原料の被覆線が足りない…という状況でしたよね。<br />
            そこで今回は、ボスのアイデアのもと<strong>「売れない在庫（特号線など）を思い切って被覆線に混ぜてナゲット加工する」</strong>というテストを行いました。眠っている在庫を「すぐ売れる製品」に変えてキャッシュを生み出せるか、またその時に歩留まりがどうなるかを確認するのが目的です！
          </p>
        </section>

        {/* 2. 製造実績データ */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">2. 製造データ（トータル7.2tバッチ）</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">▼ 投入した原料（インプット）</h3>
              <ul className="text-sm space-y-1 text-gray-700 mb-4">
                <li className="flex justify-between"><span>特号線 (100%)</span><span className="font-mono font-bold text-gray-900">3,249 kg</span></li>
                <li className="flex justify-between"><span>1号線 (99%)</span><span className="font-mono font-bold text-gray-900">198 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (75%)</span><span className="font-mono font-bold text-gray-900">291 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (58%)</span><span className="font-mono font-bold text-gray-900">446 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (56%)</span><span className="font-mono font-bold text-gray-900">1,191 kg</span></li>
                <li className="flex justify-between"><span>被覆線 (42%)</span><span className="font-mono font-bold text-gray-900">1,866 kg</span></li>
              </ul>
              <div className="bg-red-50 p-3 rounded-sm border border-red-100">
                <div className="flex justify-between font-bold text-[#D32F2F] mb-1">
                  <span>総投入量:</span><span className="font-mono text-lg">7,241 kg</span>
                </div>
                <div className="flex justify-between text-xs text-red-800">
                  <span>理論上取れるはずの銅:</span><span className="font-mono">5,372.6 kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-300 pb-1">▼ 出来上がった製品（アウトプット）</h3>
              <ul className="text-sm space-y-1 text-gray-700 mb-4">
                <li className="flex justify-between"><span>銅ナゲット (100%)</span><span className="font-mono font-bold text-gray-900">5,320 kg</span></li>
                <li className="flex justify-between"><span>水揚げナゲット (98%)</span><span className="font-mono font-bold text-gray-900">12 kg</span></li>
              </ul>
              <div className="bg-gray-800 p-3 rounded-sm text-white md:mt-16">
                <div className="flex justify-between font-bold mb-1">
                  <span>総産出量:</span><span className="font-mono text-lg">5,332 kg</span>
                </div>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>実際に回収できた銅:</span><span className="font-mono">5,331.8 kg</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 歩留まり・回収率の評価 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-4">3. 歩留まりと回収率の評価</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 border border-gray-300 p-3 text-center rounded-sm">
              <p className="text-xs text-gray-600 font-bold mb-1">重量ベースの歩留まり</p>
              <p className="text-2xl font-black font-mono text-gray-900">73.64 <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="flex-1 border-2 border-[#D32F2F] p-3 text-center rounded-sm bg-red-50/30">
              <p className="text-xs text-[#D32F2F] font-bold mb-1">実際の銅回収率</p>
              <p className="text-2xl font-black font-mono text-[#D32F2F]">99.24 <span className="text-sm font-normal">%</span></p>
            </div>
            <div className="flex-1 border border-gray-300 p-3 text-center rounded-sm">
              <p className="text-xs text-gray-600 font-bold mb-1">加工中の銅ロス量</p>
              <p className="text-2xl font-black font-mono text-gray-900">40.8 <span className="text-sm font-normal">kg</span></p>
            </div>
          </div>

          <p className="text-sm leading-loose text-gray-800 border border-gray-300 p-4 bg-gray-50 rounded-sm">
            <strong>【現場からの嬉しいご報告！】</strong><br />
            なんと、銅の回収率が99.2%を超えました！理論値からのロスはわずか40kg強（全体の0.76%）に収まっています。手間のかかる水選別機に回ったナゲットもたった12kgだけで済んだので、<strong>今の乾式選別機（風力や振動）の設定がバッチリ決まっている</strong>証拠です！
          </p>
        </section>

        {/* 4. ちょっとしたロスはどこから来た？ */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">4. ちょっとしたロス（40.8kg）はどこから来た？</h2>
          <p className="text-sm mb-3 text-gray-800">全体のロスはごくわずかですが、どこで消えたのか2つのパターンで考えてみました。</p>
          <div className="space-y-4">
            <div className="pl-4 border-l-2 border-gray-400">
              <h3 className="text-sm font-bold text-gray-900 mb-1">仮説A：すべて「被覆線」から出た場合</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                この場合、被覆線の銅回収率は約98.1%になります。雑線を多く含んでいるのにこの数字はかなり優秀です！硬い特号線がダストになるとは考えにくいので、実態としてはこの仮説が一番事実っぽいですね。
              </p>
            </div>
            <div className="pl-4 border-l-2 border-gray-400">
              <h3 className="text-sm font-bold text-gray-900 mb-1">仮説B：すべて「特号線」から出た場合</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                特号線同士が機械の中でぶつかり合って微粉になったパターンです。ただ、重くて硬い特号線が「ハンマー」の代わりになって、雑線の被覆を綺麗に砕いてくれた（共摺り効果）とも言えるので、全体を良くする起爆剤になってくれた可能性があります！
              </p>
            </div>
          </div>
        </section>

        {/* 5. 結論と次へのステップ */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 bg-gray-100 px-3 py-1.5 border-l-4 border-[#D32F2F] mb-3">5. 結論と次へのステップ</h2>
          <p className="text-sm leading-loose text-gray-800 mb-4">
            結論として、今回の<strong>「特号線を思い切ってナゲットにしちゃう戦略」は、経営的に見て大成功</strong>だと言えます！<br />
            数万円分のロスや加工費が出たとしても、眠っていた在庫を「すぐ売れるナゲット」に変えてキャッシュを生み出せたメリットの方が圧倒的に大きいです。在庫回転率が一気に上がりますね。
          </p>
          <h3 className="text-sm font-bold text-gray-900 mb-2">▼ 次にやりたいこと</h3>
          <ul className="list-disc list-inside text-sm text-gray-800 space-y-2 pl-2">
            <li><strong>「特号線100%」だけでテストしてみる：</strong> 特号線だけを流してみて、本当に機械の中で削れてロスになるのか確認してみたいです！</li>
            <li><strong>ブレンドの「黄金比」を見つける：</strong> 今回は特号線が約45%でしたが、これを20〜30%に減らしても被覆線が綺麗に割れるのかテストし、一番コスパの良い配合を見つけていきたいです。</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
