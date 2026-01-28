import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 取得使用者的提交列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const submissions = await prisma.toolSubmission.findMany({
      where: { userId: session.user.id },
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
      createdAt: sub.createdAt.toISOString(),
    }))

    return NextResponse.json({
      submissions: formattedSubmissions,
      total: formattedSubmissions.length,
    })
  } catch (error) {
    console.error("取得提交列表失敗:", error)
    return NextResponse.json({ error: "取得提交列表失敗" }, { status: 500 })
  }
}

// POST: 提交新工具
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    console.log("Session in submissions API:", JSON.stringify(session, null, 2))
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      description,
      url,
      logo,
      category,
      pricing,
      features,
      tags,
      submitterNote,
    } = body

    // 驗證必填欄位
    if (!name || !description || !url || !category || !pricing) {
      return NextResponse.json(
        { error: "請填寫所有必填欄位" },
        { status: 400 }
      )
    }

    // 檢查是否已提交過相同 URL
    const existingSubmission = await prisma.toolSubmission.findFirst({
      where: {
        url: url,
        status: { in: ["PENDING", "APPROVED"] },
      },
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: "此工具已被提交過" },
        { status: 400 }
      )
    }

    // 建立提交
    const submission = await prisma.toolSubmission.create({
      data: {
        userId: session.user.id,
        name,
        description,
        url,
        logo: logo || null,
        category,
        pricing,
        features: features ? JSON.stringify(features) : null,
        tags: tags ? JSON.stringify(tags) : null,
        submitterNote: submitterNote || null,
      },
    })

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        name: submission.name,
        status: submission.status,
        createdAt: submission.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("提交工具失敗:", error)
    // 回傳更詳細的錯誤
    const message = error instanceof Error ? error.message : "未知錯誤"
    return NextResponse.json({ error: "提交工具失敗", detail: message }, { status: 500 })
  }
}
