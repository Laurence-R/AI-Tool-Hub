"use client"

import { useState, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFavorites } from "@/contexts"
import { getToolById } from "@/lib/tools"
import type { Tool } from "@/types"
import { 
  User, 
  Heart, 
  Star, 
  Settings, 
  LogOut, 
  BookMarked,
  ChevronRight,
  Shield,
  Bell,
  Palette,
  ExternalLink,
  Trash2,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Check,
  Sun,
  Moon,
  Monitor,
  Mail,
  MessageSquare,
  Megaphone,
  AlertTriangle
} from "lucide-react"

interface DashboardContentProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

type TabType = "profile" | "favorites" | "reviews" | "settings"

export function DashboardContent({ user }: DashboardContentProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const { favoritesCount } = useFavorites()

  // 使用 session 中的最新資料，若無則使用 props 傳入的資料
  const currentUser = {
    ...user,
    name: session?.user?.name ?? user.name,
    image: session?.user?.image ?? user.image,
  }

  const menuItems = [
    { id: "profile" as TabType, label: "個人資料", icon: User, badge: null },
    { id: "favorites" as TabType, label: "我的收藏", icon: Heart, badge: favoritesCount },
    { id: "reviews" as TabType, label: "我的評論", icon: Star, badge: null },
    { id: "settings" as TabType, label: "帳號設定", icon: Settings, badge: null },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-primary/5 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">
            個人中心
          </h1>
          <p className="text-foreground/60">
            管理您的帳號、收藏和設定
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Card */}
            <Card className="p-6 bg-background/40 backdrop-blur-xl border-border/50 mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden">
                  {currentUser.image ? (
                    <img
                      src={currentUser.image}
                      alt={currentUser.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary" />
                  )}
                </div>
                <h2 className="font-semibold text-lg">{currentUser.name || "使用者"}</h2>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </Card>

            {/* Navigation */}
            <Card className="p-2 bg-background/40 backdrop-blur-xl border-border/50">
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-foreground/5 text-foreground/70"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 transition-transform ${
                        activeTab === item.id ? "rotate-90" : ""
                      }`} />
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="p-6 bg-background/40 backdrop-blur-xl border-border/50 min-h-[500px]">
              {activeTab === "profile" && <ProfileTab user={currentUser} favoritesCount={favoritesCount} />}
              {activeTab === "favorites" && <FavoritesTab />}
              {activeTab === "reviews" && <ReviewsTab />}
              {activeTab === "settings" && <SettingsTab user={currentUser} />}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

// Profile Tab - 可編輯個人資料
function ProfileTab({ user, favoritesCount }: { user: DashboardContentProps["user"], favoritesCount: number }) {
  const { update } = useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user.name || "")
  const [displayName, setDisplayName] = useState(user.name || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (res.ok) {
        // 更新 session 讓 Navigation 也能即時反映變更
        await update({ name })
        setDisplayName(name)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("儲存失敗:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">個人資料</h2>
        {!isEditing ? (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            編輯資料
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setIsEditing(false); setName(user.name || "") }}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              儲存
            </Button>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-sm text-green-600">
          <Check className="w-4 h-4" />
          資料已成功更新
        </div>
      )}
      
      <div className="space-y-6">
        {/* Editable Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-muted-foreground">名稱</Label>
            {isEditing ? (
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="輸入您的名稱"
              />
            ) : (
              <p className="text-lg font-medium py-2">{displayName || "未設定"}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Email</Label>
            <p className="text-lg font-medium py-2">{user.email}</p>
            <p className="text-xs text-muted-foreground">Email 無法變更</p>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-border/50 pt-6">
          <h3 className="text-lg font-semibold mb-4">活動統計</h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-primary/5 border-primary/10 text-center">
              <Heart className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{favoritesCount}</p>
              <p className="text-xs text-muted-foreground">收藏工具</p>
            </Card>
            <Card className="p-4 bg-primary/5 border-primary/10 text-center">
              <Star className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">撰寫評論</p>
            </Card>
            <Card className="p-4 bg-primary/5 border-primary/10 text-center">
              <BookMarked className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">收藏集</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Favorites Tab
function FavoritesTab() {
  const { favorites, removeFromFavorites, isLoading } = useFavorites()
  const [tools, setTools] = useState<Tool[]>([])

  useEffect(() => {
    const favTools = favorites
      .map(id => getToolById(Number(id)))
      .filter((t): t is Tool => t !== undefined)
    setTools(favTools)
  }, [favorites])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">我的收藏</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/favorites">查看全部</Link>
        </Button>
      </div>
      
      {tools.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">尚無收藏</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            探索各種 AI 工具，將喜歡的工具加入收藏
          </p>
          <Button asChild>
            <Link href="/tools">探索工具</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tools.map((tool) => (
            <div 
              key={tool.id} 
              className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-foreground/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={tool.logo} alt={tool.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/tools/${tool.id}`} className="font-semibold hover:text-primary transition-colors">
                  {tool.name}
                </Link>
                <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{tool.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {tool.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeFromFavorites(String(tool.id))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Reviews Tab
function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/reviews/user")
      const data = await res.json()
      if (res.ok) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error("載入評論失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const handleDelete = async (reviewId: string) => {
    if (!confirm("確定要刪除這則評論嗎？")) return
    
    setDeletingId(reviewId)
    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId))
      }
    } catch (error) {
      console.error("刪除評論失敗:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">載入評論中...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">我的評論</h2>
        <span className="text-sm text-muted-foreground">
          共 {reviews.length} 則評論
        </span>
      </div>
      
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">尚無評論</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            分享您使用 AI 工具的經驗，幫助其他使用者做出更好的選擇
          </p>
          <Button asChild>
            <Link href="/tools">開始評論</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              {/* 工具資訊和操作 */}
              <div className="flex items-start justify-between mb-4">
                <Link 
                  href={`/tools/${review.tool.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center overflow-hidden">
                    {review.tool.logo ? (
                      <img 
                        src={review.tool.logo} 
                        alt={review.tool.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-lg text-primary">
                        {review.tool.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {review.tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {review.tool.category}
                    </p>
                  </div>
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {renderStars(review.rating)}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {deletingId === review.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 評論內容 */}
              {review.title && (
                <h4 className="font-semibold mb-2">{review.title}</h4>
              )}
              <p className="text-foreground/70 mb-4">{review.content}</p>

              {/* 優缺點 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {review.pros && review.pros.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">優點</p>
                    <ul className="space-y-1">
                      {review.pros.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons && review.cons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">缺點</p>
                    <ul className="space-y-1">
                      {review.cons.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="w-4 h-4 flex items-center justify-center text-red-500 flex-shrink-0">−</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 按讚數 */}
              {review.likesCount > 0 && (
                <div className="mt-4 pt-4 border-t border-foreground/10">
                  <span className="text-sm text-muted-foreground">
                    ❤️ {review.likesCount} 人覺得有幫助
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// Settings Tab - 完整設定頁面
function SettingsTab({ user }: { user: DashboardContentProps["user"] }) {
  const [activeSection, setActiveSection] = useState<"security" | "notifications" | "appearance" | "danger" | null>(null)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">帳號設定</h2>
      
      <div className="space-y-4">
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

// Security Settings
function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "新密碼與確認密碼不符" })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "密碼至少需要 8 個字元" })
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
            placeholder="輸入新密碼（至少 8 個字元）"
          />
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
