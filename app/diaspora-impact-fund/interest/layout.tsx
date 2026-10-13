import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/diaspora-impact-fund/interest", {
    title: "Express Interest",
    description: "Tell us about your interest in the Diaspora Impact Fund.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}