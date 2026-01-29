"use client"

import Link from "next/link"
import { FolderOpen, Lock, Globe, Clock, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collection } from "@/types"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"

interface CollectionCardProps {
  collection: Collection
  showUser?: boolean
}

export function CollectionCard({ collection, showUser = true }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="group glass-card hover:shadow-lg transition-all duration-200 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FolderOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {collection.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-foreground/50">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {collection.itemCount} 個工具
                  </Badge>
                  {collection.isPublic ? (
                    <span className="flex items-center gap-0.5">
                      <Globe className="w-3 h-3" />
                      公開
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Lock className="w-3 h-3" />
                      私人
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {collection.description && (
            <p className="text-sm text-foreground/60 line-clamp-2 mb-3">
              {collection.description}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {showUser && collection.user && (
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={collection.user.image || undefined} />
                  <AvatarFallback className="text-xs">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground/50 truncate max-w-[100px]">
                  {collection.user.name || "使用者"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-foreground/40">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(new Date(collection.updatedAt), {
                addSuffix: true,
                locale: zhTW,
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
