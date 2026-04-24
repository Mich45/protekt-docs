---
title: Quickstart
sidebar_position: 1
---

This guide will get you up and running with Protekt in under five minutes. By the end, you'll have a working login flow integrated into your application.

## Before You Begin

You'll need a Protekt account and an active project. If you haven't created one yet:

1. Sign up at [app.protekt.io](https://app.protekt.io)
2. Create a new project from your dashboard
3. Copy your **Login ID** and **API Key** from the project settings page

Keep these values handy — you'll need them during setup.

## Choose Your Integration Path

Protekt supports multiple integration methods. Pick the one that fits your stack:

| Method | Best For | Setup Time |
|---|---|---|
| [Node.js SDK](./Node-sdk) | Backend / server-side apps | ~3 min |
| [React SDK](./React-sdk) | React / Next.js frontends | ~3 min |
| [REST API](../api-reference) | Any language or framework | ~5 min |

If you're using a framework not listed above, the REST API works with any HTTP client — no SDK required.

## Step 1: Install the SDK

Choose your package manager and install the Protekt SDK for your platform.

**Node.js**
```bash
npm install @protekt/node
```

**React**
```bash
npm install @protekt/react
```

## Step 2: Configure Your Project

Create a Protekt client using your project credentials. We recommend storing these in environment variables.

```bash
# .env
PROTEKT_LOGIN_ID=lp_7xqm9...
PROTEKT_API_KEY=pk_live_AbCdEfGh...
```

**Node.js**
```js
import { Protekt } from '@protekt/node';

const protekt = new Protekt({
  loginId: process.env.PROTEKT_LOGIN_ID,
  apiKey: process.env.PROTEKT_API_KEY,
});
```

**React**
```jsx
import { ProtektProvider } from '@protekt/react';

export default function App() {
  return (
    <ProtektProvider loginId={process.env.NEXT_PUBLIC_PROTEKT_LOGIN_ID}>
      <YourApp />
    </ProtektProvider>
  );
}
```

## Step 3: Add Login to Your App

Once configured, adding login is a single function call or component.

**Node.js — verify a token on the backend**
```js
app.get('/dashboard', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { user } = await protekt.auth.verifyToken(token);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ message: `Welcome, ${user.email}` });
});
```

**React — protect a route**
```jsx
import { useAuth, ProtectedRoute } from '@protekt/react';

function Dashboard() {
  const { user } = useAuth();
  return <h1>Welcome, {user.email}</h1>;
}

// Wrap any page to require authentication
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Step 4: Handle the Login Redirect

When a user logs in through Protekt's Universal Login page, they are redirected back to your application with a JWT. Configure your redirect URL in the Protekt Dashboard under **Project Settings → Redirect URL**.

Your app then exchanges this token to establish a session:

```js
// Node.js — handle the redirect
app.get('/auth/callback', async (req, res) => {
  const { token } = req.query;
  const { user } = await protekt.auth.verifyToken(token);
  // Store the token in a session cookie or return it to the client
  res.redirect('/dashboard');
});
```

## You're Done

That's the core integration. Your application can now authenticate users through Protekt.

From here, you can explore:

- [Authentication Flow](./authentication-flow) — understand what's happening under the hood
- [Implement Password Login](../guides/implement-password-login) — detailed guide for email/password auth
- [Implement MFA](../guides/implement-mfa) — add a second factor to your login flow
- [Node.js SDK Reference](../sdks/node/api-reference) — full method documentation
- [React SDK Reference](../sdks/react/installation) — hooks, components, and examples

## Need Help?

If you run into issues during setup, check the [Troubleshooting Guide](../troubleshooting/common-issues) or reach out via the [Support page](../troubleshooting/support).