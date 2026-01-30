import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/seo"

/**
 * 生成 robots.txt
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",           // API 路由
          "/admin/",         // 管理後台
          "/dashboard/",     // 用戶儀表板（私人頁面）
          "/login",          // 登入頁
          "/register",       // 註冊頁
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
