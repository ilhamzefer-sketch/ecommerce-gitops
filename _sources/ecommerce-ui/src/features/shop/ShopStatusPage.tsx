import { ArrowLeft, CheckCircle2, Clock3, RotateCcw, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { useAuth } from "../auth/use-auth";
import { getSellerContext } from "./shop-api";
import type { SellerContext } from "./shop-types";

export function ShopStatusPage() {
  const { session } = useAuth();
  const [context, setContext] = useState<SellerContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (session.accessToken) getSellerContext(session.accessToken).then(setContext).catch((requestError) => setError(getFriendlyErrorMessage(requestError)));
  }, [session.accessToken]);
  if (!context && !error) return <PageLoader label="Mağaza statusu yoxlanılır" />;
  if (!context) return <main className="page-shell"><Notice tone="danger" message={error ?? "Status alınmadı."} /></main>;

  const config = context.status === "ACTIVE"
    ? { icon: CheckCircle2, title: "Mağazanız aktivdir", body: "Satıcı panelinə keçib məhsullarınızı idarə edə bilərsiniz.", tone: "success" as const }
    : context.status === "REJECTED"
      ? { icon: RotateCcw, title: "Müraciətə düzəliş lazımdır", body: context.reason ?? "Məlumatları yeniləyib təkrar göndərin.", tone: "warning" as const }
      : context.status === "SUSPENDED" || context.status === "CLOSED"
        ? { icon: ShieldAlert, title: "Mağaza əməliyyatları bağlıdır", body: context.reason ?? "Dəstək komandası ilə əlaqə saxlayın.", tone: "danger" as const }
        : { icon: Clock3, title: "Müraciətiniz yoxlanılır", body: "Admin mağaza məlumatlarını yoxlayır. Qərar verilən kimi bu səhifə yenilənəcək.", tone: "info" as const };
  const Icon = config.icon;

  return <main className="status-focus"><Link className="back-link" to="/choose-workspace"><ArrowLeft /> İş sahələrinə qayıt</Link><section className={`status-focus__card status-focus__card--${config.tone}`}><span><Icon aria-hidden="true" /></span><p className="eyebrow">{context.shopName}</p><h1>{config.title}</h1><p>{config.body}</p><div className="status-timeline"><span className="done">Müraciət yaradıldı</span><span className={context.status === "PENDING_REVIEW" ? "current" : "done"}>Admin baxışı</span><span className={context.status === "ACTIVE" ? "done" : ""}>Aktiv mağaza</span></div>{context.status === "ACTIVE" ? <Link className="button-link" to="/seller">Satıcı panelinə keç</Link> : null}{context.status === "REJECTED" ? <Link className="button-link" to="/seller/apply">Məlumatları yenilə</Link> : null}</section></main>;
}
