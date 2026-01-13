"use client"

import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "張小明",
    role: "產品經理",
    company: "科技新創",
    content: "AI Tool Hub 幫助我快速找到適合團隊的 AI 工具。比較功能特別實用，省去大量研究時間！",
    avatar: "from-blue-500 to-blue-600",
  },
  {
    name: "李美玲",
    role: "內容創作者",
    company: "自由工作者",
    content: "作為創作者，我需要各種 AI 工具輔助。這個平台讓我一次掌握所有選項，真的很方便。",
    avatar: "from-purple-500 to-purple-600",
  },
  {
    name: "王大衛",
    role: "軟體工程師",
    company: "資訊服務業",
    content: "社群評價功能很棒，可以看到其他開發者的真實使用心得。已經推薦給所有同事了！",
    avatar: "from-orange-500 to-orange-600",
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">
            用戶怎麼說
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            來自真實用戶的使用心得與回饋
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Testimonial Content */}
              <p className="font-body text-foreground/80 dark:text-foreground/70 mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.avatar} rounded-full flex items-center justify-center`}>
                  <span className="font-heading font-bold text-white text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>

                {/* Name & Role */}
                <div>
                  <h4 className="font-heading font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm font-body text-foreground/60">
                    {testimonial.role} · {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
