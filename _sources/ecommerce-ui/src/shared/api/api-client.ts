import { refreshSessionFromBridge, signalSessionExpired } from "../auth/session-bridge";
import { ApiError, type ApiErrorDetails } from "./api-error";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  credentials?: RequestCredentials;
  retryOn401?: boolean;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");
let refreshPromise: Promise<{ accessToken?: string | null } | null> | null = null;

function normalizeErrorMessage(status: number, payload: unknown) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
    if (typeof record.error === "string" && record.error.trim()) {
      return record.error;
    }
  }

  if (status === 400) {
    return "Məlumatları yoxlayın və yenidən cəhd edin.";
  }
  if (status === 401) {
    return "Sessiyanız bitib. Zəhmət olmasa yenidən daxil olun.";
  }
  if (status === 403) {
    return "Bu səhifəyə giriş icazəniz yoxdur.";
  }
  if (status >= 500) {
    return "Server xətası baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.";
  }

  return "Əməliyyatı tamamlamaq mümkün olmadı.";
}

function normalizeDetails(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const details = (payload as Record<string, unknown>).details;
  if (!details || typeof details !== "object") {
    return undefined;
  }

  return Object.entries(details as Record<string, unknown>).reduce<ApiErrorDetails>((result, [key, value]) => {
    if (typeof value === "string") {
      result[key] = value;
    }
    return result;
  }, {});
}

async function parseResponse(response: Response) {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || undefined;
}

async function attemptSessionRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshSessionFromBridge().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const buildHeaders = (token?: string | null) => {
    const headers = new Headers();

    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  };

  const shouldRetryOn401 = options.retryOn401 ?? Boolean(options.token);

  const executeRequest = (token?: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      headers: buildHeaders(token),
      credentials: options.credentials ?? "same-origin",
      body: options.body === undefined ? undefined : JSON.stringify(options.body)
    });

  let response: Response;

  try {
    response = await executeRequest(options.token);
  } catch {
    throw new ApiError(
      "Serverlə əlaqə qurmaq mümkün olmadı. Zəhmət olmasa bir az sonra yenidən cəhd edin.",
      0,
      undefined,
      true
    );
  }

  if (response.status === 401 && shouldRetryOn401) {
    try {
      const refreshedSession = await attemptSessionRefresh();
      const refreshedToken = refreshedSession?.accessToken;

      if (refreshedToken) {
        response = await executeRequest(refreshedToken);
      }
    } catch {
      signalSessionExpired();
    }

    if (response.status === 401) {
      signalSessionExpired();
    }
  }

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(normalizeErrorMessage(response.status, payload), response.status, normalizeDetails(payload));
  }

  return payload as T;
}
