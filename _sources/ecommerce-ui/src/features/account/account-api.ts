import { apiRequest } from "../../shared/api/api-client";
import type { UserProfileResponse } from "./account-types";

export function getCurrentUser(accessToken: string) {
  return apiRequest<UserProfileResponse>("/api/users/me", {
    token: accessToken
  });
}
