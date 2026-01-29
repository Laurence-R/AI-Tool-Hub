import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// POST /api/collections/[id]/items - 新增工具到合集
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: collectionId } = await context.params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        items: true,
      },
    })

    if (!collection) {
      return NextResponse.json(
        { error: "合集不存在" },
        { status: 404 }
      )
    }

    // 只有擁有者可以新增
    if (collection.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限修改此合集" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { toolId, note } = body

    if (!toolId) {
      return NextResponse.json(
        { error: "工具 ID 為必填" },
        { status: 400 }
      )
    }

    const numericToolId = parseInt(String(toolId), 10)
    if (isNaN(numericToolId)) {
      return NextResponse.json(
        { error: "無效的工具 ID" },
        { status: 400 }
      )
    }

    // 檢查是否已在合集中
    const existingItem = await prisma.collectionItem.findUnique({
      where: {
        collectionId_toolId: {
          collectionId,
          toolId: numericToolId,
        },
      },
    })

    if (existingItem) {
      return NextResponse.json(
        { error: "此工具已在合集中" },
        { status: 400 }
      )
    }

    // 檢查合集項目數量限制 (最多 50 個)
    if (collection.items.length >= 50) {
      return NextResponse.json(
        { error: "已達到合集工具數量上限 (50 個)" },
        { status: 400 }
      )
    }

    // 取得下一個 order
    const maxOrder = collection.items.reduce(
      (max, item) => Math.max(max, item.order),
      -1
    )

    const item = await prisma.collectionItem.create({
      data: {
        collectionId,
        toolId: numericToolId,
        note: note?.trim() || null,
        order: maxOrder + 1,
      },
    })

    // 更新合集的 updatedAt
    await prisma.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: "工具已加入合集",
      item,
    })
  } catch (error) {
    console.error("新增工具到合集失敗:", error)
    return NextResponse.json(
      { error: "新增工具到合集失敗" },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id]/items - 從合集移除工具
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id: collectionId } = await context.params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
    })

    if (!collection) {
      return NextResponse.json(
        { error: "合集不存在" },
        { status: 404 }
      )
    }

    // 只有擁有者可以刪除
    if (collection.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限修改此合集" },
        { status: 403 }
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

    const numericToolId = parseInt(String(toolId), 10)
    if (isNaN(numericToolId)) {
      return NextResponse.json(
        { error: "無效的工具 ID" },
        { status: 400 }
      )
    }

    const item = await prisma.collectionItem.findUnique({
      where: {
        collectionId_toolId: {
          collectionId,
          toolId: numericToolId,
        },
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: "此工具不在合集中" },
        { status: 404 }
      )
    }

    await prisma.collectionItem.delete({
      where: { id: item.id },
    })

    // 更新合集的 updatedAt
    await prisma.collection.update({
      where: { id: collectionId },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json({
      message: "工具已從合集移除",
    })
  } catch (error) {
    console.error("從合集移除工具失敗:", error)
    return NextResponse.json(
      { error: "從合集移除工具失敗" },
      { status: 500 }
    )
  }
}
