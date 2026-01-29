import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout"

export const metadata: Metadata = {
    title: "隱私權政策 | AI Tool Hub",
    description: "AI Tool Hub 的隱私權政策，說明我們如何收集、使用和保護您的個人資料。",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background pt-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* 返回按鈕 */}
                <div className="mb-8">
                    <Button variant="ghost" asChild>
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            返回首頁
                        </Link>
                    </Button>
                </div>

                {/* 標題 */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-heading font-bold text-3xl text-foreground">
                            隱私權政策
                        </h1>
                        <p className="text-foreground/60 text-sm mt-1">
                            最後更新日期：2026 年 1 月 29 日
                        </p>
                    </div>
                </div>

                {/* 內容 */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            1. 資料收集
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            AI Tool Hub 收集以下類型的資料：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li><strong>帳戶資訊：</strong>當您註冊帳戶時，我們會收集您的電子郵件地址和使用者名稱。</li>
                            <li><strong>使用資料：</strong>我們自動收集您如何使用我們服務的資訊，包括瀏覽的頁面、搜尋查詢和互動行為。</li>
                            <li><strong>裝置資訊：</strong>我們可能會收集您裝置的相關資訊，如瀏覽器類型、作業系統和 IP 位址。</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            2. 資料使用
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            我們使用收集的資料來：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>提供、維護和改進我們的服務</li>
                            <li>處理您的帳戶註冊和管理</li>
                            <li>根據您的喜好和興趣提供個人化推薦</li>
                            <li>發送與服務相關的通知和更新</li>
                            <li>防止詐欺和濫用行為</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            3. 資料安全
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            我們採取適當的技術和組織措施來保護您的個人資料，包括加密傳輸、安全儲存和存取控制。
                            然而，沒有任何網際網路傳輸或電子儲存方法是完全安全的，我們無法保證絕對的安全性。
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            4. Cookie 使用
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            我們使用 Cookie 和類似技術來：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>保持您的登入狀態</li>
                            <li>記住您的偏好設定</li>
                            <li>分析網站流量和使用模式</li>
                        </ul>
                        <p className="text-foreground/80 leading-relaxed mt-4">
                            您可以透過瀏覽器設定來管理或停用 Cookie，但這可能會影響某些功能的使用。
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            5. 第三方服務
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            我們可能會使用第三方服務來協助我們運營，例如分析工具和身份驗證服務。
                            這些第三方可能會收集和處理您的資料，請參閱他們各自的隱私權政策。
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            6. 您的權利
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            您擁有以下權利：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>存取和查看您的個人資料</li>
                            <li>更正不準確的資料</li>
                            <li>要求刪除您的帳戶和相關資料</li>
                            <li>取消訂閱行銷通訊</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            7. 政策變更
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            我們可能會不時更新本隱私權政策。任何變更將在本頁面公布，並更新「最後更新日期」。
                            我們建議您定期查看本政策以了解任何變更。
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            8. 聯繫我們
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            如果您對本隱私權政策有任何疑問或意見，請透過以下方式聯繫我們：
                        </p>
                        <p className="text-foreground/80">
                            電子郵件：<a href="mailto:privacy@aitoolhub.com" className="text-primary hover:underline">privacy@aitoolhub.com</a>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    )
}
