import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser } from "../account/account-api";
import { normalizeRoles, type UserProfileResponse } from "../account/account-types";
import * as authApi from "./auth-api";
import type { AuthResponse, LoginRequest } from "./auth-types";
import { AuthContext, type AuthContextValue, type AuthSession, type AuthStatus, type LogoutMode } from "./auth-context-value";
import { registerSessionBridge } from "../../shared/auth/session-bridge";

const emptySession: AuthSession = {
  accessToken: null
};

let bootstrapRefreshPromise: ReturnType<typeof authApi.refreshSession> | null = null;

function bootstrapSession() {
  if (!bootstrapRefreshPromise) {
    bootstrapRefreshPromise = authApi.refreshSession().finally(() => {
      bootstrapRefreshPromise = null;
    });
  }

  return bootstrapRefreshPromise;
}

function sessionFromResponse(response: AuthResponse): AuthSession {
  return {
    accessToken: response.accessToken ?? null,
    accessTokenExpiresAt: response.accessTokenExpiresAt,
    refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    tokenType: response.tokenType,
    message: response.message
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("booting");
  const [session, setSession] = useState<AuthSession>(emptySession);
  const [user, setUser] = useState<UserProfileResponse | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const clearSession = useCallback(() => {
    setSession(emptySession);
    setUser(null);
    setStatus("anonymous");
    setSessionExpired(false);
  }, []);

  const markSessionExpired = useCallback(() => {
    setSession(emptySession);
    setUser(null);
    setStatus("anonymous");
    setSessionExpired(true);
  }, []);

  const loadUser = useCallback(async (accessToken: string) => {
    const profile = await getCurrentUser(accessToken);
    setUser(profile);
    return profile;
  }, []);

  const applyAuthResponse = useCallback(
    async (response: AuthResponse) => {
      const nextSession = sessionFromResponse(response);

      if (!nextSession.accessToken) {
        clearSession();
        throw new Error("Access token is missing from the backend response.");
      }

      setSession(nextSession);
      const profile = await loadUser(nextSession.accessToken);
      setStatus("authenticated");
      setSessionExpired(false);
      return { session: nextSession, user: profile };
    },
    [clearSession, loadUser]
  );

  const refresh = useCallback(async () => {
    const response = await authApi.refreshSession();
    const result = await applyAuthResponse(response);
    return result.session;
  }, [applyAuthResponse]);

  const login = useCallback(
    async (request: LoginRequest) => {
      const response = await authApi.login(request);
      const result = await applyAuthResponse(response);
      return result.user;
    },
    [applyAuthResponse]
  );

  const reloadUser = useCallback(async () => {
    if (!session.accessToken) {
      clearSession();
      throw new Error("Session is not available.");
    }

    const profile = await loadUser(session.accessToken);
    setSessionExpired(false);
    return profile;
  }, [clearSession, loadUser, session.accessToken]);

  const logout = useCallback(
    async (mode: LogoutMode = "current") => {
      let warning: string | undefined;

      try {
        if (mode === "all") {
          await authApi.logoutAll();
        } else {
          await authApi.logout();
        }
      } catch {
        warning =
          "Backend çıxış sorğusunu təsdiqləmədi. Bu brauzerdə sessiya təhlükəsiz şəkildə təmizləndi.";
      } finally {
        clearSession();
      }

      return warning;
    },
    [clearSession]
  );

  useEffect(() => {
    let isMounted = true;

    registerSessionBridge({
      refreshSession: refresh,
      onSessionExpired: markSessionExpired
    });

    bootstrapSession()
      .then(async (response) => {
        if (!isMounted) {
          return;
        }
        await applyAuthResponse(response);
      })
      .catch(() => {
        if (isMounted) {
          clearSession();
        }
      });

    return () => {
      isMounted = false;
      registerSessionBridge(null);
    };
  }, [applyAuthResponse, clearSession, markSessionExpired, refresh]);

  const roles = useMemo(() => normalizeRoles(user?.roles), [user?.roles]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      sessionExpired,
      session,
      user,
      roles,
      login,
      refresh,
      reloadUser,
      clearSession,
      logout
    }),
    [clearSession, login, logout, refresh, reloadUser, roles, session, sessionExpired, status, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
