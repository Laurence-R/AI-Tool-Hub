/**
 * 分類與定價標籤常量
 * 用於統一顯示分類和定價的中文標籤
 */

// ==================== 分類標籤 ====================

/**
 * 工具分類標籤對照表
 */
export const CATEGORY_LABELS: Record<string, string> = {
  writing: "寫作助手",
  image: "圖像生成",
  video: "影片製作",
  audio: "音訊處理",
  coding: "程式開發",
  productivity: "生產力工具",
  research: "研究分析",
  marketing: "行銷工具",
  education: "教育學習",
  chatbot: "聊天機器人",
  design: "設計工具",
  meeting: "會議工具",
  automation: "自動化",
  search: "搜尋引擎",
  platform: "開發平台",
  other: "其他",
}

/**
 * 取得分類的中文標籤
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category
}

// ==================== 工具提交相關 ====================

/**
 * 工具提交分類選項（用於表單）
 */
export const SUBMIT_CATEGORIES = [
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
] as const

/**
 * 工具提交定價選項（用於表單）
 */
export const SUBMIT_PRICING_OPTIONS = [
  { value: "free", label: "免費" },
  { value: "freemium", label: "免費增值" },
  { value: "paid", label: "付費" },
  { value: "subscription", label: "訂閱制" },
] as const

// ==================== 提交狀態 ====================

/**
 * 提交狀態標籤對照表
 */
export const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  PENDING: "審核中",
  APPROVED: "已通過",
  REJECTED: "未通過",
}

/**
 * 取得提交狀態的中文標籤
 */
export function getSubmissionStatusLabel(status: string): string {
  return SUBMISSION_STATUS_LABELS[status] || status
}
