import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/diaspora-impact-fund/projects", {
    title: "Fund Projects",
    description: "SME development projects supported by the Diaspora Impact Fund.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}