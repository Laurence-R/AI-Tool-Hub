import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/favorites - 取得使用者的收藏列表
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // 轉換為前端需要的格式（字串）
    const toolIds = favorites.map((fav) => String(fav.toolId))

    return NextResponse.json({
      favorites: toolIds,
    })
  } catch (error) {
    console.error("取得收藏列表失敗:", error)
    return NextResponse.json(
      { error: "取得收藏列表失敗" },
      { status: 500 }
    )
  }
}

// POST /api/favorites - 新增收藏
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
    const { toolId } = body

    if (!toolId) {
      return NextResponse.json(
        { error: "工具 ID 為必填" },
        { status: 400 }
      )
    }

    // 將 toolId 轉換為數字
    const numericToolId = parseInt(String(toolId), 10)
    
    if (isNaN(numericToolId)) {
      return NextResponse.json(
        { error: "無效的工具 ID" },
        { status: 400 }
      )
    }

    // 檢查是否已經收藏
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId: numericToolId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: "已經收藏過此工具" },
        { status: 400 }
      )
    }

    // 建立收藏（假設工具已存在於靜態資料中）
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        toolId: numericToolId,
      },
    })

    return NextResponse.json({
      message: "收藏成功",
      favorite: {
        ...favorite,
        toolId: String(favorite.toolId),
      },
    })
  } catch (error) {
    console.error("新增收藏失敗:", error)
    return NextResponse.json(
      { error: "新增收藏失敗" },
      { status: 500 }
    )
  }
}

// DELETE /api/favorites - 移除收藏
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get("toolId")

    if (!toolId) {
      return NextResponse.json(
        { error: "工具 ID 為必填" },
        { status: 400 }
      )
    }

    // 將 toolId 轉換為數字
    const numericToolId = parseInt(toolId, 10)
    
    if (isNaN(numericToolId)) {
      return NextResponse.json(
        { error: "無效的工具 ID" },
        { status: 400 }
      )
    }

    // 刪除收藏
    await prisma.favorite.delete({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId: numericToolId,
        },
      },
    })

    return NextResponse.json({
      message: "已取消收藏",
    })
  } catch (error: unknown) {
    // 如果收藏不存在
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "收藏不存在" },
        { status: 404 }
      )
    }

    console.error("移除收藏失敗:", error)
    return NextResponse.json(
      { error: "移除收藏失敗" },
      { status: 500 }
    )
  }
}
