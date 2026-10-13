import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/about/leadership", {
    title: "Leadership & Governance",
    description: "Meet the leadership and governance bodies guiding the African Diaspora Economic Council.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}