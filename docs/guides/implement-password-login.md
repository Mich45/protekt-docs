---
title: Implement Password Login
sidebar_position: 6
---

Traditional email/password authentication flow.

## Overview

Password-based authentication is the most common login method. Users create an account with their email and a password, then use those credentials to log in.

## Prerequisites

- Protekt project configured
- API key and project ID
- SDK installed (`@protekt/sdk` or `@protekt/react`)

## Backend Implementation (Node.js)

### 1. Install SDK

```bash
npm install @protekt/sdk
```

### 2. Initialize Protekt

```javascript
// lib/protekt.js
import { Protekt } from '@protekt/sdk';

export const protekt = new Protekt({
  apiKey: process.env.PROTEKT_API_KEY,
  projectId: process.env.PROTEKT_PROJECT_ID,
});
```

### 3. Sign Up Route

```javascript
// routes/auth.js
import express from 'express';
import { protekt } from '../lib/protekt.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }
    
    // Create user
    const user = await protekt.createUser({
      email,
      password,
      name,
      emailVerified: false,
    });
    
    // Create session (auto-login)
    const session = await protekt.authenticate({
      type: 'password',
      email,
      password,
    });
    
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionToken: session.sessionToken,
      refreshToken: session.refreshToken,
    });
  } catch (error) {
    if (error.code === 'USER_ALREADY_EXISTS') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    if (error.code === 'WEAK_PASSWORD') {
      return res.status(400).json({ error: 'Password is too weak' });
    }
    
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

export default router;
```

### 4. Login Route

```javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const session = await protekt.authenticate({
      type: 'password',
      email,
      password,
    });
    
    // Set httpOnly cookie
    res.cookie('session_token', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: session.expiresIn * 1000,
    });
    
    res.json({
      user: session.user,
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    if (error.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    if (error.code === 'EMAIL_NOT_VERIFIED') {
      return res.status(403).json({ 
        error: 'Please verify your email first' 
      });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});
```

### 5. Logout Route

```javascript
router.post('/logout', async (req, res) => {
  const token = req.cookies?.session_token || 
                req.headers.authorization?.split(' ')[1];
  
  if (token) {
    await protekt.revokeSession(token);
  }
  
  res.clearCookie('session_token');
  res.json({ success: true });
});
```

### 6. Password Reset Routes

```javascript
// Request password reset
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  await protekt.sendPasswordResetEmail({ email });
  
  // Always return success to prevent email enumeration
  res.json({ 
    message: 'If an account exists, you will receive a reset link' 
  });
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  await protekt.resetPassword({
    resetToken: token,
    newPassword,
  });
  
  res.json({ message: 'Password updated successfully' });
});
```

## Frontend Implementation (React)

### 1. Install SDK

```bash
npm install @protekt/react
```

### 2. Setup AuthProvider

```jsx
// App.jsx
import { AuthProvider } from '@protekt/react';

function App() {
  return (
    <AuthProvider
      projectId="your-project-id"
      redirectUri="https://yourapp.com/callback"
    >
      <YourApp />
    </AuthProvider>
  );
}
```

### 3. Signup Form

```jsx
// components/SignupForm.jsx
import { useState } from 'react';
import { useAuth } from '@protekt/react';

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await signup(formData);
      // User is now logged in, redirect to dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
        />
      </div>
      
      <button type="submit">Sign Up</button>
      
      <p className="hint">
        Already have an account? <a href="/login">Sign in</a>
      </p>
    </form>
  );
}
```

### 4. Login Form

```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import { useAuth } from '@protekt/react';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(formData);
      // User is now logged in
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      
      <div className="form-group">
        <a href="/forgot-password">Forgot password?</a>
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      
      <p className="hint">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </form>
  );
}
```

### 5. Protected Route

```jsx
// components/ProtectedRoute.jsx
import { useAuth } from '@protekt/react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

## Password Requirements

Configure password policies in your Protekt dashboard:

| Setting | Default | Recommended |
|---------|---------|-------------|
| Minimum Length | 8 chars | 8-12 chars |
| Require Uppercase | No | Yes |
| Require Number | No | Yes |
| Require Special Char | No | Optional |
| Breached Password Check | Yes | Yes |

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_CREDENTIALS` | Wrong email or password |
| `USER_NOT_FOUND` | No account with this email |
| `WEAK_PASSWORD` | Password doesn't meet requirements |
| `EMAIL_NOT_VERIFIED` | User hasn't verified email |
| `ACCOUNT_LOCKED` | Too many failed attempts |
| `USER_ALREADY_EXISTS` | Email already registered |

## Security Best Practices

1. **Rate limit login attempts** - Prevent brute force attacks
2. **Use bcrypt/argon2** - Never store plain text passwords
3. **Implement account lockout** - Lock after 5-10 failed attempts
4. **Require email verification** - Confirm email before allowing login
5. **Use HTTPS only** - Encrypt all authentication traffic
6. **Log suspicious activity** - Monitor for attacks

## Related

- [Authentication Flow](../getting-started/authentication-flow.md)
- [Implement Passwordless Login](./implement-passwordless-login.md)
- [Error Codes Reference](../Resources/Error-codes.md)
