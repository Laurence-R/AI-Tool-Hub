import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "請輸入 Email" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    // But only create token if user exists
    if (user) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({
        where: { email: email.toLowerCase() },
      })

      // Create new token (valid for 1 hour)
      const token = randomBytes(32).toString("hex")
      const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await prisma.passwordResetToken.create({
        data: {
          email: email.toLowerCase(),
          token,
          expires,
        },
      })

      // In production, send email here
      // For development, log the reset link
      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`
      
      console.log("=== Password Reset Link (Development) ===")
      console.log(`Email: ${email}`)
      console.log(`Reset URL: ${resetUrl}`)
      console.log("==========================================")

      // TODO: Integrate with email service (e.g., SendGrid, Resend, etc.)
      // await sendPasswordResetEmail(email, resetUrl)
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      message: "如果該 Email 存在，您將會收到密碼重設連結",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "發生錯誤，請稍後再試" },
      { status: 500 }
    )
  }
}
