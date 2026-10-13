import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/compliance", {
    title: "Governance & Compliance",
    description: "AfDEC governance, privacy, terms and accessibility commitments.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}