import { Footer } from "@/components/layout";
import { 
  Hero, 
  Features, 
  PopularTools, 
  HowItWorks, 
  Testimonials, 
  FinalCTA 
} from "@/components/sections";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo";

export default function Home() {
  return (
    <div className="min-h-screen">
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <main>
        <Hero />
        <Features />
        <PopularTools />
        <HowItWorks />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
