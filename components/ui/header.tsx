"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, ArrowRight, Globe, TrendingUp, Building2, Shield, Landmark } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

const navigation = [
  {
    name: "The Council",
    icon: Shield,
    sections: [
      {
        title: "Who We Are",
        links: [
          { name: "Board of Directors & Governance", href: "#" },
          { name: "AfDEC Strategic Framework (2026-2030)", href: "#" },
          { name: "Diaspora Impact Fund", href: "#" },
        ],
      },
      {
        title: "Operations",
        links: [
          { name: "Council Operations & Careers", href: "#" },
          { name: "Investor & Media Relations", href: "#" },
          { name: "Events", href: "/events" },
          { name: "News & Media", href: "/news" },
        ],
      },
    ],
  },
  {
    name: "Strategic Footprint",
    icon: Landmark,
    sections: [
      {
        title: "The Mandate",
        links: [
          { name: "Why North Carolina", href: "#" },
          { name: "Why Africa", href: "#" },
        ],
      },
      {
        title: "Infrastructure",
        links: [
          { name: "Dual-Continent Megasites", href: "#" },
          { name: "Sovereign Incentives & Grants", href: "#" },
        ],
      },
    ],
  },
  {
    name: "Transatlantic Integration",
    icon: Globe,
    sections: [
      {
        title: "Expansion",
        links: [
          { name: "Enterprise Expansion Support", href: "#" },
          { name: "Export & Trade Assistance", href: "#" },
        ],
      },
      {
        title: "Diplomatic Relations",
        links: [
          { name: "Strategic Government Partnerships", href: "#" },
          { name: "Market Access by Region", href: "#" },
        ],
      },
    ],
  },
  {
    name: "Sector Intelligence",
    icon: Building2,
    sections: [
      {
        title: "Core Sectors",
        links: [
          { name: "Agriculture & Farming", href: "#" },
          { name: "Sustainable Energy Transitions", href: "#" },
          { name: "Life Sciences & Bio-Economics", href: "#" },
        ],
      },
      {
        title: "Advanced Sectors",
        links: [
          { name: "Advanced Manufacturing & Aerospace", href: "#" },
          { name: "Financial Markets & Fintech", href: "#" },
          { name: "Defense & Autonomous Systems", href: "#" },
        ],
      },
    ],
  },
  {
    name: "Insights & Analytics",
    icon: TrendingUp,
    sections: [
      {
        title: "Research",
        links: [
          { name: "Policy Publications & Briefs", href: "#" },
          { name: "Transatlantic Market Outlook", href: "#" },
        ],
      },
      {
        title: "Data",
        links: [
          { name: "Diaspora Data Terminal", href: "#" },
        ],
      },
    ],
  },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = contextSafe((menuName: string) => {
    setActiveMenu(menuName);
    gsap.to(panelRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power3.out",
      display: "block",
    });
  });

  const handleMouseLeave = contextSafe(() => {
    setActiveMenu(null);
    gsap.to(panelRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.in",
      display: "none",
    });
  });

  return (
    <header 
      ref={containerRef}
      className="bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 relative"
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="relative z-20 shrink-0 mr-8">
          <BrandLogo isDarkTheme={true} />
        </div>

        {/* Global Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 h-full">
          {navigation.map((item) => (
            <div 
              key={item.name}
              className="h-full flex items-center relative cursor-pointer"
              onMouseEnter={() => handleMouseEnter(item.name)}
            >
              <span className={`text-sm font-medium transition-colors flex items-center group ${activeMenu === item.name ? 'text-blue-400' : 'text-zinc-300 hover:text-zinc-100'}`}>
                {item.name}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeMenu === item.name ? 'rotate-180 text-blue-400' : 'text-zinc-500'}`} />
              </span>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 relative z-20">
          <Link href="#" className="hidden md:block text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors">
            Initiate Expansion
          </Link>
          <Link href="#" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <span>Member Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Mega Menu Dropdown Panel */}
      <div 
        ref={panelRef}
        className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 shadow-2xl overflow-hidden hidden opacity-0 -translate-y-2"
        style={{ opacity: 0, display: 'none' }}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={`${item.name}-panel`}
                className={`grid grid-cols-12 gap-8 transition-opacity duration-300 ${activeMenu === item.name ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-x-6 top-12 pointer-events-none'}`}
              >
                <div className="col-span-4 border-r border-zinc-800/50 pr-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500/10 rounded-md">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-100">{item.name}</h2>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                    Access institutional resources, sector frameworks, and comprehensive guidance for the {item.name} sector of the council.
                  </p>
                </div>
                
                <div className="col-span-8 grid grid-cols-2 gap-x-12 gap-y-8">
                  {item.sections.map((section) => (
                    <div key={section.title}>
                      <h3 className="text-sm font-bold text-zinc-500 tracking-wider uppercase mb-4">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Link href={link.href} className="text-zinc-300 hover:text-blue-400 font-medium text-sm transition-colors block">
                              {link.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
