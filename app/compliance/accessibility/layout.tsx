import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/compliance/accessibility", {
    title: "Accessibility Statement",
    description: "Our commitment to an accessible AfDEC website and how to report a barrier.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}