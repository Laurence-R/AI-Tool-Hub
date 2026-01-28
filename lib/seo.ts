import type { Metadata } from "next"

/**
 * 基本網站資訊
 */
export const siteConfig = {
  name: "AI Tool Hub",
  description: "探索、比較、管理最優質的 AI 工具。打造專屬的高效工作流，提升工作效率。",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://ai-tool-hub.com",
  ogImage: "/og-image.png",
  twitter: "@aitoolhub",
  locale: "zh_TW",
}

/**
 * 預設元資料
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - 打造你的 AI 工具工作流`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI 工具",
    "人工智慧",
    "AI 工具比較",
    "AI 寫作",
    "AI 圖像生成",
    "ChatGPT",
    "Midjourney",
    "AI 效率工具",
    "工作流程優化",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - 打造你的 AI 工具工作流`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - 打造你的 AI 工具工作流`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

/**
 * 生成頁面元資料
 */
interface GeneratePageMetadataOptions {
  title: string
  description?: string
  image?: string
  path?: string
  noIndex?: boolean
}

export function generatePageMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  path = "",
  noIndex = false,
}: GeneratePageMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
    },
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

/**
 * 生成工具頁面元資料
 */
interface ToolMetadataOptions {
  name: string
  description: string
  logo: string
  category: string
  id: string | number
}

export function generateToolMetadata({
  name,
  description,
  logo,
  category,
  id,
}: ToolMetadataOptions): Metadata {
  const title = `${name} - ${category} AI 工具`
  const metaDescription = description.length > 155 
    ? `${description.slice(0, 152)}...` 
    : description

  return {
    title,
    description: metaDescription,
    keywords: [name, category, "AI 工具", "人工智慧", `${category}工具`],
    openGraph: {
      title,
      description: metaDescription,
      url: `${siteConfig.url}/tools/${id}`,
      type: "article",
      images: [
        {
          url: logo.startsWith("http") ? logo : `${siteConfig.url}${logo}`,
          width: 200,
          height: 200,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description: metaDescription,
      images: [logo.startsWith("http") ? logo : `${siteConfig.url}${logo}`],
    },
    alternates: {
      canonical: `${siteConfig.url}/tools/${id}`,
    },
  }
}

/**
 * 生成分類頁面元資料
 */
export function generateCategoryMetadata(category: string): Metadata {
  const title = `${category} AI 工具`
  const description = `探索最佳${category} AI 工具，比較功能、價格和用戶評價，找到最適合您的 AI 解決方案。`

  return generatePageMetadata({
    title,
    description,
    path: `/tools?category=${encodeURIComponent(category)}`,
  })
}
