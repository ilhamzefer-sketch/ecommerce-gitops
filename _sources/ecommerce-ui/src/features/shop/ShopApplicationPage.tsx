import { ArrowLeft, Building2, Send, Store } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Button } from "../../shared/ui/Button";
import { Notice } from "../../shared/ui/Notice";
import { TextField } from "../../shared/ui/TextField";
import { useAuth } from "../auth/use-auth";
import { createShop, getSellerContext, getShop, submitShop, updateShop } from "./shop-api";
import type { ShopApplication } from "./shop-types";

const emptyApplication: ShopApplication = {
  name: "", type: "INDIVIDUAL", description: "", contactPhone: "", contactEmail: "",
  address: "", city: "", category: "", companyName: "", taxId: "", termsAccepted: false
};

export function ShopApplicationPage() {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [shopId, setShopId] = useState<number | null>(null);
  const [form, setForm] = useState<ShopApplication>(emptyApplication);
  const [reason, setReason] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!session.accessToken) return;
    getSellerContext(session.accessToken).then(async (context) => {
      if (!context.shopId) {
        setForm((current) => ({ ...current, contactPhone: user?.phoneNumber ?? "", contactEmail: user?.email ?? "" }));
        return;
      }
      setShopId(context.shopId);
      setReason(context.reason ?? null);
      const shop = await getShop(session.accessToken as string, context.shopId);
      setForm({
        name: shop.name, type: shop.type, description: shop.description, contactPhone: shop.contactPhone,
        contactEmail: shop.contactEmail, address: shop.address, city: shop.city, category: shop.category,
        companyName: shop.companyName ?? "", taxId: shop.taxId ?? "", termsAccepted: true
      });
    }).catch((requestError) => setError(getFriendlyErrorMessage(requestError)));
  }, [session.accessToken, user?.email, user?.phoneNumber]);

  function setField<K extends keyof ShopApplication>(key: K, value: ShopApplication[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!session.accessToken) return;
    setSubmitting(true);
    setError(null);
    try {
      const saved = shopId
        ? await updateShop(session.accessToken, shopId, form)
        : await createShop(session.accessToken, form);
      await submitShop(session.accessToken, saved.id);
      navigate("/seller/status", { replace: true });
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="application-page" aria-labelledby="application-title">
      <Link className="back-link" to="/choose-workspace"><ArrowLeft aria-hidden="true" /> İş sahələrinə qayıt</Link>
      <header className="application-header">
        <div><p className="eyebrow">Satıcı müraciəti</p><h1 id="application-title">Mağazanızı düzgün təqdim edin.</h1><p>Müraciət admin tərəfindən yoxlandıqdan sonra məhsul yerləşdirmək mümkün olacaq.</p></div>
        <span aria-hidden="true"><Store /></span>
      </header>
      {reason ? <Notice tone="warning" title="Admin qeydi" message={reason} /> : null}
      {error ? <Notice tone="danger" message={error} /> : null}
      <form className="application-form" onSubmit={submit}>
        <section className="form-section">
          <div className="form-section__heading"><span>01</span><div><h2>Mağaza kimliyi</h2><p>Alıcıların mağazanızı tanıyacağı əsas məlumatlar.</p></div></div>
          <TextField label="Mağaza adı" name="shopName" value={form.name} onChange={(event) => setField("name", event.target.value)} required />
          <fieldset className="shop-type-fieldset"><legend>Hüquqi tip</legend>
            <label className={form.type === "INDIVIDUAL" ? "selected" : ""}><input type="radio" name="type" value="INDIVIDUAL" checked={form.type === "INDIVIDUAL"} onChange={() => setField("type", "INDIVIDUAL")} /><Store /><span><strong>Fərdi satıcı</strong><small>Öz adınızdan satış üçün</small></span></label>
            <label className={form.type === "BUSINESS" ? "selected" : ""}><input type="radio" name="type" value="BUSINESS" checked={form.type === "BUSINESS"} onChange={() => setField("type", "BUSINESS")} /><Building2 /><span><strong>Biznes</strong><small>Şirkət və ya VÖEN ilə</small></span></label>
          </fieldset>
          <label className="textarea-field" htmlFor="shop-description"><span>Mağaza haqqında</span><textarea id="shop-description" value={form.description} onChange={(event) => setField("description", event.target.value)} minLength={40} maxLength={1200} required placeholder="Nə satırsınız, məhsullarınızın fərqi nədir?" /></label>
          <TextField label="Əsas kateqoriya" name="category" value={form.category} onChange={(event) => setField("category", event.target.value)} required placeholder="Məsələn, Ev və yaşam" />
        </section>
        <section className="form-section">
          <div className="form-section__heading"><span>02</span><div><h2>Əlaqə və ünvan</h2><p>Alıcıların sizinlə danışa biləcəyi real məlumatlar.</p></div></div>
          <div className="form-grid"><TextField label="Əlaqə telefonu" name="contactPhone" type="tel" value={form.contactPhone} onChange={(event) => setField("contactPhone", event.target.value)} required /><TextField label="Əlaqə e-poçtu" name="contactEmail" type="email" value={form.contactEmail} onChange={(event) => setField("contactEmail", event.target.value)} required /><TextField label="Şəhər" name="city" value={form.city} onChange={(event) => setField("city", event.target.value)} required /><TextField label="Ünvan" name="address" value={form.address} onChange={(event) => setField("address", event.target.value)} required /></div>
        </section>
        {form.type === "BUSINESS" ? <section className="form-section"><div className="form-section__heading"><span>03</span><div><h2>Biznes məlumatları</h2><p>Şirkət tipli müraciət üçün məcburidir.</p></div></div><div className="form-grid"><TextField label="Şirkət adı" name="companyName" value={form.companyName} onChange={(event) => setField("companyName", event.target.value)} required /><TextField label="VÖEN" name="taxId" value={form.taxId} onChange={(event) => setField("taxId", event.target.value)} required /></div></section> : null}
        <label className="terms-check"><input type="checkbox" checked={form.termsAccepted} onChange={(event) => setField("termsAccepted", event.target.checked)} required /><span>Mağaza məlumatlarının düzgün olduğunu və Mizan-ın ödəniş tərəfi olmadığını təsdiqləyirəm.</span></label>
        <div className="form-submit"><p>Müraciətdən sonra status <strong>yoxlanılır</strong> olacaq.</p><Button type="submit" isLoading={submitting} icon={<Send aria-hidden="true" />}>Admin baxışına göndər</Button></div>
      </form>
    </main>
  );
}
