"use client"

import { Search, SlidersHorizontal, ChevronDown, Star, ArrowDownAZ, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

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
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const sortOptions = [
        { value: "rating", label: "評分最高", icon: Star },
        { value: "name", label: "名稱排序", icon: ArrowDownAZ }
    ]

    const currentOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0]
    const CurrentIcon = currentOption.icon

    return (
        <div className="relative z-50">
            {/* 主搜尋容器 */}
            <div className="glass-card rounded-2xl p-6 space-y-6">
                {/* 標題與描述 */}
                <div className="space-y-2">
                    <h2 className="text-lg font-heading font-semibold text-foreground">搜尋與篩選工具</h2>
                    <p className="text-sm text-foreground/60 font-body">快速找到最適合你的 AI 工具</p>
                </div>

                {/* 搜尋與排序網格 */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
                    {/* 搜尋輸入區 */}
                    <div className="space-y-2">
                        <label htmlFor="search-input" className="text-sm font-medium text-foreground/80 font-body block">
                            關鍵字搜尋
                        </label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 group-focus-within:text-primary transition-colors duration-200 pointer-events-none" />
                            <input
                                id="search-input"
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="輸入工具名稱、功能描述或標籤..."
                                className="w-full pl-12 pr-12 py-3.5 bg-background/50 backdrop-blur-sm border-2 border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all duration-200 font-body shadow-sm hover:shadow-md focus:shadow-lg"
                                aria-label="搜尋工具"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-foreground/40 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200 cursor-pointer"
                                    aria-label="清除搜尋"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 排序選擇區 */}
                    <div className="space-y-2" ref={dropdownRef}>
                        <label htmlFor="sort-button" className="text-sm font-medium text-foreground/80 font-body block">
                            排序方式
                        </label>
                        <div className="relative">
                            <button
                                id="sort-button"
                                onClick={() => setIsOpen(!isOpen)}
                                className="w-full lg:w-[220px] pl-12 pr-10 py-3.5 bg-background/50 backdrop-blur-sm border-2 border-border rounded-xl text-foreground hover:border-primary/50 focus:outline-none focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all duration-200 font-body shadow-sm hover:shadow-md text-left cursor-pointer flex items-center justify-between group"
                                aria-label="選擇排序方式"
                                aria-expanded={isOpen}
                                aria-haspopup="listbox"
                            >
                                <div className="flex items-center gap-3">
                                    <CurrentIcon className="w-4 h-4 text-foreground/60 group-hover:text-primary transition-colors duration-200" />
                                    <span className="text-sm font-medium">{currentOption.label}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-foreground/60 group-hover:text-primary transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* 下拉選單 */}
                            {isOpen && (
                                <div 
                                    className="absolute top-full left-0 right-0 mt-2 bg-background/98 backdrop-blur-xl border-2 border-border rounded-xl shadow-2xl overflow-hidden z-[100] animate-fade-in"
                                    role="listbox"
                                    aria-label="排序選項"
                                >
                                    {sortOptions.map((option) => {
                                        const OptionIcon = option.icon
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSortBy(option.value)
                                                    setIsOpen(false)
                                                }}
                                                className={`w-full px-4 py-3.5 text-left hover:bg-primary/10 transition-all duration-150 cursor-pointer font-body flex items-center gap-3 group/item ${
                                                    sortBy === option.value 
                                                        ? 'bg-primary/5 text-primary border-l-4 border-primary' 
                                                        : 'text-foreground border-l-4 border-transparent'
                                                }`}
                                                role="option"
                                                aria-selected={sortBy === option.value}
                                            >
                                                <OptionIcon className={`w-4 h-4 transition-colors duration-150 ${
                                                    sortBy === option.value 
                                                        ? 'text-primary' 
                                                        : 'text-foreground/40 group-hover/item:text-primary'
                                                }`} />
                                                <span className={`text-sm ${sortBy === option.value ? 'font-semibold' : 'font-medium'}`}>
                                                    {option.label}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 搜尋狀態指示器 */}
                {searchQuery && (
                    <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-sm text-foreground/80 font-body">
                                搜尋結果: <span className="text-foreground font-semibold">{searchQuery}</span>
                            </span>
                        </div>
                        <button
                            onClick={() => setSearchQuery("")}
                            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200 underline underline-offset-2"
                        >
                            清除篩選
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
