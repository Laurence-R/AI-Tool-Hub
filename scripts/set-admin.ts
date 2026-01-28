// 設定用戶為管理員的腳本
// 使用方式: npx tsx scripts/set-admin.ts <user-email>

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.log("使用方式: npx tsx scripts/set-admin.ts <user-email>")
    console.log("")
    console.log("列出所有用戶:")
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true },
    })
    console.table(users)
    return
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error(`找不到 email 為 ${email} 的用戶`)
    return
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  })

  console.log(`已將 ${updatedUser.name || updatedUser.email} 設為管理員`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
