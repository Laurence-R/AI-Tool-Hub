import Link from "next/link"
import { ArrowLeft, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CollectionNotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <FolderOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-foreground">
            合集不存在
          </h1>
          <p className="font-body text-foreground/60 text-lg max-w-md mx-auto">
            這個合集可能已被刪除或設為私人。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/collections">
              <FolderOpen className="w-5 h-5 mr-2" />
              瀏覽所有合集
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回首頁
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
