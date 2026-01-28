# AI Tool Hub 開發計畫

> 最後更新：2026-01-28

## 專案概述

AI Tool Hub 是一個 AI 工具發現、比較與評價平台，幫助用戶找到最適合的 AI 工具。

### 技術棧

- **框架**: Next.js 16.1.1 (App Router)
- **語言**: TypeScript 5, React 19
- **樣式**: Tailwind CSS 4, Glassmorphism 設計
- **元件庫**: shadcn/ui
- **字體**: Space Grotesk (標題) + DM Sans (內文)
- **主色調**: #60A5FA (藍色), #818CF8 (紫色)

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

### 🚧 Phase 1: 核心功能強化 (進行中)

目標：提升用戶體驗，無需後端即可實現的功能

#### 1.1 工具比較功能 ⭐ 優先
- [ ] 比較頁面 UI 設計
- [ ] 選擇工具加入比較清單 (最多 4 個)
- [ ] 並排比較視圖
  - [ ] 基本資訊對比
  - [ ] 功能對比表格
  - [ ] 定價方案對比
  - [ ] 評分對比
- [ ] 比較狀態管理 (Context/Zustand)
- [ ] 分享比較結果連結

#### 1.2 收藏功能
- [ ] 收藏按鈕元件
- [ ] localStorage 持久化
- [ ] 收藏工具列表頁面
- [ ] 收藏狀態同步

#### 1.3 搜尋優化
- [ ] 導覽列即時搜尋建議
- [ ] 搜尋結果高亮
- [ ] 搜尋歷史記錄
- [ ] 快捷鍵支援 (Ctrl+K)

#### 1.4 SEO 與效能
- [ ] 各頁面 Meta 標籤
- [ ] Open Graph 圖片
- [ ] 結構化資料 (JSON-LD)
- [ ] 圖片懶加載優化
- [ ] 首次載入效能優化

---

### 📋 Phase 2: 使用者系統

目標：建立完整的使用者認證與個人化功能

#### 2.1 認證系統
- [ ] NextAuth.js 整合
- [ ] Email/密碼登入
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] 密碼重設流程

#### 2.2 使用者儀表板
- [ ] 個人資料頁面
- [ ] 收藏工具管理
- [ ] 評論歷史
- [ ] 帳號設定

#### 2.3 資料庫整合
- [ ] Prisma ORM 設定
- [ ] PostgreSQL / PlanetScale
- [ ] 資料模型設計
  - [ ] User
  - [ ] Tool
  - [ ] Review
  - [ ] Favorite
  - [ ] Collection

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
| Phase 1 完成 | 2026-02-10 | 🚧 進行中 |
| Phase 2 完成 | 2026-03-01 | 📋 計畫中 |
| Phase 3 完成 | 2026-03-20 | 📋 計畫中 |
| Phase 4 完成 | 2026-04-15 | 📋 計畫中 |

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
