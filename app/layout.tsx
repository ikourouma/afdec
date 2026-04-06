import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AfDEC | African Diaspora Economic Council",
  description: "2026 Strategic Framework & Public Landing Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-zinc-50 antialiased font-sans`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
