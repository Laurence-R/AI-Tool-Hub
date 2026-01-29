"use client"

import { useEffect, useState, useRef } from "react"
import { Wrench, Users, Star, Globe } from "lucide-react"

const stats = [
  {
    icon: Wrench,
    value: 500,
    suffix: "+",
    label: "收錄工具",
    description: "持續更新中",
  },
  {
    icon: Users,
    value: 10000,
    suffix: "+",
    label: "活躍用戶",
    description: "來自全球各地",
  },
  {
    icon: Star,
    value: 15000,
    suffix: "+",
    label: "用戶評價",
    description: "真實社群回饋",
  },
  {
    icon: Globe,
    value: 50,
    suffix: "+",
    label: "工具類別",
    description: "涵蓋各種領域",
  },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) {
      observer.observe(ref.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    if (!isVisible) return
    
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [isVisible, value])
  
  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-orange-500/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            平台數據
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            我們的成長離不開每一位用戶的支持
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="font-heading font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary via-secondary to-orange-500 bg-clip-text text-transparent mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-heading font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="font-body text-sm text-foreground/60">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
