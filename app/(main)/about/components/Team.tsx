"use client"

import Image from "next/image"
import { Github, Linkedin, Twitter } from "lucide-react"

const team = [
  {
    name: "Alex Chen",
    role: "創辦人 & CEO",
    avatar: "/images/team/alex.jpg",
    bio: "前 Google 工程師，對 AI 技術充滿熱情。2024 年創立 AI Tool Hub，致力於讓 AI 工具更容易被發現和使用。",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Emily Wang",
    role: "產品總監",
    avatar: "/images/team/emily.jpg",
    bio: "擁有 10 年產品設計經驗，曾在 Meta 和 Stripe 擔任資深設計師。專注於打造直覺且美觀的用戶體驗。",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "David Liu",
    role: "技術長",
    avatar: "/images/team/david.jpg",
    bio: "全端開發專家，熱衷於開源技術。負責平台架構設計和技術創新，確保用戶享有最佳的使用體驗。",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
  {
    name: "Sarah Kim",
    role: "社群經理",
    avatar: "/images/team/sarah.jpg",
    bio: "負責建立和維護 AI Tool Hub 社群。她相信真實用戶的聲音是最寶貴的資產，致力於促進用戶間的交流。",
    social: {
      twitter: "#",
      linkedin: "#",
      github: "#",
    },
  },
]

function TeamMemberCard({ member }: { member: typeof team[0] }) {
  return (
    <div className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-xl cursor-pointer">
      {/* Avatar */}
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary p-[2px]">
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
          <span className="font-heading font-bold text-2xl text-primary">
            {member.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
      </div>
      
      {/* Info */}
      <div className="text-center">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-1">
          {member.name}
        </h3>
        <p className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3">
          {member.role}
        </p>
        <p className="font-body text-sm text-foreground/70 dark:text-foreground/60 leading-relaxed mb-4">
          {member.bio}
        </p>
        
        {/* Social Links */}
        <div className="flex items-center justify-center gap-3">
          <a
            href={member.social.twitter}
            className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-primary/10 flex items-center justify-center transition-colors"
            aria-label={`${member.name} 的 Twitter`}
          >
            <Twitter className="w-4 h-4 text-foreground/60 hover:text-primary" />
          </a>
          <a
            href={member.social.linkedin}
            className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-primary/10 flex items-center justify-center transition-colors"
            aria-label={`${member.name} 的 LinkedIn`}
          >
            <Linkedin className="w-4 h-4 text-foreground/60 hover:text-primary" />
          </a>
          <a
            href={member.social.github}
            className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-primary/10 flex items-center justify-center transition-colors"
            aria-label={`${member.name} 的 GitHub`}
          >
            <Github className="w-4 h-4 text-foreground/60 hover:text-primary" />
          </a>
        </div>
      </div>
    </div>
  )
}

export function Team() {
  return (
    <section className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            認識我們的團隊
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60 max-w-2xl mx-auto">
            一群熱愛 AI 技術的夢想家，共同打造這個平台
          </p>
        </div>
        
        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}
