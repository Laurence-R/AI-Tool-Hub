"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { FolderPlus, Loader2, Check, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCollections } from "@/contexts"
import { CreateCollectionDialog } from "./CreateCollectionDialog"
import { cn } from "@/lib/utils"

interface AddToCollectionDialogProps {
  toolId: number | string
  trigger?: React.ReactNode
}

export function AddToCollectionDialog({ toolId, trigger }: AddToCollectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()
  
  const { 
    myCollections, 
    isLoading, 
    fetchMyCollections, 
    addToolToCollection,
    removeToolFromCollection,
    isToolInCollection 
  } = useCollections()

  useEffect(() => {
    if (open && session?.user?.id) {
      fetchMyCollections()
    }
  }, [open, session?.user?.id, fetchMyCollections])

  const handleClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    setOpen(true)
  }

  const handleToggle = async (collectionId: string) => {
    setLoadingId(collectionId)
    
    if (isToolInCollection(collectionId, toolId)) {
      await removeToolFromCollection(collectionId, toolId)
    } else {
      await addToolToCollection(collectionId, toolId)
    }
    
    setLoadingId(null)
  }

  const handleCreateSuccess = async (collectionId: string) => {
    // 建立後自動將工具加入新合集
    await addToolToCollection(collectionId, toolId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <div onClick={handleClick}>{trigger}</div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleClick}>
            <FolderPlus className="w-4 h-4 mr-2" />
            加入合集
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            加入合集
          </DialogTitle>
          <DialogDescription>
            選擇一個合集來儲存這個工具
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : myCollections.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-foreground/60">你還沒有建立任何合集</p>
              <CreateCollectionDialog
                trigger={
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    建立第一個合集
                  </Button>
                }
                onSuccess={handleCreateSuccess}
              />
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-[300px] pr-4">
                <div className="space-y-2">
                  {myCollections.map((collection) => {
                    const isInCollection = isToolInCollection(collection.id, toolId)
                    const isProcessing = loadingId === collection.id
                    
                    return (
                      <button
                        key={collection.id}
                        onClick={() => handleToggle(collection.id)}
                        disabled={isProcessing}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                          isInCollection
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-foreground/5"
                        )}
                      >
                        <div className="flex-1 text-left">
                          <p className="font-medium text-foreground">{collection.name}</p>
                          <p className="text-xs text-foreground/50">
                            {collection.itemCount} 個工具
                            {!collection.isPublic && " • 私人"}
                          </p>
                        </div>
                        {isProcessing ? (
                          <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        ) : isInCollection ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <Plus className="w-5 h-5 text-foreground/40" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
              
              <div className="mt-4 pt-4 border-t">
                <CreateCollectionDialog
                  trigger={
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      建立新合集
                    </Button>
                  }
                  onSuccess={handleCreateSuccess}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
