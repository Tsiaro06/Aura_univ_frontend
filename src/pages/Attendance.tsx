import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses, useAttendanceByCourse, useUpdateAttendance } from "@/hooks/useUniversityData";
import { PageSkeleton, EmptyState } from "@/components/shared/PageSkeleton";
import { ChevronLeft, ChevronRight, Check, X, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "present" | "absent" | "late" | "excused";

const stateStyle: Record<State, string> = {
  present: "bg-success/15 text-success border-success/30 hover:bg-success/25",
  absent: "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20",
  late: "bg-warning/15 text-warning border-warning/30 hover:bg-warning/25",
  excused: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
};

const stateIcon: Record<State, JSX.Element> = {
  present: <Check className="h-3.5 w-3.5" strokeWidth={2.5} />,
  absent: <X className="h-3.5 w-3.5" strokeWidth={2.5} />,
  late: <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />,
  excused: <FileText className="h-3.5 w-3.5" strokeWidth={2.5} />,
};

const cycle: State[] = ["present", "late", "absent", "excused"];

export default function AttendancePage() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const [courseId, setCourseId] = useState<string | undefined>();
  useEffect(() => {
    if (!courseId && courses?.length) setCourseId(courses[0].id);
  }, [courses, courseId]);

  const { data: records, isLoading } = useAttendanceByCourse(courseId);
  const update = useUpdateAttendance();

  // Group by student → ordered list of sessions
  const grid = useMemo(() => {
    if (!records) return { sessions: [] as string[], rows: [] as { student: { id: string; name: string; code: string }; cells: Record<string, { id: string; status: State }> }[] };
    const sessionSet = new Set<string>();
    records.forEach((r) => sessionSet.add(r.session_date));
    const sessions = Array.from(sessionSet).sort();
    const byStudent = new Map<string, { student: { id: string; name: string; code: string }; cells: Record<string, { id: string; status: State }> }>();
    records.forEach((r) => {
      const sid = r.student_id;
      if (!byStudent.has(sid)) {
        byStudent.set(sid, {
          student: { id: sid, name: r.students?.full_name ?? "—", code: r.students?.student_code ?? "" },
          cells: {},
        });
      }
      byStudent.get(sid)!.cells[r.session_date] = { id: r.id, status: r.status as State };
    });
    return { sessions, rows: Array.from(byStudent.values()) };
  }, [records]);

  const course = courses?.find((c) => c.id === courseId);

  // Stats
  const totalCells = grid.rows.length * grid.sessions.length;
  let present = 0, late = 0, absent = 0;
  grid.rows.forEach((r) => grid.sessions.forEach((s) => {
    const st = r.cells[s]?.status;
    if (st === "present" || st === "excused") present++;
    else if (st === "late") late++;
    else if (st === "absent") absent++;
  }));

  if (coursesLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description={course ? `Tracking in ${course.code} · ${course.title}` : "Tracking attendance"}
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><ChevronLeft className="h-4 w-4" /> Prev</Button>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">Next <ChevronRight className="h-4 w-4" /></Button>
          </>
        }
      />

      <div className="card-elevated p-1.5 inline-flex flex-wrap gap-1">
        {courses?.slice(0, 6).map((c) => (
          <button key={c.id} onClick={() => setCourseId(c.id)}
            className={cn("px-3 py-1.5 text-xs rounded-md transition-colors",
              courseId === c.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted/60")}>
            <span className="font-mono mr-1.5 opacity-70">{c.code}</span>
            <span>{c.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Present", value: totalCells ? `${Math.round((present / totalCells) * 100)}%` : "—", color: "text-success", soft: "bg-success-soft" },
          { label: "Late", value: totalCells ? `${Math.round((late / totalCells) * 100)}%` : "—", color: "text-warning", soft: "bg-warning-soft" },
          { label: "Absent", value: totalCells ? `${Math.round((absent / totalCells) * 100)}%` : "—", color: "text-destructive", soft: "bg-destructive-soft" },
          { label: "Sessions", value: String(grid.sessions.length), color: "text-foreground", soft: "bg-muted" },
        ].map((s) => (
          <div key={s.label} className="card-elevated p-4">
            <p className="text-[12px] text-muted-foreground">{s.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className={cn("text-2xl font-semibold tabular-nums", s.color)}>{s.value}</p>
              <span className={cn("h-2 w-2 rounded-full", s.soft)} />
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="card-elevated h-72 animate-pulse" />
      ) : grid.rows.length === 0 ? (
        <EmptyState title="No attendance records yet" description="Mark attendance for the first session to begin tracking." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider sticky left-0 bg-muted/40 z-10">Student</th>
                  {grid.sessions.map((s, i) => (
                    <th key={s} className="px-1.5 py-3 font-medium text-muted-foreground text-[10px] uppercase tracking-wider text-center">S{i + 1}</th>
                  ))}
                  <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {grid.rows.map((row) => {
                  const presentCells = grid.sessions.filter((s) => {
                    const st = row.cells[s]?.status;
                    return st === "present" || st === "excused";
                  }).length;
                  const rate = grid.sessions.length ? Math.round((presentCells / grid.sessions.length) * 100) : 0;
                  return (
                    <tr key={row.student.id} className="hover:bg-muted/20">
                      <td className="px-5 py-2 sticky left-0 bg-card whitespace-nowrap z-10">
                        <p className="text-sm font-medium text-foreground">{row.student.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{row.student.code}</p>
                      </td>
                      {grid.sessions.map((s) => {
                        const cell = row.cells[s];
                        if (!cell) return <td key={s} className="p-1 text-center"><span className="inline-block h-7 w-7 rounded-md border border-dashed border-border" /></td>;
                        return (
                          <td key={s} className="p-1 text-center">
                            <button
                              onClick={() => update.mutate({ id: cell.id, status: cycle[(cycle.indexOf(cell.status) + 1) % cycle.length] })}
                              className={cn("h-7 w-7 rounded-md border inline-flex items-center justify-center transition-all", stateStyle[cell.status])}
                              aria-label={`Session ${s}: ${cell.status}`} title={cell.status}>
                              {stateIcon[cell.status]}
                            </button>
                          </td>
                        );
                      })}
                      <td className="px-5 py-2 text-right">
                        <span className={cn("tabular-nums font-medium text-sm",
                          rate >= 90 ? "text-success" : rate >= 80 ? "text-warning" : "text-destructive")}>{rate}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-border/70 px-5 py-3 text-[11px] text-muted-foreground">
            <span>Click a cell to cycle status:</span>
            {(["present", "late", "absent", "excused"] as State[]).map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className={cn("inline-flex h-4 w-4 items-center justify-center rounded border", stateStyle[s])}>{stateIcon[s]}</span>
                <span className="capitalize">{s}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
