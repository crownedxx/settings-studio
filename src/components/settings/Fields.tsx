import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Field } from "./data";

export function FieldRow({ field }: { field: Field }) {
  return (
    <div className="flex items-center justify-between gap-6 px-4 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-foreground">{field.label}</div>
        {"hint" in field && field.hint && <div className="mt-0.5 text-xs text-muted-foreground">{field.hint}</div>}
      </div>
      <div className="shrink-0"><Control field={field} /></div>
    </div>
  );
}

function Control({ field }: { field: Field }) {
  switch (field.type) {
    case "toggle": return <Toggle initial={field.value} />;
    case "slider": return <Slider initial={field.value} />;
    case "segment": return <Segment options={field.options} initial={field.value} />;
    case "info": return <span className="text-[13px] text-muted-foreground">{field.value}</span>;
    case "text":
      return <input defaultValue={field.value} className="w-56 rounded-md border border-input bg-card px-2.5 py-1.5 text-[13px] outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20" />;
    case "select":
      return (
        <div className="relative">
          <select defaultValue={field.value} className="appearance-none rounded-md border border-input bg-card py-1.5 pl-2.5 pr-8 text-[13px] outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">
            {field.options.map((o) => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      );
  }
}

function Toggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <button role="switch" aria-checked={on} onClick={() => setOn(!on)}
      className={`flex h-[22px] w-[38px] items-center rounded-full p-[2px] transition-colors duration-300 ${on ? "justify-end bg-primary" : "justify-start bg-input"}`}>
      <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 35 }} className="size-[18px] rounded-full bg-card shadow-sm" />
    </button>
  );
}

function Slider({ initial }: { initial: number }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex items-center gap-3">
      <input type="range" value={v} onChange={(e) => setV(+e.target.value)} className="w-44 accent-primary" />
      <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{v}%</span>
    </div>
  );
}

function Segment({ options, initial }: { options: string[]; initial: string }) {
  const [v, setV] = useState(initial);
  return (
    <div className="flex rounded-lg bg-muted p-0.5">
      {options.map((o) => (
        <button key={o} onClick={() => setV(o)} className="relative px-3 py-1 text-xs font-medium">
          {v === o && <motion.span layoutId={`seg-${options.join()}`} className="absolute inset-0 rounded-md bg-card shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
          <span className={`relative ${v === o ? "text-foreground" : "text-muted-foreground"}`}>{o}</span>
        </button>
      ))}
    </div>
  );
}
