import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/corridor", {
    title: "Transatlantic Corridor",
    description: "The North Carolina to Africa trade and investment corridor: services for exporters, investors and enterprises.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}