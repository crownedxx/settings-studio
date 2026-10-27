import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Field } from "./data";

export function FieldRow({ field, delay = 0 }: { field: Field; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.28, ease: "easeOut" }}
      className="-mx-3 flex items-center justify-between gap-6 border-b border-rule/70 px-3 py-3 transition-colors last:border-b-0 hover:bg-hover"
    >
      <div className="min-w-0">
        <div className="text-[13px] leading-snug text-foreground">{field.label}</div>
        {"hint" in field && field.hint && <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{field.hint}</div>}
      </div>
      <div className="shrink-0"><Control field={field} /></div>
    </motion.div>
  );
}

function Control({ field }: { field: Field }) {
  switch (field.type) {
    case "toggle": return <Toggle initial={field.value} />;
    case "slider": return <Slider initial={field.value} />;
    case "segment": return <Segment options={field.options} initial={field.value} />;
    case "info": return <span className="font-mono text-[12px] text-foreground/85">{field.value}</span>;
    case "text":
      return (
        <input
          defaultValue={field.value}
          className="w-56 border-b border-input bg-transparent pb-1 text-[13px] text-foreground outline-none transition-colors focus:border-primary"
        />
      );
    case "select":
      return (
        <div className="relative">
          <select
            defaultValue={field.value}
            className="appearance-none rounded-[4px] border border-input bg-transparent py-1.5 pl-2.5 pr-7 text-[13px] text-foreground outline-none transition-colors hover:border-muted-foreground/50 focus:border-primary"
          >
            {field.options.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
        </div>
      );
  }
}

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center gap-2.5">
      <span className={`w-6 text-right font-mono text-[10px] uppercase tracking-wider ${on ? "text-primary" : "text-muted-foreground/60"}`}>
        {on ? "on" : "off"}
      </span>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => setOn(!on)}
        className={`flex h-[20px] w-[38px] items-center rounded-[3px] border p-[2px] transition-colors duration-300 ${
          on ? "justify-end border-primary bg-primary" : "justify-start border-input bg-transparent"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 600, damping: 34 }}
          className={`size-[14px] rounded-[2px] ${on ? "bg-primary-foreground" : "bg-muted-foreground/70"}`}
        />
      </button>
    </div>
  );
}

function Slider({ initial }: { initial: number }) {
  const [v, setV] = useState(initial);
  return (
    <div className="w-52">
      <div className="flex items-center gap-3">
        <input
          type="range"
          value={v}
          onChange={(e) => setV(+e.target.value)}
          aria-label="value"
          className="range w-full"
        />
        <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-foreground/80">{v}</span>
      </div>
      <div className="mt-1 flex justify-between pl-[1px] pr-10">
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i} className={`h-[3px] w-px ${i * 10 <= v ? "bg-primary/45" : "bg-rule"}`} />
        ))}
      </div>
    </div>
  );
}

function Segment({ options, initial }: { options: string[]; initial: string }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex items-center">
      {options.map((o, i) => (
        <div key={o} className="flex items-center">
          {i > 0 && <span className="px-1 font-mono text-[11px] text-rule">/</span>}
          <button onClick={() => setV(o)} className="relative px-1 py-1">
            {v === o && (
              <motion.span
                layoutId={`seg-${options.join()}`}
                transition={{ type: "spring", stiffness: 480, damping: 36 }}
                className="absolute inset-x-1 -bottom-px h-[2px] bg-primary"
              />
            )}
            <span className={`font-mono text-[11px] lowercase tracking-tight transition-colors ${v === o ? "text-foreground" : "text-muted-foreground/60 hover:text-muted-foreground"}`}>
              {o}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
