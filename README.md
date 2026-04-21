# Protekt Documentation

The documentation site for Protekt, a developer-friendly authentication platform.

## 📚 Information Architecture

This tree shows the complete file/folder structure needed for solid, practical documentation:

```txt
protekt-docs/
├── docs/
│   ├── introduction.md                          # Overview: What is Protekt, key features, how it works
│   │
│   ├── getting-started/
│   │   ├── overview.md                          # Quick start: choose your platform, 5-min integration
│   │   ├── Node-sdk.md                          # Node.js SDK setup, installation, basic usage
│   │   ├── React-sdk.md                         # React SDK with hooks and components
│   │   └── authentication-flow.md               # Step-by-step: first login implementation
│   │
│   ├── concepts/
│   │   ├── authentication-basics.md             # Auth fundamentals: sessions, tokens, cookies
│   │   ├── jwt-tokens.md                        # JWT structure, claims, validation
│   │   ├── session-management.md                # How sessions work, refresh tokens, expiration
│   │
│   ├── guides/
│   │   ├── implement-password-login.md          # Traditional email/password flow
│   │   ├── implement-passwordless-login.md      # Magic links, OTP via email/SMS
│   │   ├── implement-social-login.md            # Google, GitHub, Apple, Microsoft OAuth
│   │   ├── implement-sso.md                     # SAML 2.0, OIDC enterprise SSO
│   │   ├── implement-mfa.md                     # TOTP, SMS, backup codes, WebAuthn
│   │   ├── customize-login-ui.md                # Branding, themes, custom CSS, hosted login
│   │
│   ├── sdks/
│   │   ├── node/
│   │   │   ├── installation.md                  # npm install, configuration
│   │   │   ├── initialization.md                # Create Protekt client, config options
│   │   │   ├── api-reference.md                 # All Node SDK methods
│   │   │   ├── error-handling.md                # Try/catch, error types, retries
│   │   │   └── examples/
│   │   │       ├── express-integration.md       # Express.js middleware example
│   │   │       └── nestjs-module.md             # NestJS guard and decorator
│   │   ├── react/
│   │   │   ├── installation.md                  # npm install, provider setup
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.md                   # Auth state, login/logout
│   │   │   │   ├── useUser.md                   # Current user data
│   │   │   │   └── useSession.md                # Session management
│   │   │   ├── components/
│   │   │   │   ├── AuthProvider.md              # Context provider
│   │   │   │   ├── LoginForm.md                 # Pre-built login form
│   │   │   │   └── ProtectedRoute.md            # Route guard component
│   │   │   └── examples/
│   │   │       ├── nextjs-app-router.md         # Next.js 16+ integration
│   │
│   ├── security/
│   │   ├── overview.md                          # Security principles, compliance
│   │
│   ├── troubleshooting/
│   │   ├── error-codes.md                       # Complete error code reference
│   │   ├── common-issues.md                     # FAQ: token errors, CORS, redirects
│   │   └── support.md                           # Contact support, community, SLAs
├── blog/
│   ├── 2026-01-15-introducing-protekt.md        # Launch announcement
│
├── static/
│   └── img/
│       ├── logo.svg
│       ├── favicon.ico
│       ├── diagrams/
│       │   ├── auth-flow.svg                    # Authentication flow diagram
│       │   ├── jwt-structure.svg                # JWT token anatomy
│       │   └── session-lifecycle.svg            # Session lifecycle
│       └── screenshots/
│           ├── dashboard.png
│           └── login-ui.png
│
├── src/
│   ├── components/
│   ├── css/
│   │   └── custom.css
│   └── pages/
│       ├── index.md                             # Landing page
│       └── markdown-page.md
│
├── docusaurus.config.js                         # Site configuration
├── sidebars.js                                  # Navigation structure
├── package.json
└── README.md                                    # This file
```

## 🚀 Quick Start

```bash
# Install dependencies
yarn

# Start development server
yarn start

# Build for production
yarn build

# Deploy to GitHub Pages
yarn deploy
```

---
