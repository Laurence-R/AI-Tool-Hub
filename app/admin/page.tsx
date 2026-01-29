import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wrench,
  Users,
  MessageSquare,
  FileCheck,
  TrendingUp,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"

export const metadata = {
  title: "儀表板",
}

async function getStats() {
  const [
    toolCount,
    userCount,
    reviewCount,
    pendingSubmissions,
    recentReviews,
    recentUsers,
  ] = await Promise.all([
    prisma.tool.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.toolSubmission.count({ where: { status: "PENDING" } }),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        tool: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
  ])

  return {
    toolCount,
    userCount,
    reviewCount,
    pendingSubmissions,
    recentReviews,
    recentUsers,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const statCards = [
    {
      title: "工具總數",
      value: stats.toolCount,
      icon: Wrench,
      href: "/admin/tools",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "用戶總數",
      value: stats.userCount,
      icon: Users,
      href: "/admin/users",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "評論總數",
      value: stats.reviewCount,
      icon: MessageSquare,
      href: "/admin/reviews",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "待審核提交",
      value: stats.pendingSubmissions,
      icon: FileCheck,
      href: "/admin/submissions",
      color: stats.pendingSubmissions > 0 ? "text-orange-500" : "text-muted-foreground",
      bgColor: stats.pendingSubmissions > 0 ? "bg-orange-500/10" : "bg-muted/10",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">儀表板</h1>
        <p className="text-muted-foreground mt-1">
          歡迎回到 AI Tool Hub 管理中心
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">最新評論</CardTitle>
            <Link
              href="/admin/reviews"
              className="text-sm text-primary hover:underline"
            >
              查看全部
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReviews.length > 0 ? (
                stats.recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <MessageSquare className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {review.user.name || review.user.email} 評論了{" "}
                        <span className="text-primary">{review.tool.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {review.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                          locale: zhTW,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暫無評論
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">新用戶</CardTitle>
            <Link
              href="/admin/users"
              className="text-sm text-primary hover:underline"
            >
              查看全部
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                  >
                    <Users className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name || "未命名用戶"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(user.createdAt), {
                          addSuffix: true,
                          locale: zhTW,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暫無用戶
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">快速操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/tools/new"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <Wrench className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">新增工具</span>
            </Link>
            <Link
              href="/admin/submissions"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <FileCheck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">審核提交</span>
            </Link>
            <Link
              href="/admin/reviews"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">管理評論</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <Users className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">管理用戶</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
