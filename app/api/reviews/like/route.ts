import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST: 按讚/取消按讚評論
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const body = await request.json()
    const { reviewId } = body

    if (!reviewId) {
      return NextResponse.json({ error: "缺少 reviewId 參數" }, { status: 400 })
    }

    // 檢查評論是否存在
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    })

    if (!review) {
      return NextResponse.json({ error: "評論不存在" }, { status: 404 })
    }

    // 檢查是否已經按讚
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId,
        },
      },
    })

    if (existingLike) {
      // 取消按讚
      await prisma.reviewLike.delete({
        where: { id: existingLike.id },
      })

      // 取得更新後的按讚數
      const likesCount = await prisma.reviewLike.count({
        where: { reviewId },
      })

      return NextResponse.json({
        success: true,
        action: "unliked",
        likesCount,
      })
    } else {
      // 新增按讚
      await prisma.reviewLike.create({
        data: {
          userId: session.user.id,
          reviewId,
        },
      })

      // 取得更新後的按讚數
      const likesCount = await prisma.reviewLike.count({
        where: { reviewId },
      })

      return NextResponse.json({
        success: true,
        action: "liked",
        likesCount,
      })
    }
  } catch (error) {
    console.error("按讚失敗:", error)
    return NextResponse.json({ error: "操作失敗" }, { status: 500 })
  }
}
