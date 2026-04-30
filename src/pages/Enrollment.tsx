import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses, useStudents, useEnrollmentsByCourse, useToggleEnrollment } from "@/hooks/useUniversityData";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { CheckCircle2, AlertCircle, Search, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnrollmentPage() {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!selectedCourseId && courses?.length) setSelectedCourseId(courses[0].id);
  }, [courses, selectedCourseId]);

  const { data: enrollments } = useEnrollmentsByCourse(selectedCourseId);
  const toggle = useToggleEnrollment(selectedCourseId);

  const enrolledIds = useMemo(
    () => new Set((enrollments ?? []).map((e) => e.student_id)),
    [enrollments],
  );

  const course = courses?.find((c) => c.id === selectedCourseId);
  const filteredStudents = useMemo(
    () => (students ?? []).filter((s) =>
      !query || s.full_name.toLowerCase().includes(query.toLowerCase()) || (s.major ?? "").toLowerCase().includes(query.toLowerCase()),
    ),
    [students, query],
  );

  if (coursesLoading || studentsLoading) return <PageSkeleton />;
  if (!course) return null;

  const enrolledCount = enrolledIds.size;
  const seatsLeft = course.capacity - enrolledCount;
  const isFull = seatsLeft <= 0;

  return (
    <div className="space-y-6">
      <PageHeader title="Enrollment" description="Enroll students into courses and manage rosters." />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <aside className="card-elevated p-3 h-fit lg:sticky lg:top-20">
          <p className="px-2 pt-1 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Courses</p>
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto">
            {courses?.map((c) => (
              <li key={c.id}>
                <button onClick={() => setSelectedCourseId(c.id)}
                  className={cn("w-full text-left rounded-md px-3 py-2.5 transition-colors",
                    selectedCourseId === c.id ? "bg-accent text-accent-foreground shadow-xs" : "hover:bg-muted/60 text-foreground")}>
                  <p className="text-[11px] font-mono text-muted-foreground">{c.code}</p>
                  <p className="text-sm font-medium leading-tight">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Capacity {c.capacity} · {c.status}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="space-y-4">
          <div className="card-elevated p-5 bg-gradient-soft relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="flex items-start justify-between gap-4 relative">
              <div>
                <p className="text-[11px] font-mono text-muted-foreground tracking-wide">{course.code} · {course.department}</p>
                <h2 className="text-xl font-semibold text-foreground mt-1">{course.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{course.faculty} · {course.schedule}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-semibold tabular-nums text-foreground">{enrolledCount}<span className="text-base text-muted-foreground">/{course.capacity}</span></p>
                <p className="text-xs text-muted-foreground">enrolled</p>
              </div>
            </div>

            {isFull ? (
              <div className="mt-4 flex items-center gap-2 rounded-md bg-warning-soft text-warning px-3 py-2 text-xs font-medium">
                <AlertCircle className="h-4 w-4" /> Course at capacity — new students will join the waitlist.
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 rounded-md bg-success-soft text-success px-3 py-2 text-xs font-medium">
                <CheckCircle2 className="h-4 w-4" /> Open for enrollment. {seatsLeft} seats remaining.
              </div>
            )}
          </div>

          <div className="card-elevated overflow-hidden">
            <div className="p-3 border-b border-border/70">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students to enroll…"
                  className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15" />
              </div>
            </div>
            <ul className="divide-y divide-border/70 max-h-[55vh] overflow-y-auto">
              {filteredStudents.map((s) => {
                const isEnrolled = enrolledIds.has(s.id);
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-muted/30">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-[12px] font-semibold text-white shadow-xs", s.avatar_color ?? "from-blue-400 to-indigo-500")}>
                        {s.full_name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.major} · Year {s.year}</p>
                      </div>
                    </div>
                    <Button size="sm" variant={isEnrolled ? "outline" : "default"} disabled={toggle.isPending}
                      onClick={() => toggle.mutate({ studentId: s.id, currentlyEnrolled: isEnrolled })}
                      className={cn("h-8 text-xs gap-1.5", !isEnrolled && "bg-foreground text-background hover:bg-foreground/90")}>
                      {isEnrolled ? (<><X className="h-3.5 w-3.5" /> Unenroll</>) : (<><UserPlus className="h-3.5 w-3.5" /> Enroll</>)}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
