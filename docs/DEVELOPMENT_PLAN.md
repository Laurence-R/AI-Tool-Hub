# AI Tool Hub 開發計畫

> 最後更新：2026-01-29

## 專案概述

AI Tool Hub 是一個 AI 工具發現、比較與評價平台，幫助用戶找到最適合的 AI 工具。

### 技術棧

- **框架**: Next.js 16.1.1 (App Router)
- **語言**: TypeScript 5, React 19
- **樣式**: Tailwind CSS 4, Glassmorphism 設計
- **元件庫**: shadcn/ui
- **字體**: Space Grotesk (標題) + DM Sans (內文)
- **主色調**: #60A5FA (藍色), #818CF8 (紫色)
- **資料庫**: SQLite + Prisma 7.3.0
- **認證**: NextAuth.js v5 (JWT)

---

## 開發階段

### ✅ Phase 0: 專案基礎建設 (已完成)

- [x] 專案初始化與基本設定
- [x] 設計系統建立 (顏色、字體、元件)
- [x] 導覽列與頁尾
- [x] 首頁 Hero 區塊
- [x] 登入頁面
- [x] 工具列表頁面 (篩選、搜尋、排序)
- [x] 工具詳情頁面
- [x] 專案結構重組
  - [x] components/ 分類 (layout, sections, tools, shared)
  - [x] hooks/ 自訂 Hooks
  - [x] services/ API 服務層
  - [x] data/ 資料管理
  - [x] types/ 型別定義
  - [x] constants/ 常數定義
- [x] JSON 資料架構
  - [x] tools.json (20 個 AI 工具)
  - [x] reviews.json (13 則評論)
  - [x] categories.json (15 個分類)
- [x] 資料處理工具函數 (lib/tools.ts)

---

### ✅ Phase 1: 核心功能強化 (已完成)

目標：提升用戶體驗，無需後端即可實現的功能

#### 1.1 工具比較功能 ✅
- [x] 比較頁面 UI 設計
- [x] 選擇工具加入比較清單 (最多 4 個)
- [x] 並排比較視圖
  - [x] 基本資訊對比
  - [x] 功能對比表格
  - [x] 定價方案對比
  - [x] 評分對比
- [x] 比較狀態管理 (CompareContext)
- [x] 分享比較結果連結

#### 1.2 收藏功能 ✅
- [x] 收藏按鈕元件
- [x] localStorage 持久化
- [x] 收藏工具列表頁面
- [x] 收藏狀態同步 (FavoritesContext)

#### 1.3 搜尋優化 ✅
- [x] 導覽列即時搜尋建議
- [x] 搜尋結果即時顯示工具
- [x] 搜尋歷史記錄 (SearchContext)
- [x] 快捷鍵支援 (Ctrl+K)
- [x] URL 參數搜尋整合

#### 1.4 SEO 與效能 ✅
- [x] 各頁面 Meta 標籤
- [x] Open Graph 圖片
- [x] 結構化資料 (JSON-LD)
  - [x] WebsiteJsonLd
  - [x] OrganizationJsonLd
  - [x] SoftwareApplicationJsonLd
  - [x] BreadcrumbJsonLd
  - [x] ToolListJsonLd
- [x] SEO 工具函數 (lib/seo.ts)
- [x] 動態 Metadata 生成

---

### ✅ Phase 2: 使用者系統 (已完成)

目標：建立完整的使用者認證與個人化功能

#### 2.1 認證系統 ✅
- [x] NextAuth.js v5 整合 (JWT session)
- [x] Email/密碼登入
- [x] 使用者註冊 API
- [x] Google OAuth (已配置)
- [x] GitHub OAuth (已配置)
- [x] 密碼修改功能

#### 2.2 使用者儀表板 ✅
- [x] 個人資料頁面 (可編輯名稱，即時同步)
- [x] 收藏工具管理 (顯示/刪除)
- [x] 活動統計 (收藏數、評論數、收藏集數)
- [x] 帳號設定
  - [x] 安全性設定 (修改密碼)
  - [x] 通知設定 (Email/工具更新/每週精選)
  - [x] 外觀設定 (淺色/深色/系統主題)
  - [x] 危險區域 (登出/刪除帳號)

#### 2.3 資料庫整合 ✅
- [x] Prisma 7.3.0 + LibSQL adapter
- [x] SQLite 本地資料庫
- [x] 資料模型設計
  - [x] User (使用者)
  - [x] Account (OAuth 帳號)
  - [x] Session (登入 session)
  - [x] Favorite (收藏)
  - [x] Review (評論)
  - [x] Collection / CollectionItem (收藏集)

#### 2.4 API 端點 ✅
- [x] `/api/auth/register` - 使用者註冊
- [x] `/api/auth/[...nextauth]` - NextAuth 認證
- [x] `/api/user/profile` - 更新個人資料
- [x] `/api/user/password` - 修改密碼
- [x] `/api/user/delete` - 刪除帳號
- [x] `/api/favorites` - 收藏 CRUD
- [x] `/api/favorites/sync` - 同步 localStorage

---

### 📋 Phase 3: 社群功能

目標：建立活躍的使用者社群

#### 3.1 評論系統
- [ ] 提交評論表單
- [ ] 評分機制 (1-5 星)
- [ ] 評論審核流程
- [ ] 評論按讚功能
- [ ] 評論排序 (最新、最有幫助)

#### 3.2 工具提交
- [ ] 工具提交表單
- [ ] 管理員審核介面
- [ ] 提交狀態追蹤
- [ ] 提交指南頁面

#### 3.3 工具合集
- [ ] 建立個人合集
- [ ] 公開/私人合集
- [ ] 合集分享功能
- [ ] 精選合集展示

---

### 📋 Phase 4: 進階功能

目標：AI 驅動的智慧推薦與 API 服務

#### 4.1 智慧推薦
- [ ] 基於使用歷史的推薦
- [ ] 相似工具推薦演算法
- [ ] 個人化首頁內容
- [ ] 新工具通知

#### 4.2 API 服務
- [ ] REST API 設計
- [ ] API 文件 (Swagger)
- [ ] API 金鑰管理
- [ ] 速率限制

#### 4.3 管理後台
- [ ] 工具管理 CRUD
- [ ] 使用者管理
- [ ] 評論管理
- [ ] 數據統計儀表板

---

## 里程碑

| 里程碑 | 預計完成 | 狀態 |
|--------|----------|------|
| Phase 0 完成 | 2026-01-28 | ✅ 完成 |
| Phase 1 完成 | 2026-01-28 | ✅ 完成 |
| Phase 2 完成 | 2026-01-29 | ✅ 完成 |
| Phase 3 完成 | 2026-02-15 | 📋 計畫中 |
| Phase 4 完成 | 2026-03-01 | 📋 計畫中 |

---

## 開發規範

### Git Commit 規範

```
feat: 新功能
fix: 修復 bug
docs: 文件更新
style: 程式碼格式 (不影響功能)
refactor: 重構
perf: 效能優化
test: 測試
chore: 建置/工具變更
```

### 分支策略

- `main` - 穩定版本
- `develop` - 開發版本
- `feature/*` - 功能分支
- `fix/*` - 修復分支

---

## 參考資源

- [Next.js 文件](https://nextjs.org/docs)
- [shadcn/ui 元件](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
