"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Eye,
  Send,
  User,
  Calendar,
  Tag,
  DollarSign,
  Sparkles,
  MessageSquare,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { CATEGORY_LABELS, getCategoryLabel } from "@/constants/labels"
import { PRICING_LABELS, getPricingLabel } from "@/lib/formatters"

interface Submission {
  id: string
  name: string
  description: string
  url: string
  logo: string | null
  category: string
  pricing: string
  features: string[]
  tags: string[]
  submitterNote: string | null
  status: "PENDING" | "APPROVED" | "REJECTED"
  reviewNote: string | null
  reviewedAt: string | null
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface SubmissionCounts {
  PENDING: number
  APPROVED: number
  REJECTED: number
}


export function AdminSubmissionsClient() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [counts, setCounts] = useState<SubmissionCounts>({ PENDING: 0, APPROVED: 0, REJECTED: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("PENDING")
  
  // 審核對話框
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean
    submission: Submission | null
    action: "approve" | "reject" | null
  }>({ open: false, submission: null, action: null })
  const [reviewNote, setReviewNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 詳情對話框
  const [detailDialog, setDetailDialog] = useState<{
    open: boolean
    submission: Submission | null
  }>({ open: false, submission: null })

  useEffect(() => {
    loadSubmissions(activeTab)
  }, [activeTab])

  const loadSubmissions = async (status: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/submissions?status=${status}`)
      const data = await res.json()
      if (res.ok) {
        setSubmissions(data.submissions)
        setCounts(data.counts)
      }
    } catch (error) {
      console.error("載入提交記錄失敗:", error)
      toast.error("載入失敗")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReview = async () => {
    if (!reviewDialog.submission || !reviewDialog.action) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/admin/submissions/${reviewDialog.submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reviewDialog.action,
          reviewNote: reviewNote || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "審核失敗")
      }

      toast.success(reviewDialog.action === "approve" ? "已通過審核" : "已拒絕提交")
      setReviewDialog({ open: false, submission: null, action: null })
      setReviewNote("")
      loadSubmissions(activeTab)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "審核失敗")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openReviewDialog = (submission: Submission, action: "approve" | "reject") => {
    setReviewDialog({ open: true, submission, action })
    setReviewNote("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">
            <Clock className="w-3 h-3 mr-1" />
            審核中
          </Badge>
        )
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            已通過
          </Badge>
        )
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300">
            <XCircle className="w-3 h-3 mr-1" />
            未通過
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-28 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* 頁首 */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回個人中心
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">提交審核</h1>
              <p className="text-muted-foreground">審核用戶提交的 AI 工具</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="PENDING" className="gap-2">
              <Clock className="w-4 h-4" />
              待審核
              {counts.PENDING > 0 ? (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-yellow-500 text-white rounded-full">
                  {counts.PENDING}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">({counts.PENDING})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="APPROVED" className="gap-2">
              <CheckCircle className="w-4 h-4" />
              已通過
              <span className="text-xs text-muted-foreground">({counts.APPROVED})</span>
            </TabsTrigger>
            <TabsTrigger value="REJECTED" className="gap-2">
              <XCircle className="w-4 h-4" />
              已拒絕
              <span className="text-xs text-muted-foreground">({counts.REJECTED})</span>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : submissions.length === 0 ? (
            <Card className="py-16">
              <div className="text-center text-muted-foreground">
                <Send className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>沒有{activeTab === "PENDING" ? "待審核" : activeTab === "APPROVED" ? "已通過" : "已拒絕"}的提交</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <Card key={submission.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                        {submission.logo ? (
                          <img 
                            src={submission.logo} 
                            alt={submission.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Send className="w-8 h-8 text-slate-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{submission.name}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {submission.description}
                        </p>
                        
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Tag className="w-4 h-4" />
                            {getCategoryLabel(submission.category)}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            {getPricingLabel(submission.pricing)}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <User className="w-4 h-4" />
                            {submission.user.name || submission.user.email}
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {new Date(submission.createdAt).toLocaleDateString("zh-TW")}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDetailDialog({ open: true, submission })}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          詳情
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <a href={submission.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            訪問
                          </a>
                        </Button>
                        {submission.status === "PENDING" && (
                          <>
                            <Button 
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                              onClick={() => openReviewDialog(submission, "approve")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              通過
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
                              onClick={() => openReviewDialog(submission, "reject")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              拒絕
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Tabs>

        {/* 詳情對話框 */}
        <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, submission: open ? detailDialog.submission : null })}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {detailDialog.submission && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {detailDialog.submission.logo ? (
                        <img 
                          src={detailDialog.submission.logo} 
                          alt={detailDialog.submission.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Send className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <DialogTitle>{detailDialog.submission.name}</DialogTitle>
                      <DialogDescription>
                        {getCategoryLabel(detailDialog.submission.category)} · {getPricingLabel(detailDialog.submission.pricing)}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* 基本資訊 */}
                  <div>
                    <h4 className="font-medium mb-2">描述</h4>
                    <p className="text-sm text-muted-foreground">{detailDialog.submission.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">網址</h4>
                    <a 
                      href={detailDialog.submission.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {detailDialog.submission.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* 特色功能 */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      特色功能
                    </h4>
                    <ul className="space-y-1">
                      {detailDialog.submission.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 標籤 */}
                  {detailDialog.submission.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">標籤</h4>
                      <div className="flex flex-wrap gap-2">
                        {detailDialog.submission.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 提交者備註 */}
                  {detailDialog.submission.submitterNote && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        提交者備註
                      </h4>
                      <p className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        {detailDialog.submission.submitterNote}
                      </p>
                    </div>
                  )}

                  {/* 提交者資訊 */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">提交者</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                        {detailDialog.submission.user.image ? (
                          <img 
                            src={detailDialog.submission.user.image} 
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{detailDialog.submission.user.name || "未設定名稱"}</p>
                        <p className="text-sm text-muted-foreground">{detailDialog.submission.user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* 審核資訊 */}
                  {detailDialog.submission.status !== "PENDING" && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-2">審核結果</h4>
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(detailDialog.submission.status)}
                        {detailDialog.submission.reviewedAt && (
                          <span className="text-sm text-muted-foreground">
                            於 {new Date(detailDialog.submission.reviewedAt).toLocaleString("zh-TW")}
                          </span>
                        )}
                      </div>
                      {detailDialog.submission.reviewNote && (
                        <p className="text-sm text-muted-foreground bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                          {detailDialog.submission.reviewNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 操作按鈕 */}
                {detailDialog.submission.status === "PENDING" && (
                  <DialogFooter className="mt-6">
                    <Button 
                      variant="ghost"
                      onClick={() => setDetailDialog({ open: false, submission: null })}
                    >
                      關閉
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950"
                      onClick={() => {
                        setDetailDialog({ open: false, submission: null })
                        openReviewDialog(detailDialog.submission!, "reject")
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      拒絕
                    </Button>
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                      onClick={() => {
                        setDetailDialog({ open: false, submission: null })
                        openReviewDialog(detailDialog.submission!, "approve")
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      通過
                    </Button>
                  </DialogFooter>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* 審核對話框 */}
        <Dialog open={reviewDialog.open} onOpenChange={(open) => setReviewDialog({ open, submission: open ? reviewDialog.submission : null, action: open ? reviewDialog.action : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewDialog.action === "approve" ? "確認通過審核" : "確認拒絕提交"}
              </DialogTitle>
              <DialogDescription>
                {reviewDialog.action === "approve" 
                  ? `確定要通過「${reviewDialog.submission?.name}」的提交嗎？該工具將立即上架。`
                  : `確定要拒絕「${reviewDialog.submission?.name}」的提交嗎？`
                }
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                {reviewDialog.action === "approve" ? "審核備註（可選）" : "拒絕原因"}
              </label>
              <Textarea
                placeholder={reviewDialog.action === "approve" 
                  ? "可以留下審核備註..." 
                  : "請說明拒絕原因，方便提交者改進..."
                }
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setReviewDialog({ open: false, submission: null, action: null })}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button 
                onClick={handleReview}
                disabled={isSubmitting}
                className={reviewDialog.action === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
                variant={reviewDialog.action === "reject" ? "destructive" : "default"}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : reviewDialog.action === "approve" ? (
                  <Check className="w-4 h-4 mr-1" />
                ) : (
                  <X className="w-4 h-4 mr-1" />
                )}
                確認{reviewDialog.action === "approve" ? "通過" : "拒絕"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
