"use client"

import { useFavorites } from "@/contexts"
import { ToolCard } from "@/components/tools"
import Link from "next/link"
import { ArrowLeft, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Tool } from "@/types"
import { useEffect, useState } from "react"

export function FavoritesPageClient() {
  const { favorites, favoritesCount } = useFavorites()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(false)

  // 獲取收藏的工具資料
  useEffect(() => {
    async function fetchTools() {
      if (favorites.length === 0) {
        setTools([])
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/tools?ids=${favorites.join(",")}`)
        const data = await res.json()
        setTools(data.tools || [])
      } catch (error) {
        console.error("Failed to fetch favorite tools:", error)
        setTools([])
      } finally {
        setLoading(false)
      }
    }
    fetchTools()
  }, [favorites])

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="mb-8">
          <Link 
            href="/tools" 
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回工具列表
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
                我的收藏
              </h1>
              <p className="font-body text-foreground/60 mt-1">
                {favoritesCount} 個收藏工具
              </p>
            </div>
          </div>
        </div>

        {/* 收藏內容 */}
        {favoritesCount === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="w-10 h-10 text-red-500/50" />
            </div>
            <h2 className="font-heading font-semibold text-2xl text-foreground mb-3">
              尚未收藏任何工具
            </h2>
            <p className="font-body text-foreground/60 mb-6 max-w-md mx-auto">
              瀏覽工具列表，點擊愛心按鈕將喜歡的工具加入收藏
            </p>
            <Button asChild>
              <Link href="/tools">
                瀏覽工具
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
