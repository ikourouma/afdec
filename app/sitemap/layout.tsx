import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/sitemap", {
    title: "Sitemap",
    description: "A directory of pages on the AfDEC website.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}