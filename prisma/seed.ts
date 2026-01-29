import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import path from 'path';

// 建立 Prisma Client - 資料庫在根目錄
const adapter = new PrismaLibSql({
  url: `file:${path.join(process.cwd(), 'dev.db')}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 開始建立種子資料...\n');

  // 密碼規範：至少 8 個字元、包含大寫、小寫、數字
  const adminPasswordPlain = 'Admin123';
  const userPasswordPlain = 'User1234';

  // 建立管理員帳號
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'admin-user-id',
      email: 'admin@example.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log(`✅ 管理員帳號已建立: ${admin.email}`);

  // 建立測試用戶
  const userPassword = await bcrypt.hash(userPasswordPlain, 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      id: 'test-user-id',
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log(`✅ 測試用戶已建立: ${user.email}`);

  console.log('\n==================================================');
  console.log('📊 種子資料建立完成！');
  console.log('==================================================');
  console.log('\n帳號資訊（密碼符合規範：8字元以上、含大小寫字母及數字）：');
  console.log(`  管理員：admin@example.com / ${adminPasswordPlain}`);
  console.log(`  測試用戶：user@example.com / ${userPasswordPlain}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
