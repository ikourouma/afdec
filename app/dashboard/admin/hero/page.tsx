"use client";

import React, { useState } from "react";
import { Plus, GripVertical, CheckCircle2, Image as ImageIcon, Video, Type, Save } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function HeroEditorPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchSlides() {
      const { data } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
      if (data && data.length > 0) {
        setSlides(data);
        setActiveSlide(data[0]);
      }
      setIsLoading(false);
    }
    fetchSlides();
  }, []);

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Hero UI Engine</h1>
          <p className="text-zinc-500 font-medium mt-1">Manage the live rotating landing page slides and marketing media.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white rounded-sm transition-colors shadow-md">
          <Plus className="w-4 h-4 mr-2" />
          Create New Slide
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Panel - Sorting & active list */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 px-2">
            <span>Slide Execution Order</span>
            <span>Status</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs animate-pulse">Syncing Telemetry...</div>
          ) : slides.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 font-bold tracking-widest uppercase text-xs">No Active Slides Found.</div>
          ) : slides.map((slide, idx) => (
            <div 
              key={slide.id}
              onClick={() => setActiveSlide(slide)}
              className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${
                activeSlide?.id === slide.id 
                ? 'bg-blue-50/50 border-blue-200 shadow-sm relative' 
                : 'bg-white border-zinc-200 hover:border-blue-300'
              }`}
            >
              {activeSlide?.id === slide.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-md" />
              )}
              <GripVertical className="w-5 h-5 text-zinc-300 mr-3 cursor-grab hidden sm:block" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  {slide.type === 'video' ? <Video className="w-4 h-4 text-zinc-400" /> : <ImageIcon className="w-4 h-4 text-zinc-400" />}
                  <span className="text-xs font-semibold text-zinc-500 uppercase">Slide {idx + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 truncate">{slide.title}</h3>
              </div>
              <div className="ml-4 shrink-0 flex items-center">
                {slide.is_active 
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> 
                  : <div className="w-2 h-2 rounded-full bg-zinc-300 mr-1.5 p-1" />
                }
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Configuration Editor */}
        <div className="lg:col-span-8">
          {activeSlide ? (
            <div className="bg-white border border-zinc-200 rounded-md shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50 rounded-t-md">
                <h2 className="text-lg font-bold text-zinc-800 flex items-center">
                  <Type className="w-5 h-5 mr-2 text-zinc-400" />
                  Live Configuration
                </h2>
                <span className="text-xs font-semibold text-zinc-400 truncate max-w-[200px]">ID: {activeSlide.id}</span>
              </div>

            <div className="p-6 md:p-8 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Display Mode</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium cursor-pointer"
                    defaultValue={activeSlide.type}
                  >
                    <option value="dual_image">Dual Split Image</option>
                    <option value="single_image">Fullscreen Graphic</option>
                    <option value="video">Fullscreen Video (.mp4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Execution Status</label>
                  <select 
                    className="w-full bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-medium cursor-pointer"
                    defaultValue={activeSlide.status}
                  >
                    <option value="published">Published (Live Action)</option>
                    <option value="draft">Draft / Pending</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Primary Headline</label>
                <input 
                  type="text" 
                  defaultValue={activeSlide.title}
                  className="w-full font-bold text-xl text-zinc-900 p-3 bg-white border border-zinc-300 rounded-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Action Button 1 (Text)</label>
                  <input type="text" defaultValue="Initiate Expansion" className="w-full font-medium text-sm text-zinc-900 p-2.5 bg-white border border-zinc-300 rounded-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                 <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Action Button 1 (Target URL)</label>
                  <input type="text" defaultValue="/portal" className="w-full font-medium text-sm text-blue-600 p-2.5 bg-white border border-zinc-300 rounded-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              {/* Media Configuration Area */}
              <div className="p-6 bg-zinc-50 border border-zinc-200 border-dashed rounded-md text-center">
                 <ImageIcon className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                 <h4 className="text-sm font-bold text-zinc-700">Media Injection Required</h4>
                 <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto leading-relaxed">
                   Upload new edge-to-edge photography or .mp4 video files directly to the internal AfDEC Supabase storage bucket.
                 </p>
                 <button className="mt-4 px-4 py-2 bg-white border border-zinc-300 text-zinc-700 font-semibold text-xs rounded-sm hover:bg-zinc-100 transition-colors">
                   Access Storage Bucket
                 </button>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-100 gap-3">
                <button className="px-5 py-2.5 text-sm font-bold text-zinc-600 hover:bg-zinc-100 rounded-sm transition-colors">
                  Discard Changes
                </button>
                <button className="flex items-center px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-sm font-bold text-white rounded-sm transition-colors shadow-md">
                  <Save className="w-4 h-4 mr-2" />
                  Execute Update
                </button>
              </div>

            </div>
          </div>
          ) : (
            <div className="flex items-center justify-center bg-zinc-50 border border-zinc-200 rounded-md shadow-sm p-12 text-zinc-500">
               <span className="font-bold uppercase tracking-widest text-xs">No Active Slide Telemetry Found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
