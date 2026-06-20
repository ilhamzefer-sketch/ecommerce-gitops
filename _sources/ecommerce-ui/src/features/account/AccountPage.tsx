import { ArrowLeft, LogOut, RefreshCcw, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { Notice } from "../../shared/ui/Notice";
import { StatusPill } from "../../shared/ui/StatusPill";
import { useAuth } from "../auth/use-auth";

export function AccountPage() {
  const { user, roles, reloadUser, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleRefreshProfile() {
    setIsRefreshing(true);
    setError(null);
    setMessage(null);
    try {
      await reloadUser();
      setMessage("Hesab məlumatları yeniləndi.");
    } catch (refreshError) {
      setError(getFriendlyErrorMessage(refreshError));
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLogoutAll() {
    setIsLoggingOut(true);
    const warning = await logout("all");
    navigate("/login", { replace: true, state: warning ? { warning } : undefined });
  }

  return (
    <main className="page-shell" aria-labelledby="account-title">
      <section className="page-hero">
        <div>
          <h1 id="account-title">Hesabım</h1>
          <p>Hesab məlumatlarınızı və giriş statusunuzu buradan görə bilərsiniz.</p>
        </div>
        <Button variant="secondary" icon={<RefreshCcw size={18} />} isLoading={isRefreshing} onClick={handleRefreshProfile}>
          Yenilə
        </Button>
      </section>
      {message ? <Notice tone="success" message={message} /> : null}
      {error ? <Notice tone="danger" message={error} /> : null}
      <div className="account-grid">
        <Card className="profile-card">
          <div className="profile-card__avatar" aria-hidden="true">
            <UserRound size={48} />
            <span />
          </div>
          <div className="profile-card__content">
            <dl className="detail-list">
              <div>
                <dt>İstifadəçi adı</dt>
                <dd>{user?.username ?? "Məlumat yoxdur"}</dd>
              </div>
              <div>
                <dt>Rollar</dt>
                <dd className="role-list">
                  {roles.length > 0 ? roles.map((role) => <span key={role}>{role}</span>) : "Rol məlumatı yoxdur"}
                </dd>
              </div>
              <div>
                <dt>Status mesajı</dt>
                <dd>{user?.message ?? "Profil mesajı mövcud deyil"}</dd>
              </div>
            </dl>
            <div className="profile-card__actions">
              <Button variant="danger" icon={<LogOut size={18} />} onClick={handleLogoutAll} isLoading={isLoggingOut}>
                Bütün sessiyalardan çıx
              </Button>
              <Link className="text-link" to="/coming-soon">
                <ArrowLeft size={18} />
                Əsas səhifəyə qayıt
              </Link>
            </div>
          </div>
        </Card>
        <aside className="side-stack" aria-label="Hesab qeydləri">
          <Notice
            tone="info"
            title="Məlumat"
            message="Hazırda yalnız backendin qaytardığı əsas hesab məlumatları göstərilir. Daha çox tənzimləmə backend hazır olduqdan sonra əlavə ediləcək."
          />
          <Card className="trust-card">
            <ShieldCheck size={26} aria-hidden="true" />
            <div>
              <h2>Giriş statusu</h2>
              <StatusPill label="Sessiya aktivdir" tone="success" />
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
