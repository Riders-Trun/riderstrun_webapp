# 02 — Authentication

## Overview

RidersTurn uses **JWT-based authentication** with access tokens (short-lived, stored in
memory) and refresh tokens (stored in HTTP-only cookies).

---

## Screens

### AuthScreen (`/auth`)

A single screen that toggles between **Login** and **Signup** mode.

**Login mode:**
- Email + Password fields
- Show/Hide password toggle
- On submit → `authApi.login(email, password)` → POST `/api/auth/login`
- On success → access token saved in memory, user object stored in AuthContext, redirect to `/`
- On error → toast notification with error message

**Signup mode:**
- Same Email + Password fields
- Password minimum length: 8 characters (enforced client-side before API call)
- On submit → `authApi.signup(email, password)` → POST `/api/auth/signup`
- On success → same as login (token + user stored, redirect to `/`)

---

## AuthContext

Provided globally via `<AuthProvider>`. Exposes:

| Property/Method | Type | Description |
|---|---|---|
| `user` | `{ id, email, role }` or `null` | Current logged-in user |
| `isLoading` | boolean | True while restoring session on app load |
| `isAuthenticated` | boolean | `true` if user is non-null |
| `isAdmin` | boolean | `true` if `user.role === "admin"` |
| `login(email, password)` | async fn | Calls login API, sets token + user |
| `signup(email, password)` | async fn | Calls signup API, sets token + user |
| `logout()` | async fn | Calls POST `/api/auth/logout`, clears token + user |

---

## Session Restore on Page Load

On app mount, `AuthProvider` calls `authApi.refresh()` (POST `/api/auth/refresh`).
If a valid refresh-token cookie exists, the server returns a new access token.
The JWT payload is decoded client-side (base64) to extract `sub` (user id), `email`,
and `role`. This is safe because the server still validates the signature on every API call.

---

## Token Storage Strategy

| Token | Where Stored | Why |
|---|---|---|
| Access Token | JavaScript memory variable (`accessToken`) | Not vulnerable to XSS via localStorage |
| Refresh Token | HTTP-only cookie (set by server) | Not accessible to JavaScript |

---

## Forgot / Reset Password

API methods exist in `authApi`:
- `forgotPassword(email)` → POST `/api/auth/forgot-password`
- `resetPassword(token, newPassword)` → POST `/api/auth/reset-password`

**Note:** The UI for these flows is not yet implemented in the frontend screens.
The backend endpoints are ready.

---

## Admin Access Gate

The `/admin` route uses `<AdminRoute>`:
1. If not authenticated → redirect to `/auth`
2. If authenticated but `isAdmin === false` → redirect to `/`
3. If `isAdmin === true` → render AdminScreen
