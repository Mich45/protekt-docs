# Authentication Basics

Understanding the fundamentals of authentication in Protekt.

## Core Concepts

### What is Authentication?

Authentication is the process of verifying who a user is. Protekt handles this securely so you don't have to manage passwords, sessions, or tokens manually.

### Key Terms

| Term | Definition |
|------|------------|
| **User** | A person or service identity in your system |
| **Session** | A temporary authenticated state for a user |
| **Token** | A cryptographic proof of authentication (JWT) |
| **Claim** | A piece of information about the user in a token |
| **Provider** | An identity source (Google, GitHub, email/password, etc.) |

## How Protekt Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────────┐  │
│  │  Client  │    │  Server  │    │    Protekt SDK       │  │
│  │  (React) │    │  (Node)  │    │                      │  │
│  └────┬─────┘    └────┬─────┘    └──────────┬───────────┘  │
│       │               │                      │              │
│       │ 1. Login      │                      │              │
│       │──────────────▶│                      │              │
│       │               │ 2. Authenticate      │              │
│       │               │─────────────────────▶│              │
│       │               │                      │ 3. Verify    │
│       │               │                      │ with API     │
│       │               │                      │───────────┐  │
│       │               │                      │           │  │
│       │               │ 4. Session Data      │           │  │
│       │               │◀─────────────────────│           │  │
│       │               │                      │           │  │
│       │ 5. Token      │                      │           │  │
│       │◀──────────────│                      │           │  │
│       │               │                      │           │  │
│       │ 6. API Calls  │                      │           │  │
│       │ (with token)  │                      │           │  │
│       │──────────────▶│                      │           │  │
│       │               │ 7. Validate Token    │           │  │
│       │               │─────────────────────────────────▶│  │
│       │               │ 8. User Info         │           │  │
│       │               │◀─────────────────────────────────│  │
│       │               │                      │           │  │
│       │ 9. Response   │                      │           │  │
│       │◀──────────────│                      │           │  │
│       │               │                      │           │  │
│       └──────────────────────────────────────────────────┘  │
│                        Protekt Cloud                         │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Methods

Protekt supports multiple authentication methods:

### 1. Password-Based
Traditional email + password authentication.

```javascript
await protekt.authenticate({
  type: 'password',
  email: 'user@example.com',
  password: 'secure-password',
});
```

### 2. Passwordless
Magic links or OTP codes via email/SMS.

```javascript
// Send magic link
await protekt.sendMagicLink({ email: 'user@example.com' });

// Verify OTP
await protekt.verifyOTP({ email: 'user@example.com', code: '123456' });
```

### 3. Social Login
OAuth with Google, GitHub, Apple, Microsoft.

```javascript
await protekt.authenticate({
  type: 'oauth',
  provider: 'google',
  redirectUri: 'https://yourapp.com/callback',
});
```

### 4. SSO (Enterprise)
SAML 2.0 or OIDC for enterprise customers.

```javascript
await protekt.authenticate({
  type: 'sso',
  provider: 'okta',
  organizationId: 'org_123',
});
```

### 5. Multi-Factor (MFA)
Additional security layer with TOTP, SMS, or WebAuthn.

```javascript
await protekt.verifyMFA({
  sessionId: 'sess_abc123',
  type: 'totp',
  code: '654321',
});
```

## Session vs Token

| Aspect | Session | Token |
|--------|---------|-------|
| **Storage** | Server-side (Protekt) | Client-side (browser/app) |
| **Lifetime** | Hours to days | Minutes (short-lived) |
| **Refresh** | Automatic via refresh token | Requires new session |
| **Revocation** | Immediate | Must wait for expiration |

## Security Best Practices

1. **Never store tokens in localStorage** - Use httpOnly cookies or secure storage
2. **Always use HTTPS** - Tokens must be encrypted in transit
3. **Implement token refresh** - Don't rely on long-lived tokens
4. **Validate on every request** - Never trust client-side validation
5. **Use short expiration times** - 15-60 minutes for access tokens

## Related

- [JWT Tokens](./jwt-tokens.md)
- [Session Management](./session-management.md)
- [Authentication Flow](../getting-started/authentication-flow.md)
