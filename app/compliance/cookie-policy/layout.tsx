import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/compliance/cookie-policy", {
    title: "Cookie Policy",
    description: "How AfDEC uses cookies and similar technologies.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}