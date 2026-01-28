"use client"

import { useCompare, MAX_COMPARE_ITEMS } from "@/contexts"
import { getTool } from "@/lib/tools"
import Image from "next/image"
import Link from "next/link"
import { 
  X, 
  Plus, 
  Star, 
  ExternalLink, 
  Check, 
  Minus,
  ArrowLeft,
  Share2,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Tool } from "@/types"
import { useEffect, useState } from "react"

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, compareCount } = useCompare()
  const [tools, setTools] = useState<(Tool | undefined)[]>([])
  const [copied, setCopied] = useState(false)

  // 獲取完整工具資料
  useEffect(() => {
    const fullTools = compareList.map(t => getTool(t.id))
    setTools(fullTools)
  }, [compareList])

  // 計算空位數量
  const emptySlots = MAX_COMPARE_ITEMS - compareCount

  // 生成分享連結
  const handleShare = async () => {
    const ids = compareList.map(t => t.id).join(',')
    const url = `${window.location.origin}/compare?tools=${ids}`
    
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // 定價標籤轉換
  const getPricingLabel = (pricing: string) => {
    switch (pricing) {
      case "free": return "免費"
      case "freemium": return "免費增值"
      case "paid": return "付費"
      default: return pricing
    }
  }

  // 定價顏色
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case "free": return "text-green-600 dark:text-green-400"
      case "freemium": return "text-blue-600 dark:text-blue-400"
      case "paid": return "text-orange-600 dark:text-orange-400"
      default: return "text-foreground"
    }
  }

  // 收集所有工具的功能（用於對比表格）
  const allFeatures = Array.from(
    new Set(tools.flatMap(t => t?.features || []))
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 頁面標題 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/tools" 
              className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回工具列表
            </Link>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground">
              工具比較
            </h1>
            <p className="font-body text-foreground/60 mt-2">
              最多可同時比較 {MAX_COMPARE_ITEMS} 個工具
            </p>
          </div>
          
          {compareCount > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                {copied ? "已複製!" : "分享比較"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompare}
                className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4" />
                清空
              </Button>
            </div>
          )}
        </div>

        {/* 比較內容 */}
        {compareCount === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-heading font-semibold text-2xl text-foreground mb-3">
              尚未選擇比較工具
            </h2>
            <p className="font-body text-foreground/60 mb-6 max-w-md mx-auto">
              前往工具列表，點擊工具卡片上的比較按鈕，將工具加入比較清單
            </p>
            <Button asChild>
              <Link href="/tools">
                瀏覽工具
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 工具卡片列 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 已選工具 */}
              {tools.map((tool, index) => tool && (
                <div 
                  key={tool.id}
                  className="glass-card rounded-2xl p-4 relative group"
                >
                  {/* 移除按鈕 */}
                  <button
                    onClick={() => removeFromCompare(tool.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    aria-label="移除"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  {/* Logo */}
                  <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-foreground/5 overflow-hidden">
                    <Image
                      src={tool.logo}
                      alt={tool.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* 名稱 */}
                  <h3 className="font-heading font-semibold text-center text-foreground mb-1">
                    {tool.name}
                  </h3>
                  
                  {/* 分類 */}
                  <p className="text-xs text-center text-foreground/50 mb-2">
                    {tool.category}
                  </p>
                  
                  {/* 評分 */}
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{tool.rating.toFixed(1)}</span>
                  </div>
                </div>
              ))}
              
              {/* 空位 */}
              {Array.from({ length: emptySlots }).map((_, index) => (
                <Link
                  key={`empty-${index}`}
                  href="/tools"
                  className="glass-card rounded-2xl p-4 border-2 border-dashed border-foreground/20 flex flex-col items-center justify-center min-h-[180px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-foreground/40" />
                  </div>
                  <span className="text-sm text-foreground/40">新增工具</span>
                </Link>
              ))}
            </div>

            {/* 詳細比較表格 */}
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* 表頭 */}
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-heading font-semibold text-foreground bg-foreground/5 min-w-[150px]">
                        比較項目
                      </th>
                      {tools.map(tool => tool && (
                        <th 
                          key={tool.id}
                          className="text-center p-4 font-heading font-semibold text-foreground bg-foreground/5 min-w-[180px]"
                        >
                          {tool.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  
                  <tbody>
                    {/* 定價 */}
                    <tr className="border-b border-border/50">
                      <td className="p-4 font-medium text-foreground/70">定價模式</td>
                      {tools.map(tool => tool && (
                        <td key={tool.id} className="p-4 text-center">
                          <span className={`font-semibold ${getPricingColor(tool.pricing)}`}>
                            {getPricingLabel(tool.pricing)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    {/* 評分 */}
                    <tr className="border-b border-border/50">
                      <td className="p-4 font-medium text-foreground/70">評分</td>
                      {tools.map(tool => tool && (
                        <td key={tool.id} className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{tool.rating.toFixed(1)}</span>
                            <span className="text-xs text-foreground/50">({tool.reviewCount})</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    
                    {/* 評論數 */}
                    <tr className="border-b border-border/50">
                      <td className="p-4 font-medium text-foreground/70">評論數</td>
                      {tools.map(tool => tool && (
                        <td key={tool.id} className="p-4 text-center font-semibold">
                          {tool.reviewCount.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* 功能比較 */}
                    <tr className="border-b border-border">
                      <td colSpan={tools.length + 1} className="p-4 font-heading font-semibold text-foreground bg-foreground/5">
                        功能比較
                      </td>
                    </tr>
                    
                    {allFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-border/50">
                        <td className="p-4 text-foreground/70">{feature}</td>
                        {tools.map(tool => tool && (
                          <td key={tool.id} className="p-4 text-center">
                            {tool.features?.includes(feature) ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <Minus className="w-5 h-5 text-foreground/20 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* 定價方案 */}
                    <tr className="border-b border-border">
                      <td colSpan={tools.length + 1} className="p-4 font-heading font-semibold text-foreground bg-foreground/5">
                        定價方案
                      </td>
                    </tr>
                    
                    {tools.some(t => t?.pricingPlans && t.pricingPlans.length > 0) && (
                      <tr className="border-b border-border/50">
                        <td className="p-4 text-foreground/70">方案詳情</td>
                        {tools.map(tool => tool && (
                          <td key={tool.id} className="p-4">
                            {tool.pricingPlans && tool.pricingPlans.length > 0 ? (
                              <div className="space-y-2">
                                {tool.pricingPlans.slice(0, 3).map((plan, idx) => (
                                  <div 
                                    key={idx} 
                                    className={`p-2 rounded-lg text-xs ${
                                      plan.recommended 
                                        ? 'bg-primary/10 border border-primary/30' 
                                        : 'bg-foreground/5'
                                    }`}
                                  >
                                    <div className="font-semibold">{plan.name}</div>
                                    <div className="text-primary font-bold">{plan.price}</div>
                                    <div className="text-foreground/50">{plan.period}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-foreground/30 text-sm">無資料</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* 連結 */}
                    <tr>
                      <td className="p-4 font-medium text-foreground/70">官方網站</td>
                      {tools.map(tool => tool && (
                        <td key={tool.id} className="p-4 text-center">
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            訪問
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
