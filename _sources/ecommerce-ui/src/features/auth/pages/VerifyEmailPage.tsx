import { CheckCircle2, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../../shared/api/api-error";
import { BrandMark } from "../../../shared/ui/BrandMark";
import { Button } from "../../../shared/ui/Button";
import { Notice } from "../../../shared/ui/Notice";
import { PageLoader } from "../../../shared/ui/PageLoader";
import { verifyEmail } from "../auth-api";

type VerifyState =
  | { status: "loading" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [state, setState] = useState<VerifyState>(
    token ? { status: "loading" } : { status: "error", message: "E-poçt təsdiq tokeni tapılmadı." }
  );

  const loadVerification = useCallback(() => {
    if (!token) {
      setState({ status: "error", message: "E-poçt təsdiq tokeni tapılmadı." });
      return;
    }

    let isMounted = true;
    setState({ status: "loading" });

    verifyEmail(token)
      .then(() => {
        if (isMounted) {
          setState({ status: "success", message: "E-poçt ünvanınız təsdiqləndi. İndi giriş edə bilərsiniz." });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({
            status: "error",
            message: getFriendlyErrorMessage(error, "Keçid linki etibarsızdır və ya vaxtı keçib.")
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  useEffect(() => {
    return loadVerification();
  }, [loadVerification]);

  return (
    <section className="auth-card auth-card--entrance" aria-labelledby="verify-title">
      <BrandMark />
      <div className="auth-card__header">
        <h1 id="verify-title">E-poçt təsdiqi</h1>
        <p>Hesabınızı aktivləşdirmək üçün təsdiq tokeni backendə göndərilir.</p>
      </div>
      {state.status === "loading" ? <PageLoader label="E-poçt təsdiqlənir" /> : null}
      {state.status === "success" ? (
        <Notice tone="success" title="Təsdiq tamamlandı" message={state.message} />
      ) : null}
      {state.status === "error" ? <Notice tone="danger" title="Təsdiq alınmadı" message={state.message} /> : null}
      {state.status !== "loading" ? (
        <div className="auth-result-icon" aria-hidden="true">
          {state.status === "success" ? <CheckCircle2 size={42} /> : <XCircle size={42} />}
        </div>
      ) : null}
      {state.status === "error" ? (
        <Button className="auth-result-button" variant="secondary" onClick={loadVerification}>
          Yenidən yoxla
        </Button>
      ) : null}
      <p className="auth-switch">
        <Link to="/login">Giriş səhifəsinə qayıt</Link>
      </p>
    </section>
  );
}
