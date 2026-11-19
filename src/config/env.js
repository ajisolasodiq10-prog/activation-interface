// Central place for configuration read from Vite environment variables.
// These values are PUBLIC (they are bundled into the browser code).
const clean = (value) => String(value ?? "").trim();

// The backend serves its browser endpoints under /api/v1. Either the host alone
// (https://accounts.example.com) or the full base (https://accounts.example.com/api/v1) works.
const rawAccountBase = clean(import.meta.env?.VITE_ACCOUNT_API_BASE_URL).replace(/\/+$/, "");
export const ACCOUNT_API_BASE_URL = rawAccountBase && !/\/api\/v1$/i.test(rawAccountBase) ? `${rawAccountBase}/api/v1` : rawAccountBase;
export const SCHOOL_LOGIN_URL = clean(import.meta.env?.VITE_SCHOOL_LOGIN_URL);
export const SCHOOL_NAME = clean(import.meta.env?.VITE_SCHOOL_NAME);

// Only http(s) login URLs are used as links.
export const schoolLoginHref = /^https?:\/\//i.test(SCHOOL_LOGIN_URL) ? SCHOOL_LOGIN_URL : "";
