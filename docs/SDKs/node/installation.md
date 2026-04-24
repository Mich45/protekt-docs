---
title: Installation
sidebar_position: 2
---

After [installing the SDK](./installation), create a `Protekt` client instance and configure it with your project credentials and any options relevant to your application.

## Basic Setup

```js
import { Protekt } from '@protekt/node';

const protekt = new Protekt({
  loginId: process.env.PROTEKT_LOGIN_ID,
  apiKey: process.env.PROTEKT_API_KEY,
});
```

Create the client **once** — at module load time — and export it for use throughout your application. Avoid creating a new instance per request.

```js
// lib/protekt.js — create once, import everywhere
import { Protekt } from '@protekt/node';

if (!process.env.PROTEKT_LOGIN_ID || !process.env.PROTEKT_API_KEY) {
  throw new Error('Missing Protekt environment variables');
}

export const protekt = new Protekt({
  loginId: process.env.PROTEKT_LOGIN_ID,
  apiKey: process.env.PROTEKT_API_KEY,
});
```

## Configuration Options

```js
const protekt = new Protekt({
  // Required
  loginId: 'lp_7xqm9...',
  apiKey: 'pk_live_AbCdEfGh...',

  // Optional
  tokenExpiry: 3600,          // JWT expiry override in seconds (default: project setting)
  timeout: 5000,              // HTTP request timeout in ms (default: 5000)
  baseUrl: 'https://auth.protekt.io/v1', // Override API base URL (rarely needed)
  debug: false,               // Log SDK activity to console (default: false)
});
```

### Option Reference

| Option | Type | Default | Description |
|---|---|---|---|
| `loginId` | `string` | — | **Required.** Your project's Login ID |
| `apiKey` | `string` | — | **Required.** Your project API key |
| `tokenExpiry` | `number` | Project setting | Override JWT expiry in seconds for this client |
| `timeout` | `number` | `5000` | HTTP request timeout in milliseconds |
| `baseUrl` | `string` | `https://auth.protekt.io/v1` | Override the API base URL |
| `debug` | `boolean` | `false` | Enable verbose logging to `console.debug` |

## TypeScript Configuration

The SDK is fully typed. Pass a generic to `Protekt` to type your user metadata:

```ts
import { Protekt } from '@protekt/node';

interface UserMetadata {
  plan: 'free' | 'pro' | 'enterprise';
  organizationId?: string;
}

const protekt = new Protekt<UserMetadata>({
  loginId: process.env.PROTEKT_LOGIN_ID!,
  apiKey: process.env.PROTEKT_API_KEY!,
});

// user.metadata is now typed as UserMetadata
const { user } = await protekt.auth.verifyToken(token);
console.log(user.metadata.plan); // 'free' | 'pro' | 'enterprise'
```

## Multiple Projects

If your application manages multiple Protekt projects (e.g. separate projects per tenant), create a separate client instance per project:

```js
// lib/protekt.js
import { Protekt } from '@protekt/node';

export function getProtektClient(loginId, apiKey) {
  return new Protekt({ loginId, apiKey });
}

// Usage
const tenantClient = getProtektClient(tenant.loginId, tenant.apiKey);
const { user } = await tenantClient.auth.verifyToken(token);
```

## Testing and CI

For unit tests, use the `PROTEKT_API_KEY` for your test project and stub outbound calls with `msw` or `nock`. Alternatively, the SDK exposes a `Protekt.mock()` factory:

```js
// In tests
import { Protekt } from '@protekt/node';

const protekt = Protekt.mock({
  verifyToken: async () => ({
    user: { id: 'usr_test', email: 'test@example.com' },
    error: null,
  }),
});
```

## Next Steps

- [API Reference](./api-reference) — all available methods and their signatures
- [Error Handling](./error-handling) — error types and retry strategies
- [Express Integration](./examples/express-integration) — a complete Express app using the SDK