import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Hero } from "@/components/sections/hero";
import { DualMandate } from "@/components/sections/dual-mandate";
import { ImpactReport } from "@/components/sections/impact-report";
import { SectorIntelligence } from "@/components/sections/pillars";
import { NewsGrid } from "@/components/sections/news-grid";
import { Newsletter } from "@/components/ui/newsletter";
import { Footer } from "@/components/ui/footer";
import { PrivacyBanner } from "@/components/ui/privacy-banner";
import { StickyFeedback } from "@/components/ui/sticky-feedback";
import { FlashBanner } from "@/components/ui/flash-banner";

export default function AfDECBoardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col" data-nav-id="main-nav">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      
      <Hero />
      <DualMandate />
      <ImpactReport />
      <SectorIntelligence />
      <NewsGrid />
      
      {/* Footer Ecosystem with Unified Background */}
      <div className="relative bg-zinc-950 overflow-hidden">
        {/* Subtle cohesive background image spanning Newsletter and Footer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')" }}
        />
        {/* Gradient bleed to fade the top edge perfectly into the section above */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-10" />
        
        <Newsletter />
        <Footer />
      </div>

      <StickyFeedback />
      <PrivacyBanner />
    </main>
  );
}
