"use client"

import { Rocket, Users, Award, Zap, Globe, Star } from "lucide-react"

const milestones = [
  {
    year: "2024 Q1",
    icon: Rocket,
    title: "平台誕生",
    description: "AI Tool Hub 正式上線，收錄首批 50 款 AI 工具，開啟我們的旅程。",
  },
  {
    year: "2024 Q2",
    icon: Users,
    title: "社群成長",
    description: "用戶數突破 1,000 人，建立評價系統，讓用戶可以分享使用心得。",
  },
  {
    year: "2024 Q3",
    icon: Award,
    title: "功能升級",
    description: "推出工具比較功能和個人收藏夾，工具數量突破 200 款。",
  },
  {
    year: "2024 Q4",
    icon: Zap,
    title: "快速擴張",
    description: "活躍用戶突破 5,000 人，新增工具提交功能，讓社群參與平台建設。",
  },
  {
    year: "2025 Q1",
    icon: Globe,
    title: "國際化",
    description: "支援多語言介面，服務全球用戶，工具數量突破 350 款。",
  },
  {
    year: "2025 Q2",
    icon: Star,
    title: "持續創新",
    description: "推出 AI 智能推薦系統，根據用戶需求精準匹配最適合的工具。",
  },
]

export function Timeline() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            發展歷程
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            回顧我們的成長軌跡，展望未來的無限可能
          </p>
        </div>
        
        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-orange-500 to-secondary -translate-x-1/2 hidden md:block" />
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              const isLeft = index % 2 === 0
              
              return (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className="glass-card rounded-2xl p-6 inline-block max-w-md transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer">
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                        <span className="text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {milestone.year}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="font-body text-sm text-foreground/70 dark:text-foreground/60 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Center Icon */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full items-center justify-center z-10 shadow-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Mobile Icon */}
                  <div className="md:hidden w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Spacer for desktop */}
                  <div className="flex-1 hidden md:block" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
