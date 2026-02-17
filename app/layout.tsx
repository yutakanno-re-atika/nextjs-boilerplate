import type { Metadata } from "next";
// 日本語サイトに適したGoogleフォント (Noto Sans JP) を導入
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// Noto Sans JP フォントの設定
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"], // 必要なウェイトを指定
  variable: "--font-noto-sans-jp", // CSS変数を定義
  display: "swap", // フォント読み込み時の表示崩れを防ぐ
});

// メタデータの定義 (重複を解消し、日本語に最適化)
export const metadata: Metadata = {
  title: "Wire Master Cloud | 月寒製作所",
  description: "月寒製作所が提供する、次世代の廃電線リサイクル・買取プラットフォーム。LME連動の透明な価格提示と、製造管理までを見据えた統合システムです。",
  // OGP設定などを追加すると、SNSでシェアされた際の見栄えが良くなります
  openGraph: {
    title: "Wire Master Cloud | 月寒製作所",
    description: "次世代の廃電線買取・製造管理プラットフォーム",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 言語設定を日本語 (ja) に変更
    <html lang="ja" className={notoSansJP.variable}>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
