import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses, useGradesByCourse, useUpdateGrade } from "@/hooks/useUniversityData";
import { PageSkeleton, EmptyState } from "@/components/shared/PageSkeleton";
import { Download, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const cols = [
  { key: "assignment1", label: "Assn 1", weight: 15 },
  { key: "assignment2", label: "Assn 2", weight: 15 },
  { key: "midterm", label: "Midterm", weight: 30 },
  { key: "final_exam", label: "Final", weight: 40 },
] as const;

function letter(score: number) {
  if (score >= 93) return "A";
  if (score >= 87) return "A-";
  if (score >= 83) return "B+";
  if (score >= 77) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  return "D";
}
function letterColor(l: string) {
  if (l.startsWith("A")) return "bg-success-soft text-success";
  if (l.startsWith("B")) return "bg-primary-soft text-primary";
  if (l.startsWith("C")) return "bg-warning-soft text-warning";
  return "bg-destructive-soft text-destructive";
}

export default function GradesPage() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const [courseId, setCourseId] = useState<string | undefined>();
  useEffect(() => {
    if (!courseId && courses?.length) setCourseId(courses[0].id);
  }, [courses, courseId]);

  const { data: rows, isLoading } = useGradesByCourse(courseId);
  const update = useUpdateGrade();

  if (coursesLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Grades"
        description="Enter and review grades. Final scores update in real time."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Download className="h-4 w-4" /> Export CSV</Button>
            <Button size="sm" className="h-9 gap-1.5 bg-foreground text-background hover:bg-foreground/90"><Save className="h-4 w-4" /> Save</Button>
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

      {isLoading ? (
        <div className="card-elevated h-64 animate-pulse" />
      ) : !rows?.length ? (
        <EmptyState title="No grades for this course yet" description="Enroll students and add grades to get started." />
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40 text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider sticky left-0 bg-muted/40">Student</th>
                  {cols.map((c) => (
                    <th key={c.key} className="px-3 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">
                      {c.label}
                      <span className="block text-[10px] font-normal normal-case text-muted-foreground/70">{c.weight}%</span>
                    </th>
                  ))}
                  <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Final</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider text-right">Letter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {rows.map((r) => {
                  const a1 = Number(r.assignment1 ?? 0);
                  const a2 = Number(r.assignment2 ?? 0);
                  const mid = Number(r.midterm ?? 0);
                  const fin = Number(r.final_exam ?? 0);
                  const total = a1 * 0.15 + a2 * 0.15 + mid * 0.3 + fin * 0.4;
                  const l = letter(total);
                  return (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-2.5 sticky left-0 bg-card">
                        <p className="font-medium text-foreground text-sm">{r.students?.full_name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{r.students?.student_code}</p>
                      </td>
                      {cols.map((c) => (
                        <td key={c.key} className="px-3 py-2.5 text-center">
                          <input type="number" min={0} max={100}
                            defaultValue={Number(r[c.key] ?? 0)}
                            onBlur={(e) => {
                              const v = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                              if (v !== Number(r[c.key] ?? 0)) {
                                update.mutate({ id: r.id, field: c.key, value: v });
                              }
                            }}
                            className="w-16 h-8 rounded-md border border-border bg-background text-center text-sm tabular-nums outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
                        </td>
                      ))}
                      <td className="px-5 py-2.5 text-right font-semibold tabular-nums text-foreground">{total.toFixed(1)}</td>
                      <td className="px-5 py-2.5 text-right">
                        <span className={cn("inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold min-w-8", letterColor(l))}>{l}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border/70 px-5 py-2.5 text-[11px] text-muted-foreground">
            Edits are saved automatically when you leave a cell.
          </p>
        </div>
      )}
    </div>
  );
}
