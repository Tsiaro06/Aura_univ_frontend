import { Search, Bell, Plus, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

const titleMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/students": "Students",
  "/courses": "Courses",
  "/enrollment": "Enrollment",
  "/grades": "Grades",
  "/attendance": "Attendance",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Topbar() {
  const { pathname } = useLocation();
  const title = useMemo(() => titleMap[pathname] ?? "Dashboard", [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/70 bg-background/70 backdrop-blur-xl px-5 md:px-7">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
        <span className="text-muted-foreground">Workspace</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        <h1 className="font-medium text-foreground">{title}</h1>
      </nav>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:flex items-center w-72">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" strokeWidth={2} />
        <input
          type="search"
          placeholder="Search students, courses…"
          className="h-9 w-full rounded-md border border-border/80 bg-card pl-9 pr-14 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          aria-label="Search"
        />
        <kbd className="absolute right-2 hidden md:inline-flex items-center gap-0.5 rounded border border-border/80 bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <Button
        size="icon"
        variant="ghost"
        className="relative h-9 w-9 rounded-md"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" strokeWidth={2} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
      </Button>

      <Button size="sm" className="h-9 gap-1.5 bg-foreground text-background hover:bg-foreground/90 shadow-soft">
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        <span className="hidden sm:inline">New</span>
      </Button>
    </header>
  );
}
