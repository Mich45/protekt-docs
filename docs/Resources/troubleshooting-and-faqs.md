---
title: Troubleshooting and FAQs
sidebar_position: 3
---

This page outlines the common issues that you might encounter when working with Protekt and their recommended solutions. It also answers frequently asked questions about authentication flows, sessions, and token handling.

If you're experiencing unexpected behavior, start here before reaching out for support.

## Common issues

### 1. Login fails with `invalid_credentials`

**Cause:** Incorrect email or password.
**Solution:**

- Verify user input
- Ensure the user exists in your system
- Check if password hashing or migration issues exist

### 2. Token expired errors

**Cause:** Access tokens are short-lived and may expire during use.
**Solution:**

- Use the refresh token to obtain a new access token
- Enable automatic refresh in the SDK

```javascript
const protekt = new Protekt({
  apiKey: 'your-api-key',
  autoRefresh: true,
});
```

## 3. Session not found or revoked

**Cause**: Session may have expired or been manually revoked.
**Solution**:

- Prompt the user to log in again
- Check if session revocation logic is triggered unintentionally

### 4. CORS or network errors

**Cause**: Misconfigured API endpoints or missing headers.
**Solution**:

- Ensure your backend is properly configured for CORS
- Verify API base URL and environment variables

### 5. OAuth redirect issues

**Cause**: Incorrect redirect URI or provider configuration.
**Solution**:

- Ensure redirect URI matches exactly (including protocol and path)
- Check provider settings (Google, GitHub, etc.)

## Frequently asked questions

### How do I keep users logged in?

Use refresh tokens and enable sliding sessions. This ensures active users remain authenticated without frequent logins.

### Why shouldn't I use localStorage for tokens?

`localStorage` is vulnerable to XSS attacks. If your application is compromised, attackers can easily access stored tokens.

Use httpOnly cookies or secure storage instead.

### Can I revoke sessions manually?

Yes. Protekt allows you to revoke:

- The current session
- All sessions for a user
- A specific session by ID

### What happens if a refresh token is compromised?

If refresh token rotation is enabled, reuse detection can invalidate the session automatically. This prevents attackers from maintaining access.

## How do I debug authentication issues?

- Check error codes in API responses
- Log request/response data (excluding sensitive info)
- Verify token validity and expiration
- Ensure environment variables are correct

## Debugging checklist

Before seeking help, go through this checklist:

- API key is correct
- Tokens are being sent in requests
- HTTPS is enabled
- Token has not expired
- Correct authentication method is used
