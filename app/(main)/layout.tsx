import { Navigation, Footer } from "@/components/layout"
import { OnboardingDialog } from "@/components/shared/OnboardingDialog"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <OnboardingDialog />
    </>
  )
}
