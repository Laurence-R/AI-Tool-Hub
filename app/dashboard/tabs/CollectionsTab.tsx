"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Collection } from "@/types"
import { 
  FolderOpen,
  Plus,
  Globe,
  Lock,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { CreateCollectionDialog } from "@/components/collections"

interface CollectionsTabProps {
  collections: Collection[]
  isLoading: boolean
}

export function CollectionsTab({ collections, isLoading }: CollectionsTabProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)

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
        <h2 className="text-2xl font-bold">我的合集</h2>
        {collections.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/collections">查看全部</Link>
            </Button>
            <Button size="sm" onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              建立合集
            </Button>
          </div>
        )}
      </div>

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">尚無合集</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            建立您的第一個合集，整理和分享喜歡的 AI 工具
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            建立合集
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {collections.slice(0, 6).map((collection) => (
            <Link 
              key={collection.id} 
              href={`/collections/${collection.id}`}
              className="block p-4 rounded-lg border border-border/50 hover:bg-foreground/5 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold line-clamp-1">{collection.name}</h3>
                {collection.isPublic ? (
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </div>
              {collection.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {collection.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{collection.itemCount} 個工具</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {collections.length > 6 && (
        <div className="mt-4 text-center">
          <Button variant="ghost" asChild>
            <Link href="/collections">
              查看全部 {collections.length} 個合集
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      <CreateCollectionDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  )
}
