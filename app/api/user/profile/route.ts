import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "名稱不能為空" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    })

    return NextResponse.json({ 
      success: true, 
      user: { name: updatedUser.name } 
    })
  } catch (error) {
    console.error("更新個人資料失敗:", error)
    return NextResponse.json({ error: "更新失敗" }, { status: 500 })
  }
}
