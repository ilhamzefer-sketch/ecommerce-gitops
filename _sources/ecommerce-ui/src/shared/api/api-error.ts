export type ApiErrorDetails = Record<string, string>;
const defaultFallback = "Əməliyyatı tamamlamaq mümkün olmadı.";

export class ApiError extends Error {
  readonly status: number;
  readonly details?: ApiErrorDetails;
  readonly isNetworkError: boolean;

  constructor(message: string, status = 0, details?: ApiErrorDetails, isNetworkError = false) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

export function getFriendlyErrorMessage(error: unknown, fallback = defaultFallback) {
  if (error instanceof ApiError) {
    if (error.isNetworkError) {
      return "Serverlə əlaqə qurmaq mümkün olmadı. Zəhmət olmasa bir az sonra yenidən cəhd edin.";
    }
    if (error.status === 400) {
      if (error.message.toLowerCase().includes("input validation failed")) {
        return fallback;
      }
      return error.message || fallback;
    }
    if (error.status === 401) {
      return fallback === defaultFallback ? "Sessiyanız bitib. Zəhmət olmasa yenidən daxil olun." : fallback;
    }
    if (error.status === 403) {
      return fallback === defaultFallback ? "Bu səhifəyə giriş icazəniz yoxdur." : fallback;
    }
    if (error.status === 409) {
      const lowered = error.message.toLowerCase();
      if (lowered.includes("username is already taken")) {
        return "Bu istifadəçi adı artıq istifadə olunur.";
      }
      if (lowered.includes("email is already registered")) {
        return "Bu e-poçt artıq qeydiyyatdan keçib.";
      }
    }
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
