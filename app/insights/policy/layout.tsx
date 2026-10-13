import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/insights/policy", {
    title: "Policy Briefs",
    description: "Policy briefs and analysis from AfDEC.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}