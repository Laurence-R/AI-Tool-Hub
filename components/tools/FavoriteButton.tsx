"use client"

import { Heart } from "lucide-react"
import { useFavorites } from "@/contexts"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  toolId: number | string
  variant?: "default" | "icon"
  className?: string
}

export function FavoriteButton({ toolId, variant = "icon", className }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  
  // 將 toolId 轉換為字串
  const toolIdStr = String(toolId)
  const favorited = isFavorite(toolIdStr)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(toolIdStr)
  }

  // 圖示模式
  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          favorited
            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            : "bg-foreground/5 text-foreground/60 hover:bg-red-500/10 hover:text-red-500",
          className
        )}
        title={favorited ? "取消收藏" : "加入收藏"}
        aria-label={favorited ? "取消收藏" : "加入收藏"}
      >
        <Heart 
          className={cn(
            "w-4 h-4 transition-all duration-200",
            favorited && "fill-current scale-110"
          )} 
        />
      </button>
    )
  }

  // 預設模式（帶文字）
  return (
    <button
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
        favorited
          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
          : "bg-foreground/5 text-foreground/70 hover:bg-red-500/10 hover:text-red-500 border border-transparent hover:border-red-500/30",
        className
      )}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-all duration-200",
          favorited && "fill-current"
        )} 
      />
      <span>{favorited ? "已收藏" : "收藏"}</span>
    </button>
  )
}
