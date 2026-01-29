# ⚠️ 已棄用 - DEPRECATED

此目錄中的 `tools.json` 檔案已於 **Phase 3.5 數據架構統一** 中遷移至資料庫。

## 遷移資訊

- **遷移日期**: 2026-01-29
- **遷移腳本**: `scripts/migrate-tools.ts`
- **目標資料庫**: SQLite (Prisma)

## 新的數據來源

工具資料現在存儲在 Prisma 資料庫中，請使用以下方式存取：

### API 端點
```
GET /api/tools              # 獲取所有工具（支援分頁、篩選）
GET /api/tools?ids=1,2,3    # 批量獲取指定工具
```

### 伺服器端函數
```typescript
import { getToolAsync, getAllToolsFullAsync } from '@/lib/tools'

const tool = await getToolAsync(1)
const tools = await getAllToolsFullAsync()
```

## 注意事項

- 此 JSON 檔案保留作為備份，不再用於生產環境
- 未來可能會移除此檔案
- 新增/編輯工具請使用管理後台或直接操作資料庫
