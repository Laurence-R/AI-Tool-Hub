/**
 * 篩選相關常量
 */

import { Star, ArrowDownAZ } from "lucide-react"
import type { FilterOption, SortOption } from "@/types"

/**
 * 所有工具分類
 */
export const ALL_CATEGORIES: FilterOption[] = [
    { id: "all", label: "全部" },
    { id: "對話 AI", label: "對話 AI" },
    { id: "圖像生成", label: "圖像生成" },
    { id: "視頻生成", label: "視頻生成" },
    { id: "語音合成", label: "語音合成" },
    { id: "生產力", label: "生產力" },
    { id: "開發工具", label: "開發工具" },
    { id: "內容創作", label: "內容創作" },
    { id: "設計工具", label: "設計工具" },
    { id: "寫作助手", label: "寫作助手" },
    { id: "音視頻編輯", label: "音視頻編輯" },
    { id: "會議工具", label: "會議工具" },
    { id: "自動化", label: "自動化" },
    { id: "開發平台", label: "開發平台" },
    { id: "搜尋引擎", label: "搜尋引擎" }
]

/**
 * 定價選項
 */
export const PRICING_OPTIONS: FilterOption[] = [
    { id: "all", label: "全部" },
    { id: "free", label: "免費" },
    { id: "freemium", label: "免費增值" },
    { id: "paid", label: "付費" }
]

/**
 * 評價範圍映射
 */
export const RATING_MAP: Record<string, number> = {
    "all": 0,
    "3.5+": 3.5,
    "4.0+": 4.0,
    "4.5+": 4.5
}

/**
 * 排序選項
 */
export const SORT_OPTIONS: SortOption[] = [
    { value: "rating", label: "評分最高", icon: Star },
    { value: "name", label: "名稱排序", icon: ArrowDownAZ }
]

/**
 * 預設排序方式
 */
export const DEFAULT_SORT = "rating"

/**
 * 預設分類
 */
export const DEFAULT_CATEGORY = "all"

/**
 * 預設定價
 */
export const DEFAULT_PRICING = "all"

/**
 * 預設評分
 */
export const DEFAULT_RATING = "all"
