import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/diaspora-impact-fund/apply", {
    title: "Apply to the Diaspora Impact Fund",
    description: "Submit an SME funding application to the Diaspora Impact Fund.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}