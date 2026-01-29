"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // 可以在這裡記錄錯誤到錯誤追蹤服務
        console.error("Application error:", error)
    }, [error])

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* 錯誤圖示 */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-12 h-12 text-destructive" />
                    </div>
                </div>

                {/* 錯誤訊息 */}
                <div className="space-y-4">
                    <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground">
                        發生了一些錯誤
                    </h1>
                    <p className="font-body text-foreground/60 text-lg max-w-md mx-auto">
                        抱歉，處理您的請求時發生了意外錯誤。我們已經記錄了這個問題。
                    </p>
                    {error.digest && (
                        <p className="font-mono text-sm text-foreground/40">
                            錯誤代碼：{error.digest}
                        </p>
                    )}
                </div>

                {/* 操作按鈕 */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        onClick={reset}
                        size="lg" 
                        className="min-w-[160px]"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        重試
                    </Button>
                    <Button asChild variant="outline" size="lg" className="min-w-[160px]">
                        <Link href="/">
                            <Home className="w-5 h-5 mr-2" />
                            返回首頁
                        </Link>
                    </Button>
                </div>

                {/* 提示文字 */}
                <p className="font-body text-foreground/40 text-sm">
                    如果問題持續發生，請
                    <Link href="mailto:support@aitoolhub.com" className="text-primary hover:underline ml-1">
                        聯繫我們
                    </Link>
                </p>
            </div>
        </div>
    )
}
