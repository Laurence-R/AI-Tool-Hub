"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, Check, X } from "lucide-react"
import Link from "next/link"

// 密碼強度檢查
const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }
  
  const passed = Object.values(checks).filter(Boolean).length
  let strength: "weak" | "medium" | "strong" = "weak"
  
  if (passed >= 4) strength = "strong"
  else if (passed >= 3) strength = "medium"
  
  return { checks, strength, passed }
}

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const passwordStrength = checkPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation - 檢查所有密碼要求
    if (!passwordStrength.checks.length) {
      setError("密碼至少需要 8 個字元")
      return
    }
    if (!passwordStrength.checks.uppercase) {
      setError("密碼需要包含大寫字母")
      return
    }
    if (!passwordStrength.checks.lowercase) {
      setError("密碼需要包含小寫字母")
      return
    }
    if (!passwordStrength.checks.number) {
      setError("密碼需要包含數字")
      return
    }

    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "重設失敗")
      }

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login?message=password-reset")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "重設失敗，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold">密碼已重設</h2>
          <p className="text-muted-foreground">
            您的密碼已成功重設。即將跳轉至登入頁面...
          </p>
          <Link 
            href="/login"
            className="inline-block text-primary hover:underline"
          >
            立即登入
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password">新密碼</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="至少 8 個字元"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= passwordStrength.passed
                        ? passwordStrength.strength === "strong"
                          ? "bg-green-500"
                          : passwordStrength.strength === "medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? "text-green-500" : "text-muted-foreground"}`}>
                  {passwordStrength.checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  8 字元以上
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? "text-green-500" : "text-muted-foreground"}`}>
                  {passwordStrength.checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  大寫字母
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? "text-green-500" : "text-muted-foreground"}`}>
                  {passwordStrength.checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  小寫字母
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.number ? "text-green-500" : "text-muted-foreground"}`}>
                  {passwordStrength.checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                  數字
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認新密碼</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="再次輸入密碼"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              重設中...
            </>
          ) : (
            "重設密碼"
          )}
        </Button>
      </form>
    </Card>
  )
}
