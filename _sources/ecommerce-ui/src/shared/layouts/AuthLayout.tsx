import { Search, Store } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="auth-layout">
      <header className="auth-header">
        <Link className="auth-brand" to="/login" aria-label="Mizan.az giriş səhifəsi">
          <img src="/assets/mizan-logo-professional.png" alt="" width="64" height="64" />
          <span>
            <strong>mizan<span>.az</span></strong>
            <small>Dəqiq seçim, etibarlı əlaqə</small>
          </span>
        </Link>
        <nav className="auth-header__nav" aria-label="Qonaq naviqasiyası">
          <Link to="/marketplace">Məhsullar</Link>
          <Link to="/seller/apply">Satıcı olun</Link>
          <Link to="/status">Kömək</Link>
        </nav>
        <div className="auth-header__actions">
          <Link className="auth-search-link" to="/marketplace" aria-label="Məhsul axtar"><span>Axtarış</span><Search aria-hidden="true" /></Link>
          <Link className="auth-shop-link" to="/seller/apply"><Store aria-hidden="true" /> Mağaza aç</Link>
          <Link className="auth-session-link" to="/login">Daxil olun</Link>
        </div>
      </header>
      <div className="auth-layout__content"><Outlet /></div>
      <footer className="auth-footer" aria-label="Köməkçi keçidlər">
        <p>Mizan alıcı və satıcını əlaqələndirir; platforma üzərindən ödəniş qəbul etmir.</p>
        <nav aria-label="Hüquqi keçidlər">
          <a href="/coming-soon">Məxfilik siyasəti</a>
          <a href="/coming-soon">İstifadə şərtləri</a>
          <a href="/status">Dəstək</a>
        </nav>
      </footer>
    </div>
  );
}
