"use client"

import { Mail, MapPin, Clock, Github, Twitter } from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    content: "support@aitoolhub.com",
    description: "我們會在 24-48 小時內回覆",
  },
  {
    icon: MapPin,
    title: "地點",
    content: "台北市信義區",
    description: "台灣 🇹🇼",
  },
  {
    icon: Clock,
    title: "服務時間",
    content: "週一至週五",
    description: "09:00 - 18:00 (GMT+8)",
  },
]

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/aitoolhub",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com/aitoolhub",
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
          其他聯絡方式
        </h2>
        
        <div className="space-y-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground">
                    {method.title}
                  </h3>
                  <p className="font-body text-foreground/90">
                    {method.content}
                  </p>
                  <p className="font-body text-sm text-foreground/60">
                    {method.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Social Links */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="font-heading font-bold text-xl text-foreground mb-4">
          追蹤我們
        </h2>
        <p className="font-body text-foreground/70 dark:text-foreground/60 mb-6">
          關注我們的社群媒體，獲取最新 AI 工具資訊和平台更新。
        </p>
        
        <div className="flex gap-4">
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl bg-foreground/5 hover:bg-primary/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5 text-foreground/60 hover:text-primary" />
              </a>
            )
          })}
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="glass-card rounded-2xl p-8 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
        <h2 className="font-heading font-bold text-xl text-foreground mb-3">
          需要緊急協助？
        </h2>
        <p className="font-body text-foreground/70 dark:text-foreground/60">
          如果您遇到帳號安全問題或緊急情況，請在訊息主旨標註「緊急」，我們會優先處理您的請求。
        </p>
      </div>
    </div>
  )
}
