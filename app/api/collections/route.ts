import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/collections - 取得合集列表
// ?type=my - 我的合集
// ?type=public - 所有公開合集
// ?type=featured - 精選合集 (未來可用)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "public"
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    const session = await auth()

    // 如果要取得自己的合集，需要登入
    if (type === "my") {
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "請先登入" },
          { status: 401 }
        )
      }

      const collections = await prisma.collection.findMany({
        where: {
          userId: session.user.id,
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
        orderBy: {
          updatedAt: "desc",
        },
        take: limit,
        skip: offset,
      })

      const total = await prisma.collection.count({
        where: {
          userId: session.user.id,
        },
      })

      return NextResponse.json({
        collections: collections.map((c) => ({
          ...c,
          itemCount: c.items.length,
          toolIds: c.items.map((i) => i.toolId),
        })),
        total,
        hasMore: offset + collections.length < total,
      })
    }

    // 公開合集
    const collections = await prisma.collection.findMany({
      where: {
        isPublic: true,
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
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
      skip: offset,
    })

    const total = await prisma.collection.count({
      where: {
        isPublic: true,
      },
    })

    return NextResponse.json({
      collections: collections.map((c) => ({
        ...c,
        itemCount: c.items.length,
        toolIds: c.items.map((i) => i.toolId),
      })),
      total,
      hasMore: offset + collections.length < total,
    })
  } catch (error) {
    console.error("取得合集列表失敗:", error)
    return NextResponse.json(
      { error: "取得合集列表失敗" },
      { status: 500 }
    )
  }
}

// POST /api/collections - 建立新合集
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
    const { name, description, isPublic } = body

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

    if (description && description.length > 200) {
      return NextResponse.json(
        { error: "合集描述不能超過 200 字" },
        { status: 400 }
      )
    }

    // 檢查使用者的合集數量限制 (最多 20 個)
    const collectionCount = await prisma.collection.count({
      where: {
        userId: session.user.id,
      },
    })

    if (collectionCount >= 20) {
      return NextResponse.json(
        { error: "已達到合集數量上限 (20 個)" },
        { status: 400 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        description: description?.trim() || null,
        isPublic: isPublic ?? false,
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
      message: "合集建立成功",
      collection: {
        ...collection,
        itemCount: 0,
        toolIds: [],
      },
    })
  } catch (error) {
    console.error("建立合集失敗:", error)
    return NextResponse.json(
      { error: "建立合集失敗" },
      { status: 500 }
    )
  }
}
