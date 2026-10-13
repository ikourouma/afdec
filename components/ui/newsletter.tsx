"use client";

import React, { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Mail } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Newsletter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase(), is_active: true });
    // 23505 = already subscribed: treat as success so we never reveal who is on the list
    setState(error && error.code !== "23505" ? "error" : "done");
  }

  useGSAP(() => {
    gsap.fromTo(
      ".newsletter-content",
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative py-24 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10 newsletter-content flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700 mb-6 rounded-full">
            <Mail className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-200">AfDEC Intelligence Network</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Stay ahead of the mandate.</h2>
          <p className="text-lg text-zinc-300 leading-relaxed font-medium">
            Receive exclusive briefings on transatlantic capital flows, strategic policy shifts, and direct investment opportunities across North Carolina and Africa.
          </p>
        </div>

        <div className="w-full md:w-[480px] shrink-0">
          {state === "done" ? (
            <p role="status" className="text-emerald-300 font-semibold py-4">Thank you — you are subscribed.</p>
          ) : (
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={subscribe}>
            <label htmlFor="newsletter-email" className="sr-only">Corporate email address</label>
            <input 
              id="newsletter-email"
              type="email" 
              placeholder="Corporate Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 text-white px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-zinc-400"
            />
            <button disabled={state === "busy"} className="bg-white text-zinc-950 font-bold px-8 py-4 hover:bg-zinc-200 disabled:opacity-60 transition-colors flex items-center justify-center shrink-0">
              {state === "busy" ? "Subscribing…" : "Subscribe"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>
          )}
          {state === "error" && <p role="alert" className="text-red-300 text-sm mt-3">We could not subscribe you right now. Please try again.</p>}
          <p className="text-xs text-zinc-400 mt-4 leading-relaxed">
            By subscribing, you agree to our <a href="/compliance/privacy-policy" className="underline hover:text-zinc-300">Privacy Policy</a>. Your intelligence data is secured in compliance with ISO protocols.
          </p>
        </div>
      </div>
    </section>
  );
}
