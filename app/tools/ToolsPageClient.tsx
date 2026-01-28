"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ToolsSearch, ToolsFilter, ToolCard } from "@/components/tools"
import { getFilteredAndSortedTools } from "@/lib/tools"
import { useSearch } from "@/contexts"
import { useTools } from "@/hooks"
import type { Tool } from "@/types"

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

    // 從 API 獲取工具（包含數據庫中批准的工具）
    const { tools: apiTools, isLoading } = useTools()

    // 當 URL 參數變更時更新搜尋
    useEffect(() => {
        const search = searchParams.get("search")
        if (search) {
            setSearchQuery(search)
            addToHistory(search)
        }
    }, [searchParams, addToHistory])

    // 過濾和排序工具
    const filteredTools = useMemo(() => {
        // 如果 API 還在載入或失敗，使用靜態數據
        if (isLoading || apiTools.length === 0) {
            return getFilteredAndSortedTools({
                searchQuery,
                category: selectedCategory,
                pricing: selectedPricing,
                rating: selectedRating === "4.5+" ? "4.5" : 
                        selectedRating === "4.0+" ? "4.0" : 
                        selectedRating === "3.5+" ? "3.5" : "all",
                sortBy,
            })
        }

        // 使用 API 返回的工具進行過濾
        let tools = [...apiTools]

        // 搜尋過濾
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            tools = tools.filter(tool => 
                tool.name.toLowerCase().includes(query) ||
                tool.description.toLowerCase().includes(query) ||
                tool.tags?.some(tag => tag.toLowerCase().includes(query))
            )
        }

        // 類別過濾
        if (selectedCategory !== "all") {
            tools = tools.filter(tool => tool.category === selectedCategory)
        }

        // 定價過濾
        if (selectedPricing !== "all") {
            tools = tools.filter(tool => tool.pricing === selectedPricing)
        }

        // 評分過濾
        if (selectedRating !== "all") {
            const minRating = parseFloat(selectedRating.replace("+", ""))
            tools = tools.filter(tool => tool.rating >= minRating)
        }

        // 排序
        tools.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating
                case "reviews":
                    return b.reviewCount - a.reviewCount
                case "name":
                    return a.name.localeCompare(b.name)
                case "newest":
                    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                default:
                    return 0
            }
        })

        return tools
    }, [apiTools, isLoading, searchQuery, selectedCategory, selectedPricing, selectedRating, sortBy])

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
