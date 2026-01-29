/**
 * 數據遷移腳本：將靜態 JSON 工具匯入資料庫
 * Phase 3.5 - 數據架構統一
 * 
 * 執行方式：npx tsx scripts/migrate-tools.ts
 */

import prisma from "../lib/prisma"
import toolsData from "../data/tools/tools.json"

interface JsonTool {
  id: number
  slug: string
  name: string
  description: string
  fullDescription?: string
  category: string
  pricing: string
  rating: number
  reviewCount: number
  logo: string
  tags: string[]
  url: string
  features: string[]
  pricingPlans?: Array<{
    name: string
    price: string
    period: string
    features: string[]
    recommended: boolean
  }>
  screenshots?: string[]
  relatedToolIds?: number[]
  createdAt?: string
  updatedAt?: string
}

async function migrateTools() {
  console.log("🚀 開始遷移工具數據...")
  console.log(`📦 找到 ${toolsData.length} 個工具待遷移\n`)

  const tools = toolsData as JsonTool[]
  let successCount = 0
  let errorCount = 0

  for (const tool of tools) {
    try {
      // 檢查是否已存在（使用 slug 作為唯一識別）
      const existing = await prisma.tool.findUnique({
        where: { slug: tool.slug },
      })

      if (existing) {
        console.log(`⏭️  跳過 [${tool.id}] ${tool.name} (已存在)`)
        continue
      }

      // 建立工具記錄
      await prisma.tool.create({
        data: {
          id: tool.id, // 保留原始 ID
          slug: tool.slug,
          name: tool.name,
          description: tool.description,
          fullDescription: tool.fullDescription || null,
          url: tool.url,
          logo: tool.logo || null,
          category: tool.category,
          pricing: tool.pricing,
          features: tool.features ? JSON.stringify(tool.features) : null,
          tags: tool.tags ? JSON.stringify(tool.tags) : null,
          pricingPlans: tool.pricingPlans ? JSON.stringify(tool.pricingPlans) : null,
          screenshots: tool.screenshots ? JSON.stringify(tool.screenshots) : null,
          relatedToolIds: tool.relatedToolIds ? JSON.stringify(tool.relatedToolIds) : null,
          rating: tool.rating || 0,
          reviewCount: tool.reviewCount || 0,
          isActive: true,
          isFeatured: false,
          order: tool.id, // 使用原始 ID 作為預設排序
          createdAt: tool.createdAt ? new Date(tool.createdAt) : new Date(),
          updatedAt: tool.updatedAt ? new Date(tool.updatedAt) : new Date(),
        },
      })

      console.log(`✅ 遷移成功 [${tool.id}] ${tool.name}`)
      successCount++
    } catch (error) {
      console.error(`❌ 遷移失敗 [${tool.id}] ${tool.name}:`, error)
      errorCount++
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log(`📊 遷移完成！`)
  console.log(`   ✅ 成功: ${successCount}`)
  console.log(`   ❌ 失敗: ${errorCount}`)
  console.log(`   ⏭️  跳過: ${tools.length - successCount - errorCount}`)
  console.log("=".repeat(50))

  // 驗證數據
  const dbCount = await prisma.tool.count()
  console.log(`\n🔍 資料庫工具總數: ${dbCount}`)

  // 列出所有工具
  const allTools = await prisma.tool.findMany({
    select: { id: true, name: true, category: true },
    orderBy: { id: "asc" },
  })

  console.log("\n📋 資料庫中的工具:")
  allTools.forEach((t) => {
    console.log(`   [${t.id}] ${t.name} (${t.category})`)
  })
}

async function main() {
  try {
    await migrateTools()
  } catch (error) {
    console.error("遷移過程發生錯誤:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
