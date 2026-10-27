import { createFileRoute } from "@tanstack/react-router";
import { SettingsWindow } from "@/components/settings/SettingsWindow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Settings — Ledger Console" },
      { name: "description", content: "A minimal, organised settings console with an index rail, a detailed ledger and a live readout column, inside a draggable desktop window." },
      { property: "og:title", content: "Settings — Ledger Console" },
      { property: "og:description", content: "A minimal, organised settings console: index rail, detailed ledger, live readout column — inside a draggable desktop window." },
    ],
  }),
  component: () => (
    <main className="h-screen w-screen overflow-hidden">
      <SettingsWindow />
    </main>
  ),
});
