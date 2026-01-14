/**
 * 通用型別定義
 */

/**
 * 導航連結項目
 */
export interface NavLink {
    href: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
}

/**
 * 功能卡片
 */
export interface FeatureCard {
    id: string | number
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    color?: string
}

/**
 * 見證評價
 */
export interface Testimonial {
    id: string | number
    name: string
    role: string
    avatar?: string
    content: string
    rating?: number
}

/**
 * 常見問題
 */
export interface FAQ {
    id: string | number
    question: string
    answer: string
}

/**
 * 統計數據
 */
export interface Stat {
    id: string | number
    label: string
    value: string | number
    description?: string
    icon?: React.ComponentType<{ className?: string }>
}

/**
 * 主題類型
 */
export type Theme = "light" | "dark" | "system"

/**
 * 通用回調函數型別
 */
export type VoidCallback = () => void
export type ValueCallback<T> = (value: T) => void

/**
 * 通用 Props 型別
 */
export interface BaseComponentProps {
    className?: string
    children?: React.ReactNode
}
