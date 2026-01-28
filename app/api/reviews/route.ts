import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 取得工具的評論列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get("toolId")
    const sort = searchParams.get("sort") || "newest" // newest, helpful, rating
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    if (!toolId) {
      return NextResponse.json({ error: "缺少 toolId 參數" }, { status: 400 })
    }

    // 排序邏輯
    let orderBy: any = { createdAt: "desc" } // 預設最新
    if (sort === "helpful") {
      orderBy = { likes: { _count: "desc" } }
    } else if (sort === "rating") {
      orderBy = { rating: "desc" }
    }

    // 取得評論
    const reviews = await prisma.review.findMany({
      where: { toolId: parseInt(toolId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: { likes: true },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    })

    // 取得總數
    const total = await prisma.review.count({
      where: { toolId: parseInt(toolId) },
    })

    // 計算平均評分
    const avgRating = await prisma.review.aggregate({
      where: { toolId: parseInt(toolId) },
      _avg: { rating: true },
    })

    // 如果使用者已登入，檢查哪些評論已按讚
    const session = await auth()
    let userLikes: string[] = []
    
    if (session?.user?.id) {
      const likes = await prisma.reviewLike.findMany({
        where: {
          userId: session.user.id,
          reviewId: { in: reviews.map(r => r.id) },
        },
        select: { reviewId: true },
      })
      userLikes = likes.map(l => l.reviewId)
    }

    // 格式化回應
    const formattedReviews = reviews.map(review => ({
      id: review.id,
      userId: review.userId,
      userName: review.user.name || "匿名使用者",
      userAvatar: review.user.image,
      rating: review.rating,
      title: review.title,
      content: review.content,
      pros: review.pros ? JSON.parse(review.pros) : [],
      cons: review.cons ? JSON.parse(review.cons) : [],
      helpful: review._count.likes,
      verified: review.verified,
      isLiked: userLikes.includes(review.id),
      isOwner: session?.user?.id === review.userId,
      createdAt: review.createdAt.toISOString(),
      date: review.createdAt.toLocaleDateString("zh-TW"),
    }))

    return NextResponse.json({
      reviews: formattedReviews,
      total,
      avgRating: avgRating._avg.rating || 0,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("取得評論失敗:", error)
    return NextResponse.json({ error: "取得評論失敗" }, { status: 500 })
  }
}

// POST: 新增評論
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const body = await request.json()
    const { toolId, rating, title, content, pros, cons } = body

    // 驗證必填欄位
    if (!toolId || !rating || !content) {
      return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 })
    }

    // 驗證評分範圍
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "評分必須在 1-5 之間" }, { status: 400 })
    }

    // 檢查是否已經評論過
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId: parseInt(toolId),
        },
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "您已經評論過此工具" }, { status: 400 })
    }

    // 建立評論
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        toolId: parseInt(toolId),
        rating,
        title: title || null,
        content,
        pros: pros ? JSON.stringify(pros) : null,
        cons: cons ? JSON.stringify(cons) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        userId: review.userId,
        userName: review.user.name || "匿名使用者",
        userAvatar: review.user.image,
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: pros || [],
        cons: cons || [],
        helpful: 0,
        verified: false,
        isLiked: false,
        isOwner: true,
        createdAt: review.createdAt.toISOString(),
        date: review.createdAt.toLocaleDateString("zh-TW"),
      },
    })
  } catch (error) {
    console.error("新增評論失敗:", error)
    return NextResponse.json({ error: "新增評論失敗" }, { status: 500 })
  }
}

// DELETE: 刪除評論
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get("reviewId")

    if (!reviewId) {
      return NextResponse.json({ error: "缺少 reviewId 參數" }, { status: 400 })
    }

    // 檢查評論是否存在且為本人所有
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      return NextResponse.json({ error: "評論不存在" }, { status: 404 })
    }

    if (review.userId !== session.user.id) {
      return NextResponse.json({ error: "無權限刪除此評論" }, { status: 403 })
    }

    // 刪除評論
    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("刪除評論失敗:", error)
    return NextResponse.json({ error: "刪除評論失敗" }, { status: 500 })
  }
}
