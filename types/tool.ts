/**
 * AI 工具相關型別定義
 */

/**
 * 定價類型
 */
export type PricingType = "free" | "freemium" | "paid"

/**
 * 工具分類
 */
export type ToolCategory =
    | "對話 AI"
    | "圖像生成"
    | "視頻生成"
    | "語音合成"
    | "生產力"
    | "開發工具"
    | "內容創作"
    | "設計工具"
    | "寫作助手"
    | "音視頻編輯"
    | "會議工具"
    | "自動化"
    | "開發平台"
    | "搜尋引擎"

/**
 * AI 工具介面
 */
export interface Tool {
    id: number
    name: string
    description: string
    category: ToolCategory | string
    pricing: PricingType
    rating: number
    logo: string
    tags: string[]
    url: string
}

/**
 * 工具卡片組件 Props
 */
export interface ToolCardProps {
    tool: Tool
}

/**
 * 排序選項
 */
export interface SortOption {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

/**
 * 篩選選項
 */
export interface FilterOption {
    id: string
    label: string
}
