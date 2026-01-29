"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StarRatingProps {
  /** 評分值 (1-5) */
  rating: number
  /** 尺寸大小 */
  size?: "xs" | "sm" | "md" | "lg"
  /** 是否顯示數值 */
  showValue?: boolean
  /** 額外的 CSS 類名 */
  className?: string
  /** 星星間距 */
  gap?: "tight" | "normal" | "loose"
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
}

const valueSizeClasses = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
}

const gapClasses = {
  tight: "gap-0.5",
  normal: "gap-1",
  loose: "gap-1.5",
}

/**
 * 星級評分元件
 * 統一顯示 1-5 星的評分
 */
export function StarRating({
  rating,
  size = "md",
  showValue = false,
  className,
  gap = "tight",
}: StarRatingProps) {
  const roundedRating = Math.round(rating)

  return (
    <div className={cn("flex items-center", gapClasses[gap], className)}>
      <div className={cn("flex items-center", gapClasses[gap])}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= roundedRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-foreground/20"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className={cn("font-semibold text-foreground ml-1", valueSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export interface StarRatingInputProps {
  /** 當前評分值 */
  value: number
  /** 評分變更回調 */
  onChange: (rating: number) => void
  /** hover 狀態的評分 */
  hoverValue?: number
  /** hover 變更回調 */
  onHoverChange?: (rating: number) => void
  /** 尺寸大小 */
  size?: "sm" | "md" | "lg"
  /** 額外的 CSS 類名 */
  className?: string
  /** 是否禁用 */
  disabled?: boolean
}

const inputSizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
}

/**
 * 可互動的星級評分輸入元件
 * 用於評論表單等需要用戶選擇評分的場景
 */
export function StarRatingInput({
  value,
  onChange,
  hoverValue = 0,
  onHoverChange,
  size = "md",
  className,
  disabled = false,
}: StarRatingInputProps) {
  const displayValue = hoverValue || value

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => onHoverChange?.(star)}
          onMouseLeave={() => onHoverChange?.(0)}
          className={cn(
            "p-1 transition-transform hover:scale-110",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <Star
            className={cn(
              inputSizeClasses[size],
              "transition-colors",
              star <= displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-foreground/20"
            )}
          />
        </button>
      ))}
    </div>
  )
}
