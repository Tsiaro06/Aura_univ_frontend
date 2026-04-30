import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { useCourses, useCourseEnrollmentCounts } from "@/hooks/useUniversityData";
import { PageSkeleton, EmptyState } from "@/components/shared/PageSkeleton";
import { Plus, Users, Clock, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "open" | "full" | "waitlist" | "closed";

const statusStyle: Record<Status, string> = {
  open: "bg-success-soft text-success",
  full: "bg-destructive-soft text-destructive",
  waitlist: "bg-warning-soft text-warning",
  closed: "bg-muted text-muted-foreground",
};

const statusLabel: Record<Status, string> = {
  open: "Open", full: "Full", waitlist: "Waitlist", closed: "Closed",
};

export default function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  const { data: counts } = useCourseEnrollmentCounts();

  if (isLoading) return <PageSkeleton />;
  if (!courses?.length) return <EmptyState title="No courses yet" description="Add your first course to get started." />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description={`${courses.length} active courses this term`}
        actions={
          <Button size="sm" className="h-9 gap-1.5 bg-foreground text-background hover:bg-foreground/90">
            <Plus className="h-4 w-4" /> New course
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c) => {
          const enrolled = counts?.[c.id] ?? 0;
          const fillPct = Math.round((enrolled / c.capacity) * 100);
          const status = c.status as Status;
          return (
            <article key={c.id} className="card-elevated p-5 group flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <BookOpen className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-muted-foreground tracking-wide">{c.code}</p>
                    <p className="text-[11px] text-muted-foreground">{c.department}</p>
                  </div>
                </div>
                <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium", statusStyle[status])}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusLabel[status]}
                </span>
              </div>

              <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">Taught by {c.faculty}</p>

              <div className="mt-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {c.schedule}</span>
                  <span>{c.credits} credits</span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> Enrollment</span>
                    <span className="tabular-nums font-medium text-foreground">{enrolled}/{c.capacity}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all",
                      fillPct >= 100 ? "bg-destructive" : fillPct >= 90 ? "bg-warning" : "bg-primary")}
                      style={{ width: `${Math.min(fillPct, 100)}%` }} />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">View roster</Button>
                  <Button size="sm" className="flex-1 h-8 text-xs bg-foreground text-background hover:bg-foreground/90">Manage</Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
