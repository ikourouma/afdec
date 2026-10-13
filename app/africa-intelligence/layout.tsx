import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/africa-intelligence", {
    title: "Africa Intelligence Terminal",
    description: "Interactive market intelligence across all 54 African nations. Registered partners unlock indicators and full country briefs.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}