import Link from "next/link"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Lightbulb,
  Clock,
  Shield,
  FileCheck,
  AlertTriangle,
  Send,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SubmitGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 頁首 */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/submit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回提交頁面
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">提交指南</h1>
              <p className="text-muted-foreground">提交工具前請先閱讀以下指南</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* 審核標準 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                審核標準
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                為確保平台上工具的品質，我們會根據以下標準審核每個提交：
              </p>
              
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">真實可用</p>
                    <p className="text-sm text-muted-foreground">工具必須是真實存在且可正常訪問的</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">AI 相關</p>
                    <p className="text-sm text-muted-foreground">工具必須使用 AI 技術或與 AI 密切相關</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">描述清晰</p>
                    <p className="text-sm text-muted-foreground">工具描述必須清楚說明功能和用途</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">非重複</p>
                    <p className="text-sm text-muted-foreground">平台上尚未收錄的工具</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 不接受的內容 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="h-5 w-5" />
                不接受的內容
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {[
                  "違反法律或道德的工具",
                  "包含惡意軟體或釣魚連結",
                  "虛假或誇大的描述",
                  "與 AI 完全無關的工具",
                  "已被平台下架的工具",
                  "純粹的廣告或推廣內容",
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-red-600 dark:text-red-400"
                  >
                    <XCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 審核流程 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-purple-500" />
                審核流程
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* 時間線 */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700" />
                
                <div className="space-y-6">
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center z-10">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <div>
                      <p className="font-medium">提交工具</p>
                      <p className="text-sm text-muted-foreground">填寫表單並提交工具資訊</p>
                    </div>
                  </div>
                  
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center z-10">
                      <span className="text-amber-600 font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium">等待審核</p>
                      <p className="text-sm text-muted-foreground">我們的團隊將審核您的提交</p>
                    </div>
                  </div>
                  
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center z-10">
                      <span className="text-green-600 font-semibold">3</span>
                    </div>
                    <div>
                      <p className="font-medium">審核結果</p>
                      <p className="text-sm text-muted-foreground">通過站內通知和 Email 通知您審核結果</p>
                    </div>
                  </div>
                  
                  <div className="relative flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center z-10">
                      <span className="text-purple-600 font-semibold">4</span>
                    </div>
                    <div>
                      <p className="font-medium">工具上架</p>
                      <p className="text-sm text-muted-foreground">通過審核的工具將自動上架到平台</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 審核時間 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                審核時間
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">一般審核時間為 1-3 個工作天</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    實際時間取決於提交量。如果您的提交超過 5 個工作天仍未收到回覆，
                    請透過「聯絡我們」頁面與我們聯繫。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 常見問題 */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-cyan-500" />
                常見問題
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 rounded-lg bg-primary/5 border border-border/50">
                <p className="font-medium">Q: 可以提交自己開發的工具嗎？</p>
                <p className="text-sm text-muted-foreground mt-2">
                  A: 可以！我們歡迎開發者提交自己的作品，請在備註中說明您是開發者。
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-border/50">
                <p className="font-medium">Q: 工具被拒絕後可以重新提交嗎？</p>
                <p className="text-sm text-muted-foreground mt-2">
                  A: 可以。請根據我們提供的反饋進行修改後再次提交。
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-border/50">
                <p className="font-medium">Q: 如何修改已提交的資訊？</p>
                <p className="text-sm text-muted-foreground mt-2">
                  A: 目前暫不支援修改已提交的資訊。如需修改，請等待審核結果後重新提交。
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-border/50">
                <p className="font-medium">Q: 提交需要付費嗎？</p>
                <p className="text-sm text-muted-foreground mt-2">
                  A: 不需要！提交工具完全免費。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center py-6">
            <Button asChild size="lg" className="gap-2">
              <Link href="/submit">
                <Send className="h-5 w-5" />
                開始提交工具
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
