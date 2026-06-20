type StatusPillTone = "success" | "warning" | "neutral";

export function StatusPill({ label, tone = "neutral" }: { label: string; tone?: StatusPillTone }) {
  return (
    <span className={`status-pill status-pill--${tone}`}>
      <span className="status-pill__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
