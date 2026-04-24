---
title: Implement SSO
sidebar_position: 8
---

_Single Sign-On_ (SSO) lets your users authenticate through their organization's identity provider (IdP), such as Okta, Azure AD, or Google Workspace — using enterprise-grade protocols. Protekt supports both **SAML 2.0** and **OIDC** (OpenID Connect).

## When to use SSO

SSO is typically required for:

- **B2B SaaS**: Enterprise customers who manage users through their own IdP
- **Internal tools**: Staff who already authenticate via a company directory (LDAP, Active Directory)
- **Compliance requirements**: Organizations that need centralized access control and audit trails

## Supported protocols

| Protocol | Best For |
|---|---|
| **OIDC** | Modern IdPs: Google Workspace, Okta, Azure AD, Auth0 |
| **SAML 2.0** | Legacy enterprise IdPs, Okta, Azure AD, Ping Identity, OneLogin |

## Setup

### 1. Create a connection in Protekt

In the Protekt Dashboard, go to **Project Settings → SSO Connections** and click **Add Connection**. Select your protocol and fill in the connection details.

Alternatively, configure via the Account API:

```js
// OIDC connection
await protekt.sso.createConnection('proj_01jk8abc', {
  protocol: 'oidc',
  name: 'Acme Corp — Google Workspace',
  clientId: process.env.SSO_CLIENT_ID,
  clientSecret: process.env.SSO_CLIENT_SECRET,
  discoveryUrl: 'https://accounts.google.com/.well-known/openid-configuration',
  domains: ['acme.com'], // Users with this email domain use this connection
});

// SAML connection
await protekt.sso.createConnection('proj_01jk8abc', {
  protocol: 'saml',
  name: 'Acme Corp — Okta',
  metadataUrl: 'https://acme.okta.com/app/exk.../sso/saml/metadata',
  domains: ['acme.com'],
});
```

### 2. Configure your IdP

Provide the following Protekt URLs to your identity provider:

| Setting | Value |
|---|---|
| **ACS URL** (SAML) | `https://auth.protekt.io/v1/auth/sso/callback` |
| **Entity ID** (SAML) | `https://auth.protekt.io` |
| **Redirect URI** (OIDC) | `https://auth.protekt.io/v1/auth/sso/callback` |

#### Okta setup

1. In Okta Admin → Applications → Create App Integration → SAML 2.0
2. Set Single sign-on URL and Audience URI to the values above
3. Download the metadata XML and paste it into Protekt

#### Azure AD setup

1. In Azure Portal → Enterprise Applications → New application → Create your own
2. Set up SAML-based sign-on with the above URLs
3. Download the Federation Metadata XML and enter the URL in Protekt

#### Google Workspace (OIDC)

1. In Google Cloud Console → APIs & Services → OAuth consent screen
2. Create OAuth 2.0 credentials (Web application)
3. Add the redirect URI above and paste the client ID and secret into Protekt

## Implementation

### Initiating an SSO login

SSO login follows the same redirect pattern as social login. Redirect users to the Protekt authorize endpoint with a `provider` parameter matching your connection name or the user's email domain.

#### Domain-based routing (recommended)

When you associate email domains with an SSO connection, Protekt automatically routes users to the correct IdP based on their email:

```js
// Node.js — redirect to SSO based on email domain
app.post('/auth/sso', (req, res) => {
  const url = protekt.auth.getSsoUrl({
    email: req.body.email, // Protekt infers the connection from the domain
    redirectUrl: 'https://myapp.com/auth/callback',
  });
  res.redirect(url);
});
```

#### Named connection routing

```js
const url = protekt.auth.getSsoUrl({
  connection: 'acme-corp-okta',
  redirectUrl: 'https://myapp.com/auth/callback',
});
res.redirect(url);
```

#### React

```jsx
import { useAuth } from '@protekt/react';

function SsoLoginForm() {
  const [email, setEmail] = useState('');
  const { loginWithSso } = useAuth();

  return (
    <form onSubmit={() => loginWithSso({ email })}>
      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Continue with SSO</button>
    </form>
  );
}
```

### Handling the callback

After the IdP authenticates the user, Protekt completes the exchange and redirects back to your app with a JWT — exactly the same as all other login methods:

```js
app.get('/auth/callback', async (req, res) => {
  const { token } = req.query;
  const { user, accessToken, refreshToken } = await protekt.auth.verifyToken(token);

  res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

## Just-in-Time (JIT) provisioning

When a user authenticates via SSO for the first time, Protekt automatically creates a user record in your project. This is called Just-in-Time provisioning — no pre-registration step needed.

The user's profile is populated with claims from the IdP:

```json
{
  "id": "usr_9klabc",
  "email": "jane@acme.com",
  "email_verified": true,
  "metadata": {
    "provider": "okta",
    "sso_connection": "acme-corp-okta",
    "given_name": "Jane",
    "family_name": "Doe",
    "groups": ["engineering", "admins"]
  }
}
```

You can use IdP group claims to assign roles in your application:

```js
const { user } = await protekt.auth.verifyToken(token);
const isAdmin = user.metadata?.groups?.includes('admins');
```

## Enforcing SSO

To require all users from a domain to use SSO (blocking password login), enable **SSO enforcement** in the connection settings:

```js
await protekt.sso.updateConnection(connectionId, {
  enforced: true, // Users on this domain can only log in via SSO
});
```