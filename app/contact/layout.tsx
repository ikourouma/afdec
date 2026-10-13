import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/contact", {
    title: "Contact",
    description: "Get in touch with the African Diaspora Economic Council.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}