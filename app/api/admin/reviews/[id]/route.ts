import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/reviews/[id] - 取得單一評論
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }
    
    // Check admin permission
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "無權限" }, { status: 403 })
    }

    const { id } = await params

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!review) {
      return NextResponse.json({ error: "評論不存在" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching review:", error)
    return NextResponse.json(
      { error: "取得評論失敗" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/reviews/[id] - 更新評論（隱藏/顯示）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }
    
    // Check admin permission
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "無權限" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { isHidden } = body

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview) {
      return NextResponse.json({ error: "評論不存在" }, { status: 404 })
    }

    // Update review
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isHidden: typeof isHidden === "boolean" ? isHidden : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json(
      { error: "更新評論失敗" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/reviews/[id] - 刪除評論
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "未登入" }, { status: 401 })
    }
    
    // Check admin permission
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })
    
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "無權限" }, { status: 403 })
    }

    const { id } = await params

    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    })

    if (!existingReview) {
      return NextResponse.json({ error: "評論不存在" }, { status: 404 })
    }

    // Delete the review (likes will be deleted by cascade)
    await prisma.review.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json(
      { error: "刪除評論失敗" },
      { status: 500 }
    )
  }
}
