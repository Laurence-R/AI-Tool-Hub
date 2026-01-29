"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  Trash2,
  Loader2,
  Check,
} from "lucide-react"
import { StarRating } from "@/components/ui/star-rating"
import { formatDate } from "@/lib/formatters"

export function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadReviews = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/reviews/user")
      const data = await res.json()
      if (res.ok) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error("載入評論失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReviews()
  }, [])

  const handleDelete = async (reviewId: string) => {
    if (!confirm("確定要刪除這則評論嗎？")) return
    
    setDeletingId(reviewId)
    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, {
        method: "DELETE"
      })
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId))
      }
    } catch (error) {
      console.error("刪除評論失敗:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">載入評論中...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">我的評論</h2>
        <span className="text-sm text-muted-foreground">
          共 {reviews.length} 則評論
        </span>
      </div>
      
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">尚無評論</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            分享您使用 AI 工具的經驗，幫助其他使用者做出更好的選擇
          </p>
          <Button asChild>
            <Link href="/tools">開始評論</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              {/* 工具資訊和操作 */}
              <div className="flex items-start justify-between mb-4">
                <Link 
                  href={`/tools/${review.tool.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-foreground/5 flex items-center justify-center overflow-hidden">
                    {review.tool.logo ? (
                      <img 
                        src={review.tool.logo} 
                        alt={review.tool.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-bold text-lg text-primary">
                        {review.tool.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {review.tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {review.tool.category}
                    </p>
                  </div>
                </Link>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <StarRating rating={review.rating} size="sm" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    {deletingId === review.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* 評論內容 */}
              {review.title && (
                <h4 className="font-semibold mb-2">{review.title}</h4>
              )}
              <p className="text-foreground/70 mb-4">{review.content}</p>

              {/* 優缺點 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {review.pros && review.pros.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">優點</p>
                    <ul className="space-y-1">
                      {review.pros.map((pro: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons && review.cons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">缺點</p>
                    <ul className="space-y-1">
                      {review.cons.map((con: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/70">
                          <span className="w-4 h-4 flex items-center justify-center text-red-500 flex-shrink-0">−</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 按讚數 */}
              {review.likesCount > 0 && (
                <div className="mt-4 pt-4 border-t border-foreground/10">
                  <span className="text-sm text-muted-foreground">
                    ❤️ {review.likesCount} 人覺得有幫助
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
