import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/about", {
    title: "About AfDEC",
    description: "Who we are, our mandate and how the African Diaspora Economic Council connects North Carolina and Africa.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}