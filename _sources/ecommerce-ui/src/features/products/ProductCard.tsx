import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "./product-types";

export function ProductCard({ product, demo = false }: { product: Product; demo?: boolean }) {
  const content = (
    <>
      <div className="product-card__media">
        <img src={product.imageUrl} alt={product.name} loading="lazy" width="560" height="560" />
        <span>{demo ? "Dizayn nümunəsi" : product.conditionLabel}</span>
      </div>
      <div className="product-card__body">
        <p>{product.category}</p>
        <h2>{product.name}</h2>
        <div className="product-card__footer">
          <strong>{Number(product.price).toFixed(2)} {product.currency}</strong>
          <span>{demo ? "Nümunə" : <ArrowUpRight aria-hidden="true" />}</span>
        </div>
      </div>
    </>
  );

  return demo
    ? <article className="product-card product-card--demo">{content}</article>
    : <Link className="product-card" to={`/products/${product.slug}`}>{content}</Link>;
}
