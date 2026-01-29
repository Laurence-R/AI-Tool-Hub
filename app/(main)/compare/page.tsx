import { Metadata } from "next"
import { ComparePageClient } from "./ComparePageClient"
import { generatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = generatePageMetadata({
    title: "工具比較",
    description: "並排比較多個 AI 工具的功能、價格和用戶評價，幫助您做出最明智的選擇。",
    path: "/compare",
})

export default function ComparePage() {
    return <ComparePageClient />
}
