# AI Tool Hub 開發計畫

> 最後更新：2025-01-30

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

### ✅ Phase 3: 社群功能 (已完成)

目標：建立活躍的使用者社群

#### 3.1 評論系統 ✅
- [x] 提交評論表單 (標題、內容、優缺點)
- [x] 評分機制 (1-5 星，含 hover 效果)
- [x] 評論按讚功能 (Heart icon，紅色)
- [x] 評論排序 (最新、最有幫助、最高評分)
- [x] 評論刪除 (自己的評論)
- [x] 未登入導向登入頁
- [x] Dashboard 評論歷史管理
- [x] API 端點
  - [x] `/api/reviews` - GET/POST/DELETE
  - [x] `/api/reviews/like` - 切換按讚
  - [x] `/api/reviews/user` - 使用者評論歷史

#### 3.2 工具提交 ✅
- [x] 工具提交表單 (/submit)
  - [x] 基本資訊 (名稱、描述、網址、Logo)
  - [x] 分類與定價選擇
  - [x] 特色功能列表 (最多 10 項)
  - [x] 標籤 (最多 5 個)
  - [x] 表單驗證與 Logo URL 檢查
- [x] 管理員審核介面 (/admin/submissions)
  - [x] 待審核/已通過/已拒絕分頁
  - [x] 審核通過 → 自動建立 Tool 記錄
  - [x] 審核拒絕 → 附帶拒絕原因
  - [x] 詳情對話框
- [x] 提交狀態追蹤
  - [x] 用戶 Dashboard 查看提交記錄
  - [x] 審核結果站內通知
  - [x] Email 通知 (模擬)
- [x] 提交指南頁面 (/submit/guide)
- [x] 管理員角色系統 (UserRole: USER/ADMIN)
- [x] 管理員導航入口 (Shield icon)
- [x] API 端點
  - [x] `/api/submissions` - GET/POST 用戶提交
  - [x] `/api/admin/submissions` - GET 管理員列表
  - [x] `/api/admin/submissions/[id]` - GET/PATCH 審核
  - [x] `/api/tools` - GET 整合靜態+數據庫工具
  - [x] `/api/user/role` - GET 用戶角色
  - [x] `/api/notifications` - GET/PATCH 通知
  - [x] `/api/dev/set-admin` - POST 開發用設定管理員
- [x] 新增元件
  - [x] SafeImage - 圖片錯誤處理
  - [x] NotificationBell - 通知鈴鐺
  - [x] Tabs, Popover, ScrollArea (shadcn/ui)
- [x] 新增 Hooks
  - [x] useTools - 獲取工具列表
  - [x] useUserRole - 獲取用戶角色

#### 3.3 工具合集 ✅
- [x] 建立個人合集
  - [x] 合集 API (CRUD)
  - [x] CollectionsContext 狀態管理
  - [x] 建立合集對話框
  - [x] 合集列表頁面 (/collections)
  - [x] 合集詳情頁面 (/collections/[id])
  - [x] Dashboard 合集管理
- [x] 公開/私人合集
  - [x] 可見性切換 (Switch)
  - [x] 權限檢查 (私人合集僅擁有者可見)
- [x] 合集分享功能
  - [x] 分享連結 (複製到剪貼簿)
  - [x] 公開合集可供他人瀏覽
- [x] 合集與工具整合
  - [x] 工具詳情頁「加入合集」按鈕
  - [x] AddToCollectionDialog 元件
  - [x] 批次獲取工具 API (?ids=)
- [x] 新增元件
  - [x] CollectionCard
  - [x] CreateCollectionDialog
  - [x] AddToCollectionDialog
  - [x] EditCollectionDialog
  - [x] Avatar, Switch, AlertDialog (shadcn/ui)
- [x] 新增套件
  - [x] date-fns (日期格式化)

#### 3.4 程式碼模組化重構 ✅
- [x] 共用格式化函式抽取
  - [x] `lib/formatters.ts` - 定價標籤、顏色、日期格式化
  - [x] 取代 4+ 處重複的 `getPricingLabel`、`getPricingColor` 函式
- [x] 共用 UI 元件抽取
  - [x] `components/ui/star-rating.tsx` - StarRating (顯示) + StarRatingInput (互動)
  - [x] `components/ui/pricing-badge.tsx` - PricingBadge、PricingBadgeShadcn
  - [x] 支援多種尺寸 (xs/sm/md/lg) 與變體 (badge/text)
- [x] 共用常量抽取
  - [x] `constants/labels.ts` - 分類標籤、定價選項、狀態標籤
  - [x] `getCategoryLabel()` 函式統一分類顯示
- [x] DashboardContent 模組化
  - [x] 原 1203 行 → 150 行 (減少 87%)
  - [x] 拆分為 6 個獨立 Tab 元件
  - [x] `app/dashboard/tabs/` 目錄結構
    - [x] ProfileTab.tsx
    - [x] FavoritesTab.tsx
    - [x] CollectionsTab.tsx
    - [x] ReviewsTab.tsx
    - [x] SubmissionsTab.tsx
    - [x] SettingsTab.tsx
- [x] 元件更新以使用共用模組
  - [x] ToolCard.tsx → PricingBadge
  - [x] ToolDetailClient.tsx → StarRating + PricingBadgeShadcn
  - [x] ComparePageClient.tsx → PricingBadge
  - [x] ReviewSection.tsx → StarRating + StarRatingInput
  - [x] AdminSubmissionsClient.tsx → 共用常量

#### 3.5 數據架構統一 ✅
> 架構優化：將靜態 JSON 數據遷移至資料庫，統一數據源

- [x] 數據遷移
  - [x] 建立數據遷移腳本 (`scripts/migrate-tools.ts`)
  - [x] 將 `data/tools/tools.json` 的 20 個工具匯入資料庫
  - [x] 保留原始 ID 以維持相容性
  - [x] 驗證遷移後數據完整性
- [x] API 重構
  - [x] `/api/tools` 改為僅從資料庫讀取
  - [x] 移除靜態 JSON 合併邏輯
  - [x] 新增分頁支援 (`?page=1&limit=20`)
- [x] Schema 擴充
  - [x] Tool 模型新增欄位 (fullDescription, pricingPlans, screenshots, slug, isFeatured, order)
  - [x] 新增 Prisma migration (`20260129121922_add_tool_fields`)
- [x] 清理
  - [x] 標記 `data/tools/tools.json` 為已棄用 (`data/tools/DEPRECATED.md`)
  - [x] 更新 `lib/tools.ts` 提供異步函數
- [x] 元件更新
  - [x] 更新 `app/tools/[id]/page.tsx` 使用異步函數
  - [x] 更新 `app/tools/page.tsx` 使用異步函數
  - [x] 更新 `FavoritesTab.tsx`、`FavoritesPageClient.tsx` 使用 API
  - [x] 更新 `ComparePageClient.tsx` 使用 API
  - [x] 更新 `app/api/reviews/user/route.ts` 使用資料庫查詢

---

### 📋 Phase 4: 進階功能

目標：完整管理後台與 AI 驅動的智慧推薦

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

#### 4.3 管理後台 🔴 高優先級
> 生產環境必要功能，建議優先於 4.1、4.2 開發

- [ ] 管理後台框架
  - [ ] `/admin` 統一入口頁面
  - [ ] 側邊導航 (工具/用戶/評論/統計)
  - [ ] 管理員權限守衛
- [ ] 工具管理 (`/admin/tools`)
  - [ ] 工具列表 (分頁、搜尋、篩選)
  - [ ] 新增工具表單
  - [ ] 編輯工具 (含所有欄位)
  - [ ] 刪除工具 (軟刪除 + 確認對話框)
  - [ ] 批次操作 (啟用/停用)
  - [ ] 工具排序 (熱門/最新/手動)
- [ ] 用戶管理 (`/admin/users`)
  - [ ] 用戶列表 (角色、狀態)
  - [ ] 角色變更 (USER ↔ ADMIN)
  - [ ] 停用/啟用帳號
  - [ ] 用戶活動記錄
- [ ] 評論管理 (`/admin/reviews`)
  - [ ] 評論列表 (按工具/用戶篩選)
  - [ ] 隱藏/顯示評論
  - [ ] 刪除不當評論
  - [ ] 檢舉評論處理
- [ ] 數據統計儀表板 (`/admin/dashboard`)
  - [ ] 總覽卡片 (工具數、用戶數、評論數)
  - [ ] 新增趨勢圖表
  - [ ] 熱門工具排行
  - [ ] 最近活動時間軸

---

## 里程碑

| 里程碑 | 預計完成 | 狀態 |
|--------|----------|------|
| Phase 0 完成 | 2025-01-28 | ✅ 完成 |
| Phase 1 完成 | 2025-01-28 | ✅ 完成 |
| Phase 2 完成 | 2025-01-29 | ✅ 完成 |
| Phase 3.1 評論系統 | 2025-01-29 | ✅ 完成 |
| Phase 3.2 工具提交 | 2025-01-29 | ✅ 完成 |
| Phase 3.3 工具合集 | 2025-01-30 | ✅ 完成 |
| Phase 3.4 模組化重構 | 2025-01-30 | ✅ 完成 |
| Phase 3.5 數據架構統一 | 2025-01-30 | ✅ 完成 |
| Phase 4.3 管理後台 | 2025-02-15 | 📋 計畫中 |
| Phase 4.1 智慧推薦 | 2025-02-28 | 📋 計畫中 |
| Phase 4.2 API 服務 | 2025-03-15 | 📋 計畫中 |

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
