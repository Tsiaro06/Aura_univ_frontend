import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { Users, BookOpen, GraduationCap, CalendarCheck, ArrowUpRight, Activity } from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useOverviewStats, useDepartmentDistribution } from "@/hooks/useUniversityData";
import { enrollmentTrend, recentActivity } from "@/lib/mock-data";

const activityIcon: Record<string, string> = {
  grade: "bg-primary-soft text-primary",
  enroll: "bg-success-soft text-success",
  system: "bg-muted text-muted-foreground",
  attendance: "bg-warning-soft text-warning",
  request: "bg-accent text-accent-foreground",
};

export default function Overview() {
  const { data: stats, isLoading } = useOverviewStats();
  const { data: dept } = useDepartmentDistribution();

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-7">
      <PageHeader
        title="Welcome back 👋"
        description="Here's what's happening across your university today."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9">Export</Button>
            <Button size="sm" className="h-9 bg-foreground text-background hover:bg-foreground/90">
              View report <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active students" value={String(stats?.activeStudents ?? 0)} delta={4.2} icon={Users} accent="primary" />
        <StatCard label="Courses offered" value={String(stats?.totalCourses ?? 0)} delta={1.8} icon={BookOpen} accent="success" />
        <StatCard label="Average GPA" value={(stats?.avgGpa ?? 0).toFixed(2)} delta={0.6} icon={GraduationCap} accent="warning" />
        <StatCard label="Attendance rate" value={`${(stats?.attendanceRate ?? 0).toFixed(1)}%`} delta={-0.4} icon={CalendarCheck} accent="muted" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">Enrollment trend</h3>
              <p className="text-xs text-muted-foreground">Last 9 months</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-success-soft px-2 py-1 text-[11px] font-medium text-success">↗ +32.5%</span>
          </div>
          <div className="h-64 mt-4 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enrollmentTrend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12, boxShadow: "var(--shadow-md)" }} />
                <Area type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#enrollFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-5">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">By department</h3>
            <p className="text-xs text-muted-foreground">Student distribution</p>
          </div>
          <div className="h-64 mt-4 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept ?? []} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12, boxShadow: "var(--shadow-md)" }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-elevated p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-foreground">Recent activity</h3>
              <p className="text-xs text-muted-foreground">Across the platform</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">View all</Button>
          </div>
          <ul className="divide-y divide-border/70">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${activityIcon[a.type]}`}>
                  <Activity className="h-3.5 w-3.5" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{a.who}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-5 bg-gradient-soft relative overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <h3 className="text-[15px] font-semibold text-foreground relative">Quick actions</h3>
          <p className="text-xs text-muted-foreground relative">Jump back in</p>
          <div className="mt-4 space-y-2 relative">
            {[
              { label: "Add new student", desc: "Create profile" },
              { label: "Open enrollment", desc: "Spring 2026" },
              { label: "Submit grades", desc: "CS 201 — Final" },
              { label: "Generate transcript", desc: "PDF export" },
            ].map((q) => (
              <button key={q.label} className="w-full text-left flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-3 hover:border-primary/30 hover:shadow-soft transition-all group">
                <div>
                  <p className="text-sm font-medium text-foreground">{q.label}</p>
                  <p className="text-[11px] text-muted-foreground">{q.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
