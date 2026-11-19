import { useRef, useState } from "react";
import Layout from "../components/Layout.jsx";
import Notice from "../components/Notice.jsx";
import usePageTitle from "../hooks/usePageTitle.js";
import { AccountApiError, requestPasswordReset } from "../services/accountApi.js";
import { isValidEmail } from "../utils/email.js";

// /forgot-password  (teachers only; students ask their school administrator)
export default function ForgotPassword() {
  usePageTitle("Forgot password");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const inputRef = useRef(null);

  const submit = async (event) => {
    event.preventDefault();
    if (busy.current) return;
    if (!email.trim()) { setError("Enter your email address."); inputRef.current?.focus(); return; }
    if (!isValidEmail(email)) { setError("Enter a valid email address, such as name@example.com."); inputRef.current?.focus(); return; }
    setError("");
    busy.current = true; setSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSent(true); // the same message is shown whether or not the email is registered
    } catch (err) {
      setError(err instanceof AccountApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      busy.current = false; setSubmitting(false);
    }
  };

  return (
    <Layout>
      <h1>Forgot your password?</h1>
      {sent ? (
        <>
          <Notice tone="success" title="Check your email">
            <p>If that email address is registered with the school, we have sent instructions for choosing a new password. Check your inbox and your spam folder.</p>
          </Notice>
          <p className="muted">The link in the email can only be used once and expires after a short time.</p>
        </>
      ) : (
        <>
          <p>Teachers: enter the email address registered with your school and we will email you a link to choose a new password.</p>
          <form onSubmit={submit} noValidate aria-busy={submitting}>
            {error && <Notice tone="error"><p>{error}</p></Notice>}
            <div className="field">
              <label htmlFor="fp-email">Email address</label>
              <input id="fp-email" ref={inputRef} type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                disabled={submitting} aria-invalid={error ? "true" : "false"} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Sending..." : "Send reset link"}</button>
          </form>
        </>
      )}
      <div className="help">
        <p className="help-title">Are you a student?</p>
        <p>Students do not reset passwords by email. If you forgot your password, contact your school administrator, who can send you a new link.</p>
      </div>
    </Layout>
  );
}
