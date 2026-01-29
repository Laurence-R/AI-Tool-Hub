import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { AdminSubmissionsClient } from "./AdminSubmissionsClient"

export const metadata = {
  title: "提交審核 - 管理中心",
  description: "審核用戶提交的 AI 工具",
}

export default async function AdminSubmissionsPage() {
  const session = await auth()

  // 檢查是否登入
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin/submissions")
  }

  // 檢查是否為管理員
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return <AdminSubmissionsClient />
}
