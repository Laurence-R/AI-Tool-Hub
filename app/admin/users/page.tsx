import { Suspense } from "react"
import { AdminUsersClient } from "./AdminUsersClient"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "用戶管理",
}

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminUsersClient />
    </Suspense>
  )
}
