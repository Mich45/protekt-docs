---
title: Get started
sidebar_position: 2
---

In this guide, you'll learn how to install the Protekt Client SDK, configure your project using your app credentials, and add authentication to your app. By the end, you'll have a working login flow integrated into your application.

## Before you begin

To configure Protekt successfully, you'll need a recent version of [Node.js](https://nodejs.org/en) installed on your system (preferably, v20+). You'll also need a Protekt account and an active project. If you haven't created one yet:

1. Sign up at [app.protekt.io](https://app.protekt.io)
2. Create a new project from your dashboard
3. Copy your **Login ID** and **API Key** from the project settings page

> Keep these values handy, you'll need them during the next steps.

## Integration methods

Protekt supports multiple integration methods. Pick the one that fits your stack:

| Method | Best for |
|---|---|
| [Node.js SDK](./Node-sdk) | Use this in backend or server-side apps |
| [Client SDK](./Client-sdk) | Use this in frontend apps such as React.js or Next.js projects |
| [REST API](../api-reference) | Any language or framework |

> If you're using a framework not listed above, the REST API works with any HTTP client.

## Step 1: Install the Client SDK

Run the command below in the project root to install the SDK:

```bash
npm install @protekt/react
```

## Step 2: Configure your project

Next, create a Protekt client using your project credentials. We recommend storing these in environment variables so they're never hardcoded in your source files.

```bash
# .env
PROTEKT_LOGIN_ID=lp_7xqm9...
PROTEKT_API_KEY=pk_live_AbCdEfGh...
```

### Node.js project

Import `Protekt` and initialize it with your credentials. This client instance is what you'll use throughout your backend to call Protekt APIs.

```js
import { Protekt } from '@protekt/node';

const protekt = new Protekt({
  loginId: process.env.PROTEKT_LOGIN_ID,
  apiKey: process.env.PROTEKT_API_KEY,
});
```

### React project

Wrap your app in `ProtektProvider` and pass in your Login ID. This makes the Protekt context available to every component in your tree, so you can call hooks like `useAuth` anywhere inside your app.

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

## Step 3: Add login to your app

Once configured, adding login is a single function call or component. The examples below show how to protect a route on both the backend and the frontend.

### Node.js: verify a token on the backend

Use `verifyToken` to validate the JWT sent with each request. If the token is missing or invalid, return a `401` before the request reaches your route handler.

```js
app.get('/dashboard', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { user } = await protekt.auth.verifyToken(token);

  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ message: `Welcome, ${user.email}` });
});
```

### React: protect a route

Use the `useAuth` hook to access the current user inside any component, and wrap pages with `ProtectedRoute` to redirect unauthenticated users away automatically.

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

## Step 4: Handle the login redirect

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

Congratulations! You've successfully configured your application to authenticate users through Protekt.

## What's next

From here, you can explore:

- [Authentication Flow](./authentication-flow) — understand what's happening under the hood
- [Implement Password Login](../guides/implement-password-login) — detailed guide for email/password auth
- [Implement MFA](../guides/implement-mfa) — add a second factor to your login flow
- [Node.js SDK Reference](../sdks/node/api-reference) — full method documentation
- [React SDK Reference](../sdks/react/installation) — hooks, components, and examples