---
title: Node.js SDK — API Reference
sidebar_position: 3
---

Complete reference for all methods available on the Protekt Node.js SDK client.

## `protekt.auth`

### `signUp(params)`

Create a new user account.

```ts
protekt.auth.signUp({
  email: string;
  password: string;
  metadata?: Record<string, unknown>;
  sendVerification?: boolean;
}): Promise<{ user, accessToken, refreshToken, error }>
```

### `login(params)`

Authenticate a user with email and password.

```ts
protekt.auth.login({
  email: string;
  password: string;
}): Promise<{ user, accessToken, refreshToken, error }>
// error.code === 'mfa_required' → error.mfaToken is set
```

### `logout(accessToken)`

Revoke the user's current session.

```ts
protekt.auth.logout(accessToken: string): Promise<{ error }>
```

### `verifyToken(token)`

Validate an access token and return its decoded claims.

```ts
protekt.auth.verifyToken(token: string): Promise<{ user, error }>
```

### `refreshToken(refreshToken)`

Exchange a refresh token for a new access/refresh token pair.

```ts
protekt.auth.refreshToken(refreshToken: string): Promise<{ accessToken, refreshToken, error }>
```

### `revokeToken(token)`

Immediately invalidate a specific access or refresh token.

```ts
protekt.auth.revokeToken(token: string): Promise<{ error }>
```

### `getLoginUrl(params?)`

Generate the URL to redirect users to the Universal Login page.

```ts
protekt.auth.getLoginUrl(params?: {
  redirectUrl?: string;
}): string
```

### `getSocialLoginUrl(params)`

Generate a social login redirect URL.

```ts
protekt.auth.getSocialLoginUrl({
  provider: 'google' | 'github' | 'apple' | 'microsoft';
  redirectUrl?: string;
}): string
```

### `getSsoUrl(params)`

Generate an SSO redirect URL by connection name or user email domain.

```ts
protekt.auth.getSsoUrl({
  connection?: string;
  email?: string;
  redirectUrl?: string;
}): string
```

### `sendMagicLink(params)`

Send a magic link to a user's email.

```ts
protekt.auth.sendMagicLink({
  email: string;
  redirectUrl?: string;
}): Promise<{ error }>
```

### `verifyMagicLink(token)`

Verify a magic link token and issue a session.

```ts
protekt.auth.verifyMagicLink(token: string): Promise<{ user, accessToken, refreshToken, error }>
```

### `sendOtp(params)`

Send a one-time passcode via email or SMS.

```ts
protekt.auth.sendOtp({
  email?: string;
  phone?: string;
  channel?: 'email' | 'sms';
}): Promise<{ error }>
```

### `verifyOtp(params)`

Verify an OTP and issue a session.

```ts
protekt.auth.verifyOtp({
  email?: string;
  phone?: string;
  otp: string;
}): Promise<{ user, accessToken, refreshToken, error }>
```

### `requestPasswordReset(params)`

Trigger a password reset email.

```ts
protekt.auth.requestPasswordReset({ email: string }): Promise<{ error }>
```

### `confirmPasswordReset(params)`

Complete a password reset with the token from the email link.

```ts
protekt.auth.confirmPasswordReset({
  resetToken: string;
  newPassword: string;
}): Promise<{ error }>
```

### `changePassword(params, accessToken)`

Change an authenticated user's password.

```ts
protekt.auth.changePassword({
  currentPassword: string;
  newPassword: string;
}, accessToken: string): Promise<{ error }>
```

---

## `protekt.users`

### `list(params?)`

List all users in the project.

```ts
protekt.users.list(params?: {
  limit?: number;
  cursor?: string;
  search?: string;
}): Promise<{ users, nextCursor, hasMore, error }>
```

### `get(userId)`

Retrieve a user by ID.

```ts
protekt.users.get(userId: string): Promise<{ user, error }>
```

### `update(userId, params)`

Update a user's profile or metadata.

```ts
protekt.users.update(userId: string, {
  email?: string;
  metadata?: Record<string, unknown>;
  disabled?: boolean;
}): Promise<{ user, error }>
```

### `delete(userId)`

Permanently delete a user.

```ts
protekt.users.delete(userId: string): Promise<{ error }>
```

---

## `protekt.sessions`

### `list(accessToken)`

List all active sessions for the current user.

```ts
protekt.sessions.list(accessToken: string): Promise<{ sessions, error }>
```

### `revoke(sessionId, accessToken)`

Terminate a specific session.

```ts
protekt.sessions.revoke(sessionId: string, accessToken: string): Promise<{ error }>
```

### `revokeAll(accessToken, params?)`

Revoke all sessions for the current user.

```ts
protekt.sessions.revokeAll(accessToken: string, params?: {
  keepCurrent?: boolean;
}): Promise<{ revokedCount, error }>
```

---

## `protekt.mfa`

### `enroll(params, accessToken)`

Start MFA enrollment for the current user.

```ts
protekt.mfa.enroll({
  method: 'totp' | 'sms';
  phone?: string;
}, accessToken: string): Promise<{ totpUri, qrCode, error }>
```

### `verify(params, accessToken?)`

Verify an MFA code — used for enrollment confirmation and login challenges.

```ts
protekt.mfa.verify({
  code: string;
  mfaToken?: string; // required for login challenge
}, accessToken?: string): Promise<{ accessToken, refreshToken, error }>
```

### `unenroll(params, accessToken)`

Remove an MFA method from the current user's account.

```ts
protekt.mfa.unenroll({
  method: 'totp' | 'sms';
}, accessToken: string): Promise<{ error }>
```

### `generateBackupCodes(accessToken)`

Generate single-use backup codes for account recovery.

```ts
protekt.mfa.generateBackupCodes(accessToken: string): Promise<{ backupCodes: string[], error }>
```

---

## `protekt.projects`

Requires a Management Token. See [Account API Reference](../../api-reference/account).

### `getCurrent()`
### `list(params?)`
### `create(params)`
### `update(projectId, params)`
### `delete(projectId)`