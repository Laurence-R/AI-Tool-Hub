"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "如何提交新的 AI 工具？",
    answer: "您可以在登入後，點選「提交工具」按鈕來提交新工具。請填寫工具名稱、描述、官網連結等資訊，我們的團隊會在 3-5 個工作天內審核您的提交。",
  },
  {
    question: "我的評價什麼時候會顯示？",
    answer: "您提交的評價會立即顯示在工具頁面上。我們採用即時發佈機制，但會透過演算法過濾明顯的垃圾評價。",
  },
  {
    question: "如何修改我的帳號資訊？",
    answer: "登入後，點擊右上角的頭像，選擇「個人資料」即可進入個人設定頁面。您可以在此修改名稱、頭像、密碼等資訊。",
  },
  {
    question: "平台是否接受廣告或贊助？",
    answer: "我們目前不接受付費排名或隱藏式廣告。所有工具排名都是基於用戶評價和實際數據。如有商業合作需求，歡迎透過表單聯絡我們。",
  },
  {
    question: "如何回報錯誤的工具資訊？",
    answer: "如果您發現某個工具的資訊有誤，可以在該工具頁面點擊「回報問題」按鈕，或直接透過此頁面的聯絡表單告訴我們。",
  },
  {
    question: "可以申請成為平台編輯嗎？",
    answer: "我們歡迎有熱情的社群成員加入編輯團隊！請透過聯絡表單說明您的背景和動機，我們會評估後與您聯繫。",
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left cursor-pointer"
      >
        <span className="font-heading font-semibold text-foreground pr-4">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-foreground/60 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="font-body text-foreground/70 dark:text-foreground/60 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  )
}

export function FAQ() {
  return (
    <section className="relative py-24 px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="relative max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
            常見問題
          </h2>
          <p className="font-body text-lg text-foreground/70 dark:text-foreground/60">
            找不到答案？歡迎透過上方表單聯絡我們
          </p>
        </div>
        
        {/* FAQ List */}
        <div className="glass-card rounded-2xl p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
