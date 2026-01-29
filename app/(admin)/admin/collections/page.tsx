import { Suspense } from "react"
import { AdminCollectionsClient } from "./AdminCollectionsClient"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "合集管理",
}

export default function AdminCollectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminCollectionsClient />
    </Suspense>
  )
}
