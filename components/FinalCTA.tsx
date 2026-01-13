"use client"

import { ArrowRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32 blur-3xl" />

          <div className="relative z-10">
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-white mb-4">
              準備好提升你的工作效率了嗎？
            </h2>
            <p className="font-body text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              立即加入 AI Tool Hub，探索超過 100 個精選 AI 工具，打造專屬的高效工作流
            </p>

            <button className="group bg-white text-primary font-body font-semibold px-8 py-4 rounded-full transition-all duration-200 cursor-pointer hover:bg-white/90 shadow-xl hover:shadow-2xl flex items-center space-x-2 mx-auto">
              <span>立即開始</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
