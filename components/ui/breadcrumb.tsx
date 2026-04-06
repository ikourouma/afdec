"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`sticky top-[120px] z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-md py-2" 
          : "bg-transparent py-4 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center space-x-2 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
        <Link href="/" className="hover:text-blue-400 transition-colors flex items-center">
          <Home className="w-3.5 h-3.5 mr-1" />
          Home
        </Link>
        {/* <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-300">Phase 1 Landing</span> */}
      </div>
    </div>
  );
}
