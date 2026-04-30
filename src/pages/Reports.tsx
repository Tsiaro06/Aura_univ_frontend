import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart, FileText, PieChart as PieIcon, TrendingUp } from "lucide-react";
import { useDepartmentDistribution } from "@/hooks/useUniversityData";
import { enrollmentTrend } from "@/lib/mock-data";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";

const colors = [
  "hsl(230 65% 56%)", "hsl(260 70% 65%)", "hsl(190 70% 55%)",
  "hsl(152 55% 50%)", "hsl(35 92% 60%)", "hsl(330 70% 65%)",
];

const reports = [
  { icon: FileBarChart, title: "Academic performance", desc: "Average GPA by department, course, and term." },
  { icon: TrendingUp, title: "Enrollment trends", desc: "Year-over-year enrollment by program." },
  { icon: PieIcon, title: "Student demographics", desc: "Distribution by year, region, and major." },
  { icon: FileText, title: "Attendance summary", desc: "Per-course attendance and absence reports." },
];

export default function ReportsPage() {
  const { data: dept } = useDepartmentDistribution();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Generate insights and downloadable reports."
        actions={
          <Button size="sm" className="h-9 gap-1.5 bg-foreground text-background hover:bg-foreground/90">
            <Download className="h-4 w-4" /> Download all (PDF)
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-elevated p-5">
          <h3 className="text-[15px] font-semibold text-foreground">Enrollment growth</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 9 months</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentTrend} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={40} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12, boxShadow: "var(--shadow-md)" }} />
                <Line type="monotone" dataKey="students" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-5">
          <h3 className="text-[15px] font-semibold text-foreground">Department distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">Active student share</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dept ?? []} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}
                  stroke="hsl(var(--background))" strokeWidth={3}>
                  {(dept ?? []).map((_, i) => (<Cell key={i} fill={colors[i % colors.length]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12, boxShadow: "var(--shadow-md)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(dept ?? []).map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: colors[i % colors.length] }} />
                <span className="text-muted-foreground flex-1 truncate">{d.name}</span>
                <span className="tabular-nums font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Report templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {reports.map((r) => (
            <button key={r.title} className="card-elevated p-4 text-left hover:border-primary/30 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary mb-3 group-hover:scale-105 transition-transform">
                <r.icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
