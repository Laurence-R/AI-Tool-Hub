"use client"

import Image from "next/image"
import { Star, TrendingUp } from "lucide-react"

const tools = [
  {
    name: "ChatGPT",
    description: "最強大的 AI 對話助手，支援多種語言與任務",
    category: "對話 AI",
    rating: 4.8,
    users: "100M+",
    difficulty: "簡單",
    logo: "/tools/chatgpt.png",
  },
  {
    name: "Notion AI",
    description: "智慧筆記工具，協助整理與生成內容",
    category: "生產力",
    rating: 4.6,
    users: "50M+",
    difficulty: "中等",
    logo: "/tools/notion.png",
  },
  {
    name: "Claude",
    description: "Anthropic 開發的 AI 助理，專注安全與準確",
    category: "對話 AI",
    rating: 4.9,
    users: "20M+",
    difficulty: "簡單",
    logo: "/tools/claude.png",
  },
  {
    name: "Midjourney",
    description: "頂尖 AI 圖像生成工具，創造驚人視覺作品",
    category: "圖像生成",
    rating: 4.7,
    users: "15M+",
    difficulty: "中等",
    logo: "/tools/midjourney.png",
  },
  {
    name: "GitHub Copilot",
    description: "AI 程式碼助手，提升開發效率",
    category: "開發工具",
    rating: 4.5,
    users: "10M+",
    difficulty: "簡單",
    logo: "/tools/github-copilot.png",
  },
  {
    name: "Gemini",
    description: "Google 最新 AI 模型，多模態智慧助手",
    category: "對話 AI",
    rating: 4.7,
    users: "30M+",
    difficulty: "簡單",
    logo: "/tools/gemini.png",
  },
]

export function PopularTools() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5 dark:to-primary/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 glass-badge rounded-full px-4 py-2 mb-4">
            <TrendingUp className="w-4 h-4 text-cta" />
            <span className="text-sm font-body font-medium text-foreground">
              熱門推薦
            </span>
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
            最受歡迎的 AI 工具
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            探索業界最熱門的 AI 工具，看看其他用戶都在使用什麼
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer"
            >
              {/* Tool Logo */}
              <div className="w-14 h-14 rounded-xl mb-4 overflow-hidden bg-white dark:bg-slate-800 p-2 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={tool.logo}
                  alt={`${tool.name} logo`}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>

              {/* Tool Info */}
              <div className="mb-4">
                <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
                  {tool.name}
                </h3>
                <p className="text-xs font-body text-primary font-medium mb-2">
                  {tool.category}
                </p>
                <p className="font-body text-sm text-foreground/70 dark:text-foreground/60">
                  {tool.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-body font-semibold text-foreground">
                    {tool.rating}
                  </span>
                </div>
                <span className="text-xs font-body text-foreground/60">
                  {tool.users} 用戶
                </span>
                <span className={`text-xs font-body font-medium px-2 py-1 rounded-full ${
                  tool.difficulty === "簡單"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                }`}>
                  {tool.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="glass-badge text-foreground font-body font-semibold px-8 py-4 rounded-full transition-all duration-200 cursor-pointer hover:border-primary hover:text-primary hover:shadow-lg">
            查看所有工具
          </button>
        </div>
      </div>
    </section>
  )
}
