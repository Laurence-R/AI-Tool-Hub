/**
 * UI 相關常量
 */

/**
 * 動畫持續時間（毫秒）
 */
export const ANIMATION_DURATION = {
    fast: 150,
    normal: 200,
    slow: 300,
    verySlow: 500
} as const

/**
 * 斷點（響應式設計）
 */
export const BREAKPOINTS = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    wide: 1440
} as const

/**
 * Z-Index 層級
 */
export const Z_INDEX = {
    dropdown: 50,
    modal: 100,
    tooltip: 150,
    toast: 200
} as const

/**
 * 最大顯示數量
 */
export const MAX_DISPLAY = {
    categories: 8,        // 分類預設顯示數量
    tools: 12,           // 工具每頁顯示數量
    tags: 5,             // 標籤最多顯示數量
    testimonials: 6      // 見證最多顯示數量
} as const

/**
 * 評分範圍
 */
export const RATING_RANGE = {
    min: 0,
    max: 5,
    step: 0.5
} as const

/**
 * 輸入限制
 */
export const INPUT_LIMITS = {
    searchMinLength: 2,
    searchMaxLength: 100,
    passwordMinLength: 8,
    emailMaxLength: 255
} as const
