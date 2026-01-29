import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/collections - 取得所有合集（管理員）
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
    const isPublic = searchParams.get("isPublic")
    const userId = searchParams.get("userId")

    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    
    if (isPublic !== null && isPublic !== "all") {
      where.isPublic = isPublic === "true"
    }
    
    if (userId) {
      where.userId = userId
    }

    // Fetch collections with pagination
    const [collections, totalCount] = await Promise.all([
      prisma.collection.findMany({
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
          _count: {
            select: {
              items: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.collection.count({ where }),
    ])

    return NextResponse.json({
      collections,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { error: "取得合集列表失敗" },
      { status: 500 }
    )
  }
}
