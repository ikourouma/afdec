"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  customLogoUrl?: string;
  className?: string;
  isDarkTheme?: boolean;
  variant?: "full" | "acronym"; // Added variant to handle Footer reduction
}

export function BrandLogo({ customLogoUrl, className = "", isDarkTheme = true, variant = "full" }: BrandLogoProps) {
  const textColor = isDarkTheme ? "text-white" : "text-zinc-900";
  const subTextColor = isDarkTheme ? "text-zinc-400" : "text-zinc-400";

  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      {customLogoUrl ? (
        <div className="relative h-10 w-auto min-w-[200px]">
          <Image 
            src={customLogoUrl} 
            alt="AfDEC Logo" 
            fill
            className="object-contain object-left"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          {/* AfDEC Seal Mark */}
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/logo/afdec-mark.png"
              alt="AfDEC Seal"
              fill
              className="object-contain"
              priority
            />
          </div>
          
          {/* Text Lockup Options */}
          {variant === "full" ? (
            <>
              {/* Desktop Full Text */}
              <div className="flex flex-col justify-center hidden lg:flex">
                <span className={`font-bold tracking-tight text-base leading-none mb-1 cursor-default ${textColor}`}>
                  African Diaspora Economic Council
                </span>
                <span className={`text-[11px] uppercase font-semibold tracking-widest leading-none cursor-default ${subTextColor}`}>
                  North Carolina
                </span>
              </div>
              
              {/* Mobile Fallback - Hides the long text */}
              <div className="flex lg:hidden flex-col justify-center">
                <span className={`font-bold tracking-tight text-xs min-[360px]:text-[11px] sm:text-sm leading-none mb-1 whitespace-nowrap ${textColor}`}>
                  African Diaspora Economic Council
                </span>
                <span className={`text-xs sm:text-xs uppercase font-semibold tracking-widest leading-none ${subTextColor}`}>
                  North Carolina
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-center">
              <span className={`font-bold tracking-tight text-base leading-none mb-1 ${textColor}`}>
                African Diaspora Economic Council
              </span>
              <span className={`text-[11px] uppercase font-semibold tracking-widest leading-none ${subTextColor}`}>
                North Carolina
              </span>
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
