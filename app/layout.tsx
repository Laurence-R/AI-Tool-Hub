import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/shared";
import { Navigation } from "@/components/layout";
import { CompareProvider, FavoritesProvider } from "@/contexts";

export const metadata: Metadata = {
  title: "AI Tool Hub - 打造你的 AI 工具工作流",
  description: "探索、比較、管理最優質的 AI 工具。打造專屬的高效工作流，提升工作效率。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CompareProvider>
            <FavoritesProvider>
              <Navigation />
              {children}
            </FavoritesProvider>
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
