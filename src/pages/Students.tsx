import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useStudents } from "@/hooks/useUniversityData";
import { PageSkeleton, EmptyState } from "@/components/shared/PageSkeleton";
import { Search, Filter, Download, Plus, MoreHorizontal, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "active" | "on_leave" | "graduated";

const statusStyle: Record<Status, string> = {
  active: "bg-success-soft text-success",
  on_leave: "bg-warning-soft text-warning",
  graduated: "bg-muted text-muted-foreground",
};

const statusLabel: Record<Status, string> = {
  active: "Active",
  on_leave: "On Leave",
  graduated: "Graduated",
};

export default function StudentsPage() {
  const { data: students, isLoading } = useStudents();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");

  const filtered = useMemo(() => {
    return (students ?? []).filter((s) => {
      const matchesQ =
        !query ||
        s.full_name.toLowerCase().includes(query.toLowerCase()) ||
        s.student_code.toLowerCase().includes(query.toLowerCase()) ||
        (s.major ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesF = filter === "all" || s.status === filter;
      return matchesQ && matchesF;
    });
  }, [students, query, filter]);

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description={`${students?.length ?? 0} students across all programs`}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Download className="h-4 w-4" /> Export</Button>
            <Button size="sm" className="h-9 gap-1.5 bg-foreground text-background hover:bg-foreground/90"><Plus className="h-4 w-4" /> Add student</Button>
          </>
        }
      />

      <div className="card-elevated p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, ID, or major…"
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-border bg-background p-1">
          {(["all", "active", "on_leave", "graduated"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-2.5 py-1 text-xs rounded transition-colors",
                filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
              {f === "all" ? "All" : statusLabel[f]}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-1.5"><Filter className="h-4 w-4" /> More filters</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No students found" description="Try a different search or filter." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-left">
                  {["Student", "ID", "Major", "Year", "GPA", "Attendance", "Status", ""].map((h) => (
                    <th key={h} className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {filtered.map((s) => {
                  const att = Number(s.attendance_percent ?? 0);
                  const status = s.status as Status;
                  return (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-semibold text-white shadow-xs", s.avatar_color ?? "from-blue-400 to-indigo-500")}>
                            {s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{s.full_name}</p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1"><Mail className="h-3 w-3" /> {s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{s.student_code}</td>
                      <td className="px-5 py-3 text-foreground">{s.major}</td>
                      <td className="px-5 py-3 text-muted-foreground">Year {s.year}</td>
                      <td className="px-5 py-3 font-medium tabular-nums text-foreground">{Number(s.gpa).toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                            <div className={cn("h-full rounded-full",
                              att >= 90 ? "bg-success" : att >= 80 ? "bg-warning" : "bg-destructive")}
                              style={{ width: `${att}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground">{att.toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium", statusStyle[status])}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {statusLabel[status]}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-md hover:bg-muted inline-flex items-center justify-center">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border/70 px-5 py-3 text-xs text-muted-foreground">
            <span>Showing <span className="font-medium text-foreground">{filtered.length}</span> of {students?.length ?? 0} students</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">Previous</Button>
              <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs">Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
