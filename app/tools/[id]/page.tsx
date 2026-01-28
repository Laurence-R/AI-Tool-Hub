import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ToolDetailClient } from "./ToolDetailClient"
import { getTool, getToolReviews, getRelatedTools, getAllToolsFull } from "@/lib/tools"
import { generateToolMetadata } from "@/lib/seo"
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from "@/components/seo"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const tool = getTool(id)
    
    if (!tool) {
        return {
            title: "工具未找到"
        }
    }

    return generateToolMetadata({
        name: tool.name,
        description: tool.description,
        logo: tool.logo,
        category: tool.category,
        id: tool.id,
    })
}

// 生成靜態路徑
export async function generateStaticParams() {
    const tools = getAllToolsFull()
    return tools.map(tool => ({
        id: tool.id.toString(),
    }))
}

export default async function ToolDetailPage({ params }: PageProps) {
    const { id } = await params
    const tool = getTool(id)
    
    if (!tool) {
        notFound()
    }

    const reviews = getToolReviews(tool.id)
    const relatedTools = getRelatedTools(tool)

    // 麵包屑導航資料
    const breadcrumbItems = [
        { name: "首頁", href: "/" },
        { name: "工具", href: "/tools" },
        { name: tool.name, href: `/tools/${tool.id}` },
    ]

    return (
        <>
            <SoftwareApplicationJsonLd
                name={tool.name}
                description={tool.description}
                image={tool.logo}
                url={tool.url}
                category={tool.category}
                rating={tool.rating}
                ratingCount={tool.reviewCount}
                price={tool.pricing}
            />
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <ToolDetailClient tool={tool} reviews={reviews} relatedTools={relatedTools} />
        </>
    )
}
