/**
 * 篩選相關型別定義
 */

/**
 * 工具搜尋組件 Props
 */
export interface ToolsSearchProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    sortBy: string
    setSortBy: (sort: string) => void
}

/**
 * 工具篩選組件 Props
 */
export interface ToolsFilterProps {
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    selectedPricing: string
    setSelectedPricing: (pricing: string) => void
    selectedRating: string
    setSelectedRating: (rating: string) => void
}

/**
 * 評價範圍映射
 */
export type RatingMap = {
    [key: string]: number
}
