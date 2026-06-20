import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="not-found" aria-labelledby="not-found-title">
      <section className="surface-card not-found__panel">
        <span>404</span>
        <h1 id="not-found-title">Səhifə tapılmadı</h1>
        <p>Axtardığınız ünvan mövcud deyil və ya hazırkı frontend scope daxilində deyil.</p>
        <Link className="button button--primary" to="/login">
          <span>Giriş səhifəsinə qayıt</span>
        </Link>
      </section>
    </main>
  );
}
