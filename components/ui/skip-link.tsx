"use client";

import React from "react";

/** Keyboard "skip to content" link. Works on every page: targets the page's first <main> landmark. */
export function SkipLink() {
  function go(e: React.MouseEvent<HTMLAnchorElement>) {
    const main = document.querySelector("main");
    if (!main) return;
    e.preventDefault();
    if (!main.id) main.id = "main";
    main.setAttribute("tabindex", "-1");
    main.focus();
    main.scrollIntoView();
  }
  return (
    <a
      href="#main"
      onClick={go}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:bg-white focus:text-zinc-950 focus:px-4 focus:py-2 focus:rounded-sm focus:font-bold focus:text-sm"
    >
      Skip to main content
    </a>
  );
}
