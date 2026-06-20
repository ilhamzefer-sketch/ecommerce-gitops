import { RefreshCcw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { StatusPill } from "../../shared/ui/StatusPill";
import { useAuth } from "../auth/use-auth";
import { getAdminDashboard } from "./admin-api";
import type { AdminDashboardResponse } from "./admin-types";

type AdminState =
  | { status: "loading" }
  | { status: "ready"; data: AdminDashboardResponse }
  | { status: "error"; message: string };

export function AdminDashboardPage() {
  const { session, user, roles } = useAuth();
  const [state, setState] = useState<AdminState>({ status: "loading" });

  const loadDashboard = useCallback(async () => {
    if (!session.accessToken) {
      setState({ status: "error", message: "Sessiyanız bitib. Zəhmət olmasa yenidən daxil olun." });
      return;
    }

    setState({ status: "loading" });
    try {
      const data = await getAdminDashboard(session.accessToken);
      setState({ status: "ready", data });
    } catch (error) {
      setState({ status: "error", message: getFriendlyErrorMessage(error) });
    }
  }, [session.accessToken]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <main className="page-shell" aria-labelledby="admin-title">
      <section className="page-hero">
        <div>
          <h1 id="admin-title">Admin panel</h1>
          <p>Mizan.az idarəetmə bölməsinin hazırda mövcud olan minimal status görünüşü.</p>
        </div>
        <Button variant="secondary" icon={<RefreshCcw size={18} />} onClick={loadDashboard}>
          Yenilə
        </Button>
      </section>
      {state.status === "loading" ? <PageLoader label="Admin məlumatları yüklənir" /> : null}
      {state.status === "error" ? <Notice tone="danger" title="Admin məlumatı alınmadı" message={state.message} /> : null}
      {state.status === "ready" ? (
        <div className="admin-grid">
          <Card className="admin-panel">
            <div className="admin-panel__heading">
              <h2>Dashboard statusu</h2>
              <ShieldCheck size={30} aria-hidden="true" />
            </div>
            <dl className="admin-details">
              <div>
                <dt>Başlıq</dt>
                <dd>{state.data.title ?? "Məlumat yoxdur"}</dd>
              </div>
              <div>
                <dt>Mesaj</dt>
                <dd>{state.data.message ?? "Məlumat yoxdur"}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusPill label={state.data.status ?? "Naməlum"} tone="success" />
                </dd>
              </div>
            </dl>
          </Card>
          <aside className="side-stack" aria-label="Admin qeydləri">
            <Notice
              tone="warning"
              title="Xatırlatma"
              message="Bu səhifə yalnız hazırkı backendin verdiyi ilkin admin statusudur. Məhsul, sifariş və hesabat modulları mövcud deyil."
            />
            <Card className="admin-meta">
              <span>Backend əhatəsi</span>
              <strong>Minimal admin panel statusu</strong>
            </Card>
            <Card className="admin-meta">
              <span>Aktiv sessiya</span>
              <strong>{user?.username ?? "Məlumat yoxdur"}</strong>
              <p>{roles.length > 0 ? roles.join(", ") : "Rol məlumatı yoxdur"}</p>
              <p>{session.accessToken ? "Access token yalnız yaddaşdadır." : "Token mövcud deyil."}</p>
            </Card>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
