---
title: Authentication flow
sidebar_position: 3
---

This guide walks through what actually happens when a user logs in with Protekt, from the initial redirect to the JWT landing in your app.

## Overview

Protekt uses a **redirect-based flow** built on JWTs. Instead of building your own login UI, your app redirects users to Protekt's hosted Universal Login page, which takes care of credential collection, validation, and session creation. Once authenticated, users land back in your app with a signed token in hand.

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

## Step-by-step breakdown

### 1. Initiating login

When a user clicks your login button, your app redirects them to the Protekt Universal Login page. The URL includes your `login_id` so Protekt knows which project is asking.

```bash
https://login.protekt.io/authorize?login_id=lp_7xqm9...&redirect_url=https://myapp.com/auth/callback
```

If you're using the SDK, you don't have to build this URL yourself:

```js
// React
const { login } = useAuth();
<button onClick={login}>Sign In</button>

// Node.js — generate the redirect URL manually
const loginUrl = protekt.auth.getLoginUrl({ redirectUrl: 'https://myapp.com/auth/callback' });
res.redirect(loginUrl);
```

### 2. Universal login page

The user lands on Protekt's hosted login page, styled to match your project's branding and configured to show only the auth methods you've enabled. From here, Protekt handles everything — rendering the login form, validating credentials, rate limiting, brute-force protection, and MFA challenges if you've turned those on.

Your app sits this one out entirely. No credentials ever touch your server.

### 3. Token issuance

After a successful login, Protekt creates a session and issues two tokens:

- **Access Token**: A short-lived JWT (default: 1 hour) used to authenticate API requests
- **Refresh Token**: A longer-lived token (default: 30 days) used to get new access tokens without making the user log in again

The access token is a standard JWT. Here's what's inside:

```json
{
  "sub": "usr_9klabc",
  "email": "user@example.com",
  "project_id": "proj_01jk8abc",
  "iat": 1710844800,
  "exp": 1710848400
}
```

### 4. The redirect callback

Protekt sends the user back to your configured `redirect_url` with the access token as a query parameter:

```bash
https://myapp.com/auth/callback?token=eyJhbGci...
```

Your app handles this route, verifies the token, and sets up a session:

```js
app.get('/auth/callback', async (req, res) => {
  const { token } = req.query;
  const { user, error } = await protekt.auth.verifyToken(token);

  if (error) return res.redirect('/login?error=invalid_token');

  res.cookie('access_token', token, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

### 5. Authenticated requests

For every request to your backend after login, the client sends the access token in the `Authorization` header. Your server checks it with Protekt before letting the request through:

```js
const { user } = await protekt.auth.verifyToken(req.headers.authorization?.split(' ')[1]);
```

### 6. Token refresh

When the access token expires, your app uses the refresh token to get a new one silently — no login prompt, no friction for the user. The React SDK handles this for you automatically. In Node.js, you do it yourself:

```js
const { accessToken, refreshToken } = await protekt.auth.refreshToken(storedRefreshToken);
// Store the new tokens and continue
```

If the refresh token has also expired, the user needs to log in again.

## Token storage

Where you store tokens depends on your setup. Here's the tradeoff at a glance:

| Storage | Pros | Cons |
|---|---|---|
| `httpOnly` cookie | XSS-safe, sent automatically with requests | Requires CSRF protection |
| Memory (React state) | No persistence risk | Lost on page refresh |
| `localStorage` | Persists across tabs | Vulnerable to XSS |

As a rule of thumb: `httpOnly` cookies for server-rendered apps, in-memory for SPAs.

## Logout flow

Logging out has two parts: revoking the session on Protekt's side and clearing the token locally.

```js
await protekt.auth.logout(accessToken);

res.clearCookie('access_token');
res.redirect('/');
```

Both matter. Skipping the server-side revocation means the token stays valid until it expires on its own.

## Next steps

- [Implement Password Login](../guides/implement-password-login)
- [Implement MFA](../guides/implement-mfa)
- [JWT Tokens](../concepts/jwt-tokens)
- [Session Management](../concepts/session-management)