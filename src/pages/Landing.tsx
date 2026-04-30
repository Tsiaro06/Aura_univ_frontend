import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  Users,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  BarChart3,
  ShieldCheck,
  Check,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student records",
    description: "A single source of truth for every learner — profiles, status, GPA and progress at a glance.",
  },
  {
    icon: BookOpen,
    title: "Course catalog",
    description: "Design and publish courses, set capacity, assign faculty and manage terms with ease.",
  },
  {
    icon: GraduationCap,
    title: "Grades & transcripts",
    description: "Capture assignments, midterms and finals. Auto-compute weighted scores in real time.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance tracking",
    description: "Daily session logs with present, late, absent and excused statuses — all in one workflow.",
  },
  {
    icon: BarChart3,
    title: "Reports & insights",
    description: "Beautiful dashboards reveal enrollment trends, performance and engagement patterns.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description: "Admins, teachers and students each see exactly what they need — secured at the database layer.",
  },
];

const stats = [
  { value: "12k+", label: "Students managed" },
  { value: "480", label: "Active courses" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Faculty rating" },
];

const checklist = [
  "Real-time enrollment with capacity & waitlist logic",
  "Weighted grade calculation across assignments",
  "Attendance analytics with at-risk detection",
  "Secure authentication with role-based permissions",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Sparkles className="h-4.5 w-4.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-semibold tracking-tight text-foreground">Lumen</span>
              <span className="text-[11px] text-muted-foreground">University Suite</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#workflow" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Workflow
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex px-3 py-2"
            >
              Sign in
            </Link>
            <Button asChild size="sm" className="h-9 bg-foreground text-background hover:bg-foreground/90 shadow-soft">
              <Link to="/auth">
                Get started
                <ArrowRight className="ml-0.5 h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 pt-16 md:pt-24 pb-16 md:pb-20">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/70 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
              New · Attendance analytics 2.0
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
              The modern operating system for your university
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Lumen brings students, courses, grades and attendance into one calm, focused workspace —
              designed with the clarity of Linear and the depth of Notion.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Button asChild size="lg" className="h-11 px-5 bg-foreground text-background hover:bg-foreground/90 shadow-soft">
                <Link to="/auth">
                  Start free
                  <ArrowRight className="ml-0.5 h-4 w-4" strokeWidth={2.5} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-5">
                <a href="#features">See how it works</a>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required · The first account becomes Administrator
            </p>
          </div>

          {/* Hero preview card */}
          <div className="mt-14 md:mt-16 mx-auto max-w-5xl">
            <div className="card-elevated overflow-hidden bg-card/80 backdrop-blur-xl">
              <div className="flex items-center gap-1.5 border-b border-border/70 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 text-[11px] text-muted-foreground">lumen.app / overview</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 md:p-7">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-lg border border-border/70 bg-background/60 p-4">
                    <p className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-5 md:px-7 pb-7">
                {[
                  { icon: LayoutDashboard, label: "Live overview" },
                  { icon: BookOpen, label: "Course catalog" },
                  { icon: BarChart3, label: "Performance trends" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-background/60 px-3.5 py-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <item.icon className="h-3.5 w-3.5 text-foreground" strokeWidth={2} />
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/70 bg-background/40">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Everything you need</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              One workspace for the entire academic lifecycle
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              From the first application to the final transcript — manage every record without leaving Lumen.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border/70 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
                  <f.icon className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-t border-border/70">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-8 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Built for clarity</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Replace five spreadsheets with one calm dashboard
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Lumen replaces brittle spreadsheets and disconnected portals with a single, fast workspace.
              Every team — registrar, faculty, and students — works from the same trusted data.
            </p>
            <ul className="mt-6 space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Button asChild className="h-10 bg-foreground text-background hover:bg-foreground/90 shadow-soft">
                <Link to="/auth">
                  Create your workspace
                  <ArrowRight className="ml-0.5 h-4 w-4" strokeWidth={2.5} />
                </Link>
              </Button>
            </div>
          </div>

          <div className="card-elevated bg-card/80 backdrop-blur-xl p-6">
            <div className="space-y-3">
              {[
                { label: "Sophie Laurent", meta: "BSC · Year 3 · 3.9 GPA", status: "Active", tone: "bg-primary/10 text-primary" },
                { label: "CS 401 · Algorithms", meta: "Faculty: Dr. Park · 36 / 40", status: "Open", tone: "bg-foreground/10 text-foreground" },
                { label: "Midterm grades posted", meta: "PSYC 210 · 28 students", status: "Done", tone: "bg-muted text-foreground" },
                { label: "Attendance flagged", meta: "3 students below 75%", status: "Alert", tone: "bg-destructive/10 text-destructive" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/60 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{row.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{row.meta}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${row.tone}`}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-border/70 bg-background/40">
        <div className="mx-auto w-full max-w-[1000px] px-5 md:px-8 py-20 md:py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            Ready to bring your university into focus?
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Get started in under a minute. The first account you create becomes the administrator —
            no setup calls, no migrations.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="h-11 px-5 bg-foreground text-background hover:bg-foreground/90 shadow-soft">
              <Link to="/auth">
                Get started free
                <ArrowRight className="ml-0.5 h-4 w-4" strokeWidth={2.5} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-5">
              <Link to="/auth">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-5 md:px-8 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary shadow-glow">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Lumen University Suite</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
