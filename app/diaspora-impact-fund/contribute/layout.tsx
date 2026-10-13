import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/diaspora-impact-fund/contribute", {
    title: "Contribute to the Fund",
    description: "Contribute to the Diaspora Impact Fund.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}