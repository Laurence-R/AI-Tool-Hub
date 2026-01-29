import { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "./ForgotPasswordForm"

export const metadata: Metadata = {
  title: "忘記密碼",
  description: "重設您的 AI Tool Hub 帳戶密碼",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">忘記密碼？</h1>
          <p className="mt-2 text-muted-foreground">
            輸入您的 Email，我們會發送密碼重設連結給您
          </p>
        </div>

        {/* Form */}
        <ForgotPasswordForm />

        {/* Back to login */}
        <p className="text-center text-sm text-muted-foreground">
          記起密碼了？{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            返回登入
          </Link>
        </p>
      </div>
    </div>
  )
}
