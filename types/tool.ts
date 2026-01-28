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
 * 定價方案
 */
export interface PricingPlan {
    name: string
    price: string
    period: string
    features: string[]
    recommended: boolean
}

/**
 * 工具評論
 */
export interface ToolReview {
    id: number
    toolId: number
    userName: string
    userAvatar: string
    rating: number
    date: string
    content: string
    helpful: number
    verified: boolean
}

/**
 * AI 工具基礎介面（列表顯示用）
 */
export interface ToolBase {
    id: number
    slug: string
    name: string
    description: string
    category: ToolCategory | string
    pricing: PricingType
    rating: number
    reviewCount: number
    logo: string
    tags: string[]
    url: string
    features: string[]
}

/**
 * AI 工具完整介面（詳情頁用）
 */
export interface Tool extends ToolBase {
    fullDescription: string
    pricingPlans: PricingPlan[]
    screenshots: string[]
    relatedToolIds: number[]
    // 元數據
    createdAt?: string
    updatedAt?: string
}

/**
 * 工具卡片組件 Props
 */
export interface ToolCardProps {
    tool: ToolBase | Tool
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

/**
 * 工具列表響應
 */
export interface ToolsListResponse {
    tools: ToolBase[]
    total: number
    categories: string[]
}

/**
 * 工具詳情響應
 */
export interface ToolDetailResponse {
    tool: Tool
    reviews: ToolReview[]
    relatedTools: ToolBase[]
}
