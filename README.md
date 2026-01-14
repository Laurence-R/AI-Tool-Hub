# 🤖 AI Tool Hub

> 探索最強大的 AI 工具生態系統 - 一站式 AI 工具導航平台

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/status-In%20Development-yellow)](https://github.com/Laurence-R/AI-Tool-Hub)

> ⚠️ **開發中專案** - 本專案正在積極開發中，部分功能尚未完成。歡迎 Star ⭐ 追蹤進度！

## ✅ 已完成功能

- **🎨 現代化 UI 設計** - 基於 Glassmorphism 風格，專業的視覺設計
- **🏠 首頁 Landing Page** - Hero Section、功能介紹、使用流程、用戶評價
- **🔍 工具搜尋與篩選** - 關鍵字搜尋、分類篩選、評分篩選、排序功能
- **🃏 工具卡片展示** - 工具列表、詳細資訊、評分顯示
- **🌓 深色模式支持** - 完整的淺色/深色主題切換
- **📱 響應式設計** - 支持桌面、平板、手機各種設備
- **🔐 登入頁面** - 基礎認證 UI（後端整合開發中）

## 🚧 開發路線圖

### 第一階段：基礎功能（進行中）
- [x] 專案架構搭建
- [x] UI/UX 設計系統
- [x] 首頁 Landing Page
- [x] 工具列表頁面
- [x] 搜尋與篩選功能
- [x] 深色模式
- [ ] 工具詳情頁面
- [ ] 使用者認證系統

### 第二階段：核心功能（計劃中）
- [ ] 工具收藏功能
- [ ] 評價與評分系統
- [ ] 工具比較功能
- [ ] 用戶儀表板
- [ ] 個人資料管理

### 第三階段：進階功能（未來）
- [ ] AI 推薦系統
- [ ] 社群評論與討論
- [ ] 工具使用統計
- [ ] API 整合
- [ ] 多語言支持

## 🚀 技術棧

### 核心框架
- **[Next.js 16](https://nextjs.org/)** - React 應用框架，支持 App Router
- **[React 19](https://react.dev/)** - 最新的 React 版本
- **[TypeScript 5](https://www.typescriptlang.org/)** - 類型安全的 JavaScript

### UI 與樣式
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 實用優先的 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 高品質的可重用組件
- **[Lucide React](https://lucide.dev/)** - 美觀的 SVG 圖標庫
- **[Radix UI](https://www.radix-ui.com/)** - 無障礙訪問的組件基礎

### 開發工具
- **[ESLint 9](https://eslint.org/)** - 代碼質量檢查
- **[next-themes](https://github.com/pacocoursey/next-themes)** - 主題切換管理

### 設計工作流
- **[ui-ux-pro-max](/.github/prompts/ui-ux-pro-max.prompt.md)** - 專業的 UI/UX 設計工作流

## 📦 快速開始

### 環境要求

- Node.js 18.17 或更高版本
- npm / yarn / pnpm / bun

### 安裝步驟

1. **克隆專案**
```bash
git clone https://github.com/Laurence-R/AI-Tool-Hub.git
cd AI-Tool-Hub
```

2. **安裝依賴**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **啟動開發伺服器**
```bash
npm run dev
```

4. **開啟瀏覽器**

訪問 [http://localhost:3000](http://localhost:3000) 查看應用

## 📁 專案結構

```
ai-tool-hub/
├── app/                      # Next.js App Router
│   ├── (routes)/            # 路由頁面
│   ├── layout.tsx           # 根布局
│   └── globals.css          # 全局樣式
├── components/              # React 組件
│   ├── ui/                  # shadcn/ui 基礎組件
│   └── ...                  # 業務組件
├── lib/                     # 工具函數
├── public/                  # 靜態資源
└── .github/                 # GitHub 配置
```

<details>
<summary>📂 查看完整結構（點擊展開）</summary>

```
ai-tool-hub/
├── app/
│   ├── login/               # 登入頁面
│   ├── tools/               # 工具列表
│   ├── layout.tsx
│   ├── page.tsx             # 首頁
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn 組件
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   ├── Hero.tsx             # Hero 區塊
│   ├── Navigation.tsx       # 導航欄
│   ├── ToolCard.tsx         # 工具卡片
│   ├── ToolsSearch.tsx      # 搜尋
│   ├── ToolsFilter.tsx      # 篩選
│   └── ...
├── lib/
│   └── utils.ts             # 工具函數
├── public/
│   └── tools/               # Logo 圖片
├── .github/
│   └── prompts/             # UI/UX 工作流
└── package.json
```

</details>

## 🛠️ 開發指南

### 可用腳本

```bash
# 開發模式
npm run dev

# 生產構建
npm run build

# 啟動生產伺服器
npm run start

# 代碼檢查
npm run lint
```

### 添加新組件

使用 shadcn/ui CLI 添加組件：

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### 設計系統

本專案遵循 [ui-ux-pro-max](.github/prompts/ui-ux-pro-max.prompt.md) 設計工作流：

- 使用 Lucide 圖標（禁用 emoji 作為 UI 圖標）
- 遵循 WCAG AA+ 無障礙標準
- 支持 `prefers-reduced-motion`
- 淺色/深色模式對比度符合標準

## 🎨 設計原則

### 顏色系統
- **Primary**: #60A5FA (藍色) - 主要品牌色
- **Secondary**: #818CF8 (紫色) - 次要強調色
- **CTA**: #F97316 (橙色) - 行動號召按鈕
- **Success**: #22C55E (綠色)
- **Warning**: #F59E0B (黃色)

### 字體
- **標題**: Space Grotesk (Google Fonts)
- **正文**: DM Sans (Google Fonts)

### 動畫
- 所有動畫支持 `prefers-reduced-motion`
- 過渡時間：150-300ms
- 緩動函數：ease-out (進入), ease-in (退出)

## 📱 瀏覽器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 🚀 部署

### Vercel (推薦)
🤝 貢獻

本專案正在積極開發中，歡迎各種形式的貢獻！

- 🐛 回報 Bug
- 💡 提出新功能建議
- 📝 改進文檔
- 🎨 UI/UX 設計建議

請通過 [GitHub Issues](https://github.com/Laurence-R/AI-Tool-Hub/issues) 與我們聯繫。

## 📊 專案狀態

- **當前版本**: v0.1.0 (Alpha)
- **開發進度**: ~40%
- **上次更新**: 2026-01-14

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 📧 聯絡方式

- GitHub: [@Laurence-R](https://github.com/Laurence-R)
- 專案連結: [https://github.com/Laurence-R/AI-Tool-Hub](https://github.com/Laurence-R/AI-Tool-Hub)

---

⭐ 如果這個專案對你有幫助，請給它一個 Star！
# 啟動
npm run start
```

詳細部署說明請參考 [Next.js 部署文檔](https://nextjs.org/docs/app/building-your-application/deploying)

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📧 聯絡方式

- GitHub: [@Laurence-R](https://github.com/Laurence-R)
- 專案連結: [https://github.com/Laurence-R/AI-Tool-Hub](https://github.com/Laurence-R/AI-Tool-Hub)

---

Built with ❤️ using Next.js and Tailwind CSS
