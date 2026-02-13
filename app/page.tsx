{/* =================================================================
            以下、省略していたセクションの完全版コードです。
            シミュレーション終了タグ </section> の直後に貼り付けてください。
           ================================================================= */}

        {/* PRICE LIST SECTION */}
        <section className="py-24 bg-[#111] text-white">
          <div className="max-w-[1000px] mx-auto px-6">
            <div className="text-center mb-16">
              <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Today's Price</span>
              <h2 className="text-4xl font-serif font-medium text-white">本日の買取価格一覧</h2>
              <p className="text-gray-500 mt-4 text-sm font-mono">※相場変動により予告なく変更する場合があります</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {data?.products?.map((product) => (
                <div key={product.id} className="group relative bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] text-[#D32F2F] font-bold tracking-widest uppercase mb-1 block">{product.category}</span>
                      <h3 className="text-xl font-bold font-serif">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 font-mono">{product.sq}sq / {product.core}C / {product.maker}</p>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-serif font-bold tracking-tighter">
                         ¥{Math.floor(marketPrice * (product.ratio / 100) * 0.9).toLocaleString()}
                         <span className="text-xs text-gray-500 font-normal ml-1">/kg</span>
                       </div>
                       <div className="text-[10px] text-gray-500 mt-1">銅率 {product.ratio}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-[1px] group-hover:bg-[#D32F2F] transition-colors"></div>
                </div>
              ))}
              {(!data?.products || data.products.length === 0) && (
                <div className="col-span-2 text-center py-12 text-gray-500 font-serif">
                  データを読み込んでいます...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-white text-[#111]">
          <div className="max-w-[800px] mx-auto px-6">
             <div className="text-center mb-16">
               <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Q & A</span>
               <h2 className="text-4xl font-serif font-medium">よくあるご質問</h2>
             </div>
             <div className="space-y-4">
               {FAQ_ITEMS.map((item, i) => (
                 <div key={i} className="border-b border-gray-200">
                   <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full text-left py-6 flex justify-between items-center group">
                     <span className="font-bold text-lg font-serif group-hover:text-[#D32F2F] transition-colors">{item.q}</span>
                     <span className={`transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-[#D32F2F]' : 'text-gray-400'}`}><Icons.ChevronDown /></span>
                   </button>
                   <div className={`overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                     <p className="text-gray-600 leading-relaxed text-sm">{item.a}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* ACCESS SECTION */}
        <section className="py-24 bg-[#F5F5F7] text-[#111] border-t border-gray-200">
           <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                 <div>
                    <span className="text-[#D32F2F] text-xs font-bold tracking-[0.3em] uppercase block mb-3">Location</span>
                    <h2 className="text-4xl font-serif font-medium mb-6">工場アクセス</h2>
                    <p className="text-gray-600 leading-loose text-sm font-medium">
                       株式会社 月寒製作所 苫小牧工場<br/>
                       〒053-0000 北海道苫小牧市勇払123-4<br/>
                       TEL: 0144-00-0000 / FAX: 0144-00-0001
                    </p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white p-4 border border-gray-200 shadow-sm">
                       <div className="w-10 h-10 bg-[#111] text-white flex items-center justify-center text-lg">🚛</div>
                       <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">お車でお越しの方</p>
                          <p className="font-bold text-sm">日高自動車道「沼ノ端東IC」より車で5分</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 bg-white p-4 border border-gray-200 shadow-sm">
                       <div className="w-10 h-10 bg-[#111] text-white flex items-center justify-center text-lg">🕒</div>
                       <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">営業時間</p>
                          <p className="font-bold text-sm">8:00 - 17:00 (日曜・祝日定休)</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="h-[400px] bg-gray-300 relative grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border-4 border-white">
                 {/* 地図埋め込み（ダミー） */}
                 <iframe 
                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23467.58988647056!2d141.6888283944641!3d42.63659228498808!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f7560d268153c9f%3A0x629c42621415058!2z5YyX5rW36YGT6Iu-5om_5biC!5e0!3m2!1sja!2sjp!4v1707820000000!5m2!1sja!2sjp" 
                   width="100%" height="100%" style={{border:0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                   className="absolute inset-0 w-full h-full"
                 ></iframe>
              </div>
           </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#111] text-white py-12 border-t border-white/10">
           <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-8">
              <div>
                 <h2 className="text-xl font-serif font-bold tracking-widest mb-2">TSUKISAMU MFG.</h2>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest">Next Generation Recycling System</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-gray-600">© 2026 Tsukisamu Manufacturing Co., Ltd. All Rights Reserved.</p>
                 <div className="flex gap-4 justify-end mt-2">
                    <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                 </div>
              </div>
           </div>
        </footer>
