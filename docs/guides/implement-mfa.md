---
title: Implement MFA
sidebar_position: 5
---

Multi-factor authentication (MFA) requires users to verify their identity with a second factor after entering their password. Protekt supports **TOTP** (authenticator apps), **SMS**, and **backup codes**.

## Supported MFA Methods

| Method | Description | Recommended For |
|---|---|---|
| **TOTP** | 6-digit code from an authenticator app (Google Authenticator, Authy) | Most users |
| **SMS** | 6-digit code sent to a verified phone number | Users without an authenticator app |
| **Backup codes** | Single-use recovery codes for account recovery | Always enable alongside TOTP/SMS |

## Enabling MFA for a Project

You can make MFA optional (user-driven) or required for all users in a project.

**Optional MFA** — users choose to enroll:
```js
// No project-level setting needed; users can enroll via the MFA endpoints
```

**Required MFA** — all users must enroll before accessing the app:
```js
await protekt.projects.update('proj_01jk8abc', { mfaRequired: true });
```

When `mfaRequired` is true, users who haven't enrolled in MFA will receive an `mfa_enrollment_required` response after login, and you should redirect them to an enrollment flow.

## MFA Enrollment

### TOTP Enrollment

TOTP generates time-based codes using a shared secret between Protekt and the user's authenticator app.

**Step 1 — Start enrollment**

```js
// Node.js
const { totpUri, qrCode } = await protekt.mfa.enroll({
  method: 'totp',
}, accessToken);

// totpUri: otpauth://totp/Protekt:user@example.com?secret=BASE32...
// qrCode: data:image/png;base64,...
```

**Step 2 — Show the QR code to the user**

```jsx
// React
function TotpSetup({ qrCode, totpUri }) {
  const [code, setCode] = useState('');
  const { verifyMfaEnrollment } = useAuth();

  async function handleVerify() {
    const { error } = await verifyMfaEnrollment({ method: 'totp', code });
    if (error) alert('Incorrect code. Please try again.');
  }

  return (
    <div>
      <p>Scan this QR code with your authenticator app:</p>
      <img src={qrCode} alt="MFA QR code" />
      <p>Or enter the key manually: <code>{totpUri}</code></p>
      <input
        placeholder="Enter the 6-digit code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
      />
      <button onClick={handleVerify}>Verify & Enable MFA</button>
    </div>
  );
}
```

**Step 3 — Confirm enrollment**

```js
const { error } = await protekt.mfa.verify({
  code: '482910',
}, accessToken);

if (!error) {
  // MFA enrollment complete
  // Generate and display backup codes
}
```

### SMS Enrollment

```js
// Step 1 — Start enrollment with a phone number
const { error } = await protekt.mfa.enroll({
  method: 'sms',
  phone: '+2348012345678',
}, accessToken);

// A verification code is sent to the phone number

// Step 2 — Verify the code to complete enrollment
const { error } = await protekt.mfa.verify({
  code: '482910',
}, accessToken);
```

### Backup Codes

Generate backup codes immediately after a user enrolls in TOTP or SMS. Each code is single-use and should be stored securely by the user.

```js
const { backupCodes } = await protekt.mfa.generateBackupCodes(accessToken);

// backupCodes: ['7f3k-2m9p', '4x8n-6t1w', ...]
// Show these to the user once — they cannot be retrieved again
```

```jsx
function BackupCodes({ codes }) {
  return (
    <div>
      <p>Save these codes in a safe place. Each can only be used once.</p>
      <ul>
        {codes.map((code) => <li key={code}><code>{code}</code></li>)}
      </ul>
      <button onClick={() => navigator.clipboard.writeText(codes.join('\n'))}>
        Copy all
      </button>
    </div>
  );
}
```

## MFA Login Challenge

When MFA is enabled for a user, `POST /auth/login` returns a challenge instead of a token:

```json
{
  "mfa_required": true,
  "mfa_token": "mfa_tmp_abc...",
  "available_methods": ["totp", "sms"]
}
```

Your application should show the appropriate prompt and verify the code:

```js
// Node.js — handle login with MFA
const loginResult = await protekt.auth.login({ email, password });

if (loginResult.error?.code === 'mfa_required') {
  const { mfaToken, availableMethods } = loginResult.error;

  // Store mfaToken in the session and redirect to MFA prompt
  req.session.mfaToken = mfaToken;
  return res.redirect('/login/mfa');
}

// MFA prompt route
app.post('/login/mfa', async (req, res) => {
  const { accessToken, refreshToken, error } = await protekt.mfa.verifyLogin({
    mfaToken: req.session.mfaToken,
    code: req.body.code,
  });

  if (error) return res.status(401).json({ error: 'Invalid MFA code.' });

  res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
  res.redirect('/dashboard');
});
```

```jsx
// React — the SDK manages the MFA challenge state automatically
import { useAuth, MfaChallenge } from '@protekt/react';

function LoginPage() {
  const { login, mfaRequired, mfaToken } = useAuth();

  if (mfaRequired) {
    return <MfaChallenge mfaToken={mfaToken} />;
  }

  return <LoginForm onSubmit={login} />;
}
```

## Removing MFA

Users can remove an MFA method unless `mfaRequired` is enabled at the project level:

```js
const { error } = await protekt.mfa.unenroll({
  method: 'totp',
}, accessToken);

if (error?.code === 'mfa_enforced') {
  // Project requires MFA — cannot remove
}
```

## Next Steps

- [Session Management](../concepts/session-management) — revoking sessions after MFA events
- [Implement Password Login](./implement-password-login) — the primary factor alongside MFA
- [Security Overview](../security/overview) — Protekt's security posture and compliance