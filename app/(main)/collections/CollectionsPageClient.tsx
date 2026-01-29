"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FolderOpen, Plus, Loader2, Users, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionCard, CreateCollectionDialog } from "@/components/collections"
import { useCollections } from "@/contexts"
import { Collection } from "@/types"

export function CollectionsPageClient() {
  const { data: session } = useSession()
  const { myCollections, isLoading: isLoadingMy, fetchMyCollections } = useCollections()
  
  const [publicCollections, setPublicCollections] = useState<Collection[]>([])
  const [isLoadingPublic, setIsLoadingPublic] = useState(true)
  const [activeTab, setActiveTab] = useState("public")

  // 載入公開合集
  useEffect(() => {
    const fetchPublic = async () => {
      setIsLoadingPublic(true)
      try {
        const response = await fetch("/api/collections?type=public&limit=50")
        if (response.ok) {
          const data = await response.json()
          setPublicCollections(data.collections)
        }
      } catch (error) {
        console.error("載入公開合集失敗:", error)
      } finally {
        setIsLoadingPublic(false)
      }
    }
    fetchPublic()
  }, [])

  // 當切換到我的合集時載入
  useEffect(() => {
    if (activeTab === "my" && session?.user?.id) {
      fetchMyCollections()
    }
  }, [activeTab, session?.user?.id, fetchMyCollections])

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 頁面標題 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-3xl text-foreground">
                工具合集
              </h1>
              <p className="text-foreground/60 mt-1">
                探索社群分享的精選工具組合
              </p>
            </div>
          </div>
          {session && (
            <CreateCollectionDialog
              trigger={
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  建立合集
                </Button>
              }
            />
          )}
        </div>

        {/* 分頁 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="public" className="gap-2">
              <Users className="w-4 h-4" />
              公開合集
            </TabsTrigger>
            <TabsTrigger value="my" className="gap-2" disabled={!session}>
              <Lock className="w-4 h-4" />
              我的合集
            </TabsTrigger>
          </TabsList>

          {/* 公開合集 */}
          <TabsContent value="public" className="space-y-6">
            {/* 精選區塊 (未來可加入) */}
            {/* <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="font-heading font-semibold text-xl">精選合集</h2>
              </div>
            </section> */}

            {/* 所有公開合集 */}
            <section className="space-y-4">
              <h2 className="font-heading font-semibold text-xl text-foreground">
                社群合集
              </h2>
              
              {isLoadingPublic ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : publicCollections.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-2xl">
                  <FolderOpen className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
                  <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                    還沒有公開合集
                  </h3>
                  <p className="text-foreground/60 mb-4">
                    成為第一個分享合集的人！
                  </p>
                  {session && (
                    <CreateCollectionDialog
                      trigger={
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          建立合集
                        </Button>
                      }
                    />
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {publicCollections.map((collection) => (
                    <CollectionCard key={collection.id} collection={collection} />
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          {/* 我的合集 */}
          <TabsContent value="my" className="space-y-6">
            {!session ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <Lock className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  請先登入
                </h3>
                <p className="text-foreground/60">
                  登入後即可建立和管理你的合集
                </p>
              </div>
            ) : isLoadingMy ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : myCollections.length === 0 ? (
              <div className="text-center py-12 glass-card rounded-2xl">
                <FolderOpen className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                  還沒有建立任何合集
                </h3>
                <p className="text-foreground/60 mb-4">
                  建立合集來整理你喜歡的 AI 工具
                </p>
                <CreateCollectionDialog
                  trigger={
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      建立第一個合集
                    </Button>
                  }
                />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myCollections.map((collection) => (
                  <CollectionCard 
                    key={collection.id} 
                    collection={collection} 
                    showUser={false}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
