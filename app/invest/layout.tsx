import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/invest", {
    title: "Invest & Become a Member",
    description: "Membership and investment pathways with the African Diaspora Economic Council.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}