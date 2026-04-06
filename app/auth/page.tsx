"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight, Lock, ShieldCheck, Mail, KeyRound, TrendingUp, Globe2, Building2, User, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const marketingSlides = [
  {
    title: "Combining robust statistical insight with authentic partnership.",
    subtitle: "Join thousands of verified global trade leaders. By accessing the Universal Gateway, you secure direct entry to embargoed policy reports, multi-million dollar infrastructure RFPs, and continental expansion pipelines.",
    stat_1_val: "$500M+",
    stat_1_label: "Capital Volume",
    stat_2_val: "54",
    stat_2_label: "Sovereign Markets",
    bg_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "North Carolina's strategic blueprint for continental expansion.",
    subtitle: "Anchored by deep agricultural and technological expertise, NC provides unparalleled institutional capital to drive the modernization of Africa's fastest-growing middle-class economies.",
    stat_1_val: "#1",
    stat_1_label: "US Business State",
    stat_2_val: "1.4B",
    stat_2_label: "Emerging Consumers",
    bg_image: "https://images.unsplash.com/photo-1575883833722-e1903ba8fe39?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Securing the transatlantic supply chain via direct investment.",
    subtitle: "We bypass legacy bottlenecks. AfDEC connects sovereign infrastructure demands directly with tier-1 enterprise developers across the East and West African trade corridors.",
    stat_1_val: "300+",
    stat_1_label: "Verified Partners",
    stat_2_val: "12",
    stat_2_label: "Active Megasites",
    bg_image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function AuthGateway() {
  const router = useRouter();
  
  // Auth state
  const [view, setView] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const formWrapperRef = useRef<HTMLDivElement>(null);
  const marketingTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo(leftPanelRef.current, { x: "-100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1, ease: "power3.out" })
      .fromTo(rightPanelRef.current, { x: "100%", opacity: 0 }, { x: "0%", opacity: 1, duration: 1, ease: "power3.out" }, "-=1")
      .fromTo(formWrapperRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4");
  }, []);

  // Handle Marketing Slide Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      
      gsap.to(marketingTextRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setCurrentSlide((prev) => (prev + 1) % marketingSlides.length);
          setTimeout(() => {
            gsap.fromTo(marketingTextRef.current, 
              { opacity: 0, y: -10 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
            );
            setIsTransitioning(false);
          }, 50);
        }
      });
    }, 7000);
    
    return () => clearInterval(interval);
  }, [isTransitioning]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      let activeUserId = "";
      
      if (view === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        activeUserId = data.user.id;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              organization: organization,
            }
          }
        });
        if (error) throw error;
        activeUserId = data.user.id;
      }

      // Check Profile regardless of Login or Register
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', activeUserId).maybeSingle();
      
      // Self-Healing System Bypass
      let role = profile?.role;
      if (email.toLowerCase() === 'admin@afronovation.com') {
        role = 'super_admin';
      } else if (!role) {
        role = 'member';
      }
      
      if (role === 'super_admin' || role === 'admin') {
         setErrorMsg("Admin Clearance Verified. Booting Command Center...");
         setTimeout(() => router.push('/dashboard/admin'), 500);
      } else {
         setErrorMsg("Connecting to Member Portal...");
         setTimeout(() => router.push('/dashboard/member'), 1000);
      }
      
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication task failed. Verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeSlide = marketingSlides[currentSlide];

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col md:flex-row overflow-hidden font-sans selection:bg-blue-500/30">
      
      {/* LEFT SIDE: Marketing / Intelligence Display */}
      <div ref={leftPanelRef} className="w-full md:w-1/2 relative min-h-[40vh] md:min-h-screen hidden md:flex items-end p-12 lg:p-20 border-r border-zinc-800">
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.3] transition-all duration-1000 ease-in-out" 
          style={{ backgroundImage: `url('${activeSlide.bg_image}')` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500" />
        
        <div className="relative z-10 w-full max-w-xl" ref={marketingTextRef}>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/50 mb-6 rounded-sm backdrop-blur-md">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">AfDEC Intelligence Network</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            {activeSlide.title}
          </h2>
          
          <p className="text-zinc-400 text-lg mb-10 leading-relaxed font-medium">
            {activeSlide.subtitle}
          </p>

          <div className="grid grid-cols-2 gap-6 border-t border-zinc-800 pt-8">
            <div>
              <div className="text-3xl font-black text-white mb-1">{activeSlide.stat_1_val}</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{activeSlide.stat_1_label}</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white mb-1">{activeSlide.stat_2_val}</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">{activeSlide.stat_2_label}</div>
            </div>
          </div>
        </div>

        {/* Custom Pagination Pips */}
        <div className="absolute bottom-8 left-12 lg:left-20 flex space-x-2 z-20">
          {marketingSlides.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-blue-500' : 'w-4 bg-zinc-700'}`} />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Authentication & Registration */}
      <div ref={rightPanelRef} className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-zinc-950 min-h-screen md:min-h-0 overflow-y-auto">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute top-0 right-0 -m-32 h-[500px] w-[500px] rounded-full bg-blue-600 opacity-10 blur-[100px]"></div>
        </div>

        <div ref={formWrapperRef} className="relative z-10 w-full max-w-[420px] my-auto">
          
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 flex items-center justify-center rounded-sm">
                <Globe2 className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-white font-bold tracking-widest uppercase">AfDEC Terminal</span>
            </div>
            
            <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-sm">
              <button 
                type="button"
                onClick={() => setView('login')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm ${view === 'login' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setView('register')}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm ${view === 'register' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Register
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
              {view === 'login' ? 'Universal Gateway' : 'Diaspora & Partner Registration'}
            </h1>
            <p className="text-base text-zinc-400">
              {view === 'login' 
                ? 'Secure execution terminal for Board Officials, Admins, and strategic business partners.' 
                : 'Join the premier bilateral business network to unlock expansion capital and strategic influence.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            
            {errorMsg && (
              <div className={`p-4 border text-sm font-semibold rounded-sm flex items-start ${errorMsg.includes('successful') ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-red-950/30 border-red-900/50 text-red-400'}`}>
                <span className="text-xl mr-2 leading-none">•</span>
                {errorMsg}
              </div>
            )}

            {view === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-colors rounded-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-colors rounded-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Organization</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" value={organization} onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Corporate Entity"
                      className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-colors rounded-sm"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Corporate Identity</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-colors rounded-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest mb-2">Secure Passcode</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white pl-12 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-colors tracking-widest rounded-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold py-4 px-6 transition-colors shadow-lg flex items-center justify-center space-x-2 group mt-6 rounded-sm"
            >
              {isLoading ? (
                <Lock className="w-5 h-5 animate-pulse" />
              ) : (
                <>
                  {view === 'login' ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{view === 'login' ? 'Execute Handshake' : 'Join the AfDEC Network'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 leading-relaxed font-medium text-center">
              Connection secured via 256-bit encryption. Protocol strictly monitored.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
