"use client"

import { Search, SlidersHorizontal } from "lucide-react"

interface ToolsSearchProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    sortBy: string
    setSortBy: (sort: string) => void
}

export function ToolsSearch({
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
}: ToolsSearchProps) {
    return (
        <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
            {/* 搜索輸入 */}
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索工具名稱、描述或標籤..."
                    className="w-full pl-12 pr-4 py-3 bg-transparent border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary transition-colors duration-200 font-body"
                />
            </div>

            {/* 排序選項 */}
            <div className="relative sm:w-48">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent border border-border rounded-xl text-foreground appearance-none focus:outline-none focus:border-primary transition-colors duration-200 cursor-pointer font-body"
                >
                    <option value="rating">評分最高</option>
                    <option value="name">名稱排序</option>
                </select>
                <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}
