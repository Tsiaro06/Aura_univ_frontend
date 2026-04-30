import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  CalendarCheck,
  BarChart3,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Students", icon: Users },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/enrollment", label: "Enrollment", icon: ClipboardList },
  { to: "/grades", label: "Grades", icon: GraduationCap },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { user, roles, signOut } = useAuth();
  const displayName = (user?.user_metadata?.full_name as string | undefined) ?? user?.email ?? "Account";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel = roles[0] ? roles[0].charAt(0).toUpperCase() + roles[0].slice(1) : "Member";

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/70 bg-sidebar/60 backdrop-blur-xl">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-border/70">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          <Sparkles className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Lumen</span>
          <span className="text-[11px] text-muted-foreground">University Suite</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
          Workspace
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/70"
            activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground font-medium shadow-xs"
          >
            <item.icon className="h-4 w-4 opacity-80 group-hover:opacity-100" strokeWidth={2} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-border/70 space-y-0.5">
        <NavLink
          to="/settings"
          className="group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/70"
          activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground font-medium"
        >
          <Settings className="h-4 w-4 opacity-80" strokeWidth={2} />
          <span>Settings</span>
        </NavLink>

        <div className="mt-2 mx-1 rounded-lg border border-border/70 bg-card p-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-[11px] font-semibold text-primary-foreground">
              {initials || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{displayName}</p>
              <p className="truncate text-[11px] text-muted-foreground">{roleLabel}</p>
            </div>
            <button
              onClick={signOut}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
