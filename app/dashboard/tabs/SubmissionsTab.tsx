"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Send,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Loader2,
} from "lucide-react"

export function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/submissions")
      const data = await res.json()
      if (res.ok) {
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error("載入提交記錄失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="w-3 h-3" />
            審核中
          </span>
        )
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            已通過
          </span>
        )
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3 h-3" />
            未通過
          </span>
        )
      default:
        return null
    }
  }

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
        <h2 className="text-2xl font-bold">我的提交</h2>
        <Button asChild>
          <Link href="/submit">
            <Send className="w-4 h-4 mr-2" />
            提交工具
          </Link>
        </Button>
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Send className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">尚無提交記錄</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            發現優秀的 AI 工具？提交給我們，讓更多人認識它！
          </p>
          <Button asChild>
            <Link href="/submit">提交工具</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card 
              key={submission.id} 
              className="p-4 border-border/50 hover:bg-foreground/5 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  {submission.logo ? (
                    <img 
                      src={submission.logo} 
                      alt={submission.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Send className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{submission.name}</h3>
                    {getStatusBadge(submission.status)}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {submission.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>提交於 {new Date(submission.createdAt).toLocaleDateString("zh-TW")}</span>
                    {submission.reviewedAt && (
                      <span>審核於 {new Date(submission.reviewedAt).toLocaleDateString("zh-TW")}</span>
                    )}
                  </div>
                  {submission.status === "REJECTED" && submission.reviewNote && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        <strong>審核意見：</strong>{submission.reviewNote}
                      </p>
                    </div>
                  )}
                  {submission.status === "APPROVED" && submission.toolId && (
                    <div className="mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/tools/${submission.toolId}`}>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          查看工具頁面
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
