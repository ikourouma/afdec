import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/why-africa", {
    title: "Why Africa",
    description: "The investment case for Africa, with an interactive intelligence map.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}