"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { useFavorites } from "@/contexts"
import { useCollections } from "@/contexts"
import type { Collection } from "@/types"
import { 
  User, 
  Heart, 
  Star, 
  Settings, 
  ChevronRight,
  FolderOpen,
  Send,
} from "lucide-react"

// 匯入拆分後的 Tab 元件
import {
  ProfileTab,
  FavoritesTab,
  CollectionsTab,
  ReviewsTab,
  SubmissionsTab,
  SettingsTab,
} from "./tabs"

interface DashboardContentProps {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

type TabType = "profile" | "favorites" | "collections" | "reviews" | "submissions" | "settings"

export function DashboardContent({ user }: DashboardContentProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<TabType>("profile")
  const { favoritesCount } = useFavorites()
  const { myCollections, isLoading: isLoadingCollections, fetchMyCollections } = useCollections()

  // 使用 session 中的最新資料，若無則使用 props 傳入的資料
  const currentUser = {
    ...user,
    name: session?.user?.name ?? user.name,
    image: session?.user?.image ?? user.image,
  }

  // 當切換到合集標籤時載入合集
  useEffect(() => {
    if (activeTab === "collections" && session?.user?.id) {
      fetchMyCollections()
    }
  }, [activeTab, session?.user?.id, fetchMyCollections])

  const menuItems = [
    { id: "profile" as TabType, label: "個人資料", icon: User, badge: null },
    { id: "favorites" as TabType, label: "我的收藏", icon: Heart, badge: favoritesCount },
    { id: "collections" as TabType, label: "我的合集", icon: FolderOpen, badge: myCollections.length || null },
    { id: "reviews" as TabType, label: "我的評論", icon: Star, badge: null },
    { id: "submissions" as TabType, label: "我的提交", icon: Send, badge: null },
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
              {activeTab === "profile" && <ProfileTab user={currentUser} favoritesCount={favoritesCount} collectionsCount={myCollections.length} />}
              {activeTab === "favorites" && <FavoritesTab />}
              {activeTab === "collections" && <CollectionsTab collections={myCollections} isLoading={isLoadingCollections} />}
              {activeTab === "reviews" && <ReviewsTab />}
              {activeTab === "submissions" && <SubmissionsTab />}
              {activeTab === "settings" && <SettingsTab user={currentUser} />}
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
