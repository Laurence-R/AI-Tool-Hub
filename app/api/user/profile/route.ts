import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET: 獲取用戶個人資料
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        jobRole: true,
        usagePurpose: true,
        industry: true,
        companySize: true,
        techLevel: true,
        budgetPreference: true,
        interests: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "用戶不存在" }, { status: 404 })
    }

    // Parse interests from JSON string to array
    const profile = {
      ...user,
      interests: user.interests ? JSON.parse(user.interests) : [],
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("獲取個人資料失敗:", error)
    return NextResponse.json({ error: "獲取失敗" }, { status: 500 })
  }
}

// PATCH: 更新用戶個人資料
export async function PATCH(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授權" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      bio,
      jobRole,
      usagePurpose,
      industry,
      companySize,
      techLevel,
      budgetPreference,
      interests,
      onboardingCompleted,
    } = body

    // 建立更新資料物件（只包含有提供的欄位）
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {}

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "名稱不能為空" }, { status: 400 })
      }
      updateData.name = name.trim()
    }

    if (bio !== undefined) {
      updateData.bio = typeof bio === "string" ? bio.trim() : null
    }

    if (jobRole !== undefined) {
      updateData.jobRole = jobRole || null
    }

    if (usagePurpose !== undefined) {
      updateData.usagePurpose = usagePurpose || null
    }

    if (industry !== undefined) {
      updateData.industry = industry || null
    }

    if (companySize !== undefined) {
      updateData.companySize = companySize || null
    }

    if (techLevel !== undefined) {
      updateData.techLevel = techLevel || null
    }

    if (budgetPreference !== undefined) {
      updateData.budgetPreference = budgetPreference || null
    }

    if (interests !== undefined) {
      // Store interests as JSON string
      updateData.interests = Array.isArray(interests) 
        ? JSON.stringify(interests) 
        : null
    }

    if (onboardingCompleted !== undefined) {
      updateData.onboardingCompleted = Boolean(onboardingCompleted)
    }

    // 如果沒有要更新的欄位
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "沒有提供要更新的資料" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        jobRole: true,
        usagePurpose: true,
        industry: true,
        companySize: true,
        techLevel: true,
        budgetPreference: true,
        interests: true,
        onboardingCompleted: true,
      },
    })

    // Parse interests back to array for response
    const profile = {
      ...updatedUser,
      interests: updatedUser.interests ? JSON.parse(updatedUser.interests) : [],
    }

    return NextResponse.json({ 
      success: true, 
      profile,
    })
  } catch (error) {
    console.error("更新個人資料失敗:", error)
    return NextResponse.json({ error: "更新失敗" }, { status: 500 })
  }
}
