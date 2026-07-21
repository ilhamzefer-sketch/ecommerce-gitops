import { ArrowLeft, MessageCircle, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Button } from "../../shared/ui/Button";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { useAuth } from "../auth/use-auth";
import { createInquiry, getProduct } from "./product-api";
import type { Product } from "./product-types";

export function ProductDetailPage() {
  const { slug = "" } = useParams();
  const { session } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("PHONE");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProduct(slug).then(setProduct).catch((requestError) => setError(getFriendlyErrorMessage(requestError)));
  }, [slug]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!session.accessToken || !product || message.trim().length < 10) return;
    setSubmitting(true);
    setError(null);
    try {
      await createInquiry(session.accessToken, product.id, message.trim(), contact);
      setFeedback("Sorğunuz satıcıya göndərildi. Razılaşma və ödəniş platformadan kənarda aparılır.");
      setMessage("");
    } catch (requestError) {
      setError(getFriendlyErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  if (!product && !error) return <PageLoader label="Məhsul açılır" />;
  if (!product) return <main className="page-shell"><Notice tone="danger" message={error ?? "Məhsul tapılmadı."} /></main>;

  return (
    <main className="product-detail">
      <Link className="back-link" to="/marketplace"><ArrowLeft aria-hidden="true" /> Kataloqa qayıt</Link>
      <div className="product-detail__grid">
        <div className="product-detail__image"><img src={product.imageUrl} alt={product.name} /></div>
        <section className="product-detail__content">
          <p className="eyebrow">{product.category} · {product.conditionLabel}</p>
          <h1>{product.name}</h1>
          <strong className="product-detail__price">{Number(product.price).toFixed(2)} {product.currency}</strong>
          <p className="product-detail__description">{product.description}</p>
          <dl className="product-meta">
            <div><dt>Mövcudluq</dt><dd>{product.stockNote ?? "Satıcıdan dəqiqləşdirin"}</dd></div>
            <div><dt>Çatdırılma</dt><dd>{product.deliveryNote ?? "Satıcı ilə razılaşdırılır"}</dd></div>
          </dl>
          <div className="payment-note"><ShieldCheck aria-hidden="true" /><p><strong>Mizan ödəniş qəbul etmir.</strong> Ödəniş üsulunu və çatdırılmanı satıcı ilə birbaşa razılaşdırın.</p></div>
          {feedback ? <Notice tone="success" message={feedback} /> : null}
          {error ? <Notice tone="danger" message={error} /> : null}
          <form className="inquiry-form" onSubmit={submit}>
            <label htmlFor="inquiry-message">Satıcıya mesajınız</label>
            <textarea id="inquiry-message" value={message} onChange={(event) => setMessage(event.target.value)} minLength={10} required placeholder="Məhsul, mövcudluq və çatdırılma haqqında sualınızı yazın…" />
            <label htmlFor="contact-channel">Üstün tutduğunuz əlaqə</label>
            <select id="contact-channel" value={contact} onChange={(event) => setContact(event.target.value)}>
              <option value="PHONE">Telefon</option><option value="EMAIL">E-poçt</option><option value="WHATSAPP">WhatsApp</option>
            </select>
            <Button type="submit" icon={<MessageCircle aria-hidden="true" />} isLoading={submitting}>Sorğu göndər</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
