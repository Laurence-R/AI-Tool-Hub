"use client"

import { useState } from "react"
import { Filter, ChevronDown, X, Star } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface ToolsFilterProps {
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    selectedPricing: string
    setSelectedPricing: (pricing: string) => void
    selectedRating: string
    setSelectedRating: (rating: string) => void
}

// 扁平化所有類別，方便使用標籤式佈局
const ALL_CATEGORIES = [
    { id: "all", label: "全部" },
    { id: "對話 AI", label: "對話 AI" },
    { id: "圖像生成", label: "圖像生成" },
    { id: "視頻生成", label: "視頻生成" },
    { id: "語音合成", label: "語音合成" },
    { id: "生產力", label: "生產力" },
    { id: "開發工具", label: "開發工具" },
    { id: "內容創作", label: "內容創作" },
    { id: "設計工具", label: "設計工具" },
    { id: "寫作助手", label: "寫作助手" },
    { id: "音視頻編輯", label: "音視頻編輯" },
    { id: "會議工具", label: "會議工具" },
    { id: "自動化", label: "自動化" },
    { id: "開發平台", label: "開發平台" },
    { id: "搜尋引擎", label: "搜尋引擎" }
]

const PRICING_OPTIONS = [
    { id: "all", label: "全部" },
    { id: "free", label: "免費" },
    { id: "freemium", label: "免費增值" },
    { id: "paid", label: "付費" }
]

// 評價範圍映射
const RATING_MAP: Record<string, number> = {
    "all": 0,
    "3.5+": 3.5,
    "4.0+": 4.0,
    "4.5+": 4.5
}

export function ToolsFilter({
    selectedCategory,
    setSelectedCategory,
    selectedPricing,
    setSelectedPricing,
    selectedRating,
    setSelectedRating
}: ToolsFilterProps) {
    // 控制分類區域的展開/收起
    const [showAllCategories, setShowAllCategories] = useState(false)
    
    // 將評價字符串轉換為數字用於滑塊
    const ratingValue = RATING_MAP[selectedRating] || 0
    
    const handleRatingChange = (value: number) => {
        if (value === 0) {
            setSelectedRating("all")
        } else if (value === 3.5) {
            setSelectedRating("3.5+")
        } else if (value === 4.0) {
            setSelectedRating("4.0+")
        } else if (value === 4.5) {
            setSelectedRating("4.5+")
        }
    }

    const handleClearAll = () => {
        setSelectedCategory("all")
        setSelectedPricing("all")
        setSelectedRating("all")
    }

    const hasActiveFilters = selectedCategory !== "all" || selectedPricing !== "all" || selectedRating !== "all"

    return (
        <aside className="lg:w-64 shrink-0">
            <div className="glass-card rounded-2xl p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                {/* 標題 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        <h2 className="font-heading font-semibold text-base text-foreground">
                            篩選
                        </h2>
                    </div>
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-body text-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
                            aria-label="清除所有篩選"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                {/* 分類篩選 - 使用標籤式設計 */}
                <div className="mb-4 pb-4 border-b border-border/50">
                    <h3 className="font-heading font-medium text-xs text-foreground/60 mb-2 uppercase tracking-wide">
                        分類
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_CATEGORIES.slice(0, showAllCategories ? undefined : 8).map(category => (
                            <Badge
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                variant={selectedCategory === category.id ? "default" : "outline"}
                                className={`cursor-pointer transition-all duration-200 ${
                                    selectedCategory === category.id
                                        ? "shadow-md shadow-primary/25 text-white"
                                        : "hover:bg-foreground/10 hover:text-foreground"
                                }`}
                            >
                                {category.label}
                            </Badge>
                        ))}
                    </div>
                    {ALL_CATEGORIES.length > 8 && (
                        <button
                            onClick={() => setShowAllCategories(!showAllCategories)}
                            className="flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200 cursor-pointer"
                        >
                            <span>{showAllCategories ? "顯示較少" : "顯示更多"}</span>
                            <ChevronDown
                                className={`w-3 h-3 transition-transform duration-200 ${
                                    showAllCategories ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                    )}
                </div>

                {/* 定價篩選 - 使用緊湊標籤 */}
                <div className="mb-4 pb-4 border-b border-border/50">
                    <h3 className="font-heading font-medium text-xs text-foreground/60 mb-2 uppercase tracking-wide">
                        定價
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {PRICING_OPTIONS.map(option => (
                            <Badge
                                key={option.id}
                                onClick={() => setSelectedPricing(option.id)}
                                variant={selectedPricing === option.id ? "default" : "outline"}
                                className={`cursor-pointer transition-all duration-200 ${
                                    selectedPricing === option.id
                                        ? "shadow-md shadow-primary/25 text-white"
                                        : "hover:bg-foreground/10 hover:text-foreground"
                                }`}
                            >
                                {option.label}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* 評價篩選 - 使用 shadcn Slider */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-heading font-medium text-xs text-foreground/60 uppercase tracking-wide">
                            最低評價
                        </h3>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="text-xs font-medium text-foreground">
                                {ratingValue === 0 ? "全部" : `${ratingValue}+`}
                            </span>
                        </div>
                    </div>
                    <div className="px-1">
                        <Slider
                            value={[ratingValue]}
                            onValueChange={(value) => handleRatingChange(value[0])}
                            min={0}
                            max={4.5}
                            step={0.5}
                            className="cursor-pointer"
                        />
                        <div className="flex justify-between mt-2 px-0.5">
                            <span className="text-[10px] text-foreground/40">全部</span>
                            <span className="text-[10px] text-foreground/40">3.5</span>
                            <span className="text-[10px] text-foreground/40">4.0</span>
                            <span className="text-[10px] text-foreground/40">4.5</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}
