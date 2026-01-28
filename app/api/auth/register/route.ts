import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { z } from "zod"

// 註冊驗證 schema
const registerSchema = z.object({
  name: z.string().min(2, "名稱至少需要 2 個字元").max(50, "名稱不能超過 50 個字元"),
  email: z.string().email("請輸入有效的 Email"),
  password: z
    .string()
    .min(8, "密碼至少需要 8 個字元")
    .regex(/[A-Z]/, "密碼需要包含至少一個大寫字母")
    .regex(/[a-z]/, "密碼需要包含至少一個小寫字母")
    .regex(/[0-9]/, "密碼需要包含至少一個數字"),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // 驗證輸入
    const validatedData = registerSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = validatedData.data

    // 檢查 Email 是否已被使用
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "此 Email 已被註冊" },
        { status: 400 }
      )
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(password, 12)

    // 建立使用者
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        message: "註冊成功",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("註冊錯誤:", error)
    return NextResponse.json(
      { error: "註冊時發生錯誤，請稍後再試" },
      { status: 500 }
    )
  }
}
