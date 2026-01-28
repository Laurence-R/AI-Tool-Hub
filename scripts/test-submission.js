const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const path = require('path');

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    // 查看數據庫中的工具
    const tools = await prisma.tool.findMany({ where: { isActive: true } });
    console.log('Database tools:', tools.length);
    tools.forEach(t => console.log('  -', t.id, t.name, t.category));
    
    // 查看已批准的提交
    const approvedSubmissions = await prisma.toolSubmission.findMany({ 
      where: { status: 'APPROVED' } 
    });
    console.log('\nApproved submissions:', approvedSubmissions.length);
    approvedSubmissions.forEach(s => console.log('  -', s.id, s.name));
    
    // 查看待審核的提交
    const pendingSubmissions = await prisma.toolSubmission.findMany({ 
      where: { status: 'PENDING' } 
    });
    console.log('\nPending submissions:', pendingSubmissions.length);
    pendingSubmissions.forEach(s => console.log('  -', s.id, s.name));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
