import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/diaspora-registry", {
    title: "Diaspora Registry",
    description: "Join the AfDEC Diaspora Registry so we can represent, survey and serve the African diaspora with real data.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}