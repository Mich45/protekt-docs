---
sidebar_position: 1
---

# Introduction

Protekt is a developer-friendly authentication platform that makes it easy to add security to your applications. With Protekt, you can implement a variety of authentication methods, including traditional password-based login, Single-Sign On, passwordless login, and more.

Protekt builds on JSON Web Tokens and internally manages user accounts and sessions in a secure, encrypted database. In other words, using Protekt doesn't require a database layer — you just simply call Protekt’s API or SDK, and it'll automatically handle user storage, token management, and session persistence for you. It's also language-agnostic, meaning you can integrate it within a wide range of tech stacks in few minutes using any of our supported SDKs and APIs.

## Why Protekt?

The following are some key features and aspects of Protekt that make it stand out:

- **Simplicity**: For many developers, authentication is often one of the most complex parts of an app. Protekt's intuitive APIs make it easy to integrate secure login in minutes, not days.
- **Stateless Authentication**: Unlike many platforms, Protekt doesn't require a database set-up. We manage a secure, encrypted identity store internally to handle user accounts, sessions, and authentication tokens on your behalf.
- **Advanced Security**: Protekt has buit-in state-of-the-art protection against common attacks such as XSS, CSRF, and brute force. All tokens are protected with industry-standard encryption algorithms, ensuring your users’ data stays safe.
- **Scalability and Flexibility**: Protekt scales no matter the complexity of your app. It's modular enough for simple or hobby projects but robust enough to support complex enterprise applications.
- **Strict Security Compliance**: Protekt adheres to major security and privacy standards, giving you and your users confidence that data is managed securely.

## How Protekt Works

Protekt abstracts away the complexity of authentication by giving you a ready-to-use Universal Login page. Here's what the integration flow for Protekt looks like:

1. When you create a new project in your [Protekt Dashboard](https://app.protekt.io), a unique **Protekt Login ID** that identifies your project is automatically generated for you.

2. Using the unique Login ID, you'll configure a [Universal Login](#) page within your application for user authentication.

3. When a user signs up with their email and password, for example, Protekt will automatically handle the authentication flow behind the scenes, including hashing the credentials and storing them in a secure identity store.

4. After a successful login, Protekt returns a **JWT** to your application, which you can then use to authenticate subsequent requests.

Now that you undersatand what Protekt is and how it works, you're ready to start building with it.

## Next Steps
- [Getting Started](#)
- [API Reference](#)
