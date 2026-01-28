"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, CheckCircle, XCircle, Send, Loader2, Check, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export function NotificationBell() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // 載入通知
  const loadNotifications = async () => {
    if (!session?.user) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/notifications")
      const data = await res.json()
      if (res.ok) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("載入通知失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 標記為已讀
  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          notificationId 
            ? { notificationId } 
            : { markAllRead: true }
        ),
      })

      if (notificationId) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("標記已讀失敗:", error)
    }
  }

  // 初始載入和定時輪詢
  useEffect(() => {
    if (session?.user) {
      loadNotifications()
      
      // 每 60 秒輪詢一次
      const interval = setInterval(loadNotifications, 60000)
      return () => clearInterval(interval)
    }
  }, [session?.user])

  // 打開 Popover 時重新載入
  useEffect(() => {
    if (isOpen && session?.user) {
      loadNotifications()
    }
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SUBMISSION_APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "SUBMISSION_REJECTED":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Bell className="w-5 h-5 text-blue-500" />
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "剛剛"
    if (diffMins < 60) return `${diffMins} 分鐘前`
    if (diffHours < 24) return `${diffHours} 小時前`
    if (diffDays < 7) return `${diffDays} 天前`
    return date.toLocaleDateString("zh-TW")
  }

  if (!session?.user) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-foreground hover:text-primary"
          aria-label="通知"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0 z-[70] bg-background/95 backdrop-blur-xl border-border/50"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">通知</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => markAsRead()}
            >
              <Check className="w-3 h-3 mr-1" />
              全部標為已讀
            </Button>
          )}
        </div>

        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">暫無通知</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-foreground/5 transition-colors ${
                    !notification.isRead ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? "font-medium" : ""}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(notification.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.link && (
                            <Link
                              href={notification.link}
                              className="text-xs text-primary hover:underline"
                              onClick={() => {
                                if (!notification.isRead) {
                                  markAsRead(notification.id)
                                }
                                setIsOpen(false)
                              }}
                            >
                              查看
                            </Link>
                          )}
                          {!notification.isRead && (
                            <button
                              className="text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => markAsRead(notification.id)}
                            >
                              標為已讀
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            asChild
          >
            <Link href="/dashboard">查看全部通知</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
