import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/favorites/sync - 批量同步收藏（登入後將 localStorage 收藏同步到資料庫）
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { toolIds } = body

    if (!Array.isArray(toolIds)) {
      return NextResponse.json(
        { error: "toolIds 必須是陣列" },
        { status: 400 }
      )
    }

    // 將 toolIds 轉換為數字
    const numericToolIds = toolIds
      .map((id: string) => parseInt(String(id), 10))
      .filter((id: number) => !isNaN(id))

    // 取得使用者目前的收藏
    const existingFavorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        toolId: true,
      },
    })

    const existingToolIds = new Set(existingFavorites.map((f) => f.toolId))

    // 過濾出需要新增的收藏
    const newToolIds = numericToolIds.filter((id: number) => !existingToolIds.has(id))

    // 批量建立收藏
    if (newToolIds.length > 0) {
      // 使用 transaction 來處理批量創建
      await prisma.$transaction(
        newToolIds.map((toolId: number) =>
          prisma.favorite.create({
            data: {
              userId: session.user.id as string,
              toolId,
            },
          })
        )
      )
    }

    // 取得更新後的收藏列表
    const updatedFavorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        toolId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      message: "同步成功",
      added: newToolIds.length,
      favorites: updatedFavorites.map((f) => String(f.toolId)),
    })
  } catch (error) {
    console.error("同步收藏失敗:", error)
    return NextResponse.json(
      { error: "同步收藏失敗" },
      { status: 500 }
    )
  }
}
