import { apiRequest } from "../../shared/api/api-client";
import type { SellerContext, Shop, ShopApplication, ShopDecision, ShopStatus } from "./shop-types";

export function getSellerContext(token: string) {
  return apiRequest<SellerContext>("/api/shops/me/context", { token });
}

export function createShop(token: string, application: ShopApplication) {
  return apiRequest<Shop>("/api/shops", { method: "POST", token, body: application });
}

export function updateShop(token: string, shopId: number, application: ShopApplication) {
  return apiRequest<Shop>(`/api/shops/${shopId}/application`, { method: "PUT", token, body: application });
}

export function submitShop(token: string, shopId: number) {
  return apiRequest<Shop>(`/api/shops/${shopId}/submit`, { method: "POST", token });
}

export function getShop(token: string, shopId: number) {
  return apiRequest<Shop>(`/api/shops/${shopId}`, { token });
}

export function listShopsForAdmin(token: string, status?: ShopStatus) {
  const query = status ? `?status=${status}` : "";
  return apiRequest<Shop[]>(`/api/admin/shops${query}`, { token });
}

export function decideShop(token: string, shopId: number, decision: ShopDecision, reason?: string) {
  return apiRequest<Shop>(`/api/admin/shops/${shopId}/decision`, {
    method: "POST",
    token,
    body: { decision, reason }
  });
}
