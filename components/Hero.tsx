"use client"

import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 px-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 glass-badge rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-cta" />
          <span className="text-sm font-body font-medium text-foreground">
            已收錄 100+ AI 工具
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight">
          打造你的
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {" "}AI 工具工作流
          </span>
        </h1>

        {/* Subheading */}
        <p className="font-body text-lg md:text-xl text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto mb-8">
          在眾多 AI 工具中找到最適合你的選擇。比較功能、查看評價、建立專屬的高效率工作流程。
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm font-body text-foreground/60">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>10,000+ 活躍用戶</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>每日更新</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>真實用戶評價</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group bg-cta hover:bg-cta/90 text-white font-body font-semibold px-8 py-4 rounded-full transition-all duration-200 cursor-pointer flex items-center space-x-2 shadow-lg hover:shadow-xl">
            <span>探索工具</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
          <button className="glass-badge text-foreground font-body font-semibold px-8 py-4 rounded-full transition-all duration-200 cursor-pointer hover:border-primary hover:text-primary">
            了解更多
          </button>
        </div>

        {/* Floating Tool Cards Preview (Glassmorphism) */}
        <div className="relative h-64 max-w-4xl mx-auto">
          {/* Colorful Gradient Background Blobs */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-[20%] w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-12 right-[10%] w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[30%] w-56 h-56 bg-cta/50 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[50%] w-56 h-56 bg-cta/60 rounded-full blur-3xl" />
          </div>

          {/* Card 1 */}
          <div className="absolute top-0 left-[10%] w-48 glass-card rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="w-10 h-10 rounded-lg mb-3 overflow-hidden bg-white dark:bg-slate-800 p-1.5">
              <Image
                src="/tools/chatgpt.png"
                alt="ChatGPT logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="font-heading font-semibold text-sm text-foreground mb-1">ChatGPT</h3>
            <p className="text-xs text-foreground/60 font-body">AI 對話助手</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-yellow-500">⭐ 4.8</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="absolute top-12 right-[15%] w-48 glass-card rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="w-10 h-10 rounded-lg mb-3 overflow-hidden bg-white dark:bg-slate-800 p-1.5">
              <Image
                src="/tools/notion.png"
                alt="Notion AI logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="font-heading font-semibold text-sm text-foreground mb-1">Notion AI</h3>
            <p className="text-xs text-foreground/60 font-body">智慧筆記</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-yellow-500">⭐ 4.6</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="absolute bottom-8 left-[25%] w-48 glass-card rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="w-10 h-10 rounded-lg mb-3 overflow-hidden bg-white dark:bg-slate-800 p-1.5">
              <Image
                src="/tools/claude.png"
                alt="Claude logo"
                width={40}
                height={40}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="font-heading font-semibold text-sm text-foreground mb-1">Claude</h3>
            <p className="text-xs text-foreground/60 font-body">AI 助理</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-yellow-500">⭐ 4.9</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
