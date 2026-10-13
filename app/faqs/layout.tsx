import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/faqs", {
    title: "FAQs",
    description: "Frequently asked questions about AfDEC, membership and programmes.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}