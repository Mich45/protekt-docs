# Session Management

How sessions work in Protekt, including refresh tokens and expiration.

## What is a Session?

A session represents an authenticated state for a user. When a user logs in, Protekt creates a session that tracks their authentication status.

## Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                     Session Lifecycle                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │   LOGIN     │                                                │
│  │  User signs │                                                │
│  │  in         │                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   CREATED   │                                                │
│  │  Session    │◄────────────────────────┐                      │
│  │  generated  │                         │                      │
│  └──────┬──────┘                         │                      │
│         │                                │                      │
│         ▼                                │                      │
│  ┌─────────────┐     ┌─────────────┐     │                      │
│  │   ACTIVE    │────▶│  REFRESHED  │─────┘                      │
│  │  User makes │     │  Token      │                            │
│  │  requests   │     │  renewed    │                            │
│  └──────┬──────┘     └─────────────┘                            │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   EXPIRED   │                                                │
│  │  Session    │                                                │
│  │  times out  │                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │   LOGOUT    │                                                │
│  │  Session    │                                                │
│  │  revoked    │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Session Components

| Component | Description | Lifetime |
|-----------|-------------|----------|
| **Access Token** | Short-lived JWT for API requests | 15-60 min |
| **Refresh Token** | Long-lived token for getting new access tokens | 7-30 days |
| **Session ID** | Server-side session identifier | Until logout/expiry |

## Creating Sessions

### Via SDK

```javascript
import { Protekt } from '@protekt/sdk';

const protekt = new Protekt({ apiKey: 'your-api-key' });

// Create session via password login
const session = await protekt.authenticate({
  type: 'password',
  email: 'user@example.com',
  password: 'secret123',
});

console.log(session);
// {
//   sessionId: 'sess_abc123',
//   sessionToken: 'eyJhbGc...',
//   refreshToken: 'ref_xyz789',
//   expiresAt: 1640000000,
//   user: { ... }
// }
```

### Session Response

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

## Validating Sessions

```javascript
// Validate a session token
const isValid = await protekt.validateSession(sessionToken);

if (isValid.valid) {
  console.log('User:', isValid.user);
  console.log('Session expires:', isValid.expiresAt);
} else {
  console.log('Invalid session:', isValid.error);
}
```

## Refreshing Sessions

When an access token expires, use the refresh token to get a new one:

```javascript
// Refresh before expiration
const newSession = await protekt.refreshSession(refreshToken);

// Or let SDK handle it automatically
const protekt = new Protekt({
  apiKey: 'your-api-key',
  autoRefresh: true, // Automatically refresh tokens
});
```

### Refresh Token Flow

```
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
     │                                      │
```

## Revoking Sessions

### Revoke Current Session

```javascript
await protekt.revokeSession(sessionToken);
```

### Revoke All Sessions (Logout Everywhere)

```javascript
await protekt.revokeAllSessions(userId);
```

### Revoke Specific Session

```javascript
await protekt.revokeSessionById(sessionId);
```

## Session Configuration

### Token Expiration

Configure token lifetimes in your Protekt dashboard:

| Setting | Default | Recommended |
|---------|---------|-------------|
| Access Token | 1 hour | 15-60 min |
| Refresh Token | 7 days | 7-30 days |
| Session Idle Timeout | 24 hours | 1-7 days |
| Absolute Session Timeout | 30 days | 7-30 days |

### Sliding Sessions

Enable sliding expiration to keep active users logged in:

```javascript
const protekt = new Protekt({
  apiKey: 'your-api-key',
  slidingExpiration: true, // Reset timeout on each request
});
```

## Session Storage

### Recommended: httpOnly Cookies

```javascript
// Server-side (Express example)
app.post('/login', async (req, res) => {
  const session = await protekt.authenticate({ ... });
  
  res.cookie('session_token', session.sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: session.expiresIn * 1000,
  });
  
  res.json({ user: session.user });
});
```

### Alternative: Authorization Header

```javascript
// Client-side
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${sessionToken}`,
  },
});
```

### ❌ Avoid: localStorage

```javascript
// Don't do this - vulnerable to XSS
localStorage.setItem('token', sessionToken);
```

## Session Events

Listen for session changes:

```javascript
import { useSession } from '@protekt/react';

function App() {
  const { session, onEvent } = useSession();
  
  onEvent('session:refresh', (newSession) => {
    console.log('Session refreshed');
  });
  
  onEvent('session:expire', () => {
    console.log('Session about to expire');
  });
  
  onEvent('session:revoke', () => {
    console.log('Session revoked - redirect to login');
  });
}
```

## Security Best Practices

1. **Use short-lived access tokens** - 15-60 minutes max
2. **Implement refresh rotation** - Issue new refresh tokens on each refresh
3. **Detect token reuse** - Flag if a refresh token is used twice
4. **Bind sessions to devices** - Track device fingerprints
5. **Implement idle timeout** - Log out inactive users
6. **Monitor suspicious activity** - Multiple locations, unusual patterns

## Related

- [Authentication Basics](./authentication-basics.md)
- [JWT Tokens](./jwt-tokens.md)
- [Implement MFA](../guides/implement-mfa.md)
