import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/user/role - 獲取當前用戶角色
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    return NextResponse.json({ role: user.role })
  } catch (error) {
    console.error("獲取用戶角色失敗:", error)
    return NextResponse.json({ error: "獲取用戶角色失敗" }, { status: 500 })
  }
}
