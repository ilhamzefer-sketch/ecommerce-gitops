import { createContext } from "react";
import type { UserProfileResponse } from "../account/account-types";
import type { LoginRequest } from "./auth-types";

export type AuthStatus = "booting" | "anonymous" | "authenticated";

export type AuthSession = {
  accessToken: string | null;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  tokenType?: string;
  message?: string;
};

export type LogoutMode = "current" | "all";

export type AuthContextValue = {
  status: AuthStatus;
  sessionExpired: boolean;
  session: AuthSession;
  user: UserProfileResponse | null;
  roles: string[];
  login: (request: LoginRequest) => Promise<UserProfileResponse>;
  refresh: () => Promise<AuthSession>;
  reloadUser: () => Promise<UserProfileResponse>;
  clearSession: () => void;
  logout: (mode?: LogoutMode) => Promise<string | undefined>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
