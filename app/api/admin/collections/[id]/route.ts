import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/collections/[id] - 取得單一合集
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

    const collection = await prisma.collection.findUnique({
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
        items: {
          orderBy: { addedAt: "desc" },
        },
        _count: {
          select: {
            items: true,
          },
        },
      },
    })

    if (!collection) {
      return NextResponse.json({ error: "合集不存在" }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json(
      { error: "取得合集失敗" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/collections/[id] - 更新合集（可見性等）
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
    const { isPublic, name, description } = body

    // Check if collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    })

    if (!existingCollection) {
      return NextResponse.json({ error: "合集不存在" }, { status: 404 })
    }

    // Update collection
    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: {
        isPublic: typeof isPublic === "boolean" ? isPublic : undefined,
        name: name || undefined,
        description: description !== undefined ? description : undefined,
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
        _count: {
          select: {
            items: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCollection)
  } catch (error) {
    console.error("Error updating collection:", error)
    return NextResponse.json(
      { error: "更新合集失敗" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/collections/[id] - 刪除合集
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

    // Check if collection exists
    const existingCollection = await prisma.collection.findUnique({
      where: { id },
    })

    if (!existingCollection) {
      return NextResponse.json({ error: "合集不存在" }, { status: 404 })
    }

    // Delete the collection (items will be deleted by cascade)
    await prisma.collection.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting collection:", error)
    return NextResponse.json(
      { error: "刪除合集失敗" },
      { status: 500 }
    )
  }
}
