import { createFileRoute } from "@tanstack/react-router";
import { SettingsWindow } from "@/components/settings/SettingsWindow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Settings — Desktop Preview" },
      { name: "description", content: "A minimal, organised settings app in a draggable macOS-style window." },
      { property: "og:title", content: "Settings — Desktop Preview" },
      { property: "og:description", content: "A minimal, organised settings app in a draggable macOS-style window." },
    ],
  }),
  component: () => (
    <main className="h-screen w-screen overflow-hidden">
      <SettingsWindow />
    </main>
  ),
});
