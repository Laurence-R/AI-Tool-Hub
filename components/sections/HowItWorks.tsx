"use client"

import { Search, GitCompare, BookmarkPlus, Workflow } from "lucide-react"

const steps = [
  {
    icon: Search,
    number: "01",
    title: "瀏覽與搜尋",
    description: "探索超過 100 個精選 AI 工具，使用智慧搜尋快速找到你需要的",
  },
  {
    icon: GitCompare,
    number: "02",
    title: "比較功能",
    description: "並排比較工具的功能、價格、評價，做出最明智的選擇",
  },
  {
    icon: BookmarkPlus,
    number: "03",
    title: "建立工具庫",
    description: "收藏你喜歡的工具，建立個人化的工具管理清單",
  },
  {
    icon: Workflow,
    number: "04",
    title: "打造工作流",
    description: "組合不同工具，創建高效率的 AI 驅動工作流程",
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-24 px-4">
      {/* Background Gradient for Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-cta/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
            如何開始使用
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            只需四個簡單步驟，打造你的專屬 AI 工具生態系統
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Connector Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50" />
                )}

                <div className="relative">
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
                    <span className="font-heading font-bold text-white text-sm">
                      {step.number}
                    </span>
                  </div>

                  {/* Step Card */}
                  <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/30 dark:to-secondary/30 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm text-foreground/70 dark:text-foreground/60">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
