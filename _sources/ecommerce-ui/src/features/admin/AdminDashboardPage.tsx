import { Check, Clock3, RefreshCcw, Store, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Button } from "../../shared/ui/Button";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { useAuth } from "../auth/use-auth";
import { decideShop, listShopsForAdmin } from "../shop/shop-api";
import type { Shop } from "../shop/shop-types";

export function AdminDashboardPage() {
  const { session } = useAuth();
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<Record<number, string>>({});
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!session.accessToken) return;
    setError(null);
    try { setShops(await listShopsForAdmin(session.accessToken)); }
    catch (requestError) { setError(getFriendlyErrorMessage(requestError)); setShops([]); }
  }, [session.accessToken]);

  useEffect(() => { void load(); }, [load]);

  async function decide(shopId: number, decision: "APPROVE" | "REJECT") {
    if (!session.accessToken) return;
    setBusyId(shopId); setError(null);
    try {
      await decideShop(session.accessToken, shopId, decision, reason[shopId]);
      await load();
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError)); }
    finally { setBusyId(null); }
  }

  if (shops === null) return <PageLoader label="Mağaza müraciətləri yüklənir" />;
  const pending = shops.filter((shop) => shop.status === "PENDING_REVIEW");

  return (
    <main className="admin-page" aria-labelledby="admin-title">
      <header className="admin-header"><div><p className="eyebrow">Platforma idarəetməsi</p><h1 id="admin-title">Mağaza müraciətləri</h1><p>Hər mağazanı real məlumatlara əsasən yoxlayın. Rədd qərarı üçün səbəb məcburidir.</p></div><Button variant="secondary" icon={<RefreshCcw />} onClick={() => void load()}>Yenilə</Button></header>
      {error ? <Notice tone="danger" message={error} /> : null}
      <section className="admin-summary"><article><Clock3 /><div><small>Gözləyən müraciət</small><strong>{pending.length}</strong></div></article><article><Store /><div><small>Bütün mağazalar</small><strong>{shops.length}</strong></div></article></section>
      <section className="review-list" aria-label="Gözləyən müraciətlər">
        {pending.map((shop) => <article className="review-card" key={shop.id}><header><div><span>{shop.type === "BUSINESS" ? "Biznes" : "Fərdi satıcı"}</span><h2>{shop.name}</h2><p>{shop.category} · {shop.city}</p></div><strong>#{shop.id}</strong></header><p className="review-card__description">{shop.description}</p><dl><div><dt>Telefon</dt><dd>{shop.contactPhone}</dd></div><div><dt>E-poçt</dt><dd>{shop.contactEmail}</dd></div><div><dt>Ünvan</dt><dd>{shop.address}</dd></div>{shop.taxId ? <div><dt>VÖEN</dt><dd>{shop.taxId}</dd></div> : null}</dl><label htmlFor={`reason-${shop.id}`}>Rədd səbəbi</label><textarea id={`reason-${shop.id}`} value={reason[shop.id] ?? ""} onChange={(event) => setReason((current) => ({ ...current, [shop.id]: event.target.value }))} placeholder="Yalnız rədd ediləcəksə konkret düzəlişi yazın…" /><footer><Button variant="secondary" icon={<X />} disabled={busyId === shop.id || !(reason[shop.id]?.trim())} onClick={() => void decide(shop.id, "REJECT")}>Rədd et</Button><Button icon={<Check />} isLoading={busyId === shop.id} onClick={() => void decide(shop.id, "APPROVE")}>Təsdiqlə</Button></footer></article>)}
        {pending.length === 0 ? <div className="empty-state"><Check /><h2>Gözləyən müraciət yoxdur</h2><p>Yeni müraciətlər bu bölmədə görünəcək.</p></div> : null}
      </section>
    </main>
  );
}
