"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, Clock, X, ArrowRight, Trash2, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useSearch } from "@/contexts"
import { searchTools } from "@/lib/tools"
import { SEARCH_ITEMS } from "@/constants"
import Image from "next/image"
import type { ToolBase } from "@/types"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const { searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearch()
  const [query, setQuery] = useState("")
  const [toolResults, setToolResults] = useState<ToolBase[]>([])

  // 搜尋工具
  useEffect(() => {
    if (query.trim().length > 0) {
      const results = searchTools(query, 5)
      setToolResults(results)
    } else {
      setToolResults([])
    }
  }, [query])

  // 過濾頁面搜尋項目
  const filteredPages = useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    return SEARCH_ITEMS.filter(item => 
      item.label.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 3)
  }, [query])

  // 處理選擇
  const handleSelect = (href: string, searchQuery?: string) => {
    if (searchQuery) {
      addToHistory(searchQuery)
    }
    onOpenChange(false)
    setQuery("")
    router.push(href)
  }

  // 處理搜尋提交
  const handleSearchSubmit = () => {
    if (query.trim()) {
      addToHistory(query.trim())
      onOpenChange(false)
      router.push(`/tools?search=${encodeURIComponent(query.trim())}`)
      setQuery("")
    }
  }

  // 處理歷史記錄點擊
  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery)
  }

  // 移除歷史記錄
  const handleRemoveHistory = (e: React.MouseEvent, historyQuery: string) => {
    e.stopPropagation()
    removeFromHistory(historyQuery)
  }

  // 重置狀態當對話框關閉
  useEffect(() => {
    if (!open) {
      setQuery("")
    }
  }, [open])

  const hasResults = toolResults.length > 0 || filteredPages.length > 0
  const showHistory = !query.trim() && searchHistory.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="p-0 gap-0 bg-background/98 backdrop-blur-xl border-border/50 max-w-xl overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>搜尋</DialogTitle>
        </DialogHeader>
        
        <Command className="bg-transparent" shouldFilter={false}>
          {/* 搜尋輸入 */}
          <div className="flex items-center border-b border-border px-3">
            <Search className="w-5 h-5 text-foreground/40 shrink-0" />
            <CommandInput 
              placeholder="搜尋工具、分類或頁面..." 
              className="border-0 focus:ring-0 h-14 text-base"
              value={query}
              onValueChange={setQuery}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  handleSearchSubmit()
                }
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded hover:bg-foreground/10 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="ml-2 pointer-events-none hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs text-muted-foreground">
              ESC
            </kbd>
          </div>

          <CommandList className="max-h-[400px] overflow-y-auto">
            {/* 無結果時顯示 */}
            {query.trim() && !hasResults && (
              <CommandEmpty className="py-12 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-foreground/5 flex items-center justify-center">
                  <Search className="w-6 h-6 text-foreground/30" />
                </div>
                <p className="text-foreground/60">找不到「{query}」的相關結果</p>
                <p className="text-sm text-foreground/40 mt-1">試試其他關鍵字</p>
              </CommandEmpty>
            )}

            {/* 搜尋歷史 */}
            {showHistory && (
              <CommandGroup>
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className="text-xs font-medium text-foreground/50">最近搜尋</span>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-foreground/40 hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    清除
                  </button>
                </div>
                {searchHistory.map((item) => (
                  <CommandItem
                    key={item}
                    value={item}
                    onSelect={() => handleHistoryClick(item)}
                    className="cursor-pointer group"
                  >
                    <Clock className="w-4 h-4 mr-2 text-foreground/40" />
                    <span className="flex-1">{item}</span>
                    <button
                      onClick={(e) => handleRemoveHistory(e, item)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-foreground/10 transition-all"
                    >
                      <X className="w-3 h-3 text-foreground/40" />
                    </button>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* 工具搜尋結果 */}
            {toolResults.length > 0 && (
              <CommandGroup heading="工具">
                {toolResults.map((tool) => (
                  <CommandItem
                    key={tool.id}
                    value={tool.name}
                    onSelect={() => handleSelect(`/tools/${tool.id}`, query)}
                    className="cursor-pointer py-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-foreground/5 overflow-hidden mr-3 shrink-0">
                      <Image
                        src={tool.logo}
                        alt={tool.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{tool.name}</div>
                      <div className="text-xs text-foreground/50 truncate">{tool.description}</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-foreground/5 text-foreground/50">
                      {tool.category}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* 頁面搜尋結果 */}
            {filteredPages.length > 0 && (
              <>
                {toolResults.length > 0 && <CommandSeparator />}
                <CommandGroup heading="頁面">
                  {filteredPages.map((item) => (
                    <CommandItem
                      key={item.href}
                      value={item.label}
                      onSelect={() => handleSelect(item.href)}
                      className="cursor-pointer"
                    >
                      <Search className="w-4 h-4 mr-2 text-foreground/40" />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-xs text-foreground/40">{item.category}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* 快速建議（無輸入時） */}
            {!query.trim() && !showHistory && (
              <CommandGroup>
                <div className="px-2 py-3 text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary/50" />
                  <p className="text-sm text-foreground/60">輸入關鍵字搜尋工具</p>
                  <p className="text-xs text-foreground/40 mt-1">
                    例如：ChatGPT、圖像生成、寫作助手
                  </p>
                </div>
              </CommandGroup>
            )}

            {/* 搜尋全部結果提示 */}
            {query.trim() && hasResults && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleSearchSubmit}
                    className="cursor-pointer justify-center py-3 text-primary"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    搜尋「{query}」的所有結果
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>

        {/* 底部快捷鍵提示 */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-foreground/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">↑↓</kbd>
              選擇
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">Enter</kbd>
              確認
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted">K</kbd>
            開啟搜尋
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
