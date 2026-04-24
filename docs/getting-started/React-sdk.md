---
title: Protekt React SDK
sidebar_position: 6
---

The Protekt React SDK provides hooks and components for adding authentication to React and Next.js applications. It handles token storage, session refresh, and auth state automatically.

## Requirements

- React 18 or later
- A Protekt project Login ID

## Installation

```bash
npm install @protekt/react
```

## Setup

Wrap your application in `ProtektProvider`. This gives every component in your tree access to auth state and Protekt methods.

```jsx
// app/layout.jsx (Next.js App Router)
import { ProtektProvider } from '@protekt/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ProtektProvider loginId={process.env.NEXT_PUBLIC_PROTEKT_LOGIN_ID}>
          {children}
        </ProtektProvider>
      </body>
    </html>
  );
}
```

```jsx
// index.jsx (Vite / CRA)
import { ProtektProvider } from '@protekt/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ProtektProvider loginId="lp_7xqm9...">
    <App />
  </ProtektProvider>
);
```

### Provider Options

| Prop | Type | Required | Description |
|---|---|---|---|
| `loginId` | `string` | Yes | Your project's Login ID |
| `redirectUrl` | `string` | No | Override the post-login redirect URL |
| `tokenStorage` | `'cookie' \| 'memory'` | No | Where to store tokens. Default: `'cookie'` |
| `onAuthStateChange` | `function` | No | Callback fired whenever auth state changes |

## Core Hooks

### `useAuth`

The primary hook for auth state and actions.

```jsx
import { useAuth } from '@protekt/react';

function Navbar() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) return <Spinner />;

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <span>{user.email}</span>
          <button onClick={logout}>Sign out</button>
        </>
      ) : (
        <button onClick={login}>Sign in</button>
      )}
    </nav>
  );
}
```

**Returns**

| Value | Type | Description |
|---|---|---|
| `user` | `ProtektUser \| null` | The currently authenticated user, or null |
| `isLoading` | `boolean` | True while the initial auth check is in progress |
| `isAuthenticated` | `boolean` | True if there is a valid active session |
| `login()` | `function` | Redirects to the Protekt Universal Login page |
| `logout()` | `function` | Clears the session and redirects to login |
| `accessToken` | `string \| null` | The current JWT access token |

### `useUser`

Access detailed user profile data.

```jsx
import { useUser } from '@protekt/react';

function ProfilePage() {
  const { user, isLoading, updateUser } = useUser();

  async function handleUpdate() {
    await updateUser({ metadata: { theme: 'dark' } });
  }

  if (isLoading) return <Spinner />;

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>MFA enabled: {user.mfaEnabled ? 'Yes' : 'No'}</p>
      <button onClick={handleUpdate}>Save preferences</button>
    </div>
  );
}
```

### `useSession`

Inspect and manage the current session.

```jsx
import { useSession } from '@protekt/react';

function SessionInfo() {
  const { sessions, revokeSession, revokeAllSessions } = useSession();

  return (
    <ul>
      {sessions.map((s) => (
        <li key={s.id}>
          {s.userAgent} — {s.ipAddress}
          {!s.isCurrent && (
            <button onClick={() => revokeSession(s.id)}>Remove</button>
          )}
        </li>
      ))}
      <button onClick={() => revokeAllSessions({ keepCurrent: true })}>
        Sign out all other devices
      </button>
    </ul>
  );
}
```

## Components

### `ProtectedRoute`

Wrap any page or component to require authentication. Unauthenticated users are automatically redirected to login.

```jsx
import { ProtectedRoute } from '@protekt/react';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
```

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `redirectTo` | `string` | `'/'` | Path to redirect unauthenticated users |
| `loadingFallback` | `ReactNode` | `null` | Rendered while auth state is loading |

### `LoginForm`

A pre-built, accessible login form with email/password support.

```jsx
import { LoginForm } from '@protekt/react';

function LoginPage() {
  return (
    <LoginForm
      onSuccess={(user) => console.log('Logged in:', user)}
      onError={(error) => console.error(error)}
    />
  );
}
```

## TypeScript

The SDK ships with full type definitions.

```tsx
import { useAuth, ProtektUser } from '@protekt/react';

function Greeting() {
  const { user }: { user: ProtektUser | null } = useAuth();
  return user ? <p>Hello, {user.email}</p> : null;
}
```

## Examples

- [Next.js App Router](./examples/nextjs-app-router) — layout provider, server components, middleware guard