import { Metadata } from "next"
import Link from "next/link"
import { ResetPasswordForm } from "./ResetPasswordForm"

export const metadata: Metadata = {
  title: "重設密碼",
  description: "設定您的新密碼",
}

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">無效的連結</h1>
          <p className="text-muted-foreground">
            此密碼重設連結無效或已過期。請重新申請密碼重設。
          </p>
          <Link 
            href="/forgot-password"
            className="inline-block mt-4 text-primary hover:underline"
          >
            返回忘記密碼頁面
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">重設密碼</h1>
          <p className="mt-2 text-muted-foreground">
            請設定您的新密碼
          </p>
        </div>

        {/* Form */}
        <ResetPasswordForm token={token} />

        {/* Back to login */}
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline font-medium">
            返回登入
          </Link>
        </p>
      </div>
    </div>
  )
}
