import { apiRequest } from "../../shared/api/api-client";
import type { Inquiry, Product, ProductUpsert } from "./product-types";

export function getCatalog() {
  return apiRequest<Product[]>("/api/products", { retryOn401: false });
}

export function getProduct(slug: string) {
  return apiRequest<Product>(`/api/products/${encodeURIComponent(slug)}`, { retryOn401: false });
}

export function getShopProducts(token: string, shopId: number) {
  return apiRequest<Product[]>(`/api/products/seller/list?shopId=${shopId}`, { token });
}

export function createProduct(token: string, product: ProductUpsert) {
  return apiRequest<Product>("/api/products", { method: "POST", token, body: product });
}

export function publishProduct(token: string, productId: number) {
  return apiRequest<Product>(`/api/products/${productId}/publish`, { method: "POST", token });
}

export function archiveProduct(token: string, productId: number) {
  return apiRequest<Product>(`/api/products/${productId}/archive`, { method: "POST", token });
}

export function createInquiry(token: string, productId: number, message: string, preferredContact: string) {
  return apiRequest<Inquiry>("/api/inquiries", {
    method: "POST",
    token,
    body: { productId, message, preferredContact }
  });
}

export function getShopInquiries(token: string, shopId: number) {
  return apiRequest<Inquiry[]>(`/api/inquiries/shop/${shopId}`, { token });
}
