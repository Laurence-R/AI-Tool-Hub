"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

interface Tool {
  id: number
  name: string
  slug: string
  description: string
  url: string
  logo: string | null
  category: string
  pricing: string
  createdAt: string
  _count?: {
    reviews: number
    favorites: number
  }
}

const CATEGORIES = [
  { value: "all", label: "全部分類" },
  { value: "chatbot", label: "聊天機器人" },
  { value: "image", label: "圖像生成" },
  { value: "video", label: "影片處理" },
  { value: "audio", label: "音訊處理" },
  { value: "writing", label: "寫作助手" },
  { value: "coding", label: "程式開發" },
  { value: "productivity", label: "生產力" },
  { value: "research", label: "研究分析" },
  { value: "marketing", label: "行銷工具" },
  { value: "design", label: "設計工具" },
  { value: "other", label: "其他" },
]

const PRICING_OPTIONS = [
  { value: "all", label: "全部定價" },
  { value: "free", label: "免費" },
  { value: "freemium", label: "免費增值" },
  { value: "paid", label: "付費" },
  { value: "enterprise", label: "企業方案" },
]

const PAGE_SIZE = 20

export function AdminToolsClient() {
  const router = useRouter()
  const [tools, setTools] = useState<Tool[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [pricing, setPricing] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [deleteToolId, setDeleteToolId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch tools
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PAGE_SIZE.toString(),
        })
        if (search) params.set("search", search)
        if (category !== "all") params.set("category", category)
        if (pricing !== "all") params.set("pricing", pricing)

        const response = await fetch(`/api/admin/tools?${params}`)
        if (response.ok) {
          const data = await response.json()
          setTools(data.tools)
          setTotalPages(data.totalPages)
          setTotalCount(data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching tools:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchTools, 300)
    return () => clearTimeout(debounce)
  }, [search, category, pricing, page])

  // Handle delete
  const handleDelete = async () => {
    if (!deleteToolId) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/tools/${deleteToolId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setTools(tools.filter(t => t.id !== deleteToolId))
        setTotalCount(prev => prev - 1)
      } else {
        const data = await response.json()
        alert(data.error || "刪除失敗")
      }
    } catch (error) {
      console.error("Error deleting tool:", error)
      alert("刪除失敗")
    } finally {
      setIsDeleting(false)
      setDeleteToolId(null)
    }
  }

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find(c => c.value === value)?.label || value
  }

  const getPricingBadge = (pricing: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      free: "secondary",
      freemium: "default",
      paid: "outline",
      enterprise: "destructive",
    }
    const labels: Record<string, string> = {
      free: "免費",
      freemium: "免費增值",
      paid: "付費",
      enterprise: "企業",
    }
    return (
      <Badge variant={variants[pricing] || "outline"}>
        {labels[pricing] || pricing}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">工具管理</h1>
          <p className="text-muted-foreground mt-1">
            共 {totalCount} 個工具
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tools/new">
            <Plus className="w-4 h-4 mr-2" />
            新增工具
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋工具名稱..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={category}
            onValueChange={(value) => {
              setCategory(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="分類" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={pricing}
            onValueChange={(value) => {
              setPricing(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="定價" />
            </SelectTrigger>
            <SelectContent>
              {PRICING_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tools Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead>工具</TableHead>
                <TableHead>分類</TableHead>
                <TableHead>定價</TableHead>
                <TableHead className="text-center">評論</TableHead>
                <TableHead className="text-center">收藏</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : tools.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    沒有找到工具
                  </TableCell>
                </TableRow>
              ) : (
                tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-mono text-sm">{tool.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {tool.logo ? (
                            <Image
                              src={tool.logo}
                              alt={tool.name}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-lg font-bold text-muted-foreground">
                              {tool.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tool.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryLabel(tool.category)}</TableCell>
                    <TableCell>{getPricingBadge(tool.pricing)}</TableCell>
                    <TableCell className="text-center">
                      {tool._count?.reviews || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {tool._count?.favorites || 0}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/tools/${tool.slug || tool.id}`} target="_blank">
                              <Eye className="w-4 h-4 mr-2" />
                              查看頁面
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={tool.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              訪問網站
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/tools/${tool.id}/edit`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              編輯
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteToolId(tool.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除
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
      <AlertDialog open={!!deleteToolId} onOpenChange={() => setDeleteToolId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除此工具嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。工具將從資料庫中永久刪除，相關的評論和收藏也會一併移除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
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
