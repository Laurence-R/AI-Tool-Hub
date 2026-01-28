"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ToolsSearch, ToolsFilter, ToolCard } from "@/components/tools"
import { getFilteredAndSortedTools } from "@/lib/tools"
import { useSearch } from "@/contexts"

export function ToolsPageClient() {
    const searchParams = useSearchParams()
    const { addToHistory } = useSearch()
    
    // 從 URL 參數獲取初始搜尋值
    const initialSearch = searchParams.get("search") || ""
    
    const [searchQuery, setSearchQuery] = useState(initialSearch)
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedPricing, setSelectedPricing] = useState<string>("all")
    const [selectedRating, setSelectedRating] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("rating")

    // 當 URL 參數變更時更新搜尋
    useEffect(() => {
        const search = searchParams.get("search")
        if (search) {
            setSearchQuery(search)
            addToHistory(search)
        }
    }, [searchParams, addToHistory])

    // 使用新的篩選函數
    const filteredTools = useMemo(() => {
        return getFilteredAndSortedTools({
            searchQuery,
            category: selectedCategory,
            pricing: selectedPricing,
            rating: selectedRating === "4.5+" ? "4.5" : 
                    selectedRating === "4.0+" ? "4.0" : 
                    selectedRating === "3.5+" ? "3.5" : "all",
            sortBy,
        })
    }, [searchQuery, selectedCategory, selectedPricing, selectedRating, sortBy])

    return (
        <div className="min-h-screen bg-background pt-32 pb-20">
            {/* 背景漸層 */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6">
                {/* 頁面標題 */}
                <div className="text-center mb-12">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        探索 AI 工具
                    </h1>
                    <p className="font-body text-lg text-foreground/60 max-w-2xl mx-auto">
                        發現最優質的 AI 工具，打造你的專屬工作流
                    </p>
                </div>

                {/* 搜索欄 */}
                <ToolsSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                />

                <div className="flex flex-col lg:flex-row gap-8 mt-8">
                    {/* 篩選側邊欄 */}
                    <ToolsFilter
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        selectedPricing={selectedPricing}
                        setSelectedPricing={setSelectedPricing}
                        selectedRating={selectedRating}
                        setSelectedRating={setSelectedRating}
                    />

                    {/* 工具網格 */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <p className="font-body text-sm text-foreground/60">
                                找到 <span className="font-semibold text-foreground">{filteredTools.length}</span> 個工具
                            </p>
                        </div>

                        {filteredTools.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredTools.map(tool => (
                                    <ToolCard key={tool.id} tool={tool} />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card rounded-2xl p-12 text-center">
                                <p className="font-body text-foreground/60 mb-4">
                                    沒有找到符合條件的工具
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedCategory("all")
                                        setSelectedPricing("all")
                                        setSelectedRating("all")
                                    }}
                                    className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                                >
                                    清除篩選
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
