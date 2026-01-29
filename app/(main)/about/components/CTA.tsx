"use client"

import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-secondary/20 to-orange-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-3xl mx-auto text-center">
        {/* Glass Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            準備好探索 AI 工具了嗎？
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 mb-8 max-w-xl mx-auto">
            立即加入我們的社群，發現最適合你的 AI 工具，
            或成為貢獻者，幫助更多人找到優質工具。
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all cursor-pointer"
            >
              <Link href="/tools">
                探索工具庫
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 cursor-pointer"
            >
              <Link href="/contact">
                <Mail className="w-4 h-4 mr-2" />
                聯絡我們
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
