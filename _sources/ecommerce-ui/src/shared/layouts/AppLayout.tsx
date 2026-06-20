import { LogOut, ShieldCheck, UserCircle } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../features/auth/use-auth";
import { Button } from "../ui/Button";

export function AppLayout() {
  const { roles, logout } = useAuth();
  const navigate = useNavigate();
  const [warning, setWarning] = useState<string | null>(null);
  const isAdmin = roles.includes("ROLE_ADMIN");

  async function handleLogout() {
    const logoutWarning = await logout();
    setWarning(logoutWarning ?? null);
    navigate("/login", { replace: true, state: logoutWarning ? { warning: logoutWarning } : undefined });
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <NavLink className="app-header__brand" to="/account" aria-label="MIZAN.AZ hesab səhifəsi">
          Mizan.az
          {isAdmin ? <span>ADMIN</span> : null}
        </NavLink>
        <nav className="app-header__nav" aria-label="Əsas naviqasiya">
          <NavLink to="/account">Hesabım</NavLink>
          {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
          <NavLink to="/marketplace">Kataloq</NavLink>
          <NavLink to="/status">Status</NavLink>
        </nav>
        <div className="app-header__actions">
          <NavLink className="icon-link" to="/account" aria-label="Hesabım">
            <UserCircle size={22} />
          </NavLink>
          {isAdmin ? (
            <NavLink className="icon-link" to="/admin" aria-label="Admin panel">
              <ShieldCheck size={22} />
            </NavLink>
          ) : null}
          <Button variant="ghost" icon={<LogOut size={19} />} onClick={handleLogout}>
            Çıxış
          </Button>
        </div>
      </header>
      {warning ? <div className="top-warning">{warning}</div> : null}
      <Outlet />
      <footer className="app-footer">
        <strong>Mizan.az</strong>
        <span>© 2026 Mizan.az. Bütün hüquqlar qorunur.</span>
        <nav aria-label="Alt keçidlər">
          <NavLink to="/coming-soon">İstifadəçi şərtləri</NavLink>
          <NavLink to="/coming-soon">Məxfilik siyasəti</NavLink>
          <NavLink to="/status">Əlaqə</NavLink>
        </nav>
      </footer>
    </div>
  );
}
