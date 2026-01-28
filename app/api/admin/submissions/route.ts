import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 取得所有待審核的提交（管理員）
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    // 檢查是否為管理員
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "PENDING"

    const submissions = await prisma.toolSubmission.findMany({
      where: { 
        status: status as any,
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
      },
      orderBy: { createdAt: "desc" },
    })

    const formattedSubmissions = submissions.map(sub => ({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      url: sub.url,
      logo: sub.logo,
      category: sub.category,
      pricing: sub.pricing,
      features: sub.features ? JSON.parse(sub.features) : [],
      tags: sub.tags ? JSON.parse(sub.tags) : [],
      submitterNote: sub.submitterNote,
      status: sub.status,
      reviewNote: sub.reviewNote,
      reviewedAt: sub.reviewedAt?.toISOString(),
      reviewedBy: sub.reviewedBy,
      createdAt: sub.createdAt.toISOString(),
      user: sub.user,
    }))

    // 取得各狀態數量
    const counts = await prisma.toolSubmission.groupBy({
      by: ["status"],
      _count: { id: true },
    })

    const statusCounts = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
    }
    counts.forEach(c => {
      statusCounts[c.status] = c._count.id
    })

    return NextResponse.json({
      submissions: formattedSubmissions,
      total: formattedSubmissions.length,
      counts: statusCounts,
    })
  } catch (error) {
    console.error("取得提交列表失敗:", error)
    return NextResponse.json({ error: "取得提交列表失敗" }, { status: 500 })
  }
}
