import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { groups, type Page } from "./data";
import { FieldRow } from "./Fields";

const allPages = groups.flatMap((g) => g.pages);

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
            animate={full ? { opacity: 1, scale: 1, x: 0, y: 0, width: "100vw", height: "100vh" } : { opacity: 1, scale: 1, width: "min(1080px, 94vw)", height: "min(700px, 88vh)" }}
            exit={minimised ? { opacity: 0, scale: 0.2, y: 400 } : { opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={`glass flex flex-col overflow-hidden bg-window shadow-window ${full ? "fixed inset-0 z-50 rounded-none" : "rounded-2xl"}`}
          >
            {/* Title bar */}
            <div onPointerDown={(e) => !full && drag.start(e)} onDoubleClick={() => setFull(!full)}
              className={`flex h-12 shrink-0 select-none items-center border-b border-sidebar-border bg-titlebar px-4 ${full ? "" : "cursor-grab active:cursor-grabbing"}`}>
              <div className="group flex gap-2" onPointerDown={(e) => e.stopPropagation()}>
                <Light className="bg-traffic-close" label="×" onClick={() => setClosed(true)} />
                <Light className="bg-traffic-min" label="−" onClick={() => { setFull(false); setMinimised(true); }} />
                <Light className="bg-traffic-max" label="⤢" onClick={() => setFull(!full)} />
              </div>
              <div className="ml-6 flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
                <NavBtn disabled={hIdx === 0} onClick={() => step(-1)}><ChevronLeft className="size-4" /></NavBtn>
                <NavBtn disabled={hIdx === history.length - 1} onClick={() => step(1)}><ChevronRight className="size-4" /></NavBtn>
              </div>
              <AnimatePresence mode="wait">
                <motion.span key={active.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="ml-3 text-[13px] font-semibold">
                  {active.label}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex min-h-0 flex-1">
              {/* Sidebar */}
              <aside className="flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
                <div className="p-3">
                  <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-2.5 py-1.5">
                    <Search className="size-3.5 text-muted-foreground" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground" />
                  </div>
                </div>
                <button onClick={() => go("account")} className="mx-3 mb-3 flex items-center gap-3 rounded-xl p-2 text-left transition hover:bg-sidebar-accent">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">AM</div>
                  <div><div className="text-[13px] font-semibold">Alex Morgan</div><div className="text-xs text-muted-foreground">Account & sign-in</div></div>
                </button>
                <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
                  {filtered.map((g) => (
                    <div key={g.label}>
                      <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{g.label}</div>
                      {g.pages.map((p) => <NavItem key={p.id} page={p} active={p.id === activeId} onClick={() => go(p.id)} />)}
                    </div>
                  ))}
                  {!filtered.length && <div className="px-2 text-xs text-muted-foreground">No results</div>}
                </nav>
              </aside>

              {/* Content */}
              <section className="min-w-0 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div key={active.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22, ease: "easeOut" }}
                    className="mx-auto max-w-2xl px-10 py-8">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-xl text-primary-foreground" style={{ background: active.tint }}>
                        <active.icon className="size-6" />
                      </div>
                      <div>
                        <h1 className="text-xl font-semibold tracking-tight">{active.label}</h1>
                        <p className="text-[13px] text-muted-foreground">{active.subtitle}</p>
                      </div>
                    </div>
                    {active.sections.map((s, i) => (
                      <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }} className="mb-7">
                        <h2 className="mb-2 px-1 text-xs font-semibold text-muted-foreground">{s.title}</h2>
                        <div className="divide-y divide-border rounded-xl border border-border bg-card">
                          {s.fields.map((f) => <FieldRow key={f.label} field={f} />)}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <div className="glass absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-end gap-2 rounded-2xl border border-border bg-window p-2 shadow-window">
        <motion.button whileHover={{ y: -6, scale: 1.1 }} onClick={reopen} title="Settings"
          className="relative flex size-12 items-center justify-center rounded-xl bg-foreground text-background">
          <Settings2 className="size-6" />
          {!closed && <span className="absolute -bottom-1.5 size-1 rounded-full bg-foreground" />}
        </motion.button>
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
  return <button {...p} className="rounded-md p-1 text-muted-foreground transition hover:bg-sidebar-accent disabled:opacity-30 disabled:hover:bg-transparent">{children}</button>;
}

function NavItem({ page, active, onClick }: { page: Page; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="relative flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-[13px]">
      {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-sidebar-accent" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
      <span className="relative flex size-6 items-center justify-center rounded-md text-primary-foreground" style={{ background: page.tint }}>
        <page.icon className="size-3.5" />
      </span>
      <span className={`relative ${active ? "font-medium text-foreground" : "text-sidebar-foreground"}`}>{page.label}</span>
    </button>
  );
}
