"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/contexts"
import type { Tool } from "@/types"
import { 
  Heart, 
  Star, 
  ExternalLink,
  Trash2,
  Loader2,
} from "lucide-react"

export function FavoritesTab() {
  const { favorites, removeFromFavorites, isLoading } = useFavorites()
  const [tools, setTools] = useState<Tool[]>([])
  const [loadingTools, setLoadingTools] = useState(false)

  useEffect(() => {
    async function fetchTools() {
      if (favorites.length === 0) {
        setTools([])
        return
      }
      setLoadingTools(true)
      try {
        const res = await fetch(`/api/tools?ids=${favorites.join(",")}`)
        const data = await res.json()
        setTools(data.tools || [])
      } catch (error) {
        console.error("Failed to fetch favorite tools:", error)
        setTools([])
      } finally {
        setLoadingTools(false)
      }
    }
    fetchTools()
  }, [favorites])

  if (isLoading || loadingTools) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">我的收藏</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/favorites">查看全部</Link>
        </Button>
      </div>
      
      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">尚無收藏</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            探索各種 AI 工具，將喜歡的工具加入收藏
          </p>
          <Button asChild>
            <Link href="/tools">探索工具</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-foreground/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/tools/${tool.id}`} className="font-semibold hover:text-primary transition-colors">
                  {tool.name}
                </Link>
                <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{tool.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {tool.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromFavorites(String(tool.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
