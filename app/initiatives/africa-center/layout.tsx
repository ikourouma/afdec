import type { Metadata } from "next";
import { pageMeta } from "@/lib/page-meta";

export function generateMetadata(): Promise<Metadata> {
  return pageMeta("/initiatives/africa-center", {
    title: "The Africa Center",
    description: "A proposed institutional gateway for African economic development in North Carolina.",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}