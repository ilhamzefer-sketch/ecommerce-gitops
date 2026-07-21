import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getFriendlyErrorMessage } from "../../shared/api/api-error";
import { Notice } from "../../shared/ui/Notice";
import { PageLoader } from "../../shared/ui/PageLoader";
import { demoProducts } from "./demo-products";
import { getCatalog } from "./product-api";
import { ProductCard } from "./ProductCard";
import type { Product } from "./product-types";

export function MarketplacePage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCatalog().then(setProducts).catch((requestError) => {
      setProducts([]);
      setError(getFriendlyErrorMessage(requestError));
    });
  }, []);

  const visible = useMemo(() => {
    const source = products?.length ? products : demoProducts;
    const term = query.trim().toLocaleLowerCase("az");
    return term ? source.filter((item) => `${item.name} ${item.category}`.toLocaleLowerCase("az").includes(term)) : source;
  }, [products, query]);

  if (products === null) return <PageLoader label="Kataloq hazırlanır" />;
  const isDemo = products.length === 0;

  return (
    <main className="catalog-page" aria-labelledby="catalog-title">
      <section className="catalog-hero">
        <div>
          <p className="eyebrow">Yerli satıcılar, birbaşa ünsiyyət</p>
          <h1 id="catalog-title">Dəyəri olan məhsulları kəşf edin.</h1>
          <p>Seçin, satıcıya sorğu göndərin, ödəniş və çatdırılmanı öz aranızda razılaşdırın.</p>
        </div>
        <dl className="catalog-hero__facts">
          <div><dt>Əlaqə</dt><dd>Birbaşa satıcı ilə</dd></div>
          <div><dt>Ödəniş</dt><dd>Tərəflər arasında</dd></div>
        </dl>
      </section>
      <div className="catalog-toolbar">
        <label className="catalog-search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">Məhsul axtar</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Məhsul və ya kateqoriya axtar" />
        </label>
        <button type="button" className="filter-button" disabled title="Kateqoriya filtrləri növbəti mərhələdə aktivləşəcək">
          <SlidersHorizontal aria-hidden="true" /> Filtrlər
        </button>
      </div>
      {error ? <Notice tone="warning" title="Canlı kataloqa qoşulmaq mümkün olmadı" message={error} /> : null}
      {isDemo ? <Notice tone="info" title="Nümunə kataloq" message="Hələ yayımlanmış canlı məhsul yoxdur. Aşağıdakı vizuallar interfeys nümunəsidir və real elan deyil." /> : null}
      <section className="product-grid" aria-label="Məhsullar">
        {visible.map((product) => <ProductCard key={product.id} product={product} demo={isDemo} />)}
      </section>
      {visible.length === 0 ? <div className="empty-state"><h2>Nəticə tapılmadı</h2><p>Axtarış sözünü dəyişib yenidən yoxlayın.</p></div> : null}
    </main>
  );
}
