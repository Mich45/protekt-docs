---
title: Session Management
sidebar_position: 3
---

Session management in **Protekt** is designed to balance security, performance, and developer experience. It provides a structured way to maintain authenticated user state across requests while minimizing risk through short-lived tokens and controlled renewal mechanisms.

This guide explains how sessions work in Protekt, including how access tokens and refresh tokens interact, how sessions evolve over time, and how you can configure and secure them in production environments.

## What is a session?

A session represents a continuous authenticated interaction between a user and your application. When a user successfully logs in, Protekt creates a session that acts as the source of truth for their authentication state.

Behind the scenes, a session is not just a single token. It is a combination of credentials (**access token**, **refresh token**, and **session metadata**) that work together to ensure secure and seamless access. This layered approach allows Protekt to enforce expiration, detect anomalies, and support advanced features like session revocation and multi-device tracking.

## Session lifecycle

The lifecycle of a session defines how authentication evolves from login to logout or expiration. Understanding this flow is critical for implementing reliable authentication logic and handling edge cases like token expiration gracefully.

```text
┌─────────────────────────────────────────────────────────────────┐
│                     Session Lifecycle                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │   LOGIN     │                                                │
│  │  User signs │                                                │
│  │  in         │                                                │
└──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   CREATED   │                                                │
│  │  Session    │◄────────────────────────┐                      │
│  │  generated  │                         │                      │
└──────┬──────┘                         │                      │
│         │                                │                      │
│         ▼                                │                      │
│  ┌─────────────┐     ┌─────────────┐     │                      │
│  │   ACTIVE    │────▶│  REFRESHED  │─────┘                      │
│  │  User makes │     │  Token      │                            │
│  │  requests   │     │  renewed    │                            │
└──────┬──────┘     └─────────────┘                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   EXPIRED   │                                                │
│  │  Session    │                                                │
│  │  times out  │                                                │
└──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   LOGOUT    │                                                │
│  │  Session    │                                                │
│  │  revoked    │                                                │
└─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Session components

Each session in Protekt is composed of multiple parts, each with a distinct responsibility. This separation ensures that even if one component is compromised, the overall system remains resilient.

The access token is used for authentication on every request, while the refresh token is reserved for renewing access without requiring the user to log in again. The session ID ties everything together on the server side, enabling tracking, revocation, and auditing.

| Component     | Description                          | Lifetime            |
| ------------- | ------------------------------------ | ------------------- |
| Access Token  | Short-lived JWT for API requests     | 15–60 min           |
| Refresh Token | Long-lived token for renewing access | 7–30 days           |
| Session ID    | Server-side session identifier       | Until logout/expiry |

## Creating sessions

Creating a session is typically the first step after user authentication. Protekt abstracts this process so you can focus on your application logic instead of token handling.

When a user logs in, Protekt validates their credentials and returns a structured session object. This object includes everything needed to authenticate future requests and manage session state over time.

**Via SDK**

```javascript
import { Protekt } from '@protekt/sdk';

const protekt = new Protekt({ apiKey: 'your-api-key' });

// Create session via password login
const session = await protekt.authenticate({
  type: 'password',
  email: 'user@example.com',
  password: 'secret123',
});
```

## Session response

The response includes both authentication credentials and user metadata. This allows you to immediately personalize the user experience while securely storing tokens.

```json
{
  "sessionId": "sess_abc123",
  "sessionToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "ref_xyz789",
  "expiresAt": 1640000000,
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Validating sessions

Session validation ensures that incoming requests are authenticated and authorized. This is typically done by verifying the access token and checking its expiration.

Protekt provides a simple validation method that returns both the validity status and associated user information. This makes it easy to protect routes and enforce access control without manually decoding tokens.

```javascript
const isValid = await protekt.validateSession(sessionToken);
```

In production systems, validation should happen on every protected request. You can also layer additional checks, such as IP matching or device verification, for higher security environments.

## Refreshing sessions

Access tokens are intentionally short-lived to reduce risk. When they expire, the refresh token is used to obtain a new access token without requiring the user to log in again.

Protekt supports both manual and automatic refresh flows. In most cases, enabling automatic refresh simplifies your implementation and improves user experience by handling token renewal transparently.

```javascript
const newSession = await protekt.refreshSession(refreshToken);
```

## Refresh token flow

The refresh process is designed to be secure and predictable. Protekt validates the refresh token before issuing new credentials, and can optionally rotate refresh tokens to prevent reuse attacks.

```text
┌──────────┐                           ┌──────────┐
│  Client  │                           │ Protekt  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │ Access Token Expired                 │
     │─────────────────────────────────────▶│
     │                                      │
     │ Send Refresh Token                   │
     │─────────────────────────────────────▶│
     │                                      │
     │ Validate Refresh Token               │
     │                                      │
     │ Issue New Access Token               │
     │◀─────────────────────────────────────│
     │ (Optionally: New Refresh Token)      │
     │                                      │
     │ Session Extended                     │
```

## Revoking sessions

Session revocation allows you to immediately invalidate a session before its natural expiration. This is critical for logout functionality and responding to security events.

Protekt supports multiple revocation strategies, including revoking the current session, all sessions for a user, or a specific session by ID. This flexibility is especially useful for multi-device applications.

```javascript
await protekt.revokeSession(sessionToken);
```

Revocation is enforced server-side, meaning even valid tokens become unusable once revoked. This ensures strong control over active sessions at all times.

## Session configuration

Protekt allows you to configure session behavior to match your application's security and usability requirements. Choosing the right values depends on your risk tolerance and user expectations.

Shorter token lifetimes improve security but may require more frequent refresh operations. Longer lifetimes reduce friction but increase exposure if tokens are compromised. Striking the right balance is key.

Setting	Default	Recommended
Access Token	1 hour	15–60 min
Refresh Token	7 days	7–30 days
Session Idle Timeout	24 hours	1–7 days
Absolute Session Timeout	30 days	7–30 days

## Sliding sessions

Sliding expiration extends a session's lifetime as long as the user remains active. This is ideal for applications where continuous usage should not result in unexpected logouts.

```javascript
const protekt = new Protekt({
  apiKey: 'your-api-key',
  slidingExpiration: true,
});
```

## Session storage

How you store session tokens directly impacts your application's security. Protekt recommends using httpOnly cookies for most web applications.

httpOnly cookies prevent JavaScript access, making them resistant to XSS attacks. Combined with secure and sameSite flags, they provide a strong default for session storage.

### Recommended: httpOnly cookies

```javascript
res.cookie('session_token', session.sessionToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
});
```

### Alternative: authorization header

For APIs and mobile apps, using the Authorization header is often more appropriate. This approach gives you explicit control over token handling.

```javascript
headers: {
  Authorization: `Bearer ${sessionToken}`,
}
```

> Info
>
> Storing tokens in localStorage exposes them to XSS attacks. Even a small vulnerability can lead to token theft, so this approach is strongly discouraged.

## Session events

Protekt provides event hooks that allow your application to react to session changes in real time. This is particularly useful for updating UI state or triggering security workflows.

By listening to events like refresh, expiration, and revocation, you can create a more responsive and secure user experience without constantly polling session state.

```javascript
onEvent('session:expire', () => {
  console.log('Session about to expire');
});
```

These events are especially valuable in frontend frameworks, where session state directly affects rendering and navigation.

## Security best practices

Effective session management goes beyond implementation—it requires deliberate security decisions. Protekt provides the tools, but it's up to you to apply them correctly.

Start with short-lived access tokens and implement refresh token rotation to reduce exposure. Add safeguards like token reuse detection and device binding to detect suspicious activity early.

Equally important is monitoring. Track login patterns, geographic anomalies, and unusual refresh behavior to identify potential threats. Combined, these practices create a robust defense against common session-based attacks.

