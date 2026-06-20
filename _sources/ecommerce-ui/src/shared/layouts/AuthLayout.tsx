import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main className="auth-layout">
      <div className="ambient ambient--one" aria-hidden="true" />
      <div className="ambient ambient--two" aria-hidden="true" />
      <Outlet />
      <footer className="auth-footer" aria-label="Köməkçi keçidlər">
        <a href="/coming-soon">Məxfilik siyasəti</a>
        <a href="/status">Dəstək</a>
        <a href="/coming-soon">İstifadə şərtləri</a>
      </footer>
    </main>
  );
}
