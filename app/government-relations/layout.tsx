import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/government-relations", {
    title: "Government Relations",
    description: "AfDEC engagement with government and policy stakeholders.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}