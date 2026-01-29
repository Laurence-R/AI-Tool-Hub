"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Heart, 
  Star, 
  BookMarked,
  Loader2,
  Save,
  Check,
} from "lucide-react"

interface ProfileTabProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  favoritesCount: number
  collectionsCount: number
}

export function ProfileTab({ user, favoritesCount, collectionsCount }: ProfileTabProps) {
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
              <p className="text-2xl font-bold">{collectionsCount}</p>
              <p className="text-xs text-muted-foreground">我的合集</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
