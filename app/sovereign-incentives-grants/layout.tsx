import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/sovereign-incentives-grants", {
    title: "Strategic Incentives & Grants",
    description: "Incentives and grants available to enterprises in the corridor.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}