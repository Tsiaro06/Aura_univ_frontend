import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session && !authLoading) navigate("/dashboard", { replace: true });
  }, [session, authLoading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;

        // Promote the very first signup to admin so the demo works end-to-end
        if (data.user) {
          const { count } = await supabase
            .from("user_roles")
            .select("*", { count: "exact", head: true })
            .eq("role", "admin");
          if ((count ?? 0) === 0) {
            await supabase.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
          }
        }
        toast.success("Account created — welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight text-foreground">Lumen</span>
            <span className="text-[11px] text-muted-foreground">University Suite</span>
          </div>
        </Link>

        <div className="card-elevated p-7 bg-card/80 backdrop-blur-xl">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            {mode === "signin" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "signin"
              ? "Welcome back. Enter your credentials below."
              : "Start managing your university in minutes."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field label="Full name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Dr. Elena Park" />
            )}
            <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@university.edu" />
            <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={mode === "signin" ? "current-password" : "new-password"} placeholder="••••••••" />

            <Button type="submit" disabled={submitting} className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 mt-2">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-6">
            {mode === "signin" ? "New to Lumen?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-medium hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-[11px] text-center text-muted-foreground mt-6">
          The first account you create is granted Administrator access automatically.
        </p>
      </div>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-foreground mb-1.5">{label}</span>
      <input
        {...props}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}
