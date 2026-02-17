import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // srcディレクトリを使っていない場合は下記を使用
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // layout.tsxで定義した変数をここでお膳立てします
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
        serif: ["var(--font-noto-sans-jp)", "serif"], 
      },
      colors: {
        primary: {
          DEFAULT: "#D32F2F", // 月寒レッド
          dark: "#B71C1C",
        },
        metal: {
          DEFAULT: "#111111", // 鉄・黒
          gray: "#666666",
        }
      },
    },
  },
  plugins: [],
};
export default config;
