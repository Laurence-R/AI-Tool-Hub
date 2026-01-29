"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, CheckCircle2 } from "lucide-react"

const contactReasons = [
  { value: "general", label: "一般詢問" },
  { value: "feedback", label: "功能建議" },
  { value: "bug", label: "問題回報" },
  { value: "partnership", label: "商業合作" },
  { value: "press", label: "媒體聯繫" },
  { value: "other", label: "其他" },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // 模擬提交（實際實作時可接入 API 或郵件服務）
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="font-heading font-semibold text-2xl text-foreground mb-3">
          訊息已送出！
        </h3>
        <p className="font-body text-foreground/70 dark:text-foreground/60 mb-6">
          感謝您的來信，我們會在 24-48 小時內回覆您。
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false)
            setFormData({ name: "", email: "", reason: "", subject: "", message: "" })
          }}
          variant="outline"
          className="cursor-pointer"
        >
          發送另一則訊息
        </Button>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-8">
      <h2 className="font-heading font-bold text-2xl text-foreground mb-6">
        發送訊息
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              placeholder="您的姓名"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        {/* Reason */}
        <div className="space-y-2">
          <Label htmlFor="reason">聯絡原因</Label>
          <Select
            value={formData.reason}
            onValueChange={(value) => setFormData({ ...formData, reason: value })}
            disabled={isSubmitting}
          >
            <SelectTrigger id="reason">
              <SelectValue placeholder="請選擇聯絡原因" />
            </SelectTrigger>
            <SelectContent>
              {contactReasons.map((reason) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">主旨</Label>
          <Input
            id="subject"
            placeholder="簡述您的問題或建議"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
            disabled={isSubmitting}
          />
        </div>
        
        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">訊息內容</Label>
          <Textarea
            id="message"
            placeholder="請詳細描述您的問題或建議..."
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            disabled={isSubmitting}
            className="resize-none"
          />
        </div>
        
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              發送中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              發送訊息
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
