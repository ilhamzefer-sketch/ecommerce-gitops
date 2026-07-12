# Ecommerce Auth Memory For Frontend

This file is the frontend-facing memory/spec for the auth service.

## Core role model

- Every newly registered account gets `ROLE_USER`.
- `ROLE_USER` is the default customer account.
- A `ROLE_USER` can browse, buy, and later become part of store/shop flows.
- `ROLE_OPERATOR`, `ROLE_MODERATOR`, and `ROLE_ADMIN` are never given during public registration.
- Extra system roles are assigned later by an admin.

## Current system roles

- `ROLE_USER`
  Default public account. Use this as the baseline role for all authenticated users.
- `ROLE_OPERATOR`
  Back-office operational access. Intended for order flow, queue handling, support dashboards, or listing operations.
- `ROLE_MODERATOR`
  Moderation access. Intended for listing review, report handling, safety/content workflows.
- `ROLE_ADMIN`
  Full admin access for role assignment and system management.

## Important backend behavior

- Registration endpoint always creates the user with `ROLE_USER`.
- Admin role updates automatically preserve `ROLE_USER`.
- Frontend should not ask the public user to choose admin/operator/moderator at signup.
- Frontend should treat shop/store capability separately from system roles.

## Auth endpoints frontend will use

### `POST /api/auth/register`

Creates a new user.

Request body:

```json
{
  "username": "demo-user",
  "email": "demo@example.com",
  "password": "StrongPassword123",
  "firstName": "Demo",
  "lastName": "User"
}
```

Behavior:

- Creates user with `ROLE_USER`
- Returns success message
- Does not return admin/operator selection

### `POST /api/auth/login`

Logs user in and returns:

- `accessToken`
- `accessTokenExpiresAt`
- `tokenType`
- `message`

Also sets refresh token in an HTTP-only cookie.

### `POST /api/auth/refresh`

Uses refresh cookie and returns a new access token response.

### `POST /api/auth/logout`

Logs out current session and clears refresh cookie.

### `GET /api/users/me`

This is the main frontend identity endpoint after login.

Example response:

```json
{
  "id": 12,
  "username": "demo-user",
  "email": "demo@example.com",
  "firstName": "Demo",
  "lastName": "User",
  "enabled": true,
  "emailVerified": false,
  "roles": ["ROLE_USER", "ROLE_OPERATOR"],
  "lastLoginAt": "2026-07-12T17:00:00",
  "createdAt": "2026-07-12T16:00:00",
  "updatedAt": "2026-07-12T17:00:00"
}
```

Frontend should use `roles` from this endpoint for route guards, menus, and dashboard switching.

## Admin endpoints for role assignment

These endpoints require `ROLE_ADMIN`.

### `GET /api/admin/users`

Returns all users with current system roles.

Use cases:

- admin user management screen
- role management table
- search/filter screen

### `GET /api/admin/users/{userId}`

Returns a single user record for details page or role edit modal.

### `PATCH /api/admin/users/{userId}/roles`

Updates system roles for a user.

Request body example:

```json
{
  "roles": ["ROLE_USER", "ROLE_OPERATOR"]
}
```

Notes:

- backend always preserves `ROLE_USER`
- valid elevated roles today:
  - `ROLE_OPERATOR`
  - `ROLE_MODERATOR`
  - `ROLE_ADMIN`
- if frontend sends unknown role, backend returns `400`

## Operator example endpoint

### `GET /api/operator/workspace`

Accessible by:

- `ROLE_OPERATOR`
- `ROLE_MODERATOR`
- `ROLE_ADMIN`

This is a sample protected back-office endpoint for frontend role-gated layouts and tests.

## Frontend routing suggestion

- public routes:
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/reset-password`
- authenticated user routes:
  - `/account`
  - `/orders`
  - `/favorites`
- operator routes:
  - `/operator`
- moderator routes:
  - `/moderation`
- admin routes:
  - `/admin`

## Frontend guard suggestion

After login:

1. store access token in frontend memory/state
2. call `GET /api/users/me`
3. keep returned profile in auth context/store
4. check role-based route access from `roles`

Example guard logic:

- if includes `ROLE_ADMIN` -> allow admin area
- if includes `ROLE_OPERATOR` or `ROLE_MODERATOR` or `ROLE_ADMIN` -> allow operator workspace
- otherwise show normal user UI

## Shop/store note for future frontend

System roles are not the same as seller/store membership.

Implemented direction:

- user account remains `ROLE_USER`
- shop/store is a separate business object
- multiple users can belong to one store
- one user can belong to multiple stores
- seller/store permissions come from shop membership, not from global system roles

So frontend should keep these concepts separate:

- `system roles`: admin/operator/moderator/user
- `shop memberships`: store-specific permissions

## Bootstrap admin for local/dev

Backend supports creating the first admin from environment variables:

- `BOOTSTRAP_ADMIN_ENABLED=true`
- `BOOTSTRAP_ADMIN_USERNAME=admin`
- `BOOTSTRAP_ADMIN_EMAIL=admin@example.com`
- `BOOTSTRAP_ADMIN_PASSWORD=ChangeMe123!`
- `BOOTSTRAP_ADMIN_FIRST_NAME=System`
- `BOOTSTRAP_ADMIN_LAST_NAME=Admin`

Use this only for local/dev/bootstrap scenarios.

## Shop membership model

Global roles and shop roles are different things.

### Global roles

- `ROLE_USER`
- `ROLE_OPERATOR`
- `ROLE_MODERATOR`
- `ROLE_ADMIN`

### Shop member roles

- `OWNER`
- `MANAGER`
- `LISTING_MANAGER`
- `STAFF`

Meaning:

- `OWNER` can manage the shop and members
- `MANAGER` can manage the shop team operationally
- `LISTING_MANAGER` is intended for product/listing workflows
- `STAFF` is a basic team member
- ownership transfer is a separate explicit action, not a normal role edit

## Shop endpoints

All shop endpoints require authentication.

### `POST /api/shops`

Creates a shop and automatically makes the current user `OWNER`.

Request example:

```json
{
  "name": "Mizan Store",
  "slug": "mizan-store",
  "description": "Flagship account for marketplace operations",
  "type": "BUSINESS"
}
```

### `GET /api/shops/mine`

Returns shops where the current user is an active member.

Useful for:

- seller dashboard switcher
- team workspace picker
- current account context selector

### `GET /api/shops/{shopId}`

Returns one shop with current user's membership role and current members.

Frontend should use:

- `currentUserRole`
- `members`
- `status`

to decide what actions to show.

### `GET /api/shops/{shopId}/members`

Returns only the member list.

### `POST /api/shops/{shopId}/members`

Adds or reactivates a shop member by username or email.

Request example:

```json
{
  "memberIdentifier": "teammate@example.com",
  "membershipRole": "MANAGER"
}
```

Only `OWNER` and `MANAGER` can manage members.
Only `OWNER` can assign `OWNER`.

### `PATCH /api/shops/{shopId}/members/{memberUserId}`

Updates the member role inside a shop.

Request example:

```json
{
  "membershipRole": "LISTING_MANAGER"
}
```

### `PATCH /api/shops/{shopId}/ownership-transfer`

Transfers ownership from the current owner to another active member.

Request example:

```json
{
  "newOwnerUserId": 42
}
```

Rules:

- only the current `OWNER` can do this
- target user must already be an active member of the same shop
- after success:
  - target becomes `OWNER`
  - previous owner becomes `MANAGER`

### `DELETE /api/shops/{shopId}/members/{memberUserId}`

Deactivates a member from the shop team.

Important rules:

- owner membership cannot be deactivated with this endpoint
- current user cannot remove themselves with this endpoint
- intended use: owner/manager removes another team member

### `DELETE /api/shops/{shopId}/members/me`

Current authenticated user leaves the shop.

Rules:

- non-owner members can leave directly
- owner cannot leave with this endpoint
- owner needs ownership transfer first

## Shop invite endpoints

### `POST /api/shops/{shopId}/invites`

Creates an invite for an email address.

Request example:

```json
{
  "invitedEmail": "teammate@example.com",
  "membershipRole": "MANAGER"
}
```

Response includes:

- invite `id`
- `token`
- `status`
- `expiresAt`

Current backend returns the invite token directly so frontend can use it in local/dev flows.

### `GET /api/shops/{shopId}/invites`

Returns invite history for that shop.

Useful for:

- pending invitations panel
- resend/cancel UX later
- invite status badges

Invite statuses today:

- `PENDING`
- `ACCEPTED`
- `CANCELLED`
- `EXPIRED`

### `POST /api/shops/invites/accept`

Accepts an invite for the currently logged-in user.

Request example:

```json
{
  "token": "invite-token-here"
}
```

Acceptance rules:

- current logged-in user's email must match invited email
- invite must still be `PENDING`
- invite must not be expired

On success, backend returns the joined shop payload.

### `PATCH /api/shops/{shopId}/invites/{inviteId}/cancel`

Cancels a pending invite.

Useful for:

- owner/manager revokes invite
- frontend removes stale pending invitation

### `PATCH /api/shops/{shopId}/invites/{inviteId}/resend`

Resends an invite by issuing a new token and new expiry time.

Useful for:

- expired invite refresh
- manager re-invites same email without creating new invite records

## Frontend UX suggestion for shops

After login:

1. call `GET /api/users/me`
2. call `GET /api/shops/mine`
3. if user has zero shops, show:
   - normal buyer UI
   - optional "Create shop" CTA
4. if user has one or more shops, allow switching current shop context
5. if user opens team settings, call members and invites endpoints for that shop
6. support two actions in team settings:
   - remove/deactivate member
   - cancel/resend invite
7. if current membership is `OWNER`, show ownership transfer action in team settings

Recommended frontend state:

- `auth.user`
- `auth.roles`
- `shops.items`
- `shops.currentShopId`
- `shops.currentMembershipRole`
- `shops.currentMembers`
- `shops.currentInvites`

## Important rule

Do not infer seller/admin/operator from one another.

Examples:

- a plain `ROLE_USER` can still own a shop
- an `OWNER` of a shop is not automatically `ROLE_ADMIN`
- `ROLE_ADMIN` is a system role
- `OWNER` is a shop-scoped business role
