import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your workspace preferences." />

      <div className="card-elevated p-6 max-w-2xl">
        <h3 className="text-[15px] font-semibold text-foreground mb-1">Profile</h3>
        <p className="text-xs text-muted-foreground mb-5">Update your display name and contact info.</p>

        <div className="space-y-4">
          <Field label="Full name" defaultValue="Dr. Elena Park" />
          <Field label="Email" defaultValue="elena.park@uni.edu" type="email" />
          <Field label="Role" defaultValue="Administrator" disabled />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">Save changes</Button>
        </div>
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
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 disabled:opacity-60"
      />
    </label>
  );
}
