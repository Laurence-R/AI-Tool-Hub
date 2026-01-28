export interface Tool {
    id: number
    name: string
    description: string
    category: string
    pricing: "free" | "freemium" | "paid"
    rating: number
    logo: string
    tags: string[]
    url: string
    features?: string[]
}

export const TOOLS_DATABASE: Tool[] = [
    {
        id: 1,
        name: "ChatGPT",
        description: "OpenAI 開發的強大對話 AI，能夠進行自然對話、回答問題、協助寫作、編程等多種任務",
        category: "對話 AI",
        pricing: "freemium",
        rating: 4.8,
        logo: "/tools/chatgpt.png",
        tags: ["對話", "寫作", "編程", "研究"],
        url: "https://chat.openai.com",
        features: ["自然語言理解", "程式碼生成", "內容創作", "資料分析"]
    },
    {
        id: 2,
        name: "Midjourney",
        description: "領先的 AI 圖像生成工具，能創造出令人驚嘆的藝術作品和視覺內容",
        category: "圖像生成",
        pricing: "paid",
        rating: 4.9,
        logo: "/tools/midjourney.png",
        tags: ["圖像", "藝術", "設計", "創意"],
        url: "https://midjourney.com",
        features: ["高品質圖像", "多種風格", "迭代優化", "社群分享"]
    },
    {
        id: 3,
        name: "Claude",
        description: "Anthropic 開發的 AI 助手，擅長長文本分析、安全對話和複雜推理任務",
        category: "對話 AI",
        pricing: "freemium",
        rating: 4.7,
        logo: "/tools/claude.png",
        tags: ["對話", "分析", "安全", "推理"],
        url: "https://claude.ai",
        features: ["100K+ token 上下文", "安全可靠", "文檔分析", "程式碼協助"]
    },
    {
        id: 4,
        name: "Gemini",
        description: "Google 的多模態 AI 模型，支援文字、圖像、程式碼和即時搜尋功能",
        category: "對話 AI",
        pricing: "freemium",
        rating: 4.6,
        logo: "/tools/gemini.png",
        tags: ["對話", "多模態", "搜尋", "整合"],
        url: "https://gemini.google.com",
        features: ["整合 Google 服務", "多模態輸入", "即時資訊", "程式碼協助"]
    },
    {
        id: 5,
        name: "GitHub Copilot",
        description: "AI 程式設計助手，提供智能代碼建議和自動補全，大幅提升開發效率",
        category: "開發工具",
        pricing: "paid",
        rating: 4.5,
        logo: "/tools/github-copilot.png",
        tags: ["編程", "開發", "自動化", "代碼"],
        url: "https://github.com/features/copilot",
        features: ["代碼自動補全", "多語言支援", "註釋生成", "測試撰寫"]
    },
    {
        id: 6,
        name: "Notion AI",
        description: "整合到 Notion 的 AI 助手，幫助你更高效地撰寫、總結和整理筆記",
        category: "生產力",
        pricing: "freemium",
        rating: 4.6,
        logo: "/tools/notion.png",
        tags: ["筆記", "文檔", "協作", "整理"],
        url: "https://notion.so",
        features: ["智能摘要", "自動翻譯", "內容改寫", "腦力激盪"]
    },
    {
        id: 7,
        name: "Perplexity AI",
        description: "AI 驅動的搜尋引擎，提供準確的答案和來源引用，讓研究更加高效",
        category: "搜尋引擎",
        pricing: "freemium",
        rating: 4.7,
        logo: "/tools/perplexity-ai.png",
        tags: ["搜尋", "研究", "資訊", "引用"],
        url: "https://perplexity.ai",
        features: ["即時搜尋", "來源引用", "追蹤問題", "專業模式"]
    },
    {
        id: 8,
        name: "ElevenLabs",
        description: "頂級 AI 語音合成平台，生成逼真的語音和支援語音克隆功能",
        category: "語音合成",
        pricing: "freemium",
        rating: 4.8,
        logo: "/tools/elevenlabs.jpg",
        tags: ["語音", "配音", "合成", "克隆"],
        url: "https://elevenlabs.io",
        features: ["超逼真語音", "多語言支援", "語音克隆", "情感調節"]
    },
    {
        id: 9,
        name: "Runway",
        description: "專業級 AI 視頻編輯和生成工具，讓創作者輕鬆製作驚艷的視頻內容",
        category: "視頻生成",
        pricing: "freemium",
        rating: 4.7,
        logo: "/tools/runway.png",
        tags: ["視頻", "編輯", "特效", "生成"],
        url: "https://runwayml.com",
        features: ["視頻生成", "背景移除", "動態追蹤", "視頻超解析度"]
    },
    {
        id: 10,
        name: "Stable Diffusion",
        description: "開源的 AI 圖像生成模型，提供強大的自定義能力和靈活性",
        category: "圖像生成",
        pricing: "free",
        rating: 4.5,
        logo: "/tools/stable-diffusion.png",
        tags: ["圖像", "開源", "自定義", "本地"],
        url: "https://stability.ai",
        features: ["完全開源", "本地部署", "高度可控", "社群插件"]
    },
    {
        id: 11,
        name: "Copy.ai",
        description: "AI 文案撰寫工具，快速生成行銷文案、社群媒體內容和部落格文章",
        category: "內容創作",
        pricing: "freemium",
        rating: 4.4,
        logo: "/tools/copy.png",
        tags: ["文案", "行銷", "內容", "創作"],
        url: "https://copy.ai",
        features: ["多種模板", "品牌語調", "SEO 優化", "批量生成"]
    },
    {
        id: 12,
        name: "Jasper",
        description: "企業級 AI 寫作助手，專為行銷團隊和內容創作者設計",
        category: "內容創作",
        pricing: "paid",
        rating: 4.5,
        logo: "/tools/jasper.jpg",
        tags: ["寫作", "行銷", "企業", "內容"],
        url: "https://jasper.ai",
        features: ["品牌風格", "團隊協作", "SEO 模式", "多語言"]
    },
    {
        id: 13,
        name: "Canva AI",
        description: "整合 AI 功能的設計平台，讓任何人都能創作專業級的視覺內容",
        category: "設計工具",
        pricing: "freemium",
        rating: 4.6,
        logo: "/tools/canva.png",
        tags: ["設計", "圖形", "簡報", "社群"],
        url: "https://canva.com",
        features: ["AI 生成圖像", "智能排版", "背景移除", "魔術橡皮擦"]
    },
    {
        id: 14,
        name: "Grammarly",
        description: "AI 驅動的寫作助手，提供文法檢查、風格建議和語調優化",
        category: "寫作助手",
        pricing: "freemium",
        rating: 4.5,
        logo: "/tools/grammaly.jpg",
        tags: ["寫作", "文法", "編輯", "校對"],
        url: "https://grammarly.com",
        features: ["文法檢查", "風格建議", "抄襲檢測", "語調分析"]
    },
    {
        id: 15,
        name: "Cursor",
        description: "AI 原生的程式碼編輯器，提供智能代碼建議和自然語言編程",
        category: "開發工具",
        pricing: "freemium",
        rating: 4.7,
        logo: "/tools/cursor.png",
        tags: ["編程", "IDE", "AI", "開發"],
        url: "https://cursor.sh",
        features: ["自然語言編程", "代碼預測", "錯誤修復", "重構建議"]
    },
    {
        id: 16,
        name: "Descript",
        description: "全方位音視頻編輯工具，支援文字轉錄、AI 語音和視頻剪輯",
        category: "音視頻編輯",
        pricing: "freemium",
        rating: 4.6,
        logo: "/tools/descript.png",
        tags: ["視頻", "音頻", "編輯", "轉錄"],
        url: "https://descript.com",
        features: ["自動轉錄", "文字編輯視頻", "AI 語音", "背景雜音去除"]
    },
    {
        id: 17,
        name: "Otter.ai",
        description: "AI 會議記錄工具，自動轉錄和總結會議內容，提高團隊效率",
        category: "會議工具",
        pricing: "freemium",
        rating: 4.5,
        logo: "/tools/otter.png",
        tags: ["會議", "轉錄", "筆記", "協作"],
        url: "https://otter.ai",
        features: ["即時轉錄", "會議摘要", "關鍵字提取", "團隊共享"]
    },
    {
        id: 18,
        name: "Zapier AI",
        description: "自動化工作流程平台，使用 AI 連接各種應用程式和服務",
        category: "自動化",
        pricing: "freemium",
        rating: 4.4,
        logo: "/tools/zapier.png",
        tags: ["自動化", "整合", "工作流", "連接"],
        url: "https://zapier.com",
        features: ["數千種整合", "AI 自動化", "無程式碼", "條件邏輯"]
    },
    {
        id: 19,
        name: "Replicate",
        description: "開源 AI 模型平台，讓開發者輕鬆部署和使用各種 AI 模型",
        category: "開發平台",
        pricing: "paid",
        rating: 4.6,
        logo: "/tools/replicate.png",
        tags: ["API", "模型", "開發", "部署"],
        url: "https://replicate.com",
        features: ["模型市集", "簡易 API", "按使用付費", "雲端運算"]
    },
    {
        id: 20,
        name: "HuggingFace",
        description: "開放的 AI 社群和平台，提供數萬個預訓練模型和資料集",
        category: "開發平台",
        pricing: "freemium",
        rating: 4.7,
        logo: "/tools/huggingface.png",
        tags: ["開源", "模型", "社群", "機器學習"],
        url: "https://huggingface.co",
        features: ["模型庫", "資料集", "Spaces 應用", "免費託管"]
    }
]

// 獲取所有分類
export function getCategories(): string[] {
    const categories = new Set(TOOLS_DATABASE.map(tool => tool.category))
    return Array.from(categories).sort()
}

// 根據篩選條件獲取工具
export function filterTools(
    searchQuery: string = "",
    category: string = "all",
    pricing: string = "all"
): Tool[] {
    return TOOLS_DATABASE.filter(tool => {
        const matchesSearch =
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesCategory = category === "all" || tool.category === category
        const matchesPricing = pricing === "all" || tool.pricing === pricing

        return matchesSearch && matchesCategory && matchesPricing
    })
}

// 根據評分排序
export function sortToolsByRating(tools: Tool[]): Tool[] {
    return [...tools].sort((a, b) => b.rating - a.rating)
}

// 根據名稱排序
export function sortToolsByName(tools: Tool[]): Tool[] {
    return [...tools].sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'))
}
