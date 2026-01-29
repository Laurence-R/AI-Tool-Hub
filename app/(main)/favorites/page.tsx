import { Metadata } from "next"
import { FavoritesPageClient } from "./FavoritesPageClient"
import { generatePageMetadata } from "@/lib/seo"

export const metadata: Metadata = generatePageMetadata({
  title: "我的收藏",
  description: "管理您收藏的 AI 工具，快速存取喜愛的工具。",
  path: "/favorites",
  noIndex: true, // 個人頁面不需要被搜尋引擎索引
})

export default function FavoritesPage() {
  return <FavoritesPageClient />
}
