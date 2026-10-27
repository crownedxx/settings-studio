import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { groups, type Page } from "./data";
import { FieldRow } from "./Fields";

const allPages = groups.flatMap((g) => g.pages);
const groupLabel = (id: string) => groups.find((g) => g.pages.some((p) => p.id === id))!.label;
const num = (id: string) => String(allPages.findIndex((p) => p.id === id) + 1).padStart(2, "0");

const SPRING = { type: "spring", stiffness: 480, damping: 38 } as const;

export function SettingsWindow() {
  const constraints = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  const [full, setFull] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [closed, setClosed] = useState(false);
  const [activeId, setActiveId] = useState("account");
  const [history, setHistory] = useState<string[]>(["account"]);
  const [hIdx, setHIdx] = useState(0);
  const [query, setQuery] = useState("");

  const active = allPages.find((p) => p.id === activeId)!;

  const go = (id: string) => {
    if (id === activeId) return;
    const h = [...history.slice(0, hIdx + 1), id];
    setHistory(h); setHIdx(h.length - 1); setActiveId(id);
  };
  const step = (d: number) => { const i = hIdx + d; if (history[i]) { setHIdx(i); setActiveId(history[i]); } };

  const filtered = useMemo(() => groups.map((g) => ({
    ...g, pages: g.pages.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())),
  })).filter((g) => g.pages.length), [query]);

  const reopen = () => { setClosed(false); setMinimised(false); };

  return (
    <div ref={constraints} className="relative flex h-full w-full items-center justify-center p-6">
      <AnimatePresence>
        {!closed && !minimised && (
          <motion.div
            key="win"
            drag={!full}
            dragListener={false}
            dragControls={drag}
            dragConstraints={constraints}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={full
              ? { opacity: 1, scale: 1, x: 0, y: 0, width: "100vw", height: "100vh" }
              : { opacity: 1, scale: 1, width: "min(1180px, calc(100vw - 3rem))", height: "min(760px, calc(100vh - 3rem))" }}
            exit={minimised ? { opacity: 0, scale: 0.2, y: 400 } : { opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={`flex flex-col overflow-hidden bg-window shadow-window ${full ? "fixed inset-0 z-50 rounded-none" : "rounded-[14px] ring-1 ring-foreground/10"}`}
          >
            {/* ── Window chrome ─────────────────────────────────────────── */}
            <div
              onPointerDown={(e) => !full && drag.start(e)}
              onDoubleClick={() => setFull(!full)}
              className={`flex h-11 shrink-0 select-none items-center gap-3 border-b border-rule bg-titlebar px-3.5 ${full ? "" : "cursor-grab active:cursor-grabbing"}`}
            >
              <div className="group flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
                <Light className="bg-traffic-close" label="×" onClick={() => setClosed(true)} />
                <Light className="bg-traffic-min" label="−" onClick={() => { setFull(false); setMinimised(true); }} />
                <Light className="bg-traffic-max" label="⤢" onClick={() => setFull(!full)} />
              </div>
              <div className="ml-1 flex gap-0.5" onPointerDown={(e) => e.stopPropagation()}>
                <NavBtn disabled={hIdx === 0} onClick={() => step(-1)}><ChevronLeft className="size-3.5" /></NavBtn>
                <NavBtn disabled={hIdx === history.length - 1} onClick={() => step(1)}><ChevronRight className="size-3.5" /></NavBtn>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                >
                  <span>{groupLabel(active.id)}</span>
                  <span className="text-rule">/</span>
                  <span className="text-foreground">{active.label}</span>
                </motion.div>
              </AnimatePresence>
              <div className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
                {num(active.id)} of {String(allPages.length).padStart(2, "0")}
              </div>
            </div>

            <div className="@container flex min-h-0 flex-1">
              {/* ── Index rail ──────────────────────────────────────────── */}
              <aside className="flex w-52 shrink-0 flex-col border-r border-rule bg-sidebar">
                <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
                  <Search className="size-3.5 shrink-0 text-muted-foreground/70" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="find a setting"
                    className="w-full bg-transparent font-mono text-[11px] text-foreground outline-none placeholder:text-muted-foreground/55"
                  />
                </div>

                <nav className="flex-1 overflow-y-auto px-2.5 py-4">
                  {filtered.map((g) => (
                    <div key={g.label} className="mb-5 last:mb-0">
                      <div className="flex items-center gap-2 px-2 pb-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70">{g.label}</span>
                        <span className="h-px flex-1 bg-rule" />
                      </div>
                      {g.pages.map((p) => (
                        <NavItem key={p.id} page={p} n={num(p.id)} active={p.id === activeId} onClick={() => go(p.id)} />
                      ))}
                    </div>
                  ))}
                  {!filtered.length && <div className="px-2 font-mono text-[11px] text-muted-foreground">no match</div>}
                </nav>

                <button onClick={() => go("account")} className="flex items-center gap-2.5 border-t border-rule p-3 text-left transition-colors hover:bg-hover">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-foreground font-mono text-[11px] text-background">AM</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] font-medium text-foreground">Alex Morgan</span>
                    <span className="block truncate font-mono text-[10px] text-muted-foreground">alex@example.com</span>
                  </span>
                </button>
              </aside>

              {/* ── Ledger ──────────────────────────────────────────────── */}
              <section className="grain relative min-w-0 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="mx-auto max-w-[560px] px-7 py-7"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        <span className="text-primary">{num(active.id)}</span>
                        <span className="text-rule">/</span>
                        <span>{groupLabel(active.id)}</span>
                      </div>
                      <div className="mt-3 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h1 className="font-display text-[30px] font-normal leading-none tracking-tight text-foreground">{active.label}</h1>
                          <p className="mt-2.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">{active.subtitle}</p>
                        </div>
                        <active.icon className="size-9 shrink-0 text-foreground/10" strokeWidth={1.25} />
                      </div>
                      <motion.div
                        className="mt-6 h-px w-full bg-rule"
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                        transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
                        style={{ originX: 0 }}
                      />
                    </div>

                    {active.sections.map((s, i) => (
                      <div key={s.title} className="mb-8 last:mb-2">
                        <div className="mb-1 flex items-center gap-3">
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{s.title}</span>
                          <span className="h-px flex-1 bg-rule" />
                          <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">{String(s.fields.length).padStart(2, "0")}</span>
                        </div>
                        <div>
                          {s.fields.map((f, j) => (
                            <FieldRow key={f.label} field={f} delay={0.1 + i * 0.08 + j * 0.035} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </section>

              {/* ── Readout column ──────────────────────────────────────── */}
              <AnimatePresence mode="wait">
                <motion.aside
                  key={active.id}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.3, delay: 0.08, ease: "easeOut" }}
                  className="hidden w-52 shrink-0 flex-col border-l border-rule bg-meta px-5 py-6 @min-[760px]:flex"
                >
                  <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/70">At a glance</div>
                  <dl className="mt-4">
                    {active.readouts.map((r) => (
                      <div key={r.k} className="flex items-baseline justify-between gap-3 border-b border-rule/70 py-2 last:border-b-0">
                        <dt className="text-[11px] text-muted-foreground">{r.k}</dt>
                        <dd className="font-mono text-[11px] tabular-nums text-foreground">{r.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">{active.note}</p>
                  <button className="mt-auto flex items-center justify-between gap-2 border border-input px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-primary hover:text-primary">
                    {active.action}
                    <span aria-hidden>→</span>
                  </button>
                </motion.aside>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dock ──────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <motion.button
          whileHover={{ y: -5 }} whileTap={{ y: 0 }}
          onClick={reopen} title="Settings"
          className="flex items-center gap-2.5 rounded-full bg-foreground px-4 py-2.5 text-background shadow-float"
        >
          <Settings2 className="size-4" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">Settings</span>
        </motion.button>
        {!closed && <span className="size-1 rounded-full bg-foreground/50" />}
      </div>
    </div>
  );
}

function Light({ className, label, onClick }: { className: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex size-3 items-center justify-center rounded-full text-[9px] leading-none text-foreground/0 transition group-hover:text-foreground/60 ${className}`}>
      {label}
    </button>
  );
}

function NavBtn({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className="rounded-[3px] p-1 text-muted-foreground transition-colors hover:bg-hover disabled:opacity-30 disabled:hover:bg-transparent">{children}</button>;
}

function NavItem({ page, n, active, onClick }: { page: Page; n: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group relative flex w-full items-center gap-2.5 px-2 py-[7px] text-left">
      {active && <motion.span layoutId="nav-active" transition={SPRING} className="absolute inset-y-[3px] left-0 w-[2px] bg-primary" />}
      <span className={`font-mono text-[10px] tabular-nums transition-colors ${active ? "text-primary" : "text-muted-foreground/45 group-hover:text-muted-foreground"}`}>{n}</span>
      <span className={`truncate text-[13px] transition-colors ${active ? "font-medium text-foreground" : "text-sidebar-foreground/80 group-hover:text-sidebar-foreground"}`}>{page.label}</span>
    </button>
  );
}
