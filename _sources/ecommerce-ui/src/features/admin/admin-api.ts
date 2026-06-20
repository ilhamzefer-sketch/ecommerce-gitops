import { apiRequest } from "../../shared/api/api-client";
import type { AdminDashboardResponse } from "./admin-types";

export function getAdminDashboard(accessToken: string) {
  return apiRequest<AdminDashboardResponse>("/api/admin/dashboard", {
    token: accessToken
  });
}
