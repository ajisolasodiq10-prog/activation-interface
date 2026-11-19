import { useState } from "react";

// Password input with a Show/Hide button. Never stores or logs the value.
export default function PasswordField({ id, label, value, onChange, error, hintId, autoComplete, disabled, inputRef }) {
  const [visible, setVisible] = useState(false);
  const describedBy = [error ? `${id}-error` : "", hintId || ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="password-wrap">
        <input
          id={id}
          ref={inputRef}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy}
        />
        <button type="button" className="toggle" onClick={() => setVisible((v) => !v)} aria-pressed={visible} aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} disabled={disabled}>
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}
