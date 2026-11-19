# Account Management Backend: API contract used by this frontend

**Status: aligned** with `account-backend/docs/API.md`. Base URL: `VITE_ACCOUNT_API_BASE_URL` (the `/api/v1` prefix is added
automatically if missing). All requests are `POST` with `Content-Type: application/json`. Tokens and passwords travel in the
body, never in the URL. No cookies are sent (`credentials: "omit"`).

| Purpose | Path | Request body | Success response |
|---|---|---|---|
| Validate activation token | `/api/v1/activation/validate` | `{ token }` | `200 { status, data:{ valid, accountType, loginId, fullName, expiresAt } }` |
| Set first password | `/api/v1/activation/complete` | `{ token, password, confirmPassword }` | `200 { status, data:{ activated, accountType, loginId } }` |
| Request teacher reset email | `/api/v1/password/forgot` | `{ email }` | `202 { status, data:{ message } }` (same for every valid request) |
| Validate reset token | `/api/v1/password/reset/validate` | `{ token }` | same as activation validation |
| Set new password | `/api/v1/password/reset` | `{ token, password, confirmPassword }` | `200 { status, data:{ reset:true } }` |

`accountType` and `fullName` only change the wording of the page.

## Errors

Body: `{ status:"error", code, message, details?:[{ field, message }] }`. Mapped by `code` in `accountApi.js`:

| Backend code | Status | Shown as |
|---|---|---|
| `INVALID_TOKEN` | 400 | link not valid |
| `TOKEN_USED` | 400 | link already used |
| `TOKEN_EXPIRED` | 400 | link expired |
| `VALIDATION_ERROR` on field `token` (malformed token) | 400 | link not valid |
| `WEAK_PASSWORD`, other `VALIDATION_ERROR` | 400 | the backend's message and `details` are shown |
| `RATE_LIMITED` | 429 | too many attempts |
| `INTERNAL_ERROR` / any 5xx | 5xx | generic text |

## Password policy (enforced by the backend, mirrored in the form)

8 to 72 bytes, at least one letter and one number; the backend also rejects very common passwords and passwords built from the
person's name or login ID (its message is displayed).

## Links created by the backend

- Activation: `<ACCOUNT_MANAGEMENT_FRONTEND_URL>/activate?token=<token>`
- Reset: `<ACCOUNT_MANAGEMENT_FRONTEND_URL>/reset-password?token=<token>`

Both routes exist in this app. The backend alone creates, expires and consumes tokens.
