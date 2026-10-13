import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/annual-report", {
    title: "Annual Report",
    description: "AfDEC annual and quarterly reporting on programmes, impact and finances.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}