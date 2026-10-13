import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/about/strategic-framework", {
    title: "Strategic Framework",
    description: "The strategic framework, pillars and milestones that guide AfDEC programmes.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}