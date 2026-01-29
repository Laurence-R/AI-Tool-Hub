import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 取得工具列表（管理員用）
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    // 檢查是否為管理員
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const category = searchParams.get("category") || ""
    const pricing = searchParams.get("pricing") || ""

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (category) {
      where.category = category
    }
    
    if (pricing) {
      where.pricing = pricing
    }

    // Get total count
    const totalCount = await prisma.tool.count({ where })
    const totalPages = Math.ceil(totalCount / limit)

    // Get tools with pagination
    const tools = await prisma.tool.findMany({
      where,
      orderBy: { id: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    return NextResponse.json({
      tools,
      page,
      totalPages,
      totalCount,
    })
  } catch (error) {
    console.error("取得工具列表失敗:", error)
    return NextResponse.json({ error: "取得工具列表失敗" }, { status: 500 })
  }
}

// POST: 新增工具
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    // 檢查是否為管理員
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      url,
      logo,
      category,
      pricing,
      features,
      tags,
    } = body

    // Validation
    if (!name || !description || !url || !category || !pricing) {
      return NextResponse.json({ error: "請填寫所有必填欄位" }, { status: 400 })
    }

    // Generate slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '')
    
    let slug = baseSlug || `tool-${Date.now()}`
    let slugSuffix = 1
    while (await prisma.tool.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${slugSuffix}`
      slugSuffix++
    }

    // Get next ID
    const maxTool = await prisma.tool.findFirst({
      orderBy: { id: "desc" },
      select: { id: true },
    })
    const nextId = Math.max(20, maxTool?.id || 0) + 1

    // Create tool
    const tool = await prisma.tool.create({
      data: {
        id: nextId,
        slug,
        name,
        description,
        url,
        logo: logo || null,
        category,
        pricing,
        features: features ? JSON.stringify(features) : null,
        tags: tags ? JSON.stringify(tags) : null,
      },
    })

    return NextResponse.json({ tool }, { status: 201 })
  } catch (error) {
    console.error("新增工具失敗:", error)
    return NextResponse.json({ error: "新增工具失敗" }, { status: 500 })
  }
}
