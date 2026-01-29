# 🤖 AI Tool Hub

<p align="center">
  <strong>探索、比較和評價最佳 AI 工具的一站式平台</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Prisma-7.3.0-2D3748?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
</p>

<p align="center">
  <a href="#-功能特色">功能特色</a> •
  <a href="#-技術棧">技術棧</a> •
  <a href="#-快速開始">快速開始</a> •
  <a href="#-專案結構">專案結構</a> •
  <a href="#-截圖展示">截圖展示</a>
</p>

---

## 📖 專案簡介

AI Tool Hub 是一個現代化的 AI 工具探索平台，幫助用戶發現、比較和評價各種 AI 工具。本專案使用 Next.js 16 App Router 構建，採用 Glassmorphism 設計風格，提供完整的用戶系統、社群功能和管理後台。

### 🎯 核心價值

- **發現** - 瀏覽精選的 AI 工具目錄
- **比較** - 並排對比多個工具的功能與定價
- **評價** - 閱讀和撰寫真實用戶評論
- **分享** - 建立和分享個人工具合集

---

## ✨ 功能特色

### 🔍 探索與搜尋
- **全域搜尋** - 快捷鍵 `Ctrl+K` 開啟搜尋，即時顯示建議
- **多維篩選** - 分類、定價模式、標籤多條件組合
- **智能排序** - 評分、名稱、最新更新排序

### 📊 工具比較
- **並排對比** - 最多同時比較 4 個工具
- **全面分析** - 功能特色、定價方案、評分一目瞭然
- **分享連結** - 一鍵產生比較結果連結

### 👤 完整用戶系統
- **多方式登入** - Email/密碼、Google OAuth、GitHub OAuth
- **個人儀表板** - 收藏管理、評論歷史、提交記錄
- **帳號設定** - 主題切換、通知偏好、安全設定
- **密碼強度檢測** - 即時顯示密碼安全等級

### ⭐ 收藏與合集
- **快速收藏** - 一鍵收藏工具，localStorage + 雲端同步
- **自訂合集** - 建立分類整理的工具合集
- **隱私控制** - 合集可設為公開或私人

### 💬 社群互動
- **評論評分** - 1-5 星評分，可填寫優缺點
- **按讚功能** - 為有幫助的評論按讚
- **工具提交** - 用戶可提交新發現的 AI 工具

### 🛡️ 管理後台
- **數據總覽** - 工具數、用戶數、評論數、待審核統計
- **工具管理** - 新增、編輯、刪除、精選標記
- **用戶管理** - 角色變更、帳號啟用/停用
- **評論管理** - 隱藏/刪除不當內容
- **提交審核** - 審核用戶提交的新工具

### 🎨 設計亮點
- **Glassmorphism** - 現代毛玻璃設計風格
- **響應式佈局** - 完美適配桌面、平板、手機
- **深色模式** - 自動偵測系統偏好 / 手動切換
- **無障礙設計** - 遵循 WCAG AA+ 標準
- **動畫效果** - 支持 `prefers-reduced-motion`

---

## 🛠️ 技術棧

### 前端
| 技術 | 版本 | 說明 |
|------|------|------|
| **Next.js** | 16.1.1 | React 框架，使用 App Router |
| **React** | 19 | UI 函式庫 |
| **TypeScript** | 5 | 型別安全 |
| **Tailwind CSS** | 4 | 實用優先的 CSS 框架 |
| **shadcn/ui** | - | 高品質 UI 元件庫 |
| **Lucide** | - | 現代化圖標庫 |

### 後端
| 技術 | 版本 | 說明 |
|------|------|------|
| **Prisma** | 7.3.0 | ORM 資料庫工具 |
| **SQLite** | - | 輕量級關聯式資料庫 |
| **NextAuth.js** | v5 | 認證解決方案 (JWT) |

### 開發工具
| 工具 | 說明 |
|------|------|
| **ESLint** | 程式碼品質檢查 |
| **Prettier** | 程式碼格式化 |
| **Git** | 版本控制 |

---

## 🎨 設計系統

### 色彩配置
| 用途 | 色碼 | 預覽 |
|------|------|------|
| Primary (主色) | `#60A5FA` | 🔵 |
| Secondary (次色) | `#818CF8` | 🟣 |
| CTA (行動) | `#F97316` | 🟠 |
| Success (成功) | `#22C55E` | 🟢 |
| Warning (警告) | `#F59E0B` | 🟡 |
| Error (錯誤) | `#EF4444` | 🔴 |

### 字體
- **標題**: Space Grotesk (Google Fonts)
- **內文**: DM Sans (Google Fonts)

### 動畫規範
- 過渡時間：150-300ms
- 緩動函數：ease-out (進入), ease-in (退出)
- 所有動畫支持 `prefers-reduced-motion`

---

## 🚀 快速開始

### 環境需求
- Node.js 18+
- npm 或 pnpm

### 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/Laurence-R/AI-Tool-Hub.git
cd AI-Tool-Hub

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入必要設定 (資料庫 URL、OAuth 金鑰等)

# 4. 初始化資料庫
npx prisma migrate dev

# 5. (可選) 匯入範例資料
npx ts-node scripts/migrate-tools.ts

# 6. 啟動開發伺服器
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000) 查看應用

### 可用腳本

```bash
npm run dev      # 開發模式
npm run build    # 生產構建
npm run start    # 啟動生產伺服器
npm run lint     # 程式碼檢查
```

### 環境變數

```env
# 資料庫
DATABASE_URL="file:./dev.db"

# NextAuth
AUTH_SECRET="your-secret-key"

# OAuth (可選)
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
```

---

## 📁 專案結構

```
ai-tool-hub/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 公開頁面路由群組
│   │   ├── about/                # 關於我們
│   │   ├── collections/          # 工具合集
│   │   ├── compare/              # 工具比較
│   │   ├── contact/              # 聯絡我們
│   │   ├── dashboard/            # 用戶儀表板
│   │   ├── favorites/            # 收藏列表
│   │   ├── login/                # 登入
│   │   ├── register/             # 註冊
│   │   ├── submit/               # 提交工具
│   │   ├── tools/                # 工具列表與詳情
│   │   └── page.tsx              # 首頁
│   ├── (admin)/                  # 管理後台路由群組
│   │   └── admin/                # 管理頁面
│   │       ├── tools/            # 工具管理
│   │       ├── users/            # 用戶管理
│   │       ├── reviews/          # 評論管理
│   │       └── submissions/      # 提交審核
│   ├── api/                      # API 路由
│   │   ├── auth/                 # 認證 API
│   │   ├── tools/                # 工具 API
│   │   ├── reviews/              # 評論 API
│   │   ├── favorites/            # 收藏 API
│   │   ├── collections/          # 合集 API
│   │   └── admin/                # 管理 API
│   ├── layout.tsx                # 根佈局
│   └── globals.css               # 全域樣式
├── components/                   # React 元件
│   ├── ui/                       # shadcn/ui 基礎元件
│   ├── layout/                   # 佈局元件 (Header, Footer)
│   ├── sections/                 # 頁面區塊元件
│   ├── tools/                    # 工具相關元件
│   ├── collections/              # 合集相關元件
│   ├── shared/                   # 共用元件
│   ├── admin/                    # 管理後台元件
│   └── providers/                # Context Providers
├── contexts/                     # React Context
│   ├── FavoritesContext.tsx      # 收藏狀態
│   ├── CompareContext.tsx        # 比較狀態
│   ├── CollectionsContext.tsx    # 合集狀態
│   └── SearchContext.tsx         # 搜尋狀態
├── hooks/                        # 自訂 Hooks
├── lib/                          # 工具函數
│   ├── prisma.ts                 # Prisma 客戶端
│   ├── auth.ts                   # 認證設定
│   ├── formatters.ts             # 格式化函數
│   └── seo.ts                    # SEO 工具
├── prisma/                       # Prisma 設定
│   ├── schema.prisma             # 資料模型
│   └── migrations/               # 資料庫遷移
├── services/                     # API 服務層
├── types/                        # TypeScript 型別
├── constants/                    # 常數定義
└── docs/                         # 專案文件
    └── DEVELOPMENT_PLAN.md       # 開發計畫
```

---

## 📊 開發進度

### 已完成功能 ✅

| 階段 | 功能 | 狀態 |
|------|------|------|
| **Phase 0** | 專案基礎建設 | ✅ 完成 |
| - | 設計系統、導覽列、頁尾 | ✅ |
| - | 首頁、登入頁、工具列表、工具詳情 | ✅ |
| **Phase 1** | 核心功能強化 | ✅ 完成 |
| - | 工具比較功能 (最多 4 個) | ✅ |
| - | 收藏功能 (localStorage) | ✅ |
| - | 搜尋優化 (Ctrl+K, 即時建議) | ✅ |
| - | SEO 優化 (Meta, JSON-LD) | ✅ |
| **Phase 2** | 使用者系統 | ✅ 完成 |
| - | NextAuth.js 認證 (JWT) | ✅ |
| - | Google / GitHub OAuth | ✅ |
| - | 用戶儀表板 | ✅ |
| - | Prisma + SQLite 資料庫 | ✅ |
| **Phase 3** | 社群功能 | ✅ 完成 |
| - | 評論評分系統 | ✅ |
| - | 工具提交與審核 | ✅ |
| - | 工具合集功能 | ✅ |
| - | 程式碼模組化重構 | ✅ |
| - | 數據架構統一 (JSON → DB) | ✅ |
| **Phase 4.3** | 管理後台 | ✅ 完成 |
| - | 管理員儀表板 | ✅ |
| - | 工具/用戶/評論管理 | ✅ |
| **Phase 4.4** | UI/UX 優化 | ✅ 完成 |
| - | 關於/聯絡頁面 | ✅ |
| - | 密碼強度檢測 | ✅ |
| - | 配色優化 | ✅ |

### 計畫中功能 📋

| 功能 | 說明 |
|------|------|
| 智慧推薦 | 基於瀏覽歷史的個人化推薦 |
| 公開 API | RESTful API 服務 |

---

## 📸 截圖展示

> 截圖待補充

| 首頁 | 工具列表 |
|------|----------|
| ![首頁](docs/screenshots/home.png) | ![工具列表](docs/screenshots/tools.png) |

| 工具比較 | 用戶儀表板 |
|----------|------------|
| ![比較](docs/screenshots/compare.png) | ![儀表板](docs/screenshots/dashboard.png) |

---

## 📱 瀏覽器支持

| 瀏覽器 | 版本 |
|--------|------|
| Chrome | 最新版本 |
| Firefox | 最新版本 |
| Safari | 最新版本 |
| Edge | 最新版本 |

---

## 🤝 貢獻

歡迎各種形式的貢獻！

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### Commit 規範

```
feat: 新功能
fix: 修復 bug
docs: 文件更新
style: 程式碼格式
refactor: 重構
perf: 效能優化
test: 測試
chore: 建置/工具
```

---

## 📄 授權

本專案採用 MIT 授權 - 詳見 [LICENSE](LICENSE) 文件

---

## 📧 聯絡方式

- GitHub: [@Laurence-R](https://github.com/Laurence-R)
- 專案連結: [https://github.com/Laurence-R/AI-Tool-Hub](https://github.com/Laurence-R/AI-Tool-Hub)

---

<p align="center">
  Built with ❤️ using Next.js, React, and Tailwind CSS
</p>

<p align="center">
  ⭐ 如果這個專案對你有幫助，請給它一個 Star！
</p>
