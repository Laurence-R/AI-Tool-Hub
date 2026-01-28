"use client"

import { GitCompare, Check, X } from "lucide-react"
import { useCompare, MAX_COMPARE_ITEMS } from "@/contexts"
import type { ToolBase } from "@/types"
import { cn } from "@/lib/utils"

interface CompareButtonProps {
  tool: ToolBase
  variant?: "default" | "icon" | "compact"
  className?: string
}

export function CompareButton({ tool, variant = "default", className }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, isFull } = useCompare()
  
  const inCompare = isInCompare(tool.id)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (inCompare) {
      removeFromCompare(tool.id)
    } else {
      addToCompare(tool)
    }
  }

  // 圖示模式
  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={!inCompare && isFull}
        className={cn(
          "p-2 rounded-lg transition-all duration-200",
          inCompare
            ? "bg-primary text-white hover:bg-primary/90"
            : isFull
              ? "bg-foreground/5 text-foreground/30 cursor-not-allowed"
              : "bg-foreground/5 text-foreground/60 hover:bg-primary/10 hover:text-primary",
          className
        )}
        title={inCompare ? "從比較移除" : isFull ? `最多比較 ${MAX_COMPARE_ITEMS} 個工具` : "加入比較"}
        aria-label={inCompare ? "從比較移除" : "加入比較"}
      >
        {inCompare ? (
          <Check className="w-4 h-4" />
        ) : (
          <GitCompare className="w-4 h-4" />
        )}
      </button>
    )
  }

  // 緊湊模式
  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        disabled={!inCompare && isFull}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200",
          inCompare
            ? "bg-primary/10 text-primary border border-primary/30"
            : isFull
              ? "bg-foreground/5 text-foreground/30 cursor-not-allowed"
              : "bg-foreground/5 text-foreground/60 hover:bg-primary/10 hover:text-primary",
          className
        )}
        title={isFull && !inCompare ? `最多比較 ${MAX_COMPARE_ITEMS} 個工具` : undefined}
      >
        {inCompare ? (
          <>
            <Check className="w-3 h-3" />
            <span>已加入</span>
          </>
        ) : (
          <>
            <GitCompare className="w-3 h-3" />
            <span>比較</span>
          </>
        )}
      </button>
    )
  }

  // 預設模式
  return (
    <button
      onClick={handleClick}
      disabled={!inCompare && isFull}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
        inCompare
          ? "bg-primary text-white hover:bg-primary/90"
          : isFull
            ? "bg-foreground/5 text-foreground/30 cursor-not-allowed"
            : "bg-foreground/5 text-foreground/70 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/30",
        className
      )}
      title={isFull && !inCompare ? `最多比較 ${MAX_COMPARE_ITEMS} 個工具` : undefined}
    >
      {inCompare ? (
        <>
          <Check className="w-4 h-4" />
          <span>已加入比較</span>
        </>
      ) : (
        <>
          <GitCompare className="w-4 h-4" />
          <span>加入比較</span>
        </>
      )}
    </button>
  )
}
