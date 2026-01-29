"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Lock,
  Globe,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"

interface Collection {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  _count: {
    items: number
  }
}

const PAGE_SIZE = 20

export function AdminCollectionsClient() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [visibilityFilter, setVisibilityFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const [deleteCollectionId, setDeleteCollectionId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PAGE_SIZE.toString(),
        })
        if (search) params.set("search", search)
        if (visibilityFilter !== "all") params.set("isPublic", visibilityFilter)

        const response = await fetch(`/api/admin/collections?${params}`)
        if (response.ok) {
          const data = await response.json()
          setCollections(data.collections)
          setTotalPages(data.totalPages)
          setTotalCount(data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching collections:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchCollections, 300)
    return () => clearTimeout(debounce)
  }, [search, visibilityFilter, page])

  // Toggle visibility
  const toggleVisibility = async (collection: Collection) => {
    try {
      const response = await fetch(`/api/admin/collections/${collection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !collection.isPublic }),
      })
      
      if (response.ok) {
        setCollections(collections.map(c => 
          c.id === collection.id 
            ? { ...c, isPublic: !c.isPublic }
            : c
        ))
      }
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  // Delete collection
  const handleDelete = async () => {
    if (!deleteCollectionId) return
    
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/collections/${deleteCollectionId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setCollections(collections.filter(c => c.id !== deleteCollectionId))
        setTotalCount(prev => prev - 1)
      } else {
        const data = await response.json()
        alert(data.error || "刪除失敗")
      }
    } catch (error) {
      console.error("Error deleting collection:", error)
      alert("刪除失敗")
    } finally {
      setIsProcessing(false)
      setDeleteCollectionId(null)
    }
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">合集管理</h1>
        <p className="text-muted-foreground mt-1">
          共 {totalCount} 個合集
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋合集名稱或描述..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={visibilityFilter}
            onValueChange={(value) => {
              setVisibilityFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="可見性" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="true">公開</SelectItem>
              <SelectItem value="false">私人</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Collections Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>合集名稱</TableHead>
                <TableHead>擁有者</TableHead>
                <TableHead className="text-center">工具數</TableHead>
                <TableHead>可見性</TableHead>
                <TableHead>建立時間</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : collections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    沒有找到合集
                  </TableCell>
                </TableRow>
              ) : (
                collections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FolderKanban className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{collection.name}</p>
                          {collection.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                              {collection.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={collection.user.image || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(collection.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-[120px]">
                          {collection.user.name || collection.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {collection._count.items} 個工具
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={collection.isPublic ? "default" : "outline"}>
                        {collection.isPublic ? (
                          <>
                            <Globe className="w-3 h-3 mr-1" />
                            公開
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            私人
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(collection.createdAt), {
                        addSuffix: true,
                        locale: zhTW,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {collection.isPublic && (
                            <DropdownMenuItem asChild>
                              <Link href={`/collections/${collection.id}`} target="_blank">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                查看合集
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleVisibility(collection)}>
                            {collection.isPublic ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                設為私人
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                設為公開
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteCollectionId(collection.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除合集
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-muted-foreground">
              第 {page} / {totalPages} 頁
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCollectionId} onOpenChange={() => setDeleteCollectionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除此合集嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。合集及其所有工具項目將從資料庫中永久刪除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isProcessing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  刪除中...
                </>
              ) : (
                "確定刪除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
