import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/reviews - 取得所有評論（管理員）
export async function GET(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }
    
    // Check admin permission
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "無權限" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const isHidden = searchParams.get("isHidden")
    const rating = searchParams.get("rating")
    const toolId = searchParams.get("toolId")
    const userId = searchParams.get("userId")

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.content = {
        contains: search,
      }
    }
    
    if (isHidden !== null && isHidden !== "all") {
      where.isHidden = isHidden === "true"
    }
    
    if (rating && rating !== "all") {
      where.rating = parseInt(rating)
    }
    
    if (toolId) {
      where.toolId = parseInt(toolId)
    }
    
    if (userId) {
      where.userId = userId
    }

    // Fetch reviews with pagination
    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tool: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "取得評論列表失敗" },
      { status: 500 }
    )
  }
}
