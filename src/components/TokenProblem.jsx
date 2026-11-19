import { Link } from "react-router-dom";
import Notice from "./Notice.jsx";
import { FAILURE } from "../services/accountApi.js";

const TITLES = {
  [FAILURE.TOKEN_EXPIRED]: "This link has expired",
  [FAILURE.TOKEN_USED]: "This link has already been used",
  [FAILURE.TOKEN_INVALID]: "This link is not valid",
  [FAILURE.NETWORK]: "We could not reach the server",
  [FAILURE.SERVER]: "Something went wrong",
  [FAILURE.CONFIG]: "This page is not ready yet",
  [FAILURE.RATE_LIMITED]: "Too many attempts",
};

// Explains why a link cannot be used and what to do next.
// purpose: "activate" | "reset"
export default function TokenProblem({ failure, purpose, missing, onRetry }) {
  const temporary = failure === FAILURE.NETWORK || failure === FAILURE.SERVER || failure === FAILURE.RATE_LIMITED;
  const title = missing ? "This link is incomplete" : TITLES[failure] || "This link cannot be used";

  if (failure === FAILURE.CONFIG) {
    return <Notice tone="error" title={title}><p>This page is not set up correctly yet. Please contact your school administrator.</p></Notice>;
  }

  if (temporary) {
    return (
      <>
        <Notice tone="error" title={title}>
          <p>{failure === FAILURE.NETWORK ? "Check your internet connection and try again." : failure === FAILURE.RATE_LIMITED ? "Please wait a few minutes and try again." : "Please try again in a few minutes."}</p>
        </Notice>
        {onRetry && <button type="button" className="btn btn-primary" onClick={onRetry}>Try again</button>}
      </>
    );
  }

  return (
    <>
      <Notice tone="error" title={title}>
        <p>
          {missing
            ? "The link you opened is missing part of its address. Open the full link you were sent, or ask for a new one."
            : failure === FAILURE.TOKEN_USED
              ? "A link can only be used once. If you have already set your password, you can sign in. If not, you need a new link."
              : "You need a new link to continue."}
        </p>
      </Notice>
      <div className="help">
        <p className="help-title">What to do next</p>
        {purpose === "activate" ? (
          <p>Ask your school administrator to send you a new activation link.</p>
        ) : (
          <ul>
            <li><strong>Students:</strong> contact your school administrator to request another reset link.</li>
            <li><strong>Teachers:</strong> <Link to="/forgot-password">request a new reset link</Link>.</li>
          </ul>
        )}
      </div>
    </>
  );
}
