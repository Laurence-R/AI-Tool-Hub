"use client"

import { useState, useEffect } from "react"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Shield,
  Bell,
  Palette,
  Trash2,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Check,
  X,
  Sun,
  Moon,
  Monitor,
  Mail,
  MessageSquare,
  Megaphone,
  AlertTriangle,
  LogOut,
  ChevronRight,
  UserCircle,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  JOB_ROLES,
  USAGE_PURPOSES,
  INDUSTRIES,
  COMPANY_SIZES,
  TECH_LEVELS,
  BUDGET_PREFERENCES,
  INTEREST_CATEGORIES,
} from "@/constants/user-profile"

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

interface SettingsTabProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function SettingsTab({ user }: SettingsTabProps) {
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "notifications" | "appearance" | "danger" | null>(null)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">帳號設定</h2>
      
      <div className="space-y-4">
        {/* Profile Section */}
        <SettingsSection
          icon={UserCircle}
          title="個人資料"
          description="管理您的個人偏好和推薦設定"
          isOpen={activeSection === "profile"}
          onToggle={() => setActiveSection(activeSection === "profile" ? null : "profile")}
        >
          <ProfileSettings />
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          icon={Shield}
          title="安全性設定"
          description="管理您的密碼和登入方式"
          isOpen={activeSection === "security"}
          onToggle={() => setActiveSection(activeSection === "security" ? null : "security")}
        >
          <SecuritySettings />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          icon={Bell}
          title="通知設定"
          description="管理 Email 通知和推播通知"
          isOpen={activeSection === "notifications"}
          onToggle={() => setActiveSection(activeSection === "notifications" ? null : "notifications")}
        >
          <NotificationSettings />
        </SettingsSection>

        {/* Appearance Section */}
        <SettingsSection
          icon={Palette}
          title="外觀設定"
          description="自訂主題和顯示偏好"
          isOpen={activeSection === "appearance"}
          onToggle={() => setActiveSection(activeSection === "appearance" ? null : "appearance")}
        >
          <AppearanceSettings />
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection
          icon={AlertTriangle}
          title="危險區域"
          description="登出或刪除帳號"
          isOpen={activeSection === "danger"}
          onToggle={() => setActiveSection(activeSection === "danger" ? null : "danger")}
          variant="danger"
        >
          <DangerZone />
        </SettingsSection>
      </div>
    </div>
  )
}

// Settings Section Component
function SettingsSection({ 
  icon: Icon, 
  title, 
  description, 
  isOpen, 
  onToggle, 
  children,
  variant = "default"
}: {
  icon: React.ElementType
  title: string
  description: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  variant?: "default" | "danger"
}) {
  return (
    <div className={`border rounded-lg transition-colors ${
      variant === "danger" 
        ? "border-destructive/30 bg-destructive/5" 
        : "border-border/50"
    }`}>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-4 text-left"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          variant === "danger" ? "bg-destructive/10" : "bg-primary/10"
        }`}>
          <Icon className={`w-5 h-5 ${variant === "danger" ? "text-destructive" : "text-primary"}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${variant === "danger" ? "text-destructive" : ""}`}>{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50">
          {children}
        </div>
      )}
    </div>
  )
}

// Profile Settings
function ProfileSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [profile, setProfile] = useState({
    jobRole: "",
    usagePurpose: "",
    industry: "",
    companySize: "",
    techLevel: "",
    budgetPreference: "",
    interests: [] as string[],
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile({
            jobRole: data.profile.jobRole || "",
            usagePurpose: data.profile.usagePurpose || "",
            industry: data.profile.industry || "",
            companySize: data.profile.companySize || "",
            techLevel: data.profile.techLevel || "",
            budgetPreference: data.profile.budgetPreference || "",
            interests: data.profile.interests || [],
          })
        }
      } catch (error) {
        console.error("獲取個人資料失敗:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (res.ok) {
        setMessage({ type: "success", text: "個人資料已更新" })
      } else {
        setMessage({ type: "error", text: "更新失敗，請稍後再試" })
      }
    } catch {
      setMessage({ type: "error", text: "網路錯誤" })
    } finally {
      setSaving(false)
    }
  }

  const handleInterestToggle = (value: string) => {
    if (profile.interests.includes(value)) {
      setProfile({ ...profile, interests: profile.interests.filter(i => i !== value) })
    } else if (profile.interests.length < 5) {
      setProfile({ ...profile, interests: [...profile.interests, value] })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-3 rounded-lg flex items-center gap-2 ${
          message.type === "success" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
        }`}>
          {message.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Job Role */}
        <div className="space-y-2">
          <Label>職業角色</Label>
          <Select value={profile.jobRole} onValueChange={(v) => setProfile({ ...profile, jobRole: v })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇職業角色" />
            </SelectTrigger>
            <SelectContent>
              {JOB_ROLES.map(role => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Usage Purpose */}
        <div className="space-y-2">
          <Label>使用目的</Label>
          <Select value={profile.usagePurpose} onValueChange={(v) => setProfile({ ...profile, usagePurpose: v })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇使用目的" />
            </SelectTrigger>
            <SelectContent>
              {USAGE_PURPOSES.map(purpose => (
                <SelectItem key={purpose.value} value={purpose.value}>{purpose.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry */}
        <div className="space-y-2">
          <Label>行業領域</Label>
          <Select value={profile.industry} onValueChange={(v) => setProfile({ ...profile, industry: v })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇行業領域" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map(industry => (
                <SelectItem key={industry.value} value={industry.value}>{industry.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <Label>公司規模</Label>
          <Select value={profile.companySize} onValueChange={(v) => setProfile({ ...profile, companySize: v })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇公司規模" />
            </SelectTrigger>
            <SelectContent>
              {COMPANY_SIZES.map(size => (
                <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tech Level */}
        <div className="space-y-2">
          <Label>技術程度</Label>
          <Select value={profile.techLevel} onValueChange={(v) => setProfile({ ...profile, techLevel: v })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇技術程度" />
            </SelectTrigger>
            <SelectContent>
              {TECH_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Preference */}
        <div className="space-y-2">
          <Label>預算偏好</Label>
          <Select value={profile.budgetPreference} onValueChange={(v) => setProfile({ ...profile, budgetPreference: v })}>
            <SelectTrigger>
              <SelectValue placeholder="選擇預算偏好" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_PREFERENCES.map(budget => (
                <SelectItem key={budget.value} value={budget.value}>{budget.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <Label>感興趣類別 (最多 5 個)</Label>
        <p className="text-xs text-muted-foreground mb-2">已選擇 {profile.interests.length} / 5</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_CATEGORIES.map(category => (
            <button
              key={category.value}
              type="button"
              onClick={() => handleInterestToggle(category.value)}
              disabled={profile.interests.length >= 5 && !profile.interests.includes(category.value)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                profile.interests.includes(category.value)
                  ? "bg-primary text-white border-primary"
                  : "border-border hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          儲存變更
        </Button>
      </div>
    </div>
  )
}

// Security Settings
function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const passwordStrength = checkPasswordStrength(newPassword)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "新密碼與確認密碼不符" })
      return
    }
    // 檢查所有密碼要求
    if (!passwordStrength.checks.length) {
      setMessage({ type: "error", text: "密碼至少需要 8 個字元" })
      return
    }
    if (!passwordStrength.checks.uppercase) {
      setMessage({ type: "error", text: "密碼需要包含大寫字母" })
      return
    }
    if (!passwordStrength.checks.lowercase) {
      setMessage({ type: "error", text: "密碼需要包含小寫字母" })
      return
    }
    if (!passwordStrength.checks.number) {
      setMessage({ type: "error", text: "密碼需要包含數字" })
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      
      if (res.ok) {
        setMessage({ type: "success", text: "密碼已成功更新" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage({ type: "error", text: data.error || "密碼更新失敗" })
      }
    } catch {
      setMessage({ type: "error", text: "發生錯誤，請稀後再試" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">修改密碼</h4>
      
      {message && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-green-500/10 border border-green-500/20 text-green-600"
            : "bg-destructive/10 border border-destructive/20 text-destructive"
        }`}>
          {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">目前密碼</Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="輸入目前密碼"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">新密碼</Label>
          <Input
            id="newPassword"
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="輸入新密碼"
          />
          
          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-2 mt-2">
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
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">確認新密碼</Label>
          <Input
            id="confirmPassword"
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="再次輸入新密碼"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPasswords ? "隱藏密碼" : "顯示密碼"}
          </button>
        </div>
      </div>
      <Button onClick={handleChangePassword} disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}>
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        更新密碼
      </Button>
    </div>
  )
}

// Notification Settings
function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [toolUpdates, setToolUpdates] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <NotificationToggle
          icon={Mail}
          title="Email 通知"
          description="接收重要帳號通知"
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        <NotificationToggle
          icon={Megaphone}
          title="工具更新"
          description="收藏的工具有新功能時通知我"
          checked={toolUpdates}
          onChange={setToolUpdates}
        />
        <NotificationToggle
          icon={MessageSquare}
          title="每週精選"
          description="每週收到精選 AI 工具推薦"
          checked={weeklyDigest}
          onChange={setWeeklyDigest}
        />
      </div>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
        儲存設定
      </Button>
    </div>
  )
}

function NotificationToggle({
  icon: Icon,
  title,
  description,
  checked,
  onChange
}: {
  icon: React.ElementType
  title: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-foreground/5">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          checked ? "bg-primary" : "bg-foreground/20"
        }`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? "left-6" : "left-1"
        }`} />
      </button>
    </div>
  )
}

// Appearance Settings
function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const themes = [
    { id: "light", label: "淺色", icon: Sun },
    { id: "dark", label: "深色", icon: Moon },
    { id: "system", label: "跟隨系統", icon: Monitor },
  ]

  return (
    <div className="space-y-4">
      <h4 className="font-medium">主題設定</h4>
      <div className="grid grid-cols-3 gap-3">
        {themes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
              theme === id 
                ? "border-primary bg-primary/10" 
                : "border-border/50 hover:border-primary/50"
            }`}
          >
            <Icon className={`w-6 h-6 ${theme === id ? "text-primary" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${theme === id ? "text-primary" : ""}`}>{label}</span>
            {theme === id && <Check className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  )
}

// Danger Zone
function DangerZone() {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== "刪除我的帳號") return
    setIsDeleting(true)
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" })
      if (res.ok) {
        await signOut({ callbackUrl: "/" })
      }
    } catch (error) {
      console.error("刪除帳號失敗:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Logout */}
      <div className="p-4 rounded-lg bg-foreground/5">
        <h4 className="font-medium mb-2">登出帳號</h4>
        <p className="text-sm text-muted-foreground mb-3">
          登出後需要重新登入才能使用個人功能
        </p>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          登出
        </Button>
      </div>

      {/* Delete Account */}
      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
        <h4 className="font-medium text-destructive mb-2">刪除帳號</h4>
        <p className="text-sm text-muted-foreground mb-3">
          刪除帳號將會永久移除所有資料，包括收藏、評論等。此操作無法復原。
        </p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="confirmDelete" className="text-sm">
              請輸入「刪除我的帳號」確認
            </Label>
            <Input
              id="confirmDelete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="刪除我的帳號"
              className="mt-1"
            />
          </div>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={confirmText !== "刪除我的帳號" || isDeleting}
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
            永久刪除帳號
          </Button>
        </div>
      </div>
    </div>
  )
}
