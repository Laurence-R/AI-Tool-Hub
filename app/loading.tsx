import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-24">
            <div className="text-center space-y-6">
                {/* 載入動畫 */}
                <div className="flex justify-center">
                    <div className="relative">
                        {/* 外層光暈 */}
                        <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-ping" />
                        {/* 旋轉圖示 */}
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    </div>
                </div>

                {/* 載入文字 */}
                <div className="space-y-2">
                    <p className="font-heading font-semibold text-lg text-foreground">
                        載入中
                    </p>
                    <p className="font-body text-foreground/60 text-sm">
                        請稍候...
                    </p>
                </div>

                {/* 載入條 */}
                <div className="w-48 h-1 mx-auto bg-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-loading-bar" />
                </div>
            </div>
        </div>
    )
}
