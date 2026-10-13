import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/careers", {
    title: "Careers",
    description: "Open roles and volunteer opportunities at the African Diaspora Economic Council.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}