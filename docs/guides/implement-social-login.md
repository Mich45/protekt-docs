---
title: Implement social login
sidebar_position: 6
---

_Social login_ lets users authenticate using an existing account from a provider like Google, GitHub, Apple, or Microsoft — no password required on your end. Protekt handles the OAuth handshake and returns a standard JWT regardless of which provider the user chose.

## Supported providers

| Provider | Protocol | Notes |
|---|---|---|
| Google | OAuth 2.0 / OIDC | Supports Gmail and Google Workspace accounts |
| GitHub | OAuth 2.0 | Personal and organization accounts |
| Apple | OAuth 2.0 / OIDC | Requires Apple Developer Program membership |
| Microsoft | OAuth 2.0 / OIDC | Supports personal and Azure AD accounts |

## Setup

### 1. Create OAuth credentials

Before configuring Protekt, create OAuth credentials with your chosen provider.

#### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `https://auth.protekt.io/v1/auth/sso/callback` as an authorized redirect URI

#### GitHub

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Set the callback URL to `https://auth.protekt.io/v1/auth/sso/callback`

#### Apple

1. Go to [Apple Developer](https://developer.apple.com) → Certificates, Identifiers & Profiles
2. Create a Services ID and enable Sign in with Apple
3. Add `https://auth.protekt.io/v1/auth/sso/callback` as a return URL

#### Microsoft

1. Go to [Azure Portal](https://portal.azure.com) → App registrations → New registration
2. Set the redirect URI to `https://auth.protekt.io/v1/auth/sso/callback`

### 2. Configure the provider in Protekt

In your Protekt Dashboard, go to **Project Settings → Social Providers** and enter the Client ID and Client Secret for each provider you want to enable.

Alternatively, use the Account API:

```js
await protekt.projects.updateProvider('proj_01jk8abc', {
  provider: 'google',
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});
```

## Implementation

Social login uses the same redirect-based flow as SSO. Your application links to Protekt's authorize endpoint with a `provider` parameter.

### Adding social login buttons

#### Node.js: generate the redirect URL

```js
// Express route — redirect to Google login
app.get('/auth/google', (req, res) => {
  const url = protekt.auth.getSocialLoginUrl({
    provider: 'google',
    redirectUrl: 'https://myapp.com/auth/callback',
  });
  res.redirect(url);
});
```

This redirects the user to:

```bash
https://auth.protekt.io/v1/auth/sso/authorize?provider=google&login_id=lp_7xqm9...
```

#### React: using the SDK

```jsx
import { useAuth } from '@protekt/react';

function SocialLoginButtons() {
  const { loginWithProvider } = useAuth();

  return (
    <div>
      <button onClick={() => loginWithProvider('google')}>
        Continue with Google
      </button>
      <button onClick={() => loginWithProvider('github')}>
        Continue with GitHub
      </button>
      <button onClick={() => loginWithProvider('apple')}>
        Continue with Apple
      </button>
      <button onClick={() => loginWithProvider('microsoft')}>
        Continue with Microsoft
      </button>
    </div>
  );
}
```

### Handling the callback

After the user authenticates with the provider, Protekt redirects them back to your application with a JWT — the same as any other login method.

```js
// Node.js
app.get('/auth/callback', async (req, res) => {
  const { token } = req.query;
  const { user, accessToken, refreshToken } = await protekt.auth.verifyToken(token);

  res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

The React SDK handles this automatically.

## User data from providers

When a user logs in via a social provider for the first time, Protekt creates a new user in your project's identity store and populates their profile with data from the provider:

```json
{
  "id": "usr_9klabc",
  "email": "user@gmail.com",
  "email_verified": true,
  "metadata": {
    "provider": "google",
    "provider_id": "1098234...",
    "name": "Jane Doe",
    "avatar_url": "https://lh3.googleusercontent.com/..."
  }
}
```

On subsequent logins, the existing user record is matched by email — the provider account is linked automatically.

## Account linking

If a user has previously signed up with email/password and then tries to log in with Google using the same email, Protekt will link the accounts automatically. The user will have access to both login methods going forward.

You can check which providers a user has linked from their profile:

```js
const { user } = await protekt.users.get(userId);
console.log(user.metadata.provider); // 'google'
```

## Scopes and permissions

By default, Protekt requests only the minimum scopes needed to identify the user (email and profile). If your application needs additional permissions (for example, Google Calendar access), configure additional scopes in the dashboard under **Social Providers → Advanced Settings**.
