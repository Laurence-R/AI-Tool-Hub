import { cn } from "@/lib/utils"
import { getPricingLabel, getPricingColor, getPricingTextColor } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"

export interface PricingBadgeProps {
  /** 定價類型 */
  pricing: string
  /** 顯示樣式 - badge: 帶背景, text: 僅文字 */
  variant?: "badge" | "text"
  /** 尺寸大小 */
  size?: "sm" | "md" | "lg"
  /** 額外的 CSS 類名 */
  className?: string
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-3 py-1",
  lg: "text-sm px-4 py-1.5",
}

const textSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
}

/**
 * 定價標籤元件
 * 統一顯示定價模式（免費、免費增值、付費）
 */
export function PricingBadge({
  pricing,
  variant = "badge",
  size = "md",
  className,
}: PricingBadgeProps) {
  const label = getPricingLabel(pricing)

  if (variant === "text") {
    return (
      <span
        className={cn(
          "font-semibold",
          getPricingTextColor(pricing),
          textSizeClasses[size],
          className
        )}
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={cn(
        "rounded-lg font-medium",
        getPricingColor(pricing),
        sizeClasses[size],
        className
      )}
    >
      {label}
    </span>
  )
}

/**
 * 使用 shadcn Badge 的定價標籤元件
 * 用於需要與 Badge 一致樣式的場景
 */
export function PricingBadgeShadcn({
  pricing,
  className,
}: {
  pricing: string
  className?: string
}) {
  return (
    <Badge className={cn(getPricingColor(pricing), className)}>
      {getPricingLabel(pricing)}
    </Badge>
  )
}
