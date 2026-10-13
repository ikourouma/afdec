import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/corridor/export-trade", {
    title: "Export & Trade Logistics",
    description: "Export, customs and logistics guidance for North Carolina and African trade.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}