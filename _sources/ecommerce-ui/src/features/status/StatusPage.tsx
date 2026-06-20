import { Activity, ArrowLeft, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { BrandMark } from "../../shared/ui/BrandMark";
import { Button } from "../../shared/ui/Button";
import { Card } from "../../shared/ui/Card";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { StatusPill } from "../../shared/ui/StatusPill";
import { getAuthStatus } from "../auth/auth-api";

type StatusState =
  | { status: "loading" }
  | { status: "ready"; message: string; responseMs: number }
  | { status: "error"; message: string };

export function StatusPage() {
  const [state, setState] = useState<StatusState>({ status: "loading" });

  const loadStatus = useCallback(async () => {
    const startedAt = performance.now();
    setState({ status: "loading" });

    try {
      const message = await getAuthStatus();
      setState({
        status: "ready",
        message,
        responseMs: Math.max(1, Math.round(performance.now() - startedAt))
      });
    } catch (error) {
      setState({ status: "error", message: getFriendlyErrorMessage(error) });
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  return (
    <section className="status-card auth-card--entrance" aria-labelledby="status-title">
      <BrandMark compact />
      <div className="auth-card__header">
        <h1 id="status-title">Sistem statusu</h1>
        <p>Mizan.az autentifikasiya xidmətinin hazırkı cavabı.</p>
      </div>
      {state.status === "loading" ? <PageLoader label="Status yoxlanılır" /> : null}
      {state.status === "ready" ? (
        <>
          <div className="status-row">
            <StatusPill label="Auth service: Aktiv" tone="success" />
            <Activity size={20} aria-hidden="true" />
          </div>
          <Card className="status-message">
            <span>Status mesajı</span>
            <strong>“{state.message}”</strong>
          </Card>
          <div className="status-metrics">
            <div>
              <span>Cavab vaxtı</span>
              <strong>{state.responseMs}ms</strong>
            </div>
            <div>
              <span>Sorğu yolu</span>
              <strong>/api/auth/status</strong>
            </div>
          </div>
        </>
      ) : null}
      {state.status === "error" ? <Notice tone="danger" title="Status alınmadı" message={state.message} /> : null}
      <div className="status-actions">
        <Button variant="secondary" icon={<RefreshCcw size={18} />} onClick={loadStatus}>
          Yenilə
        </Button>
        <Link className="text-link" to="/login">
          <ArrowLeft size={18} />
          Giriş səhifəsinə qayıt
        </Link>
      </div>
    </section>
  );
}
