export type BackendAuthority = string | { authority?: string };

export type UserProfileResponse = {
  username?: string;
  roles?: BackendAuthority[];
  message?: string;
};

export function normalizeRoles(roles?: BackendAuthority[]) {
  if (!Array.isArray(roles)) {
    return [];
  }

  return roles
    .map((role) => (typeof role === "string" ? role : role.authority))
    .filter((role): role is string => Boolean(role));
}
