"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  Star, 
  ThumbsUp,
  ThumbsDown,
  Heart,
  Shield, 
  Calendar, 
  MessageSquare,
  Loader2,
  Send,
  Trash2,
  ChevronDown,
  AlertCircle,
  Check,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  rating: number
  title: string | null
  content: string
  pros: string[]
  cons: string[]
  helpful: number
  verified: boolean
  isLiked: boolean
  isOwner: boolean
  createdAt: string
  date: string
}

interface ReviewSectionProps {
  toolId: number
  toolName: string
  onCountChange?: (count: number) => void
}

type SortOption = "newest" | "helpful" | "rating"

export function ReviewSection({ toolId, toolName, onCountChange }: ReviewSectionProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [showForm, setShowForm] = useState(false)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)

  // 載入評論
  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/reviews?toolId=${toolId}&sort=${sortBy}`)
      const data = await res.json()
      if (res.ok) {
        setReviews(data.reviews)
        setTotal(data.total)
        setAvgRating(data.avgRating)
        onCountChange?.(data.total)
        // 檢查使用者是否已評論
        if (session?.user?.id) {
          setHasUserReviewed(data.reviews.some((r: Review) => r.isOwner))
        }
      }
    } catch (error) {
      console.error("載入評論失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [toolId, sortBy])

  // 處理按讚
  const handleLike = async (reviewId: string) => {
    if (!session) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch("/api/reviews/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      })
      const data = await res.json()
      
      if (res.ok) {
        setReviews(prev => prev.map(review => 
          review.id === reviewId 
            ? { 
                ...review, 
                isLiked: data.action === "liked",
                helpful: data.likesCount 
              }
            : review
        ))
      }
    } catch (error) {
      console.error("按讚失敗:", error)
    }
  }

  // 處理刪除
  const handleDelete = async (reviewId: string) => {
    if (!confirm("確定要刪除這則評論嗎？")) return

    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      })
      
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId))
        setTotal(prev => prev - 1)
        setHasUserReviewed(false)
      }
    } catch (error) {
      console.error("刪除失敗:", error)
    }
  }

  // 新增評論後的回呼
  const handleReviewAdded = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev])
    setTotal(prev => prev + 1)
    setHasUserReviewed(true)
    setShowForm(false)
  }

  // 渲染星星
  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5"
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-foreground/20"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 評論統計與操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {renderStars(Math.round(avgRating))}
            <span className="font-bold text-xl">{avgRating.toFixed(1)}</span>
          </div>
          <span className="text-foreground/60">
            {total} 則評論
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 排序選擇 */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-foreground/5 border border-border/50 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="newest">最新評論</option>
              <option value="helpful">最有幫助</option>
              <option value="rating">最高評分</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 pointer-events-none" />
          </div>

          {/* 撰寫評論按鈕 */}
          {status === "authenticated" && !hasUserReviewed && (
            <Button onClick={() => setShowForm(!showForm)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              撰寫評論
            </Button>
          )}
        </div>
      </div>

      {/* 評論表單 */}
      {showForm && (
        <ReviewForm 
          toolId={toolId} 
          toolName={toolName}
          onSuccess={handleReviewAdded}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 未登入提示 */}
      {status === "unauthenticated" && (
        <div className="glass-card rounded-2xl p-6 text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-primary/60" />
          <p className="text-foreground/70 mb-4">登入後即可撰寫評論</p>
          <Button asChild>
            <Link href="/login">立即登入</Link>
          </Button>
        </div>
      )}

      {/* 已評論提示 */}
      {status === "authenticated" && hasUserReviewed && !showForm && (
        <div className="glass-card rounded-xl p-4 bg-primary/5 border-primary/20">
          <p className="text-sm text-foreground/70">
            ✅ 您已經評論過此工具，感謝您的分享！
          </p>
        </div>
      )}

      {/* 評論列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-foreground/20" />
          <p className="text-foreground/60 mb-2">目前尚無評論</p>
          <p className="text-sm text-foreground/40">成為第一個評論者，分享您的使用經驗！</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="glass-card rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-200"
            >
              {/* 評論者資訊 */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold overflow-hidden">
                    {review.userAvatar ? (
                      <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                    ) : (
                      review.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {review.userName}
                      </span>
                      {review.verified && (
                        <span title="已驗證使用者">
                          <Shield className="w-4 h-4 text-primary" />
                        </span>
                      )}
                      {review.isOwner && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                          我的評論
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Calendar className="w-3.5 h-3.5" />
                      {review.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating, "sm")}
                  {review.isOwner && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* 評論標題 */}
              {review.title && (
                <h4 className="font-semibold text-lg">{review.title}</h4>
              )}

              {/* 評論內容 */}
              <p className="text-foreground/70 leading-relaxed">
                {review.content}
              </p>

              {/* 優缺點 */}
              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {review.pros.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" /> 優點
                      </span>
                      <ul className="space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium text-red-500 flex items-center gap-1.5">
                        <ThumbsDown className="w-3.5 h-3.5" /> 缺點
                      </span>
                      <ul className="space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm text-foreground/60 flex items-start gap-2">
                            <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 有幫助按鈕 */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleLike(review.id)}
                  disabled={!session}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    review.isLiked
                      ? "bg-red-500/10 text-red-500"
                      : "bg-foreground/5 hover:bg-red-500/10 text-foreground/60 hover:text-red-500"
                  } ${!session ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <Heart className={`w-4 h-4 ${review.isLiked ? "fill-red-500" : ""}`} />
                  <span className="text-sm">
                    有幫助 ({review.helpful})
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 評論表單組件
function ReviewForm({ 
  toolId, 
  toolName,
  onSuccess, 
  onCancel 
}: { 
  toolId: number
  toolName: string
  onSuccess: (review: Review) => void
  onCancel: () => void
}) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [pros, setPros] = useState<string[]>([""])
  const [cons, setCons] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (rating === 0) {
      setError("請選擇評分")
      return
    }
    if (!content.trim()) {
      setError("請輸入評論內容")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolId,
          rating,
          title: title.trim() || null,
          content: content.trim(),
          pros: pros.filter(p => p.trim()),
          cons: cons.filter(c => c.trim()),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        onSuccess(data.review)
      } else {
        setError(data.error || "提交失敗")
      }
    } catch {
      setError("提交失敗，請稍後再試")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 處理優點/缺點輸入
  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
    if (index === pros.length - 1 && value && pros.length < 5) {
      setPros([...newPros, ""])
    }
  }

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
    if (index === cons.length - 1 && value && cons.length < 5) {
      setCons([...newCons, ""])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">評論 {toolName}</h3>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          取消
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* 評分選擇 */}
      <div className="space-y-2">
        <Label>評分 *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-foreground/20"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-foreground/60">
              {["", "很差", "不太好", "一般", "很好", "非常好"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* 標題 */}
      <div className="space-y-2">
        <Label htmlFor="review-title">標題（選填）</Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="用一句話總結您的評價"
          maxLength={100}
        />
      </div>

      {/* 評論內容 */}
      <div className="space-y-2">
        <Label htmlFor="review-content">評論內容 *</Label>
        <Textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享您使用這個工具的經驗..."
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-foreground/40 text-right">{content.length}/1000</p>
      </div>

      {/* 優缺點 */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-green-600">優點（選填）</Label>
          {pros.map((pro, index) => (
            <Input
              key={index}
              value={pro}
              onChange={(e) => handleProChange(index, e.target.value)}
              placeholder={`優點 ${index + 1}`}
              maxLength={100}
            />
          ))}
        </div>
        <div className="space-y-2">
          <Label className="text-red-500">缺點（選填）</Label>
          {cons.map((con, index) => (
            <Input
              key={index}
              value={con}
              onChange={(e) => handleConChange(index, e.target.value)}
              placeholder={`缺點 ${index + 1}`}
              maxLength={100}
            />
          ))}
        </div>
      </div>

      {/* 提交按鈕 */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          提交評論
        </Button>
      </div>
    </form>
  )
}
