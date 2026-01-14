/**
 * 導航相關常量
 */

import type { NavLink } from "@/types"

/**
 * 主導航連結
 */
export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "首頁" },
    { href: "/tools", label: "工具列表" },
    { href: "#features", label: "功能特色" },
    { href: "#how-it-works", label: "使用指南" },
    { href: "#testimonials", label: "用戶評價" }
]

/**
 * 搜尋項目（用於 Command 搜尋）
 */
export const SEARCH_ITEMS = [
    // 頁面
    { id: "home", label: "首頁", href: "/", category: "頁面" },
    { id: "tools", label: "工具列表", href: "/tools", category: "頁面" },
    { id: "login", label: "登入", href: "/login", category: "頁面" },
    
    // 分類
    { id: "chat-ai", label: "對話 AI", href: "/tools?category=對話+AI", category: "分類" },
    { id: "image-gen", label: "圖像生成", href: "/tools?category=圖像生成", category: "分類" },
    { id: "video-gen", label: "視頻生成", href: "/tools?category=視頻生成", category: "分類" },
    { id: "productivity", label: "生產力", href: "/tools?category=生產力", category: "分類" },
    { id: "dev-tools", label: "開發工具", href: "/tools?category=開發工具", category: "分類" }
]
