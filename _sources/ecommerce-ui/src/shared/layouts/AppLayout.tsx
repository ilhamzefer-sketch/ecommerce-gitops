import { LogOut, Menu, Settings, ShieldCheck, ShoppingBag, Store, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/use-auth";
import { Button } from "../ui/Button";

export function AppLayout() {
  const { roles, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = roles.includes("ROLE_ADMIN");

  async function handleLogout() {
    const warning = await logout();
    navigate("/login", { replace: true, state: warning ? { warning } : undefined });
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="app-brand" to="/choose-workspace" aria-label="Mizan.az iş sahələri"><img src="/assets/mizan-logo-professional.png" alt="" width="64" height="64" /><span><strong>mizan.az</strong><small>Dəqiq seçim, etibarlı əlaqə</small></span></NavLink>
        <button className="mobile-menu-button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? "Menyunu bağla" : "Menyunu aç"}><span>{open ? <X /> : <Menu />}</span></button>
        <nav id="primary-navigation" className={open ? "app-nav app-nav--open" : "app-nav"} aria-label="Əsas naviqasiya">
          <NavLink to="/marketplace" onClick={() => setOpen(false)}><ShoppingBag /> Kataloq</NavLink>
          <NavLink to="/seller" onClick={() => setOpen(false)}><Store /> Satıcı</NavLink>
          {isAdmin ? <NavLink to="/admin/shops" onClick={() => setOpen(false)}><ShieldCheck /> Admin</NavLink> : null}
          <NavLink to="/account" onClick={() => setOpen(false)}><Settings /> Hesab</NavLink>
        </nav>
        <div className="app-user"><span><small>Xoş gəldiniz</small><strong>{user?.firstName ?? user?.username}</strong></span><Button variant="ghost" icon={<LogOut />} onClick={handleLogout}>Çıxış</Button></div>
      </header>
      <Outlet />
      <footer className="site-footer"><div><strong>mizan.az</strong><p>Alıcı və yerli satıcılar arasında şəffaf əlaqə məkanı.</p></div><p>Mizan ödəniş qəbul etmir. Razılaşmalar tərəflər arasında aparılır.</p><span>© 2026 Mizan.az</span></footer>
    </div>
  );
}
