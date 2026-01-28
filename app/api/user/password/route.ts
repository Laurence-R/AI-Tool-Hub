import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "請填寫所有欄位" }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "新密碼至少需要 8 個字元" }, { status: 400 })
    }

    // 取得使用者資料（包含密碼）
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true }
    })

    if (!user?.password) {
      return NextResponse.json({ 
        error: "此帳號使用社群登入，無法更改密碼" 
      }, { status: 400 })
    }

    // 驗證目前密碼
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "目前密碼不正確" }, { status: 400 })
    }

    // 加密新密碼
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // 更新密碼
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("更新密碼失敗:", error)
    return NextResponse.json({ error: "更新失敗" }, { status: 500 })
  }
}
