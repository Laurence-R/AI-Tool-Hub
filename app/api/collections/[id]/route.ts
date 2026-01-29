import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type RouteContext = {
  params: Promise<{ id: string }>
}

// GET /api/collections/[id] - 取得單一合集詳情
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const session = await auth()

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: {
            order: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (!collection) {
      return NextResponse.json(
        { error: "合集不存在" },
        { status: 404 }
      )
    }

    // 檢查權限：私人合集只有擁有者可以查看
    if (!collection.isPublic && collection.userId !== session?.user?.id) {
      return NextResponse.json(
        { error: "無權限查看此合集" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      collection: {
        ...collection,
        itemCount: collection.items.length,
        toolIds: collection.items.map((i) => i.toolId),
        isOwner: collection.userId === session?.user?.id,
      },
    })
  } catch (error) {
    console.error("取得合集詳情失敗:", error)
    return NextResponse.json(
      { error: "取得合集詳情失敗" },
      { status: 500 }
    )
  }
}

// PATCH /api/collections/[id] - 更新合集
export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
    })

    if (!collection) {
      return NextResponse.json(
        { error: "合集不存在" },
        { status: 404 }
      )
    }

    // 只有擁有者可以更新
    if (collection.userId !== session.user.id) {
      return NextResponse.json(
        { error: "無權限修改此合集" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, isPublic } = body

    // 驗證
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: "合集名稱為必填" },
          { status: 400 }
        )
      }
      if (name.length > 50) {
        return NextResponse.json(
          { error: "合集名稱不能超過 50 字" },
          { status: 400 }
        )
      }
    }

    if (description !== undefined && description && description.length > 200) {
      return NextResponse.json(
        { error: "合集描述不能超過 200 字" },
        { status: 400 }
      )
    }

    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isPublic !== undefined && { isPublic }),
      },
      include: {
        items: {
          select: {
            id: true,
            toolId: true,
          },
        },
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
      message: "合集更新成功",
      collection: {
        ...updatedCollection,
        itemCount: updatedCollection.items.length,
        toolIds: updatedCollection.items.map((i) => i.toolId),
      },
    })
  } catch (error) {
    console.error("更新合集失敗:", error)
    return NextResponse.json(
      { error: "更新合集失敗" },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[id] - 刪除合集
export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "請先登入" },
        { status: 401 }
      )
    }

    const collection = await prisma.collection.findUnique({
      where: { id },
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
        { error: "無權限刪除此合集" },
        { status: 403 }
      )
    }

    await prisma.collection.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "合集刪除成功",
    })
  } catch (error) {
    console.error("刪除合集失敗:", error)
    return NextResponse.json(
      { error: "刪除合集失敗" },
      { status: 500 }
    )
  }
}
