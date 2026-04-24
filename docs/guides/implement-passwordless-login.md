---
title: Implement Passwordless Login
sidebar_position: 2
---

Passwordless authentication removes the need for users to create or remember passwords. Protekt supports two passwordless methods: **magic links** (a one-click email link) and **OTP** (a short code sent via email or SMS).

## When to Use Passwordless Login

Passwordless login is a strong choice when:

- You want to reduce sign-up friction (no password creation step)
- Your users frequently forget passwords
- You're building a low-frequency app where users may not remember a password between visits
- You want to offer a simpler login option alongside traditional email/password

## Magic Links

A magic link is a single-use, time-limited URL sent to the user's email. Clicking it instantly authenticates the user — no password required.

### Flow

```
User enters email → Protekt sends magic link email → User clicks link → Redirected to your app with JWT
```

### Implementation

**Step 1 — Send the magic link**

```js
// Node.js
app.post('/auth/magic-link', async (req, res) => {
  const { email } = req.body;

  await protekt.auth.sendMagicLink({
    email,
    redirectUrl: 'https://myapp.com/auth/callback',
  });

  res.json({ message: 'Check your email for a sign-in link.' });
});
```

```jsx
// React
import { useState } from 'react';
import { useAuth } from '@protekt/react';

function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { sendMagicLink } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    await sendMagicLink({ email });
    setSent(true);
  }

  if (sent) return <p>Check your inbox for a sign-in link.</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Send Magic Link</button>
    </form>
  );
}
```

**Step 2 — Verify the token on callback**

When the user clicks the link, they land on your callback URL with a `token` query parameter. Verify it and establish a session:

```js
// Node.js — callback handler
app.get('/auth/callback', async (req, res) => {
  const { token } = req.query;

  const { user, accessToken, refreshToken, error } =
    await protekt.auth.verifyMagicLink(token);

  if (error) return res.redirect('/login?error=link_expired');

  res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
  res.cookie('refresh_token', refreshToken, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

The React SDK handles the callback automatically when using `ProtektProvider` — no extra code needed.

### Magic Link Settings

| Setting | Default | Description |
|---|---|---|
| Expiry | 15 minutes | How long before the link becomes invalid |
| Single-use | Always | The link is invalidated after first use |
| Redirect URL | Project default | Can be overridden per request |

## OTP (One-Time Passcode)

An OTP is a short numeric code (typically 6 digits) sent to the user's email or phone. The user enters the code in your app to authenticate.

### Flow

```
User enters email or phone → Protekt sends OTP → User enters code → JWT issued
```

### Implementation

**Step 1 — Send the OTP**

```js
// Send via email
const { error } = await protekt.auth.sendOtp({
  email: 'user@example.com',
  channel: 'email',
});

// Send via SMS
const { error } = await protekt.auth.sendOtp({
  phone: '+2348012345678',
  channel: 'sms',
});
```

**Step 2 — Verify the OTP**

```js
const { user, accessToken, refreshToken, error } = await protekt.auth.verifyOtp({
  email: 'user@example.com', // or phone
  otp: '482910',
});

if (error?.code === 'invalid_otp') {
  return res.status(400).json({ error: 'Incorrect or expired code.' });
}
```

**Full React example**

```jsx
import { useState } from 'react';
import { useAuth } from '@protekt/react';

function OtpLogin() {
  const [step, setStep] = useState('enter_email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const { sendOtp, verifyOtp } = useAuth();

  async function handleSend() {
    await sendOtp({ email, channel: 'email' });
    setStep('enter_otp');
  }

  async function handleVerify() {
    const { error } = await verifyOtp({ email, otp });
    if (error) alert('Invalid code, please try again.');
  }

  if (step === 'enter_email') {
    return (
      <div>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button onClick={handleSend}>Send Code</button>
      </div>
    );
  }

  return (
    <div>
      <p>Enter the 6-digit code sent to {email}</p>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
```

### OTP Settings

| Setting | Default | Description |
|---|---|---|
| Expiry | 10 minutes | How long the code remains valid |
| Code length | 6 digits | Fixed |
| Max attempts | 5 | Code is invalidated after 5 wrong attempts |
| Rate limit | 3 per hour | Per email/phone address |

## Combining Passwordless with Password Login

You can offer both methods simultaneously. A common pattern is to show a "Send me a link instead" option on the password form:

```jsx
<LoginForm mode="password" />
<p>or</p>
<MagicLinkForm />
```

Users who sign up via magic link won't have a password set. They can add one later via the account settings using the `setPassword` method (available when no current password exists).

## Next Steps

- [Implement MFA](./implement-mfa) — combine OTP as a second factor with password login
- [Implement SSO](./implement-sso) — enterprise Single Sign-On
- [Authentication Flow](../getting-started/authentication-flow) — the full token lifecycle