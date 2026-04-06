"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";

type SlideType = {
  id: string;
  type: "video" | "dual_image" | "single_image";
  media_1?: string; 
  media_2?: string; 
  title: string;
  subtitle: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_type?: "button" | "event_details";
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  event_date?: string;
  event_location?: string;
};

const mockSlides: SlideType[] = [
  {
    id: "slide-1",
    type: "dual_image",
    media_1: "https://images.unsplash.com/photo-1601058268499-e52658b8ebf8?q=80&w=2000&auto=format&fit=crop", 
    media_2: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=2000&auto=format&fit=crop", 
    title: "The Bridge Between North Carolina and Africa.",
    subtitle: "The African Diaspora Economic Council (AfDEC) drives bilateral trade, infrastructure development, and policy advocacy across the Atlantic.",
    primary_cta_text: "Initiate Expansion",
    primary_cta_link: "#",
    secondary_cta_type: "button",
    secondary_cta_text: "Access Member Portal",
    secondary_cta_link: "#"
  },
  {
    id: "slide-2",
    type: "single_image",
    media_1: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop", 
    title: "The Africa Innovation & Trade Summit.",
    subtitle: "Join global trade leaders, sovereign delegates, and enterprise innovators to forge the next era of transatlantic partnerships.",
    primary_cta_text: "Secure Early Registration",
    primary_cta_link: "#",
    secondary_cta_type: "event_details",
    event_date: "Sept 26-27, 2026",
    event_location: "Raleigh, NC"
  }
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    async function loadSlides() {
      const { data } = await supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order', { ascending: true });
      if (data && data.length > 0) {
        setSlides(data as SlideType[]);
      } else {
        setSlides(mockSlides);
      }
    }
    loadSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      handleNextSlide();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlideIndex]);

  const handleNextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    gsap.to(textContainerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        setTimeout(() => {
          gsap.fromTo(textContainerRef.current, 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
          setIsTransitioning(false);
        }, 50);
      }
    });
  };

  const slide = slides[currentSlideIndex];

  if (!slide) return <div className="min-h-screen bg-zinc-950" />; // Prevent hydration mismatch

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950"
    >
      <div className="absolute inset-0 z-0 bg-zinc-950 transition-opacity duration-1000">
        {slide.type === "video" && slide.media_1 && (
          <div className="absolute inset-0 animate-fade-in">
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]">
              <source src={slide.media_1} type="video/mp4" />
            </video>
          </div>
        )}
        {slide.type === "single_image" && slide.media_1 && (
          <div className="absolute inset-0 bg-cover bg-center animate-fade-in filter brightness-[0.4]" style={{ backgroundImage: `url('${slide.media_1}')` }} />
        )}
        {slide.type === "dual_image" && (
          <div className="absolute inset-0 flex animate-fade-in">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${slide.media_1}')`, clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)", filter: 'brightness(0.5)' }} />
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${slide.media_2}')`, clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)", filter: 'brightness(0.35)' }} />
            <div className="absolute inset-0 w-full h-full border-l-[1px] border-zinc-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)] mix-blend-overlay" style={{ clipPath: "polygon(60% 0, 60.1% 0, 40.1% 100%, 40% 100%)" }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 -mt-20 md:-mt-32" ref={textContainerRef}>
        <div className="max-w-4xl">
          {slide.id === 'slide-1' && (
            <div className="hero-headline inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-8 rounded-full backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-sm font-semibold tracking-wide text-zinc-300 uppercase">THE MANDATE</span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl">
            {slide.title}
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-zinc-300 mb-12 max-w-2xl leading-relaxed font-medium drop-shadow-md">
            {slide.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 h-auto md:h-16">
            <Link 
              href={slide.primary_cta_link}
              className="relative flex items-center justify-center px-10 py-5 bg-blue-600 font-bold text-white transition-all duration-300 overflow-hidden group border border-blue-500 h-full rounded-sm w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 -translate-x-full bg-white/20 skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10 text-lg tracking-wide">{slide.primary_cta_text}</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300 relative z-10 ml-3" />
            </Link>
            
            {slide.secondary_cta_type === "button" && slide.secondary_cta_text && (
              <Link 
                href={slide.secondary_cta_link || "#"}
                className="flex items-center justify-center px-8 py-5 bg-zinc-900/50 hover:bg-zinc-800/80 text-white font-medium transition-colors duration-200 border border-zinc-700/50 backdrop-blur-md rounded-sm h-full w-full sm:w-auto"
              >
                {slide.secondary_cta_text}
              </Link>
            )}

            {slide.secondary_cta_type === "event_details" && (
              <div className="flex flex-col justify-center px-6 py-3 h-full border-l-2 border-emerald-500/50 hidden sm:flex bg-zinc-900/40 backdrop-blur-sm rounded-r-sm">
                <div className="flex items-center text-zinc-300 mb-1">
                  <Calendar className="w-3.5 h-3.5 mr-2 text-emerald-400" />
                  <span className="text-sm font-bold tracking-widest uppercase">{slide.event_date}</span>
                </div>
                <div className="flex items-center text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                  <span className="text-xs font-semibold">{slide.event_location}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Event Details (Below buttons) */}
          {slide.secondary_cta_type === "event_details" && (
            <div className="sm:hidden mt-6 flex justify-between px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-sm">
              <div className="flex items-center text-zinc-300">
                <Calendar className="w-4 h-4 mr-2 text-emerald-400" />
                <span className="text-xs font-bold tracking-widest uppercase">{slide.event_date}</span>
              </div>
              <div className="flex items-center text-zinc-400">
                <MapPin className="w-4 h-4 mr-2 text-zinc-500" />
                <span className="text-xs font-bold">{slide.event_location}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentSlideIndex(i)}
            className={`w-12 h-1.5 transition-all duration-300 rounded-full ${i === currentSlideIndex ? 'bg-blue-500' : 'bg-zinc-700/50 hover:bg-zinc-500'}`}
          />
        ))}
      </div>
    </section>
  );
}
