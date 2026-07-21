import { ArrowRight, Clock3, RotateCcw, ShieldAlert, Store, UserRound, Wrench } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { useAuth } from "../auth/use-auth";
import { getSellerContext } from "../shop/shop-api";
import type { SellerContext } from "../shop/shop-types";

const sellerCopy = {
  DRAFT: { title: "Müraciəti tamamlayın", body: "Mağaza məlumatlarınızı yoxlayın və admin baxışına göndərin.", to: "/seller/apply", icon: Wrench },
  PENDING_REVIEW: { title: "Müraciət yoxlanılır", body: "Admin qərarı verilən kimi status burada yenilənəcək.", to: "/seller/status", icon: Clock3 },
  ACTIVE: { title: "Satıcı paneli", body: "Məhsullarınızı və müştəri sorğularını idarə edin.", to: "/seller", icon: Store },
  REJECTED: { title: "Müraciətə düzəliş lazımdır", body: "Admin qeydini oxuyun, məlumatları yeniləyib təkrar göndərin.", to: "/seller/apply", icon: RotateCcw },
  SUSPENDED: { title: "Mağaza dayandırılıb", body: "Səbəbi və növbəti addımları status səhifəsində görə bilərsiniz.", to: "/seller/status", icon: ShieldAlert },
  CLOSED: { title: "Mağaza bağlanıb", body: "Mağaza hazırda satıcı əməliyyatları üçün açıq deyil.", to: "/seller/status", icon: ShieldAlert }
} as const;

export function WorkspaceChooserPage() {
  const { session, user, roles } = useAuth();
  const [context, setContext] = useState<SellerContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session.accessToken) return;
    setError(null);
    try {
      setContext(await getSellerContext(session.accessToken));
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError));
    }
  }, [session.accessToken]);

  useEffect(() => { void load(); }, [load]);

  if (!context && !error) return <PageLoader label="İş sahələriniz hazırlanır" />;

  const current = context?.status ? sellerCopy[context.status] : null;
  const SellerIcon = current?.icon ?? Store;

  return (
    <main className="workspace-page" aria-labelledby="workspace-title">
      <header className="workspace-intro">
        <p className="eyebrow">Bir hesab, iki iş sahəsi</p>
        <h1 id="workspace-title">Haradan davam edək, {user?.firstName ?? user?.username}?</h1>
        <p>Seçiminiz yalnız görünüşü dəyişir. Hesabınız və təhlükəsiz sessiyanız eyni qalır.</p>
      </header>
      {error ? <Notice tone="danger" title="Mağaza statusu alınmadı" message={error} /> : null}
      <div className="workspace-grid">
        <Link className="workspace-card workspace-card--buyer" to="/marketplace">
          <span className="workspace-card__icon"><UserRound aria-hidden="true" /></span>
          <span className="workspace-card__index">01 / Alıcı</span>
          <h2>Alış-veriş edin</h2>
          <p>Məhsulları kəşf edin və bəyəndiyiniz elan üçün satıcıya birbaşa sorğu göndərin.</p>
          <span className="workspace-card__action">Kataloqa keç <ArrowRight aria-hidden="true" /></span>
        </Link>
        <Link className="workspace-card workspace-card--seller" to={current?.to ?? "/seller/apply"}>
          <span className="workspace-card__icon"><SellerIcon aria-hidden="true" /></span>
          <span className="workspace-card__index">02 / Satıcı</span>
          <h2>{current?.title ?? "Satıcı olun"}</h2>
          <p>{current?.body ?? "Mağaza müraciətinizi yaradın və admin təsdiqindən sonra məhsullarınızı yerləşdirin."}</p>
          {context?.reason ? <span className="workspace-card__note">Qeyd: {context.reason}</span> : null}
          <span className="workspace-card__action">{current ? "Davam et" : "Mağaza yarat"} <ArrowRight aria-hidden="true" /></span>
        </Link>
        {roles.includes("ROLE_ADMIN") ? (
          <Link className="workspace-card workspace-card--admin" to="/admin/shops">
            <span className="workspace-card__index">03 / Admin</span>
            <h2>Mağaza müraciətləri</h2>
            <p>Gözləyən mağazaları yoxlayın, qərar verin və status tarixçəsini qoruyun.</p>
            <span className="workspace-card__action">İdarəetməyə keç <ArrowRight aria-hidden="true" /></span>
          </Link>
        ) : null}
      </div>
      <p className="workspace-disclaimer">Mizan ödəniş qəbul etmir. Alıcı və satıcı ödəniş və çatdırılmanı öz aralarında razılaşdırır.</p>
    </main>
  );
}
