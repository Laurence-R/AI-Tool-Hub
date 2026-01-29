"use client"

import { Sparkles } from "lucide-react"

export function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-badge px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">關於我們</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
          讓每個人都能找到
          <span className="block bg-gradient-to-r from-primary via-secondary to-orange-500 bg-clip-text text-transparent">
            最適合的 AI 工具
          </span>
        </h1>
        
        {/* Description */}
        <p className="font-body text-lg md:text-xl text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          AI Tool Hub 是一個專為 AI 愛好者、創作者和專業人士打造的平台，
          致力於整理、評測和推薦全球最優質的 AI 工具。
        </p>
      </div>
    </section>
  )
}
