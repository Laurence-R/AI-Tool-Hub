import { Metadata } from "next"
import { AboutHero } from "./components/AboutHero"
import { Mission } from "./components/Mission"
import { Stats } from "./components/Stats"
import { Team } from "./components/Team"
import { Timeline } from "./components/Timeline"
import { CTA } from "./components/CTA"

export const metadata: Metadata = {
  title: "關於我們 | AI Tool Hub",
  description: "了解 AI Tool Hub 的使命、團隊和發展歷程。我們致力於幫助每個人找到最適合的 AI 工具。",
  openGraph: {
    title: "關於我們 | AI Tool Hub",
    description: "了解 AI Tool Hub 的使命、團隊和發展歷程。我們致力於幫助每個人找到最適合的 AI 工具。",
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <main>
        <AboutHero />
        <Mission />
        <Stats />
        <Team />
        <Timeline />
        <CTA />
      </main>
    </div>
  )
}
