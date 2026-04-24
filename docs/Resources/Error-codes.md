---
title: Error Codes
sidebar_position: 2
---

Protekt uses standardized error codes to help you quickly identify and resolve issues during authentication, session management, and API interactions. Each error includes a machine-readable code and a human-readable message.

Understanding these error codes allows you to build better error handling, display meaningful feedback to users, and debug issues efficiently in development and production.

## Error Response Format

All errors returned by Protekt follow a consistent structure:

```json
{
  "error": "invalid_credentials",
  "message": "The email or password provided is incorrect.",
  "statusCode": 401
}
```

Where:

- `error`: A unique identifier for the error type
- `message`: A human-readable explanation
- `statusCode`: The corresponding HTTP status code

## Common Error Codes

Protekt groups errors into categories based on where they occur in the authentication lifecycle. This makes it easier to quickly identify whether an issue is related to login, token handling, permissions, or system-level failures.

### Authentication Errors

These errors typically occur during login or identity verification. You should handle them gracefully in your UI and avoid exposing sensitive details.

| Code                  | Description                                           | HTTP |
| --------------------- | ----------------------------------------------------- | ---- |
| `invalid_credentials` | Incorrect email or password                           | 401  |
| `user_not_found`      | No user exists with the provided identifier           | 404  |
| `email_not_verified`  | User must verify email before login                   | 403  |
| `account_locked`      | Account temporarily locked due to suspicious activity | 423  |

### Token and Session Errors

These errors usually require re-authentication or token refresh. In most cases, enabling automatic refresh in the SDK prevents user disruption.

| Code                    | Description                         | HTTP |
| ----------------------- | ----------------------------------- | ---- |
| `invalid_token`         | Token is malformed or invalid       | 401  |
| `token_expired`         | Access token has expired            | 401  |
| `refresh_token_invalid` | Refresh token is invalid or revoked | 401  |
| `session_not_found`     | Session does not exist              | 404  |
| `session_revoked`       | Session has been revoked            | 401  |

### Authorization Errors

These errors occur when a user is authenticated but not authorized. Ensure proper role or permission checks in your application.

| Code                       | Description                     | HTTP |
| -------------------------- | ------------------------------- | ---- |
| `insufficient_permissions` | User lacks required permissions | 403  |
| `access_denied`            | Access to resource is forbidden | 403  |

### Server Errors

Implement retries and fallback mechanisms for these errors.

| Code                  | Description                     | HTTP |
| --------------------- | ------------------------------- | ---- |
| `internal_error`      | Unexpected server error         | 500  |
| `service_unavailable` | Temporary outage or maintenance | 503  |
