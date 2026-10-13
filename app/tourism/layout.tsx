import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/tourism", {
    title: "Tourism & Hospitality",
    description: "Tourism and hospitality opportunities connecting North Carolina and Africa.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}