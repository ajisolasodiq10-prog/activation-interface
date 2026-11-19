import { useRef, useState } from "react";
import PasswordField from "./PasswordField.jsx";
import Notice from "./Notice.jsx";
import { PASSWORD_POLICY } from "../config/passwordPolicy.js";
import { passwordStrength, validatePasswords } from "../utils/password.js";
import { AccountApiError, FAILURE } from "../services/accountApi.js";

// New password + confirm password, used by both activation and reset.
// onSubmit(password, confirmPassword) must return a promise. Token failures are passed to onTokenFailure.
export default function PasswordForm({ submitLabel, workingLabel = "Saving...", onSubmit, onTokenFailure }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const strength = passwordStrength(password);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy.current) return; // ignore repeated submissions
    const found = validatePasswords(password, confirm);
    setErrors(found);
    setFormError(null);
    if (found.password) { passwordRef.current?.focus(); return; }
    if (found.confirm) { confirmRef.current?.focus(); return; }

    busy.current = true;
    setSubmitting(true);
    try {
      await onSubmit(password, confirm);
      setPassword("");
      setConfirm("");
    } catch (error) {
      const kind = error instanceof AccountApiError ? error.kind : FAILURE.UNKNOWN;
      if (kind === FAILURE.TOKEN_INVALID || kind === FAILURE.TOKEN_EXPIRED || kind === FAILURE.TOKEN_USED) {
        setPassword(""); setConfirm("");
        onTokenFailure(kind);
      } else {
        setFormError({ message: error.message, details: error.details || [] });
        passwordRef.current?.focus();
      }
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      {formError && (
        <Notice tone="error" title="Your password was not saved">
          <p>{formError.message}</p>
          {formError.details.length > 0 && <ul>{formError.details.map((d) => <li key={d}>{d}</li>)}</ul>}
        </Notice>
      )}

      <div className="requirements" id="pw-requirements">
        <p className="requirements-title">Password requirements</p>
        <ul>
          <li>At least {PASSWORD_POLICY.minLength} characters (no more than {PASSWORD_POLICY.maxBytes}).</li>
          <li>At least one letter and one number.</li>
          <li>Not a common password, and not your name or login ID.</li>
          <li>The two passwords must match.</li>
        </ul>
        <p className="muted">If the system needs anything more, it will tell you.</p>
      </div>

      <PasswordField id="pw-new" label="New password" value={password} onChange={setPassword} error={errors.password}
        hintId="pw-requirements" autoComplete="new-password" disabled={submitting} inputRef={passwordRef} />
      {password && (
        <p className={`strength strength-${strength.level}`} aria-live="polite">
          Password strength (guidance only): <strong>{strength.label}</strong>. Longer passwords that mix letters, numbers and symbols are harder to guess.
        </p>
      )}
      <PasswordField id="pw-confirm" label="Confirm new password" value={confirm} onChange={setConfirm} error={errors.confirm}
        autoComplete="new-password" disabled={submitting} inputRef={confirmRef} />

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? workingLabel : submitLabel}
      </button>
    </form>
  );
}
