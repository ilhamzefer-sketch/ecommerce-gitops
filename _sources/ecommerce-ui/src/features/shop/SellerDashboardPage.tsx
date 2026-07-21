import { Archive, Boxes, MessageCircle, Plus, Send, Store, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Button } from "../../shared/ui/Button";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { TextField } from "../../shared/ui/TextField";
import { useAuth } from "../auth/use-auth";
import { archiveProduct, createProduct, getShopInquiries, getShopProducts, publishProduct } from "../products/product-api";
import type { Inquiry, Product } from "../products/product-types";
import { getSellerContext } from "./shop-api";
import type { SellerContext } from "./shop-types";

const emptyProduct = {
  name: "", description: "", category: "", price: "", conditionLabel: "Yeni",
  stockNote: "Mövcuddur", imageUrl: "", deliveryNote: "Satıcı ilə razılaşdırılır"
};

export function SellerDashboardPage() {
  const { session } = useAuth();
  const [context, setContext] = useState<SellerContext | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!session.accessToken) return;
    try {
      const seller = await getSellerContext(session.accessToken);
      setContext(seller);
      if (seller.status !== "ACTIVE" || !seller.shopId) return;
      const [productList, inquiryList] = await Promise.all([
        getShopProducts(session.accessToken, seller.shopId),
        getShopInquiries(session.accessToken, seller.shopId)
      ]);
      setProducts(productList);
      setInquiries(inquiryList);
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError));
    }
  }, [session.accessToken]);

  useEffect(() => { void load(); }, [load]);

  async function submitProduct(event: FormEvent) {
    event.preventDefault();
    if (!session.accessToken || !context?.shopId) return;
    setBusy(true); setError(null); setMessage(null);
    try {
      await createProduct(session.accessToken, {
        shopId: context.shopId, name: form.name, description: form.description, category: form.category,
        price: Number(form.price), currency: "AZN", conditionLabel: form.conditionLabel,
        stockNote: form.stockNote, imageUrl: form.imageUrl, deliveryNote: form.deliveryNote
      });
      setMessage("Məhsul draft kimi yaradıldı. Yoxladıqdan sonra yayımlaya bilərsiniz.");
      setForm(emptyProduct); setShowForm(false); await load();
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError)); }
    finally { setBusy(false); }
  }

  async function changeProduct(productId: number, action: "publish" | "archive") {
    if (!session.accessToken) return;
    setBusy(true); setError(null);
    try {
      if (action === "publish") await publishProduct(session.accessToken, productId);
      else await archiveProduct(session.accessToken, productId);
      await load();
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError)); }
    finally { setBusy(false); }
  }

  if (!context && !error) return <PageLoader label="Satıcı paneli hazırlanır" />;
  if (context?.status !== "ACTIVE") return <main className="page-shell"><Notice tone="warning" title="Satıcı paneli bağlıdır" message="Panel yalnız admin tərəfindən aktiv edilmiş mağazalar üçün açılır." /></main>;

  return (
    <main className="seller-page" aria-labelledby="seller-title">
      <header className="seller-header"><div><p className="eyebrow">{context.shopName}</p><h1 id="seller-title">Satıcı paneli</h1><p>Məhsullarınızı və alıcılardan gələn sorğuları bir yerdən idarə edin.</p></div><Button icon={showForm ? <X /> : <Plus />} onClick={() => setShowForm((current) => !current)}>{showForm ? "Formu bağla" : "Yeni məhsul"}</Button></header>
      {message ? <Notice tone="success" message={message} /> : null}{error ? <Notice tone="danger" message={error} /> : null}
      <section className="seller-metrics"><article><Store /><span><small>Yayımlanan məhsul</small><strong>{products.filter((item) => item.status === "PUBLISHED").length}</strong></span></article><article><Boxes /><span><small>Bütün məhsullar</small><strong>{products.length}</strong></span></article><article><MessageCircle /><span><small>Açıq sorğu</small><strong>{inquiries.filter((item) => item.status === "OPEN").length}</strong></span></article></section>
      {showForm ? <form className="quick-product-form" onSubmit={submitProduct}><div className="quick-product-form__heading"><div><p className="eyebrow">Yeni elan</p><h2>Məhsul məlumatları</h2></div><span>İlk olaraq draft saxlanacaq</span></div><div className="form-grid"><TextField label="Məhsul adı" name="productName" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /><TextField label="Kateqoriya" name="productCategory" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required /><TextField label="Qiymət (AZN)" name="productPrice" type="number" min="0.01" step="0.01" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /><TextField label="Şəkil URL-i" name="productImage" type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} required /></div><label className="textarea-field" htmlFor="product-description"><span>Təsvir</span><textarea id="product-description" minLength={30} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></label><div className="form-grid"><TextField label="Vəziyyət" name="condition" value={form.conditionLabel} onChange={(event) => setForm({ ...form, conditionLabel: event.target.value })} /><TextField label="Mövcudluq qeydi" name="stockNote" value={form.stockNote} onChange={(event) => setForm({ ...form, stockNote: event.target.value })} /></div><Button type="submit" isLoading={busy} icon={<Plus />}>Draft yarat</Button></form> : null}
      <div className="seller-columns"><section className="seller-panel"><div className="seller-panel__heading"><div><p className="eyebrow">Kataloq</p><h2>Məhsullarım</h2></div><span>{products.length}</span></div>{products.length ? <div className="seller-product-list">{products.map((product) => <article key={product.id}><img src={product.imageUrl} alt="" loading="lazy" /><div><strong>{product.name}</strong><small>{product.price} {product.currency} · {product.status}</small></div><div>{product.status === "DRAFT" ? <Button variant="secondary" icon={<Send />} disabled={busy} onClick={() => void changeProduct(product.id, "publish")}>Yayımla</Button> : null}{product.status !== "ARCHIVED" ? <button className="icon-action" title="Arxivlə" onClick={() => void changeProduct(product.id, "archive")}><Archive /></button> : null}</div></article>)}</div> : <div className="empty-state"><h3>Hələ məhsul yoxdur</h3><p>İlk məhsulunuzu draft kimi yaradın.</p></div>}</section><section className="seller-panel"><div className="seller-panel__heading"><div><p className="eyebrow">Birbaşa əlaqə</p><h2>Müştəri sorğuları</h2></div><span>{inquiries.length}</span></div>{inquiries.length ? <div className="inquiry-list">{inquiries.map((inquiry) => <article key={inquiry.id}><span>{inquiry.status}</span><p>{inquiry.message}</p><small>{inquiry.preferredContact} · Məhsul #{inquiry.productId}</small></article>)}</div> : <div className="empty-state"><h3>Yeni sorğu yoxdur</h3><p>Alıcı mesajları burada görünəcək.</p></div>}<div className="payment-reminder">Bu bölmə ödəniş statusu saxlamır. Razılaşma tərəflər arasında aparılır.</div></section></div>
    </main>
  );
}
