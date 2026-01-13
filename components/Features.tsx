"use client"

import { Zap, Target, RefreshCw, Users } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "多維度比較",
    description: "依據口碑、使用人數、難度等級、價格方案進行全方位比較",
  },
  {
    icon: Users,
    title: "社群評價",
    description: "真實用戶回饋與使用心得，幫助你做出明智決策",
  },
  {
    icon: RefreshCw,
    title: "即時更新",
    description: "工具資訊持續更新，掌握最新功能與優惠",
  },
  {
    icon: Zap,
    title: "個人化工具庫",
    description: "打造專屬的工作流，收藏並管理你的 AI 工具組合",
  },
]

export function Features() {
  return (
    <section className="relative py-24 px-4">
      {/* Background Gradient for Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
            為什麼選擇 AI Tool Hub
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            我們提供最全面的 AI 工具資訊，讓你輕鬆找到最適合的解決方案
          </p>
        </div>

        {/* Features Grid (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group glass-card rounded-2xl p-8 transition-all duration-300 hover:border-primary hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-foreground/70 dark:text-foreground/60">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
