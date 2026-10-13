import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/media", {
    title: "Media & Press",
    description: "Press releases and media resources from AfDEC.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}