import { Suspense } from "react"
import { AdminReviewsClient } from "./AdminReviewsClient"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "評論管理",
}

export default function AdminReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <AdminReviewsClient />
    </Suspense>
  )
}
