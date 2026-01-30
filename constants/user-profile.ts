/**
 * 用戶個人資料常量
 * 用於 Onboarding 流程和個人資料編輯
 */

// ==================== 職業角色 ====================

export const JOB_ROLES = [
  { value: "developer", label: "開發者 / 工程師", icon: "Code" },
  { value: "designer", label: "設計師", icon: "Palette" },
  { value: "marketer", label: "行銷人員", icon: "Megaphone" },
  { value: "pm", label: "產品經理 / 專案經理", icon: "ClipboardList" },
  { value: "content-creator", label: "內容創作者", icon: "PenTool" },
  { value: "student", label: "學生", icon: "GraduationCap" },
  { value: "researcher", label: "研究員 / 學者", icon: "Microscope" },
  { value: "entrepreneur", label: "創業者 / 自由工作者", icon: "Rocket" },
  { value: "other", label: "其他", icon: "User" },
] as const

export type JobRole = typeof JOB_ROLES[number]["value"]

export function getJobRoleLabel(value: string): string {
  return JOB_ROLES.find(r => r.value === value)?.label || value
}

// ==================== 使用目的 ====================

export const USAGE_PURPOSES = [
  { value: "work", label: "工作需求", description: "提升工作效率、完成專案" },
  { value: "learning", label: "學習成長", description: "學習新技能、探索 AI 應用" },
  { value: "personal", label: "個人專案", description: "Side project、興趣創作" },
  { value: "startup", label: "創業 / 商業", description: "建立產品、發展業務" },
] as const

export type UsagePurpose = typeof USAGE_PURPOSES[number]["value"]

export function getUsagePurposeLabel(value: string): string {
  return USAGE_PURPOSES.find(p => p.value === value)?.label || value
}

// ==================== 行業領域 ====================

export const INDUSTRIES = [
  { value: "tech", label: "科技 / 軟體" },
  { value: "finance", label: "金融 / 銀行" },
  { value: "education", label: "教育 / 培訓" },
  { value: "healthcare", label: "醫療 / 健康" },
  { value: "ecommerce", label: "電商 / 零售" },
  { value: "media", label: "媒體 / 娛樂" },
  { value: "marketing", label: "行銷 / 廣告" },
  { value: "manufacturing", label: "製造 / 工業" },
  { value: "consulting", label: "顧問 / 服務" },
  { value: "government", label: "政府 / 非營利" },
  { value: "other", label: "其他" },
] as const

export type Industry = typeof INDUSTRIES[number]["value"]

export function getIndustryLabel(value: string): string {
  return INDUSTRIES.find(i => i.value === value)?.label || value
}

// ==================== 公司規模 ====================

export const COMPANY_SIZES = [
  { value: "individual", label: "個人 / 自由工作者", description: "1 人" },
  { value: "small", label: "小型企業", description: "2-50 人" },
  { value: "medium", label: "中型企業", description: "51-500 人" },
  { value: "large", label: "大型企業", description: "500+ 人" },
] as const

export type CompanySize = typeof COMPANY_SIZES[number]["value"]

export function getCompanySizeLabel(value: string): string {
  const size = COMPANY_SIZES.find(s => s.value === value)
  return size ? `${size.label} (${size.description})` : value
}

// ==================== 技術程度 ====================

export const TECH_LEVELS = [
  { value: "beginner", label: "初學者", description: "剛開始接觸 AI 工具" },
  { value: "intermediate", label: "中級使用者", description: "熟悉常見 AI 工具" },
  { value: "advanced", label: "進階使用者", description: "精通多種 AI 工具" },
] as const

export type TechLevel = typeof TECH_LEVELS[number]["value"]

export function getTechLevelLabel(value: string): string {
  return TECH_LEVELS.find(l => l.value === value)?.label || value
}

// ==================== 預算偏好 ====================

export const BUDGET_PREFERENCES = [
  { value: "free", label: "免費優先", description: "主要使用免費工具" },
  { value: "paid", label: "願意付費", description: "會考慮付費方案" },
  { value: "enterprise", label: "企業預算", description: "公司預算支持" },
] as const

export type BudgetPreference = typeof BUDGET_PREFERENCES[number]["value"]

export function getBudgetPreferenceLabel(value: string): string {
  return BUDGET_PREFERENCES.find(b => b.value === value)?.label || value
}

// ==================== 感興趣類別 ====================

export const INTEREST_CATEGORIES = [
  { value: "writing", label: "寫作助手", icon: "FileText" },
  { value: "image", label: "圖像生成", icon: "Image" },
  { value: "video", label: "影片製作", icon: "Video" },
  { value: "audio", label: "音訊處理", icon: "Music" },
  { value: "coding", label: "程式開發", icon: "Code" },
  { value: "productivity", label: "生產力工具", icon: "Zap" },
  { value: "research", label: "研究分析", icon: "Search" },
  { value: "marketing", label: "行銷工具", icon: "TrendingUp" },
  { value: "education", label: "教育學習", icon: "BookOpen" },
  { value: "chatbot", label: "聊天機器人", icon: "MessageSquare" },
  { value: "design", label: "設計工具", icon: "Paintbrush" },
  { value: "automation", label: "自動化", icon: "Settings" },
] as const

export type InterestCategory = typeof INTEREST_CATEGORIES[number]["value"]

export function getInterestCategoryLabel(value: string): string {
  return INTEREST_CATEGORIES.find(c => c.value === value)?.label || value
}

// ==================== 類型定義 ====================

export interface UserProfile {
  jobRole?: string
  usagePurpose?: string
  industry?: string
  companySize?: string
  techLevel?: string
  budgetPreference?: string
  interests?: string[] // Array of InterestCategory values
  onboardingCompleted?: boolean
}
