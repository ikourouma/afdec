import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/compliance/terms-of-service", {
    title: "Terms of Service",
    description: "The terms that govern use of the AfDEC website and member services.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}