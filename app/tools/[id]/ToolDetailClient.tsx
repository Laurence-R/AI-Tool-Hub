"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { SafeImage } from "@/components/ui/safe-image"
import { 
    Star, 
    ExternalLink, 
    Tag, 
    Check, 
    ChevronRight,
    TrendingUp,
    Users,
    Heart,
    FolderPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/contexts"
import { ReviewSection } from "@/components/tools"
import { AddToCollectionDialog } from "@/components/collections"
import type { Tool, ToolBase } from "@/types"

interface ToolDetailClientProps {
    tool: Tool
    relatedTools: ToolBase[]
}

export function ToolDetailClient({ tool, relatedTools }: ToolDetailClientProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState<"overview" | "pricing" | "reviews">("overview")
    const [reviewCount, setReviewCount] = useState<number>(0)
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
    
    const toolIdStr = String(tool.id)
    const isFav = isFavorite(toolIdStr)

    // 頁面載入時獲取評論數量
    useEffect(() => {
        const fetchReviewCount = async () => {
            try {
                const res = await fetch(`/api/reviews?toolId=${tool.id}&limit=1`)
                const data = await res.json()
                if (res.ok) {
                    setReviewCount(data.total)
                }
            } catch (error) {
                console.error("獲取評論數量失敗:", error)
            }
        }
        fetchReviewCount()
    }, [tool.id])

    const handleToggleFavorite = () => {
        // 未登入時導向登入頁面
        if (!session) {
            router.push(`/login?callbackUrl=/tools/${tool.id}`)
            return
        }
        
        if (isFav) {
            removeFromFavorites(toolIdStr)
        } else {
            addToFavorites(toolIdStr)
        }
    }

    const getPricingLabel = (pricing: string) => {
        const labels = { free: "免費", freemium: "免費增值", paid: "付費" }
        return labels[pricing as keyof typeof labels] || pricing
    }

    const getPricingColor = (pricing: string) => {
        const colors = {
            free: "bg-green-500/10 text-green-500",
            freemium: "bg-blue-500/10 text-blue-500",
            paid: "bg-orange-500/10 text-orange-500"
        }
        return colors[pricing as keyof typeof colors] || "bg-foreground/10 text-foreground"
    }

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-foreground/20"
                        }`}
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - 工具概覽 */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card rounded-3xl p-8 lg:p-12">
                        <div className="grid lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
                            {/* 左側 - 主要資訊 */}
                            <div className="space-y-6">
                                {/* Logo & 標題 */}
                                <div className="flex items-start gap-6">
                                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-foreground/5 flex items-center justify-center overflow-hidden shrink-0">
                                        <SafeImage
                                            src={tool.logo}
                                            alt={`${tool.name} logo`}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                            fallbackClassName="rounded-2xl"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground">
                                                {tool.name}
                                            </h1>
                                            <Badge className={getPricingColor(tool.pricing)}>
                                                {getPricingLabel(tool.pricing)}
                                            </Badge>
                                        </div>
                                        <p className="font-body text-foreground/60 text-base lg:text-lg">
                                            {tool.description}
                                        </p>
                                    </div>
                                </div>

                                {/* 評分與統計 */}
                                <div className="flex items-center gap-6 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        {renderStars(Math.round(tool.rating))}
                                        <span className="font-heading font-bold text-xl text-foreground">
                                            {tool.rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/60">
                                        <Users className="w-4 h-4" />
                                        <span className="font-body text-sm">
                                            {tool.reviewCount.toLocaleString()} 則評價
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/60">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="font-body text-sm">{tool.category}</span>
                                    </div>
                                </div>

                                {/* 標籤 */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {tool.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground/60 text-sm font-body hover:bg-foreground/10 transition-colors duration-200 cursor-pointer"
                                        >
                                            <Tag className="w-3.5 h-3.5" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* 右側 - CTA */}
                            <div className="space-y-4">
                                <Button
                                    asChild
                                    className="w-full h-12 text-base font-semibold"
                                    size="lg"
                                >
                                    <Link href={tool.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="w-5 h-5 mr-2" />
                                        訪問官網
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className={`w-full h-12 text-base font-semibold ${
                                        isFav ? "bg-primary/10 border-primary text-primary" : ""
                                    }`}
                                    size="lg"
                                    onClick={handleToggleFavorite}
                                >
                                    <Heart className={`w-5 h-5 mr-2 ${isFav ? "fill-primary" : ""}`} />
                                    {isFav ? "已收藏" : "加入收藏"}
                                </Button>
                                <AddToCollectionDialog
                                    toolId={tool.id}
                                    trigger={
                                        <Button
                                            variant="outline"
                                            className="w-full h-12 text-base font-semibold"
                                            size="lg"
                                        >
                                            <FolderPlus className="w-5 h-5 mr-2" />
                                            加入合集
                                        </Button>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="px-4 mb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card rounded-2xl p-2">
                        <div className="flex gap-2">
                            {[
                                { id: "overview", label: "功能介紹" },
                                { id: "pricing", label: "定價方案" },
                                { id: "reviews", label: `評價 (${reviewCount})` }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 px-6 py-3 rounded-xl font-body font-medium transition-all duration-200 cursor-pointer ${
                                        activeTab === tab.id
                                            ? "bg-primary text-white shadow-md"
                                            : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tab Content */}
            <section className="px-4 pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                        {/* 主要內容區 */}
                        <div className="space-y-8">
                            {activeTab === "overview" && (
                                <>
                                    {/* 詳細描述 */}
                                    {tool.fullDescription && (
                                        <div className="glass-card rounded-2xl p-8 space-y-4">
                                            <h2 className="font-heading font-bold text-2xl text-foreground">
                                                產品介紹
                                            </h2>
                                            <p className="font-body text-foreground/70 leading-relaxed">
                                                {tool.fullDescription}
                                            </p>
                                        </div>
                                    )}

                                    {/* 主要功能 */}
                                    {tool.features && tool.features.length > 0 && (
                                        <div className="glass-card rounded-2xl p-8 space-y-6">
                                            <h2 className="font-heading font-bold text-2xl text-foreground">
                                                主要功能
                                            </h2>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {tool.features.map((feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-start gap-3 p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="font-body text-foreground/80">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === "pricing" && (
                                <div className="glass-card rounded-2xl p-8 space-y-6">
                                    <h2 className="font-heading font-bold text-2xl text-foreground">
                                        定價方案
                                    </h2>
                                    {tool.pricingPlans && tool.pricingPlans.length > 0 ? (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {tool.pricingPlans.map((plan, index) => (
                                                <div
                                                    key={index}
                                                    className={`relative p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                                                        plan.recommended
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border bg-background/50 hover:border-primary/50"
                                                    }`}
                                                >
                                                    {plan.recommended && (
                                                        <div className="absolute -top-3 left-6">
                                                            <Badge className="bg-primary text-white shadow-md">
                                                                推薦方案
                                                            </Badge>
                                                        </div>
                                                    )}
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                                                                {plan.name}
                                                            </h3>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="font-heading font-bold text-3xl text-foreground">
                                                                    {plan.price}
                                                                </span>
                                                                <span className="font-body text-foreground/60">
                                                                    / {plan.period}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {plan.features.map((feature, fIndex) => (
                                                                <li
                                                                    key={fIndex}
                                                                    className="flex items-start gap-2"
                                                                >
                                                                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                                    <span className="font-body text-sm text-foreground/70">
                                                                        {feature}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="font-body text-foreground/60">
                                            詳細定價資訊請訪問官網查看
                                        </p>
                                    )}
                                </div>
                            )}

                            {activeTab === "reviews" && (
                                <ReviewSection 
                                    toolId={tool.id} 
                                    toolName={tool.name} 
                                    onCountChange={setReviewCount}
                                />
                            )}
                        </div>

                        {/* 側邊欄 - 相似工具 */}
                        <div className="space-y-6">
                            <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
                                <h3 className="font-heading font-bold text-xl text-foreground">
                                    相似工具推薦
                                </h3>
                                <div className="space-y-4">
                                    {relatedTools.map((relatedTool) => (
                                        <Link
                                            key={relatedTool.id}
                                            href={`/tools/${relatedTool.id}`}
                                            className="block group"
                                        >
                                            <div className="p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-all duration-200 cursor-pointer space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center overflow-hidden shrink-0">
                                                        <SafeImage
                                                            src={relatedTool.logo}
                                                            alt={relatedTool.name}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                            fallbackClassName="rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-body font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                                            {relatedTool.name}
                                                        </h4>
                                                        <p className="font-body text-sm text-foreground/60 line-clamp-2">
                                                            {relatedTool.description}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {renderStars(Math.round(relatedTool.rating))}
                                                    <span className="font-body text-sm text-foreground/60">
                                                        {relatedTool.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
