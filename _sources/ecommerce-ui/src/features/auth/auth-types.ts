export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type LoginRequest = {
  usernameOrEmail: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type AuthResponse = {
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshTokenExpiresAt?: string;
  tokenType?: string;
  message?: string;
};
