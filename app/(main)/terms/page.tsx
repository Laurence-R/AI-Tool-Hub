import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout"

export const metadata: Metadata = {
    title: "服務條款 | AI Tool Hub",
    description: "AI Tool Hub 的服務條款，規範使用者使用本平台的權利和義務。",
}

export default function TermsPage() {
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
                        <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-heading font-bold text-3xl text-foreground">
                            服務條款
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
                            1. 服務說明
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            AI Tool Hub（以下簡稱「本平台」）是一個 AI 工具發現與分享平台，
                            提供使用者瀏覽、搜尋、比較和評論各類 AI 工具的服務。
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            2. 帳戶註冊
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            使用本平台的部分功能需要註冊帳戶。註冊時，您同意：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>提供真實、準確、完整的資訊</li>
                            <li>維護帳戶資訊的更新</li>
                            <li>保護您的帳戶安全，不與他人共享登入資訊</li>
                            <li>對您帳戶下的所有活動負責</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            3. 使用者行為規範
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            使用本平台時，您同意不會：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>發布虛假、誤導或詐欺性內容</li>
                            <li>侵犯他人的智慧財產權或其他權利</li>
                            <li>發布攻擊性、騷擾性或歧視性內容</li>
                            <li>嘗試未經授權存取本平台的系統或其他使用者的帳戶</li>
                            <li>使用自動化工具大量抓取或下載內容</li>
                            <li>從事任何可能損害本平台運營的行為</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            4. 內容提交
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            當您提交工具資訊或評論時：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>您保證提交的內容真實、準確且不侵犯他人權利</li>
                            <li>您授予本平台非獨占性的使用權，以展示和推廣您提交的內容</li>
                            <li>本平台保留審核、編輯或刪除任何內容的權利</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            5. 第三方工具
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            本平台展示的 AI 工具由第三方提供。我們不對這些工具的功能、安全性、
                            定價或服務品質提供任何保證。使用這些工具時，請遵循各工具的服務條款和隱私權政策。
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            6. 智慧財產權
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            本平台的設計、商標、標誌和其他內容均受智慧財產權法保護。
                            未經書面許可，不得複製、修改、分發或以任何方式使用這些內容。
                        </p>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            7. 免責聲明
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            本平台按「現狀」提供服務，不提供任何明示或暗示的保證。我們不對以下情況負責：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>服務中斷或錯誤</li>
                            <li>使用者提交的內容的準確性</li>
                            <li>第三方工具造成的任何損害</li>
                            <li>因使用本平台而產生的任何直接或間接損失</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            8. 帳戶終止
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            本平台保留在以下情況下終止或暫停您帳戶的權利：
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                            <li>違反本服務條款</li>
                            <li>從事詐欺或非法活動</li>
                            <li>長期未使用帳戶</li>
                        </ul>
                    </section>

                    <section className="space-y-4 mb-8">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            9. 條款變更
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            我們可能會不時修改本服務條款。重大變更將透過電子郵件或平台通知告知。
                            繼續使用本平台即表示您同意修改後的條款。
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="font-heading font-semibold text-xl text-foreground">
                            10. 聯繫我們
                        </h2>
                        <p className="text-foreground/80 leading-relaxed">
                            如果您對本服務條款有任何疑問，請透過以下方式聯繫我們：
                        </p>
                        <p className="text-foreground/80">
                            電子郵件：<a href="mailto:legal@aitoolhub.com" className="text-primary hover:underline">legal@aitoolhub.com</a>
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    )
}
