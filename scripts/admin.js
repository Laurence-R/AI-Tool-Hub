// 查詢並設定管理員
// 執行方式: node --experimental-strip-types --no-warnings scripts/admin.js [email]

import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'dev.db')

const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.argv[2]
  
  // 列出所有用戶
  console.log('\n=== 資料庫中的用戶 ===')
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true }
  })
  
  if (users.length === 0) {
    console.log('目前沒有任何用戶')
    return
  }
  
  users.forEach((u, i) => {
    console.log(`${i + 1}. ${u.email} (${u.name || '未設定名稱'}) - 角色: ${u.role}`)
  })
  
  if (email) {
    console.log(`\n正在將 ${email} 設為管理員...`)
    try {
      const updated = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      })
      console.log(`✓ 已將 ${updated.name || updated.email} 設為管理員`)
    } catch (e) {
      console.error(`✗ 找不到 email 為 ${email} 的用戶`)
    }
  } else {
    console.log('\n若要設定管理員，請執行: node scripts/admin.js <email>')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
