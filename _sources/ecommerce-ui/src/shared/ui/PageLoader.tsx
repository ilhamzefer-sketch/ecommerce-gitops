export function PageLoader({ label = "Yüklənir" }: { label?: string }) {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__mark" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
