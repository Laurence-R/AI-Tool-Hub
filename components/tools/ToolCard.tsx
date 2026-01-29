"use client"

import Link from "next/link"
import { Star, ExternalLink, Tag } from "lucide-react"
import type { ToolCardProps } from "@/types"
import { CompareButton } from "./CompareButton"
import { FavoriteButton } from "./FavoriteButton"
import { SafeImage } from "@/components/ui/safe-image"
import { PricingBadge } from "@/components/ui/pricing-badge"

export function ToolCard({ tool }: ToolCardProps) {
    const handleVisitClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(tool.url, "_blank", "noopener,noreferrer")
    }

    return (
        <Link href={`/tools/${tool.id}`} className="block group">
            <div className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                {/* Logo、操作按鈕和定價 */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center overflow-hidden shrink-0">
                        <SafeImage
                            src={tool.logo}
                            alt={`${tool.name} logo`}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                            fallbackClassName="rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {/* 收藏按鈕 */}
                        <FavoriteButton toolId={tool.id} variant="icon" />
                        {/* 比較按鈕 */}
                        <CompareButton tool={tool} variant="icon" />
                        {/* 定價標籤 */}
                        <PricingBadge pricing={tool.pricing} size="sm" />
                    </div>
                </div>

                {/* 標題和分類 */}
                <div className="mb-3">
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
                        {tool.name}
                    </h3>
                    <p className="font-body text-xs text-foreground/50">
                        {tool.category}
                    </p>
                </div>

                {/* 描述 */}
                <p className="font-body text-sm text-foreground/70 mb-4 line-clamp-2">
                    {tool.description}
                </p>

                {/* 標籤 */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {tool.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-foreground/5 text-foreground/60 text-xs font-body"
                        >
                            <Tag className="w-3 h-3" />
                            {tag}
                        </span>
                    ))}
                </div>

                {/* 評分和連結 */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-heading font-semibold text-sm text-foreground">
                            {tool.rating.toFixed(1)}
                        </span>
                        <span className="font-body text-xs text-foreground/50">
                            / 5.0
                        </span>
                    </div>
                    <button
                        onClick={handleVisitClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white font-body text-sm font-medium transition-all duration-200 cursor-pointer"
                    >
                        訪問
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    )
}
