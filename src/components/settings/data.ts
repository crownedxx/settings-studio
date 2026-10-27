import {
  User, Bell, Shield, Palette, Monitor, Wifi, Keyboard, CreditCard, Users, Globe, HardDrive, Info,
  type LucideIcon,
} from "lucide-react";

export type Field =
  | { type: "toggle"; label: string; hint?: string; value: boolean }
  | { type: "select"; label: string; hint?: string; value: string; options: string[] }
  | { type: "slider"; label: string; hint?: string; value: number }
  | { type: "text"; label: string; hint?: string; value: string }
  | { type: "segment"; label: string; hint?: string; value: string; options: string[] }
  | { type: "info"; label: string; value: string };

export type Section = { title: string; description?: string; fields: Field[] };
export type Page = { id: string; label: string; icon: LucideIcon; tint: string; subtitle: string; sections: Section[] };
export type Group = { label: string; pages: Page[] };

export const groups: Group[] = [
  {
    label: "Personal",
    pages: [
      { id: "account", label: "Account", icon: User, tint: "oklch(0.62 0.15 45)", subtitle: "Your profile and sign-in details", sections: [
        { title: "Profile", fields: [
          { type: "text", label: "Display name", value: "Alex Morgan" },
          { type: "text", label: "Email", value: "alex@example.com" },
          { type: "select", label: "Language", value: "English (AU)", options: ["English (AU)", "English (US)", "Français", "日本語"] },
        ]},
        { title: "Sign-in", fields: [
          { type: "toggle", label: "Two-factor authentication", hint: "Require a code when signing in", value: true },
          { type: "toggle", label: "Remember this device", value: false },
        ]},
      ]},
      { id: "notifications", label: "Notifications", icon: Bell, tint: "oklch(0.65 0.2 25)", subtitle: "Choose what reaches you, and when", sections: [
        { title: "Delivery", fields: [
          { type: "toggle", label: "Push notifications", value: true },
          { type: "toggle", label: "Email digest", hint: "A summary every morning", value: true },
          { type: "segment", label: "Preview style", value: "When unlocked", options: ["Always", "When unlocked", "Never"] },
        ]},
        { title: "Focus", fields: [
          { type: "toggle", label: "Do not disturb", value: false },
          { type: "select", label: "Quiet hours", value: "10pm – 7am", options: ["Off", "9pm – 6am", "10pm – 7am", "11pm – 8am"] },
        ]},
      ]},
      { id: "privacy", label: "Privacy & Security", icon: Shield, tint: "oklch(0.55 0.13 250)", subtitle: "Control data, permissions and access", sections: [
        { title: "Permissions", fields: [
          { type: "toggle", label: "Location services", value: true },
          { type: "toggle", label: "Camera access", value: false },
          { type: "toggle", label: "Microphone access", value: false },
        ]},
        { title: "Analytics", fields: [
          { type: "toggle", label: "Share usage data", hint: "Helps improve the product", value: false },
        ]},
      ]},
    ],
  },
  {
    label: "Device",
    pages: [
      { id: "appearance", label: "Appearance", icon: Palette, tint: "oklch(0.6 0.16 320)", subtitle: "Theme, accent and motion", sections: [
        { title: "Theme", fields: [
          { type: "segment", label: "Mode", value: "Light", options: ["Light", "Dark", "Auto"] },
          { type: "select", label: "Accent colour", value: "Terracotta", options: ["Terracotta", "Ocean", "Forest", "Graphite"] },
        ]},
        { title: "Motion", fields: [
          { type: "toggle", label: "Reduce motion", value: false },
          { type: "slider", label: "Interface scale", value: 60 },
        ]},
      ]},
      { id: "display", label: "Displays", icon: Monitor, tint: "oklch(0.6 0.13 220)", subtitle: "Brightness, resolution and colour", sections: [
        { title: "Built-in display", fields: [
          { type: "slider", label: "Brightness", value: 72 },
          { type: "toggle", label: "True Tone", value: true },
          { type: "toggle", label: "Night Shift", hint: "Warmer colours after sunset", value: false },
          { type: "select", label: "Resolution", value: "Default", options: ["Larger text", "Default", "More space"] },
        ]},
      ]},
      { id: "network", label: "Network", icon: Wifi, tint: "oklch(0.6 0.15 240)", subtitle: "Wi-Fi, VPN and connections", sections: [
        { title: "Wi-Fi", fields: [
          { type: "toggle", label: "Wi-Fi", value: true },
          { type: "info", label: "Connected to", value: "Studio 5G" },
          { type: "info", label: "IP address", value: "192.168.1.24" },
        ]},
        { title: "VPN", fields: [{ type: "toggle", label: "Secure tunnel", value: false }] },
      ]},
      { id: "keyboard", label: "Keyboard", icon: Keyboard, tint: "oklch(0.5 0.02 60)", subtitle: "Typing and shortcuts", sections: [
        { title: "Typing", fields: [
          { type: "slider", label: "Key repeat rate", value: 80 },
          { type: "toggle", label: "Auto-correct", value: true },
          { type: "toggle", label: "Smart punctuation", value: true },
        ]},
      ]},
      { id: "storage", label: "Storage", icon: HardDrive, tint: "oklch(0.55 0.05 60)", subtitle: "Space used across your device", sections: [
        { title: "Usage", fields: [
          { type: "info", label: "Used", value: "312 GB of 512 GB" },
          { type: "toggle", label: "Optimise storage", hint: "Offload unused files automatically", value: true },
        ]},
      ]},
    ],
  },
  {
    label: "Workspace",
    pages: [
      { id: "team", label: "Team", icon: Users, tint: "oklch(0.62 0.14 160)", subtitle: "Members and roles", sections: [
        { title: "Members", fields: [
          { type: "info", label: "Seats used", value: "8 of 10" },
          { type: "select", label: "Default role", value: "Editor", options: ["Viewer", "Editor", "Admin"] },
          { type: "toggle", label: "Allow invites from members", value: true },
        ]},
      ]},
      { id: "billing", label: "Billing", icon: CreditCard, tint: "oklch(0.65 0.14 140)", subtitle: "Plan, invoices and payment", sections: [
        { title: "Plan", fields: [
          { type: "info", label: "Current plan", value: "Pro · Monthly" },
          { type: "segment", label: "Billing cycle", value: "Monthly", options: ["Monthly", "Yearly"] },
          { type: "toggle", label: "Email invoices", value: true },
        ]},
      ]},
      { id: "region", label: "Language & Region", icon: Globe, tint: "oklch(0.6 0.12 200)", subtitle: "Formats and time", sections: [
        { title: "Formats", fields: [
          { type: "select", label: "Region", value: "Australia", options: ["Australia", "United States", "United Kingdom", "Japan"] },
          { type: "segment", label: "Time format", value: "24h", options: ["12h", "24h"] },
          { type: "select", label: "First day of week", value: "Monday", options: ["Sunday", "Monday"] },
        ]},
      ]},
      { id: "about", label: "About", icon: Info, tint: "oklch(0.5 0.02 60)", subtitle: "Version and legal", sections: [
        { title: "Software", fields: [
          { type: "info", label: "Version", value: "4.2.0 (Build 2610)" },
          { type: "info", label: "Last checked", value: "Today, 1:20 pm" },
          { type: "toggle", label: "Automatic updates", value: true },
        ]},
      ]},
    ],
  },
];
