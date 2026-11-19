import { PASSWORD_POLICY } from "../config/passwordPolicy.js";

// Checks that can be done in the browser. The backend makes the final decision.
export function validatePasswords(password, confirm) {
  const errors = {};
  if (!password) errors.password = "Enter a new password.";
  else if (password.length < PASSWORD_POLICY.minLength) errors.password = `Use at least ${PASSWORD_POLICY.minLength} characters.`;
  else if (new TextEncoder().encode(password).length > PASSWORD_POLICY.maxBytes) errors.password = `Use no more than ${PASSWORD_POLICY.maxBytes} characters.`;
  else if (!/[A-Za-z]/.test(password)) errors.password = "Include at least one letter.";
  else if (!/[0-9]/.test(password)) errors.password = "Include at least one number.";
  if (!confirm) errors.confirm = "Type the new password again to confirm it.";
  else if (password && confirm !== password) errors.confirm = "The two passwords do not match.";
  return errors;
}

// Guidance only (not a security rule): helps people choose a stronger password.
export function passwordStrength(password) {
  if (!password) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= PASSWORD_POLICY.minLength) score += 1;
  if (password.length >= PASSWORD_POLICY.minLength + 4) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const level = score <= 1 ? 1 : score <= 3 ? 2 : 3;
  return { level, label: ["", "Weak", "Fair", "Strong"][level] };
}
