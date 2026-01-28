import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import toolsData from "@/data/tools/tools.json"
import type { Tool, ToolBase } from "@/types"

// GET /api/tools - 獲取所有工具（靜態 + 數據庫）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const pricing = searchParams.get("pricing")
    const search = searchParams.get("search")

    // 從靜態 JSON 獲取工具
    const staticTools: Tool[] = toolsData as Tool[]

    // 從數據庫獲取已批准的工具
    const dbTools = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    })

    // 將數據庫工具轉換為 Tool 格式（添加必要的預設值）
    const dbToolsMapped: Tool[] = dbTools.map((tool) => ({
      id: tool.id,
      slug: `db-tool-${tool.id}`,
      name: tool.name,
      description: tool.description,
      url: tool.url,
      logo: tool.logo || "/images/tools/default-logo.png",
      category: tool.category,
      pricing: tool.pricing as "free" | "freemium" | "paid",
      features: tool.features ? JSON.parse(tool.features) : [],
      tags: tool.tags ? JSON.parse(tool.tags) : [],
      rating: tool.rating,
      reviewCount: tool.reviewCount,
      // 完整 Tool 類型需要的額外欄位
      fullDescription: tool.description,
      pricingPlans: [],
      screenshots: [],
      relatedToolIds: [],
      // 額外欄位
      isActive: tool.isActive,
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
    }))

    // 合併靜態工具和數據庫工具（數據庫工具排在前面）
    let allTools = [...dbToolsMapped, ...staticTools]

    // 過濾
    if (category && category !== "all") {
      allTools = allTools.filter((tool) => tool.category === category)
    }
    if (pricing && pricing !== "all") {
      allTools = allTools.filter((tool) => tool.pricing === pricing)
    }
    if (search) {
      const searchLower = search.toLowerCase()
      allTools = allTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    }

    return NextResponse.json({
      tools: allTools,
      total: allTools.length,
      dbCount: dbToolsMapped.length,
      staticCount: staticTools.length,
    })
  } catch (error) {
    console.error("獲取工具列表失敗:", error)
    return NextResponse.json({ error: "獲取工具列表失敗" }, { status: 500 })
  }
}
