import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/why-nc", {
    title: "Why North Carolina",
    description: "Why North Carolina is a leading US gateway for African enterprise.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}