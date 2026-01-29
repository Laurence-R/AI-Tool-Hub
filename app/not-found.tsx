import Link from "next/link"
import { ArrowLeft, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* 404 視覺效果 */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <span className="font-heading font-bold text-[20rem] text-foreground select-none">
                            404
                        </span>
                    </div>
                    <div className="relative space-y-4 py-12">
                        <h1 className="font-heading font-bold text-6xl lg:text-8xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            404
                        </h1>
                        <h2 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
                            頁面未找到
                        </h2>
                        <p className="font-body text-foreground/60 text-lg max-w-md mx-auto">
                            抱歉，您訪問的頁面不存在、已被移除或暫時無法使用。
                        </p>
                    </div>
                </div>

                {/* 操作按鈕 */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="min-w-[160px]">
                        <Link href="/">
                            <Home className="w-5 h-5 mr-2" />
                            返回首頁
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                        <Link href="/tools">
                            <Search className="w-5 h-5 mr-2" />
                            探索工具
                        </Link>
                    </Button>
                </div>

                {/* 提示文字 */}
                <p className="font-body text-foreground/40 text-sm">
                    如果您認為這是一個錯誤，請
                    <Link href="mailto:support@aitoolhub.com" className="text-primary hover:underline ml-1">
                        聯繫我們
                    </Link>
                </p>
            </div>
        </div>
    )
}
