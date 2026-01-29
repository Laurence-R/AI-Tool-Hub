"use client"

import { MessageCircle } from "lucide-react"

export function ContactHero() {
  return (
    <section className="relative pt-32 pb-16 px-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass-badge px-4 py-2 rounded-full mb-8">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground/80">聯絡我們</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
          我們很樂意
          <span className="block bg-gradient-to-r from-primary via-secondary to-orange-500 bg-clip-text text-transparent">
            聽取您的意見
          </span>
        </h1>
        
        {/* Description */}
        <p className="font-body text-lg md:text-xl text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto leading-relaxed">
          無論是問題回報、功能建議或合作洽談，我們都期待您的來信。
          我們會在 24-48 小時內回覆您。
        </p>
      </div>
    </section>
  )
}
