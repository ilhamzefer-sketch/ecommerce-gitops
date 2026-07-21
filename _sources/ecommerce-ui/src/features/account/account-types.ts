export type BackendAuthority = string | { authority?: string };

export type UserProfileResponse = {
  id?: number;
  username?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  roles?: BackendAuthority[];
};

export function normalizeRoles(roles?: BackendAuthority[]) {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => (typeof role === "string" ? role : role.authority))
    .filter((role): role is string => Boolean(role));
}
