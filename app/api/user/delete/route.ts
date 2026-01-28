import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 })
    }

    const userId = session.user.id

    // 刪除相關資料（按照依賴順序）
    await prisma.$transaction(async (tx) => {
      // 刪除收藏
      await tx.favorite.deleteMany({ where: { userId } })
      
      // 刪除評論
      await tx.review.deleteMany({ where: { userId } })
      
      // 刪除收藏集項目
      const collections = await tx.collection.findMany({ where: { userId } })
      for (const collection of collections) {
        await tx.collectionItem.deleteMany({ where: { collectionId: collection.id } })
      }
      
      // 刪除收藏集
      await tx.collection.deleteMany({ where: { userId } })
      
      // 刪除帳號連結
      await tx.account.deleteMany({ where: { userId } })
      
      // 刪除 session
      await tx.session.deleteMany({ where: { userId } })
      
      // 刪除使用者
      await tx.user.delete({ where: { id: userId } })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("刪除帳號失敗:", error)
    return NextResponse.json({ error: "刪除失敗" }, { status: 500 })
  }
}
