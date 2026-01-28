import { Metadata } from "next"
import { Suspense } from "react"
import { ToolsPageClient } from "./ToolsPageClient"
import { ToolListJsonLd, BreadcrumbJsonLd } from "@/components/seo"
import { generatePageMetadata } from "@/lib/seo"
import { getAllToolsFull } from "@/lib/tools"

export const metadata: Metadata = generatePageMetadata({
    title: "探索 AI 工具",
    description: "發現最優質的 AI 工具，比較功能、價格和用戶評價，找到最適合您的 AI 解決方案。",
    path: "/tools",
})

export default function ToolsPage() {
    const tools = getAllToolsFull()
    
    // 準備工具列表 JSON-LD 資料
    const toolListItems = tools.slice(0, 10).map(tool => ({
        name: tool.name,
        description: tool.description,
        url: tool.url,
        image: tool.logo,
    }))

    // 麵包屑導航資料
    const breadcrumbItems = [
        { name: "首頁", href: "/" },
        { name: "工具", href: "/tools" },
    ]

    return (
        <>
            <ToolListJsonLd items={toolListItems} listName="AI 工具列表" />
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Suspense fallback={
                <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center">
                    <div className="animate-pulse text-foreground/60">載入中...</div>
                </div>
            }>
                <ToolsPageClient />
            </Suspense>
        </>
    )
}
