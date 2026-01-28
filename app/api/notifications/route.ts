import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/notifications - 獲取用戶通知列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly && { isRead: false }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    // 獲取未讀數量
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    })

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      })),
      unreadCount,
    })
  } catch (error) {
    console.error("獲取通知列表錯誤:", error)
    return NextResponse.json({ error: "獲取通知列表失敗" }, { status: 500 })
  }
}

// PATCH /api/notifications - 標記通知為已讀
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAllRead } = body

    if (markAllRead) {
      // 標記所有通知為已讀
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: { isRead: true },
      })
    } else if (notificationId) {
      // 標記單個通知為已讀
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: session.user.id, // 確保只能標記自己的通知
        },
        data: { isRead: true },
      })
    } else {
      return NextResponse.json({ error: "缺少參數" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("更新通知狀態錯誤:", error)
    return NextResponse.json({ error: "更新通知失敗" }, { status: 500 })
  }
}
