import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/sectors", {
    title: "Sectors",
    description: "Priority sectors across the North Carolina and Africa corridor.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}