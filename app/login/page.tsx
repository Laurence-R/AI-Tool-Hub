import { Suspense } from "react"
import { Metadata } from "next"
import { LoginForm } from "./LoginForm"
import { generatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = generatePageMetadata({
  title: "登入",
  description: "登入 AI Tool Hub，探索、比較、管理最優質的 AI 工具。",
  path: "/login",
})

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(96,165,250,0.1),rgba(0,0,0,0))]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Login Form with Suspense for useSearchParams */}
      <Suspense
        fallback={
          <div className="w-full max-w-md h-[500px] bg-background/40 backdrop-blur-xl border border-border/50 rounded-lg animate-pulse" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
