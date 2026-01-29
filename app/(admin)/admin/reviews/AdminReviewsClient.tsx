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
  Star,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"

interface Review {
  id: string
  content: string
  rating: number
  helpful: number
  isHidden: boolean
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  tool: {
    id: number
    name: string
    slug: string
  }
}

const PAGE_SIZE = 20

export function AdminReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [hiddenFilter, setHiddenFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PAGE_SIZE.toString(),
        })
        if (search) params.set("search", search)
        if (hiddenFilter !== "all") params.set("isHidden", hiddenFilter)
        if (ratingFilter !== "all") params.set("rating", ratingFilter)

        const response = await fetch(`/api/admin/reviews?${params}`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
          setTotalPages(data.totalPages)
          setTotalCount(data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchReviews, 300)
    return () => clearTimeout(debounce)
  }, [search, hiddenFilter, ratingFilter, page])

  // Toggle visibility
  const toggleVisibility = async (review: Review) => {
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !review.isHidden }),
      })
      
      if (response.ok) {
        setReviews(reviews.map(r => 
          r.id === review.id 
            ? { ...r, isHidden: !r.isHidden }
            : r
        ))
      }
    } catch (error) {
      console.error("Error toggling visibility:", error)
    }
  }

  // Delete review
  const handleDelete = async () => {
    if (!deleteReviewId) return
    
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/admin/reviews/${deleteReviewId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== deleteReviewId))
        setTotalCount(prev => prev - 1)
      } else {
        const data = await response.json()
        alert(data.error || "刪除失敗")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("刪除失敗")
    } finally {
      setIsProcessing(false)
      setDeleteReviewId(null)
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
        <h1 className="text-3xl font-bold">評論管理</h1>
        <p className="text-muted-foreground mt-1">
          共 {totalCount} 則評論
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋評論內容..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={hiddenFilter}
            onValueChange={(value) => {
              setHiddenFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="顯示狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="false">顯示中</SelectItem>
              <SelectItem value="true">已隱藏</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={ratingFilter}
            onValueChange={(value) => {
              setRatingFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="評分" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部評分</SelectItem>
              <SelectItem value="5">5 星</SelectItem>
              <SelectItem value="4">4 星</SelectItem>
              <SelectItem value="3">3 星</SelectItem>
              <SelectItem value="2">2 星</SelectItem>
              <SelectItem value="1">1 星</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用戶</TableHead>
                <TableHead>工具</TableHead>
                <TableHead>評論內容</TableHead>
                <TableHead className="text-center">評分</TableHead>
                <TableHead className="text-center">有幫助</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead>時間</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    沒有找到評論
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id} className={review.isHidden ? "opacity-50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.image || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(review.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-[100px]">
                          {review.user.name || review.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link 
                        href={`/tools/${review.tool.slug || review.tool.id}`}
                        className="text-primary hover:underline text-sm"
                        target="_blank"
                      >
                        {review.tool.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2 max-w-[200px]">
                        {review.content}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-sm">{review.helpful}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={review.isHidden ? "secondary" : "outline"}>
                        {review.isHidden ? "已隱藏" : "顯示中"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(review.createdAt), {
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
                          <DropdownMenuItem asChild>
                            <Link href={`/tools/${review.tool.slug || review.tool.id}`} target="_blank">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              查看工具頁
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleVisibility(review)}>
                            {review.isHidden ? (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                顯示評論
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                隱藏評論
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteReviewId(review.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            刪除評論
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
      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除此評論嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作無法復原。評論將從資料庫中永久刪除。
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
