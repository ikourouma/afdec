import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/events", {
    title: "Events",
    description: "Upcoming AfDEC events, summits and briefings.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}