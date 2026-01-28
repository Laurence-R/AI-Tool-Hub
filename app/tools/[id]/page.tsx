import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ToolDetailClient } from "./ToolDetailClient"
import { getTool, getToolReviews, getRelatedTools, getAllToolsFull } from "@/lib/tools"

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

    return {
        title: `${tool.name} - AI Tool Hub`,
        description: tool.description,
    }
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

    return <ToolDetailClient tool={tool} reviews={reviews} relatedTools={relatedTools} />
}
