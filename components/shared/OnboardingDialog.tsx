"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  JOB_ROLES,
  USAGE_PURPOSES,
  TECH_LEVELS,
  INTEREST_CATEGORIES,
} from "@/constants/user-profile"
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Code,
  Palette,
  Megaphone,
  ClipboardList,
  PenTool,
  GraduationCap,
  Microscope,
  Rocket,
  User,
  FileText,
  Image,
  Video,
  Music,
  Zap,
  Search,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Paintbrush,
  Settings,
} from "lucide-react"

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  Code: <Code className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Megaphone: <Megaphone className="w-5 h-5" />,
  ClipboardList: <ClipboardList className="w-5 h-5" />,
  PenTool: <PenTool className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Microscope: <Microscope className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
  User: <User className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Search: <Search className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Paintbrush: <Paintbrush className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
}

interface OnboardingData {
  jobRole: string
  usagePurpose: string
  techLevel: string
  interests: string[]
}

const TOTAL_STEPS = 4

export function OnboardingDialog() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [data, setData] = useState<OnboardingData>({
    jobRole: "",
    usagePurpose: "",
    techLevel: "",
    interests: [],
  })

  // 檢查用戶是否需要完成 onboarding
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (status === "loading") return
      if (status === "unauthenticated") {
        setCheckingStatus(false)
        return
      }

      try {
        const res = await fetch("/api/user/profile")
        if (res.ok) {
          const { profile } = await res.json()
          if (!profile.onboardingCompleted) {
            setOpen(true)
          }
        }
      } catch (error) {
        console.error("檢查 onboarding 狀態失敗:", error)
      } finally {
        setCheckingStatus(false)
      }
    }

    checkOnboardingStatus()
  }, [status])

  const progress = (step / TOTAL_STEPS) * 100

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSelect = (field: keyof OnboardingData, value: string) => {
    if (field === "interests") {
      const current = data.interests
      if (current.includes(value)) {
        setData({ ...data, interests: current.filter((i) => i !== value) })
      } else if (current.length < 5) {
        setData({ ...data, interests: [...current, value] })
      }
    } else {
      setData({ ...data, [field]: value })
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          onboardingCompleted: true,
        }),
      })

      if (res.ok) {
        setOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("儲存 onboarding 資料失敗:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    setLoading(true)
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingCompleted: true }),
      })
      setOpen(false)
    } catch (error) {
      console.error("跳過 onboarding 失敗:", error)
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!data.jobRole
      case 2:
        return !!data.usagePurpose
      case 3:
        return !!data.techLevel
      case 4:
        return data.interests.length > 0
      default:
        return false
    }
  }

  if (checkingStatus || status === "loading") {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden" showCloseButton={false}>
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-orange-500/10 p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-orange-500">
                歡迎加入 AI Tool Hub
              </span>
            </div>
            <DialogTitle className="text-2xl">
              {step === 1 && "你的職業角色是？"}
              {step === 2 && "你使用 AI 工具的目的？"}
              {step === 3 && "你的技術程度如何？"}
              {step === 4 && "你對哪些類別感興趣？"}
            </DialogTitle>
            <DialogDescription>
              {step === 1 && "讓我們更了解你，以便推薦最適合的工具"}
              {step === 2 && "這將幫助我們優化你的個人化體驗"}
              {step === 3 && "我們會根據你的程度推薦適合的工具"}
              {step === 4 && "選擇 1-5 個你最感興趣的類別"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>步驟 {step} / {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% 完成</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-6 pt-4 min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Job Role */}
              {step === 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {JOB_ROLES.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => handleSelect("jobRole", role.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:border-primary/50",
                        data.jobRole === role.value
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          data.jobRole === role.value
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {iconMap[role.icon]}
                      </div>
                      <span className="text-sm font-medium text-center">
                        {role.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Usage Purpose */}
              {step === 2 && (
                <div className="space-y-3">
                  {USAGE_PURPOSES.map((purpose) => (
                    <button
                      key={purpose.value}
                      onClick={() => handleSelect("usagePurpose", purpose.value)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:border-primary/50 text-left",
                        data.usagePurpose === purpose.value
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          data.usagePurpose === purpose.value
                            ? "bg-primary text-white"
                            : "bg-muted"
                        )}
                      >
                        {data.usagePurpose === purpose.value ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{purpose.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {purpose.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Tech Level */}
              {step === 3 && (
                <div className="space-y-3">
                  {TECH_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleSelect("techLevel", level.value)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all hover:border-primary/50 text-left",
                        data.techLevel === level.value
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                          data.techLevel === level.value
                            ? "bg-primary text-white"
                            : "bg-muted"
                        )}
                      >
                        {data.techLevel === level.value ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border-2 border-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {level.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Interests */}
              {step === 4 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-4">
                    已選擇 {data.interests.length} / 5 個類別
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {INTEREST_CATEGORIES.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => handleSelect("interests", category.value)}
                        disabled={
                          data.interests.length >= 5 &&
                          !data.interests.includes(category.value)
                        }
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          data.interests.includes(category.value)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          data.interests.length >= 5 &&
                            !data.interests.includes(category.value) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            data.interests.includes(category.value)
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {iconMap[category.icon]}
                        </div>
                        <span className="text-sm font-medium text-center">
                          {category.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={loading}
            className="text-muted-foreground"
          >
            稍後再說
          </Button>

          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
            )}

            {step < TOTAL_STEPS ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!canProceed() || loading}
                className="bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
              >
                {loading ? "儲存中..." : "完成設定"}
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
