/**
 * 共用格式化工具函數
 * 用於統一定價標籤、顏色等顯示邏輯
 */

// ==================== 定價相關 ====================

export type PricingType = "free" | "freemium" | "paid"

/**
 * 定價標籤對照表
 */
export const PRICING_LABELS: Record<string, string> = {
  free: "免費",
  freemium: "免費增值",
  paid: "付費",
  subscription: "訂閱制",
}

/**
 * 取得定價的中文標籤
 */
export function getPricingLabel(pricing: string): string {
  return PRICING_LABELS[pricing] || pricing
}

/**
 * 定價顏色樣式對照表（用於 Badge 背景）
 */
export const PRICING_BADGE_COLORS: Record<string, string> = {
  free: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
  freemium: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
  paid: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20",
}

/**
 * 定價顏色樣式對照表（僅文字顏色）
 */
export const PRICING_TEXT_COLORS: Record<string, string> = {
  free: "text-green-600 dark:text-green-400",
  freemium: "text-blue-600 dark:text-blue-400",
  paid: "text-orange-600 dark:text-orange-400",
}

/**
 * 取得定價的顏色樣式（Badge 背景版本）
 */
export function getPricingColor(pricing: string): string {
  return PRICING_BADGE_COLORS[pricing] || "bg-foreground/10 text-foreground"
}

/**
 * 取得定價的文字顏色樣式
 */
export function getPricingTextColor(pricing: string): string {
  return PRICING_TEXT_COLORS[pricing] || "text-foreground"
}

// ==================== 日期相關 ====================

/**
 * 格式化日期為相對時間或標準格式
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return "今天"
  } else if (diffInDays === 1) {
    return "昨天"
  } else if (diffInDays < 7) {
    return `${diffInDays} 天前`
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays / 7)} 週前`
  } else {
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}

/**
 * 格式化日期為標準格式
 */
export function formatDateStandard(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
