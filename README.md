# Account Management Frontend

A small, separate React + Vite app for **account activation, first-password setup and password reset**.
It talks only to the Account Management Backend over REST. It has no dashboards, no login and no school
data, and never touches MongoDB or the School Management Backend.

Text only (no images, icons or SVG). Plain CSS. React Router. Native `fetch`. No other libraries.

## Pages

| Route | Purpose |
|---|---|
| `/activate?token=...` | Checks the activation token with the backend, then shows the password form only if valid. Teachers and students. |
| `/setup-password?token=...` | Same flow as `/activate`. |
| `/forgot-password` | Teachers enter their email. The answer is always the same neutral message. Students are told to contact their school administrator. |
| `/reset-password?token=...` | Checks the reset token, then shows the new-password form only if valid. Explains expired/used links (students: contact administrator; teachers: link to forgot-password). |
| `/` and anything else | Short explanation / not-found page. |

After success the user gets a link to the school login page (`VITE_SCHOOL_LOGIN_URL`). Nobody is logged in here.

## Run it

```bash
npm install
cp .env.example .env     # then fill in the values
npm run dev              # http://localhost:5173
npm run build            # output in dist/
```

## Environment variables (all public in the browser: never put secrets here)

| Variable | Meaning |
|---|---|
| `VITE_ACCOUNT_API_BASE_URL` | Account Management Backend URL, no trailing slash (e.g. `http://localhost:5100`). `/api/v1` is added automatically if missing. Required. |
| `VITE_SCHOOL_LOGIN_URL` | School Management Frontend login page, shown after success. |
| `VITE_SCHOOL_NAME` | Optional name shown in the header. |

## Structure

```
src/
  components/  Layout, PasswordField, PasswordForm, PasswordFlow, TokenProblem, Notice, Loading, SchoolLoginLink
  pages/       ActivateAccount, ResetPassword, ForgotPassword, Home, NotFound
  services/    accountApi.js   <- the ONLY file that calls the backend
  hooks/       useSecureToken, useTokenCheck, usePageTitle
  config/      env.js, passwordPolicy.js
  utils/       password.js, email.js
  routes/      AppRoutes.jsx
  styles/      app.css
```

## Security behaviour

- Tokens are read from the address bar once, kept in memory only, never shown, never logged, never stored.
- Tokens and passwords are sent in POST bodies, not URLs. No cookies. Nothing in localStorage/sessionStorage.
- The token is removed from the address bar and history after success, and when a link is invalid, expired or used.
- `Referrer-Policy: no-referrer` (meta tag and `vercel.json`) and `noindex` stop tokens leaking to other sites.
- Double submissions are blocked; fields are disabled while saving.
- Server errors are never shown; users see generic text. Only password-rule messages from the backend are displayed.
- The backend alone creates, validates, expires and consumes tokens and enforces password rules.

## Deploy (for example Vercel)

1. Import this folder as a project (framework: Vite). Build command `npm run build`, output `dist`.
2. Set the environment variables above for Production.
3. `vercel.json` already provides the SPA fallback and security headers. Use HTTPS only (Vercel does this).
4. On the backend, set `ACCOUNT_MANAGEMENT_FRONTEND_URL` to this site's address (it is allowed by CORS automatically; use `CORS_EXTRA_ORIGINS` for preview domains).
5. Have the backend and school frontend build links like `https://<this-site>/activate?token=...` and `/reset-password?token=...`.

## API contract

Aligned with the Account Management Backend (`account-backend/docs/API.md`, public endpoints under `/api/v1`).
See [API_CONTRACT.md](API_CONTRACT.md) for the exact requests this app makes. All backend calls live in `src/services/accountApi.js`.
On the backend set `ACCOUNT_MANAGEMENT_FRONTEND_URL` to this site's address and keep `ACTIVATION_PATH=/activate` and
`RESET_PATH=/reset-password` (the defaults), and make sure this site's origin is allowed by CORS.
