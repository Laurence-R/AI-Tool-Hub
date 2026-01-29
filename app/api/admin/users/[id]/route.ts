import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH: 更新用戶（角色/狀態）
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { role, status } = body

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ error: "找不到此用戶" }, { status: 404 })
    }

    // Prevent self-demotion
    if (id === session.user.id && role === "USER") {
      return NextResponse.json(
        { error: "無法取消自己的管理員權限" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (role && ["USER", "ADMIN"].includes(role)) {
      updateData.role = role
    }
    if (status && ["ACTIVE", "SUSPENDED"].includes(status)) {
      updateData.status = status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "沒有有效的更新資料" }, { status: 400 })
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("更新用戶失敗:", error)
    return NextResponse.json({ error: "更新用戶失敗" }, { status: 500 })
  }
}

// GET: 取得單一用戶詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
            collections: true,
            submissions: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "找不到此用戶" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("取得用戶失敗:", error)
    return NextResponse.json({ error: "取得用戶失敗" }, { status: 500 })
  }
}
