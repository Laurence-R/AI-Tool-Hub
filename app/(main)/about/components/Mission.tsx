"use client"

import { Target, Lightbulb, Heart } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "使命",
    description: "在 AI 快速發展的時代，我們相信每個人都應該能輕鬆找到適合自己需求的 AI 工具。我們的使命是建立一個公正、透明的 AI 工具評測平台。",
  },
  {
    icon: Lightbulb,
    title: "願景",
    description: "成為全球最受信賴的 AI 工具資源平台，讓創作者、開發者和企業都能透過我們的平台，快速找到能提升效率的 AI 解決方案。",
  },
  {
    icon: Heart,
    title: "價值觀",
    description: "我們重視社群的力量，相信真實用戶的評價才是最有價值的參考。我們致力於提供客觀、詳細的工具資訊，幫助用戶做出明智的選擇。",
  },
]

export function Mission() {
  return (
    <section className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            我們的理念
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            以用戶需求為核心，打造值得信賴的 AI 工具生態系統
          </p>
        </div>
        
        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="group glass-card rounded-2xl p-8 transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-foreground/70 dark:text-foreground/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
