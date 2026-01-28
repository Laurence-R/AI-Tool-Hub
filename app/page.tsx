import { Footer } from "@/components/layout";
import { 
  Hero, 
  Features, 
  PopularTools, 
  HowItWorks, 
  Testimonials, 
  FinalCTA 
} from "@/components/sections";

export default function Home() {
  return (
    <div className="min-h-screen">
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
