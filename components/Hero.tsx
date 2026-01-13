"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 px-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 animate-gradient" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cta/10 rounded-full blur-3xl animate-float-slow" />

      <div className="relative max-w-7xl mx-auto text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 glass-badge rounded-full px-4 py-2 mb-8 animate-fade-in-up">
          <Sparkles className="w-4 h-4 text-cta animate-pulse" />
          <span className="text-sm font-body font-medium text-foreground">
            已收錄 100+ AI 工具
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-heading font-bold text-5xl md:text-6xl lg:text-7xl text-foreground mb-6 leading-tight animate-fade-in-up animation-delay-100">
          打造你的
          <span className="bg-gradient-to-r from-primary via-cta to-secondary bg-clip-text text-transparent animate-gradient-x">
            {" "}AI 工具工作流
          </span>
        </h1>

        {/* Subheading */}
        <p className="font-body text-lg md:text-xl text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
          在眾多 AI 工具中找到最適合你的選擇。比較功能、查看評價、建立專屬的高效率工作流程。
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm font-body text-foreground/60 animate-fade-in-up animation-delay-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>10,000+ 活躍用戶</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-100" />
            <span>每日更新</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-200" />
            <span>真實用戶評價</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-fade-in-up animation-delay-400">
          <Button asChild size="lg" className="group shadow-lg hover:shadow-xl">
            <Link href="/tools">
              探索工具
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#features">
              了解更多
            </Link>
          </Button>
        </div>

        {/* Enhanced Floating Tool Cards Grid */}
        <div className="relative h-[500px] max-w-6xl mx-auto perspective-1000">
          {/* Background Glow Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-[15%] w-80 h-80 bg-primary/30 rounded-full blur-3xl animate-float" />
            <div className="absolute top-24 right-[10%] w-96 h-96 bg-secondary/25 rounded-full blur-3xl animate-float-delayed" />
            <div className="absolute bottom-20 left-[35%] w-72 h-72 bg-cta/20 rounded-full blur-3xl animate-float-slow" />
          </div>

          {/* Tool Card 1 - ChatGPT */}
          <div className="absolute top-0 left-[5%] w-56 glass-card rounded-2xl p-5 shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in animation-delay-500">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-2 shadow-md">
                <Image
                  src="/tools/chatgpt.png"
                  alt="ChatGPT"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">免費</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">ChatGPT</h3>
            <p className="text-sm text-foreground/60 font-body mb-3">AI 對話助手</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-foreground ml-1">4.8</span>
              </div>
              <span className="text-xs text-foreground/50">1.2M 用戶</span>
            </div>
          </div>

          {/* Tool Card 2 - Midjourney */}
          <div className="absolute top-16 right-[8%] w-56 glass-card rounded-2xl p-5 shadow-2xl hover:shadow-secondary/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in animation-delay-600">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-2 shadow-md">
                <Image
                  src="/tools/midjourney.png"
                  alt="Midjourney"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs px-2 py-1 bg-cta/10 text-cta rounded-full font-medium">付費</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">Midjourney</h3>
            <p className="text-sm text-foreground/60 font-body mb-3">AI 圖像生成</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-foreground ml-1">4.9</span>
              </div>
              <span className="text-xs text-foreground/50">850K 用戶</span>
            </div>
          </div>

          {/* Tool Card 3 - Claude */}
          <div className="absolute top-32 left-[20%] w-56 glass-card rounded-2xl p-5 shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in animation-delay-700">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-2 shadow-md">
                <Image
                  src="/tools/claude.png"
                  alt="Claude"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full font-medium">免費增值</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">Claude</h3>
            <p className="text-sm text-foreground/60 font-body mb-3">AI 助理</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-foreground ml-1">4.9</span>
              </div>
              <span className="text-xs text-foreground/50">620K 用戶</span>
            </div>
          </div>

          {/* Tool Card 4 - Notion AI */}
          <div className="absolute bottom-24 left-[12%] w-56 glass-card rounded-2xl p-5 shadow-2xl hover:shadow-secondary/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in animation-delay-800">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-2 shadow-md">
                <Image
                  src="/tools/notion.png"
                  alt="Notion AI"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">付費</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">Notion AI</h3>
            <p className="text-sm text-foreground/60 font-body mb-3">智慧筆記</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-foreground ml-1">4.7</span>
              </div>
              <span className="text-xs text-foreground/50">950K 用戶</span>
            </div>
          </div>

          {/* Tool Card 5 - GitHub Copilot */}
          <div className="absolute bottom-16 right-[15%] w-56 glass-card rounded-2xl p-5 shadow-2xl hover:shadow-cta/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in animation-delay-900">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-2 shadow-md">
                <Image
                  src="/tools/github-copilot.png"
                  alt="GitHub Copilot"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs px-2 py-1 bg-cta/10 text-cta rounded-full font-medium">付費</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">Copilot</h3>
            <p className="text-sm text-foreground/60 font-body mb-3">程式碼助手</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-foreground ml-1">4.6</span>
              </div>
              <span className="text-xs text-foreground/50">2.5M 用戶</span>
            </div>
          </div>

          {/* Tool Card 6 - Gemini */}
          <div className="absolute top-48 right-[25%] w-56 glass-card rounded-2xl p-5 shadow-2xl hover:shadow-primary/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in animation-delay-1000">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-2 shadow-md">
                <Image
                  src="/tools/gemini.png"
                  alt="Gemini"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full font-medium">免費</span>
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">Gemini</h3>
            <p className="text-sm text-foreground/60 font-body mb-3">Google AI</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-foreground ml-1">4.5</span>
              </div>
              <span className="text-xs text-foreground/50">1.8M 用戶</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
