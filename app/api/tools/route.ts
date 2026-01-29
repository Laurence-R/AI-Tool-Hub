import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Tool } from "@/types"

// GET /api/tools - 獲取所有工具（純資料庫）
// Phase 3.5: 已移除靜態 JSON 合併邏輯
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const pricing = searchParams.get("pricing")
    const search = searchParams.get("search")
    const ids = searchParams.get("ids") // 支援按 ID 批量獲取
    const page = searchParams.get("page")
    const limit = searchParams.get("limit")

    // 建構查詢條件
    const where: {
      isActive: boolean
      category?: string
      pricing?: string
      OR?: Array<{
        name?: { contains: string }
        description?: { contains: string }
        tags?: { contains: string }
      }>
      id?: { in: number[] }
    } = { isActive: true }

    // 按 ID 批量獲取（用於合集頁面）
    if (ids) {
      const idArray = ids.split(",").map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id))
      where.id = { in: idArray }
    }

    // 過濾條件
    if (category && category !== "all") {
      where.category = category
    }
    if (pricing && pricing !== "all") {
      where.pricing = pricing
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    // 分頁設定
    const pageNum = page ? parseInt(page, 10) : 1
    const pageSize = limit ? parseInt(limit, 10) : 100 // 預設 100，可調整
    const skip = (pageNum - 1) * pageSize

    // 查詢資料庫
    const [dbTools, total] = await Promise.all([
      prisma.tool.findMany({
        where,
        orderBy: [
          { isFeatured: "desc" },  // 精選工具優先
          { order: "asc" },        // 自訂排序
          { rating: "desc" },      // 評分高的優先
        ],
        skip: page ? skip : undefined,
        take: page ? pageSize : undefined,
      }),
      prisma.tool.count({ where }),
    ])

    // 將資料庫工具轉換為 Tool 格式
    const tools: Tool[] = dbTools.map((tool) => ({
      id: tool.id,
      slug: tool.slug,
      name: tool.name,
      description: tool.description,
      fullDescription: tool.fullDescription || tool.description,
      url: tool.url,
      logo: tool.logo || "/images/tools/default-logo.png",
      category: tool.category,
      pricing: tool.pricing as "free" | "freemium" | "paid",
      features: tool.features ? JSON.parse(tool.features) : [],
      tags: tool.tags ? JSON.parse(tool.tags) : [],
      pricingPlans: tool.pricingPlans ? JSON.parse(tool.pricingPlans) : [],
      screenshots: tool.screenshots ? JSON.parse(tool.screenshots) : [],
      relatedToolIds: tool.relatedToolIds ? JSON.parse(tool.relatedToolIds) : [],
      rating: tool.rating,
      reviewCount: tool.reviewCount,
      isActive: tool.isActive,
      isFeatured: tool.isFeatured,
      createdAt: tool.createdAt.toISOString(),
      updatedAt: tool.updatedAt.toISOString(),
    }))

    // 如果是按 ID 查詢，保持請求順序
    if (ids) {
      const idArray = ids.split(",").map((id) => parseInt(id.trim(), 10))
      tools.sort((a, b) => idArray.indexOf(a.id) - idArray.indexOf(b.id))
    }

    return NextResponse.json({
      tools,
      total,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error("獲取工具列表失敗:", error)
    return NextResponse.json({ error: "獲取工具列表失敗" }, { status: 500 })
  }
}
