"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Bot,
  Calendar,
  ClipboardCheck,
  Settings,
  ChevronDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { workspaces } from "@/lib/data/mock";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const productNav = [
  { label: "Red Team", href: "/overview", active: true },
  { label: "Gateway", href: "#", active: false },
  { label: "Agent Workstation", href: "#", active: false },
  { label: "Asset Inventory", href: "#", active: false },
];

const sidebarNav = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Assessment", href: "/tests", icon: FlaskConical },
  { label: "Assets", href: "/assets", icon: Bot },
  { label: "Schedule", href: "/schedule", icon: Calendar },
  { label: "Evaluation", href: "/evaluation", icon: ClipboardCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[260px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex flex-col gap-4 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-accent">
            <Image
              src="/logo.png"
              alt="Hikmaai"
              width={32}
              height={32}
              unoptimized
              priority
              className="size-8 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                hikmaai
              </p>
              <p className="truncate text-xs text-muted-foreground">
                Acme Corp
              </p>
            </div>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {workspaces.map((ws) => (
              <DropdownMenuItem key={ws.id}>{ws.name}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="search-field pl-9 pr-10"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
            /
          </kbd>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {sidebarNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-item", isActive && "nav-item-active")}
            >
              <item.icon className="size-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link href="#" className="nav-item">
          <Settings className="size-4 shrink-0" strokeWidth={1.75} />
          Settings
        </Link>
        <div className="relative z-10 mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <img
            src="/avatar-paolo.png?v=2"
            alt="Paolo Rossi"
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-foreground">
              Paolo Rossi
            </p>
            <p className="truncate text-xs text-muted-foreground">
              paolo@hikmaai.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="flex h-11 shrink-0 items-center border-b border-border bg-background px-6">
      <nav className="flex items-center gap-1">
        {productNav.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[13px] transition-colors",
              item.active
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
