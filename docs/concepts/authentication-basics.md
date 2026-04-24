---
title: Authentication Basics
sidebar_position: 1
---


Understanding authentication is fundamental to building secure applications. In **Protekt**, authentication is handled through a combination of modern protocols, token-based systems, and developer-friendly abstractions that remove the need to build complex auth systems from scratch.

This guide introduces the core concepts behind authentication in Protekt, explains how the system works under the hood, and walks through the different authentication methods you can use in your application.

## Core Concepts

Authentication in Protekt is built around a few foundational ideas that define how users are identified, verified, and granted access. These concepts remain consistent regardless of the authentication method you choose, making it easier to reason about your system as it grows.

By understanding these building blocks, you can better design authentication flows, debug issues, and implement advanced features like multi-factor authentication or enterprise SSO with confidence.

### What is Authentication?

Authentication is the process of verifying a user's identity—confirming that they are who they claim to be. This typically involves credentials such as passwords, one-time codes, or third-party identity providers.

In Protekt, authentication is abstracted into a simple API, but behind the scenes it involves secure credential verification, token issuance, and session creation. This allows you to focus on your application logic while Protekt handles the complexities of cryptography, token lifecycle management, and security enforcement.

### Key Terms

These terms are used throughout the documentation and form the foundation of how authentication works in Protekt.

| Term | Definition |
|------|------------|
| **User** | A person or service identity in your system |
| **Session** | A temporary authenticated state for a user |
| **Token** | A cryptographic proof of authentication (JWT) |
| **Claim** | A piece of information about the user in a token |
| **Provider** | An identity source (Google, GitHub, email/password, etc.) |

Each of these concepts plays a specific role. For example, tokens carry claims about a user, while sessions provide a server-side mechanism to manage and revoke access. Understanding how they interact is key to building secure authentication flows.

## How Protekt Works

Protekt acts as the bridge between your application and the underlying authentication infrastructure. Instead of directly handling credentials or token verification, your app communicates with the Protekt SDK, which manages these operations securely.

This layered approach ensures that sensitive operations like credential validation and token signing are handled in a controlled environment, reducing the risk of common security vulnerabilities.

At a high level, the flow starts when a user attempts to log in. The request is passed through your backend to the Protekt SDK, which communicates with the Protekt API to verify credentials. Once verified, a session and tokens are issued, allowing the client to make authenticated requests.

Subsequent API calls include the access token, which is validated on each request. This ensures that only authenticated users can access protected resources, while also enabling fine-grained authorization based on user data.


## Authentication Methods

Protekt supports multiple authentication methods to accommodate different use cases, from simple applications to enterprise-grade systems. You can choose one or combine several depending on your needs.

Each method is designed to provide a balance between user experience and security. For example, passwordless authentication reduces friction, while multi-factor authentication adds an extra layer of protection.

### 1. Password-Based

Password-based authentication is the most traditional method, where users log in using an email and password combination. Protekt securely handles password hashing, validation, and storage.

While simple to implement, it’s recommended to combine this method with additional safeguards like MFA to reduce the risk of credential-based attacks.

```javascript
await protekt.authenticate({
  type: 'password',
  email: 'user@example.com',
  password: 'secure-password',
});
```

### 2. Passwordless

Passwordless authentication eliminates the need for users to remember passwords. Instead, users authenticate via magic links or one-time passcodes sent to their email or phone.

This approach improves user experience and reduces risks associated with weak or reused passwords, making it ideal for modern applications.

```js
// Send magic link
await protekt.sendMagicLink({ email: 'user@example.com' });

// Verify OTP
await protekt.verifyOTP({ email: 'user@example.com', code: '123456' });
```

### 3. Social Login

Social login allows users to authenticate using existing accounts from providers like Google or GitHub. This leverages OAuth flows to securely delegate authentication.

It reduces onboarding friction and improves conversion rates, especially in consumer-facing applications.

```js
await protekt.authenticate({
  type: 'oauth',
  provider: 'google',
  redirectUri: 'https://yourapp.com/callback',
});
```

### 4. SSO (Enterprise)

Single Sign-On (SSO) is designed for enterprise environments where users authenticate through a centralized identity provider such as Okta or Azure AD.

Protekt supports industry standards like SAML 2.0 and OpenID Connect (OIDC), enabling seamless integration with corporate identity systems.

```js
await protekt.authenticate({
  type: 'sso',
  provider: 'okta',
  organizationId: 'org_123',
});
```

### 5. Multi-Factor (MFA)

Multi-Factor Authentication adds an extra layer of security by requiring a second verification step after initial login. This can include time-based codes, SMS verification, or hardware-based authentication like WebAuthn.

MFA significantly reduces the risk of unauthorized access, even if primary credentials are compromised.

```js
await protekt.verifyMFA({
  sessionId: 'sess_abc123',
  type: 'totp',
  code: '654321',
});
```

## Session vs Token

Sessions and tokens are closely related but serve different purposes in authentication. Understanding the distinction helps you design more secure and scalable systems.

Sessions are managed server-side and represent the overall authenticated state, while tokens are client-side credentials used to prove authentication on each request.

| Aspect         | Session                     | Token                     |
| -------------- | --------------------------- | ------------------------- |
| **Storage**    | Server-side (Protekt)       | Client-side (browser/app) |
| **Lifetime**   | Hours to days               | Minutes (short-lived)     |
| **Refresh**    | Automatic via refresh token | Requires new session      |
| **Revocation** | Immediate                   | Must wait for expiration  |

In practice, tokens are used frequently for API calls, while sessions provide the control layer for managing and revoking access when needed.

## Security Best Practices

Authentication is one of the most critical parts of your application’s security model. Even small mistakes can lead to serious vulnerabilities, so it’s important to follow established best practices.

Start by ensuring tokens are stored securely - prefer httpOnly cookies over localStorage to protect against XSS attacks. Always use HTTPS to encrypt data in transit and prevent interception.

Additionally, implement token refresh mechanisms and validate tokens on every request. Avoid relying on long-lived tokens, as they increase the risk window if compromised. Short-lived access tokens combined with refresh tokens provide a much safer approach.
