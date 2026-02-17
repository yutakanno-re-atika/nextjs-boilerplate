import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // ゴシック体
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
        // 明朝体 (これを追加)
        serif: ["var(--font-noto-serif-jp)", "serif"], 
      },
      colors: {
        primary: {
          DEFAULT: "#D32F2F", 
          dark: "#B71C1C",
        },
        metal: {
          DEFAULT: "#111111",
          gray: "#666666",
        }
      },
    },
  },
  plugins: [],
};
export default config;
