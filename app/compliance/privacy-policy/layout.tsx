import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/compliance/privacy-policy", {
    title: "Privacy Policy",
    description: "How AfDEC collects, uses and protects your personal information.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}