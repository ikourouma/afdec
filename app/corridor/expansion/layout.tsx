import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/corridor/expansion", {
    title: "Enterprise Expansion",
    description: "Support for African and North Carolina enterprises expanding across the transatlantic corridor.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}