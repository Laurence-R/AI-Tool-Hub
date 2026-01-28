import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ToolDetailClient } from "./ToolDetailClient"

// 模擬工具數據（未來替換為真實 API）
const MOCK_TOOLS = [
    {
        id: 1,
        name: "ChatGPT",
        description: "OpenAI 開發的強大對話式 AI，能夠回答問題、生成內容、協助編程等多種任務。",
        fullDescription: "ChatGPT 是 OpenAI 推出的革命性對話式 AI 模型，基於 GPT-4 架構。它能夠理解和生成自然語言，在多個領域提供專業級的協助，包括內容創作、程式開發、數據分析、語言翻譯等。ChatGPT 透過大規模語言訓練，能夠進行複雜的推理、創意寫作，並提供有價值的見解。",
        category: "對話 AI",
        pricing: "freemium",
        rating: 4.8,
        reviewCount: 12584,
        logo: "/tools/chatgpt.png",
        tags: ["對話", "AI助手", "內容生成", "程式輔助", "OpenAI"],
        url: "https://chat.openai.com",
        features: [
            "自然語言對話",
            "多領域知識問答",
            "程式碼生成與除錯",
            "內容創作與編輯",
            "語言翻譯",
            "數據分析與解釋"
        ],
        pricingPlans: [
            {
                name: "免費版",
                price: "NT$ 0",
                period: "永久免費",
                features: ["基本 GPT-3.5 模型", "標準回應速度", "無限對話", "基礎功能"],
                recommended: false
            },
            {
                name: "Plus",
                price: "NT$ 600",
                period: "每月",
                features: ["GPT-4 完整存取", "優先回應速度", "進階功能", "插件生態系統", "DALL-E 圖像生成"],
                recommended: true
            }
        ],
        screenshots: [
            "/tools/screenshots/chatgpt-1.jpg",
            "/tools/screenshots/chatgpt-2.jpg",
            "/tools/screenshots/chatgpt-3.jpg"
        ],
        relatedTools: [2, 4, 8]
    },
    {
        id: 2,
        name: "Midjourney",
        description: "領先的 AI 圖像生成工具，透過文字描述創造驚艷的藝術作品與設計。",
        fullDescription: "Midjourney 是目前市場上最受歡迎的 AI 圖像生成平台之一，以其卓越的藝術質感和創意表現聞名。用戶只需提供文字描述（prompt），Midjourney 就能生成高質量、富有創意的圖像。無論是插畫、概念藝術、產品設計還是品牌視覺，Midjourney 都能提供專業級的視覺創作支援。",
        category: "圖像生成",
        pricing: "paid",
        rating: 4.7,
        reviewCount: 8923,
        logo: "/tools/midjourney.png",
        tags: ["AI繪圖", "圖像生成", "藝術創作", "設計工具"],
        url: "https://midjourney.com",
        features: [
            "文字轉圖像生成",
            "多種藝術風格",
            "高解析度輸出",
            "批次生成功能",
            "社群畫廊",
            "Discord 整合"
        ],
        pricingPlans: [
            {
                name: "Basic",
                price: "NT$ 300",
                period: "每月",
                features: ["200 張圖像/月", "標準生成速度", "基本商業授權"],
                recommended: false
            },
            {
                name: "Standard",
                price: "NT$ 900",
                period: "每月",
                features: ["無限圖像生成", "快速生成模式", "完整商業授權", "私密模式"],
                recommended: true
            }
        ],
        screenshots: [],
        relatedTools: [1, 5, 6]
    }
]

// 模擬評論數據
const MOCK_REVIEWS = [
    {
        id: 1,
        toolId: 1,
        userName: "Alex Chen",
        userAvatar: "/avatars/user1.jpg",
        rating: 5,
        date: "2025-12-20",
        content: "ChatGPT 徹底改變了我的工作流程！作為開發者，它幫我快速解決問題、生成代碼片段，甚至協助撰寫技術文件。強烈推薦！",
        helpful: 124,
        verified: true
    },
    {
        id: 2,
        toolId: 1,
        userName: "Sarah Lin",
        userAvatar: "/avatars/user2.jpg",
        rating: 4,
        date: "2025-12-15",
        content: "非常實用的 AI 工具，對內容創作和翻譯幫助很大。唯一小缺點是高峰時段回應速度較慢，但整體來說物超所值。",
        helpful: 89,
        verified: false
    },
    {
        id: 3,
        toolId: 1,
        userName: "Mike Wong",
        userAvatar: "/avatars/user3.jpg",
        rating: 5,
        date: "2025-12-10",
        content: "GPT-4 的能力真的很驚人，能夠理解複雜的問題並提供深入的分析。用於學習和研究非常有幫助。",
        helpful: 67,
        verified: true
    }
]

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const tool = MOCK_TOOLS.find(t => t.id === parseInt(id))
    
    if (!tool) {
        return {
            title: "工具未找到"
        }
    }

    return {
        title: `${tool.name} - AI Tool Hub`,
        description: tool.description,
    }
}

export default async function ToolDetailPage({ params }: PageProps) {
    const { id } = await params
    const tool = MOCK_TOOLS.find(t => t.id === parseInt(id))
    
    if (!tool) {
        notFound()
    }

    const reviews = MOCK_REVIEWS.filter(r => r.toolId === tool.id)
    const relatedTools = MOCK_TOOLS.filter(t => tool.relatedTools?.includes(t.id))

    return <ToolDetailClient tool={tool} reviews={reviews} relatedTools={relatedTools} />
}
