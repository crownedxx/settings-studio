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

export type Section = { title: string; fields: Field[] };
export type Readout = { k: string; v: string };
export type Page = {
  id: string;
  label: string;
  icon: LucideIcon;
  subtitle: string;
  readouts: Readout[];
  note: string;
  action: string;
  sections: Section[];
};
export type Group = { label: string; pages: Page[] };

export const groups: Group[] = [
  {
    label: "Personal",
    pages: [
      {
        id: "account", label: "Account", icon: User,
        subtitle: "Your profile, sign-in details and recovery options.",
        readouts: [
          { k: "Plan", v: "Pro" },
          { k: "Member", v: "Mar 2021" },
          { k: "Devices", v: "3 active" },
          { k: "Recovery", v: "Verified" },
        ],
        note: "Changes to your email are held for 24 hours before they take effect.",
        action: "Manage sign-in",
        sections: [
          { title: "Profile", fields: [
            { type: "text", label: "Display name", value: "Alex Morgan" },
            { type: "text", label: "Email", value: "alex@example.com" },
            { type: "select", label: "Language", value: "English (AU)", options: ["English (AU)", "English (US)", "Français", "日本語"] },
          ]},
          { title: "Sign-in", fields: [
            { type: "toggle", label: "Two-factor authentication", hint: "Require a code when signing in", value: true },
            { type: "toggle", label: "Remember this device", value: false },
          ]},
        ],
      },
      {
        id: "notifications", label: "Notifications", icon: Bell,
        subtitle: "Choose what reaches you, through which channel, and when.",
        readouts: [
          { k: "Channels on", v: "4 of 6" },
          { k: "Muted", v: "2 senders" },
          { k: "Next digest", v: "07:00" },
          { k: "This week", v: "138 sent" },
        ],
        note: "Quiet hours override everything except alerts marked urgent.",
        action: "Open digest log",
        sections: [
          { title: "Delivery", fields: [
            { type: "toggle", label: "Push notifications", value: true },
            { type: "toggle", label: "Email digest", hint: "A summary every morning", value: true },
            { type: "segment", label: "Preview style", value: "When unlocked", options: ["Always", "When unlocked", "Never"] },
          ]},
          { title: "Focus", fields: [
            { type: "toggle", label: "Do not disturb", value: false },
            { type: "select", label: "Quiet hours", value: "10pm – 7am", options: ["Off", "9pm – 6am", "10pm – 7am", "11pm – 8am"] },
          ]},
        ],
      },
      {
        id: "privacy", label: "Privacy & Security", icon: Shield,
        subtitle: "Permissions, data sharing and the devices that can reach your account.",
        readouts: [
          { k: "Last audit", v: "Today" },
          { k: "Sessions", v: "2 open" },
          { k: "Permissions", v: "5 granted" },
          { k: "Exposure", v: "Low" },
        ],
        note: "Revoking a permission signs that device out within five minutes.",
        action: "Review devices",
        sections: [
          { title: "Permissions", fields: [
            { type: "toggle", label: "Location services", value: true },
            { type: "toggle", label: "Camera access", value: false },
            { type: "toggle", label: "Microphone access", value: false },
          ]},
          { title: "Analytics", fields: [
            { type: "toggle", label: "Share usage data", hint: "Helps improve the product", value: false },
          ]},
        ],
      },
    ],
  },
  {
    label: "Device",
    pages: [
      {
        id: "appearance", label: "Appearance", icon: Palette,
        subtitle: "Theme, accent colour and how much the interface is allowed to move.",
        readouts: [
          { k: "Mode", v: "Light" },
          { k: "Accent", v: "Terracotta" },
          { k: "Motion", v: "Full" },
          { k: "Scale", v: "60%" },
        ],
        note: "Auto switches between light and dark with your local sunset times.",
        action: "Preview themes",
        sections: [
          { title: "Theme", fields: [
            { type: "segment", label: "Mode", value: "Light", options: ["Light", "Dark", "Auto"] },
            { type: "select", label: "Accent colour", value: "Terracotta", options: ["Terracotta", "Ocean", "Forest", "Graphite"] },
          ]},
          { title: "Motion", fields: [
            { type: "toggle", label: "Reduce motion", value: false },
            { type: "slider", label: "Interface scale", value: 60 },
          ]},
        ],
      },
      {
        id: "display", label: "Displays", icon: Monitor,
        subtitle: "Brightness, resolution and colour profile for each connected screen.",
        readouts: [
          { k: "Panel", v: "Built-in" },
          { k: "Resolution", v: "3024×1964" },
          { k: "Refresh", v: "120 Hz" },
          { k: "Colour", v: "P3" },
        ],
        note: "Night Shift warms the panel gradually over the hour after sunset.",
        action: "Detect displays",
        sections: [
          { title: "Built-in display", fields: [
            { type: "slider", label: "Brightness", value: 72 },
            { type: "toggle", label: "True Tone", value: true },
            { type: "toggle", label: "Night Shift", hint: "Warmer colours after sunset", value: false },
            { type: "select", label: "Resolution", value: "Default", options: ["Larger text", "Default", "More space"] },
          ]},
        ],
      },
      {
        id: "network", label: "Network", icon: Wifi,
        subtitle: "Wireless, tunnelling and the addresses your device is answering to.",
        readouts: [
          { k: "Signal", v: "Excellent" },
          { k: "Latency", v: "8 ms" },
          { k: "Gateway", v: "192.168.1.1" },
          { k: "Roaming", v: "Off" },
        ],
        note: "The secure tunnel routes all traffic except local file shares.",
        action: "Renew lease",
        sections: [
          { title: "Wi-Fi", fields: [
            { type: "toggle", label: "Wi-Fi", value: true },
            { type: "info", label: "Connected to", value: "Studio 5G" },
            { type: "info", label: "IP address", value: "192.168.1.24" },
          ]},
          { title: "VPN", fields: [{ type: "toggle", label: "Secure tunnel", value: false }] },
        ],
      },
      {
        id: "keyboard", label: "Keyboard", icon: Keyboard,
        subtitle: "Typing behaviour, key repeat and the shortcuts currently bound.",
        readouts: [
          { k: "Layout", v: "ANSI" },
          { k: "Repeat", v: "Fast" },
          { k: "Delay", v: "Short" },
          { k: "Hotkeys", v: "12 bound" },
        ],
        note: "Holding Option while typing shows the character name in the caret hint.",
        action: "Edit shortcuts",
        sections: [
          { title: "Typing", fields: [
            { type: "slider", label: "Key repeat rate", value: 80 },
            { type: "toggle", label: "Auto-correct", value: true },
            { type: "toggle", label: "Smart punctuation", value: true },
          ]},
        ],
      },
      {
        id: "storage", label: "Storage", icon: HardDrive,
        subtitle: "Where your space has gone and what can safely be cleared.",
        readouts: [
          { k: "Free", v: "200 GB" },
          { k: "Largest", v: "Photos" },
          { k: "Caches", v: "18 GB" },
          { k: "Backups", v: "On" },
        ],
        note: "Optimising keeps recent files on device and archives the rest.",
        action: "Review files",
        sections: [
          { title: "Usage", fields: [
            { type: "info", label: "Used", value: "312 GB of 512 GB" },
            { type: "toggle", label: "Optimise storage", hint: "Offload unused files automatically", value: true },
          ]},
        ],
      },
    ],
  },
  {
    label: "Workspace",
    pages: [
      {
        id: "team", label: "Team", icon: Users,
        subtitle: "Seats, roles and who is allowed to bring new people in.",
        readouts: [
          { k: "Seats", v: "8 of 10" },
          { k: "Roles", v: "3 in use" },
          { k: "Invites", v: "2 pending" },
          { k: "Last join", v: "4 days" },
        ],
        note: "Admins can grant temporary elevated access for up to seven days.",
        action: "Invite people",
        sections: [
          { title: "Members", fields: [
            { type: "info", label: "Seats used", value: "8 of 10" },
            { type: "select", label: "Default role", value: "Editor", options: ["Viewer", "Editor", "Admin"] },
            { type: "toggle", label: "Allow invites from members", value: true },
          ]},
        ],
      },
      {
        id: "billing", label: "Billing", icon: CreditCard,
        subtitle: "Your plan, the card it charges and where invoices arrive.",
        readouts: [
          { k: "Next", v: "$29.00" },
          { k: "On", v: "12 Mar" },
          { k: "Method", v: "Visa ·4421" },
          { k: "Invoices", v: "24 filed" },
        ],
        note: "Switching to yearly credits the unused part of this month.",
        action: "Open invoices",
        sections: [
          { title: "Plan", fields: [
            { type: "info", label: "Current plan", value: "Pro · Monthly" },
            { type: "segment", label: "Billing cycle", value: "Monthly", options: ["Monthly", "Yearly"] },
            { type: "toggle", label: "Email invoices", value: true },
          ]},
        ],
      },
      {
        id: "region", label: "Language & Region", icon: Globe,
        subtitle: "Date, time and number formats across every screen.",
        readouts: [
          { k: "Timezone", v: "UTC+10" },
          { k: "Currency", v: "AUD" },
          { k: "Week", v: "Mon–Sun" },
          { k: "Numbers", v: "1.234,56" },
        ],
        note: "Region sets the default calendar, but you can override the week start.",
        action: "Set location",
        sections: [
          { title: "Formats", fields: [
            { type: "select", label: "Region", value: "Australia", options: ["Australia", "United States", "United Kingdom", "Japan"] },
            { type: "segment", label: "Time format", value: "24h", options: ["12h", "24h"] },
            { type: "select", label: "First day of week", value: "Monday", options: ["Sunday", "Monday"] },
          ]},
        ],
      },
      {
        id: "about", label: "About", icon: Info,
        subtitle: "What is installed, which channel it came from and what it costs you.",
        readouts: [
          { k: "Version", v: "4.2.0" },
          { k: "Build", v: "2610" },
          { k: "Channel", v: "Stable" },
          { k: "License", v: "Personal" },
        ],
        note: "Update checks run once a day and never send your file names.",
        action: "Check for updates",
        sections: [
          { title: "Software", fields: [
            { type: "info", label: "Version", value: "4.2.0 (Build 2610)" },
            { type: "info", label: "Last checked", value: "Today, 1:20 pm" },
            { type: "toggle", label: "Automatic updates", value: true },
          ]},
        ],
      },
    ],
  },
];
