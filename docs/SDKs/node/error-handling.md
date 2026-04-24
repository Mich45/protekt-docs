---
title: Error Handling
sidebar_position: 4
---

The Protekt Node.js SDK uses a consistent error pattern across all methods: every call returns an `error` field rather than throwing, so you can handle failures inline without try/catch on every line.

## The Error Object

When an operation fails, the `error` field contains a structured object:

```ts
interface ProtektError {
  code: string;       // Machine-readable error code (e.g. 'invalid_credentials')
  message: string;    // Human-readable description
  status: number;     // HTTP status code (e.g. 401, 429)
  details?: object;   // Additional context, if available
}
```

When an operation succeeds, `error` is `null`.

```js
const { user, accessToken, error } = await protekt.auth.login({ email, password });

if (error) {
  console.error(error.code);    // 'invalid_credentials'
  console.error(error.message); // 'The email or password is incorrect.'
  console.error(error.status);  // 401
}
```

## Common Error Codes

### Authentication Errors

| Code | Status | Description |
|---|---|---|
| `invalid_credentials` | 401 | Wrong email or password |
| `email_not_verified` | 403 | User must verify their email first |
| `account_disabled` | 403 | The account has been deactivated |
| `mfa_required` | 200 | MFA is enabled; complete the challenge |
| `invalid_mfa_code` | 400 | Wrong or expired MFA code |
| `invalid_otp` | 400 | Wrong or expired OTP code |
| `magic_link_expired` | 400 | Magic link has expired or already been used |
| `token_expired` | 401 | The access token has expired |
| `token_invalid` | 401 | The token is malformed or has been tampered with |
| `token_revoked` | 401 | The token has been explicitly revoked |
| `refresh_token_expired` | 401 | Refresh token is expired; user must log in again |

### User Errors

| Code | Status | Description |
|---|---|---|
| `email_taken` | 409 | An account with this email already exists |
| `user_not_found` | 404 | No user exists with the given ID |
| `weak_password` | 400 | Password does not meet minimum requirements |
| `invalid_email` | 400 | Email address is malformed |

### Rate Limiting

| Code | Status | Description |
|---|---|---|
| `rate_limited` | 429 | Too many requests; see retry guidance below |

### Server Errors

| Code | Status | Description |
|---|---|---|
| `server_error` | 500 | Unexpected error on Protekt's side |
| `service_unavailable` | 503 | Protekt is temporarily unavailable |

## Handling Errors by Code

```js
const { user, error } = await protekt.auth.login({ email, password });

if (error) {
  switch (error.code) {
    case 'invalid_credentials':
      return res.status(401).json({ message: 'Incorrect email or password.' });

    case 'mfa_required':
      req.session.mfaToken = error.mfaToken;
      return res.redirect('/login/mfa');

    case 'account_disabled':
      return res.status(403).json({ message: 'Your account has been deactivated. Contact support.' });

    case 'rate_limited':
      return res.status(429).json({ message: 'Too many attempts. Please wait and try again.' });

    default:
      console.error('Unexpected Protekt error:', error);
      return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}
```

## Rate Limiting and Retries

When you receive a `rate_limited` error, the SDK includes the number of seconds to wait in `error.details.retryAfter`. Implement exponential backoff for server-to-server calls:

```js
async function loginWithRetry(email, password, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const { user, accessToken, error } = await protekt.auth.login({ email, password });

    if (!error) return { user, accessToken };

    if (error.code === 'rate_limited') {
      const wait = (error.details?.retryAfter ?? Math.pow(2, attempt)) * 1000;
      await new Promise((resolve) => setTimeout(resolve, wait));
      continue;
    }

    // Non-retriable error
    return { error };
  }

  return { error: { code: 'max_retries_exceeded', message: 'Max retries reached.' } };
}
```

## Unexpected Throws

SDK methods do not throw for expected API errors — they return them in the `error` field. However, the SDK may throw a `ProtektError` for truly unexpected failures, such as network timeouts or JSON parse errors. Wrap critical paths in try/catch:

```js
import { ProtektError } from '@protekt/node';

try {
  const { user, error } = await protekt.auth.verifyToken(token);
  if (error) { /* handle normally */ }
} catch (err) {
  if (err instanceof ProtektError) {
    // SDK-level failure (network error, timeout, etc.)
    console.error('SDK error:', err.message);
  } else {
    throw err; // Re-throw unexpected errors
  }
}
```

## Debug Logging

Enable debug mode during development to log all SDK requests and responses to the console:

```js
const protekt = new Protekt({
  loginId: process.env.PROTEKT_LOGIN_ID,
  apiKey: process.env.PROTEKT_API_KEY,
  debug: true,
});

// Logs: [Protekt] POST /auth/login → 401 invalid_credentials (42ms)
```

Disable `debug` in production — it logs sensitive request data.

## Next Steps

- [API Reference](./api-reference) — all methods and return types
- [Error Codes Reference](../../troubleshooting/error-codes) — complete list of all error codes across the platform
- [Common Issues](../../troubleshooting/common-issues) — solutions to frequently encountered problems