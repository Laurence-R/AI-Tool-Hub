import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DashboardContent } from "./DashboardContent"

export const metadata = {
  title: "個人中心 - AI Tool Hub",
  description: "管理您的 AI Tool Hub 帳號、收藏和評論",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard")
  }

  return <DashboardContent user={session.user} />
}
