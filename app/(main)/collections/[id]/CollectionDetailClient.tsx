"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  FolderOpen, 
  Globe, 
  Lock, 
  Edit2, 
  Trash2, 
  Share2, 
  Loader2,
  User,
  Clock,
  MoreVertical,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ToolCard } from "@/components/tools"
import { EditCollectionDialog } from "./EditCollectionDialog"
import { CollectionWithItems } from "@/types"
import { Tool } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"
import { toast } from "sonner"
import { useCollections } from "@/contexts"

interface CollectionDetailClientProps {
  collectionId: string
}

export function CollectionDetailClient({ collectionId }: CollectionDetailClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { deleteCollection, removeToolFromCollection } = useCollections()
  
  const [collection, setCollection] = useState<CollectionWithItems | null>(null)
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [removingToolId, setRemovingToolId] = useState<number | null>(null)

  // 載入合集詳情
  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/collections/${collectionId}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "載入失敗")
          return
        }

        setCollection(data.collection)

        // 載入合集內的工具詳情
        if (data.collection.items.length > 0) {
          const toolIds = data.collection.items.map((item: { toolId: number }) => item.toolId)
          const toolsResponse = await fetch(`/api/tools?ids=${toolIds.join(",")}`)
          if (toolsResponse.ok) {
            const toolsData = await toolsResponse.json()
            setTools(toolsData.tools || [])
          }
        }
      } catch (err) {
        console.error("載入合集失敗:", err)
        setError("載入合集失敗")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollection()
  }, [collectionId])

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteCollection(collectionId)
    setIsDeleting(false)
    
    if (success) {
      router.push("/collections")
    }
  }

  const handleRemoveTool = async (toolId: number) => {
    setRemovingToolId(toolId)
    const success = await removeToolFromCollection(collectionId, toolId)
    
    if (success) {
      setTools((prev) => prev.filter((t) => t.id !== toolId))
      setCollection((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          items: prev.items.filter((i) => i.toolId !== toolId),
          itemCount: prev.itemCount - 1,
          toolIds: prev.toolIds.filter((id) => id !== toolId),
        }
      })
    }
    setRemovingToolId(null)
  }

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast.success("連結已複製到剪貼簿")
    } catch {
      toast.error("複製失敗")
    }
  }

  const handleUpdateCollection = (updated: CollectionWithItems) => {
    setCollection(updated)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
            <h1 className="font-heading font-bold text-2xl text-foreground mb-2">
              {error || "合集不存在"}
            </h1>
            <p className="text-foreground/60 mb-4">
              這個合集可能已被刪除或設為私人
            </p>
            <Button asChild>
              <Link href="/collections">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回合集列表
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = collection.isOwner

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回連結 */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/collections" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回合集列表
            </Link>
          </Button>
        </div>

        {/* 合集標題區 */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-7 h-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    {collection.name}
                  </h1>
                  <Badge variant="secondary" className="text-xs">
                    {collection.isPublic ? (
                      <><Globe className="w-3 h-3 mr-1" /> 公開</>
                    ) : (
                      <><Lock className="w-3 h-3 mr-1" /> 私人</>
                    )}
                  </Badge>
                </div>
                {collection.description && (
                  <p className="text-foreground/60 mb-3">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-foreground/50">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={collection.user.image || undefined} />
                      <AvatarFallback>
                        <User className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span>{collection.user.name || "使用者"}</span>
                  </div>
                  <span>•</span>
                  <span>{collection.itemCount} 個工具</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(collection.updatedAt), {
                      addSuffix: true,
                      locale: zhTW,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center gap-2">
              {collection.isPublic && (
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              )}
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      編輯合集
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-red-500 focus:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      刪除合集
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* 工具列表 */}
        {tools.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl">
            <FolderOpen className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
              這個合集還沒有工具
            </h3>
            <p className="text-foreground/60">
              {isOwner ? "前往工具頁面將工具加入此合集" : "此合集目前是空的"}
            </p>
            {isOwner && (
              <Button asChild className="mt-4">
                <Link href="/tools">瀏覽工具</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.id} className="relative group">
                <ToolCard tool={tool} />
                {isOwner && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="w-8 h-8 backdrop-blur-sm bg-background/80 hover:bg-background shadow-md"
                          disabled={removingToolId === tool.id}
                        >
                          {removingToolId === tool.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <MoreHorizontal className="w-4 h-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleRemoveTool(tool.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          從合集中移除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 刪除確認對話框 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除這個合集嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              刪除後將無法恢復。合集中的工具不會被刪除，只會移除合集本身。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  刪除中...
                </>
              ) : (
                "刪除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 編輯對話框 */}
      {collection && (
        <EditCollectionDialog
          collection={collection}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onUpdate={handleUpdateCollection}
        />
      )}
    </div>
  )
}
