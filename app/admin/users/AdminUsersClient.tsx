"use client"

import { useState, useEffect } from "react"
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
  Shield,
  ShieldOff,
  UserX,
  UserCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { zhTW } from "date-fns/locale"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: "USER" | "ADMIN"
  status: "ACTIVE" | "SUSPENDED"
  createdAt: string
  _count?: {
    reviews: number
    favorites: number
    collections: number
  }
}

const PAGE_SIZE = 20

export function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  const [actionDialog, setActionDialog] = useState<{
    type: "role" | "status"
    user: User
    newValue: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PAGE_SIZE.toString(),
        })
        if (search) params.set("search", search)
        if (roleFilter !== "all") params.set("role", roleFilter)
        if (statusFilter !== "all") params.set("status", statusFilter)

        const response = await fetch(`/api/admin/users?${params}`)
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
          setTotalPages(data.totalPages)
          setTotalCount(data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounce = setTimeout(fetchUsers, 300)
    return () => clearTimeout(debounce)
  }, [search, roleFilter, statusFilter, page])

  // Handle role/status change
  const handleAction = async () => {
    if (!actionDialog) return
    
    setIsProcessing(true)
    try {
      const { type, user, newValue } = actionDialog
      
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [type]: newValue,
        }),
      })
      
      if (response.ok) {
        setUsers(users.map(u => 
          u.id === user.id 
            ? { ...u, [type]: newValue }
            : u
        ))
      } else {
        const data = await response.json()
        alert(data.error || "操作失敗")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("操作失敗")
    } finally {
      setIsProcessing(false)
      setActionDialog(null)
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
        <h1 className="text-3xl font-bold">用戶管理</h1>
        <p className="text-muted-foreground mt-1">
          共 {totalCount} 位用戶
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜尋用戶名稱或 Email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              <SelectItem value="USER">一般用戶</SelectItem>
              <SelectItem value="ADMIN">管理員</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="ACTIVE">正常</SelectItem>
              <SelectItem value="SUSPENDED">停用</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用戶</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>狀態</TableHead>
                <TableHead className="text-center">評論</TableHead>
                <TableHead className="text-center">收藏</TableHead>
                <TableHead>註冊時間</TableHead>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    沒有找到用戶
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name || "未命名"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? "管理員" : "用戶"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "ACTIVE" ? "outline" : "destructive"}>
                        {user.status === "ACTIVE" ? "正常" : "停用"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {user._count?.reviews || 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {user._count?.favorites || 0}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(user.createdAt), {
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
                          {user.role === "USER" ? (
                            <DropdownMenuItem
                              onClick={() => setActionDialog({
                                type: "role",
                                user,
                                newValue: "ADMIN",
                              })}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              設為管理員
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setActionDialog({
                                type: "role",
                                user,
                                newValue: "USER",
                              })}
                            >
                              <ShieldOff className="w-4 h-4 mr-2" />
                              取消管理員
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {user.status === "ACTIVE" ? (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setActionDialog({
                                type: "status",
                                user,
                                newValue: "SUSPENDED",
                              })}
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              停用帳號
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setActionDialog({
                                type: "status",
                                user,
                                newValue: "ACTIVE",
                              })}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              啟用帳號
                            </DropdownMenuItem>
                          )}
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

      {/* Action Confirmation Dialog */}
      <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog?.type === "role"
                ? actionDialog.newValue === "ADMIN"
                  ? "設為管理員"
                  : "取消管理員權限"
                : actionDialog?.newValue === "SUSPENDED"
                ? "停用帳號"
                : "啟用帳號"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog?.type === "role" ? (
                actionDialog.newValue === "ADMIN" ? (
                  <>確定要將 <strong>{actionDialog.user.name || actionDialog.user.email}</strong> 設為管理員嗎？</>
                ) : (
                  <>確定要取消 <strong>{actionDialog?.user.name || actionDialog?.user.email}</strong> 的管理員權限嗎？</>
                )
              ) : actionDialog?.newValue === "SUSPENDED" ? (
                <>確定要停用 <strong>{actionDialog.user.name || actionDialog.user.email}</strong> 的帳號嗎？停用後該用戶將無法登入。</>
              ) : (
                <>確定要啟用 <strong>{actionDialog?.user.name || actionDialog?.user.email}</strong> 的帳號嗎？</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  處理中...
                </>
              ) : (
                "確定"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
