import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

interface RouteParams {
  params: Promise<{ id: string }>
}

// PATCH: 審核提交（通過/拒絕）
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 })
    }

    // 檢查是否為管理員
    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "權限不足" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { action, reviewNote } = body // action: "approve" | "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "無效的操作" }, { status: 400 })
    }

    // 取得提交資料
    const submission = await prisma.toolSubmission.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "找不到此提交" }, { status: 404 })
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json({ error: "此提交已被處理" }, { status: 400 })
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED"

    // 使用交易來處理審核
    const result = await prisma.$transaction(async (tx) => {
      // 更新提交狀態
      const updatedSubmission = await tx.toolSubmission.update({
        where: { id },
        data: {
          status: newStatus,
          reviewNote: reviewNote || null,
          reviewedAt: new Date(),
          reviewedBy: session.user!.id,
        },
      })

      // 如果通過，建立新工具
      let newTool = null
      if (action === "approve") {
        // 取得目前最大的工具 ID（包括靜態工具）
        const maxStaticId = 20 // 靜態工具 ID 為 1-20
        const maxDbTool = await tx.tool.findFirst({
          orderBy: { id: "desc" },
          select: { id: true },
        })
        const nextId = Math.max(maxStaticId, maxDbTool?.id || 0) + 1

        // 生成 slug（將名稱轉換為 URL 友善的格式）
        const baseSlug = submission.name
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-') // 保留中文、字母、數字，其他替換為 -
          .replace(/^-|-$/g, '') // 移除首尾的 -
        
        // 確保 slug 唯一
        let slug = baseSlug || `tool-${nextId}`
        let slugSuffix = 1
        while (await tx.tool.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${slugSuffix}`
          slugSuffix++
        }

        newTool = await tx.tool.create({
          data: {
            id: nextId,
            slug,
            name: submission.name,
            description: submission.description,
            url: submission.url,
            logo: submission.logo,
            category: submission.category,
            pricing: submission.pricing,
            features: submission.features,
            tags: submission.tags,
            submissionId: submission.id,
          },
        })
      }

      // 建立通知
      await tx.notification.create({
        data: {
          userId: submission.userId,
          type: action === "approve" ? "submission_approved" : "submission_rejected",
          title: action === "approve" ? "🎉 工具提交已通過" : "工具提交未通過",
          message: action === "approve"
            ? `您提交的工具「${submission.name}」已通過審核並正式上架！`
            : `您提交的工具「${submission.name}」未通過審核。${reviewNote ? `原因：${reviewNote}` : ""}`,
          link: action === "approve" && newTool ? `/tools/${newTool.id}` : "/dashboard",
        },
      })

      return { updatedSubmission, newTool }
    })

    // 發送 Email 通知（非同步，不影響回應）
    if (submission.user.email) {
      const emailSubject = action === "approve"
        ? `🎉 您的工具「${submission.name}」已通過審核`
        : `您的工具「${submission.name}」審核結果通知`
      
      const emailContent = action === "approve"
        ? `
          <h2>恭喜！您的工具已通過審核</h2>
          <p>您提交的工具「<strong>${submission.name}</strong>」已通過審核並正式上架到 AI Tool Hub！</p>
          <p>感謝您對平台的貢獻。</p>
          <p><a href="${process.env.NEXTAUTH_URL}/tools/${result.newTool?.id}">查看工具頁面</a></p>
        `
        : `
          <h2>審核結果通知</h2>
          <p>很抱歉，您提交的工具「<strong>${submission.name}</strong>」未通過審核。</p>
          ${reviewNote ? `<p><strong>原因：</strong>${reviewNote}</p>` : ""}
          <p>您可以根據反饋修改後重新提交。</p>
          <p><a href="${process.env.NEXTAUTH_URL}/submit">重新提交</a></p>
        `

      sendEmail({
        to: submission.user.email,
        subject: emailSubject,
        html: emailContent,
      }).catch(err => console.error("發送 Email 失敗:", err))
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      toolId: result.newTool?.id,
    })
  } catch (error) {
    console.error("審核提交失敗:", error)
    return NextResponse.json({ error: "審核提交失敗" }, { status: 500 })
  }
}

// GET: 取得單一提交詳情
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { id } = await params

    const submission = await prisma.toolSubmission.findUnique({
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
      },
    })

    if (!submission) {
      return NextResponse.json({ error: "找不到此提交" }, { status: 404 })
    }

    return NextResponse.json({
      submission: {
        ...submission,
        features: submission.features ? JSON.parse(submission.features) : [],
        tags: submission.tags ? JSON.parse(submission.tags) : [],
        createdAt: submission.createdAt.toISOString(),
        reviewedAt: submission.reviewedAt?.toISOString(),
      },
    })
  } catch (error) {
    console.error("取得提交詳情失敗:", error)
    return NextResponse.json({ error: "取得提交詳情失敗" }, { status: 500 })
  }
}
