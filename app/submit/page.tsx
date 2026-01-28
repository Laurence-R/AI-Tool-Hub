"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Send, 
  Lightbulb, 
  ArrowLeft,
  Plus,
  X,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  Tag,
  DollarSign,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// 類別選項
const CATEGORIES = [
  { value: "writing", label: "寫作助手" },
  { value: "image", label: "圖像生成" },
  { value: "video", label: "影片製作" },
  { value: "audio", label: "音訊處理" },
  { value: "coding", label: "程式開發" },
  { value: "productivity", label: "生產力工具" },
  { value: "research", label: "研究分析" },
  { value: "marketing", label: "行銷工具" },
  { value: "education", label: "教育學習" },
  { value: "chatbot", label: "聊天機器人" },
  { value: "other", label: "其他" },
]

// 定價選項
const PRICING_OPTIONS = [
  { value: "free", label: "免費" },
  { value: "freemium", label: "免費增值" },
  { value: "paid", label: "付費" },
  { value: "subscription", label: "訂閱制" },
]

export default function SubmitPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // 表單狀態
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    logo: "",
    category: "",
    pricing: "",
    submitterNote: "",
  })
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  // 驗證錯誤
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 處理表單變更
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // 清除該欄位的錯誤
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // 新增特色功能
  const addFeature = () => {
    if (newFeature.trim() && features.length < 10) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  // 移除特色功能
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // 新增標籤
  const addTag = () => {
    if (newTag.trim() && tags.length < 5) {
      setTags([...tags, newTag.trim().toLowerCase()])
      setNewTag("")
    }
  }

  // 移除標籤
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "請輸入工具名稱"
    }
    if (!formData.description.trim()) {
      newErrors.description = "請輸入工具描述"
    } else if (formData.description.length < 20) {
      newErrors.description = "描述至少需要 20 個字"
    }
    if (!formData.url.trim()) {
      newErrors.url = "請輸入工具網址"
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = "請輸入有效的網址"
      }
    }
    // 驗證 Logo URL（如果有填寫）
    if (formData.logo.trim()) {
      try {
        const logoUrl = new URL(formData.logo)
        // 檢查是否為常見的圖片格式或知名圖片服務
        const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
        const validHosts = ['googleusercontent.com', 'githubusercontent.com', 'imgur.com', 'cloudinary.com', 'unsplash.com']
        const hasValidExtension = validExtensions.some(ext => logoUrl.pathname.toLowerCase().endsWith(ext))
        const isValidHost = validHosts.some(host => logoUrl.hostname.includes(host))
        
        if (!hasValidExtension && !isValidHost) {
          // 只是警告，不阻止提交
          toast.warning("Logo 網址可能不是有效的圖片連結，建議使用 .png、.jpg 等格式")
        }
      } catch {
        newErrors.logo = "請輸入有效的圖片網址"
      }
    }
    if (!formData.category) {
      newErrors.category = "請選擇類別"
    }
    if (!formData.pricing) {
      newErrors.pricing = "請選擇定價模式"
    }
    if (features.length === 0) {
      newErrors.features = "請至少新增一項特色功能"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("請修正表單中的錯誤")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features,
          tags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "提交失敗")
      }

      setIsSuccess(true)
      toast.success("提交成功！")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "提交失敗")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 載入中
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // 未登入
  if (!session) {
    router.push("/login?callbackUrl=/submit")
    return null
  }

  // 提交成功
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-3">提交成功！</h1>
              <p className="text-muted-foreground mb-8">
                感謝您提交工具！我們的團隊將盡快審核，審核結果將通過站內通知和 Email 通知您。
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/dashboard">查看我的提交</Link>
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsSuccess(false)
                  setFormData({
                    name: "",
                    description: "",
                    url: "",
                    logo: "",
                    category: "",
                    pricing: "",
                    submitterNote: "",
                  })
                  setFeatures([])
                  setTags([])
                }}>
                  繼續提交
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 pt-28 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 頁首 */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首頁
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Send className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">提交 AI 工具</h1>
              <p className="text-muted-foreground">分享您發現的優秀 AI 工具</p>
            </div>
          </div>
          <Link 
            href="/submit/guide" 
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            查看提交指南
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* 基本資訊 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  基本資訊
                </CardTitle>
                <CardDescription>填寫工具的基本資訊</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      工具名稱 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="例如：ChatGPT"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">
                      工具網址 <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.url}
                        onChange={handleChange}
                        className={`pl-9 ${errors.url ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.url && (
                      <p className="text-sm text-red-500">{errors.url}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    工具描述 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="請詳細描述這個工具的功能和用途..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  <div className="flex justify-between">
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground ml-auto">
                      {formData.description.length} / 500
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">
                    Logo 網址（可選）
                  </Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="logo"
                      name="logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={formData.logo}
                      onChange={handleChange}
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    建議使用 PNG 或 SVG 格式，尺寸至少 128x128
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 分類與定價 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  分類與定價
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      類別 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="選擇類別" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      定價模式 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.pricing}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, pricing: value }))
                      }
                    >
                      <SelectTrigger className={errors.pricing ? "border-red-500" : ""}>
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="選擇定價模式" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICING_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pricing && (
                      <p className="text-sm text-red-500">{errors.pricing}</p>
                    )}
                  </div>
                </div>

                {/* 標籤 */}
                <div className="space-y-2">
                  <Label>標籤（最多 5 個）</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="輸入標籤"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTag}
                      disabled={tags.length >= 5}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="gap-1"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 特色功能 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  特色功能 <span className="text-red-500 text-sm font-normal">*</span>
                </CardTitle>
                <CardDescription>列出工具的主要特色（最多 10 項）</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="例如：支援多語言翻譯"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addFeature()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      disabled={features.length >= 10}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      新增
                    </Button>
                  </div>

                  {errors.features && features.length === 0 && (
                    <p className="text-sm text-red-500">{errors.features}</p>
                  )}

                  {features.length > 0 && (
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 bg-primary/5 border border-border/50 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="flex-1">{feature}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 備註 */}
            <Card>
              <CardHeader>
                <CardTitle>補充說明（可選）</CardTitle>
                <CardDescription>任何想告訴審核團隊的額外資訊</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="submitterNote"
                  placeholder="例如：我是這個工具的開發者、這個工具特別適合設計師使用..."
                  value={formData.submitterNote}
                  onChange={handleChange}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* 提交按鈕 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    提交工具
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
