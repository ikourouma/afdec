import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/dual-continent-business-hub", {
    title: "Dual-Continent Business Hub",
    description: "Business hubs connecting North Carolina and Africa.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}