// ===========================================================================
// PASSWORD POLICY: mirrors the Account Management Backend (src/utils/passwordPolicy.js).
// 8 to 72 bytes, at least one letter and one number. The backend also rejects very common passwords
// and passwords containing the person's own name or login ID; its message is shown if that happens.
// ===========================================================================
export const PASSWORD_POLICY = {
  minLength: 8,
  maxBytes: 72,
};
