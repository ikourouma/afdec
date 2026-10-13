import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/insights/market-outlook", {
    title: "Market Outlook",
    description: "Quarterly market outlooks across priority sectors.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}