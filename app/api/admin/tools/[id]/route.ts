import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: 取得單一工具詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { id } = await params
    const toolId = parseInt(id)

    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "找不到此工具" }, { status: 404 })
    }

    return NextResponse.json({
      tool: {
        ...tool,
        features: tool.features ? JSON.parse(tool.features) : [],
        tags: tool.tags ? JSON.parse(tool.tags) : [],
      },
    })
  } catch (error) {
    console.error("取得工具失敗:", error)
    return NextResponse.json({ error: "取得工具失敗" }, { status: 500 })
  }
}

// PATCH: 更新工具
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { id } = await params
    const toolId = parseInt(id)
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

    // Check if tool exists
    const existingTool = await prisma.tool.findUnique({
      where: { id: toolId },
    })

    if (!existingTool) {
      return NextResponse.json({ error: "找不到此工具" }, { status: 404 })
    }

    // Update slug if name changed
    let slug = existingTool.slug
    if (name && name !== existingTool.name) {
      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-|-$/g, '')
      
      slug = baseSlug || `tool-${toolId}`
      let slugSuffix = 1
      while (await prisma.tool.findFirst({ 
        where: { slug, NOT: { id: toolId } } 
      })) {
        slug = `${baseSlug}-${slugSuffix}`
        slugSuffix++
      }
    }

    // Update tool
    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        name: name || existingTool.name,
        slug,
        description: description ?? existingTool.description,
        url: url ?? existingTool.url,
        logo: logo !== undefined ? logo : existingTool.logo,
        category: category || existingTool.category,
        pricing: pricing || existingTool.pricing,
        features: features !== undefined 
          ? (features ? JSON.stringify(features) : null)
          : existingTool.features,
        tags: tags !== undefined 
          ? (tags ? JSON.stringify(tags) : null)
          : existingTool.tags,
      },
    })

    return NextResponse.json({ tool })
  } catch (error) {
    console.error("更新工具失敗:", error)
    return NextResponse.json({ error: "更新工具失敗" }, { status: 500 })
  }
}

// DELETE: 刪除工具
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { id } = await params
    const toolId = parseInt(id)

    // Check if tool exists
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    })

    if (!tool) {
      return NextResponse.json({ error: "找不到此工具" }, { status: 404 })
    }

    // Delete related data first (cascade)
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { toolId } }),
      prisma.favorite.deleteMany({ where: { toolId } }),
      prisma.collectionItem.deleteMany({ where: { toolId } }),
      prisma.tool.delete({ where: { id: toolId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("刪除工具失敗:", error)
    return NextResponse.json({ error: "刪除工具失敗" }, { status: 500 })
  }
}
