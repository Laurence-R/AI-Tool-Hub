import { Metadata } from "next"
import { CollectionsPageClient } from "./CollectionsPageClient"

export const metadata: Metadata = {
  title: "工具合集 | AI Tool Hub",
  description: "探索社群分享的 AI 工具合集，或建立你自己的工具收藏",
  openGraph: {
    title: "工具合集 | AI Tool Hub",
    description: "探索社群分享的 AI 工具合集，或建立你自己的工具收藏",
  },
}

export default function CollectionsPage() {
  return <CollectionsPageClient />
}
