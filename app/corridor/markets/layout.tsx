import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/corridor/markets", {
    title: "Regional Market Access",
    description: "Regional market access guidance across African and North Carolina markets.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}