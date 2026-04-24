---
title: Authentication Flow
sidebar_position: 3
---

This guide walks through what actually happens when a user logs in with Protekt, from the initial redirect to the JWT landing in your application.

## Overview

Protekt uses a **redirect-based flow** built on top of JWTs. Rather than building your own login UI from scratch, your application redirects users to Protekt's hosted Universal Login page, which handles credential collection, validation, and session creation. Once authenticated, users are sent back to your app with a signed token.

```text
User clicks "Sign In"
        ↓
App redirects → Protekt Universal Login
        ↓
User enters credentials
        ↓
Protekt validates & creates session
        ↓
Protekt redirects → Your app (with JWT)
        ↓
Your app verifies JWT & grants access
```

## Step-by-Step Breakdown

### 1. Initiating Login

When a user clicks your login button, your application redirects them to the Protekt Universal Login page. The redirect URL includes your `login_id` so Protekt knows which project is making the request.

```
https://login.protekt.io/authorize?login_id=lp_7xqm9...&redirect_url=https://myapp.com/auth/callback
```

With the SDK, this redirect is handled for you:

```js
// React
const { login } = useAuth();
<button onClick={login}>Sign In</button>

// Node.js — generate the redirect URL manually
const loginUrl = protekt.auth.getLoginUrl({ redirectUrl: 'https://myapp.com/auth/callback' });
res.redirect(loginUrl);
```

### 2. Universal Login Page

The user lands on Protekt's hosted login page, scoped to your project's branding and configuration. Protekt handles:

- Rendering the login form (email/password, magic link, SSO buttons — based on your project settings)
- Validating credentials against the encrypted identity store
- Rate limiting and brute-force protection
- MFA challenges, if enabled

Your application is not involved in this step. No credentials ever touch your server.

### 3. Token Issuance

After a successful login, Protekt creates a session and issues two tokens:

- **Access Token** — A short-lived JWT (default: 1 hour) used to authenticate API requests
- **Refresh Token** — A long-lived token (default: 30 days) used to obtain new access tokens silently

The access token is a standard JWT and contains the following claims:

```json
{
  "sub": "usr_9klabc",
  "email": "user@example.com",
  "project_id": "proj_01jk8abc",
  "iat": 1710844800,
  "exp": 1710848400
}
```

### 4. The Redirect Callback

Protekt redirects the user back to your configured `redirect_url` with the access token as a query parameter:

```
https://myapp.com/auth/callback?token=eyJhbGci...
```

Your application handles this route, verifies the token, and establishes a session:

```js
// Express callback handler
app.get('/auth/callback', async (req, res) => {
  const { token } = req.query;
  const { user, error } = await protekt.auth.verifyToken(token);

  if (error) return res.redirect('/login?error=invalid_token');

  // Store the token (for example, in an httpOnly cookie)
  res.cookie('access_token', token, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

### 5. Authenticated Requests

For every subsequent request to your backend, the client sends the access token in the `Authorization` header. Your server verifies it with Protekt before granting access:

```js
// Middleware
const { user } = await protekt.auth.verifyToken(req.headers.authorization?.split(' ')[1]);
```

### 6. Token Refresh

When the access token expires, your app uses the refresh token to silently obtain a new one — no login prompt required. The React SDK handles this automatically. In Node.js, you manage it manually:

```js
const { accessToken, refreshToken } = await protekt.auth.refreshToken(storedRefreshToken);
// Store the new tokens and continue
```

If the refresh token is also expired, the user must log in again.

## Token Storage

How you store tokens depends on your architecture:

| Storage | Pros | Cons |
|---|---|---|
| `httpOnly` cookie | XSS-safe, automatic on requests | Requires CSRF protection |
| Memory (React state) | No persistence risk | Lost on page refresh |
| `localStorage` | Persists across tabs | Vulnerable to XSS |

Protekt recommends `httpOnly` cookies for server-rendered applications and in-memory storage for SPAs.

## Logout Flow

Logging out revokes the session on Protekt's side and clears local tokens:

```js
// Revoke the token server-side
await protekt.auth.logout(accessToken);

// Clear the local cookie
res.clearCookie('access_token');
res.redirect('/');
```

## Next Steps

- [Implement Password Login](../guides/implement-password-login)
- [Implement MFA](../guides/implement-mfa)
- [JWT Tokens](../concepts/jwt-tokens)
- [Session Management](../concepts/session-management)