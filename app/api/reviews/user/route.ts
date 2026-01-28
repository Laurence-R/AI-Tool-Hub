import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getToolById } from "@/lib/tools"

// GET /api/reviews/user - 獲取當前使用者的所有評論
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const reviews = await prisma.review.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            likes: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    // 獲取對應的工具資訊（從靜態資料）
    const formattedReviews = reviews.map(review => {
      const tool = getToolById(review.toolId)
      return {
        id: review.id,
        title: review.title,
        content: review.content,
        rating: review.rating,
        pros: review.pros ? JSON.parse(review.pros) : [],
        cons: review.cons ? JSON.parse(review.cons) : [],
        likesCount: review._count.likes,
        createdAt: review.createdAt.toISOString(),
        tool: tool ? {
          id: tool.id,
          name: tool.name,
          logo: tool.logo,
          category: tool.category
        } : {
          id: review.toolId,
          name: "未知工具",
          logo: null,
          category: "其他"
        }
      }
    })

    return NextResponse.json({
      reviews: formattedReviews,
      total: formattedReviews.length
    })

  } catch (error) {
    console.error("獲取使用者評論失敗:", error)
    return NextResponse.json(
      { error: "獲取評論失敗" },
      { status: 500 }
    )
  }
}
