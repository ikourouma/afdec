"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, type GeoFeature } from "react-simple-maps";
import { X, TrendingUp, Users, DollarSign, Globe, ArrowRight, Star, MapPin, Lock } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

// Geo source with CDN fallback
const GEO_URL = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";
const GEO_URL_FALLBACK = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export type CountryRegion = "west" | "east" | "north" | "central" | "south";

/**
 * Public fields (name, region, capital, priority) come from the `v_country_teaser` view.
 * Numeric fields are ONLY ever loaded for signed-in users (RLS on `country_profiles`),
 * so visitors cannot recover them from the page source or network tab.
 */
export type CountryProfile = {
  iso3: string;
  name: string;
  region: CountryRegion;
  capital?: string | null;
  afdec_priority: boolean;
  gdp?: string;
  gdp_growth?: string;
  population?: string;
  fdi_inflows?: string;
  gdp_raw?: number;
  data_year?: number | null;
  headline?: string | null;
  afdec_note?: string | null;
};

export const REGION_COLORS: Record<CountryRegion, { fill: string; hover: string; label: string; dim: string }> = {
  west:    { fill: "#1d4ed8", hover: "#3b82f6", dim: "#1d4ed855", label: "West Africa" },
  east:    { fill: "#059669", hover: "#10b981", dim: "#05966955", label: "East Africa" },
  north:   { fill: "#7c3aed", hover: "#a78bfa", dim: "#7c3aed55", label: "North Africa" },
  central: { fill: "#d97706", hover: "#f59e0b", dim: "#d9770655", label: "Central Africa" },
  south:   { fill: "#dc2626", hover: "#f87171", dim: "#dc262655", label: "Southern Africa" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Complete AU 54 nations — ISO3 → Region assignment
// Includes: Western Sahara (diplomatic neutral), South Sudan, all island nations
// ─────────────────────────────────────────────────────────────────────────────
const ISO3_REGION: Record<string, CountryRegion> = {
  // North Africa (7 — incl. Western Sahara as diplomatic neutral)
  MAR: "north", DZA: "north", TUN: "north", LBY: "north",
  EGY: "north", SDN: "north", ESH: "north",

  // West Africa (16)
  NGA: "west", GHA: "west", SEN: "west", MLI: "west",
  BFA: "west", NER: "west", GIN: "west", SLE: "west",
  LBR: "west", CIV: "west", TGO: "west", BEN: "west",
  GMB: "west", GNB: "west", CPV: "west", MRT: "west",

  // East Africa (13 — incl. island nations, South Sudan)
  ETH: "east", KEN: "east", TZA: "east", UGA: "east",
  RWA: "east", BDI: "east", SOM: "east", DJI: "east",
  ERI: "east", MDG: "east", COM: "east", MUS: "east",
  SYC: "east", SSD: "east",

  // Central Africa (8)
  CMR: "central", CAF: "central", COD: "central", COG: "central",
  GAB: "central", GNQ: "central", STP: "central", TCD: "central",

  // Southern Africa (10 — Angola is SADC, moved from Central per AU/SADC classification)
  ZAF: "south", BWA: "south", LSO: "south", SWZ: "south",
  NAM: "south", ZWE: "south", MOZ: "south", ZMB: "south",
  MWI: "south", AGO: "south",
};

// Canonical country name → ISO3 (from world.geojson properties.name)
// Includes all known aliases used by different GeoJSON/TopoJSON sources
// Key fixes: Tanzania uses "United Republic of Tanzania" in world.geojson
//            Guinea-Bissau appears as "Guinea Bissau" (no hyphen) in some sources
const NAME_TO_ISO3: Record<string, string> = {
  // North Africa
  "Morocco": "MAR", "Algeria": "DZA", "Tunisia": "TUN",
  "Libya": "LBY", "Libyan Arab Jamahiriya": "LBY",
  "Egypt": "EGY", "Sudan": "SDN", "Western Sahara": "ESH", "W. Sahara": "ESH",
  // West Africa
  "Nigeria": "NGA", "Ghana": "GHA", "Senegal": "SEN", "Mali": "MLI",
  "Burkina Faso": "BFA", "Niger": "NER", "Guinea": "GIN",
  "Sierra Leone": "SLE", "Liberia": "LBR",
  "Ivory Coast": "CIV", "Côte d'Ivoire": "CIV", "Cote d'Ivoire": "CIV",
  "Togo": "TGO", "Benin": "BEN", "The Gambia": "GMB", "Gambia": "GMB",
  // Guinea-Bissau — multiple aliases across GeoJSON sources
  "Guinea-Bissau": "GNB", "Guinea Bissau": "GNB", "GuineaBissau": "GNB",
  // Cape Verde / Mauritania
  "Cape Verde": "CPV", "Cabo Verde": "CPV", "Mauritania": "MRT",
  // East Africa
  "Ethiopia": "ETH", "Kenya": "KEN",
  // Tanzania — world.geojson uses "United Republic of Tanzania"
  "Tanzania": "TZA", "United Republic of Tanzania": "TZA", "Tanzania, United Rep.": "TZA",
  "Uganda": "UGA", "Rwanda": "RWA", "Burundi": "BDI", "Somalia": "SOM", "Djibouti": "DJI",
  "Eritrea": "ERI", "Madagascar": "MDG", "Comoros": "COM",
  "Mauritius": "MUS", "Seychelles": "SYC",
  "South Sudan": "SSD", "S. Sudan": "SSD", "S Sudan": "SSD",
  // Central Africa — all Congo aliases
  "Cameroon": "CMR", "Central African Republic": "CAF", "Central African Rep.": "CAF",
  "Democratic Republic of the Congo": "COD", "Dem. Rep. Congo": "COD",
  "DR Congo": "COD", "DRC": "COD", "Congo, Dem. Rep.": "COD",
  "Congo, DR": "COD", "D.R. Congo": "COD",
  "Republic of the Congo": "COG", "Republic of Congo": "COG",
  "Congo": "COG", "Congo, Rep.": "COG", "Congo Republic": "COG",
  "Gabon": "GAB", "Equatorial Guinea": "GNQ",
  "São Tomé and Príncipe": "STP", "Sao Tome and Principe": "STP",
  "São Tomé e Príncipe": "STP", "Sao Tome e Principe": "STP",
  "Chad": "TCD", "Angola": "AGO",
  // Southern Africa
  "South Africa": "ZAF", "Botswana": "BWA", "Lesotho": "LSO",
  "Eswatini": "SWZ", "Swaziland": "SWZ", "Namibia": "NAM",
  "Zimbabwe": "ZWE", "Mozambique": "MOZ", "Zambia": "ZMB", "Malawi": "MWI",
};

// ─────────────────────────────────────────────────────────────────────────────
// Formatting
// ─────────────────────────────────────────────────────────────────────────────
function fmtUsd(n?: number | null): string | undefined {
  if (n == null) return undefined;
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  return `$${(n / 1e6).toFixed(0)}M`;
}
function fmtPop(n?: number | null): string | undefined {
  if (n == null) return undefined;
  return n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : `${(n / 1e6).toFixed(1)}M`;
}
function fmtPct(n?: number | null): string | undefined {
  if (n == null) return undefined;
  const v = Number(n);
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
}

type Row = Record<string, any>;
function rowToProfile(row: Row): CountryProfile | null {
  const iso3 = String(row.country_code || "").toUpperCase();
  const region = ISO3_REGION[iso3];
  if (!iso3 || !region) return null;
  return {
    iso3,
    name: row.country_name,
    region,
    capital: row.capital,
    afdec_priority: !!row.afdec_priority,
    gdp: fmtUsd(row.gdp_usd),
    gdp_raw: row.gdp_usd != null ? Number(row.gdp_usd) : undefined,
    gdp_growth: fmtPct(row.gdp_growth_pct),
    population: fmtPop(row.population),
    fdi_inflows: fmtUsd(row.fdi_inflows_usd),
    data_year: row.data_year,
    headline: row.overview,
    afdec_note: row.afdec_notes,
  };
}

// Western Sahara — diplomatic neutral tooltip data
const ESH_NOTE =
  "Disputed non-self-governing territory. AfDEC maintains diplomatic neutrality on its status in accordance with AU and UN positions.";

/** Placeholder shown instead of a real figure. The text is generic filler, NOT the real value. */
function Metric({ value, locked, filler }: { value?: string; locked: boolean; filler: string }) {
  if (!locked) return <>{value ?? "—"}</>;
  return (
    <span className="relative inline-flex items-center">
      <span aria-hidden="true" className="blur-[6px] select-none">{filler}</span>
      <span className="sr-only">Hidden. Register or sign in to view.</span>
    </span>
  );
}

type TooltipData = { name: string; iso3: string; region: CountryRegion | null; profile: CountryProfile | null; locked: boolean; x: number; y: number };

function MapTooltip({ data }: { data: TooltipData | null }) {
  if (!data) return null;
  const colors = data.region ? REGION_COLORS[data.region] : null;
  const profile = data.profile;
  const kpis = [
    { label: "GDP", value: profile?.gdp, filler: "$00.0B", color: "text-blue-300" },
    { label: "Growth", value: profile?.gdp_growth, filler: "+0.0%", color: "text-emerald-300" },
    { label: "Population", value: profile?.population, filler: "00.0M", color: "text-zinc-200" },
    { label: "FDI Inflows", value: profile?.fdi_inflows, filler: "$0.0B", color: "text-amber-300" },
  ];
  return (
    <div className="fixed z-[200] pointer-events-none" style={{ left: data.x + 14, top: data.y - 10, maxWidth: 260 }}>
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl shadow-black/60 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
          {colors && <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.fill }} />}
          <span className="text-white font-black text-sm tracking-tight">{data.name}</span>
          {data.iso3 === "ESH" && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded-full border border-purple-800/40">Disputed</span>
          )}
          {profile?.afdec_priority && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0 ml-auto" />}
        </div>
        {data.iso3 === "ESH" ? (
          <div className="px-4 py-3"><p className="text-zinc-300 text-xs leading-relaxed">{ESH_NOTE}</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-px bg-zinc-800/50">
              {kpis.map((k) => (
                <div key={k.label} className="bg-zinc-900 px-3 py-2">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">{k.label}</div>
                  <div className={`text-sm font-black ${k.color}`}><Metric value={k.value} locked={data.locked} filler={k.filler} /></div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 flex items-center justify-between">
              {colors && <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: colors.hover }}>{colors.label}</span>}
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">{data.locked ? "Click to request access" : "Click for full brief →"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export function AfricaMap({ compact = false }: { compact?: boolean }) {
  void compact;
  const { isSignedIn, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<Record<string, CountryProfile>>({});
  const [selectedCountry, setSelectedCountry] = useState<CountryProfile | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [dataSource, setDataSource] = useState<"loading" | "live" | "error">("loading");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [geoUrl, setGeoUrl] = useState<string>(GEO_URL);
  const [geoError, setGeoError] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Numbers are unlocked only when a signed-in user actually received them from the database.
  const unlocked = isSignedIn && Object.values(profiles).some((p) => p.gdp_raw !== undefined);
  const locked = !unlocked;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Pre-validate GeoJSON URL availability with timeout
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(GEO_URL, { signal: controller.signal, method: "HEAD" })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) setGeoUrl(GEO_URL_FALLBACK);
      })
      .catch(() => {
        clearTimeout(timeout);
        setGeoUrl(GEO_URL_FALLBACK);
        const c2 = new AbortController();
        const t2 = setTimeout(() => c2.abort(), 5000);
        fetch(GEO_URL_FALLBACK, { signal: c2.signal, method: "HEAD" })
          .then((res) => { clearTimeout(t2); if (!res.ok) setGeoError(true); })
          .catch(() => { clearTimeout(t2); setGeoError(true); });
      });
    return () => { clearTimeout(timeout); controller.abort(); };
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1280;

  // Teaser (public) first, then full figures if the database lets this user read them.
  useEffect(() => {
    if (authLoading) return;
    let active = true;
    (async () => {
      setDataSource("loading");
      const map: Record<string, CountryProfile> = {};
      const teaser = await supabase.from("v_country_teaser").select("*");
      if (teaser.error) {
        if (active) setDataSource("error");
        return;
      }
      (teaser.data ?? []).forEach((r) => {
        const p = rowToProfile(r);
        if (p) map[p.iso3] = p;
      });
      if (isSignedIn) {
        const full = await supabase.from("country_profiles").select("*");
        (full.data ?? []).forEach((r) => {
          const p = rowToProfile(r);
          if (p) map[p.iso3] = { ...map[p.iso3], ...p };
        });
      }
      if (!active) return;
      setProfiles(map);
      setDataSource("live");
    })();
    return () => { active = false; };
  }, [authLoading, isSignedIn]);

  const getCountryISO3 = useCallback((geo: GeoFeature): string | null => {
    const name = (geo.properties.name ?? geo.properties.NAME ?? "") as string;
    return NAME_TO_ISO3[name] ?? null;
  }, []);

  const getFillColor = useCallback((geo: GeoFeature): string => {
    const iso3 = getCountryISO3(geo);
    if (!iso3) return "transparent";
    if (iso3 === "ESH") return REGION_COLORS.north.fill + "88";
    const region = ISO3_REGION[iso3];
    return region ? REGION_COLORS[region].fill : "#27272a";
  }, [getCountryISO3]);

  const getHoverColor = useCallback((geo: GeoFeature): string => {
    const iso3 = getCountryISO3(geo);
    if (!iso3) return "transparent";
    if (iso3 === "ESH") return REGION_COLORS.north.hover + "aa";
    const region = ISO3_REGION[iso3];
    return region ? REGION_COLORS[region].hover : "#3f3f46";
  }, [getCountryISO3]);

  const handleMouseMove = useCallback((geo: GeoFeature, evt: React.MouseEvent) => {
    const iso3 = getCountryISO3(geo);
    if (!iso3) { setTooltip(null); return; }
    const countryName = (geo.properties.name ?? geo.properties.NAME ?? iso3) as string;
    setTooltip({
      name: iso3 === "ESH" ? "Western Sahara" : countryName,
      iso3,
      region: ISO3_REGION[iso3] ?? null,
      profile: iso3 === "ESH" ? null : profiles[iso3] ?? null,
      locked,
      x: evt.clientX,
      y: evt.clientY,
    });
  }, [getCountryISO3, profiles, locked]);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  const handleCountryClick = useCallback((geo: GeoFeature) => {
    const iso3 = getCountryISO3(geo);
    if (!iso3) return;
    const fallbackName = (geo.properties.name ?? geo.properties.NAME ?? iso3) as string;
    const profile: CountryProfile =
      profiles[iso3] ?? { iso3, name: iso3 === "ESH" ? "Western Sahara" : fallbackName, region: ISO3_REGION[iso3] ?? "north", afdec_priority: false };
    setSelectedCountry(profile);
    setTooltip(null);
  }, [getCountryISO3, profiles]);

  // Default panel list: top 10 by GDP for authorised users; AfDEC priority markets (names only) for everyone else.
  const listEntries = unlocked
    ? Object.values(profiles).filter((p) => p.gdp_raw !== undefined).sort((a, b) => (b.gdp_raw ?? 0) - (a.gdp_raw ?? 0)).slice(0, 10)
    : Object.values(profiles).filter((p) => p.afdec_priority).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 10);

  const briefHref = (p: CountryProfile) => (isSignedIn ? `/africa-intelligence/${p.iso3}` : `/access-request?country=${p.iso3}`);

  return (
    <>
      <MapTooltip data={tooltip} />

      <div className="relative w-full" ref={mapContainerRef}>
        {/* Status bar */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-8 items-center">
          <div className="flex items-center gap-2 mr-4">
            {dataSource === "loading" && (
              <>
                <span className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse" />
                <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">Connecting…</span>
              </>
            )}
            {dataSource === "live" && (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs font-black text-emerald-300 uppercase tracking-widest">{unlocked ? "Live data" : "Preview · register for figures"}</span>
              </>
            )}
            {dataSource === "error" && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest">Data temporarily unavailable</span>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-6 gap-y-3 flex-1">
            {Object.entries(REGION_COLORS).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: val.fill }} />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{val.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">AfDEC Priority</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 xl:items-stretch">
          {/* Map canvas */}
          <div className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-xl overflow-hidden relative min-h-[420px] sm:min-h-[600px] lg:min-h-[700px]">
            {geoError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0a0a0a]">
                <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-800/40 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-amber-500" />
                </div>
                <div className="text-center max-w-sm px-4">
                  <h3 className="text-white font-black text-lg mb-2">Map Temporarily Offline</h3>
                  <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-4">The map could not reach its geospatial data source. Please retry.</p>
                  <button
                    onClick={() => { setGeoError(false); setGeoUrl(GEO_URL); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest rounded-sm border border-zinc-700"
                  >
                    <Globe className="w-3.5 h-3.5" /> Retry Connection
                  </button>
                </div>
              </div>
            ) : (
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: isMobile ? 320 : isTablet ? 360 : 400, center: isMobile ? [18, 5] : [20, 2] }}
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup zoom={1} center={isMobile ? [18, 5] : [20, 2]} minZoom={0.8} maxZoom={6}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }: { geographies: GeoFeature[] }) =>
                      geographies.map((geo) => {
                        const iso3 = getCountryISO3(geo);
                        if (!iso3 && !ISO3_REGION[iso3 ?? ""]) return null;
                        const fill = getFillColor(geo);
                        if (fill === "transparent") return null;
                        const hover = getHoverColor(geo);
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={fill}
                            stroke="#09090b"
                            strokeWidth={0.6}
                            style={{
                              default: { outline: "none", transition: "fill 0.15s ease" },
                              hover: { outline: "none", fill: hover, cursor: "pointer" },
                              pressed: { outline: "none", fill: hover },
                            }}
                            onMouseMove={(evt: React.MouseEvent) => handleMouseMove(geo, evt)}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleCountryClick(geo)}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            )}
            {!geoError && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-zinc-300 font-medium">
                <MapPin className="w-3 h-3" />
                {isMobile ? "Pinch to zoom · Tap a country" : "Scroll to zoom · Drag to pan · Click a country"}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <div className="xl:w-[380px] shrink-0 flex flex-col">
            {selectedCountry ? (
              <div className="bg-zinc-900/80 border border-zinc-700 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: REGION_COLORS[selectedCountry.region].fill }} />
                      <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{REGION_COLORS[selectedCountry.region].label}</span>
                      {selectedCountry.afdec_priority && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 ml-1" />}
                    </div>
                    <h3 className="text-2xl font-black text-white">{selectedCountry.name}</h3>
                    {selectedCountry.capital && <p className="text-xs text-zinc-300 mt-1">Capital: {selectedCountry.capital}</p>}
                    {unlocked && selectedCountry.data_year && <p className="text-xs text-zinc-400 mt-1">Data year: {selectedCountry.data_year}</p>}
                  </div>
                  <button aria-label="Close country panel" onClick={() => setSelectedCountry(null)} className="text-zinc-300 hover:text-white p-1 shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedCountry.iso3 === "ESH" ? (
                  <div className="px-6 py-4"><p className="text-zinc-300 text-sm leading-relaxed">{ESH_NOTE}</p></div>
                ) : (
                  <>
                    <div className="relative">
                      <div className="grid grid-cols-2 gap-px bg-zinc-800/50">
                        {[
                          { icon: DollarSign, label: "GDP", value: selectedCountry.gdp, filler: "$00.0B", color: "text-blue-300" },
                          { icon: TrendingUp, label: "GDP Growth", value: selectedCountry.gdp_growth, filler: "+0.0%", color: "text-emerald-300" },
                          { icon: Users, label: "Population", value: selectedCountry.population, filler: "00.0M", color: "text-purple-300" },
                          { icon: Globe, label: "FDI Inflows", value: selectedCountry.fdi_inflows, filler: "$0.0B", color: "text-amber-300" },
                        ].map((kpi) => (
                          <div key={kpi.label} className="bg-zinc-900 p-5">
                            <div className="flex items-center gap-2 mb-2">
                              <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">{kpi.label}</span>
                            </div>
                            <div className={`text-xl font-black ${kpi.color}`}><Metric value={kpi.value} locked={locked} filler={kpi.filler} /></div>
                          </div>
                        ))}
                      </div>
                      {locked && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="inline-flex items-center gap-2 bg-zinc-950/90 border border-zinc-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                            <Lock className="w-3.5 h-3.5" /> Registered partners only
                          </span>
                        </div>
                      )}
                    </div>

                    {unlocked && selectedCountry.headline && (
                      <div className="px-6 py-4 border-t border-zinc-800/60">
                        <p className="text-zinc-200 text-sm leading-relaxed font-medium line-clamp-4">{selectedCountry.headline}</p>
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <Link
                        href={briefHref(selectedCountry)}
                        className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-colors group"
                      >
                        {isSignedIn ? `Open full ${selectedCountry.name} brief` : "Request access to full brief"}
                        <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      {!isSignedIn && (
                        <Link href={`/auth?redirect=${encodeURIComponent(`/africa-intelligence/${selectedCountry.iso3}`)}`} className="block text-center text-xs font-bold text-zinc-200 hover:text-white underline underline-offset-4">
                          Already registered? Sign in
                        </Link>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col">
                <div className="px-6 py-5 border-b border-zinc-800">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{unlocked ? "Top 10 Economies" : "AfDEC Priority Markets"}</h3>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium">
                    {unlocked ? "Largest African economies in the AfDEC database, by GDP" : "Register to unlock GDP, growth, population and FDI for every market"}
                  </p>
                </div>
                <div className="divide-y divide-zinc-800/60 flex-1 overflow-y-auto min-h-0">
                  {dataSource === "loading" && <p className="px-5 py-6 text-sm text-zinc-300">Loading…</p>}
                  {dataSource === "live" && listEntries.length === 0 && <p className="px-5 py-6 text-sm text-zinc-300">No markets published yet.</p>}
                  {listEntries.map((entry, i) => (
                    <button key={entry.iso3} onClick={() => setSelectedCountry(entry)} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/50 transition-colors text-left group">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <span className="text-xs font-black text-zinc-200">{i + 1}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: REGION_COLORS[entry.region].fill }} />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-bold text-zinc-100 group-hover:text-white block truncate">{entry.name}</span>
                        <span className="text-xs text-zinc-300"><Metric value={entry.gdp} locked={locked} filler="$00.0B" /></span>
                      </div>
                      <span className="text-xs font-black text-emerald-300 shrink-0"><Metric value={entry.gdp_growth} locked={locked} filler="+0.0%" /></span>
                      <ArrowRight className="w-3 h-3 text-zinc-400 group-hover:text-blue-300 shrink-0" />
                    </button>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-zinc-800/60">
                  <p className="text-xs text-zinc-400 font-medium">Sources: IMF, World Bank, AfDB · Select a country for its brief</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}