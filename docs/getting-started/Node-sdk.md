---
title: Protekt Node.js SDK
sidebar_position: 5
---

The Protekt Node.js SDK gives you a clean, typed interface to the Protekt Authentication API. It works in any Node.js environment — Express, Fastify, NestJS, serverless functions, and more.

## Prerequisites

- Node.js 18 or later
- A Protekt project with a Login ID and API Key

## Installation

```bash
npm install @protekt/node
```

```bash
# or with yarn / pnpm
yarn add @protekt/node
pnpm add @protekt/node
```

## Configuration

Initialize the Protekt client once at the top of your application and reuse it across your codebase. Store credentials in environment variables — never hard-code them.

```bash
# .env
PROTEKT_LOGIN_ID=lp_7xqm9...
PROTEKT_API_KEY=pk_live_AbCdEfGh...
```

```js
// lib/protekt.js
import { Protekt } from '@protekt/node';

export const protekt = new Protekt({
  loginId: process.env.PROTEKT_LOGIN_ID,
  apiKey: process.env.PROTEKT_API_KEY,
});
```

### Configuration options

| Option | Type | Required | Description |
|---|---|---|---|
| `loginId` | `string` | Yes | Your project's Login ID from the dashboard |
| `apiKey` | `string` | Yes | Your project API key |
| `tokenExpiry` | `number` | No | Override JWT expiry in seconds. Defaults to project setting |
| `timeout` | `number` | No | Request timeout in milliseconds. Default: `5000` |

## Basic usage

### Verify a token

Use `verifyToken` in your middleware to authenticate incoming requests.

```js
import { protekt } from './lib/protekt.js';

// Express middleware
export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const { user, error } = await protekt.auth.verifyToken(token);

  if (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}
```

### Sign up a user

```js
const { user, accessToken, refreshToken, error } = await protekt.auth.signUp({
  email: 'user@example.com',
  password: 'supersecret123',
  metadata: { plan: 'free' }, // optional: any key-value data
});
```

### Log in a user

```js
const { user, accessToken, refreshToken, error } = await protekt.auth.login({
  email: 'user@example.com',
  password: 'supersecret123',
});

if (error?.code === 'mfa_required') {
  // Prompt user for their MFA code
  // Use error.mfaToken in the next step
}
```

### Refresh a token

```js
const { accessToken, refreshToken } = await protekt.auth.refreshToken(
  existingRefreshToken
);
```

### Log out a user

```js
await protekt.auth.logout(accessToken);
```

## Working with users

```js
// Get a user by ID
const { user } = await protekt.users.get('usr_9klabc');

// Update user metadata
const { user } = await protekt.users.update('usr_9klabc', {
  metadata: { plan: 'pro' },
});

// Delete a user
await protekt.users.delete('usr_9klabc');
```

## Session management

```js
// List a user's active sessions (pass their access token)
const { sessions } = await protekt.sessions.list(accessToken);

// Revoke a specific session
await protekt.sessions.revoke(sessionId, accessToken);

// Sign out everywhere
await protekt.sessions.revokeAll(accessToken, { keepCurrent: true });
```

## TypeScript support

The SDK ships with full TypeScript definitions. All methods return typed responses.

```ts
import { Protekt, ProtektUser, AuthTokenResponse } from '@protekt/node';

const protekt = new Protekt({ loginId: '...', apiKey: '...' });

const response: AuthTokenResponse = await protekt.auth.login({
  email: 'user@example.com',
  password: 'secret',
});

const user: ProtektUser = response.user;
```

## Error handling

All SDK methods return an `error` field rather than throwing, making it easy to handle failures inline. For unexpected failures, the SDK will throw a `ProtektError`.

```js
const { user, error } = await protekt.auth.login({ email, password });

if (error) {
  switch (error.code) {
    case 'invalid_credentials':
      // Wrong email or password
      break;
    case 'mfa_required':
      // Redirect to MFA step
      break;
    case 'rate_limited':
      // Too many attempts
      break;
    default:
      console.error('Unexpected error:', error.message);
  }
}
```

See the full [Error Handling guide](./error-handling) for all error codes and retry strategies.

## Examples

- [Express.js Integration](./examples/express-integration) — middleware, protected routes, session cookies
- [NestJS Module](./examples/nestjs-module) — guard, decorator, and module setup
