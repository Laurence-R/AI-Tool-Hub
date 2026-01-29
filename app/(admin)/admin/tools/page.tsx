import { Suspense } from "react"
import { AdminToolsClient } from "./AdminToolsClient"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "工具管理",
}

export default function AdminToolsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminToolsClient />
    </Suspense>
  )
}
