import { siteConfig } from "@/lib/seo"

/**
 * 網站 JSON-LD 結構化資料
 */
export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/tools?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 組織 JSON-LD 結構化資料
 */
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      // 社群媒體連結
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Chinese", "English"],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 軟體應用程式 JSON-LD 結構化資料
 */
interface SoftwareApplicationJsonLdProps {
  name: string
  description: string
  image: string
  url: string
  category: string
  rating?: number
  ratingCount?: number
  price?: string
  priceCurrency?: string
}

export function SoftwareApplicationJsonLd({
  name,
  description,
  image,
  url,
  category,
  rating,
  ratingCount,
  price,
  priceCurrency = "USD",
}: SoftwareApplicationJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    image,
    url,
    applicationCategory: category,
    operatingSystem: "Web",
  }

  if (rating && ratingCount) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (price) {
    jsonLd.offers = {
      "@type": "Offer",
      price: price === "免費" ? "0" : price,
      priceCurrency,
      availability: "https://schema.org/InStock",
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 麵包屑 JSON-LD 結構化資料
 */
interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * FAQ JSON-LD 結構化資料
 */
interface FAQItem {
  question: string
  answer: string
}

interface FAQJsonLdProps {
  items: FAQItem[]
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

/**
 * 產品清單 JSON-LD 結構化資料（用於工具列表頁面）
 */
interface ToolListItem {
  name: string
  description: string
  url: string
  image: string
}

interface ToolListJsonLdProps {
  items: ToolListItem[]
  listName?: string
}

export function ToolListJsonLd({ items, listName = "AI 工具列表" }: ToolListJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: item.name,
        description: item.description,
        url: item.url,
        image: item.image,
        applicationCategory: "AI Tool",
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
