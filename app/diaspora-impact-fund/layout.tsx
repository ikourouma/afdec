import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/diaspora-impact-fund", {
    title: "Diaspora Impact Fund",
    description: "The Diaspora Impact Fund finances small and medium enterprises connecting North Carolina and Africa.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}