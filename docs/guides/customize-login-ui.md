---
title: Customize the Login UI
sidebar_position: 2
---

Protekt's _Universal Login_ page is fully customizable. You can update colors, fonts, logos, and copy to match your brand, or go further and apply custom CSS for complete visual control.

## What You Can Customize

| Element | Method |
|---|---|
| Logo, brand name, favicon | Dashboard → Branding |
| Primary color, button color | Dashboard → Branding |
| Background color / image | Dashboard → Branding |
| Font family | Dashboard → Branding → Advanced |
| Custom CSS | Dashboard → Branding → Custom CSS |
| Login page copy (labels, placeholders, error messages) | Dashboard → Localization |
| Custom domain | Dashboard → Branding → Custom Domain |

## Branding Settings

### Logo and Brand Name

In the Protekt Dashboard, go to **Project Settings → Branding**:

- **Logo** — Upload a PNG or SVG (recommended: 200×50px, transparent background)
- **Favicon** — Upload a 32×32 PNG
- **Brand name** — Displayed in the browser tab and email templates

### Colors

Protekt uses a small set of design tokens you can override:

| Token | Default | Applies To |
|---|---|---|
| `--color-primary` | `#1a6ef5` | Buttons, links, focus rings |
| `--color-background` | `#ffffff` | Page background |
| `--color-surface` | `#f9fafb` | Card / form background |
| `--color-text` | `#111827` | Body text |
| `--color-border` | `#e5e7eb` | Input borders |

Set these in the Dashboard color picker or directly in Custom CSS.

### Custom Font

To use a custom font, add a Google Fonts import in the Custom CSS field:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --font-family: 'Inter', sans-serif;
}
```

## Custom CSS

For deeper customization, paste CSS into **Project Settings > Branding > Custom CSS**. Protekt's login page uses a stable set of class names you can target:

```css
/* Container */
.pk-login-container {
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Primary button */
.pk-btn-primary {
  background-color: #7c3aed;
  border-radius: 8px;
  font-weight: 600;
}

.pk-btn-primary:hover {
  background-color: #6d28d9;
}

/* Input fields */
.pk-input {
  border-radius: 8px;
  border-color: #d1d5db;
}

.pk-input:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}

/* Social login buttons */
.pk-social-btn {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

/* Logo area */
.pk-logo {
  margin-bottom: 24px;
}
```

:::tip
Changes to Custom CSS are previewed live in the Dashboard before publishing. Use the preview pane to iterate without affecting your production login page.
:::

## Custom Domain

By default, users see Protekt's login page at `login.protekt.io`. You can serve it from your own domain (for example, `auth.myapp.com`) for a fully seamless experience.

### Setup

1. In the Dashboard, go to **Project Settings → Branding → Custom Domain**
2. Enter your subdomain (for example, `auth.myapp.com`)
3. Add the following DNS records at your domain registrar:

```text
Type    Name    Value
CNAME   auth    login.protekt.io
```

4. Protekt automatically provisions a TLS certificate via Let's Encrypt

DNS propagation typically takes 5–30 minutes. Once active, the login page will be served from your custom domain with a valid HTTPS certificate.

## Email Templates

Protekt sends transactional emails for signup verification, password reset, magic links, and OTP codes. You can customize:

- **Subject line and preview text**
- **Header logo and brand color**
- **Body copy and CTA button text**
- **Footer links**

Go to **Project Settings → Emails** and click any template to edit it. A preview is shown on the right. Changes take effect immediately.

```html
<!-- Example: custom email footer -->
<p style="color: #6b7280; font-size: 12px;">
  You received this email because an account was created for {{email}} on
  <a href="https://myapp.com">My App</a>.
  If you didn't request this, you can safely ignore it.
</p>
```

## Localization

To customize button labels, placeholders, and error messages — or to translate the login page:

1. Go to **Project Settings → Localization**
2. Select a language or add a custom language
3. Edit any string in the table

Common overrides:

| Key | Default | Example Override |
|---|---|---|
| `login.title` | `Sign in` | `Welcome back` |
| `login.email_placeholder` | `Email address` | `Work email` |
| `login.submit` | `Continue` | `Sign in to Acme` |
| `signup.title` | `Create your account` | `Get started for free` |

## Using the React SDK's Pre-built Components

If you prefer not to use the hosted Universal Login page, the React SDK includes pre-built components you can embed directly in your app and style with your own CSS or Tailwind:

```jsx
import { LoginForm } from '@protekt/react';

<LoginForm
  className="my-custom-form"
  onSuccess={(user) => router.push('/dashboard')}
/>
```

For all available props, see the [LoginForm component reference](../sdks/react/components/LoginForm).

## Next Steps

- [LoginForm Component](../sdks/react/components/LoginForm): Embed and style the login form
- [Implement Social Login](./implement-social-login): Add provider buttons to the login page
- [Security Overview](../security/overview): Learn how customization interacts with Protekt's security model