import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/news", {
    title: "News & Briefings",
    description: "Latest news and briefings from AfDEC.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}