// ===========================================================================
// ACCOUNT MANAGEMENT BACKEND: API SERVICE
//
// This is the only file that talks to the backend. Pages call the five
// functions at the bottom and never see fetch, URLs or raw errors.
//
// Contract: account-backend/docs/API.md (public endpoints under /api/v1).
//
// Security notes:
// - Tokens and passwords are sent in the JSON body of POST requests, never in
//   the URL, so they do not end up in server or proxy logs.
// - Nothing here logs, stores or caches a token or password.
// ===========================================================================
import { ACCOUNT_API_BASE_URL } from "../config/env.js";

// Paths are relative to ACCOUNT_API_BASE_URL, which already ends in /api/v1 (all POST, JSON).
export const ENDPOINTS = {
  validateActivation: "/activation/validate", //     body: { token }
  completeActivation: "/activation/complete", //     body: { token, password, confirmPassword }
  requestPasswordReset: "/password/forgot", //       body: { email }
  validateReset: "/password/reset/validate", //      body: { token }
  completeReset: "/password/reset", //               body: { token, password, confirmPassword }
};

const TIMEOUT_MS = 15000;

// What went wrong, in terms the pages can act on.
export const FAILURE = {
  CONFIG: "config",
  NETWORK: "network",
  SERVER: "server",
  TOKEN_INVALID: "token_invalid",
  TOKEN_EXPIRED: "token_expired",
  TOKEN_USED: "token_used",
  VALIDATION: "validation",
  RATE_LIMITED: "rate_limited",
  UNKNOWN: "unknown",
};

export class AccountApiError extends Error {
  constructor(kind, message, details = []) {
    super(message);
    this.name = "AccountApiError";
    this.kind = kind;
    this.details = details; // safe, user-readable validation messages from the backend
  }
}

const SAFE_MESSAGES = {
  [FAILURE.CONFIG]: "This page is not set up correctly yet. Please contact your school administrator.",
  [FAILURE.NETWORK]: "We could not reach the server. Check your internet connection and try again.",
  [FAILURE.SERVER]: "Something went wrong on our side. Please try again in a few minutes.",
  [FAILURE.TOKEN_INVALID]: "This link is not valid.",
  [FAILURE.TOKEN_EXPIRED]: "This link has expired.",
  [FAILURE.TOKEN_USED]: "This link has already been used.",
  [FAILURE.VALIDATION]: "Please check what you entered and try again.",
  [FAILURE.RATE_LIMITED]: "Too many attempts. Please wait a few minutes and try again.",
  [FAILURE.UNKNOWN]: "Something went wrong. Please try again.",
};

// Works out the failure kind from the backend's error code (see API.md), then the HTTP status.
const CODE_KIND = {
  TOKEN_EXPIRED: FAILURE.TOKEN_EXPIRED,
  TOKEN_USED: FAILURE.TOKEN_USED,
  INVALID_TOKEN: FAILURE.TOKEN_INVALID,
  VALIDATION_ERROR: FAILURE.VALIDATION,
  WEAK_PASSWORD: FAILURE.VALIDATION,
  INVALID_JSON: FAILURE.VALIDATION,
  RATE_LIMITED: FAILURE.RATE_LIMITED,
  PAYLOAD_TOO_LARGE: FAILURE.VALIDATION,
  INTERNAL_ERROR: FAILURE.SERVER,
};

function classify(status, code = "", details) {
  // A malformed token is rejected by validation before it is looked up: treat it as an invalid link.
  if (code === "VALIDATION_ERROR" && Array.isArray(details) && details.some((d) => d?.field === "token")) return FAILURE.TOKEN_INVALID;
  if (CODE_KIND[code]) return CODE_KIND[code];
  if (status === 429) return FAILURE.RATE_LIMITED;
  if (status >= 500) return FAILURE.SERVER;
  if (status === 400 || status === 422) return FAILURE.VALIDATION;
  if (status === 401 || status === 403 || status === 404) return FAILURE.TOKEN_INVALID;
  return FAILURE.UNKNOWN;
}

async function post(path, body, { signal } = {}) {
  if (!ACCOUNT_API_BASE_URL) throw new AccountApiError(FAILURE.CONFIG, SAFE_MESSAGES[FAILURE.CONFIG]);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  if (signal) signal.addEventListener("abort", () => controller.abort(), { once: true });

  let response;
  try {
    response = await fetch(`${ACCOUNT_API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      credentials: "omit", // no cookies: this app never signs anyone in
      cache: "no-store",
      referrerPolicy: "no-referrer",
      signal: controller.signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new AccountApiError(FAILURE.NETWORK, SAFE_MESSAGES[FAILURE.NETWORK]);
  } finally {
    clearTimeout(timer);
  }

  let payload = null;
  try { payload = await response.json(); } catch { payload = null; }

  if (!response.ok) {
    const kind = classify(response.status, payload?.code, payload?.details);
    // Only validation messages are shown from the backend; everything else uses safe text.
    const details = kind === FAILURE.VALIDATION && Array.isArray(payload?.details)
      ? payload.details.map((d) => (typeof d === "string" ? d : d?.message)).filter(Boolean).slice(0, 6)
      : [];
    const message = kind === FAILURE.VALIDATION && typeof payload?.message === "string" && payload.message.length < 200
      ? payload.message
      : SAFE_MESSAGES[kind];
    throw new AccountApiError(kind, message, details);
  }
  if (payload === null) throw new AccountApiError(FAILURE.UNKNOWN, SAFE_MESSAGES[FAILURE.UNKNOWN]);
  return payload;
}

// Token check response: { valid, accountType, loginId, fullName, expiresAt }.
// accountType ("teacher" | "student") and fullName only change the wording of the page.
function readTokenInfo(payload) {
  const data = payload?.data ?? {};
  if (data.valid === false) throw new AccountApiError(FAILURE.TOKEN_INVALID, SAFE_MESSAGES[FAILURE.TOKEN_INVALID]);
  const role = String(data.accountType ?? "").toLowerCase();
  const name = data.fullName ?? "";
  return { role: role === "teacher" || role === "student" ? role : "", name: typeof name === "string" ? name.slice(0, 80) : "" };
}

// ---- The five operations ----------------------------------------------------

export const validateActivationToken = (token, options) => post(ENDPOINTS.validateActivation, { token }, options).then(readTokenInfo);
export const completeActivation = (token, password, confirmPassword, options) =>
  post(ENDPOINTS.completeActivation, { token, password, confirmPassword }, options).then(() => ({ ok: true }));
export const validateResetToken = (token, options) => post(ENDPOINTS.validateReset, { token }, options).then(readTokenInfo);
export const completeReset = (token, password, confirmPassword, options) =>
  post(ENDPOINTS.completeReset, { token, password, confirmPassword }, options).then(() => ({ ok: true }));

// Teacher recovery. The backend answers 202 for every valid request, registered or not.
export async function requestPasswordReset(email, options) {
  await post(ENDPOINTS.requestPasswordReset, { email: email.trim() }, options);
  return { ok: true };
}
