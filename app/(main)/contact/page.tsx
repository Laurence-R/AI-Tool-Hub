import { Metadata } from "next"
import { ContactHero } from "./components/ContactHero"
import { ContactForm } from "./components/ContactForm"
import { ContactInfo } from "./components/ContactInfo"
import { FAQ } from "./components/FAQ"

export const metadata: Metadata = {
  title: "聯絡我們 | AI Tool Hub",
  description: "有任何問題或建議？歡迎透過表單聯絡我們，我們會盡快回覆您。",
  openGraph: {
    title: "聯絡我們 | AI Tool Hub",
    description: "有任何問題或建議？歡迎透過表單聯絡我們，我們會盡快回覆您。",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <main>
        <ContactHero />
        <div className="relative py-24 px-4">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactForm />
              <ContactInfo />
            </div>
          </div>
        </div>
        <FAQ />
      </main>
    </div>
  )
}
