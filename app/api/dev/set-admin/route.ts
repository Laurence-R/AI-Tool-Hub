// 設定用戶為管理員的 API
// 僅用於開發環境

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  // 僅允許在開發環境使用
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "此 API 僅限開發環境使用" }, { status: 403 })
  }

  const body = await request.json()
  const { email } = body

  if (!email) {
    // 列出所有用戶
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    })
    return NextResponse.json({ users })
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return NextResponse.json({ error: `找不到 email 為 ${email} 的用戶` }, { status: 404 })
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  })

  return NextResponse.json({
    success: true,
    message: `已將 ${updatedUser.name || updatedUser.email} 設為管理員`,
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    },
  })
}
