"use client";

import React from "react";
import { TopNav } from "@/components/ui/top-nav";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { FlashBanner } from "@/components/ui/flash-banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";

/** Standard public/member page frame: utility bar, banner, nav, breadcrumb, main landmark, footer. */
export function SiteShell({ children, breadcrumb = true }: { children: React.ReactNode; breadcrumb?: boolean }) {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-blue-500/30 selection:text-blue-200">
      <div className="sticky top-0 z-[100] w-full flex flex-col">
        <TopNav />
        <FlashBanner />
        <Header />
      </div>
      {breadcrumb && <Breadcrumb />}
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
