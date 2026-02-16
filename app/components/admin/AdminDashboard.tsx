"use client";
import React, { useState, useEffect } from 'react';
import { MarketData } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// アイコン定義 (Admin専用)
const Icons = {
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Box: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Check: () => <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>,
};

interface AdminProps {
  data: MarketData | null;
  setView: (view: any) => void;
}

export const AdminDashboard = ({ data, setView }: AdminProps) => {
  const [adminTab, setAdminTab] = useState<'POS' | 'STOCK' | 'MEMBERS'>('POS');
  const [posUser, setPosUser] = useState<string>('');
  const [posProduct, setPosProduct] = useState<string>('');
  const [posWeight, setPosWeight] = useState<string>('');
  const [posRank, setPosRank] = useState<'A'|'B'|'C'>('B');
  const [posResult, setPosResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completeTxId, setCompleteTxId] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [lastTxData, setLastTxData] = useState<any>(null);
  
  // ★修正ポイント: Hydration Error対策 (サーバーとクライアントの日付不一致を防ぐ)
  const [dateStr, setDateStr] = useState<string>('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString());
  }, []);

  const marketPrice = data?.config?.market_price || 0;

  // POS計算ロジック
  const handlePosCalculate = () => {
    if (!posProduct || !posWeight) { alert("商品と重量を入力してください"); return; }
    const product = data?.wires.find(p => p.id === posProduct) || data?.castings.find(p => p.id === posProduct); // Both Wire and Casting
    if (!product) return;
    
    const weight = parseFloat(posWeight);
    const rankBonus = posRank === 'A' ? 1.02 : posRank === 'C' ? 0.95 : 1.0;
    const marketFactor = 0.90; 
    const processingCost = 15;

    // Castingの場合は price_offset を使う、Wireの場合は ratio 計算
    let rawPrice = 0;
    if ('price_offset' in product) {
        // Casting Logic: (LME * Ratio) - Offset
        rawPrice = (marketPrice * (product.ratio / 100)) - (product.price_offset || 0);
    } else {
        // Wire Logic
        rawPrice = (marketPrice * (product.ratio / 100) * marketFactor) - processingCost;
    }

    const adjustedPrice = rawPrice * rankBonus;
    const finalUnitPrice = Math.max(0, Math.floor(adjustedPrice));
    
    setPosResult(Math.floor(finalUnitPrice * weight));
    setCompleteTxId(null);
  };

  // 取引登録 & 明細発行
  const handlePosSubmitWithInvoice = async () => {
    if (isSubmitting || !posResult) return;
    setIsSubmitting(true);
    const product = data?.wires.find(p => p.id === posProduct) || data?.castings.find(p => p.id === posProduct);
    
    const payload = {
      action: 'REGISTER_TRANSACTION',
      memberId: posUser || 'GUEST',
      productId: posProduct,
      productName: product ? product.name : 'Unknown',
      weight: parseFloat(posWeight),
      rank: posRank,
      price: posResult
    };

    try {
      const res = await fetch('/api/gas', { method: 'POST', body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.status === 'success') {
        setLastTxData({
           id: result.data.transactionId,
           member: posUser || 'Guest',
           product: product?.name || 'Unknown',
           weight: posWeight,
           rank: posRank,
           price: posResult
        });
        setShowInvoiceModal(true);
        setPosProduct(''); setPosWeight(''); setPosResult(null);
      } else { alert('登録エラー: ' + result.message); }
    } catch (e) { alert('通信エラー'); } finally { setIsSubmitting(false); }
  };

  // PDF発行ロジック (簡易版)
  const loadFont = async (doc: any) => {
    try {
      const res = await fetch('/fonts/NotoSansJP-Regular.ttf');
      if (!res.ok) throw new Error('Font file not found');
      const fontBuffer = await res.arrayBuffer();
      const fontBase64 = Buffer.from(fontBuffer).toString('base64');
      doc.addFileToVFS('NotoSansJP.ttf', fontBase64);
      doc.addFont('NotoSansJP.ttf', 'NotoSansJP', 'normal');
      doc.setFont('NotoSansJP');
      return true;
    } catch (e) {
      console.error("Font loading failed", e);
      alert("日本語フォントの読み込みに失敗しました。");
      return false;
    }
  };

  const generateInvoicePDF = async () => {
    if(!lastTxData) return;
    const doc = new jsPDF();
    const fontLoaded = await loadFont(doc);
    if (!fontLoaded) return;

    doc.setFontSize(20); doc.text("買取明細書 兼 仕切書", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`取引ID: ${lastTxData.id}`, 15, 30);
    doc.text(`日付: ${new Date().toLocaleDateString()}`, 15, 35);
    
    const taxRate = 0.10;
    const price = lastTxData.price || 0;
    const tax = Math.floor(price * taxRate);
    const total = price + tax;

    autoTable(doc,
