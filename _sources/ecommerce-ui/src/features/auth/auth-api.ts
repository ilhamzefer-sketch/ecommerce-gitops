import { apiRequest } from "../../shared/api/api-client";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest
} from "./auth-types";

export function getAuthStatus() {
  return apiRequest<string>("/api/auth/status", {
    credentials: "include",
    retryOn401: false
  });
}

export function register(request: RegisterRequest) {
  return apiRequest<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: request,
    credentials: "include",
    retryOn401: false
  });
}

export function login(request: LoginRequest) {
  return apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: request,
    credentials: "include",
    retryOn401: false
  });
}

export function refreshSession() {
  return apiRequest<AuthResponse>("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    retryOn401: false
  });
}

export function logout() {
  return apiRequest<void>("/api/auth/logout", {
    method: "POST",
    credentials: "include",
    retryOn401: false
  });
}

export function logoutAll() {
  return apiRequest<void>("/api/auth/logout-all", {
    method: "POST",
    credentials: "include",
    retryOn401: false
  });
}

export function forgotPassword(request: ForgotPasswordRequest) {
  return apiRequest<AuthResponse>("/api/auth/forgot-password", {
    method: "POST",
    body: request,
    credentials: "include",
    retryOn401: false
  });
}

export function resetPassword(request: ResetPasswordRequest) {
  return apiRequest<AuthResponse>("/api/auth/reset-password", {
    method: "POST",
    body: request,
    credentials: "include",
    retryOn401: false
  });
}

export function verifyEmail(token: string) {
  return apiRequest<AuthResponse>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: "POST",
    credentials: "include",
    retryOn401: false
  });
}
