import type { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--cxc-border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--cxc-muted)]">
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className ?? statusClass(status)}`}>
      {status}
    </span>
  );
}

export function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[var(--cxc-border)] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--cxc-muted)]">{label}</div>
        <div className="rounded-2xl bg-[rgba(61,126,168,0.12)] p-2 text-[var(--cxc-primary)]">{icon}</div>
      </div>
      <div className="text-3xl font-bold text-[var(--cxc-heading)]">{value}</div>
      <div className="mt-1 text-sm text-[var(--cxc-muted)]">{detail}</div>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[var(--cxc-border)] bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[var(--cxc-heading)]">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-[var(--cxc-muted)]">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function statusClass(status: string) {
  if (["Paid", "Approved", "Published", "Connected", "Success"].includes(status)) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (["Overdue", "Rejected", "Disconnected", "Failed"].includes(status)) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (["Partial", "Pending", "Draft", "Degraded", "Info Requested", "Warning"].includes(status)) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-blue-50 text-blue-700 border-blue-200";
}
