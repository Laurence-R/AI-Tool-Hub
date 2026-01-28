"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const error = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // 驗證函數
  const validateEmail = (value: string) => {
    if (!value) return "請輸入 Email"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return "請輸入有效的 Email 格式"
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return "請輸入密碼"
    if (value.length < 8) return "密碼至少需要 8 個字元"
    return ""
  }

  // 處理 Email/密碼登入
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError })
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setFormError(result.error)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setFormError("登入時發生錯誤，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  // 處理 OAuth 登入
  const handleOAuthSignIn = async (provider: string) => {
    setIsOAuthLoading(provider)
    try {
      await signIn(provider, { callbackUrl })
    } catch (err) {
      setFormError("OAuth 登入失敗，請稍後再試")
      setIsOAuthLoading(null)
    }
  }

  // 錯誤訊息對應
  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "CredentialsSignin":
        return "Email 或密碼錯誤"
      case "OAuthAccountNotLinked":
        return "此 Email 已使用其他方式註冊"
      case "OAuthSignin":
      case "OAuthCallback":
        return "OAuth 登入失敗，請稍後再試"
      default:
        return error
    }
  }

  const displayError = formError || getErrorMessage(error)

  return (
    <Card className="relative w-full max-w-md bg-background/40 backdrop-blur-xl border-border/50 shadow-2xl">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            歡迎回來
          </h1>
          <p className="text-muted-foreground text-sm">
            登入以繼續使用 AI Tool Hub
          </p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground/90">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                }}
                onBlur={() => {
                  const error = validateEmail(email)
                  setErrors((prev) => ({ ...prev, email: error }))
                }}
                className={`pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors ${
                  errors.email ? "border-destructive" : ""
                }`}
                autoComplete="email"
                disabled={isLoading || !!isOAuthLoading}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-foreground/90">
                密碼
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                忘記密碼？
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="輸入密碼"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }))
                }}
                onBlur={() => {
                  const error = validatePassword(password)
                  setErrors((prev) => ({ ...prev, password: error }))
                }}
                className={`pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors ${
                  errors.password ? "border-destructive" : ""
                }`}
                autoComplete="current-password"
                disabled={isLoading || !!isOAuthLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-200"
            disabled={isLoading || !!isOAuthLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                登入中...
              </div>
            ) : (
              "登入"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background/40 backdrop-blur-sm px-2 text-muted-foreground">
              或使用以下方式登入
            </span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthSignIn("google")}
            className="bg-background/30 backdrop-blur-sm border-border/50 hover:bg-background/50 transition-all duration-200"
            disabled={isLoading || !!isOAuthLoading}
          >
            {isOAuthLoading === "google" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOAuthSignIn("github")}
            className="bg-background/30 backdrop-blur-sm border-border/50 hover:bg-background/50 transition-all duration-200"
            disabled={isLoading || !!isOAuthLoading}
          >
            {isOAuthLoading === "github" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            )}
            GitHub
          </Button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          還沒有帳號？{" "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            立即註冊
          </Link>
        </p>
      </div>
    </Card>
  )
}
