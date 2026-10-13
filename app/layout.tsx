import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { AuthProvider } from "@/lib/auth";
import { SkipLink } from "@/components/ui/skip-link";

const inter = Inter({
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://afdecnc.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AfDEC | African Diaspora Economic Council",
    template: "%s | AfDEC",
  },
  description:
    "The African Diaspora Economic Council (AfDEC) connects North Carolina and Africa through trade, investment, policy and the Diaspora Impact Fund.",
  openGraph: {
    type: "website",
    siteName: "AfDEC | African Diaspora Economic Council",
    title: "AfDEC | African Diaspora Economic Council",
    description:
      "The bridge between North Carolina and Africa: trade, investment, policy and diaspora engagement.",
    images: [{ url: "/logo/afdec-seal-full.png", width: 1200, height: 1200, alt: "AfDEC seal" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "./" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-50 antialiased font-sans`}>
        <SkipLink />
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
