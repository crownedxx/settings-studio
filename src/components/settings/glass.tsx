import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { RotateCcw, X } from "lucide-react";

export type GlassSettings = {
  tint: string;
  tintAmount: number; // 0-100
  blur: number; // px
  saturation: number; // %
  brightness: number; // %
  refraction: number; // displacement scale
  frequency: number; // distortion ripple size 1-100
  chroma: number; // chromatic aberration 0-20
  rim: number; // edge highlight 0-100
  angle: number; // light angle deg
  depth: number; // inner bevel 0-60
  shine: number; // specular 0-100
  grain: number; // 0-100
  radius: number; // px
  shadow: number; // 0-100
  followCursor: boolean;
  refractOn: boolean;
  dark: boolean;
  wallpaper: number;
};

export const defaults: GlassSettings = {
  tint: "#ffffff", tintAmount: 18, blur: 22, saturation: 180, brightness: 108, refraction: 28, frequency: 18,
  chroma: 4, rim: 70, angle: 135, depth: 18, shine: 55, grain: 12, radius: 22, shadow: 45,
  followCursor: true, refractOn: true, dark: false, wallpaper: 0,
};

export const presets: { name: string; swatch: string; s: Partial<GlassSettings> }[] = [
  { name: "Crystal", swatch: "#ffffff", s: { tint: "#ffffff", tintAmount: 8, blur: 8, saturation: 200, refraction: 45, chroma: 7, rim: 90, shine: 70, dark: false } },
  { name: "Frosted", swatch: "#f2f4f8", s: { tint: "#f4f6fb", tintAmount: 35, blur: 34, saturation: 160, refraction: 18, chroma: 2, rim: 60, shine: 40, dark: false } },
  { name: "Graphite", swatch: "#2a2c31", s: { tint: "#1d1f24", tintAmount: 45, blur: 26, saturation: 150, refraction: 24, chroma: 3, rim: 45, shine: 35, dark: true } },
  { name: "Midnight", swatch: "#1b2a5c", s: { tint: "#14204a", tintAmount: 40, blur: 24, saturation: 190, refraction: 30, chroma: 5, rim: 55, shine: 45, dark: true } },
  { name: "Aurora", swatch: "#7a6cff", s: { tint: "#8b7dff", tintAmount: 26, blur: 20, saturation: 210, refraction: 34, chroma: 8, rim: 75, shine: 60, dark: false } },
  { name: "Emerald", swatch: "#2fbf8a", s: { tint: "#3cc896", tintAmount: 24, blur: 22, saturation: 190, refraction: 26, chroma: 4, rim: 70, shine: 55, dark: false } },
  { name: "Amber", swatch: "#ffb347", s: { tint: "#ffb347", tintAmount: 24, blur: 20, saturation: 190, refraction: 26, chroma: 4, rim: 75, shine: 60, dark: false } },
  { name: "Rose", swatch: "#ff7aa8", s: { tint: "#ff86ae", tintAmount: 24, blur: 22, saturation: 190, refraction: 28, chroma: 5, rim: 75, shine: 60, dark: false } },
];

export const wallpapers = [
  ["oklch(0.72 0.19 30)", "oklch(0.7 0.17 250)", "oklch(0.85 0.15 90)", "oklch(0.65 0.2 320)"],
  ["oklch(0.6 0.18 270)", "oklch(0.75 0.15 200)", "oklch(0.55 0.2 300)", "oklch(0.8 0.12 170)"],
  ["oklch(0.75 0.16 150)", "oklch(0.85 0.15 110)", "oklch(0.6 0.14 200)", "oklch(0.7 0.15 60)"],
  ["oklch(0.3 0.08 260)", "oklch(0.45 0.15 290)", "oklch(0.35 0.1 220)", "oklch(0.55 0.18 340)"],
];

type Ctx = { s: GlassSettings; set: (p: Partial<GlassSettings>) => void; reset: () => void; open: boolean; setOpen: (v: boolean) => void };
const GlassCtx = createContext<Ctx | null>(null);
export const useGlass = () => useContext(GlassCtx)!;
const KEY = "liquid-glass-settings";

export function GlassProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<GlassSettings>(defaults);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...defaults, ...JSON.parse(raw) }); } catch { /* ignore */ }
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(s)); }, [s]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", s.dark);
  }, [s.dark]);

  useEffect(() => {
    const root = document.documentElement;
    if (!s.followCursor) { root.style.setProperty("--mx", "30%"); root.style.setProperty("--my", "10%"); return; }
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { root.style.setProperty("--mx", `${e.clientX}px`); root.style.setProperty("--my", `${e.clientY}px`); });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [s.followCursor]);

  const style = useMemo(() => {
    const base = `blur(${s.blur}px) saturate(${s.saturation}%) brightness(${s.brightness}%)`;
    return {
      "--g-tint": s.tint,
      "--g-tint-amt": `${s.tintAmount}%`,
      "--g-filter": s.refractOn && s.refraction > 0 ? `url(#lg-refract) ${base}` : base,
      "--g-filter-soft": `blur(${Math.round(s.blur * 0.6)}px) saturate(${s.saturation}%)`,
      "--g-rim": s.rim / 100,
      "--g-angle": `${s.angle}deg`,
      "--g-depth": `${s.depth}px`,
      "--g-shine": s.shine / 100,
      "--g-grain": s.grain / 100 * 0.35,
      "--g-chroma": `${s.chroma}px`,
      "--g-chroma-a": Math.min(1, s.chroma / 12),
      "--g-radius": `${s.radius}px`,
      "--g-shadow": s.shadow / 100,
    } as React.CSSProperties;
  }, [s]);

  const ctx: Ctx = { s, set: (p) => setS((o) => ({ ...o, ...p })), reset: () => setS(defaults), open, setOpen };
  const w = (wallpapers[s.wallpaper] ?? wallpapers[0])!;

  return (
    <GlassCtx.Provider value={ctx}>
      <div style={style} className="relative h-full w-full">
        <RefractionFilter s={s} />
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: w[0] }}>
          {w.map((c, i) => (
            <div key={i} className="lg-blob" style={{ background: c, left: `${[5, 55, 25, 70][i]}%`, top: `${[0, 10, 50, 55][i]}%`, animationDelay: `${i * -6}s` }} />
          ))}
          <div className="lg-stripes" />
        </div>
        {children}
      </div>
    </GlassCtx.Provider>
  );
}

function RefractionFilter({ s }: { s: GlassSettings }) {
  const f = (s.frequency / 1000).toFixed(4);
  const c = s.chroma;
  const ch = (id: string, scale: number, m: string) => (
    <>
      <feDisplacementMap in="SourceGraphic" in2="map" scale={scale} xChannelSelector="R" yChannelSelector="G" result={`d${id}`} />
      <feColorMatrix in={`d${id}`} type="matrix" values={m} result={id} />
    </>
  );
  return (
    <svg width="0" height="0" className="absolute">
      <filter id="lg-refract" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency={`${f} ${f}`} numOctaves={2} seed={7} result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="map" />
        {ch("r", s.refraction + c, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0")}
        {ch("g", s.refraction, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0")}
        {ch("b", Math.max(0, s.refraction - c), "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0")}
        <feBlend in="r" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="b" mode="screen" />
      </filter>
    </svg>
  );
}

/* ---------- Customizer ---------- */

export function GlassCustomizer() {
  const { s, set, reset, open, setOpen } = useGlass();
  const drag = useDragControls();
  return (
    <AnimatePresence>
      {open && (
        <motion.div drag dragListener={false} dragControls={drag} dragMomentum={false}
          initial={{ opacity: 0, scale: 0.9, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.92, y: 20, filter: "blur(8px)" }} transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="lg lg-strong fixed right-5 top-5 z-[60] flex max-h-[calc(100vh-7rem)] w-80 flex-col overflow-hidden">
          <div onPointerDown={(e) => drag.start(e)} className="flex cursor-grab items-center justify-between px-4 pb-2 pt-3 active:cursor-grabbing">
            <div>
              <div className="text-[13px] font-semibold">Liquid Glass</div>
              <div className="text-[11px] text-muted-foreground">Drag me anywhere</div>
            </div>
            <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
              <IconBtn title="Reset" onClick={reset}><RotateCcw className="size-3.5" /></IconBtn>
              <IconBtn title="Close" onClick={() => setOpen(false)}><X className="size-3.5" /></IconBtn>
            </div>
          </div>
          <div className="space-y-4 overflow-y-auto px-4 pb-4">
            <Group title="Presets">
              <div className="grid grid-cols-4 gap-2">
                {presets.map((p) => (
                  <button key={p.name} onClick={() => set(p.s)} className="group flex flex-col items-center gap-1">
                    <span className="lg-orb size-9 rounded-full transition group-hover:scale-110" style={{ background: p.swatch }} />
                    <span className="text-[10px] text-muted-foreground">{p.name}</span>
                  </button>
                ))}
              </div>
            </Group>

            <Group title="Colour">
              <div className="flex items-center gap-3">
                <label className="lg-orb relative size-9 shrink-0 cursor-pointer overflow-hidden rounded-full" style={{ background: s.tint }}>
                  <input type="color" value={s.tint} onChange={(e) => set({ tint: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" />
                </label>
                <input value={s.tint} onChange={(e) => set({ tint: e.target.value })} className="lg-inset w-full rounded-lg px-2 py-1 font-mono text-xs outline-none" />
              </div>
              <Range label="Tint strength" v={s.tintAmount} max={100} unit="%" on={(tintAmount) => set({ tintAmount })} />
              <Switch label="Dark text & controls" v={s.dark} on={(dark) => set({ dark })} />
            </Group>

            <Group title="Refraction">
              <Switch label="Lens refraction" v={s.refractOn} on={(refractOn) => set({ refractOn })} />
              <Range label="Refraction" v={s.refraction} max={120} on={(refraction) => set({ refraction })} />
              <Range label="Ripple size" v={s.frequency} min={2} max={80} on={(frequency) => set({ frequency })} />
              <Range label="Chromatic aberration" v={s.chroma} max={20} on={(chroma) => set({ chroma })} />
            </Group>

            <Group title="Material">
              <Range label="Blur" v={s.blur} max={60} unit="px" on={(blur) => set({ blur })} />
              <Range label="Saturation" v={s.saturation} min={50} max={300} unit="%" on={(saturation) => set({ saturation })} />
              <Range label="Brightness" v={s.brightness} min={60} max={150} unit="%" on={(brightness) => set({ brightness })} />
              <Range label="Grain" v={s.grain} max={100} on={(grain) => set({ grain })} />
            </Group>

            <Group title="Lighting">
              <Range label="Edge highlight" v={s.rim} max={100} on={(rim) => set({ rim })} />
              <Range label="Specular shine" v={s.shine} max={100} on={(shine) => set({ shine })} />
              <Range label="Light angle" v={s.angle} max={360} unit="°" on={(angle) => set({ angle })} />
              <Range label="Bevel depth" v={s.depth} max={60} unit="px" on={(depth) => set({ depth })} />
              <Switch label="Light follows cursor" v={s.followCursor} on={(followCursor) => set({ followCursor })} />
            </Group>

            <Group title="Shape">
              <Range label="Corner radius" v={s.radius} max={40} unit="px" on={(radius) => set({ radius })} />
              <Range label="Shadow" v={s.shadow} max={100} on={(shadow) => set({ shadow })} />
            </Group>

            <Group title="Wallpaper">
              <div className="grid grid-cols-4 gap-2">
                {wallpapers.map((w, i) => (
                  <button key={i} onClick={() => set({ wallpaper: i })}
                    className={`h-10 rounded-lg transition ${s.wallpaper === i ? "ring-2 ring-primary ring-offset-1 ring-offset-transparent" : "opacity-80 hover:opacity-100"}`}
                    style={{ background: `linear-gradient(135deg, ${w[0]}, ${w[1]}, ${w[3]})` }} />
                ))}
              </div>
            </Group>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconBtn({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className="rounded-full p-1.5 text-muted-foreground transition hover:bg-sidebar-accent hover:text-foreground">{children}</button>;
}
function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="lg-inset space-y-3 rounded-xl p-3">{children}</div>
    </div>
  );
}
function Range({ label, v, on, min = 0, max, unit = "" }: { label: string; v: number; on: (n: number) => void; min?: number; max: number; unit?: string }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-[11px]"><span>{label}</span><span className="tabular-nums text-muted-foreground">{v}{unit}</span></div>
      <input type="range" min={min} max={max} value={v} onChange={(e) => on(+e.target.value)} className="lg-range w-full" />
    </label>
  );
}
function Switch({ label, v, on }: { label: string; v: boolean; on: (b: boolean) => void }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span>{label}</span>
      <button role="switch" aria-checked={v} onClick={() => on(!v)}
        className={`flex h-5 w-9 items-center rounded-full p-[2px] transition-colors ${v ? "justify-end bg-primary" : "justify-start bg-input"}`}>
        <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 35 }} className="lg-knob size-4 rounded-full" />
      </button>
    </div>
  );
}
