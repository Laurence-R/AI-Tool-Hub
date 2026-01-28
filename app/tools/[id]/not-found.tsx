import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-4">
                    <h1 className="font-heading font-bold text-6xl lg:text-8xl text-foreground">
                        404
                    </h1>
                    <h2 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
                        工具未找到
                    </h2>
                    <p className="font-body text-foreground/60 text-lg max-w-md mx-auto">
                        抱歉，您訪問的工具頁面不存在或已被移除。
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg">
                        <Link href="/tools">
                            <Search className="w-5 h-5 mr-2" />
                            探索所有工具
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
